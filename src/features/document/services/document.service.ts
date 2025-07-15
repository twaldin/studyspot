import { SupabaseClient } from '@supabase/supabase-js';
import { clerkClient } from '@clerk/nextjs/server';
import logger from '@/lib/logger';
import { Database } from '@/lib/database.types';
import { deleteUploadThingFile, cleanupFailedIngestion } from '@/lib/services/file';

// Import existing document processing services
import { ingestDocument } from '../document-ingestion.service';
import { extractDocument } from '../extract-document';
import { splitDocumentsToNodes } from '../split-document';
import { generateEmbeddings } from '../document-embedding';
import { checkDocumentRelevance, checkCourseProvided } from '../document-relevance';

// Import types
import {
  Document,
  DocumentChunk,
  DocumentProcessingResult,
  DocumentProcessingStatus,
  DocumentIngestionParams,
  CreateDocumentParams,
  UpdateDocumentParams,
  DocumentSearchParams,
  DocumentSearchResult,
  DocumentRAGSearchParams,
  DocumentRAGSearchResult,
  DocumentStarParams,
  DocumentReportParams,
  BatchDocumentOperation,
  BatchOperationResult,
  DocumentStatistics,
  DocumentValidationResult,
  DocumentExtractionResult,
  DocumentEmbeddingResult,
  DocumentRelevanceResult,
  DocumentCleanupParams,
  DocumentAnalytics,
  DocumentError,
  DocumentErrorType,
  DocumentServiceConfig,
  DocumentMetadata,
  CourseInfo,
  DbDocument,
  DbDocumentInsert,
  DbDocumentUpdate,
  DbChunk,
  DbChunkInsert
} from '../types/DocumentTypes';

/**
 * Enhanced DocumentService that centralizes all document operations
 * Provides comprehensive CRUD operations, processing pipeline, RAG integration,
 * starring/reporting, metadata management, and batch operations
 */
export class DocumentService {
  private static instance: DocumentService;
  private config: DocumentServiceConfig;

  private constructor(config: DocumentServiceConfig = {}) {
    this.config = {
      maxFileSize: 50 * 1024 * 1024, // 50MB
      allowedFileTypes: ['pdf', 'docx', 'txt', 'md', 'csv', 'html', 'htm', 'jpg', 'jpeg', 'png', 'json'],
      chunkSize: 512,
      chunkOverlap: 100,
      embeddingModel: 'text-embedding-3-small',
      relevanceThreshold: 0.7,
      processingTimeout: 30000, // 30 seconds
      batchSize: 10,
      retryAttempts: 3,
      cacheEnabled: true,
      cacheTTL: 15 * 60 * 1000, // 15 minutes
      ...config
    };
  }

  /**
   * Singleton pattern - get or create instance
   */
  public static getInstance(config?: DocumentServiceConfig): DocumentService {
    if (!DocumentService.instance) {
      DocumentService.instance = new DocumentService(config);
    }
    return DocumentService.instance;
  }

  // ==================== CRUD OPERATIONS ====================

  /**
   * Create a new document record in the database
   */
  async createDocument(
    supabase: SupabaseClient<Database>, 
    params: CreateDocumentParams
  ): Promise<Document> {
    try {
      logger.info({ fileName: params.fileName, courseId: params.courseId }, '[DocumentService] Creating document');

      const insertData: DbDocumentInsert = {
        file_name: params.fileName,
        file_url: params.fileUrl,
        file_type: params.fileType,
        course_id: params.courseId,
        file_hash: params.fileHash || null,
        course_provided: params.courseProvided || null
      };

      const { data, error } = await supabase
        .from('docs')
        .insert(insertData)
        .select()
        .single();

      if (error) {
        logger.error({ error, params }, '[DocumentService] Failed to create document');
        throw new DocumentError(
          DocumentErrorType.DATABASE_ERROR,
          `Failed to create document: ${error.message}`,
          undefined,
          { originalError: error }
        );
      }

      logger.info({ documentId: data.id, fileName: params.fileName }, '[DocumentService] Document created successfully');
      return this.enrichDocumentWithUserData(data);
    } catch (error) {
      if (error instanceof DocumentError) throw error;
      logger.error({ error, params }, '[DocumentService] Unexpected error creating document');
      throw new DocumentError(
        DocumentErrorType.DATABASE_ERROR,
        'Unexpected error creating document',
        undefined,
        { originalError: error }
      );
    }
  }

