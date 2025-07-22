'use client';

import { useState, useEffect } from 'react';
import { PromptConfig, TestQueriesConfig, TestQuery } from '../../lib/types/config.types';

// Runtime version of TestQueriesConfig with enabled fields
interface RuntimeTestQueriesConfig {
  name: string;
  queries: TestQuery[];
  defaultCourseId: string;
  defaultIterations: number;
}

interface ConfigManagerProps {
  onConfigsChange?: () => void;
}

export default function ConfigManager({ onConfigsChange }: ConfigManagerProps) {
  const [activeTab, setActiveTab] = useState<'prompts' | 'queries'>('prompts');
  const [promptConfigs, setPromptConfigs] = useState<string[]>([]);
  const [queriesConfigs, setQueriesConfigs] = useState<string[]>([]);
  const [selectedPromptConfig, setSelectedPromptConfig] = useState<string>('active.json');
  const [selectedQueriesConfig, setSelectedQueriesConfig] = useState<string>('queries.json');
  const [currentPromptConfig, setCurrentPromptConfig] = useState<PromptConfig | null>(null);
  const [currentQueriesConfig, setCurrentQueriesConfig] = useState<RuntimeTestQueriesConfig | null>(null);
  const [saveFilename, setSaveFilename] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    loadConfigLists();
  }, []);

  useEffect(() => {
    if (selectedPromptConfig) {
      loadPromptConfig(selectedPromptConfig);
    }
  }, [selectedPromptConfig]);

  useEffect(() => {
    if (selectedQueriesConfig) {
      loadQueriesConfig(selectedQueriesConfig);
    }
  }, [selectedQueriesConfig]);

  const loadConfigLists = async () => {
    try {
      const [promptsRes, queriesRes] = await Promise.all([
        fetch('/api/configs/prompts'),
        fetch('/api/configs/queries')
      ]);
      
      const promptsData = await promptsRes.json();
      const queriesData = await queriesRes.json();
      
      setPromptConfigs(promptsData.configs || []);
      setQueriesConfigs(queriesData.configs || []);
    } catch (error) {
      console.error('Error loading config lists:', error);
      setMessage('Error loading config lists');
    }
  };

  const loadPromptConfig = async (filename: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/configs/prompts?filename=${filename}`);
      const config = await response.json();
      
      if (response.ok) {
        setCurrentPromptConfig(config);
        setMessage('');
      } else {
        setMessage(`Error loading ${filename}: ${config.error}`);
      }
    } catch (error) {
      console.error('Error loading prompt config:', error);
      setMessage('Error loading prompt config');
    } finally {
      setLoading(false);
    }
  };

  const loadQueriesConfig = async (filename: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/configs/queries?filename=${filename}`);
      const config = await response.json();
      
      if (response.ok) {
        // Add enabled: false to all queries when loading from file
        const configWithEnabled = {
          ...config,
          queries: config.queries.map((q: any) => ({
            ...q,
            enabled: false
          }))
        };
        setCurrentQueriesConfig(configWithEnabled);
        setMessage('');
      } else {
        setMessage(`Error loading ${filename}: ${config.error}`);
      }
    } catch (error) {
      console.error('Error loading queries config:', error);
      setMessage('Error loading queries config');
    } finally {
      setLoading(false);
    }
  };

  const saveCurrentConfig = async () => {
    if (!saveFilename) {
      setMessage('Please enter a filename');
      return;
    }

    const filename = saveFilename.endsWith('.json') ? saveFilename : `${saveFilename}.json`;
    
    try {
      setLoading(true);
      let config;
      
      if (activeTab === 'prompts') {
        config = currentPromptConfig;
      } else {
        // For queries, strip the 'enabled' field from all queries before saving
        config = {
          ...currentQueriesConfig,
          queries: currentQueriesConfig?.queries?.map(({ enabled, ...query }) => query) || []
        };
      }
      const endpoint = activeTab === 'prompts' ? '/api/configs/prompts' : '/api/configs/queries';
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filename,
          config
        })
      });

      const result = await response.json();
      
      if (response.ok) {
        setMessage(`Config saved as ${filename}`);
        setSaveFilename('');
        await loadConfigLists(); // Refresh the lists
        onConfigsChange?.();
      } else {
        setMessage(`Error saving: ${result.error}`);
      }
    } catch (error) {
      console.error('Error saving config:', error);
      setMessage('Error saving config');
    } finally {
      setLoading(false);
    }
  };

  const updatePromptField = (field: keyof PromptConfig, value: string | number) => {
    if (currentPromptConfig) {
      setCurrentPromptConfig({
        ...currentPromptConfig,
        [field]: value
      });
    }
  };

  const updateQueriesField = (field: keyof RuntimeTestQueriesConfig, value: any) => {
    if (currentQueriesConfig) {
      setCurrentQueriesConfig({
        ...currentQueriesConfig,
        [field]: value
      });
    }
  };

  const addQuery = () => {
    if (currentQueriesConfig) {
      const newQuery = {
        id: `query-${Date.now()}`,
        query: '',
        expectedDocumentId: 'c33ddcf0-e673-4e75-9250-14ea6b0eec45'
      };
      
      updateQueriesField('queries', [...currentQueriesConfig.queries, newQuery]);
    }
  };

  const updateQuery = (index: number, field: string, value: any) => {
    if (currentQueriesConfig) {
      const updatedQueries = [...currentQueriesConfig.queries];
      updatedQueries[index] = { ...updatedQueries[index], [field]: value };
      updateQueriesField('queries', updatedQueries);
    }
  };

  const removeQuery = (index: number) => {
    if (currentQueriesConfig) {
      const updatedQueries = currentQueriesConfig.queries.filter((_, i) => i !== index);
      updateQueriesField('queries', updatedQueries);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Configuration Manager</h2>
        
        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('prompts')}
              className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'prompts'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Prompt Configs
            </button>
            <button
              onClick={() => setActiveTab('queries')}
              className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'queries'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Test Queries
            </button>
          </nav>
        </div>
      </div>

      {/* Config Selection */}
      <div className="mb-6">
        <div className="flex items-center space-x-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Select Config
            </label>
            <select
              value={activeTab === 'prompts' ? selectedPromptConfig : selectedQueriesConfig}
              onChange={(e) => {
                if (activeTab === 'prompts') {
                  setSelectedPromptConfig(e.target.value);
                } else {
                  setSelectedQueriesConfig(e.target.value);
                }
              }}
              className="mt-1 block rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-900"
            >
              {(activeTab === 'prompts' ? promptConfigs : queriesConfigs).map((config) => (
                <option key={config} value={config}>
                  {config}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Save As
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={saveFilename}
                onChange={(e) => setSaveFilename(e.target.value)}
                placeholder="my-config.json"
                className="mt-1 block rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-900"
              />
              <button
                onClick={saveCurrentConfig}
                disabled={loading || !saveFilename}
                className="mt-1 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-gray-400"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Status Message */}
      {message && (
        <div className={`mb-4 p-3 rounded-md ${
          message.includes('Error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
        }`}>
          {message}
        </div>
      )}

      {/* Config Editor */}
      {loading ? (
        <div className="text-center py-8">
          <div className="text-gray-500">Loading...</div>
        </div>
      ) : activeTab === 'prompts' && currentPromptConfig ? (
        <PromptConfigEditor config={currentPromptConfig} onUpdate={updatePromptField} />
      ) : activeTab === 'queries' && currentQueriesConfig ? (
        <QueriesConfigEditor 
          config={currentQueriesConfig} 
          onUpdate={updateQueriesField}
          onAddQuery={addQuery}
          onUpdateQuery={updateQuery}
          onRemoveQuery={removeQuery}
        />
      ) : null}
    </div>
  );
}

// Prompt Config Editor Component
function PromptConfigEditor({ 
  config, 
  onUpdate 
}: { 
  config: PromptConfig; 
  onUpdate: (field: keyof PromptConfig, value: string | number) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          value={config.name}
          onChange={(e) => onUpdate('name', e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-900"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">System Prompt</label>
        <textarea
          value={config.systemPrompt}
          onChange={(e) => onUpdate('systemPrompt', e.target.value)}
          rows={8}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-900"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">RAG Decision Prompt</label>
        <textarea
          value={config.ragDecisionPrompt}
          onChange={(e) => onUpdate('ragDecisionPrompt', e.target.value)}
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-900"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Query Reformulation Prompt</label>
        <textarea
          value={config.queryReformulationPrompt}
          onChange={(e) => onUpdate('queryReformulationPrompt', e.target.value)}
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-900"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Tool Instructions</label>
        <textarea
          value={config.toolInstructions}
          onChange={(e) => onUpdate('toolInstructions', e.target.value)}
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-900"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Temperature</label>
          <input
            type="number"
            step="0.1"
            min="0"
            max="2"
            value={config.temperature}
            onChange={(e) => onUpdate('temperature', parseFloat(e.target.value))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-900"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Model</label>
          <input
            type="text"
            value={config.model}
            onChange={(e) => onUpdate('model', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-900"
          />
        </div>
      </div>
    </div>
  );
}

// Queries Config Editor Component
function QueriesConfigEditor({ 
  config, 
  onUpdate,
  onAddQuery,
  onUpdateQuery,
  onRemoveQuery
}: { 
  config: TestQueriesConfig; 
  onUpdate: (field: keyof TestQueriesConfig, value: any) => void;
  onAddQuery: () => void;
  onUpdateQuery: (index: number, field: string, value: any) => void;
  onRemoveQuery: (index: number) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          value={config.name}
          onChange={(e) => onUpdate('name', e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-900"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Default Course ID</label>
          <input
            type="text"
            value={config.defaultCourseId}
            onChange={(e) => onUpdate('defaultCourseId', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-900"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Default Iterations</label>
          <input
            type="number"
            min="1"
            value={config.defaultIterations}
            onChange={(e) => onUpdate('defaultIterations', parseInt(e.target.value))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-900"
          />
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <label className="block text-sm font-medium text-gray-700">Test Queries</label>
          <button
            onClick={onAddQuery}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Add Query
          </button>
        </div>
        
        <div className="space-y-4">
          {config.queries.map((query, index) => (
            <div key={query.id} className="border rounded-lg p-4 bg-gray-50">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1 space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">ID</label>
                    <input
                      type="text"
                      value={query.id}
                      onChange={(e) => onUpdateQuery(index, 'id', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-900"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Query</label>
                    <textarea
                      value={query.query}
                      onChange={(e) => onUpdateQuery(index, 'query', e.target.value)}
                      rows={2}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Expected Document ID</label>
                    <input
                      type="text"
                      value={query.expectedDocumentId}
                      onChange={(e) => onUpdateQuery(index, 'expectedDocumentId', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-gray-900"
                    />
                  </div>

                </div>
                
                <button
                  onClick={() => onRemoveQuery(index)}
                  className="ml-4 px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}