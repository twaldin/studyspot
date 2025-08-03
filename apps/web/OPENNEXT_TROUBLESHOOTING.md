# OpenNext.js Cloudflare Workers Troubleshooting Guide

## Configuration Checklist

### ✅ Fixed Issues

1. **Added `_headers` file** in `public/` directory for static asset caching
2. **Updated compatibility date** to `2025-04-01` in both wrangler configs
3. **Removed `force-dynamic`** export from root layout
4. **Removed `output: 'standalone'`** from next.config.js
5. **Enhanced open-next.config.ts** with proper settings
6. **Updated build scripts** to ensure proper build order

### 📋 Key Configuration Files

1. **wrangler.jsonc / wrangler.toml**
   - `compatibility_date`: Must be "2025-04-01" or later
   - `nodejs_compat` flag: Required for Node.js APIs
   - Assets binding: Points to `.open-next/assets`

2. **open-next.config.ts**
   - `incrementalCache`: Set to 'dummy' (can use R2 later)
   - `buildOutputDirectory`: Points to '.next'
   - `edgeRuntime`: Set to 'nodejs'

3. **public/_headers**
   - Caches static assets for optimal performance
   - Required for Next.js static file handling

4. **next.config.js**
   - Removed `output: 'standalone'` (conflicts with OpenNext.js)
   - Added webpack fallbacks for client-side compatibility

## Common 404 Error Causes and Solutions

### 1. **Dynamic Routes Not Working**
- **Cause**: Next.js 15 async params not handled correctly
- **Solution**: API routes already use `await params` correctly
- **Client components**: Use `useParams()` hook (already implemented)

### 2. **Static Assets 404**
- **Cause**: Missing _headers file
- **Solution**: Added `public/_headers` with cache control rules

### 3. **API Routes 404**
- **Cause**: Incorrect middleware configuration or force-dynamic
- **Solution**: Removed force-dynamic from root layout

### 4. **Build Output Issues**
- **Cause**: Incorrect build configuration
- **Solution**: Updated build scripts and configs

## Testing Your Deployment

### Local Testing
```bash
# Clean and rebuild
rm -rf .next .open-next
npm run build:cloudflare

# Preview locally
npm run preview
```

### Deployment
```bash
# Deploy to Cloudflare Workers
npm run deploy
```

### Debugging Steps

1. **Check build output**:
   ```bash
   ls -la .open-next/
   # Should contain: worker.js, assets/, cache/
   ```

2. **Verify routes are included**:
   - Check `.open-next/assets/_next/` for static files
   - Check `.open-next/worker.js` size (should be < 10MB)

3. **Enable debug mode**:
   - Set `openNextDebug: "true"` in wrangler config
   - Check Cloudflare Workers logs for errors

4. **Common fixes**:
   - Clear cache: `rm -rf .next .open-next`
   - Update dependencies: `pnpm install`
   - Check environment variables in wrangler config

## Environment Variables

Ensure all required env vars are set in wrangler.jsonc:
- Clerk keys (public and secret)
- Supabase URLs and keys
- API endpoints

## Size Limitations

- Free tier: 3 MiB worker size limit
- Paid tier: 10 MiB worker size limit

If hitting size limits:
1. Enable code splitting in Next.js
2. Use dynamic imports for large components
3. Optimize images and assets
4. Consider using R2 for large static files

## Next Steps

1. Run `./test-opennext-build.sh` to verify build
2. Test with `npm run preview`
3. Deploy with `npm run deploy`
4. Monitor Cloudflare Workers logs for any runtime errors