  /**
   * Get a single document by ID
   */
  async getDocument(
    supabase: SupabaseClient<Database>, 
    documentId: string,
    userId?: string
  ): Promise<Document> {
    try {
      logger.debug({ documentId }, '[DocumentService] Fetching document');

      const { data, error } = await supabase
        .from('docs')
        .select('*')
        .eq('id', documentId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          throw new DocumentError(
            DocumentErrorType.NOT_FOUND,
            'Document not found',
            documentId
          );
        }
        logger.error({ error, documentId }, '[DocumentService] Failed to fetch document');
        throw new DocumentError(
          DocumentErrorType.DATABASE_ERROR,
          `Failed to fetch document: ${error.message}`,
          documentId,
          { originalError: error }
        );
      }

      // Enrich with user-specific data if userId provided
      const enrichedDocument = await this.enrichDocumentWithUserData(data, userId);
      logger.debug({ documentId }, '[DocumentService] Document fetched successfully');
      return enrichedDocument;
    } catch (error) {
      if (error instanceof DocumentError) throw error;
      logger.error({ error, documentId }, '[DocumentService] Unexpected error fetching document');
      throw new DocumentError(
        DocumentErrorType.DATABASE_ERROR,
        'Unexpected error fetching document',
        documentId,
        { originalError: error }
      );
    }
  }

  /**
   * Search documents with advanced filtering and pagination
   */
  async searchDocuments(
    supabase: SupabaseClient<Database>,
    params: DocumentSearchParams,
    userId?: string
  ): Promise<DocumentSearchResult> {
    try {
      logger.debug({ params }, '[DocumentService] Searching documents');

      let query = supabase.from('docs').select('*', { count: 'exact' });

      // Apply filters
      if (params.courseId) {
        query = query.eq('course_id', params.courseId);
      }

      if (params.ids && params.ids.length > 0) {
        query = query.in('id', params.ids);
      }

      if (params.fileTypes && params.fileTypes.length > 0) {
        query = query.in('file_type', params.fileTypes);
      }

      if (params.courseProvided !== undefined) {
        query = query.eq('course_provided', params.courseProvided);
      }

      if (params.searchTerm) {
        query = query.ilike('file_name', `%${params.searchTerm}%`);
      }

      // Apply sorting
      const sortBy = params.sortBy || 'created_at';
      const sortOrder = params.sortOrder || 'desc';
      query = query.order(sortBy, { ascending: sortOrder === 'asc' });

      // Apply pagination
      if (params.offset) {
        query = query.range(params.offset, (params.offset + (params.limit || 50)) - 1);
      } else if (params.limit) {
        query = query.limit(params.limit);
      }

      const { data, count, error } = await query;

      if (error) {
        logger.error({ error, params }, '[DocumentService] Failed to search documents');
        throw new DocumentError(
          DocumentErrorType.DATABASE_ERROR,
          `Failed to search documents: ${error.message}`,
          undefined,
          { originalError: error, searchParams: params }
        );
      }

      // Enrich documents with user-specific data
      const enrichedDocuments = await Promise.all(
        (data || []).map(doc => this.enrichDocumentWithUserData(doc, userId))
      );

      const result: DocumentSearchResult = {
        documents: enrichedDocuments,
        total: count || 0,
        hasMore: params.limit ? (count || 0) > (params.offset || 0) + params.limit : false
      };

      logger.info({ 
        count: result.documents.length, 
        total: result.total,
        params: params 
      }, '[DocumentService] Documents searched successfully');

      return result;
    } catch (error) {
      if (error instanceof DocumentError) throw error;
      logger.error({ error, params }, '[DocumentService] Unexpected error searching documents');
      throw new DocumentError(
        DocumentErrorType.DATABASE_ERROR,
        'Unexpected error searching documents',
        undefined,
        { originalError: error, searchParams: params }
      );
    }
  }

  /**
   * Update a document
   */
  async updateDocument(
    supabase: SupabaseClient<Database>,
    params: UpdateDocumentParams
  ): Promise<Document> {
    try {
      logger.info({ documentId: params.id }, '[DocumentService] Updating document');

      const updateData: Partial<DbDocumentUpdate> = {};
      if (params.fileName !== undefined) updateData.file_name = params.fileName;
      if (params.fileType !== undefined) updateData.file_type = params.fileType;
      if (params.courseProvided !== undefined) updateData.course_provided = params.courseProvided;

      const { data, error } = await supabase
        .from('docs')
        .update(updateData)
        .eq('id', params.id)
        .select()
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          throw new DocumentError(
            DocumentErrorType.NOT_FOUND,
            'Document not found',
            params.id
          );
        }
        logger.error({ error, params }, '[DocumentService] Failed to update document');
        throw new DocumentError(
          DocumentErrorType.DATABASE_ERROR,
          `Failed to update document: ${error.message}`,
          params.id,
          { originalError: error }
        );
      }

      logger.info({ documentId: params.id }, '[DocumentService] Document updated successfully');
      return this.enrichDocumentWithUserData(data);
    } catch (error) {
      if (error instanceof DocumentError) throw error;
      logger.error({ error, params }, '[DocumentService] Unexpected error updating document');
      throw new DocumentError(
        DocumentErrorType.DATABASE_ERROR,
        'Unexpected error updating document',
        params.id,
        { originalError: error }
      );
    }
  }

  /**
   * Delete a document and all associated data
   */
  async deleteDocument(
    supabase: SupabaseClient<Database>, 
    documentId: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      logger.info({ documentId }, '[DocumentService] Deleting document');

      // First, delete associated chunks
      const { error: chunksError } = await supabase
        .from('chunks')
        .delete()
        .eq('doc_id', documentId);

      if (chunksError) {
        logger.error({ error: chunksError, documentId }, '[DocumentService] Failed to delete chunks');
        throw new DocumentError(
          DocumentErrorType.DATABASE_ERROR,
          `Failed to delete associated chunks: ${chunksError.message}`,
          documentId,
          { originalError: chunksError }
        );
      }

      // Get the document to get its storage URL
      const { data: document, error: fetchError } = await supabase
        .from('docs')
        .select('file_url')
        .eq('id', documentId)
        .single();

      if (fetchError) {
        if (fetchError.code === 'PGRST116') {
          throw new DocumentError(
            DocumentErrorType.NOT_FOUND,
            'Document not found',
            documentId
          );
        }
        logger.error({ error: fetchError, documentId }, '[DocumentService] Failed to fetch document for deletion');
        throw new DocumentError(
          DocumentErrorType.DATABASE_ERROR,
          `Failed to fetch document: ${fetchError.message}`,
          documentId,
          { originalError: fetchError }
        );
      }

      // Delete the file from UploadThing storage
      const fileUrl = document.file_url;
      const storageResult = await deleteUploadThingFile(fileUrl);
      
      if (!storageResult.success) {
        logger.warn({ 
          documentId, 
          fileUrl, 
          error: storageResult.error 
        }, '[DocumentService] Failed to delete file from storage, but continuing with database cleanup');
      }

      // Finally delete the document record
      const { error: deleteError } = await supabase
        .from('docs')
        .delete()
        .eq('id', documentId);

      if (deleteError) {
        logger.error({ error: deleteError, documentId }, '[DocumentService] Failed to delete document record');
        throw new DocumentError(
          DocumentErrorType.DATABASE_ERROR,
          `Failed to delete document record: ${deleteError.message}`,
          documentId,
          { originalError: deleteError }
        );
      }

      logger.info({ documentId }, '[DocumentService] Document deleted successfully');
      return { success: true };
    } catch (error) {
      if (error instanceof DocumentError) {
        return { success: false, error: error.message };
      }
      logger.error({ error, documentId }, '[DocumentService] Unexpected error deleting document');
      return { success: false, error: 'Unexpected error deleting document' };
    }
  }

  // ==================== DOCUMENT PROCESSING PIPELINE ====================

  /**
   * Complete document ingestion pipeline
   */
  async ingestDocumentComplete(params: DocumentIngestionParams): Promise<DocumentProcessingResult> {
    try {
      logger.info({ 
        fileKey: params.fileKey, 
        fileName: params.fileName, 
        courseId: params.courseId 
      }, '[DocumentService] Starting complete document ingestion');

      // Use existing ingestion service
      const success = await ingestDocument(params);
      
      if (!success) {
        return {
          success: false,
          status: DocumentProcessingStatus.FAILED,
          error: 'Document ingestion failed'
        };
      }

      return {
        success: true,
        status: DocumentProcessingStatus.COMPLETED,
        details: {
          extractedContent: true,
          embeddingsGenerated: true
        }
      };
    } catch (error) {
      logger.error({ error, params }, '[DocumentService] Document ingestion failed');
      return {
        success: false,
        status: DocumentProcessingStatus.FAILED,
        error: error instanceof Error ? error.message : 'Unknown ingestion error'
      };
    }
  }

  /**
   * Extract content from a document file
   */
  async extractDocumentContent(filePath: string): Promise<DocumentExtractionResult> {
    try {
      logger.info({ filePath }, '[DocumentService] Extracting document content');
      
      const documents = await extractDocument(filePath);
      
      if (!documents || documents.length === 0) {
        return {
          success: false,
          error: 'No content extracted from document'
        };
      }

      const contentPreview = documents
        .map(doc => doc.text)
        .join('\n\n')
        .substring(0, 500) + '...';

      return {
        success: true,
        documents: documents.map(doc => ({
          text: doc.text,
          metadata: doc.metadata
        })),
        contentPreview
      };
    } catch (error) {
      logger.error({ error, filePath }, '[DocumentService] Failed to extract document content');
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown extraction error'
      };
    }
  }

  /**
   * Generate embeddings for document content
   */
  async generateDocumentEmbeddings(nodeTexts: string[], fileKey: string): Promise<DocumentEmbeddingResult> {
    try {
      logger.info({ nodeCount: nodeTexts.length, fileKey }, '[DocumentService] Generating embeddings');
      
      const embeddings = await generateEmbeddings({ nodeTexts, fileKey });
      
      if (!embeddings) {
        return {
          success: false,
          error: 'Failed to generate embeddings'
        };
      }

      return {
        success: true,
        embeddings,
        nodeCount: nodeTexts.length
      };
    } catch (error) {
      logger.error({ error, fileKey }, '[DocumentService] Failed to generate embeddings');
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown embedding error'
      };
    }
  }

  /**
   * Check document relevance to course
   */
  async checkDocumentForRelevance(
    courseInfo: CourseInfo,
    fileName: string,
    documentContent: string
  ): Promise<DocumentRelevanceResult> {
    try {
      logger.info({ 
        courseId: courseInfo.id, 
        fileName 
      }, '[DocumentService] Checking document relevance');

      const [isRelevant, isCourseProvided] = await Promise.all([
        checkDocumentRelevance(
          courseInfo.code || '', 
          courseInfo.title || '', 
          fileName, 
          documentContent
        ),
        checkCourseProvided(
          courseInfo.code || '', 
          courseInfo.title || '', 
          fileName, 
          documentContent
        )
      ]);

      return {
        isRelevant,
        isCourseProvided,
        confidence: 0.8 // Mock confidence score
      };
    } catch (error) {
      logger.error({ error, courseInfo, fileName }, '[DocumentService] Failed to check document relevance');
      return {
        isRelevant: true, // Default to allowing documents
        isCourseProvided: false,
        confidence: 0.5
      };
    }
  }

  // ==================== RAG SEARCH OPERATIONS ====================

  /**
   * Search documents using RAG (semantic similarity)
   */
  async searchDocumentsRAG(
    supabase: SupabaseClient<Database>,
    params: DocumentRAGSearchParams
  ): Promise<DocumentRAGSearchResult> {
    try {
      logger.info({ 
        query: params.query.substring(0, 100), 
        courseId: params.courseId 
      }, '[DocumentService] Performing RAG search');

      // Generate embedding for the query
      const queryEmbeddings = await generateEmbeddings({ 
        nodeTexts: [params.query], 
        fileKey: 'query' 
      });

      if (!queryEmbeddings || queryEmbeddings.length === 0) {
        throw new DocumentError(
          DocumentErrorType.EXTERNAL_API_ERROR,
          'Failed to generate query embedding'
        );
      }

      const queryEmbedding = queryEmbeddings[0];
      const limit = params.limit || 10;
      const threshold = params.similarityThreshold || 0.7;

      // Use Supabase's match_chunks function for similarity search
      const { data: chunks, error } = await supabase.rpc('match_chunks', {
        query_embedding: queryEmbedding,
        match_threshold: threshold,
        match_count: limit,
        course_filter: params.courseId
      });

      if (error) {
        logger.error({ error, params }, '[DocumentService] RAG search failed');
        throw new DocumentError(
          DocumentErrorType.DATABASE_ERROR,
          `RAG search failed: ${error.message}`,
          undefined,
          { originalError: error }
        );
      }

      // Get document information for each chunk
      const documentIds = [...new Set(chunks?.map((chunk: any) => chunk.doc_id) || [])];
      const { data: documents } = await supabase
        .from('docs')
        .select('*')
        .in('id', documentIds);

      const documentsMap = new Map(documents?.map(doc => [doc.id, doc]) || []);

      const results = (chunks || []).map((chunk: any) => ({
        chunk: {
          id: chunk.id,
          doc_id: chunk.doc_id,
          content: chunk.content,
          embedding: chunk.embedding,
          created_at: chunk.created_at,
          chunk_count: chunk.chunk_count
        },
        document: this.enrichDocumentWithUserData(documentsMap.get(chunk.doc_id)!),
        similarity: chunk.similarity,
        content: chunk.content
      }));

      logger.info({ 
        resultCount: results.length, 
        courseId: params.courseId 
      }, '[DocumentService] RAG search completed');

      return {
        chunks: results,
        totalResults: results.length
      };
    } catch (error) {
      if (error instanceof DocumentError) throw error;
      logger.error({ error, params }, '[DocumentService] Unexpected error in RAG search');
      throw new DocumentError(
        DocumentErrorType.DATABASE_ERROR,
        'Unexpected error in RAG search',
        undefined,
        { originalError: error }
      );
    }
  }

  // ==================== STARRING & REPORTING ====================

  /**
   * Toggle document star status for a user
   */
  async toggleDocumentStar(
    supabase: SupabaseClient<Database>,
    params: DocumentStarParams,
    userId: string
  ): Promise<void> {
    try {
      logger.info({ 
        documentId: params.documentId, 
        isStarred: params.isStarred, 
        userId 
      }, '[DocumentService] Toggling document star');

      // Verify document exists
      const { data: doc, error: fetchError } = await supabase
        .from('docs')
        .select('id')
        .eq('id', params.documentId)
        .single();

      if (fetchError || !doc) {
        throw new DocumentError(
          DocumentErrorType.NOT_FOUND,
          'Document not found',
          params.documentId
        );
      }

      // Update user metadata in Clerk
      const client = await clerkClient();
      const user = await client.users.getUser(userId);
      const starredDocs = (user.privateMetadata.starredDocs as string[] || []);

      let updatedStarredDocs: string[];
      if (params.isStarred) {
        updatedStarredDocs = [...new Set([...starredDocs, params.documentId])];
      } else {
        updatedStarredDocs = starredDocs.filter(id => id !== params.documentId);
      }

      await client.users.updateUserMetadata(userId, {
        privateMetadata: {
          ...user.privateMetadata,
          starredDocs: updatedStarredDocs
        }
      });

      logger.info({ 
        documentId: params.documentId, 
        isStarred: params.isStarred, 
        userId 
      }, '[DocumentService] Document star toggled successfully');
    } catch (error) {
      if (error instanceof DocumentError) throw error;
      logger.error({ error, params, userId }, '[DocumentService] Failed to toggle document star');
      throw new DocumentError(
        DocumentErrorType.DATABASE_ERROR,
        'Failed to toggle document star',
        params.documentId,
        { originalError: error }
      );
    }
  }

  /**
   * Report a document
   */
  async reportDocument(
    supabase: SupabaseClient<Database>,
    params: DocumentReportParams,
    userId: string
  ): Promise<void> {
    try {
      logger.info({ 
        documentId: params.documentId, 
        userId, 
        reason: params.reason 
      }, '[DocumentService] Reporting document');

      // Get current report count and increment it
      const { data: doc, error: fetchError } = await supabase
        .from('docs')
        .select('id') // Note: report_count not in current schema
        .eq('id', params.documentId)
        .single();

      if (fetchError || !doc) {
        throw new DocumentError(
          DocumentErrorType.NOT_FOUND,
          'Document not found',
          params.documentId
        );
      }

      // Update user metadata in Clerk to track reported documents
      const client = await clerkClient();
      const user = await client.users.getUser(userId);
      const reportedDocs = (user.privateMetadata.reportedDocs as string[] || []);

      if (!reportedDocs.includes(params.documentId)) {
        await client.users.updateUserMetadata(userId, {
          privateMetadata: {
            ...user.privateMetadata,
            reportedDocs: [...reportedDocs, params.documentId]
          }
        });
      }

      logger.info({ 
        documentId: params.documentId, 
        userId 
      }, '[DocumentService] Document reported successfully');
    } catch (error) {
      if (error instanceof DocumentError) throw error;
      logger.error({ error, params, userId }, '[DocumentService] Failed to report document');
      throw new DocumentError(
        DocumentErrorType.DATABASE_ERROR,
        'Failed to report document',
        params.documentId,
        { originalError: error }
      );
    }
  }

  // ==================== BATCH OPERATIONS ====================

  /**
   * Perform batch operations on multiple documents
   */
  async performBatchOperation(
    supabase: SupabaseClient<Database>,
    operation: BatchDocumentOperation,
    userId?: string
  ): Promise<BatchOperationResult> {
    try {
      logger.info({ 
        operation: operation.operation, 
        documentCount: operation.documentIds.length 
      }, '[DocumentService] Starting batch operation');

      const results: Array<{ documentId: string; success: boolean; error?: string }> = [];

      // Process documents in batches to avoid overwhelming the system
      const batchSize = this.config.batchSize || 10;
      for (let i = 0; i < operation.documentIds.length; i += batchSize) {
        const batch = operation.documentIds.slice(i, i + batchSize);
        
        const batchPromises = batch.map(async (documentId) => {
          try {
            switch (operation.operation) {
              case 'star':
                if (!userId) throw new Error('User ID required for star operation');
                await this.toggleDocumentStar(supabase, { 
                  documentId, 
                  isStarred: true 
                }, userId);
                break;
              
              case 'unstar':
                if (!userId) throw new Error('User ID required for unstar operation');
                await this.toggleDocumentStar(supabase, { 
                  documentId, 
                  isStarred: false 
                }, userId);
                break;
              
              case 'report':
                if (!userId) throw new Error('User ID required for report operation');
                await this.reportDocument(supabase, { 
                  documentId,
                  reason: operation.params?.reason 
                }, userId);
                break;
              
              case 'delete':
                await this.deleteDocument(supabase, documentId);
                break;
              
              case 'update':
                if (!operation.params) throw new Error('Update parameters required');
                await this.updateDocument(supabase, {
                  id: documentId,
                  ...operation.params
                });
                break;
              
              default:
                throw new Error(`Unknown operation: ${operation.operation}`);
            }

            return { documentId, success: true };
          } catch (error) {
            return { 
              documentId, 
              success: false, 
              error: error instanceof Error ? error.message : 'Unknown error' 
            };
          }
        });

        const batchResults = await Promise.all(batchPromises);
        results.push(...batchResults);
      }

      const successCount = results.filter(r => r.success).length;
      const errorCount = results.length - successCount;

      logger.info({ 
        operation: operation.operation,
        totalProcessed: results.length,
        successCount,
        errorCount
      }, '[DocumentService] Batch operation completed');

      return {
        success: errorCount === 0,
        results,
        totalProcessed: results.length,
        successCount,
        errorCount
      };
    } catch (error) {
      logger.error({ error, operation }, '[DocumentService] Batch operation failed');
      throw new DocumentError(
        DocumentErrorType.BATCH_OPERATION_FAILED,
        'Batch operation failed',
        undefined,
        { originalError: error, operation }
      );
    }
  }

  // ==================== STATISTICS & ANALYTICS ====================

  /**
   * Get document statistics for a course
   */
  async getDocumentStatistics(
    supabase: SupabaseClient<Database>,
    courseId: string
  ): Promise<DocumentStatistics> {
    try {
      logger.info({ courseId }, '[DocumentService] Fetching document statistics');

      // Get total documents
      const { count: totalDocuments } = await supabase
        .from('docs')
        .select('*', { count: 'exact', head: true })
        .eq('course_id', courseId);

      // Get documents from this week
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      
      const { count: documentsThisWeek } = await supabase
        .from('docs')
        .select('*', { count: 'exact', head: true })
        .eq('course_id', courseId)
        .gte('created_at', oneWeekAgo.toISOString());

      // Get file type distribution
      const { data: fileTypeData } = await supabase
        .from('docs')
        .select('file_type')
        .eq('course_id', courseId);

      const fileTypeDistribution: Record<string, number> = {};
      fileTypeData?.forEach(doc => {
        fileTypeDistribution[doc.file_type] = (fileTypeDistribution[doc.file_type] || 0) + 1;
      });

      return {
        totalDocuments: totalDocuments || 0,
        documentsThisWeek: documentsThisWeek || 0,
        starredDocuments: 0, // Would need to aggregate from user metadata
        reportedDocuments: 0, // Would need to aggregate from user metadata
        processingStatus: {
          [DocumentProcessingStatus.PENDING]: 0,
          [DocumentProcessingStatus.PROCESSING]: 0,
          [DocumentProcessingStatus.COMPLETED]: totalDocuments || 0,
          [DocumentProcessingStatus.FAILED]: 0,
          [DocumentProcessingStatus.DUPLICATE]: 0,
          [DocumentProcessingStatus.NOT_RELEVANT]: 0,
          [DocumentProcessingStatus.EXTRACTION_FAILED]: 0,
          [DocumentProcessingStatus.EMBEDDING_FAILED]: 0
        },
        fileTypeDistribution
      };
    } catch (error) {
      logger.error({ error, courseId }, '[DocumentService] Failed to fetch document statistics');
      throw new DocumentError(
        DocumentErrorType.DATABASE_ERROR,
        'Failed to fetch document statistics',
        undefined,
        { originalError: error, courseId }
      );
    }
  }

  // ==================== HELPER METHODS ====================

  /**
   * Enrich document with user-specific data (starred, reported status)
   */
  private async enrichDocumentWithUserData(
    document: DbDocument, 
    userId?: string
  ): Promise<Document> {
    const enriched: Document = {
      ...document,
      is_starred: false,
      has_reported: false,
      report_count: 0 // Note: This field doesn't exist in current schema
    };

    if (userId) {
      try {
        const client = await clerkClient();
        const user = await client.users.getUser(userId);
        const starredDocs = (user.privateMetadata.starredDocs as string[] || []);
        const reportedDocs = (user.privateMetadata.reportedDocs as string[] || []);

        enriched.is_starred = starredDocs.includes(document.id);
        enriched.has_reported = reportedDocs.includes(document.id);
      } catch (error) {
        logger.warn({ error, userId, documentId: document.id }, '[DocumentService] Failed to enrich document with user data');
      }
    }

    return enriched;
  }

  /**
   * Validate document before processing
   */
  async validateDocument(
    fileName: string, 
    fileType: string, 
    fileSize?: number
  ): Promise<DocumentValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check file type
    if (!this.config.allowedFileTypes?.includes(fileType)) {
      errors.push(`File type '${fileType}' is not supported`);
    }

    // Check file size
    if (fileSize && this.config.maxFileSize && fileSize > this.config.maxFileSize) {
      errors.push(`File size exceeds maximum allowed size of ${this.config.maxFileSize} bytes`);
    }

    // Check file name
    if (!fileName || fileName.trim().length === 0) {
      errors.push('File name cannot be empty');
    }

    if (fileName.length > 255) {
      warnings.push('File name is very long and may be truncated');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      metadata: {
        fileSize
      }
    };
  }

  /**
   * Clean up document and related resources
   */
  async cleanupDocument(
    supabase: SupabaseClient<Database>,
    params: DocumentCleanupParams
  ): Promise<void> {
    try {
      logger.info({ documentId: params.documentId }, '[DocumentService] Cleaning up document');

      if (params.deleteChunks !== false) {
        await supabase
          .from('chunks')
          .delete()
          .eq('doc_id', params.documentId);
      }

      if (params.deleteFromStorage !== false) {
        const { data: doc } = await supabase
          .from('docs')
          .select('file_url')
          .eq('id', params.documentId)
          .single();

        if (doc?.file_url) {
          await deleteUploadThingFile(doc.file_url);
        }
      }

      logger.info({ documentId: params.documentId }, '[DocumentService] Document cleanup completed');
    } catch (error) {
      logger.error({ error, params }, '[DocumentService] Failed to cleanup document');
      throw new DocumentError(
        DocumentErrorType.DATABASE_ERROR,
        'Failed to cleanup document',
        params.documentId,
        { originalError: error }
      );
    }
  }
}

// Export singleton instance
export const documentService = DocumentService.getInstance();

// Export types and classes
export {
  DocumentError,
  DocumentErrorType,
  DocumentProcessingStatus
};

export type * from '../types/DocumentTypes';