import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/lib/database.types';
import logger from '@/lib/logger';
import { API_CONSTANTS } from '@/lib/constants';
import { EmbeddingService } from './embedding.service';

/**
 * Interface for retrieved documents
 */
export interface RetrievedDocument {
  id?: string;
  doc_id: string;
  content: string;
  similarity?: number;
  metadata?: Record<string, any>;
}

/**
 * Configuration options for document retrieval
 */
export interface RetrievalOptions {
  matchCount?: number;
  matchThreshold?: number;
  includeMetadata?: boolean;
  minContentLength?: number;
  maxContentLength?: number;
}

/**
 * Result type for retrieval operations
 */
export type RetrievalResult = RetrievedDocument[] | { error: string };

/**
 * Interface for retrieval filters
 */
export interface RetrievalFilters {
  courseId?: string;
  docTypes?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  tags?: string[];
}

/**
 * Service responsible for document retrieval and ranking operations
 */
export class RetrievalService {
  /**
   * Default retrieval configuration
   */
  private static readonly DEFAULT_OPTIONS: Required<RetrievalOptions> = {
    matchCount: API_CONSTANTS.RAG_MATCH_COUNT,
    matchThreshold: API_CONSTANTS.RAG_MATCH_THRESHOLD,
    includeMetadata: true,
    minContentLength: 10,
    maxContentLength: 10000
  };

  /**
   * Retrieves relevant documents for a query using vector similarity search
   */
  static async retrieveDocuments(
    supabase: SupabaseClient<Database>,
    search_query: string,
    courseId: string,
    options: RetrievalOptions = {},
    original_query?: string
  ): Promise<RetrievalResult> {
    const config = { ...this.DEFAULT_OPTIONS, ...options };
    
    logger.info({ 
      search_query: search_query.substring(0, 100) + (search_query.length > 100 ? '...' : ''),
      courseId,
      config 
    }, "[RetrievalService] Starting document retrieval");

    try {
      // 1. Generate embedding for the query
      const embeddingResult = await EmbeddingService.generateEmbedding(search_query);
      
      logger.debug({
        queryLength: search_query.length,
        embeddingDimensions: embeddingResult.embedding.length,
        tokens: embeddingResult.tokens
      }, "[RetrievalService] Generated query embedding");

      // 2. Perform vector search
      const searchResult = await this.performVectorSearch(
        supabase,
        embeddingResult.embedding,
        courseId,
        config
      );

      if ('error' in searchResult) {
        return searchResult;
      }

      // 3. Post-process and rank documents
      const rankedDocuments = this.rankDocuments(searchResult, original_query || search_query, config);

      logger.info({
        queryLength: search_query.length,
        courseId,
        documentsFound: rankedDocuments.length,
        topSimilarity: rankedDocuments[0]?.similarity || 0
      }, "[RetrievalService] Document retrieval completed");

      return rankedDocuments;

    } catch (error) {
      logger.error({
        error,
        query: search_query.substring(0, 100),
        courseId
      }, "[RetrievalService] Error during document retrieval");
      
      return { error: "Failed to retrieve documents" };
    }
  }

  /**
   * Retrieves documents with custom embedding (useful when embedding is pre-computed)
   */
  static async retrieveDocumentsWithEmbedding(
    supabase: SupabaseClient<Database>,
    queryEmbedding: number[],
    courseId: string,
    options: RetrievalOptions = {}
  ): Promise<RetrievalResult> {
    const config = { ...this.DEFAULT_OPTIONS, ...options };
    
    logger.info({ 
      embeddingDimensions: queryEmbedding.length,
      courseId,
      config 
    }, "[RetrievalService] Starting document retrieval with pre-computed embedding");

    try {
      // Validate embedding
      if (!EmbeddingService.validateEmbedding(queryEmbedding)) {
        return { error: "Invalid query embedding provided" };
      }

      // Perform vector search
      const searchResult = await this.performVectorSearch(
        supabase,
        queryEmbedding,
        courseId,
        config
      );

      if ('error' in searchResult) {
        return searchResult;
      }

      // Post-process and rank documents
      const rankedDocuments = this.rankDocuments(searchResult, '', config);

      logger.info({
        courseId,
        documentsFound: rankedDocuments.length,
        topSimilarity: rankedDocuments[0]?.similarity || 0
      }, "[RetrievalService] Document retrieval with embedding completed");

      return rankedDocuments;

    } catch (error) {
      logger.error({
        error,
        embeddingDimensions: queryEmbedding.length,
        courseId
      }, "[RetrievalService] Error during document retrieval with embedding");
      
      return { error: "Failed to retrieve documents with embedding" };
    }
  }

