import { Message, LinkedResource } from '@/features/chat/chat.types';
import logger from '@/lib/logger';
import { chatService } from './chat.service';


export interface ChatStateContext {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  setIsReplying: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
}

export class ChatStateService {
  private static instance: ChatStateService;

  public static getInstance(): ChatStateService {
    if (!ChatStateService.instance) {
      ChatStateService.instance = new ChatStateService();
    }
    return ChatStateService.instance;
  }

  private constructor() {}

  /**
   * Loads chat messages from database and converts them to UI format
   */
  loadChatFromDatabase(chat: { id: string; chats?: unknown }): Message[] {
    if (!chat?.chats) {
      return [];
    }

    const messages = Array.isArray(chat.chats) ? chat.chats : [];
    const convertedMessages = messages.map((msg: any, index: number) => ({
      id: index.toString(),
      content: msg.content,
      role: msg.role,
      linkedResources: [], // Will be populated by client-side conversion  
      linkedResourceRefs: msg.linked_resources || [], // Store raw refs for conversion
    }));

    // We are not calling the augmentation here because the data from useChat is already augmented.
    // This service is only for client-side state management.

    logger.info({ 
      chatId: chat.id, 
      messageCount: convertedMessages.length 
    }, '[ChatState] Loaded chat from database');

    return convertedMessages;
  }

  /**
   * Creates initial messages for a new chat interaction
   */
  createInitialMessages(userMessage: string): { userMessage: Message; assistantMessage: Message } {
    const userMsg: Message = {
      id: Date.now().toString(),
      content: userMessage,
      role: 'user',
    };

    const assistantMsg: Message = {
      id: Date.now().toString() + '-assistant',
      content: '',
      role: 'assistant'
    };

    return { userMessage: userMsg, assistantMessage: assistantMsg };
  }


  /**
   * Generates conversation history for API calls from current messages
   */
  getConversationHistory(messages: Message[]): Array<{ role: string; content: string; linkedResources?: LinkedResource[] }> {
    return messages.map(msg => ({
      role: msg.role,
      content: msg.content,
      linkedResources: msg.linkedResources || [],
    }));
  }

  /**
   * Adds user and assistant messages to chat state
   */
  addMessagesToChat(
    context: ChatStateContext,
    userMessage: Message,
    assistantMessage: Message
  ): void {
    context.setMessages(prev => {
      const newMessages = [...prev, userMessage];
      logger.info({ 
        messageCount: newMessages.length, 
        lastMessage: userMessage.content 
      }, '[ChatState] Added user message');
      return newMessages;
    });

    context.setMessages(prev => {
      const newMessages = [...prev, assistantMessage];
      logger.info({ 
        messageCount: newMessages.length 
      }, '[ChatState] Added assistant thinking message');
      return newMessages;
    });
  }

  /**
   * Handles error state by removing failed messages
   */
  handleMessageError(
    context: ChatStateContext,
    error: Error,
    removeLastMessages: number = 2
  ): void {
    const errorMessage = error instanceof Error ? error.message : 'Failed to send message';
    context.setError(errorMessage);
    
    // Remove the failed messages
    context.setMessages(prev => prev.slice(0, -removeLastMessages));
    context.setIsReplying(false);

    logger.error({ error }, '[ChatState] Handled message error');
  }

  /**
   * Clears chat state for navigation between different chats
   */
  clearChatState(context: ChatStateContext, reason: string): void {
    context.setMessages([]);
    context.setError(null);
    context.setIsReplying(false);
    
    logger.info({ reason }, '[ChatState] Cleared chat state');
  }

  /**
   * Checks if current message state shows thinking indicator
   */
  shouldShowThinkingIndicator(messages: Message[], isReplying: boolean): boolean {
    return isReplying && 
      messages.length > 0 && 
      messages[messages.length - 1]?.role === 'assistant' && 
      messages[messages.length - 1]?.content === '';
  }


  /**
   * Logs message state changes for debugging (throttled)
   */
  logMessageStateChange(chatId: string | undefined, messages: Message[], isReplying: boolean): void {
    // Use setTimeout to throttle logging and prevent infinite loops
    setTimeout(() => {
      logger.info({ 
        chatId, 
        messageCount: messages.length, 
        isReplying,
        messages: messages.map(m => ({ 
          role: m.role, 
          content: m.content.substring(0, 50) + '...' 
        }))
      }, '[ChatState] Message state changed');
    }, 100);
  }
}

// Export singleton instance
export const chatStateService = ChatStateService.getInstance();