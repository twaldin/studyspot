import { Anthropic } from '@llamaindex/anthropic';
import { FunctionTool } from '@/lib/utils/llamaindex-imports';
import type { ChatMessage, MessageType } from '@/lib/utils/llamaindex-imports';
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/lib/types/database';
import logger from '@/lib/utils/logger';
import { AssistantResponse, AssistantResponseSchema } from './assistant.types';
import { DEFAULT_MESSAGES } from '@/lib/utils/constants';
import { QueryService, ReformulationResponse } from './services/query.service';
import { RetrievalService, RetrievedDocument, type RetrievalResult } from './services/retrieval.service';
import { ToolManager } from './tools/tool-manager';
import { StreamingAgentService } from './streaming-agent.service';

/**
 * Returns a formatted string of the current date and time in the specified or UTC timezone.
 *
 * The output is in the format: "It is currently 3:45pm on June 5, 2025."
 *
 * @param timeZone - Optional IANA timezone identifier (e.g., "America/New_York"). Defaults to "UTC" if not provided.
 * @returns A human-readable string representing the current date and time in the chosen timezone.
 */
function getFormattedDate(timeZone?: string): string {
  const now = new Date();
  const timeZoneToUse = timeZone || 'UTC';
  const timeString = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
    timeZone: timeZoneToUse
  }).format(now).replace(' ', '').toLowerCase();
  const dateString = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: timeZoneToUse
  }).format(now);
  return `It is currently ${timeString} on ${dateString}.`;
}

// Re-export types from services for backward compatibility
export type { ReformulationResponse } from './services/query.service';
export type { RetrievedDocument, RetrievalResult } from './services/retrieval.service';

// Claude model with tools support
const claudeModel = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
  model: 'claude-3-7-sonnet-latest',
});

// Result type for RAG operations - now using the service types
type RAGResult = RetrievalResult;

/**
 * Generates a structured assistant response by orchestrating question reformulation, document retrieval, and LLM interaction.
 *
 * Reformulates the user's question, determines if retrieval-augmented generation (RAG) is needed, fetches relevant documents if applicable, constructs a system prompt with course context, and queries the selected LLM model. The response is parsed and validated to ensure it conforms to the expected JSON structure, including markdown and LaTeX formatting for math. Returns a fallback error message if parsing fails.
 *
 * @param originalQuestion - The user's original question.
 * @param conversationHistory - The conversation history to provide context for the response.
 * @param courseId - Optional course identifier for targeted document retrieval and prompt context.
 * @param timeZone - Optional timezone string for date formatting in the system prompt.
 * @returns A structured assistant response containing the answer and any linked document IDs.
 */
