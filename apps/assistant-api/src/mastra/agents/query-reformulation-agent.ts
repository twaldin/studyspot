import { Agent } from '@mastra/core';
import { anthropic } from '@ai-sdk/anthropic';
import { ConfigLoaderService } from '../../services/config-loader.service.js';
import { SupabaseService } from '../../services/supabase.service.js';

/**
 * Response schema for query reformulation
 */
export interface QueryReformulationResult {
  ragNeeded: boolean;
  question: string;
  search_query: string;
}

/**
 * Specialized agent for query analysis and reformulation
 * Determines if RAG is needed and reformulates queries for vector search
 */
export class QueryReformulationAgent {
  private static instance: Agent | null = null;

  /**
   * Get or create the query reformulation agent instance
   */
  static async getInstance(): Promise<Agent> {
    if (!this.instance) {
      await this.createAgent();
    }
    return this.instance!;
  }

  /**
   * Create the query reformulation agent
   */
  private static async createAgent(): Promise<void> {
    try {
      const ragDecisionPrompt = await ConfigLoaderService.getRAGDecisionPrompt();

      console.log('[QueryReformulationAgent] Creating query reformulation agent');

      this.instance = new Agent({
        name: 'query-reformulation-agent',
        description: 'Analyzes user queries to determine if RAG search is needed and reformulates queries for optimal retrieval',
        instructions: ragDecisionPrompt,
        model: anthropic('claude-3-5-sonnet-20241022')
      });

      console.log('[QueryReformulationAgent] Agent created successfully');
    } catch (error) {
      console.error('[QueryReformulationAgent] Failed to create agent:', error);
      throw error;
    }
  }

  /**
   * Analyze a query and determine if RAG is needed
   */
  static async analyzeQuery(
    question: string,
    conversationHistory: any[] = [],
    timeZone?: string
  ): Promise<QueryReformulationResult> {
    try {
      const agent = await this.getInstance();
      const currentDate = SupabaseService.getFormattedDate(timeZone);

      // Format the RAG decision prompt with current date
      const contextualizedPrompt = ConfigLoaderService.formatPromptTemplate(
        await ConfigLoaderService.getRAGDecisionPrompt(),
        {
          currentDate,
          responseFormat: JSON.stringify({
            ragNeeded: "boolean",
            question: "string - standalone question if ragNeeded is true, otherwise original question",
            search_query: "string - descriptive search terms if ragNeeded is true, otherwise empty string"
          }, null, 2)
        }
      );

      // Prepare the analysis prompt
      const analysisPrompt = `${contextualizedPrompt}

Conversation History:
${conversationHistory.map(msg => `${msg.role}: ${msg.content}`).join('\n')}

Latest User Message: "${question}"

Analyze this query and respond with the required JSON format.`;

      console.log(`[QueryReformulationAgent] Analyzing query: "${question.substring(0, 100)}${question.length > 100 ? '...' : ''}"`);

      // Generate analysis
      const response = await agent.generate([
        {
          role: 'user',
          content: analysisPrompt
        }
      ], {
        instructions: contextualizedPrompt
      });

      // Parse JSON response
      let analysisResult: QueryReformulationResult;
      try {
        // Extract JSON from response (handle potential markdown wrapping)
        const jsonMatch = response.text.match(/```json\n([\s\S]*?)\n```/) || response.text.match(/\{[\s\S]*\}/);
        const jsonString = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : response.text;
        
        const parsed = JSON.parse(jsonString);
        analysisResult = {
          ragNeeded: parsed.ragNeeded || false,
          question: parsed.question || question,
          search_query: parsed.search_query || ''
        };
      } catch (parseError) {
        console.warn('[QueryReformulationAgent] Failed to parse JSON response, falling back to defaults:', parseError);
        // Fallback: assume RAG is needed for most queries
        analysisResult = {
          ragNeeded: true,
          question: question,
          search_query: question
        };
      }

      console.log(`[QueryReformulationAgent] Analysis result: RAG needed: ${analysisResult.ragNeeded}, reformulated: "${analysisResult.question.substring(0, 50)}${analysisResult.question.length > 50 ? '...' : ''}"`);

      return analysisResult;

    } catch (error) {
      console.error('[QueryReformulationAgent] Error analyzing query:', error);
      
      // Fallback result
      return {
        ragNeeded: true,
        question: question,
        search_query: question
      };
    }
  }

  /**
   * Reformulate a query for better vector search results
   */
  static async reformulateForSearch(
    question: string,
    conversationHistory: any[] = []
  ): Promise<string> {
    try {
      const queryReformulationPrompt = await ConfigLoaderService.getQueryReformulationPrompt();
      
      const reformulationPrompt = `${queryReformulationPrompt}

Conversation History:
${conversationHistory.map(msg => `${msg.role}: ${msg.content}`).join('\n')}

User Query: "${question}"

Create a standalone search query that captures the essential information needed from the knowledge base:`;

      const agent = await this.getInstance();
      
      console.log(`[QueryReformulationAgent] Reformulating query for search: "${question.substring(0, 50)}${question.length > 50 ? '...' : ''}"`);

      const response = await agent.generate([
        {
          role: 'user',
          content: reformulationPrompt
        }
      ]);

      const reformulatedQuery = response.text.trim();
      
      console.log(`[QueryReformulationAgent] Reformulated query: "${reformulatedQuery.substring(0, 50)}${reformulatedQuery.length > 50 ? '...' : ''}"`);

      return reformulatedQuery;

    } catch (error) {
      console.error('[QueryReformulationAgent] Error reformulating query:', error);
      return question; // Fallback to original question
    }
  }

  /**
   * Refresh the agent configuration
   */
  static async refreshConfiguration(): Promise<void> {
    this.instance = null;
    await this.createAgent();
    console.log('[QueryReformulationAgent] Configuration refreshed');
  }
}