#!/bin/bash

echo "Testing OpenNext.js build configuration..."
echo "==========================================="

# Clean previous builds
echo "1. Cleaning previous builds..."
rm -rf .next .open-next

# Build Next.js app
echo "2. Building Next.js app..."
npm run build

# Build with OpenNext.js
echo "3. Building with OpenNext.js..."
npx @opennextjs/cloudflare build

# Check if build outputs exist
echo "4. Checking build outputs..."
if [ -d ".open-next" ]; then
  echo "✅ .open-next directory created"
  echo "Contents:"
  ls -la .open-next/
else
  echo "❌ .open-next directory not found"
  exit 1
fi

if [ -f ".open-next/worker.js" ]; then
  echo "✅ worker.js file created"
else
  echo "❌ worker.js file not found"
  exit 1
fi

if [ -d ".open-next/assets" ]; then
  echo "✅ assets directory created"
  echo "Assets contents:"
  ls -la .open-next/assets/
else
  echo "❌ assets directory not found"
  exit 1
fi

echo ""
echo "Build completed successfully! You can now run:"
echo "  npm run preview   - to test locally"
echo "  npm run deploy    - to deploy to Cloudflare"