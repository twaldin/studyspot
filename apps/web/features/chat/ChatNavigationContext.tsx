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
    // Immediate navigation if user is viewing the chat being deleted
    const currentPath = window.location.pathname;
    if (currentPath === `/chat/${chatId}`) {
      router.push('/');
    }
    
    // Start the mutation (which has optimistic updates in onMutate)
    deleteChatMutation.mutate(chatId, {
      onError: (error) => {
        // If we navigated away but deletion failed, we could navigate back
        // For now, just log - the optimistic UI update will be reverted
        logger.error({ chatId, error }, '[ChatNavigation] Failed to delete chat');
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