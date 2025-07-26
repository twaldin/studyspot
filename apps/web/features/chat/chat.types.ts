// src/features/chat/chat.types.ts

// Resource types that can be linked in chat messages
export type LinkedResourceType = 'document' | 'flashcard_set';

// Unified resource interface for chat display
export interface LinkedResource {
  id: string;
  type: LinkedResourceType;
  title: string;
  description?: string;
  metadata?: {
    // For documents
    file_type?: string;
    file_url?: string;
    // For flashcard sets
    cardCount?: number;
    // Future resource types can add their own metadata
  };
}

// Represents a message in a chat session
export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  linkedResources?: LinkedResource[];
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