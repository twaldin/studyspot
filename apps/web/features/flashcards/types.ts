/**
 * Type definitions for the flashcards feature
 */

export interface Flashcard {
  card_id: string;
  set_id: string;
  side1: string;
  side2: string;
  card_number: number;
  created_at?: string;
  updated_at?: string;
}

export interface FlashcardSet {
  id: string;
  title: string;
  description: string;
  course_id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  edited_from?: string; // Foreign key to original flashcard set
  // Computed fields for display
  card_count?: number;
  creator_name?: string;
  creator_profile_image?: string;
  course_name?: string;
  course_code?: string;
  original_title?: string; // Title of the original set if this is an edit
  is_owned_by_current_user?: boolean; // Whether current user owns this set
}

export interface FlashcardSetWithCards extends FlashcardSet {
  cards: Flashcard[];
}

// Study mode types
export type StudyMode = 'random' | 'ordered';
export type PracticeSide = 'side1-first' | 'side2-first';

export interface StudySettings {
  mode: StudyMode;
  practiceSide: PracticeSide;
}

export interface StudyProgress {
  currentCardIndex: number;
  completedCards: Set<string>; // card_ids that have been completed
  totalCards: number;
  isComplete: boolean;
}

export interface StudyState {
  isFlipped: boolean;
  settings: StudySettings;
  progress: StudyProgress;
  shuffledCards?: Flashcard[];
}

// Edit mode types
export interface FlashcardEdit {
  card_id: string;
  side1: string;
  side2: string;
  isModified: boolean;
}

export interface EditState {
  editedCards: Map<string, FlashcardEdit>;
  hasUnsavedChanges: boolean;
}

// API response types
export interface FlashcardSetResponse {
  success: boolean;
  data: FlashcardSetWithCards | null;
  error?: string;
}

export interface FlashcardsResponse {
  success: boolean;
  data: Flashcard[] | null;
  error?: string;
}

export interface SaveFlashcardSetRequest {
  title: string;
  description: string;
  course_id: string;
  edited_from?: string; // ID of the original flashcard set if this is an edit
  cards: Array<{
    side1: string;
    side2: string;
    card_number: number;
  }>;
}

export interface SaveFlashcardSetResponse {
  success: boolean;
  data: { set_id: string } | null;
  error?: string;
}

// Page modes
export type FlashcardPageMode = 'preview' | 'study' | 'edit';

// Component props interfaces
export interface FlashcardProps {
  card: Flashcard;
  isFlipped: boolean;
  showSide: 'side1' | 'side2';
  onFlip: () => void;
  className?: string;
}

export interface StudyControlsProps {
  settings: StudySettings;
  onSettingsChange: (settings: StudySettings) => void;
  progress: StudyProgress;
  onNext: () => void;
  onSkip: () => void;
  canNavigate: boolean;
}

export interface FlashcardSetPreviewProps {
  flashcardSet: FlashcardSet;
  onStudy: () => void;
  onEdit: () => void;
}