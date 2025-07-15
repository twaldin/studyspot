// Client-safe document services exports
// Only includes services that can run on the client-side

export { 
  FileUploadService, 
  fileUploadService,
  type FileWithValidation,
  type CanvasFileData,
  type FileValidationResult,
  type UploadProgress
} from './file-upload.service';
export type * from '../types/DocumentTypes';