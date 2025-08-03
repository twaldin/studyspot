import { generateChatTitle as generateTitleAI } from '@/lib/services/ai/ai-sdk-service';
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

    // Use AI SDK service to generate title
    const title = await generateTitleAI([content]);
    
    // Don't accept generic titles
    if (title.toLowerCase().includes('greeting') || 
        title.toLowerCase().includes('simple') ||
        title.toLowerCase().includes('new message') ||
        title === 'New Chat') {
      return getFallbackTitle(content, fallbackTitle);
    }

    if (title) {
      logger.info({ originalContent: content.substring(0, 50), generatedTitle: title }, '[ChatTitleGenerator] Generated chat title with AI SDK');
      return title;
    }
    
    return getFallbackTitle(content, fallbackTitle);

  } catch (error) {
    logger.warn({ 
      error: error instanceof Error ? error.message : 'Unknown error', 
      content: params.content.substring(0, 50) 
    }, '[ChatTitleGenerator] Failed to generate title with AI SDK, using fallback');
    
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