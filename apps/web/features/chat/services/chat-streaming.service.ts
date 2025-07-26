import logger from "@/lib/logger";
import { Message, LinkedResource } from "@/features/chat/chat.types";
import type { CreateChatRequest } from "@/hooks/api/chats";

export interface StreamingContext {
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  messageContent: string;
  conversationHistory: Array<
    { role: string; content: string; linkedResources?: LinkedResource[] }
  >;
  isNewChat: boolean;
  chatId?: string; // Chat ID for database operations
  userId?: string; // User ID for flashcard generation
  router: any;
  selectedCourse: any;
  setIsReplying: React.Dispatch<React.SetStateAction<boolean>>;
  updateStreamingMessage?: (
    chatId: string,
    partialMessage: string,
    linkedResources?: LinkedResource[],
  ) => void;
}

export interface StreamingResponse {
  chunk?: string;
  done?: boolean;
  linkedResources?: LinkedResource[];
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

  private constructor() { }

  /**
   * Processes a streaming assistant API response, incrementally updating the assistant message content
   */
  async processStreamingResponse(
    response: Response,
    context: StreamingContext,
  ): Promise<void> {
    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    let fullResponse = "";

    if (!reader) {
      throw new Error("Response body is not readable");
    }

    logger.info("Starting to process streaming response");

    try {
      let chunkCount = 0;
      let linkedResources: LinkedResource[] = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          console.info({
            chunkCount,
            fullResponseLength: fullResponse.length,
          }, "Streaming completed successfully");
          break;
        }

        chunkCount++;
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data: StreamingResponse = JSON.parse(line.slice(6));

              if (data.chunk) {
                fullResponse += data.chunk;
                this.updateAssistantMessage(context.setMessages, fullResponse);

                // Update streaming context for navigation persistence
                if (context.chatId && context.updateStreamingMessage) {
                  context.updateStreamingMessage(context.chatId, fullResponse);
                }
              } else if (data.done) {
                console.info({
                  finalResponseLength: fullResponse.length,
                }, "Received done signal from server");
                linkedResources = data.linkedResources || [];
                this.updateAssistantMessageWithResources(
                  context.setMessages,
                  linkedResources,
                );

                // Update streaming context with final linked resources
                if (context.chatId && context.updateStreamingMessage) {
                  context.updateStreamingMessage(
                    context.chatId,
                    fullResponse,
                    linkedResources,
                  );
                }
                break;
              } else if (data.error) {
                throw new Error(data.error);
              }
            } catch (parseError) {
              console.warn(
                { parseError, line },
                "Failed to parse streaming chunk",
              );
            }
          }
        }
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
    content: string,
  ): void {
    setMessages((prevMessages) => {
      const newMessages = [...prevMessages];
      const lastMessage = newMessages[newMessages.length - 1];
      if (lastMessage && lastMessage.role === "assistant") {
        lastMessage.content = content;
      }
      return newMessages;
    });
  }

  /**
   * Updates the assistant message with linked resources
   */
  private updateAssistantMessageWithResources(
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
    linkedResources: LinkedResource[],
  ): void {
    setMessages((prevMessages) => {
      const newMessages = [...prevMessages];
      const lastMessage = newMessages[newMessages.length - 1];
      if (lastMessage && lastMessage.role === "assistant") {
        lastMessage.linkedResources = linkedResources;
      }
      return newMessages;
    });
  }

  /**
   * Sends a message to the assistant API microservice
   */
  async sendMessage(
    messageContent: string,
    conversationHistory: Array<
      { role: string; content: string; linkedDocumentIds?: string[] }
    >,
    courseId: string,
    chatId?: string, // Make chatId optional
    userId?: string,
  ): Promise<Response> {
    const requestBody: any = {
      question: messageContent,
      conversationHistory,
      courseId,
      userId,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };

    if (chatId) {
      requestBody.sessionId = chatId;
    }

    const apiUrl = process.env.NEXT_PUBLIC_ASSISTANT_API_URL;
    logger.info("Using assistant API at", apiUrl);

    const response = await fetch(`${apiUrl}/api/chat/stream`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`Assistant API error! status: ${response.status}`);
    }

    return response;
  }
}

// Export singleton instance
export const chatStreamingService = ChatStreamingService.getInstance();

