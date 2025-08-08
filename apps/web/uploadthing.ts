import { generateReactHelpers } from "@uploadthing/react";

import type { OurFileRouter } from "@/app/api/uploadthing/core"; // Adjusted path

export const { useUploadThing } = generateReactHelpers<OurFileRouter>(); 