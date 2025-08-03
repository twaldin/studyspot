# StudySpot Cloudflare Workers Deployment Guide

## Overview

StudySpot has been successfully migrated to a Cloudflare Workers architecture:

- **API Worker** (`workers/api/`) - Handles all CRUD operations and business logic
- **Assistant Worker** (`workers/assistant/`) - AI operations with Mastra framework  
- **Pages Web App** (`apps/pages-web/`) - Static Next.js frontend deployed to Cloudflare Pages

## Local Development & Testing

### Prerequisites

1. **Node.js v20.9.0+** and **pnpm** installed
2. **Wrangler CLI** installed globally: `npm install -g wrangler`
3. **Root `.env` file** with all environment variables (see below)

### Environment Variables

Create a `.env` file in the project root with these variables:

```bash
# Database (Supabase)
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Authentication (Clerk)
CLERK_SECRET_KEY=your_clerk_secret_key
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key

# AI Providers
ANTHROPIC_API_KEY=your_anthropic_api_key
OPENAI_API_KEY=your_openai_api_key
GEMINI_API_KEY=your_gemini_api_key

# File Upload (UploadThing)
UPLOADTHING_TOKEN=your_uploadthing_token
UPLOADTHING_APP_ID=your_uploadthing_app_id

# Workers Configuration
NEXT_PUBLIC_API_WORKER_URL=http://localhost:8787
NEXT_PUBLIC_ASSISTANT_WORKER_URL=http://localhost:8788
```

### Setup & Installation

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Build shared packages:**
   ```bash
   pnpm --filter @studyspot/shared build
   ```

### Local Development

#### Option 1: Run Workers Architecture
```bash
# Start all workers + Pages web app
pnpm dev:workers

# Or run individually:
pnpm dev:api-worker        # API Worker on :8787
pnpm dev:assistant-worker  # Assistant Worker on :8788  
pnpm dev:pages-web         # Pages Web App on :3000
```

#### Option 2: Run Original Architecture (fallback)
```bash
# Original Next.js app + API
pnpm dev                   # Web app + Assistant API
pnpm dev:all              # Include dev panel too
```

### Testing the Workers

1. **API Worker** (http://localhost:8787):
   ```bash
   curl http://localhost:8787/api/schools
   ```

2. **Assistant Worker** (http://localhost:8788):
   ```bash
   curl -X POST http://localhost:8788/api/chat/stream \
     -H "Content-Type: application/json" \
     -d '{"messages": [{"role": "user", "content": "Hello"}]}'
   ```

3. **Pages Web App** (http://localhost:3000):
   - Visit http://localhost:3000
   - Should connect to workers automatically

## Production Deployment

### 1. Deploy API Worker

```bash
cd workers/api
wrangler deploy
```

### 2. Deploy Assistant Worker

```bash
cd workers/assistant
mastra deploy  # Uses Mastra's Cloudflare deployer
```

### 3. Deploy Pages Web App

```bash
cd apps/pages-web
pnpm build
wrangler pages deploy out --project-name studyspot-pages
```

### 4. Configure Environment Variables

In Cloudflare dashboard, add these environment variables for each worker:

**API Worker:**
- `CLERK_SECRET_KEY`
- `CLERK_PUBLISHABLE_KEY`
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `UPLOADTHING_TOKEN`

**Assistant Worker:**
- `ANTHROPIC_API_KEY`
- `OPENAI_API_KEY`
- `GEMINI_API_KEY`
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

**Pages Web App:**
- `NEXT_PUBLIC_API_WORKER_URL=https://your-api-worker.workers.dev`
- `NEXT_PUBLIC_ASSISTANT_WORKER_URL=https://your-assistant-worker.workers.dev`
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`

## Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Cloudflare    │    │   API Worker    │    │ Assistant Worker│
│     Pages       │◄──►│   (Hono.js)     │◄──►│   (Mastra)      │
│   (Next.js)     │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│     Users       │    │    Supabase     │    │   AI Providers  │
│   (Browser)     │    │   (Database)    │    │ (Claude, OpenAI)│
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Key Benefits

✅ **Global Performance** - Workers run at edge locations worldwide  
✅ **Auto-scaling** - Handles traffic spikes automatically  
✅ **Cost Efficient** - Pay-per-request pricing model  
✅ **Type Safety** - Full TypeScript throughout the stack  
✅ **Clean Architecture** - Separated concerns with dedicated workers  

## Troubleshooting

### Common Issues

1. **Environment Variables Not Loading:**
   - Ensure `.env` is in project root
   - Check Wrangler is reading from correct directory
   - Verify variables are set in Cloudflare dashboard for production

2. **CORS Issues:**
   - Check `wrangler.toml` CORS configuration
   - Ensure frontend URL is in allowed origins

3. **Authentication Errors:**
   - Verify Clerk keys are correct
   - Check JWT token template in Clerk dashboard

4. **Database Connection Issues:**
   - Confirm Supabase URL and keys
   - Test database connection directly

### Debug Commands

```bash
# Check worker logs
wrangler tail studyspot-api
wrangler tail studyspot-assistant

# Test local builds
pnpm build:workers

# Validate TypeScript
pnpm --filter @studyspot/api-worker typecheck
pnpm --filter @studyspot/assistant-worker typecheck
```

## Migration Status

✅ **API Worker** - All 27 routes implemented  
✅ **Assistant Worker** - RAG workflow with 5 tools  
✅ **Pages Web App** - Complete frontend with API client  
✅ **Environment Config** - Proper dev/prod setup  
✅ **Deployment Scripts** - Ready for production  

The StudySpot application is now fully migrated to Cloudflare Workers while maintaining exact feature parity with the original Next.js implementation!