'use client';

import { chatStreamingService, StreamingContext } from './chat-streaming.service';
import { LinkedResource } from '@/features/chat/chat.types';
import logger from '@/lib/logger';

interface ActiveStream {
  chatId: string;
  controller?: AbortController;
  context: StreamingContext;
  promise: Promise<void>;
}

/**
 * Global streaming manager that keeps streaming connections alive across navigation
 */
class StreamingManagerService {
  private static instance: StreamingManagerService;
  private activeStreams: Map<string, ActiveStream> = new Map();

  public static getInstance(): StreamingManagerService {
    if (!StreamingManagerService.instance) {
      StreamingManagerService.instance = new StreamingManagerService();
    }
    return StreamingManagerService.instance;
  }

  private constructor() {}

  /**
   * Start or resume streaming for a chat
   */
  async startStreaming(
    chatId: string,
    messageContent: string,
    conversationHistory: Array<{ role: string; content: string; linkedResources?: LinkedResource[] }>,
    courseId: string,
    context: StreamingContext
  ): Promise<void> {
    // If already streaming for this chat, stop the previous one and start new
    if (this.activeStreams.has(chatId)) {
      logger.info({ chatId }, 'Stopping existing stream and starting new one');
      this.stopStreaming(chatId);
      // Wait a moment for cleanup
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    logger.info({ chatId, messageContent, courseId }, 'Starting new streaming session');

    const controller = new AbortController();
    
    try {
      const streamPromise = this.executeStreaming(
        chatId, // Pass chatId here
        messageContent,
        conversationHistory,
        courseId,
        context,
        controller.signal
      );

      // Store the active stream
      this.activeStreams.set(chatId, {
        chatId,
        controller,
        context,
        promise: streamPromise
      });

      // Wait for completion
      await streamPromise;
      
      // Ensure cleanup after successful completion
      logger.info({ chatId }, 'Streaming completed successfully, ensuring cleanup');
      
    } catch (error) {
      logger.error({ chatId, error: error instanceof Error ? error.message : error }, 'Streaming failed');
      console.error('[StreamingManager] Error during streaming:', error);
      throw error;
    } finally {
      // Clean up when done - double check to ensure it's removed
      if (this.activeStreams.has(chatId)) {
        logger.info({ chatId }, 'Removing active stream in finally block');
        this.activeStreams.delete(chatId);
      }
      console.log('[StreamingManager] Cleanup complete, active streams:', Array.from(this.activeStreams.keys()));
    }
  }

  /**
   * Execute the actual streaming
   */
  private async executeStreaming(
    chatId: string, // Add chatId here
    messageContent: string,
    conversationHistory: Array<{ role: string; content: string; linkedResources?: LinkedResource[] }>,
    courseId: string,
    context: StreamingContext,
    signal: AbortSignal
  ): Promise<void> {
    logger.info({ chatId, messageContent, courseId }, 'Sending message to assistant API');
    
    const response = await chatStreamingService.sendMessage(
      messageContent,
      conversationHistory,
      courseId,
      chatId, // Pass chatId to sendMessage
      context.userId
    );

    logger.info({ chatId, responseOk: response.ok, status: response.status }, 'Received response from assistant API');

    // Check if cancelled
    if (signal.aborted) {
      throw new Error('Streaming cancelled');
    }

    await chatStreamingService.processStreamingResponse(response, context);
    
    logger.info({ chatId }, 'Streaming response processed successfully');
    
    // After streaming completes successfully, save messages to database
    if (context.userId && chatId && !signal.aborted) {
      logger.info({ chatId, userId: context.userId }, 'Saving messages to database');
      await this.saveMessagesToDatabase(chatId, context);
    }
  }

  /**
   * Save messages to database after streaming completes
   */
  private async saveMessagesToDatabase(chatId: string, context: StreamingContext): Promise<void> {
    try {
      // Get current messages from the UI state
      let currentMessages: any[] = [];
      
      // Use a promise to get the current state
      await new Promise<void>((resolve) => {
        context.setMessages((messages) => {
          // Capture the messages for saving
          currentMessages = messages.map(msg => ({
            role: msg.role,
            content: msg.content,
            linkedDocumentIds: msg.linkedResourceRefs?.map((ref: any) => ref.id) || msg.linkedDocumentIds || []
          }));
          // Need to actually resolve AFTER we've captured the messages
          setTimeout(resolve, 0);
          return messages;
        });
      });

      logger.info({ chatId, messageCount: currentMessages.length }, 'Saving messages to database after streaming');

      // Call the API to update the chat
      const response = await fetch(`/api/chats/${chatId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: currentMessages }),
      });

      if (!response.ok) {
        throw new Error(`Failed to save messages: ${response.statusText}`);
      }

      logger.info({ chatId }, 'Messages saved successfully to database');
    } catch (error) {
      logger.error({ chatId, error }, 'Failed to save messages to database');
      // Don't throw here - we don't want to fail the whole streaming process
      // The messages are still in the UI state
    }
  }

  /**
   * Check if a chat is currently streaming
   */
  isStreaming(chatId: string): boolean {
    const isActive = this.activeStreams.has(chatId);
    if (isActive) {
      console.log('[StreamingManager] Chat is still marked as streaming:', chatId, 'Active streams:', Array.from(this.activeStreams.keys()));
    }
    return isActive;
  }

  /**
   * Stop streaming for a specific chat
   */
  stopStreaming(chatId: string): void {
    const stream = this.activeStreams.get(chatId);
    if (stream) {
      logger.info({ chatId }, 'Stopping streaming session');
      stream.controller?.abort();
      this.activeStreams.delete(chatId);
    }
  }

  /**
   * Get active stream context for a chat (for UI updates)
   */
  getStreamContext(chatId: string): StreamingContext | undefined {
    return this.activeStreams.get(chatId)?.context;
  }

  /**
   * Update the context for an active stream (when UI components change)
   */
  updateStreamContext(chatId: string, newContext: Partial<StreamingContext>): void {
    const stream = this.activeStreams.get(chatId);
    if (stream) {
      Object.assign(stream.context, newContext);
    }
  }

  /**
   * Stop all active streams (cleanup)
   */
  stopAllStreams(): void {
    logger.info('Stopping all active streams');
    for (const [chatId, stream] of this.activeStreams.entries()) {
      stream.controller?.abort();
    }
    this.activeStreams.clear();
  }
}

export const streamingManager = StreamingManagerService.getInstance();