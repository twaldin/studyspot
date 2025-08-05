# Document Ingestion Workflow Improvement Guide

## Overview
This guide provides detailed instructions for refactoring the document ingestion workflow to use Mastra's native features, enabling parallel processing, better error handling, and improved observability.

## Current Issues
1. Manual step execution bypassing Mastra's workflow engine
2. No parallel processing for chunk embeddings
3. Missing native error handling and retries
4. Poor observability with single-function execution

## Target Architecture

### 1. Native Workflow Composition
Replace the current `executeDocumentIngestion` function with proper Mastra workflow chaining:

```typescript
export const documentIngestionWorkflow = createWorkflow({
  id: 'document-ingestion',
  inputSchema: z.object({
    fileKey: z.string(),
    fileName: z.string(),
    fileUrl: z.string(),
    fileType: z.string(),
    courseId: z.string(),
    userId: z.string(),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    documentId: z.string().optional(),
    error: z.string().optional(),
    status: z.enum(['created', 'duplicate', 'skipped', 'failed']),
    chunkCount: z.number().optional(),
  })
})
  .then(downloadAndValidateStep)
  .then(checkDuplicateStep)
  .branch([
    // Early exit for duplicates
    [async ({ inputData }) => inputData.isDuplicate, handleDuplicateStep],
    // Continue processing
    [async ({ inputData }) => !inputData.isDuplicate, continueProcessingWorkflow]
  ])
  .commit();
```

### 2. Parallel Chunk Processing

#### Step 2.1: Create Batch Processing Step
```typescript
const batchEmbeddingStep = createStep({
  id: 'batch-embedding',
  inputSchema: z.object({
    chunks: z.array(z.object({
      text: z.string(),
      metadata: z.any().optional(),
    })),
    batchSize: z.number().default(10),
  }),
  outputSchema: z.object({
    embeddings: z.array(z.array(z.number())),
  }),
  execute: async ({ inputData }) => {
    const { chunks, batchSize } = inputData;
    const batches = [];
    
    // Split into batches
    for (let i = 0; i < chunks.length; i += batchSize) {
      batches.push(chunks.slice(i, i + batchSize));
    }
    
    // Create dynamic steps for each batch
    const batchSteps = batches.map((batch, index) => 
      createStep({
        id: `embed-batch-${index}`,
        outputSchema: z.object({
          embeddings: z.array(z.array(z.number())),
        }),
        execute: async () => {
          const { embeddings } = await embedMany({
            model: openai.embedding('text-embedding-3-small'),
            values: batch.map(chunk => chunk.text),
          });
          return { embeddings };
        }
      })
    );
    
    // Return steps for parallel execution
    return { batchSteps, totalBatches: batches.length };
  }
});
```

#### Step 2.2: Execute Batches in Parallel
```typescript
const parallelEmbeddingWorkflow = createWorkflow({
  id: 'parallel-embedding',
  inputSchema: z.object({
    chunks: z.array(z.object({
      text: z.string(),
      metadata: z.any().optional(),
    })),
  }),
  outputSchema: z.object({
    embeddings: z.array(z.array(z.number())),
  })
})
  .then(batchEmbeddingStep)
  .then(async ({ inputData, steps }) => {
    const { batchSteps } = steps.batchEmbedding.output;
    
    // Execute all batches in parallel
    const results = await workflow.parallel(batchSteps);
    
    // Flatten embeddings
    const allEmbeddings = results.flatMap(r => r.embeddings);
    return { embeddings: allEmbeddings };
  })
  .commit();
```

### 3. Sub-Workflows for Complex Logic

#### Step 3.1: Create Processing Sub-Workflow
```typescript
const documentProcessingWorkflow = createWorkflow({
  id: 'document-processing',
  inputSchema: z.object({
    fileBuffer: z.instanceof(Buffer),
    fileName: z.string(),
    fileType: z.string(),
    courseId: z.string(),
  }),
  outputSchema: z.object({
    chunks: z.array(z.object({
      text: z.string(),
      metadata: z.any().optional(),
    })),
    embeddings: z.array(z.array(z.number())),
    isRelevant: z.boolean(),
    courseProvided: z.boolean(),
  })
})
  .then(extractContentStep)
  .then(chunkDocumentStep)
  .then(checkRelevanceStep)
  .branch([
    // Skip embedding if not relevant
    [async ({ inputData }) => !inputData.isRelevant, skipEmbeddingStep],
    // Generate embeddings in parallel if relevant
    [async ({ inputData }) => inputData.isRelevant, parallelEmbeddingWorkflow]
  ])
  .commit();
```

### 4. Error Handling and Retries

