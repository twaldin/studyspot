"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useQuiz } from "@/hooks/api/quizzes";
import { quizService } from "@/features/quiz/services/quiz.service";
import dynamic from "next/dynamic";

// Dynamically import heavy quiz components to reduce initial bundle size
const QuizQuestion = dynamic(
  () => import("@/features/quiz/components/quiz-question").then(mod => ({ default: mod.QuizQuestion })),
  {
    loading: () => <div></div>,
    ssr: false
  }
);

const QuizControls = dynamic(
  () => import("@/features/quiz/components/quiz-controls").then(mod => ({ default: mod.QuizControls })),
  {
    loading: () => <div> </div>,
    ssr: false
  }
);

const QuizEditMode = dynamic(
  () => import("@/features/quiz/components/quiz-edit-mode").then(mod => ({ default: mod.QuizEditMode })),
  {
    loading: () => <div></div>,
    ssr: false
  }
);

import {
  OptionLabel,
  QuizMode,
  QuizQuestion as QuizQuestionType,
  StudyMode,
  StudySettings,
  StudyState,
} from "@/features/quiz/types";
import { Button } from "@studyspot/ui/components/button";
import { Badge } from "@studyspot/ui/components/badge";
import {
  BookOpen,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Edit3,
  Infinity,
  Loader2,
  Maximize,
  RotateCcw,
  Share,
  Shuffle,
  Target,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { cn } from "@studyspot/ui/lib/utils";
import { useConfetti } from "@/hooks/use-confetti";
import {
  QuizCompletionDialog,
  QuizCompletionMode,
} from "@/components/quiz-completion-dialog";
import { ShareModal } from "@/components/share-modal";
import { getCourseIcon } from "@/lib/utils/course-icons";

export default function QuizPage() {
  const params = useParams();
  const quizId = params.quizId as string;

  const { data: quiz, isLoading, error } = useQuiz(quizId);
  const { fireCorrectAnswer, fireQuizComplete } = useConfetti();

  // No need to disable body scrolling - main container handles overflow

  const [isEditMode, setIsEditMode] = useState(false);
  const [studyState, setStudyState] = useState<StudyState | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showCompletionDialog, setShowCompletionDialog] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Initialize study state when quiz loads
  useEffect(() => {
    if (quiz?.questions && quiz.questions.length > 0 && !studyState) {
      const initialStudyState = quizService.initializeStudyState(
        quiz.questions,
      );
      setStudyState(initialStudyState);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quiz]);

  const handleEditMode = () => {
    setIsEditMode(true);
  };

  const handleBackFromEdit = () => {
    setIsEditMode(false);
  };

  // Study handlers
  const handleShuffleGenerated = (questionId: string, shuffledOrder: OptionLabel[]) => {
    setStudyState((currentState) => {
      if (!currentState) return currentState;
      const newShuffleMap = new Map(currentState.answerShuffleMap || new Map());
      newShuffleMap.set(questionId, shuffledOrder);
      return {
        ...currentState,
        answerShuffleMap: newShuffleMap,
      };
    });
  };

  const handleAnswerSelect = (answer: OptionLabel) => {
    if (!studyState) return;

    const willComplete = quizService.willCompleteAfterCurrentAnswer(studyState);
    const newState = quizService.selectAnswer(studyState, answer);
    const isCorrect = newState.currentAnswerState.isCorrect;

    setStudyState(newState);

    // Handle completion logic - skip for practice/infinite mode
    console.log("Quiz completion check:", {
      wasComplete: studyState.progress.isComplete,
      nowComplete: newState.progress.isComplete,
      isCorrect,
      willComplete,
      answeredCount: newState.progress.answeredQuestions.size,
      totalQuestions: newState.progress.totalQuestions,
      quizMode: newState.quizMode,
    });

    if (
      newState.quizMode !== "practice" && newState.progress.isComplete &&
      !studyState.progress.isComplete
    ) {
      // Quiz just completed (not in infinite/practice mode)
      console.log("Quiz completion detected!", { isCorrect });
      if (isCorrect) {
        // Correct final answer - show completion confetti immediately
        fireQuizComplete();
        setTimeout(() => {
          setShowCompletionDialog(true);
        }, 1000);
      } else {
        // Wrong final answer - wait for user to click "Finish Quiz"
        // Confetti will be triggered in handleNextQuestion
      }
    } else if (isCorrect && !willComplete) {
      // Regular correct answer (not final question)
      fireCorrectAnswer();
      setTimeout(() => {
        setStudyState((currentState) => {
          if (!currentState) return currentState;
          return quizService.navigateToNextQuestion(currentState);
        });
      }, 1500);
    }
    // For incorrect answers, user must click "Next Question" or "Finish Quiz"
  };

  const handleNextQuestion = () => {
    if (!studyState) return;

    // Skip completion logic if in review mode or practice mode
    if (
      studyState.quizMode !== "review" && studyState.quizMode !== "practice"
    ) {
      // Check if this is the completion trigger (wrong final answer)
      const isFinalQuestion = quizService.isOnFinalQuestion(studyState);
      const willComplete = isFinalQuestion &&
        studyState.currentAnswerState.hasAnswered;

      console.log("Next question clicked:", {
        isFinalQuestion,
        hasAnswered: studyState.currentAnswerState.hasAnswered,
        willComplete,
        isComplete: studyState.progress.isComplete,
        quizMode: studyState.quizMode,
      });

      if (willComplete || studyState.progress.isComplete) {
        // Fire completion confetti and show dialog
        console.log("Triggering completion from next button");
        fireQuizComplete();
        setTimeout(() => {
          setShowCompletionDialog(true);
        }, 1000);
      }
    }

    setStudyState((currentState) => {
      if (!currentState) return currentState;
      return quizService.navigateToNextQuestion(currentState);
    });
  };

  const handlePreviousQuestion = () => {
    setStudyState((currentState) => {
      if (!currentState) return currentState;
      return quizService.navigateToPreviousQuestion(currentState);
    });
  };

  const handleRandomize = () => {
    if (!quiz?.questions) return;
    setStudyState((currentState) => {
      if (!currentState) return currentState;
      const newMode: StudyMode = currentState.settings.mode === "ordered"
        ? "random"
        : "ordered";
      const newSettings = { ...currentState.settings, mode: newMode };
      return quizService.updateStudySettings(
        currentState,
        newSettings,
        quiz.questions,
      );
    });
  };

  const handleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleQuizModeSelect = (mode: QuizCompletionMode) => {
    if (!studyState || !quiz?.questions || !mode) return;

    const newState = quizService.switchQuizMode(
      studyState,
      mode,
      quiz.questions,
    );
    setStudyState(newState);
  };

  const handleInfiniteToggle = () => {
    if (!studyState || !quiz?.questions) return;

    if (studyState.quizMode === "practice") {
      // Exit infinite mode - start new quiz
      const newState = quizService.initializeStudyState(
        quiz.questions,
        studyState.settings,
        "initial",
      );
      setStudyState(newState);
      setShowCompletionDialog(false);
    } else {
      // Enter infinite mode
      const newState = quizService.switchQuizMode(
        studyState,
        "practice",
        quiz.questions,
      );
      setStudyState(newState);
      setShowCompletionDialog(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-500" />
          <p className="text-gray-600 dark:text-gray-400">
            Loading quiz...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (!isLoading && !quiz) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="text-red-500 text-6xl">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Quiz Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            The quiz you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => window.history.back()}>
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  // Edit mode
  if (isEditMode) {
    return (
      <QuizEditMode
        quiz={quiz}
        onBack={handleBackFromEdit}
      />
    );
  }

  // Main quiz view
  if (!studyState) {
    return null;
  }

  const currentQuestion = quizService.getCurrentQuestion(studyState);

  if (!currentQuestion) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            No questions available
          </p>
          <Button onClick={() => window.history.back()}>Go Back</Button>
        </div>
      </div>
    );
  }

  const progressText = `${
    studyState.progress.currentQuestionIndex + 1
  } / ${studyState.progress.totalQuestions}`;

  const timeAgo = quizService.formatTimeAgo(quiz.created_at);

  const renderContent = () => (
    <div className="flex flex-col h-full">
      {/* Header Section - Fixed at top */}
      <div className="flex-shrink-0 space-y-3 mb-4">
        <div className="flex items-center gap-3">
          <h1
            className={cn(
              "font-bold font-crimson-text text-foreground",
              isFullscreen ? "text-3xl" : "text-2xl",
            )}
          >
            {quiz.title}
          </h1>
        </div>

        {/* Course and Meta Info */}
        <div className="space-y-2">
          <p className="text-lg text-muted-foreground">
            {quiz.description}
          </p>

          {/* Show "edited from" info if this is an edit */}
          {quiz.edited_from && quiz.original_title && (
            <p className="text-sm text-muted-foreground italic">
              (edited from '{quiz.original_title}')
            </p>
          )}

          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              {(() => {
                const CourseIcon = getCourseIcon((quiz.courses as any)?.icon);
                return <CourseIcon className="h-4 w-4" />;
              })()}
              <span>
                {quiz.course_code} - {quiz.course_name}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Created {timeAgo} by {quiz.creator_name}</span>
            </div>

            <div className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              <span>{quiz.question_count} questions</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Quiz Area - Takes remaining space */}
      <div className="flex-1 flex items-center justify-center min-h-0">
        <div className="relative w-full h-full max-w-4xl flex justify-center items-center">
          <QuizQuestion
            question={currentQuestion}
            answerState={studyState.currentAnswerState}
            onAnswerSelect={handleAnswerSelect}
            onNext={handleNextQuestion}
            onPrevious={handlePreviousQuestion}
            isFullscreen={isFullscreen}
            isFinalQuestion={quizService.isOnFinalQuestion(studyState)}
            quizMode={studyState.quizMode}
            correctAnswers={studyState.progress.correctAnswers}
            userAnswers={studyState.progress.userAnswers}
            canNavigatePrevious={quizService.canNavigatePreviousInReview(
              studyState,
            )}
            canNavigateNext={quizService.canNavigateNextInReview(studyState)}
            answerShuffleMap={studyState.answerShuffleMap}
            onShuffleGenerated={handleShuffleGenerated}
          />

          {/* Review Mode Navigation Arrows - positioned at quiz area edges */}
          {studyState.quizMode === 'review' && (
            <>
              {/* Left Arrow */}
              {quizService.canNavigatePreviousInReview(studyState) && (
                <Button
                  onClick={handlePreviousQuestion}
                  variant="ghost"
                  size="icon"
                  className="absolute left-0 top-1/2 cursor-pointer -translate-y-1/2 -translate-x-full ml-4 rounded-full bg-white hover:bg-gray-100/80 dark:bg-black dark:hover:bg-card shadow-lg"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
              )}

              {/* Right Arrow */}
              {quizService.canNavigateNextInReview(studyState) && (
                <Button
                  onClick={handleNextQuestion}
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-1/2 cursor-pointer -translate-y-1/2 translate-x-full mr-4 rounded-full bg-white hover:bg-gray-100/80 dark:bg-black dark:hover:bg-card shadow-lg"
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Footer Section - Fixed at bottom */}
      <div className="flex-shrink-0 space-y-4 mt-4">
        {/* Progress Controls */}
        {studyState.quizMode !== "review" && (
          <div className="w-full">
            <QuizControls
              settings={studyState.settings}
              onSettingsChange={(newSettings) => {
                if (!quiz?.questions) return;
                setStudyState((currentState) => {
                  if (!currentState) return currentState;
                  return quizService.updateStudySettings(
                    currentState,
                    newSettings,
                    quiz.questions,
                  );
                });
              }}
              progress={studyState.progress}
              onNext={handleNextQuestion}
              onPrevious={handlePreviousQuestion}
              canNavigateNext={studyState.currentAnswerState.hasAnswered}
              canNavigatePrevious={true}
              quizMode={studyState.quizMode}
            />
          </div>
        )}

        {/* Bottom Controls */}
        <div
          className={cn(
            "flex items-center justify-between bg-card rounded-lg shadow-sm",
            isFullscreen ? "p-6 mx-8" : "p-4",
          )}
        >
          {/* Left Controls */}
          <div className="flex items-center gap-2">
            <Button
              onClick={handleRandomize}
              variant="ghost"
              size="icon"
              disabled={studyState.quizMode === "review"}
              className={cn(
                "cursor-pointer hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                studyState?.settings.mode === "random" &&
                  "bg-sidebar-accent text-sidebar-accent-foreground",
                studyState.quizMode === "review" &&
                  "cursor-not-allowed opacity-50",
              )}
            >
              <Shuffle className="h-4 w-4" />
            </Button>
            <Button
              onClick={handleInfiniteToggle}
              variant="ghost"
              size="icon"
              className={cn(
                "cursor-pointer hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                studyState.quizMode === "practice" &&
                  "bg-sidebar-accent text-sidebar-accent-foreground",
              )}
            >
              <Infinity className="h-4 w-4" />
            </Button>
            <Button
              onClick={handleEditMode}
              variant="ghost"
              size="icon"
              className="cursor-pointer hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              <Edit3 className="h-4 w-4" />
            </Button>
            <Button
              onClick={() => setIsShareModalOpen(true)}
              variant="ghost"
              size="icon"
              className="cursor-pointer hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              <Share className="h-4 w-4" />
            </Button>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2">
            {studyState.quizMode === "review" && (
              <Button
                onClick={() => handleQuizModeSelect("retake")}
                variant="ghost"
                size="sm"
                className="cursor-pointer hover:bg-sidebar-accent hover:text-sidebar-accent-foreground gap-1"
              >
                <RotateCcw className="h-4 w-4" />
                Retake
              </Button>
            )}
            <Button
              onClick={handleFullscreen}
              variant="ghost"
              size="icon"
              className="cursor-pointer hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              <Maximize className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Normal Layout */}
      {!isFullscreen && (
        <div
          className="bg-background"
          style={{ height: "calc(100vh - 4rem)" }}
        >
          <div className="max-w-4xl mx-auto p-6 h-full overflow-hidden">
            {renderContent()}
          </div>
        </div>
      )}

      {/* Fullscreen Layout */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-background animate-in fade-in-0 duration-300">
          <div className="max-w-[90vw] mx-auto p-8 h-full overflow-hidden">
            {renderContent()}
          </div>
        </div>
      )}

      {/* Quiz Completion Dialog */}
      {studyState && (
        <QuizCompletionDialog
          open={showCompletionDialog}
          onOpenChange={setShowCompletionDialog}
          progress={studyState.progress}
          onModeSelect={handleQuizModeSelect}
        />
      )}

      {/* Share Modal */}
      {quiz && (
        <ShareModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          url={`/quiz/${quizId}`}
          title={quiz.title}
          type="quiz"
          courseCode={quiz.course_code}
          resourceId={quizId}
        />
      )}
    </>
  );
}
