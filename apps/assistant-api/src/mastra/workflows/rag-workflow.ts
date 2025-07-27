import { createWorkflow, createStep } from '@mastra/core';
import { z } from 'zod';
import { QueryReformulationAgent } from '../agents/query-reformulation-agent.js';
import { StudySpotAgent } from '../agents/studyspot-agent.js';
import { vectorSearchTool } from '../tools/vector-search.tool.js';
import { ConfigLoaderService, PromptOverrides } from '../../services/config-loader.service.js';
import { SupabaseService } from '../../services/supabase.service.js';
import { getSourcesFromStore, clearSourcesStore } from '../tools/set-sources.tool.js';
import { getFlashcardSetsFromStore, clearFlashcardStore } from '../tools/generate-flashcard-set.tool.js';
import { getQuizzesFromStore, clearQuizStore } from '../tools/generate-quiz.tool.js';

// Input schema for the RAG workflow
const RAGWorkflowInputSchema = z.object({
  question: z.string().min(1, 'Question is required'),
  conversationHistory: z.array(z.object({
    role: z.enum(['user', 'assistant', 'system']),
    content: z.string()
  })).default([]),
  courseId: z.string().uuid().optional(),
  userId: z.string().optional(),
  timeZone: z.string().optional(),
  sessionId: z.string().uuid().optional(), // Added sessionId for chat updates
  promptOverrides: z.any().optional() // PromptOverrides type
});

// Output schema for the RAG workflow
const RAGWorkflowOutputSchema = z.object({
  response: z.string(),
  linkedDocumentIds: z.array(z.string()),
  toolCalls: z.array(z.any()).optional(),
  metadata: z.object({
    ragUsed: z.boolean(),
    documentsFound: z.number(),
    processingTime: z.number()
  }).optional()
});

export type RAGWorkflowInput = z.infer<typeof RAGWorkflowInputSchema>;
export type RAGWorkflowOutput = z.infer<typeof RAGWorkflowOutputSchema>;

/**
 * Main RAG workflow that orchestrates the complete process:
 * 1. Query analysis and reformulation
 * 2. Conditional vector search
 * 3. Response generation with retrieved context
 */
export const ragWorkflow = createWorkflow({
  id: 'rag-workflow',
  description: 'Complete RAG workflow with query processing, document retrieval, and response generation',
  inputSchema: RAGWorkflowInputSchema,
  outputSchema: RAGWorkflowOutputSchema
});

/**
 * Streaming version of the RAG workflow
 * Returns an async generator for real-time response streaming
 */
