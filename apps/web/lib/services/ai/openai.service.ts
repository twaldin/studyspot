import OpenAI from "openai";
import {
  AIMessage,
  AIResponse,
  OpenAIConfig,
  OpenAIEmbeddingParams,
} from "@/lib/types/AITypes";
import { API_CONSTANTS } from "@/lib/constants";
import logger from "@/lib/logger";

let openaiClient: OpenAI | null = null;

function getOpenAIClient(): OpenAI {
  if (!openaiClient) {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error(
        "The OPENAI_API_KEY environment variable is missing or empty",
      );
    }
    openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return openaiClient;
}

class OpenAIService {
  constructor() {}

  private getClient(): OpenAI {
    return getOpenAIClient();
  }

  async generateEmbeddings(
    params: OpenAIEmbeddingParams,
  ): Promise<AIResponse<number[][]>> {
    try {
      const response = await this.getClient().embeddings.create({
        model: params.model || API_CONSTANTS.OPENAI_EMBEDDING_MODEL,
        input: params.input,
      });

      const embeddings = response.data.map((item) => item.embedding);

      return {
        success: true,
        data: embeddings,
        provider: "openai",
        tokens: response.usage.total_tokens,
        model: params.model || API_CONSTANTS.OPENAI_EMBEDDING_MODEL,
      };
    } catch (error) {
      logger.error({ error }, "OpenAI embedding failed");
      throw error;
    }
  }

  async chatCompletion(
    messages: AIMessage[],
    config: OpenAIConfig = {},
  ): Promise<AIResponse<string>> {
    try {
      const response = await this.getClient().chat.completions.create({
        model: config.model || "gpt-4o-mini",
        messages: messages.map((m) => ({
          role: m.role as "system" | "user" | "assistant",
          content: m.content,
        })),
        temperature: config.temperature || 0.7,
        max_tokens: config.maxTokens,
        response_format: config.responseFormat,
      });

      const content = response.choices[0]?.message?.content || "";

      return {
        success: true,
        data: content,
        provider: "openai",
        tokens: response.usage?.total_tokens,
        model: config.model || "gpt-4o-mini",
      };
    } catch (error) {
      logger.error({ error }, "OpenAI chat completion failed");
      throw error;
    }
  }
}

export const openAIService = new OpenAIService();
