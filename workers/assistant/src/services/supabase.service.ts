import { createClient } from '@supabase/supabase-js';

// Supabase client for database operations
let supabaseClient: any = null;

export function getSupabaseClient() {
  if (!supabaseClient) {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase environment variables');
    }
    
    supabaseClient = createClient(supabaseUrl, supabaseServiceKey);
  }
  
  return supabaseClient;
}

export interface DocumentChunk {
  id: string;
  content: string;
  doc_id: string;
  course_id: string;
  chunk_count: number;
  embedding?: number[];
  similarity?: number;
}

export interface Document {
  id: string;
  file_name: string;
  file_type: string;
  file_url: string;
  course_id: string;
  user_id?: string;
  created_at: string;
}

export async function searchDocumentChunks(
  courseId: string,
  embedding: number[],
  limit: number = 10,
  threshold: number = 0.5
): Promise<DocumentChunk[]> {
  const supabase = getSupabaseClient();
  
  // Use the same RPC function as the original assistant API
  const { data, error } = await supabase.rpc('match_documents_by_course', {
    query_embedding: embedding,
    match_count: limit,
    match_threshold: threshold,
    filter_course_id: courseId,
  });
  
  if (error) {
    console.error('Error searching chunks:', error);
    throw new Error(`Failed to search chunks: ${error.message}`);
  }
  
  return data || [];
}

export async function getDocument(documentId: string): Promise<Document | null> {
  const supabase = getSupabaseClient();
  
  // Use the correct table name 'docs' as in the original implementation
  const { data, error } = await supabase
    .from('docs')
    .select('*')
    .eq('id', documentId)
    .single();
  
  if (error) {
    console.error('Error fetching document:', error);
    return null;
  }
  
  return data;
}

export async function getDocumentChunks(documentId: string): Promise<DocumentChunk[]> {
  const supabase = getSupabaseClient();
  
  // Use the correct column name 'doc_id' as in the original implementation
  const { data, error } = await supabase
    .from('chunks')
    .select('*')
    .eq('doc_id', documentId)
    .order('chunk_count', { ascending: true });
  
  if (error) {
    console.error('Error fetching document chunks:', error);
    throw new Error(`Failed to fetch document chunks: ${error.message}`);
  }
  
  return data || [];
}

export async function getAllDocuments(courseId: string): Promise<Document[]> {
  const supabase = getSupabaseClient();
  
  // Use the correct table name 'docs' and column name 'created_at' as in original
  const { data, error } = await supabase
    .from('docs')
    .select('*')
    .eq('course_id', courseId)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching documents:', error);
    throw new Error(`Failed to fetch documents: ${error.message}`);
  }
  
  return data || [];
}

/**
 * SupabaseService - provides database operations matching the original assistant API
 */
export class SupabaseService {
  private static client: any = null;

