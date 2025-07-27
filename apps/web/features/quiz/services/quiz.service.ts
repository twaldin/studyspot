import {
  QuizQuestion,
  StudySettings,
  StudyProgress,
  StudyState,
  EditState,
  QuizQuestionEdit,
  SaveQuizRequest,
  QuestionAnswerState,
  OptionLabel,
} from "@/lib/types/QuizTypes";

/**
 * Service for managing quiz business logic
 */
export class QuizService {
  private static instance: QuizService;

  public static getInstance(): QuizService {
    if (!QuizService.instance) {
      QuizService.instance = new QuizService();
    }
    return QuizService.instance;
  }

  private constructor() {}

  /**
   * Initialize study state for a set of quiz questions
   */
  initializeStudyState(questions: QuizQuestion[], settings?: Partial<StudySettings>): StudyState {
    const defaultSettings: StudySettings = {
      mode: 'ordered',
      ...settings,
    };

    const shuffledQuestions = defaultSettings.mode === 'random' 
      ? this.shuffleArray([...questions])
      : [...questions].sort((a, b) => a.order_index - b.order_index);

    const progress: StudyProgress = {
      currentQuestionIndex: 0,
      answeredQuestions: new Set(),
      correctAnswers: new Set(),
      totalQuestions: questions.length,
      isComplete: false,
      score: 0,
    };

    const currentAnswerState: QuestionAnswerState = {
      questionId: shuffledQuestions[0]?.id || '',
      showFeedback: false,
      hasAnswered: false,
    };

    return {
      settings: defaultSettings,
      progress,
      shuffledQuestions,
      currentAnswerState,
    };
  }

  /**
   * Update study settings and reshuffle questions if necessary
   */
  updateStudySettings(
    currentState: StudyState,
    newSettings: StudySettings,
    originalQuestions: QuizQuestion[]
  ): StudyState {
    const needsReshuffle = currentState.settings.mode !== newSettings.mode;
    
    let shuffledQuestions = currentState.shuffledQuestions;
    if (needsReshuffle) {
      shuffledQuestions = newSettings.mode === 'random'
        ? this.shuffleArray([...originalQuestions])
        : [...originalQuestions].sort((a, b) => a.order_index - b.order_index);
    }

    // Reset current answer state when settings change
    const currentAnswerState: QuestionAnswerState = {
      questionId: shuffledQuestions?.[currentState.progress.currentQuestionIndex]?.id || '',
      showFeedback: false,
      hasAnswered: false,
    };

    return {
      ...currentState,
      settings: newSettings,
      shuffledQuestions,
      currentAnswerState,
    };
  }

  /**
   * Handle answer selection for the current question
   */
  selectAnswer(
    currentState: StudyState,
    selectedAnswer: OptionLabel
  ): StudyState {
    const currentQuestion = this.getCurrentQuestion(currentState);
    if (!currentQuestion || currentState.currentAnswerState.hasAnswered) {
      return currentState;
    }

    const isCorrect = currentQuestion.correct_answer === selectedAnswer;
    
    // Update answer state
    const newAnswerState: QuestionAnswerState = {
      questionId: currentQuestion.id,
      selectedAnswer,
      isCorrect,
      showFeedback: true,
      hasAnswered: true,
    };

    // Update progress
    const newAnsweredQuestions = new Set(currentState.progress.answeredQuestions);
    newAnsweredQuestions.add(currentQuestion.id);

    const newCorrectAnswers = new Set(currentState.progress.correctAnswers);
    if (isCorrect) {
      newCorrectAnswers.add(currentQuestion.id);
    }

    const newProgress: StudyProgress = {
      ...currentState.progress,
      answeredQuestions: newAnsweredQuestions,
      correctAnswers: newCorrectAnswers,
      score: Math.round((newCorrectAnswers.size / currentState.progress.totalQuestions) * 100),
    };

    return {
      ...currentState,
      progress: newProgress,
      currentAnswerState: newAnswerState,
    };
  }

  /**
   * Navigate to the next question
   */
  navigateToNextQuestion(currentState: StudyState): StudyState {
    const { progress, shuffledQuestions } = currentState;
    
    if (!shuffledQuestions || shuffledQuestions.length === 0) {
      return currentState;
    }

    // Calculate next index (loop infinitely)
    const nextIndex = (progress.currentQuestionIndex + 1) % shuffledQuestions.length;
    
    // Check if we've completed all questions
    const isComplete = progress.answeredQuestions.size >= shuffledQuestions.length;

    const newProgress: StudyProgress = {
      ...progress,
      currentQuestionIndex: nextIndex,
      isComplete,
    };

    // Reset answer state for new question
    const newAnswerState: QuestionAnswerState = {
      questionId: shuffledQuestions[nextIndex]?.id || '',
      showFeedback: false,
      hasAnswered: false,
    };

    return {
      ...currentState,
      progress: newProgress,
      currentAnswerState: newAnswerState,
    };
  }

