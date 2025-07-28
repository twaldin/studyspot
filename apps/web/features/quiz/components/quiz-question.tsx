"use client";

import { motion } from "framer-motion";
import { Check, ChevronLeft, ChevronRight, X } from "lucide-react";
import {
  OptionLabel,
  QuestionAnswerState,
  QuizMode,
  QuizQuestion as QuizQuestionType,
} from "@/lib/types/QuizTypes";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { QuizContent } from "./quiz-content";

interface QuizQuestionProps {
  question: QuizQuestionType;
  answerState: QuestionAnswerState;
  onAnswerSelect: (answer: OptionLabel) => void;
  onNext?: () => void;
  onPrevious?: () => void;
  disabled?: boolean;
  className?: string;
  isFullscreen?: boolean;
  isFinalQuestion?: boolean;
  quizMode?: QuizMode;
  correctAnswers?: Set<string>; // For review mode
  userAnswers?: Map<string, 'A' | 'B' | 'C' | 'D'>; // For review mode
  canNavigatePrevious?: boolean;
  canNavigateNext?: boolean;
}

export function QuizQuestion({
  question,
  answerState,
  onAnswerSelect,
  onNext,
  onPrevious,
  disabled = false,
  className,
  isFullscreen = false,
  isFinalQuestion = false,
  quizMode = 'initial',
  correctAnswers,
  userAnswers,
  canNavigatePrevious = false,
  canNavigateNext = false,
}: QuizQuestionProps) {
  const allOptions = [
    { label: "A" as OptionLabel, text: question.option_a },
    { label: "B" as OptionLabel, text: question.option_b },
    { label: "C" as OptionLabel, text: question.option_c },
    { label: "D" as OptionLabel, text: question.option_d },
  ];

  // Filter options when user answered incorrectly - only show selected and correct answers
  const options = answerState.hasAnswered && !answerState.isCorrect
    ? allOptions.filter(option => 
        option.label === answerState.selectedAnswer || 
        option.label === question.correct_answer
      )
    : allOptions;

  const getOptionState = (optionLabel: OptionLabel) => {
    // In review mode, show the results based on the original answer
    if (quizMode === 'review') {
      const isCorrect = question.correct_answer === optionLabel;
      const wasAnsweredCorrectly = correctAnswers?.has(question.id) ?? false;
      const userSelectedAnswer = userAnswers?.get(question.id);
      const wasUserSelection = userSelectedAnswer === optionLabel;
      
      if (isCorrect && wasAnsweredCorrectly) return "correct";
      if (isCorrect && !wasAnsweredCorrectly) return "reveal-correct";
      if (wasUserSelection && !wasAnsweredCorrectly) return "incorrect";
      return "disabled";
    }

    if (!answerState.hasAnswered) return "default";

    const isSelected = answerState.selectedAnswer === optionLabel;
    const isCorrect = question.correct_answer === optionLabel;

    if (isSelected && answerState.isCorrect) return "correct";
    if (isSelected && !answerState.isCorrect) return "incorrect";
    if (!isSelected && isCorrect && !answerState.isCorrect) {
      return "reveal-correct";
    }

    return "disabled";
  };

  const getOptionClassName = (state: string) => {
    switch (state) {
      case "correct":
        return "bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-700 dark:text-green-300";
      case "incorrect":
        return "bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-700 dark:text-red-300";
      case "reveal-correct":
        return "bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-700 dark:text-green-300 ring-2 ring-green-300 dark:ring-green-600";
      case "disabled":
        return "opacity-50 cursor-not-allowed";
      default:
        return "hover:bg-accent hover:text-accent-foreground cursor-pointer transition-colors";
    }
  };

  const getOptionIcon = (optionLabel: OptionLabel, state: string) => {
    switch (state) {
      case "correct":
        return <Check className="h-5 w-5 text-green-600 dark:text-green-400" />;
      case "incorrect":
        return <X className="h-5 w-5 text-red-600 dark:text-red-400" />;
      case "reveal-correct":
        return <Check className="h-5 w-5 text-green-600 dark:text-green-400" />;
      default:
        return null;
    }
  };

  return (
    <div
      className={cn(
        "relative w-full mx-auto",
        isFullscreen ? "w-[90vw]" : "w-full max-w-4xl",
        className,
      )}
    >
      {/* Review Mode Navigation Arrows - positioned at card edges */}
      {quizMode === 'review' && (
        <>
          {/* Left Arrow */}
          {canNavigatePrevious && onPrevious && (
            <Button
              onClick={onPrevious}
              variant="ghost"
              size="icon"
              className="absolute left-0 top-1/2 cursor-pointer -translate-y-1/2 -translate-x-full ml-4 rounded-full bg-white hover:bg-gray-100/80 dark:bg-black dark:hover:bg-card shadow-lg"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
          )}
          
          {/* Right Arrow */}
          {canNavigateNext && onNext && (
            <Button
              onClick={onNext}
              variant="ghost"
              size="icon"
              className="absolute right-0 top-1/2 cursor-pointer -translate-y-1/2 translate-x-full mr-4 rounded-full bg-white hover:bg-gray-100/80 dark:bg-black dark:hover:bg-card shadow-lg"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          )}
        </>
      )}

      {/* Question Card */}
      <Card className="w-full bg-card shadow-lg rounded-xl mb-6">
        <CardContent className="py-0 px-6">
          <div className="space-y-6">
            {/* Question Text */}
            <div className="text-center">
              <QuizContent
                content={question.question_text}
                className="text-xl md:text-2xl font-medium text-gray-900 dark:text-gray-100"
              />
            </div>

            {/* Multiple Choice Options */}
            <motion.div 
              layout
              className={cn(
                "grid gap-3 mt-8",
                // Adjust grid based on number of visible options
                options.length <= 2 
                  ? "grid-cols-2 max-w-3xl mx-auto" 
                  : "grid-cols-1 md:grid-cols-2"
              )}
            >
              {options.map((option) => {
                const state = getOptionState(option.label);
                const canClick = !disabled && !answerState.hasAnswered && quizMode !== 'review';

                return (
                  <motion.div
                    key={option.label}
                    layout
                    initial={{ opacity: 1, scale: 1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    whileHover={canClick ? { scale: 1.02 } : undefined}
                    whileTap={canClick ? { scale: 0.98 } : undefined}
                  >
                    <Card
                      className={cn(
                        "border-2 transition-all duration-300",
                        getOptionClassName(state),
                        canClick && "hover:shadow-md",
                      )}
                      onClick={() => canClick && onAnswerSelect(option.label)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          {/* Option Label */}
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center font-bold text-sm">
                            {option.label}
                          </div>

                          {/* Option Text */}
                          <div className="flex-1">
                            <QuizContent
                              content={option.text}
                              className="text-base"
                            />
                          </div>

                          {/* State Icon */}
                          <div className="flex-shrink-0">
                            {getOptionIcon(option.label, state)}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* Feedback Section */}
            {!answerState.hasAnswered && (
              <div className="text-sm text-center text-gray-500 dark:text-gray-400 mt-6">
                <p>Select an answer to see feedback.</p>
                <p>Questions loop for continuous practice.</p>
              </div>
            )}

            {answerState.showFeedback && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 rounded-lg border"
              >
                {answerState.isCorrect
                  ? (
                    <div className="flex items-center gap-3 text-green-700 dark:text-green-300">
                      <Check className="h-5 w-5" />
                      <span className="font-medium">Correct!</span>
                    </div>
                  )
                  : (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-red-700 dark:text-red-300">
                        <X className="h-5 w-5" />
                        <span className="font-medium">
                          Incorrect. The correct answer is{" "}
                          {question.correct_answer}.
                        </span>
                      </div>

                      {/* Explanation */}
                      {question.explanation && (
                        <div className="text-sm text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
                          <QuizContent
                            content={question.explanation}
                            className="text-sm"
                          />
                        </div>
                      )}

                      {/* Next Button for incorrect answers */}
                      {onNext && (
                        <div className="pt-3">
                          <Button
                            onClick={onNext}
                            variant="outline"
                            size="sm"
                            className="gap-2"
                          >
                            {isFinalQuestion ? "Finish Quiz" : "Next Question"}
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
              </motion.div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Question Number Indicator */}
      <div className="absolute -top-4 -right-4 bg-card dark:bg-background text-gray-900 dark:text-white text-xs font-bold rounded-full w-8 h-8 flex items-center justify-center shadow-lg">
        {question.order_index + 1}
      </div>
    </div>
  );
}

