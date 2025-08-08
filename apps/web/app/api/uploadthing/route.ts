import { createRouteHandler } from "uploadthing/next";

import { ourFileRouter } from "./core";

console.log("UploadThing route handler created");

// Force Node.js runtime for Cloudflare Workers compatibility
export const runtime = "nodejs";

// Configure callback URL for Cloudflare Workers
const callbackUrl = process.env.UPLOADTHING_CALLBACK_URL || (
  process.env.NODE_ENV === 'production' 
    ? 'https://studyspot-web.timothy-869.workers.dev/api/uploadthing'
    : undefined // Let it auto-detect in development
);

console.log("UploadThing callback URL:", callbackUrl);

// Export routes for Next App Router
const { GET: _GET, POST: _POST } = createRouteHandler({
  router: ourFileRouter,
  config: {
    callbackUrl,
  },
});

// Add CORS headers to handle Cloudflare Workers domain issues
export const GET = async (req: Request) => {
  const response = await _GET(req);
  
  // Add CORS headers
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  return response;
};

export const POST = async (req: Request) => {
  const response = await _POST(req);
  
  // Add CORS headers
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  return response;
};

// Handle OPTIONS preflight requests
export const OPTIONS = async () => {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}; 