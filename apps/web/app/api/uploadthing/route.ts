import { createRouteHandler } from "uploadthing/next";

import { ourFileRouter } from "./core";

console.log("UploadThing route handler created");

// Export routes for Next App Router
export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
}); 