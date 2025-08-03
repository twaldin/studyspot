# StudySpot Workers Deployment Guide

This document provides comprehensive guidance for deploying StudySpot's three-worker architecture to Cloudflare Workers.

## Architecture Overview

StudySpot uses a distributed three-worker architecture:

```
┌─────────────────────────────────────────────────────────────┐
│                    StudySpot Architecture                    │
├─────────────────────────────────────────────────────────────┤
│  Web App (Edge Runtime)         │  Port 3000                │
│  - Next.js with @cloudflare/    │  Built: .vercel/output    │
│    next-on-pages                │                           │
│  - Static UI & simple routes    │                           │
├─────────────────────────────────────────────────────────────┤
│  Assistant Worker               │  Port 8787                │
│  - AI chat & RAG workflows      │  Built: .mastra/output    │
│  - Mastra framework             │                           │
│  - Anthropic Claude 3.5         │                           │
├─────────────────────────────────────────────────────────────┤
│  Security Worker                │  Port 8788                │
│  - File content validation      │  Built: dist/             │
│  - Malicious content detection  │                           │
│  - Educational allowlisting     │                           │
├─────────────────────────────────────────────────────────────┤
│  Ingestion Worker               │  Port 8789                │
│  - Document processing          │  Built: dist/             │
│  - Text extraction & chunking   │                           │
│  - Embedding generation         │                           │
└─────────────────────────────────────────────────────────────┘
```

## Prerequisites

1. **Cloudflare Account** with Workers Paid plan (required for:)
   - Increased CPU time limits (30s)
   - Increased memory (256MB)
   - Node.js compatibility

2. **Wrangler CLI** installed globally:
   ```bash
   npm install -g wrangler
   wrangler login
   ```

3. **Environment Variables** configured for each worker

## Environment Setup

### 1. Assistant Worker (.dev.vars)
```bash
cd workers/assistant
cp .dev.vars.example .dev.vars
# Edit .dev.vars with your values:
ANTHROPIC_API_KEY=sk-ant-api03-...
OPENAI_API_KEY=sk-proj-...
GEMINI_API_KEY=AIzaSy...
SUPABASE_URL=https://...supabase.co
SUPABASE_ANON_KEY=ey...
SUPABASE_SERVICE_ROLE_KEY=ey...
CLERK_SECRET_KEY=sk_test_...
```

### 2. Security Worker (.dev.vars)
```bash
cd workers/security
cp .dev.vars.example .dev.vars
# Edit .dev.vars - minimal config needed
ENVIRONMENT=development
```

### 3. Ingestion Worker (.dev.vars)
```bash
cd workers/ingestion
cp .dev.vars.example .dev.vars
# Edit .dev.vars with your values:
SUPABASE_URL=https://...supabase.co
SUPABASE_SERVICE_ROLE_KEY=ey...
OPENAI_API_KEY=sk-proj-...
GOOGLE_API_KEY=AIzaSy...
```

## Development

### Start All Workers Locally
```bash
# Start core workers (web + assistant + security + ingestion)
pnpm dev

# Or start all services including dev panel
pnpm dev:all

# Or start individual workers
pnpm dev:web          # Next.js app on port 3000
pnpm dev:assistant    # Mastra agent on port 8787
pnpm dev:security     # Security validation on port 8788
pnpm dev:ingestion    # Document processing on port 8789
pnpm dev:panel        # Dev panel on port 3002
```

### Worker Health Checks
- Assistant: http://localhost:8787/api (Mastra playground)
- Security: http://localhost:8788/health
- Ingestion: http://localhost:8789/health

## Deployment

### 1. Build All Workers
```bash
pnpm build
```

### 2. Deploy Individual Workers

#### Assistant Worker (Mastra)
```bash
cd workers/assistant
pnpm deploy
# Sets environment variables automatically from .dev.vars
```

#### Security Worker
```bash
cd workers/security
pnpm deploy
```

#### Ingestion Worker
```bash
cd workers/ingestion
pnpm deploy
```

#### Web App (Cloudflare Pages)
```bash
cd apps/web
pnpm deploy
# Or push to Git for automatic deployment
```

### 3. Production Environment Variables

Set production environment variables in Cloudflare dashboard:
- Go to Cloudflare Workers & Pages
- Select each worker
- Settings → Environment Variables
- Add all required variables from .dev.vars.example

## API Integration

### Update Web App Endpoints

Replace local service calls with worker endpoints:

```typescript
// OLD: Direct service import
import { verifyFileContent } from '@/lib/services/file/verifyFileContent';

// NEW: Worker API call
const response = await fetch('https://security-worker.your-domain.workers.dev/validate-file', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ fileUrl, fileName, fileSize })
});
```

### Worker Endpoints

#### Security Worker
- `POST /validate-file` - File content validation
- `GET /health` - Health check

#### Ingestion Worker  
- `POST /ingest` - Document ingestion pipeline
- `GET /health` - Health check

#### Assistant Worker
- `POST /api/chat/stream` - Streaming chat endpoint
- `GET /` - Mastra playground

## Next Steps

1. **Install Dependencies**: `pnpm install` to install all worker dependencies
2. **Configure Environment Variables**: Copy .dev.vars.example files and add your API keys
3. **Test Locally**: Run `pnpm dev` to start all workers
4. **Deploy**: Use individual deployment commands for each worker
5. **Update Web App**: Modify API routes to call worker endpoints instead of local services

## Testing the Implementation

```bash
# 1. Install all dependencies
pnpm install

# 2. Test individual workers
pnpm dev:security    # Test security worker on port 8788
pnpm dev:ingestion   # Test ingestion worker on port 8789
pnpm dev:assistant   # Test assistant worker on port 8787

# 3. Test health endpoints
curl http://localhost:8788/health
curl http://localhost:8789/health
curl http://localhost:8787/api
```