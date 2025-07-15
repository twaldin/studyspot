import { UploadThingError } from "uploadthing/server";
import logger from "@/lib/logger";

// File validation constants
export const ALLOWED_MIME_TYPES = new Set([
  'application/pdf',
  'text/plain',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
]);

export const MALICIOUS_PATTERNS = [
  /\.exe$/i,
  /\.scr$/i,
  /\.bat$/i,
  /\.cmd$/i,
  /\.com$/i,
  /\.pif$/i,
  /\.vbs$/i,
  /\.js$/i,
  /\.jar$/i,
  /<script[\s\S]*?<\/script>/gi,
  /javascript:/gi,
  /vbscript:/gi
];

export const FILE_SIZE_LIMITS = {
  MIN_FILE_SIZE: 10, // bytes
  MAX_FILE_SIZE_PDF: 32 * 1024 * 1024, // 32MB
  MAX_FILE_SIZE_TEXT: 4 * 1024 * 1024, // 4MB
  MAX_FILE_SIZE_DOC: 16 * 1024 * 1024, // 16MB
  MAX_FILENAME_LENGTH: 255
} as const;

// MIME type to extension mapping for validation
const MIME_TO_EXTENSION: Record<string, string[]> = {
  'application/pdf': ['pdf'],
  'text/plain': ['txt', 'text'],
  'application/msword': ['doc'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['docx']
};

export interface FileValidationResult {
  isValid: boolean;
  error?: string;
}

export interface UploadFile {
  name: string;
  type: string;
  size: number;
}

/**
 * Checks if a file name is valid by enforcing length limits, blocking suspicious patterns, and rejecting unsafe or control characters.
 *
 * Returns an object indicating validity and an error message if the file name is invalid.
 *
 * @param fileName - The name of the file to validate
 * @returns The result of the validation, including an error message if invalid
 */
export function validateFileName(fileName: string): FileValidationResult {
  if (!fileName || typeof fileName !== 'string') {
    return { isValid: false, error: "Invalid file name" };
  }

  if (fileName.length > FILE_SIZE_LIMITS.MAX_FILENAME_LENGTH) {
    return { isValid: false, error: "File name too long" };
  }

  // Check for malicious patterns
  for (const pattern of MALICIOUS_PATTERNS) {
    if (pattern.test(fileName)) {
      return { isValid: false, error: "File name contains suspicious content" };
    }
  }

  // Check for directory traversal
  if (fileName.includes('..') || fileName.includes('/') || fileName.includes('\\')) {
    return { isValid: false, error: "Invalid characters in file name" };
  }

  // Check for null bytes and control characters
  if (/[\x00-\x1f\x7f-\x9f]/.test(fileName)) {
    return { isValid: false, error: "File name contains invalid characters" };
  }

  return { isValid: true };
}

/**
 * Checks if the file's MIME type is allowed and if its extension matches the permitted extensions for that type.
 *
 * @param mimeType - The MIME type of the file to validate
 * @param fileName - The name of the file, used to extract and verify the extension
 * @returns The result of the validation, indicating validity and an error message if invalid
 */
export function validateFileType(mimeType: string, fileName: string): FileValidationResult {
  if (!ALLOWED_MIME_TYPES.has(mimeType)) {
    return { isValid: false, error: `File type not allowed: ${mimeType}` };
  }

  // Additional extension-based validation
  const extension = fileName.toLowerCase().split('.').pop();
  const allowedExtensions = MIME_TO_EXTENSION[mimeType];
  
  if (allowedExtensions && extension && !allowedExtensions.includes(extension)) {
    return { isValid: false, error: "File extension doesn't match MIME type" };
  }

  return { isValid: true };
}

/**
 * Checks if a file's size is within the allowed range for its MIME type.
 *
 * Returns an invalid result with an error message if the file is too small or exceeds the maximum allowed size for its type; otherwise, returns valid.
 *
 * @param size - The size of the file in bytes
 * @param mimeType - The MIME type of the file
 * @returns The result of the validation, including an error message if invalid
 */
export function validateFileSize(size: number, mimeType: string): FileValidationResult {
  if (size < FILE_SIZE_LIMITS.MIN_FILE_SIZE) {
    return { isValid: false, error: "File is too small" };
  }

  let maxSize: number;
  switch (mimeType) {
    case 'application/pdf':
      maxSize = FILE_SIZE_LIMITS.MAX_FILE_SIZE_PDF;
      break;
    case 'text/plain':
      maxSize = FILE_SIZE_LIMITS.MAX_FILE_SIZE_TEXT;
      break;
    case 'application/msword':
    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      maxSize = FILE_SIZE_LIMITS.MAX_FILE_SIZE_DOC;
      break;
    default:
      maxSize = FILE_SIZE_LIMITS.MAX_FILE_SIZE_TEXT;
  }

  if (size > maxSize) {
    return { 
      isValid: false, 
      error: `File too large. Maximum size: ${Math.round(maxSize / 1024 / 1024)}MB` 
    };
  }

  return { isValid: true };
}

/**
 * Validates a file by checking its name, MIME type, and size against allowed criteria.
 *
 * Returns a validation result indicating whether the file is acceptable for upload, including an error message if invalid.
 *
 * @param file - The file to validate, including its name, type, and size.
 * @returns The result of the validation, with an error message if the file is invalid.
 */
export function validateFile(file: UploadFile): FileValidationResult {
  // Validate file name
  const nameValidation = validateFileName(file.name);
  if (!nameValidation.isValid) {
    return nameValidation;
  }

  // Validate file type
  const typeValidation = validateFileType(file.type, file.name);
  if (!typeValidation.isValid) {
    return typeValidation;
  }

  // Validate file size
  const sizeValidation = validateFileSize(file.size, file.type);
  if (!sizeValidation.isValid) {
    return sizeValidation;
  }

  return { isValid: true };
}

/**
 * Validates an array of files for upload, throwing an error if any file fails validation.
 *
 * Iterates through each file, performing comprehensive validation on file name, type, and size. If a file is invalid, logs a warning with file and user details, then throws an `UploadThingError` with the validation error message.
 *
 * @param files - The files to validate before upload
 * @param userId - Optional user identifier for logging context
 */
export function validateFilesForUpload(files: UploadFile[], userId?: string): void {
  for (const file of files) {
    const validation = validateFile(file);
    
    if (!validation.isValid) {
      logger.warn({
        error: validation.error,
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        userId
      }, "File validation failed");
      
      throw new UploadThingError(validation.error!);
    }
  }
}

/**
 * Returns the maximum allowed file size for the specified MIME type.
 *
 * If the MIME type is not recognized, returns the default maximum size for plain text files.
 *
 * @param mimeType - The MIME type of the file
 * @returns The maximum file size in bytes allowed for the given MIME type
 */
export function getMaxFileSize(mimeType: string): number {
  switch (mimeType) {
    case 'application/pdf':
      return FILE_SIZE_LIMITS.MAX_FILE_SIZE_PDF;
    case 'text/plain':
      return FILE_SIZE_LIMITS.MAX_FILE_SIZE_TEXT;
    case 'application/msword':
    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      return FILE_SIZE_LIMITS.MAX_FILE_SIZE_DOC;
    default:
      return FILE_SIZE_LIMITS.MAX_FILE_SIZE_TEXT;
  }
}

/**
 * Determines whether the specified MIME type is permitted for file uploads.
 *
 * @param mimeType - The MIME type to check
 * @returns True if the MIME type is allowed; otherwise, false
 */
export function isFileTypeAllowed(mimeType: string): boolean {
  return ALLOWED_MIME_TYPES.has(mimeType);
}

/**
 * Returns the list of allowed file extensions for a given MIME type.
 *
 * @param mimeType - The MIME type to look up
 * @returns An array of allowed file extensions, or an empty array if none are defined
 */
export function getAllowedExtensions(mimeType: string): string[] {
  return MIME_TO_EXTENSION[mimeType] || [];
}