export async function getFullRagResponse(
  supabase: SupabaseClient<Database>,
  originalQuestion: string,
  conversationHistory: ChatMessage[], // These are LlamaIndex ChatMessage
  courseId?: string,
  timeZone?: string
): Promise<AssistantResponse> {
  // 1. Reformulate question and decide if RAG is needed using QueryService
  const reformulationResult = await QueryService.reformulateQuestion(originalQuestion, conversationHistory, timeZone);
  const { ragNeeded, question: reformulatedQuestion } = reformulationResult;
  logger.info({ question: reformulatedQuestion }, "[RAGService - getFullRagResponse] Using Claude with tools for query.");
  
  // Initialize tool manager
  const toolManager = new ToolManager(supabase);

  // 2. Process query with RAG to get relevant documents (if needed) using RetrievalService
  let retrievedDocuments: RetrievedDocument[] = [];
  if (ragNeeded) {
    let ragRawResults;
    if (courseId) {
      // A courseId is required to perform the document search
      ragRawResults = await RetrievalService.retrieveDocuments(supabase, reformulatedQuestion, courseId);
    } else {
      // If no courseId is provided, we cannot perform a targeted RAG search
      logger.info("[RAGService - getFullRagResponse] RAG needed but no courseId was provided, skipping RAG process.");
      ragRawResults = null; // Ensure ragRawResults is null so we don't try to process it
    }

    if (ragRawResults && Array.isArray(ragRawResults)) {
      retrievedDocuments = ragRawResults;
      logger.info({ num_documents: retrievedDocuments.length, document_ids: retrievedDocuments.map(d => d.id || d.doc_id) }, "[RAGService - getFullRagResponse] Documents retrieved for RAG.");
    } else if (ragRawResults && 'error' in ragRawResults) {
      logger.warn({ error: ragRawResults.error, question: reformulatedQuestion }, "[RAGService - getFullRagResponse] Error retrieving documents, proceeding without them.");
    } else {
      logger.info({ question: reformulatedQuestion }, "[RAGService - getFullRagResponse] No documents found or unexpected result from RAG process, proceeding without them.");
    }
  }

  // 3. Construct messages for the LLM
  const llmMessages: ChatMessage[] = [];

  // Fetch course details for the system prompt
  let courseDetailsText = "a college course";
  if (courseId) {
    const { data: course, error } = await supabase
      .from('courses')
      .select('code, title')
      .eq('id', courseId)
      .single();

    if (error) {
      logger.warn({ error, courseId }, "[RAGService - getFullRagResponse] Could not fetch course details for system prompt.");
    } else if (course) {
      courseDetailsText = `${course.code} - ${course.title}`;
    }
  }

  // SYSTEM PROMPT with tool usage instructions
  const responseFormatSample = {
    message: "The assistant's response to the user.",
    linkedDocumentIds: ["example_doc_uuid_1", "example_doc_uuid_2"]
  };
  const currentDate = getFormattedDate(timeZone);
  const systemPrompt = `You are a helpful assistant for a college student taking ${courseDetailsText}. Your goal is to provide accurate and concise answers based on the provided context and conversation history. ${currentDate}

You have access to a tool called 'get_full_document' that allows you to retrieve the complete content of any document when you need more context beyond the provided chunks. Use this tool when:
- The chunk content is insufficient to fully answer the user's question
- You need to see the complete document structure or context
- The user is asking about specific details that might be elsewhere in the document

Your response MUST be in a structured JSON format. The JSON object should conform to the following example:
\`\`\`json
${JSON.stringify(responseFormatSample, null, 2)}
\`\`\`

- 'message': This is your conversational response to the user. It should be formatted using markdown where appropriate.
  - IMPORTANT: ALL mathematical expressions MUST be formatted using LaTeX:
    - Use $...$ for inline math (e.g., $x^2 + y^2 = z^2$)
    - Use $$...$$ for display math (e.g., $$\\int_0^\\infty e^{-x^2} dx = \\frac{\\sqrt{\\pi}}{2}$$)
    - Always use proper LaTeX commands (e.g., \\frac, \\int, \\sum, etc.)
    - Never use plain text for mathematical notation
- 'linkedDocumentIds': This is an optional array of document IDs (UUIDs) from the provided context that you used to formulate your answer. Only include IDs for documents that are directly relevant and cited in your response. If no documents are relevant, you can omit this field or provide an empty array.

Use the provided pieces of context (if any) and conversation history to respond to the user's message. The document IDs ('Doc ID') in the context are for internal system use; use them for the 'linkedDocumentIds' field but do not include them in your 'message' response. Prioritize conciseness and accuracy. Keep responses short if possible.`;

  llmMessages.push({ role: 'system', content: systemPrompt } as ChatMessage);

  // Add conversation history
  llmMessages.push(...conversationHistory);

  // Augment the original user question with retrieved document context for Claude
  let finalUserMessage: string;
  if (retrievedDocuments.length > 0) {
    const contextHeader = "\n\n--- Relevant Context from Documents Start ---";
    const documentsContext = retrievedDocuments.map(doc => `Doc ID: ${doc.doc_id}\nContent: ${doc.content}`).join("\n---\n"); // Each doc.content on new line, separated
    const contextFooter = "\n--- Relevant Context from Documents End ---";

    // Structure the final prompt clearly for the LLM, using the ORIGINAL question
    finalUserMessage = `User message: "${originalQuestion}"\n\nIf helpful, use the following context to help respond to the user's message:${contextHeader}\n${documentsContext}\n${contextFooter}\n\nPlease provide your response in the required JSON format.`;
  } else {
    finalUserMessage = `User message: "${originalQuestion}"\n\nPlease provide your response in the required JSON format.`;
  }
  llmMessages.push({ role: 'user', content: finalUserMessage } as ChatMessage);

  logger.debug({ messages: llmMessages, toolCount: toolManager.getTools().length }, "[RAGService - getFullRagResponse] Full LLM messages before sending to Claude with tools.");

  // Use Claude with tools
  const llmResponse = await claudeModel.chat({ 
    messages: llmMessages,
    tools: toolManager.getTools()
  });

  // Track document IDs accessed via tools
  let usedDocumentIds = new Set<string>();
  
  // Handle tool calls if present in the response
  // Note: Tool calls are handled automatically by LlamaIndex's claude model
  // The tools will be executed during the chat call above
  // For now, we'll track document IDs from the initial RAG retrieval
  // Future enhancement: implement tool call tracking when LlamaIndex exposes tool call details

  let structuredOutput: AssistantResponse;

  try {
    const rawContent = llmResponse.message.content;
    let jsonString: string;

    if (typeof rawContent === 'string') {
      jsonString = rawContent;
    } else if (Array.isArray(rawContent) && rawContent.length > 0 && "text" in rawContent[0]) {
      jsonString = rawContent[0].text;
    } else {
      throw new Error("Unexpected LLM response content structure.");
    }

    // Claude/Gemini/OpenAI might wrap the JSON in ```json ... ```, so we need to extract it.
    const jsonMatch = jsonString.match(/```json\n([\s\S]*?)\n```/);
    if (jsonMatch && jsonMatch[1]) {
      jsonString = jsonMatch[1];
    }

    const parsedJson = JSON.parse(jsonString);
    structuredOutput = AssistantResponseSchema.parse(parsedJson);

  } catch (error) {
    logger.error({
      error,
      rawResponse: llmResponse?.message?.content
    }, "[RAGService - getFullRagResponse] Failed to parse structured JSON response from LLM. Returning a fallback response.");

    // Fallback in case of parsing error
    structuredOutput = {
      message: DEFAULT_MESSAGES.ERROR_FALLBACK,
      linkedDocumentIds: []
    };
  }

  // For now, use initially retrieved documents
  // Tool-accessed documents will be tracked in future enhancement
  const allDocumentIds = retrievedDocuments.map(doc => doc.doc_id);

  // Update the structured output with complete document IDs
  structuredOutput.linkedDocumentIds = allDocumentIds.length > 0 ? allDocumentIds : [];

  return structuredOutput;
}

