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
    // Convert the page content to a File object
    const file = new File([pageContent], fileName, { type: fileType });

    // Get the server-side auth token
    const { getToken } = await auth();
    const token = await getToken();

    if (!token) {
      throw new Error('User is not authenticated.');
    }

    await _ingestFileToStudySpot(file, courseId, userId, token, { pageUrl });
    logger.info(logContext, 'Canvas page ingestion completed successfully');
  } catch (error) {
    const errorDetails =
      error instanceof Error
        ? { message: error.message, stack: error.stack, name: error.name }
        : { error: String(error) };
    logger.error({ ...logContext, error: errorDetails }, 'An error occurred during Canvas page ingestion');
    throw error;
  }
}

/**
 * Ingests a single Canvas file by downloading it, uploading it to UploadThing,
 * and then calling the unified ingestion service.
 *
 * @param userId - The ID of the user who owns the content.
 * @param courseId - The ID of the course this content belongs to.
 * @param fileName - The name of the file.
 * @param fileUrl - The URL to download the file from.
 * @param fileType - The MIME type of the file.
 * @param canvasFileUrl - The original Canvas URL of the file page.
 */
export async function ingestCanvasFile(
  userId: string,
  courseId: string,
  fileName: string,
  fileUrl: string,
  fileType: string,
  canvasFileUrl: string
): Promise<void> {
  const logContext = { userId, courseId, fileName, fileUrl, canvasFileUrl };

  logger.info(logContext, 'Starting Canvas file ingestion');

  try {
    // Get the server-side auth token
    const { getToken } = await auth();
    const token = await getToken();

    if (!token) {
      throw new Error('User is not authenticated.');
    }

    // Download the file content
    const fileResponse = await fetch(fileUrl);
    if (!fileResponse.ok) {
      throw new Error(`Failed to download file from ${fileUrl}: ${fileResponse.statusText}`);
    }
    const fileContent = await fileResponse.blob();

    // Create a File object
    const file = new File([fileContent], fileName, { type: fileType });

    await _ingestFileToStudySpot(file, courseId, userId, token, { canvasFileUrl });
    logger.info(logContext, 'Canvas file ingestion completed successfully');
  } catch (error) {
    const errorDetails =
      error instanceof Error
        ? { message: error.message, stack: error.stack, name: error.name }
        : { error: String(error) };
    logger.error({ ...logContext, error: errorDetails }, 'An error occurred during Canvas file ingestion');
    throw error;
  }
}

/**
 * Private helper function to handle the common ingestion logic.
 *
 * @param file - The File object to ingest.
 * @param courseId - The ID of the course.
 * @param userId - The ID of the user.
 * @param token - The authentication token.
 * @param metadata - Additional metadata for the ingestion request.
 */
async function _ingestFileToStudySpot(
  file: File,
  courseId: string,
  userId: string,
  token: string,
  metadata: object
): Promise<void> {
  const logContext = { courseId, userId, fileName: file.name, fileType: file.type, metadata };

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
          fileName: file.name,
          fileUrl: ufsUrl,
          fileType: file.type,
        },
      ],
      courseId,
      userId,
      metadata,
    }),
  });

  if (!ingestionResponse.ok) {
    const errorText = await ingestionResponse.text();
    throw new Error(`Document ingestion failed: ${errorText}`);
  }

  // We don't need to process the streaming response in server context
  // Just ensure the request was accepted successfully
  logger.info(logContext, 'Document ingestion request sent successfully');
}

