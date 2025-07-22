import { Anthropic } from "@llamaindex/anthropic";
import AnthropicSDK from "@anthropic-ai/sdk";
import type { ChatMessage, MessageType } from "@/lib/utils/llamaindex-imports";
import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/lib/types/database";
import {
  RetrievalService,
  RetrievedDocument,
} from "./services/retrieval.service";
import { QueryService } from "./services/query.service";
import { ToolManager } from "./tools/tool-manager";
import logger from "@/lib/utils/logger";

export interface StreamingAgentResponse {
  chunk?: string;
  done?: boolean;
  linkedDocumentIds?: string[];
  error?: string;
  toolCall?: {
    name: string;
    args: any;
    id: string;
  };
  toolResult?: {
    id: string;
    result: any;
  };
}

interface ToolCall {
  id: string;
  name: string;
  input: Record<string, any>;
}

export class StreamingAgentService {
  private supabase: SupabaseClient<Database>;
  private claudeModel: Anthropic;
  private static directAnthropicClient: AnthropicSDK;
  private toolManager: ToolManager;

  constructor(supabase: SupabaseClient<Database>) {
    this.supabase = supabase;
    this.claudeModel = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY!,
      model: "claude-3-7-sonnet-latest",
    });
    this.toolManager = new ToolManager(supabase);
  }

  /**
   * Get singleton Anthropic client instance
   */
  private static getAnthropicClient(): AnthropicSDK {
    if (!this.directAnthropicClient) {
      if (!process.env.ANTHROPIC_API_KEY) {
        throw new Error("ANTHROPIC_API_KEY is not set. Cannot proceed with API calls.");
      }
      this.directAnthropicClient = new AnthropicSDK({
        apiKey: process.env.ANTHROPIC_API_KEY!,
      });
    }
    return this.directAnthropicClient;
  }

  async *executeRAGWithTools(
    originalQuestion: string,
    conversationHistory: any[] = [],
    courseId?: string,
    timeZone?: string,
    promptOverrides?: any // Will be typed properly from rag.service.ts
  ): AsyncGenerator<StreamingAgentResponse> {
    try {
      logger.info(
        { question: originalQuestion, courseId },
        "[StreamingAgentService] Starting RAG with tools",
      );

      // 1. Reformulate question and decide if RAG is needed
      const reformulationResult = await QueryService.reformulateQuestion(
        originalQuestion,
        conversationHistory,
        timeZone,
      );
      const { ragNeeded, question: reformulatedQuestion, search_query } =
        reformulationResult;

      // 2. Retrieve documents if needed
      let retrievedDocuments: RetrievedDocument[] = [];
      if (ragNeeded && courseId) {
        const ragResult = await RetrievalService.retrieveDocuments(
          this.supabase,
          search_query, // Use the descriptive search query for retrieval
          courseId,
          {},
          reformulatedQuestion, // Pass the original question for ranking
        );

        if (Array.isArray(ragResult)) {
          retrievedDocuments = ragResult;
          logger.info({
            documentsFound: retrievedDocuments.length,
          }, "[StreamingAgentService] Documents retrieved successfully");
        }
      }

      // 3. Build messages for Claude
      const { systemPrompt, userMessage } = this.buildMessages(
        originalQuestion,
        retrievedDocuments,
        courseId,
        timeZone,
        promptOverrides
      );

      // VERBOSE LOGGING: Log the exact prompts being sent
      logger.info({
        systemPromptLength: systemPrompt.length,
        userMessageLength: userMessage.length,
        systemPromptPreview: systemPrompt.substring(0, 300) + "...",
        userMessagePreview: userMessage.substring(0, 300) + "...",
      }, "[StreamingAgentService] VERBOSE: Prompts constructed");

      const messages: ChatMessage[] = [
        { role: "system", content: systemPrompt } as ChatMessage,
        { role: "user", content: userMessage } as ChatMessage,
      ];

      // 4. Execute conversation with tool support
      let usedDocumentIds = new Set<string>();
      let conversationMessages: ChatMessage[] = [...messages];
      let maxToolCalls = 5; // Prevent infinite loops
      let toolCallCount = 0;
      let overloadRetryCount = 0;
      const maxOverloadRetries = 3; // Maximum retries for overloaded errors

      // VERBOSE LOGGING: Log the exact messages being sent to Claude
      logger.info({
        messageCount: conversationMessages.length,
        messages: conversationMessages.map((msg) => ({
          role: msg.role,
          contentType: typeof msg.content,
          contentPreview: typeof msg.content === "string"
            ? msg.content.substring(0, 200) + "..."
            : JSON.stringify(msg.content).substring(0, 200) + "...",
        })),
        toolsAvailable: this.toolManager.getTools().map((tool) =>
          tool.metadata?.name || "unknown"
        ),
      }, "[StreamingAgentService] VERBOSE: Messages being sent to Claude");

      while (toolCallCount < maxToolCalls) {
        try {
          logger.debug({
            messageCount: conversationMessages.length,
            toolCallCount,
          }, "[StreamingAgentService] Starting Claude conversation");

          // EXPERIMENT: Try using direct Anthropic SDK for better tool call handling
          logger.info(
            {},
            "[StreamingAgentService] VERBOSE: Using direct Anthropic SDK for tool calls",
          );

          // Convert LlamaIndex tools to Anthropic format
          const anthropicTools = this.toolManager.getTools().map((tool) => ({
            name: tool.metadata.name,
            description: tool.metadata.description,
            input_schema: tool.metadata.parameters,
          }));

          // Separate the system prompt from the rest of the messages
          const systemPromptMessage = conversationMessages.find((msg) =>
            msg.role === "system"
          );
          const otherMessages = conversationMessages.filter((msg) =>
            msg.role !== "system"
          );

          // Convert LlamaIndex messages to Anthropic format
          const anthropicMessages = otherMessages.map((msg) => ({
            role: msg.role,
            content: typeof msg.content === "string"
              ? msg.content
              : JSON.stringify(msg.content),
          }));

          logger.info({
            toolCount: anthropicTools.length,
            messageCount: anthropicMessages.length,
            tools: anthropicTools,
          }, "[StreamingAgentService] VERBOSE: Converted to Anthropic format");

          // Use direct Anthropic SDK for streaming with tools
          const stream = await StreamingAgentService.getAnthropicClient().messages.stream({
            model: "claude-3-5-sonnet-20241022",
            max_tokens: 4000,
            system: systemPromptMessage
              ? String(systemPromptMessage.content)
              : undefined,
            messages: anthropicMessages as any,
            tools: anthropicTools,
          });

          let fullResponse = "";
          let currentToolCall: ToolCall | null = null;
          let toolInputBuffer = "";
          let toolCallsInResponse: ToolCall[] = [];
          let chunkCount = 0;

          logger.info(
            {},
            "[StreamingAgentService] VERBOSE: Starting to process stream chunks from direct Anthropic SDK",
          );

          // Process the stream using async iteration (not events)
          for await (const chunk of stream) {
            chunkCount++;

            // Handle different chunk types from direct Anthropic SDK
            if (
              chunk.type === "content_block_delta" &&
              chunk.delta.type === "text_delta"
            ) {
              fullResponse += chunk.delta.text;

              yield { chunk: chunk.delta.text };
            }

            if (
              chunk.type === "content_block_start" &&
              chunk.content_block.type === "tool_use"
            ) {
              currentToolCall = {
                id: chunk.content_block.id,
                name: chunk.content_block.name,
                input: {},
              };
              toolInputBuffer = "";

              logger.info(
                {
                  toolName: currentToolCall.name,
                  toolId: currentToolCall.id,
                },
                "[StreamingAgentService] VERBOSE: Tool call started from direct SDK",
              );

              yield {
                toolCall: {
                  name: currentToolCall.name,
                  args: {},
                  id: currentToolCall.id,
                },
              };
            }

            if (
              chunk.type === "content_block_delta" &&
              chunk.delta.type === "input_json_delta"
            ) {
              toolInputBuffer += chunk.delta.partial_json;
              logger.info(
                {
                  partialJson: chunk.delta.partial_json,
                  totalBuffer: toolInputBuffer,
                },
                "[StreamingAgentService] VERBOSE: Tool input accumulating from direct SDK",
              );
            }

            if (chunk.type === "content_block_stop" && currentToolCall) {
              try {
                currentToolCall.input = JSON.parse(toolInputBuffer);
                toolCallsInResponse.push(currentToolCall);

                logger.info(
                  {
                    toolName: currentToolCall.name,
                    toolId: currentToolCall.id,
                    input: currentToolCall.input,
                  },
                  "[StreamingAgentService] VERBOSE: Tool call completed from direct SDK",
                );
              } catch (error) {
                logger.error(
                  {
                    error,
                    toolId: currentToolCall.id,
                    buffer: toolInputBuffer,
                  },
                  "[StreamingAgentService] VERBOSE: Failed to parse tool input from direct SDK",
                );
              }
              currentToolCall = null;
              toolInputBuffer = "";
            }
          }

          logger.info({
            chunkCount,
            fullResponseLength: fullResponse.length,
            toolCallsFound: toolCallsInResponse.length,
            responsePreview: fullResponse.substring(0, 200) + "...",
          }, "[StreamingAgentService] VERBOSE: Stream processing completed");

          // If no tool calls were made, we're done
          if (toolCallsInResponse.length === 0) {
            const allDocumentIds = [
              ...new Set([
                ...retrievedDocuments.map((doc) => doc.doc_id),
                ...usedDocumentIds,
              ]),
            ];

            yield {
              done: true,
              linkedDocumentIds: allDocumentIds,
            };
            return;
          }

          // Execute tool calls
          const toolResults = [];
          for (const toolCall of toolCallsInResponse) {
            try {
              const result = await this.toolManager.executeToolCall(
                toolCall.name,
                toolCall.input,
              );
              toolResults.push({
                tool_use_id: toolCall.id,
                type: "tool_result",
                content: JSON.stringify(result),
              });

              // Track document IDs if this was a document retrieval
              if (
                toolCall.name === "get_full_document" && result.success &&
                result.data?.doc_id
              ) {
                usedDocumentIds.add(result.data.doc_id);
              }

              yield {
                toolResult: {
                  id: toolCall.id,
                  result: result,
                },
              };
            } catch (error) {
              logger.error({
                error,
                toolCall: toolCall.name,
                toolId: toolCall.id,
              }, "[StreamingAgentService] Tool execution failed");

              toolResults.push({
                tool_use_id: toolCall.id,
                type: "tool_result",
                content: `Error: ${error instanceof Error ? error.message : "Unknown error"
                  }`,
              });
            }
          }

          // Add assistant message with tool calls
          conversationMessages.push({
            role: "assistant",
            content: [
              { type: "text", text: fullResponse },
              ...toolCallsInResponse.map((tc) => ({
                type: "tool_use",
                id: tc.id,
                name: tc.name,
                input: tc.input,
              })),
            ],
          } as ChatMessage);

          // Add tool results
          conversationMessages.push({
            role: "user",
            content: toolResults as any, // Tool results need specific type casting
          } as ChatMessage);

          toolCallCount++;

          logger.info(
            {
              toolCallCount,
              toolsExecuted: toolCallsInResponse.length,
            },
            "[StreamingAgentService] Continuing conversation with tool results",
          );

          // Continue the conversation loop
        } catch (error) {
          // Handle specific Anthropic overloaded errors with retry logic
          if (this.isAnthropicOverloadedError(error) && overloadRetryCount < maxOverloadRetries) {
            overloadRetryCount++;
            logger.warn(
              { error, attempt: overloadRetryCount, maxRetries: maxOverloadRetries },
              "[StreamingAgentService] Anthropic API overloaded, will retry after delay"
            );
            
            // Exponential backoff: 1s, 2s, 4s for subsequent retries
            const delay = 1000 * Math.pow(2, overloadRetryCount - 1);
            await this.sleep(delay);
            
            // Don't increment toolCallCount for retries due to overload
            continue;
          }
          
          // If we've exhausted overload retries, treat as regular error
          if (this.isAnthropicOverloadedError(error)) {
            logger.error(
              { error, retriesExhausted: overloadRetryCount },
              "[StreamingAgentService] Anthropic API overloaded - retries exhausted"
            );
            yield {
              error: "The AI service is temporarily overloaded. Please try again in a few moments."
            };
            return;
          }

          logger.error(
            { error },
            "[StreamingAgentService] Error in conversation loop",
          );
          yield {
            error: error instanceof Error
              ? error.message
              : "An unexpected error occurred",
          };
          return;
        }
      }

      // If we hit max tool calls, finish gracefully
      const allDocumentIds = [
        ...new Set([
          ...retrievedDocuments.map((doc) => doc.doc_id),
          ...usedDocumentIds,
        ]),
      ];

      yield {
        done: true,
        linkedDocumentIds: allDocumentIds,
      };
    } catch (error) {
      logger.error(
        { error },
        "[StreamingAgentService] Error in RAG with tools execution",
      );
      yield {
        error: error instanceof Error
          ? error.message
          : "An unexpected error occurred",
      };
    }
  }

  private buildMessages(
    originalQuestion: string,
    retrievedDocuments: RetrievedDocument[],
    courseId?: string,
    timeZone?: string,
    promptOverrides?: any
  ): { systemPrompt: string; userMessage: string } {
    const currentDate = this.getFormattedDate(timeZone);

    // Get course context
    let courseDetailsText = "a college course";
    // This would need to be fetched from the database in a real implementation
    // For now, we'll use the courseId or default text

    // Use custom system prompt if provided, otherwise use default
    let systemPrompt: string;
    if (promptOverrides?.systemPrompt) {
      // Replace template variables in custom prompt
      systemPrompt = promptOverrides.systemPrompt
        .replace('{courseDetails}', courseDetailsText)
        .replace('{currentDate}', currentDate);
      
      logger.info({ 
        customPromptLength: systemPrompt.length,
        preview: systemPrompt.substring(0, 200) + "..."
      }, "[StreamingAgentService] Using custom system prompt");
    } else {
      // Default system prompt
      systemPrompt =
        `You are a helpful assistant for a college student taking ${courseDetailsText}. Your goal is to provide accurate and concise answers based on the provided context and conversation history. ${currentDate}

You have access to a tool called 'get_full_document' that allows you to retrieve the complete content of any document when you need more context beyond the provided chunks. Use this tool when:
- The chunk content is insufficient to fully answer the user's question
- You need to see the complete document structure or context
- The user is asking about specific details that might be elsewhere in the document

Respond directly to the user in natural language using markdown formatting where appropriate. When referring to provided context documents, do not mention the "Doc ID" as it is for internal system use only. Be concise and accurate.

IMPORTANT: ALL mathematical expressions MUST be formatted using LaTeX:
- Use $...$ for inline math (e.g., $x^2 + y^2 = z^2$)
- Use $$...$$ for display math (e.g., $$\\int_0^\\infty e^{-x^2} dx = \\frac{\\sqrt{\\pi}}{2}$$)
- Always use proper LaTeX commands (e.g., \\frac, \\int, \\sum, etc.)
- Never use plain text for mathematical notation`;
    }

    let userMessage: string;
    if (retrievedDocuments.length > 0) {
      // Use custom context formatting if provided
      const contextConfig = promptOverrides?.contextFormatting || {};
      
      const useHeaders = contextConfig.useHeaders !== false; // Default true
      const headerText = contextConfig.headerText || "\n\n--- Relevant Context from Documents Start ---";
      const footerText = contextConfig.footerText || "\n--- Relevant Context from Documents End ---";
      const includeDocumentIds = contextConfig.includeDocumentIds !== false; // Default true
      const documentSeparator = contextConfig.documentSeparator || "\n---\n";

      const documentsContext = retrievedDocuments.map((doc) => {
        if (includeDocumentIds) {
          return `Doc ID: ${doc.doc_id}\nContent: ${doc.content}`;
        } else {
          return doc.content;
        }
      }).join(documentSeparator);

      if (useHeaders) {
        userMessage =
          `User message: "${originalQuestion}"\n\nIf helpful, use the following context to help respond to the user's message:${headerText}\n${documentsContext}\n${footerText}`;
      } else {
        userMessage =
          `User message: "${originalQuestion}"\n\nIf helpful, use the following context to help respond to the user's message:\n${documentsContext}`;
      }

      if (promptOverrides?.contextFormatting) {
        logger.info({ 
          useHeaders, 
          includeDocumentIds, 
          documentCount: retrievedDocuments.length 
        }, "[StreamingAgentService] Using custom context formatting");
      }
    } else {
      userMessage = `User message: "${originalQuestion}"`;
    }

    return { systemPrompt, userMessage };
  }

  private getFormattedDate(timeZone?: string): string {
    const now = new Date();
    const timeZoneToUse = timeZone || "UTC";
    const timeString = new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
      timeZone: timeZoneToUse,
    }).format(now).replace(" ", "").toLowerCase();
    const dateString = new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      timeZone: timeZoneToUse,
    }).format(now);
    return `It is currently ${timeString} on ${dateString}.`;
  }

  /**
   * Check if an error is an Anthropic overloaded error
   */
  private isAnthropicOverloadedError(error: any): boolean {
    return (
      error?.error?.error?.type === "overloaded_error" ||
      error?.message?.includes("overloaded") ||
      error?.message?.includes("Overloaded")
    );
  }

  /**
   * Sleep for a given number of milliseconds
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

