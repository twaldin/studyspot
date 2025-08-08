"use client";

import { motion } from "framer-motion";
import { Check, ChevronLeft, ChevronRight, X } from "lucide-react";
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

  // Calculate dynamic font sizes based on content length
  const getQuestionFontSize = (text: string) => {
    const length = text.length;
    if (length < 50) return "clamp(1rem,5cqw,2.5rem)"; // Short question - large text
    if (length < 100) return "clamp(0.875rem,4.5cqw,2rem)"; // Medium question
    if (length < 200) return "clamp(0.75rem,4cqw,1.75rem)"; // Long question
    return "clamp(0.625rem,3.5cqw,1.5rem)"; // Very long question
  };

  const getOptionFontSize = (text: string, optionCount: number) => {
    const length = text.length;
    const baseScale = optionCount === 4 ? 0.85 : 1; // Smaller for 2x2 grid
    
    if (length < 20) return `clamp(${0.75 * baseScale}rem,${3 * baseScale}cqw,${1.25 * baseScale}rem)`; // Short option
    if (length < 40) return `clamp(${0.625 * baseScale}rem,${2.5 * baseScale}cqw,${1.125 * baseScale}rem)`; // Medium option
    if (length < 80) return `clamp(${0.5 * baseScale}rem,${2.25 * baseScale}cqw,${1 * baseScale}rem)`; // Long option
    return `clamp(${0.5 * baseScale}rem,${2 * baseScale}cqw,${0.875 * baseScale}rem)`; // Very long option
  };

  const getMaxTextLines = (text: string, optionCount: number) => {
    const length = text.length;
    if (optionCount === 4) {
      // 2x2 grid - more restrictive
      if (length < 30) return 2;
      return 3;
    }
    // Other layouts - more generous
    if (length < 50) return 2;
    if (length < 100) return 3;
    return 4;
  };

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
        "relative w-full h-full mx-auto",
        className,
      )}
      style={{
        containerType: "size",
      }}
    >
      {/* Question Card - Takes available space */}
      <Card className="w-full h-full bg-card shadow-lg rounded-xl overflow-hidden">
        <CardContent className="p-[clamp(0.75rem,3cqw,2rem)] h-full flex flex-col overflow-hidden min-h-0">
          <div className="h-full flex flex-col min-h-0" style={{ gap: "clamp(0.5rem,2cqh,1.5rem)" }}>
            {/* Question Text */}
            <div 
              className="text-center"
              style={{
                fontSize: getQuestionFontSize(question.question_text),
                lineHeight: "1.25",
                flex: "0 1 auto",
                maxHeight: "35%",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <QuizContent
                content={question.question_text}
                className="font-semibold text-gray-900 dark:text-gray-100"
              />
            </div>

            {/* Multiple Choice Options */}
            <div 
              className="grid min-h-0"
              style={{
                gridTemplateColumns: options.length === 2 ? "1fr 1fr" : 
                                   options.length === 3 ? "1fr" : 
                                   options.length === 4 ? "1fr 1fr" : "1fr",
                gridTemplateRows: options.length === 2 ? "1fr" : 
                                 options.length === 3 ? "repeat(3, minmax(0, 1fr))" : 
                                 options.length === 4 ? "1fr 1fr" : 
                                 `repeat(${options.length}, minmax(0, 1fr))`,
                gap: "clamp(0.25rem,1.5cqh,0.75rem)",
                flex: "1 1 0",
                minHeight: "0",
                height: "100%",
              }}
            >
              {options.map((option) => {
                const state = getOptionState(option.label);
                const canClick = !disabled && !answerState.hasAnswered && quizMode !== 'review';

                return (
                  <motion.div 
                    key={option.label} 
                    className="min-h-0 min-w-0"
                    layout
                    initial={{ opacity: 1, scale: 1 }}
                    animate={{ 
                      opacity: answerState.hasAnswered && !answerState.isCorrect && 
                        !(option.label === answerState.selectedAnswer || option.label === question.correct_answer) ? 0.3 : 1,
                      scale: 1
                    }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    style={{
                      height: "100%",
                      minHeight: "0",
                      display: "flex",
                      flexDirection: "column"
                    }}
                  >
                    <Card
                      className={cn(
                        "border-2 transition-all duration-300 cursor-pointer flex-1",
                        getOptionClassName(state),
                        canClick && "hover:shadow-md",
                      )}
                      onClick={() => canClick && onAnswerSelect(option.label)}
                      style={{
                        minHeight: "0",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column"
                      }}
                    >
                      <CardContent 
                        className="flex-1 flex items-center overflow-hidden"
                        style={{
                          padding: "clamp(0.5rem,min(2cqh,2cqw),1rem)",
                          minHeight: "0"
                        }}
                      >
                        <div 
                          className="flex items-center w-full min-w-0"
                          style={{
                            gap: "clamp(0.25rem,min(1.5cqw,1.5cqh),0.75rem)"
                          }}
                        >
                          {/* Option Label */}
                          <div 
                            className="flex-shrink-0 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center font-bold"
                            style={{
                              width: "clamp(1.25rem,min(3.5cqw,3.5cqh),2rem)",
                              height: "clamp(1.25rem,min(3.5cqw,3.5cqh),2rem)",
                              fontSize: "clamp(0.625rem,min(1.75cqw,1.75cqh),0.875rem)"
                            }}
                          >
                            {option.label}
                          </div>

                          {/* Option Text */}
                          <div className="flex-1 min-w-0 overflow-hidden">
                            <QuizContent
                              content={option.text}
                              className="leading-tight text-gray-900 dark:text-gray-100 font-medium"
                              style={{
                                fontSize: getOptionFontSize(option.text, options.length),
                                lineHeight: "1.3",
                                display: "-webkit-box",
                                WebkitLineClamp: getMaxTextLines(option.text, options.length),
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden"
                              }}
                            />
                          </div>

                          {/* State Icon */}
                          <div 
                            className="flex-shrink-0"
                            style={{
                              fontSize: "clamp(0.75rem,min(2cqw,2cqh),1rem)"
                            }}
                          >
                            {getOptionIcon(option.label, state)}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>

            {/* Feedback Section */}
            {!answerState.hasAnswered && (
              <div 
                className="text-center text-gray-500 dark:text-gray-400"
                style={{
                  fontSize: "clamp(0.75rem,2cqw,0.875rem)",
                  flex: "0 0 auto"
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
                className="rounded-lg border overflow-hidden"
                style={{
                  padding: "clamp(0.5rem,2cqh,1rem)",
                  flex: "0 0 auto"
                }}
              >
                {answerState.isCorrect
                  ? (
                    <div 
                      className="flex items-center text-green-700 dark:text-green-300"
                      style={{ gap: "clamp(0.25rem,1.5cqw,0.75rem)" }}
                    >
                      <Check style={{ width: "clamp(1rem,2.5cqw,1.25rem)", height: "clamp(1rem,2.5cqw,1.25rem)" }} />
                      <span 
                        className="font-medium"
                        style={{ fontSize: "clamp(0.875rem,2.5cqw,1rem)" }}
                      >
                        Correct!
                      </span>
                    </div>
                  )
                  : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "clamp(0.5rem,1.5cqh,0.75rem)" }}>
                      <div 
                        className="flex items-center text-red-700 dark:text-red-300"
                        style={{ gap: "clamp(0.25rem,1.5cqw,0.75rem)" }}
                      >
                        <X style={{ width: "clamp(1rem,2.5cqw,1.25rem)", height: "clamp(1rem,2.5cqw,1.25rem)" }} />
                        <span 
                          className="font-medium"
                          style={{ fontSize: "clamp(0.875rem,2.5cqw,1rem)" }}
                        >
                          Incorrect. The correct answer is {question.correct_answer}.
                        </span>
                      </div>

                      {/* Explanation */}
                      {question.explanation && (
                        <div 
                          className="text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700"
                          style={{
                            paddingTop: "clamp(0.5rem,1.5cqh,0.75rem)",
                            marginTop: "clamp(0.5rem,1.5cqh,0.75rem)",
                            fontSize: "clamp(0.75rem,2cqw,0.875rem)",
                          }}
                        >
                          <QuizContent
                            content={question.explanation}
                            className="overflow-hidden"
                          />
                        </div>
                      )}

                      {/* Next Button for incorrect answers */}
                      {onNext && (
                        <div style={{ paddingTop: "clamp(0.5rem,1.5cqh,0.75rem)" }}>
                          <Button
                            onClick={onNext}
                            variant="outline"
                            size="sm"
                            className="gap-2"
                            style={{
                              fontSize: "clamp(0.75rem,2cqw,0.875rem)",
                              padding: "clamp(0.5rem,1.5cqh,0.75rem) clamp(0.75rem,2cqw,1rem)",
                            }}
                          >
                            {isFinalQuestion ? "Finish Quiz" : "Next Question"}
                            <ChevronRight style={{ width: "clamp(0.875rem,2cqw,1rem)", height: "clamp(0.875rem,2cqw,1rem)" }} />
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
          top: "clamp(-0.75rem,-2cqh,-1rem)",
          right: "clamp(-0.75rem,-2cqw,-1rem)",
          width: "clamp(1.5rem,4cqw,2.5rem)",
          height: "clamp(1.5rem,4cqw,2.5rem)",
          fontSize: "clamp(0.75rem,2cqw,1rem)",
        }}
      >
        {question.order_index + 1}
      </div>
    </div>
  );
}

