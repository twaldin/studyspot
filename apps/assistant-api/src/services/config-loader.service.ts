import { readFile } from 'fs/promises';
import { join } from 'path';
import { z } from 'zod';

// Prompt configuration schema matching existing config structure
const PromptConfigSchema = z.object({
  name: z.string(),
  systemPrompt: z.union([z.string(), z.array(z.string())]),
  ragDecisionPrompt: z.string(),
  queryReformulationPrompt: z.string(),
  toolInstructions: z.string(),
  contentPlannerPrompt: z.union([z.string(), z.array(z.string())]).optional(),
  questionGeneratorPrompt: z.union([z.string(), z.array(z.string())]).optional(),
  flashcardGeneratorPrompt: z.union([z.string(), z.array(z.string())]).optional(),
  qualityReviewerPrompt: z.union([z.string(), z.array(z.string())]).optional(),
  temperature: z.number().optional().default(0.7),
  model: z.string().optional().default('claude-3-5-sonnet-20241022')
});

// Prompt override schema matching the existing assistant API
const PromptOverrideSchema = z.object({
  systemPrompt: z.string().optional(),
  ragDecisionPrompt: z.string().optional(),
  queryReformulationPrompt: z.string().optional(),
  toolDescription: z.string().optional(),
  contextFormatting: z.object({
    useHeaders: z.boolean().optional(),
    headerText: z.string().optional(),
    footerText: z.string().optional(),
    includeDocumentIds: z.boolean().optional(),
    documentSeparator: z.string().optional()
  }).optional(),
  responseFormat: z.object({
    requireJSON: z.boolean().optional(),
    includeLinkedDocumentIds: z.boolean().optional(),
    encourageConciseness: z.boolean().optional(),
    maxResponseLength: z.number().optional()
  }).optional(),
  mathFormatting: z.enum(['latex', 'plain', 'markdown']).optional(),
  personality: z.object({
    tone: z.enum(['helpful', 'professional', 'casual', 'academic']).optional(),
    verbosity: z.enum(['concise', 'balanced', 'detailed']).optional(),
    formality: z.enum(['formal', 'informal', 'neutral']).optional()
  }).optional()
});

export type PromptConfig = z.infer<typeof PromptConfigSchema>;
export type PromptOverrides = z.infer<typeof PromptOverrideSchema>;

/**
 * Service for loading and managing prompt configurations from the root config folder
 */
export class ConfigLoaderService {
  private static configCache = new Map<string, PromptConfig>();
  private static currentOverrides: PromptOverrides | null = null;

  /**
   * Load a configuration file from the root config/prompt-configs directory
   */
  private static async loadConfig(filename: string): Promise<PromptConfig> {
    if (this.configCache.has(filename)) {
      return this.configCache.get(filename)!;
    }

    try {
      // Navigate to root config folder from apps/mastra-assistant-api
      // When running from mastra dev, we need to go up from the current working directory
      let configPath;
      
      // Try multiple possible paths based on execution context
      const possiblePaths = [
        join(process.cwd(), '..', '..', 'config', 'prompt-configs', filename), // From apps/mastra-assistant-api
        join(process.cwd(), 'config', 'prompt-configs', filename), // From root
        join(process.cwd(), '../../config', 'prompt-configs', filename), // Alternative path
      ];
      
      console.log(`[ConfigLoader] Looking for config file: ${filename}`);
      console.log(`[ConfigLoader] Current working directory: ${process.cwd()}`);
      
      let configContent;
      let usedPath;
      
      for (const path of possiblePaths) {
        try {
          console.log(`[ConfigLoader] Trying path: ${path}`);
          configContent = await readFile(path, 'utf-8');
          usedPath = path;
          break;
        } catch (err) {
          console.log(`[ConfigLoader] Path not found: ${path}`);
          continue;
        }
      }
      
      if (!configContent) {
        throw new Error(`Config file not found in any of the expected locations: ${possiblePaths.join(', ')}`);
      }
      
      const rawConfig = JSON.parse(configContent);
      const config = PromptConfigSchema.parse(rawConfig);
      this.configCache.set(filename, config);
      
      console.log(`[ConfigLoader] Successfully loaded config: ${filename} from ${usedPath}`);
      return config;
    } catch (error) {
      console.error(`[ConfigLoader] Failed to load config ${filename}:`, error);
      throw new Error(`Failed to load configuration: ${filename}`);
    }
  }

