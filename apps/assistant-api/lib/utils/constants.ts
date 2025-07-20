// API Configuration
export const API_CONSTANTS = {
  // Timeouts and limits
  DOCUMENT_TEXT_MAX_LENGTH: 3000,
  CHUNK_CONTENT_PREVIEW_LENGTH: 200,
  CONTENT_CHUNK_MIN_LENGTH: 50,

  // RAG Configuration
  RAG_MATCH_COUNT: 3,
  RAG_MATCH_THRESHOLD: 0.1,
  RAG_DOCUMENT_LIMIT: 15,
  RAG_COURSE_DOCS_LIMIT: 10,

  // Content limits
  MESSAGE_CONTENT_PREVIEW_LENGTH: 200,
  LLM_INPUT_CONTENT_PREVIEW_LENGTH: 180,
  RESPONSE_PREVIEW_LENGTH: 200,

  // Live chat
  MESSAGE_SIMILARITY_THRESHOLD_MS: 5000,

  // Embedding models
  OPENAI_EMBEDDING_MODEL: "text-embedding-3-small" as const,

  // File size display
  BYTES_TO_KB_DIVISOR: 1024,
} as const;

// External URLs
export const EXTERNAL_URLS = {
  BREVO_API: "https://api.brevo.com/v3/contacts",
  SOCIAL_INSTAGRAM: "https://instagram.com",
  SOCIAL_YOUTUBE: "https://youtube.com",
  SVG_NAMESPACE: "http://www.w3.org/2000/svg",
} as const;

// Default messages and prompts
export const DEFAULT_MESSAGES = {
  LOADING_QUERIES: ["Loading..."],
  ERROR_FALLBACK:
    "Sorry, I encountered an issue processing the response. Please try again.",
  GENERIC_ERROR: "An unexpected error occurred. Please try again.",
  SUGGESTED_QUERIES: [
    "What are the key concepts for the next exam?",
    "Can you explain the last lecture in simpler terms?",
    "Summarize the main points of this week's readings.",
    "What are some practice problems for this topic?",
  ],
} as const;
