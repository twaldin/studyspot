import logger from '@/lib/logger';

export interface AssistantApiIngestionRequest {
  fileUrl: string;
  fileName: string;
  fileType: string;
  courseId: string;
  fileKey: string;
}

export interface AssistantApiIngestionResponse {
  success: boolean;
  documentId?: string;
  error?: string;
  skipped?: boolean;
  reason?: string;
}

/**
 * Service to call the assistant-api for document ingestion
 */
export class AssistantApiIngestionService {
  private static instance: AssistantApiIngestionService;
  private readonly baseUrl: string;

  public static getInstance(): AssistantApiIngestionService {
    if (!AssistantApiIngestionService.instance) {
      AssistantApiIngestionService.instance = new AssistantApiIngestionService();
    }
    return AssistantApiIngestionService.instance;
  }

  private constructor() {
    // Use environment variable for assistant-api URL
    this.baseUrl = process.env.NEXT_PUBLIC_ASSISTANT_API_URL;
  }

  /**
   * Calls the assistant-api to ingest a document
   * @param request Document ingestion request parameters
   * @returns Promise<boolean> - true if successful, false if skipped or failed
   */
  async ingestDocument(request: AssistantApiIngestionRequest): Promise<boolean> {
    try {
      logger.info({
        fileKey: request.fileKey,
        fileName: request.fileName,
        courseId: request.courseId,
        assistantApiUrl: this.baseUrl
      }, 'Calling assistant-api for document ingestion');

      const response = await fetch(`${this.baseUrl}/api/documents/ingest`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        logger.error({
          fileKey: request.fileKey,
          fileName: request.fileName,
          status: response.status,
          statusText: response.statusText
        }, 'Assistant-api returned non-200 status');
        return false;
      }

      const result: AssistantApiIngestionResponse = await response.json();

      if (result.success) {
        logger.info({
          fileKey: request.fileKey,
          fileName: request.fileName,
          documentId: result.documentId
        }, 'Document ingestion successful via assistant-api');
        return true;
      } else if (result.skipped) {
        logger.info({
          fileKey: request.fileKey,
          fileName: request.fileName,
          reason: result.reason
        }, 'Document ingestion skipped by assistant-api');
        return false;
      } else {
        logger.error({
          fileKey: request.fileKey,
          fileName: request.fileName,
          error: result.error
        }, 'Document ingestion failed in assistant-api');
        return false;
      }

    } catch (error) {
      logger.error({
        error: error instanceof Error ? error.message : 'Unknown error',
        fileKey: request.fileKey,
        fileName: request.fileName,
        assistantApiUrl: this.baseUrl
      }, 'Error calling assistant-api for document ingestion');
      return false;
    }
  }

  /**
   * Health check for the assistant-api
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/health`, {
        method: 'GET',
      });
      return response.ok;
    } catch (error) {
      logger.error({
        error: error instanceof Error ? error.message : 'Unknown error',
        assistantApiUrl: this.baseUrl
      }, 'Assistant-api health check failed');
      return false;
    }
  }
}

// Export singleton instance
export const assistantApiIngestionService = AssistantApiIngestionService.getInstance();