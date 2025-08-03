import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import { generateEmbedding } from '../../services/embedding.service.js';
import { searchDocumentChunks } from '../../services/supabase.service.js';

export const vectorSearchTool = createTool({
  id: 'vector_search',
  description: 'Advanced vector-based search across all course documents with customizable parameters',
  inputSchema: z.object({
    query: z.string().describe('The search query or question'),
    courseId: z.string().describe('The course ID to search within'),
    limit: z.number().optional().default(15).describe('Maximum number of results to return'),
    threshold: z.number().optional().default(0.65).describe('Similarity threshold (0-1), lower values return more results')
  }),
  outputSchema: z.object({
    results: z.array(z.object({
      id: z.string(),
      content: z.string(),
      document_id: z.string(),
      course_id: z.string(),
      similarity: z.number().optional()
    })),
    query: z.string(),
    total_results: z.number(),
    search_params: z.object({
      limit: z.number(),
      threshold: z.number()
    })
  }),
  execute: async ({ context }) => {
    const { query, courseId, limit, threshold } = context;
    
    try {
      // Generate embedding for the search query
      const queryEmbedding = await generateEmbedding(query);
      
      // Search for similar chunks with specified parameters
      const chunks = await searchDocumentChunks(courseId, queryEmbedding, limit, threshold);
      
      return {
        results: chunks.map(chunk => ({
          id: chunk.id,
          content: chunk.content,
          document_id: chunk.doc_id,
          course_id: chunk.course_id,
          similarity: chunk.similarity
        })),
        query,
        total_results: chunks.length,
        search_params: {
          limit,
          threshold
        }
      };
    } catch (error) {
      console.error('Vector search error:', error);
      throw new Error(`Vector search failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
});