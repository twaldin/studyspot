// Configuration types for JSON config file management

export interface PromptConfig {
  name: string;
  systemPrompt: string;
  ragDecisionPrompt: string;
  queryReformulationPrompt: string;
  toolInstructions: string;
  temperature: number;
  model: string;
}

export interface TestQuery {
  id: string;
  query: string;
  expectedDocumentId: string;
  enabled: boolean;
}

export interface TestQueriesConfig {
  name: string;
  queries: TestQuery[];
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