import { Agent } from '@mastra/core';
import { anthropic } from '@ai-sdk/anthropic';
import { ConfigLoaderService } from '../../services/config-loader.service.js';
import { SupabaseService } from '../../services/supabase.service.js';

/**
 * Response schema for simple query analysis (RAG decision only)
 */
export interface QueryAnalysisResult {
  ragNeeded: boolean;
  question: string;
  search_query: string;
  reasoning: string;
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
   * Simple query analysis to determine if RAG is needed
   */
  static async analyzeQuery(
    question: string,
    conversationHistory: any[] = [],
    timeZone?: string,
    courseId?: string
  ): Promise<QueryAnalysisResult> {
    try {
      const agent = await this.getInstance();
      const currentDate = SupabaseService.getFormattedDate(timeZone);
      
      // Get course context if available
      let courseContext = 'General academic context';
      if (courseId) {
        const courseDetails = await SupabaseService.getCourseDetails(courseId);
        if (courseDetails) {
          courseContext = `${courseDetails.code} - ${courseDetails.title}`;
        }
      }

      const ragDecisionPrompt = `
You are an expert at determining whether a student query requires searching through course materials.

Context:
- Course: ${courseContext}
- Current Date: ${currentDate}
- Previous conversation: ${conversationHistory.map(msg => `${msg.role}: ${msg.content}`).join('\n')}

Query: "${question}"

Determine if this query requires searching through course documents and materials (RAG needed) or if it can be answered with general knowledge.

RAG IS NEEDED for:
- Questions about specific course content, concepts, or materials
- Requests to create study materials (quizzes, flashcards) from course content
- Questions that reference course-specific information
- Questions about assignments, exams, or course logistics

RAG IS NOT NEEDED for:
- General academic questions that don't require course-specific materials
- Basic concept explanations that are universally applicable
- Simple calculations or formulas

Return structured JSON with:
{
  "ragNeeded": true/false,
  "reasoning": "brief explanation of why RAG is or isn't needed",
  "search_query": "if RAG needed, provide optimized search query, otherwise empty string"
}`;

      console.log(`[QueryReformulationAgent] Running RAG decision analysis for: "${question.substring(0, 100)}${question.length > 100 ? '...' : ''}"`);

      // Generate analysis
      const response = await agent.generate([
        {
          role: 'user',
          content: ragDecisionPrompt
        }
      ]);

      // Parse JSON response
      try {
        console.log(`[QueryReformulationAgent] Raw LLM response: ${response.text.substring(0, 500)}...`);
        
        // Extract JSON from response (handle potential markdown wrapping)
        const jsonMatch = response.text.match(/```json\n([\s\S]*?)\n```/) || response.text.match(/\{[\s\S]*\}/);
        const jsonString = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : response.text;
        
        console.log(`[QueryReformulationAgent] Extracted JSON string: ${jsonString}`);
        
        const parsed = JSON.parse(jsonString);
        console.log(`[QueryReformulationAgent] Parsed JSON:`, parsed);
        
        const analysisResult: QueryAnalysisResult = {
          ragNeeded: parsed.ragNeeded !== undefined ? parsed.ragNeeded : true,
          question: question,
          search_query: parsed.search_query || question,
          reasoning: parsed.reasoning || 'Basic RAG decision'
        };
        
        console.log(`[QueryReformulationAgent] Analysis result: RAG needed: ${analysisResult.ragNeeded}`);
        return analysisResult;
        
      } catch (parseError) {
        console.warn('[QueryReformulationAgent] Failed to parse LLM response, using fallback:', parseError);
        // Fallback: assume RAG is needed
        return {
          ragNeeded: true,
          question: question,
          search_query: question,
          reasoning: 'Fallback - assuming RAG needed due to parsing error'
        };
      }

    } catch (error) {
      console.error('[QueryReformulationAgent] Error analyzing query:', error);
      
      // Fallback result
      return {
        ragNeeded: true,
        question: question,
        search_query: question,
        reasoning: 'Fallback due to analysis error'
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