# Document Ingestion addEventListener Error Fix

## Issue
```
[Document Ingestion] Workflow error: TypeError: Cannot read properties of undefined (reading 'addEventListener')
    at Workflow.execute (file:///Users/twaldin/dev/studyspot-ui/node_modules/.pnpm/@mastra+core@0.12.1_effect@3.16.8_openapi-types@12.1.3_react@19.1.0_zod@3.25.76/node_modules/@mastra/core/dist/chunk-XB73NRMP.js:2255:17)
```

## Root Cause
The error occurred because the `executeDocumentIngestion` wrapper function was trying to call `workflow.execute()` directly on a Mastra workflow. This is not the correct way to execute Mastra workflows. The `.execute()` method expects certain context objects (like event emitters) that weren't being provided.

## Solution

### 1. Fixed the Document Ingestion Endpoint (mastra/index.ts)
Changed from using the `executeDocumentIngestion` wrapper to proper Mastra workflow execution:

```typescript
// OLD (incorrect)
const result = await executeDocumentIngestion({
  fileKey: file.fileKey || file.fileName,
  fileUrl: file.fileUrl,
  fileName: file.fileName,
  fileType: file.fileType,
  courseId,
  userId: userId || 'anonymous',
  onProgress: sendProgress,
  mastra,
});

// NEW (correct)
const workflow = mastra.getWorkflow('documentIngestionWorkflow');
const run = await workflow.createRunAsync();

const result = await run.start({
  inputData: {
    fileKey: file.fileKey || file.fileName,
    fileName: file.fileName,
    fileUrl: file.fileUrl,
    fileType: file.fileType,
    courseId,
    userId: userId || 'anonymous',
  }
});
```

### 2. Updated the executeDocumentIngestion Wrapper
Changed the wrapper to use proper workflow execution through Mastra:

```typescript
// OLD (incorrect)
const result = await enhancedDocumentIngestionWorkflow.execute({
  input: { /* ... */ },
  mastra: input.mastra,
  emitter: { /* ... */ }
});

// NEW (correct)
const workflow = input.mastra.getWorkflow('documentIngestionWorkflow');
const run = await workflow.createRunAsync();
const result = await run.start({
  inputData: { /* ... */ }
});
```

### 3. Refactored Inline Workflows
Moved inline workflow definitions out of branch statements to ensure proper initialization:

```typescript
// Define sub-workflows at module level
const embeddingAndStorageWorkflow = createWorkflow({ /* ... */ }).commit();
const parallelEmbeddingWorkflow = createWorkflow({ /* ... */ }).commit();
const documentProcessingWorkflow = createWorkflow({ /* ... */ }).commit();

// Use them in branches
.branch([
  [condition1, workflow1],
  [condition2, workflow2]
])
```

## Key Takeaways

1. **Never call `.execute()` directly on a Mastra workflow** - Always use `createRunAsync()` and `start()`
2. **Workflows must be executed through the Mastra instance** - Get the workflow from Mastra, create a run, then start it
3. **Define sub-workflows at module level** - Avoid creating workflows inline within branch statements
4. **Progress tracking requires proper workflow execution** - The event emitter is set up automatically when using proper workflow execution

## Testing
To verify the fix works:
1. Start the assistant worker: `pnpm dev:assistant`
2. Upload a document through the UI
3. The document should process successfully without the addEventListener error