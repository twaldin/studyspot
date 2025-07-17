import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, queryKeys, mutationKeys, useAuthenticatedUser } from './base';
import { Chat, Message } from '@/features/chat/chat.types';
import logger from '@/lib/logger';

// Types
export interface ChatSummary {
  id: string;
  title: string;
  created_at: string;
}

export interface CreateChatRequest {
  title?: string;
  initialMessages: Array<{
    role: string;
    content: string;
    linkedDocumentIds?: string[];
  }>;
}

export interface UpdateChatRequest {
  messages: Array<{
    role: string;
    content: string;
    linkedDocumentIds?: string[];
  }>;
}

export interface UpdateChatResponse {
  title?: string;
}

// Chat list query
export function useChats() {
  const { schoolId, isAuthenticated } = useAuthenticatedUser();
  
  return useQuery({
    queryKey: queryKeys.chats.list(schoolId),
    queryFn: async () => {
      const response = await apiClient<{ chats: ChatSummary[] }>('/chats');
      return response.chats || [];
    },
    enabled: isAuthenticated && !!schoolId,
    staleTime: 5 * 60 * 1000, // 5 minutes for chat list
    refetchInterval: 30 * 1000, // Refetch every 30 seconds instead of on every focus
    refetchOnWindowFocus: false, // Prevent refetch on window focus to reduce API calls
    retry: (failureCount, error) => {
      // Don't retry on auth errors
      if (error && 'status' in error && [401, 403].includes((error as any).status)) {
        return false;
      }
      return failureCount < 2; // Limit retries to 2
    },
  });
}

// Individual chat query
export function useChat(chatId?: string, options?: { enabled?: boolean }) {
  const { isAuthenticated, schoolId } = useAuthenticatedUser();
  
  return useQuery({
    queryKey: queryKeys.chats.detail(chatId!),
    queryFn: async () => {
      // The API endpoint for fetching a chat requires a school context, 
      // which is implicitly handled by the server based on the user's session.
      // The schoolId is added to the `enabled` check to ensure the user's context is loaded.
      const response = await apiClient<{ data: Chat }>(`/chats/${chatId}`);
      if (!response.data) {
        throw new Error('Chat not found');
      }
      return response.data;
    },
    enabled: options?.enabled !== false && isAuthenticated && !!chatId && !!schoolId, // Ensure schoolId is loaded
    staleTime: 5 * 60 * 1000, // 5 minutes for individual chat
  });
}