  /**
   * Initialize Supabase client
   */
  private static getClient() {
    if (!this.client) {
      const supabaseUrl = process.env.SUPABASE_URL;
      const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

      if (!supabaseUrl || !supabaseKey) {
        throw new Error('Missing Supabase environment variables');
      }

      this.client = getSupabaseClient();
      console.log('[SupabaseService] Client initialized');
    }

    return this.client;
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
   * Get all documents for a course
   */
  static async getAllDocumentsForCourse(courseId: string): Promise<{
    success: boolean;
    documents: Array<{
      id: string;
      fileName: string;
      fileType: string;
      uploadDate: string;
    }>;
    error?: string;
  }> {
    try {
      const documents = await getAllDocuments(courseId);
      
      return {
        success: true,
        documents: documents.map(doc => ({
          id: doc.id,
          fileName: doc.file_name,
          fileType: doc.file_type,
          uploadDate: doc.created_at
        }))
      };
    } catch (error) {
      console.error(`[SupabaseService] Error getting documents for course:`, error);
      return {
        success: false,
        documents: [],
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Get full document content by combining all chunks
   */
  static async getFullDocument(
    documentId: string,
    courseId?: string
  ): Promise<{
    success: boolean;
    content: string;
    title?: string;
    documentType?: string;
    error?: string;
  }> {
    try {
      const client = this.getClient();
      
      // Get document metadata
      const document = await getDocument(documentId);
      if (!document) {
        return {
          success: false,
          content: '',
          error: 'Document not found'
        };
      }

      // Validate course access if courseId is provided
      if (courseId && document.course_id !== courseId) {
        return {
          success: false,
          content: '',
          error: 'Document does not belong to the specified course'
        };
      }

      // Get all chunks for this document
      const chunks = await getDocumentChunks(documentId);
      
      // Combine all chunks into full content, sorted by chunk count
      const fullContent = chunks
        .sort((a, b) => a.chunk_count - b.chunk_count)
        .map(chunk => chunk.content)
        .join('\n\n');

      return {
        success: true,
        content: fullContent,
        title: document.file_name,
        documentType: document.file_type
      };

    } catch (error) {
      console.error(`[SupabaseService] Error getting full document:`, error);
      return {
        success: false,
        content: '',
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Perform vector search with embedding generation
   */
  static async performVectorSearch(
    query: string,
    courseId: string,
    limit: number = 10,
    threshold: number = 0.5
  ): Promise<{
    success: boolean;
    documents: Array<{
      id: string;
      content: string;
      doc_id: string;
      course_id: string;
      similarity?: number;
    }>;
    error?: string;
  }> {
    try {
      // Generate embedding for the search query
      const { generateEmbedding } = await import('./embedding.service.js');
      const queryEmbedding = await generateEmbedding(query);
      
      // Search for similar chunks
      const chunks = await searchDocumentChunks(courseId, queryEmbedding, limit, threshold);
      
      return {
        success: true,
        documents: chunks.map(chunk => ({
          id: chunk.id,
          content: chunk.content,
          doc_id: chunk.doc_id,
          course_id: chunk.course_id,
          similarity: chunk.similarity
        }))
      };
    } catch (error) {
      console.error(`[SupabaseService] Error in vector search:`, error);
      return {
        success: false,
        documents: [],
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
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
   * Validate if a course exists and is accessible
   */
  static async validateCourseAccess(courseId: string): Promise<boolean> {
    try {
      const client = this.getClient();
      
      const { data, error } = await client
        .from('courses')
        .select('id')
        .eq('id', courseId)
        .single();

      if (error || !data) {
        console.warn(`[SupabaseService] Course not found: ${courseId}`);
        return false;
      }

      return true;
    } catch (error) {
      console.error(`[SupabaseService] Error validating course access:`, error);
      return false;
    }
  }

  /**
   * Create a new flashcard set
   */
  static async createFlashcardSet(flashcardSetData: any): Promise<{ success: boolean; error?: string }> {
    try {
      const client = this.getClient();
      
      const { error } = await client
        .from('flashcard_sets')
        .insert(flashcardSetData);

      if (error) {
        console.error(`[SupabaseService] Error creating flashcard set:`, error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error(`[SupabaseService] Error creating flashcard set:`, error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  /**
   * Create flashcards for a set
   */
  static async createFlashcards(flashcardsData: any[]): Promise<{ success: boolean; error?: string }> {
    try {
      const client = this.getClient();
      
      const { error } = await client
        .from('flashcards')
        .insert(flashcardsData);

      if (error) {
        console.error(`[SupabaseService] Error creating flashcards:`, error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error(`[SupabaseService] Error creating flashcards:`, error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  /**
   * Delete a flashcard set and its cards
   */
  static async deleteFlashcardSet(setId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const client = this.getClient();
      
      // Delete cards first (foreign key constraint)
      await client
        .from('flashcards')
        .delete()
        .eq('set_id', setId);

      // Delete the set
      const { error } = await client
        .from('flashcard_sets')
        .delete()
        .eq('id', setId);

      if (error) {
        console.error(`[SupabaseService] Error deleting flashcard set:`, error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error(`[SupabaseService] Error deleting flashcard set:`, error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  /**
   * Create a new quiz
   */
  static async createQuiz(quizData: any): Promise<{ success: boolean; error?: string }> {
    try {
      const client = this.getClient();
      
      const { error } = await client
        .from('quizzes')
        .insert(quizData);

      if (error) {
        console.error(`[SupabaseService] Error creating quiz:`, error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error(`[SupabaseService] Error creating quiz:`, error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  /**
   * Create quiz questions
   */
  static async createQuizQuestions(questionsData: any[]): Promise<{ success: boolean; error?: string }> {
    try {
      const client = this.getClient();
      
      const { error } = await client
        .from('quiz_questions')
        .insert(questionsData);

      if (error) {
        console.error(`[SupabaseService] Error creating quiz questions:`, error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error(`[SupabaseService] Error creating quiz questions:`, error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  /**
   * Delete a quiz and its questions
   */
  static async deleteQuiz(quizId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const client = this.getClient();
      
      // Delete questions first (foreign key constraint)
      await client
        .from('quiz_questions')
        .delete()
        .eq('quiz_id', quizId);

      // Delete the quiz
      const { error } = await client
        .from('quizzes')
        .delete()
        .eq('id', quizId);

      if (error) {
        console.error(`[SupabaseService] Error deleting quiz:`, error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error(`[SupabaseService] Error deleting quiz:`, error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  /**
   * Update the last assistant message in a chat with the final content and linked resources
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
          // Store the full content including thinking tags
          messages[i].content = finalContent;
          messages[i].linked_resources = linkedResources; // Use the new format
          
          // Add streamContent for persistent tool call storage (if provided)
          if (streamContent) {
            messages[i].stream_content = streamContent;
            console.log(`[SupabaseService] Storing stream content with ${streamContent.items.length} items`);
          }
          
          // Log if thinking tags are present
          if (finalContent.includes('<thinking>')) {
            console.log(`[SupabaseService] Assistant message contains thinking tags`);
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
}