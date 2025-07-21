# StudySpot Assistant API

A serverless microservice built on Vercel that provides AI-powered assistant functionality with RAG (Retrieval-Augmented Generation) capabilities, real-time streaming, and multi-session support.

## Features

- **Single Model Architecture**: Uses Claude 3.7 Sonnet for all responses (no dynamic model switching)
- **Real-time Streaming**: WebSocket and SSE support for navigation-independent streaming
- **Multi-Session Support**: Handle multiple concurrent conversations per user
- **RAG Integration**: Document retrieval and question answering
- **Tool Support**: Document retrieval tools for enhanced context
- **Vercel Native**: Optimized for Vercel's serverless platform

## Architecture

```
apps/assistant-api/
├── api/                   # Vercel API routes
│   ├── chat/
│   │   └── stream.ts     # Main streaming endpoint
│   ├── rag/              # RAG-specific endpoints
│   ├── tools/            # Tool execution endpoints
│   └── health.ts         # Health check
├── lib/                  # Core services
│   ├── rag/              # RAG services (migrated from web app)
│   ├── streaming/        # Streaming infrastructure
│   ├── tools/            # Assistant tools
│   ├── types/            # TypeScript definitions
│   └── utils/            # Utilities and helpers
├── websockets/           # Real-time WebSocket server
└── middleware/           # Auth, CORS, etc.
```

## Local Development

### Prerequisites

- Node.js 18+
- pnpm
- Vercel CLI
- Redis (for session management)

### Setup

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Copy environment variables:**
   ```bash
   cp .env.example .env.local
   ```
   Fill in your API keys and database credentials.

3. **Start development server:**
   ```bash
   pnpm dev
   ```
   This starts:
   - Vercel dev server on port 3000
   - WebSocket server on port 8080

4. **Test the API:**
   ```bash
   curl http://localhost:3000/api/health
   ```

### Development Scripts

- `pnpm dev` - Start Vercel dev server
- `pnpm build` - Build TypeScript
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm test` - Run tests

## API Endpoints

### Health Check
```
GET /api/health
```

### Streaming Chat
```
POST /api/chat/stream
Content-Type: application/json

{
  "question": "What is photosynthesis?",
  "conversationHistory": [],
  "courseId": "optional-course-id",
  "timeZone": "America/New_York",
  "sessionId": "optional-session-id"
}
```

Response: Server-sent events stream
```
data: {"connected": true}
data: {"chunk": "Photosynthesis is..."}
data: {"chunk": " the process by which..."}
data: {"done": true, "linkedDocumentIds": ["doc-id-1"]}
```

## WebSocket Connection

Connect to `ws://localhost:8080` for real-time streaming:

```javascript
const ws = new WebSocket('ws://localhost:8080');

ws.onopen = () => {
  ws.send(JSON.stringify({
    type: 'stream_request',
    question: 'What is photosynthesis?',
    courseId: 'course-123'
  }));
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Received:', data);
};
```

## Deployment

### Vercel (Recommended)

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel --prod
   ```

3. **Set environment variables in Vercel dashboard**

### Environment Variables

Required for production:
- `ANTHROPIC_API_KEY`
- `OPENAI_API_KEY` (for embeddings)
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `KV_URL` (Vercel KV for session management)

## Migration from Web App

This microservice contains migrated code from the main StudySpot web application:

### Key Changes:
1. **Removed dynamic model switching** - Now uses only Claude
2. **Simplified query service** - No model selection logic
3. **Updated import paths** - Adjusted for new structure
4. **Added WebSocket support** - For real-time streaming
5. **Vercel-native deployment** - Optimized for serverless

### Original Functionality Preserved:
- RAG document retrieval
- Question reformulation
- Tool calling (document retrieval)
- Streaming responses
- Course-specific context
- All system prompts and assistant behavior

## Testing

### Unit Tests
```bash
pnpm test
```

### Integration Tests
```bash
# Test health endpoint
curl http://localhost:3000/api/health

# Test streaming
curl -X POST http://localhost:3000/api/chat/stream \
  -H "Content-Type: application/json" \
  -d '{"question": "Hello", "courseId": "test"}'
```

## Monitoring

- Health checks at `/api/health`
- WebSocket connection metrics
- Session management stats
- Error logging with Pino

## Contributing

1. Follow existing code patterns
2. Update tests for new features
3. Ensure TypeScript types are accurate
4. Test locally with Vercel dev before deploying