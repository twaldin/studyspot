import { Anthropic } from "@/lib/utils/llamaindex-imports";
import { AIMessage, AIResponse, ClaudeConfig } from "@/lib/types/AITypes";
import logger from "@/lib/utils/logger";

class AnthropicService {
  private client: Anthropic;

  constructor() {
    this.client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
      model: "claude-3-7-sonnet-latest",
    });
  }

  async chat(
    messages: AIMessage[],
    config: ClaudeConfig = {},
  ): Promise<AIResponse<string>> {
    try {
      if (!process.env.ANTHROPIC_API_KEY) {
        throw new Error("Anthropic API key not configured");
      }

      const response = await this.client.chat({
        messages: messages.map((m) => ({
          role: m.role as "user" | "assistant" | "system",
          content: m.content,
        })),
      });

      let content = "";
      if (response && typeof response === "object" && "message" in response) {
        const claudeResponse = response as any;
        const messageContent = claudeResponse.message?.content;
        if (typeof messageContent === "string") {
          content = messageContent;
        } else if (Array.isArray(messageContent) && messageContent.length > 0) {
          const textContent = messageContent.find(
            (item: any): item is { text: string } => "text" in item,
          );
          content = textContent?.text || "";
        }
      }

      return {
        success: true,
        data: content,
        provider: "claude",
        model: config.model || "claude-3-7-sonnet-latest",
      };
    } catch (error) {
      logger.error({ error }, "Claude chat failed");
      throw error;
    }
  }
}

export const anthropicService = new AnthropicService();
