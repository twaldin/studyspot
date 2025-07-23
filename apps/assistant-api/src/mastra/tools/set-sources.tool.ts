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
    linkedDocuments: z.array(z.object({
      id: z.string().describe('Document ID'),
      title: z.string().describe('Document title/filename'),
      documentType: z.string().optional().describe('Document type')
    })),
    totalLinked: z.number().describe('Total number of documents linked'),
    success: z.boolean().describe('Whether the sources were set successfully'),
    error: z.string().optional().describe('Error message if operation failed')
  }),
  execute: async ({ context, runtimeContext }) => {
    const { documentIds, courseId: providedCourseId, reasoning } = context;
    
    // Use provided courseId or fall back to runtime context
    const courseId = providedCourseId || runtimeContext?.get?.('courseId');
    const sessionKey = `${courseId}_${Date.now()}`; // Simple session key for this request
    
    if (!courseId) {
      console.warn(`[SetSourcesTool] No course ID provided in tool input or runtime context`);
      return {
        linkedDocuments: [],
        totalLinked: 0,
        success: false,
        error: 'Course ID is required to set sources'
      };
    }
    
    console.log(`[SetSourcesTool] Setting ${documentIds.length} source documents for course ${courseId}${reasoning ? `, reasoning: ${reasoning}` : ''}`);

    try {
      // Validate course access
      const hasAccess = await SupabaseService.validateCourseAccess(courseId);
      if (!hasAccess) {
        console.warn(`[SetSourcesTool] No access to course: ${courseId}`);
        return {
          linkedDocuments: [],
          totalLinked: 0,
          success: false,
          error: 'Course not found or access denied'
        };
      }

      // Validate that all document IDs exist and belong to the course
      const linkedDocuments = [];
      
      for (const docId of documentIds) {
        try {
          const docResult = await SupabaseService.getFullDocument(docId, courseId);
          
          if (docResult.success) {
            linkedDocuments.push({
              id: docId,
              title: docResult.title || 'Untitled Document',
              documentType: docResult.documentType
            });
            console.log(`[SetSourcesTool] Validated document: ${docId} (${docResult.title})`);
          } else {
            console.warn(`[SetSourcesTool] Document not found or no access: ${docId}`);
            // Continue processing other documents rather than failing entirely
          }
        } catch (error) {
          console.error(`[SetSourcesTool] Error validating document ${docId}:`, error);
          // Continue processing other documents
        }
      }

      if (linkedDocuments.length === 0) {
        return {
          linkedDocuments: [],
          totalLinked: 0,
          success: false,
          error: 'No valid documents found or access denied to all provided document IDs'
        };
      }

      // Store the document IDs in the global store (using courseId as the key)
      const documentIdsToStore = linkedDocuments.map(doc => doc.id);
      sourcesStore.set(courseId, documentIdsToStore);

      console.log(`[SetSourcesTool] Successfully set ${linkedDocuments.length} source documents and stored for session`);

      return {
        linkedDocuments,
        totalLinked: linkedDocuments.length,
        success: true
      };

    } catch (error) {
      console.error(`[SetSourcesTool] Error setting sources:`, error);
      
      return {
        linkedDocuments: [],
        totalLinked: 0,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
});