import { createWorkflow, createStep } from '@mastra/core';
import { RuntimeContext } from '@mastra/core/di';
import { z } from 'zod';
import { embedMany } from 'ai';
import { openai } from '@ai-sdk/openai';
import { StudySpotAgent } from '../agents/studyspot-agent.js';
import { QueryReformulationAgent } from '../agents/query-reformulation-agent.js';
import { ConfigLoaderService, PromptOverrides } from '../../services/config-loader.service.js';
import { SupabaseService } from '../../services/supabase.service.js';
import { getFlashcardSetsFromStore, clearFlashcardStore } from '../tools/generate-flashcard-set.tool.js';
import { getQuizzesFromStore, clearQuizStore } from '../tools/generate-quiz.tool.js';
import { semanticSearchTool } from '../tools/semantic-search.tool.js';
import { getFullDocumentTool } from '../tools/get-full-document.tool.js';
import { workflowConfig } from '../config/workflow.config.js';

// Input schema for the enhanced RAG workflow
const EnhancedRAGWorkflowInputSchema = z.object({
  question: z.string().min(1, 'Question is required'),
  conversationHistory: z.array(z.object({
    role: z.enum(['user', 'assistant', 'system']),
    content: z.string()
  })).default([]),
  courseId: z.string().uuid().optional(),
  userId: z.string().optional(),
  timeZone: z.string().optional(),
  sessionId: z.string().uuid().optional(),
  promptOverrides: z.any().optional()
});

// Output schema remains the same
const EnhancedRAGWorkflowOutputSchema = z.object({
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
    processingTime: z.number(),
    queryType: z.string().optional(),
    parallelSearches: z.number().optional()
  }).optional()
});

// Step 1: Analyze query intent
const analyzeQueryIntentStep = createStep({
  id: 'analyze-query-intent',
  description: 'Analyze the user query to determine intent and whether RAG is needed',
  inputSchema: z.object({
    question: z.string(),
    courseId: z.string().optional(),
    conversationHistory: z.array(z.any())
  }),
  outputSchema: z.object({
    needsRAG: z.boolean(),
    queryType: z.enum(['factual', 'creative', 'quiz', 'flashcard', 'general', 'chat']),
    searchTerms: z.array(z.string()).optional(),
    confidence: z.number()
  }),
  execute: async ({ inputData }) => {
    console.log('[RAG Enhanced] Analyzing query intent:', inputData.question);
    
    // Use the query reformulation agent for intent classification
    const agent = await QueryReformulationAgent.getInstance();
    
    const systemPrompt = `Analyze the following query and determine:
1. Whether it requires document retrieval (RAG) from course materials
2. The type of query (factual, creative, quiz, flashcard, general, chat)
3. Key search terms if RAG is needed
4. Confidence level (0-1) in your classification

Consider the conversation history when making your determination.`;

    const messages = [
      { role: 'system' as const, content: systemPrompt },
      ...inputData.conversationHistory.slice(-workflowConfig.queryAnalysis.historyContextWindow), // Configurable context window
      { role: 'user' as const, content: inputData.question }
    ];

    const result = await agent.generate(messages, {
      output: {
        type: 'object',
        properties: {
          needsRAG: { type: 'boolean' },
          queryType: { type: 'string', enum: ['factual', 'creative', 'quiz', 'flashcard', 'general', 'chat'] },
          searchTerms: { type: 'array', items: { type: 'string' } },
          confidence: { type: 'number' }
        },
        required: ['needsRAG', 'queryType', 'confidence']
      }
    });

    console.log('[RAG Enhanced] Query intent analysis:', result.object);
    
    return result.object;
  }
});