  /**
   * Performs the actual vector search using Supabase RPC function
   */
  private static async performVectorSearch(
    supabase: SupabaseClient<Database>,
    queryEmbedding: number[],
    courseId: string,
    config: Required<RetrievalOptions>
  ): Promise<RetrievedDocument[] | { error: string }> {
    try {
      logger.debug({
        courseId,
        matchCount: config.matchCount,
        matchThreshold: config.matchThreshold
      }, "[RetrievalService] Performing vector search");

      const { data: documents, error: rpcError } = await supabase.rpc('match_documents_by_course', {
        query_embedding: queryEmbedding,
        match_count: config.matchCount,
        match_threshold: config.matchThreshold,
        filter_course_id: courseId,
      });

      if (rpcError) {
        logger.error({
          rpcError,
          courseId,
          matchCount: config.matchCount,
          matchThreshold: config.matchThreshold
        }, "[RetrievalService] Error calling match_documents_by_course RPC function");
        return { error: "Error searching for relevant documents" };
      }

      if (!documents || documents.length === 0) {
        logger.info({
          courseId,
          matchCount: config.matchCount,
          matchThreshold: config.matchThreshold
        }, "[RetrievalService] No relevant documents found");
        return [];
      }

      logger.debug({
        documentsFound: documents.length,
        courseId,
        documentIds: documents.map((d: RetrievedDocument) => d.doc_id).slice(0, 5)
      }, "[RetrievalService] Vector search completed successfully");

      return documents;

    } catch (error) {
      logger.error({
        error,
        courseId,
        embeddingLength: queryEmbedding.length
      }, "[RetrievalService] Unexpected error during vector search");
      
      return { error: "Unexpected error during document search" };
    }
  }

  /**
   * Ranks and filters retrieved documents based on various criteria
   */
  private static rankDocuments(
    documents: RetrievedDocument[],
    originalQuery: string,
    config: Required<RetrievalOptions>
  ): RetrievedDocument[] {
    let rankedDocuments = [...documents];

    // Filter by content length
    rankedDocuments = rankedDocuments.filter(doc => {
      const contentLength = doc.content.length;
      return contentLength >= config.minContentLength && 
             contentLength <= config.maxContentLength;
    });

    // If we have an original query, perform additional text-based ranking
    if (originalQuery) {
      rankedDocuments = this.applyTextBasedRanking(rankedDocuments, originalQuery);
    }

    // Ensure documents are sorted by similarity (highest first)
    rankedDocuments.sort((a, b) => (b.similarity || 0) - (a.similarity || 0));

    // Add metadata if requested
    if (config.includeMetadata) {
      rankedDocuments = this.enrichWithMetadata(rankedDocuments);
    }

    logger.debug({
      originalCount: documents.length,
      filteredCount: rankedDocuments.length,
      avgSimilarity: rankedDocuments.length > 0 
        ? rankedDocuments.reduce((sum, doc) => sum + (doc.similarity || 0), 0) / rankedDocuments.length 
        : 0
    }, "[RetrievalService] Document ranking completed");

    return rankedDocuments;
  }

