import { geminiService } from '@/lib/services/ai/gemini.service';
import { openAIService } from '@/lib/services/ai/openai.service';
import logger from '@/lib/logger';

export interface TitleGenerationParams {
  content: string;
  fallbackTitle?: string;
}

/**
 * Generate meaningful chat titles using AI
 */
export async function generateChatTitle(params: TitleGenerationParams): Promise<string> {
  try {
    const { content, fallbackTitle } = params;

    // Check if it's just a greeting first
    if (isOnlyGenericGreeting(content)) {
      return 'New Chat';
    }

    const prompt = `Generate a very concise title (maximum 4 words) for this chat message. The title should be specific and descriptive, never generic like 'Simple Greeting' or 'New Message'. Focus on the main topic or question. Don't use quotes. Message: "${content}"`;
    
    let response;
    let responseText;
    let usedProvider = 'gemini';
    
    try {
      // Try Gemini first
      response = await geminiService.chat([{ role: 'user', content: prompt }]);
      if (response.success) {
        responseText = response.data;
      } else {
        throw new Error('Gemini returned unsuccessful response');
      }
    } catch (geminiError) {
      logger.warn('[ChatTitleGenerator] Gemini failed, trying OpenAI fallback');
      usedProvider = 'openai';
      
      try {
        // Fallback to OpenAI
        response = await openAIService.chatCompletion([{ role: 'user', content: prompt }], {
          model: 'gpt-4o-mini',
          temperature: 0.7,
          maxTokens: 20
        });
        
        if (!response.success) {
          logger.error('[ChatTitleGenerator] OpenAI service also returned unsuccessful response');
          return getFallbackTitle(content, fallbackTitle);
        }
        
        responseText = response.data;
      } catch (openaiError) {
        logger.error('[ChatTitleGenerator] Both Gemini and OpenAI failed');
        return getFallbackTitle(content, fallbackTitle);
      }
    }

    // Clean up Gemini's response
    const title = String(responseText)
      .trim()
      .replace(/["']/g, '') // Remove quotes
      .replace(/^Title:?\s*/i, '') // Remove "Title:" prefix if present
      .substring(0, 50); // Enforce max length as safety

    // Don't accept generic titles from Gemini
    if (title.toLowerCase().includes('greeting') || 
        title.toLowerCase().includes('simple') ||
        title.toLowerCase().includes('new message')) {
      return getFallbackTitle(content, fallbackTitle);
    }

    if (title) {
      logger.info({ originalContent: content.substring(0, 50), generatedTitle: title, provider: usedProvider }, '[ChatTitleGenerator] Generated chat title');
      return title;
    }
    
    return getFallbackTitle(content, fallbackTitle);

  } catch (error) {
    logger.warn({ 
      error: error instanceof Error ? error.message : 'Unknown error', 
      content: params.content.substring(0, 50) 
    }, '[ChatTitleGenerator] Failed to generate title with Gemini, using fallback');
    
    return getFallbackTitle(params.content, params.fallbackTitle);
  }
}

/**
 * Generate a meaningful title from initial messages
 * Handles greeting detection and fallback logic
 */
export async function generateMeaningfulTitle(messages: Array<{ role: string; content: string; linkedDocumentIds?: string[] }>): Promise<string> {
  try {
    // Find the first user message
    const firstUserMessage = messages.find(msg => msg.role === 'user');
    
    if (!firstUserMessage) {
      return 'New Chat';
    }

    // If it's just a greeting, look for the next user message
    if (isOnlyGenericGreeting(firstUserMessage.content)) {
      const secondUserMessage = messages.find(msg => 
        msg.role === 'user' && msg !== firstUserMessage
      );
      if (secondUserMessage) {
        return generateChatTitle({ content: secondUserMessage.content });
      } else {
        return 'New Chat';
      }
    }

    // Use the first message if it's not just a greeting
    return generateChatTitle({ content: firstUserMessage.content });

  } catch (error) {
    logger.warn({ error: error instanceof Error ? error.message : 'Unknown error', messageCount: messages.length }, '[ChatTitleGenerator] Failed to generate meaningful title, using fallback');
    return 'New Chat';
  }
}

/**
 * Check if a message is only a generic greeting
 */
function isOnlyGenericGreeting(message: string): boolean {
  const greetings = [
    'hello', 'hi', 'hey', 'greetings', 'good morning', 
    'good afternoon', 'good evening', 'howdy', 'hi there', 'hello there'
  ];
  
  const cleanMessage = message.toLowerCase().trim();
  return greetings.some(greeting => 
    cleanMessage === greeting || 
    cleanMessage === greeting + '.' ||
    cleanMessage === greeting + '!' ||
    cleanMessage === greeting + '?'
  );
}

/**
 * Get fallback title when AI generation fails
 */
function getFallbackTitle(content: string, fallbackTitle?: string): string {
  // For greeting-only messages, always return 'New Chat'
  if (isOnlyGenericGreeting(content)) {
    return 'New Chat';
  }

  // For non-greeting content, use a cleaned version as fallback
  const generatedFallback = fallbackTitle || content
    .split('\n')[0]
    .trim()
    .replace(/[?!.]$/, '')
    .substring(0, 50);
  
  return generatedFallback || 'New Chat';
}