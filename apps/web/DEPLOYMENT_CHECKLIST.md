# OpenNext.js Cloudflare Workers Deployment Checklist

## Pre-deployment Steps

1. **Clean previous builds**:
   ```bash
   rm -rf .next .open-next
   ```

2. **Install dependencies**:
   ```bash
   pnpm install
   ```

3. **Build the application**:
   ```bash
   npm run build:cloudflare
   ```

4. **Test locally**:
   ```bash
   npm run preview
   ```
   - Visit http://localhost:8787
   - Test all routes (/, /chat, /courses, /flashcards, etc.)
   - Test API routes (/api/*)
   - Check browser console for errors

## Deployment

1. **Deploy to Cloudflare Workers**:
   ```bash
   npm run deploy
   ```

2. **Verify deployment**:
   - Check deployment URL in console output
   - Test all routes on live deployment
   - Monitor Cloudflare Workers dashboard for errors

## Post-deployment Verification

- [ ] Homepage loads correctly
- [ ] Authentication works (sign in/sign up)
- [ ] Dynamic routes work (/chat/[chatId], /flashcards/[setId], etc.)
- [ ] API routes respond correctly
- [ ] Static assets load (CSS, JS, images)
- [ ] No 404 errors on valid routes

## Troubleshooting

If you encounter 404 errors after deployment:

1. **Check Cloudflare Workers logs**:
   - Go to Cloudflare dashboard > Workers & Pages
   - Select your worker > Logs
   - Look for route matching errors

2. **Verify environment variables**:
   - All required env vars are set in Cloudflare Workers settings
   - Match the vars in wrangler.jsonc

3. **Check worker size**:
   - Dashboard shows worker size
   - Must be under 10MB (paid) or 3MB (free)

4. **Clear cache and redeploy**:
   ```bash
   rm -rf .next .open-next
   npm run deploy
   ```