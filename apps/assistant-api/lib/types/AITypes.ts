import { z } from "zod";

// ===== AI Provider Types =====

export const AIProvider = z.enum(["openai", "claude", "gemini"]);
export type AIProviderType = z.infer<typeof AIProvider>;

// ===== Common AI Types =====

export interface AIMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface AIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  provider: AIProviderType;
  tokens?: number;
  model?: string;
}

export interface AIConfig {
  temperature?: number;
  maxTokens?: number;
  model?: string;
  timeout?: number;
  retries?: number;
}

// ===== OpenAI Specific Types =====

export interface OpenAIConfig extends AIConfig {
  model?: "gpt-4o-mini" | "gpt-3.5-turbo" | "text-embedding-3-small";
  responseFormat?: { type: "json_object" } | { type: "text" };
}

export interface OpenAIEmbeddingParams {
  input: string | string[];
  model?: "text-embedding-3-small";
}

export interface OpenAIEmbeddingResponse {
  data: Array<{ embedding: number[] }>;
  usage: {
    prompt_tokens: number;
    total_tokens: number;
  };
}

// ===== Claude/Anthropic Specific Types =====

export interface ClaudeConfig extends AIConfig {
  model?: "claude-3-haiku-20240307" | "claude-3-sonnet-20240229" | "claude-3-opus-20240229";
}

// ===== Gemini Specific Types =====

export interface GeminiConfig extends AIConfig {
  model?: "gemini-1.5-pro" | "gemini-1.5-flash";
}