import { supabaseService } from '@/lib/services/database/supabase.service';
import { authService } from '@/lib/services/auth/auth.service';
import logger from '@/lib/logger';
import { Chat, Message } from '../chat.types';
import { Gemini, GEMINI_MODEL } from '@/lib/llamaindex-imports';

// Service types
export interface ChatSummary {
  id: string;
  title: string;
  created_at: string;
  course_id: string;
}

export interface CreateChatRequest {
  initialMessages: Array<{
    role: string;
    content: string;
    linkedDocumentIds?: string[];
  }>;
  title?: string;
}

export interface UpdateChatRequest {
  messages: Array<{
    role: string;
    content: string;
    linkedDocumentIds?: string[];
  }>;
}

export interface TitleGenerationParams {
  content: string;
  fallbackTitle?: string;
}

export class ChatServiceError extends Error {
  constructor(
    message: string,
    public code: 'UNAUTHORIZED' | 'NOT_FOUND' | 'BAD_REQUEST' | 'INTERNAL_ERROR' | 'TITLE_GENERATION_ERROR',
    public statusCode: number = 500
  ) {
    super(message);
    this.name = 'ChatServiceError';
  }
}

export class ChatService {
  private static instance: ChatService;

  static getInstance(): ChatService {
    if (!ChatService.instance) {
      ChatService.instance = new ChatService();
    }
    return ChatService.instance;
  }

  private constructor() {}

  /**
   * Get all chats for a user, filtered by their current school
   */
  async getChats(userId: string, selectedSchool: string): Promise<{ chats: ChatSummary[] }> {
    try {
      logger.info({ userId, selectedSchool }, '[ChatService] Fetching chats for user');

      const supabase = await supabaseService.createAuthenticatedClient();
      
      const { data: chats, error } = await supabase
        .from('chats')
        .select(`
          id,
          title,
          created_at,
          course_id,
          courses!inner (
            school_id
          )
        `)
        .eq('user_id', userId)
        .eq('courses.school_id', selectedSchool)
        .order('created_at', { ascending: false });

      if (error) {
        logger.error({ error, userId, selectedSchool }, '[ChatService] Supabase error fetching chats');
        throw new Error('Failed to fetch chats from database');
      }

      // Clean up the response to remove the courses data but keep course_id
      const cleanedChats: ChatSummary[] = (chats || []).map((chat: any) => ({
        id: chat.id,
        title: chat.title,
        created_at: chat.created_at,
        course_id: chat.course_id
      }));

      logger.info({ userId, selectedSchool, count: cleanedChats.length }, '[ChatService] Successfully fetched chats');
      return { chats: cleanedChats };

    } catch (error: any) {
      logger.error({ error, userId, selectedSchool }, '[ChatService] Failed to fetch chats');
      throw new Error(error.message || 'Failed to fetch chats');
    }
  }

  /**
   * Get a specific chat by ID with school verification
   */
  async getChat(chatId: string, userId: string, selectedSchool: string): Promise<{ chat: Chat }> {
    try {
      logger.info({ chatId, userId, selectedSchool }, '[ChatService] Fetching chat details');

      const supabase = await supabaseService.createAuthenticatedClient();
      
      const { data: chat, error } = await supabase
        .from('chats')
        .select(`
          *,
          courses!inner (
            school_id
          )
        `)
        .eq('id', chatId)
        .eq('user_id', userId)
        .eq('courses.school_id', selectedSchool)
        .single();

      if (error) {
        logger.error({ error, chatId, userId }, '[ChatService] Supabase error fetching chat');
        if (error.code === 'PGRST116') {
          throw new Error('Chat not found');
        }
        throw new Error('Failed to fetch chat from database');
      }

      if (!chat) {
        throw new Error('Chat not found');
      }

      // Clean up the response to remove the courses data
      const { courses, ...cleanedChat } = chat;

      // Augment messages with linked resource data
      if (cleanedChat.chats && Array.isArray(cleanedChat.chats)) {
        cleanedChat.chats = await this.augmentMessagesWithResources(cleanedChat.chats as Message[]);
      }

      logger.info({ chatId, userId }, '[ChatService] Successfully fetched chat');
      return { chat: cleanedChat };

    } catch (error: any) {
      logger.error({ error, chatId, userId }, '[ChatService] Failed to fetch chat');
      throw new Error(error.message || 'Failed to fetch chat');
    }
  }

