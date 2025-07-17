import logger from '@/lib/logger';
import { Message } from '@/features/chat/chat.types';
import type { CreateChatRequest } from '@/hooks/api/chats';

export interface StreamingContext {
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  messageContent: string;
  conversationHistory: Array<{ role: string; content: string; linkedDocumentIds?: string[] }>;
  isNewChat: boolean;
  chatId?: string; // Optional for temporary chats
  createChatMutation: any;
  updateChatMutation: any;
  router: any;
  selectedCourse: any;
  setIsReplying: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface StreamingResponse {
  chunk?: string;
  done?: boolean;
  linkedDocumentIds?: string[];
  error?: string;
}

export class ChatStreamingService {
  private static instance: ChatStreamingService;

  public static getInstance(): ChatStreamingService {
    if (!ChatStreamingService.instance) {
      ChatStreamingService.instance = new ChatStreamingService();
    }
    return ChatStreamingService.instance;
  }

  private constructor() {}

  /**
   * Processes a streaming assistant API response, incrementally updating the assistant message content
   */
  async processStreamingResponse(
    response: Response,
    context: StreamingContext
  ): Promise<void> {
    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    let fullResponse = '';

    if (!reader) {
      throw new Error('Response body is not readable');
    }

    logger.info('Starting to process streaming response');

    try {
      let chunkCount = 0;
      let linkedDocumentIds: string[] = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          console.info({ 
            chunkCount, 
            fullResponseLength: fullResponse.length 
          }, 'Streaming completed successfully');
          break;
        }

        chunkCount++;
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data: StreamingResponse = JSON.parse(line.slice(6));

              if (data.chunk) {
                fullResponse += data.chunk;
                this.updateAssistantMessage(context.setMessages, fullResponse);
              } else if (data.done) {
                console.info({ 
                  finalResponseLength: fullResponse.length 
                }, 'Received done signal from server');
                linkedDocumentIds = data.linkedDocumentIds || [];
                this.updateAssistantMessageWithDocuments(context.setMessages, linkedDocumentIds);
                break;
              } else if (data.error) {
                throw new Error(data.error);
              }
            } catch (parseError) {
              console.warn({ parseError, line }, 'Failed to parse streaming chunk');
            }
          }
        }
      }

      // Update chat with complete conversation after streaming is complete (skip for temporary chats)
      if (context.chatId) {
        await this.finalizeChat(context, fullResponse, linkedDocumentIds, context.chatId);
      }

    } finally {
      reader.releaseLock();
      // Set isReplying to false when streaming is complete
      context.setIsReplying(false);
    }
  }

  /**
   * Updates the assistant message with new content during streaming
   */
  private updateAssistantMessage(
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
    content: string
  ): void {
    setMessages(prevMessages => {
      const newMessages = [...prevMessages];
      const lastMessage = newMessages[newMessages.length - 1];
      if (lastMessage.type === 'assistant') {
        lastMessage.content = content;
      }
      return newMessages;
    });
  }

  /**
   * Updates the assistant message with linked documents
   */
  private updateAssistantMessageWithDocuments(
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
    linkedDocumentIds: string[]
  ): void {
    setMessages(prevMessages => {
      const newMessages = [...prevMessages];
      const lastMessage = newMessages[newMessages.length - 1];
      if (lastMessage.type === 'assistant') {
        lastMessage.linkedDocumentIds = linkedDocumentIds;
      }
      return newMessages;
    });
  }

  /**
   * Finalizes the chat by updating the database with complete conversation
   */
  private async finalizeChat(
    context: StreamingContext,
    fullResponse: string,
    linkedDocumentIds: string[],
    realChatId: string
  ): Promise<void> {
    const finalMessages = [
      ...context.conversationHistory,
      // Always include the user message for both new and existing chats
      { role: 'user', content: context.messageContent },
      { role: 'assistant', content: fullResponse, linkedDocumentIds }
    ];

    console.info({ 
      finalMessagesCount: finalMessages.length, 
      isNewChat: context.isNewChat, 
      realChatId 
    }, '[ChatStreaming] Updating chat with final messages');
    
    await context.updateChatMutation.mutateAsync({
      chatId: realChatId,
      data: { messages: finalMessages }
    });
    
    console.info({ 
      chatId: realChatId 
    }, '[ChatStreaming] Streaming complete');
  }

  /**
   * Sends a message to the assistant API
   */
  async sendMessage(
    messageContent: string,
    conversationHistory: Array<{ role: string; content: string; linkedDocumentIds?: string[] }>,
    courseId: string
  ): Promise<Response> {
    const requestBody = {
      question: messageContent,
      conversationHistory,
      courseId,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };

    const response = await fetch('/api/assistant', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response;
  }
}

// Export singleton instance
export const chatStreamingService = ChatStreamingService.getInstance();