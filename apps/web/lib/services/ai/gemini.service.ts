import { AIMessage, AIResponse, GeminiConfig } from "@/lib/types/AITypes";
import logger from "@/lib/logger";

class GeminiService {
  private async getModel() {
    const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("Google/Gemini API key not configured");
    }
    // Dynamically import to reduce bundle size
    const { google } = await import('@ai-sdk/google');
    return google('gemini-2.5-flash', {
      apiKey
    });
  }

  async chat(
    messages: AIMessage[],
    config: GeminiConfig = {},
  ): Promise<AIResponse<string>> {
    try {
      const model = await this.getModel();
      
      // Dynamically import AI SDK to reduce bundle size
      const { generateText } = await import('ai');

      const result = await generateText({
        model,
        messages: messages.map((m) => ({
          role: m.role as "user" | "assistant" | "system",
          content: m.content,
        })),
        temperature: config.temperature || 0.7,
        maxOutputTokens: config.maxTokens || 2048,
        // Disable thinking for simple queries to avoid empty responses
        providerOptions: config.disableThinking === true ? {
          google: {
            thinkingConfig: {
              thinkingBudget: 0,  // 0 disables thinking completely
              includeThoughts: false
            }
          }
        } : undefined
      });

      // Check if result.text is empty
      if (!result.text || result.text.trim() === '') {
        logger.warn({ 
          messages, 
          config,
          resultText: result.text,
          usage: result.usage,
          disableThinking: config.disableThinking,
          finishReason: result.finishReason,
          response: result.response
        }, "Gemini returned empty response");
        return {
          success: false,
          data: "",
          provider: "gemini",
          model: "gemini-2.5-flash",
          error: "Empty response from Gemini"
        };
      }

      return {
        success: true,
        data: result.text,
        provider: "gemini",
        model: "gemini-2.5-flash",
      };
    } catch (error) {
      logger.error({ error }, "Gemini chat failed");
      return {
        success: false,
        data: "",
        provider: "gemini",
        model: "gemini-2.5-flash",
        error: error instanceof Error ? error.message : "Unknown error"
      };
    }
  }
}

export const geminiService = new GeminiService();
