"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@studyspot/ui/components/dialog"
import { Button } from "@studyspot/ui/components/button"
import { CheckCircle2, RotateCcw, Eye, Play } from "lucide-react"
import { StudyProgress } from "@/features/quiz/types"

export type QuizCompletionMode = 'review' | 'retake' | 'practice' | null

interface QuizCompletionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  progress: StudyProgress
  onModeSelect: (mode: QuizCompletionMode) => void
}

export function QuizCompletionDialog({
  open,
  onOpenChange,
  progress,
  onModeSelect,
}: QuizCompletionDialogProps) {
  const scorePercentage = Math.round((progress.correctAnswers.size / progress.totalQuestions) * 100)
  const correctCount = progress.correctAnswers.size
  const totalCount = progress.totalQuestions

  const getScoreColor = (percentage: number) => {
    if (percentage >= 90) return "text-green-600"
    if (percentage >= 80) return "text-blue-600"
    if (percentage >= 70) return "text-yellow-600"
    return "text-red-600"
  }

  const handleReview = () => {
    onModeSelect('review')
    onOpenChange(false)
  }

  const handleRetake = () => {
    onModeSelect('retake')
    onOpenChange(false)
  }

  const handlePractice = () => {
    onModeSelect('practice')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-6 w-6 text-green-600" />
          </div>
          <DialogTitle className="text-center text-2xl">
            Quiz Complete!
          </DialogTitle>
          <DialogDescription className="text-center">
            Great job finishing the quiz. Here's how you did:
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {/* Score Display */}
          <div className="text-center space-y-2">
            <div className={`text-4xl font-bold ${getScoreColor(scorePercentage)}`}>
              {scorePercentage}%
            </div>
            <div className="text-sm text-muted-foreground">
              {correctCount} out of {totalCount} questions correct
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row sm:justify-between gap-2">
          <Button
            variant="outline"
            className="w-full sm:w-auto"
            onClick={handleReview}
          >
            <Eye className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Review</span>
            <span className="sm:hidden">Review Answers</span>
          </Button>
          <div className="flex w-full sm:w-auto gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleRetake}
            >
              <RotateCcw className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Retake</span>
              <span className="sm:hidden">Retake Quiz</span>
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={handlePractice}
            >
              <Play className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Practice</span>
              <span className="sm:hidden">Continue Practice</span>
            </Button>
          </div>
          <Button 
            variant="secondary" 
            onClick={() => onOpenChange(false)} 
            className="w-full sm:w-auto"
          >
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}