'use client';

import { useState } from 'react';
import { TestRun, TestQuery } from '../../lib/types/testing.types';
import { TestRunnerService } from '../../lib/services/test-runner.service';
import { exampleQueries } from '../../lib/example-queries';

interface TestRunnerProps {
  onTestStart: () => void;
  onTestComplete: (testRun: TestRun) => void;
  isRunning: boolean;
}

export default function TestRunner({ onTestStart, onTestComplete, isRunning }: TestRunnerProps) {
  const [queries, setQueries] = useState<TestQuery[]>(exampleQueries);
  const [courseId, setCourseId] = useState('1276af89-24ca-4a5a-8f9d-e25c7f28b59a');
  const [iterationsPerQuery, setIterationsPerQuery] = useState(5);
  const [assistantApiUrl, setAssistantApiUrl] = useState('http://localhost:3001');
  const [enableEvaluation, setEnableEvaluation] = useState(false);
  const [progress, setProgress] = useState({ completed: 0, total: 0 });
  const [evaluationProgress, setEvaluationProgress] = useState({ completed: 0, total: 0 });

  const handleQueryChange = (id: string, field: keyof TestQuery, value: string | boolean) => {
    setQueries(queries.map(q => q.id === id ? { ...q, [field]: value } : q));
  };

  const handleRunTest = async () => {
    try {
      onTestStart();
      const activeQueries = queries.filter(q => q.enabled);
      const totalIterations = activeQueries.length * iterationsPerQuery;
      setProgress({ completed: 0, total: totalIterations });

      const testRunner = new TestRunnerService(assistantApiUrl);
      const testRun = await testRunner.createTestRun(
        'Multiple Queries Test',
        courseId,
        '', // Not applicable for multi-query runs
        totalIterations
      );

      let completedIterations = 0;
      for (const query of activeQueries) {
        for (let i = 0; i < iterationsPerQuery; i++) {
          const response = await testRunner.executeQuery(
            query.query,
            courseId,
            `${testRun.id}-${query.id}-${i}`
          );
          response.usedExpectedDocument = response.linkedDocumentIds.includes(query.expectedDocumentId);
          testRun.responses.push(response);
          completedIterations++;
          setProgress({ completed: completedIterations, total: totalIterations });
        }
      }

      if (enableEvaluation) {
        // Simplified evaluation progress for multi-query
        const successfulResponses = testRun.responses.filter(r => !r.error);
        setEvaluationProgress({ completed: 0, total: successfulResponses.length });
        await testRunner.evaluateResponses(testRun, (completed, total) => {
          setEvaluationProgress({ completed, total });
        });
      }
      
      testRun.summary = testRunner.calculateSummary(testRun);
      onTestComplete(testRun);
    } catch (error) {
      console.error('Test execution failed:', error);
      alert(`Test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const enabledQueriesCount = queries.filter(q => q.enabled).length;

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Test Queries ({enabledQueriesCount} selected)
        </label>
        <div className="mt-1 space-y-2 max-h-60 overflow-y-auto border rounded-md p-2">
          {queries.map((q) => (
            <div key={q.id} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={q.enabled}
                onChange={(e) => handleQueryChange(q.id, 'enabled', e.target.checked)}
                disabled={isRunning}
              />
              <input
                type="text"
                value={q.query}
                onChange={(e) => handleQueryChange(q.id, 'query', e.target.value)}
                className="flex-grow rounded-md border-gray-300 shadow-sm sm:text-sm border p-1"
                disabled={isRunning}
              />
              <input
                type="text"
                value={q.expectedDocumentId}
                onChange={(e) => handleQueryChange(q.id, 'expectedDocumentId', e.target.value)}
                className="w-1/4 rounded-md border-gray-300 shadow-sm sm:text-sm border p-1 text-gray-900"
                placeholder="Expected Doc ID"
                disabled={isRunning}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="iterationsPerQuery" className="block text-sm font-medium text-gray-700">
            Iterations per Query
          </label>
          <input
            type="number"
            id="iterationsPerQuery"
            value={iterationsPerQuery}
            onChange={(e) => setIterationsPerQuery(parseInt(e.target.value) || 1)}
            min="1"
            max="50"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2 text-gray-900"
            disabled={isRunning}
          />
        </div>
        <div>
          <label htmlFor="assistantApiUrl" className="block text-sm font-medium text-gray-700">
            Assistant API URL
          </label>
          <input
            type="url"
            id="assistantApiUrl"
            value={assistantApiUrl}
            onChange={(e) => setAssistantApiUrl(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2 text-gray-900"
            disabled={isRunning}
          />
        </div>
      </div>

      {/* Quality Evaluation Section */}
      <div className="border-t pt-4">
        <div className="flex items-center space-x-2 mb-4">
          <input
            type="checkbox"
            id="enableEvaluation"
            checked={enableEvaluation}
            onChange={(e) => setEnableEvaluation(e.target.checked)}
            className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            disabled={isRunning}
          />
          <label htmlFor="enableEvaluation" className="text-sm font-medium text-gray-700">
            Enable Response Quality Evaluation
          </label>
        </div>
      </div>

      {isRunning && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4 space-y-3">
          {/* Test Progress */}
          <div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-blue-900">
                Running test... ({progress.completed}/{progress.total})
              </span>
              <span className="text-sm text-blue-700">
                {progress.total > 0 ? Math.round((progress.completed / progress.total) * 100) : 0}%
              </span>
            </div>
            <div className="mt-2 w-full bg-blue-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: progress.total > 0 
                    ? `${(progress.completed / progress.total) * 100}%` 
                    : '0%' 
                }}
              />
            </div>
          </div>

          {/* Evaluation Progress */}
          {enableEvaluation && evaluationProgress.total > 0 && (
            <div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-purple-900">
                  Evaluating responses... ({evaluationProgress.completed}/{evaluationProgress.total})
                </span>
                <span className="text-sm text-purple-700">
                  {evaluationProgress.total > 0 ? Math.round((evaluationProgress.completed / evaluationProgress.total) * 100) : 0}%
                </span>
              </div>
              <div className="mt-2 w-full bg-purple-200 rounded-full h-2">
                <div 
                  className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: evaluationProgress.total > 0 
                      ? `${(evaluationProgress.completed / evaluationProgress.total) * 100}%` 
                      : '0%' 
                  }}
                />
              </div>
            </div>
          )}
        </div>
      )}

      <button
        onClick={handleRunTest}
        disabled={isRunning || enabledQueriesCount === 0}
        className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
          isRunning || enabledQueriesCount === 0
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
        }`}
      >
        {isRunning ? 'Running Test...' : `Run Test on ${enabledQueriesCount} Queries`}
      </button>
    </div>
  );
}
