import logger from "@/lib/utils/logger"; // --- 3. Generate Embeddings Function (from assistant/utils/embed.text.ts) ---
import OpenAI from "openai";

// Initialize OpenAI client - ensure OPENAI_API_KEY is in .env
const openai = new OpenAI(); // API key is read from process.env.OPENAI_API_KEY by default

export interface GenerateEmbeddingsParams {
  nodeTexts: string[];
  fileKey: string;
}

export async function generateEmbeddings(
  { nodeTexts, fileKey }: GenerateEmbeddingsParams,
): Promise<number[][] | null> {
  if (!process.env.OPENAI_API_KEY) {
    logger.error(
      { fileKey },
      "Document Ingestion: OPENAI_API_KEY is not set. Cannot proceed with embedding.",
    );
    return null;
  }

  if (nodeTexts.length === 0) {
    logger.info({ fileKey }, "Document Ingestion: No text nodes to embed.");
    return [];
  }

  logger.info(
    { fileKey, numToEmbed: nodeTexts.length },
    "Document Ingestion: Starting batch embedding with OpenAI API.",
  );

  try {
    const embeddingResponse = await openai.embeddings.create({
      model: "text-embedding-3-small", // Default output: 1536 dimensions
      input: nodeTexts,
    });

    const embeddings = embeddingResponse.data.map((
      item: { embedding: number[] },
    ) => item.embedding);

    if (embeddings.length !== nodeTexts.length) {
      logger.error(
        { fileKey, expected: nodeTexts.length, received: embeddings.length },
        "Document Ingestion: Mismatch in number of embeddings received from OpenAI.",
      );
      return null;
    }

    logger.info(
      { fileKey, numEmbedded: embeddings.length },
      "Document Ingestion: OpenAI API embedding complete.",
    );
    return embeddings;
  } catch (error) {
    if (error instanceof OpenAI.APIError) {
      logger.error({
        fileKey,
        errorName: error.name,
        statusCode: error.status,
        errorMessage: error.message,
        errorHeaders: error.headers,
      }, "Document Ingestion: OpenAI API error during embedding.");
    } else if (error instanceof Error) {
      logger.error({
        error: { message: error.message, name: error.name, stack: error.stack },
        fileKey,
      }, "Document Ingestion: Error during embedding generation.");
    } else {
      logger.error(
        { error, fileKey },
        "Document Ingestion: An unknown error occurred during embedding generation.",
      );
    }
    return null;
  }
}