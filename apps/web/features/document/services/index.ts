// Main service exports
export { FileUploadService, fileUploadService } from "./file-upload.service";

// Type exports
export type * from "@/lib/types/DocumentTypes";

// Document processing is now handled by the assistant-api service
export { assistantApiIngestionService } from "@/lib/services/document/assistant-api-ingestion.service";
