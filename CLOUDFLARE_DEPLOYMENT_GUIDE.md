# Cloudflare Workers Deployment Guide

This guide explains the complete deployment workflow for StudySpot on Cloudflare Workers.

## Architecture Overview

StudySpot is deployed as two Cloudflare Workers:
- **Web Worker**: Next.js app transformed by OpenNext.js
- **Assistant Worker**: Mastra-based AI assistant

## Local Development to Production Workflow

### 1. Local Development (Hot Reloading)

```bash
# Start both services with hot reloading
pnpm dev

# Web app: http://localhost:3000 (Next.js dev server)
# Assistant: http://localhost:8787 (Mastra dev server)
```

### 2. Test with Cloudflare Runtime

Before deploying, test with the actual Workers runtime:

```bash
# Build and run with Cloudflare runtime
pnpm dev:cloudflare

# Both services run in Workers runtime locally
```

### 3. Build for Production

```bash
# Build everything
pnpm build

# This runs:
# - OpenNext.js build for web app (creates .open-next/)
# - Mastra build for assistant (creates .mastra/)
```

### 4. Deploy to Production

```bash
# Deploy both workers
pnpm deploy

# Or deploy individually:
pnpm deploy:web       # Deploy web worker
pnpm deploy:assistant # Deploy assistant worker
```

## Environment Management

### Development
- Uses `.env` file for local development
- Next.js dev server reads from `.env`
- Mastra reads from `.env`

### Production
- Uses Cloudflare secrets and wrangler.toml
- Sensitive values via `wrangler secret put`
- Non-sensitive values in wrangler.toml `[vars]`

## Pull Request Workflow

### 1. Create Feature Branch

```bash
git checkout -b feature/your-feature
```

### 2. Develop and Test

```bash
# Development with hot reloading
pnpm dev

# Test with Workers runtime
pnpm build
pnpm dev:cloudflare
```

### 3. Deploy Preview (Manual)

Until GitHub integration is set up:

```bash
# From feature branch
cd apps/web
pnpm deploy:preview

# Creates preview at:
# https://preview-{branch}.studyspot-web.workers.dev
```

### 4. Create Pull Request

Push your branch and create a PR. Include:
- Preview URL in PR description
- Test results from Cloudflare runtime
- Any new environment variables needed

### 5. After Merge

Main branch automatically deploys to production (once CI/CD is set up).

## Why This Architecture?

### OpenNext.js + Wrangler

We use this combination because:

1. **OpenNext.js**:
   - Transforms Next.js → Cloudflare Workers
   - Handles App Router, Middleware, API Routes
   - Manages static assets
   - Provides edge runtime compatibility

2. **Wrangler**:
   - Deploys to Cloudflare's network
   - Manages secrets and environment variables
   - Provides local Workers runtime
   - Handles Worker-to-Worker communication

### Benefits

- **Development Experience**: Keep Next.js hot reloading
- **Production Performance**: Run on Cloudflare's edge network
- **Type Safety**: Full TypeScript support
- **Global Scale**: Automatic scaling and distribution

## Common Commands Reference

```bash
# Development
pnpm dev              # Hot reloading development
pnpm dev:cloudflare   # Workers runtime testing

# Building
pnpm build            # Build all workers
pnpm build:web        # Build web app only
pnpm build:assistant  # Build assistant only

# Deployment
pnpm deploy           # Deploy everything
pnpm deploy:web       # Deploy web worker
pnpm deploy:assistant # Deploy assistant worker

# Secrets Management
pnpm secrets:list:web       # List web worker secrets
pnpm secrets:set:web KEY    # Set web worker secret
pnpm secrets:list:assistant # List assistant secrets
pnpm secrets:set:assistant KEY # Set assistant secret
```

## Troubleshooting

### Build Errors

1. **Missing environment variables**:
   - The build automatically copies `.env` to `.env.local`
   - Ensure all required variables are in `.env`

2. **OpenNext.js errors**:
   - Clean: `rm -rf .next .open-next`
   - Rebuild: `pnpm build:web`

### Runtime Errors

1. **Worker communication issues**:
   - Check NEXT_PUBLIC_ASSISTANT_API_URL in wrangler.toml
   - Verify assistant worker is deployed

2. **Node.js compatibility**:
   - Ensure `nodejs_compat` flag in wrangler.toml
   - Check for unsupported Node.js APIs

## Future Enhancements

Once repository is connected to Cloudflare:

1. **Automatic Preview Deployments**: Every PR gets a preview URL
2. **Production Auto-Deploy**: Merges to main deploy automatically
3. **Environment Management**: Via Cloudflare dashboard
4. **Branch Previews**: `https://pr-{number}.studyspot-web.pages.dev`