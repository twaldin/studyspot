# Document Service

A comprehensive, centralized service for managing all document operations in StudySpot. This service follows the feature-first architecture and provides a clean, type-safe interface for document CRUD operations, processing pipeline, RAG integration, and user interactions.

## Overview

The DocumentService centralizes all document-related business logic that was previously scattered across API routes and individual service files. It provides:

- **Complete CRUD Operations**: Create, read, update, delete documents with proper error handling
- **Document Processing Pipeline**: Full ingestion pipeline from upload to RAG-ready chunks
- **RAG Integration**: Semantic search capabilities using vector embeddings
- **User Interactions**: Starring, reporting, and user-specific metadata
- **Batch Operations**: Efficient bulk operations for performance
- **Type Safety**: Comprehensive TypeScript interfaces for all operations
- **Error Handling**: Consistent error types and handling strategies
- **Caching & Performance**: Built-in optimizations and caching strategies

## Architecture

```
src/features/document/
├── services/
│   ├── DocumentService.ts      # Main service class
│   └── index.ts               # Service exports
├── types/
│   └── DocumentTypes.ts       # All type definitions
├── examples/
│   └── refactored-api-route.ts # Usage examples
└── README.md                  # This file

# Existing services (integrated into DocumentService)
├── document-ingestion.service.ts
├── document-embedding.ts
├── document-relevance.ts
├── extract-document.ts
├── split-document.ts
└── document.service.ts        # Legacy service
```

## Key Features

### 1. Centralized Document Operations

All document operations are now centralized in a single service:

```typescript
import { documentService } from '@/features/document/services';

// Create document
const document = await documentService.createDocument(supabase, {
  fileName: 'lecture-notes.pdf',
  fileUrl: 'https://...',
  fileType: 'pdf',
  courseId: 'course-123'
});

// Search documents
const result = await documentService.searchDocuments(supabase, {
  courseId: 'course-123',
  limit: 20,
  starred: true
}, userId);

// Delete document
await documentService.deleteDocument(supabase, documentId);
```

### 2. Complete Processing Pipeline

Integrated document processing from upload to RAG-ready:

```typescript
// Full ingestion pipeline
const result = await documentService.ingestDocumentComplete({
  fileKey: 'upload-key',
  fileName: 'document.pdf',
  fileUrl: 'https://...',
  fileType: 'pdf',
  courseId: 'course-123'
});

// Individual processing steps
const extraction = await documentService.extractDocumentContent(filePath);
const embeddings = await documentService.generateDocumentEmbeddings(nodeTexts, fileKey);
const relevance = await documentService.checkDocumentForRelevance(courseInfo, fileName, content);
```

### 3. RAG Search Integration

Semantic search using vector embeddings:

```typescript
const ragResults = await documentService.searchDocumentsRAG(supabase, {
  query: "What is the homework assignment?",
  courseId: 'course-123',
  limit: 10,
  similarityThreshold: 0.7
});

// Results include chunks with similarity scores
ragResults.chunks.forEach(result => {
  console.log(`Similarity: ${result.similarity}`);
  console.log(`Content: ${result.content}`);
  console.log(`Document: ${result.document.file_name}`);
});
```

### 4. User Interactions

Starring and reporting with user metadata:

```typescript
// Toggle star status
await documentService.toggleDocumentStar(supabase, {
  documentId: 'doc-123',
  isStarred: true
}, userId);

// Report document
await documentService.reportDocument(supabase, {
  documentId: 'doc-123',
  reason: 'inappropriate-content'
}, userId);
```

### 5. Batch Operations

Efficient bulk operations:

```typescript
const batchResult = await documentService.performBatchOperation(supabase, {
  documentIds: ['doc-1', 'doc-2', 'doc-3'],
  operation: 'star'
}, userId);

console.log(`Success: ${batchResult.successCount}/${batchResult.totalProcessed}`);
```

### 6. Statistics & Analytics

Document insights and analytics:

```typescript
const stats = await documentService.getDocumentStatistics(supabase, courseId);
console.log(`Total documents: ${stats.totalDocuments}`);
console.log(`This week: ${stats.documentsThisWeek}`);
console.log(`File types:`, stats.fileTypeDistribution);
```

## Type System

Comprehensive TypeScript interfaces for all operations:

```typescript
// Core types
interface Document {
  id: string;
  file_name: string;
  file_url: string;
  file_type: string;
  course_id: string;
  created_at: string;
  is_starred?: boolean;
  has_reported?: boolean;
  report_count?: number;
}

// Search parameters
interface DocumentSearchParams {
  courseId?: string;
  ids?: string[];
  fileTypes?: string[];
  starred?: boolean;
  limit?: number;
  offset?: number;
  sortBy?: 'created_at' | 'file_name';
  sortOrder?: 'asc' | 'desc';
  searchTerm?: string;
}

// Processing results
interface DocumentProcessingResult {
  success: boolean;
  status: DocumentProcessingStatus;
  document?: Document;
  error?: string;
  details?: ProcessingDetails;
}
```

