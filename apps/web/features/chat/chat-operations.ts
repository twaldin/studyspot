import { supabaseService } from '@/lib/services/database/supabase.service';
import logger from '@/lib/logger';
import { Chat, Message } from './chat.types';

export interface ChatSummary {
  id: string;
  title: string;
  created_at: string;
  course_id: string;
  user_id?: string; // Added to support school-wide chat visibility
}

export interface CreateChatData {
  user_id: string;
  title: string;
  course_id: string;
  chats: Array<{
    role: string;
    content: string;
    linkedDocumentIds?: string[];
  }>;
}

/**
 * Get user's own chats (filtered by user_id) - used for sidebar
 */
export async function getChats(userId: string, selectedSchool: string): Promise<ChatSummary[]> {
    logger.info({ userId, selectedSchool }, '[ChatOperations] Fetching user chats for sidebar');

    const supabase = await supabaseService.createAuthenticatedClient();
    
    const { data: chats, error } = await supabase
      .from('chats')
      .select(`
        id,
        title,
        created_at,
        course_id,
        user_id,
        courses!inner (
          school_id
        )
      `)
      .eq('user_id', userId) // Filter by user_id for sidebar - shared chats use getChat() instead
      .eq('courses.school_id', selectedSchool)
      .order('created_at', { ascending: false });

    if (error) {
      logger.error({ error, userId, selectedSchool }, '[ChatOperations] Supabase error fetching user chats');
      throw new Error('Failed to fetch user chats from database');
    }

    // Clean up the response to remove the courses data but keep course_id and user_id
    const cleanedChats: ChatSummary[] = (chats || []).map((chat: any) => ({
      id: chat.id,
      title: chat.title,
      created_at: chat.created_at,
      course_id: chat.course_id,
      user_id: chat.user_id
    }));

    logger.info({ userId, selectedSchool, count: cleanedChats.length }, '[ChatOperations] Successfully fetched user chats');
    return cleanedChats;
}

/**
 * Get a specific chat by ID with school verification (relies on RLS for access control)
 */
export async function getChat(chatId: string, userId: string, selectedSchool: string): Promise<Chat> {
    logger.info({ chatId, userId, selectedSchool }, '[ChatOperations] Fetching chat details');

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
      // RLS will ensure only accessible chats are returned
      .eq('courses.school_id', selectedSchool)
      .single();

    if (error) {
      logger.error({ error, chatId, userId }, '[ChatOperations] Supabase error fetching chat');
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

    logger.info({ chatId, userId }, '[ChatOperations] Successfully fetched chat');
    return cleanedChat;
}

/**
 * Create a new chat
 */
export async function createChat(data: CreateChatData): Promise<Chat> {
    logger.info({ userId: data.user_id, courseId: data.course_id }, '[ChatOperations] Creating new chat');

    const supabase = await supabaseService.createAuthenticatedClient();
    
    const { data: createdChat, error } = await supabase
      .from('chats')
      .insert(data)
      .select()
      .single();

    if (error) {
      logger.error({ error, userId: data.user_id, courseId: data.course_id }, '[ChatOperations] Supabase error creating chat');
      throw new Error('Failed to create chat in database');
    }

    logger.info({ chatId: createdChat.id, title: data.title, userId: data.user_id }, '[ChatOperations] Chat created successfully');
    return createdChat;
}

/**
 * Update chat messages
 */
export async function updateChatMessages(
  chatId: string, 
  userId: string, 
  messages: Array<{
    role: string;
    content: string;
    linkedDocumentIds?: string[];
  }>
): Promise<void> {
    logger.info({ chatId, userId, messageCount: messages.length }, '[ChatOperations] Updating chat messages');

    const supabase = await supabaseService.createAuthenticatedClient();
    
    const { error } = await supabase
      .from('chats')
      .update({ chats: messages })
      .eq('id', chatId)
      .eq('user_id', userId);

    if (error) {
      logger.error({ error, chatId, userId }, '[ChatOperations] Supabase error updating chat');
      throw new Error('Failed to update chat in database');
    }

    logger.info({ chatId, userId }, '[ChatOperations] Chat messages updated successfully');
}

/**
 * Delete a chat
 */
export async function deleteChat(chatId: string, userId: string): Promise<void> {
    logger.info({ chatId, userId }, '[ChatOperations] Deleting chat');

    const supabase = await supabaseService.createAuthenticatedClient();
    
    const { error } = await supabase
      .from('chats')
      .delete()
      .eq('id', chatId)
      .eq('user_id', userId);

    if (error) {
      logger.error({ error, chatId, userId }, '[ChatOperations] Supabase error deleting chat');
      throw new Error('Failed to delete chat from database');
    }

    logger.info({ chatId, userId }, '[ChatOperations] Chat deleted successfully');
}