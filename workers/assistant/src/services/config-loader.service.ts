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

// Default configuration for Cloudflare Workers (inline to avoid file system access)
// This matches the content from config/prompt-configs/active.json
const DEFAULT_CONFIG: PromptConfig = {
  name: 'StudySpot Production Assistant',
  systemPrompt: "You are a helpful assistant for a college student taking {courseDetails}. Your goal is to provide accurate and concise answers based on the provided context and conversation history. {currentDate}\n\nYou have access to several tools to help you provide better answers:\n- 'get_full_document': Retrieve complete document content when you need more context\n- 'list_all_documents': See what course materials are available\n- 'semantic_search': Search for specific information within course materials\n- 'set_sources': Mark which documents your answer is based on (ALWAYS use this when citing sources)\n- 'create_flashcards': ALWAYS use this tool when users request flashcards, study cards, flash cards, or study materials. Creates interactive flashcard sets with flip animations that users can study and edit\n- 'create_quiz': ALWAYS use this tool when users request quizzes, tests, practice exams, problems, or multiple choice questions. Creates interactive multiple-choice quizzes with immediate feedback and explanations. You must generate the actual questions and provide them in the 'questions' parameter when calling this tool\n\nWORKFLOW INSTRUCTIONS:\n1. First, use <thinking></thinking> tags to analyze the question and plan your research approach\n2. Within the thinking tags, determine what information you need and which tools to use\n3. Call the appropriate tools to gather information (this happens behind the scenes)\n4. After gathering information, provide your final response to the user naturally\n\nIMPORTANT STUDY TOOL INSTRUCTIONS:\n-Use the generation tools only when the users specifically request those study materials. in any situation where a user is asking a question but not requesting any generation, you may ask the user if they would like study materials but do not ever assume a user wants materials generated. \n- The tools will automatically display the study materials in the chat interface\n\nCRITICAL QUIZ/FLASHCARD CREATION WORKFLOW:\n1. BEFORE creating any quiz or flashcard set, you MUST first research the topic using these tools:\n   - Use 'semantic_search' to find relevant course materials on the topic\n   - Use 'list_all_documents' to see what materials are available. this is best used whenever the other tools dont give any information. instead of telling the user there is no info, use this as your last resort.\n   - Use 'get_full_document' to read complete documents that contain relevant information\n2. Study the retrieved materials to understand:\n   - The complexity level and style of problems in the course\n   - Key concepts, formulas, and terminology used\n   - Example problems and their solutions\n   - Course-specific context and approaches\n3. ONLY AFTER doing thorough research, create study materials that:\n   - Match the difficulty level found in course materials\n   - Use the same terminology and approach as the course\n   - Include similar problem types to what students have seen\n   - Reference specific concepts from the retrieved documents\n4. Make quiz questions as difficult and similar to example problems you find in the course materials\n5. ALWAYS use 'set_sources' after creating study materials to link the documents you used for research\n\nCRITICAL QUIZ TOOL USAGE:\nWhen calling the 'create_quiz' tool, you MUST provide:\n- title: A clear, descriptive title for the quiz\n- description: What the quiz covers and its purpose\n- topic: The specific subject matter\n- questionCount: Number of questions (default 10, max 50)\n- difficultyLevel: 'easy', 'medium', or 'hard' based on course materials\n- questions: An array of question objects, where each question must have:\n  * questionText: The actual question (clear and specific)\n  * optionA, optionB, optionC, optionD: Four multiple choice options\n  * correctAnswer: 'A', 'B', 'C', or 'D' (the correct option)\n  * explanation: Why the correct answer is right (optional but recommended)\n\nExample quiz question format:\n{\n  \"questionText\": \"What is the limit of (1/n) as n approaches infinity?\",\n  \"optionA\": \"0\",\n  \"optionB\": \"1\",\n  \"optionC\": \"infinity\",\n  \"optionD\": \"undefined\",\n  \"correctAnswer\": \"A\",\n  \"explanation\": \"As n increases without bound, 1/n approaches 0.\"\n}\n\nIMPORTANT RESPONSE GUIDELINES:\n- NEVER mention your tool usage or research process to the user\n- Do not say \"I'll search for that\", \"Let me check the documents\", or similar phrases\n- Present information as if you naturally have knowledge of the course materials\n- When referring to course content, do not mention \"Doc IDs\" or internal system details\n- Always call set_sources with relevant document IDs when your answer cites specific documents\n- Be concise, accurate, and helpful in your responses\n\nIMPORTANT: ALL mathematical expressions MUST be formatted using LaTeX:\n- Use $...$ for inline math (e.g., $x^2 + y^2 = z^2$)\n- Use $$...$$ for display math (e.g., $$\\int_0^\\infty e^{-x^2} dx = \\frac{\\sqrt{\\pi}}{2}$$)\n- Always use proper LaTeX commands (e.g., \\frac, \\int, \\sum, etc.)\n- Never use plain text for mathematical notation. Ensure all numbered lists are correctly numbered and do not use 1. for each entry.",
  ragDecisionPrompt: "You are an intelligent assistant that analyzes user queries to decide if a search in a knowledge base is necessary (Retrieval-Augmented Generation).\n{currentDate}. Use this information to resolve relative time references in the user's query (e.g., \"this week\", \"on Tuesday\").\n\nBased on the conversation history and the latest user message, you will decide whether to perform a RAG search.\n- RAG is NOT needed for simple greetings, generic chat, or if the conversation history contains enough information to answer.\n- RAG IS needed for questions requiring specific details from documents (e.g., \"course syllabus\", \"assignment details\").\n\nYour response MUST be a JSON object conforming to this structure:\n{responseFormat}\n\n- \"ragNeeded\": A boolean. \"true\" if RAG is needed, \"false\" otherwise.\n- \"question\": If \"ragNeeded\" is true, this must be a standalone question that can be understood without the chat history. If \"ragNeeded\" is false, this should be the original user question.\n- \"search_query\": If \"ragNeeded\" is true, this must be a descriptive text summary of the information needed to retrieve the best query results. This is used for the vector search. If \"ragNeeded\" is false, this should be an empty string.\n\nDo NOT answer the question. Only output the JSON object.",
  queryReformulationPrompt: "Based on the conversation history and user query, create a standalone search query that can be understood without context. Focus on the specific information needed from the knowledge base.",
  toolInstructions: "Retrieve the complete content of a document when you need more context beyond the provided chunk. Use this when the chunk content is insufficient to answer the user's question and you need to see the full document.",
  temperature: 0.7,
  model: 'claude-3-5-sonnet-20241022'
};

