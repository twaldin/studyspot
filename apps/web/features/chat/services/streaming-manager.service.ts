'use client';

import { StreamingContext } from './chat-streaming.service';
import { LinkedResource } from '@/features/chat/chat.types';
import { persistentStreamClient, PersistentStreamOptions } from './persistent-stream-client.service';
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
   * Execute the actual streaming using persistent stream client
   */
  private async executeStreaming(
    chatId: string,
    messageContent: string,
    conversationHistory: Array<{ role: string; content: string; linkedResources?: LinkedResource[] }>,
    courseId: string,
    context: StreamingContext,
    signal: AbortSignal
  ): Promise<void> {
    logger.info({ chatId, messageContent, courseId }, 'Starting persistent stream session');
    
    // Check if cancelled
    if (signal.aborted) {
      throw new Error('Streaming cancelled');
    }

    // Use persistent stream client with enhanced options
    const streamOptions: PersistentStreamOptions = {
      chatId,
      messageContent,
      conversationHistory,
      courseId,
      context,
      onCatchUpComplete: (totalEvents) => {
        logger.info({ chatId, totalEvents }, 'Stream catch-up completed');
      },
      onCatchUpProgress: (progress, total) => {
        logger.info({ chatId, progress, total }, 'Stream catch-up progress');
      },
      onNoActiveStream: () => {
        logger.warn({ chatId }, 'No active stream found - this is a new stream');
      }
    };

    await persistentStreamClient.connectToStream(streamOptions);
    
    logger.info({ chatId }, 'Persistent streaming completed successfully');
    
    // Note: Database updates now happen automatically in the assistant worker
    // No need to call saveMessagesToDatabase here
  }

  /**
   * Subscribe to an existing stream (for navigation scenarios)
   */
  async subscribeToExistingStream(
    streamId: string,
    chatId: string,
    context: StreamingContext
  ): Promise<void> {
    logger.info({ chatId, streamId }, 'Subscribing to existing persistent stream');

    const streamOptions: PersistentStreamOptions = {
      chatId,
      messageContent: '', // Not needed for subscription
      conversationHistory: [], // Not needed for subscription
      courseId: '', // Not needed for subscription
      context,
      onCatchUpComplete: (totalEvents) => {
        logger.info({ chatId, streamId, totalEvents }, 'Stream subscription catch-up completed');
      },
      onCatchUpProgress: (progress, total) => {
        logger.info({ chatId, streamId, progress, total }, 'Stream subscription catch-up progress');
      },
      onNoActiveStream: () => {
        logger.warn({ chatId, streamId }, 'No active stream found for subscription');
      }
    };

    await persistentStreamClient.subscribeToExistingStream(streamId, streamOptions);
    logger.info({ chatId, streamId }, 'Stream subscription completed successfully');
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

  /**
   * Notify that a stream has completed (called by PersistentStreamClient)
   */
  notifyStreamCompleted(chatId: string): void {
    const wasActive = this.activeStreams.has(chatId);
    if (wasActive) {
      logger.info({ chatId }, 'StreamingManager: Removing completed stream from active tracking');
      this.activeStreams.delete(chatId);
      console.log('[StreamingManager] Stream completed, active streams:', Array.from(this.activeStreams.keys()));
    } else {
      console.log('[StreamingManager] notifyStreamCompleted called but stream was not active:', chatId);
    }
  }

  /**
   * Get persistent stream status for debugging
   */
  async getStreamStatus(streamId?: string): Promise<any> {
    try {
      return await persistentStreamClient.getStreamStatus(streamId);
    } catch (error) {
      logger.error({ streamId, error }, 'Failed to get stream status');
      return null;
    }
  }
}

export const streamingManager = StreamingManagerService.getInstance();