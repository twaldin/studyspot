import { supabaseService } from '@/lib/services/database/supabase.service';
import logger from '@/lib/logger';
import { getAssistantResponseStream } from '../assistant.service';
import type { ChatMessage } from '@/lib/llamaindex-imports';

/**
 * AssistantStreamHandler - Handles streaming AI responses with proper error handling
 */
export class AssistantStreamHandler {
  private static instance: AssistantStreamHandler;

  private constructor() {}

  public static getInstance(): AssistantStreamHandler {
    if (!AssistantStreamHandler.instance) {
      AssistantStreamHandler.instance = new AssistantStreamHandler();
    }
    return AssistantStreamHandler.instance;
  }

  /**
   * Creates an HTTP response for server-sent events using the provided readable stream.
   */
  private createStreamResponse(readable: ReadableStream): Response {
    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  }

  /**
   * Handles the streaming assistant response process
   */
  public async handleStreamingResponse(
    supabase: any,
    question: string,
    conversationHistory: ChatMessage[],
    courseId: string | undefined,
    timeZone: string | undefined,
    userId: string
  ): Promise<Response> {
    // Validation
    if (!question?.trim()) {
      throw new Error('Question is required and cannot be empty');
    }

    // Create streaming infrastructure
    const stream = new TransformStream();
    const writer = stream.writable.getWriter();
    const encoder = new TextEncoder();

    // Create the stream response immediately
    const streamResponse = this.createStreamResponse(stream.readable);

    // Process the response asynchronously
    this.processStreamingResponse(
      supabase,
      question,
      conversationHistory,
      courseId,
      timeZone,
      userId,
      writer,
      encoder
    ).catch((error) => {
      logger.error({ error, userId }, 'Failed to start streaming response processing');
    });

    return streamResponse;
  }

  /**
   * Processes the streaming response
   */
  private async processStreamingResponse(
    supabase: any,
    question: string,
    conversationHistory: ChatMessage[],
    courseId: string | undefined,
    timeZone: string | undefined,
    userId: string,
    writer: WritableStreamDefaultWriter<any>,
    encoder: TextEncoder
  ): Promise<void> {
    try {
      logger.info({ 
        questionLength: question.length,
        hasHistory: conversationHistory.length > 0,
        courseId,
        userId
      }, 'Starting streaming response');

      // Use the assistant service to get streaming response
      for await (const chunk of getAssistantResponseStream(
        supabase,
        question,
        conversationHistory,
        courseId,
        timeZone
      )) {
        if (chunk.error) {
          await this.writeStreamChunk(writer, encoder, { error: chunk.error });
          break;
        } else if (chunk.done) {
          // Send the final message with any linked documents
          await this.writeStreamChunk(writer, encoder, { 
            done: true, 
            linkedDocumentIds: chunk.linkedDocumentIds 
          });
          break;
        } else if (chunk.chunk) {
          // Stream the actual token/chunk
          await this.writeStreamChunk(writer, encoder, { chunk: chunk.chunk });
        }
      }

      logger.info({ userId }, 'Streaming response completed successfully');

    } catch (error) {
      logger.error({ error, userId }, 'Error during streaming response');

      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      await this.writeStreamChunk(writer, encoder, { error: errorMessage });
    } finally {
      await this.closeStreamWriter(writer, userId);
    }
  }

  /**
   * Writes a chunk to the stream in server-sent events format
   */
  private async writeStreamChunk(
    writer: WritableStreamDefaultWriter<any>,
    encoder: TextEncoder,
    data: any
  ): Promise<void> {
    try {
      await writer.write(
        encoder.encode(`data: ${JSON.stringify(data)}\n\n`)
      );
    } catch (error) {
      logger.error({ error }, 'Failed to write stream chunk');
      throw error;
    }
  }

  /**
   * Safely closes the stream writer with error handling
   */
  private async closeStreamWriter(
    writer: WritableStreamDefaultWriter<any>,
    userId: string
  ): Promise<void> {
    try {
      await writer.close();
    } catch (closeError) {
      logger.error({ error: closeError, userId }, 'Error closing stream writer');
    }
  }

  /**
   * Validates streaming request parameters
   */
  public validateStreamingRequest(requestBody: any): {
    question: string;
    conversationHistory: ChatMessage[];
    courseId?: string;
    timeZone?: string;
  } {
    const { question, conversationHistory = [], courseId, timeZone } = requestBody;

    if (!question || typeof question !== 'string' || !question.trim()) {
      throw new Error('Question is required and must be a non-empty string');
    }

    if (!Array.isArray(conversationHistory)) {
      throw new Error('Conversation history must be an array');
    }

    return {
      question: question.trim(),
      conversationHistory,
      courseId,
      timeZone
    };
  }
}

// Export singleton instance for convenience
export const assistantStreamHandler = AssistantStreamHandler.getInstance();