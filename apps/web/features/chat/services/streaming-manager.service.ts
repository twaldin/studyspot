'use client';

import { chatStreamingService, StreamingContext } from './chat-streaming.service';
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
    conversationHistory: Array<{ role: string; content: string; linkedDocumentIds?: string[] }>,
    courseId: string,
    context: StreamingContext
  ): Promise<void> {
    // If already streaming for this chat, don't start a new one
    if (this.activeStreams.has(chatId)) {
      logger.info({ chatId }, 'Streaming already active for this chat');
      return;
    }

    logger.info({ chatId }, 'Starting new streaming session');

    const controller = new AbortController();
    
    try {
      const streamPromise = this.executeStreaming(
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
      
    } catch (error) {
      logger.error({ chatId, error }, 'Streaming failed');
      throw error;
    } finally {
      // Clean up when done
      this.activeStreams.delete(chatId);
    }
  }

  /**
   * Execute the actual streaming
   */
  private async executeStreaming(
    messageContent: string,
    conversationHistory: Array<{ role: string; content: string; linkedDocumentIds?: string[] }>,
    courseId: string,
    context: StreamingContext,
    signal: AbortSignal
  ): Promise<void> {
    const response = await chatStreamingService.sendMessage(
      messageContent,
      conversationHistory,
      courseId
    );

    // Check if cancelled
    if (signal.aborted) {
      throw new Error('Streaming cancelled');
    }

    await chatStreamingService.processStreamingResponse(response, context);
  }

  /**
   * Check if a chat is currently streaming
   */
  isStreaming(chatId: string): boolean {
    return this.activeStreams.has(chatId);
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