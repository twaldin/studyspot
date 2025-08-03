'use server';

import { documentIngestionService } from '@/lib/services/document-ingestion/document-ingestion.service';
import logger from '@/lib/logger';
import { UTApi } from 'uploadthing/server';

const utapi = new UTApi();

/**
 * Ingests a single Canvas page by uploading its content to UploadThing and then
 * calling the unified ingestion service.
 *
 * @param userId - The ID of the user who owns the content.
 * @param courseId - The ID of the course this content belongs to.
 * @param pageTitle - The title of the Canvas page.
 * @param pageContent - The full text content of the page.
 * @param pageUrl - The URL of the Canvas page.
 */
export async function ingestCanvasPage(
  userId: string,
  courseId: string,
  pageTitle: string,
  pageContent: string,
  pageUrl: string
): Promise<void> {
  const fileName = `${pageTitle}.txt`;
  const fileType = 'text/plain';
  const logContext = { userId, courseId, fileName, pageUrl };

  logger.info(logContext, 'Starting Canvas page ingestion');

  try {
    // Convert the page content to a File object
    const file = new File([pageContent], fileName, { type: fileType });

    // Upload the file to UploadThing
    const response = await utapi.uploadFiles(file);

    if (response.error) {
      throw new Error(`File upload to UploadThing failed: ${response.error.message}`);
    }

    if (!response.data) {
      throw new Error('File upload to UploadThing returned no data.');
    }

    const { key, ufsUrl } = response.data;

    if (!key || !ufsUrl) {
      throw new Error('File key or URL not found in UploadThing response.');
    }

    logger.info({ ...logContext, fileKey: key, fileUrl: ufsUrl }, 'File uploaded to UploadThing successfully');

    // Start the ingestion process with the UploadThing file details
    await documentIngestionService.ingestDocument({
      fileKey: key,
      fileName,
      fileUrl: ufsUrl,
      fileType,
      courseId,
    });

    logger.info(logContext, 'Canvas page ingestion completed successfully');
  } catch (error) {
    logger.error({ ...logContext, error }, 'An error occurred during Canvas page ingestion');
    // If the ingestion fails, we should consider cleaning up the file from UploadThing
    // This part is left as a potential improvement, as the current ingestion service
    // already has some cleanup logic on failure.
    throw error;
  }
}
