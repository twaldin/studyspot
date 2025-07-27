"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useFlashcardSet } from "@/hooks/api/flashcards";
import { flashcardService } from "@/features/flashcards/services/flashcard.service";
import { Flashcard } from "@/features/flashcards/components/flashcard";
import { FlashcardEditMode } from "@/features/flashcards/components/flashcard-edit-mode";
import { 
  StudyState, 
  StudySettings,
  Flashcard as FlashcardType 
} from "@/lib/types/FlashcardTypes";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Loader2, 
  ArrowLeft, 
  ArrowRight, 
  Shuffle, 
  Edit3, 
  RotateCcw, 
  BarChart3,
  Maximize,
  User,
  BookOpen,
  Calendar
} from "lucide-react";
import { toast } from "react-hot-toast";
import { cn } from "@/lib/utils";

export default function FlashcardSetPage() {
  const params = useParams();
  const setId = params.setId as string;
  
  const { data: flashcardSet, isLoading, error } = useFlashcardSet(setId);
  
  const [isEditMode, setIsEditMode] = useState(false);
  const [studyState, setStudyState] = useState<StudyState | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [trackProgress, setTrackProgress] = useState(true);

  // Initialize study state when flashcard set loads
  useEffect(() => {
    if (flashcardSet?.cards && flashcardSet.cards.length > 0 && !studyState) {
      const initialStudyState = flashcardService.initializeStudyState(flashcardSet.cards);
      setStudyState(initialStudyState);
    }
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
    const newState = flashcardService.flipCard(studyState);
    setStudyState(newState);
  };

  const handleNextCard = () => {
    if (!studyState) return;
    const newState = flashcardService.navigateToNextCard(studyState);
    setStudyState(newState);
  };

  const handlePrevCard = () => {
    if (!studyState) return;
    const newState = flashcardService.navigateToPreviousCard(studyState);
    setStudyState(newState);
  };

  const handleRandomize = () => {
    if (!studyState || !flashcardSet?.cards) return;
    const newSettings = { ...studyState.settings, mode: 'random' as const };
    const newState = flashcardService.updateStudySettings(
      studyState,
      newSettings,
      flashcardSet.cards
    );
    setStudyState(newState);
  };

  const handleSwapSides = () => {
    if (!studyState) return;
    const newSettings = { 
      ...studyState.settings, 
      practiceSide: studyState.settings.practiceSide === 'side1-first' ? 'side2-first' : 'side1-first'
    };
    const newState = flashcardService.updateStudySettings(
      studyState,
      newSettings,
      flashcardSet?.cards || []
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
          <p className="text-gray-600 dark:text-gray-400">Loading flashcard set...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !flashcardSet) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="text-red-500 text-6xl">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Flashcard Set Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            The flashcard set you're looking for doesn't exist or has been removed.
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

  // Main flashcard view - similar to Quizlet
  if (!studyState) {
    return null;
  }

  const currentCard = flashcardService.getCurrentCard(studyState);
  const displaySide = flashcardService.getCardDisplaySide(studyState);

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

  const progressText = `${studyState.progress.currentIndex + 1} / ${studyState.progress.totalCards}`;

  const timeAgo = flashcardService.formatTimeAgo(flashcardSet.created_at);

  return (
    <div className={cn(
      "min-h-screen bg-background",
      isFullscreen && "fixed inset-0 z-50"
    )}>
      <div className="max-w-4xl mx-auto p-6">
        {/* Header Section */}
        <div className="mb-6 space-y-4">
          <h1 className="text-2xl font-bold text-foreground">
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
                <span>{flashcardSet.course_code} - {flashcardSet.course_name}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Created {timeAgo}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Flashcard Area */}
        <div className="space-y-6">
          {/* Flashcard Container */}
          <div className="relative">
            <div className="w-full h-96 flex justify-center items-start pt-8">
              <Flashcard
                card={currentCard}
                isFlipped={studyState.isFlipped}
                showSide={displaySide}
                onFlip={handleFlipCard}
              />
            </div>

            {/* Navigation Arrows */}
            <Button
              onClick={handlePrevCard}
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white hover:bg-white/80 dark:bg-gray-600 dark:hover:bg-gray-700 shadow-lg"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <Button
              onClick={handleNextCard}
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white hover:bg-white/80 dark:bg-gray-600 dark:hover:bg-gray-700 shadow-lg"
            >
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>

          {/* Bottom Controls */}
          <div className="flex items-center justify-between bg-card rounded-lg p-4 shadow-sm">
            {/* Left Controls */}
            <div className="flex items-center gap-2">
              <Button
                onClick={handleRandomize}
                variant="ghost"
                size="icon"
                className="hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Shuffle className="h-4 w-4" />
              </Button>
              <Button
                onClick={handleEditMode}
                variant="ghost"
                size="icon"
                className="hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Edit3 className="h-4 w-4" />
              </Button>
              <Button
                onClick={handleSwapSides}
                variant="ghost"
                size="icon"
                className="hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>

            {/* Center - Created By */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              <span>Created by</span>
              <span className="font-medium text-foreground">
                {flashcardSet.creator_name}
              </span>
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <label className="text-xs text-muted-foreground">Track progress</label>
                <Checkbox
                  checked={trackProgress}
                  onCheckedChange={setTrackProgress}
                />
              </div>
              <Button
                onClick={handleFullscreen}
                variant="ghost"
                size="icon"
                className="hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Maximize className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Progress Bar - Conditionally Rendered Below Controls */}
          {trackProgress && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">
                  Study Progress
                </span>
                <Badge variant={studyState.progress.isComplete ? "default" : "secondary"}>
                  {flashcardService.getProgressText(studyState.progress)}
                </Badge>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className={cn(
                    "h-2 rounded-full transition-all duration-300",
                    studyState.progress.isComplete 
                      ? "bg-green-500" 
                      : "bg-primary"
                  )}
                  style={{ width: `${flashcardService.getProgressPercentage(studyState.progress)}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}