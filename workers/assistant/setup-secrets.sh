#!/bin/bash

# Setup secrets for StudySpot Assistant Worker
# This script helps configure production secrets using wrangler

echo "Setting up secrets for StudySpot Assistant Worker..."

# List of required secrets
SECRETS=(
  "ANTHROPIC_API_KEY"
  "OPENAI_API_KEY"
  "GEMINI_API_KEY"
  "GOOGLE_API_KEY"
  "GOOGLE_GENERATIVE_AI_API_KEY"
  "SUPABASE_URL"
  "SUPABASE_ANON_KEY"
  "SUPABASE_SERVICE_ROLE_KEY"
  "CLERK_SECRET_KEY"
)

echo "Please have your API keys ready. You'll be prompted to enter each one."
echo ""

for secret in "${SECRETS[@]}"; do
  echo "Setting secret: $secret"
  wrangler secret put $secret
  echo ""
done

echo "All secrets have been configured!"
echo ""
echo "To verify your secrets, run:"
echo "  wrangler secret list"
echo ""
echo "Note: Secrets are encrypted and cannot be retrieved once set."
echo "If you need to update a secret, run the same command again."