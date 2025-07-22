'use client';

import { useState } from 'react';
import { TestRun } from '../lib/types/testing.types';
import { TestRunnerService } from '../lib/services/test-runner.service';
import TestRunner from '../components/test-runner/test-runner';
import ResultsDashboard from '../components/results-dashboard/results-dashboard';

export default function Home() {
  const [currentTestRun, setCurrentTestRun] = useState<TestRun | null>(null);
  const [testResults, setTestResults] = useState<any>(null);
  const [isRunning, setIsRunning] = useState(false);

  const handleTestComplete = (testRun: TestRun) => {
    const testRunner = new TestRunnerService();
    const results = testRunner.getTestResults(testRun);
    setTestResults(results);
    setCurrentTestRun(testRun);
    setIsRunning(false);
  };

  const handleTestStart = () => {
    setIsRunning(true);
    setTestResults(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            StudySpot RAG Development Panel
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Test RAG workflows and evaluate prompt engineering experiments
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Test Runner Panel */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Test Configuration
            </h2>
            <TestRunner
              onTestStart={handleTestStart}
              onTestComplete={handleTestComplete}
              isRunning={isRunning}
            />
          </div>

          {/* Results Panel */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Test Results
            </h2>
            {testResults ? (
              <ResultsDashboard results={testResults} />
            ) : (
              <div className="text-center py-12 text-gray-500">
                Run a test to see results here
              </div>
            )}
          </div>
        </div>

        {/* Detailed Results */}
        {testResults && (
          <div className="mt-8 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Individual Response Details
            </h2>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {testResults.responses.map((response: any, index: number) => (
                <div 
                  key={response.responseId} 
                  className="border rounded-lg p-4 bg-gray-50"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-gray-900">
                      Response {index + 1}
                    </h3>
                    <div className="flex space-x-2 text-sm">
                      <span className={`px-2 py-1 rounded ${
                        response.usedExpectedDocument 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {response.usedExpectedDocument ? 'Used Target Doc' : 'No Target Doc'}
                      </span>
                      {response.qualityScore && (
                        <span className={`px-2 py-1 rounded ${
                          response.qualityScore >= 8 
                            ? 'bg-green-100 text-green-800' 
                            : response.qualityScore >= 6 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          Quality: {response.qualityScore.toFixed(1)}/10
                        </span>
                      )}
                      <span className="text-gray-500">
                        {response.responseTime}ms
                      </span>
                    </div>
                  </div>
                  
                  {response.error ? (
                    <div className="text-red-600 text-sm">
                      Error: {response.error}
                    </div>
                  ) : (
                    <>
                      <div className="text-sm text-gray-600 mb-2">
                        Documents: {response.linkedDocumentIds.length} | 
                        Chunks: {response.streamingChunks}
                      </div>
                      <div className="text-sm text-gray-800 line-clamp-3">
                        {response.content.substring(0, 200)}...
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}