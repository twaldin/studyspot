import { Agent } from '@mastra/core';
import { RuntimeContext } from '@mastra/core/di';
import { createAnthropic } from '@ai-sdk/anthropic';
import { getFullDocumentTool } from '../tools/get-full-document.tool.js';
import { listAllDocumentsTool } from '../tools/list-all-documents.tool.js';
import { semanticSearchTool } from '../tools/semantic-search.tool.js';
import { setSourcesTool } from '../tools/set-sources.tool.js';
import { vectorSearchTool } from '../tools/vector-search.tool.js';
import { generateFlashcardSetTool } from '../tools/generate-flashcard-set.tool.js';
import { generateQuizTool } from '../tools/generate-quiz.tool.js';
import { ConfigLoaderService } from '../../services/config-loader.service.js';
import { SupabaseService } from '../../services/supabase.service.js';

// Create Anthropic instance with explicit API key configuration
const anthropic = createAnthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

/**
 * Main StudySpot assistant agent using Claude 3.5 Sonnet
 * Handles course-specific questions with document retrieval capabilities
 */
export class StudySpotAgent {
  private static instance: Agent | null = null;

  /**
   * Get or create the StudySpot agent instance
   */
  static async getInstance(): Promise<Agent> {
    if (!this.instance) {
      await this.createAgent();
    }
    return this.instance!;
  }

  /**
   * Create the StudySpot agent with dynamic configuration
   */
  private static async createAgent(): Promise<void> {
    try {
      // Load configuration
      const modelConfig = await ConfigLoaderService.getModelConfig();
      const systemPrompt = await ConfigLoaderService.getSystemPrompt();

      console.log(`[StudySpotAgent] Creating agent with model: ${modelConfig.model}, temperature: ${modelConfig.temperature}`);

      this.instance = new Agent({
        name: 'studyspot-assistant',
        description: 'AI assistant for college students with access to course-specific documents and materials',
        instructions: systemPrompt,
        // Using stable version - thinking configuration will be in system prompt
        model: anthropic('claude-3-5-sonnet-20241022'),
        tools: {
          get_full_document: getFullDocumentTool,
          list_all_documents: listAllDocumentsTool,
          semantic_search: semanticSearchTool,
          set_sources: setSourcesTool,
          vector_search: vectorSearchTool,
          create_flashcards: generateFlashcardSetTool,
          create_quiz: generateQuizTool
        }
      });

      console.log('[StudySpotAgent] Agent created successfully');
    } catch (error) {
      console.error('[StudySpotAgent] Failed to create agent:', error);
      throw error;
    }
  }

  /**
   * Generate a response with course context
   */
  static async generateResponse(
    question: string,
    conversationHistory: any[] = [],
    courseId?: string,
    userId?: string,
    timeZone?: string
  ): Promise<string> {
    try {
      const agent = await this.getInstance();

      // Build context for the prompt
      let courseContext = 'a college course';
      if (courseId) {
        const courseDetails = await SupabaseService.getCourseDetails(courseId);
        if (courseDetails) {
          courseContext = `${courseDetails.code} - ${courseDetails.title}`;
        }
      }

      const currentDate = SupabaseService.getFormattedDate(timeZone);
      
      // Format the system prompt with dynamic context
      const contextualizedPrompt = ConfigLoaderService.formatPromptTemplate(
        await ConfigLoaderService.getSystemPrompt(),
        {
          courseDetails: courseContext,
          currentDate
        }
      );

      // Prepare messages
      const messages = [
        ...conversationHistory,
        {
          role: 'user',
          content: question
        }
      ];

      console.log(`[StudySpotAgent] Generating response for course: ${courseId || 'none'}, question length: ${question.length}`);

      // Create runtime context for tools
      const runtimeContext = new RuntimeContext();
      if (courseId) {
        runtimeContext.set('courseId', courseId);
      }
      if (userId) {
        runtimeContext.set('userId', userId);
      }
      if (timeZone) {
        runtimeContext.set('timeZone', timeZone);
      }

      // Generate response with runtime context (thinking is enabled at model level)
      const response = await agent.generate(messages, {
        instructions: contextualizedPrompt,
        runtimeContext
      });

      console.log(`[StudySpotAgent] Generated response, length: ${response.text.length}`);
      return response.text;

    } catch (error) {
      console.error('[StudySpotAgent] Error generating response:', error);
      throw error;
    }
  }

  /**
   * Generate a streaming response with course context and retry logic
   */
  static async generateStreamingResponse(
    question: string,
    conversationHistory: any[] = [],
    courseId?: string,
    userId?: string,
    timeZone?: string
  ): Promise<any> {
    const MAX_RETRIES = 3;
    const RETRY_DELAY = 1000; // 1 second

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        const agent = await this.getInstance();

        // Build context for the prompt
        let courseContext = 'a college course';
        if (courseId) {
          const courseDetails = await SupabaseService.getCourseDetails(courseId);
          if (courseDetails) {
            courseContext = `${courseDetails.code} - ${courseDetails.title}`;
          }
        }

        const currentDate = SupabaseService.getFormattedDate(timeZone);
        
        // Format the system prompt with dynamic context
        const contextualizedPrompt = ConfigLoaderService.formatPromptTemplate(
          await ConfigLoaderService.getSystemPrompt(),
          {
            courseDetails: courseContext,
            currentDate
          }
        );

        // Prepare messages
        const messages = [
          ...conversationHistory,
          {
            role: 'user',
            content: question
          }
        ];

        console.log(`[StudySpotAgent] Starting streaming response (attempt ${attempt}/${MAX_RETRIES}) for course: ${courseId || 'none'}, question length: ${question.length}`);

        // Create runtime context for tools
        const runtimeContext = new RuntimeContext();
        if (courseId) {
          runtimeContext.set('courseId', courseId);
        }
        if (userId) {
          runtimeContext.set('userId', userId);
        }
        if (timeZone) {
          runtimeContext.set('timeZone', timeZone);
        }

        // Generate streaming response with runtime context (thinking is enabled at model level)
        const streamResponse = await agent.stream(messages, {
          instructions: contextualizedPrompt,
          runtimeContext
        });

        console.log(`[StudySpotAgent] Started streaming response successfully on attempt ${attempt}`);
        return streamResponse;

      } catch (error: any) {
        console.error(`[StudySpotAgent] Error on attempt ${attempt}/${MAX_RETRIES}:`, error);
        
        // Check if it's an overload error and we have retries left
        const isOverloadError = error?.message?.includes?.('Overloaded') || 
                               error?.error?.type === 'overloaded_error' ||
                               error?.status === 503;
        
        if (isOverloadError && attempt < MAX_RETRIES) {
          console.log(`[StudySpotAgent] API overloaded, retrying in ${RETRY_DELAY}ms (attempt ${attempt + 1}/${MAX_RETRIES})`);
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * attempt)); // Exponential backoff
          continue;
        }
        
        // If final attempt or non-retryable error, throw
        throw error;
      }
    }
  }

  /**
   * Refresh the agent configuration (useful when overrides change)
   */
  static async refreshConfiguration(): Promise<void> {
    this.instance = null;
    await this.createAgent();
    console.log('[StudySpotAgent] Configuration refreshed');
  }
}

// Export a function that creates the agent synchronously for Mastra config
export async function createStudySpotAgent() {
  return await StudySpotAgent.getInstance();
}