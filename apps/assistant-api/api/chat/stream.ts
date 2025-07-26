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
      sessionId
    });

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
        // Final response with document IDs (matching original API format)
        res.write(`data: ${JSON.stringify({ 
          done: true, 
          linkedDocumentIds: response.linkedDocumentIds 
        })}\n\n`);
        break;
      } else if (response.toolCall) {
        // Log tool calls for debugging (not sent to client to maintain compatibility)
        console.log(`[Mastra Stream API] Tool call executed:`, {
          toolName: response.toolCall.name,
          toolId: response.toolCall.id
        });
      } else if (response.toolResult) {
        // Log tool results for debugging (not sent to client to maintain compatibility)
        console.log(`[Mastra Stream API] Tool result received:`, {
          toolId: response.toolResult.id,
          success: response.toolResult.success
        });
      }
    }

    res.end();
    console.log(`[Mastra Stream API] Stream completed`, { courseId, sessionId });

  } catch (error) {
    console.error(`[Mastra Stream API] Error in stream handler:`, {
      error,
      body: req.body
    });
    
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