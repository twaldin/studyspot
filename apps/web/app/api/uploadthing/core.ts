import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { z } from "zod";
import logger, { LogContext } from "@/lib/logger";
import { auth } from "@clerk/nextjs/server";
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
      const { userId } = await auth();
      const { courseId } = input;

      // Authentication and authorization check
      if (!userId) {
        throw new UploadThingError("Unauthorized: No user ID found.");
      }

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

      return { userId, courseId };
    })
    .onUploadComplete(async ({ file, metadata }) => {
      const { userId, courseId } = metadata;

      logger.info(LogContext.api('uploadthing/document', userId, {
        fileKey: file.key,
        fileName: file.name,
        courseId
      }), 'Upload complete, starting document ingestion');

      // Document processing will be handled asynchronously by the client
      // This allows the upload dialog to close immediately and show processing status

      return {
        uploadedBy: userId,
        fileType: file.type, // Preserve the original MIME type
      };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter; 