// Step 2: Generate search embeddings
const generateSearchEmbeddingsStep = createStep({
  id: 'generate-search-embeddings',
  description: 'Generate embeddings for search terms',
  inputSchema: z.object({
    searchTerms: z.array(z.string()),
  }),
  outputSchema: z.object({
    searchEmbeddings: z.array(z.object({
      term: z.string(),
      embedding: z.array(z.number())
    }))
  }),
  execute: async ({ inputData }) => {
    console.log('[RAG Enhanced] Generating embeddings for search terms:', inputData.searchTerms);
    
    const { embeddings } = await embedMany({
      model: openai.embedding('text-embedding-3-small'),
      values: inputData.searchTerms,
    });
    
    const searchEmbeddings = inputData.searchTerms.map((term, index) => ({
      term,
      embedding: embeddings[index]
    }));
    
    return { searchEmbeddings };
  }
});

// Step 3: Parallel document search
const parallelDocumentSearchStep = createStep({
  id: 'parallel-document-search',
  description: 'Search for documents in parallel using multiple search terms',
  inputSchema: z.object({
    searchEmbeddings: z.array(z.object({
      term: z.string(),
      embedding: z.array(z.number())
    })),
    courseId: z.string()
  }),
  outputSchema: z.object({
    documents: z.array(z.object({
      id: z.string(),
      content: z.string(),
      relevance: z.number(),
      searchTerm: z.string()
    })),
    searchMetrics: z.object({
      totalSearches: z.number(),
      uniqueDocuments: z.number(),
      averageRelevance: z.number()
    })
  }),
  execute: async ({ inputData }) => {
    console.log('[RAG Enhanced] Starting parallel document search');
    
    // Create individual search steps for each embedding
    const searchSteps = inputData.searchEmbeddings.map((searchEmb, index) => 
      createStep({
        id: `search-${index}`,
        execute: async () => {
          // Perform vector search using the semantic search tool
          const runtimeContext = new RuntimeContext();
          runtimeContext.set('courseId', inputData.courseId);
          
          const searchResult = await semanticSearchTool.execute({
            context: {
              query: searchEmb.term,
              limit: workflowConfig.parallelSearch.resultsPerSearch
            },
            mastra: null as any, // Tool doesn't use mastra
            runtimeContext
          });
          
          // Enhance results with search term
          return searchResult.chunks.map(chunk => ({
            ...chunk,
            searchTerm: searchEmb.term
          }));
        }
      })
    );
    
    // Execute searches in parallel
    const searchResults = await Promise.all(
      searchSteps.map(step => step.execute({ 
        inputData: {}, 
        context: {} as any,
        mastra: null as any
      }))
    );
    
    // Deduplicate and rank results
    const documentMap = new Map<string, any>();
    let totalRelevance = 0;
    let totalDocs = 0;
    
    searchResults.forEach(results => {
      results.forEach(doc => {
        totalDocs++;
        totalRelevance += doc.similarity;
        
        const existing = documentMap.get(doc.doc_id);
        if (!existing || existing.similarity < doc.similarity) {
          documentMap.set(doc.doc_id, {
            id: doc.doc_id,
            content: doc.content,
            relevance: doc.similarity,
            searchTerm: doc.searchTerm
          });
        }
      });
    });
    
    // Sort by relevance and take top results
    const sortedDocuments = Array.from(documentMap.values())
      .filter(doc => doc.relevance >= workflowConfig.parallelSearch.minRelevanceScore)
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, workflowConfig.parallelSearch.maxUniqueDocuments);
    
    console.log(`[RAG Enhanced] Found ${documentMap.size} unique documents from ${inputData.searchEmbeddings.length} searches`);
    
    return {
      documents: sortedDocuments,
      searchMetrics: {
        totalSearches: inputData.searchEmbeddings.length,
        uniqueDocuments: documentMap.size,
        averageRelevance: totalDocs > 0 ? totalRelevance / totalDocs : 0
      }
    };
  }
});

