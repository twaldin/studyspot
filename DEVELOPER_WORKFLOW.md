# Developer Workflow for StudySpot

This document outlines the complete developer workflow for working with StudySpot's Cloudflare Workers architecture.

## Prerequisites

1. **Environment Setup**
   - Copy `.env.example` to `.env` and fill in your development API keys
   - Install dependencies: `pnpm install`
   - Ensure you have wrangler CLI installed: `npm install -g wrangler`

2. **Cloudflare Account**
   - Create a Cloudflare account and obtain your API token
   - Set `CLOUDFLARE_API_TOKEN` in your `.env` file

## Local Development Workflow

### 1. Standard Development Mode (Next.js with Hot Reloading)

For rapid development with hot module reloading:

```bash
# Start both web app and assistant worker
pnpm dev

# Or start individually
pnpm dev:web        # Web app on http://localhost:3000
pnpm dev:assistant  # Assistant worker on http://localhost:8787
```

### 2. Cloudflare Runtime Development

For testing with the actual Cloudflare Workers runtime:

```bash
# Build and run with Cloudflare runtime
pnpm dev:cloudflare

# This will:
# 1. Build both workers with OpenNext.js and Mastra
# 2. Run web app on http://localhost:3000 using wrangler dev
# 3. Run assistant on http://localhost:8787
```

### 3. Testing AI Features

The assistant worker includes a built-in Mastra playground for testing:

```bash
# Access the Mastra playground
# When running pnpm dev:assistant, visit http://localhost:8787/api
```

## Understanding the Architecture

### Why OpenNext.js + Wrangler?

StudySpot uses a two-step process for Cloudflare Workers deployment:

1. **OpenNext.js Build**: Transforms the Next.js app into Cloudflare Workers format
   - Handles complex Next.js features (App Router, Middleware, API Routes)
   - Creates `.open-next/` directory with worker-ready code
   - Manages static assets and edge runtime compatibility

2. **Wrangler Deploy**: Deploys the OpenNext.js output to Cloudflare
   - Uses `wrangler.toml` configuration
   - Manages environment variables and secrets
   - Handles Worker bindings and assets

This approach gives us the best of both worlds: Next.js development experience with Cloudflare's global edge network.

## Building and Testing

### Build for Production

```bash
# Build everything
pnpm build

# Or build individually
pnpm build:web       # Build web app for Cloudflare
pnpm build:assistant # Build assistant worker
```

### Local Testing of Production Build

```bash
# After building, test the production build locally
cd apps/web && pnpm start:cloudflare
cd workers/assistant && pnpm dev
```

## Deployment Workflow

### 1. Deploy to Production

```bash
# Deploy everything to production
pnpm deploy

# Or deploy individually
pnpm deploy:web       # Deploy web app
pnpm deploy:assistant # Deploy assistant worker
```

### 2. Managing Secrets

Production secrets are managed through Wrangler CLI:

```bash
# List secrets
pnpm secrets:list:web       # Web app secrets
pnpm secrets:list:assistant # Assistant worker secrets

# Set secrets
pnpm secrets:set:web KEY_NAME       # Will prompt for value
pnpm secrets:set:assistant KEY_NAME # Will prompt for value
```

Common secrets to set:
- `SUPABASE_SERVICE_ROLE_KEY`
- `UPLOADTHING_TOKEN`
- `BREVO_API_KEY`
- `CLERK_SECRET_KEY`

### 3. Preview Deployments (After GitHub Integration)

Once the repository is connected to Cloudflare:

```bash
# Deploy to preview environment
cd apps/web && pnpm deploy:preview

# This creates a preview URL like:
# https://preview-{branch-name}.studyspot-web.workers.dev
```

## Pull Request Workflow

### 1. Feature Development

```bash
# Create feature branch
git checkout -b feature/your-feature

# Develop and test locally
pnpm dev

# Build and test production build
pnpm build
pnpm dev:cloudflare
```

### 2. Pre-PR Checklist

```bash
# Run linting
pnpm lint

# Build all workers
pnpm build

# Test with Cloudflare runtime
pnpm dev:cloudflare
```

### 3. Pull Request Process

1. **Push your branch**
   ```bash
   git push origin feature/your-feature
   ```

2. **Automatic Preview Deploy** (once GitHub integration is set up)
   - Cloudflare will automatically create a preview deployment
   - Preview URL will be posted as a comment on the PR
   - Format: `https://pr-{number}.studyspot-web.pages.dev`

3. **Manual Preview Deploy** (before GitHub integration)
   ```bash
   # From your feature branch
   cd apps/web && pnpm deploy:preview
   ```

### 4. Post-Merge

After PR is merged to main:
- Cloudflare automatically deploys to production
- Monitor deployment at Cloudflare dashboard

## Troubleshooting

### Build Errors

1. **Missing environment variables during build**
   - The build script automatically copies `.env` to `.env.local`
   - Ensure your `.env` file has all required variables

2. **Cloudflare runtime errors**
   - Check `wrangler.toml` configuration
   - Ensure all Node.js APIs are compatible with Workers runtime
   - Review logs: `wrangler tail`

### Local Development Issues

1. **Port conflicts**
   - Web app: Change port in `next dev --port 3001`
   - Assistant: Update port in `mastra.config.ts`

2. **Environment variable issues**
   - Development uses `.env` file
   - Production uses Cloudflare secrets
   - Never commit `.env` or `.dev.vars` files

### Deployment Issues

1. **Authentication errors**
   - Verify `CLOUDFLARE_API_TOKEN` is set correctly
   - Check token permissions in Cloudflare dashboard

2. **Build failures**
   - Clean build directories: `rm -rf .next .open-next`
   - Rebuild: `pnpm build`

## Best Practices

1. **Environment Variables**
   - Use `.env` for local development only
   - Set production secrets via `wrangler secret`
   - Never commit sensitive values

2. **Testing**
   - Always test with `pnpm dev:cloudflare` before deploying
   - Verify API communication between workers
   - Test file uploads and AI features

3. **Performance**
   - Monitor Worker metrics in Cloudflare dashboard
   - Use caching where appropriate
   - Optimize bundle size

## CI/CD Setup (Future)

Once approved for GitHub integration:

1. **Connect Repository**
   ```bash
   # In Cloudflare dashboard
   # Pages > Create application > Connect to Git
   ```

2. **Configure Build**
   - Build command: `pnpm build:web`
   - Build output: `.open-next`
   - Environment variables: Set in dashboard

3. **Automatic Deployments**
   - Production: Deploys on push to `main`
   - Preview: Deploys on PR creation/update

## Support

For issues or questions:
- Check logs: `wrangler tail` (for live logs)
- Review Cloudflare dashboard for metrics
- Consult team lead for secret access