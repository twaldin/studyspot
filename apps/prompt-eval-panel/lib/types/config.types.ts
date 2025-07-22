// Configuration types for JSON config file management
import { PromptConfig as ComplexPromptConfig } from './prompt-config.types';

export interface PromptConfig {
  name: string;
  systemPrompt: string;
  ragDecisionPrompt: string;
  queryReformulationPrompt: string;
  toolInstructions: string;
  temperature: number;
  model: string;
}

// Conversion function from simple config to complex config
export function convertToComplexPromptConfig(simpleConfig: PromptConfig): ComplexPromptConfig {
  return {
    id: `config-${Date.now()}`,
    name: simpleConfig.name,
    description: `Loaded from config: ${simpleConfig.name}`,
    version: '1.0.0',
    createdAt: new Date(),
    updatedAt: new Date(),
    systemPrompt: simpleConfig.systemPrompt,
    ragDecisionPrompt: simpleConfig.ragDecisionPrompt,
    queryReformulationPrompt: simpleConfig.queryReformulationPrompt,
    toolDescription: simpleConfig.toolInstructions,
    contextFormatting: {
      useHeaders: true,
      headerText: '\n\n--- Relevant Context from Documents Start ---',
      footerText: '\n--- Relevant Context from Documents End ---',
      includeDocumentIds: true,
      documentSeparator: '\n---\n'
    },
    responseFormat: {
      requireJSON: false,
      includeLinkedDocumentIds: true,
      encourageConciseness: true,
      maxResponseLength: undefined
    },
    mathFormatting: 'latex' as const,
    personality: {
      tone: 'helpful' as const,
      verbosity: 'concise' as const,
      formality: 'neutral' as const
    }
  };
}

// Config file structure (no enabled field)
export interface TestQueryConfig {
  id: string;
  query: string;
  expectedDocumentId: string;
}

// Runtime structure (with enabled field added by UI)
export interface TestQuery extends TestQueryConfig {
  enabled: boolean;
}

export interface TestQueriesConfig {
  name: string;
  queries: TestQueryConfig[];
  defaultCourseId: string;
  defaultIterations: number;
}

// Schema validation types
export interface ConfigValidationResult {
  isValid: boolean;
  errors: string[];
}

// API response types
export interface ConfigListResponse {
  configs: string[];
}

export interface ConfigSaveRequest {
  filename: string;
  config: PromptConfig | TestQueriesConfig;
}

// File operation types
export type ConfigType = 'prompts' | 'queries';

export interface ConfigFile {
  filename: string;
  path: string;
  type: ConfigType;
}

// Active config identifiers (fixed filenames that the system reads)
export const ACTIVE_CONFIG_FILES = {
  ACTIVE_PROMPT: 'active.json',
  TEST_PROMPT: 'test.json', 
  QUERIES: 'queries.json'
} as const;

// Config directories relative to project root
export const CONFIG_PATHS = {
  PROMPTS: 'config/prompt-configs',
  QUERIES: 'config/test-queries'
} as const;