// Step 4: Fetch full documents
const fetchFullDocumentsStep = createStep({
  id: 'fetch-full-documents',
  description: 'Fetch complete document content for top results',
  inputSchema: z.object({
    documents: z.array(z.object({
      id: z.string(),
      content: z.string(),
      relevance: z.number(),
      searchTerm: z.string()
    })),
    courseId: z.string()
  }),
  outputSchema: z.object({
    fullDocuments: z.array(z.object({
      id: z.string(),
      fileName: z.string(),
      content: z.string(),
      relevance: z.number()
    }))
  }),
  execute: async ({ inputData }) => {
    console.log('[RAG Enhanced] Fetching full documents for top results');
    
    // Take top N most relevant documents based on config
    const topDocs = inputData.documents.slice(0, workflowConfig.documentRetrieval.maxFullDocuments);
    
    // Fetch full documents in parallel
    const fullDocumentPromises = topDocs.map(async doc => {
      const runtimeContext = new RuntimeContext();
      runtimeContext.set('courseId', inputData.courseId);
      
      try {
        const fullDoc = await getFullDocumentTool.execute({
          context: { docId: doc.id },
          mastra: null as any,
          runtimeContext
        });
        
        return {
          id: doc.id,
          fileName: fullDoc.fileName,
          content: fullDoc.content,
          relevance: doc.relevance
        };
      } catch (error) {
        console.error(`[RAG Enhanced] Failed to fetch document ${doc.id}:`, error);
        // Return partial content if full fetch fails
        return {
          id: doc.id,
          fileName: 'Unknown',
          content: doc.content,
          relevance: doc.relevance
        };
      }
    });
    
    const fullDocuments = await Promise.all(fullDocumentPromises);
    
    console.log(`[RAG Enhanced] Fetched ${fullDocuments.length} full documents`);
    
    return { fullDocuments };
  }
});

// Step 5: Generate response with context
const generateContextualResponseStep = createStep({
  id: 'generate-contextual-response',
  description: 'Generate response using retrieved documents as context',
  inputSchema: z.object({
    question: z.string(),
    conversationHistory: z.array(z.any()),
    fullDocuments: z.array(z.object({
      id: z.string(),
      fileName: z.string(),
      content: z.string(),
      relevance: z.number()
    })),
    courseId: z.string().optional(),
    userId: z.string().optional(),
    timeZone: z.string().optional(),
    promptOverrides: z.any().optional()
  }),
  outputSchema: EnhancedRAGWorkflowOutputSchema,
  execute: async ({ inputData }) => {
    console.log('[RAG Enhanced] Generating response with document context');
    
    const startTime = Date.now();
    
    // Apply prompt overrides
    if (inputData.promptOverrides) {
      ConfigLoaderService.applyOverrides(inputData.promptOverrides as PromptOverrides);
    } else {
      ConfigLoaderService.applyOverrides(null);
    }
    
    // Clear stores
    if (inputData.courseId) {
      clearFlashcardStore(inputData.courseId);
      clearQuizStore(inputData.courseId);
    }
    
    // Get course context
    let courseContext = 'a college course';
    if (inputData.courseId) {
      const courseDetails = await SupabaseService.getCourseDetails(inputData.courseId);
      if (courseDetails) {
        courseContext = `${courseDetails.code} - ${courseDetails.title}`;
      }
    }
    
    const currentDate = SupabaseService.getFormattedDate(inputData.timeZone);
    
    // Format system prompt
    const contextualizedPrompt = ConfigLoaderService.formatPromptTemplate(
      await ConfigLoaderService.getSystemPrompt(),
      {
        courseDetails: courseContext,
        currentDate
      }
    );
    
    // Build document context with configurable length
    const documentContext = inputData.fullDocuments.map(doc => 
      `[Source: ${doc.fileName}]\n${doc.content.substring(0, workflowConfig.documentRetrieval.maxDocumentContentLength)}...`
    ).join('\n\n---\n\n');
    
    // Prepare messages with document context
    const messages = [
      ...inputData.conversationHistory,
      {
        role: 'system' as const,
        content: `Here are relevant documents from the course materials:\n\n${documentContext}`
      },
      {
        role: 'user' as const,
        content: inputData.question
      }
    ];
    
    // Create runtime context
    const runtimeContext = new RuntimeContext();
    if (inputData.courseId) {
      runtimeContext.set('courseId', inputData.courseId);
    }
    if (inputData.userId) {
      runtimeContext.set('userId', inputData.userId);
    }
    if (inputData.timeZone) {
      runtimeContext.set('timeZone', inputData.timeZone);
    }
    
    // Generate response
    const agent = await StudySpotAgent.getInstance();
    const agentResponse = await agent.generate(messages, {
      instructions: contextualizedPrompt,
      runtimeContext
    });
    
    // Collect resources
    const linkedDocumentIds = inputData.fullDocuments.map(doc => doc.id);
    const resourceIds: Array<{ type: 'document' | 'flashcard_set' | 'quiz'; id: string }> = 
      linkedDocumentIds.map(id => ({ type: 'document', id }));
    
    // Add any generated resources
    if (inputData.courseId) {
      const flashcardSetIds = getFlashcardSetsFromStore(inputData.courseId);
      flashcardSetIds.forEach(id => {
        resourceIds.push({ type: 'flashcard_set', id });
      });
      
      const quizIds = getQuizzesFromStore(inputData.courseId);
      quizIds.forEach(id => {
        resourceIds.push({ type: 'quiz', id });
      });
      
      // Clear stores
      clearFlashcardStore(inputData.courseId);
      clearQuizStore(inputData.courseId);
    }
    
    const processingTime = Date.now() - startTime;
    
    return {
      response: agentResponse.text,
      linkedDocumentIds,
      resourceIds,
      toolCalls: [],
      metadata: {
        ragUsed: true,
        documentsFound: inputData.fullDocuments.length,
        processingTime,
        queryType: 'factual',
        parallelSearches: inputData.fullDocuments.length
      }
    };
  }
});

