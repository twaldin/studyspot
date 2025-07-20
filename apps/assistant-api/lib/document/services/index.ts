// Main service exports
export { FileUploadService, fileUploadService } from "./file-upload.service";

// Type exports
export type * from "@/lib/types/DocumentTypes";

// Legacy service exports for backward compatibility
export { ingestDocument } from "../document-ingestion.service";
export { extractDocument } from "../extract-document";
export { splitDocumentsToNodes } from "../split-document";
export { generateEmbeddings } from "../document-embedding";
export {
  checkCourseProvided,
  checkDocumentRelevance,
} from "../document-relevance";

// Note: Legacy Document interface from document.service is replaced by the new Document interface in DocumentTypes
