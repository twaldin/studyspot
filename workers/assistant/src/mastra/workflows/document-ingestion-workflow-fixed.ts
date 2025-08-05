import { createWorkflow, createStep } from '@mastra/core';
import { z } from 'zod';
import crypto from 'crypto';
import { MDocument } from '@mastra/rag';
import { embedMany } from 'ai';
import { openai } from '@ai-sdk/openai';
import { LlamaParse } from 'llama-parse';
import { getSupabaseClient } from '../../services/supabase.service.js';
import { sanitizeText } from '../../utils/sanitize-text.js';
import { relevanceCheckerAgent } from '../agents/relevance-checker-agent.js';

// Input and output schemas
const documentIngestionInputSchema = z.object({
  fileKey: z.string(),
  fileName: z.string(),
  fileUrl: z.string(),
  fileType: z.string(),
  courseId: z.string(),
  userId: z.string(),
});

const documentIngestionOutputSchema = z.object({
  success: z.boolean(),
  documentId: z.string().optional(),
  error: z.string().optional(),
  status: z.enum(['created', 'duplicate', 'skipped', 'failed']),
  chunkCount: z.number().optional(),
});

// Step 1: Download and validate file
const downloadAndValidateStep = createStep({
  id: 'download-validate',
  description: 'Download file and calculate hash',
  inputSchema: documentIngestionInputSchema,
  outputSchema: z.object({
    fileBuffer: z.instanceof(Buffer),
    fileHash: z.string(),
    fileSize: z.number(),
    // Pass through all original data
    fileKey: z.string(),
    fileName: z.string(),
    fileUrl: z.string(),
    fileType: z.string(),
    courseId: z.string(),
    userId: z.string(),
  }),
  execute: async ({ inputData }) => {
    console.log(`[Download] Starting download of ${inputData.fileName}`);
    
    const response = await fetch(inputData.fileUrl);
    if (!response.ok) {
      throw new Error(`Failed to download file: ${response.statusText}`);
    }
    
    const arrayBuffer = await response.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);
    const fileHash = crypto.createHash('sha256').update(fileBuffer).digest('hex');
    
    if (fileBuffer.length > 32 * 1024 * 1024) {
      throw new Error('File too large (max 32MB)');
    }
    
    console.log(`[Download] File downloaded: ${fileBuffer.length} bytes, hash: ${fileHash}`);
    
    return { 
      fileBuffer, 
      fileHash, 
      fileSize: fileBuffer.length,
      // Pass through original data
      ...inputData
    };
  }
});

// Step 2: Check for duplicates
const checkDuplicateStep = createStep({
  id: 'check-duplicate',
  description: 'Check if file already exists',
  inputSchema: z.object({
    fileHash: z.string(),
    courseId: z.string(),
    // Pass through all data
    fileBuffer: z.instanceof(Buffer),
    fileSize: z.number(),
    fileKey: z.string(),
    fileName: z.string(),
    fileUrl: z.string(),
    fileType: z.string(),
    userId: z.string(),
  }),
  outputSchema: z.object({
    isDuplicate: z.boolean(),
    existingDocId: z.string().optional(),
    existingFileName: z.string().optional(),
    // Pass through all data
    fileHash: z.string(),
    fileBuffer: z.instanceof(Buffer),
    fileSize: z.number(),
    fileKey: z.string(),
    fileName: z.string(),
    fileUrl: z.string(),
    fileType: z.string(),
    courseId: z.string(),
    userId: z.string(),
  }),
  execute: async ({ inputData }) => {
    console.log(`[Duplicate Check] Checking hash: ${inputData.fileHash}`);
    
    const supabase = getSupabaseClient();
    const { data: existing, error } = await supabase
      .from('docs')
      .select('id, file_name')
      .eq('file_hash', inputData.fileHash)
      .eq('course_id', inputData.courseId)
      .maybeSingle();
    
    if (error) {
      console.error('[Duplicate Check] Error:', error);
      throw new Error('Failed to check for duplicates');
    }
    
    const isDuplicate = !!existing;
    console.log(`[Duplicate Check] Is duplicate: ${isDuplicate}`);
    
    return { 
      isDuplicate, 
      existingDocId: existing?.id,
      existingFileName: existing?.file_name,
      // Pass through all data
      ...inputData
    };
  }
});

