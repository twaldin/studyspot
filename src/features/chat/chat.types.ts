// src/features/chat/chat.types.ts

// Represents a message in a chat session
export interface Message {
  id: string;
  content: string;
  type: 'user' | 'assistant';
  linkedDocumentIds?: string[];
}

// Represents a full chat object with all messages
export interface Chat {
  id: string;
  title: string;
  created_at: string;
  chats: Array<{
    role: 'user' | 'assistant';
    content: string;
    linkedDocumentIds?: string[];
  }>;
}

// Represents a chat summary for display in lists
export interface ChatSummary {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}