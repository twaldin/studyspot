'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@studyspot/ui/components/button';
import { SignUpButton } from '@clerk/nextjs';
import { 
  UserPlus, 
  BookOpen, 
  ArrowLeft, 
  ArrowRight, 
  RotateCcw,
  Calendar,
  Edit3,
  Shuffle,
  Share,
  Settings,
  Maximize,
  Building2,
} from 'lucide-react';
import { cn } from "@studyspot/ui/lib/utils";
import { formatTimeAgo } from "@/features/flashcards/services/flashcard.service";
import {
  initializeStudyState,
  flipCard,
  navigateToNextCard,
  navigateToPreviousCard,
  getCurrentCard,
  getCardDisplaySide,
  type StudyState,
} from "@/features/flashcards/services/flashcard.service";
import { Flashcard } from "@/features/flashcards/components/flashcard";
import { getCourseIcon } from "@/lib/utils/course-icons";

// Import the same types as the main flashcard page
interface FlashcardType {
  card_id: string;
  set_id: string;
  side1: string;
  side2: string;
  card_number: number;
  created_at?: string;
  updated_at?: string;
}

interface PublicFlashcardViewerProps {
  flashcardData: {
    id: string;
    title: string;
    description?: string;
    flashcards: FlashcardType[];
    course: {
      code: string;
      title: string;
      icon: string | null;
      school: {
        name: string;
      };
    };
  };
  onSignUpPrompt: () => void;
}

export function PublicFlashcardViewer({ flashcardData, onSignUpPrompt }: PublicFlashcardViewerProps) {
  const [studyState, setStudyState] = useState<StudyState | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const flashcards = Array.isArray(flashcardData.flashcards) ? flashcardData.flashcards : [];

  // Initialize study state when flashcards load
  useEffect(() => {
    if (flashcards && flashcards.length > 0 && !studyState) {
      const initialStudyState = initializeStudyState(flashcards);
      setStudyState(initialStudyState);
    }
  }, [flashcards, studyState]);

  // Disable body scrolling when component mounts
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const handleFlipCard = () => {
    if (studyState) {
      const newState = flipCard(studyState);
      setStudyState(newState);
    }
  };

  const handleNextCard = () => {
    if (studyState) {
      const newState = navigateToNextCard(studyState);
      setStudyState(newState);
    }
  };

  const handlePrevCard = () => {
    if (studyState) {
      const newState = navigateToPreviousCard(studyState);
      setStudyState(newState);
    }
  };

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Handle fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  if (!studyState) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <p className="text-gray-600 dark:text-gray-400">Loading flashcards...</p>
        </div>
      </div>
    );
  }

  const currentCard = getCurrentCard(studyState);
  const displaySide = getCardDisplaySide(studyState);

  if (!currentCard) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">This flashcard set doesn't have any cards yet.</p>
          <SignUpButton mode="modal" forceRedirectUrl={typeof window !== 'undefined' ? window.location.href : undefined}>
            <Button className="cursor-pointer">
              <UserPlus className="h-4 w-4 mr-2" />
              Sign Up to Create Flashcards
            </Button>
          </SignUpButton>
        </div>
      </div>
    );
  }

  const progressText = `${studyState.progress.currentCardIndex + 1} / ${studyState.progress.totalCards}`;

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
          {flashcardData.title}
        </h1>

        {/* Course and Meta Info */}
        <div className="space-y-2">
          <p className="text-lg text-muted-foreground">
            {flashcardData.description}
          </p>

          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              {(() => {
                const CourseIcon = getCourseIcon(flashcardData.course.icon);
                return <CourseIcon className="h-4 w-4" />;
              })()}
              <span>
                {flashcardData.course.code} - {flashcardData.course.title}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              <span>{flashcardData.course.school.name}</span>
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

      {/* Bottom Controls - Fixed at bottom */}
      <div className="flex-shrink-0 pt-4">
        {/* Progress only */}
        <div className="text-center mb-4">
          <div className="text-sm font-medium">{progressText}</div>
        </div>

        {/* Sign-up CTA */}
        <div className="border-t pt-4 text-center">
          <p className="text-sm text-muted-foreground mb-3">
            Want to create your own flashcard sets or study with progress tracking?
          </p>
          <SignUpButton mode="modal" forceRedirectUrl={typeof window !== 'undefined' ? window.location.href : undefined}>
            <Button className="cursor-pointer">
              <UserPlus className="h-4 w-4 mr-2" />
              Sign Up to StudySpot
            </Button>
          </SignUpButton>
        </div>
      </div>
    </div>
  );

  return (
    <div className={cn(
      "relative w-full h-full p-4 sm:p-6 md:p-8 lg:p-12 xl:p-16",
      isFullscreen && "bg-background p-8"
    )}>
      {renderContent()}
    </div>
  );
}