  /**
   * Navigate to the previous question
   */
  navigateToPreviousQuestion(currentState: StudyState): StudyState {
    const { progress, shuffledQuestions } = currentState;
    
    if (!shuffledQuestions || shuffledQuestions.length === 0) {
      return currentState;
    }

    // Calculate previous index (loop infinitely in reverse)
    const prevIndex = progress.currentQuestionIndex === 0 
      ? shuffledQuestions.length - 1 
      : progress.currentQuestionIndex - 1;

    const newProgress: StudyProgress = {
      ...progress,
      currentQuestionIndex: prevIndex,
    };

    // Reset answer state for previous question
    const newAnswerState: QuestionAnswerState = {
      questionId: shuffledQuestions[prevIndex]?.id || '',
      showFeedback: false,
      hasAnswered: false,
    };

    return {
      ...currentState,
      progress: newProgress,
      currentAnswerState: newAnswerState,
    };
  }

  /**
   * Get the current question being studied
   */
  getCurrentQuestion(studyState: StudyState): QuizQuestion | null {
    const { shuffledQuestions, progress } = studyState;
    if (!shuffledQuestions || shuffledQuestions.length === 0) {
      return null;
    }
    return shuffledQuestions[progress.currentQuestionIndex] || null;
  }

  /**
   * Initialize edit state for a set of quiz questions
   */
  initializeEditState(questions: QuizQuestion[]): EditState {
    const editedQuestions = new Map<string, QuizQuestionEdit>();
    
    questions.forEach(question => {
      editedQuestions.set(question.id, {
        id: question.id,
        question_text: question.question_text,
        option_a: question.option_a,
        option_b: question.option_b,
        option_c: question.option_c,
        option_d: question.option_d,
        correct_answer: question.correct_answer,
        explanation: question.explanation,
        isModified: false,
      });
    });

    return {
      editedQuestions,
      hasUnsavedChanges: false,
    };
  }

  /**
   * Update a question in edit mode
   */
  updateQuestionInEditMode(
    editState: EditState,
    questionId: string,
    updates: Partial<Omit<QuizQuestionEdit, 'id' | 'isModified'>>,
    originalQuestion: QuizQuestion
  ): EditState {
    const currentEdit = editState.editedQuestions.get(questionId);
    if (!currentEdit) {
      return editState;
    }

    const updatedQuestion: QuizQuestionEdit = {
      ...currentEdit,
      ...updates,
      isModified: this.isQuestionModified({ ...currentEdit, ...updates }, originalQuestion),
    };

    const newEditedQuestions = new Map(editState.editedQuestions);
    newEditedQuestions.set(questionId, updatedQuestion);

    const hasUnsavedChanges = Array.from(newEditedQuestions.values()).some(
      question => question.isModified
    );

    return {
      editedQuestions: newEditedQuestions,
      hasUnsavedChanges,
    };
  }

  /**
   * Check if a question has been modified from its original state
   */
  private isQuestionModified(edited: QuizQuestionEdit, original: QuizQuestion): boolean {
    return (
      edited.question_text !== original.question_text ||
      edited.option_a !== original.option_a ||
      edited.option_b !== original.option_b ||
      edited.option_c !== original.option_c ||
      edited.option_d !== original.option_d ||
      edited.correct_answer !== original.correct_answer ||
      edited.explanation !== original.explanation
    );
  }

  /**
   * Convert edit state to save request format
   */
  convertEditStateToSaveRequest(
    editState: EditState,
    quizTitle: string,
    quizDescription: string,
    courseId: string,
    difficultyLevel?: 'easy' | 'medium' | 'hard'
  ): SaveQuizRequest {
    const questions = Array.from(editState.editedQuestions.values())
      .map((edit, index) => ({
        question_text: edit.question_text,
        option_a: edit.option_a,
        option_b: edit.option_b,
        option_c: edit.option_c,
        option_d: edit.option_d,
        correct_answer: edit.correct_answer,
        explanation: edit.explanation,
        order_index: index,
      }));

    return {
      title: quizTitle,
      description: quizDescription,
      course_id: courseId,
      difficulty_level: difficultyLevel,
      questions,
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
    if (progress.totalQuestions === 0) return 0;
    return Math.round((progress.answeredQuestions.size / progress.totalQuestions) * 100);
  }

  /**
   * Get study progress text
   */
  getProgressText(progress: StudyProgress): string {
    const percentage = this.getProgressPercentage(progress);
    const answered = progress.answeredQuestions.size;
    const total = progress.totalQuestions;
    
    if (progress.isComplete) {
      return `Complete! Score: ${progress.score}% (${progress.correctAnswers.size}/${total} correct)`;
    }
    
    return `${percentage}% complete (${answered}/${total} questions)`;
  }

  /**
   * Get score text for completed quiz
   */
  getScoreText(progress: StudyProgress): string {
    const correct = progress.correctAnswers.size;
    const total = progress.totalQuestions;
    return `${correct}/${total} correct (${progress.score}%)`;
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

  /**
   * Format difficulty level for display
   */
  formatDifficultyLevel(level?: string): string {
    if (!level) return '';
    return level.charAt(0).toUpperCase() + level.slice(1);
  }

  /**
   * Get difficulty color class
   */
  getDifficultyColorClass(level?: string): string {
    switch (level) {
      case 'easy':
        return 'text-green-600 dark:text-green-400';
      case 'medium':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'hard':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  }

  /**
   * Auto-advance after correct answer (with delay)
   */
  async autoAdvanceAfterCorrectAnswer(
    currentState: StudyState,
    onNext: () => void,
    delay: number = 1500
  ): Promise<void> {
    if (currentState.currentAnswerState.isCorrect) {
      await new Promise(resolve => setTimeout(resolve, delay));
      onNext();
    }
  }
}

// Export singleton instance
export const quizService = QuizService.getInstance();