import { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';
import { getFullRagResponseStream } from '@/lib/rag/rag.service';
// Removed developer auth - codebase access is the security boundary
import logger from '@/lib/utils/logger';

// Prompt override configuration schema
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

// Request schema
const StreamRequestSchema = z.object({
  question: z.string().min(1, 'Question is required'),
  conversationHistory: z.array(z.object({
    role: z.enum(['user', 'assistant', 'system']),
    content: z.string()
  })).default([]),
  courseId: z.string().optional(),
  timeZone: z.string().optional(),
  sessionId: z.string().optional(),
  // Developer-only prompt overrides
  promptOverrides: PromptOverrideSchema.optional()
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers for all requests
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
    const { question, conversationHistory, courseId, timeZone, sessionId, promptOverrides } = body;

    // Log prompt override usage (no authentication required)
    if (promptOverrides) {
      logger.info({ 
        sessionId,
        hasOverrides: !!promptOverrides,
        overrideKeys: promptOverrides ? Object.keys(promptOverrides) : []
      }, '[Stream API] Prompt override request (dev panel)');
    }

    // Set up streaming headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Initialize Supabase client
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    logger.info({ 
      question: question.substring(0, 100), 
      courseId, 
      sessionId 
    }, '[Stream API] Starting RAG stream');

    // Start streaming response with optional prompt overrides
    const streamGenerator = getFullRagResponseStream(
      supabase,
      question,
      conversationHistory,
      courseId,
      timeZone,
      promptOverrides // Pass prompt overrides to RAG service
    );

    let hasStarted = false;

    for await (const response of streamGenerator) {
      if (!hasStarted) {
        hasStarted = true;
        // Send initial connection confirmation
        res.write(`data: ${JSON.stringify({ connected: true })}\n\n`);
      }

      if (response.error) {
        res.write(`data: ${JSON.stringify({ error: response.error })}\n\n`);
        break;
      } else if (response.chunk) {
        res.write(`data: ${JSON.stringify({ chunk: response.chunk })}\n\n`);
      } else if (response.done) {
        res.write(`data: ${JSON.stringify({ 
          done: true, 
          linkedDocumentIds: response.linkedDocumentIds 
        })}\n\n`);
        break;
      }
    }

    res.end();
    logger.info({ courseId, sessionId }, '[Stream API] Stream completed');

  } catch (error) {
    logger.error({ error, body: req.body }, '[Stream API] Error in stream handler');
    
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