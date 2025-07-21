import OpenAI from 'openai';
import logger from '@/lib/utils/logger';
import { API_CONSTANTS } from '@/lib/utils/constants';

/**
 * Interface for embedding results
 */
export interface EmbeddingResult {
  embedding: number[];
  tokens: number;
  model: string;
}

/**
 * Interface for batch embedding results
 */
export interface BatchEmbeddingResult {
  embeddings: number[][];
  totalTokens: number;
  model: string;
  failed: Array<{ index: number; text: string; error: string }>;
}

/**
 * Configuration options for embedding generation
 */
export interface EmbeddingOptions {
  model?: string;
  maxRetries?: number;
  retryDelay?: number;
  dimensions?: number;
}

/**
 * Service responsible for generating embeddings using OpenAI's API
 */
export class EmbeddingService {
  private static openai: OpenAI;
  
  /**
   * Initialize the OpenAI client (lazy initialization)
   */
  private static getOpenAI(): OpenAI {
    if (!this.openai) {
      if (!process.env.OPENAI_API_KEY) {
        throw new Error("OPENAI_API_KEY is not set. Cannot proceed with embedding generation.");
      }
      this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    }
    return this.openai;
  }

  /**
   * Generates an embedding for a single text input
   */
  static async generateEmbedding(
    text: string,
    options: EmbeddingOptions = {}
  ): Promise<EmbeddingResult> {
    const {
      model = API_CONSTANTS.OPENAI_EMBEDDING_MODEL,
      maxRetries = 3,
      retryDelay = 1000
    } = options;

    if (!text || text.trim().length === 0) {
      throw new Error("Text input cannot be empty for embedding generation.");
    }

    let lastError: Error | undefined;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        logger.debug({ 
          text: text.substring(0, 100) + (text.length > 100 ? '...' : ''),
          model,
          attempt 
        }, "[EmbeddingService] Generating embedding");

        const response = await this.getOpenAI().embeddings.create({
          model,
          input: text,
          dimensions: options.dimensions
        });

        const embedding = response.data[0]?.embedding;
        if (!embedding) {
          throw new Error("No embedding returned from OpenAI API");
        }

        logger.debug({
          model,
          tokens: response.usage?.total_tokens || 0,
          embeddingDimensions: embedding.length
        }, "[EmbeddingService] Successfully generated embedding");

        return {
          embedding,
          tokens: response.usage?.total_tokens || 0,
          model
        };

      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        
        if (error instanceof OpenAI.APIError) {
          logger.warn({
            error: error.message,
            status: error.status,
            type: error.type,
            attempt,
            maxRetries
          }, "[EmbeddingService] OpenAI API error during embedding generation");

          // Don't retry on certain error types
          if (error.status === 400 || error.status === 401 || error.status === 403) {
            throw error;
          }
        } else {
          logger.warn({
            error: lastError.message,
            attempt,
            maxRetries
          }, "[EmbeddingService] Error during embedding generation");
        }

        if (attempt < maxRetries) {
          const delay = retryDelay * Math.pow(2, attempt - 1); // Exponential backoff
          logger.info({ delay, attempt }, "[EmbeddingService] Retrying after delay");
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    logger.error({ error: lastError, text: text.substring(0, 100) }, "[EmbeddingService] Failed to generate embedding after all retries");
    throw lastError || new Error("Failed to generate embedding after all retries");
  }

  /**
   * Generates embeddings for multiple text inputs in batch
   */
  static async generateBatchEmbeddings(
    texts: string[],
    options: EmbeddingOptions = {}
  ): Promise<BatchEmbeddingResult> {
    const {
      model = API_CONSTANTS.OPENAI_EMBEDDING_MODEL,
      maxRetries = 3,
      retryDelay = 1000
    } = options;

    if (!texts || texts.length === 0) {
      throw new Error("Text array cannot be empty for batch embedding generation.");
    }

    // Filter out empty texts and track their indices
    const validTexts: Array<{ text: string; originalIndex: number }> = [];
    const failed: Array<{ index: number; text: string; error: string }> = [];

    texts.forEach((text, index) => {
      if (!text || text.trim().length === 0) {
        failed.push({
          index,
          text,
          error: "Empty text input"
        });
      } else {
        validTexts.push({ text, originalIndex: index });
      }
    });

    if (validTexts.length === 0) {
      logger.warn("[EmbeddingService] No valid texts provided for batch embedding");
      return {
        embeddings: [],
        totalTokens: 0,
        model,
        failed
      };
    }

    let lastError: Error | undefined;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        logger.debug({ 
          textCount: validTexts.length,
          model,
          attempt 
        }, "[EmbeddingService] Generating batch embeddings");

        const response = await this.getOpenAI().embeddings.create({
          model,
          input: validTexts.map(item => item.text),
          dimensions: options.dimensions
        });

        if (!response.data || response.data.length !== validTexts.length) {
          throw new Error(`Expected ${validTexts.length} embeddings, got ${response.data?.length || 0}`);
        }

        // Reconstruct embeddings array in original order
        const embeddings: number[][] = new Array(texts.length);
        response.data.forEach((embeddingData, index) => {
          const originalIndex = validTexts[index].originalIndex;
          embeddings[originalIndex] = embeddingData.embedding;
        });

        logger.info({
          model,
          totalTokens: response.usage?.total_tokens || 0,
          successfulEmbeddings: validTexts.length,
          failedEmbeddings: failed.length,
          embeddingDimensions: response.data[0]?.embedding?.length || 0
        }, "[EmbeddingService] Successfully generated batch embeddings");

        return {
          embeddings,
          totalTokens: response.usage?.total_tokens || 0,
          model,
          failed
        };

      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        
        if (error instanceof OpenAI.APIError) {
          logger.warn({
            error: error.message,
            status: error.status,
            type: error.type,
            attempt,
            maxRetries
          }, "[EmbeddingService] OpenAI API error during batch embedding generation");

          // Don't retry on certain error types
          if (error.status === 400 || error.status === 401 || error.status === 403) {
            throw error;
          }
        } else {
          logger.warn({
            error: lastError.message,
            attempt,
            maxRetries
          }, "[EmbeddingService] Error during batch embedding generation");
        }

        if (attempt < maxRetries) {
          const delay = retryDelay * Math.pow(2, attempt - 1); // Exponential backoff
          logger.info({ delay, attempt }, "[EmbeddingService] Retrying batch embedding after delay");
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    logger.error({ 
      error: lastError, 
      textCount: validTexts.length 
    }, "[EmbeddingService] Failed to generate batch embeddings after all retries");
    throw lastError || new Error("Failed to generate batch embeddings after all retries");
  }

  /**
   * Generates embeddings with chunking for very large batches
   */
  static async generateLargeBatchEmbeddings(
    texts: string[],
    options: EmbeddingOptions & { chunkSize?: number } = {}
  ): Promise<BatchEmbeddingResult> {
    const { chunkSize = 100, ...embeddingOptions } = options;

    if (texts.length <= chunkSize) {
      return this.generateBatchEmbeddings(texts, embeddingOptions);
    }

    logger.info({ 
      totalTexts: texts.length, 
      chunkSize 
    }, "[EmbeddingService] Processing large batch with chunking");

    const allEmbeddings: number[][] = new Array(texts.length);
    const allFailed: Array<{ index: number; text: string; error: string }> = [];
    let totalTokens = 0;
    let model = embeddingOptions.model || API_CONSTANTS.OPENAI_EMBEDDING_MODEL;

    // Process in chunks
    for (let i = 0; i < texts.length; i += chunkSize) {
      const chunk = texts.slice(i, i + chunkSize);
      const chunkStartIndex = i;

      try {
        const chunkResult = await this.generateBatchEmbeddings(chunk, embeddingOptions);
        
        // Copy embeddings to correct positions
        chunkResult.embeddings.forEach((embedding, index) => {
          if (embedding) {
            allEmbeddings[chunkStartIndex + index] = embedding;
          }
        });

        // Adjust failed indices to global indices
        chunkResult.failed.forEach(failedItem => {
          allFailed.push({
            ...failedItem,
            index: chunkStartIndex + failedItem.index
          });
        });

        totalTokens += chunkResult.totalTokens;
        model = chunkResult.model;

        logger.debug({
          chunkIndex: Math.floor(i / chunkSize) + 1,
          totalChunks: Math.ceil(texts.length / chunkSize),
          chunkSize: chunk.length,
          chunkTokens: chunkResult.totalTokens
        }, "[EmbeddingService] Processed chunk");

      } catch (error) {
        logger.error({
          error,
          chunkStartIndex,
          chunkSize: chunk.length
        }, "[EmbeddingService] Failed to process chunk, marking all as failed");

        // Mark all texts in this chunk as failed
        chunk.forEach((text, index) => {
          allFailed.push({
            index: chunkStartIndex + index,
            text,
            error: error instanceof Error ? error.message : String(error)
          });
        });
      }
    }

    const successfulEmbeddings = allEmbeddings.filter(e => e !== undefined).length;
    
    logger.info({
      totalTexts: texts.length,
      successfulEmbeddings,
      failedEmbeddings: allFailed.length,
      totalTokens,
      model
    }, "[EmbeddingService] Completed large batch embedding processing");

    return {
      embeddings: allEmbeddings,
      totalTokens,
      model,
      failed: allFailed
    };
  }

  /**
   * Calculates cosine similarity between two embeddings
   */
  static calculateSimilarity(embedding1: number[], embedding2: number[]): number {
    if (embedding1.length !== embedding2.length) {
      throw new Error("Embeddings must have the same dimensionality");
    }

    let dotProduct = 0;
    let norm1 = 0;
    let norm2 = 0;

    for (let i = 0; i < embedding1.length; i++) {
      dotProduct += embedding1[i] * embedding2[i];
      norm1 += embedding1[i] * embedding1[i];
      norm2 += embedding2[i] * embedding2[i];
    }

    const magnitude = Math.sqrt(norm1) * Math.sqrt(norm2);
    if (magnitude === 0) {
      return 0;
    }

    return dotProduct / magnitude;
  }

  /**
   * Validates that an embedding has the expected dimensions
   */
  static validateEmbedding(
    embedding: number[], 
    expectedDimensions?: number
  ): boolean {
    if (!Array.isArray(embedding)) {
      return false;
    }

    if (embedding.length === 0) {
      return false;
    }

    if (expectedDimensions && embedding.length !== expectedDimensions) {
      return false;
    }

    // Check that all values are valid numbers
    return embedding.every(value => typeof value === 'number' && !isNaN(value));
  }

  /**
   * Gets the expected dimensions for a given model
   */
  static getModelDimensions(model: string): number {
    switch (model) {
      case 'text-embedding-ada-002':
        return 1536;
      case 'text-embedding-3-small':
        return 1536;
      case 'text-embedding-3-large':
        return 3072;
      default:
        return 1536; // Default for most OpenAI embedding models
    }
  }
}