'use client';

import React, { createContext, useContext, useCallback, useState } from 'react';
import { LinkedResource } from '@/features/chat/chat.types';

interface OptimisticChat {
  tempId: string;
  userMessage: string;
  courseId: string;
  createdAt: Date;
  status: 'creating' | 'created' | 'failed';
  realChatId?: string;
  error?: string;
}

interface StreamingChat {
  chatId: string;
  title: string;
  isStreaming: boolean;
  createdAt: Date;
  partialAssistantMessage?: string;
  linkedResources?: LinkedResource[];
}

interface StreamingChatContextType {
  streamingChats: StreamingChat[];
  setStreamingStatus: (chatId: string, title: string, isStreaming: boolean) => void;
  updateStreamingMessage: (chatId: string, partialMessage: string, linkedResources?: LinkedResource[]) => void;
  getStreamingMessage: (chatId: string) => { message: string; linkedResources?: LinkedResource[] } | undefined;
  isStreaming: (chatId: string) => boolean;
  getChatTitle: (chatId: string) => string | undefined;
  // Optimistic chat methods
  addOptimisticChat: (tempId: string, userMessage: string, courseId: string) => void;
  updateOptimisticChat: (tempId: string, realChatId: string) => void;
  failOptimisticChat: (tempId: string, error: string) => void;
  getOptimisticChat: (tempId: string) => OptimisticChat | undefined;
  isOptimisticChatReady: (tempId: string) => boolean;
  removeOptimisticChat: (tempId: string) => void;
}

const StreamingChatContext = createContext<StreamingChatContextType | undefined>(undefined);

export const useStreamingChats = () => {
  const context = useContext(StreamingChatContext);
  if (context === undefined) {
    throw new Error('useStreamingChats must be used within a StreamingChatProvider');
  }
  return context;
};

// Legacy hook name for backward compatibility
export const usePendingChats = useStreamingChats;

export const StreamingChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [streamingChats, setStreamingChats] = useState<StreamingChat[]>([]);
  const [optimisticChats, setOptimisticChats] = useState<OptimisticChat[]>([]);

  // Optimistic chat methods
  const addOptimisticChat = useCallback((tempId: string, userMessage: string, courseId: string) => {
    console.log('Adding optimistic chat:', { tempId, userMessage: userMessage.substring(0, 50) });
    setOptimisticChats(prev => [
      ...prev.filter(chat => chat.tempId !== tempId), // Remove existing if any
      {
        tempId,
        userMessage,
        courseId,
        createdAt: new Date(),
        status: 'creating'
      }
    ]);
  }, []);

  const updateOptimisticChat = useCallback((tempId: string, realChatId: string) => {
    console.log('Updating optimistic chat with real ID:', { tempId, realChatId });
    setOptimisticChats(prev => 
      prev.map(chat => 
        chat.tempId === tempId 
          ? { ...chat, status: 'created' as const, realChatId }
          : chat
      )
    );
  }, []);

  const failOptimisticChat = useCallback((tempId: string, error: string) => {
    console.log('Failing optimistic chat:', { tempId, error });
    setOptimisticChats(prev => 
      prev.map(chat => 
        chat.tempId === tempId 
          ? { ...chat, status: 'failed' as const, error }
          : chat
      )
    );
  }, []);

  const getOptimisticChat = useCallback((tempId: string) => {
    return optimisticChats.find(chat => chat.tempId === tempId);
  }, [optimisticChats]);

  const isOptimisticChatReady = useCallback((tempId: string) => {
    const chat = optimisticChats.find(chat => chat.tempId === tempId);
    return chat?.status === 'created' && !!chat.realChatId;
  }, [optimisticChats]);

  const removeOptimisticChat = useCallback((tempId: string) => {
    console.log('Removing optimistic chat:', { tempId });
    setOptimisticChats(prev => prev.filter(chat => chat.tempId !== tempId));
  }, []);

  const setStreamingStatus = useCallback((chatId: string, title: string, isStreaming: boolean) => {
    console.log('Setting streaming status:', { chatId, title, isStreaming });
    setStreamingChats(prev => {
      const existingIndex = prev.findIndex(chat => chat.chatId === chatId);
      
      if (existingIndex >= 0) {
        // Update existing chat
        const newChats = [...prev];
        newChats[existingIndex] = {
          ...newChats[existingIndex],
          title,
          isStreaming,
          // Clear partial message when streaming stops
          ...(isStreaming ? {} : { partialAssistantMessage: undefined, linkedDocumentIds: undefined })
        };
        return newChats;
      } else {
        // Add new streaming chat
        const newChats = [
          ...prev,
          { chatId, title, isStreaming, createdAt: new Date() }
        ];
        return newChats;
      }
    });
  }, []);

  const updateStreamingMessage = useCallback((chatId: string, partialMessage: string, linkedResources?: LinkedResource[]) => {
    console.log('Updating streaming message:', { chatId, messageLength: partialMessage.length });
    setStreamingChats(prev => {
      const existingIndex = prev.findIndex(chat => chat.chatId === chatId);
      
      if (existingIndex >= 0) {
        const newChats = [...prev];
        newChats[existingIndex] = {
          ...newChats[existingIndex],
          partialAssistantMessage: partialMessage,
          linkedResources,
        };
        return newChats;
      }
      // If chat doesn't exist, don't add it (should be added via setStreamingStatus first)
      return prev;
    });
  }, []);

  const getStreamingMessage = useCallback((chatId: string) => {
    const chat = streamingChats.find(chat => chat.chatId === chatId);
    if (chat?.partialAssistantMessage) {
      return {
        message: chat.partialAssistantMessage,
        linkedResources: chat.linkedResources
      };
    }
    return undefined;
  }, [streamingChats]);

  const isStreaming = useCallback((chatId: string) => {
    const chat = streamingChats.find(chat => chat.chatId === chatId);
    return chat?.isStreaming || false;
  }, [streamingChats]);

  const getChatTitle = useCallback((chatId: string) => {
    const chat = streamingChats.find(chat => chat.chatId === chatId);
    return chat?.title;
  }, [streamingChats]);


  // Legacy methods for backward compatibility
  const addPendingChat = useCallback((chatId: string, title: string) => {
    setStreamingStatus(chatId, title, true);
  }, [setStreamingStatus]);

  const removePendingChat = useCallback((chatId: string) => {
    setStreamingStatus(chatId, getChatTitle(chatId) || '', false);
  }, [setStreamingStatus, getChatTitle]);

  const isPending = useCallback((chatId: string) => {
    return isStreaming(chatId);
  }, [isStreaming]);

  const contextValue: StreamingChatContextType = {
    streamingChats,
    setStreamingStatus,
    updateStreamingMessage,
    getStreamingMessage,
    isStreaming,
    getChatTitle,
    // Optimistic chat methods
    addOptimisticChat,
    updateOptimisticChat,
    failOptimisticChat,
    getOptimisticChat,
    isOptimisticChatReady,
    removeOptimisticChat,
  };

  // Also provide legacy interface
  const legacyValue = {
    pendingChats: streamingChats.filter(chat => chat.isStreaming),
    addPendingChat,
    removePendingChat,
    isPending,
    ...contextValue,
  };

  return (
    <StreamingChatContext.Provider value={legacyValue as any}>
      {children}
    </StreamingChatContext.Provider>
  );
};

// Legacy provider name for backward compatibility  
export const PendingChatProvider = StreamingChatProvider;