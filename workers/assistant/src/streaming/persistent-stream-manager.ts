/**
 * PersistentStreamManager - Manages streaming sessions that persist beyond client connections
 * 
 * Key Features:
 * - Streams continue running even when no clients are connected
 * - Multiple clients can subscribe to the same stream
 * - Catch-up mechanism for clients joining mid-stream
 * - Database updates happen at stream completion
 * - All existing tool activity events are preserved
 */

import { RAGWorkflowStreaming, RAGWorkflowInput } from '../mastra/workflows/rag-workflow.js';
import { SupabaseService } from '../services/supabase.service.js';

export interface StreamEvent {
  type: 'chunk' | 'toolActivity' | 'done' | 'error' | 'catch-up-complete' | 'catch-up-progress' | 'no-active-stream';
  data?: {
    chunk?: string;
    toolActivity?: string | null;
    linkedResources?: Array<{ type: 'document' | 'flashcard_set' | 'quiz'; id: string }>;
    error?: string;
    catchUpProgress?: number;
    totalEvents?: number;
  };
  timestamp: number;
  streamId: string;
}

export interface StreamSubscriber {
  id: string;
  controller: ReadableStreamDefaultController<Uint8Array>;
  encoder: TextEncoder;
  joinedAt: number;
  isActive: boolean;
}

export interface PersistentStream {
  id: string;
  chatId: string;
  input: RAGWorkflowInput;
  status: 'active' | 'completed' | 'error';
  startTime: number;
  endTime?: number;
  events: StreamEvent[];
  subscribers: Map<string, StreamSubscriber>;
  workflowGenerator?: AsyncGenerator<any>;
  finalContent?: string;
  linkedResources?: Array<{ type: 'document' | 'flashcard_set' | 'quiz'; id: string }>;
  error?: string;
}

export class PersistentStreamManager {
  private static instance: PersistentStreamManager;
  private streams: Map<string, PersistentStream> = new Map();
  private cleanup: Map<string, NodeJS.Timeout> = new Map();

  // Cleanup inactive streams after 24 hours
  private static readonly STREAM_TIMEOUT = 24 * 60 * 60 * 1000; // 24 hours

  public static getInstance(): PersistentStreamManager {
    if (!PersistentStreamManager.instance) {
      PersistentStreamManager.instance = new PersistentStreamManager();
    }
    return PersistentStreamManager.instance;
  }

  private constructor() {
    console.log('[PersistentStreamManager] Initialized');
  }

  /**
   * Create or get an existing stream
   */
  public async createOrGetStream(chatId: string, input: RAGWorkflowInput): Promise<string> {
    // Check if there's already an active stream for this chat
    const existingStream = this.findActiveStreamByChatId(chatId);
    if (existingStream) {
      console.log(`[PersistentStreamManager] Found existing active stream for chat ${chatId}: ${existingStream.id}`);
      return existingStream.id;
    }

    // Create new stream
    const streamId = `stream_${chatId}_${Date.now()}`;
    const stream: PersistentStream = {
      id: streamId,
      chatId,
      input,
      status: 'active',
      startTime: Date.now(),
      events: [],
      subscribers: new Map(),
    };

    this.streams.set(streamId, stream);
    console.log(`[PersistentStreamManager] Created new persistent stream: ${streamId}`);

    // Start the workflow execution in the background
    this.executeWorkflow(stream);

    // Set cleanup timeout
    this.setCleanupTimeout(streamId);

    return streamId;
  }

