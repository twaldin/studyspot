import { QualityEvaluation, EvaluationCriteria } from '../types/testing.types';

export class EvaluatorService {
  async evaluateResponse(
    query: string,
    response: string,
    expectedContext: string,
    usedExpectedDocument: boolean
  ): Promise<QualityEvaluation> {
    try {
      const apiResponse = await fetch('/api/evaluate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          response,
          expectedContext,
          usedExpectedDocument
        })
      });

      if (!apiResponse.ok) {
        const errorData = await apiResponse.json();
        throw new Error(errorData.error || `API error: ${apiResponse.status}`);
      }

      const evaluation = await apiResponse.json();
      
      // Debug logging to investigate 9.0 score issue
      console.log('Evaluation API Response:', {
        query: query.substring(0, 50) + '...',
        responseLength: response.length,
        usedExpectedDocument,
        overallScore: evaluation.overallScore,
        criteria: evaluation.criteria,
        reasoning: evaluation.reasoning?.substring(0, 100) + '...'
      });
      
      return evaluation as QualityEvaluation;

    } catch (error) {
      console.error('Evaluation failed:', error);
      // Return default scores if evaluation fails
      return {
        overallScore: 5,
        criteria: {
          relevance: 5,
          accuracy: 5,
          completeness: 5,
          coherence: 5,
          sourceUsage: usedExpectedDocument ? 8 : 3
        },
        reasoning: `Evaluation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }


  async batchEvaluateResponses(
    query: string,
    responses: Array<{ content: string; usedExpectedDocument: boolean }>,
    expectedContext: string,
    onProgress?: (completed: number, total: number) => void
  ): Promise<QualityEvaluation[]> {
    const evaluations: QualityEvaluation[] = [];

    for (let i = 0; i < responses.length; i++) {
      const response = responses[i];
      
      try {
        const evaluation = await this.evaluateResponse(
          query,
          response.content,
          expectedContext,
          response.usedExpectedDocument
        );
        
        evaluations.push(evaluation);
        
        if (onProgress) {
          onProgress(i + 1, responses.length);
        }

        // Small delay between API calls to avoid rate limiting
        if (i < responses.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
      } catch (error) {
        console.error(`Failed to evaluate response ${i + 1}:`, error);
        // Push a default evaluation for failed cases
        evaluations.push({
          overallScore: 5,
          criteria: {
            relevance: 5,
            accuracy: 5,
            completeness: 5,
            coherence: 5,
            sourceUsage: response.usedExpectedDocument ? 8 : 3
          },
          reasoning: 'Evaluation failed due to API error'
        });
        
        if (onProgress) {
          onProgress(i + 1, responses.length);
        }
      }
    }

    return evaluations;
  }
}