import { createWorkflow, createStep } from '@mastra/core';
import { RuntimeContext } from '@mastra/core/di';
import { z } from 'zod';
import { StudySpotAgent } from '../agents/studyspot-agent.js';
import { ConfigLoaderService, PromptOverrides } from '../../services/config-loader.service.js';
import { SupabaseService } from '../../services/supabase.service.js';
import { getFlashcardSetsFromStore, clearFlashcardStore } from '../tools/generate-flashcard-set.tool.js';
import { getQuizzesFromStore, clearQuizStore } from '../tools/generate-quiz.tool.js';

// Input schema for the RAG workflow
const RAGWorkflowInputSchema = z.object({
  question: z.string().min(1, 'Question is required'),
  conversationHistory: z.array(z.object({
    role: z.enum(['user', 'assistant', 'system']),
    content: z.string()
  })).default([]),
  courseId: z.string().uuid().optional(),
  userId: z.string().optional(),
  timeZone: z.string().optional(),
  sessionId: z.string().uuid().optional(), // Added sessionId for chat updates
  promptOverrides: z.any().optional() // PromptOverrides type
});

// Output schema for the RAG workflow
const RAGWorkflowOutputSchema = z.object({
  response: z.string(),
  linkedDocumentIds: z.array(z.string()),
  resourceIds: z.array(z.object({
    type: z.enum(['document', 'flashcard_set', 'quiz']),
    id: z.string()
  })).optional(),
  toolCalls: z.array(z.any()).optional(),
  metadata: z.object({
    ragUsed: z.boolean(),
    documentsFound: z.number(),
    processingTime: z.number()
  }).optional()
});

export type RAGWorkflowInput = z.infer<typeof RAGWorkflowInputSchema>;
export type RAGWorkflowOutput = z.infer<typeof RAGWorkflowOutputSchema>;

// Define the main workflow step that executes the StudySpot agent
const studySpotAgentStep = createStep({
  id: 'studyspot-agent',
  description: 'Execute StudySpot agent with tools for AI-powered response generation',
  inputSchema: RAGWorkflowInputSchema,
  outputSchema: RAGWorkflowOutputSchema,
  execute: async ({ inputData, mastra }) => {
    console.log('[RAGWorkflow] Executing StudySpot agent step');
    const { question, conversationHistory, courseId, userId, timeZone, sessionId, promptOverrides } = inputData;
    
    // Apply prompt overrides
    if (promptOverrides) {
      ConfigLoaderService.applyOverrides(promptOverrides as PromptOverrides);
    } else {
      ConfigLoaderService.applyOverrides(null);
    }
    
    // Clear stores
    if (courseId) {
      clearFlashcardStore(courseId);
      clearQuizStore(courseId);
    }
    
    // Use the agent directly instead of through Mastra for now
    console.log('[RAGWorkflow] Using StudySpot agent directly');
    const agent = await StudySpotAgent.getInstance();
    
    // Build context for the agent
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
    
    // Prepare messages with proper typing
    const messages = [
      ...conversationHistory,
      {
        role: 'user' as const,
        content: question
      }
    ];
    
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
    
    // Generate response using agent (this will trigger tool calls)
    const agentResponse = await agent.generate(messages, {
      instructions: contextualizedPrompt,
      runtimeContext
    });
    
    const response = agentResponse.text;
    
    // Collect linked resources
    const linkedDocumentIds: string[] = [];
    const resourceIds: Array<{ type: 'document' | 'flashcard_set' | 'quiz'; id: string }> = [];
    
    if (courseId) {
      const flashcardSetIds = getFlashcardSetsFromStore(courseId);
      flashcardSetIds.forEach(id => {
        linkedDocumentIds.push(id);
        resourceIds.push({ type: 'flashcard_set', id });
      });
      
      const quizIds = getQuizzesFromStore(courseId);
      quizIds.forEach(id => {
        linkedDocumentIds.push(id);
        resourceIds.push({ type: 'quiz', id });
      });
    }
    
    // Update chat if sessionId provided
    if (sessionId) {
      try {
        await SupabaseService.updateAssistantMessageInChat(sessionId, response, resourceIds);
        console.log(`[RAGWorkflow] Successfully updated chat: ${sessionId}`);
      } catch (error) {
        console.error('[RAGWorkflow] Failed to update chat:', error);
      }
    }
    
    // Clean up stores
    if (courseId) {
      clearFlashcardStore(courseId);
      clearQuizStore(courseId);
    }
    
    return {
      response,
      linkedDocumentIds,
      resourceIds, // Include the properly categorized resources
      toolCalls: [],
      metadata: {
        ragUsed: true,
        documentsFound: linkedDocumentIds.filter(id => resourceIds.find(r => r.id === id)?.type === 'document').length,
        processingTime: Date.now() - Date.now()
      }
    };
  }
});

