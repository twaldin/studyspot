// src/features/chat/chat.types.ts

// Resource types that can be linked in chat messages
export type LinkedResourceType = 'document' | 'flashcard_set';

// Simple linked resource from API (only type and id)
export interface LinkedResourceRef {
  type: LinkedResourceType;
  id: string;
}

// Full document resource (after fetching details)
export interface DocumentResource {
  id: string;
  type: 'document';
  title: string;
  file_type: string;
  file_url: string;
}

// Full flashcard set resource (after fetching details)
export interface FlashcardSetResource {
  id: string;
  type: 'flashcard_set';
  title: string;
  description?: string;
  cardCount: number;
}

// Unified resource interface for chat display
export type LinkedResource = DocumentResource | FlashcardSetResource;

// Represents a message in a chat session
export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  linkedResources?: LinkedResource[];
  linkedResourceRefs?: LinkedResourceRef[]; // Raw refs from API
}

// Represents a full chat object with all messages
export interface Chat {
  id: string;
  title: string;
  created_at: string;
  course_id: string;
  chats: Array<{
    role: 'user' | 'assistant';
    content: string;
    linkedResources?: LinkedResource[];
  }>;
}

// Represents a chat summary for display in lists
export interface ChatSummary {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  course_id: string;
}