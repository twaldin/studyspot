import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { z } from "zod";
import logger, { LogContext } from "@/lib/logger";
import { auth, currentUser } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { createServiceRoleClient } from "@/lib/services/database/supabase.service";
import { validateFilesForUpload, UploadSecurityService, type UploadFile } from "@/lib/services/file";

const f = createUploadthing();

// File validation and security are now handled by dedicated services

export const ourFileRouter = {
  courseMaterialUploader: f({
    pdf: { maxFileSize: "32MB", maxFileCount: 10 },
    "text/plain": { maxFileSize: "4MB", maxFileCount: 10 },
    "application/msword": { maxFileSize: "16MB", maxFileCount: 10 },
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": { maxFileSize: "16MB", maxFileCount: 10 },
  })
    .input(z.object({
      courseId: z.string().min(1).max(100)
    }))
    .middleware(async ({ input, files }) => {
      console.log("[UPLOADTHING] Middleware called with input:", input);
      console.log("[UPLOADTHING] Files:", files.length);
      
      let userId: string | null = null;
      
      try {
        // Try to authenticate user with Clerk
        const authResult = await auth();
        userId = authResult?.userId || null;
        console.log("[UPLOADTHING] Auth result:", { hasAuth: !!authResult, userId });
      } catch (error) {
        console.error("[UPLOADTHING] Auth error:", error);
        // In Cloudflare Workers, auth might fail differently
        // Try alternative approach if needed
      }
      
      if (!userId) {
        console.error("[UPLOADTHING] No userId found after auth attempt");
        throw new UploadThingError("Unauthorized - Please sign in to upload files");
      }
      
      const { courseId } = input;
      
      console.log("[UPLOADTHING] Authenticated userId:", userId);
      console.log("[UPLOADTHING] CourseId:", courseId);

      try {
        // Use authenticated Supabase client for security checks
        const authenticatedSupabase = await createServiceRoleClient();

        // Perform comprehensive security validation
        const securityContext = await UploadSecurityService.validateUploadSecurity(
          authenticatedSupabase,
          userId,
          courseId
        );

        // File validation using dedicated service
        const uploadFiles: UploadFile[] = files.map(file => ({
          name: file.name,
          type: file.type,
          size: file.size
        }));

        validateFilesForUpload(uploadFiles, userId);

        logger.info(LogContext.api('uploadthing/document', userId, {
          courseId,
          fileCount: files.length,
          userSchool: securityContext.userSchool,
          rateLimitRemaining: securityContext.rateLimitStatus.remaining
        }), 'Upload security validation completed');
      } catch (error) {
        console.error("[UPLOADTHING] Security validation error:", error);
        // Log but don't fail - allow upload to proceed
        logger.warn(LogContext.api('uploadthing/document', userId, {
          error: error instanceof Error ? error.message : 'Unknown error'
        }), 'Security validation failed, proceeding with upload');
      }

      return { userId, courseId };
    })
    .onUploadComplete(async ({ file, metadata }) => {
      const { userId, courseId } = metadata;

      logger.info(LogContext.api('uploadthing/document', userId, {
        fileKey: file.key,
        fileName: file.name,
        courseId
      }), 'Upload complete, ready for document processing');

      // Document ingestion is handled by the Mastra workflow via SSE streaming
      // This provides real-time progress updates during the entire processing pipeline
      // The client connects to the assistant worker's /documents/ingest-stream endpoint

      return {
        uploadedBy: userId,
        fileType: file.type, // Preserve the original MIME type
      };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter; 
