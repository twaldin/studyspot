import logger from "@/lib/logger";
import { Message, LinkedResource, LinkedResourceRef } from "@/features/chat/chat.types";

export interface StreamingContext {
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  messageContent: string;
  conversationHistory: Array<
    { role: string; content: string; linkedResources?: LinkedResource[] }
  >;
  isNewChat: boolean;
  chatId?: string; // Chat ID for database operations
  userId?: string; // User ID for flashcard generation
  router: any;
  selectedCourse: any;
  setIsReplying: React.Dispatch<React.SetStateAction<boolean>>;
  updateStreamingMessage?: (
    chatId: string,
    partialMessage: string,
    linkedResources?: LinkedResource[],
  ) => void;
  setToolActivity?: React.Dispatch<React.SetStateAction<string | null>>;
  setIsTextStreaming?: React.Dispatch<React.SetStateAction<boolean>>;
  setStreamingStatus?: (chatId: string, title: string, isStreaming: boolean) => void;
  updateChatCache?: (data: { chatId: string; messages: Array<{ role: string; content: string; linkedDocumentIds?: string[] }> }) => void;
}


/**
 * ChatStreamingService - Utility functions for streaming (no longer handles actual streaming)
 * 
 * NOTE: This service now only contains utility functions. 
 * Actual streaming is handled by PersistentStreamClient.
 */
export class ChatStreamingService {
  private static instance: ChatStreamingService;

  public static getInstance(): ChatStreamingService {
    if (!ChatStreamingService.instance) {
      ChatStreamingService.instance = new ChatStreamingService();
    }
    return ChatStreamingService.instance;
  }

  private constructor() { }

  /**
   * Filters out thinking content from the assistant response
   * Removes everything from <thinking> tags until the closing </thinking> tag is found
   */
  public filterThinkingContent(content: string): { 
    filtered: string; 
    hasActiveThinking: boolean; 
    hasThinkingContent: boolean; 
  } {
    // Ensure content is a string
    if (typeof content !== 'string') {
      console.warn('[ChatStreaming] filterThinkingContent received non-string content:', typeof content, content);
      return { 
        filtered: String(content || ''), 
        hasActiveThinking: false, 
        hasThinkingContent: false 
      };
    }
    
    // Check if there's any thinking content (complete or incomplete)
    const hasThinkingContent = content.includes('<thinking>') || content.includes('[thinking]');
    
    // Remove complete thinking blocks (case-insensitive, handles multiline)
    let filtered = content.replace(/<thinking[^>]*>[\s\S]*?<\/thinking>/gi, '');
    
    // Also handle markdown-style thinking blocks that might be used
    filtered = filtered.replace(/\[thinking\][\s\S]*?\[\/thinking\]/gi, '');
    
    // Check if there's an unclosed thinking tag (active thinking)
    const hasUncloseThinking = filtered.search(/<thinking[^>]*>/i) !== -1;
    const hasUncloseThinkingAlt = filtered.search(/\[thinking\]/i) !== -1;
    const hasActiveThinking = hasUncloseThinking || hasUncloseThinkingAlt;
    
    // If there's an unclosed <thinking> tag, remove everything from that point
    const thinkingStart = filtered.search(/<thinking[^>]*>/i);
    if (thinkingStart !== -1) {
      filtered = filtered.substring(0, thinkingStart);
    }
    
    // If there's an unclosed [thinking] tag, remove everything from that point
    const thinkingStartAlt = filtered.search(/\[thinking\]/i);
    if (thinkingStartAlt !== -1) {
      filtered = filtered.substring(0, thinkingStartAlt);
    }
    
    return { 
      filtered: filtered.trim(), 
      hasActiveThinking, 
      hasThinkingContent 
    };
  }

  /**
   * Convert simple type/id refs to full LinkedResource objects
   */
  public async convertRefsToResources(refs: LinkedResourceRef[]): Promise<LinkedResource[]> {
    const resources: LinkedResource[] = [];
    
    try {
      // Batch fetch documents
      const documentIds = refs.filter(ref => ref.type === 'document').map(ref => ref.id);
      if (documentIds.length > 0) {
        const response = await fetch(`/api/docs?ids=${documentIds.join(',')}`);
        if (response.ok) {
          const data = await response.json();
          if (data.docs) {
            for (const doc of data.docs) {
              resources.push({
                id: doc.id,
                type: 'document',
                title: doc.file_name || 'Unknown Document',
                file_type: doc.file_type || 'unknown',
                file_url: doc.file_url || ''
              });
            }
          }
        }
      }

      // Fetch flashcard sets individually 
      const flashcardRefs = refs.filter(ref => ref.type === 'flashcard_set');
      for (const ref of flashcardRefs) {
        const response = await fetch(`/api/flashcard-sets/${ref.id}`);
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            const set = data.data;
            resources.push({
              id: ref.id,
              type: 'flashcard_set',
              title: set.title || 'Untitled Flashcard Set',
              description: set.description,
              cardCount: set.card_count || 0
            });
          }
        }
      }

      // Fetch quiz sets individually 
      const quizRefs = refs.filter(ref => ref.type === 'quiz');
      for (const ref of quizRefs) {
        const response = await fetch(`/api/quizzes/${ref.id}`);
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            const quiz = data.data;
            resources.push({
              id: ref.id,
              type: 'quiz',
              title: quiz.title || 'Untitled Quiz',
              description: quiz.description,
              questionCount: quiz.question_count || 0,
              difficultyLevel: quiz.difficulty_level
            });
          }
        }
      }
      
      logger.info(`Converted ${refs.length} refs to ${resources.length} full resources`);
      return resources;
    } catch (error) {
      logger.error('Failed to convert refs to resources:', error);
      return [];
    }
  }

}

// Export singleton instance
export const chatStreamingService = ChatStreamingService.getInstance();