/**
 * Main RAG workflow that executes the StudySpot agent with real-time tool monitoring
 */
export const ragWorkflow = createWorkflow({
  id: 'rag-workflow',
  description: 'Complete RAG workflow with StudySpot agent and real-time tool monitoring',
  inputSchema: RAGWorkflowInputSchema,
  outputSchema: RAGWorkflowOutputSchema
}).then(studySpotAgentStep).commit();

/**
 * Streaming version of the RAG workflow using Mastra's native workflow streaming
 * Returns an async generator for real-time response streaming with tool events
 */
export class RAGWorkflowStreaming {
  /**
   * Execute the RAG workflow with real-time tool event monitoring using Mastra's native workflow streaming
   */
  static async* executeStream(input: RAGWorkflowInput): AsyncGenerator<{
    chunk?: string;
    linkedDocumentIds?: Array<{ type: 'document' | 'flashcard_set' | 'quiz'; id: string }>;
    done?: boolean;
    error?: string;
    toolActivity?: string;
  }> {
    try {
      console.log('[RAGWorkflow] Starting native Mastra workflow streaming');

      // Tool name mapping for user-friendly messages
      const getToolActivityMessage = (toolName: string): string => {
        const activityMap: Record<string, string> = {
          'semantic_search': 'searching',
          'get_full_document': 'reading documents',
          'list_all_documents': 'finding available materials',
          'generate_flashcard_set': 'generating flashcards',
          'generate_quiz': 'generating a quiz',
          'create_quiz': 'generating a quiz',
          'create_flashcards': 'generating flashcards',
          'declare_content_creation': 'initializing content generation',
          'generate_content_plan': 'planning content structure',
          'generate_single_question': 'generating questions',
          'generate_single_flashcard': 'generating flashcards'
        };
        return activityMap[toolName] || 'working';
      };

      // Apply prompt overrides first
      if (input.promptOverrides) {
        ConfigLoaderService.applyOverrides(input.promptOverrides as PromptOverrides);
      } else {
        ConfigLoaderService.applyOverrides(null);
      }
      
      // Clear stores
      if (input.courseId) {
        clearFlashcardStore(input.courseId);
        clearQuizStore(input.courseId);
      }
      
      const agent = await StudySpotAgent.getInstance();
      
      // Build context for the agent
      let courseContext = 'a college course';
      if (input.courseId) {
        const courseDetails = await SupabaseService.getCourseDetails(input.courseId);
        if (courseDetails) {
          courseContext = `${courseDetails.code} - ${courseDetails.title}`;
        }
      }
      
      const currentDate = SupabaseService.getFormattedDate(input.timeZone);
      
      // Format the system prompt with dynamic context
      const contextualizedPrompt = ConfigLoaderService.formatPromptTemplate(
        await ConfigLoaderService.getSystemPrompt(),
        {
          courseDetails: courseContext,
          currentDate
        }
      );
      
      // Prepare messages with proper typing
      const messages = [
        ...input.conversationHistory,
        {
          role: 'user' as const,
          content: input.question
        }
      ];
      
      // Create runtime context for tools
      const runtimeContext = new RuntimeContext();
      if (input.courseId) {
        runtimeContext.set('courseId', input.courseId);
      }
      if (input.userId) {
        runtimeContext.set('userId', input.userId);
      }
      if (input.timeZone) {
        runtimeContext.set('timeZone', input.timeZone);
      }
      
      // Stream the agent response directly (thinking is enabled at model level)
      const agentStreamResponse = await agent.stream(messages, {
        instructions: contextualizedPrompt,
        runtimeContext
      });
      
      console.log('[RAGWorkflow] Processing agent stream events');
      
      // Variables to track state
      let fullResponseText = '';
      let currentToolActivity: string | undefined;
      let resourceIds: Array<{ type: 'document' | 'flashcard_set' | 'quiz'; id: string }> = [];
      
      // Create a combined async generator that handles both streams
      async function* combineStreams() {
        const fullStreamIterator = agentStreamResponse.fullStream?.[Symbol.asyncIterator]();
        const textStreamIterator = agentStreamResponse.textStream?.[Symbol.asyncIterator]();
        
        if (!fullStreamIterator || !textStreamIterator) {
          console.warn('[RAGWorkflow] Missing stream iterators');
          return;
        }
        
        let fullStreamDone = false;
        let textStreamDone = false;
        
        while (!fullStreamDone || !textStreamDone) {
          // Create promises for both iterators
          const promises: Promise<any>[] = [];
          
          if (!fullStreamDone) {
            promises.push(
              fullStreamIterator.next().then(result => ({ type: 'fullStream', result }))
            );
          }
          
          if (!textStreamDone) {
            promises.push(
              textStreamIterator.next().then(result => ({ type: 'textStream', result }))
            );
          }
          
          if (promises.length === 0) break;
          
          // Race the promises to handle whichever comes first
          const { type, result } = await Promise.race(promises);
          
          if (type === 'fullStream') {
            if (result.done) {
              fullStreamDone = true;
              continue;
            }
            
            const event = result.value;
            const eventAny = event as any;
            console.log(`[RAGWorkflow] Agent event: ${event.type}`, eventAny.toolName || '');
            
            // Handle tool call events
            if (event.type === 'tool-call') {
              const toolName = eventAny.toolName || eventAny.name || 'unknown';
              console.log(`[RAGWorkflow] Tool call started: ${toolName}`);
              const activityMessage = getToolActivityMessage(toolName);
              
              if (activityMessage !== currentToolActivity) {
                currentToolActivity = activityMessage;
                yield { toolActivity: currentToolActivity };
                console.log(`[RAGWorkflow] Yielded tool activity immediately: ${currentToolActivity}`);
              }
            }
            
            // Handle tool streaming start
            else if (event.type === 'tool-call-streaming-start') {
              const streamingToolName = eventAny.toolName || eventAny.name || 'unknown';
              console.log(`[RAGWorkflow] Tool streaming started: ${streamingToolName}`);
              const streamingActivity = getToolActivityMessage(streamingToolName);
              
              if (streamingActivity !== currentToolActivity) {
                currentToolActivity = streamingActivity;
                yield { toolActivity: currentToolActivity };
                console.log(`[RAGWorkflow] Yielded tool streaming activity: ${currentToolActivity}`);
              }
            }
            
            // Handle tool result (tool execution complete)
            else if (event.type === 'tool-result') {
              console.log('[RAGWorkflow] Tool completed');
              currentToolActivity = undefined;
              yield { toolActivity: undefined };
              console.log('[RAGWorkflow] Yielded tool completion (cleared activity)');
            }
            
            // Handle text-delta events from fullStream
            else if (event.type === 'text-delta') {
              const textDelta = eventAny.textDelta;
              if (textDelta) {
                fullResponseText += textDelta;
                yield { chunk: textDelta };
                console.log('[RAGWorkflow] Yielded text chunk:', textDelta.substring(0, 50));
              }
            }
          }
          
          else if (type === 'textStream') {
            if (result.done) {
              textStreamDone = true;
              continue;
            }
            
            const chunk = result.value;
            if (chunk) {
              fullResponseText += chunk;
              yield { chunk };
              console.log('[RAGWorkflow] Yielded text chunk:', chunk.substring(0, 50));
            }
          }
        }
      }
      
      // Process the combined stream
      for await (const event of combineStreams()) {
        yield event;
      }
      
      // Collect linked resources
      if (input.courseId) {
        const flashcardSetIds = getFlashcardSetsFromStore(input.courseId);
        flashcardSetIds.forEach(id => {
          resourceIds.push({ type: 'flashcard_set', id });
        });
        
        const quizIds = getQuizzesFromStore(input.courseId);
        quizIds.forEach(id => {
          resourceIds.push({ type: 'quiz', id });
        });
      }
      
      // Update chat if sessionId provided
      if (input.sessionId) {
        try {
          await SupabaseService.updateAssistantMessageInChat(
            input.sessionId, 
            fullResponseText, 
            resourceIds || []
          );
          console.log(`[RAGWorkflow] Successfully updated chat: ${input.sessionId}`);
        } catch (error) {
          console.error('[RAGWorkflow] Failed to update chat:', error);
        }
      }
      
      // Clean up stores
      if (input.courseId) {
        clearFlashcardStore(input.courseId);
        clearQuizStore(input.courseId);
      }
      
      console.log('[RAGWorkflow] Agent streaming completed');

      // Ensure tool activity is cleared
      if (currentToolActivity !== undefined) {
        yield { toolActivity: undefined };
      }

      // Send final result with resources
      console.log(`[RAGWorkflow] Sending final result with ${resourceIds.length} resources`);
      yield {
        done: true,
        linkedDocumentIds: resourceIds
      };

    } catch (error) {
      console.error('[RAGWorkflow] Error in workflow streaming execution:', error);
      yield {
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
}