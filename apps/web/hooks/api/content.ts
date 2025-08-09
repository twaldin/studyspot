import { useQuery } from '@tanstack/react-query';
import { queryKeys } from './base';

export interface ContentFlashcardSet {
  id: string;
  type: 'flashcard_set';
  title: string;
  description?: string;
  cardCount: number;
  created_by: string;
  visibility_mode: 'private' | 'link-only' | 'course';
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface ContentQuiz {
  id: string;
  type: 'quiz';
  title: string;
  description?: string;
  questionCount: number;
  created_by: string;
  visibility_mode: 'private' | 'link-only' | 'course';
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export type ContentItem = ContentFlashcardSet | ContentQuiz;

// Hook for fetching flashcard sets
export function useContentFlashcards(courseId?: string) {
  return useQuery({
    queryKey: queryKeys.content.flashcards(courseId),
    queryFn: async (): Promise<ContentFlashcardSet[]> => {
      if (!courseId) throw new Error('Course ID is required');
      
      const response = await fetch(`/api/content/flashcards?courseId=${courseId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch flashcards');
      }
      
      const data = await response.json();
      return data.flashcardSets;
    },
    enabled: !!courseId,
  });
}

// Hook for fetching quizzes
export function useContentQuizzes(courseId?: string) {
  return useQuery({
    queryKey: queryKeys.content.quizzes(courseId),
    queryFn: async (): Promise<ContentQuiz[]> => {
      if (!courseId) throw new Error('Course ID is required');
      
      const response = await fetch(`/api/content/quizzes?courseId=${courseId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch quizzes');
      }
      
      const data = await response.json();
      return data.quizzes;
    },
    enabled: !!courseId,
  });
}