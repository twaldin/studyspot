import { createTool } from '@mastra/core';
import { z } from 'zod';
import { SuggestedQueriesService } from '../../services/suggested-queries.service.js';

export const getSuggestedQueriesTool = createTool({
  id: 'get_suggested_queries',
  description: 'Get AI-generated suggested queries for a course',
  inputSchema: z.object({
    courseId: z.string().describe('The ID of the course'),
    schoolId: z.string().describe('The ID of the school'),
    forceRefresh: z.boolean().optional().describe('Force refresh the queries instead of using cache')
  }),
  execute: async ({ courseId, schoolId, forceRefresh }, { context }) => {
    try {
      // Get KV namespace from context
      const kv = (context as any).env?.SUGGESTED_QUERIES;
      if (!kv) {
        throw new Error('SUGGESTED_QUERIES KV namespace not available');
      }
      
      const service = new SuggestedQueriesService(kv);
      const result = await service.getQueries(courseId, schoolId, forceRefresh);
      
      return {
        success: true,
        data: {
          queries: result.queries,
          fromCache: result.fromCache,
          isStale: result.isStale
        }
      };
    } catch (error) {
      console.error('Error getting suggested queries:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get suggested queries'
      };
    }
  }
});