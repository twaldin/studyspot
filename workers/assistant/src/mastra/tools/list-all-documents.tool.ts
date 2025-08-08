import { createTool } from '@mastra/core';
import { z } from 'zod';
import { SupabaseService } from '../../services/supabase.service.js';

export const listAllDocumentsTool = createTool({
  id: 'list_all_documents',
  description: 'List all documents available in the course. Use this when you want to show the student what materials are available or to browse through course documents.',
  inputSchema: z.object({
    courseId: z.string().uuid('Course ID must be a valid UUID').optional()
      .describe('Course ID (optional, will use runtime context if not provided)')
  }),
  outputSchema: z.object({
    documents: z.array(z.object({
      id: z.string().describe('Document ID'),
      fileName: z.string().describe('Name of the document file'),
      fileType: z.string().describe('Type/format of the document'),
      uploadDate: z.string().describe('When the document was uploaded')
    })),
    totalCount: z.number().describe('Total number of documents found'),
    success: z.boolean().describe('Whether the operation was successful'),
    error: z.string().optional().describe('Error message if operation failed')
  }),
  execute: async ({ context, runtimeContext }) => {
    const { courseId: providedCourseId } = context;
    
    // Use provided courseId or fall back to runtime context
    const courseId = providedCourseId || runtimeContext?.get?.('courseId');
    
    if (!courseId) {
      console.warn(`[ListAllDocumentsTool] No course ID provided`);
      return {
        documents: [],
        totalCount: 0,
        success: false,
        error: 'Course ID is required to list documents'
      };
    }
    
    console.log(`[ListAllDocumentsTool] Listing all documents for course: ${courseId}`);

    try {
      // Validate course access
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
      const result = await SupabaseService.getAllDocumentsForCourse(courseId);

      if (!result.success) {
        console.warn(`[ListAllDocumentsTool] Failed to retrieve documents for course: ${courseId}`);
        return {
          documents: [],
          totalCount: 0,
          success: false,
          error: 'Failed to retrieve documents'
        };
      }

      console.log(`[ListAllDocumentsTool] Successfully retrieved ${result.documents.length} documents for course: ${courseId}`);

      return {
        documents: result.documents.map(doc => ({
          id: doc.id,
          fileName: doc.fileName,
          fileType: doc.fileType,
          uploadDate: doc.uploadDate
        })),
        totalCount: result.documents.length,
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