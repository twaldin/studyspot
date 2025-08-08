import { Mastra } from "@mastra/core";
import { CloudflareDeployer } from "@mastra/deployer-cloudflare";
import { registerApiRoute } from "@mastra/core/server";
import { z } from "zod";

// Import agents
import { StudySpotAgent } from "./agents/studyspot-agent.js";
import { queryReformulationAgent } from "./agents/query-reformulation-agent.js";

// Import workflows
import {
  ragWorkflow,
  RAGWorkflowInput,
  RAGWorkflowStreaming,
} from "./workflows/rag-workflow.js";
import {
  documentIngestionWorkflow,
  executeDocumentIngestion,
} from "./workflows/document-ingestion-workflow.js";

// Import tools
import { verifyCourseTool } from "./tools/verify-course.tool.js";

// Import route handlers (not the route definitions)
import { getSuggestedQueriesHandler } from "../services/suggested-queries.service.js";

// Import persistent streaming manager
import { PersistentStreamManager } from "../streaming/persistent-stream-manager.js";
import { SupabaseService } from "../services/supabase.service.js";

// Request schema (matching original API exactly)
const StreamRequestSchema = z.object({
  question: z.string().min(1, "Question is required"),
  conversationHistory: z.array(z.object({
    role: z.enum(["user", "assistant", "system"]),
    content: z.string(),
  })).default([]),
  courseId: z.string().optional(),
  userId: z.string().optional(),
  timeZone: z.string().optional(),
  sessionId: z.string().optional(),
  messageContent: z.string().optional(), // The user's message content for database persistence
  // Developer-only prompt overrides
  promptOverrides: z.any().optional(),
});

