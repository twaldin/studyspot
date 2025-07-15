import { Database } from '@/lib/database.types';

// Base document type from database with additional computed fields
export interface Document {
  id: string;
  file_name: string;
  file_url: string;
  file_type: string;
  course_id: string;
  created_at: string;
  file_hash?: string | null;
  course_provided?: boolean | null;
  // Computed fields (not in database)
  is_starred?: boolean;
  has_reported?: boolean;
  report_count?: number;
}

// Database types for documents
export type DbDocument = Database['public']['Tables']['docs']['Row'];
export type DbDocumentInsert = Database['public']['Tables']['docs']['Insert'];
export type DbDocumentUpdate = Database['public']['Tables']['docs']['Update'];

// Document chunk type
export interface DocumentChunk {
  id: string;
  doc_id: string;
  content: string;
  embedding: string | null;
  created_at: string;
  chunk_count?: number;
}

export type DbChunk = Database['public']['Tables']['chunks']['Row'];
export type DbChunkInsert = Database['public']['Tables']['chunks']['Insert'];

// Document processing status
export enum DocumentProcessingStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  DUPLICATE = 'duplicate',
  NOT_RELEVANT = 'not_relevant',
  EXTRACTION_FAILED = 'extraction_failed',
  EMBEDDING_FAILED = 'embedding_failed'
}

// Document processing result
export interface DocumentProcessingResult {
  success: boolean;
  status: DocumentProcessingStatus;
  document?: Document;
  error?: string;
  details?: {
    fileHash?: string;
    chunkCount?: number;
    isRelevant?: boolean;
    isCourseProvided?: boolean;
    extractedContent?: boolean;
    embeddingsGenerated?: boolean;
  };
}

// Document ingestion parameters
export interface DocumentIngestionParams {
  fileKey: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  courseId: string;
}

// Document creation parameters
export interface CreateDocumentParams {
  fileName: string;
  fileUrl: string;
  fileType: string;
  courseId: string;
  fileHash?: string;
  courseProvided?: boolean;
}

// Document update parameters
export interface UpdateDocumentParams {
  id: string;
  fileName?: string;
  fileType?: string;
  courseProvided?: boolean;
}

// Document search parameters
export interface DocumentSearchParams {
  courseId?: string;
  ids?: string[];
  fileTypes?: string[];
  starred?: boolean;
  courseProvided?: boolean;
  limit?: number;
  offset?: number;
  sortBy?: 'created_at' | 'file_name';
  sortOrder?: 'asc' | 'desc';
  searchTerm?: string;
}

// Document search result
export interface DocumentSearchResult {
  documents: Document[];
  total: number;
  hasMore: boolean;
}

// RAG search parameters
export interface DocumentRAGSearchParams {
  query: string;
  courseId: string;
  limit?: number;
  similarityThreshold?: number;
  includeMetadata?: boolean;
}

// RAG search result
export interface DocumentRAGSearchResult {
  chunks: Array<{
    chunk: DocumentChunk;
    document: Document;
    similarity: number;
    content: string;
  }>;
  totalResults: number;
}

// Document star/unstar parameters
export interface DocumentStarParams {
  documentId: string;
  isStarred: boolean;
}

// Document report parameters
export interface DocumentReportParams {
  documentId: string;
  reportedBy?: string;
  reason?: string;
}

// Batch operation parameters
export interface BatchDocumentOperation<T = any> {
  documentIds: string[];
  operation: 'star' | 'unstar' | 'report' | 'delete' | 'update';
  params?: T;
}

// Batch operation result
export interface BatchOperationResult {
  success: boolean;
  results: Array<{
    documentId: string;
    success: boolean;
    error?: string;
  }>;
  totalProcessed: number;
  successCount: number;
  errorCount: number;
}

// Document statistics
export interface DocumentStatistics {
  totalDocuments: number;
  documentsThisWeek: number;
  starredDocuments: number;
  reportedDocuments: number;
  processingStatus: Record<DocumentProcessingStatus, number>;
  fileTypeDistribution: Record<string, number>;
  averageProcessingTime?: number;
}

// Document validation result
export interface DocumentValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  metadata?: {
    fileSize?: number;
    isRelevant?: boolean;
    isDuplicate?: boolean;
    contentPreview?: string;
  };
}

// Course information for document processing
export interface CourseInfo {
  id: string;
  code?: string | null;
  title?: string | null;
}

// Document extraction result
export interface DocumentExtractionResult {
  success: boolean;
  documents?: Array<{
    text: string;
    metadata?: Record<string, any>;
  }>;
  error?: string;
  contentPreview?: string;
}

// Document embedding result
export interface DocumentEmbeddingResult {
  success: boolean;
  embeddings?: number[][];
  error?: string;
  nodeCount?: number;
}

// Document relevance check result
export interface DocumentRelevanceResult {
  isRelevant: boolean;
  isCourseProvided: boolean;
  confidence?: number;
  reasoning?: string;
}

// Document cleanup parameters
export interface DocumentCleanupParams {
  documentId: string;
  deleteFromStorage?: boolean;
  deleteChunks?: boolean;
}

// Document analytics
export interface DocumentAnalytics {
  documentId: string;
  viewCount?: number;
  downloadCount?: number;
  lastAccessed?: string;
  searchAppearances?: number;
  chatReferences?: number;
}

// Error types specific to document operations
export enum DocumentErrorType {
  NOT_FOUND = 'DOCUMENT_NOT_FOUND',
  UNAUTHORIZED = 'DOCUMENT_UNAUTHORIZED',
  PROCESSING_FAILED = 'DOCUMENT_PROCESSING_FAILED',
  UPLOAD_FAILED = 'DOCUMENT_UPLOAD_FAILED',
  EXTRACTION_FAILED = 'DOCUMENT_EXTRACTION_FAILED',
  EMBEDDING_FAILED = 'DOCUMENT_EMBEDDING_FAILED',
  VALIDATION_FAILED = 'DOCUMENT_VALIDATION_FAILED',
  DUPLICATE_CONTENT = 'DOCUMENT_DUPLICATE_CONTENT',
  NOT_RELEVANT = 'DOCUMENT_NOT_RELEVANT',
  STORAGE_ERROR = 'DOCUMENT_STORAGE_ERROR',
  DATABASE_ERROR = 'DOCUMENT_DATABASE_ERROR',
  EXTERNAL_API_ERROR = 'DOCUMENT_EXTERNAL_API_ERROR',
  BATCH_OPERATION_FAILED = 'DOCUMENT_BATCH_OPERATION_FAILED'
}

export class DocumentError extends Error {
  constructor(
    public type: DocumentErrorType,
    public message: string,
    public documentId?: string,
    public details?: Record<string, any>
  ) {
    super(message);
    this.name = 'DocumentError';
  }
}

// Service configuration
export interface DocumentServiceConfig {
  maxFileSize?: number;
  allowedFileTypes?: string[];
  chunkSize?: number;
  chunkOverlap?: number;
  embeddingModel?: string;
  relevanceThreshold?: number;
  processingTimeout?: number;
  batchSize?: number;
  retryAttempts?: number;
  cacheEnabled?: boolean;
  cacheTTL?: number;
}

// Document metadata for internal use
export interface DocumentMetadata {
  fileSize?: number;
  pageCount?: number;
  language?: string;
  extractedAt?: string;
  embeddedAt?: string;
  lastProcessed?: string;
  processingVersion?: string;
  quality?: 'high' | 'medium' | 'low';
  tags?: string[];
}

// Note: Database types are already imported and used above, no need to re-export