  /**
   * Helper method to convert array prompts to strings
   */
  private static arrayToString(prompt: string | string[]): string {
    return Array.isArray(prompt) ? prompt.join('\n') : prompt;
  }

  /**
   * Get the system prompt with optional overrides applied
   */
  static async getSystemPrompt(): Promise<string> {
    const config = await this.loadConfig('active.json');
    
    if (this.currentOverrides?.systemPrompt) {
      return this.currentOverrides.systemPrompt;
    }
    
    return this.arrayToString(config.systemPrompt);
  }

  /**
   * Get the RAG decision prompt with optional overrides applied
   */
  static async getRAGDecisionPrompt(): Promise<string> {
    const config = await this.loadConfig('active.json');
    
    if (this.currentOverrides?.ragDecisionPrompt) {
      return this.currentOverrides.ragDecisionPrompt;
    }
    
    return config.ragDecisionPrompt;
  }

  /**
   * Get the query reformulation prompt with optional overrides applied
   */
  static async getQueryReformulationPrompt(): Promise<string> {
    const config = await this.loadConfig('active.json');
    
    if (this.currentOverrides?.queryReformulationPrompt) {
      return this.currentOverrides.queryReformulationPrompt;
    }
    
    return config.queryReformulationPrompt;
  }

  /**
   * Get the tool instructions with optional overrides applied
   */
  static async getToolInstructions(): Promise<string> {
    const config = await this.loadConfig('active.json');
    
    if (this.currentOverrides?.toolDescription) {
      return this.currentOverrides.toolDescription;
    }
    
    return config.toolInstructions;
  }

  /**
   * Get the model configuration
   */
  static async getModelConfig(): Promise<{ model: string; temperature: number }> {
    const config = await this.loadConfig('active.json');
    return {
      model: config.model,
      temperature: config.temperature
    };
  }

  /**
   * Apply prompt overrides for development/testing purposes
   * This maintains compatibility with the dev panel functionality
   */
  static applyOverrides(overrides: PromptOverrides | null): void {
    this.currentOverrides = overrides;
    
    if (overrides) {
      console.log(`[ConfigLoader] Applied prompt overrides:`, Object.keys(overrides));
    } else {
      console.log(`[ConfigLoader] Cleared prompt overrides`);
    }
  }

  /**
   * Get current overrides (for debugging)
   */
  static getCurrentOverrides(): PromptOverrides | null {
    return this.currentOverrides;
  }

  /**
   * Clear the configuration cache (useful for development)
   */
  static clearCache(): void {
    this.configCache.clear();
    console.log(`[ConfigLoader] Configuration cache cleared`);
  }

  /**
   * Get the complete active configuration
   */
  static async getActiveConfig(): Promise<PromptConfig> {
    return this.loadConfig('active.json');
  }

  /**
   * Get the content planner prompt
   */
  static async getContentPlannerPrompt(): Promise<string> {
    const config = await this.loadConfig('active.json');
    return this.arrayToString(config.contentPlannerPrompt || 'You are a content planner.');
  }

  /**
   * Get the question generator prompt
   */
  static async getQuestionGeneratorPrompt(): Promise<string> {
    const config = await this.loadConfig('active.json');
    return this.arrayToString(config.questionGeneratorPrompt || 'You are a question generator.');
  }

  /**
   * Get the flashcard generator prompt
   */
  static async getFlashcardGeneratorPrompt(): Promise<string> {
    const config = await this.loadConfig('active.json');
    return this.arrayToString(config.flashcardGeneratorPrompt || 'You are a flashcard generator.');
  }

  /**
   * Get the quality reviewer prompt
   */
  static async getQualityReviewerPrompt(): Promise<string> {
    const config = await this.loadConfig('active.json');
    return this.arrayToString(config.qualityReviewerPrompt || 'You are a quality reviewer.');
  }

  /**
   * Format template strings with dynamic values
   */
  static formatPromptTemplate(template: string, variables: Record<string, string>): string {
    let formatted = template;
    
    for (const [key, value] of Object.entries(variables)) {
      const placeholder = `{${key}}`;
      formatted = formatted.replace(new RegExp(placeholder, 'g'), value);
    }
    
    return formatted;
  }
}