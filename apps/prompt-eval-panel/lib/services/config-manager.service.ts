import path from 'path';
import fs from 'fs/promises';
import { PromptConfig, TestQueriesConfig, ConfigType, ConfigValidationResult, ACTIVE_CONFIG_FILES, CONFIG_PATHS } from '../types/config.types';

export class ConfigManagerService {
  private getConfigPath(type: ConfigType): string {
    // From apps/prompt-eval-panel, go up 2 levels to project root
    const basePath = path.join(process.cwd(), '..', '..');
    return type === 'prompts' 
      ? path.join(basePath, CONFIG_PATHS.PROMPTS)
      : path.join(basePath, CONFIG_PATHS.QUERIES);
  }

  private getFullPath(type: ConfigType, filename: string): string {
    return path.join(this.getConfigPath(type), filename);
  }

  // Load active configs (the fixed filenames that the system uses)
  async loadActivePromptConfig(): Promise<PromptConfig> {
    return this.loadPromptConfig(ACTIVE_CONFIG_FILES.ACTIVE_PROMPT);
  }

  async loadTestPromptConfig(): Promise<PromptConfig> {
    return this.loadPromptConfig(ACTIVE_CONFIG_FILES.TEST_PROMPT);
  }

  async loadActiveQueriesConfig(): Promise<TestQueriesConfig> {
    return this.loadQueriesConfig(ACTIVE_CONFIG_FILES.QUERIES);
  }

  // Generic load methods
  async loadPromptConfig(filename: string): Promise<PromptConfig> {
    const filePath = this.getFullPath('prompts', filename);
    const content = await fs.readFile(filePath, 'utf-8');
    const config = JSON.parse(content) as PromptConfig;
    this.validatePromptConfig(config);
    return config;
  }

  async loadQueriesConfig(filename: string): Promise<TestQueriesConfig> {
    const filePath = this.getFullPath('queries', filename);
    const content = await fs.readFile(filePath, 'utf-8');
    const config = JSON.parse(content) as TestQueriesConfig;
    this.validateQueriesConfig(config);
    return config;
  }

  // Save configs with user-defined filenames
  async savePromptConfig(filename: string, config: PromptConfig): Promise<void> {
    const validation = this.validatePromptConfig(config);
    if (!validation.isValid) {
      throw new Error(`Config validation failed: ${validation.errors.join(', ')}`);
    }

    const filePath = this.getFullPath('prompts', filename);
    await fs.writeFile(filePath, JSON.stringify(config, null, 2), 'utf-8');
  }

  async saveQueriesConfig(filename: string, config: TestQueriesConfig): Promise<void> {
    const validation = this.validateQueriesConfig(config);
    if (!validation.isValid) {
      throw new Error(`Config validation failed: ${validation.errors.join(', ')}`);
    }

    const filePath = this.getFullPath('queries', filename);
    await fs.writeFile(filePath, JSON.stringify(config, null, 2), 'utf-8');
  }

  // List available config files
  async listPromptConfigs(): Promise<string[]> {
    try {
      const configPath = this.getConfigPath('prompts');
      const files = await fs.readdir(configPath);
      return files.filter(file => file.endsWith('.json'));
    } catch (error) {
      console.error('Error listing prompt configs:', error);
      return [];
    }
  }

  async listQueriesConfigs(): Promise<string[]> {
    try {
      const configPath = this.getConfigPath('queries');
      const files = await fs.readdir(configPath);
      return files.filter(file => file.endsWith('.json'));
    } catch (error) {
      console.error('Error listing queries configs:', error);
      return [];
    }
  }

  // Delete config files (but protect active configs)
  async deletePromptConfig(filename: string): Promise<void> {
    if (filename === ACTIVE_CONFIG_FILES.ACTIVE_PROMPT || filename === ACTIVE_CONFIG_FILES.TEST_PROMPT) {
      throw new Error('Cannot delete active or test prompt configs');
    }

    const filePath = this.getFullPath('prompts', filename);
    await fs.unlink(filePath);
  }

  async deleteQueriesConfig(filename: string): Promise<void> {
    if (filename === ACTIVE_CONFIG_FILES.QUERIES) {
      throw new Error('Cannot delete active queries config');
    }

    const filePath = this.getFullPath('queries', filename);
    await fs.unlink(filePath);
  }

  // Validation methods
  private validatePromptConfig(config: PromptConfig): ConfigValidationResult {
    const errors: string[] = [];

    if (!config.name || typeof config.name !== 'string') {
      errors.push('name is required and must be a string');
    }

    if (!config.systemPrompt || typeof config.systemPrompt !== 'string') {
      errors.push('systemPrompt is required and must be a string');
    }

    if (!config.ragDecisionPrompt || typeof config.ragDecisionPrompt !== 'string') {
      errors.push('ragDecisionPrompt is required and must be a string');
    }

    if (!config.queryReformulationPrompt || typeof config.queryReformulationPrompt !== 'string') {
      errors.push('queryReformulationPrompt is required and must be a string');
    }

    if (!config.toolInstructions || typeof config.toolInstructions !== 'string') {
      errors.push('toolInstructions is required and must be a string');
    }

    if (typeof config.temperature !== 'number' || config.temperature < 0 || config.temperature > 2) {
      errors.push('temperature must be a number between 0 and 2');
    }

    if (!config.model || typeof config.model !== 'string') {
      errors.push('model is required and must be a string');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  private validateQueriesConfig(config: TestQueriesConfig): ConfigValidationResult {
    const errors: string[] = [];

    if (!config.name || typeof config.name !== 'string') {
      errors.push('name is required and must be a string');
    }

    if (!Array.isArray(config.queries)) {
      errors.push('queries must be an array');
    } else {
      config.queries.forEach((query, index) => {
        if (!query.id || typeof query.id !== 'string') {
          errors.push(`Query ${index}: id is required and must be a string`);
        }
        if (!query.query || typeof query.query !== 'string') {
          errors.push(`Query ${index}: query is required and must be a string`);
        }
        if (!query.expectedDocumentId || typeof query.expectedDocumentId !== 'string') {
          errors.push(`Query ${index}: expectedDocumentId is required and must be a string`);
        }
      });
    }

    if (!config.defaultCourseId || typeof config.defaultCourseId !== 'string') {
      errors.push('defaultCourseId is required and must be a string');
    }

    if (typeof config.defaultIterations !== 'number' || config.defaultIterations < 1) {
      errors.push('defaultIterations must be a number greater than 0');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Copy config to a new filename (for duplicating)
  async duplicatePromptConfig(sourceFilename: string, targetFilename: string): Promise<void> {
    const config = await this.loadPromptConfig(sourceFilename);
    await this.savePromptConfig(targetFilename, config);
  }

  async duplicateQueriesConfig(sourceFilename: string, targetFilename: string): Promise<void> {
    const config = await this.loadQueriesConfig(sourceFilename);
    await this.saveQueriesConfig(targetFilename, config);
  }
}