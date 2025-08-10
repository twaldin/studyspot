'use server';

import { auth } from '@clerk/nextjs/server';
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
    // Get the server-side auth token
    const { getToken } = await auth();
    const token = await getToken();

    if (!token) {
      throw new Error('User is not authenticated.');
    }

    // Convert the page content to a File object
    const file = new File([pageContent], fileName, { type: fileType });

    // Upload the file to UploadThing
    const response = await utapi.uploadFiles(file);

    if (response.error) {
      logger.error({ ...logContext, uploadThingResponse: response }, 'File upload to UploadThing failed');
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

    // Use the same ingestion API as the file upload form
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const ingestUrl = `${baseUrl}/api/documents/ingest-stream`;
    logger.info({ ...logContext, url: ingestUrl }, 'Sending document ingestion request');

    const ingestionResponse = await fetch(ingestUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        files: [
          {
            fileKey: key,
            fileName,
            fileUrl: ufsUrl,
            fileType,
          },
        ],
        courseId,
        userId,
        metadata: {
          pageUrl,
        },
      }),
    });

    if (!ingestionResponse.ok) {
      const errorText = await ingestionResponse.text();
      throw new Error(`Document ingestion failed: ${errorText}`);
    }

    // We don't need to process the streaming response in server context
    // Just ensure the request was accepted successfully
    logger.info(logContext, 'Canvas page ingestion request sent successfully');

    logger.info(logContext, 'Canvas page ingestion completed successfully');
  } catch (error) {
    const errorDetails =
      error instanceof Error
        ? { message: error.message, stack: error.stack, name: error.name }
        : { error: String(error) };
    logger.error({ ...logContext, error: errorDetails }, 'An error occurred during Canvas page ingestion');
    // If the ingestion fails, we should consider cleaning up the file from UploadThing
    // This part is left as a potential improvement, as the current ingestion service
    // already has some cleanup logic on failure.
    throw error;
  }
}

