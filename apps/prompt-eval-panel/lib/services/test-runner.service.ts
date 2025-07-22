import { TestRun, TestResponse, TestSummary } from '../types/testing.types';
import { AssistantApiService } from './assistant-api.service';
import { EvaluatorService } from './evaluator.service';

export class TestRunnerService {
  private assistantApi: AssistantApiService;
  private evaluator: EvaluatorService;

  constructor(assistantApiUrl?: string) {
    this.assistantApi = new AssistantApiService(assistantApiUrl);
    this.evaluator = new EvaluatorService();
  }

  createTestRun(
    query: string,
    courseId: string,
    expectedDocumentId: string,
    iterations: number = 10
  ): TestRun {
    const testRun: TestRun = {
      id: `test-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      query,
      courseId,
      expectedDocumentId,
      iterations,
      responses: [],
      status: 'pending'
    };

    console.log(`Created test run ${testRun.id} with ${iterations} iterations`);
    return testRun;
  }

  

  async executeQuery(
    query: string,
    courseId: string,
    sessionId?: string
  ): Promise<TestResponse> {
    const response = await this.assistantApi.executeQuery(
      query,
      courseId,
      sessionId
    );
    return response;
  }

  async evaluateResponses(
    testRun: TestRun,
    onProgress?: (completed: number, total: number) => void
  ): Promise<void> {
    const successfulResponses = testRun.responses.filter(r => !r.error);
    for (let i = 0; i < successfulResponses.length; i++) {
      const response = successfulResponses[i];
      try {
        const query = response.query;
        if (!query) {
            console.warn(`Skipping evaluation for response ${response.responseId} because it's missing a query.`);
            onProgress?.(i + 1, successfulResponses.length);
            continue;
        }
        const evaluation = await this.evaluator.evaluateResponse(
          query,
          response.content,
          'Syllabus information and course policies',
          response.usedExpectedDocument
        );
        response.qualityScore = evaluation.overallScore;
        response.qualityDetails = evaluation;
        onProgress?.(i + 1, successfulResponses.length);
        if (i < successfulResponses.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      } catch (error) {
        console.error(`Failed to evaluate response ${i + 1}:`, error);
        onProgress?.(i + 1, successfulResponses.length);
      }
    }
  }

  calculateSummary(testRun: TestRun): TestSummary {
    const responses = testRun.responses;
    const successfulResponses = responses.filter(r => !r.error);
    const errorCount = responses.filter(r => r.error).length;
    const successCount = successfulResponses.length;

    const documentUsageCount = responses.filter(r => r.usedExpectedDocument).length;
    const documentUsagePercentage = responses.length > 0 
      ? (documentUsageCount / responses.length) * 100 
      : 0;

    const totalResponseTime = successfulResponses.reduce((sum, r) => sum + r.responseTime, 0);
    const averageResponseTime = successCount > 0 
      ? totalResponseTime / successCount 
      : 0;

    // Calculate average quality score if available
    const responsesWithScores = successfulResponses.filter(r => r.qualityScore !== undefined);
    const averageQuality = responsesWithScores.length > 0
      ? responsesWithScores.reduce((sum, r) => sum + (r.qualityScore || 0), 0) / responsesWithScores.length
      : undefined;

    return {
      averageQuality,
      documentUsagePercentage,
      averageResponseTime,
      errorCount,
      successCount
    };
  }

  getTestResults(testRun: TestRun) {
    return {
      testRun,
      summary: testRun.summary,
      successRate: testRun.responses.length > 0 
        ? (testRun.summary?.successCount || 0) / testRun.responses.length * 100 
        : 0,
      averageResponseTime: testRun.summary?.averageResponseTime || 0,
      documentUsagePercentage: testRun.summary?.documentUsagePercentage || 0,
      responses: testRun.responses
    };
  }
}