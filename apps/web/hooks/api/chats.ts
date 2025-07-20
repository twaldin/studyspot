import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, queryKeys, mutationKeys, useAuthenticatedUser } from './base';
import { useUserSchool } from "./user"; // Import useUserSchool
import { Chat, Message } from '@/features/chat/chat.types';
import logger from '@/lib/logger';
import { rateLimiter, RATE_LIMITS } from '@/lib/utils/rate-limiter';

// Types
export interface ChatSummary {
  id: string;
  title: string;
  created_at: string;
  course_id: string;
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
  const { data: school, isLoading: isSchoolLoading } = useUserSchool();
  const schoolId = school?.id;
  const { isAuthenticated, joinedCourses } = useAuthenticatedUser();
  
  return useQuery({
    queryKey: [...queryKeys.chats.list(schoolId), 'joined-courses', joinedCourses],
    queryFn: async () => {
      const response = await apiClient<{ chats: ChatSummary[] }>('/chats');
      const allChats = response.chats || [];
      
      const filteredChats = allChats.filter(chat => 
        joinedCourses.includes(chat.course_id)
      );
      
      logger.info({ 
        totalChats: allChats.length, 
        filteredChats: filteredChats.length,
        joinedCourses: joinedCourses.length 
      }, 'Filtered chats by joined courses');
      
      return filteredChats;
    },
    enabled: isAuthenticated && !!schoolId && !isSchoolLoading,
    staleTime: 1 * 60 * 1000,
    refetchInterval: 30 * 1000,
    refetchOnWindowFocus: false,
    retry: (failureCount, error) => {
      if (error && 'status' in error && [401, 403].includes((error as any).status)) {
        return false;
      }
      return failureCount < 2;
    },
  });
}

// Individual chat query
export function useChat(chatId?: string, options?: { enabled?: boolean }) {
  const { data: school, isLoading: isSchoolLoading } = useUserSchool();
  const schoolId = school?.id;
  const { isAuthenticated } = useAuthenticatedUser();
  
  return useQuery({
    queryKey: queryKeys.chats.detail(chatId!),
    queryFn: async () => {
      const response = await apiClient<{ data: Chat }>(`/chats/${chatId}`);
      if (!response.data) {
        throw new Error('Chat not found');
      }
      return response.data;
    },
    enabled: (options?.enabled ?? true) && isAuthenticated && !!chatId && !!schoolId && !isSchoolLoading,
    staleTime: 5 * 60 * 1000,
  });
}