#### Step 4.1: Add Retry Logic to Critical Steps
```typescript
const extractContentWithRetry = createStep({
  id: 'extract-content-retry',
  inputSchema: extractContentStep.inputSchema,
  outputSchema: extractContentStep.outputSchema,
  retries: 3,
  retryDelay: 1000, // 1 second
  execute: async ({ inputData, attempt }) => {
    console.log(`[Extract] Attempt ${attempt} for ${inputData.fileName}`);
    
    try {
      return await extractContentStep.execute({ inputData });
    } catch (error) {
      if (attempt < 3 && error.message.includes('rate limit')) {
        // Exponential backoff for rate limits
        await new Promise(resolve => setTimeout(resolve, attempt * 2000));
        throw error; // Retry
      }
      throw error; // Don't retry for other errors
    }
  }
});
```

### 5. Progress Tracking

#### Step 5.1: Add Progress Events
```typescript
const trackableStep = (originalStep: Step, progressMessage: string) => {
  return createStep({
    ...originalStep,
    execute: async ({ inputData, context }) => {
      // Emit progress event
      context.emit('progress', { 
        step: originalStep.id, 
        message: progressMessage,
        timestamp: new Date().toISOString()
      });
      
      const result = await originalStep.execute({ inputData, context });
      
      // Emit completion
      context.emit('progress', { 
        step: originalStep.id, 
        message: `${progressMessage} - Complete`,
        timestamp: new Date().toISOString()
      });
      
      return result;
    }
  });
};
```

### 6. Complete Refactored Workflow

```typescript
// Main workflow with all improvements
export const improvedDocumentIngestionWorkflow = createWorkflow({
  id: 'document-ingestion-v2',
  inputSchema: documentIngestionInputSchema,
  outputSchema: documentIngestionOutputSchema,
  config: {
    maxRetries: 3,
    timeout: 300000, // 5 minutes
  }
})
  // Download and validate
  .then(trackableStep(downloadAndValidateStep, 'Downloading file'))
  
  // Check duplicates
  .then(trackableStep(checkDuplicateStep, 'Checking for duplicates'))
  
  // Branch: handle duplicate or continue
  .branch([
    [async ({ inputData }) => inputData.isDuplicate, 
      createStep({
        id: 'handle-duplicate',
        execute: async ({ inputData }) => ({
          success: true,
          documentId: inputData.existingDocId,
          status: 'duplicate',
          chunkCount: 0,
        })
      })
    ],
    [async ({ inputData }) => !inputData.isDuplicate,
      // Sub-workflow for processing
      createWorkflow({
        id: 'process-document-sub'
      })
        .then(trackableStep(extractContentWithRetry, 'Extracting content'))
        .then(trackableStep(chunkDocumentStep, 'Creating chunks'))
        .parallel([
          checkRelevanceStep,
          // Pre-calculate chunk metadata while checking relevance
          createStep({
            id: 'prepare-chunk-metadata',
            execute: async ({ inputData }) => {
              const metadata = inputData.chunks.map((chunk, index) => ({
                index,
                length: chunk.text.length,
                hasMetadata: !!chunk.metadata
              }));
              return { chunkMetadata: metadata };
            }
          })
        ])
        .branch([
          [async ({ inputData }) => !inputData.isRelevant,
            createStep({
              id: 'skip-not-relevant',
              execute: async () => ({
                success: true,
                status: 'skipped',
                chunkCount: 0,
              })
            })
          ],
          [async ({ inputData }) => inputData.isRelevant,
            // Parallel embedding generation
            createWorkflow({
              id: 'generate-embeddings-parallel'
            })
              .then(createStep({
                id: 'prepare-embedding-batches',
                execute: async ({ inputData }) => {
                  const BATCH_SIZE = 10;
                  const batches = [];
                  
                  for (let i = 0; i < inputData.chunks.length; i += BATCH_SIZE) {
                    batches.push({
                      batchIndex: Math.floor(i / BATCH_SIZE),
                      chunks: inputData.chunks.slice(i, i + BATCH_SIZE)
                    });
                  }
                  
                  return { batches };
                }
              }))
              .then(async ({ inputData }) => {
                // Create dynamic parallel steps
                const embeddingSteps = inputData.batches.map(batch => 
                  createStep({
                    id: `embed-batch-${batch.batchIndex}`,
                    execute: async () => {
                      const { embeddings } = await embedMany({
                        model: openai.embedding('text-embedding-3-small'),
                        values: batch.chunks.map(c => c.text),
                      });
                      return { 
                        batchIndex: batch.batchIndex,
                        embeddings 
                      };
                    }
                  })
                );
                
                // Execute in parallel
                return workflow.parallel(embeddingSteps);
              })
              .then(createStep({
                id: 'combine-embeddings',
                execute: async ({ inputData }) => {
                  // Sort by batch index and flatten
                  const sortedBatches = inputData
                    .sort((a, b) => a.batchIndex - b.batchIndex);
                  
                  const allEmbeddings = sortedBatches
                    .flatMap(batch => batch.embeddings);
                  
                  return { embeddings: allEmbeddings };
                }
              }))
              .commit()
          ]
        ])
        .then(trackableStep(storeInDatabaseStep, 'Storing in database'))
        .commit()
    ]
  ])
  .commit();
```

