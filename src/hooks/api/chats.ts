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
    staleTime: 2 * 60 * 1000, // 2 minutes for chat list
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
    staleTime: 1 * 60 * 1000, // 1 minute for individual chat
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
      return { chatId, ...response.data };
    },
    onSuccess: ({ chatId, title }) => {
      // Update chat cache
      queryClient.invalidateQueries({ queryKey: queryKeys.chats.detail(chatId) });
      
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
      await apiClient(`/chats/${chatId}`, { method: 'DELETE' });
      return chatId;
    },
    onSuccess: (deletedChatId) => {
      // Invalidate the chats list to refetch from the server
      queryClient.invalidateQueries({ queryKey: queryKeys.chats.list(schoolId) });
      
      // Remove individual chat cache
      queryClient.removeQueries({ queryKey: queryKeys.chats.detail(deletedChatId) });
      
      logger.info({ chatId: deletedChatId }, 'Deleted chat');
    },
    onError: (error) => {
      logger.error({ error }, 'Failed to delete chat');
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
    onSuccess: () => {
      // Invalidate user-related caches since selected course changed
      queryClient.invalidateQueries({ queryKey: queryKeys.user.selectedCourse() });
      queryClient.invalidateQueries({ queryKey: queryKeys.user.profile() });
      
      logger.info('Updated selected course from chat');
    },
    onError: (error) => {
      logger.error({ error }, 'Failed to select chat course');
    },
  });
}