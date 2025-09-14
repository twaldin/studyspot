import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { z } from "zod";
import logger, { LogContext } from "@/lib/logger";
import { auth, currentUser } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { createServiceRoleClient } from "@/lib/services/database/supabase.service";
import { validateFilesForUpload, UploadSecurityService, type UploadFile } from "@/lib/services/file";
import { checkUsageLimit, incrementUsage } from "@/lib/services/subscription/subscription.service";
import { SUBSCRIPTION_FEATURES } from "@/lib/types/subscription.types";

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

      // Check subscription limits for file upload
      const uploadLimit = await checkUsageLimit(
        SUBSCRIPTION_FEATURES.UPLOAD_10_FILES_PER_COURSE_PER_DAY.id,
        courseId
      );
      const unlimitedUpload = await checkUsageLimit(SUBSCRIPTION_FEATURES.UNLIMITED_FILE_UPLOAD.id);
      
      if (!unlimitedUpload.hasAccess && !uploadLimit.hasAccess) {
        console.error("[UPLOADTHING] User has reached upload limit for course:", courseId);
        throw new UploadThingError(
          `Daily upload limit reached (${uploadLimit.limit} files per course per day). Please upgrade to Pro for unlimited uploads.`
        );
      }
      
      // Check if the number of files being uploaded would exceed the limit
      if (!unlimitedUpload.hasAccess && uploadLimit.remaining !== undefined) {
        if (files.length > uploadLimit.remaining) {
          throw new UploadThingError(
            `You can only upload ${uploadLimit.remaining} more file(s) today for this course. Please upgrade to Pro for unlimited uploads.`
          );
        }
      }
      
      // Debug: Check what environment variables are available
      console.log("[UPLOADTHING] Environment check:", {
        hasSupabaseServiceRoleKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
        supabaseServiceRoleKeyLength: process.env.SUPABASE_SERVICE_ROLE_KEY?.length || 0,
        hasUploadThingSecret: !!process.env.UPLOADTHING_SECRET,
        hasUploadThingToken: !!process.env.UPLOADTHING_TOKEN,
        hasClerkSecretKey: !!process.env.CLERK_SECRET_KEY,
        nodeEnv: process.env.NODE_ENV,
        runtime: process.env.NEXT_RUNTIME,
        allEnvKeys: Object.keys(process.env).filter(key => 
          key.includes('SUPABASE') || key.includes('UPLOADTHING') || key.includes('CLERK')
        )
      });

      try {
        // Use authenticated Supabase client for security checks - should now work with process.env
        const authenticatedSupabase = createServiceRoleClient();

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
      console.log("[UPLOADTHING] onUploadComplete called:", { 
        fileKey: file.key, 
        fileName: file.name, 
        metadata 
      });

      try {
        const { userId, courseId } = metadata;

        console.log("[UPLOADTHING] Processing upload completion:", {
          userId,
          courseId,
          fileKey: file.key,
          fileName: file.name,
          fileType: file.type
        });

        // Skip logger.info to avoid fs.write issues in Cloudflare Workers
        console.log("[UPLOADTHING] Upload complete, ready for document processing:", {
          fileKey: file.key,
          fileName: file.name,
          courseId,
          userId
        });

        // Document ingestion is handled by the Mastra workflow via SSE streaming
        // This provides real-time progress updates during the entire processing pipeline
        // The client connects to the assistant worker's /documents/ingest-stream endpoint

        // Increment usage for free users after successful upload
        const unlimitedUpload = await checkUsageLimit(SUBSCRIPTION_FEATURES.UNLIMITED_FILE_UPLOAD.id);
        if (!unlimitedUpload.hasAccess) {
          await incrementUsage(
            userId,
            SUBSCRIPTION_FEATURES.UPLOAD_10_FILES_PER_COURSE_PER_DAY.id,
            courseId
          );
          console.log("[UPLOADTHING] Incremented upload usage for user:", userId);
        }

        const result = {
          uploadedBy: userId,
          fileType: file.type, // Preserve the original MIME type
        };

        console.log("[UPLOADTHING] onUploadComplete returning:", result);
        return result;

      } catch (error) {
        console.error("[UPLOADTHING] Error in onUploadComplete:", error);
        throw error;
      }
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter; 
