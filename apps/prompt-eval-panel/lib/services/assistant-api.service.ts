import { AssistantApiRequest, StreamingResponse, TestResponse } from '../types/testing.types';

export class AssistantApiService {
  private baseUrl: string;

  constructor(baseUrl: string = 'http://localhost:3001') {
    this.baseUrl = baseUrl;
  }

  async executeQuery(
    query: string,
    courseId: string,
    sessionId?: string
  ): Promise<TestResponse> {
    const startTime = Date.now();
    const responseId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    try {
      const requestBody: AssistantApiRequest = {
        question: query,
        conversationHistory: [],
        courseId,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        sessionId: sessionId || responseId
      };

      const response = await fetch(`${this.baseUrl}/api/chat/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
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
                console.log(`[${responseId}] Connected to Assistant API`);
              } else if (data.chunk) {
                fullResponse += data.chunk;
                streamingChunks++;
              } else if (data.done) {
                linkedDocumentIds = data.linkedDocumentIds || [];
                console.log(`[${responseId}] Completed. Documents: ${linkedDocumentIds.length}`);
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
      usedExpectedDocument: false, // Will be set by test runner
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