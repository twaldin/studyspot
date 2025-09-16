'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';

const getQuizStateQueryKey = (quizId: string) => ['quiz', quizId, 'state'];

interface QuizState {
  quizStarted: boolean;
}

export const useQuizState = (quizId: string) => {
  return useQuery<QuizState>({
    queryKey: getQuizStateQueryKey(quizId),
    queryFn: async () => ({ quizStarted: false }),
    initialData: { quizStarted: false },
    staleTime: Infinity,
    gcTime: Infinity,
    enabled: !!quizId, // Only run this query when quizId is available
  });
};

export const useUpdateQuizState = (quizId: string) => {
  const queryClient = useQueryClient();
  return {
    startQuiz: () => {
      queryClient.setQueryData(getQuizStateQueryKey(quizId), { quizStarted: true });
    },
  };
};
