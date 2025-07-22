'use client';

import { useState } from 'react';
import { PromptComparison, ComparisonProgress } from '../../lib/types/comparison.types';
import { PromptConfig, DEFAULT_PROMPT_CONFIG } from '../../lib/types/prompt-config.types';
import { ComparisonRunnerService } from '../../lib/services/comparison-runner.service';
import ComparisonRunner from '../../components/comparison-runner/comparison-runner';
import ComparisonResults from '../../components/comparison-results/comparison-results';

export default function ComparisonPage() {
  const [currentComparison, setCurrentComparison] = useState<PromptComparison | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState<ComparisonProgress | null>(null);

  const handleComparisonStart = () => {
    setIsRunning(true);
    setCurrentComparison(null);
    setProgress(null);
  };

  const handleComparisonComplete = (comparison: PromptComparison) => {
    setCurrentComparison(comparison);
    setIsRunning(false);
    setProgress(null);
  };

  const handleProgressUpdate = (progress: ComparisonProgress) => {
    setProgress(progress);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Prompt Comparison Tool
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            A/B test different prompt configurations to optimize RAG performance
          </p>
        </div>

        <div className="space-y-8">
          {/* Comparison Runner */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Prompt Comparison Configuration
            </h2>
            <ComparisonRunner
              onComparisonStart={handleComparisonStart}
              onComparisonComplete={handleComparisonComplete}
              onProgressUpdate={handleProgressUpdate}
              isRunning={isRunning}
              progress={progress}
            />
          </div>

          {/* Results */}
          {currentComparison && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Comparison Results
              </h2>
              <ComparisonResults comparison={currentComparison} />
            </div>
          )}

          {/* Help Text */}
          {!currentComparison && !isRunning && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-medium text-blue-900 mb-3">
                How Prompt Comparison Works
              </h3>
              <div className="text-sm text-blue-800 space-y-2">
                <p>
                  <strong>1. Configure Prompts:</strong> Set up two different prompt configurations to test against each other.
                </p>
                <p>
                  <strong>2. Run Comparison:</strong> The system will execute your test query using both prompts simultaneously.
                </p>
                <p>
                  <strong>3. Analyze Results:</strong> Compare quality scores, response times, document usage, and statistical significance.
                </p>
                <p>
                  <strong>4. Determine Winner:</strong> The system automatically determines which prompt performs better based on your criteria.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}