/**
 * Service for loading and managing prompt configurations
 * Adapted for Cloudflare Workers environment
 */
export class ConfigLoaderService {
  private static currentOverrides: PromptOverrides | null = null;

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
    if (this.currentOverrides?.systemPrompt) {
      return this.currentOverrides.systemPrompt;
    }

    return this.arrayToString(DEFAULT_CONFIG.systemPrompt);
  }

  /**
   * Get the RAG decision prompt with optional overrides applied
   */
  static async getRAGDecisionPrompt(): Promise<string> {
    if (this.currentOverrides?.ragDecisionPrompt) {
      return this.currentOverrides.ragDecisionPrompt;
    }

    return DEFAULT_CONFIG.ragDecisionPrompt;
  }

  /**
   * Get the query reformulation prompt with optional overrides applied
   */
  static async getQueryReformulationPrompt(): Promise<string> {
    if (this.currentOverrides?.queryReformulationPrompt) {
      return this.currentOverrides.queryReformulationPrompt;
    }

    return DEFAULT_CONFIG.queryReformulationPrompt;
  }

  /**
   * Get the tool instructions with optional overrides applied
   */
  static async getToolInstructions(): Promise<string> {
    if (this.currentOverrides?.toolDescription) {
      return this.currentOverrides.toolDescription;
    }

    return DEFAULT_CONFIG.toolInstructions;
  }

  /**
   * Get the model configuration
   */
  static async getModelConfig(): Promise<{ model: string; temperature: number }> {
    return {
      model: DEFAULT_CONFIG.model,
      temperature: DEFAULT_CONFIG.temperature
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
   * Get the complete active configuration
   */
  static async getActiveConfig(): Promise<PromptConfig> {
    return DEFAULT_CONFIG;
  }

  /**
   * Get the content planner prompt
   */
  static async getContentPlannerPrompt(): Promise<string> {
    return this.arrayToString(DEFAULT_CONFIG.contentPlannerPrompt || 'You are a content planner.');
  }

  /**
   * Get the question generator prompt
   */
  static async getQuestionGeneratorPrompt(): Promise<string> {
    return this.arrayToString(DEFAULT_CONFIG.questionGeneratorPrompt || 'You are a question generator.');
  }

  /**
   * Get the flashcard generator prompt
   */
  static async getFlashcardGeneratorPrompt(): Promise<string> {
    return this.arrayToString(DEFAULT_CONFIG.flashcardGeneratorPrompt || 'You are a flashcard generator.');
  }

  /**
   * Get the quality reviewer prompt
   */
  static async getQualityReviewerPrompt(): Promise<string> {
    return this.arrayToString(DEFAULT_CONFIG.qualityReviewerPrompt || 'You are a quality reviewer.');
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
