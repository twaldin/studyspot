'use client';

import ConfigManager from '../../components/config-manager/config-manager';

export default function ConfigPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Configuration Management
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Manage prompt configurations and test queries for RAG system evaluation
          </p>
        </div>

        <ConfigManager />

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-blue-900 mb-3">
            How Configuration Management Works
          </h3>
          <div className="text-sm text-blue-800 space-y-2">
            <p>
              <strong>Active Files:</strong> The system reads from fixed filenames:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li><code>config/prompt-configs/active.json</code> - Current default prompt (Prompt A)</li>
              <li><code>config/prompt-configs/test.json</code> - Test prompt variation (Prompt B)</li>
              <li><code>config/test-queries/queries.json</code> - Active test queries</li>
            </ul>
            <p className="mt-3">
              <strong>Workflow:</strong>
            </p>
            <ol className="list-decimal pl-5 space-y-1">
              <li>Edit configurations using the interface above</li>
              <li>Save variations with custom names (e.g., "my-optimized-prompt.json")</li>
              <li>Rename files manually to make them active (e.g., rename to "active.json")</li>
              <li>Run tests to compare different configurations</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}