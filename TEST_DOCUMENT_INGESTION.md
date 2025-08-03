# Document Ingestion Test Guide

## Overview

The document ingestion system has been migrated to use Mastra workflows with Server-Sent Events (SSE) for real-time progress updates. This eliminates the fake 2-second completion timer and provides accurate progress tracking through the entire LlamaParse extraction process.

## Architecture Changes

### Before (Old System)
1. Client uploads to UploadThing → Gets URL
2. Client calls `/api/documents/ingest` → Returns immediately
3. Server processes asynchronously with no progress updates
4. Client shows fake "success" toast after 2 seconds (even though LlamaParse is still running)

### After (New System)
1. Client uploads to UploadThing → Gets URL (unchanged)
2. Client connects to SSE endpoint `/api/documents/ingest-stream`
3. Server streams real-time progress events:
   - `step-progress`: Updates for each workflow step
   - `extraction-complete`: When LlamaParse finishes
   - `file-complete`: When file is fully processed
   - `file-error`: If processing fails
4. Client updates toast with actual progress messages

## Key Features

### 1. Real-time Progress Updates
The toast now shows accurate progress messages:
- "Downloading file..."
- "Checking for duplicates..."
- "Extracting content with LlamaParse..." (this is where it used to falsely show complete)
- "Creating document chunks..."
- "Checking relevance to course..."
- "Generating embeddings..."
- "Storing in database..."

### 2. Bulk Processing Support
Multiple files are processed sequentially with individual progress tracking:
```javascript
// SSE events for bulk upload
{ type: 'connected', totalFiles: 3 }
{ type: 'file-start', fileIndex: 0, fileName: 'lecture1.pdf' }
{ type: 'step-progress', fileIndex: 0, message: 'Extracting content with LlamaParse...' }
{ type: 'file-complete', fileIndex: 0 }
{ type: 'file-start', fileIndex: 1, fileName: 'lecture2.pdf' }
// ... continues for each file
{ type: 'complete', totalFiles: 3 }
```

### 3. Duplicate Detection
Files with identical content (same SHA256 hash) are detected and skipped:
- Returns existing document ID
- Shows "File already exists" message
- Prevents duplicate processing

### 4. Relevance Checking
AI-powered relevance validation using Claude Haiku:
- Checks if document is relevant to the course
- Identifies if it's course-provided material (lectures, syllabi)
- Skips irrelevant documents

## Testing Instructions

### Single File Upload
1. Open the file upload dialog
2. Select a single PDF or text file
3. Choose the target course
4. Click "Upload"
5. Watch the toast messages update in real-time

### Bulk File Upload
1. Open the file upload dialog
2. Drag and drop multiple files (or select multiple)
3. Choose the target course
4. Click "Upload"
5. Watch as each file is processed sequentially with progress updates

### Testing Edge Cases

#### Duplicate File
1. Upload a file
2. Wait for it to complete
3. Upload the same file again
4. Should see "File already exists" message

#### Large File Processing
1. Upload a large PDF (10+ pages)
2. Notice the "Extracting content with LlamaParse..." step takes longer
3. Toast remains accurate throughout the process

#### Mixed Success/Failure
1. Upload multiple files including:
   - Valid PDFs
   - Files already in the system (duplicates)
   - Potentially irrelevant files
2. Each file shows individual success/failure status

## Implementation Details

### Mastra Workflow Steps
```typescript
documentIngestionWorkflow
  .then(downloadAndValidateStep)      // Download and hash file
  .then(checkDuplicateStep)           // Check if file already exists
  .then(extractContentStep)           // LlamaParse extraction
  .then(chunkDocumentStep)            // Create semantic chunks
  .then(checkRelevanceStep)           // AI relevance validation
  .then(generateEmbeddingsStep)       // OpenAI embeddings
  .then(storeInDatabaseStep)          // Save to Supabase
  .commit();
```

### SSE Event Flow
```typescript
// Client connects to SSE
const response = await fetch('/api/documents/ingest-stream', {
  method: 'POST',
  body: JSON.stringify({ files, courseId, userId })
});

// Process streaming events
const reader = response.body.getReader();
// ... read and parse SSE events
```

### Progress Toast Updates
```typescript
// Document processing hook tracks progress
updateFileProgress(fileKey, "Extracting content with LlamaParse...");

// Toast shows real-time status
toast.loading(`${fileName}: ${progress}`, { id: "processing-files" });
```

## Benefits

1. **Accurate Progress**: No more premature "success" messages
2. **Better UX**: Users see exactly what's happening
3. **Error Visibility**: Clear error messages if processing fails
4. **Scalable**: Mastra workflows on Cloudflare Workers
5. **Efficient**: Duplicate detection saves processing time

## Troubleshooting

### No Progress Updates
- Check browser console for SSE connection errors
- Verify `NEXT_PUBLIC_ASSISTANT_WORKER_URL` is set correctly
- Check assistant worker logs for errors

### Processing Stuck
- Check if LlamaParse API key is valid
- Verify file size is under 32MB limit
- Check Supabase connection

### Relevance Check Failing
- Ensure course has proper title and code
- Check Anthropic API key is valid
- Review relevance checker agent logs