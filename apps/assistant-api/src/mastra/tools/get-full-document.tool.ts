import { createTool } from '@mastra/core';
import { z } from 'zod';
import { SupabaseService } from '../../services/supabase.service.js';
import { ConfigLoaderService } from '../../services/config-loader.service.js';

/**
 * Tool for retrieving complete document content
 * Replicates the functionality of the original get_full_document tool
 */
export const getFullDocumentTool = createTool({
  id: 'get_full_document',
  description: 'Retrieve the complete content of a specific document by its ID. Use this when you need to access the full text of a document that has been referenced or when a student asks for complete document content.',
  inputSchema: z.object({
    documentId: z.string().uuid('Document ID must be a valid UUID'),
    courseId: z.string().uuid('Course ID must be a valid UUID').optional()
  }),
  outputSchema: z.object({
    content: z.string().describe('The complete content of the document'),
    title: z.string().optional().describe('The title of the document if available'),
    documentType: z.string().optional().describe('The type/format of the document'),
    success: z.boolean().describe('Whether the document was successfully retrieved'),
    error: z.string().optional().describe('Error message if retrieval failed')
  }),
  execute: async ({ context, runtimeContext }) => {
    const { documentId, courseId: providedCourseId } = context;
    
    // Use provided courseId or fall back to runtime context
    const courseId = providedCourseId || runtimeContext?.get?.('courseId');
    
    console.log(`[GetFullDocumentTool] Retrieving document: ${documentId} for course: ${courseId || 'none'}`);

    try {
      // Validate course access if courseId is provided
      if (courseId) {
        const hasAccess = await SupabaseService.validateCourseAccess(courseId);
        if (!hasAccess) {
          console.warn(`[GetFullDocumentTool] No access to course: ${courseId}`);
          return {
            content: '',
            success: false,
            error: 'Course not found or access denied'
          };
        }
      }

      // Retrieve the document
      const result = await SupabaseService.getFullDocument(documentId, courseId);

      if (!result.success) {
        console.warn(`[GetFullDocumentTool] Failed to retrieve document: ${documentId}`);
        return {
          content: '',
          success: false,
          error: 'Document not found or could not be retrieved'
        };
      }

      console.log(`[GetFullDocumentTool] Successfully retrieved document: ${documentId}, content length: ${result.content.length}`);

      return {
        content: result.content,
        title: result.title,
        documentType: result.documentType,
        success: true
      };

    } catch (error) {
      console.error(`[GetFullDocumentTool] Error retrieving document ${documentId}:`, error);
      
      return {
        content: '',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
});