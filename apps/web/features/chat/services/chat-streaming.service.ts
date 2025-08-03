import logger from "@/lib/logger";
import { Message, LinkedResource, LinkedResourceRef } from "@/features/chat/chat.types";
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
  setToolActivity?: React.Dispatch<React.SetStateAction<string | null>>;
  setIsTextStreaming?: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface StreamingResponse {
  chunk?: string;
  done?: boolean;
  linkedResources?: LinkedResourceRef[]; // Simple type/id pairs
  error?: string;
  toolActivity?: string;
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
   * Filters out thinking content from the assistant response
   * Removes everything from <thinking> tags until the closing </thinking> tag is found
   */
  private filterThinkingContent(content: string): string {
    // Ensure content is a string
    if (typeof content !== 'string') {
      console.warn('[ChatStreaming] filterThinkingContent received non-string content:', typeof content, content);
      return String(content || '');
    }
    
    // Remove complete thinking blocks (case-insensitive, handles multiline)
    let filtered = content.replace(/<thinking[^>]*>[\s\S]*?<\/thinking>/gi, '');
    
    // Also handle markdown-style thinking blocks that might be used
    filtered = filtered.replace(/\[thinking\][\s\S]*?\[\/thinking\]/gi, '');
    
    // If there's an unclosed <thinking> tag, remove everything from that point
    const thinkingStart = filtered.search(/<thinking[^>]*>/i);
    if (thinkingStart !== -1) {
      filtered = filtered.substring(0, thinkingStart);
    }
    
    // If there's an unclosed [thinking] tag, remove everything from that point
    const thinkingStartAlt = filtered.search(/\[thinking\]/i);
    if (thinkingStartAlt !== -1) {
      filtered = filtered.substring(0, thinkingStartAlt);
    }
    
    return filtered.trim();
  }

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
      let lastChunkTime = Date.now();
      let pauseTimeoutId: NodeJS.Timeout | null = null;

      // Clear any existing pause timeout and reset states
      if (pauseTimeoutId) {
        clearTimeout(pauseTimeoutId);
      }
      if (context.setIsTextStreaming) {
        context.setIsTextStreaming(false);
      }

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          console.info({
            chunkCount,
            fullResponseLength: fullResponse.length,
          }, "Streaming completed successfully");
          
          // Clear streaming states when done
          if (context.setIsTextStreaming) {
            context.setIsTextStreaming(false);
          }
          if (pauseTimeoutId) {
            clearTimeout(pauseTimeoutId);
          }
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
                
                // Mark as actively text streaming
                if (context.setIsTextStreaming) {
                  context.setIsTextStreaming(true);
                }
                
                // Clear any existing pause timeout
                if (pauseTimeoutId) {
                  clearTimeout(pauseTimeoutId);
                }
                
                // Set up pause detection (300ms)
                pauseTimeoutId = setTimeout(() => {
                  if (context.setIsTextStreaming) {
                    context.setIsTextStreaming(false);
                  }
                  // When pause is detected, just continue showing tool activity
                  // The text streaming state will handle pencil display
                }, 300);
                
                // Filter out thinking content for display
                const displayContent = this.filterThinkingContent(fullResponse);
                
                // Debug logging for thinking content
                if (fullResponse !== displayContent) {
                  logger.info("[ChatStreaming] Filtered thinking content", {
                    originalLength: fullResponse.length,
                    filteredLength: displayContent.length,
                    containsThinking: fullResponse.includes('<thinking>') || fullResponse.includes('[thinking]')
                  });
                }
                
                this.updateAssistantMessage(context.setMessages, displayContent);

                // Update streaming context for navigation persistence (with filtered content)
                if (context.chatId && context.updateStreamingMessage) {
                  context.updateStreamingMessage(context.chatId, displayContent);
                }
                
                lastChunkTime = Date.now();
              } else if (data.toolActivity !== undefined && context.setToolActivity) {
                // Update tool activity for enhanced thinking indicator (including null to clear)
                context.setToolActivity(data.toolActivity);
                // Tool activity and text streaming states work together
                // No need for manual pencil display control
              } else if (data.done) {
                console.info({
                  finalResponseLength: fullResponse.length,
                  linkedResourceRefs: data.linkedResources?.length || 0
                }, "Received done signal from server");
                
                // Convert simple refs to full resources
                const linkedResourceRefs = data.linkedResources || [];
                linkedResources = await this.convertRefsToResources(linkedResourceRefs);
                
                // Use filtered content for final message
                const finalDisplayContent = this.filterThinkingContent(fullResponse);
                this.updateAssistantMessage(context.setMessages, finalDisplayContent);
                this.updateAssistantMessageWithResources(
                  context.setMessages,
                  linkedResources,
                );

                // Update streaming context with final linked resources (with filtered content)
                if (context.chatId && context.updateStreamingMessage) {
                  context.updateStreamingMessage(
                    context.chatId,
                    finalDisplayContent,
                    linkedResources,
                  );
                }

                // Clear tool activity and text streaming when done
                if (context.setToolActivity) {
                  context.setToolActivity(null);
                }
                if (context.setIsTextStreaming) {
                  context.setIsTextStreaming(false);
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
      // Clear streaming states
      if (context.setIsTextStreaming) {
        context.setIsTextStreaming(false);
      }
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
   * Convert simple type/id refs to full LinkedResource objects
   */
  public async convertRefsToResources(refs: LinkedResourceRef[]): Promise<LinkedResource[]> {
    const resources: LinkedResource[] = [];
    
    try {
      // Batch fetch documents
      const documentIds = refs.filter(ref => ref.type === 'document').map(ref => ref.id);
      if (documentIds.length > 0) {
        const response = await fetch(`/api/docs?ids=${documentIds.join(',')}`);
        if (response.ok) {
          const data = await response.json();
          if (data.docs) {
            for (const doc of data.docs) {
              resources.push({
                id: doc.id,
                type: 'document',
                title: doc.file_name || 'Unknown Document',
                file_type: doc.file_type || 'unknown',
                file_url: doc.file_url || ''
              });
            }
          }
        }
      }

      // Fetch flashcard sets individually 
      const flashcardRefs = refs.filter(ref => ref.type === 'flashcard_set');
      for (const ref of flashcardRefs) {
        const response = await fetch(`/api/flashcard-sets/${ref.id}`);
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            const set = data.data;
            resources.push({
              id: ref.id,
              type: 'flashcard_set',
              title: set.title || 'Untitled Flashcard Set',
              description: set.description,
              cardCount: set.card_count || 0
            });
          }
        }
      }

      // Fetch quiz sets individually 
      const quizRefs = refs.filter(ref => ref.type === 'quiz');
      for (const ref of quizRefs) {
        const response = await fetch(`/api/quizzes/${ref.id}`);
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            const quiz = data.data;
            resources.push({
              id: ref.id,
              type: 'quiz',
              title: quiz.title || 'Untitled Quiz',
              description: quiz.description,
              questionCount: quiz.question_count || 0,
              difficultyLevel: quiz.difficulty_level
            });
          }
        }
      }
      
      logger.info(`Converted ${refs.length} refs to ${resources.length} full resources`);
      return resources;
    } catch (error) {
      logger.error('Failed to convert refs to resources:', error);
      return [];
    }
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

    const response = await fetch(`${apiUrl}/chat/stream`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      let errorMessage = `Assistant API error! status: ${response.status}`;
      
      // Try to get more detailed error info
      try {
        const errorText = await response.text();
        if (errorText) {
          errorMessage += ` - ${errorText}`;
        }
      } catch (e) {
        // Ignore if we can't read the error text
      }
      
      throw new Error(errorMessage);
    }

    return response;
  }
}

// Export singleton instance
export const chatStreamingService = ChatStreamingService.getInstance();