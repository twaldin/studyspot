import { openAIService } from "@/lib/services/ai/openai.service";
import logger from '@/lib/logger';

/**
 * Generate embeddings for text nodes using OpenAI
 * Maintains exact same functionality as original assistant API
 */
export async function generateEmbeddings(params: {
  nodeTexts: string[];
  fileKey: string;
}): Promise<number[][] | null> {
  const { nodeTexts, fileKey } = params;
  
  try {
    logger.info({
      fileKey,
      nodeCount: nodeTexts.length,
      totalCharacters: nodeTexts.reduce((sum, text) => sum + text.length, 0)
    }, 'Starting embedding generation');

    if (!nodeTexts || nodeTexts.length === 0) {
      logger.warn({ fileKey }, 'No texts provided for embedding generation');
      return null;
    }

    // Use OpenAI service to generate embeddings
    const embeddingResponse = await openAIService.generateEmbeddings({
      input: nodeTexts,
      model: 'text-embedding-3-small'
    });

    if (!embeddingResponse.success || !embeddingResponse.data) {
      logger.error({
        fileKey,
        error: 'No embedding data returned'
      }, 'Failed to generate embeddings');
      return null;
    }

    const embeddings = embeddingResponse.data;
    
    if (embeddings.length !== nodeTexts.length) {
      logger.error({
        fileKey,
        expectedCount: nodeTexts.length,
        actualCount: embeddings.length
      }, 'Embedding count mismatch');
      return null;
    }

    logger.info({
      fileKey,
      embeddingCount: embeddings.length,
      embeddingDimensions: embeddings[0]?.length || 0,
      tokensUsed: embeddingResponse.tokens || 0
    }, 'Embeddings generated successfully');

    return embeddings;

  } catch (error) {
    logger.error({
      error: error instanceof Error ? error.message : 'Unknown error',
      fileKey,
      nodeCount: nodeTexts.length
    }, 'Error generating embeddings');
    return null;
  }
}