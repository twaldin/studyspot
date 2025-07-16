import { Message } from '@/features/chat/chat.types';
import logger from '@/lib/logger';

export interface OptimisticChatState {
  chatId: string;
  messages: Message[];
  timestamp: number;
}

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
      type: msg.role,
      linkedDocumentIds: msg.linkedDocumentIds || [],
    }));

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
      type: 'user',
      linkedDocumentIds: [],
    };

    const assistantMsg: Message = {
      id: Date.now().toString() + '-assistant',
      content: '',
      type: 'assistant',
      linkedDocumentIds: []
    };

    return { userMessage: userMsg, assistantMessage: assistantMsg };
  }

  /**
   * Stores optimistic chat state in sessionStorage for navigation continuity
   */
  storeOptimisticChatState(chatId: string, messages: Message[]): void {
    const state: OptimisticChatState = {
      chatId,
      messages,
      timestamp: Date.now()
    };

    sessionStorage.setItem(`optimistic-chat-${chatId}`, JSON.stringify(state));
    
    logger.info({ 
      chatId, 
      messageCount: messages.length 
    }, '[ChatState] Stored optimistic chat state');
  }

  /**
   * Loads optimistic chat state from sessionStorage if available and recent
   */
  loadOptimisticChatState(chatId: string): { messages: Message[]; shouldContinueStreaming: boolean; userMessage?: string } | null {
    const storedState = sessionStorage.getItem(`optimistic-chat-${chatId}`);
    
    if (!storedState) {
      return null;
    }

    try {
      const { messages, timestamp }: OptimisticChatState = JSON.parse(storedState);
      
      // Only use stored messages if they're recent (within 30 seconds)
      if (Date.now() - timestamp > 30000) {
        logger.warn({ 
          chatId, 
          age: Date.now() - timestamp 
        }, '[ChatState] Stored messages too old, ignoring');
        return null;
      }

      logger.info({ 
        chatId, 
        messageCount: messages.length 
      }, '[ChatState] Loaded optimistic chat state from storage');

      // Find user message for streaming continuation
      const userMessage = messages.find((m: Message) => m.type === 'user');
      
      // Clean up the stored state
      sessionStorage.removeItem(`optimistic-chat-${chatId}`);

      return {
        messages,
        shouldContinueStreaming: true,
        userMessage: userMessage?.content
      };

    } catch (error) {
      logger.error({ error, chatId }, '[ChatState] Failed to parse stored messages');
      return null;
    }
  }

  /**
   * Generates conversation history for API calls from current messages
   */
  getConversationHistory(messages: Message[]): Array<{ role: string; content: string; linkedDocumentIds?: string[] }> {
    return messages.map(msg => ({
      role: msg.type,
      content: msg.content,
      linkedDocumentIds: msg.linkedDocumentIds || [],
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
      messages[messages.length - 1]?.type === 'assistant' && 
      messages[messages.length - 1]?.content === '';
  }

  /**
   * Generates optimistic chat ID for new chats
   */
  generateOptimisticChatId(): string {
    return `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Determines if a chat ID is optimistic (temporary)
   */
  isOptimisticChatId(chatId?: string): boolean {
    return chatId?.startsWith('temp-') ?? false;
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
          type: m.type, 
          content: m.content.substring(0, 50) + '...' 
        }))
      }, '[ChatState] Message state changed');
    }, 100);
  }
}

// Export singleton instance
export const chatStateService = ChatStateService.getInstance();