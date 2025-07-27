import { createTool } from '@mastra/core';
import { z } from 'zod';
import { SupabaseService } from '../../services/supabase.service.js';

// Global store for set_sources results (per session)
const sourcesStore = new Map<string, string[]>();

export function getSourcesFromStore(sessionKey: string): string[] {
  return sourcesStore.get(sessionKey) || [];
}

export function clearSourcesStore(sessionKey: string): void {
  sourcesStore.delete(sessionKey);
}

/**
 * Tool for the assistant to explicitly set which documents should be linked as sources
 * This gives the AI control over which documents are most relevant to cite
 */
export const setSourcesTool = createTool({
  id: 'set_sources',
  description: 'Set which documents should be linked as sources for your response. Use this to explicitly cite the most relevant documents that support your answer. Only call this once per response with all relevant document IDs.',
  inputSchema: z.object({
    documentIds: z.array(z.string().uuid('Document ID must be a valid UUID'))
      .min(1, 'At least one document ID is required')
      .max(10, 'Maximum 10 documents can be linked as sources')
      .describe('Array of document IDs that are most relevant to your response'),
    courseId: z.string().uuid('Course ID must be a valid UUID').optional()
      .describe('Course ID (optional, will use runtime context if not provided)'),
    reasoning: z.string().optional()
      .describe('Optional brief explanation of why these documents are being cited')
  }),
  outputSchema: z.object({
    success: z.boolean().describe('Whether the sources were set successfully'),
    linkedDocumentIds: z.array(z.string()).optional().describe('Array of document IDs that were linked'),
    totalLinked: z.number().optional().describe('Total number of documents linked'),
    error: z.string().optional().describe('Error message if operation failed')
  }),
  execute: async ({ context, runtimeContext }) => {
    const { documentIds, courseId: providedCourseId, reasoning } = context;
    
    // Use provided courseId or fall back to runtime context
    const courseId = providedCourseId || runtimeContext?.get?.('courseId');
    
    if (!courseId) {
      const errorMsg = 'Course ID is required to set sources';
      console.warn(`[SetSourcesTool] ${errorMsg}`);
      return {
        success: false,
        error: errorMsg
      };
    }
    
    console.log(`[SetSourcesTool] Setting ${documentIds.length} source documents for course ${courseId}${reasoning ? `, reasoning: ${reasoning}` : ''}`);

    try {
      // The agent has already decided these are the correct sources based on prior tool outputs.
      // We will trust the agent's decision and directly store the IDs.
      // The previous implementation was failing here because it tried to re-validate chunk IDs against the docs table.
      
      // Store the document IDs in the global store (using courseId as the key)
      sourcesStore.set(courseId, documentIds);

      console.log(`[SetSourcesTool] Successfully set and stored ${documentIds.length} source document IDs.`);

      return {
        success: true,
        // Output is simplified as we are no longer fetching full document details here.
        // The primary purpose of this tool is to populate the sourcesStore.
        linkedDocumentIds: documentIds, 
        totalLinked: documentIds.length
      };

    } catch (error) {
      console.error(`[SetSourcesTool] Error setting sources:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
});