  /**
   * Applies additional text-based ranking using keyword matching and other heuristics
   */
  private static applyTextBasedRanking(
    documents: RetrievedDocument[],
    query: string
  ): RetrievedDocument[] {
    const queryLower = query.toLowerCase();
    const queryWords = queryLower.split(/\s+/).filter(word => word.length > 2);

    return documents.map(doc => {
      const contentLower = doc.content.toLowerCase();
      let textScore = 0;

      // Exact phrase matches get highest boost
      if (contentLower.includes(queryLower)) {
        textScore += 0.5;
      }

      // Individual word matches
      const wordMatches = queryWords.filter(word => contentLower.includes(word));
      textScore += (wordMatches.length / queryWords.length) * 0.3;

      // Keyword density boost
      const totalWords = contentLower.split(/\s+/).length;
      const keywordDensity = wordMatches.length / totalWords;
      textScore += Math.min(keywordDensity * 10, 0.2); // Cap at 0.2

      // Combine with existing similarity score
      const originalSimilarity = doc.similarity || 0;
      const combinedScore = originalSimilarity + textScore;

      return {
        ...doc,
        similarity: combinedScore,
        metadata: {
          ...doc.metadata,
          originalSimilarity,
          textScore,
          wordMatches: wordMatches.length,
          keywordDensity
        }
      };
    });
  }

  /**
   * Enriches documents with additional metadata
   */
  private static enrichWithMetadata(documents: RetrievedDocument[]): RetrievedDocument[] {
    return documents.map(doc => ({
      ...doc,
      metadata: {
        ...doc.metadata,
        contentLength: doc.content.length,
        retrievalTimestamp: new Date().toISOString(),
        wordCount: doc.content.split(/\s+/).length
      }
    }));
  }

  /**
   * Retrieves documents with advanced filtering options
   */
  static async retrieveDocumentsWithFilters(
    supabase: SupabaseClient<Database>,
    query: string,
    filters: RetrievalFilters,
    options: RetrievalOptions = {}
  ): Promise<RetrievalResult> {
    if (!filters.courseId) {
      return { error: "Course ID is required for filtered retrieval" };
    }

    // For now, delegate to the main retrieval method
    // In the future, this could be extended to support more complex filtering
    return this.retrieveDocuments(supabase, query, filters.courseId, options);
  }

  /**
   * Gets similar documents based on a document ID (for finding related content)
   */
  static async getSimilarDocuments(
    supabase: SupabaseClient<Database>,
    documentId: string,
    courseId: string,
    options: RetrievalOptions = {}
  ): Promise<RetrievalResult> {
    try {
      // First, get the document's embedding
      const { data: document, error } = await supabase
        .from('docs')
        .select('embedding, content')
        .eq('id', documentId)
        .eq('course_id', courseId)
        .single();

      if (error || !document) {
        logger.error({ error, documentId, courseId }, "[RetrievalService] Error fetching document for similarity search");
        return { error: "Document not found" };
      }

      if (!document.embedding) {
        logger.warn({ documentId }, "[RetrievalService] Document has no embedding for similarity search");
        return { error: "Document has no embedding" };
      }

      // Use the document's embedding to find similar documents
      const result = await this.retrieveDocumentsWithEmbedding(
        supabase,
        document.embedding,
        courseId,
        { ...options, matchCount: (options.matchCount || 5) + 1 } // +1 to account for self-match
      );

      // Filter out the original document from results
      if (Array.isArray(result)) {
        return result.filter(doc => doc.doc_id !== documentId);
      }

      return result;

    } catch (error) {
      logger.error({ error, documentId, courseId }, "[RetrievalService] Error in similarity search");
      return { error: "Failed to find similar documents" };
    }
  }

  /**
   * Validates retrieval configuration
   */
  static validateConfig(options: RetrievalOptions): { isValid: boolean; error?: string } {
    if (options.matchCount && (options.matchCount < 1 || options.matchCount > 100)) {
      return { isValid: false, error: "Match count must be between 1 and 100" };
    }

    if (options.matchThreshold && (options.matchThreshold < 0 || options.matchThreshold > 1)) {
      return { isValid: false, error: "Match threshold must be between 0 and 1" };
    }

    if (options.minContentLength && options.minContentLength < 0) {
      return { isValid: false, error: "Minimum content length cannot be negative" };
    }

    if (options.maxContentLength && options.maxContentLength < 1) {
      return { isValid: false, error: "Maximum content length must be at least 1" };
    }

    if (options.minContentLength && options.maxContentLength && 
        options.minContentLength > options.maxContentLength) {
      return { isValid: false, error: "Minimum content length cannot exceed maximum content length" };
    }

    return { isValid: true };
  }
}