import { createTool } from '@mastra/core';
import { z } from 'zod';
import { SupabaseService } from '../../services/supabase.service.js';

/**
 * Tool for listing all documents in a course
 * Provides the AI with an overview of available course materials
 */
export const listAllDocumentsTool = createTool({
  id: 'list_all_documents',
  description: 'Get a list of all documents available in a course, including their titles and IDs. Use this to help students understand what materials are available or to find specific documents.',
  inputSchema: z.object({
    courseId: z.string().uuid('Course ID must be a valid UUID').optional()
      .describe('Course ID (optional, will use agent context if not provided)')
  }),
  outputSchema: z.object({
    documents: z.array(z.object({
      id: z.string().describe('Document ID (UUID)'),
      title: z.string().describe('Document title (file name)'),
      documentType: z.string().optional().describe('Type of document (e.g., pdf, docx, etc.)'),
      uploadedAt: z.string().optional().describe('When the document was uploaded')
    })),
    totalCount: z.number().describe('Total number of documents in the course'),
    success: z.boolean().describe('Whether the operation was successful'),
    error: z.string().optional().describe('Error message if operation failed')
  }),
  execute: async ({ context, runtimeContext }) => {
    const { courseId: providedCourseId } = context;
    
    // Use provided courseId or fall back to runtime context
    const courseId = providedCourseId || runtimeContext?.get?.('courseId');
    
    if (!courseId) {
      console.warn(`[ListAllDocumentsTool] No course ID provided in tool input or runtime context`);
      return {
        documents: [],
        totalCount: 0,
        success: false,
        error: 'Course ID is required to list documents'
      };
    }
    
    console.log(`[ListAllDocumentsTool] Fetching all documents for course: ${courseId}`);

    try {
      // Validate course access first
      const hasAccess = await SupabaseService.validateCourseAccess(courseId);
      if (!hasAccess) {
        console.warn(`[ListAllDocumentsTool] No access to course: ${courseId}`);
        return {
          documents: [],
          totalCount: 0,
          success: false,
          error: 'Course not found or access denied'
        };
      }

      // Get all documents for the course
      const documents = await SupabaseService.getAllDocumentsInCourse(courseId);

      if ('error' in documents) {
        console.warn(`[ListAllDocumentsTool] Error fetching documents: ${documents.error}`);
        return {
          documents: [],
          totalCount: 0,
          success: false,
          error: documents.error
        };
      }

      console.log(`[ListAllDocumentsTool] Found ${documents.length} documents in course ${courseId}`);

      return {
        documents: documents.map(doc => ({
          id: doc.id,
          title: doc.title || 'Untitled Document',
          documentType: doc.documentType,
          uploadedAt: doc.uploadedAt
        })),
        totalCount: documents.length,
        success: true
      };

    } catch (error) {
      console.error(`[ListAllDocumentsTool] Error listing documents for course ${courseId}:`, error);
      
      return {
        documents: [],
        totalCount: 0,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
});