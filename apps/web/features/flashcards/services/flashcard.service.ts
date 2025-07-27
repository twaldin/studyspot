import {
  Flashcard,
  StudySettings,
  StudyProgress,
  StudyState,
  EditState,
  FlashcardEdit,
  SaveFlashcardSetRequest,
} from "@/lib/types/FlashcardTypes";

/**
 * Service for managing flashcard business logic
 */
export class FlashcardService {
  private static instance: FlashcardService;

  public static getInstance(): FlashcardService {
    if (!FlashcardService.instance) {
      FlashcardService.instance = new FlashcardService();
    }
    return FlashcardService.instance;
  }

  private constructor() {}

  /**
   * Initialize study state for a set of flashcards
   */
  initializeStudyState(cards: Flashcard[], settings?: Partial<StudySettings>): StudyState {
    const defaultSettings: StudySettings = {
      mode: 'ordered',
      practiceSide: 'side1-first',
      ...settings,
    };

    const shuffledCards = defaultSettings.mode === 'random' 
      ? this.shuffleArray([...cards])
      : [...cards].sort((a, b) => a.card_number - b.card_number);

    const progress: StudyProgress = {
      currentCardIndex: 0,
      completedCards: new Set(),
      totalCards: cards.length,
      isComplete: false,
    };

    return {
      isFlipped: false,
      settings: defaultSettings,
      progress,
      shuffledCards,
    };
  }

  /**
   * Update study settings and reshuffle cards if necessary
   */
  updateStudySettings(
    currentState: StudyState,
    newSettings: StudySettings,
    originalCards: Flashcard[]
  ): StudyState {
    const needsReshuffle = currentState.settings.mode !== newSettings.mode;
    
    let shuffledCards = currentState.shuffledCards;
    if (needsReshuffle) {
      shuffledCards = newSettings.mode === 'random'
        ? this.shuffleArray([...originalCards])
        : [...originalCards].sort((a, b) => a.card_number - b.card_number);
    }

    return {
      ...currentState,
      settings: newSettings,
      shuffledCards,
      isFlipped: false, // Reset flip state when settings change
    };
  }

  /**
   * Navigate to the next card in study mode
   */
  navigateToNextCard(currentState: StudyState): StudyState {
    const { progress, shuffledCards } = currentState;
    
    if (!shuffledCards || shuffledCards.length === 0) {
      return currentState;
    }

    // Mark current card as completed
    const currentCard = shuffledCards[progress.currentCardIndex];
    const newCompletedCards = new Set(progress.completedCards);
    if (currentCard) {
      newCompletedCards.add(currentCard.card_id);
    }

    // Calculate next index (loop infinitely)
    const nextIndex = (progress.currentCardIndex + 1) % shuffledCards.length;
    
    // Check if we've completed a full cycle
    const isComplete = newCompletedCards.size >= shuffledCards.length;

    const newProgress: StudyProgress = {
      ...progress,
      currentCardIndex: nextIndex,
      completedCards: newCompletedCards,
      isComplete,
    };

    return {
      ...currentState,
      progress: newProgress,
      isFlipped: false, // Reset flip state for new card
    };
  }

  /**
   * Navigate to the previous card in study mode
   */
  navigateToPreviousCard(currentState: StudyState): StudyState {
    const { progress, shuffledCards } = currentState;
    
    if (!shuffledCards || shuffledCards.length === 0) {
      return currentState;
    }

    // Calculate previous index (loop infinitely in reverse)
    const prevIndex = progress.currentCardIndex === 0 
      ? shuffledCards.length - 1 
      : progress.currentCardIndex - 1;

    const newProgress: StudyProgress = {
      ...progress,
      currentCardIndex: prevIndex,
    };

    return {
      ...currentState,
      progress: newProgress,
      isFlipped: false, // Reset flip state for new card
    };
  }

