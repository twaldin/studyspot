// Client-safe document services exports
// Only includes services that can run on the client-side

export {
  type CanvasFileData,
  FileUploadService,
  fileUploadService,
  type FileValidationResult,
  type FileWithValidation,
  type UploadProgress,
} from "./file-upload.service";
export type * from "@/lib/types/DocumentTypes";
