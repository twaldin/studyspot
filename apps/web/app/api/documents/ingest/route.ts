import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { z } from 'zod';
import logger, { LogContext } from '@/lib/logger';
import { documentIngestionService } from '@/lib/services/document-ingestion/document-ingestion.service';
import { createServiceRoleClient } from '@/lib/services/database/supabase.service';

const ingestDocumentSchema = z.object({
  fileKey: z.string().min(1),
  fileName: z.string().min(1),
  fileUrl: z.string().url(),
  fileType: z.string().min(1),
  courseId: z.string().min(1),
});

/**
 * POST /api/documents/ingest
 * 
 * Handles asynchronous document ingestion after file upload.
 * This endpoint is called by the client after UploadThing completes
 * to process the uploaded document through the full ingestion pipeline.
 */
export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validationResult = ingestDocumentSchema.safeParse(body);
    
    if (!validationResult.success) {
      logger.warn(LogContext.api('documents/ingest', userId, {
        validationErrors: validationResult.error.errors
      }), 'Invalid request body for document ingestion');
      
      return NextResponse.json(
        { 
          error: 'Invalid request body',
          details: validationResult.error.errors 
        },
        { status: 400 }
      );
    }

    const { fileKey, fileName, fileUrl, fileType, courseId } = validationResult.data;

    // Verify user has access to the course
    const supabase = createServiceRoleClient();
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('id, title, code')
      .eq('id', courseId)
      .single();

    if (courseError || !course) {
      logger.warn(LogContext.api('documents/ingest', userId, {
        courseId,
        fileKey,
        error: courseError
      }), 'Course not found for document ingestion');
      
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }

    logger.info(LogContext.api('documents/ingest', userId, {
      fileKey,
      fileName,
      courseId,
      courseTitle: course.title
    }), 'Starting document ingestion');

    // Process document ingestion asynchronously
    // Note: We don't await this to allow the request to return immediately
    // The client will handle progress updates through other means (e.g., WebSocket or polling)
    documentIngestionService.ingestDocument({
      fileKey,
      fileName,
      fileUrl,
      fileType,
      courseId,
    }).then((success) => {
      if (success) {
        logger.info(LogContext.api('documents/ingest', userId, {
          fileKey,
          fileName,
          courseId
        }), 'Document ingestion completed successfully');
      } else {
        logger.error(LogContext.api('documents/ingest', userId, {
          fileKey,
          fileName,
          courseId
        }), 'Document ingestion failed');
      }
    }).catch((error) => {
      logger.error(LogContext.api('documents/ingest', userId, {
        fileKey,
        fileName,
        courseId,
        error: error instanceof Error ? error.message : 'Unknown error'
      }), 'Document ingestion threw an error');
    });

    // Return immediately with processing status
    return NextResponse.json({
      message: 'Document ingestion started',
      fileKey,
      fileName,
      courseId,
      status: 'processing'
    });

  } catch (error) {
    logger.error({
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, 'Unexpected error in document ingestion API');

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}