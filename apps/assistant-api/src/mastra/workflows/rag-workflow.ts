import { createWorkflow, createStep } from '@mastra/core';
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
  execute: async (params) => {
    console.log('[RAGWorkflow] Executing StudySpot agent step');
    const { question, conversationHistory, courseId, userId, timeZone, sessionId, promptOverrides } = params.inputData;
    
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
    
    // Generate response using agent (this will trigger tool calls)
    const response = await StudySpotAgent.generateResponse(question, conversationHistory, courseId, userId, timeZone);
    
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
      console.log('[RAGWorkflow] Starting Mastra workflow with native streaming and real-time tool events');

      // Tool name mapping for user-friendly messages
      const getToolActivityMessage = (toolName: string): string => {
        const activityMap: Record<string, string> = {
          'semantic_search': 'searching',
          'get_full_document': 'reading documents',
          'list_all_documents': 'finding available materials',
          'generate_flashcard_set': 'generating flashcards',
          'generate_quiz': 'generating a quiz',
          'create_quiz': 'generating a quiz'
        };
        return activityMap[toolName] || 'working';
      };

      let currentToolActivity: string | undefined = undefined;
      let workflowResult: RAGWorkflowOutput | null = null;
      let lastActivityYielded: string | undefined = undefined;
      let fullResponseText = '';
      
      try {
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
        
        console.log('[RAGWorkflow] Starting agent streaming for real-time tool detection');
        
        // Get streaming response directly from agent for real-time tool events
        const agentStreamResponse = await StudySpotAgent.generateStreamingResponse(
          input.question,
          input.conversationHistory,
          input.courseId,
          input.userId,
          input.timeZone
        );
        
        console.log('[RAGWorkflow] Agent stream response:', typeof agentStreamResponse, Object.keys(agentStreamResponse || {}));
        
        // Check if we got a valid stream response
        if (!agentStreamResponse) {
          throw new Error('Failed to get streaming response from agent');
        }
        
        // Process fullStream events for real-time tool detection in background
        const processFullStreamEvents = async () => {
          if (!agentStreamResponse.fullStream) {
            console.warn('[RAGWorkflow] No fullStream available from agent response');
            return;
          }
          
          console.log('[RAGWorkflow] Processing fullStream for real-time tool events');
          
          try {
            for await (const event of agentStreamResponse.fullStream) {
              console.log(`[RAGWorkflow] Stream event:`, event.type);
              
              // Handle tool call events - these fire when tools START
              if (event.type === 'tool-call') {
                const toolName = event.toolName || event.name || 'unknown';
                console.log(`[RAGWorkflow] Tool call started: ${toolName}`);
                const activityMessage = getToolActivityMessage(toolName);
                
                if (activityMessage !== currentToolActivity) {
                  currentToolActivity = activityMessage;
                  console.log(`[RAGWorkflow] Set tool activity: ${activityMessage}`);
                }
              } else if (event.type === 'tool-call-streaming-start') {
                const toolName = event.toolName || event.name || 'unknown';
                console.log(`[RAGWorkflow] Tool streaming started: ${toolName}`);
                const activityMessage = getToolActivityMessage(toolName);
                
                if (activityMessage !== currentToolActivity) {
                  currentToolActivity = activityMessage;
                }
              } else if (event.type === 'tool-result') {
                console.log('[RAGWorkflow] Tool completed, clearing activity');
                currentToolActivity = undefined;
              }
            }
          } catch (error: any) {
            console.error('[RAGWorkflow] Error processing fullStream events:', error);
          }
        };
        
        // Start processing fullStream events asynchronously
        processFullStreamEvents();
        
        // Process the agent's textStream for text chunks
        if (agentStreamResponse.textStream) {
          console.log('[RAGWorkflow] Processing textStream for chunks');
          for await (const chunk of agentStreamResponse.textStream) {
            console.log('[RAGWorkflow] Received text chunk:', typeof chunk, chunk?.substring?.(0, 50));
            fullResponseText += chunk;
            
            // Yield text chunks for real-time streaming
            yield { chunk };
            
            // Also yield tool activity updates if they changed
            if (currentToolActivity !== lastActivityYielded) {
              yield { toolActivity: currentToolActivity };
              lastActivityYielded = currentToolActivity;
              console.log(`[RAGWorkflow] Yielded tool activity during text stream: ${currentToolActivity}`);
            }
          }
        } else {
          console.warn('[RAGWorkflow] No textStream available from agent response');
        }
        
        // Continue yielding tool activity updates after text stream completes
        console.log('[RAGWorkflow] Text streaming completed, monitoring tool activities...');
        let checkCount = 0;
        const maxChecks = 300; // Check for up to 30 seconds
        
        while (checkCount < maxChecks) {
          // Yield tool activity updates if they changed
          if (currentToolActivity !== lastActivityYielded) {
            yield { toolActivity: currentToolActivity };
            lastActivityYielded = currentToolActivity;
            console.log(`[RAGWorkflow] Yielded tool activity post-text: ${currentToolActivity}`);
          }
          
          // Small delay to avoid busy waiting
          await new Promise(resolve => setTimeout(resolve, 100));
          checkCount++;
          
          // Break if we've been idle (no tool activity) for a while
          if (currentToolActivity === undefined && checkCount > 50) {
            console.log('[RAGWorkflow] No tool activity for 5 seconds, assuming completion');
            break;
          }
        }
        
        console.log('[RAGWorkflow] Agent streaming completed, collecting resources...');
        
        // Wait for the agent response to complete and get the final result
        let finalResponse;
        try {
          finalResponse = await agentStreamResponse;
          console.log('[RAGWorkflow] Final agent response:', typeof finalResponse, finalResponse?.text?.length || 0);
        } catch (error) {
          console.error('[RAGWorkflow] Error waiting for final response:', error);
          finalResponse = null;
        }
        
        // Use the response text from streaming or final response
        const responseText = fullResponseText || finalResponse?.text || '';
        
        // Collect linked resources (this mirrors the workflow step logic)
        const linkedDocumentIds: string[] = [];
        const resourceIds: Array<{ type: 'document' | 'flashcard_set' | 'quiz'; id: string }> = [];
        
        if (input.courseId) {
          const flashcardSetIds = getFlashcardSetsFromStore(input.courseId);
          flashcardSetIds.forEach(id => {
            linkedDocumentIds.push(id);
            resourceIds.push({ type: 'flashcard_set', id });
          });
          
          const quizIds = getQuizzesFromStore(input.courseId);
          quizIds.forEach(id => {
            linkedDocumentIds.push(id);
            resourceIds.push({ type: 'quiz', id });
          });
        }
        
        // Create workflow result
        workflowResult = {
          response: responseText,
          linkedDocumentIds,
          resourceIds,
          toolCalls: [],
          metadata: {
            ragUsed: true,
            documentsFound: linkedDocumentIds.filter(id => resourceIds.find(r => r.id === id)?.type === 'document').length,
            processingTime: Date.now() - Date.now()
          }
        };
        
        // Clean up stores
        if (input.courseId) {
          clearFlashcardStore(input.courseId);
          clearQuizStore(input.courseId);
        }
        
        // Update chat if sessionId provided
        if (input.sessionId && workflowResult) {
          try {
            await SupabaseService.updateAssistantMessageInChat(
              input.sessionId, 
              workflowResult.response, 
              workflowResult.resourceIds || []
            );
            console.log(`[RAGWorkflow] Successfully updated chat: ${input.sessionId}`);
          } catch (error) {
            console.error('[RAGWorkflow] Failed to update chat:', error);
          }
        }
        
      } catch (error) {
        console.error('[RAGWorkflow] Error in Mastra workflow streaming:', error);
        yield {
          error: error instanceof Error ? error.message : 'Unknown error occurred'
        };
        return;
      }

      // Get linked resources from the workflow result
      const linkedResources: Array<{ type: 'document' | 'flashcard_set' | 'quiz'; id: string }> = [];
      
      if (workflowResult?.resourceIds && Array.isArray(workflowResult.resourceIds)) {
        console.log(`[RAGWorkflow] Using categorized resources from workflow result: ${workflowResult.resourceIds.length}`);
        linkedResources.push(...workflowResult.resourceIds);
      }

      console.log(`[RAGWorkflow] Final linked resources: ${linkedResources.length}`);

      // Clear final tool activity
      yield { toolActivity: undefined };

      // Send final result with metadata
      yield {
        done: true,
        linkedDocumentIds: linkedResources
      };

    } catch (error) {
      console.error('[RAGWorkflow] Error in workflow streaming execution:', error);
      yield {
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
}