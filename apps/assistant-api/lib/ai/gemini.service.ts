import { Gemini, GEMINI_MODEL } from "@/lib/utils/llamaindex-imports";
import { AIMessage, AIResponse, GeminiConfig } from "@/lib/types/AITypes";
import logger from "@/lib/utils/logger";

class GeminiService {
  private client: Gemini;

  constructor() {
    this.client = new Gemini({
      apiKey: process.env.GOOGLE_API_KEY,
      model: GEMINI_MODEL.GEMINI_PRO_FLASH_LATEST,
    });
  }

  async chat(
    messages: AIMessage[],
    config: GeminiConfig = {},
  ): Promise<AIResponse<string>> {
    try {
      if (!process.env.GOOGLE_API_KEY) {
        throw new Error("Google API key not configured");
      }

      const response = await this.client.chat({
        messages: messages.map((m) => ({
          role: m.role as "user" | "assistant" | "system",
          content: m.content,
        })),
      });

      let content = "";
      if (response && typeof response === "object" && "message" in response) {
        const geminiResponse = response as any;
        const messageContent = geminiResponse.message?.content;
        if (typeof messageContent === "string") {
          content = messageContent;
        } else if (Array.isArray(messageContent) && messageContent.length > 0) {
          const textContent = messageContent.find(
            (item: any) => "type" in item && item.type === "text",
          );
          content = textContent?.text || "";
        }
      }

      return {
        success: true,
        data: content,
        provider: "gemini",
        model: config.model || GEMINI_MODEL.GEMINI_PRO_FLASH_LATEST,
      };
    } catch (error) {
      logger.error({ error }, "Gemini chat failed");
      throw error;
    }
  }

  async generateText(prompt: string, config: GeminiConfig = {}): Promise<string> {
    const messages: AIMessage[] = [
      { role: "user", content: prompt }
    ];

    const response = await this.chat(messages, config);
    if (!response.success || !response.data) {
      throw new Error("Failed to generate text with Gemini");
    }

    return response.data;
  }
}

// Export singleton instance
export const geminiService = new GeminiService();
export default geminiService;