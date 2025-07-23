import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/lib/database.types';
import logger, { LogContext } from '@/lib/logger';
import path from 'path';
import { tmpdir } from 'os';
import { writeFile, unlink, stat } from 'fs/promises';

// Import our document processing utilities
import { extractDocument } from '@/lib/services/document-ingestion/extract-document';
import { splitDocumentsToNodes } from '@/lib/services/document-ingestion/split-document';
import { sanitizeText } from '@/lib/services/document-ingestion/sanitize-text';
import { checkForDuplicateContent } from '@/lib/services/document-ingestion/duplicate-check';
import { checkDocumentRelevance, checkCourseProvided } from '@/lib/services/document-ingestion/relevance-check';
import { generateEmbeddings } from '@/lib/services/document-ingestion/embedding-generation';

// Request schema matching the original assistant API
const IngestDocumentRequestSchema = z.object({
  fileUrl: z.string().url('Must be a valid URL'),
  fileName: z.string().min(1, 'File name is required'),
  fileType: z.string().min(1, 'File type is required'),
  courseId: z.string().uuid('Must be a valid UUID'),
  fileKey: z.string().min(1, 'File key is required')
});

export type IngestDocumentRequest = z.infer<typeof IngestDocumentRequestSchema>;

/**
 * Serverless Document Ingestion Function
 * Replicates exact functionality of the assistant-api ingestion endpoint
 * Maintains same response format for batch processing compatibility
 */
