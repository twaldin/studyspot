'use client';

import React, { createContext, useContext, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useDeleteChat } from '@/hooks/api/chats';
import logger from '@/lib/logger';
// import posthog from 'posthog-js'; // TODO: Add posthog when needed

interface ChatNavigationContextType {
  // Navigation actions only (no message state)
  handleNewChat: () => void;
  handleChatSelect: (chatId: string) => void;
  handleDeleteChat: (chatId: string) => Promise<void>;
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

    // TODO: Add posthog tracking when needed
    // posthog.capture('chat_selected', { chat_id: chatId });
    console.log('Chat selected:', chatId);

    // Navigate to the chat page
    router.push(`/chat/${chatId}`);
  }, [router]);

  const handleDeleteChat = useCallback(async (chatId: string) => {
    try {
      await deleteChatMutation.mutateAsync(chatId);
      
      // Navigate to dashboard if we're currently viewing the deleted chat
      const currentPath = window.location.pathname;
      if (currentPath === `/chat/${chatId}`) {
        router.push('/');
      }

      logger.info({ chatId }, '[ChatNavigation] Deleted chat');
    } catch (error) {
      logger.error({ error, chatId }, '[ChatNavigation] Failed to delete chat');
      throw error;
    }
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