import { TestRun, TestResponse, TestSummary, TestQuery } from './testing.types';
import { PromptConfig } from './prompt-config.types';

export interface PromptComparison {
  id: string;
  timestamp: Date;
  queries: TestQuery[];
  courseId: string;
  iterations: number;
  enableEvaluation: boolean;
  promptA: PromptComparisonRun;
  promptB: PromptComparisonRun;
  comparison: ComparisonResults;
  status: 'pending' | 'running' | 'completed' | 'error';
}

export interface PromptComparisonRun {
  promptConfig: PromptConfig;
  testRun: TestRun;
  label: string; // e.g., "Current Default", "Optimized v2"
}

export interface ComparisonResults {
  winner: 'A' | 'B' | 'tie' | 'inconclusive';
  winnerReason: string;
  qualityDifference?: number; // Difference in average quality scores
  speedDifference?: number; // Difference in average response times (ms)
  documentUsageDifference?: number; // Difference in document usage percentage
  statisticalSignificance?: StatisticalSignificance;
  detailedComparison: DetailedComparison;
}

export interface StatisticalSignificance {
  qualityPValue?: number;
  speedPValue?: number;
  documentUsagePValue?: number;
  confidenceLevel: number; // e.g., 0.95 for 95% confidence
  sampleSize: number;
}

export interface DetailedComparison {
  quality: MetricComparison;
  speed: MetricComparison;
  documentUsage: MetricComparison;
  errorRate: MetricComparison;
  consistency: ConsistencyComparison;
}

export interface MetricComparison {
  promptA: {
    mean: number;
    median: number;
    standardDeviation: number;
    min: number;
    max: number;
  };
  promptB: {
    mean: number;
    median: number;
    standardDeviation: number;
    min: number;
    max: number;
  };
  difference: number; // B - A (positive means B is better)
  percentageChange: number; // ((B - A) / A) * 100
  significantDifference: boolean;
}

export interface ConsistencyComparison {
  promptA: {
    qualityVariance: number;
    speedVariance: number;
    responseStyleConsistency: number; // 0-1 score
  };
  promptB: {
    qualityVariance: number;
    speedVariance: number;
    responseStyleConsistency: number; // 0-1 score
  };
}

export interface ComparisonProgress {
  phase: 'initializing' | 'running_prompt_a' | 'running_prompt_b' | 'evaluating_a' | 'evaluating_b' | 'analyzing' | 'completed';
  promptAProgress: { completed: number; total: number };
  promptBProgress: { completed: number; total: number };
  evaluationAProgress: { completed: number; total: number };
  evaluationBProgress: { completed: number; total: number };
  currentStep: string;
  detailedProgress?: {
    currentQuery: string;
    queryIndex: number;
    queryTotal: number;
    iteration: number;
    iterationTotal: number;
  };
}

export interface ComparisonExport {
  metadata: {
    comparisonId: string;
    timestamp: Date;
    query: string;
    iterations: number;
    enabledEvaluation: boolean;
  };
  promptConfigs: {
    promptA: PromptConfig;
    promptB: PromptConfig;
  };
  results: {
    promptA: {
      responses: TestResponse[];
      summary: TestSummary;
    };
    promptB: {
      responses: TestResponse[];
      summary: TestSummary;
    };
  };
  comparison: ComparisonResults;
}