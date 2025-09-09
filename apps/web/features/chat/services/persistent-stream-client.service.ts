'use client';

import logger from "@/lib/logger";
import { StreamingContext } from "./chat-streaming.service";

export interface PersistentStreamResponse {
  chunk?: string;
  done?: boolean;
  linkedResources?: Array<{ type: string; id: string }>;
  error?: string;
  toolActivity?: string | null;
  connected?: boolean;
  catchUpComplete?: boolean;
  catchUpProgress?: number;
  totalEvents?: number;
  noActiveStream?: boolean;
}

export interface PersistentStreamOptions {
  chatId: string;
  messageContent: string;
  conversationHistory: Array<{ role: string; content: string; linkedResources?: any[] }>;
  courseId: string;
  context: StreamingContext;
  onCatchUpComplete?: (totalEvents: number) => void;
  onCatchUpProgress?: (progress: number, total: number) => void;
  onNoActiveStream?: () => void;
}

/**
 * PersistentStreamClient - Handles connection to persistent streams with catch-up functionality
 *
 * Features:
 * - Automatic detection of existing vs new streams
 * - Catch-up events for clients joining mid-stream
 * - Stream resumption across navigation
 * - All existing tool activity events preserved
 */
export class PersistentStreamClient {
  private static instance: PersistentStreamClient;

  public static getInstance(): PersistentStreamClient {
    if (!PersistentStreamClient.instance) {
      PersistentStreamClient.instance = new PersistentStreamClient();
    }
    return PersistentStreamClient.instance;
  }

  private constructor() {}

  /**
   * Start or join a persistent stream
   */
  async connectToStream(options: PersistentStreamOptions): Promise<void> {
    const { chatId, messageContent, conversationHistory, courseId, context } = options;

    logger.info({ chatId, messageContent, courseId }, 'Connecting to persistent stream');

    try {
      // Send request to persistent streaming endpoint
      const response = await this.sendStreamRequest({
        question: messageContent,
        messageContent: messageContent, // Explicit field for database persistence
        conversationHistory: conversationHistory.map(msg => ({
          role: msg.role,
          content: msg.content,
          linkedDocumentIds: msg.linkedResources?.map((res: any) => res.id) || []
        })),
        courseId,
        userId: context.userId,
        sessionId: chatId,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      });

      logger.info({ chatId, responseOk: response.ok, status: response.status }, 'Received response from persistent stream API');

      if (!response.ok) {
        throw new Error(`Persistent stream API error! status: ${response.status}`);
      }

      // Process the streaming response with catch-up awareness
      await this.processStreamingResponse(response, options);

    } catch (error) {
      logger.error({ chatId, error: error instanceof Error ? error.message : error }, 'Persistent streaming failed');
      throw error;
    }
  }

