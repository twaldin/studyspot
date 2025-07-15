import { UTApi } from "uploadthing/server";
import logger from "@/lib/logger";

/**
 * UploadThing File Cleanup Service
 * 
 * Provides utilities for cleaning up files from UploadThing storage
 * when operations fail, preventing orphaned files.
 */

// Initialize UTApi instance
let utapi: UTApi | null = null;

/**
 * Returns a singleton instance of the UTApi client for interacting with UploadThing.
 *
 * Ensures that only one instance of UTApi is created and reused throughout the application.
 *
 * @returns The singleton UTApi instance
 */
function getUTApi(): UTApi {
  if (!utapi) {
    utapi = new UTApi();
  }
  return utapi;
}

export interface CleanupResult {
  success: boolean;
  error?: string;
  deletedFiles?: string[];
  failedFiles?: string[];
}

/**
 * Deletes a single file from UploadThing storage by file key or URL.
 *
 * Attempts to extract the file key from the provided input and delete the corresponding file. Returns a result indicating success or failure, including error details and lists of deleted or failed files.
 *
 * @param fileKeyOrUrl - The file key or UploadThing file URL to delete.
 * @returns The result of the deletion operation, including success status, error message if any, and lists of deleted or failed files.
 */
export async function deleteUploadThingFile(fileKeyOrUrl: string): Promise<CleanupResult> {
  try {
    // Extract file key if a full URL is provided
    const fileKey = extractFileKeyFromUrl(fileKeyOrUrl);
    
    if (!fileKey) {
      logger.warn({ fileKeyOrUrl }, "Invalid file key or URL provided for cleanup");
      return {
        success: false,
        error: "Invalid file key or URL"
      };
    }

    const api = getUTApi();
    
    logger.info({ fileKey }, "Attempting to delete file from UploadThing");
    
    const result = await api.deleteFiles([fileKey]);
    
    if (result.success) {
      logger.info({ fileKey }, "Successfully deleted file from UploadThing");
      return {
        success: true,
        deletedFiles: [fileKey]
      };
    } else {
      logger.warn({ 
        fileKey, 
        deletedCount: result.deletedCount 
      }, "Failed to delete file from UploadThing");
      return {
        success: false,
        error: "File deletion failed",
        failedFiles: [fileKey]
      };
    }
  } catch (error) {
    logger.error({ 
      error, 
      fileKeyOrUrl 
    }, "Error during UploadThing file deletion");
    
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      failedFiles: [fileKeyOrUrl]
    };
  }
}

/**
 * Deletes multiple files from UploadThing storage using their file keys or URLs.
 *
 * Attempts to extract file keys from the provided array, deletes the corresponding files in batch, and returns a result indicating success or failure. If no valid file keys are found, the operation fails.
 *
 * @param fileKeysOrUrls - An array of UploadThing file keys or URLs to delete.
 * @returns The result of the batch deletion, including success status, error message if any, and lists of deleted or failed files.
 */
export async function deleteUploadThingFiles(fileKeysOrUrls: string[]): Promise<CleanupResult> {
  if (!fileKeysOrUrls || fileKeysOrUrls.length === 0) {
    return { success: true, deletedFiles: [] };
  }

  try {
    // Extract file keys from URLs if needed
    const fileKeys = fileKeysOrUrls
      .map(extractFileKeyFromUrl)
      .filter((key): key is string => Boolean(key));

    if (fileKeys.length === 0) {
      logger.warn({ fileKeysOrUrls }, "No valid file keys found for batch cleanup");
      return {
        success: false,
        error: "No valid file keys provided",
        failedFiles: fileKeysOrUrls
      };
    }

    const api = getUTApi();
    
    logger.info({ 
      fileKeys, 
      count: fileKeys.length 
    }, "Attempting batch deletion from UploadThing");
    
    const result = await api.deleteFiles(fileKeys);
    
    if (result.success) {
      logger.info({ 
        fileKeys, 
        count: fileKeys.length,
        deletedCount: result.deletedCount
      }, "Successfully deleted files from UploadThing");
      return {
        success: true,
        deletedFiles: fileKeys
      };
    } else {
      logger.warn({ 
        fileKeys, 
        deletedCount: result.deletedCount 
      }, "Failed to delete some or all files from UploadThing");
      return {
        success: false,
        error: "Batch file deletion failed",
        failedFiles: fileKeys
      };
    }
  } catch (error) {
    logger.error({ 
      error, 
      fileKeysOrUrls 
    }, "Error during UploadThing batch file deletion");
    
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      failedFiles: fileKeysOrUrls
    };
  }
}

