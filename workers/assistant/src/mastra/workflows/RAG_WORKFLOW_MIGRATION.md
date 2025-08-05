# RAG Workflow Migration Guide

## Overview
This guide explains how to migrate from the existing single-step RAG workflow to the enhanced modular version with conditional execution and parallel processing.

## Key Improvements

### 1. **Query Intent Analysis**
- Determines if RAG is needed before executing expensive operations
- Classifies query types for better response handling
- Extracts search terms automatically

### 2. **Parallel Document Search**
- Searches multiple terms simultaneously
- Deduplicates results intelligently
- Ranks by relevance across all searches

### 3. **Modular Architecture**
- Separate steps for each operation
- Better error isolation
- Improved observability

### 4. **Conditional Execution**
- Skips RAG for general chat or creative queries
- Saves resources and reduces latency
- Maintains quality for all query types

## Migration Steps

### Step 1: Update Imports

Replace the old workflow import:
```typescript
// Old
import { ragWorkflow } from './rag-workflow.js';

// New
import { enhancedRagWorkflow } from './rag-workflow-enhanced.js';
```

### Step 2: Update Workflow Execution

The enhanced workflow has the same input/output interface, making migration straightforward:

```typescript
// Both workflows use the same input
const input = {
  question: userQuestion,
  conversationHistory: history,
  courseId: selectedCourseId,
  userId: currentUserId,
  timeZone: userTimeZone,
  sessionId: chatSessionId,
  promptOverrides: overrides
};

// Old execution
const result = await ragWorkflow.execute(input);

// New execution (same interface)
const result = await enhancedRagWorkflow.execute(input);
```

### Step 3: Update Streaming Implementation

For streaming responses, update the route handler:

```typescript
// In your streaming route (e.g., routes/assistant.ts)
import { enhancedRagWorkflow } from '../mastra/workflows/rag-workflow-enhanced.js';
import { RAGWorkflowStreaming } from '../mastra/workflows/rag-workflow.js';

// The streaming class remains the same, it will use whichever workflow is active
```

### Step 4: Enable Parallel Processing

The enhanced workflow automatically uses parallel processing when multiple search terms are identified. No configuration needed.

### Step 5: Monitor Performance

Track the new metrics available in the response:

```typescript
const result = await enhancedRagWorkflow.execute(input);

// New metadata available
console.log('Query Analysis:', {
  type: result.metadata?.queryType,
  ragUsed: result.metadata?.ragUsed,
  parallelSearches: result.metadata?.parallelSearches,
  processingTime: result.metadata?.processingTime
});
```

## Testing the Migration

### 1. Test Query Intent Classification

```typescript
// Test queries that should use RAG
const ragQueries = [
  "What did the professor say about quantum mechanics?",
  "Summarize chapter 5 of the textbook",
  "What are the main topics covered in lecture 3?"
];

// Test queries that should skip RAG
const nonRagQueries = [
  "Hello, how are you?",
  "Create a study schedule for me",
  "Generate practice questions about physics"
];
```

### 2. Verify Parallel Search Performance

```typescript
// Complex query that generates multiple search terms
const complexQuery = "Compare the differences between classical and quantum mechanics as discussed in the lectures and textbook";

// Should see multiple parallel searches in logs:
// [RAG Enhanced] Starting parallel document search
// [RAG Enhanced] Found X unique documents from Y searches
```

### 3. Validate Resource Generation

```typescript
// Queries that generate resources should still work
const resourceQueries = [
  "Create flashcards for chapter 3",
  "Generate a quiz on thermodynamics"
];

// Check that resourceIds are populated in response
```

## Rollback Plan

If issues arise, you can quickly rollback:

1. Keep the old workflow file (`rag-workflow.ts`)
2. Update imports to use the old workflow
3. The streaming implementation remains compatible

## Performance Expectations

### Before (Single-Step Workflow)
- All queries go through RAG: ~2-3s average
- Sequential document retrieval
- No query analysis

### After (Enhanced Workflow)
- Chat queries skip RAG: ~500ms
- Factual queries with RAG: ~1.5-2s (parallel search)
- Better resource utilization

## Troubleshooting

### Issue: Search terms not extracted
- Check query intent analysis logs
- Verify QueryReformulationAgent is working
- May need to adjust the intent analysis prompt

### Issue: Documents not found
- Verify courseId is being passed correctly
- Check that semantic search tool has correct embedding model
- Ensure vector database has indexed documents

### Issue: Slow performance
- Check parallel search batch size
- Monitor individual step timings in logs
- Verify no sequential operations in parallel steps

## Configuration Options

### Environment Variables
```env
# Optional: Adjust parallel search settings
MAX_PARALLEL_SEARCHES=5
MAX_DOCUMENTS_TO_FETCH=3
SEARCH_CONFIDENCE_THRESHOLD=0.7
```

### Runtime Configuration
```typescript
// Adjust search behavior per request
const input = {
  ...baseInput,
  // Override default search limit
  searchConfig: {
    maxResults: 10,
    minRelevance: 0.5
  }
};
```

## Monitoring and Metrics

### Key Metrics to Track
1. **Query Classification Distribution**: What % use RAG vs direct response
2. **Parallel Search Efficiency**: Average searches per query
3. **Response Time by Query Type**: RAG vs non-RAG latency
4. **Document Relevance**: Average relevance scores

### Logging
Enhanced workflow provides detailed logging:
```
[RAG Enhanced] Analyzing query intent: <query>
[RAG Enhanced] Query intent analysis: { needsRAG: true, queryType: 'factual', searchTerms: [...] }
[RAG Enhanced] Starting parallel document search
[RAG Enhanced] Found X unique documents from Y searches
[RAG Enhanced] Generating response with document context
```

## Next Steps

1. Deploy enhanced workflow to staging
2. Run A/B tests comparing old vs new
3. Monitor performance metrics for 48 hours
4. Gradual rollout to production
5. Deprecate old workflow after validation