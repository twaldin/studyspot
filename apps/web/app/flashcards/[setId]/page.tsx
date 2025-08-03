"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useFlashcardSet } from "@/hooks/api/flashcards";
import {
  initializeStudyState,
  flipCard,
  navigateToNextCard,
  navigateToPreviousCard,
  updateStudySettings,
  getCurrentCard,
  getCardDisplaySide,
  getProgressText,
  getProgressPercentage,
  formatTimeAgo,
} from "@/features/flashcards/services/flashcard.service";
import dynamic from "next/dynamic";

// Dynamically import heavy flashcard components to reduce initial bundle size
const Flashcard = dynamic(
  () => import("@/features/flashcards/components/flashcard").then(mod => ({ default: mod.Flashcard })),
  {
    loading: () => <div className="animate-pulse bg-muted rounded-lg h-64 flex items-center justify-center">Loading...</div>,
    ssr: false
  }
);

const FlashcardEditMode = dynamic(
  () => import("@/features/flashcards/components/flashcard-edit-mode").then(mod => ({ default: mod.FlashcardEditMode })),
  {
    loading: () => <div className="animate-pulse bg-muted rounded-lg h-32 flex items-center justify-center">Loading editor...</div>,
    ssr: false
  }
);
import {
  Flashcard as FlashcardType,
  StudyMode,
  StudySettings,
  StudyState,
} from "@/features/flashcards/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  BookOpen,
  Calendar,
  Edit3,
  Loader2,
  Maximize,
  RotateCcw,
  Shuffle,
  User,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { cn } from "@/lib/utils";
import { useConfetti } from "@/hooks/use-confetti";

export default function FlashcardSetPage() {
  const params = useParams();
  const setId = params.setId as string;

  const { data: flashcardSet, isLoading, error } = useFlashcardSet(setId);
  const { fireFlashcardComplete } = useConfetti();

  // Disable body scrolling when component mounts
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const [isEditMode, setIsEditMode] = useState(false);
  const [studyState, setStudyState] = useState<StudyState | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Initialize study state when flashcard set loads
  useEffect(() => {
    if (flashcardSet?.cards && flashcardSet.cards.length > 0 && !studyState) {
      const initialStudyState = initializeStudyState(
        flashcardSet.cards,
      );
      setStudyState(initialStudyState);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flashcardSet]);

  const handleEditMode = () => {
    setIsEditMode(true);
  };

  const handleBackFromEdit = () => {
    setIsEditMode(false);
  };

  // Study handlers
  const handleFlipCard = () => {
    if (!studyState) return;
    const newState = flipCard(studyState);
    setStudyState(newState);
  };

  const handleNextCard = () => {
    if (!studyState) return;
    const newState = navigateToNextCard(studyState);

    // Fire confetti when completing the set
    if (newState.progress.isComplete && !studyState.progress.isComplete) {
      setTimeout(() => {
        fireFlashcardComplete();
      }, 300);
    }

    setStudyState(newState);
  };

  const handlePrevCard = () => {
    if (!studyState) return;
    const newState = navigateToPreviousCard(studyState);
    setStudyState(newState);
  };

  const handleRandomize = () => {
    if (!studyState || !flashcardSet?.cards) return;
    const newMode: StudyMode = studyState.settings.mode === "ordered"
      ? "random"
      : "ordered";
    const newSettings = { ...studyState.settings, mode: newMode };
    const newState = updateStudySettings(
      studyState,
      newSettings,
      flashcardSet.cards,
    );
    setStudyState(newState);
  };

  const handleSwapSides = () => {
    if (!studyState) return;
    const newSettings: StudySettings = {
      ...studyState.settings,
      practiceSide: studyState.settings.practiceSide === "side1-first"
        ? "side2-first"
        : "side1-first",
    };
    const newState = updateStudySettings(
      studyState,
      newSettings,
      flashcardSet?.cards || [],
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
            Loading flashcard set...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !flashcardSet && !isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="text-red-500 text-6xl">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Flashcard Set Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            The flashcard set you're looking for doesn't exist or has been
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
      <FlashcardEditMode
        flashcardSet={flashcardSet}
        onBack={handleBackFromEdit}
      />
    );
  }

  // Main flashcard view
  if (!studyState) {
    return null;
  }

  const currentCard = getCurrentCard(studyState);
  const displaySide = getCardDisplaySide(studyState);

  if (!currentCard) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <p className="text-gray-600 dark:text-gray-400">No cards available</p>
          <Button onClick={() => window.history.back()}>Go Back</Button>
        </div>
      </div>
    );
  }

  const progressText = `${
    studyState.progress.currentCardIndex + 1
  } / ${studyState.progress.totalCards}`;

  const timeAgo = formatTimeAgo(flashcardSet.created_at);

  const renderContent = () => (
    <div className="flex flex-col h-full">
      {/* Header Section - Fixed at top */}
      <div className="flex-shrink-0 space-y-3 mb-4">
        <h1
          className={cn(
            "font-bold font-crimson-text text-foreground",
            isFullscreen ? "text-3xl" : "text-2xl",
          )}
        >
          {flashcardSet.title}
        </h1>

        {/* Course and Meta Info */}
        <div className="space-y-2">
          <p className="text-lg text-muted-foreground">
            {flashcardSet.description}
          </p>

          {/* Show "edited from" info if this is an edit */}
          {flashcardSet.edited_from && flashcardSet.original_title && (
            <p className="text-sm text-muted-foreground italic">
              (edited from '{flashcardSet.original_title}')
              {/* TODO: Add link to original when we have navigation */}
            </p>
          )}

          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span>
                {flashcardSet.course_code} - {flashcardSet.course_name}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Created {timeAgo} by {flashcardSet.creator_name}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Flashcard Area - Takes remaining space */}
      <div className="flex-1 flex items-center justify-center min-h-0">
        <div className="relative w-full h-full max-w-4xl flex justify-center items-center">
          <Flashcard
            card={currentCard}
            isFlipped={studyState.isFlipped}
            showSide={displaySide}
            onFlip={handleFlipCard}
            isFullscreen={isFullscreen}
          />

          {/* Navigation Arrows - positioned at card edges */}
          <Button
            onClick={handlePrevCard}
            variant="ghost"
            size="icon"
            className="absolute left-0 top-1/2 cursor-pointer -translate-y-1/2 -translate-x-full ml-4 rounded-full bg-white hover:bg-gray-100/80 dark:bg-black dark:hover:bg-card shadow-lg"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Button
            onClick={handleNextCard}
            variant="ghost"
            size="icon"
            className="absolute right-0 top-1/2 cursor-pointer -translate-y-1/2 translate-x-full mr-4 rounded-full bg-white hover:bg-gray-100/80 dark:bg-black dark:hover:bg-card shadow-lg"
          >
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Footer Section - Fixed at bottom */}
      <div className="flex-shrink-0 space-y-4 mt-4">
        {/* Progress Bar */}
        <div className="w-full">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">
                Study Progress
              </span>
              <Badge
                variant={studyState.progress.isComplete
                  ? "default"
                  : "secondary"}
              >
                {getProgressText(studyState.progress)}
              </Badge>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className={cn(
                  "h-2 rounded-full transition-all duration-300",
                  studyState.progress.isComplete
                    ? "bg-green-500"
                    : "bg-primary",
                )}
                style={{
                  width: `${
                    getProgressPercentage(
                      studyState.progress,
                    )
                  }%`,
                }}
              />
            </div>
          </div>
        </div>

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
            <Button
              onClick={handleSwapSides}
              variant="ghost"
              size="icon"
              className="cursor-pointer hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2">
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
    </>
  );
}