  /**
   * Skip current card (flip it automatically and then navigate)
   */
  skipCurrentCard(currentState: StudyState): StudyState {
    // First flip the card, then navigate
    const flippedState = { ...currentState, isFlipped: true };
    return this.navigateToNextCard(flippedState);
  }

  /**
   * Flip the current card
   */
  flipCard(currentState: StudyState): StudyState {
    return {
      ...currentState,
      isFlipped: !currentState.isFlipped,
    };
  }

  /**
   * Get the current card being studied
   */
  getCurrentCard(studyState: StudyState): Flashcard | null {
    const { shuffledCards, progress } = studyState;
    if (!shuffledCards || shuffledCards.length === 0) {
      return null;
    }
    return shuffledCards[progress.currentCardIndex] || null;
  }

  /**
   * Determine which side of the card to show first
   */
  getCardDisplaySide(studyState: StudyState): 'side1' | 'side2' {
    const { settings, isFlipped } = studyState;
    
    if (!isFlipped) {
      return settings.practiceSide === 'side1-first' ? 'side1' : 'side2';
    } else {
      return settings.practiceSide === 'side1-first' ? 'side2' : 'side1';
    }
  }

  /**
   * Initialize edit state for a set of flashcards
   */
  initializeEditState(cards: Flashcard[]): EditState {
    const editedCards = new Map<string, FlashcardEdit>();
    
    cards.forEach(card => {
      editedCards.set(card.card_id, {
        card_id: card.card_id,
        side1: card.side1,
        side2: card.side2,
        isModified: false,
      });
    });

    return {
      editedCards,
      hasUnsavedChanges: false,
    };
  }

  /**
   * Update a card in edit mode
   */
  updateCardInEditMode(
    editState: EditState,
    cardId: string,
    updates: Partial<Pick<FlashcardEdit, 'side1' | 'side2'>>,
    originalCard: Flashcard
  ): EditState {
    const currentEdit = editState.editedCards.get(cardId);
    if (!currentEdit) {
      return editState;
    }

    const updatedCard: FlashcardEdit = {
      ...currentEdit,
      ...updates,
      isModified: 
        updates.side1 !== originalCard.side1 ||
        updates.side2 !== originalCard.side2,
    };

    const newEditedCards = new Map(editState.editedCards);
    newEditedCards.set(cardId, updatedCard);

    const hasUnsavedChanges = Array.from(newEditedCards.values()).some(
      card => card.isModified
    );

    return {
      editedCards: newEditedCards,
      hasUnsavedChanges,
    };
  }

  /**
   * Convert edit state to save request format
   */
  convertEditStateToSaveRequest(
    editState: EditState,
    setTitle: string,
    setDescription: string,
    courseId: string
  ): SaveFlashcardSetRequest {
    const cards = Array.from(editState.editedCards.values())
      .map((edit, index) => ({
        side1: edit.side1,
        side2: edit.side2,
        card_number: index + 1,
      }));

    return {
      title: setTitle,
      description: setDescription,
      course_id: courseId,
      cards,
    };
  }

  /**
   * Utility function to shuffle an array (Fisher-Yates algorithm)
   */
  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  /**
   * Calculate study progress percentage
   */
  getProgressPercentage(progress: StudyProgress): number {
    if (progress.totalCards === 0) return 0;
    return Math.round((progress.completedCards.size / progress.totalCards) * 100);
  }

  /**
   * Get study progress text
   */
  getProgressText(progress: StudyProgress): string {
    const percentage = this.getProgressPercentage(progress);
    const completed = progress.completedCards.size;
    const total = progress.totalCards;
    
    if (progress.isComplete) {
      return `Complete! (${completed}/${total} cards studied)`;
    }
    
    return `${percentage}% complete (${completed}/${total} cards)`;
  }

  /**
   * Format time since creation
   */
  formatTimeAgo(dateString: string): string {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return date.toLocaleDateString();
  }
}

// Export singleton instance
export const flashcardService = FlashcardService.getInstance();