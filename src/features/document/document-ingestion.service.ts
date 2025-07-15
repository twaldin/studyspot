import path from "path";
import fs from "fs/promises";
import os from "os";
import crypto from "crypto";
import logger from "@/lib/logger";

import { createServiceRoleClient } from "@/lib/services/database/supabase.service";
import { extractDocument } from "./extract-document";
import { splitDocumentsToNodes } from "./split-document";
import { generateEmbeddings } from "./document-embedding";
import {
  checkCourseProvided,
  checkDocumentRelevance,
} from "./document-relevance";
import { cleanupFailedIngestion } from "@/lib/services/file";
import { sanitizeText } from "./sanitize-text";

// --- 5. New Ingestion Process Function ---
interface IngestDocumentParams {
  fileKey: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  courseId: string;
}

/**
 * Ingests a document into the system by downloading, validating, extracting content, checking relevance, generating embeddings, and storing the results in the database.
 *
 * Performs duplicate detection, relevance assessment, and robust error handling with cleanup on failure. Returns `true` if the document is successfully ingested and stored; otherwise, returns `false`.
 *
 * @returns Whether the document was successfully ingested
 */
export async function ingestDocument(
  { fileKey, fileName, fileUrl, fileType, courseId }: IngestDocumentParams,
): Promise<boolean> {
  logger.info(
    { fileKey, fileName, fileUrl, courseId },
    "Starting document ingestion",
  );

  // Check for required API keys
  if (!process.env.OPENAI_API_KEY) {
    logger.error(
      { fileKey, fileName },
      "Document Ingestion Service: OPENAI_API_KEY is not set. Cannot proceed.",
    );
    await cleanupFailedIngestion(fileKey, "Missing OPENAI_API_KEY");
    return false;
  }

  // Temp file path for where the temp download will be stored
  const tempDir = os.tmpdir();
  const tempFilePath = path.join(
    tempDir,
    `${fileKey}_${Date.now()}_${fileName}`,
  );
  let fileHash: string | null = null;

  try {
    // This service uses the service role... makes sense
    const supabase = createServiceRoleClient();

    // Download binary to make a hash for later duplicate prevention
    // TODO : make this its own function in a new file 'verify-document.ts'
    logger.info(
      { fileKey, fileUrl, tempFilePath },
      "Document Ingestion: Downloading file.",
    );
    const response = await fetch(fileUrl);
    if (!response.ok || !response.body) {
      logger.error(
        { fileKey, fileName, fileUrl, status: response.status },
        "Document Ingestion: Failed to download file or empty response body.",
      );
      await cleanupFailedIngestion(
        fileKey,
        `Failed to download file: ${response.statusText}`,
      );
      throw new Error(`Failed to download file: ${response.statusText}`);
    }
    const fileBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(fileBuffer);

    fileHash = crypto.createHash("sha256").update(buffer).digest("hex");
    logger.info(
      { fileKey, fileName, fileHash },
      "Document Ingestion: Generated file hash.",
    );

    const { data: existingDoc, error: hashCheckError } = await supabase
      .from("docs")
      .select("id, file_name")
      .eq("course_id", courseId)
      .eq("file_hash", fileHash)
      .single();

    if (hashCheckError && hashCheckError.code !== "PGRST116") { // PGRST116 = no rows found
      logger.error(
        { error: hashCheckError, fileKey, fileName, fileHash },
        "Document Ingestion: Error checking for duplicate hash.",
      );
      await cleanupFailedIngestion(
        fileKey,
        "Error checking for duplicate hash",
      );
      return false;
    } else if (existingDoc) {
      logger.info(
        {
          fileKey,
          fileName,
          existingFileName: existingDoc.file_name,
          fileHash,
        },
        "Document Ingestion: File with identical content already exists in this course. Skipping ingestion to prevent duplicate content.",
      );
      await cleanupFailedIngestion(fileKey, "Duplicate content detected");
      return false;
    }

    await fs.writeFile(tempFilePath, buffer);
    logger.info(
      { fileKey, tempFilePath },
      "Document Ingestion: File downloaded successfully.",
    );

    logger.info(
      { fileKey, tempFilePath },
      "Document Ingestion: Extracting document content...",
    );
    // Extract documents for content analysis
    const documents = await extractDocument(tempFilePath);
    if (!documents || documents.length === 0) {
      logger.warn(
        { fileKey, fileName, tempFilePath },
        "Document Ingestion: No content extracted or document empty. Skipping further processing.",
      );
      await cleanupFailedIngestion(
        fileKey,
        "No content extracted or document empty",
      );
      return false;
    }
    logger.info(
      { fileKey, tempFilePath },
      "Document Ingestion: Document content extracted successfully",
    );

    // Sanitize extracted document text to remove problematic Unicode characters
    logger.info(
      { fileKey, fileName },
      "Document Ingestion: Sanitizing extracted text content...",
    );
    documents.forEach((doc, index) => {
      doc.text = sanitizeText(doc.text, `${fileName}-doc-${index}`);
    });

    // Get course information for relevance check.
    const { data: course, error: courseError } = await supabase
      .from("courses")
      .select("code, title")
      .eq("id", courseId)
      .single();

    if (courseError || !course) {
      logger.warn(
        { error: courseError, courseId, fileKey },
        "Document Ingestion: Could not fetch course information, proceeding without relevance check.",
      );
    } else {
      // Check document relevance using Gemini (text already sanitized)
      const documentText = documents.map((doc) => doc.text).join("\n\n")
        .substring(0, 3000);
      const isRelevant = await checkDocumentRelevance(
        course.code || "",
        course.title || "",
        fileName,
        documentText,
      );

      if (!isRelevant) {
        logger.info(
          {
            fileKey,
            fileName,
            courseCode: course.code,
            courseTitle: course.title,
          },
          "Document Ingestion: Document deemed not relevant to course by Gemini. Skipping ingestion.",
        );
        await cleanupFailedIngestion(
          fileKey,
          "Document not relevant to course",
        );
        return false;
      }

      logger.info({
        fileKey,
        fileName,
        courseCode: course.code,
        courseTitle: course.title,
      }, "Document Ingestion: Document confirmed as relevant to course.");
    }

    // Check if document is course-provided (must be done after relevance check)
    const documentText = documents.map((doc) => doc.text).join("\n\n")
      .substring(0, 3000);
    const isProvided = await checkCourseProvided(
      course?.code,
      course?.title,
      fileName,
      documentText,
    );

    // Create document record in database with hash (only after passing relevance check)
    logger.info(
      { fileKey, fileName },
      "Document Ingestion: Creating document record in database.",
    );
    const { data: doc, error: docError } = await supabase
      .from("docs")
      .insert({
        file_name: fileName,
        file_type: fileType,
        file_url: fileUrl,
        course_id: courseId,
        file_hash: fileHash,
        course_provided: isProvided,
      })
      .select("id")
      .single();

    if (docError) {
      logger.error(
        { error: docError, fileKey, fileName },
        "Document Ingestion: Could not create document in database.",
      );
      await cleanupFailedIngestion(
        fileKey,
        "Could not create document in database",
      );
      return false;
    }

    const docId = doc.id;
    logger.info(
      { docId, fileKey, fileName, fileHash },
      "Document Ingestion: Document created in database.",
    );

    // Split documents into nodes
    logger.info({ fileKey, fileName }, "Splitting document into nodes...");
    const nodes = splitDocumentsToNodes(documents);

    // Generate embeddings
    logger.info("Generating embeddings...");
    const nodeTexts = nodes.map((node) => node.text);
    const embeddings = await generateEmbeddings({ nodeTexts, fileKey });

    if (!embeddings) {
      logger.error(
        { fileKey, fileName },
        "Document Ingestion: Failed to generate embeddings. Aborting Supabase insert.",
      );
      await cleanupFailedIngestion(fileKey, "Failed to generate embeddings");
      return false;
    }
    logger.info({ fileKey, fileName }, "Embeddings generated successfully");

    // Insert chunks with sanitized content
    logger.info({ fileKey, fileName }, "Inserting chunks into database...");
    const chunksToInsert = nodes.map((node, index) => ({
      doc_id: docId,
      content: sanitizeText(node.text, `${fileName}-chunk-${index}`),
      embedding: embeddings[index],
      chunk_count: index,
    }));

    const { error: insertError } = await supabase
      .from("chunks")
      .insert(chunksToInsert);

    if (insertError) {
      logger.error({
        fileKey,
        fileName,
        dbError: insertError.message,
        dbDetails: insertError.details,
      }, "Document Ingestion: Error inserting chunks into Supabase.");
      await cleanupFailedIngestion(
        fileKey,
        "Error inserting chunks into database",
      );
      return false;
    }

    logger.info(
      { fileKey, fileName, numInserted: chunksToInsert.length },
      "Document Ingestion: Chunks inserted into Supabase successfully.",
    );
    return true;
  } catch (error) {
    logger.error(
      { error, tempFilePath, fileKey, fileName },
      "Document Ingestion: Error during ingestion pipeline.",
    );
    await cleanupFailedIngestion(
      fileKey,
      "Unexpected error during ingestion pipeline",
    );
    return false;
  } finally {
    // Cleanup
    try {
      if (await fs.stat(tempFilePath).catch(() => false)) {
        await fs.unlink(tempFilePath);
        logger.info(
          { tempFilePath, fileKey },
          "Document Ingestion: Temporary file deleted.",
        );
      }
    } catch (cleanupError) {
      logger.error(
        { cleanupError, tempFilePath, fileKey, fileName },
        "Document Ingestion: Error deleting temporary file.",
      );
    }
  }
}
