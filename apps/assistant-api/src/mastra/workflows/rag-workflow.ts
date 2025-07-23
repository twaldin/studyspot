import { createWorkflow, createStep } from '@mastra/core';
import { z } from 'zod';
import { QueryReformulationAgent } from '../agents/query-reformulation-agent.js';
import { StudySpotAgent } from '../agents/studyspot-agent.js';
import { vectorSearchTool } from '../tools/vector-search.tool.js';
import { ConfigLoaderService, PromptOverrides } from '../../services/config-loader.service.js';
import { SupabaseService } from '../../services/supabase.service.js';
import { getSourcesFromStore, clearSourcesStore } from '../tools/set-sources.tool.js';

// Input schema for the RAG workflow
const RAGWorkflowInputSchema = z.object({
  question: z.string().min(1, 'Question is required'),
  conversationHistory: z.array(z.object({
    role: z.enum(['user', 'assistant', 'system']),
    content: z.string()
  })).default([]),
  courseId: z.string().uuid().optional(),
  timeZone: z.string().optional(),
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
    linkedDocumentIds?: string[];
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

      // Step 3: Conditional vector search
      let retrievedDocuments: any[] = [];
      let linkedDocumentIds: string[] = [];

      if (analysisResult.ragNeeded && input.courseId && analysisResult.search_query) {
        const searchResult = await SupabaseService.performVectorSearch(
          analysisResult.search_query,
          input.courseId,
          5
        );

        if (searchResult.success && searchResult.documents) {
          retrievedDocuments = searchResult.documents;
          linkedDocumentIds = [...new Set(searchResult.documents.map(doc => doc.doc_id))];
        }
      }

      // Step 4: Stream response generation with scratchpad reasoning
      // Clear any previous sources for this course (start fresh)
      if (input.courseId) {
        clearSourcesStore(input.courseId);
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
        input.timeZone
      );

      for await (const chunk of responseStream) {
        yield { chunk };
      }

      // After streaming, check if the assistant set any sources
      let assistantLinkedDocumentIds: string[] = [];
      if (input.courseId) {
        assistantLinkedDocumentIds = getSourcesFromStore(input.courseId);
        if (assistantLinkedDocumentIds.length > 0) {
          console.log(`[RAGWorkflow] Assistant set ${assistantLinkedDocumentIds.length} source documents via set_sources tool`);
        }
      }

      // Use assistant-chosen sources if available, otherwise fall back to automatic linking
      const finalLinkedDocumentIds = assistantLinkedDocumentIds.length > 0 
        ? assistantLinkedDocumentIds 
        : linkedDocumentIds;

      console.log(`[RAGWorkflow] Final linked documents: ${finalLinkedDocumentIds.length} (${assistantLinkedDocumentIds.length > 0 ? 'assistant-chosen' : 'automatic'})`);

      // Clean up the store
      if (input.courseId) {
        clearSourcesStore(input.courseId);
      }

      // Send final result with metadata
      yield {
        done: true,
        linkedDocumentIds: finalLinkedDocumentIds
      };

    } catch (error) {
      console.error('[RAGWorkflow] Error in streaming execution:', error);
      yield {
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
}