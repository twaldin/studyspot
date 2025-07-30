/**
 * Type definitions for the quiz feature
 */

export interface QuizQuestion {
  id: string;
  quiz_id: string;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: 'A' | 'B' | 'C' | 'D';
  explanation?: string;
  order_index: number;
  created_at?: string;
  updated_at?: string;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  course_id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  edited_from?: string; // Foreign key to original quiz
  difficulty_level?: 'easy' | 'medium' | 'hard';
  is_public?: boolean;
  // Computed fields for display
  question_count?: number;
  creator_name?: string;
  creator_profile_image?: string;
  course_name?: string;
  course_code?: string;
  original_title?: string; // Title of the original quiz if this is an edit
  is_owned_by_current_user?: boolean; // Whether current user owns this quiz
}

export interface QuizWithQuestions extends Quiz {
  questions: QuizQuestion[];
}

// Study mode types
export type StudyMode = 'random' | 'ordered';
export type QuizMode = 'initial' | 'review' | 'retake' | 'practice';

export interface StudySettings {
  mode: StudyMode;
}

export interface StudyProgress {
  currentQuestionIndex: number;
  answeredQuestions: Set<string>; // question ids that have been answered
  correctAnswers: Set<string>; // question ids that were answered correctly
  userAnswers: Map<string, 'A' | 'B' | 'C' | 'D'>; // question id -> user's selected answer
  totalQuestions: number;
  isComplete: boolean;
  score: number; // percentage (0-100)
}

export interface QuestionAnswerState {
  questionId: string;
  selectedAnswer?: 'A' | 'B' | 'C' | 'D';
  isCorrect?: boolean;
  showFeedback: boolean;
  hasAnswered: boolean;
}

export interface StudyState {
  settings: StudySettings;
  progress: StudyProgress;
  shuffledQuestions?: QuizQuestion[];
  currentAnswerState: QuestionAnswerState;
  quizMode: QuizMode;
}

// Edit mode types
export interface QuizQuestionEdit {
  id: string;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: 'A' | 'B' | 'C' | 'D';
  explanation?: string;
  isModified: boolean;
}

export interface EditState {
  editedQuestions: Map<string, QuizQuestionEdit>;
  hasUnsavedChanges: boolean;
}


// API response types
export interface QuizResponse {
  success: boolean;
  data: QuizWithQuestions | null;
  error?: string;
}

export interface QuizQuestionsResponse {
  success: boolean;
  data: QuizQuestion[] | null;
  error?: string;
}

export interface SaveQuizRequest {
  title: string;
  description: string;
  course_id: string;
  difficulty_level?: 'easy' | 'medium' | 'hard';
  edited_from?: string; // ID of the original quiz if this is an edit
  questions: Array<{
    question_text: string;
    option_a: string;
    option_b: string;
    option_c: string;
    option_d: string;
    correct_answer: 'A' | 'B' | 'C' | 'D';
    explanation?: string;
    order_index: number;
  }>;
}

export interface SaveQuizResponse {
  success: boolean;
  data: { quiz_id: string } | null;
  error?: string;
}


// Page modes
export type QuizPageMode = 'preview' | 'study' | 'edit';

// Component props interfaces
export interface QuizQuestionProps {
  question: QuizQuestion;
  answerState: QuestionAnswerState;
  onAnswerSelect: (answer: 'A' | 'B' | 'C' | 'D') => void;
  disabled?: boolean;
  className?: string;
}

export interface QuizControlsProps {
  settings: StudySettings;
  onSettingsChange: (settings: StudySettings) => void;
  progress: StudyProgress;
  onNext: () => void;
  onPrevious: () => void;
  canNavigateNext: boolean;
  canNavigatePrevious: boolean;
}

export interface QuizPreviewProps {
  quiz: Quiz;
  onStudy: () => void;
  onEdit: () => void;
}

// Helper types for option labels
export type OptionLabel = 'A' | 'B' | 'C' | 'D';
export const OPTION_LABELS: OptionLabel[] = ['A', 'B', 'C', 'D'];

// Feedback types
export interface QuestionFeedback {
  isCorrect: boolean;
  correctAnswer: OptionLabel;
  explanation?: string;
  selectedAnswer: OptionLabel;
}