## Error Handling

Consistent error handling with specific error types:

```typescript
try {
  await documentService.getDocument(supabase, documentId);
} catch (error) {
  if (error instanceof DocumentError) {
    switch (error.type) {
      case DocumentErrorType.NOT_FOUND:
        // Handle document not found
        break;
      case DocumentErrorType.UNAUTHORIZED:
        // Handle unauthorized access
        break;
      case DocumentErrorType.PROCESSING_FAILED:
        // Handle processing failure
        break;
    }
  }
}
```

## Configuration

Service can be configured with custom settings:

```typescript
const documentService = DocumentService.getInstance({
  maxFileSize: 100 * 1024 * 1024, // 100MB
  allowedFileTypes: ['pdf', 'docx', 'txt'],
  chunkSize: 1024,
  chunkOverlap: 200,
  batchSize: 20,
  retryAttempts: 3
});
```

## Integration with Existing Code

### Replacing API Route Logic

**Before:**
```typescript
// API route with mixed business logic
export async function GET(request: Request) {
  // Authentication logic
  // Parameter parsing
  // Direct database queries
  // Manual user metadata handling
  // Result transformation
  // Error handling
}
```

**After:**
```typescript
// Clean API route using DocumentService
export async function GET(request: Request) {
  const { userId } = await auth();
  const { searchParams } = new URL(request.url);
  const supabase = await supabaseService.createAuthenticatedClient();
  
  const result = await documentService.searchDocuments(supabase, {
    courseId: searchParams.get('courseId'),
    limit: 20
  }, userId);
  
  return NextResponse.json({ docs: result.documents });
}
```

### Backward Compatibility

Existing code continues to work through exports:

```typescript
// Legacy imports still work
import { deleteDocument } from '@/features/document/document.service';

// New imports provide enhanced functionality
import { documentService } from '@/features/document/services';
```

## Performance Optimizations

1. **Singleton Pattern**: Single service instance across the application
2. **Batch Operations**: Process multiple documents efficiently
3. **Caching Integration**: Works with existing DataService caching
4. **Connection Pooling**: Reuses database connections
5. **Parallel Processing**: Concurrent operations where safe
6. **Lazy Loading**: Only loads required data
7. **Memory Management**: Proper cleanup of temporary files

## Testing

The service is designed for easy testing:

```typescript
describe('DocumentService', () => {
  it('should create document successfully', async () => {
    const mockSupabase = createMockSupabaseClient();
    const document = await documentService.createDocument(mockSupabase, {
      fileName: 'test.pdf',
      fileUrl: 'https://test.com',
      fileType: 'pdf',
      courseId: 'course-123'
    });
    
    expect(document.id).toBeDefined();
    expect(document.file_name).toBe('test.pdf');
  });
});
```

## Migration Guide

### For API Routes

1. Import DocumentService instead of individual functions
2. Replace direct database queries with service calls
3. Use DocumentSearchParams for type-safe parameters
4. Handle DocumentError exceptions appropriately

### For Components

1. Import from the new services directory
2. Use comprehensive search parameters
3. Handle enriched document data with user metadata
4. Leverage batch operations for better UX

### For Background Jobs

1. Use batch operations for processing multiple documents
2. Leverage comprehensive error handling
3. Use statistics methods for monitoring
4. Implement proper cleanup procedures

## Future Enhancements

The service is designed to be extensible:

- **Document Versioning**: Track document versions and changes
- **Collaboration**: Support for document collaboration features
- **Advanced Analytics**: More detailed usage analytics
- **Content Analysis**: AI-powered content categorization
- **Export/Import**: Bulk export/import functionality
- **Webhooks**: Event-driven integrations
- **Audit Trails**: Comprehensive audit logging

## Best Practices

1. **Always use the service**: Avoid direct database operations
2. **Handle errors properly**: Use DocumentError for consistent error handling
3. **Use batch operations**: For multiple document operations
4. **Validate inputs**: Use validation methods before processing
5. **Clean up resources**: Use cleanup methods for failed operations
6. **Monitor performance**: Use statistics methods for insights
7. **Follow types**: Leverage TypeScript interfaces for safety

## Support

For questions or issues with the DocumentService:

1. Check the comprehensive type definitions in DocumentTypes.ts
2. Review examples in the examples/ directory
3. Examine existing usage in refactored API routes
4. Check logs for detailed error information
5. Use the validation methods to debug issues