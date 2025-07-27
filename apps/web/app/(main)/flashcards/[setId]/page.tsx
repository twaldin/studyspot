"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useFlashcardSet } from "@/hooks/api/flashcards";
import { flashcardService } from "@/features/flashcards/services/flashcard.service";
import { FlashcardSetPreview } from "@/features/flashcards/components/flashcard-set-preview";
import { Flashcard } from "@/features/flashcards/components/flashcard";
import { StudyControls } from "@/features/flashcards/components/study-controls";
import { FlashcardEditMode } from "@/features/flashcards/components/flashcard-edit-mode";
import { 
  FlashcardPageMode, 
  StudyState, 
  StudySettings,
  Flashcard as FlashcardType 
} from "@/lib/types/FlashcardTypes";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";

export default function FlashcardSetPage() {
  const params = useParams();
  const setId = params.setId as string;
  
  const { data: flashcardSet, isLoading, error } = useFlashcardSet(setId);
  
  const [mode, setMode] = useState<FlashcardPageMode>('preview');
  const [studyState, setStudyState] = useState<StudyState | null>(null);

  // Handle mode transitions
  const handleStudyMode = () => {
    if (!flashcardSet?.cards || flashcardSet.cards.length === 0) {
      toast.error("No cards available to study");
      return;
    }
    
    const initialStudyState = flashcardService.initializeStudyState(flashcardSet.cards);
    setStudyState(initialStudyState);
    setMode('study');
  };

  const handleEditMode = () => {
    setMode('edit');
  };

  const handleBackToPreview = () => {
    setMode('preview');
    setStudyState(null);
  };

  // Study mode handlers
  const handleFlipCard = () => {
    if (!studyState) return;
    const newState = flashcardService.flipCard(studyState);
    setStudyState(newState);
  };

  const handleNextCard = () => {
    if (!studyState) return;
    if (!studyState.isFlipped) {
      toast("Flip the card first to see the answer!", { icon: "👆" });
      return;
    }
    const newState = flashcardService.navigateToNextCard(studyState);
    setStudyState(newState);
  };

  const handleSkipCard = () => {
    if (!studyState) return;
    const newState = flashcardService.skipCurrentCard(studyState);
    setStudyState(newState);
  };

  const handleSettingsChange = (newSettings: StudySettings) => {
    if (!studyState || !flashcardSet?.cards) return;
    const newState = flashcardService.updateStudySettings(
      studyState,
      newSettings,
      flashcardSet.cards
    );
    setStudyState(newState);
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

  // Render based on current mode
  switch (mode) {
    case 'preview':
      return (
        <FlashcardSetPreview
          flashcardSet={flashcardSet}
          onStudy={handleStudyMode}
          onEdit={handleEditMode}
        />
      );

    case 'study':
      if (!studyState) {
        return null; // Should not happen, but just in case
      }

      const currentCard = flashcardService.getCurrentCard(studyState);
      const displaySide = flashcardService.getCardDisplaySide(studyState);

      if (!currentCard) {
        return (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center space-y-4">
              <p className="text-gray-600 dark:text-gray-400">No cards available</p>
              <Button onClick={handleBackToPreview}>Back to Preview</Button>
            </div>
          </div>
        );
      }

      return (
        <div className="max-w-6xl mx-auto p-6 space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                onClick={handleBackToPreview}
                variant="ghost"
                size="sm"
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Preview
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  {flashcardSet.title}
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Study Mode
                </p>
              </div>
            </div>
          </div>

          {/* Study Area */}
          <div className="flex flex-col items-center space-y-8">
            {/* Flashcard container with defined height */}
            <div className="w-full h-96 flex justify-center items-start">
              <Flashcard
                card={currentCard}
                isFlipped={studyState.isFlipped}
                showSide={displaySide}
                onFlip={handleFlipCard}
              />
            </div>

            {/* Study Controls */}
            <StudyControls
              settings={studyState.settings}
              onSettingsChange={handleSettingsChange}
              progress={studyState.progress}
              onNext={handleNextCard}
              onSkip={handleSkipCard}
              canNavigate={true}
            />
          </div>
        </div>
      );

    case 'edit':
      return (
        <FlashcardEditMode
          flashcardSet={flashcardSet}
          onBack={handleBackToPreview}
        />
      );

    default:
      return null;
  }
}