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

export interface OpenAIChatParams {
  messages: AIMessage[];
  model?: string;
  temperature?: number;
  responseFormat?: { type: "json_object" } | { type: "text" };
  stream?: boolean;
}

// ===== Claude/Anthropic Specific Types =====

export interface ClaudeConfig extends AIConfig {
  model?:
    | "claude-3-7-sonnet-latest"
    | "claude-3-haiku-20240307"
    | "claude-3-opus-20240229";
}

export interface ClaudeChatParams {
  messages: AIMessage[];
  model?: string;
  maxTokens?: number;
  temperature?: number;
  stream?: boolean;
}

// ===== Gemini Specific Types =====

export interface GeminiConfig extends AIConfig {
  model?: "gemini-pro" | "gemini-pro-flash" | "gemini-pro-flash-latest";
  disableThinking?: boolean;
}

export interface GeminiChatParams {
  messages: AIMessage[];
  model?: string;
  temperature?: number;
  stream?: boolean;
}

// ===== AI Operation Types =====

// Course Info Extraction
export const CourseInfoSchema = z.object({
  courseCode: z.string().nullable(),
  courseTitle: z.string().nullable(),
  schoolName: z.string().nullable(),
  icon: z.string().nullable(),
});

export type CourseInfo = z.infer<typeof CourseInfoSchema>;

export interface CourseExtractionRequest {
  fileUrl: string;
  contentType?: string;
}

export interface CourseExtractionResponse extends AIResponse<CourseInfo> {
  confidence: number;
}

// Course Verification
export interface CourseVerificationRequest {
  courseCode: string;
  schoolName: string;
  schoolDomain: string;
}

export interface CourseVerificationResponse extends AIResponse {
  verified: boolean;
  confidence: number;
  reason: string;
  type?: "duplicate" | "invalid" | "not_found";
}

// Chat Title Generation
export interface TitleGenerationRequest {
  content: string;
  maxLength?: number;
}

export interface TitleGenerationResponse extends AIResponse<string> {
  title: string;
}

// Suggested Queries
export interface SuggestedQueriesRequest {
  courseCode: string;
  courseTitle: string;
  contentSamples?: string[];
  count?: number;
}

export interface SuggestedQueriesResponse extends AIResponse<string[]> {
  queries: string[];
}

// Document Relevance Check
export interface DocumentRelevanceRequest {
  courseCode: string;
  courseTitle: string;
  fileName: string;
  documentContent: string;
}

export interface DocumentRelevanceResponse extends AIResponse<boolean> {
  isRelevant: boolean;
}

// RAG Query Reformulation
export const ReformulationResponseSchema = z.object({
  ragNeeded: z.boolean(),
  question: z.string(),
  model: AIProvider,
});

export type ReformulationResponse = z.infer<typeof ReformulationResponseSchema>;

export interface QueryReformulationRequest {
  question: string;
  conversationHistory: AIMessage[];
  timeZone?: string;
}

export interface QueryReformulationResponse
  extends AIResponse<ReformulationResponse> {
  reformulation: ReformulationResponse;
}

// RAG Chat Response
export interface RAGChatRequest {
  messages: AIMessage[];
  retrievedDocuments?: Array<{
    doc_id: string;
    content: string;
    similarity?: number;
  }>;
  courseId?: string;
  timeZone?: string;
  stream?: boolean;
}

export interface RAGChatResponse extends AIResponse {
  message: string;
  linkedDocumentIds?: string[];
}

// Streaming response
export interface StreamingChunk {
  chunk?: string;
  linkedDocumentIds?: string[];
  done?: boolean;
  error?: string;
}

// ===== Error Types =====

export interface AIError extends Error {
  provider: AIProviderType;
  code?: string;
  status?: number;
  retryable?: boolean;
  tokensUsed?: number;
}

export class AIServiceError extends Error implements AIError {
  provider: AIProviderType;
  code?: string;
  status?: number;
  retryable?: boolean;
  tokensUsed?: number;
  cause?: Error;

  constructor(
    message: string,
    provider: AIProviderType,
    options?: {
      code?: string;
      status?: number;
      retryable?: boolean;
      tokensUsed?: number;
      cause?: Error;
    },
  ) {
    super(message);
    this.name = "AIServiceError";
    this.provider = provider;
    this.code = options?.code;
    this.status = options?.status;
    this.retryable = options?.retryable ?? false;
    this.tokensUsed = options?.tokensUsed;
    this.cause = options?.cause;
  }
}

// ===== Rate Limiting Types =====

export interface RateLimitConfig {
  requestsPerMinute: number;
  tokensPerMinute?: number;
  burstLimit?: number;
}

export interface RateLimitStatus {
  remaining: number;
  resetTime: Date;
  tokensRemaining?: number;
}

// ===== Monitoring Types =====

export interface AIMetrics {
  provider: AIProviderType;
  operation: string;
  model?: string;
  tokens?: number;
  latency: number;
  success: boolean;
  error?: string;
  timestamp: Date;
}

export interface AIUsageStats {
  totalRequests: number;
  totalTokens: number;
  averageLatency: number;
  errorRate: number;
  byProvider: Record<AIProviderType, {
    requests: number;
    tokens: number;
    errors: number;
  }>;
}
