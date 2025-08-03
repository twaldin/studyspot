# Workers Environment Setup Guide

This guide explains how to properly configure environment variables for StudySpot's worker architecture.

## Environment Variable Strategy

### Development
- **Web App**: Uses `.env.development` with `NEXT_PUBLIC_ASSISTANT_API_URL=http://localhost:8787`
- **Assistant Worker**: Uses `.dev.vars` file (automatically loaded by wrangler)
- **Other Workers**: Use their own `.dev.vars` files

### Production
- **Web App**: Environment variables set in `wrangler.toml` (public vars) and wrangler secrets (sensitive)
- **Assistant Worker**: All environment variables set as wrangler secrets
- **Never**: Deploy with hardcoded localhost URLs or development environment files

## Quick Start

### 1. Development Setup

```bash
# Copy the development environment file
cp .env.development.example .env.development

# Ensure assistant worker has .dev.vars
cd workers/assistant
cp .dev.vars.example .dev.vars
# Edit .dev.vars with your API keys

# Start development servers
pnpm dev  # Starts web app on :3000 and assistant on :8787
```

### 2. Production Setup

#### Set Production Secrets for Assistant Worker
```bash
cd workers/assistant

# Option 1: Use the setup script
./setup-secrets.sh

# Option 2: Set manually
wrangler secret put ANTHROPIC_API_KEY
wrangler secret put OPENAI_API_KEY
wrangler secret put SUPABASE_URL
# ... etc

# Verify secrets
wrangler secret list
```

#### Deploy Workers
```bash
# Deploy assistant worker (uses wrangler secrets)
cd workers/assistant
pnpm deploy

# Deploy web app (uses wrangler.toml vars)
cd apps/web
pnpm deploy
```

## Key Points

1. **Never commit** `.env`, `.dev.vars`, or any file containing API keys
2. **Development**: Uses local files (`.env.development`, `.dev.vars`)
3. **Production**: Uses wrangler secrets and wrangler.toml configuration
4. **Assistant API URL**:
   - Development: `http://localhost:8787`
   - Production: `https://studyspot-assistant.{your-subdomain}.workers.dev`

## Troubleshooting

### "Trying to access :8787" Error in Production
This means the web app is using a development URL in production. Check:
1. Web app's `wrangler.toml` has correct `NEXT_PUBLIC_ASSISTANT_API_URL`
2. Not using `.env` files in production builds
3. Assistant worker is deployed and accessible

### Missing Environment Variables
```bash
# List current secrets
wrangler secret list

# Add missing secret
wrangler secret put SECRET_NAME
```

### Finding Your Worker URLs
```bash
# After deployment, your worker URLs will be shown
# Format: https://{worker-name}.{subdomain}.workers.dev

# You can also check in Cloudflare dashboard:
# Workers & Pages > Your Worker > Triggers tab
```