// Step 3: Process document (extract, chunk, check relevance, embed, store)
const processDocumentStep = createStep({
  id: 'process-document',
  description: 'Process document completely',
  inputSchema: z.object({
    isDuplicate: z.boolean(),
    existingDocId: z.string().optional(),
    existingFileName: z.string().optional(),
    fileHash: z.string(),
    fileBuffer: z.instanceof(Buffer),
    fileSize: z.number(),
    fileKey: z.string(),
    fileName: z.string(),
    fileUrl: z.string(),
    fileType: z.string(),
    courseId: z.string(),
    userId: z.string(),
  }),
  outputSchema: documentIngestionOutputSchema,
  execute: async ({ inputData, mastra }) => {
    // Handle duplicate case
    if (inputData.isDuplicate) {
      console.log(`[Process] Document is duplicate, returning existing ID`);
      return {
        success: true,
        documentId: inputData.existingDocId,
        status: 'duplicate',
        chunkCount: 0,
      };
    }
    
    try {
      // Extract content
      console.log(`[Extract] Starting LlamaParse extraction for ${inputData.fileName}`);
      const parser = new LlamaParse({ 
        apiKey: process.env.LLAMA_CLOUD_API_KEY!,
      });
      
      const file = new File([inputData.fileBuffer], inputData.fileName);
      const result = await parser.parseFile(file);
      
      if (!result || !result.markdown) {
        throw new Error('No content extracted from document');
      }
      
      console.log(`[Extract] Extracted ${result.markdown.length} characters`);
      
      // Create chunks
      console.log(`[Chunk] Starting chunking for ${inputData.fileName}`);
      const doc = MDocument.fromMarkdown(result.markdown);
      const chunks = await doc.chunk({
        strategy: 'markdown',
        size: 512,
        overlap: 50,
        extract: {
          metadata: true
        }
      });
      
      console.log(`[Chunk] Created ${chunks.length} chunks`);
      
      const sanitizedChunks = chunks.map((chunk, index) => ({
        text: sanitizeText(chunk.text, `${inputData.fileName}-chunk-${index}`),
        metadata: chunk.metadata
      }));
      
      // Check relevance
      console.log(`[Relevance] Checking relevance for ${inputData.fileName}`);
      const supabase = getSupabaseClient();
      const { data: course } = await supabase
        .from('courses')
        .select('code, title')
        .eq('id', inputData.courseId)
        .single();
      
      let isRelevant = true;
      let courseProvided = false;
      
      if (course) {
        const sampleText = sanitizedChunks
          .slice(0, 3)
          .map(c => c.text)
          .join('\n\n')
          .substring(0, 3000);
        
        const relevanceResult = await relevanceCheckerAgent.generate([{
          role: 'user',
          content: `Analyze if this document is relevant to the course "${course.code} - ${course.title}".
            
Document sample:
${sampleText}

Filename: ${inputData.fileName}

Respond with a JSON object containing:
- isRelevant: boolean (true if related to the course topic)
- reason: string (brief explanation)
- courseProvided: boolean (true if this appears to be official course material)`
        }], {
          output: {
            type: 'object',
            properties: {
              isRelevant: { type: 'boolean' },
              reason: { type: 'string' },
              courseProvided: { type: 'boolean' }
            },
            required: ['isRelevant', 'reason', 'courseProvided']
          }
        });
        
        console.log(`[Relevance] Result:`, relevanceResult.object);
        isRelevant = relevanceResult.object.isRelevant;
        courseProvided = relevanceResult.object.courseProvided;
      }
      
      if (!isRelevant) {
        console.log(`[Process] Document not relevant, skipping`);
        return {
          success: true,
          status: 'skipped',
          chunkCount: 0,
        };
      }
      
      // Generate embeddings
      console.log(`[Embeddings] Generating embeddings for ${sanitizedChunks.length} chunks`);
      const { embeddings } = await embedMany({
        model: openai.embedding('text-embedding-3-small'),
        values: sanitizedChunks.map(chunk => chunk.text),
      });
      
      console.log(`[Embeddings] Generated ${embeddings.length} embeddings`);
      
      // Store in database
      console.log(`[Store] Storing document and ${sanitizedChunks.length} chunks`);
      
      const { data: docRecord, error: docError } = await supabase
        .from('docs')
        .insert({
          file_name: inputData.fileName,
          file_url: inputData.fileUrl,
          file_type: inputData.fileType,
          file_hash: inputData.fileHash,
          course_id: inputData.courseId,
          course_provided: courseProvided,
        })
        .select('id')
        .single();
      
      if (docError) {
        console.error('[Store] Document insert error:', docError);
        throw new Error('Failed to create document record');
      }
      
      // Insert chunks
      const chunksToInsert = sanitizedChunks.map((chunk, index) => ({
        doc_id: docRecord.id,
        content: chunk.text,
        embedding: embeddings[index],
        chunk_count: index,
      }));
      
      const batchSize = 100;
      for (let i = 0; i < chunksToInsert.length; i += batchSize) {
        const batch = chunksToInsert.slice(i, i + batchSize);
        const { error: chunkError } = await supabase
          .from('chunks')
          .insert(batch);
        
        if (chunkError) {
          console.error('[Store] Chunk insert error:', chunkError);
          throw new Error('Failed to insert chunks');
        }
      }
      
      console.log(`[Store] Successfully stored document ${docRecord.id} with ${chunksToInsert.length} chunks`);
      
      return {
        success: true,
        documentId: docRecord.id,
        status: 'created',
        chunkCount: chunksToInsert.length,
      };
      
    } catch (error) {
      console.error('[Process] Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        status: 'failed',
      };
    }
  }
});