// Step 6: Direct response (no RAG needed)
const generateDirectResponseStep = createStep({
  id: 'generate-direct-response',
  description: 'Generate response without document retrieval',
  inputSchema: z.object({
    question: z.string(),
    conversationHistory: z.array(z.any()),
    courseId: z.string().optional(),
    userId: z.string().optional(),
    timeZone: z.string().optional(),
    queryType: z.string(),
    promptOverrides: z.any().optional()
  }),
  outputSchema: EnhancedRAGWorkflowOutputSchema,
  execute: async ({ inputData }) => {
    console.log('[RAG Enhanced] Generating direct response (no RAG)');
    
    const startTime = Date.now();
    
    // Apply prompt overrides
    if (inputData.promptOverrides) {
      ConfigLoaderService.applyOverrides(inputData.promptOverrides as PromptOverrides);
    } else {
      ConfigLoaderService.applyOverrides(null);
    }
    
    // Clear stores
    if (inputData.courseId) {
      clearFlashcardStore(inputData.courseId);
      clearQuizStore(inputData.courseId);
    }
    
    // Get course context
    let courseContext = 'a college course';
    if (inputData.courseId) {
      const courseDetails = await SupabaseService.getCourseDetails(inputData.courseId);
      if (courseDetails) {
        courseContext = `${courseDetails.code} - ${courseDetails.title}`;
      }
    }
    
    const currentDate = SupabaseService.getFormattedDate(inputData.timeZone);
    
    // Format system prompt
    const contextualizedPrompt = ConfigLoaderService.formatPromptTemplate(
      await ConfigLoaderService.getSystemPrompt(),
      {
        courseDetails: courseContext,
        currentDate
      }
    );
    
    // Prepare messages
    const messages = [
      ...inputData.conversationHistory,
      {
        role: 'user' as const,
        content: inputData.question
      }
    ];
    
    // Create runtime context
    const runtimeContext = new RuntimeContext();
    if (inputData.courseId) {
      runtimeContext.set('courseId', inputData.courseId);
    }
    if (inputData.userId) {
      runtimeContext.set('userId', inputData.userId);
    }
    if (inputData.timeZone) {
      runtimeContext.set('timeZone', inputData.timeZone);
    }
    
    // Generate response
    const agent = await StudySpotAgent.getInstance();
    const agentResponse = await agent.generate(messages, {
      instructions: contextualizedPrompt,
      runtimeContext
    });
    
    // Collect any generated resources
    const resourceIds: Array<{ type: 'document' | 'flashcard_set' | 'quiz'; id: string }> = [];
    
    if (inputData.courseId) {
      const flashcardSetIds = getFlashcardSetsFromStore(inputData.courseId);
      flashcardSetIds.forEach(id => {
        resourceIds.push({ type: 'flashcard_set', id });
      });
      
      const quizIds = getQuizzesFromStore(inputData.courseId);
      quizIds.forEach(id => {
        resourceIds.push({ type: 'quiz', id });
      });
      
      // Clear stores
      clearFlashcardStore(inputData.courseId);
      clearQuizStore(inputData.courseId);
    }
    
    const processingTime = Date.now() - startTime;
    
    return {
      response: agentResponse.text,
      linkedDocumentIds: [],
      resourceIds,
      toolCalls: [],
      metadata: {
        ragUsed: false,
        documentsFound: 0,
        processingTime,
        queryType: inputData.queryType,
        parallelSearches: 0
      }
    };
  }
});

