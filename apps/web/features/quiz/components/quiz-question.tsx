"use client";

import { motion } from "framer-motion";
import { Check, ChevronLeft, ChevronRight, X } from "lucide-react";
import { useMemo } from "react";
import {
  OptionLabel,
  QuestionAnswerState,
  QuizMode,
  QuizQuestion as QuizQuestionType,
} from "@/features/quiz/types";
import { Card, CardContent } from "@studyspot/ui/components/card";
import { Button } from "@studyspot/ui/components/button";
import { cn } from "@studyspot/ui/lib/utils";
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

interface ShuffledOption {
  originalLabel: OptionLabel;
  text: string;
  displayIndex: number;
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
  // Shuffle answers while maintaining correct answer tracking
  const shuffledOptions = useMemo<ShuffledOption[]>(() => {
    const baseOptions = [
      { originalLabel: "A" as OptionLabel, text: question.option_a },
      { originalLabel: "B" as OptionLabel, text: question.option_b },
      { originalLabel: "C" as OptionLabel, text: question.option_c },
      { originalLabel: "D" as OptionLabel, text: question.option_d },
    ].filter(opt => opt.text); // Remove empty options
    
    // Don't shuffle in review mode to maintain consistency
    if (quizMode === 'review' || answerState.hasAnswered) {
      return baseOptions.map((opt, idx) => ({
        ...opt,
        displayIndex: idx
      }));
    }
    
    // Create a deterministic shuffle based on question ID
    // This ensures the same question always has the same shuffle pattern
    const seed = question.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const shuffled = [...baseOptions];
    
    // Fisher-Yates shuffle with seeded randomness
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(((seed * (i + 1)) % 1000) / 1000 * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    return shuffled.map((opt, idx) => ({
      ...opt,
      displayIndex: idx
    }));
  }, [question.id, question.option_a, question.option_b, question.option_c, question.option_d, quizMode, answerState.hasAnswered]);

  // Filter options when user answered incorrectly - only show selected and correct answers
  const visibleOptions = useMemo(() => {
    if (answerState.hasAnswered && !answerState.isCorrect) {
      // Only show the selected wrong answer and the correct answer
      return shuffledOptions.filter(option => 
        option.originalLabel === answerState.selectedAnswer || 
        option.originalLabel === question.correct_answer
      );
    }
    return shuffledOptions;
  }, [shuffledOptions, answerState, question.correct_answer]);

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
        "relative w-full h-full mx-auto flex flex-col",
        className,
      )}
    >
      {/* Question Card - Takes available space */}
      <Card className="w-full h-full bg-card shadow-lg rounded-xl overflow-hidden flex flex-col">
        <CardContent 
          className="h-full flex flex-col overflow-hidden min-h-0"
          style={{
            padding: 'clamp(1rem, 3vw, 1.5rem)'
          }}
        >
          {/* Question Text - Fixed height portion */}
          <div className="flex-shrink-0 mb-4 text-center">
            <QuizContent
              content={question.question_text}
              className="font-semibold text-gray-900 dark:text-gray-100"
              style={{
                fontSize: 'clamp(1rem, 2.5vw, 1.5rem)',
                lineHeight: '1.4'
              }}
            />
          </div>

          {/* Answer Options Grid - Flexible height portion */}
          <div className="flex-1 min-h-0 overflow-hidden">
            <div 
              className={cn(
                "h-full grid gap-2 md:gap-3",
                visibleOptions.length === 2 && "grid-cols-1 md:grid-cols-2",
                visibleOptions.length === 3 && "grid-cols-1",
                visibleOptions.length === 4 && "grid-cols-1 md:grid-cols-2",
                visibleOptions.length > 4 && "grid-cols-1"
              )}
              style={{
                gridAutoRows: visibleOptions.length <= 2 ? "1fr" : 
                              visibleOptions.length === 3 ? "minmax(0, 1fr)" :
                              visibleOptions.length === 4 ? "minmax(0, 1fr)" :
                              "minmax(80px, 1fr)"
              }}
            >
              {visibleOptions.map((option) => {
                const state = getOptionState(option.originalLabel);
                const canClick = !disabled && !answerState.hasAnswered && quizMode !== 'review';

                return (
                  <motion.div 
                    key={option.originalLabel} 
                    className="min-h-0"
                    layout
                    initial={{ opacity: 1, scale: 1 }}
                    animate={{ 
                      opacity: 1,
                      scale: 1
                    }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <Card
                      className={cn(
                        "h-full border-2 transition-all duration-300 cursor-pointer",
                        getOptionClassName(state),
                        canClick && "hover:shadow-md hover:scale-[1.02]",
                      )}
                      onClick={() => canClick && onAnswerSelect(option.originalLabel)}
                    >
                      <CardContent 
                        className="h-full flex items-center"
                        style={{
                          padding: 'clamp(0.75rem, 2vw, 1rem)'
                        }}
                      >
                        <div 
                          className="flex items-center w-full"
                          style={{
                            gap: 'clamp(0.5rem, 1.5vw, 0.75rem)'
                          }}
                        >
                          {/* Option Label - Display the visual label (A, B, C, D) */}
                          <div 
                            className="flex-shrink-0 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center font-bold"
                            style={{
                              width: 'clamp(2rem, 5vw, 2.5rem)',
                              height: 'clamp(2rem, 5vw, 2.5rem)',
                              fontSize: 'clamp(0.875rem, 2vw, 1.125rem)'
                            }}
                          >
                            {String.fromCharCode(65 + option.displayIndex)}
                          </div>

                          {/* Option Text */}
                          <div className="flex-1 min-w-0">
                            <QuizContent
                              content={option.text}
                              className="text-gray-900 dark:text-gray-100 font-medium line-clamp-3"
                              style={{
                                fontSize: 'clamp(0.875rem, 2vw, 1.125rem)',
                                lineHeight: '1.3'
                              }}
                            />
                          </div>

                          {/* State Icon */}
                          {getOptionIcon(option.originalLabel, state) && (
                            <div className="flex-shrink-0">
                              {getOptionIcon(option.originalLabel, state)}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>

          </div>

          {/* Feedback Section */}
          <div className="flex-shrink-0 mt-4">
            {!answerState.hasAnswered && (
              <div 
                className="text-center text-gray-500 dark:text-gray-400"
                style={{
                  fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)'
                }}
              >
                <p>Select an answer to see feedback.</p>
                <p>Questions loop for continuous practice.</p>
              </div>
            )}

            {answerState.showFeedback && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-lg border"
                style={{
                  padding: 'clamp(0.75rem, 2vw, 1rem)'
                }}
              >
                {answerState.isCorrect ? (
                  <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
                    <Check className="h-5 w-5" />
                    <span 
                      className="font-medium"
                      style={{
                        fontSize: 'clamp(0.875rem, 2vw, 1rem)'
                      }}
                    >
                      Correct!
                    </span>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-red-700 dark:text-red-300">
                      <X className="h-5 w-5" />
                      <span 
                        className="font-medium"
                        style={{
                          fontSize: 'clamp(0.875rem, 2vw, 1rem)'
                        }}
                      >
                        Incorrect. The correct answer is {String.fromCharCode(65 + shuffledOptions.findIndex(opt => opt.originalLabel === question.correct_answer))}.
                      </span>
                    </div>

                    {/* Explanation */}
                    {question.explanation && (
                      <div 
                        className="text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 pt-3"
                        style={{
                          fontSize: 'clamp(0.75rem, 1.75vw, 0.875rem)'
                        }}
                      >
                        <QuizContent content={question.explanation} />
                      </div>
                    )}

                    {/* Next Button for incorrect answers */}
                    {onNext && (
                      <div className="pt-2">
                        <Button
                          onClick={onNext}
                          variant="outline"
                          size="sm"
                          className="gap-2"
                          style={{
                            fontSize: 'clamp(0.75rem, 1.75vw, 0.875rem)'
                          }}
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
      <div 
        className="absolute bg-card dark:bg-background text-gray-900 dark:text-white font-bold rounded-full flex items-center justify-center shadow-lg"
        style={{
          top: 'clamp(-0.75rem, -2vw, -1rem)',
          right: 'clamp(-0.75rem, -2vw, -1rem)',
          width: 'clamp(2.5rem, 6vw, 3rem)',
          height: 'clamp(2.5rem, 6vw, 3rem)',
          fontSize: 'clamp(0.875rem, 2vw, 1.125rem)'
        }}
      >
        {question.order_index + 1}
      </div>
    </div>
  );
}

