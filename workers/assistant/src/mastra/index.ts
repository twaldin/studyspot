import { Mastra } from '@mastra/core';
import { CloudflareDeployer } from '@mastra/deployer-cloudflare';
import { registerApiRoute } from '@mastra/core/server';
import { z } from 'zod';

// Import agents
import { StudySpotAgent } from './agents/studyspot-agent.js';
import { queryReformulationAgent } from './agents/query-reformulation-agent.js';

// Import workflows
import { ragWorkflow, RAGWorkflowStreaming, RAGWorkflowInput } from './workflows/rag-workflow.js';
import { documentIngestionWorkflow, executeDocumentIngestion } from './workflows/document-ingestion-workflow.js';

// Import tools
import { verifyCourseTool } from './tools/verify-course.tool.js';

// Import route handlers (not the route definitions)
import { getSuggestedQueriesHandler } from '../services/suggested-queries.service.js';
import { testEnvRoute } from '../routes/test-env.js';

// Request schema (matching original API exactly)
const StreamRequestSchema = z.object({
  question: z.string().min(1, 'Question is required'),
  conversationHistory: z.array(z.object({
    role: z.enum(['user', 'assistant', 'system']),
    content: z.string()
  })).default([]),
  courseId: z.string().optional(),
  userId: z.string().optional(),
  timeZone: z.string().optional(),
  sessionId: z.string().optional(),
  // Developer-only prompt overrides
  promptOverrides: z.any().optional()
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
      origin: '*', // Allow all origins for now
      allowMethods: ['GET', 'POST', 'OPTIONS'],
      allowHeaders: ['Content-Type', 'Authorization', 'X-Prompt-Override'],
      credentials: true,
    },
    apiRoutes: [
      // CORS preflight handler for /chat/stream
      registerApiRoute('/chat/stream', {
        method: 'OPTIONS' as any,
        handler: async (c) => {
          return new Response(null, {
            status: 204,
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
              'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Prompt-Override',
              'Access-Control-Max-Age': '86400',
            },
          });
        },
      }),
      // Main chat streaming endpoint for same-domain deployment
      registerApiRoute('/chat/stream', {
        method: 'POST',
        handler: async (c) => {
          try {
            // Parse and validate request body
            const body = await c.req.json();
            const { question, conversationHistory, courseId, userId, timeZone, sessionId, promptOverrides } = 
              StreamRequestSchema.parse(body);

            // Log prompt override usage (matching original API)
            if (promptOverrides) {
              console.log(`[Mastra Stream API] Prompt override request (dev panel)`, {
                sessionId,
                hasOverrides: !!promptOverrides,
                overrideKeys: promptOverrides ? Object.keys(promptOverrides) : []
              });
            }

            // Set up streaming headers
            c.header('Content-Type', 'text/event-stream');
            c.header('Cache-Control', 'no-cache');
            c.header('Connection', 'keep-alive');

            console.log(`[Mastra Stream API] Starting RAG stream`, {
              question: question.substring(0, 100),
              courseId,
              sessionId,
              timestamp: new Date().toISOString()
            });

            // Prepare input for RAG workflow
            const workflowInput: RAGWorkflowInput = {
              question,
              conversationHistory,
              courseId,
              userId,
              timeZone,
              sessionId,
              promptOverrides
            };

            // Start streaming response using RAGWorkflowStreaming
            const streamGenerator = RAGWorkflowStreaming.executeStream(workflowInput);

            // Convert to SSE format matching original API
            const encoder = new TextEncoder();
            const sseStream = new ReadableStream({
              async start(controller) {
                let hasStarted = false;

                try {
                  for await (const response of streamGenerator) {
                    if (!hasStarted) {
                      hasStarted = true;
                      // Send initial connection confirmation (matching original API)
                      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ connected: true })}\n\n`));
                    }

                    if (response.error) {
                      // Error response (matching original API format)
                      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: response.error })}\n\n`));
                      break;
                    } else if (response.chunk) {
                      // Text chunk response (matching original API format)
                      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ chunk: response.chunk })}\n\n`));
                    } else if (response.toolActivity) {
                      // Tool activity event (enhanced thinking indicator)
                      console.log(`[Stream API] Received tool activity event from workflow:`, response.toolActivity);
                      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ toolActivity: response.toolActivity })}\n\n`));
                    } else if (response.done) {
                      console.log(`[Stream API] Processing done response with linkedDocumentIds:`, response.linkedDocumentIds);
                      
                      // Send simple type/id pairs to client - client will fetch details
                      const linkedResources = response.linkedDocumentIds || [];
                      
                      console.log(`[Stream API] Sending ${linkedResources.length} linked resources to client:`, linkedResources);
                      
                      // Send final response
                      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
                        done: true, 
                        linkedResources
                      })}\n\n`));
                      break;
                    }
                  }

                  controller.close();
                  console.log(`[Mastra Stream API] Stream completed`, { courseId, sessionId });

                } catch (error) {
                  console.error(`[Mastra Stream API] Stream error:`, error);
                  controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
                    error: error instanceof Error ? error.message : 'Internal server error' 
                  })}\n\n`));
                  controller.close();
                }
              },
            });

            // Return SSE response with CORS headers
            return new Response(sseStream, {
              headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Prompt-Override',
              },
            });

          } catch (error) {
            console.error(`[Mastra Stream API] Error in stream handler:`, error);
            
            return c.json({ 
              error: error instanceof Error ? error.message : 'Internal server error' 
            }, 500);
          }
        },
      }),
      // Course verification endpoint
      registerApiRoute('/courses/verify', {
        method: 'OPTIONS' as any,
        handler: async (c) => {
          return new Response(null, {
            status: 204,
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
              'Access-Control-Allow-Headers': 'Content-Type, Authorization',
              'Access-Control-Max-Age': '86400',
            },
          });
        },
      }),
      registerApiRoute('/courses/verify', {
        method: 'POST',
        handler: async (c) => {
          try {
            const body = await c.req.json();
            const { courseCode, schoolName } = body;

            if (!courseCode || !schoolName) {
              return c.json({ 
                error: 'Course code and school name are required' 
              }, 400);
            }

            console.log('[Course Verification API] Verifying course:', { courseCode, schoolName });

            // Use the verify course tool
            const result = await verifyCourseTool.execute({
              context: { courseCode, schoolName },
            });

            console.log('[Course Verification API] Verification result:', result);

            // Return response matching the original API format
            return c.json(result, {
              headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
              },
            });

          } catch (error) {
            console.error('[Course Verification API] Error:', error);
            
            // Default to verified if there's an error
            return c.json({ 
              verified: true,
              message: 'Course verified for academic use (AI check skipped)',
              reason: 'AI safety check unavailable',
            }, {
              headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
              },
            });
          }
        },
      }),
      // Document ingestion endpoint (CORS preflight)
      registerApiRoute('/documents/ingest-stream', {
        method: 'OPTIONS' as any,
        handler: async (c) => {
          return new Response(null, {
            status: 204,
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
              'Access-Control-Allow-Headers': 'Content-Type, Authorization',
              'Access-Control-Max-Age': '86400',
            },
          });
        },
      }),
      // Document ingestion streaming endpoint
      registerApiRoute('/documents/ingest-stream', {
        method: 'POST',
        handler: async (c) => {
          try {
            const body = await c.req.json();
            const { files, courseId, userId } = body;

            if (!files || !Array.isArray(files) || files.length === 0) {
              return c.json({ error: 'No files provided' }, 400);
            }

            if (!courseId) {
              return c.json({ error: 'Course ID is required' }, 400);
            }

            console.log('[Document Ingestion API] Starting ingestion', {
              fileCount: files.length,
              courseId,
              userId,
            });

            // Set up SSE headers
            c.header('Content-Type', 'text/event-stream');
            c.header('Cache-Control', 'no-cache');
            c.header('Connection', 'keep-alive');
            c.header('Access-Control-Allow-Origin', '*');

            const encoder = new TextEncoder();
            const sseStream = new ReadableStream({
              async start(controller) {
                try {
                  // Send initial connection event
                  controller.enqueue(
                    encoder.encode(`data: ${JSON.stringify({ type: 'connected' })}\n\n`)
                  );

                  // Process files sequentially
                  for (let i = 0; i < files.length; i++) {
                    const file = files[i];
                    
                    // Send file start event
                    controller.enqueue(
                      encoder.encode(`data: ${JSON.stringify({
                        type: 'file-start',
                        fileIndex: i,
                        fileName: file.fileName,
                        totalFiles: files.length,
                      })}\n\n`)
                    );

                    try {
                      // Send initial step progress events
                      const sendProgress = (message: string) => {
                        controller.enqueue(
                          encoder.encode(`data: ${JSON.stringify({
                            type: 'step-progress',
                            fileIndex: i,
                            fileName: file.fileName,
                            message,
                          })}\n\n`)
                        );
                      };

                      // Execute the simplified ingestion function with progress callbacks
                      const result = await executeDocumentIngestion({
                        fileKey: file.fileKey || file.fileName, // Use fileKey if available, otherwise fileName
                        fileUrl: file.fileUrl,
                        fileName: file.fileName,
                        fileType: file.fileType,
                        courseId,
                        userId: userId || 'anonymous',
                        onProgress: sendProgress,
                        mastra, // Pass the mastra instance
                      });

                      // Send file complete event
                      controller.enqueue(
                        encoder.encode(`data: ${JSON.stringify({
                          type: 'file-complete',
                          fileIndex: i,
                          fileName: file.fileName,
                          chunksCreated: result.chunkCount || 0,
                          status: result.status,
                          documentId: result.documentId,
                        })}\n\n`)
                      );
                    } catch (error) {
                      console.error(`[Document Ingestion API] Error processing file ${file.fileName}:`, error);
                      
                      // Send file error event
                      controller.enqueue(
                        encoder.encode(`data: ${JSON.stringify({
                          type: 'file-error',
                          fileIndex: i,
                          fileName: file.fileName,
                          error: error instanceof Error ? error.message : 'Unknown error',
                        })}\n\n`)
                      );
                    }
                  }

                  // Send completion event
                  controller.enqueue(
                    encoder.encode(`data: ${JSON.stringify({
                      type: 'complete',
                      message: 'All files processed',
                    })}\n\n`)
                  );
                  
                  controller.close();
                } catch (error) {
                  console.error('[Document Ingestion API] Stream error:', error);
                  controller.enqueue(
                    encoder.encode(`data: ${JSON.stringify({
                      type: 'error',
                      error: error instanceof Error ? error.message : 'Internal server error',
                    })}\n\n`)
                  );
                  controller.close();
                }
              },
            });

            return new Response(sseStream);
          } catch (error) {
            console.error('[Document Ingestion API] Error:', error);
            return c.json({
              error: error instanceof Error ? error.message : 'Internal server error',
            }, 500);
          }
        },
      }),
      // Suggested queries routes (defined inline for proper bundling)
      registerApiRoute('/suggested-queries', {
        method: 'OPTIONS' as any,
        handler: async (c) => {
          return new Response(null, {
            status: 204,
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Methods': 'GET, OPTIONS',
              'Access-Control-Allow-Headers': 'Content-Type, Authorization',
              'Access-Control-Max-Age': '86400',
            },
          });
        },
      }),
      registerApiRoute('/suggested-queries', {
        method: 'GET',
        handler: async (c) => {
          try {
            const courseId = c.req.query('courseId');
            const schoolId = c.req.query('schoolId');
            const refresh = c.req.query('refresh') === 'true';
            
            if (!courseId || !schoolId) {
              return c.json({ error: 'courseId and schoolId are required' }, 400);
            }

            console.log('[Suggested Queries] Request:', { courseId, schoolId, refresh });
            
            // Get env from multiple sources
            const env = c.env || (globalThis as any).__workerEnv || process.env;
            
            console.log('[Suggested Queries] Env check in route handler:', {
              hasEnv: !!env,
              hasKV: !!env?.SUGGESTED_QUERIES,
              envKeys: env ? Object.keys(env).slice(0, 5) : []
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
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
              },
            });
          } catch (error) {
            console.error('[Suggested Queries] Error:', error);
            return c.json({ 
              error: error instanceof Error ? error.message : 'Internal server error' 
            }, 500);
          }
        },
      }),
      // Test environment route
      testEnvRoute,
    ],
  },
  deployer: new CloudflareDeployer({
    projectName: 'studyspot-assistant',
    scope: process.env.CLOUDFLARE_ACCOUNT_ID || '869782f5d7c9391d085cd41c42977a47',
    auth: {
      apiToken: process.env.CLOUDFLARE_API_TOKEN!,
      apiEmail: process.env.CLOUDFLARE_API_EMAIL
    },
    kvNamespaces: [
      {
        binding: 'SUGGESTED_QUERIES',
        id: '93f6dcfd59164effb33f1882f4a72832'
      }
    ],
    // Don't include ANY environment variables in wrangler.json
    // All env vars should be managed through Cloudflare secrets
    env: {}
  }),
});