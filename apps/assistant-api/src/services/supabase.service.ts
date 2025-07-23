import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { z } from 'zod';
import { EmbeddingService } from './embedding.service.js';

// Database types matching the existing structure
export interface RetrievedDocument {
  id: string;
  doc_id: string;
  content: string;
  similarity?: number;
}

export interface DocumentResult {
  content: string;
  title?: string;
  documentType?: string;
  success: boolean;
}

export interface VectorSearchResult {
  documents: RetrievedDocument[];
  success: boolean;
}

export interface CourseDocument {
  id: string;
  title: string;
  documentType?: string;
  uploadedAt?: string;
}

export interface CourseDocumentsResult {
  documents: CourseDocument[];
  success: boolean;
}

export type CourseDocumentsResponse = CourseDocument[] | { error: string };


/**
 * Service for Supabase database operations
 * Replicates the functionality from the original assistant API
 */
export class SupabaseService {
  private static client: SupabaseClient | null = null;

  /**
   * Initialize Supabase client
   */
  private static getClient(): SupabaseClient {
    if (!this.client) {
      const supabaseUrl = process.env.SUPABASE_URL;
      const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

      if (!supabaseUrl || !supabaseKey) {
        throw new Error('Missing Supabase environment variables');
      }

      this.client = createClient(supabaseUrl, supabaseKey);
      console.log('[SupabaseService] Client initialized');
    }

    return this.client;
  }

  /**
   * Get full document content by document ID
   * Reconstructs content from chunks table like the original get_full_document tool
   */
  static async getFullDocument(
    documentId: string,
    courseId?: string
  ): Promise<DocumentResult> {
    try {
      const client = this.getClient();
      
      console.log(`[SupabaseService] Fetching document: ${documentId}`);

      // First, get document metadata and validate access
      let docQuery = client
        .from('docs')
        .select('file_name, file_type, course_id')
        .eq('id', documentId)
        .single();

      const { data: docData, error: docError } = await docQuery;

      if (docError || !docData) {
        console.error(`[SupabaseService] Error fetching document metadata ${documentId}:`, docError);
        return {
          content: '',
          success: false
        };
      }

      // Validate course access if provided
      if (courseId && docData.course_id !== courseId) {
        console.warn(`[SupabaseService] Course access denied for document ${documentId}`);
        return {
          content: '',
          success: false
        };
      }

      // Get all chunks for this document and reconstruct content
      const { data: chunks, error: chunksError } = await client
        .from('chunks')
        .select('content, chunk_count')
        .eq('doc_id', documentId)
        .order('chunk_count', { ascending: true });

      if (chunksError) {
        console.error(`[SupabaseService] Error fetching chunks for document ${documentId}:`, chunksError);
        return {
          content: '',
          success: false
        };
      }

      if (!chunks || chunks.length === 0) {
        console.warn(`[SupabaseService] No chunks found for document: ${documentId}`);
        return {
          content: '',
          success: false
        };
      }

      // Reconstruct full document content from chunks
      const fullContent = chunks
        .map(chunk => chunk.content)
        .join('\n\n'); // Join chunks with double newlines

      console.log(`[SupabaseService] Successfully reconstructed document: ${documentId}, ${chunks.length} chunks, total length: ${fullContent.length}`);

      return {
        content: fullContent,
        title: docData.file_name || undefined,
        documentType: docData.file_type || undefined,
        success: true
      };

    } catch (error) {
      console.error(`[SupabaseService] Unexpected error fetching document ${documentId}:`, error);
      return {
        content: '',
        success: false
      };
    }
  }

  /**
   * Perform vector search for relevant documents
   * Replicates the vector search functionality from RetrievalService using proper embeddings
   */
  static async performVectorSearch(
    query: string,
    courseId: string,
    limit: number = 5
  ): Promise<VectorSearchResult> {
    try {
      const client = this.getClient();
      
      console.log(`[SupabaseService] Performing vector search for course: ${courseId}, query length: ${query.length}`);

      // 1. Generate embedding for the query using OpenAI (same as original API)
      const embeddingResult = await EmbeddingService.generateEmbedding(query);
      
      console.log(`[SupabaseService] Generated query embedding: ${embeddingResult.embedding.length} dimensions, ${embeddingResult.tokens} tokens`);

      // 2. Perform vector search using the same RPC function as original API
      const { data: documents, error } = await client.rpc('match_documents_by_course', {
        query_embedding: embeddingResult.embedding,
        match_count: limit,
        match_threshold: 0.5, // Same threshold as original API
        filter_course_id: courseId,
      });

      if (error) {
        console.error(`[SupabaseService] Error calling match_documents_by_course RPC:`, error);
        return {
          documents: [],
          success: false
        };
      }

      if (!documents || documents.length === 0) {
        console.log(`[SupabaseService] No relevant documents found`);
        return {
          documents: [],
          success: true
        };
      }

      const retrievedDocuments: RetrievedDocument[] = documents.map((doc: any) => ({
        id: doc.id || doc.chunk_id,
        doc_id: doc.doc_id,
        content: doc.content,
        similarity: doc.similarity || 0
      }));

      console.log(`[SupabaseService] Vector search returned ${retrievedDocuments.length} documents, top similarity: ${retrievedDocuments[0]?.similarity || 0}`);

      return {
        documents: retrievedDocuments,
        success: true
      };

    } catch (error) {
      console.error(`[SupabaseService] Unexpected error in vector search:`, error);
      return {
        documents: [],
        success: false
      };
    }
  }

