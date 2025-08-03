# Complete Course Creation and Document Ingestion Test Guide

## Overview

This guide tests the complete flow from course creation with syllabus upload through document ingestion with real-time progress tracking.

## Prerequisites

1. Both servers must be running:
   ```bash
   pnpm dev
   ```
   - Web app: http://localhost:3000
   - Assistant worker: http://localhost:8787

2. Environment variables configured:
   - `NEXT_PUBLIC_ASSISTANT_API_URL=http://localhost:8787`
   - All API keys (Anthropic, OpenAI, Google/Gemini)

## Test Flow

### 1. Course Creation with Syllabus

1. Navigate to the courses page
2. Click "Create Course"
3. Enter course details:
   - Course Code: `MA16200`
   - Course Title: `Calculus 2`
4. Click "Upload syllabus to extract course info (optional)"
5. Upload a PDF syllabus file
6. Watch for:
   - "Extracting course information..." spinner
   - Auto-population of course code/title if extraction succeeds
7. Click "Create Course"

### 2. Course Verification

When you click "Create Course", the following happens:

1. **Assistant Worker Verification** (new):
   - Request sent to `http://localhost:8787/courses/verify`
   - Uses Gemini 2.5 Flash with thinking mode disabled
   - Returns JSON with verification status

2. **Fallback Local Verification** (if assistant worker fails):
   - Uses the web app's Gemini integration
   - Same verification logic with disableThinking

3. **Expected Log Output**:
   ```
   [Course Verification API] Verifying course: { courseCode: 'MA16200', schoolName: 'Purdue University' }
   [Course Verification API] Verification result: { verified: true, message: 'Course verified for academic use', reason: '...' }
   ```

### 3. Document Ingestion Progress

After course creation succeeds:

1. **Automatic Syllabus Processing**:
   - SSE connection established to `/api/documents/ingest-stream`
   - Real-time progress updates in toast notifications

2. **Progress Messages** (in order):
   - "Starting processing..."
   - "Downloading file..."
   - "Checking for duplicates..."
   - "Extracting content with LlamaParse..." (longest step)
   - "Creating document chunks..."
   - "Checking relevance to course..."
   - "Generating embeddings..."
   - "Storing in database..."
   - "Syllabus processed successfully!"

3. **Expected Console Logs**:
   ```
   [Course Creation] Created course: { courseId: '...', code: 'MA16200', title: 'Calculus 2' }
   [Course Creation] Document ingestion completed: { status: 'success' }
   ```

## Troubleshooting

### Course Verification Fails
- Check assistant worker logs for errors
- Verify `GOOGLE_API_KEY` is set
- Check if Gemini API is responding

### Empty Response from Gemini
- This should be fixed with `disableThinking: true`
- If still occurring, check Gemini API status

### Document Ingestion Not Starting
- Verify SSE endpoint is accessible
- Check browser console for connection errors
- Ensure file upload completed successfully

### No Progress Updates
- Check Network tab for SSE connection
- Verify assistant worker is running
- Check for CORS errors

## Key Improvements Made

1. **Course Verification via Assistant Worker**:
   - Centralized AI configuration
   - Proper thinking mode handling
   - Fallback to local verification

2. **Fixed Gemini Empty Responses**:
   - Added `disableThinking` option to `chatCompletion`
   - Configured `thinkingBudget: 0` for JSON responses

3. **Real-time Progress Tracking**:
   - Accurate progress messages
   - No more fake 2-second timer
   - LlamaParse extraction tracked properly

## Architecture Summary

```
Web App (port 3000)
  ↓
  POST /api/courses → Create Course
  ↓
  POST http://localhost:8787/courses/verify → Verify with Assistant Worker
  ↓
  Course Created in Database
  ↓
  SSE http://localhost:8787/api/documents/ingest-stream → Document Processing
  ↓
  Real-time Progress Updates via Toast
```

## Success Criteria

✅ Course verification succeeds without empty response errors
✅ Course is created in database
✅ Syllabus processing starts automatically
✅ Progress updates appear in real-time
✅ Document is successfully ingested and searchable