  /**
   * Create a new chat
   */
  async createChat(
    data: CreateChatRequest,
    userId: string,
    courseId: string
  ): Promise<{ chat: Chat }> {
    try {
      logger.info({ userId, courseId, hasTitle: !!data.title }, '[ChatService] Creating new chat');

      const supabase = await supabaseService.createAuthenticatedClient();
      
      // Use provided title or generate a meaningful one
      const chatTitle = data.title || await this.generateMeaningfulTitle(data.initialMessages);

      const newChatData = {
        user_id: userId,
        title: chatTitle,
        course_id: courseId,
        chats: data.initialMessages,
      };

      const { data: createdChat, error } = await supabase
        .from('chats')
        .insert(newChatData)
        .select()
        .single();

      if (error) {
        logger.error({ error, userId, courseId }, '[ChatService] Supabase error creating chat');
        throw new Error('Failed to create chat in database');
      }

      logger.info({ chatId: createdChat.id, title: chatTitle, userId }, '[ChatService] Chat created successfully');
      return { chat: createdChat };

    } catch (error: any) {
      logger.error({ error, userId, courseId }, '[ChatService] Failed to create chat');
      throw new Error(error.message || 'Failed to create chat');
    }
  }

  /**
   * Delete a chat
   */
  async deleteChat(chatId: string, userId: string): Promise<{ success: boolean }> {
    try {
      logger.info({ chatId, userId }, '[ChatService] Deleting chat');

      const supabase = await supabaseService.createAuthenticatedClient();
      
      const { error } = await supabase
        .from('chats')
        .delete()
        .eq('id', chatId)
        .eq('user_id', userId);

      if (error) {
        logger.error({ error, chatId, userId }, '[ChatService] Supabase error deleting chat');
        throw new Error('Failed to delete chat from database');
      }

      logger.info({ chatId, userId }, '[ChatService] Chat deleted successfully');
      return { success: true };

    } catch (error: any) {
      logger.error({ error, chatId, userId }, '[ChatService] Failed to delete chat');
      throw new Error(error.message || 'Failed to delete chat');
    }
  }

  

  /**
   * Get user's selected course
   */
  async getUserSelectedCourse(userId: string): Promise<string | null> {
    try {
      const selectedCourseId = await authService.getSelectedCourse(userId);
      return selectedCourseId || null;
    } catch (error) {
      logger.error({ error, userId }, '[ChatService] Failed to get selected course for user');
      return null;
    }
  }

  /**
   * Generate a meaningful title from initial messages
   * Handles greeting detection and fallback logic
   */
  private async generateMeaningfulTitle(messages: Array<{ role: string; content: string; linkedDocumentIds?: string[] }>): Promise<string> {
    try {
      // Find the first user message
      const firstUserMessage = messages.find(msg => msg.role === 'user');
      
      if (!firstUserMessage) {
        return 'New Chat';
      }

      // If it's just a greeting, look for the next user message
      if (this.isOnlyGenericGreeting(firstUserMessage.content)) {
        const secondUserMessage = messages.find(msg => 
          msg.role === 'user' && msg !== firstUserMessage
        );
        if (secondUserMessage) {
          return this.generateGeminiTitle({ content: secondUserMessage.content });
        } else {
          return 'New Chat';
        }
      }

      // Use the first message if it's not just a greeting
      return this.generateGeminiTitle({ content: firstUserMessage.content });

    } catch (error) {
      logger.warn({ error: error instanceof Error ? error.message : 'Unknown error', messageCount: messages.length }, '[ChatService] Failed to generate meaningful title, using fallback');
      return 'New Chat';
    }
  }

