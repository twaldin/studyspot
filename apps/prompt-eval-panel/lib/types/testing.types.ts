export interface TestQuery {
  id: string;
  query: string;
  expectedDocumentId: string;
  enabled: boolean;
}

export interface TestResponse {
  responseId: string;
  content: string;
  linkedDocumentIds: string[];
  responseTime: number;
  streamingChunks: number;
  qualityScore?: number;
  qualityDetails?: QualityEvaluation;
  usedExpectedDocument: boolean;
  error?: string;
  query?: string;
  expectedDocumentId?: string;
}

export interface TestRun {
  id: string;
  timestamp: Date;
  query: string;
  courseId: string;
  expectedDocumentId: string;
  iterations: number;
  responses: TestResponse[];
  summary?: TestSummary;
  status: 'pending' | 'running' | 'completed' | 'error';
}

export interface TestSummary {
  averageQuality?: number;
  documentUsagePercentage: number;
  averageResponseTime: number;
  totalTokensUsed?: number;
  errorCount: number;
  successCount: number;
}

export interface StreamingResponse {
  connected?: boolean;
  chunk?: string;
  done?: boolean;
  linkedDocumentIds?: string[];
  error?: string;
}

export interface AssistantApiRequest {
  question: string;
  conversationHistory: Array<{
    role: 'user' | 'assistant' | 'system';
    content: string;
  }>;
  courseId: string;
  timeZone?: string;
  sessionId?: string;
}

export interface EvaluationCriteria {
  relevance: number;      // 1-10: How relevant to the query
  accuracy: number;       // 1-10: Factual correctness  
  completeness: number;   // 1-10: Covers important points
  coherence: number;      // 1-10: Well-structured response
  sourceUsage: number;    // 1-10: Appropriate document references
}

export interface QualityEvaluation {
  overallScore: number;   // 1-10 overall quality
  criteria: EvaluationCriteria;
  reasoning: string;
}