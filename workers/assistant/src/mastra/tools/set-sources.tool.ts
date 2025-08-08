import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

export const setSourcesTool = createTool({
  id: 'set_sources',
  description: 'Set source attribution for the response, linking to documents used',
  inputSchema: z.object({
    sources: z.array(z.object({
      type: z.enum(['document', 'flashcard_set', 'quiz']).describe('Type of resource'),
      id: z.string().describe('Unique identifier of the resource'),
      title: z.string().optional().describe('Display title for the resource'),
      excerpt: z.string().optional().describe('Brief excerpt or description')
    })).describe('Array of source references to attribute')
  }),
  outputSchema: z.object({
    sources_set: z.array(z.object({
      type: z.string(),
      id: z.string(),
      title: z.string().optional(),
      excerpt: z.string().optional()
    })),
    success: z.boolean(),
    message: z.string()
  }),
  execute: async ({ context }) => {
    const { sources } = context;
    
    try {
      // Process and validate sources
      const processedSources = sources.map(source => ({
        type: source.type,
        id: source.id,
        title: source.title || `${source.type} ${source.id}`,
        excerpt: source.excerpt
      }));
      
      // In a real implementation, this would typically:
      // 1. Validate that the referenced resources exist
      // 2. Store the attribution in a database
      // 3. Format the sources for display in the UI
      
      return {
        sources_set: processedSources,
        success: true,
        message: `Successfully set ${sources.length} source(s) for attribution`
      };
    } catch (error) {
      console.error('Set sources error:', error);
      return {
        sources_set: [],
        success: false,
        message: `Failed to set sources: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }
});