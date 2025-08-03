# Environment Variable Setup for StudySpot

This document explains how environment variables are managed between development and production environments.

## Development Environment

### Local Development (Next.js dev server)
- Uses `.env.development` file in the root directory
- Assistant API runs on `http://localhost:8787`
- Web app runs on `http://localhost:3000`

```bash
# Start both services in development mode
pnpm dev

# Or start individually
pnpm dev:web      # Web app with .env.development
pnpm dev:assistant # Assistant worker on port 8787
```

### Local Cloudflare Development
- Web app uses wrangler to serve the built OpenNext output
- Assistant worker runs with Mastra dev server
- Both use Cloudflare Workers runtime locally

```bash
# Build and run with Cloudflare runtime
pnpm dev:cloudflare
```

## Production Environment

### Environment Variables
Production environment variables are managed through:

1. **Web App (Cloudflare Pages)**
   - Set via Cloudflare Dashboard > Pages > Settings > Environment Variables
   - Or use wrangler: `wrangler pages secret put KEY_NAME`
   - Key variables:
     - `NEXT_PUBLIC_ASSISTANT_API_URL`: https://studyspot-assistant.timothy-869.workers.dev
     - All Clerk, Supabase, and other service keys

2. **Assistant Worker**
   - Set via wrangler secrets: `cd workers/assistant && wrangler secret put KEY_NAME`
   - Stored in `.dev.vars` for local development only
   - Production secrets are never committed to git

### Deployment
```bash
# Deploy everything
pnpm deploy

# Or deploy individually
pnpm deploy:web       # Deploy web app to Cloudflare Pages
pnpm deploy:assistant # Deploy assistant worker
```

## Key Differences

### Development
- Environment variables loaded from `.env` and `.env.development` files
- Services communicate over localhost
- Hot reloading enabled

### Production
- Environment variables from Cloudflare secrets/dashboard
- Services communicate over public URLs
- Optimized builds with caching

## Important Notes

1. **Never commit secrets** - Production keys should only be set via wrangler or dashboard
2. **Build-time vs Runtime** - `NEXT_PUBLIC_*` variables are baked in at build time
3. **Clean builds** - Always clean `.open-next` and `.mastra` directories before production builds
4. **.dev.vars files** - Only used for local Cloudflare runtime development, not production

## Troubleshooting

If environment variables aren't working correctly:

1. Check build logs for which env file was loaded
2. Verify wrangler.toml doesn't have hardcoded values
3. Ensure no .env.local file is overriding values
4. Clean build directories and rebuild