// Simple workflow that passes all data through each step
export const fixedDocumentIngestionWorkflow = createWorkflow({
  id: 'fixed-document-ingestion',
  description: 'Document ingestion workflow with proper data flow',
  inputSchema: documentIngestionInputSchema,
  outputSchema: documentIngestionOutputSchema,
})
  .then(downloadAndValidateStep)
  .then(checkDuplicateStep)
  .then(processDocumentStep)
  .commit();

// Export wrapper for compatibility
export async function executeDocumentIngestion(input: {
  fileKey: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  courseId: string;
  userId: string;
  onProgress?: (message: string) => void;
  mastra?: any;
}): Promise<{
  success: boolean;
  documentId?: string;
  error?: string;
  status: 'created' | 'duplicate' | 'skipped' | 'failed';
  chunkCount?: number;
}> {
  try {
    if (input.mastra) {
      const workflow = input.mastra.getWorkflow('documentIngestionWorkflow');
      if (!workflow) {
        throw new Error('Document ingestion workflow not found in Mastra instance');
      }
      
      const run = await workflow.createRunAsync();
      const result = await run.start({
        inputData: {
          fileKey: input.fileKey,
          fileName: input.fileName,
          fileUrl: input.fileUrl,
          fileType: input.fileType,
          courseId: input.courseId,
          userId: input.userId,
        }
      });
      
      if (result.status === 'success' && result.output) {
        return result.output;
      } else if (result.status === 'failed') {
        return {
          success: false,
          error: result.error || 'Workflow execution failed',
          status: 'failed',
        };
      } else {
        return {
          success: false,
          error: 'Workflow did not complete successfully',
          status: 'failed',
        };
      }
    } else {
      throw new Error('Mastra instance is required to execute the workflow');
    }
  } catch (error) {
    console.error('[Document Ingestion] Workflow error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 'failed',
    };
  }
}