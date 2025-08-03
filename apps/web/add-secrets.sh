#!/bin/bash
# Script to add secrets to Cloudflare Workers

echo "Adding secrets to Cloudflare Workers..."

# Add LLAMA_PARSE_API_KEY
echo "Adding LLAMA_PARSE_API_KEY..."
echo "llx-az5d8rZDt02Hi8NXbozVfYxIT0Cr6emJSYTNfcLyvKEBTZWU" | wrangler secret put LLAMA_PARSE_API_KEY

# Add other sensitive environment variables that should be secrets
echo "Adding SUPABASE_SERVICE_ROLE_KEY..."
# You'll need to provide this value when running the script
wrangler secret put SUPABASE_SERVICE_ROLE_KEY

echo "Adding UPLOADTHING_SECRET..."
# You'll need to provide this value when running the script
wrangler secret put UPLOADTHING_SECRET

echo "Adding OPENAI_API_KEY..."
# You'll need to provide this value when running the script
wrangler secret put OPENAI_API_KEY

echo "Adding ANTHROPIC_API_KEY..."
# You'll need to provide this value when running the script
wrangler secret put ANTHROPIC_API_KEY

echo "Adding GEMINI_API_KEY..."
# You'll need to provide this value when running the script
wrangler secret put GEMINI_API_KEY

echo "Secrets added successfully!"
echo ""
echo "To list all secrets, run: pnpm secrets:list"