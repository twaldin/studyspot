import OpenAI from 'openai';

/**
 * Interface for embedding results
 */
export interface EmbeddingResult {
  embedding: number[];
  tokens: number;
  model: string;
}

/**
 * Service responsible for generating embeddings using OpenAI's API
 * Replicates the functionality from the original assistant API
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
   * Generates an embedding for the given text using OpenAI's text-embedding-3-small model
   */
  static async generateEmbedding(
    text: string,
    model: string = 'text-embedding-3-small'
  ): Promise<EmbeddingResult> {
    try {
      console.log(`[EmbeddingService] Generating embedding for text length: ${text.length}`);
      
      const openai = this.getOpenAI();
      
      const response = await openai.embeddings.create({
        model,
        input: text,
        encoding_format: 'float'
      });

      const embedding = response.data[0].embedding;
      const tokens = response.usage.total_tokens;

      console.log(`[EmbeddingService] Generated embedding: ${embedding.length} dimensions, ${tokens} tokens`);

      return {
        embedding,
        tokens,
        model
      };

    } catch (error) {
      console.error(`[EmbeddingService] Error generating embedding:`, error);
      throw new Error(`Failed to generate embedding: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Validates that an embedding has the correct format and dimensions
   */
  static validateEmbedding(embedding: number[]): boolean {
    if (!Array.isArray(embedding)) {
      return false;
    }
    
    // text-embedding-3-small produces 1536-dimensional embeddings
    if (embedding.length !== 1536) {
      console.warn(`[EmbeddingService] Unexpected embedding dimensions: ${embedding.length}, expected 1536`);
      return false;
    }
    
    // Check that all values are numbers
    return embedding.every(val => typeof val === 'number' && !isNaN(val));
  }
}