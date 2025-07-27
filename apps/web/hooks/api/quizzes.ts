import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient, queryKeys, mutationKeys, useAuthenticatedUser } from './base';
import {
  QuizWithQuestions,
  QuizResponse,
  SaveQuizRequest,
  SaveQuizResponse,
} from "@/lib/types/QuizTypes";

/**
 * Hook to fetch a quiz with all its questions
 */
export function useQuiz(quizId: string | undefined) {
  const { isAuthenticated } = useAuthenticatedUser();
  
  return useQuery({
    queryKey: [...queryKeys.quizzes.detail(quizId || ''), 'with-questions'],
    queryFn: async (): Promise<QuizWithQuestions> => {
      if (!quizId) {
        throw new Error('Quiz ID is required');
      }
      
      const response = await apiClient<QuizResponse>(`/quizzes/${quizId}`);
      
      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to fetch quiz');
      }
      
      return response.data;
    },
    enabled: !!quizId && isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
}

/**
 * Hook to save a quiz as a new copy (collaborative editing)
 */
export function useSaveQuiz() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: mutationKeys.quizzes.save(),
    mutationFn: async ({
      originalQuizId,
      quizData,
    }: {
      originalQuizId: string;
      quizData: SaveQuizRequest;
    }): Promise<string> => {
      const response = await apiClient<SaveQuizResponse>(
        `/quizzes/${originalQuizId}/save`,
        {
          method: "POST",
          body: JSON.stringify({ quizData }),
        }
      );

      if (!response.success || !response.data) {
        throw new Error(response.error || "Failed to save quiz");
      }

      return response.data.quiz_id;
    },
    onSuccess: (newQuizId) => {
      // Invalidate the new quiz to ensure fresh data
      queryClient.invalidateQueries({ 
        queryKey: [...queryKeys.quizzes.detail(newQuizId), 'with-questions'] 
      });
      
      // Optionally, prefetch the new quiz
      queryClient.prefetchQuery({
        queryKey: [...queryKeys.quizzes.detail(newQuizId), 'with-questions'],
        queryFn: async () => {
          const response = await apiClient<QuizResponse>(`/quizzes/${newQuizId}`);
          return response.data;
        },
      });
    },
    onError: (error) => {
      console.error("Error saving quiz:", error);
    },
  });
}


/**
 * Hook to prefetch a quiz (useful for navigation preparation)
 */
export function usePrefetchQuiz() {
  const queryClient = useQueryClient();

  return (quizId: string) => {
    queryClient.prefetchQuery({
      queryKey: [...queryKeys.quizzes.detail(quizId), 'with-questions'],
      queryFn: async () => {
        const response = await apiClient<QuizResponse>(`/quizzes/${quizId}`);
        return response.data;
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  };
}