// Sub-workflow for RAG processing
const ragProcessingWorkflow = createWorkflow({
  id: 'rag-processing',
  description: 'Sub-workflow for document retrieval and processing',
  inputSchema: z.object({
    searchTerms: z.array(z.string()),
    courseId: z.string(),
    question: z.string(),
    conversationHistory: z.array(z.any()),
    userId: z.string().optional(),
    timeZone: z.string().optional(),
    promptOverrides: z.any().optional()
  }),
  outputSchema: EnhancedRAGWorkflowOutputSchema
})
  .then(generateSearchEmbeddingsStep)
  .then(parallelDocumentSearchStep)
  .then(fetchFullDocumentsStep)
  .then(generateContextualResponseStep)
  .commit();

/**
 * Enhanced RAG workflow with conditional execution and parallel processing
 */
export const enhancedRagWorkflow = createWorkflow({
  id: 'enhanced-rag-workflow',
  description: 'Modular RAG workflow with intent analysis and parallel document retrieval',
  inputSchema: EnhancedRAGWorkflowInputSchema,
  outputSchema: EnhancedRAGWorkflowOutputSchema
})
  .then(analyzeQueryIntentStep)
  .branch([
    // RAG path: retrieve documents then generate
    [async ({ inputData }) => inputData.needsRAG && inputData.searchTerms && inputData.searchTerms.length > 0, 
      ragProcessingWorkflow
    ],
    // Direct generation path (no RAG needed)
    [async ({ inputData }) => !inputData.needsRAG || !inputData.searchTerms || inputData.searchTerms.length === 0,
      generateDirectResponseStep
    ]
  ])
  .then(createStep({
    id: 'update-chat-session',
    description: 'Update chat session with response and resources',
    execute: async ({ inputData, context }) => {
      const workflowOutput = context.previousStepOutput;
      const { sessionId } = inputData;
      
      if (sessionId && workflowOutput) {
        try {
          await SupabaseService.updateAssistantMessageInChat(
            sessionId,
            workflowOutput.response,
            workflowOutput.resourceIds || []
          );
          console.log(`[RAG Enhanced] Successfully updated chat: ${sessionId}`);
        } catch (error) {
          console.error('[RAG Enhanced] Failed to update chat:', error);
        }
      }
      
      return workflowOutput;
    }
  }))
  .commit();

/**
 * Export the streaming version that uses the enhanced workflow
 */
export { RAGWorkflowStreaming } from './rag-workflow.js';

// Export types
export type EnhancedRAGWorkflowInput = z.infer<typeof EnhancedRAGWorkflowInputSchema>;
export type EnhancedRAGWorkflowOutput = z.infer<typeof EnhancedRAGWorkflowOutputSchema>;