// Prompt override types (matching the schema from stream.ts)
interface PromptOverrides {
  systemPrompt?: string;
  ragDecisionPrompt?: string;
  queryReformulationPrompt?: string;
  toolDescription?: string;
  contextFormatting?: {
    useHeaders?: boolean;
    headerText?: string;
    footerText?: string;
    includeDocumentIds?: boolean;
    documentSeparator?: string;
  };
  responseFormat?: {
    requireJSON?: boolean;
    includeLinkedDocumentIds?: boolean;
    encourageConciseness?: boolean;
    maxResponseLength?: number;
  };
  mathFormatting?: 'latex' | 'plain' | 'markdown';
  personality?: {
    tone?: 'helpful' | 'professional' | 'casual' | 'academic';
    verbosity?: 'concise' | 'balanced' | 'detailed';
    formality?: 'formal' | 'informal' | 'neutral';
  };
}

// Streaming version with tool calling support using StreamingAgentService
export async function* getFullRagResponseStream(
  supabase: SupabaseClient<Database>,
  originalQuestion: string,
  conversationHistory: ChatMessage[], // These are LlamaIndex ChatMessage
  courseId?: string,
  timeZone?: string,
  promptOverrides?: PromptOverrides
): AsyncGenerator<{ chunk?: string; linkedDocumentIds?: string[]; done?: boolean; error?: string }> {
  try {
    logger.info({ question: originalQuestion }, "[RAGService - getFullRagResponseStream] Using StreamingAgentService for RAG with tools.");
    
    // Use the new streaming agent service that supports tool calling
    const streamingAgent = new StreamingAgentService(supabase);
    
    // Log prompt override usage
    if (promptOverrides) {
      logger.info({ 
        overrideKeys: Object.keys(promptOverrides),
        question: originalQuestion.substring(0, 100)
      }, "[RAGService - getFullRagResponseStream] Using prompt overrides");
    }
    
    for await (const response of streamingAgent.executeRAGWithTools(
      originalQuestion,
      conversationHistory,
      courseId,
      timeZone,
      promptOverrides
    )) {
      if (response.error) {
        yield { error: response.error };
        return;
      } else if (response.chunk) {
        yield { chunk: response.chunk };
      } else if (response.done) {
        yield {
          done: true,
          linkedDocumentIds: response.linkedDocumentIds
        };
        return;
      } else if (response.toolCall) {
        // Log tool calls for debugging
        logger.info({ 
          toolName: response.toolCall.name,
          toolId: response.toolCall.id 
        }, '[RAGService - getFullRagResponseStream] Tool call executed');
      } else if (response.toolResult) {
        // Log tool results for debugging
        logger.info({ 
          toolId: response.toolResult.id,
          success: response.toolResult.result?.success 
        }, '[RAGService - getFullRagResponseStream] Tool result received');
      }
    }

  } catch (error) {
    logger.error({
      error,
      originalQuestion
    }, "[RAGService - getFullRagResponseStream] Error during streaming RAG response.");

    yield {
      error: error instanceof Error ? error.message : 'An unexpected error occurred during streaming'
    };
  }
}

