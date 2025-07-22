export interface PromptConfig {
  id: string;
  name: string;
  description: string;
  version: string;
  createdAt: Date;
  updatedAt: Date;
  systemPrompt: string;
  ragDecisionPrompt: string;
  queryReformulationPrompt: string;
  toolDescription: string;
  contextFormatting: ContextFormattingConfig;
  responseFormat: ResponseFormatConfig;
  mathFormatting: 'latex' | 'plain' | 'markdown';
  personality: PersonalityConfig;
}

export interface ContextFormattingConfig {
  useHeaders: boolean;
  headerText: string;
  footerText: string;
  includeDocumentIds: boolean;
  documentSeparator: string;
}

export interface ResponseFormatConfig {
  requireJSON: boolean;
  includeLinkedDocumentIds: boolean;
  encourageConciseness: boolean;
  maxResponseLength?: number;
}

export interface PersonalityConfig {
  tone: 'helpful' | 'professional' | 'casual' | 'academic';
  verbosity: 'concise' | 'balanced' | 'detailed';
  formality: 'formal' | 'informal' | 'neutral';
}

export interface PromptConfigTemplate {
  name: string;
  description: string;
  config: Omit<PromptConfig, 'id' | 'createdAt' | 'updatedAt'>;
}

// Default configuration based on current Assistant API prompts
export const DEFAULT_PROMPT_CONFIG: Omit<PromptConfig, 'id' | 'createdAt' | 'updatedAt'> = {
  name: 'Current StudySpot Default',
  description: 'The current prompt configuration used in the StudySpot Assistant API',
  version: '1.0.0',
  systemPrompt: `You are a helpful assistant for a college student taking {courseDetails}. Your goal is to provide accurate and concise answers based on the provided context and conversation history. {currentDate}

You have access to a tool called 'get_full_document' that allows you to retrieve the complete content of any document when you need more context beyond the provided chunks. Use this tool when:
- The chunk content is insufficient to fully answer the user's question
- You need to see the complete document structure or context
- The user is asking about specific details that might be elsewhere in the document

Respond directly to the user in natural language using markdown formatting where appropriate. When referring to provided context documents, do not mention the "Doc ID" as it is for internal system use only. Be concise and accurate.

IMPORTANT: ALL mathematical expressions MUST be formatted using LaTeX:
- Use $...$ for inline math (e.g., $x^2 + y^2 = z^2$)
- Use $$...$$ for display math (e.g., $$\\int_0^\\infty e^{-x^2} dx = \\frac{\\sqrt{\\pi}}{2}$$)
- Always use proper LaTeX commands (e.g., \\frac, \\int, \\sum, etc.)
- Never use plain text for mathematical notation`,

  ragDecisionPrompt: `You are an intelligent assistant that analyzes user queries to decide if a search in a knowledge base is necessary (Retrieval-Augmented Generation).
{currentDate}. Use this information to resolve relative time references in the user's query (e.g., "this week", "on Tuesday").

Based on the conversation history and the latest user message, you will decide whether to perform a RAG search.
- RAG is NOT needed for simple greetings, generic chat, or if the conversation history contains enough information to answer.
- RAG IS needed for questions requiring specific details from documents (e.g., "course syllabus", "assignment details").

Your response MUST be a JSON object conforming to this structure:
{responseFormat}

- "ragNeeded": A boolean. "true" if RAG is needed, "false" otherwise.
- "question": If "ragNeeded" is true, this must be a standalone question that can be understood without the chat history. If "ragNeeded" is false, this should be the original user question.
- "search_query": If "ragNeeded" is true, this must be a descriptive text summary of the information needed to retrieve the best query results. This is used for the vector search. If "ragNeeded" is false, this should be an empty string.

Do NOT answer the question. Only output the JSON object.`,

  queryReformulationPrompt: `Based on the conversation history and user query, create a standalone search query that can be understood without context. Focus on the specific information needed from the knowledge base.`,

  toolDescription: `Retrieve the complete content of a document when you need more context beyond the provided chunk. Use this when the chunk content is insufficient to answer the user's question and you need to see the full document.`,

  contextFormatting: {
    useHeaders: true,
    headerText: '\n\n--- Relevant Context from Documents Start ---',
    footerText: '\n--- Relevant Context from Documents End ---',
    includeDocumentIds: true,
    documentSeparator: '\n---\n'
  },

  responseFormat: {
    requireJSON: false,
    includeLinkedDocumentIds: true,
    encourageConciseness: true,
    maxResponseLength: undefined
  },

  mathFormatting: 'latex',

  personality: {
    tone: 'helpful',
    verbosity: 'concise',
    formality: 'neutral'
  }
};