  /**
   * Subscribe to an existing stream by ID
   */
  async subscribeToExistingStream(streamId: string, options: PersistentStreamOptions): Promise<void> {
    const { chatId } = options;

    logger.info({ chatId, streamId }, 'Subscribing to existing persistent stream');

    try {
      const apiUrl = process.env.NEXT_PUBLIC_ASSISTANT_API_URL;
      const response = await fetch(`${apiUrl}/chat/stream/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          streamId,
          includeCatchUp: true
        }),
      });

      logger.info({ chatId, streamId, responseOk: response.ok }, 'Received response from stream subscription API');

      if (!response.ok) {
        throw new Error(`Stream subscription error! status: ${response.status}`);
      }

      // Process the streaming response with catch-up awareness
      await this.processStreamingResponse(response, options);

    } catch (error) {
      logger.error({ chatId, streamId, error: error instanceof Error ? error.message : error }, 'Stream subscription failed');
      throw error;
    }
  }

  /**
   * Send the stream request to the persistent API
   */
  private async sendStreamRequest(requestBody: any): Promise<Response> {
    const apiUrl = process.env.NEXT_PUBLIC_ASSISTANT_API_URL || process.env.NEXT_PUBLIC_ASSISTANT_WORKER_URL;

    logger.info("Using persistent stream API at", apiUrl);

    const response = await fetch(`${apiUrl}/chat/stream`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });

    return response;
  }

  /**
   * Process streaming response with catch-up and persistence awareness
   */
  private async processStreamingResponse(
    response: Response,
    options: PersistentStreamOptions
  ): Promise<void> {
    const { context } = options;
    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    let fullResponse = "";

    if (!reader) {
      throw new Error("Response body is not readable");
    }

    logger.info("Starting to process persistent streaming response");

    try {
      let chunkCount = 0;
      let linkedResources: any[] = [];
      let isCatchingUp = false;
      let catchUpProgress = 0;
      let totalCatchUpEvents = 0;

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          logger.info({
            chunkCount,
            fullResponseLength: fullResponse.length,
          }, "Persistent streaming completed successfully");

          // Clear streaming states when done
          if (context.setIsTextStreaming) {
            context.setIsTextStreaming(false);
          }
          if (context.setToolActivity) {
            context.setToolActivity(null);
          }
          break;
        }

        chunkCount++;
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data: PersistentStreamResponse = JSON.parse(line.slice(6));

              // Handle connection confirmation
              if (data.connected) {
                logger.info("Persistent stream connection confirmed");
                continue;
              }

              // Handle catch-up events
              if (data.catchUpComplete) {
                isCatchingUp = false;
                totalCatchUpEvents = data.totalEvents || 0;
                logger.info(`Catch-up completed with ${totalCatchUpEvents} events`);
                if (options.onCatchUpComplete) {
                  options.onCatchUpComplete(totalCatchUpEvents);
                }
                continue;
              }

              if (data.catchUpProgress) {
                isCatchingUp = true;
                catchUpProgress = data.catchUpProgress || 0;
                totalCatchUpEvents = data.totalEvents || 0;
                logger.info(`Catch-up progress: ${catchUpProgress}/${totalCatchUpEvents}`);
                if (options.onCatchUpProgress) {
                  options.onCatchUpProgress(catchUpProgress, totalCatchUpEvents);
                }
                continue;
              }

              // Handle no active stream
              if (data.noActiveStream) {
                logger.warn("No active stream found for this chat");
                if (options.onNoActiveStream) {
                  options.onNoActiveStream();
                }
                break;
              }

              // Handle regular streaming events (same as before)
              if (data.chunk) {
                fullResponse += data.chunk;

                // Don't process thinking content during catch-up
                if (!isCatchingUp) {
                  // Use existing thinking content filtering from ChatStreamingService
                  const { chatStreamingService } = await import('./chat-streaming.service');
                  const { filtered: displayContent, hasActiveThinking } = (chatStreamingService as any).filterThinkingContent(fullResponse);

                  // Handle streaming state based on thinking detection
                  if (context.setIsTextStreaming) {
                    if (hasActiveThinking) {
                      context.setIsTextStreaming(false);
                      if (context.setToolActivity) {
                        context.setToolActivity('thinking');
                      }
                    } else if (displayContent.trim()) {
                      context.setIsTextStreaming(true);
                      if (context.setToolActivity) {
                        context.setToolActivity(null);
                      }
                    }
                  }

                  this.updateAssistantMessage(context.setMessages, displayContent);

                  // Update streaming context for navigation persistence
                  if (context.chatId && context.updateStreamingMessage) {
                    context.updateStreamingMessage(context.chatId, displayContent);
                  }
                }

              } else if (data.toolActivity !== undefined && context.setToolActivity && !isCatchingUp) {
                // Update tool activity for enhanced thinking indicator (excluding catch-up)
                context.setToolActivity(data.toolActivity);
                logger.info(`Tool activity updated: ${data.toolActivity}`);

                // Also store in streaming manager for persistence across navigation
                if (context.chatId) {
                  const { streamingManager } = await import('./streaming-manager.service');
                  streamingManager.setToolActivity(context.chatId, data.toolActivity);
                }

              } else if (data.done) {
                logger.info({
                  finalResponseLength: fullResponse.length,
                  linkedResourceRefs: data.linkedResources?.length || 0
                }, "Received done signal from persistent stream");

                // Convert simple refs to full resources (same as before)
                const { chatStreamingService } = await import('./chat-streaming.service');
                linkedResources = await chatStreamingService.convertRefsToResources(data.linkedResources || []);

                // Use filtered content for final message
                const { filtered: finalDisplayContent } = (chatStreamingService as any).filterThinkingContent(fullResponse);
                this.updateAssistantMessage(context.setMessages, finalDisplayContent);
                this.updateAssistantMessageWithResources(context.setMessages, linkedResources);

                // Update streaming context with final linked resources
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

                // Mark as not replying since stream is done
                context.setIsReplying(false);

                // CRITICAL: Update React Query cache with complete conversation
                if (context.chatId && context.updateChatCache) {
                  // Start with conversation history (previous messages) - preserve full linkedResources
                  const cacheMessages = context.conversationHistory.map(msg => ({
                    role: msg.role,
                    content: msg.content,
                    // Store full linkedResources objects (not just refs) for proper cache hydration
                    linkedResources: msg.linkedResources || [],
                    // Also store the raw refs for database compatibility (used by chat-state.service.ts)
                    linked_resources: msg.linkedResources?.map(r => ({ type: r.type || 'document', id: r.id })).filter(r => r.id) || []
                  }));

                  // Add the current user message (which triggered this streaming)
                  cacheMessages.push({
                    role: 'user',
                    content: context.messageContent,
                    linkedResources: [],
                    linked_resources: []
                  });

                  // Add the final assistant message with FULL linkedResources (not just refs)
                  cacheMessages.push({
                    role: 'assistant',
                    content: finalDisplayContent,
                    linkedResources: linkedResources || [], // Store full resource objects
                    linked_resources: linkedResources?.map(r => ({ type: r.type || 'document', id: r.id })).filter(r => r.id) || [] // Store refs for database compatibility
                  });

                  context.updateChatCache({ chatId: context.chatId, messages: cacheMessages });
                  logger.info({ chatId: context.chatId, messageCount: cacheMessages.length, linkedResourcesCount: linkedResources?.length || 0 }, 'Updated React Query cache with complete conversation including full linkedResources');
                }

                // CRITICAL: Clean up both StreamingManager AND PendingChatContext
                if (context.chatId) {
                  // Clean up StreamingManager
                  const { streamingManager } = await import('./streaming-manager.service');
                  streamingManager.notifyStreamCompleted(context.chatId);

                  // Clean up PendingChatContext (this controls sidebar loading states)
                  if (context.setStreamingStatus && context.selectedCourse) {
                    const chatTitle = context.selectedCourse.name || 'Chat';
                    context.setStreamingStatus(context.chatId, chatTitle, false);
                    logger.info({ chatId: context.chatId }, 'Cleared streaming status in PendingChatContext');
                  }
                }
                break;

              } else if (data.error) {
                throw new Error(data.error);
              }
            } catch (parseError) {
              logger.warn(
                { parseError, line },
                "Failed to parse persistent streaming chunk",
              );
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
      logger.info({ chatId: context.chatId }, '[PersistentStreamClient] Streaming completed, cleaning up states');

      // Set isReplying to false when streaming is complete
      context.setIsReplying(false);

      // Clear streaming states
      if (context.setIsTextStreaming) {
        context.setIsTextStreaming(false);
      }
      if (context.setToolActivity) {
        context.setToolActivity(null);
      }

      // CRITICAL: Final cleanup for any streams that didn't complete normally
      // This is a safety net in case the stream didn't reach the done event
      if (context.chatId) {
        // Import StreamingManager and notify completion
        const { streamingManager } = await import('./streaming-manager.service');
        streamingManager.notifyStreamCompleted(context.chatId);

        // Also ensure PendingChatContext is cleaned up
        if (context.setStreamingStatus && context.selectedCourse) {
          const chatTitle = context.selectedCourse.name || 'Chat';
          context.setStreamingStatus(context.chatId, chatTitle, false);
        }
      }
    }
  }

  /**
   * Updates the assistant message with new content during streaming
   */
  private updateAssistantMessage(
    setMessages: React.Dispatch<React.SetStateAction<any[]>>,
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
    setMessages: React.Dispatch<React.SetStateAction<any[]>>,
    linkedResources: any[],
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
   * Get stream status for debugging
   */
  async getStreamStatus(streamId?: string): Promise<any> {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_ASSISTANT_API_URL;
      const url = streamId
        ? `${apiUrl}/chat/stream/status?streamId=${streamId}`
        : `${apiUrl}/chat/stream/status`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Stream status API error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      logger.error({ streamId, error }, 'Failed to get stream status');
      throw error;
    }
  }
}

export const persistentStreamClient = PersistentStreamClient.getInstance();
