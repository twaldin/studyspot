import { createRouteHandler } from "uploadthing/next";

import { ourFileRouter } from "./core";

console.log("UploadThing route handler created");

// Force Node.js runtime for Cloudflare Workers compatibility
export const runtime = "nodejs";

// Export routes for Next App Router
export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
}); 