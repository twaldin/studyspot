'use client';

import React, { createContext, useContext, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useDeleteChat } from '@/hooks/api/chats';
import logger from '@/lib/logger';
// 

interface ChatNavigationContextType {
  // Navigation actions only (no message state)
  handleNewChat: () => void;
  handleChatSelect: (chatId: string) => void;
  handleDeleteChat: (chatId: string) => void;
}

const ChatNavigationContext = createContext<ChatNavigationContextType | undefined>(undefined);

export const useChatNavigation = () => {
  const context = useContext(ChatNavigationContext);
  if (context === undefined) {
    throw new Error('useChatNavigation must be used within a ChatNavigationProvider');
  }
  return context;
};

export const ChatNavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const deleteChatMutation = useDeleteChat();

  const handleNewChat = useCallback(() => {
    router.push('/');
  }, [router]);

  const handleChatSelect = useCallback((chatId: string) => {
    if (!chatId) return;

    
    
    console.log('Chat selected:', chatId);

    // Navigate to the chat page
    router.push(`/chat/${chatId}`);
  }, [router]);

  const handleDeleteChat = useCallback((chatId: string) => {
    deleteChatMutation.mutate(chatId, {
      onSuccess: () => {
        const currentPath = window.location.pathname;
        if (currentPath === `/chat/${chatId}`) {
          router.push('/');
        }
        logger.info({ chatId }, '[ChatNavigation] Optimistically deleted chat');
      },
      onError: (error) => {
        // Error is already logged in the mutation hook
        // We could add a toast notification here if needed
        // For now, the UI will revert automatically
      },
    });
  }, [deleteChatMutation, router]);

  const contextValue: ChatNavigationContextType = {
    handleNewChat,
    handleChatSelect,
    handleDeleteChat,
  };

  return (
    <ChatNavigationContext.Provider value={contextValue}>
      {children}
    </ChatNavigationContext.Provider>
  );
};