// Create chat mutation
export function useCreateChat() {
  const queryClient = useQueryClient();
  const { schoolId } = useAuthenticatedUser();
  
  return useMutation({
    mutationKey: mutationKeys.chats.create,
    mutationFn: async (data: CreateChatRequest) => {
      const response = await apiClient<Chat>('/chats', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      return response;
    },
    onSuccess: (newChat) => {
      // Add to chats list cache
      queryClient.setQueryData(queryKeys.chats.list(schoolId), (old: ChatSummary[] | undefined) => {
        const chatSummary: ChatSummary = {
          id: newChat.id,
          title: newChat.title,
          created_at: newChat.created_at,
        };
        return [chatSummary, ...(old || [])];
      });
      
      // Set the new chat data
      queryClient.setQueryData(queryKeys.chats.detail(newChat.id), newChat);
      
      logger.info({ chatId: newChat.id }, 'Created new chat');
    },
    onError: (error) => {
      logger.error({ error }, 'Failed to create chat');
    },
  });
}

// Update chat mutation
export function useUpdateChat() {
  const queryClient = useQueryClient();
  const { schoolId } = useAuthenticatedUser();
  
  return useMutation({
    mutationKey: mutationKeys.chats.update,
    mutationFn: async ({ chatId, data }: { chatId: string; data: UpdateChatRequest }) => {
      const response = await apiClient<{ data: UpdateChatResponse }>(`/chats/${chatId}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
      return { chatId, messages: data.messages, ...response.data };
    },
    onSuccess: ({ chatId, title, messages }) => {
      // Update the individual chat cache with the complete message history
      if (messages) {
        queryClient.setQueryData(queryKeys.chats.detail(chatId), (oldData: any) => {
          if (!oldData) return oldData;
          
          // Update the chat data with complete message history
          const updatedData = {
            ...oldData,
            chats: messages
          };
          
          logger.info('Updated chat cache with complete message history', { chatId, messagesCount: messages.length });
          return updatedData;
        });
      }
      
      // Update title in chat list if changed
      if (title) {
        queryClient.setQueryData(queryKeys.chats.list(schoolId), (old: ChatSummary[] | undefined) =>
          old?.map(chat => chat.id === chatId ? { ...chat, title } : chat) || []
        );
      }
      
      logger.info({ chatId, newTitle: title }, 'Updated chat');
    },
    onError: (error) => {
      logger.error({ error }, 'Failed to update chat');
    },
  });
}

// Delete chat mutation
export function useDeleteChat() {
  const queryClient = useQueryClient();
  const { schoolId } = useAuthenticatedUser();

  return useMutation({
    mutationKey: mutationKeys.chats.delete,
    mutationFn: async (chatId: string) => {
      await apiClient(`/chats/${chatId}`, { method: "DELETE" });
      return chatId;
    },
    onMutate: async (deletedChatId: string) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({
        queryKey: queryKeys.chats.list(schoolId),
      });

      // Snapshot the previous value
      const previousChats = queryClient.getQueryData(
        queryKeys.chats.list(schoolId)
      );

      // Optimistically remove the chat from the list
      queryClient.setQueryData(
        queryKeys.chats.list(schoolId),
        (old: ChatSummary[] | undefined) =>
          old?.filter((chat) => chat.id !== deletedChatId) || []
      );

      // Return a context object with the snapshotted value
      return { previousChats };
    },
    onError: (err, deletedChatId, context) => {
      // Rollback to the previous state on error
      if (context?.previousChats) {
        queryClient.setQueryData(
          queryKeys.chats.list(schoolId),
          context.previousChats
        );
      }
      logger.error({ error: err, chatId: deletedChatId }, "Failed to delete chat");
    },
    onSettled: (deletedChatId) => {
      // Invalidate the chats list to refetch from the server and ensure consistency
      queryClient.invalidateQueries({
        queryKey: queryKeys.chats.list(schoolId),
      });

      // Also remove the individual chat cache if it exists
      if (deletedChatId) {
        queryClient.removeQueries({
          queryKey: queryKeys.chats.detail(deletedChatId),
        });
      }
    },
  });
}

// Select chat course mutation (switches user's selected course based on chat)
export function useSelectChatCourse() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationKey: mutationKeys.chats.selectCourse,
    mutationFn: async (chatId: string) => {
      const response = await apiClient<{ courseId: string | null; course: any }>(`/chats/${chatId}/select`, {
        method: 'POST',
      });
      return response;
    },
    onSuccess: (data) => {
      // Optimistically update the selected course cache if we have the course data
      if (data.course) {
        queryClient.setQueryData(queryKeys.user.selectedCourse(), data.course);
      }
      
      // Invalidate user-related caches since selected course changed
      queryClient.invalidateQueries({ queryKey: queryKeys.user.selectedCourse() });
      queryClient.invalidateQueries({ queryKey: queryKeys.user.profile() });
      
      // Invalidate suggested queries for the new course
      if (data.courseId) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.courses.suggestedQueries(data.courseId),
        });
      }
      
      logger.info('Updated selected course from chat');
    },
    onError: (error) => {
      logger.error({ error }, 'Failed to select chat course');
    },
  });
}

// Combined chat selection and course selection for faster navigation
export function useSelectChatAndNavigate() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationKey: mutationKeys.chats.selectAndNavigate,
    mutationFn: async (chatId: string) => {
      // Perform course selection API call
      const response = await apiClient<{ courseId: string | null; course: any }>(`/chats/${chatId}/select`, {
        method: 'POST',
      });
      return { chatId, ...response };
    },
    onSuccess: (data) => {
      // Optimistically update the selected course cache if we have the course data
      if (data.course) {
        queryClient.setQueryData(queryKeys.user.selectedCourse(), data.course);
      }
      
      // Invalidate user-related caches since selected course changed
      queryClient.invalidateQueries({ queryKey: queryKeys.user.selectedCourse() });
      queryClient.invalidateQueries({ queryKey: queryKeys.user.profile() });
      
      // Invalidate suggested queries for the new course
      if (data.courseId) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.courses.suggestedQueries(data.courseId),
        });
      }
      
      logger.info('Updated selected course and ready for navigation');
    },
    onError: (error) => {
      logger.error({ error }, 'Failed to select chat course');
    },
  });
}

// Preload chat data for performance optimization
export function usePreloadChat() {
  const queryClient = useQueryClient();
  const { isAuthenticated, schoolId } = useAuthenticatedUser();
  
  return (chatId: string) => {
    if (!isAuthenticated || !schoolId || !chatId) return;
    
    // Prefetch chat data if not already cached
    queryClient.prefetchQuery({
      queryKey: queryKeys.chats.detail(chatId),
      queryFn: async () => {
        const response = await apiClient<{ data: Chat }>(`/chats/${chatId}`);
        if (!response.data) {
          throw new Error('Chat not found');
        }
        return response.data;
      },
      staleTime: 5 * 60 * 1000,
    });
  };
}

// Update chat cache with new assistant message (for first message only)
export function useUpdateChatCache() {
  const queryClient = useQueryClient();
  const { schoolId } = useAuthenticatedUser();
  
  return useMutation({
    mutationKey: mutationKeys.chats.updateCache,
    mutationFn: async ({ chatId, userMessage, assistantMessage, linkedDocumentIds }: {
      chatId: string;
      userMessage: string;
      assistantMessage: string;
      linkedDocumentIds: string[];
    }) => {
      // This doesn't make an API call, just updates the cache
      return { chatId, userMessage, assistantMessage, linkedDocumentIds };
    },
    onSuccess: ({ chatId, userMessage, assistantMessage, linkedDocumentIds }) => {
      // Update the individual chat cache
      queryClient.setQueryData(queryKeys.chats.detail(chatId), (oldData: any) => {
        if (!oldData) return oldData;
        
        const newMessages = [
          { role: 'user', content: userMessage },
          { role: 'assistant', content: assistantMessage, linkedDocumentIds }
        ];
        
        // Update the chat data with new messages
        const updatedData = {
          ...oldData,
          chats: newMessages
        };
        
        logger.info('Updated chat cache with new assistant message', { chatId, messagesCount: newMessages.length });
        return updatedData;
      });
    },
    onError: (error) => {
      logger.error({ error }, 'Failed to update chat cache');
    },
  });
}

// Update chat cache with full conversation history (for subsequent messages)
export function useUpdateChatCacheWithHistory() {
  const queryClient = useQueryClient();
  const { schoolId } = useAuthenticatedUser();
  
  return useMutation({
    mutationKey: mutationKeys.chats.updateCacheWithHistory,
    mutationFn: async ({ chatId, messages }: {
      chatId: string;
      messages: Array<{ role: string; content: string; linkedDocumentIds?: string[] }>;
    }) => {
      // This doesn't make an API call, just updates the cache
      return { chatId, messages };
    },
    onSuccess: ({ chatId, messages }) => {
      // Update the individual chat cache with full conversation
      queryClient.setQueryData(queryKeys.chats.detail(chatId), (oldData: any) => {
        if (!oldData) return oldData;
        
        // Update the chat data with complete message history
        const updatedData = {
          ...oldData,
          chats: messages
        };
        
        logger.info('Updated chat cache with full conversation history', { chatId, messagesCount: messages.length });
        return updatedData;
      });
    },
    onError: (error) => {
      logger.error({ error }, 'Failed to update chat cache with history');
    },
  });
}