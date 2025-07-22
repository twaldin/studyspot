import { PromptConfig } from '../types/prompt-config.types';
import { AssistantApiRequest, StreamingResponse, TestResponse } from '../types/testing.types';

export class AssistantApiProxyService {
  private baseUrl: string;

  constructor(baseUrl: string = 'http://localhost:3001') {
    this.baseUrl = baseUrl;
  }

  private getDeveloperToken(): string {
    // TODO: In a real implementation, this would get the actual Clerk session token
    // For now, return a placeholder that indicates developer mode
    // This would need to be replaced with actual Clerk authentication
    return 'dev-panel-token-placeholder';
  }

  async executeQueryWithPromptConfig(
    query: string,
    courseId: string,
    promptConfig: PromptConfig,
    sessionId?: string
  ): Promise<TestResponse> {
    const startTime = Date.now();
    const responseId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    try {
      // Create a modified request that includes prompt overrides
      const requestBody = {
        question: query,
        conversationHistory: [],
        courseId,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        sessionId: sessionId || responseId,
        // Add prompt configuration overrides
        promptOverrides: this.buildPromptOverrides(promptConfig)
      };

      console.log('[AssistantApiProxy] Sending request with prompt overrides:', {
        url: `${this.baseUrl}/api/chat/stream`,
        hasOverrides: !!requestBody.promptOverrides,
        token: this.getDeveloperToken()
      });

      const response = await fetch(`${this.baseUrl}/api/chat/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Prompt-Override': 'true' // Signal to Assistant API that we're overriding prompts
        },
        body: JSON.stringify(requestBody),
      });

      console.log('[AssistantApiProxy] Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[AssistantApiProxy] Error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
      }

      const result = await this.processStreamingResponse(response, responseId, startTime);
      return result;

    } catch (error) {
      const responseTime = Date.now() - startTime;
      return {
        responseId,
        content: '',
        linkedDocumentIds: [],
        responseTime,
        streamingChunks: 0,
        usedExpectedDocument: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private buildPromptOverrides(config: PromptConfig) {
    return {
      systemPrompt: this.processPromptTemplate(config.systemPrompt),
      ragDecisionPrompt: this.processPromptTemplate(config.ragDecisionPrompt),
      queryReformulationPrompt: config.queryReformulationPrompt,
      toolDescription: config.toolDescription,
      contextFormatting: config.contextFormatting,
      responseFormat: config.responseFormat,
      mathFormatting: config.mathFormatting,
      personality: config.personality
    };
  }

  private processPromptTemplate(template: string): string {
    // Process template variables that might be in the prompt
    const currentDate = `Current date and time: ${new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })}`;
    
    return template
      .replace('{currentDate}', currentDate)
      .replace('{courseDetails}', 'the course') // Will be replaced by actual course details in Assistant API
      .replace('{responseFormat}', '{"ragNeeded": boolean, "question": string, "search_query": string}');
  }

  private async processStreamingResponse(
    response: Response,
    responseId: string,
    startTime: number
  ): Promise<TestResponse> {
    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    
    let fullResponse = '';
    let linkedDocumentIds: string[] = [];
    let streamingChunks = 0;
    let connected = false;

    if (!reader) {
      throw new Error('No response body reader available');
    }

    try {
      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n').filter(line => line.trim() !== '');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data: StreamingResponse = JSON.parse(line.slice(6));
              
              if (data.connected) {
                connected = true;
                console.log(`[${responseId}] Connected to Assistant API with prompt override`);
              } else if (data.chunk) {
                fullResponse += data.chunk;
                streamingChunks++;
              } else if (data.done) {
                linkedDocumentIds = data.linkedDocumentIds || [];
                console.log(`[${responseId}] Completed with prompt override. Documents: ${linkedDocumentIds.length}`);
                break;
              } else if (data.error) {
                throw new Error(data.error);
              }
            } catch (parseError) {
              console.warn(`[${responseId}] Failed to parse streaming data:`, line);
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }

    const responseTime = Date.now() - startTime;

    return {
      responseId,
      content: fullResponse,
      linkedDocumentIds,
      responseTime,
      streamingChunks,
      usedExpectedDocument: false, // Will be set by comparison runner
    };
  }

  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/health`, {
        method: 'GET',
      });
      return response.ok;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  }
}