// Create chat mutation
export function useCreateChat() {
  const queryClient = useQueryClient();
  const { data: school } = useUserSchool();
  const schoolId = school?.id;
  
  return useMutation({
    mutationKey: mutationKeys.chats.create,
    mutationFn: async (data: CreateChatRequest) => {
      if (rateLimiter.checkRateLimit('/chats', RATE_LIMITS.CHAT_MESSAGES)) {
        throw new Error('Rate limit exceeded for chat creation');
      }
      
      const response = await apiClient<Chat>('/chats', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      return response;
    },
    onSuccess: (newChat) => {
      queryClient.setQueryData(queryKeys.chats.list(schoolId), (old: ChatSummary[] | undefined) => {
        const chatSummary: ChatSummary = {
          id: newChat.id,
          title: newChat.title,
          created_at: newChat.created_at,
          course_id: newChat.course_id,
        };
        return [chatSummary, ...(old || [])];
      });
      
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
  const { data: school } = useUserSchool();
  const schoolId = school?.id;
  
  return useMutation({
    mutationKey: mutationKeys.chats.update,
    mutationFn: async ({ chatId, data }: { chatId: string; data: UpdateChatRequest }) => {
      if (rateLimiter.checkRateLimit(`/chats/${chatId}`, RATE_LIMITS.CHAT_MESSAGES)) {
        throw new Error('Rate limit exceeded for chat updates');
      }
      
      const response = await apiClient<{ data: UpdateChatResponse }>(`/chats/${chatId}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
      return { chatId, messages: data.messages, ...response.data };
    },
    onSuccess: ({ chatId, title, messages }) => {
      if (messages) {
        queryClient.setQueryData(queryKeys.chats.detail(chatId), (oldData: any) => {
          if (!oldData) return oldData;
          
          const updatedData = {
            ...oldData,
            chats: messages
          };
          
          logger.info('Updated chat cache with complete message history', { chatId, messagesCount: messages.length });
          return updatedData;
        });
      }
      
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
  const { data: school } = useUserSchool();
  const schoolId = school?.id;

  return useMutation({
    mutationKey: mutationKeys.chats.delete,
    mutationFn: async (chatId: string) => {
      await apiClient(`/chats/${chatId}`, { method: "DELETE" });
      return chatId;
    },
    onMutate: async (deletedChatId: string) => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.chats.list(schoolId),
      });

      const previousChats = queryClient.getQueryData(
        queryKeys.chats.list(schoolId)
      );

      queryClient.setQueryData(
        queryKeys.chats.list(schoolId),
        (old: ChatSummary[] | undefined) =>
          old?.filter((chat) => chat.id !== deletedChatId) || []
      );

      return { previousChats };
    },
    onError: (err, deletedChatId, context) => {
      if (context?.previousChats) {
        queryClient.setQueryData(
          queryKeys.chats.list(schoolId),
          context.previousChats
        );
      }
      logger.error({ error: err, chatId: deletedChatId }, "Failed to delete chat");
    },
    onSettled: (deletedChatId) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.chats.list(schoolId),
      });

      if (deletedChatId) {
        queryClient.removeQueries({
          queryKey: queryKeys.chats.detail(deletedChatId),
        });
      }
    },
  });
}

// ... (rest of the file remains the same)


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
      // Update the selected course cache if we have the course data
      if (data.course) {
        queryClient.setQueryData(queryKeys.user.selectedCourse(), data.course);
      }
      
      // Only invalidate user profile, not the selected course (we just set it)
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
    onMutate: async (chatId) => {
      // Cancel any outgoing queries for selected course
      await queryClient.cancelQueries({
        queryKey: queryKeys.user.selectedCourse(),
      });
      
      // Get the previous selected course for rollback
      const previousSelectedCourse = queryClient.getQueryData(
        queryKeys.user.selectedCourse(),
      );
      
      // Try to get the chat data to extract course info for optimistic update
      const chatsQueryData = queryClient.getQueriesData({
        queryKey: queryKeys.chats.all
      });
      
      let chats: ChatSummary[] | undefined;
      if (chatsQueryData.length > 0) {
        chats = chatsQueryData[0][1] as ChatSummary[] | undefined;
      }
      
      const chat = chats?.find(c => c.id === chatId);
      if (chat?.course_id) {
        // Get course data for optimistic update
        const allCourses = queryClient.getQueryData(
          queryKeys.courses.all
        ) as any[] | undefined;
        
        const course = allCourses?.find(c => c.id === chat.course_id);
        if (course) {
          queryClient.setQueryData(queryKeys.user.selectedCourse(), course);
        }
      }
      
      return { previousSelectedCourse };
    },
    onSuccess: (data) => {
      // Update the selected course cache if we have the course data
      if (data.course) {
        queryClient.setQueryData(queryKeys.user.selectedCourse(), data.course);
      }
      
      // Only invalidate user profile, not the selected course (we just set it)
      queryClient.invalidateQueries({ queryKey: queryKeys.user.profile() });
      
      // Invalidate suggested queries for the new course
      if (data.courseId) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.courses.suggestedQueries(data.courseId),
        });
      }
      
      logger.info('Updated selected course and ready for navigation');
    },
    onError: (error, chatId, context) => {
      // Rollback optimistic update on error
      if (context?.previousSelectedCourse !== undefined) {
        queryClient.setQueryData(
          queryKeys.user.selectedCourse(),
          context.previousSelectedCourse,
        );
      }
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