// Legacy functions now delegated to services for backward compatibility

/**
 * Retrieves relevant documents for a given question and course using retrieval-augmented generation.
 *
 * @returns The retrieval result containing documents relevant to the query.
 */
export async function processQueryWithRAG(supabase: SupabaseClient<Database>, question: string, courseId: string): Promise<RAGResult> {
  return RetrievalService.retrieveDocuments(supabase, question, courseId);
}

/**
 * Reformulates a user's question based on the conversation history and optional timezone context.
 *
 * Returns a structured response indicating the reformulated question and whether retrieval-augmented generation (RAG) is needed.
 *
 * @returns An object containing the reformulated question, RAG requirement, and selected model information.
 */
export async function reformulateQuestion(
  question: string,
  conversation: ChatMessage[],
  timeZone?: string
): Promise<ReformulationResponse> {
  return QueryService.reformulateQuestion(question, conversation, timeZone);
}

/**
 * Performs a Retrieval-Augmented Generation (RAG) workflow with course access validation.
 *
 * Validates that the user has access to the specified course, retrieves relevant documents, and generates an assistant answer using RAG. Optionally includes truncated source document information in the result.
 *
 * @param question - The user's input question to be answered.
 * @param courseId - The unique identifier of the course to retrieve context from.
 * @param includeSources - Whether to include truncated source document details in the response (default: true).
 * @returns An object containing the generated answer and, if requested, an array of source document summaries.
 * @throws If course access validation fails or document retrieval encounters an error.
 */
export async function performRAG(
  supabase: SupabaseClient<Database>,
  question: string,
  courseId: string,
  includeSources: boolean = true
): Promise<{
  answer: string;
  sources?: Array<{
    id: string;
    content: string;
    chunkCount: number;
    docId: string;
  }>;
}> {
  logger.info({ question: question.substring(0, 100), courseId }, "[RAG] Starting RAG query");

  try {
    // 1. Validate that the course exists and user has access (RLS will handle this)
    const { data: course, error } = await supabase
      .from('courses')
      .select('id, title')
      .eq('id', courseId)
      .single();

    if (error) {
      logger.error({ error, courseId }, "[RAG] Error validating course access");
      throw new Error(`Course access validation failed: ${error.message}`);
    }

    if (!course) {
      logger.warn({ courseId }, "[RAG] Course not found or user doesn't have access");
      throw new Error("Course not found or you don't have access to it");
    }

    logger.info({ courseId, courseTitle: course.title }, "[RAG] Course access validated");

    // 2. Process the query with RAG using RetrievalService
    const ragResult = await RetrievalService.retrieveDocuments(supabase, question, courseId);

    if ('error' in ragResult) {
      throw new Error(ragResult.error);
    }

    // 3. Generate response using the retrieved documents
    const response = await getFullRagResponse(supabase, question, [], courseId);

    // 4. Format sources if requested
    let sources;
    if (includeSources && ragResult.length > 0) {
      sources = ragResult.map(doc => ({
        id: doc.id || doc.doc_id,
        content: doc.content.substring(0, 500), // Truncate for brevity
        chunkCount: 1,
        docId: doc.doc_id
      }));
    }

    return {
      answer: response.message,
      sources
    };
  } catch (error) {
    logger.error({ error }, "[RAG] Error during RAG process");
    throw error;
  }
}