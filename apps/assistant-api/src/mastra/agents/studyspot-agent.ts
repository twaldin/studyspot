import { Agent } from '@mastra/core';
import { RuntimeContext } from '@mastra/core/di';
import { anthropic } from '@ai-sdk/anthropic';
import { getFullDocumentTool } from '../tools/get-full-document.tool.js';
import { listAllDocumentsTool } from '../tools/list-all-documents.tool.js';
import { semanticSearchTool } from '../tools/semantic-search.tool.js';
import { setSourcesTool } from '../tools/set-sources.tool.js';
import { generateFlashcardSetTool } from '../tools/generate-flashcard-set.tool.js';
import { generateQuizTool } from '../tools/generate-quiz.tool.js';
import { ConfigLoaderService } from '../../services/config-loader.service.js';
import { SupabaseService } from '../../services/supabase.service.js';

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
        model: anthropic('claude-3-5-sonnet-20241022'),
        tools: {
          get_full_document: getFullDocumentTool,
          list_all_documents: listAllDocumentsTool,
          semantic_search: semanticSearchTool,
          set_sources: setSourcesTool,
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
      if (timeZone) {
        runtimeContext.set('timeZone', timeZone);
      }

      // Generate response with runtime context
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
   * Stream a response (for real-time interaction)
   */
  static async streamResponse(
    question: string,
    conversationHistory: any[] = [],
    courseId?: string,
    userId?: string,
    timeZone?: string
  ): Promise<AsyncGenerator<string, void, unknown>> {
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

      console.log(`[StudySpotAgent] Starting stream response for course: ${courseId || 'none'}`);

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

      // Stream response with runtime context
      const stream = await agent.stream(messages, {
        instructions: contextualizedPrompt,
        runtimeContext
      });

      // Return async generator for streaming chunks
      return (async function* () {
        for await (const chunk of stream.textStream) {
          yield chunk;
        }
      })();

    } catch (error) {
      console.error('[StudySpotAgent] Error streaming response:', error);
      throw error;
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