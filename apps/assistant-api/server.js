import { createServer } from 'http';
import { parse } from 'url';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import streamHandler from './api/chat/stream.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from root .env file
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const PORT = process.env.PORT || 3002;

const server = createServer(async (req, res) => {
  const parsedUrl = parse(req.url, true);
  const { pathname, query } = parsedUrl;

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Prompt-Override');

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Health check endpoint
  if (pathname === '/api/health' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
      status: 'ok', 
      service: 'mastra-assistant-api',
      timestamp: new Date().toISOString()
    }));
    return;
  }

  // Chat stream endpoint
  if (pathname === '/api/chat/stream' && req.method === 'POST') {
    try {
      // Create mock Vercel request/response objects
      const body = await getRequestBody(req);
      
      const mockVercelReq = {
        method: req.method,
        body: JSON.parse(body),
        headers: req.headers,
        url: req.url
      };

      const mockVercelRes = {
        setHeader: (name, value) => res.setHeader(name, value),
        write: (chunk) => res.write(chunk),
        end: () => res.end(),
        status: (code) => {
          res.statusCode = code;
          return mockVercelRes;
        },
        json: (data) => {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(data));
        },
        headersSent: false
      };

      await streamHandler(mockVercelReq, mockVercelRes);
    } catch (error) {
      console.error('[Server] Error in stream handler:', error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Internal server error' }));
    }
    return;
  }

  // 404 for all other routes
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not found' }));
});

// Helper function to get request body
function getRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      resolve(body);
    });
    req.on('error', reject);
  });
}

server.listen(PORT, () => {
  console.log(`[Mastra Assistant API] Server running on http://localhost:${PORT}`);
  console.log(`[Mastra Assistant API] Health check: http://localhost:${PORT}/api/health`);
  console.log(`[Mastra Assistant API] Stream endpoint: http://localhost:${PORT}/api/chat/stream`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('[Mastra Assistant API] Received SIGTERM, shutting down gracefully');
  server.close(() => {
    console.log('[Mastra Assistant API] Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('[Mastra Assistant API] Received SIGINT, shutting down gracefully');
  server.close(() => {
    console.log('[Mastra Assistant API] Server closed');
    process.exit(0);
  });
});