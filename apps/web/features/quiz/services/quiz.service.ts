import {
  EditState,
  OptionLabel,
  QuestionAnswerState,
  QuizMode,
  QuizQuestion,
  QuizQuestionEdit,
  SaveQuizRequest,
  StudyProgress,
  StudySettings,
  StudyState,
} from "@/features/quiz/types";

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
  initializeStudyState(
    questions: QuizQuestion[],
    settings?: Partial<StudySettings>,
    quizMode: QuizMode = 'initial'
  ): StudyState {
    const defaultSettings: StudySettings = {
      mode: "ordered",
      ...settings,
    };

    const shuffledQuestions = defaultSettings.mode === "random"
      ? this.shuffleArray([...questions])
      : [...questions].sort((a, b) => a.order_index - b.order_index);

    const progress: StudyProgress = {
      currentQuestionIndex: 0,
      answeredQuestions: new Set(),
      correctAnswers: new Set(),
      userAnswers: new Map(),
      totalQuestions: questions.length,
      isComplete: false,
      score: 0,
    };

    const currentAnswerState: QuestionAnswerState = {
      questionId: shuffledQuestions[0]?.id || "",
      showFeedback: false,
      hasAnswered: false,
    };

    return {
      settings: defaultSettings,
      progress,
      shuffledQuestions,
      currentAnswerState,
      quizMode,
    };
  }

  /**
   * Update study settings and reshuffle questions if necessary
   */
  updateStudySettings(
    currentState: StudyState,
    newSettings: StudySettings,
    originalQuestions: QuizQuestion[],
  ): StudyState {
    const needsReshuffle = currentState.settings.mode !== newSettings.mode;

    let shuffledQuestions = currentState.shuffledQuestions;
    let newCurrentIndex = currentState.progress.currentQuestionIndex;
    
    if (needsReshuffle) {
      const currentQuestion = this.getCurrentQuestion(currentState);
      
      if (newSettings.mode === "random") {
        shuffledQuestions = this.intelligentShuffle(
          originalQuestions,
          currentState.progress.answeredQuestions,
          currentQuestion
        );
      } else {
        shuffledQuestions = [...originalQuestions].sort((a, b) => a.order_index - b.order_index);
      }
      
      // Find the index of the current question in the new arrangement
      if (currentQuestion) {
        const newIndex = shuffledQuestions.findIndex(q => q.id === currentQuestion.id);
        newCurrentIndex = newIndex >= 0 ? newIndex : 0;
      }
    }

    // Reset current answer state when settings change
    const currentAnswerState: QuestionAnswerState = {
      questionId: shuffledQuestions?.[newCurrentIndex]?.id || "",
      showFeedback: false,
      hasAnswered: false,
    };

    return {
      ...currentState,
      settings: newSettings,
      shuffledQuestions,
      progress: {
        ...currentState.progress,
        currentQuestionIndex: newCurrentIndex,
      },
      currentAnswerState,
    };
  }

  /**
   * Handle answer selection for the current question
   */
  selectAnswer(
    currentState: StudyState,
    selectedAnswer: OptionLabel,
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
    const newAnsweredQuestions = new Set(
      currentState.progress.answeredQuestions,
    );
    newAnsweredQuestions.add(currentQuestion.id);

    const newCorrectAnswers = new Set(currentState.progress.correctAnswers);
    if (isCorrect) {
      newCorrectAnswers.add(currentQuestion.id);
    }

    const newUserAnswers = new Map(currentState.progress.userAnswers);
    newUserAnswers.set(currentQuestion.id, selectedAnswer);

    // Check if quiz is complete after this answer
    const isComplete = newAnsweredQuestions.size >= currentState.progress.totalQuestions;

    const newProgress: StudyProgress = {
      ...currentState.progress,
      answeredQuestions: newAnsweredQuestions,
      correctAnswers: newCorrectAnswers,
      userAnswers: newUserAnswers,
      score: Math.round(
        (newCorrectAnswers.size / currentState.progress.totalQuestions) * 100,
      ),
      isComplete,
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
    const nextIndex = (progress.currentQuestionIndex + 1) %
      shuffledQuestions.length;

    // Check if we've completed all questions at least once
    const isComplete =
      progress.answeredQuestions.size >= shuffledQuestions.length;

    const newProgress: StudyProgress = {
      ...progress,
      currentQuestionIndex: nextIndex,
      isComplete,
    };

    // Reset answer state for new question
    const newAnswerState: QuestionAnswerState = {
      questionId: shuffledQuestions[nextIndex]?.id || "",
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

    // Preserve completion status
    const isComplete =
      progress.answeredQuestions.size >= shuffledQuestions.length;

    const newProgress: StudyProgress = {
      ...progress,
      currentQuestionIndex: prevIndex,
      isComplete,
    };

    // Reset answer state for previous question
    const newAnswerState: QuestionAnswerState = {
      questionId: shuffledQuestions[prevIndex]?.id || "",
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

    questions.forEach((question) => {
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
    updates: Partial<Omit<QuizQuestionEdit, "id" | "isModified">>,
    originalQuestion: QuizQuestion,
  ): EditState {
    const currentEdit = editState.editedQuestions.get(questionId);
    if (!currentEdit) {
      return editState;
    }

    const updatedQuestion: QuizQuestionEdit = {
      ...currentEdit,
      ...updates,
      isModified: this.isQuestionModified(
        { ...currentEdit, ...updates },
        originalQuestion,
      ),
    };

    const newEditedQuestions = new Map(editState.editedQuestions);
    newEditedQuestions.set(questionId, updatedQuestion);

    const hasUnsavedChanges = Array.from(newEditedQuestions.values()).some(
      (question) => question.isModified,
    );

    return {
      editedQuestions: newEditedQuestions,
      hasUnsavedChanges,
    };
  }

  /**
   * Check if a question has been modified from its original state
   */
  private isQuestionModified(
    edited: QuizQuestionEdit,
    original: QuizQuestion,
  ): boolean {
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
      questions,
    };
  }

  /**
   * Intelligent shuffle that prioritizes unanswered questions and keeps current question in place
   */
  private intelligentShuffle(
    originalQuestions: QuizQuestion[],
    answeredQuestions: Set<string>,
    currentQuestion: QuizQuestion | null
  ): QuizQuestion[] {
    // Separate questions into answered and unanswered
    const unansweredQuestions = originalQuestions.filter(q => !answeredQuestions.has(q.id));
    const answeredQuestionsArray = originalQuestions.filter(q => answeredQuestions.has(q.id));
    
    // If we have unanswered questions, prioritize them
    let result: QuizQuestion[];
    if (unansweredQuestions.length > 0) {
      // Shuffle unanswered questions and put them first
      const shuffledUnanswered = this.shuffleArray(unansweredQuestions);
      const shuffledAnswered = this.shuffleArray(answeredQuestionsArray);
      result = [...shuffledUnanswered, ...shuffledAnswered];
    } else {
      // All questions have been answered, shuffle everything
      result = this.shuffleArray(originalQuestions);
    }
    
    // If we have a current question, move it to the front
    if (currentQuestion) {
      const currentIndex = result.findIndex(q => q.id === currentQuestion.id);
      if (currentIndex > 0) {
        // Remove current question from its position and put it at the front
        const [question] = result.splice(currentIndex, 1);
        result.unshift(question);
      }
    }
    
    return result;
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
    return Math.round(
      (progress.answeredQuestions.size / progress.totalQuestions) * 100,
    );
  }

  /**
   * Get study progress text with integrated score
   */
  getProgressText(progress: StudyProgress): string {
    const answered = progress.answeredQuestions.size;
    const correct = progress.correctAnswers.size;
    const total = progress.totalQuestions;

    if (progress.isComplete) {
      return `Complete! ${answered}/${total} answered • ${correct}/${answered} correct (${progress.score}%)`;
    }

    if (answered === 0) {
      return `${answered}/${total} answered`;
    }

    const currentScore = Math.round((correct / answered) * 100);
    return `${answered}/${total} answered • ${correct}/${answered} correct (${currentScore}%)`;
  }

  /**
   * Get score text for completed quiz
   */
  getScoreText(progress: StudyProgress): string {
    const correct = progress.correctAnswers.size;
    const so_far = progress.answeredQuestions.size;
    return `${correct}/${so_far} correct (${progress.score}%)`;
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

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInDays < 7) return `${diffInDays}d ago`;

    return date.toLocaleDateString();
  }


  /**
   * Switch to a different quiz mode (review, retake, practice)
   */
  switchQuizMode(
    currentState: StudyState,
    newMode: QuizMode,
    originalQuestions: QuizQuestion[]
  ): StudyState {
    switch (newMode) {
      case 'retake':
        // Reset everything like initial state
        return this.initializeStudyState(originalQuestions, currentState.settings, 'retake');
        
      case 'review':
        // Keep progress but allow navigation through all questions in original order
        // Preserve the order the user experienced during the quiz
        return {
          ...currentState,
          quizMode: 'review',
          currentAnswerState: {
            ...currentState.currentAnswerState,
            showFeedback: false,
            hasAnswered: false,
          }
          // Note: we keep the existing shuffledQuestions to preserve the order user experienced
        };
        
      case 'practice':
        // Continue infinite practice mode
        return {
          ...currentState,
          quizMode: 'practice',
          progress: {
            ...currentState.progress,
            isComplete: false, // Allow infinite practice
          }
        };
        
      default:
        return currentState;
    }
  }

  /**
   * Check if quiz is on the final question (or will complete after answering current question)
   */
  isOnFinalQuestion(studyState: StudyState): boolean {
    if (!studyState.shuffledQuestions) return false;
    
    const { progress, shuffledQuestions } = studyState;
    const unansweredQuestions = shuffledQuestions.filter(q => !progress.answeredQuestions.has(q.id));
    
    // If only 1 unanswered question remains and we're on it, it's the final question
    // OR if this is the current question and answering it would complete the quiz
    return unansweredQuestions.length === 1 && 
           unansweredQuestions[0].id === studyState.currentAnswerState.questionId;
  }

  /**
   * Check if quiz will be complete after answering the current question
   */
  willCompleteAfterCurrentAnswer(studyState: StudyState): boolean {
    if (!studyState.shuffledQuestions) return false;
    
    const { progress, shuffledQuestions, currentAnswerState } = studyState;
    
    // If current question hasn't been answered yet and answering it would complete the quiz
    if (!currentAnswerState.hasAnswered && !progress.answeredQuestions.has(currentAnswerState.questionId)) {
      return progress.answeredQuestions.size + 1 >= shuffledQuestions.length;
    }
    
    return false;
  }

  /**
   * Check if can navigate to previous question in review mode
   */
  canNavigatePreviousInReview(studyState: StudyState): boolean {
    if (studyState.quizMode !== 'review') return false;
    return studyState.progress.currentQuestionIndex > 0;
  }

  /**
   * Check if can navigate to next question in review mode
   */
  canNavigateNextInReview(studyState: StudyState): boolean {
    if (studyState.quizMode !== 'review') return false;
    if (!studyState.shuffledQuestions) return false;
    return studyState.progress.currentQuestionIndex < studyState.shuffledQuestions.length - 1;
  }

  /**
   * Auto-advance after correct answer (with delay)
   */
  async autoAdvanceAfterCorrectAnswer(
    currentState: StudyState,
    onNext: () => void,
    delay: number = 1500,
  ): Promise<void> {
    if (currentState.currentAnswerState.isCorrect) {
      await new Promise((resolve) => setTimeout(resolve, delay));
      onNext();
    }
  }
}

// Export singleton instance
export const quizService = QuizService.getInstance();

