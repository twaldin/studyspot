import { Chat } from '../chat.types';
import { getChats, getChat, createChat, deleteChat, CreateChatData, ChatSummary } from '../chat-operations';
import { generateMeaningfulTitle } from './chat-title-generator';
import { augmentMessagesWithResources } from './resource-augmentor';
import logger from '@/lib/logger';

export interface CreateChatRequest {
  initialMessages: Array<{
    role: string;
    content: string;
    linkedDocumentIds?: string[];
  }>;
  title?: string;
}

/**
 * Chat service that orchestrates chat operations
 */
export async function getChatList(userId: string, selectedSchool: string): Promise<{ chats: ChatSummary[] }> {
  try {
    const chats = await getChats(userId, selectedSchool);
    return { chats };
  } catch (error: any) {
    logger.error({ error, userId, selectedSchool }, '[ChatService] Failed to fetch chats');
    throw new Error(error.message || 'Failed to fetch chats');
  }
}

/**
 * Get a specific chat with augmented resources
 */
export async function getChatById(chatId: string, userId: string, selectedSchool: string): Promise<{ chat: Chat }> {
  try {
    const chat = await getChat(chatId, userId, selectedSchool);

    // Augment messages with linked resource data
    if (chat.chats && Array.isArray(chat.chats)) {
      chat.chats = await augmentMessagesWithResources(chat.chats);
    }

    return { chat };
  } catch (error: any) {
    logger.error({ error, chatId, userId }, '[ChatService] Failed to fetch chat');
    throw new Error(error.message || 'Failed to fetch chat');
  }
}

/**
 * Create a new chat with title generation
 */
export async function createNewChat(
  request: CreateChatRequest,
  userId: string,
  courseId: string
): Promise<{ chat: Chat }> {
  try {
    logger.info({ userId, courseId, hasTitle: !!request.title }, '[ChatService] Creating new chat');

    // Use provided title or generate a meaningful one
    const chatTitle = request.title || await generateMeaningfulTitle(request.initialMessages);

    const chatData: CreateChatData = {
      user_id: userId,
      title: chatTitle,
      course_id: courseId,
      chats: request.initialMessages,
    };

    const chat = await createChat(chatData);
    return { chat };
  } catch (error: any) {
    logger.error({ error, userId, courseId }, '[ChatService] Failed to create chat');
    throw new Error(error.message || 'Failed to create chat');
  }
}

/**
 * Delete a chat
 */
export async function deleteChatById(chatId: string, userId: string): Promise<{ success: boolean }> {
  try {
    await deleteChat(chatId, userId);
    return { success: true };
  } catch (error: any) {
    logger.error({ error, chatId, userId }, '[ChatService] Failed to delete chat');
    throw new Error(error.message || 'Failed to delete chat');
  }
}

// Legacy singleton export for backward compatibility during migration
export class ChatService {
  private static instance: ChatService;

  static getInstance(): ChatService {
    if (!ChatService.instance) {
      ChatService.instance = new ChatService();
    }
    return ChatService.instance;
  }

  private constructor() {}

  async getChats(userId: string, selectedSchool: string): Promise<{ chats: ChatSummary[] }> {
    return getChatList(userId, selectedSchool);
  }

  async getChat(chatId: string, userId: string, selectedSchool: string): Promise<{ chat: Chat }> {
    return getChatById(chatId, userId, selectedSchool);
  }

  async createChat(data: CreateChatRequest, userId: string, courseId: string): Promise<{ chat: Chat }> {
    return createNewChat(data, userId, courseId);
  }

  async deleteChat(chatId: string, userId: string): Promise<{ success: boolean }> {
    return deleteChatById(chatId, userId);
  }
}

export const chatService = ChatService.getInstance();