"use client";

import { StudyProgress, StudySettings } from "@/lib/types/QuizTypes";
import { quizService } from "../services/quiz.service";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  List,
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
}

export function QuizControls({
  settings,
  onSettingsChange,
  progress,
  onNext,
  onPrevious,
  canNavigateNext,
  canNavigatePrevious,
}: QuizControlsProps) {
  const progressPercentage = quizService.getProgressPercentage(progress);
  const progressText = quizService.getProgressText(progress);
  const scoreText = quizService.getScoreText(progress);

  const handleModeToggle = () => {
    const newMode = settings.mode === "ordered" ? "random" : "ordered";
    onSettingsChange({ ...settings, mode: newMode });
  };

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
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className={cn(
              "h-2 rounded-full transition-all duration-300",
              progress.isComplete ? "bg-green-500" : "bg-blue-500",
            )}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        {/* Score Display */}
        {progress.answeredQuestions.size > 0 && (
          <div className="text-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Current Score:{" "}
              {progress.correctAnswers.size}/{progress.answeredQuestions.size}
              {" "}
              correct
              {progress.answeredQuestions.size > 0 && (
                <>
                  ({Math.round(
                    (progress.correctAnswers.size /
                      progress.answeredQuestions.size) * 100,
                  )}%)
                </>
              )}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

