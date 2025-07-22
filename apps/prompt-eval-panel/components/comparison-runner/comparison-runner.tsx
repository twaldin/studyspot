'use client';

import { useState } from 'react';
import { PromptComparison, ComparisonProgress } from '../../lib/types/comparison.types';
import { PromptConfig, DEFAULT_PROMPT_CONFIG } from '../../lib/types/prompt-config.types';
import { ComparisonRunnerService } from '../../lib/services/comparison-runner.service';
import { TestQuery } from '../../lib/types/testing.types';
import { exampleQueries } from '../../lib/example-queries';

interface ComparisonRunnerProps {
  onComparisonStart: () => void;
  onComparisonComplete: (comparison: PromptComparison) => void;
  onProgressUpdate: (progress: ComparisonProgress) => void;
  isRunning: boolean;
  progress: ComparisonProgress | null;
}

export default function ComparisonRunner({
  onComparisonStart,
  onComparisonComplete,
  onProgressUpdate,
  isRunning,
  progress
}: ComparisonRunnerProps) {
  const [queries, setQueries] = useState<TestQuery[]>(exampleQueries);
  const [courseId, setCourseId] = useState('1276af89-24ca-4a5a-8f9d-e25c7f28b59a');
  const [iterationsPerQuery, setIterationsPerQuery] = useState(5);
  const [assistantApiUrl, setAssistantApiUrl] = useState('http://localhost:3001');
  const [expandedPrompts, setExpandedPrompts] = useState({ A: false, B: false });

  // Prompt A Configuration (Current Default)
  const [promptA, setPromptA] = useState<PromptConfig>({
    ...DEFAULT_PROMPT_CONFIG,
    id: 'prompt-a',
    name: 'Current Default',
    createdAt: new Date(),
    updatedAt: new Date()
  });

  // Prompt B Configuration (Modified)
  const [promptB, setPromptB] = useState<PromptConfig>({
    ...DEFAULT_PROMPT_CONFIG,
    id: 'prompt-b',
    name: 'Anthropic Docs Version',
    description: 'Modified prompt based on Anthropic prompting documentation',
    createdAt: new Date(),
    updatedAt: new Date(),
    systemPrompt: `You are an expert academic assistant. Your role is to provide accurate, comprehensive, and well-structured answers to a college student's questions about their course materials.

<instructions>
- Base your answers on the provided context and conversation history.
- Use the 'get_full_document' tool if the provided context is insufficient.
- Respond in natural language using markdown for formatting.
- Do not mention "Doc ID" as it is for internal use only.
- Format all mathematical expressions using LaTeX.
</instructions>

<course_details>
{courseDetails}
</course_details>

<date>
{currentDate}
</date>`,
    personality: {
      tone: 'academic',
      verbosity: 'balanced',
      formality: 'formal'
    }
  });

  const handleQueryChange = (id: string, field: keyof TestQuery, value: string | boolean) => {
    setQueries(queries.map(q => q.id === id ? { ...q, [field]: value } : q));
  };

  const handleRunComparison = async () => {
    try {
      onComparisonStart();
      const activeQueries = queries.filter(q => q.enabled);
      const comparisonRunner = new ComparisonRunnerService(assistantApiUrl);
      
      const comparison = await comparisonRunner.createComparison(
        activeQueries,
        courseId,
        promptA,
        promptB,
        iterationsPerQuery
      );

      const completedComparison = await comparisonRunner.executeComparison(
        comparison,
        onProgressUpdate
      );

      onComparisonComplete(completedComparison);
    } catch (error) {
      console.error('Comparison execution failed:', error);
      alert(`Comparison failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };
  
  const enabledQueriesCount = queries.filter(q => q.enabled).length;

  return (
    <div className="space-y-6">
      {/* Test Configuration */}
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
                className="flex-grow rounded-md border-gray-300 shadow-sm sm:text-sm border p-1 text-gray-900"
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
            max="20"
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

      {/* Prompt Configuration Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Prompt A */}
        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-medium text-gray-900">Prompt A: {promptA.name}</h3>
            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">Current</span>
          </div>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">System Prompt Preview</label>
              <div className={`mt-1 p-2 bg-gray-50 rounded text-xs text-gray-600 ${expandedPrompts.A ? '' : 'max-h-20 overflow-y-auto'}`}>
                <pre className="whitespace-pre-wrap">{promptA.systemPrompt}</pre>
              </div>
              <button onClick={() => setExpandedPrompts(p => ({...p, A: !p.A}))} className="text-xs text-blue-600 mt-1">
                {expandedPrompts.A ? 'Collapse' : 'Expand'}
              </button>
            </div>
          </div>
        </div>

        {/* Prompt B */}
        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-medium text-gray-900">Prompt B: {promptB.name}</h3>
            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Modified</span>
          </div>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">System Prompt Preview</label>
              <div className={`mt-1 p-2 bg-gray-50 rounded text-xs text-gray-600 ${expandedPrompts.B ? '' : 'max-h-20 overflow-y-auto'}`}>
                <pre className="whitespace-pre-wrap">{promptB.systemPrompt}</pre>
              </div>
              <button onClick={() => setExpandedPrompts(p => ({...p, B: !p.B}))} className="text-xs text-blue-600 mt-1">
                {expandedPrompts.B ? 'Collapse' : 'Expand'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Display */}
      {isRunning && progress && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-blue-900">
                {progress.currentStep}
              </span>
              <span className="text-sm text-blue-700 capitalize">
                {progress.phase.replace('_', ' ')}
              </span>
            </div>
            
            {/* Detailed Progress */}
            {progress.detailedProgress && (
              <div className="bg-white rounded-md p-3 border">
                <div className="text-xs text-gray-600 mb-2">
                  <strong>Current Query:</strong> {progress.detailedProgress.currentQuery}
                </div>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-gray-500">Query Progress:</span>
                    <div className="flex items-center space-x-2 mt-1">
                      <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                        <div 
                          className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                          style={{ 
                            width: `${(progress.detailedProgress.queryIndex / progress.detailedProgress.queryTotal) * 100}%` 
                          }}
                        />
                      </div>
                      <span className="text-gray-600 text-xs">
                        {progress.detailedProgress.queryIndex}/{progress.detailedProgress.queryTotal}
                      </span>
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500">Iteration Progress:</span>
                    <div className="flex items-center space-x-2 mt-1">
                      <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                        <div 
                          className="bg-green-500 h-1.5 rounded-full transition-all duration-300"
                          style={{ 
                            width: `${(progress.detailedProgress.iteration / progress.detailedProgress.iterationTotal) * 100}%` 
                          }}
                        />
                      </div>
                      <span className="text-gray-600 text-xs">
                        {progress.detailedProgress.iteration}/{progress.detailedProgress.iterationTotal}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Overall Progress Bars */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-blue-700">Prompt A</span>
                  <span className="text-xs text-blue-600">
                    {progress.promptAProgress.completed}/{progress.promptAProgress.total}
                  </span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: progress.promptAProgress.total > 0 
                        ? `${(progress.promptAProgress.completed / progress.promptAProgress.total) * 100}%` 
                        : '0%' 
                    }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-blue-700">Prompt B</span>
                  <span className="text-xs text-blue-600">
                    {progress.promptBProgress.completed}/{progress.promptBProgress.total}
                  </span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: progress.promptBProgress.total > 0 
                        ? `${(progress.promptBProgress.completed / progress.promptBProgress.total) * 100}%` 
                        : '0%' 
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Run Button */}
      <button
        onClick={handleRunComparison}
        disabled={isRunning || enabledQueriesCount === 0}
        className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
          isRunning || enabledQueriesCount === 0
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
        }`}
      >
        {isRunning ? 'Running Comparison...' : `Run Comparison on ${enabledQueriesCount} Queries`}
      </button>
    </div>
  );
}