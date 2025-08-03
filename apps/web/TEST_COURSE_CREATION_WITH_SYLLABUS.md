# Course Creation with Syllabus Upload - Test Guide

## Overview

The course creation dialog now integrates with the Mastra document ingestion workflow. When a user creates a course with a syllabus:

1. **Course info extraction happens synchronously** (client-side via /api/courses/extract)
2. **Course creation happens normally** (creates course in database)
3. **Syllabus processing happens asynchronously** (via Mastra workflow with real-time progress)

## What Changed

### Before
- Course creation would process the syllabus synchronously
- No real-time progress updates
- Timeout issues with large PDFs

### After
- Course info extraction remains synchronous (fast AI extraction)
- After course creation, syllabus is sent to Mastra workflow
- Real-time progress updates via SSE
- User sees toast notifications with processing steps

## Testing Instructions

### Basic Test Flow

1. **Open Course Creation Dialog**
   - Navigate to courses page
   - Click "Create Course" button

2. **Upload Syllabus (Optional)**
   - Click "Upload syllabus to extract course info (optional)"
   - Select a PDF syllabus file
   - Wait for extraction (shows loading spinner)
   - Course code and title should auto-populate

3. **Create Course**
   - Verify/edit course code and title
   - Click "Create Course"
   - Course is created immediately
   - If syllabus was uploaded, processing begins asynchronously

4. **Monitor Progress**
   - After course creation, watch for toast notifications:
     - "Starting processing..."
     - "Downloading file..."
     - "Checking for duplicates..."
     - "Extracting content with LlamaParse..."
     - "Creating document chunks..."
     - "Checking relevance to course..."
     - "Generating embeddings..."
     - "Storing in database..."
     - "Syllabus processed successfully!"

### Test Scenarios

#### Scenario 1: Course Creation Without Syllabus
1. Create course without expanding syllabus section
2. Should create course immediately
3. No document processing occurs

#### Scenario 2: Course Creation With Syllabus
1. Expand syllabus section
2. Upload PDF
3. Wait for extraction
4. Create course
5. Monitor toast for processing progress

#### Scenario 3: Large Syllabus File
1. Upload a large PDF (10+ pages)
2. Notice extraction is quick (just gets course info)
3. After course creation, full processing happens async
4. LlamaParse step should take longer for large files

#### Scenario 4: Error Handling
1. Try uploading non-PDF file (should be rejected)
2. Try creating course with invalid data
3. Monitor error toasts

## Technical Details

### Implementation Flow

```typescript
// 1. Course info extraction (synchronous)
const response = await fetch('/api/courses/extract', {
  method: 'POST',
  body: JSON.stringify({ fileUrl })
})

// 2. Course creation (synchronous)
const createData = await createCourseMutation.mutateAsync({
  title: courseTitle,
  code: courseCode,
  uploadedFileUrl: uploadedFileUrl
})

// 3. Document processing (asynchronous with SSE)
processDocumentsWithMastra(files, createData.id)
// This connects to assistant worker's SSE endpoint
// Progress updates stream back in real-time
```

### Key Components

- **create-course-dialog.tsx**: Updated to trigger Mastra ingestion
- **processDocumentsWithMastra**: New function that handles SSE connection
- **useDocumentProcessing hook**: Manages progress state
- **Assistant Worker**: Processes documents via Mastra workflow

## Benefits

1. **No Timeouts**: Course creation completes quickly
2. **Real Progress**: Accurate status updates during processing
3. **Better UX**: Users can navigate away after course creation
4. **Error Recovery**: Failed processing doesn't affect course creation

## Common Issues

### No Progress Updates After Course Creation
- Check browser console for SSE errors
- Verify assistant worker is running
- Check NEXT_PUBLIC_ASSISTANT_WORKER_URL env var

### Extraction Failed But Course Created
- This is expected behavior
- Course creation should succeed even if syllabus processing fails
- User can upload documents later

### Processing Seems Stuck
- Check assistant worker logs
- Verify LlamaParse API key is valid
- Check if file exceeds size limits