## Implementation Steps

### Phase 1: Preparation
1. **Backup Current Implementation**: Copy the existing workflow to `document-ingestion-workflow.backup.ts`
2. **Update Dependencies**: Ensure Mastra core is up to date
3. **Create Test Suite**: Set up integration tests for the workflow

### Phase 2: Incremental Migration
1. **Start with Workflow Structure**: Replace manual execution with `.then()` chaining
2. **Add Branching Logic**: Implement `.branch()` for conditional flows
3. **Introduce Parallel Processing**: Start with embedding generation
4. **Add Progress Tracking**: Implement event emission for UI updates
5. **Enable Retries**: Add retry logic to network-dependent steps

### Phase 3: Testing and Optimization
1. **Test Each Configuration**:
   - Single document upload
   - Bulk document upload (10+ files)
   - Duplicate handling
   - Error scenarios (network failures, invalid files)
2. **Performance Benchmarks**:
   - Measure embedding generation time (before/after parallel)
   - Track memory usage with large documents
   - Monitor Cloudflare Worker execution time
3. **Optimize Batch Sizes**:
   - Test different batch sizes (5, 10, 20) for embeddings
   - Find optimal balance between parallelism and API rate limits

## Configuration Options

### Environment Variables
```env
# Parallel processing configuration
EMBEDDING_BATCH_SIZE=10
MAX_PARALLEL_BATCHES=5
WORKFLOW_TIMEOUT_MS=300000

# Retry configuration
MAX_RETRY_ATTEMPTS=3
RETRY_DELAY_MS=1000
RETRY_BACKOFF_MULTIPLIER=2
```

### Workflow Configuration
```typescript
const workflowConfig = {
  parallelism: {
    embeddingBatchSize: parseInt(process.env.EMBEDDING_BATCH_SIZE || '10'),
    maxConcurrentBatches: parseInt(process.env.MAX_PARALLEL_BATCHES || '5'),
  },
  retries: {
    maxAttempts: parseInt(process.env.MAX_RETRY_ATTEMPTS || '3'),
    initialDelay: parseInt(process.env.RETRY_DELAY_MS || '1000'),
    backoffMultiplier: parseFloat(process.env.RETRY_BACKOFF_MULTIPLIER || '2'),
  },
  timeout: parseInt(process.env.WORKFLOW_TIMEOUT_MS || '300000'),
};
```

## Monitoring and Debugging

### 1. Workflow Events
```typescript
workflow.on('step:start', ({ stepId, timestamp }) => {
  console.log(`[Workflow] Step ${stepId} started at ${timestamp}`);
});

workflow.on('step:complete', ({ stepId, duration, output }) => {
  console.log(`[Workflow] Step ${stepId} completed in ${duration}ms`);
});

workflow.on('step:error', ({ stepId, error, attempt }) => {
  console.error(`[Workflow] Step ${stepId} failed (attempt ${attempt}):`, error);
});
```

### 2. Performance Metrics
```typescript
const metrics = {
  totalDuration: 0,
  stepDurations: new Map<string, number>(),
  parallelBatches: 0,
  embeddingsGenerated: 0,
};

// Collect metrics during execution
workflow.on('complete', ({ metrics }) => {
  console.log('Workflow Performance:', {
    totalTime: `${metrics.totalDuration}ms`,
    averageEmbeddingTime: `${metrics.totalEmbeddingTime / metrics.embeddingsGenerated}ms`,
    parallelEfficiency: `${metrics.parallelSpeedup}x`,
  });
});
```

## Common Pitfalls to Avoid

1. **Don't Create Steps Inside Loops**: Define reusable steps outside loops
2. **Handle Large Files**: Stream processing for files > 10MB
3. **Rate Limit Awareness**: Implement backoff for API calls
4. **Memory Management**: Clear large objects after use
5. **Timeout Handling**: Set appropriate timeouts for long operations

## Migration Checklist

- [ ] Backup existing implementation
- [ ] Update Mastra dependencies
- [ ] Implement basic workflow chaining
- [ ] Add conditional branching
- [ ] Implement parallel embedding generation
- [ ] Add progress tracking
- [ ] Implement retry logic
- [ ] Add comprehensive error handling
- [ ] Create integration tests
- [ ] Performance testing
- [ ] Update documentation
- [ ] Deploy to staging environment
- [ ] Monitor for 24 hours
- [ ] Deploy to production

## Expected Improvements

1. **Performance**: 5-10x faster for documents with many chunks (parallel embeddings)
2. **Reliability**: Automatic retries for transient failures
3. **Observability**: Step-level tracking and metrics
4. **Maintainability**: Modular workflow structure
5. **Scalability**: Better resource utilization with parallel processing

## Support and Questions

For questions about this implementation:
1. Check Mastra documentation: https://mastra.ai/docs
2. Review workflow examples in the Mastra repository
3. Test changes in a local environment first
4. Use the Mastra playground for debugging individual steps