export async function POST(request: NextRequest) {
  let tempFilePath: string | null = null;
  
  try {
    // Parse and validate request body
    const body = await request.json();
    const validatedRequest = IngestDocumentRequestSchema.parse(body);
    const { fileUrl, fileName, fileType, courseId, fileKey } = validatedRequest;

    logger.info({
      fileKey,
      fileName,
      fileUrl,
      courseId
    }, 'Starting serverless document ingestion');

    // Check for required API keys
    if (!process.env.OPENAI_API_KEY) {
      logger.error({ fileKey, fileName }, 'OPENAI_API_KEY is not set');
      return NextResponse.json({
        success: false,
        error: 'OpenAI API key not configured'
      }, { status: 500 });
    }

    // Download and hash file for duplicate detection
    const response = await fetch(fileUrl);
    if (!response.ok || !response.body) {
      logger.error({
        fileKey,
        fileName,
        fileUrl,
        status: response.status
      }, 'Failed to download file');
      
      return NextResponse.json({
        success: false,
        error: `Failed to download file: ${response.statusText}`
      }, { status: 400 });
    }

    const fileBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(fileBuffer);
    const crypto = await import('crypto');
    const fileHash = crypto.createHash('sha256').update(buffer).digest('hex');

    logger.info({ fileKey, fileName, fileHash }, 'Generated file hash');

    // Check for duplicate content
    try {
      const existingDoc = await checkForDuplicateContent(courseId, fileHash);
      if (existingDoc) {
        logger.info({
          fileKey,
          fileName,
          existingFileName: existingDoc.file_name,
          fileHash
        }, 'File with identical content already exists');
        
        return NextResponse.json({
          success: false,
          skipped: true,
          reason: 'Duplicate content detected'
        });
      }
    } catch (error) {
      logger.error({
        error: error instanceof Error ? error.message : 'Unknown error',
        fileKey,
        fileName,
        fileHash
      }, 'Error checking for duplicate hash');
      
      return NextResponse.json({
        success: false,
        error: 'Error checking for duplicate content'
      }, { status: 500 });
    }

    // Save to temporary file for processing
    const tempDir = tmpdir();
    tempFilePath = path.join(tempDir, `${fileKey}_${Date.now()}_${fileName}`);
    
    await writeFile(tempFilePath, buffer);
    logger.info({ fileKey, tempFilePath }, 'File saved to temporary location');

    // Extract document content
    logger.info({ fileKey, tempFilePath }, 'Extracting document content');
    const documents = await extractDocument(tempFilePath);
    
    if (!documents || documents.length === 0) {
      logger.warn({
        fileKey,
        fileName,
        tempFilePath
      }, 'No content extracted or document empty');
      
      return NextResponse.json({
        success: false,
        skipped: true,
        reason: 'No content extracted or document empty'
      });
    }

    logger.info({ fileKey, tempFilePath }, 'Document content extracted successfully');

    // Sanitize extracted text
    logger.info({ fileKey, fileName }, 'Sanitizing extracted text content');
    documents.forEach((doc, index) => {
      doc.text = sanitizeText(doc.text, `${fileName}-doc-${index}`);
    });

    // Get course information for relevance check
    const supabase = createClient<Database>(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('code, title')
      .eq('id', courseId)
      .single();

    let isProvided = false;

    if (courseError || !course) {
      logger.warn({
        error: courseError,
        courseId,
        fileKey
      }, 'Could not fetch course information, proceeding without relevance check');
    } else {
      // Check document relevance
      const documentText = documents.map((doc) => doc.text).join('\n\n').substring(0, 3000);
      
      const isRelevant = await checkDocumentRelevance(
        course.code || '',
        course.title || '',
        fileName,
        documentText
      );

      if (!isRelevant) {
        logger.info({
          fileKey,
          fileName,
          courseCode: course.code,
          courseTitle: course.title
        }, 'Document deemed not relevant to course');
        
        return NextResponse.json({
          success: false,
          skipped: true,
          reason: 'Document not relevant to course'
        });
      }

      logger.info({
        fileKey,
        fileName,
        courseCode: course.code,
        courseTitle: course.title
      }, 'Document confirmed as relevant to course');

      // Check if document is course-provided
      isProvided = await checkCourseProvided(
        course.code,
        course.title,
        fileName,
        documentText
      );
    }

    // Create document record in database
    logger.info({ fileKey, fileName }, 'Creating document record in database');
    const { data: doc, error: docError } = await supabase
      .from('docs')
      .insert({
        file_name: fileName,
        file_type: fileType,
        file_url: fileUrl,
        course_id: courseId,
        file_hash: fileHash,
        course_provided: isProvided
      })
      .select('id')
      .single();

    if (docError) {
      logger.error({
        error: docError,
        fileKey,
        fileName
      }, 'Could not create document in database');
      
      return NextResponse.json({
        success: false,
        error: 'Could not create document in database'
      }, { status: 500 });
    }

    const docId = doc.id;
    logger.info({
      docId,
      fileKey,
      fileName,
      fileHash
    }, 'Document created in database');

    // Split documents into nodes
    logger.info({ fileKey, fileName }, 'Splitting document into nodes');
    const nodes = splitDocumentsToNodes(documents);

    // Generate embeddings
    logger.info({ fileKey, fileName }, 'Generating embeddings');
    const nodeTexts = nodes.map((node) => node.text);
    const embeddings = await generateEmbeddings({ nodeTexts, fileKey });

    if (!embeddings) {
      logger.error({
        fileKey,
        fileName
      }, 'Failed to generate embeddings');
      
      return NextResponse.json({
        success: false,
        error: 'Failed to generate embeddings'
      }, { status: 500 });
    }

    logger.info({ fileKey, fileName }, 'Embeddings generated successfully');

    // Insert chunks with sanitized content
    logger.info({ fileKey, fileName }, 'Inserting chunks into database');
    const chunksToInsert = nodes.map((node, index) => ({
      doc_id: docId,
      content: sanitizeText(node.text, `${fileName}-chunk-${index}`),
      embedding: embeddings[index],
      chunk_count: index
    }));

    const { error: insertError } = await supabase
      .from('chunks')
      .insert(chunksToInsert);

    if (insertError) {
      logger.error({
        fileKey,
        fileName,
        dbError: insertError.message,
        dbDetails: insertError.details
      }, 'Error inserting chunks into database');
      
      return NextResponse.json({
        success: false,
        error: 'Error inserting chunks into database'
      }, { status: 500 });
    }

    logger.info({
      fileKey,
      fileName,
      numInserted: chunksToInsert.length,
      documentId: docId
    }, 'Serverless document ingestion completed successfully');

    // Return success response
    return NextResponse.json({
      success: true,
      documentId: docId
    });

  } catch (error) {
    logger.error({
      error: error instanceof Error ? error.message : 'Unknown error'
    }, 'Error in serverless document ingestion');

    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error'
    }, { status: 500 });

  } finally {
    // Clean up temporary file
    if (tempFilePath) {
      try {
        if (await stat(tempFilePath).catch(() => false)) {
          await unlink(tempFilePath);
          logger.info({ tempFilePath }, 'Temporary file deleted');
        }
      } catch (cleanupError) {
        logger.error({
          cleanupError,
          tempFilePath
        }, 'Error deleting temporary file');
      }
    }
  }
}