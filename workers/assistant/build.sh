#!/bin/bash

# Build script that prevents Mastra from reading .env files

echo "Building Mastra application without environment variables..."

# Temporarily rename .env files to prevent Mastra from reading them
if [ -f ".env" ]; then
    mv .env .env.backup
fi
if [ -f ".env.production" ]; then
    mv .env.production .env.production.backup
fi
if [ -f ".env.local" ]; then
    mv .env.local .env.local.backup
fi

# Run the build
npx mastra build

# Restore .env files
if [ -f ".env.backup" ]; then
    mv .env.backup .env
fi
if [ -f ".env.production.backup" ]; then
    mv .env.production.backup .env.production
fi
if [ -f ".env.local.backup" ]; then
    mv .env.local.backup .env.local
fi

echo "Build complete! wrangler.json should now be clean."

# Copy environment variables to .dev.vars for local development
echo "Creating .dev.vars for local development..."
if [ -f "../../.env" ]; then
    # Extract required variables from root .env
    grep -E "^(SUPABASE_URL|SUPABASE_SERVICE_ROLE_KEY|ANTHROPIC_API_KEY|OPENAI_API_KEY|GEMINI_API_KEY|CLOUDFLARE_API_TOKEN|LLAMA_CLOUD_API_KEY)=" ../../.env > .mastra/output/.dev.vars
    echo "Created .dev.vars with environment variables from root .env"
else
    echo "Warning: Root .env file not found. Manual .dev.vars creation may be required."
fi

echo ""
echo "To deploy:"
echo "  cd .mastra/output && wrangler deploy --config wrangler.json"
echo ""
echo "To set secrets (run once per deployment):"
echo "  cd .mastra/output"
echo "  wrangler secret put ANTHROPIC_API_KEY"
echo "  wrangler secret put OPENAI_API_KEY"
echo "  wrangler secret put SUPABASE_URL"
echo "  wrangler secret put SUPABASE_SERVICE_ROLE_KEY"
echo "  wrangler secret put GEMINI_API_KEY"
echo "  wrangler secret put CLOUDFLARE_API_TOKEN"