import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient, queryKeys, mutationKeys, useAuthenticatedUser } from './base';
import {
  FlashcardSetWithCards,
  FlashcardSetResponse,
  SaveFlashcardSetRequest,
  SaveFlashcardSetResponse,
} from "@/lib/types/FlashcardTypes";

/**
 * Hook to fetch a flashcard set with all its cards
 */
export function useFlashcardSet(setId: string | undefined) {
  const { isAuthenticated } = useAuthenticatedUser();
  
  return useQuery({
    queryKey: [...queryKeys.flashcards.detail(setId || ''), 'with-cards'],
    queryFn: async (): Promise<FlashcardSetWithCards> => {
      if (!setId) {
        throw new Error('Set ID is required');
      }
      
      const response = await apiClient<FlashcardSetResponse>(`/flashcard-sets/${setId}`);
      
      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to fetch flashcard set');
      }
      
      return response.data;
    },
    enabled: !!setId && isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
}

/**
 * Hook to save a flashcard set as a new copy (collaborative editing)
 */
export function useSaveFlashcardSet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: mutationKeys.flashcards.save(),
    mutationFn: async ({
      originalSetId,
      flashcardSetData,
    }: {
      originalSetId: string;
      flashcardSetData: SaveFlashcardSetRequest;
    }): Promise<string> => {
      const response = await apiClient<SaveFlashcardSetResponse>(
        `/flashcard-sets/${originalSetId}/save`,
        {
          method: "POST",
          body: JSON.stringify(flashcardSetData),
        }
      );

      if (!response.success || !response.data) {
        throw new Error(response.error || "Failed to save flashcard set");
      }

      return response.data.set_id;
    },
    onSuccess: (newSetId) => {
      // Invalidate the new flashcard set to ensure fresh data
      queryClient.invalidateQueries({ 
        queryKey: [...queryKeys.flashcards.detail(newSetId), 'with-cards'] 
      });
      
      // Optionally, prefetch the new set
      queryClient.prefetchQuery({
        queryKey: [...queryKeys.flashcards.detail(newSetId), 'with-cards'],
        queryFn: async () => {
          const response = await apiClient<FlashcardSetResponse>(`/flashcard-sets/${newSetId}`);
          return response.data;
        },
      });
    },
    onError: (error) => {
      console.error("Error saving flashcard set:", error);
    },
  });
}

/**
 * Hook to prefetch a flashcard set (useful for navigation preparation)
 */
export function usePrefetchFlashcardSet() {
  const queryClient = useQueryClient();

  return (setId: string) => {
    queryClient.prefetchQuery({
      queryKey: [...queryKeys.flashcards.detail(setId), 'with-cards'],
      queryFn: async () => {
        const response = await apiClient<FlashcardSetResponse>(`/flashcard-sets/${setId}`);
        return response.data;
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  };
}

