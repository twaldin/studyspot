import logger from '@/lib/logger';

export interface FileWithValidation {
  file: File;
  id: string;
  isValid: boolean;
  errorMessage?: string;
  name: string;
  size: number;
  type: string;
}

export interface CanvasFileData {
  files: Array<{
    url: string;
    name: string;
    type: string;
  }>;
}

export interface FileValidationResult {
  isValid: boolean;
  errorMessage?: string;
}

export interface UploadProgress {
  [fileId: string]: number;
}

export class FileUploadService {
  private static instance: FileUploadService;

  public static getInstance(): FileUploadService {
    if (!FileUploadService.instance) {
      FileUploadService.instance = new FileUploadService();
    }
    return FileUploadService.instance;
  }

  private constructor() {}

  private readonly MAX_FILE_SIZE = 32 * 1024 * 1024; // 32MB
  private readonly DEFAULT_ACCEPTED_TYPES = ".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.jpg,.jpeg,.png";

  /**
   * Validates a file against size and type constraints
   */
  validateFile(file: File, acceptedTypes: string = this.DEFAULT_ACCEPTED_TYPES): FileValidationResult {
    const acceptedTypesArray = acceptedTypes.split(',').map(type => type.trim());
    
    // Size validation
    if (file.size > this.MAX_FILE_SIZE) {
      return { 
        isValid: false, 
        errorMessage: `File too large (max ${this.formatFileSize(this.MAX_FILE_SIZE)})` 
      };
    }
    
    // Type validation
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!acceptedTypesArray.includes(fileExtension)) {
      return { 
        isValid: false, 
        errorMessage: `File type not supported. Accepted types: ${acceptedTypes}` 
      };
    }
    
