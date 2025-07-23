import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { z } from 'zod';
// Removed assistant-api dependency - now using serverless ingestion
import { safeCleanupUploadThingFile } from '@/lib/services/file';
import logger, { LogContext } from '@/lib/logger';

const ProcessDocumentRequestSchema = z.object({
  files: z.array(z.object({
    fileKey: z.string(),
    fileName: z.string(),
    fileUrl: z.string(),
    fileType: z.string().optional(),
  })),
  courseId: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { files, courseId } = ProcessDocumentRequestSchema.parse(body);

    logger.info(LogContext.api('documents/process', userId, {
      fileCount: files.length,
      courseId
    }), 'Starting batch document processing');

    const results = await Promise.allSettled(
      files.map(async (file) => {
        try {
          logger.info(LogContext.api('documents/process', userId, {
            fileKey: file.fileKey,
            fileName: file.fileName,
            courseId
          }), 'Processing document via serverless function');

          // Call our new serverless ingestion function
          const baseUrl = process.env.VERCEL_URL 
            ? `https://${process.env.VERCEL_URL}`
            : process.env.NEXTAUTH_URL || 'http://localhost:3000';
          
          const response = await fetch(`${baseUrl}/api/documents/ingest-single`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              fileKey: file.fileKey,
              fileName: file.fileName,
              fileUrl: file.fileUrl,
              fileType: file.fileType || 'application/pdf',
              courseId,
            }),
          });

          if (!response.ok) {
            throw new Error(`Serverless function returned ${response.status}: ${response.statusText}`);
          }

          const result = await response.json();

          if (!result.success) {
            logger.warn(LogContext.api('documents/process', userId, {
              fileKey: file.fileKey,
              fileName: file.fileName,
              reason: result.reason,
              skipped: result.skipped
            }), 'Document processing was skipped, cleaning up file');
            
            await safeCleanupUploadThingFile(file.fileKey);
            
            return {
              fileKey: file.fileKey,
              fileName: file.fileName,
              success: false,
              reason: result.reason || result.error || 'Document processing failed',
            };
          }

          logger.info(LogContext.api('documents/process', userId, {
            fileKey: file.fileKey,
            fileName: file.fileName,
            documentId: result.documentId
          }), 'Document processing completed successfully via serverless function');

          return {
            fileKey: file.fileKey,
            fileName: file.fileName,
            success: true,
            documentId: result.documentId,
          };

        } catch (error) {
          logger.error(LogContext.api('documents/process', userId, {
            error: error instanceof Error ? error.message : 'Unknown error',
            fileKey: file.fileKey,
            fileName: file.fileName
          }), 'Document processing failed, cleaning up file');
          
          await safeCleanupUploadThingFile(file.fileKey);
          
          return {
            fileKey: file.fileKey,
            fileName: file.fileName,
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
          };
        }
      })
    );

    const processedResults = results.map((result, index) => {
      if (result.status === 'fulfilled') {
        return result.value;
      } else {
        return {
          fileKey: files[index].fileKey,
          fileName: files[index].fileName,
          success: false,
          error: result.reason instanceof Error ? result.reason.message : 'Processing failed',
        };
      }
    });

    const successCount = processedResults.filter(r => r.success).length;
    const failedCount = processedResults.filter(r => !r.success).length;

    logger.info(LogContext.api('documents/process', userId, {
      totalFiles: files.length,
      successCount,
      failedCount,
      courseId
    }), 'Batch document processing completed');

    return NextResponse.json({
      success: true,
      results: processedResults,
      summary: {
        total: files.length,
        succeeded: successCount,
        failed: failedCount,
      }
    });

  } catch (error) {
    logger.error({
      error: error instanceof Error ? error.message : 'Unknown error'
    }, 'Error in document processing endpoint');

    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error'
    }, { status: 500 });
  }
}