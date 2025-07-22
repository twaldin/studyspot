import { PromptComparison, ComparisonResults, ComparisonProgress, MetricComparison, DetailedComparison } from '../types/comparison.types';
import { PromptConfig } from '../types/prompt-config.types';
import { TestRun, TestQuery } from '../types/testing.types';
import { AssistantApiProxyService } from './assistant-api-proxy.service';
import { EvaluatorService } from './evaluator.service';
import { TestRunnerService } from './test-runner.service';

export class ComparisonRunnerService {
  private proxyService: AssistantApiProxyService;
  private evaluator: EvaluatorService;
  private testRunner: TestRunnerService;

  constructor(assistantApiUrl?: string) {
    this.proxyService = new AssistantApiProxyService(assistantApiUrl);
    this.evaluator = new EvaluatorService();
    this.testRunner = new TestRunnerService(assistantApiUrl);
  }

  async createComparison(
    queries: TestQuery[],
    courseId: string,
    promptA: PromptConfig,
    promptB: PromptConfig,
    iterations: number = 10
  ): Promise<PromptComparison> {
    const totalIterations = queries.length * iterations;
    const comparison: PromptComparison = {
      id: `comp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      queries,
      courseId,
      iterations,
      enableEvaluation: true,
      promptA: {
        promptConfig: promptA,
        testRun: this.testRunner.createTestRun('Multiple Queries', courseId, '', totalIterations),
        label: promptA.name
      },
      promptB: {
        promptConfig: promptB,
        testRun: this.testRunner.createTestRun('Multiple Queries', courseId, '', totalIterations),
        label: promptB.name
      },
      comparison: {
        winner: 'inconclusive',
        winnerReason: 'Not yet calculated',
        detailedComparison: this.createEmptyDetailedComparison()
      },
      status: 'pending'
    };

    console.log(`Created comparison ${comparison.id}: "${promptA.name}" vs "${promptB.name}"`);
    return comparison;
  }

  async executeComparison(
    comparison: PromptComparison,
    onProgress?: (progress: ComparisonProgress) => void
  ): Promise<PromptComparison> {
    console.log(`Starting comparison ${comparison.id}`);
    comparison.status = 'running';

    const progress: ComparisonProgress = {
      phase: 'initializing',
      promptAProgress: { completed: 0, total: comparison.iterations * comparison.queries.length },
      promptBProgress: { completed: 0, total: comparison.iterations * comparison.queries.length },
      evaluationAProgress: { completed: 0, total: 0 },
      evaluationBProgress: { completed: 0, total: 0 },
      currentStep: 'Initializing comparison...'
    };

    const updateProgress = (newProgress: Partial<ComparisonProgress>) => {
      Object.assign(progress, newProgress);
      onProgress?.({ ...progress });
    };

    try {
      const isHealthy = await this.proxyService.healthCheck();
      if (!isHealthy) {
        comparison.status = 'error';
        throw new Error('Assistant API is not available');
      }

      updateProgress({ phase: 'running_prompt_a', currentStep: `Running ${comparison.promptA.label}` });
      await this.executePromptTestRun(
        comparison.promptA.testRun, 
        comparison.promptA.promptConfig, 
        comparison.queries, 
        comparison.courseId, 
        comparison.iterations, 
        (completed, total) => {
          updateProgress({ promptAProgress: { completed, total } });
        },
        (queryIndex, queryTotal, iteration, iterationTotal, query) => {
          updateProgress({ 
            currentStep: `Running ${comparison.promptA.label}: Query ${queryIndex}/${queryTotal}, Iteration ${iteration}/${iterationTotal}`,
            detailedProgress: {
              currentQuery: query.substring(0, 50) + (query.length > 50 ? '...' : ''),
              queryIndex,
              queryTotal,
              iteration,
              iterationTotal
            }
          });
        }
      );

      updateProgress({ phase: 'running_prompt_b', currentStep: `Running ${comparison.promptB.label}` });
      await this.executePromptTestRun(
        comparison.promptB.testRun, 
        comparison.promptB.promptConfig, 
        comparison.queries, 
        comparison.courseId, 
        comparison.iterations, 
        (completed, total) => {
          updateProgress({ promptBProgress: { completed, total } });
        },
        (queryIndex, queryTotal, iteration, iterationTotal, query) => {
          updateProgress({ 
            currentStep: `Running ${comparison.promptB.label}: Query ${queryIndex}/${queryTotal}, Iteration ${iteration}/${iterationTotal}`,
            detailedProgress: {
              currentQuery: query.substring(0, 50) + (query.length > 50 ? '...' : ''),
              queryIndex,
              queryTotal,
              iteration,
              iterationTotal
            }
          });
        }
      );

      if (comparison.enableEvaluation) {
        updateProgress({ phase: 'evaluating_a', currentStep: `Evaluating ${comparison.promptA.label} responses` });
        await this.testRunner.evaluateResponses(comparison.promptA.testRun, (completed, total) => {
          updateProgress({ evaluationAProgress: { completed, total } });
        });

        updateProgress({ phase: 'evaluating_b', currentStep: `Evaluating ${comparison.promptB.label} responses` });
        await this.testRunner.evaluateResponses(comparison.promptB.testRun, (completed, total) => {
          updateProgress({ evaluationBProgress: { completed, total } });
        });
      }

      updateProgress({ phase: 'analyzing', currentStep: 'Analyzing results' });
      comparison.comparison = this.analyzeComparison(comparison.promptA.testRun, comparison.promptB.testRun);
      comparison.status = 'completed';

      updateProgress({ phase: 'completed', currentStep: `Comparison complete. Winner: ${comparison.comparison.winner}` });
      return comparison;
    } catch (error) {
      comparison.status = 'error';
      console.error(`Comparison ${comparison.id} failed:`, error);
      throw error;
    }
  }

  private async executePromptTestRun(
    testRun: TestRun,
    promptConfig: PromptConfig,
    queries: TestQuery[],
    courseId: string,
    iterations: number,
    onProgress?: (completed: number, total: number) => void,
    onDetailedProgress?: (queryIndex: number, queryTotal: number, iteration: number, iterationTotal: number, query: string) => void
  ): Promise<void> {
    let completedIterations = 0;
    const totalIterations = queries.length * iterations;

    for (let queryIndex = 0; queryIndex < queries.length; queryIndex++) {
      const query = queries[queryIndex];
      for (let i = 0; i < iterations; i++) {
        // Provide detailed progress info
        onDetailedProgress?.(queryIndex + 1, queries.length, i + 1, iterations, query.query);
        
        const response = await this.proxyService.executeQueryWithPromptConfig(
          query.query,
          courseId,
          promptConfig,
          `${testRun.id}-${query.id}-${i}`
        );
        response.usedExpectedDocument = response.linkedDocumentIds.includes(query.expectedDocumentId);
        response.query = query.query;
        response.expectedDocumentId = query.expectedDocumentId;
        testRun.responses.push(response);
        completedIterations++;
        onProgress?.(completedIterations, totalIterations);
      }
    }
    testRun.summary = this.testRunner.calculateSummary(testRun);
  }

  private analyzeComparison(testRunA: TestRun, testRunB: TestRun): ComparisonResults {
    const summaryA = testRunA.summary!;
    const summaryB = testRunB.summary!;

    // Calculate detailed metrics
    const qualityComparison = this.calculateMetricComparison(
      testRunA.responses.filter(r => r.qualityScore !== undefined).map(r => r.qualityScore!),
      testRunB.responses.filter(r => r.qualityScore !== undefined).map(r => r.qualityScore!)
    );

    const speedComparison = this.calculateMetricComparison(
      testRunA.responses.filter(r => !r.error).map(r => r.responseTime),
      testRunB.responses.filter(r => !r.error).map(r => r.responseTime)
    );

    const documentUsageComparison = this.calculateMetricComparison(
      [summaryA.documentUsagePercentage],
      [summaryB.documentUsagePercentage]
    );

    const errorRateComparison = this.calculateMetricComparison(
      [(summaryA.errorCount / testRunA.responses.length) * 100],
      [(summaryB.errorCount / testRunB.responses.length) * 100]
    );

    // Determine winner
    let winner: 'A' | 'B' | 'tie' | 'inconclusive' = 'inconclusive';
    let winnerReason = 'Unable to determine clear winner';

    const qualityDiff = qualityComparison.difference;
    const speedDiff = speedComparison.difference; // Negative is better (faster)
    const docUsageDiff = documentUsageComparison.difference;

    if (Math.abs(qualityDiff) > 0.5) {
      winner = qualityDiff > 0 ? 'B' : 'A';
      winnerReason = `${winner === 'B' ? testRunB.id : testRunA.id} has significantly better quality scores (${Math.abs(qualityDiff).toFixed(1)} point difference)`;
    } else if (Math.abs(speedDiff) > 1000) {
      winner = speedDiff < 0 ? 'B' : 'A';
      winnerReason = `${winner === 'B' ? testRunB.id : testRunA.id} is significantly faster (${Math.abs(speedDiff).toFixed(0)}ms improvement)`;
    } else if (Math.abs(docUsageDiff) > 10) {
      winner = docUsageDiff > 0 ? 'B' : 'A';
      winnerReason = `${winner === 'B' ? testRunB.id : testRunA.id} has better document usage (${Math.abs(docUsageDiff).toFixed(1)}% improvement)`;
    } else {
      winner = 'tie';
      winnerReason = 'Both prompts performed similarly across all metrics';
    }

    return {
      winner,
      winnerReason,
      qualityDifference: qualityDiff,
      speedDifference: speedDiff,
      documentUsageDifference: docUsageDiff,
      detailedComparison: {
        quality: qualityComparison,
        speed: speedComparison,
        documentUsage: documentUsageComparison,
        errorRate: errorRateComparison,
        consistency: {
          promptA: {
            qualityVariance: this.calculateVariance(testRunA.responses.filter(r => r.qualityScore).map(r => r.qualityScore!)),
            speedVariance: this.calculateVariance(testRunA.responses.filter(r => !r.error).map(r => r.responseTime)),
            responseStyleConsistency: 0.8 // Placeholder - would need more sophisticated analysis
          },
          promptB: {
            qualityVariance: this.calculateVariance(testRunB.responses.filter(r => r.qualityScore).map(r => r.qualityScore!)),
            speedVariance: this.calculateVariance(testRunB.responses.filter(r => !r.error).map(r => r.responseTime)),
            responseStyleConsistency: 0.8 // Placeholder
          }
        }
      }
    };
  }

  private calculateMetricComparison(valuesA: number[], valuesB: number[]): MetricComparison {
    const statsA = this.calculateStats(valuesA);
    const statsB = this.calculateStats(valuesB);
    
    const difference = statsB.mean - statsA.mean;
    const percentageChange = statsA.mean !== 0 ? (difference / statsA.mean) * 100 : 0;

    return {
      promptA: statsA,
      promptB: statsB,
      difference,
      percentageChange,
      significantDifference: Math.abs(difference) > (statsA.standardDeviation + statsB.standardDeviation) / 2
    };
  }

  private calculateStats(values: number[]) {
    if (values.length === 0) {
      return { mean: 0, median: 0, standardDeviation: 0, min: 0, max: 0 };
    }

    const sorted = [...values].sort((a, b) => a - b);
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const median = sorted.length % 2 === 0 
      ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2 
      : sorted[Math.floor(sorted.length / 2)];
    
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    const standardDeviation = Math.sqrt(variance);

    return {
      mean,
      median,
      standardDeviation,
      min: sorted[0],
      max: sorted[sorted.length - 1]
    };
  }

  private calculateVariance(values: number[]): number {
    if (values.length === 0) return 0;
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    return values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
  }

  private createEmptyDetailedComparison(): DetailedComparison {
    const emptyMetric: MetricComparison = {
      promptA: { mean: 0, median: 0, standardDeviation: 0, min: 0, max: 0 },
      promptB: { mean: 0, median: 0, standardDeviation: 0, min: 0, max: 0 },
      difference: 0,
      percentageChange: 0,
      significantDifference: false
    };

    return {
      quality: emptyMetric,
      speed: emptyMetric,
      documentUsage: emptyMetric,
      errorRate: emptyMetric,
      consistency: {
        promptA: { qualityVariance: 0, speedVariance: 0, responseStyleConsistency: 0 },
        promptB: { qualityVariance: 0, speedVariance: 0, responseStyleConsistency: 0 }
      }
    };
  }
}