    return { isValid: true };
  }

  /**
   * Formats file size in human-readable format
   */
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Processes a list of files and adds validation information
   */
  processFiles(
    fileList: FileList | File[], 
    acceptedTypes: string = this.DEFAULT_ACCEPTED_TYPES
  ): FileWithValidation[] {
    return Array.from(fileList).map(file => {
      const validation = this.validateFile(file, acceptedTypes);
      
      const fileWithValidation: FileWithValidation = {
        file: file,
        id: this.generateFileId(),
        isValid: validation.isValid,
        errorMessage: validation.errorMessage,
        name: file.name,
        size: file.size,
        type: file.type
      };

      logger.debug({ 
        fileName: file.name, 
        fileSize: file.size, 
        isValid: validation.isValid,
        errorMessage: validation.errorMessage
      }, '[FileUpload] Processed file');

      return fileWithValidation;
    });
  }

  /**
   * Loads Canvas files from sessionStorage and converts them to File objects
   */
  async loadCanvasFiles(acceptedTypes: string = this.DEFAULT_ACCEPTED_TYPES): Promise<FileWithValidation[]> {
    try {
      logger.info({}, '[FileUpload] Checking for Canvas files in sessionStorage');
      
      const canvasData = sessionStorage.getItem('canvasUploadData');
      
      if (!canvasData) {
        logger.debug({}, '[FileUpload] No Canvas data found in sessionStorage');
        return [];
      }

      logger.info({ canvasData }, '[FileUpload] Found Canvas data in sessionStorage');
      const parsedData: CanvasFileData = JSON.parse(canvasData);
      
      if (!parsedData.files || !Array.isArray(parsedData.files) || parsedData.files.length === 0) {
        logger.warn({}, '[FileUpload] No valid Canvas files found in sessionStorage');
        return [];
      }

      logger.info({ fileCount: parsedData.files.length }, '[FileUpload] Processing Canvas files');
      
      // Convert Canvas file objects to File objects
      const canvasFiles = await Promise.all(
        parsedData.files.map(async (canvasFile) => {
          try {
            logger.debug({ url: canvasFile.url, name: canvasFile.name }, '[FileUpload] Fetching Canvas file');
            
            const response = await fetch(canvasFile.url);
            if (!response.ok) {
              throw new Error(`Failed to fetch file: ${response.statusText}`);
            }
            
            const blob = await response.blob();
            const file = new File([blob], canvasFile.name, { type: canvasFile.type });
            
            const validation = this.validateFile(file, acceptedTypes);
            
            return {
              file,
              id: this.generateFileId(),
              isValid: validation.isValid,
              errorMessage: validation.errorMessage,
              name: file.name,
              size: file.size,
              type: file.type
            };
            
          } catch (error) {
            logger.error({ 
              error, 
              fileName: canvasFile.name 
            }, '[FileUpload] Error loading Canvas file');
            return null;
          }
        })
      );
      
      // Filter out any failed file loads
      const validCanvasFiles = canvasFiles.filter(file => file !== null) as FileWithValidation[];
      
      if (validCanvasFiles.length > 0) {
        logger.info({ 
          fileCount: validCanvasFiles.length 
        }, '[FileUpload] Successfully loaded Canvas files');
        
        // Clear the session storage after loading
        this.clearCanvasData();
      } else {
        logger.warn({}, '[FileUpload] No valid files could be loaded from Canvas');
      }

      return validCanvasFiles;
      
    } catch (error) {
      logger.error({ error }, '[FileUpload] Error loading Canvas files');
      return [];
    }
  }

  /**
   * Clears Canvas upload data from sessionStorage
   */
  clearCanvasData(): void {
    sessionStorage.removeItem('canvasUploadData');
    logger.debug({}, '[FileUpload] Cleared Canvas data from sessionStorage');
  }

  /**
   * Filters files by validation status
   */
  filterValidFiles(files: FileWithValidation[]): FileWithValidation[] {
    return files.filter(f => f.isValid);
  }

  /**
   * Filters files by invalid status
   */
  filterInvalidFiles(files: FileWithValidation[]): FileWithValidation[] {
    return files.filter(f => !f.isValid);
  }

  /**
   * Removes a file from the list by ID
   */
  removeFile(files: FileWithValidation[], fileId: string): FileWithValidation[] {
    return files.filter(f => f.id !== fileId);
  }

  /**
   * Validates upload prerequisites
   */
  validateUploadPrerequisites(
    validFiles: FileWithValidation[],
    selectedCourse: any,
    isCreatingCourse: boolean = false
  ): { isValid: boolean; errorMessage?: string } {
    if (validFiles.length === 0) {
      return { 
        isValid: false, 
        errorMessage: 'No valid files selected for upload' 
      };
    }

    if (!isCreatingCourse && !selectedCourse) {
      return { 
        isValid: false, 
        errorMessage: 'Please select a course before uploading files' 
      };
    }

    return { isValid: true };
  }

  /**
   * Handles file limitation for course creation (only first file)
   */
  limitFilesForCourseCreation(
    newFiles: FileWithValidation[], 
    isCreatingCourse: boolean
  ): FileWithValidation[] {
    if (isCreatingCourse && newFiles.length > 0) {
      logger.info({ 
        originalCount: newFiles.length 
      }, '[FileUpload] Limiting to first file for course creation');
      return [newFiles[0]];
    }
    return newFiles;
  }

  /**
   * Creates a text file from pasted content
   */
  createTextFile(content: string, fileName: string): FileWithValidation {
    const blob = new Blob([content], { type: 'text/plain' });
    const file = new File([blob], fileName.endsWith('.txt') ? fileName : `${fileName}.txt`, {
      type: 'text/plain'
    });

    const validation = this.validateFile(file);
    
    return {
      file,
      id: this.generateFileId(),
      isValid: validation.isValid,
      errorMessage: validation.errorMessage,
      name: file.name,
      size: file.size,
      type: file.type
    };
  }

  /**
   * Prepares files for upload (extracts File objects)
   */
  prepareFilesForUpload(files: FileWithValidation[]): File[] {
    const validFiles = this.filterValidFiles(files);
    return validFiles.map(f => f.file);
  }

  /**
   * Generates a unique file ID
   */
  private generateFileId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  /**
   * Handles drag and drop file processing
   */
  processDragDropFiles(
    event: React.DragEvent<HTMLDivElement>,
    acceptedTypes: string = this.DEFAULT_ACCEPTED_TYPES
  ): FileWithValidation[] {
    event.preventDefault();
    event.stopPropagation();
    
    if (!event.dataTransfer.files || event.dataTransfer.files.length === 0) {
      return [];
    }

    const files = this.processFiles(event.dataTransfer.files, acceptedTypes);
    event.dataTransfer.clearData();
    
    return files;
  }

  /**
   * Gets upload statistics
   */
  getUploadStats(files: FileWithValidation[]): {
    totalFiles: number;
    validFiles: number;
    invalidFiles: number;
    totalSize: number;
    validSize: number;
  } {
    const validFiles = this.filterValidFiles(files);
    const invalidFiles = this.filterInvalidFiles(files);
    
    const totalSize = files.reduce((sum, f) => sum + f.size, 0);
    const validSize = validFiles.reduce((sum, f) => sum + f.size, 0);

    return {
      totalFiles: files.length,
      validFiles: validFiles.length,
      invalidFiles: invalidFiles.length,
      totalSize,
      validSize
    };
  }
}

// Export singleton instance
export const fileUploadService = FileUploadService.getInstance();