export class RAGWorkflowStreaming {
  /**
   * Execute the RAG workflow with streaming response
   */
  static async* executeStream(input: RAGWorkflowInput): AsyncGenerator<{
    chunk?: string;
    linkedDocumentIds?: Array<{ type: 'document' | 'flashcard_set' | 'quiz'; id: string }>;
    done?: boolean;
    error?: string;
    toolCall?: any;
    toolResult?: any;
  }> {
    const startTime = Date.now();
    
    try {
      console.log('[RAGWorkflow] Starting streaming execution');

      // Step 1: Apply prompt overrides
      if (input.promptOverrides) {
        ConfigLoaderService.applyOverrides(input.promptOverrides as PromptOverrides);
        console.log('[RAGWorkflow] Prompt overrides applied for streaming');
      } else {
        ConfigLoaderService.applyOverrides(null);
      }

      // Step 2: Query analysis
      const analysisResult = await QueryReformulationAgent.analyzeQuery(
        input.question,
        input.conversationHistory,
        input.timeZone
      );

      // Step 3: Conditional vector search. This is for context, not for linking.
      let retrievedDocuments: any[] = [];
      if (analysisResult.ragNeeded && input.courseId && analysisResult.search_query) {
        const searchResult = await SupabaseService.performVectorSearch(
          analysisResult.search_query,
          input.courseId,
          5
        );
        if (searchResult.success && searchResult.documents) {
          retrievedDocuments = searchResult.documents;
        }
      }

      // Step 4: Stream response generation.
      // Clear any previous sources, flashcards, and quizzes for this request.
      if (input.courseId) {
        clearSourcesStore(input.courseId);
        clearFlashcardStore(input.courseId);
        clearQuizStore(input.courseId);
      }

      let finalUserMessage = input.question;
      
      if (retrievedDocuments.length > 0) {
        const contextHeader = "\n\n--- Relevant Context from Documents Start ---";
        const documentsContext = retrievedDocuments
          .map(doc => `Doc ID: ${doc.doc_id}\nContent: ${doc.content}`)
          .join("\n---\n");
        const contextFooter = "\n--- Relevant Context from Documents End ---";

        finalUserMessage = `User message: "${input.question}"\n\nIf helpful, use the following context to help respond to the user's message:${contextHeader}\n${documentsContext}\n${contextFooter}\n\nRemember to use <thinking></thinking> tags to plan your approach before responding to the user. The user will not see your thinking process.`;
      } else {
        finalUserMessage = `User message: "${input.question}"\n\nRemember to use <thinking></thinking> tags to plan your approach and determine if you need to use tools to gather information before responding to the user. The user will not see your thinking process.`;
      }

      // Stream the response with scratchpad reasoning capability
      const responseStream = await StudySpotAgent.streamResponse(
        finalUserMessage,
        input.conversationHistory,
        input.courseId,
        input.userId,
        input.timeZone
      );

      let fullResponseContent = '';

      for await (const chunk of responseStream) {
        const anyChunk = chunk as any;
        // The chunk can be a string or an object with tool call info
        if (typeof anyChunk === 'string') {
          fullResponseContent += anyChunk;
          yield { chunk: anyChunk };
        } else if (typeof anyChunk === 'object' && anyChunk !== null) {
          // Yield the whole object so consumers can see tool calls/results
          yield anyChunk;
        }
      }

      // After streaming, get linked resources from tools used.
      const linkedResources: Array<{ type: 'document' | 'flashcard_set' | 'quiz'; id: string }> = [];
      
      // Add documents from set_sources tool
      if (input.courseId) {
        const docIds = getSourcesFromStore(input.courseId);
        docIds.forEach(id => linkedResources.push({ type: 'document', id }));
        console.log(`[RAGWorkflow] Found ${docIds.length} documents from set_sources tool.`);
      }
      
      // Add flashcard sets created during this session
      if (input.courseId) {
        const flashcardSetIds = getFlashcardSetsFromStore(input.courseId);
        flashcardSetIds.forEach(id => linkedResources.push({ type: 'flashcard_set', id }));
        console.log(`[RAGWorkflow] Found ${flashcardSetIds.length} flashcard sets from generate_flashcard tool.`);
      }
      
      // Add quizzes created during this session
      if (input.courseId) {
        const quizIds = getQuizzesFromStore(input.courseId);
        quizIds.forEach(id => linkedResources.push({ type: 'quiz', id }));
        console.log(`[RAGWorkflow] Found ${quizIds.length} quizzes from generate_quiz tool using courseId: ${input.courseId}. Quiz IDs: ${quizIds.join(', ')}`);
      }

      console.log(`[RAGWorkflow] Final linked resources to save: ${linkedResources.length}`);

      // Update the chat in the database with the final message and linked resources.
      if (input.sessionId) {
        console.log(`[RAGWorkflow] Attempting to update chat: ${input.sessionId} with ${linkedResources.length} linked resources`);
        try {
          await SupabaseService.updateAssistantMessageInChat(
            input.sessionId,
            fullResponseContent,
            linkedResources
          );
          console.log(`[RAGWorkflow] Successfully updated chat: ${input.sessionId}`);
        } catch (dbError) {
          console.error(`[RAGWorkflow] FAILED to update chat ${input.sessionId}:`, dbError);
        }
      } else {
        console.warn(`[RAGWorkflow] Skipping chat update. Reason: No sessionId provided`);
      }

      // Clean up the stores
      if (input.courseId) {
        clearSourcesStore(input.courseId);
        clearFlashcardStore(input.courseId);
        clearQuizStore(input.courseId);
      }

      // Send final result with metadata
      yield {
        done: true,
        linkedDocumentIds: linkedResources
      };

    } catch (error) {
      console.error('[RAGWorkflow] Error in streaming execution:', error);
      yield {
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
}