  /**
   * Subscribe to a stream and get a ReadableStream
   */
  public subscribeToStream(streamId: string, includeCatchUp: boolean = true): {
    stream: ReadableStream<Uint8Array>;
    streamExists: boolean;
  } {
    const persistentStream = this.streams.get(streamId);
    
    if (!persistentStream) {
      console.log(`[PersistentStreamManager] Stream not found: ${streamId}`);
      return {
        stream: this.createNoStreamFoundResponse(),
        streamExists: false
      };
    }

    const subscriberId = `subscriber_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    console.log(`[PersistentStreamManager] New subscriber ${subscriberId} joining stream ${streamId}`);

    const readableStream = new ReadableStream<Uint8Array>({
      start: (controller) => {
        const encoder = new TextEncoder();
        const subscriber: StreamSubscriber = {
          id: subscriberId,
          controller,
          encoder,
          joinedAt: Date.now(),
          isActive: true,
        };

        persistentStream.subscribers.set(subscriberId, subscriber);

        // Send initial connection confirmation directly (matching original API)
        try {
          const connectionData = `data: ${JSON.stringify({ connected: true })}\n\n`;
          const connectionChunk = subscriber.encoder.encode(connectionData);
          subscriber.controller.enqueue(connectionChunk);
        } catch (error) {
          console.error(`[PersistentStreamManager] Failed to send connection confirmation:`, error);
          subscriber.isActive = false;
        }

        // Send catch-up events if requested and stream is active
        if (includeCatchUp && persistentStream.status === 'active') {
          this.sendCatchUpEvents(subscriber, persistentStream);
        } else if (persistentStream.status === 'completed') {
          // Stream is completed, send all events immediately
          this.sendAllEvents(subscriber, persistentStream);
        } else if (persistentStream.status === 'error') {
          // Stream has error, send error immediately
          this.sendEvent(subscriber, {
            type: 'error',
            data: { error: persistentStream.error || 'Unknown error' },
            timestamp: Date.now(),
            streamId,
          });
        }
      },
      cancel: () => {
        console.log(`[PersistentStreamManager] Subscriber ${subscriberId} disconnected from stream ${streamId}`);
        if (persistentStream.subscribers.has(subscriberId)) {
          persistentStream.subscribers.get(subscriberId)!.isActive = false;
          persistentStream.subscribers.delete(subscriberId);
        }
      }
    });

    return {
      stream: readableStream,
      streamExists: true
    };
  }

  /**
   * Execute the RAG workflow and handle events
   */
  private async executeWorkflow(stream: PersistentStream): Promise<void> {
    try {
      console.log(`[PersistentStreamManager] Starting workflow execution for stream ${stream.id}`);
      
      // Start the RAG workflow streaming
      const workflowGenerator = RAGWorkflowStreaming.executeStream(stream.input);
      stream.workflowGenerator = workflowGenerator;

      let fullResponseText = '';
      let linkedResources: Array<{ type: 'document' | 'flashcard_set' | 'quiz'; id: string }> = [];

      for await (const response of workflowGenerator) {
        // Handle workflow events and broadcast to subscribers
        if (response.chunk) {
          fullResponseText += response.chunk;
          const event: StreamEvent = {
            type: 'chunk',
            data: { chunk: response.chunk },
            timestamp: Date.now(),
            streamId: stream.id,
          };
          this.addEventAndBroadcast(stream, event);

        } else if (response.toolActivity !== undefined) {
          const event: StreamEvent = {
            type: 'toolActivity',
            data: { toolActivity: response.toolActivity },
            timestamp: Date.now(),
            streamId: stream.id,
          };
          this.addEventAndBroadcast(stream, event);

        } else if (response.done) {
          linkedResources = response.linkedDocumentIds || [];
          stream.finalContent = fullResponseText;
          stream.linkedResources = linkedResources;
          
          const event: StreamEvent = {
            type: 'done',
            data: { linkedResources },
            timestamp: Date.now(),
            streamId: stream.id,
          };
          this.addEventAndBroadcast(stream, event);
          
          // Mark stream as completed
          stream.status = 'completed';
          stream.endTime = Date.now();
          
          // Update database with final content and complete conversation
          await this.updateChatDatabase(stream);
          
          console.log(`[PersistentStreamManager] Stream ${stream.id} completed successfully`);
          break;

        } else if (response.error) {
          stream.error = response.error;
          stream.status = 'error';
          stream.endTime = Date.now();
          
          const event: StreamEvent = {
            type: 'error',
            data: { error: response.error },
            timestamp: Date.now(),
            streamId: stream.id,
          };
          this.addEventAndBroadcast(stream, event);
          
          console.error(`[PersistentStreamManager] Stream ${stream.id} failed:`, response.error);
          break;
        }
      }

    } catch (error) {
      console.error(`[PersistentStreamManager] Workflow execution failed for stream ${stream.id}:`, error);
      
      stream.error = error instanceof Error ? error.message : 'Unknown workflow error';
      stream.status = 'error';
      stream.endTime = Date.now();
      
      const event: StreamEvent = {
        type: 'error',
        data: { error: stream.error },
        timestamp: Date.now(),
        streamId: stream.id,
      };
      this.addEventAndBroadcast(stream, event);
    }
  }

  /**
   * Add event to stream history and broadcast to active subscribers
   */
  private addEventAndBroadcast(stream: PersistentStream, event: StreamEvent): void {
    // Store event in stream history
    stream.events.push(event);

    // Broadcast to all active subscribers
    for (const [subscriberId, subscriber] of stream.subscribers.entries()) {
      if (subscriber.isActive) {
        this.sendEvent(subscriber, event);
      } else {
        // Clean up inactive subscribers
        stream.subscribers.delete(subscriberId);
      }
    }

    console.log(`[PersistentStreamManager] Broadcasted ${event.type} to ${stream.subscribers.size} subscribers`);
  }

  /**
   * Send catch-up events to a new subscriber
   */
  private sendCatchUpEvents(subscriber: StreamSubscriber, stream: PersistentStream): void {
    const totalEvents = stream.events.length;
    
    if (totalEvents === 0) {
      // No events to catch up on
      this.sendEvent(subscriber, {
        type: 'catch-up-complete',
        data: { totalEvents: 0 },
        timestamp: Date.now(),
        streamId: stream.id,
      });
      return;
    }

    console.log(`[PersistentStreamManager] Sending ${totalEvents} catch-up events to subscriber ${subscriber.id}`);

    // Send all previous events
    stream.events.forEach((event, index) => {
      this.sendEvent(subscriber, event);
      
      // Send progress updates for large catch-ups
      if (totalEvents > 10 && (index + 1) % 5 === 0) {
        this.sendEvent(subscriber, {
          type: 'catch-up-progress',
          data: { 
            catchUpProgress: index + 1,
            totalEvents 
          },
          timestamp: Date.now(),
          streamId: stream.id,
        });
      }
    });

    // Send catch-up complete
    this.sendEvent(subscriber, {
      type: 'catch-up-complete',
      data: { totalEvents },
      timestamp: Date.now(),
      streamId: stream.id,
    });
  }

  /**
   * Send all events for a completed stream
   */
  private sendAllEvents(subscriber: StreamSubscriber, stream: PersistentStream): void {
    console.log(`[PersistentStreamManager] Sending all ${stream.events.length} events for completed stream ${stream.id}`);
    
    stream.events.forEach(event => {
      this.sendEvent(subscriber, event);
    });
  }

  /**
   * Send a single event to a subscriber in the format expected by the web app
   */
  private sendEvent(subscriber: StreamSubscriber, event: StreamEvent): void {
    try {
      let eventData: any = {};

      // Format events to match what the web app expects
      switch (event.type) {
        case 'chunk':
          eventData = { chunk: event.data?.chunk };
          break;
        case 'toolActivity':
          eventData = { toolActivity: event.data?.toolActivity };
          break;
        case 'done':
          eventData = { 
            done: true, 
            linkedResources: event.data?.linkedResources || []
          };
          break;
        case 'error':
          eventData = { error: event.data?.error };
          break;
        case 'catch-up-complete':
          eventData = { 
            catchUpComplete: true, 
            totalEvents: event.data?.totalEvents 
          };
          break;
        case 'catch-up-progress':
          eventData = { 
            catchUpProgress: event.data?.catchUpProgress,
            totalEvents: event.data?.totalEvents 
          };
          break;
        case 'no-active-stream':
          eventData = { noActiveStream: true };
          break;
        default:
          eventData = event.data || {};
      }

      const sseData = `data: ${JSON.stringify(eventData)}\n\n`;
      const chunk = subscriber.encoder.encode(sseData);
      subscriber.controller.enqueue(chunk);
    } catch (error) {
      console.error(`[PersistentStreamManager] Failed to send event to subscriber ${subscriber.id}:`, error);
      subscriber.isActive = false;
    }
  }

  /**
   * Create a response for when no stream is found
   */
  private createNoStreamFoundResponse(): ReadableStream<Uint8Array> {
    return new ReadableStream<Uint8Array>({
      start(controller) {
        const encoder = new TextEncoder();
        const event: StreamEvent = {
          type: 'no-active-stream',
          data: {},
          timestamp: Date.now(),
          streamId: 'none',
        };
        const sseData = `data: ${JSON.stringify(event.data)}\n\n`;
        controller.enqueue(encoder.encode(sseData));
        controller.close();
      }
    });
  }

  /**
   * Update chat database with final content
   */
  private async updateChatDatabase(stream: PersistentStream): Promise<void> {
    if (!stream.finalContent || !stream.input.sessionId) {
      console.warn(`[PersistentStreamManager] Cannot update database - missing content or sessionId`);
      return;
    }

    try {
      console.log(`[PersistentStreamManager] Updating database for chat ${stream.input.sessionId}`);
      
      const result = await SupabaseService.updateChatWithCompleteConversation(
        stream.input.sessionId,
        stream.input.messageContent, // The user's message
        stream.finalContent,
        stream.linkedResources || [],
        stream.input.conversationHistory
      );

      if (result.success) {
        console.log(`[PersistentStreamManager] Successfully updated database for chat ${stream.input.sessionId}`);
      } else {
        console.error(`[PersistentStreamManager] Failed to update database:`, result.error);
      }
    } catch (error) {
      console.error(`[PersistentStreamManager] Database update error:`, error);
    }
  }

  /**
   * Find active stream by chat ID
   */
  private findActiveStreamByChatId(chatId: string): PersistentStream | undefined {
    for (const stream of this.streams.values()) {
      if (stream.chatId === chatId && stream.status === 'active') {
        return stream;
      }
    }
    return undefined;
  }

  /**
   * Set cleanup timeout for a stream
   */
  private setCleanupTimeout(streamId: string): void {
    const timeoutId = setTimeout(() => {
      this.cleanupStream(streamId);
    }, PersistentStreamManager.STREAM_TIMEOUT);
    
    this.cleanup.set(streamId, timeoutId);
  }

  /**
   * Cleanup a stream and its resources
   */
  private cleanupStream(streamId: string): void {
    const stream = this.streams.get(streamId);
    if (!stream) return;

    console.log(`[PersistentStreamManager] Cleaning up stream ${streamId}`);

    // Close all active subscribers
    for (const subscriber of stream.subscribers.values()) {
      if (subscriber.isActive) {
        try {
          subscriber.controller.close();
        } catch (error) {
          console.warn(`[PersistentStreamManager] Error closing subscriber:`, error);
        }
      }
    }

    // Clear cleanup timeout
    const timeoutId = this.cleanup.get(streamId);
    if (timeoutId) {
      clearTimeout(timeoutId);
      this.cleanup.delete(streamId);
    }

    // Remove stream
    this.streams.delete(streamId);
    
    console.log(`[PersistentStreamManager] Stream ${streamId} cleaned up`);
  }

  /**
   * Get stream status for debugging
   */
  public getStreamStatus(streamId?: string): any {
    if (streamId) {
      const stream = this.streams.get(streamId);
      if (!stream) return null;
      
      return {
        id: stream.id,
        chatId: stream.chatId,
        status: stream.status,
        startTime: stream.startTime,
        endTime: stream.endTime,
        eventCount: stream.events.length,
        subscriberCount: stream.subscribers.size,
        hasError: !!stream.error,
      };
    }

    // Return all streams status
    return Array.from(this.streams.values()).map(stream => ({
      id: stream.id,
      chatId: stream.chatId,
      status: stream.status,
      startTime: stream.startTime,
      endTime: stream.endTime,
      eventCount: stream.events.length,
      subscriberCount: stream.subscribers.size,
      hasError: !!stream.error,
    }));
  }

  /**
   * Force cleanup all streams (for testing/maintenance)
   */
  public cleanupAllStreams(): void {
    console.log(`[PersistentStreamManager] Cleaning up all ${this.streams.size} streams`);
    
    const streamIds = Array.from(this.streams.keys());
    streamIds.forEach(streamId => this.cleanupStream(streamId));
    
    console.log('[PersistentStreamManager] All streams cleaned up');
  }
}