export const mastra = new Mastra({
  agents: {
    studyspotAgent: await StudySpotAgent.getInstance(),
    queryReformulationAgent,
  },
  workflows: {
    ragWorkflow,
    documentIngestionWorkflow,
  },
  server: {
    port: 8787,
    cors: {
      origin: "*", // Allow all origins for now
      allowMethods: ["GET", "POST", "OPTIONS"],
      allowHeaders: ["Content-Type", "Authorization", "X-Prompt-Override"],
      credentials: true,
    },
    apiRoutes: [
      // CORS preflight handler for /chat/stream
      registerApiRoute("/chat/stream", {
        method: "OPTIONS" as any,
        handler: async (c) => {
          return new Response(null, {
            status: 204,
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
              "Access-Control-Allow-Headers":
                "Content-Type, Authorization, X-Prompt-Override",
              "Access-Control-Max-Age": "86400",
            },
          });
        },
      }),
      // Main chat streaming endpoint - creates or subscribes to persistent streams
      registerApiRoute("/chat/stream", {
        method: "POST",
        handler: async (c) => {
          try {
            // Set environment for SupabaseService
            const env = c.env || (globalThis as any).__workerEnv || process.env;
            SupabaseService.setEnv(env);

            // Parse and validate request body
            const body = await c.req.json();
            const {
              question,
              conversationHistory,
              courseId,
              userId,
              timeZone,
              sessionId,
              messageContent,
              promptOverrides,
            } = StreamRequestSchema.parse(body);

            // Log prompt override usage (matching original API)
            if (promptOverrides) {
              console.log(
                `[Persistent Stream API] Prompt override request (dev panel)`,
                {
                  sessionId,
                  hasOverrides: !!promptOverrides,
                  overrideKeys: promptOverrides
                    ? Object.keys(promptOverrides)
                    : [],
                },
              );
            }

            console.log(`[Persistent Stream API] Starting RAG stream`, {
              question: question.substring(0, 100),
              courseId,
              sessionId,
              timestamp: new Date().toISOString(),
            });

            // Prepare input for RAG workflow
            const workflowInput: RAGWorkflowInput = {
              question,
              conversationHistory,
              courseId,
              userId,
              timeZone,
              sessionId,
              messageContent: messageContent || question, // Use messageContent if provided, otherwise fallback to question
              promptOverrides,
            };

            // Get persistent stream manager
            const streamManager = PersistentStreamManager.getInstance();

            // Create or get existing stream (if chat is already streaming)
            const streamId = await streamManager.createOrGetStream(
              sessionId || `chat_${Date.now()}`,
              workflowInput,
            );

            // Subscribe to the stream
            const { stream: readableStream, streamExists } = streamManager
              .subscribeToStream(streamId, true);

            console.log(
              `[Persistent Stream API] ${streamExists ? "Subscribed to existing" : "Created new"
              } stream: ${streamId}`,
            );

            // Return SSE response with CORS headers
            return new Response(readableStream, {
              headers: {
                "Content-Type": "text/event-stream",
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
                "Access-Control-Allow-Headers":
                  "Content-Type, Authorization, X-Prompt-Override",
              },
            });
          } catch (error) {
            console.error(
              `[Persistent Stream API] Error in stream handler:`,
              error,
            );

            return c.json({
              error: error instanceof Error
                ? error.message
                : "Internal server error",
            }, 500);
          }
        },
      }),
      // Stream subscription endpoint - for reconnecting to existing streams
      registerApiRoute("/chat/stream/subscribe", {
        method: "OPTIONS" as any,
        handler: async (c) => {
          return new Response(null, {
            status: 204,
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
              "Access-Control-Allow-Headers": "Content-Type, Authorization",
              "Access-Control-Max-Age": "86400",
            },
          });
        },
      }),
      registerApiRoute("/chat/stream/subscribe", {
        method: "POST",
        handler: async (c) => {
          try {
            const body = await c.req.json();
            const { streamId, includeCatchUp = true } = body;

            if (!streamId) {
              return c.json({ error: "Stream ID is required" }, 400);
            }

            console.log(
              `[Stream Subscribe API] Subscribing to stream: ${streamId}`,
            );

            // Get persistent stream manager and subscribe
            const streamManager = PersistentStreamManager.getInstance();
            const { stream: readableStream, streamExists } = streamManager
              .subscribeToStream(streamId, includeCatchUp);

            if (!streamExists) {
              console.log(
                `[Stream Subscribe API] Stream not found: ${streamId}`,
              );
            }

            // Return SSE response
            return new Response(readableStream, {
              headers: {
                "Content-Type": "text/event-stream",
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type, Authorization",
              },
            });
          } catch (error) {
            console.error(`[Stream Subscribe API] Error:`, error);
            return c.json({
              error: error instanceof Error
                ? error.message
                : "Internal server error",
            }, 500);
          }
        },
      }),
      // Stream status endpoint - for debugging and monitoring
      registerApiRoute("/chat/stream/status", {
        method: "OPTIONS" as any,
        handler: async (c) => {
          return new Response(null, {
            status: 204,
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Methods": "GET, OPTIONS",
              "Access-Control-Allow-Headers": "Content-Type, Authorization",
              "Access-Control-Max-Age": "86400",
            },
          });
        },
      }),
      registerApiRoute("/chat/stream/status", {
        method: "GET",
        handler: async (c) => {
          try {
            const streamId = c.req.query("streamId");
            const streamManager = PersistentStreamManager.getInstance();

            if (streamId) {
              // Get specific stream status
              const status = streamManager.getStreamStatus(streamId);
              if (!status) {
                return c.json({ error: "Stream not found" }, 404);
              }
              return c.json({ stream: status }, {
                headers: {
                  "Access-Control-Allow-Origin": "*",
                  "Access-Control-Allow-Methods": "GET, OPTIONS",
                  "Access-Control-Allow-Headers": "Content-Type, Authorization",
                },
              });
            } else {
              // Get all streams status
              const allStreams = streamManager.getStreamStatus();
              return c.json({ streams: allStreams }, {
                headers: {
                  "Access-Control-Allow-Origin": "*",
                  "Access-Control-Allow-Methods": "GET, OPTIONS",
                  "Access-Control-Allow-Headers": "Content-Type, Authorization",
                },
              });
            }
          } catch (error) {
            console.error(`[Stream Status API] Error:`, error);
            return c.json({
              error: error instanceof Error
                ? error.message
                : "Internal server error",
            }, 500);
          }
        },
      }),
      // Course verification endpoint
      registerApiRoute("/courses/verify", {
        method: "OPTIONS" as any,
        handler: async (c) => {
          return new Response(null, {
            status: 204,
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
              "Access-Control-Allow-Headers": "Content-Type, Authorization",
              "Access-Control-Max-Age": "86400",
            },
          });
        },
      }),
      registerApiRoute("/courses/verify", {
        method: "POST",
        handler: async (c) => {
          try {
            const body = await c.req.json();
            const { courseCode, schoolName } = body;

            if (!courseCode || !schoolName) {
              return c.json({
                error: "Course code and school name are required",
              }, 400);
            }

            console.log("[Course Verification API] Verifying course:", {
              courseCode,
              schoolName,
            });

            // Use the verify course tool
            const result = await verifyCourseTool.execute({
              context: { courseCode, schoolName },
            });

            console.log(
              "[Course Verification API] Verification result:",
              result,
            );

            // Return response matching the original API format
            return c.json(result, {
              headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type, Authorization",
              },
            });
          } catch (error) {
            console.error("[Course Verification API] Error:", error);

            // Default to verified if there's an error
            return c.json({
              verified: true,
              message: "Course verified for academic use (AI check skipped)",
              reason: "AI safety check unavailable",
            }, {
              headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type, Authorization",
              },
            });
          }
        },
      }),
      // Document ingestion endpoint (CORS preflight)
      registerApiRoute("/documents/ingest-stream", {
        method: "OPTIONS" as any,
        handler: async (c) => {
          return new Response(null, {
            status: 204,
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
              "Access-Control-Allow-Headers": "Content-Type, Authorization",
              "Access-Control-Max-Age": "86400",
            },
          });
        },
      }),
      // Document ingestion streaming endpoint
      registerApiRoute("/documents/ingest-stream", {
        method: "POST",
        handler: async (c) => {
          try {
            const body = await c.req.json();
            const { files, courseId, userId } = body;

            if (!files || !Array.isArray(files) || files.length === 0) {
              return c.json({ error: "No files provided" }, 400);
            }

            if (!courseId) {
              return c.json({ error: "Course ID is required" }, 400);
            }

            console.log("[Document Ingestion API] Starting ingestion", {
              fileCount: files.length,
              courseId,
              userId,
            });

            // Set up SSE headers
            c.header("Content-Type", "text/event-stream");
            c.header("Cache-Control", "no-cache");
            c.header("Connection", "keep-alive");
            c.header("Access-Control-Allow-Origin", "*");

            const encoder = new TextEncoder();
            const sseStream = new ReadableStream({
              async start(controller) {
                try {
                  // Send initial connection event
                  controller.enqueue(
                    encoder.encode(
                      `data: ${JSON.stringify({ type: "connected" })}\n\n`,
                    ),
                  );

                  // Process files sequentially
                  for (let i = 0; i < files.length; i++) {
                    const file = files[i];

                    // Send file start event
                    controller.enqueue(
                      encoder.encode(`data: ${JSON.stringify({
                        type: "file-start",
                        fileIndex: i,
                        fileName: file.fileName,
                        totalFiles: files.length,
                      })
                        }\n\n`),
                    );

                    try {
                      // Send initial step progress events
                      const sendProgress = (message: string) => {
                        controller.enqueue(
                          encoder.encode(`data: ${JSON.stringify({
                            type: "step-progress",
                            fileIndex: i,
                            fileName: file.fileName,
                            message,
                          })
                            }\n\n`),
                        );
                      };

                      // Execute the simplified ingestion function with progress callbacks
                      const result = await executeDocumentIngestion({
                        fileKey: file.fileKey || file.fileName, // Use fileKey if available, otherwise fileName
                        fileUrl: file.fileUrl,
                        fileName: file.fileName,
                        fileType: file.fileType,
                        courseId,
                        userId: userId || "anonymous",
                        onProgress: sendProgress,
                        mastra, // Pass the mastra instance
                      });

                      // Send file complete event
                      controller.enqueue(
                        encoder.encode(`data: ${JSON.stringify({
                          type: "file-complete",
                          fileIndex: i,
                          fileName: file.fileName,
                          chunksCreated: result.chunkCount || 0,
                          status: result.status,
                          documentId: result.documentId,
                        })
                          }\n\n`),
                      );
                    } catch (error) {
                      console.error(
                        `[Document Ingestion API] Error processing file ${file.fileName}:`,
                        error,
                      );

                      // Send file error event
                      controller.enqueue(
                        encoder.encode(`data: ${JSON.stringify({
                          type: "file-error",
                          fileIndex: i,
                          fileName: file.fileName,
                          error: error instanceof Error
                            ? error.message
                            : "Unknown error",
                        })
                          }\n\n`),
                      );
                    }
                  }

                  // Send completion event
                  controller.enqueue(
                    encoder.encode(`data: ${JSON.stringify({
                      type: "complete",
                      message: "All files processed",
                    })
                      }\n\n`),
                  );

                  controller.close();
                } catch (error) {
                  console.error(
                    "[Document Ingestion API] Stream error:",
                    error,
                  );
                  controller.enqueue(
                    encoder.encode(`data: ${JSON.stringify({
                      type: "error",
                      error: error instanceof Error
                        ? error.message
                        : "Internal server error",
                    })
                      }\n\n`),
                  );
                  controller.close();
                }
              },
            });

            return new Response(sseStream);
          } catch (error) {
            console.error("[Document Ingestion API] Error:", error);
            return c.json({
              error: error instanceof Error
                ? error.message
                : "Internal server error",
            }, 500);
          }
        },
      }),
      // Suggested queries routes (defined inline for proper bundling)
      registerApiRoute("/suggested-queries", {
        method: "OPTIONS" as any,
        handler: async (c) => {
          return new Response(null, {
            status: 204,
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Methods": "GET, OPTIONS",
              "Access-Control-Allow-Headers": "Content-Type, Authorization",
              "Access-Control-Max-Age": "86400",
            },
          });
        },
      }),
      registerApiRoute("/suggested-queries", {
        method: "GET",
        handler: async (c) => {
          try {
            const courseId = c.req.query("courseId");
            const schoolId = c.req.query("schoolId");
            const refresh = c.req.query("refresh") === "true";

            if (!courseId || !schoolId) {
              return c.json(
                { error: "courseId and schoolId are required" },
                400,
              );
            }

            console.log("[Suggested Queries] Request:", {
              courseId,
              schoolId,
              refresh,
            });

            // Get env from multiple sources
            const env = c.env || (globalThis as any).__workerEnv || process.env;

            console.log("[Suggested Queries] Env check in route handler:", {
              hasEnv: !!env,
              hasKV: !!env?.SUGGESTED_QUERIES,
              envKeys: env ? Object.keys(env).slice(0, 5) : [],
            });

            const result = await getSuggestedQueriesHandler({
              courseId,
              schoolId,
              refresh,
              mastra,
              env,
            });

            return c.json(result, {
              headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type, Authorization",
              },
            });
          } catch (error) {
            console.error("[Suggested Queries] Error:", error);
            return c.json({
              error: error instanceof Error
                ? error.message
                : "Internal server error",
            }, 500);
          }
        },
      }),
    ],
  },
  deployer: new CloudflareDeployer({
    projectName: "studyspot-assistant",
    scope: process.env.CLOUDFLARE_ACCOUNT_ID ||
      "869782f5d7c9391d085cd41c42977a47",
    auth: {
      apiToken: process.env.CLOUDFLARE_API_TOKEN!,
      apiEmail: process.env.CLOUDFLARE_API_EMAIL,
    },
    kvNamespaces: [
      {
        binding: "SUGGESTED_QUERIES",
        id: "93f6dcfd59164effb33f1882f4a72832",
        preview_id: "2c85e5b2dc824310a094cce6a42c0b54",
      },
    ],
    // Don't include ANY environment variables in wrangler.json
    // All env vars should be managed through Cloudflare secrets
    env: {},
  }),
});