  /**
   * Get course details for system prompt context
   */
  static async getCourseDetails(courseId: string): Promise<{ code: string; title: string } | null> {
    try {
      const client = this.getClient();
      
      const { data, error } = await client
        .from('courses')
        .select('code, title')
        .eq('id', courseId)
        .single();

      if (error || !data) {
        console.warn(`[SupabaseService] Could not fetch course details for: ${courseId}`);
        return null;
      }

      return {
        code: data.code,
        title: data.title
      };

    } catch (error) {
      console.error(`[SupabaseService] Error fetching course details:`, error);
      return null;
    }
  }

  /**
   * Validate that a course exists and is accessible
   */
  static async validateCourseAccess(courseId: string): Promise<boolean> {
    try {
      const client = this.getClient();
      
      const { data, error } = await client
        .from('courses')
        .select('id')
        .eq('id', courseId)
        .single();

      return !error && !!data;

    } catch (error) {
      console.error(`[SupabaseService] Error validating course access:`, error);
      return false;
    }
  }

  /**
   * Get all documents in a course
   * Returns a list of all documents with their basic information
   */
  static async getAllDocumentsInCourse(courseId: string): Promise<CourseDocumentsResponse> {
    try {
      const client = this.getClient();
      
      console.log(`[SupabaseService] Fetching all documents for course: ${courseId}`);

      const { data, error } = await client
        .from('docs')
        .select('id, file_name, file_type, created_at')
        .eq('course_id', courseId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error(`[SupabaseService] Error fetching documents for course ${courseId}:`, error);
        return { error: 'Failed to fetch course documents' };
      }

      if (!data || data.length === 0) {
        console.log(`[SupabaseService] No documents found for course: ${courseId}`);
        return [];
      }

      const documents: CourseDocument[] = data.map(doc => ({
        id: doc.id,
        title: doc.file_name || 'Untitled Document',
        documentType: doc.file_type || undefined,
        uploadedAt: doc.created_at || undefined
      }));

      console.log(`[SupabaseService] Found ${documents.length} documents for course: ${courseId}`);

      return documents;

    } catch (error) {
      console.error(`[SupabaseService] Unexpected error fetching documents for course ${courseId}:`, error);
      return { error: 'Unexpected error occurred while fetching documents' };
    }
  }


  /**
   * Check for duplicate content by file hash
   * Used during document ingestion to prevent duplicate uploads
   */
  static async checkForDuplicateContent(
    courseId: string, 
    fileHash: string
  ): Promise<{ file_name: string } | null> {
    try {
      const client = this.getClient();
      
      const { data, error } = await client
        .from('docs')
        .select('file_name')
        .eq('course_id', courseId)
        .eq('file_hash', fileHash)
        .single();

      if (error || !data) {
        return null;
      }

      return data;

    } catch (error) {
      console.error(`[SupabaseService] Error checking for duplicate content:`, error);
      return null;
    }
  }

  /**
   * Create a new document record in the database
   * Returns the document ID for further processing
   */
  static async createDocumentRecord(docData: {
    fileName: string;
    fileType: string;
    fileUrl: string;
    courseId: string;
    fileHash: string;
    courseProvided: boolean;
  }): Promise<string> {
    try {
      const client = this.getClient();
      
      const { data, error } = await client
        .from('docs')
        .insert({
          file_name: docData.fileName,
          file_type: docData.fileType,
          file_url: docData.fileUrl,
          course_id: docData.courseId,
          file_hash: docData.fileHash,
          course_provided: docData.courseProvided
        })
        .select('id')
        .single();

      if (error || !data) {
        throw new Error(`Failed to create document record: ${error?.message || 'Unknown error'}`);
      }

      return data.id;

    } catch (error) {
      console.error(`[SupabaseService] Error creating document record:`, error);
      throw error;
    }
  }

  /**
   * Insert document chunks with embeddings into the database
   * Used after document processing and embedding generation
   */
  static async insertChunks(chunks: Array<{
    doc_id: string;
    content: string;
    embedding: number[];
    chunk_count: number;
  }>): Promise<void> {
    try {
      const client = this.getClient();
      
      console.log(`[SupabaseService] Inserting ${chunks.length} chunks into database`);

      const { error } = await client
        .from('chunks')
        .insert(chunks);

      if (error) {
        throw new Error(`Failed to insert chunks: ${error.message}`);
      }

      console.log(`[SupabaseService] Successfully inserted ${chunks.length} chunks`);

    } catch (error) {
      console.error(`[SupabaseService] Error inserting chunks:`, error);
      throw error;
    }
  }

  /**
   * Check for duplicate course by course code within a school
   * Used during course creation to prevent duplicates
   */
  static async checkForDuplicateCourse(
    courseCode: string,
    schoolId: string
  ): Promise<{ id: string; title: string; code: string } | null> {
    try {
      const client = this.getClient();
      
      const { data, error } = await client
        .from('courses')
        .select('id, title, code')
        .eq('school_id', schoolId)
        .eq('code', courseCode)
        .single();

      if (error || !data) {
        return null;
      }

      return data;

    } catch (error) {
      console.error(`[SupabaseService] Error checking for duplicate course:`, error);
      return null;
    }
  }

  /**
   * Get current date formatted for prompts
   */
  static getFormattedDate(timeZone?: string): string {
    const now = new Date();
    const timeZoneToUse = timeZone || 'UTC';
    
    const timeString = new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
      timeZone: timeZoneToUse
    }).format(now).replace(' ', '').toLowerCase();
    
    const dateString = new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      timeZone: timeZoneToUse
    }).format(now);
    
    return `It is currently ${timeString} on ${dateString}.`;
  }
}