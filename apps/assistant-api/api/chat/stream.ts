import { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';
import { getFullRagResponseStream } from '@/lib/rag/rag.service';
import logger from '@/lib/utils/logger';

// Request schema
const StreamRequestSchema = z.object({
  question: z.string().min(1, 'Question is required'),
  conversationHistory: z.array(z.object({
    role: z.enum(['user', 'assistant', 'system']),
    content: z.string()
  })).default([]),
  courseId: z.string().optional(),
  timeZone: z.string().optional(),
  sessionId: z.string().optional()
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Parse and validate request body
    const body = StreamRequestSchema.parse(req.body);
    const { question, conversationHistory, courseId, timeZone, sessionId } = body;

    // Set up streaming headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

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

    // Start streaming response
    const streamGenerator = getFullRagResponseStream(
      supabase,
      question,
      conversationHistory,
      courseId,
      timeZone
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