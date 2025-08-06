import { createTool } from '@mastra/core';
import { z } from 'zod';
import { getSupabaseClient } from '../../services/supabase.service.js';

export const vectorSearchTool = createTool({
  id: 'vector_search',
  description: 'Search through course documents using vector similarity',
  inputSchema: z.object({
    query: z.string(),
    courseId: z.string().optional(),
    limit: z.number().optional().default(5),
  }),
  outputSchema: z.object({
    results: z.array(z.object({
      content: z.string(),
      similarity: z.number(),
      documentId: z.string(),
      fileName: z.string().optional(),
    })),
  }),
  execute: async ({ context }) => {
    const { query, courseId, limit = 5 } = context;

    try {
      const supabase = getSupabaseClient();

      // Build the query
      let queryBuilder = supabase
        .from('chunks')
        .select(`
          content,
          similarity,
          doc_id,
          docs!inner(file_name)
        `)
        .textSearch('content', query)
        .limit(limit);

      // Add course filter if provided
      if (courseId) {
        queryBuilder = queryBuilder.eq('docs.course_id', courseId);
      }

      const { data, error } = await queryBuilder;

      if (error) {
        console.error('[Vector Search] Error:', error);
        throw new Error(`Vector search failed: ${error.message}`);
      }

      if (!data || data.length === 0) {
        return { results: [] };
      }

      const results = data.map((item: any) => ({
        content: item.content,
        similarity: item.similarity || 0,
        documentId: item.doc_id,
        fileName: item.docs?.file_name,
      }));

      return { results };

    } catch (error) {
      console.error('[Vector Search] Error:', error);
      return { results: [] };
    }
  },
});