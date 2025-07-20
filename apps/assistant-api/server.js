import { createServer } from 'http';
import { parse } from 'url';
import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

// Simple development server
const server = createServer(async (req, res) => {
  const parsedUrl = parse(req.url, true);
  const { pathname } = parsedUrl;

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Health check endpoint
  if (pathname === '/api/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'healthy',
      service: 'studyspot-assistant-api',
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    }));
    return;
  }

  // Chat stream endpoint - real RAG implementation
  if (pathname === '/api/chat/stream') {
    if (req.method !== 'POST') {
      res.writeHead(405, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Method not allowed' }));
      return;
    }

    try {
      // Parse request body
      let body = '';
      req.on('data', chunk => body += chunk);
      await new Promise(resolve => req.on('end', resolve));
      
      const requestData = JSON.parse(body);
      
      // Validate request
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

      const { question, conversationHistory, courseId, timeZone } = StreamRequestSchema.parse(requestData);

      // Set up streaming headers
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

      // Import RAG service
      const { getFullRagResponseStream } = await import('./dist/lib/rag/rag.service.js');
      const { createClient } = await import('@supabase/supabase-js');

      // Initialize Supabase client
      const supabase = createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY
      );

      console.log('Starting RAG stream for question:', question.substring(0, 100));

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
      console.log('Stream completed');

    } catch (error) {
      console.error('Error handling stream request:', error);
      
      if (!res.headersSent) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
          error: error instanceof Error ? error.message : 'Internal server error' 
        }));
      } else {
        res.write(`data: ${JSON.stringify({ 
          error: error instanceof Error ? error.message : 'Internal server error' 
        })}\n\n`);
        res.end();
      }
    }
    return;
  }

  // 404 for other routes
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not found' }));
});

const PORT = process.env.PORT || 3001;
const HOST = process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost';

server.listen(PORT, HOST, () => {
  const baseUrl = process.env.NODE_ENV === 'production' 
    ? `https://${process.env.RENDER_EXTERNAL_HOSTNAME || 'your-app.onrender.com'}`
    : `http://localhost:${PORT}`;
    
  console.log(`🚀 Assistant API server running on ${baseUrl}`);
  console.log(`   Health check: ${baseUrl}/api/health`);
  console.log(`   Stream endpoint: ${baseUrl}/api/chat/stream`);
});