/**
 * Attempts to delete a file from UploadThing storage, logging any errors without throwing.
 *
 * This function is intended for use in cleanup scenarios where errors should not interrupt execution flow.
 */
export async function safeCleanupUploadThingFile(fileKeyOrUrl: string): Promise<void> {
  try {
    const result = await deleteUploadThingFile(fileKeyOrUrl);
    
    if (!result.success) {
      logger.warn({ 
        fileKeyOrUrl, 
        error: result.error 
      }, "File cleanup failed but continuing execution");
    }
  } catch (error) {
    // Log but don't throw - this is intentionally safe
    logger.warn({ 
      error, 
      fileKeyOrUrl 
    }, "Safe cleanup encountered error but continuing execution");
  }
}

/**
 * Attempts to delete multiple UploadThing files, logging any failures but never throwing errors.
 *
 * This function is intended for use in cleanup scenarios where errors should not interrupt execution flow.
 */
export async function safeCleanupUploadThingFiles(fileKeysOrUrls: string[]): Promise<void> {
  try {
    const result = await deleteUploadThingFiles(fileKeysOrUrls);
    
    if (!result.success) {
      logger.warn({ 
        fileKeysOrUrls, 
        error: result.error 
      }, "Batch file cleanup failed but continuing execution");
    }
  } catch (error) {
    // Log but don't throw - this is intentionally safe
    logger.warn({ 
      error, 
      fileKeysOrUrls 
    }, "Safe batch cleanup encountered error but continuing execution");
  }
}

/**
 * Extracts the file key from an UploadThing URL, or returns the input if it is already a file key.
 *
 * Returns `null` if the input is invalid or the file key cannot be determined.
 *
 * @param fileKeyOrUrl - The UploadThing file key or URL to extract the key from
 * @returns The extracted file key, or `null` if extraction fails
 */
function extractFileKeyFromUrl(fileKeyOrUrl: string): string | null {
  if (!fileKeyOrUrl || typeof fileKeyOrUrl !== 'string') {
    return null;
  }

  // If it's already a file key (no protocol), return as-is
  if (!fileKeyOrUrl.includes('://')) {
    return fileKeyOrUrl;
  }

  try {
    // Extract file key from UploadThing URL
    // UploadThing URLs typically look like: https://utfs.io/f/{fileKey}
    const url = new URL(fileKeyOrUrl);
    
    // Handle utfs.io URLs
    if (url.hostname === 'utfs.io') {
      const pathParts = url.pathname.split('/');
      const fileKey = pathParts[pathParts.length - 1]; // Last part is the file key
      return fileKey || null;
    }
    
    // Handle other UploadThing URL patterns if needed
    // You may need to adjust this based on your specific URL format
    const pathParts = url.pathname.split('/');
    return pathParts[pathParts.length - 1] || null;
    
  } catch (error) {
    logger.warn({ 
      fileKeyOrUrl, 
      error 
    }, "Failed to parse UploadThing URL for file key extraction");
    return null;
  }
}

/**
 * Cleans up a file in UploadThing when verification fails.
 *
 * Logs the reason for verification failure and attempts to safely delete the specified file without throwing errors.
 */
export async function cleanupFailedVerification(fileKey: string, reason: string): Promise<void> {
  logger.info({ 
    fileKey, 
    reason 
  }, "Cleaning up file due to failed verification");
  
  await safeCleanupUploadThingFile(fileKey);
}

/**
 * Cleans up a file from UploadThing storage after a failed ingestion attempt.
 *
 * Logs the reason for the failure and attempts to safely delete the specified file without throwing errors.
 */
export async function cleanupFailedIngestion(fileKey: string, reason: string): Promise<void> {
  logger.info({ 
    fileKey, 
    reason 
  }, "Cleaning up file due to failed ingestion");
  
  await safeCleanupUploadThingFile(fileKey);
}

/**
 * Safely deletes temporary files associated with a failed course creation attempt.
 *
 * Logs the cleanup operation and attempts to remove all provided file keys from UploadThing storage without throwing errors.
 */
export async function cleanupTempFiles(fileKeys: string[]): Promise<void> {
  if (!fileKeys || fileKeys.length === 0) {
    return;
  }
  
  logger.info({ 
    fileKeys, 
    count: fileKeys.length 
  }, "Cleaning up temporary files from failed course creation");
  
  await safeCleanupUploadThingFiles(fileKeys);
}