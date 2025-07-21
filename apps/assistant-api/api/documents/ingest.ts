import { z } from 'zod';
import { IncomingMessage, ServerResponse } from 'http';
import logger from '@/lib/utils/logger';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/lib/types/database';

// Import existing document processing functions
import { extractDocument } from '@/lib/document/extract-document';
import { splitDocumentsToNodes } from '@/lib/document/split-document';
import { generateEmbeddings } from '@/lib/document/document-embedding';
import { checkCourseProvided, checkDocumentRelevance } from '@/lib/document/document-relevance';
import { sanitizeText } from '@/lib/document/sanitize-text';

// Request/Response schemas
const IngestDocumentRequestSchema = z.object({
  fileUrl: z.string().url('Must be a valid URL'),
  fileName: z.string().min(1, 'File name is required'),
  fileType: z.string().min(1, 'File type is required'),
  courseId: z.string().uuid('Must be a valid UUID'),
  fileKey: z.string().min(1, 'File key is required')
});

const IngestDocumentResponseSchema = z.object({
  success: z.boolean(),
  documentId: z.string().optional(),
  error: z.string().optional(),
  skipped: z.boolean().optional(),
  reason: z.string().optional()
});

export type IngestDocumentRequest = z.infer<typeof IngestDocumentRequestSchema>;
export type IngestDocumentResponse = z.infer<typeof IngestDocumentResponseSchema>;

/**
 * Main document ingestion function that processes uploaded files
 * Downloads, extracts content, checks relevance, generates embeddings, and stores in database
 */
export async function ingestDocumentHandler(
  req: IncomingMessage,
  res: ServerResponse,
  body: string
): Promise<void> {
  try {
    // Parse and validate request body
    const requestData = JSON.parse(body);
    const validatedRequest = IngestDocumentRequestSchema.parse(requestData);
    const { fileUrl, fileName, fileType, courseId, fileKey } = validatedRequest;

    logger.info({
      fileKey,
      fileName,
      fileUrl,
      courseId
    }, 'Starting document ingestion in assistant-api');

    // Check for required API keys
    if (!process.env.OPENAI_API_KEY) {
      logger.error({ fileKey, fileName }, 'OPENAI_API_KEY is not set');
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: false,
        error: 'OpenAI API key not configured'
      }));
      return;
    }

    // Initialize Supabase client with service role
    const supabase = createClient<Database>(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Download and hash file for duplicate detection
    const response = await fetch(fileUrl);
    if (!response.ok || !response.body) {
      logger.error({
        fileKey,
        fileName,
        fileUrl,
        status: response.status
      }, 'Failed to download file');
      
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: false,
        error: `Failed to download file: ${response.statusText}`
      }));
      return;
    }

    const fileBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(fileBuffer);
    const crypto = await import('crypto');
    const fileHash = crypto.createHash('sha256').update(buffer).digest('hex');

    logger.info({ fileKey, fileName, fileHash }, 'Generated file hash');

    // Check for duplicate content
    const { data: existingDoc, error: hashCheckError } = await supabase
      .from('docs')
      .select('id, file_name')
      .eq('course_id', courseId)
      .eq('file_hash', fileHash)
      .single();

    if (hashCheckError && hashCheckError.code !== 'PGRST116') {
      logger.error({
        error: hashCheckError,
        fileKey,
        fileName,
        fileHash
      }, 'Error checking for duplicate hash');
      
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: false,
        error: 'Error checking for duplicate content'
      }));
      return;
    }

    if (existingDoc) {
      logger.info({
        fileKey,
        fileName,
        existingFileName: existingDoc.file_name,
        fileHash
      }, 'File with identical content already exists');
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: false,
        skipped: true,
        reason: 'Duplicate content detected'
      }));
      return;
    }

    // Save to temporary file for processing
    const os = await import('os');
    const path = await import('path');
    const fs = await import('fs/promises');
    
    const tempDir = os.tmpdir();
    const tempFilePath = path.join(tempDir, `${fileKey}_${Date.now()}_${fileName}`);
    
    try {
      await fs.writeFile(tempFilePath, buffer);
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
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: false,
          skipped: true,
          reason: 'No content extracted or document empty'
        }));
        return;
      }

      logger.info({ fileKey, tempFilePath }, 'Document content extracted successfully');

      // Sanitize extracted text
      logger.info({ fileKey, fileName }, 'Sanitizing extracted text content');
      documents.forEach((doc, index) => {
        doc.text = sanitizeText(doc.text, `${fileName}-doc-${index}`);
      });

      // Get course information for relevance check
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
          
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            success: false,
            skipped: true,
            reason: 'Document not relevant to course'
          }));
          return;
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
        
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: false,
          error: 'Could not create document in database'
        }));
        return;
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
        
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: false,
          error: 'Failed to generate embeddings'
        }));
        return;
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
        
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: false,
          error: 'Error inserting chunks into database'
        }));
        return;
      }

      logger.info({
        fileKey,
        fileName,
        numInserted: chunksToInsert.length,
        documentId: docId
      }, 'Document ingestion completed successfully');

      // Return success response
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        documentId: docId
      }));

    } finally {
      // Clean up temporary file
      try {
        const fs = await import('fs/promises');
        if (await fs.stat(tempFilePath).catch(() => false)) {
          await fs.unlink(tempFilePath);
          logger.info({ tempFilePath, fileKey }, 'Temporary file deleted');
        }
      } catch (cleanupError) {
        logger.error({
          cleanupError,
          tempFilePath,
          fileKey,
          fileName
        }, 'Error deleting temporary file');
      }
    }

  } catch (error) {
    logger.error({
      error: error instanceof Error ? error.message : 'Unknown error'
    }, 'Error in document ingestion handler');

    if (!res.headersSent) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error'
      }));
    }
  }
}