// Main service exports
export {
  DocumentService,
  documentService,
  DocumentError,
  DocumentErrorType,
  DocumentProcessingStatus
} from './document.service';

export { FileUploadService, fileUploadService } from './file-upload.service';

// Type exports
export type * from '../types/DocumentTypes';

// Legacy service exports for backward compatibility
export { deleteDocument } from '../document.service';
export { ingestDocument } from '../document-ingestion.service';
export { extractDocument } from '../extract-document';
export { splitDocumentsToNodes } from '../split-document';
export { generateEmbeddings } from '../document-embedding';
export { 
  checkDocumentRelevance, 
  checkCourseProvided 
} from '../document-relevance';

// Note: Legacy Document interface from document.service is replaced by the new Document interface in DocumentTypes