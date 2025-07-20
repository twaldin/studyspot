import { Anthropic } from '@llamaindex/anthropic';
import type { ChatMessage, MessageType } from '@/lib/utils/llamaindex-imports';
import { z } from 'zod';
import logger from '@/lib/utils/logger';

// Simplified schema without model selection
export const ReformulationResponseSchema = z.object({
  ragNeeded: z.boolean().describe("Whether a RAG search is needed to answer the user's question. Set to false for simple greetings, off-topic questions, or when the conversation history is sufficient."),
  question: z.string().describe("The reformulated, standalone question if RAG is needed, otherwise the original question."),
  search_query: z.string().describe("A descriptive text summary of the information needed to retrieve the best query results. This is used for the vector search.")
});

export type ReformulationResponse = z.infer<typeof ReformulationResponseSchema>;

/**
 * Service responsible for query analysis and reformulation (no model selection)
 */
export class QueryService {
  private static readonly claudeModel = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
    model: 'claude-3-sonnet-latest',
  });

  /**
   * Formats the current date and time for context
   */
  private static getFormattedDate(timeZone?: string): string {
    const now = new Date();
    const timeZoneToUse = timeZone || 'UTC';
    const timeString = new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
      timeZone: timeZoneToUse
    }).format(now).replace(' ', '').toLowerCase();
    const dateString = new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      timeZone: timeZoneToUse
    }).format(now);
    return `It is currently ${timeString} on ${dateString}.`;
  }

  /**
   * Analyzes a user query and determines if RAG is needed and reformulates the question
   */
  static async reformulateQuestion(
    question: string,
    conversation: ChatMessage[],
    timeZone?: string
  ): Promise<ReformulationResponse> {
    const fullConversation: ChatMessage[] = [...conversation];
    fullConversation.push({ role: 'user' as MessageType, content: question });

    const responseFormatSample = {
      ragNeeded: true,
      question: "A standalone question reformulated from the user's message and chat history.",
      search_query: "A descriptive text summary of the information needed to retrieve the best query results. This is used for the vector search."
    };
    const currentDate = this.getFormattedDate(timeZone);

    const systemPrompt = `You are an intelligent assistant that analyzes user queries to decide if a search in a knowledge base is necessary (Retrieval-Augmented Generation).
${currentDate}. Use this information to resolve relative time references in the user's query (e.g., "this week", "on Tuesday").

Based on the conversation history and the latest user message, you will decide whether to perform a RAG search.
- RAG is NOT needed for simple greetings, generic chat, or if the conversation history contains enough information to answer.
- RAG IS needed for questions requiring specific details from documents (e.g., "course syllabus", "assignment details").

Your response MUST be a JSON object conforming to this structure:
${JSON.stringify(responseFormatSample, null, 2)}

- "ragNeeded": A boolean. "true" if RAG is needed, "false" otherwise.
- "question": If "ragNeeded" is true, this must be a standalone question that can be understood without the chat history. If "ragNeeded" is false, this should be the original user question.
- "search_query": If "ragNeeded" is true, this must be a descriptive text summary of the information needed to retrieve the best query results. This is used for the vector search. If "ragNeeded" is false, this should be an empty string.

Do NOT answer the question. Only output the JSON object.`;

    fullConversation.unshift({ role: 'system' as MessageType, content: systemPrompt });

    try {
      const response = await this.claudeModel.chat({ messages: fullConversation });

      const rawContent = response.message.content;
      let jsonString: string;

      if (typeof rawContent === 'string') {
        jsonString = rawContent;
      } else if (Array.isArray(rawContent) && rawContent.length > 0 && "text" in rawContent[0]) {
        jsonString = (rawContent[0] as any).text;
      } else {
        throw new Error("Unexpected LLM response content structure during reformulation.");
      }

      // Claude might wrap the JSON in ```json ... ```, so we need to extract it.
      const jsonMatch = jsonString.match(/```json\n([\s\S]*?)\n```/);
      if (jsonMatch && jsonMatch[1]) {
        jsonString = jsonMatch[1];
      }

      const parsedJson = JSON.parse(jsonString);
      const structuredOutput = ReformulationResponseSchema.parse(parsedJson);

      logger.debug({ structuredOutput }, "[QueryService - reformulateQuestion] Successfully parsed structured response from Claude.");
      return structuredOutput;

    } catch (error) {
      logger.error({ error, question }, "[QueryService - reformulateQuestion] Failed to get/parse structured response from Claude. Defaulting to RAG needed.");
      // Fallback in case of any error
      return {
        ragNeeded: true,
        question: question, // Use original question as a safe fallback
        search_query: question // Use original question as a safe fallback
      };
    }
  }

  /**
   * Determines if a question requires RAG search based on simple heuristics
   * (Fallback method when LLM reformulation fails)
   */
  static requiresRAG(question: string, conversation: ChatMessage[]): boolean {
    const lowercaseQuestion = question.toLowerCase();
    
    // Simple greetings and social interactions don't need RAG
    const greetingPatterns = [
      /^(hi|hello|hey|good morning|good afternoon|good evening)/i,
      /^(how are you|what's up|how's it going)/i,
      /^(thanks?|thank you|thx)/i,
      /^(bye|goodbye|see you|catch you)/i
    ];

    for (const pattern of greetingPatterns) {
      if (pattern.test(question)) {
        return false;
      }
    }

    // Questions about specific course content likely need RAG
    const ragIndicators = [
      'syllabus', 'assignment', 'homework', 'exam', 'quiz', 'deadline',
      'reading', 'chapter', 'textbook', 'notes', 'lecture', 'slide',
      'professor', 'instructor', 'office hours', 'when is', 'what is due'
    ];

    return ragIndicators.some(indicator => lowercaseQuestion.includes(indicator));
  }


  /**
   * Simple reformulation that makes a question standalone
   * (Fallback when LLM reformulation fails)
   */
  static simpleReformulation(question: string, conversation: ChatMessage[]): string {
    // If there's no conversation history, return the question as-is
    if (conversation.length === 0) {
      return question;
    }

    // Look for pronouns and context clues that might need expansion
    const pronounPatterns = [
      /\b(it|that|this|those|these|they|them)\b/gi,
      /\b(the above|previously mentioned|earlier)\b/gi
    ];

    let needsContext = false;
    for (const pattern of pronounPatterns) {
      if (pattern.test(question)) {
        needsContext = true;
        break;
      }
    }

    // If no context clues found, return original question
    if (!needsContext) {
      return question;
    }

    // For complex reformulation, we'd need more sophisticated logic
    // For now, just return the original question with a note
    return `${question} (Context: from our previous conversation)`;
  }

  /**
   * Fallback reformulation when the main LLM service fails
   */
  static fallbackReformulation(
    question: string,
    conversation: ChatMessage[],
    timeZone?: string
  ): ReformulationResponse {
    logger.info({ question }, "[QueryService - fallbackReformulation] Using fallback reformulation logic.");

    return {
      ragNeeded: this.requiresRAG(question, conversation),
      question: this.simpleReformulation(question, conversation),
      search_query: this.simpleReformulation(question, conversation)
    };
  }
}