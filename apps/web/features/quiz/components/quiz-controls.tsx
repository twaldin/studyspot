"use client";

import { QuizMode, StudyProgress, StudySettings } from "@/features/quiz/types";
import { quizService } from "../services/quiz.service";
import { Button } from "@studyspot/ui/components/button";
import { Badge } from "@studyspot/ui/components/badge";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  List,
  Play,
  Shuffle,
  Target,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface QuizControlsProps {
  settings: StudySettings;
  onSettingsChange: (settings: StudySettings) => void;
  progress: StudyProgress;
  onNext: () => void;
  onPrevious: () => void;
  canNavigateNext: boolean;
  canNavigatePrevious: boolean;
  quizMode?: QuizMode;
}

export function QuizControls({
  settings,
  onSettingsChange,
  progress,
  onNext,
  onPrevious,
  canNavigateNext,
  canNavigatePrevious,
  quizMode = "initial",
}: QuizControlsProps) {
  const progressPercentage = quizService.getProgressPercentage(progress);
  const progressText = quizService.getProgressText(progress);
  const scoreText = quizService.getScoreText(progress);

  const handleModeToggle = () => {
    const newMode = settings.mode === "ordered" ? "random" : "ordered";
    onSettingsChange({ ...settings, mode: newMode });
  };

  // Show different displays based on quiz mode
  if (quizMode === "practice") {
    // Infinite practice mode - simple score tracker with minimal spacing
    return (
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Play className="h-4 w-4 text-blue-500" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Infinite Mode
          </span>
        </div>
        <Badge variant="secondary" className="flex items-center gap-1">
          <Target className="h-3 w-3" />
          {scoreText}
        </Badge>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Quiz Progress
          </span>
          <div className="flex items-center gap-2">
            {progress.isComplete && (
              <Badge variant="default" className="flex items-center gap-1">
                <Target className="h-3 w-3" />
                {scoreText}
              </Badge>
            )}
            <Badge variant={progress.isComplete ? "default" : "secondary"}>
              {progress.isComplete
                ? <CheckCircle2 className="h-3 w-3 mr-1" />
                : null}
              {progressText}
            </Badge>
          </div>
        </div>
        <div className="w-full bg-gray-200 dark:bg-card rounded-full h-2">
          <div
            className={cn(
              "h-2 rounded-full transition-all duration-300",
              progress.isComplete ? "bg-green-500" : "bg-blue-500",
            )}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}
