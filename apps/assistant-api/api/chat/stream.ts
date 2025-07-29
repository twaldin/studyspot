// Simple request/response types for Node.js server
interface SimpleRequest {
  method: string;
  body: any;
  headers: any;
  url: string;
}

interface SimpleResponse {
  setHeader: (name: string, value: string) => void;
  write: (chunk: string) => void;
  end: () => void;
  status: (code: number) => SimpleResponse;
  json: (data: any) => void;
  headersSent: boolean;
}
import { z } from 'zod';
import { RAGWorkflowStreaming, RAGWorkflowInput } from '../../src/mastra/workflows/rag-workflow.js';

// Prompt override configuration schema (matching original API)
const PromptOverrideSchema = z.object({
  systemPrompt: z.string().optional(),
  ragDecisionPrompt: z.string().optional(),
  queryReformulationPrompt: z.string().optional(),
  toolDescription: z.string().optional(),
  contextFormatting: z.object({
    useHeaders: z.boolean().optional(),
    headerText: z.string().optional(),
    footerText: z.string().optional(),
    includeDocumentIds: z.boolean().optional(),
    documentSeparator: z.string().optional()
  }).optional(),
  responseFormat: z.object({
    requireJSON: z.boolean().optional(),
    includeLinkedDocumentIds: z.boolean().optional(),
    encourageConciseness: z.boolean().optional(),
    maxResponseLength: z.number().optional()
  }).optional(),
  mathFormatting: z.enum(['latex', 'plain', 'markdown']).optional(),
  personality: z.object({
    tone: z.enum(['helpful', 'professional', 'casual', 'academic']).optional(),
    verbosity: z.enum(['concise', 'balanced', 'detailed']).optional(),
    formality: z.enum(['formal', 'informal', 'neutral']).optional()
  }).optional()
});

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
  promptOverrides: PromptOverrideSchema.optional()
});

// Request deduplication cache
const activeRequests = new Map<string, Promise<void>>();

/**
 * Mastra-based streaming chat endpoint
 * Maintains exact compatibility with the original assistant API
 */
export default async function handler(req: SimpleRequest, res: SimpleResponse) {
  // Set CORS headers for all requests (matching original API)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Prompt-Override');

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Parse and validate request body
    const body = StreamRequestSchema.parse(req.body);
    const { question, conversationHistory, courseId, userId, timeZone, sessionId, promptOverrides } = body;

    // Log prompt override usage (matching original API)
    if (promptOverrides) {
      console.log(`[Mastra Stream API] Prompt override request (dev panel)`, {
        sessionId,
        hasOverrides: !!promptOverrides,
        overrideKeys: promptOverrides ? Object.keys(promptOverrides) : []
      });
    }

    // Set up streaming headers (matching original API exactly)
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    console.log(`[Mastra Stream API] Starting RAG stream`, {
      question: question.substring(0, 100),
      courseId,
      sessionId,
      timestamp: new Date().toISOString()
    });

    // Create deduplication key based on sessionId and question
    const requestKey = `${sessionId}-${question}`;
    
    // Check if this exact request is already being processed
    if (activeRequests.has(requestKey)) {
      console.log(`[Mastra Stream API] Duplicate request detected, waiting for existing request`, {
        requestKey,
        sessionId
      });
      
      // Wait for the existing request to complete
      try {
        await activeRequests.get(requestKey);
      } catch (error) {
        // If the existing request failed, we can proceed with this one
        console.log(`[Mastra Stream API] Existing request failed, proceeding with new request`);
      }
      
      // Send empty response since the original request should have handled it
      res.write(`data: ${JSON.stringify({ done: true, linkedResources: [] })}\n\n`);
      res.end();
      return;
    }

    // Prepare input for RAG workflow
    const workflowInput: RAGWorkflowInput = {
      question,
      conversationHistory,
      courseId,
      userId,
      timeZone,
      sessionId, // Pass sessionId to the workflow
      promptOverrides
    };

    // Start streaming response using Mastra RAG workflow
    const streamGenerator = RAGWorkflowStreaming.executeStream(workflowInput);

    // Create a promise for this request and store it in the active requests map
    const requestPromise = (async () => {
      let hasStarted = false;

      for await (const response of streamGenerator) {
        if (!hasStarted) {
          hasStarted = true;
          // Send initial connection confirmation (matching original API)
          res.write(`data: ${JSON.stringify({ connected: true })}\n\n`);
        }

        if (response.error) {
          // Error response (matching original API format)
          res.write(`data: ${JSON.stringify({ error: response.error })}\n\n`);
          break;
        } else if (response.chunk) {
          // Text chunk response (matching original API format)
          res.write(`data: ${JSON.stringify({ chunk: response.chunk })}\n\n`);
        } else if (response.done) {
          console.log(`[Stream API] Processing done response with linkedDocumentIds:`, response.linkedDocumentIds);
          
          // Send simple type/id pairs to client - client will fetch details
          const linkedResources = response.linkedDocumentIds || [];
          
          console.log(`[Stream API] Sending ${linkedResources.length} linked resources to client:`, linkedResources);
          
          // Send final response
          res.write(`data: ${JSON.stringify({ 
            done: true, 
            linkedResources
          })}\n\n`);
          break;
        }
      }

      res.end();
      console.log(`[Mastra Stream API] Stream completed`, { courseId, sessionId });
    })();

    // Store the request promise
    activeRequests.set(requestKey, requestPromise);

    try {
      // Wait for the request to complete
      await requestPromise;
    } finally {
      // Clean up the request from the active requests map
      activeRequests.delete(requestKey);
    }

  } catch (error) {
    console.error(`[Mastra Stream API] Error in stream handler:`, {
      error,
      body: req.body
    });
    
    // Clean up the request if we have the parsed body
    if (req.body && req.body.sessionId && req.body.question) {
      const requestKey = `${req.body.sessionId}-${req.body.question}`;
      activeRequests.delete(requestKey);
    }
    
    if (!res.headersSent) {
      res.setHeader('Content-Type', 'application/json');
      res.status(500).json({ 
        error: error instanceof Error ? error.message : 'Internal server error' 
      });
    } else {
      res.write(`data: ${JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Internal server error' 
      })}\n\n`);
      res.end();
    }
  }
}