"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useQuiz } from "@/hooks/api/quizzes";
import { quizService } from "@/features/quiz/services/quiz.service";
import { QuizQuestion } from "@/features/quiz/components/quiz-question";
import { QuizControls } from "@/features/quiz/components/quiz-controls";
import { QuizEditMode } from "@/features/quiz/components/quiz-edit-mode";
import {
  QuizQuestion as QuizQuestionType,
  StudyMode,
  StudySettings,
  StudyState,
  OptionLabel,
} from "@/lib/types/QuizTypes";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  BookOpen,
  Calendar,
  Edit3,
  Loader2,
  Maximize,
  Shuffle,
  Target,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { cn } from "@/lib/utils";

export default function QuizPage() {
  const params = useParams();
  const quizId = params.quizId as string;

  const { data: quiz, isLoading, error } = useQuiz(quizId);

  // No need to disable body scrolling - main container handles overflow

  const [isEditMode, setIsEditMode] = useState(false);
  const [studyState, setStudyState] = useState<StudyState | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [trackProgress, setTrackProgress] = useState(true);

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
  const handleAnswerSelect = (answer: OptionLabel) => {
    if (!studyState) return;
    const newState = quizService.selectAnswer(studyState, answer);
    setStudyState(newState);

    // Auto-advance after correct answer with delay
    if (newState.currentAnswerState.isCorrect) {
      setTimeout(() => {
        handleNextQuestion();
      }, 1500);
    }
  };

  const handleNextQuestion = () => {
    if (!studyState) return;
    const newState = quizService.navigateToNextQuestion(studyState);
    setStudyState(newState);
  };

  const handlePreviousQuestion = () => {
    if (!studyState) return;
    const newState = quizService.navigateToPreviousQuestion(studyState);
    setStudyState(newState);
  };

  const handleRandomize = () => {
    if (!studyState || !quiz?.questions) return;
    const newMode: StudyMode = studyState.settings.mode === "ordered"
      ? "random"
      : "ordered";
    const newSettings = { ...studyState.settings, mode: newMode };
    const newState = quizService.updateStudySettings(
      studyState,
      newSettings,
      quiz.questions,
    );
    setStudyState(newState);
  };

  const handleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
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
  if (error || !quiz && !isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="text-red-500 text-6xl">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Quiz Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            The quiz you're looking for doesn't exist or has been
            removed.
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
          <p className="text-gray-600 dark:text-gray-400">No questions available</p>
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
    <>
      {/* Header Section */}
      <div
        className={cn(
          "space-y-3",
          isFullscreen ? "mb-6" : "mb-4",
        )}
      >
        <div className="flex items-center gap-3">
          <h1
            className={cn(
              "font-bold font-crimson-text text-foreground",
              isFullscreen ? "text-3xl" : "text-2xl",
            )}
          >
            {quiz.title}
          </h1>
          {quiz.difficulty_level && (
            <Badge variant="secondary" className={quizService.getDifficultyColorClass(quiz.difficulty_level)}>
              {quizService.formatDifficultyLevel(quiz.difficulty_level)}
            </Badge>
          )}
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
              <BookOpen className="h-4 w-4" />
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

      {/* Main Quiz Area */}
      <div className="flex-1 flex flex-col justify-center">
        {/* Question Container */}
        <div className="flex-1 flex items-center justify-center">
          <div className="relative w-full flex justify-center items-center">
            <QuizQuestion
              question={currentQuestion}
              answerState={studyState.currentAnswerState}
              onAnswerSelect={handleAnswerSelect}
              onNext={handleNextQuestion}
              isFullscreen={isFullscreen}
            />
          </div>
        </div>

        {/* Progress Bar - Fixed height container to prevent layout shift */}
        <div className="h-16 mb-4">
          {trackProgress && (
            <QuizControls
              settings={studyState.settings}
              onSettingsChange={(newSettings) => {
                if (!quiz?.questions) return;
                const newState = quizService.updateStudySettings(
                  studyState,
                  newSettings,
                  quiz.questions,
                );
                setStudyState(newState);
              }}
              progress={studyState.progress}
              onNext={handleNextQuestion}
              onPrevious={handlePreviousQuestion}
              canNavigateNext={studyState.currentAnswerState.hasAnswered}
              canNavigatePrevious={true}
            />
          )}
        </div>

        {/* Bottom Controls */}
        <div
          className={cn(
            "flex items-center justify-between bg-card rounded-lg shadow-sm flex-shrink-0",
            isFullscreen ? "p-6 mx-8" : "p-4",
          )}
        >
          {/* Left Controls */}
          <div className="flex items-center gap-2">
            <Button
              onClick={handleRandomize}
              variant="ghost"
              size="icon"
              className={cn(
                "cursor-pointer hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                studyState?.settings.mode === "random" &&
                  "bg-sidebar-accent text-sidebar-accent-foreground",
              )}
            >
              <Shuffle className="h-4 w-4" />
            </Button>
            <Button
              onClick={handleEditMode}
              variant="ghost"
              size="icon"
              className="cursor-pointer hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              <Edit3 className="h-4 w-4" />
            </Button>
          </div>

          {/* Center Progress Text */}
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">{progressText}</span>
            {studyState.progress.answeredQuestions.size > 0 && (
              <Badge variant="outline">
                Score: {studyState.progress.correctAnswers.size}/{studyState.progress.answeredQuestions.size}
              </Badge>
            )}
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-xs text-muted-foreground">
                Track progress
              </label>
              <Checkbox
                checked={trackProgress}
                onCheckedChange={(checked) =>
                  setTrackProgress(checked === true)}
              />
            </div>
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
    </>
  );

  return (
    <>
      {/* Normal Layout */}
      {!isFullscreen && (
        <div
          className="bg-background flex flex-col"
          style={{ height: "calc(100vh - 4rem)" }}
        >
          <div className="max-w-4xl mx-auto p-6 h-full flex flex-col justify-center overflow-hidden">
            {renderContent()}
          </div>
        </div>
      )}

      {/* Fullscreen Layout */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-background flex flex-col animate-in fade-in-0 duration-300">
          <div className="max-w-[90vw] mx-auto p-8 h-full flex flex-col justify-center overflow-hidden">
            {renderContent()}
          </div>
        </div>
      )}
    </>
  );
}