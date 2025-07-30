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

  /**
   * Create a new flashcard set record in the database
   */
  static async createFlashcardSet(setData: {
    id: string;
    title: string;
    description: string;
    course_id: string;
    user_id: string;
    created_at: string;
    updated_at: string;
  }): Promise<{ success: boolean; error?: string }> {
    try {
      const client = this.getClient();
      
      console.log(`[SupabaseService] Creating flashcard set: ${setData.title}`);

      const { error } = await client
        .from('flashcard_sets')
        .insert(setData);

      if (error) {
        console.error(`[SupabaseService] Error creating flashcard set:`, error);
        return { success: false, error: error.message };
      }

      console.log(`[SupabaseService] Successfully created flashcard set: ${setData.id}`);
      return { success: true };

    } catch (error) {
      console.error(`[SupabaseService] Unexpected error creating flashcard set:`, error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Create flashcards in the database
   */
  static async createFlashcards(flashcards: Array<{
    card_id: string;
    set_id: string;
    side1: string;
    side2: string;
    card_number: number;
  }>): Promise<{ success: boolean; error?: string }> {
    try {
      const client = this.getClient();
      
      console.log(`[SupabaseService] Creating ${flashcards.length} flashcards`);

      const { error } = await client
        .from('flashcards')
        .insert(flashcards);

      if (error) {
        console.error(`[SupabaseService] Error creating flashcards:`, error);
        return { success: false, error: error.message };
      }

      console.log(`[SupabaseService] Successfully created ${flashcards.length} flashcards`);
      return { success: true };

    } catch (error) {
      console.error(`[SupabaseService] Unexpected error creating flashcards:`, error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Delete a flashcard set and all its associated cards
   */
  static async deleteFlashcardSet(setId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const client = this.getClient();
      
      console.log(`[SupabaseService] Deleting flashcard set: ${setId}`);

      // Delete flashcards first (foreign key constraint)
      const { error: cardsError } = await client
        .from('flashcards')
        .delete()
        .eq('set_id', setId);

      if (cardsError) {
        console.error(`[SupabaseService] Error deleting flashcards:`, cardsError);
        return { success: false, error: cardsError.message };
      }

      // Delete the set
      const { error: setError } = await client
        .from('flashcard_sets')
        .delete()
        .eq('set_id', setId);

      if (setError) {
        console.error(`[SupabaseService] Error deleting flashcard set:`, setError);
        return { success: false, error: setError.message };
      }

      console.log(`[SupabaseService] Successfully deleted flashcard set: ${setId}`);
      return { success: true };

    } catch (error) {
      console.error(`[SupabaseService] Unexpected error deleting flashcard set:`, error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Update the last assistant message in a chat with the final content and linked resources
   * Extended to support stream content for persistent tool call storage
   */
  static async updateAssistantMessageInChat(
    chatId: string,
    finalContent: string,
    linkedResources: Array<{ type: 'document' | 'flashcard_set' | 'quiz'; id: string }>,
    streamContent?: {
      items: Array<
        | { type: 'text'; content: string }
        | { type: 'toolCall'; data: any }
      >;
      fullText: string;
    }
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const client = this.getClient();
      
      console.log(`[SupabaseService] Updating final assistant message in chat: ${chatId}`);

      // 1. Fetch the current chat to get the messages array
      const { data: chatData, error: fetchError } = await client
        .from('chats')
        .select('chats') // The JSONB column
        .eq('id', chatId)
        .single();

      if (fetchError || !chatData) {
        console.error(`[SupabaseService] Could not fetch chat ${chatId} for update:`, fetchError);
        return { success: false, error: 'Chat not found or could not be fetched' };
      }

      // 2. Find the last assistant message and update it
      const messages = (chatData.chats as any[] || []);
      let messageUpdated = false;
      for (let i = messages.length - 1; i >= 0; i--) {
        if (messages[i].role === 'assistant') {
          messages[i].content = finalContent;
          messages[i].linked_resources = linkedResources; // Use the new format
          
          // Add streamContent for persistent tool call storage (if provided)
          if (streamContent) {
            messages[i].stream_content = streamContent;
            console.log(`[SupabaseService] Storing stream content with ${streamContent.items.length} items`);
          }
          
          messageUpdated = true;
          break;
        }
      }

      if (!messageUpdated) {
        console.warn(`[SupabaseService] No assistant message found in chat ${chatId} to update.`);
        // This might happen in race conditions, but we can proceed to save the whole array
        // as the user message should be present.
      }

      // 3. Save the updated messages array back to the database
      const { error: updateError } = await client
        .from('chats')
        .update({ 
          chats: messages,
          updated_at: new Date().toISOString()
        })
        .eq('id', chatId);

      if (updateError) {
        console.error(`[SupabaseService] Failed to update chat ${chatId} with final message:`, updateError);
        return { success: false, error: updateError.message };
      }

      console.log(`[SupabaseService] Successfully updated chat ${chatId} with final assistant message and resources`);
      return { success: true };

    } catch (error) {
      console.error(`[SupabaseService] Unexpected error updating assistant message:`, error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Get documents by their IDs
   */
  static async getDocumentsByIds(documentIds: string[]): Promise<{
    success: boolean;
    documents?: Array<{
      id: string;
      file_name: string;
      file_type: string;
      file_url: string;
    }>;
    error?: string;
  }> {
    try {
      const client = this.getClient();
      
      const { data: documents, error } = await client
        .from('docs')
        .select('id, file_name, file_type, file_url')
        .in('id', documentIds);

      if (error) {
        console.error(`[SupabaseService] Error fetching documents:`, error);
        return { success: false, error: error.message };
      }

      return { success: true, documents: documents || [] };
    } catch (error) {
      console.error(`[SupabaseService] Unexpected error fetching documents:`, error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Get flashcard set by ID with basic info
   */
  static async getFlashcardSetById(setId: string): Promise<{
    success: boolean;
    flashcardSet?: {
      id: string;
      title: string;
      description: string;
      card_count: number;
    };
    error?: string;
  }> {
    try {
      const client = this.getClient();
      
      // Get flashcard set details
      const { data: setData, error: setError } = await client
        .from('flashcard_sets')
        .select('id, title, description')
        .eq('id', setId)
        .single();

      if (setError || !setData) {
        console.error(`[SupabaseService] Error fetching flashcard set:`, setError);
        return { success: false, error: 'Flashcard set not found' };
      }

      // Get card count
      const { count: cardCount, error: countError } = await client
        .from('flashcards')
        .select('*', { count: 'exact', head: true })
        .eq('set_id', setId);

      if (countError) {
        console.warn(`[SupabaseService] Error counting flashcards for set ${setId}:`, countError);
      }

      return { 
        success: true, 
        flashcardSet: {
          id: setData.id,
          title: setData.title,
          description: setData.description,
          card_count: cardCount || 0
        }
      };
    } catch (error) {
      console.error(`[SupabaseService] Unexpected error fetching flashcard set:`, error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Get recent flashcard sets for a user/course (most recent first)
   */
  static async getRecentFlashcardSets(userId: string, courseId: string, limit: number = 1): Promise<{
    success: boolean;
    flashcardSets?: Array<{
      id: string;
      title: string;
      created_at: string;
    }>;
    error?: string;
  }> {
    try {
      const client = this.getClient();
      
      const { data: flashcardSets, error } = await client
        .from('flashcard_sets')
        .select('id, title, created_at')
        .eq('user_id', userId)
        .eq('course_id', courseId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error(`[SupabaseService] Error fetching recent flashcard sets:`, error);
        return { success: false, error: error.message };
      }

      return { success: true, flashcardSets: flashcardSets || [] };
    } catch (error) {
      console.error(`[SupabaseService] Unexpected error fetching recent flashcard sets:`, error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Create a new quiz record in the database
   */
  static async createQuiz(quizData: {
    id: string;
    title: string;
    description: string;
    course_id: string;
    created_by: string;
    difficulty_level?: string;
    is_public?: boolean;
    total_questions: number;
    created_at: string;
    updated_at: string;
  }): Promise<{ success: boolean; error?: string }> {
    try {
      const client = this.getClient();
      
      console.log(`[SupabaseService] Creating quiz: ${quizData.title}`);

      const { error } = await client
        .from('quizzes')
        .insert(quizData);

      if (error) {
        console.error(`[SupabaseService] Error creating quiz:`, error);
        return { success: false, error: error.message };
      }

      console.log(`[SupabaseService] Successfully created quiz: ${quizData.id}`);
      return { success: true };

    } catch (error) {
      console.error(`[SupabaseService] Unexpected error creating quiz:`, error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Create quiz questions in the database
   */
  static async createQuizQuestions(questions: Array<{
    id: string;
    quiz_id: string;
    question_text: string;
    option_a: string;
    option_b: string;
    option_c: string;
    option_d: string;
    correct_answer: string;
    explanation?: string;
    order_index: number;
    created_at: string;
    updated_at: string;
  }>): Promise<{ success: boolean; error?: string }> {
    try {
      const client = this.getClient();
      
      console.log(`[SupabaseService] Creating ${questions.length} quiz questions`);

      const { error } = await client
        .from('quiz_questions')
        .insert(questions);

      if (error) {
        console.error(`[SupabaseService] Error creating quiz questions:`, error);
        return { success: false, error: error.message };
      }

      console.log(`[SupabaseService] Successfully created ${questions.length} quiz questions`);
      return { success: true };

    } catch (error) {
      console.error(`[SupabaseService] Unexpected error creating quiz questions:`, error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Delete a quiz and all its associated questions
   */
  static async deleteQuiz(quizId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const client = this.getClient();
      
      console.log(`[SupabaseService] Deleting quiz: ${quizId}`);

      // Delete questions first (foreign key constraint)
      const { error: questionsError } = await client
        .from('quiz_questions')
        .delete()
        .eq('quiz_id', quizId);

      if (questionsError) {
        console.error(`[SupabaseService] Error deleting quiz questions:`, questionsError);
        return { success: false, error: questionsError.message };
      }

      // Delete the quiz
      const { error: quizError } = await client
        .from('quizzes')
        .delete()
        .eq('id', quizId);

      if (quizError) {
        console.error(`[SupabaseService] Error deleting quiz:`, quizError);
        return { success: false, error: quizError.message };
      }

      console.log(`[SupabaseService] Successfully deleted quiz: ${quizId}`);
      return { success: true };

    } catch (error) {
      console.error(`[SupabaseService] Unexpected error deleting quiz:`, error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Get quiz by ID with basic info
   */
  static async getQuizById(quizId: string): Promise<{
    success: boolean;
    quiz?: {
      id: string;
      title: string;
      description: string;
      question_count: number;
      difficulty_level?: string;
    };
    error?: string;
  }> {
    try {
      const client = this.getClient();
      
      // Get quiz details
      const { data: quizData, error: quizError } = await client
        .from('quizzes')
        .select('id, title, description, difficulty_level')
        .eq('id', quizId)
        .single();

      if (quizError || !quizData) {
        console.error(`[SupabaseService] Error fetching quiz:`, quizError);
        return { success: false, error: 'Quiz not found' };
      }

      // Get question count
      const { count: questionCount, error: countError } = await client
        .from('quiz_questions')
        .select('*', { count: 'exact', head: true })
        .eq('quiz_id', quizId);

      if (countError) {
        console.warn(`[SupabaseService] Error counting questions for quiz ${quizId}:`, countError);
      }

      return { 
        success: true, 
        quiz: {
          id: quizData.id,
          title: quizData.title,
          description: quizData.description,
          difficulty_level: quizData.difficulty_level,
          question_count: questionCount || 0
        }
      };
    } catch (error) {
      console.error(`[SupabaseService] Unexpected error fetching quiz:`, error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Get recent quizzes for a user/course (most recent first)
   */
  static async getRecentQuizzes(userId: string, courseId: string, limit: number = 1): Promise<{
    success: boolean;
    quizzes?: Array<{
      id: string;
      title: string;
      created_at: string;
    }>;
    error?: string;
  }> {
    try {
      const client = this.getClient();
      
      const { data: quizzes, error } = await client
        .from('quizzes')
        .select('id, title, created_at')
        .eq('user_id', userId)
        .eq('course_id', courseId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error(`[SupabaseService] Error fetching recent quizzes:`, error);
        return { success: false, error: error.message };
      }

      return { success: true, quizzes: quizzes || [] };
    } catch (error) {
      console.error(`[SupabaseService] Unexpected error fetching recent quizzes:`, error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }
}