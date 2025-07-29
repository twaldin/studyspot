import { ProcessingFile } from "@/hooks/use-document-processing";

interface ProcessDocumentParams {
  fileKey: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  courseId: string;
}

interface IngestionResponse {
  message: string;
  fileKey: string;
  fileName: string;
  courseId: string;
  status: string;
}

/**
 * Client-side Document Ingestion Service
 * 
 * Handles calling the server-side document ingestion API and provides
 * utilities for tracking processing status on the client.
 */
class ClientDocumentIngestionService {
  private static instance: ClientDocumentIngestionService;

  static getInstance(): ClientDocumentIngestionService {
    if (!ClientDocumentIngestionService.instance) {
      ClientDocumentIngestionService.instance = new ClientDocumentIngestionService();
    }
    return ClientDocumentIngestionService.instance;
  }

  /**
   * Triggers document ingestion for a single file
   */
  async processDocument(params: ProcessDocumentParams): Promise<IngestionResponse> {
    const response = await fetch("/api/documents/ingest", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: "Unknown error" }));
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  /**
   * Processes multiple documents and returns them formatted for the processing hook
   */
  async processDocuments(documents: ProcessDocumentParams[]): Promise<ProcessingFile[]> {
    const processingFiles: ProcessingFile[] = [];
    
    for (const doc of documents) {
      try {
        await this.processDocument(doc);
        processingFiles.push({
          id: doc.fileKey,
          name: doc.fileName,
          status: "processing",
        });
      } catch (error) {
        processingFiles.push({
          id: doc.fileKey,
          name: doc.fileName,
          status: "failed",
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    return processingFiles;
  }

  /**
   * Helper to convert UploadThing upload results to ProcessDocumentParams
   */
  convertUploadResults(
    uploadResults: Array<{
      key: string;
      name: string;
      url: string;
      type: string;
    }>,
    courseId: string
  ): ProcessDocumentParams[] {
    return uploadResults.map(result => ({
      fileKey: result.key,
      fileName: result.name,
      fileUrl: result.url,
      fileType: result.type,
      courseId,
    }));
  }

  /**
   * Helper to format files for the processing hook
   */
  formatFilesForProcessing(params: ProcessDocumentParams[]): { id: string; name: string }[] {
    return params.map(p => ({
      id: p.fileKey,
      name: p.fileName,
    }));
  }
}

export const clientDocumentIngestionService = ClientDocumentIngestionService.getInstance();