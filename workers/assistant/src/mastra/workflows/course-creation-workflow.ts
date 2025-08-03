import { createWorkflow, createStep } from '@mastra/core/workflows';
import { z } from 'zod';
import { verifyCourseTool } from '../tools/verify-course.tool.js';
import { documentIngestionWorkflow } from './document-ingestion-workflow.js';

// Input schema for course creation
const CourseCreationInput = z.object({
  courseCode: z.string(),
  courseTitle: z.string(),
  schoolId: z.string(),
  schoolName: z.string(),
  userId: z.string(),
  // Optional syllabus file for ingestion
  syllabusFile: z.object({
    fileKey: z.string(),
    fileName: z.string(),
    fileUrl: z.string(),
    fileType: z.string(),
  }).optional(),
});

// Step 1: Verify course safety
const verifyCourseStep = createStep({
  id: 'verify-course',
  description: 'Verify course code for safety and appropriateness',
  inputSchema: CourseCreationInput,
  outputSchema: z.object({
    verified: z.boolean(),
    message: z.string(),
    reason: z.string().optional(),
    courseData: CourseCreationInput,
  }),
  execute: async ({ inputData }) => {
    const { courseCode, schoolName } = inputData;
    
    // Use the verify course tool
    const result = await verifyCourseTool.execute({
      context: { courseCode, schoolName },
    });

    return {
      ...result,
      courseData: inputData,
    };
  },
});

// Step 2: Create course in database (placeholder - actual implementation would call Supabase)
const createCourseStep = createStep({
  id: 'create-course',
  description: 'Create course in database',
  inputSchema: z.object({
    verified: z.boolean(),
    message: z.string(),
    reason: z.string().optional(),
    courseData: CourseCreationInput,
  }),
  outputSchema: z.object({
    success: z.boolean(),
    courseId: z.string().optional(),
    message: z.string(),
    syllabusFile: z.object({
      fileKey: z.string(),
      fileName: z.string(),
      fileUrl: z.string(),
      fileType: z.string(),
    }).optional(),
  }),
  execute: async ({ inputData }) => {
    const { verified, message, courseData } = inputData;
    
    // If not verified, return early
    if (!verified) {
      return {
        success: false,
        message,
      };
    }

    // TODO: Actual database creation would happen here
    // For now, we'll simulate with a generated ID
    const courseId = `course_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    console.log('[Course Creation] Created course:', {
      courseId,
      code: courseData.courseCode,
      title: courseData.courseTitle,
      schoolId: courseData.schoolId,
    });

    return {
      success: true,
      courseId,
      message: 'Course created successfully',
      syllabusFile: courseData.syllabusFile,
    };
  },
});

// Step 3: Trigger document ingestion if syllabus provided
const triggerIngestionStep = createStep({
  id: 'trigger-ingestion',
  description: 'Trigger document ingestion for syllabus if provided',
  inputSchema: z.object({
    success: z.boolean(),
    courseId: z.string().optional(),
    message: z.string(),
    syllabusFile: z.object({
      fileKey: z.string(),
      fileName: z.string(),
      fileUrl: z.string(),
      fileType: z.string(),
    }).optional(),
  }),
  outputSchema: z.object({
    courseId: z.string().optional(),
    message: z.string(),
    ingestionTriggered: z.boolean(),
  }),
  execute: async ({ inputData, mastra }) => {
    const { success, courseId, syllabusFile } = inputData;
    
    // If course creation failed or no syllabus, return early
    if (!success || !courseId || !syllabusFile) {
      return {
        courseId,
        message: inputData.message,
        ingestionTriggered: false,
      };
    }

    // Trigger document ingestion workflow
    try {
      const ingestionWorkflow = mastra?.getWorkflow('document-ingestion');
      if (ingestionWorkflow) {
        const run = await ingestionWorkflow.createRunAsync();
        
        // Start the ingestion asynchronously (don't await)
        run.start({
          inputData: {
            files: [syllabusFile],
            courseId,
            userId: '', // Would come from context in real implementation
          },
        }).then(result => {
          console.log('[Course Creation] Document ingestion completed:', result);
        }).catch(error => {
          console.error('[Course Creation] Document ingestion failed:', error);
        });

        return {
          courseId,
          message: 'Course created and syllabus ingestion started',
          ingestionTriggered: true,
        };
      }
    } catch (error) {
      console.error('[Course Creation] Failed to trigger ingestion:', error);
    }

    return {
      courseId,
      message: inputData.message,
      ingestionTriggered: false,
    };
  },
});

// Main workflow
export const courseCreationWorkflow = createWorkflow({
  id: 'course-creation',
  description: 'Verify and create a course with optional syllabus ingestion',
  inputSchema: CourseCreationInput,
  outputSchema: z.object({
    courseId: z.string().optional(),
    message: z.string(),
    ingestionTriggered: z.boolean(),
  }),
})
  .then(verifyCourseStep)
  .then(createCourseStep)
  .then(triggerIngestionStep)
  .commit();

export type { CourseCreationInput };