  /**
   * Generate a concise title using Gemini AI
   */
  private async generateGeminiTitle(params: TitleGenerationParams): Promise<string> {
    try {
      const { content, fallbackTitle } = params;

      // Initialize Gemini with API key
      const apiKey = process.env.GOOGLE_API_KEY;
      if (!apiKey) {
        logger.error('[ChatService] Missing GOOGLE_API_KEY environment variable');
        throw new ChatServiceError('Missing GOOGLE_API_KEY', 'TITLE_GENERATION_ERROR');
      }
      
      const gemini = new Gemini({
        apiKey,
        model: GEMINI_MODEL.GEMINI_PRO_FLASH_LATEST
      });

      const prompt = `Generate a very concise title (maximum 4 words) for this chat message. The title should be specific and descriptive, never generic like 'Simple Greeting' or 'New Message'. Focus on the main topic or question. Don't use quotes. Message: "${content}"`;
      
      const response = await gemini.chat({
        messages: [{ role: 'user', content: prompt }]
      });

      // Handle the response content safely
      let responseText = '';
      if (Array.isArray(response.message.content)) {
        const textContent = response.message.content.find(
          content => 'type' in content && content.type === 'text'
        );
        responseText = textContent?.text || '';
      } else {
        responseText = response.message.content || '';
      }

      // Clean up Gemini's response
      const title = String(responseText)
        .trim()
        .replace(/["']/g, '') // Remove quotes
        .replace(/^Title:?\s*/i, '') // Remove "Title:" prefix if present
        .substring(0, 50); // Enforce max length as safety

      // Don't accept generic titles from Gemini
      if (title.toLowerCase().includes('greeting') || 
          title.toLowerCase().includes('simple') ||
          title.toLowerCase().includes('new message')) {
        throw new ChatServiceError('Generic title generated', 'TITLE_GENERATION_ERROR');
      }

      if (title) {
        logger.info({ originalContent: content.substring(0, 50), generatedTitle: title }, '[ChatService] Generated chat title');
        return title;
      }
      throw new ChatServiceError('Empty title generated', 'TITLE_GENERATION_ERROR');

    } catch (error) {
      logger.warn({ 
        error: error instanceof Error ? error.message : 'Unknown error', 
        content: params.content.substring(0, 50) 
      }, '[ChatService] Failed to generate title with Gemini, using fallback');
      
      // For greeting-only messages, always return 'New Chat'
      if (this.isOnlyGenericGreeting(params.content)) {
        return 'New Chat';
      }

      // For non-greeting content, use a cleaned version as fallback
      const fallbackTitle = params.fallbackTitle || params.content
        .split('\n')[0]
        .trim()
        .replace(/[?!.]$/, '')
        .substring(0, 50);
      
      return fallbackTitle || 'New Chat';
    }
  }

  /**
   * Check if a message is only a generic greeting
   */
  private isOnlyGenericGreeting(message: string): boolean {
    const greetings = [
      'hello', 'hi', 'hey', 'greetings', 'good morning', 
      'good afternoon', 'good evening', 'howdy', 'hi there', 'hello there'
    ];
    
    const cleanMessage = message.toLowerCase().trim();
    return greetings.some(greeting => 
      cleanMessage === greeting || 
      cleanMessage === greeting + '.' ||
      cleanMessage === greeting + '!' ||
      cleanMessage === greeting + '?'
    );
  }

  /**
   * Augment messages with full resource data from their IDs
   */
  async augmentMessagesWithResources(messages: Message[]): Promise<Message[]> {
    const supabase = await supabaseService.createAuthenticatedClient();
    const resourceIds = {
      document: new Set<string>(),
      flashcard_set: new Set<string>(),
    };

    // Collect all unique resource IDs
    messages.forEach(message => {
      if (message.role === 'assistant' && message.linkedResources) {
        message.linkedResources.forEach(resource => {
          if (resource.type === 'document') {
            resourceIds.document.add(resource.id);
          } else if (resource.type === 'flashcard_set') {
            resourceIds.flashcard_set.add(resource.id);
          }
        });
      }
    });

    if (resourceIds.document.size === 0 && resourceIds.flashcard_set.size === 0) {
      return messages;
    }

    // Fetch all resources in parallel
    const [documentRes, flashcardSetRes] = await Promise.all([
      resourceIds.document.size > 0
        ? supabase.from('documents').select('id, file_name, file_type, file_url').in('id', Array.from(resourceIds.document))
        : Promise.resolve({ data: [], error: null }),
      resourceIds.flashcard_set.size > 0
        ? supabase.from('flashcard_sets').select('id, title, description, flashcards(count)').in('id', Array.from(resourceIds.flashcard_set))
        : Promise.resolve({ data: [], error: null }),
    ]);

    if (documentRes.error) logger.error({ error: documentRes.error }, '[ChatService] Failed to fetch linked documents');
    if (flashcardSetRes.error) logger.error({ error: flashcardSetRes.error }, '[ChatService] Failed to fetch linked flashcard sets');

    // Create a lookup map for quick access
    const resourceMap = new Map<string, any>();
    documentRes.data?.forEach(doc => resourceMap.set(`document-${doc.id}`, doc));
    flashcardSetRes.data?.forEach(set => resourceMap.set(`flashcard_set-${set.id}`, set));

    // Augment the messages
    return messages.map(message => {
      if (message.role === 'assistant' && message.linkedResources) {
        const augmentedResources = message.linkedResources.map(resource => {
          const fullResource = resourceMap.get(`${resource.type}-${resource.id}`);
          if (!fullResource) return resource; // Should not happen

          return {
            ...resource,
            title: fullResource.file_name || fullResource.title,
            description: fullResource.description,
            metadata: {
              file_type: fullResource.file_type,
              file_url: fullResource.file_url,
              cardCount: fullResource.flashcards?.[0]?.count || 0,
            },
          };
        });
        return { ...message, linkedResources: augmentedResources };
      }
      return message;
    });
  }
}

// Export singleton instance
export const chatService = ChatService.getInstance();