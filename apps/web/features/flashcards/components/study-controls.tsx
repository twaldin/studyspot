"use client";

import { StudySettings, StudyProgress } from "@/features/flashcards/types";
import { getProgressPercentage, getProgressText } from "../services/flashcard.service";
import { Button } from "@studyspot/ui/components/button";
import { Badge } from "@studyspot/ui/components/badge";
import { 
  ArrowRight, 
  SkipForward, 
  Shuffle, 
  List,
  RotateCcw,
  CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";

interface StudyControlsProps {
  settings: StudySettings;
  onSettingsChange: (settings: StudySettings) => void;
  progress: StudyProgress;
  onNext: () => void;
  onSkip: () => void;
  canNavigate: boolean;
}

export function StudyControls({
  settings,
  onSettingsChange,
  progress,
  onNext,
  onSkip,
  canNavigate,
}: StudyControlsProps) {
  const progressPercentage = getProgressPercentage(progress);
  const progressText = getProgressText(progress);

  const handleModeToggle = () => {
    const newMode = settings.mode === 'ordered' ? 'random' : 'ordered';
    onSettingsChange({ ...settings, mode: newMode });
  };

  const handlePracticeSideToggle = () => {
    const newPracticeSide = settings.practiceSide === 'side1-first' ? 'side2-first' : 'side1-first';
    onSettingsChange({ ...settings, practiceSide: newPracticeSide });
  };

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Study Progress
          </span>
          <Badge variant={progress.isComplete ? "default" : "secondary"}>
            {progress.isComplete ? (
              <CheckCircle2 className="h-3 w-3 mr-1" />
            ) : null}
            {progressText}
          </Badge>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className={cn(
              "h-2 rounded-full transition-all duration-300",
              progress.isComplete 
                ? "bg-green-500" 
                : "bg-blue-500"
            )}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex justify-center space-x-4">
        <Button
          onClick={onSkip}
          variant="outline"
          size="lg"
          disabled={!canNavigate}
          className="flex items-center gap-2"
        >
          <SkipForward className="h-4 w-4" />
          Skip
        </Button>
        
        <Button
          onClick={onNext}
          size="lg"
          disabled={!canNavigate}
          className="flex items-center gap-2 min-w-[120px]"
        >
          Next Card
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Study Settings */}
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        {/* Mode Toggle */}
        <Button
          onClick={handleModeToggle}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          {settings.mode === 'ordered' ? (
            <>
              <List className="h-4 w-4" />
              Ordered
            </>
          ) : (
            <>
              <Shuffle className="h-4 w-4" />
              Random
            </>
          )}
        </Button>

        {/* Practice Side Toggle */}
        <Button
          onClick={handlePracticeSideToggle}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <RotateCcw className="h-4 w-4" />
          {settings.practiceSide === 'side1-first' 
            ? 'Front → Back' 
            : 'Back → Front'
          }
        </Button>
      </div>

      {/* Help Text */}
      <div className="text-center space-y-1">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Click the card to flip • Use Skip to see the answer and move on
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Cards will loop infinitely for continuous practice
        </p>
      </div>
    </div>
  );
}