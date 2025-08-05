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

// Configuration for workflow behavior
const workflowConfig = {
  parallelEmbedding: {
    batchSize: 10,
    maxConcurrentBatches: 5,
  },
  retries: {
    maxAttempts: 3,
    initialDelay: 1000,
    backoffMultiplier: 2,
  },
  timeout: 300000, // 5 minutes
  chunking: {
    strategy: 'markdown' as const,
    size: 512,
    overlap: 50,
  }
};

// Input and output schemas
const documentIngestionInputSchema = z.object({
  fileKey: z.string(),
  fileName: z.string(),
  fileUrl: z.string().url(),
  fileType: z.string(),
  courseId: z.string().uuid(),
  userId: z.string(),
  onProgress: z.function().args(z.string()).returns(z.void()).optional(),
});

const documentIngestionOutputSchema = z.object({
  success: z.boolean(),
  documentId: z.string().optional(),
  error: z.string().optional(),
  status: z.enum(['created', 'duplicate', 'skipped', 'failed']),
  chunkCount: z.number().optional(),
  processingTime: z.number().optional(),
});

// Helper function to add retry logic to a step
function withRetry<TInput, TOutput>(
  stepConfig: Parameters<typeof createStep>[0] & {
    inputSchema: z.ZodType<TInput>;
    outputSchema: z.ZodType<TOutput>;
    execute: (params: any) => Promise<TOutput>;
  },
  retryConfig = workflowConfig.retries
) {
  return createStep({
    ...stepConfig,
    execute: async (params) => {
      let lastError: Error | null = null;
      
      for (let attempt = 1; attempt <= retryConfig.maxAttempts; attempt++) {
        try {
          console.log(`[${stepConfig.id}] Attempt ${attempt}/${retryConfig.maxAttempts}`);
          return await stepConfig.execute(params);
        } catch (error) {
          lastError = error as Error;
          
          // Don't retry on certain errors
          if (error.message?.includes('File too large') || 
              error.message?.includes('Invalid file type')) {
            throw error;
          }
          
          if (attempt < retryConfig.maxAttempts) {
            const delay = retryConfig.initialDelay * Math.pow(retryConfig.backoffMultiplier, attempt - 1);
            console.log(`[${stepConfig.id}] Retrying after ${delay}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay));
          }
        }
      }
      
      throw lastError || new Error(`Failed after ${retryConfig.maxAttempts} attempts`);
    }
  });
}

// Step 1: Download and validate file with retry
const downloadAndValidateStep = withRetry({
  id: 'download-validate',
  description: 'Download file and calculate hash',
  inputSchema: z.object({
    fileUrl: z.string().url(),
    fileName: z.string(),
    fileType: z.string(),
  }),
  outputSchema: z.object({
    fileBuffer: z.instanceof(Buffer),
    fileHash: z.string(),
    fileSize: z.number(),
  }),
  execute: async ({ inputData, context }) => {
    console.log(`[Download] Starting download of ${inputData.fileName}`);
    
    // Emit progress event
    context?.emit('progress', { 
      step: 'download', 
      message: 'Downloading file...',
      timestamp: new Date().toISOString()
    });
    
    const response = await fetch(inputData.fileUrl);
    if (!response.ok) {
      throw new Error(`Failed to download file: ${response.statusText}`);
    }
    
    const arrayBuffer = await response.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);
    const fileHash = crypto.createHash('sha256').update(fileBuffer).digest('hex');
    
    // Validate file size (32MB max)
    if (fileBuffer.length > 32 * 1024 * 1024) {
      throw new Error('File too large (max 32MB)');
    }
    
    console.log(`[Download] File downloaded: ${fileBuffer.length} bytes, hash: ${fileHash}`);
    
    context?.emit('progress', { 
      step: 'download', 
      message: 'Download complete',
      timestamp: new Date().toISOString()
    });
    
    return { 
      fileBuffer, 
      fileHash, 
      fileSize: fileBuffer.length 
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
  }),
  outputSchema: z.object({
    isDuplicate: z.boolean(),
    existingDocId: z.string().optional(),
    existingFileName: z.string().optional(),
  }),
  execute: async ({ inputData, context }) => {
    console.log(`[Duplicate Check] Checking hash: ${inputData.fileHash}`);
    
    context?.emit('progress', { 
      step: 'duplicate-check', 
      message: 'Checking for duplicates...',
      timestamp: new Date().toISOString()
    });
    
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
      existingFileName: existing?.file_name
    };
  }
});

// Step 3: Handle duplicate case
const handleDuplicateStep = createStep({
  id: 'handle-duplicate',
  description: 'Return existing document info',
  inputSchema: z.object({
    existingDocId: z.string(),
    existingFileName: z.string(),
  }),
  outputSchema: documentIngestionOutputSchema,
  execute: async ({ inputData }) => {
    console.log(`[Duplicate] Document already exists: ${inputData.existingFileName}`);
    
    return {
      success: true,
      documentId: inputData.existingDocId,
      status: 'duplicate',
      chunkCount: 0,
    };
  }
});

// Step 4: Extract content with LlamaParse (with retry)
const extractContentStep = withRetry({
  id: 'extract-content',
  description: 'Extract content using LlamaParse',
  inputSchema: z.object({
    fileBuffer: z.instanceof(Buffer),
    fileName: z.string(),
  }),
  outputSchema: z.object({
    markdown: z.string(),
    pageCount: z.number().optional(),
  }),
  execute: async ({ inputData, context }) => {
    console.log(`[Extract] Starting LlamaParse extraction for ${inputData.fileName}`);
    
    context?.emit('progress', { 
      step: 'extract', 
      message: 'Extracting content with LlamaParse...',
      timestamp: new Date().toISOString()
    });
    
    const parser = new LlamaParse({ 
      apiKey: process.env.LLAMA_CLOUD_API_KEY!,
    });
    
    // Create a File object from buffer
    const file = new File([inputData.fileBuffer], inputData.fileName);
    
    try {
      const result = await parser.parseFile(file);
      
      if (!result || !result.markdown) {
        throw new Error('No content extracted from document');
      }
      
      console.log(`[Extract] Extracted ${result.markdown.length} characters`);
      
      return { 
        markdown: result.markdown,
        pageCount: result.pages?.length 
      };
    } catch (error) {
      console.error('[Extract] LlamaParse error:', error);
      throw new Error(`Failed to extract content: ${error.message}`);
    }
  }
});

// Step 5: Chunk document
const chunkDocumentStep = createStep({
  id: 'chunk-document',
  description: 'Split document into chunks',
  inputSchema: z.object({
    markdown: z.string(),
    fileName: z.string(),
  }),
  outputSchema: z.object({
    chunks: z.array(z.object({
      text: z.string(),
      metadata: z.any().optional(),
    })),
  }),
  execute: async ({ inputData, context }) => {
    console.log(`[Chunk] Starting chunking for ${inputData.fileName}`);
    
    context?.emit('progress', { 
      step: 'chunk', 
      message: 'Creating document chunks...',
      timestamp: new Date().toISOString()
    });
    
    // Create MDocument from markdown
    const doc = MDocument.fromMarkdown(inputData.markdown);
    
    // Use markdown-aware chunking strategy
    const chunks = await doc.chunk({
      strategy: workflowConfig.chunking.strategy,
      size: workflowConfig.chunking.size,
      overlap: workflowConfig.chunking.overlap,
      extract: {
        metadata: true // Extract section headers, etc.
      }
    });
    
    console.log(`[Chunk] Created ${chunks.length} chunks`);
    
    // Sanitize chunk text
    const sanitizedChunks = chunks.map((chunk, index) => ({
      text: sanitizeText(chunk.text, `${inputData.fileName}-chunk-${index}`),
      metadata: chunk.metadata
    }));
    
    return { chunks: sanitizedChunks };
  }
});

// Step 6: Check relevance
const checkRelevanceStep = createStep({
  id: 'check-relevance',
  description: 'Check document relevance to course',
  inputSchema: z.object({
    chunks: z.array(z.object({
      text: z.string(),
      metadata: z.any().optional(),
    })),
    courseId: z.string(),
    fileName: z.string(),
  }),
  outputSchema: z.object({
    isRelevant: z.boolean(),
    reason: z.string().optional(),
    courseProvided: z.boolean(),
  }),
  execute: async ({ inputData, mastra, context }) => {
    console.log(`[Relevance] Checking relevance for ${inputData.fileName}`);
    
    context?.emit('progress', { 
      step: 'relevance', 
      message: 'Checking document relevance...',
      timestamp: new Date().toISOString()
    });
    
    // Get course info
    const supabase = getSupabaseClient();
    const { data: course } = await supabase
      .from('courses')
      .select('code, title')
      .eq('id', inputData.courseId)
      .single();
    
    if (!course) {
      console.warn('[Relevance] Course not found, skipping relevance check');
      return { isRelevant: true, courseProvided: false };
    }
    
    // Use relevance checker agent
    const relevanceAgent = relevanceCheckerAgent;
    
    // Take first 3000 chars for relevance check
    const sampleText = inputData.chunks
      .slice(0, 3)
      .map(c => c.text)
      .join('\n\n')
      .substring(0, 3000);
    
    const result = await relevanceAgent.generate([{
      role: 'user',
      content: `Analyze if this document is relevant to the course "${course.code} - ${course.title}".
        
Document sample:
${sampleText}

Filename: ${inputData.fileName}

Respond with a JSON object containing:
- isRelevant: boolean (true if related to the course topic)
- reason: string (brief explanation)
- courseProvided: boolean (true if this appears to be official course material like lecture slides, syllabus, etc.)`
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
    
    console.log(`[Relevance] Result:`, result.object);
    
    return result.object;
  }
});

// Step 7: Handle not relevant
const handleNotRelevantStep = createStep({
  id: 'handle-not-relevant',
  description: 'Skip processing for irrelevant documents',
  inputSchema: z.object({
    reason: z.string().optional(),
  }),
  outputSchema: documentIngestionOutputSchema,
  execute: async ({ inputData }) => {
    console.log(`[Skip] Document not relevant: ${inputData.reason}`);
    
    return {
      success: true,
      status: 'skipped',
      chunkCount: 0,
    };
  }
});

// Step 8: Prepare embedding batches
const prepareEmbeddingBatchesStep = createStep({
  id: 'prepare-embedding-batches',
  description: 'Split chunks into batches for parallel processing',
  inputSchema: z.object({
    chunks: z.array(z.object({
      text: z.string(),
      metadata: z.any().optional(),
    })),
  }),
  outputSchema: z.object({
    batches: z.array(z.object({
      batchIndex: z.number(),
      chunks: z.array(z.object({
        text: z.string(),
        metadata: z.any().optional(),
      }))
    }))
  }),
  execute: async ({ inputData, context }) => {
    const { batchSize } = workflowConfig.parallelEmbedding;
    const batches = [];
    
    context?.emit('progress', { 
      step: 'prepare-batches', 
      message: 'Preparing embedding batches...',
      timestamp: new Date().toISOString()
    });
    
    for (let i = 0; i < inputData.chunks.length; i += batchSize) {
      batches.push({
        batchIndex: Math.floor(i / batchSize),
        chunks: inputData.chunks.slice(i, i + batchSize)
      });
    }
    
    console.log(`[Batches] Created ${batches.length} batches of size ${batchSize}`);
    
    return { batches };
  }
});

// Step 9: Generate embeddings for a single batch (with retry for rate limits)
const generateBatchEmbeddingsStep = withRetry({
  id: 'generate-batch-embeddings',
  description: 'Generate embeddings for a batch of chunks',
  inputSchema: z.object({
    batchIndex: z.number(),
    chunks: z.array(z.object({
      text: z.string(),
      metadata: z.any().optional(),
    }))
  }),
  outputSchema: z.object({
    batchIndex: z.number(),
    embeddings: z.array(z.array(z.number()))
  }),
  execute: async ({ inputData }) => {
    console.log(`[Embeddings] Processing batch ${inputData.batchIndex} with ${inputData.chunks.length} chunks`);
    
    try {
      const { embeddings } = await embedMany({
        model: openai.embedding('text-embedding-3-small'),
        values: inputData.chunks.map(chunk => chunk.text),
      });
      
      return { 
        batchIndex: inputData.batchIndex,
        embeddings 
      };
    } catch (error) {
      console.error(`[Embeddings] Error in batch ${inputData.batchIndex}:`, error);
      throw new Error(`Failed to generate embeddings for batch ${inputData.batchIndex}: ${error.message}`);
    }
  }
});

// Step 10: Combine embeddings from all batches
const combineEmbeddingsStep = createStep({
  id: 'combine-embeddings',
  description: 'Combine embeddings from parallel batches',
  inputSchema: z.object({
    batchResults: z.array(z.object({
      batchIndex: z.number(),
      embeddings: z.array(z.array(z.number()))
    }))
  }),
  outputSchema: z.object({
    embeddings: z.array(z.array(z.number()))
  }),
  execute: async ({ inputData, context }) => {
    // Sort by batch index to maintain order
    const sortedBatches = inputData.batchResults.sort((a, b) => a.batchIndex - b.batchIndex);
    
    // Flatten embeddings
    const allEmbeddings = sortedBatches.flatMap(batch => batch.embeddings);
    
    console.log(`[Embeddings] Combined ${allEmbeddings.length} embeddings from ${inputData.batchResults.length} batches`);
    
    context?.emit('progress', { 
      step: 'embeddings', 
      message: 'Embeddings generated successfully',
      timestamp: new Date().toISOString()
    });
    
    return { embeddings: allEmbeddings };
  }
});

// Step 11: Store in database (with retry for transient DB errors)
const storeInDatabaseStep = withRetry({
  id: 'store-database',
  description: 'Store document and chunks in database',
  inputSchema: z.object({
    fileName: z.string(),
    fileUrl: z.string(),
    fileType: z.string(),
    fileHash: z.string(),
    courseId: z.string(),
    courseProvided: z.boolean(),
    chunks: z.array(z.object({
      text: z.string(),
      metadata: z.any().optional(),
    })),
    embeddings: z.array(z.array(z.number())),
  }),
  outputSchema: z.object({
    documentId: z.string(),
    chunkCount: z.number(),
  }),
  execute: async ({ inputData, context }) => {
    console.log(`[Store] Storing document and ${inputData.chunks.length} chunks`);
    
    context?.emit('progress', { 
      step: 'store', 
      message: 'Storing in database...',
      timestamp: new Date().toISOString()
    });
    
    const supabase = getSupabaseClient();
    
    // Create document record
    const { data: doc, error: docError } = await supabase
      .from('docs')
      .insert({
        file_name: inputData.fileName,
        file_url: inputData.fileUrl,
        file_type: inputData.fileType,
        file_hash: inputData.fileHash,
        course_id: inputData.courseId,
        course_provided: inputData.courseProvided,
      })
      .select('id')
      .single();
    
    if (docError) {
      console.error('[Store] Document insert error:', docError);
      throw new Error('Failed to create document record');
    }
    
    // Prepare chunks for insertion
    const chunksToInsert = inputData.chunks.map((chunk, index) => ({
      doc_id: doc.id,
      content: chunk.text,
      embedding: inputData.embeddings[index],
      chunk_count: index,
    }));
    
    // Insert chunks in batches of 100
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
    
    console.log(`[Store] Successfully stored document ${doc.id} with ${chunksToInsert.length} chunks`);
    
    return { 
      documentId: doc.id, 
      chunkCount: chunksToInsert.length,
    };
  }
});

// Step 12: Final success step
const finalSuccessStep = createStep({
  id: 'final-success',
  description: 'Prepare final success response',
  inputSchema: z.object({
    documentId: z.string(),
    chunkCount: z.number(),
  }),
  outputSchema: documentIngestionOutputSchema,
  execute: async ({ inputData }) => {
    return {
      success: true,
      documentId: inputData.documentId,
      status: 'created',
      chunkCount: inputData.chunkCount,
    };
  }
});

// Define sub-workflows before the main workflow to avoid inline definitions

// Sub-workflow for storage after relevance check
const embeddingAndStorageWorkflow = createWorkflow({
  id: 'embedding-and-storage',
  description: 'Generate embeddings and store in database',
  inputSchema: z.object({
    fileName: z.string(),
    fileUrl: z.string(),
    fileType: z.string(),
    fileHash: z.string(),
    courseId: z.string(),
    courseProvided: z.boolean(),
    chunks: z.array(z.object({
      text: z.string(),
      metadata: z.any().optional(),
    })),
  }),
  outputSchema: documentIngestionOutputSchema,
})
  .then(prepareEmbeddingBatchesStep)
  .then(createStep({
    id: 'generate-all-embeddings',
    description: 'Generate embeddings for all batches',
    execute: async ({ inputData, context }) => {
      const { batches } = inputData;
      
      context?.emit('progress', { 
        step: 'embeddings', 
        message: `Generating embeddings for ${batches.length} batches...`,
        timestamp: new Date().toISOString()
      });
      
      // Process batches with concurrency limit
      const maxConcurrent = workflowConfig.parallelEmbedding.maxConcurrentBatches;
      const results = [];
      
      for (let i = 0; i < batches.length; i += maxConcurrent) {
        const batchSlice = batches.slice(i, i + maxConcurrent);
        const batchPromises = batchSlice.map(batch => 
          generateBatchEmbeddingsStep.execute({ 
            inputData: batch,
            context: context as any,
            mastra: null as any
          })
        );
        
        const batchResults = await Promise.all(batchPromises);
        results.push(...batchResults);
      }
      
      // Combine results
      return await combineEmbeddingsStep.execute({ 
        inputData: { batchResults: results },
        context: context as any,
        mastra: null as any
      });
    }
  }))
  .then(storeInDatabaseStep)
  .then(finalSuccessStep)
  .commit();

// Sub-workflow for parallel embedding generation
const parallelEmbeddingWorkflow = createWorkflow({
  id: 'parallel-embedding',
  description: 'Generate embeddings in parallel batches',
  inputSchema: z.object({
    batches: z.array(z.object({
      batchIndex: z.number(),
      chunks: z.array(z.object({
        text: z.string(),
        metadata: z.any().optional(),
      }))
    }))
  }),
  outputSchema: z.object({
    embeddings: z.array(z.array(z.number()))
  })
})
  .then(createStep({
    id: 'generate-parallel-embeddings',
    description: 'Execute parallel embedding generation',
    execute: async ({ inputData, context }) => {
      context?.emit('progress', { 
        step: 'embeddings', 
        message: `Generating embeddings for ${inputData.batches.length} batches...`,
        timestamp: new Date().toISOString()
      });
      
      // Create dynamic steps for each batch
      const embeddingSteps = inputData.batches.map(batch => 
        createStep({
          id: `embed-batch-${batch.batchIndex}`,
          execute: async () => {
            return await generateBatchEmbeddingsStep.execute({ 
              inputData: batch,
              context: context as any,
              mastra: null as any
            });
          }
        })
      );
      
      // Execute all batches in parallel with concurrency limit
      const maxConcurrent = workflowConfig.parallelEmbedding.maxConcurrentBatches;
      const results = [];
      
      for (let i = 0; i < embeddingSteps.length; i += maxConcurrent) {
        const batch = embeddingSteps.slice(i, i + maxConcurrent);
        const batchResults = await Promise.all(
          batch.map(step => step.execute({ 
            inputData: {}, 
            context: context as any,
            mastra: null as any
          }))
        );
        results.push(...batchResults);
      }
      
      // Combine results
      return await combineEmbeddingsStep.execute({ 
        inputData: { batchResults: results },
        context: context as any,
        mastra: null as any
      });
    }
  }))
  .commit();

// Sub-workflow for document processing (after duplicate check)
const documentProcessingWorkflow = createWorkflow({
  id: 'document-processing',
  description: 'Process document content and generate embeddings',
  inputSchema: z.object({
    fileBuffer: z.instanceof(Buffer),
    fileName: z.string(),
    fileUrl: z.string(),
    fileType: z.string(),
    fileHash: z.string(),
    courseId: z.string(),
  }),
  outputSchema: documentIngestionOutputSchema
})
  .then(extractContentStep)
  .then(chunkDocumentStep)
  .then(checkRelevanceStep)
  .branch([
    // Not relevant - skip processing
    [async ({ inputData }) => !inputData.isRelevant, handleNotRelevantStep],
    // Relevant - continue with embeddings
    [async ({ inputData }) => inputData.isRelevant, embeddingAndStorageWorkflow]
  ])
  .commit();

// Step to pass initial data and download results to next steps
const passDataToCheckDuplicateStep = createStep({
  id: 'pass-data-to-check-duplicate',
  description: 'Combine download results with initial data',
  inputSchema: z.object({
    // From download step
    fileBuffer: z.instanceof(Buffer),
    fileHash: z.string(),
    fileSize: z.number(),
    // From initial input
    fileKey: z.string(),
    fileName: z.string(),
    fileUrl: z.string(),
    fileType: z.string(),
    courseId: z.string(),
    userId: z.string(),
    startTime: z.number(),
  }),
  outputSchema: z.object({
    fileHash: z.string(),
    courseId: z.string(),
  }),
  execute: async ({ inputData }) => {
    return {
      fileHash: inputData.fileHash,
      courseId: inputData.courseId,
    };
  }
});

// Main enhanced document ingestion workflow
export const enhancedDocumentIngestionWorkflow = createWorkflow({
  id: 'enhanced-document-ingestion',
  description: 'Document ingestion with parallel processing and native Mastra features',
  inputSchema: documentIngestionInputSchema,
  outputSchema: documentIngestionOutputSchema,
})
  .then(createStep({
    id: 'track-start-time',
    description: 'Track workflow start time',
    inputSchema: documentIngestionInputSchema,
    outputSchema: z.object({
      fileKey: z.string(),
      fileName: z.string(),
      fileUrl: z.string(),
      fileType: z.string(),
      courseId: z.string(),
      userId: z.string(),
      startTime: z.number(),
    }),
    execute: async ({ inputData }) => {
      const startTime = Date.now();
      return { ...inputData, startTime };
    }
  }))
  .then(downloadAndValidateStep)
  .map({
    // Map data from previous steps to checkDuplicateStep input
    fileHash: { step: downloadAndValidateStep, path: 'fileHash' },
    courseId: { initData: true, path: 'courseId' },
  })
  .then(checkDuplicateStep)
  .map({
    // Map all required data for branching
    isDuplicate: { step: checkDuplicateStep, path: 'isDuplicate' },
    existingDocId: { step: checkDuplicateStep, path: 'existingDocId' },
    existingFileName: { step: checkDuplicateStep, path: 'existingFileName' },
    fileBuffer: { step: downloadAndValidateStep, path: 'fileBuffer' },
    fileName: { initData: true, path: 'fileName' },
    fileUrl: { initData: true, path: 'fileUrl' },
    fileType: { initData: true, path: 'fileType' },
    fileHash: { step: downloadAndValidateStep, path: 'fileHash' },
    courseId: { initData: true, path: 'courseId' },
  })
  .branch([
    // Handle duplicate case
    [async ({ inputData }) => inputData.isDuplicate, handleDuplicateStep],
    // Continue processing new document
    [async ({ inputData }) => !inputData.isDuplicate, documentProcessingWorkflow]
  ])
  .then(createStep({
    id: 'add-processing-time',
    description: 'Calculate total processing time',
    inputSchema: z.any(),
    outputSchema: documentIngestionOutputSchema,
    execute: async ({ inputData }) => {
      // The inputData here is the output from the previous branch
      // which already has the correct format
      const processingTime = Date.now() - (inputData.startTime || 0);
      
      return {
        ...inputData,
        processingTime
      };
    }
  }))
  .commit();

// Export a wrapper function for backward compatibility
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
    const progressHandler = input.onProgress || (() => {});
    
    // If mastra instance is provided, use it to execute the workflow properly
    if (input.mastra) {
      // Get the workflow from mastra
      const workflow = input.mastra.getWorkflow('documentIngestionWorkflow');
      if (!workflow) {
        throw new Error('Document ingestion workflow not found in Mastra instance');
      }
      
      // Create a run
      const run = await workflow.createRunAsync();
      
      // Execute with input data
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
      
      // Handle workflow result
      if (result.status === 'success' && result.output) {
        return result.output;
      } else if (result.status === 'failed') {
        return {
          success: false,
          error: result.error || 'Workflow execution failed',
          status: 'failed',
        };
      } else {
        // Handle suspended or other statuses
        return {
          success: false,
          error: 'Workflow did not complete successfully',
          status: 'failed',
        };
      }
    } else {
      // Fallback: If no mastra instance, we can't execute the workflow
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

// Export the original workflow name for compatibility
export const documentIngestionWorkflow = enhancedDocumentIngestionWorkflow;