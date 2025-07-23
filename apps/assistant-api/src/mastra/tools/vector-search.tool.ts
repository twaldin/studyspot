import { createTool } from '@mastra/core';
import { z } from 'zod';
import { SupabaseService } from '../../services/supabase.service.js';

/**
 * Tool for performing vector search on course documents
 * Used internally by the RAG workflow for document retrieval
 */
export const vectorSearchTool = createTool({
  id: 'vector_search',
  description: 'Search for relevant documents using semantic similarity based on the query and course context',
  inputSchema: z.object({
    query: z.string().min(1, 'Search query cannot be empty'),
    courseId: z.string().uuid('Course ID must be a valid UUID'),
    limit: z.number().int().positive().max(10).optional().default(5)
      .describe('Maximum number of documents to retrieve')
  }),
  outputSchema: z.object({
    documents: z.array(z.object({
      id: z.string().describe('Chunk ID'),
      doc_id: z.string().describe('Document ID'),
      content: z.string().describe('Document content'),  
      similarity: z.number().optional().describe('Similarity score')
    })),
    success: z.boolean().describe('Whether the search was successful')
  }),
  execute: async ({ context }) => {
    const { query, courseId, limit } = context;

    console.log(`[VectorSearchTool] Searching for query: "${query}" in course: ${courseId}, limit: ${limit}`);

    try {
      const result = await SupabaseService.performVectorSearch(query, courseId, limit);
      
      console.log(`[VectorSearchTool] Found ${result.documents.length} documents`);
      
      return {
        documents: result.documents,
        success: result.success
      };

    } catch (error) {
      console.error('[VectorSearchTool] Error performing vector search:', error);
      
      return {
        documents: [],
        success: false
      };
    }
  }
});