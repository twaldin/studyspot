/**
 * File Services
 * 
 * This module provides all file-related services including validation,
 * security checks, content verification, and upload management.
 */

// File validation service
export {
  validateFileName,
  validateFileType,
  validateFileSize,
  validateFile,
  validateFilesForUpload,
  getMaxFileSize,
  isFileTypeAllowed,
  getAllowedExtensions,
  ALLOWED_MIME_TYPES,
  MALICIOUS_PATTERNS,
  FILE_SIZE_LIMITS,
  type FileValidationResult,
  type UploadFile,
} from './file-validation.service';

// Upload security service
export {
  UploadSecurityService,
  UploadAuthService,
  RateLimitService,
  type UploadSecurityContext,
  type CourseValidationResult,
  type UserAuthResult,
} from './upload-security.service';

// File security rules
export {
  ThreatSeverity,
  SUSPICIOUS_URL_PATTERNS,
  SCRIPT_INJECTION_PATTERNS,
  MACRO_PATTERNS,
  PDF_SECURITY_PATTERNS,
  EXECUTABLE_PATTERNS,
  SOCIAL_ENGINEERING_PATTERNS,
  EDUCATIONAL_ALLOWLIST_PATTERNS,
  ALL_SECURITY_RULES,
  FILE_PROCESSING_CONFIG,
  FILE_TYPE_CONFIG,
  getRulesByCategory,
  getRulesBySeverity,
  isEducationalDomain,
  type SecurityRule,
  type FileTypeConfig,
  type SupportedMimeType,
} from './fileSecurityRules';

// File content verification
export {
  FileContentVerificationService,
  fileContentVerificationService,
  verifyFileContent,
  type VerificationThreat,
  type VerificationResult,
  type VerificationOptions,
} from './verifyFileContent';

// UploadThing cleanup utilities
export {
  deleteUploadThingFile,
  deleteUploadThingFiles,
  safeCleanupUploadThingFile,
  safeCleanupUploadThingFiles,
  cleanupFailedVerification,
  cleanupFailedIngestion,
  cleanupTempFiles,
  type CleanupResult,
} from './uploadthing-cleanup'; 