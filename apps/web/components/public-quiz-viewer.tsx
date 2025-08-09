'use client';

import React, { useState } from 'react';
import { Button } from '@studyspot/ui/components/button';
import { SignUpButton } from '@clerk/nextjs';
import { UserPlus, Building2, Calendar, Target } from 'lucide-react';
import { Card, CardContent } from '@studyspot/ui/components/card';
import { Badge } from '@studyspot/ui/components/badge';
import { getCourseIcon } from "@/lib/utils/course-icons";
import { cn } from "@studyspot/ui/lib/utils";
import { QuizContent } from "@/features/quiz/components/quiz-content";
import { Check, X } from 'lucide-react';
import { motion } from "framer-motion";

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

interface PublicQuizViewerProps {
  quizData: {
    id: string;
    title: string;
    description?: string;
    questions: QuizQuestion[];
    course: {
      code: string;
      title: string;
      icon: string | null;
      school: {
        name: string;
      };
    };
    visibility_mode?: string;
  };
  onSignUpPrompt: () => void;
}

export function PublicQuizViewer({ quizData }: PublicQuizViewerProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  
  const questions = Array.isArray(quizData.questions) ? quizData.questions : [];
  const hasQuestions = questions.length > 0;
  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  
  const progressText = `${currentQuestionIndex + 1} / ${questions.length}`;

  const handleAnswerSelect = (answerIndex: number) => {
    if (showFeedback) return;
    setSelectedAnswer(answerIndex);
    setShowFeedback(true);
    setAnswers(prev => ({ ...prev, [currentQuestionIndex]: answerIndex }));
  };

  const handleNext = () => {
    if (isLastQuestion) {
      setQuizCompleted(true);
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setQuizCompleted(false);
    setAnswers({});
  };

  const calculateScore = () => {
    let correct = 0;
    for (let i = 0; i < questions.length; i++) {
      if (answers[i] === (questions[i]?.correctAnswer ?? -1)) {
        correct++;
      }
    }
    return {
      correct,
      total: questions.length,
      percentage: Math.round((correct / questions.length) * 100)
    };
  };

  if (quizCompleted) {
    const score = calculateScore();
    return (
      <div className="mx-auto w-full max-w-2xl h-full flex flex-col justify-center p-6">
        <Card className="mb-6">
          <CardContent className="p-8 text-center">
            <div className="text-6xl mb-4">
              {score.percentage >= 80 ? '🎉' : score.percentage >= 60 ? '👍' : '📚'}
            </div>
            <h2 className="text-2xl font-bold mb-4">Quiz Complete!</h2>
            <div className="text-3xl font-bold mb-2">
              {score.correct}/{score.total}
            </div>
            <div className="text-lg text-muted-foreground mb-6">
              {score.percentage}% correct
            </div>
            <div className="flex gap-3 justify-center mb-6">
              <Button onClick={handleRestart} variant="outline">
                Try Again
              </Button>
            </div>
            <div className="border-t pt-6">
              <p className="text-sm text-muted-foreground mb-3">
                Want to create your own quizzes or track your progress?
              </p>
              <SignUpButton mode="modal" forceRedirectUrl={typeof window !== 'undefined' ? window.location.href : undefined}>
                <Button className="cursor-pointer">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Sign Up to StudySpot
                </Button>
              </SignUpButton>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const renderContent = () => (
    <div className="flex flex-col h-full">
      {/* Header Section - Fixed at top */}
      <div className="flex-shrink-0 space-y-3 mb-4">
        <h1 className="font-bold font-crimson-text text-foreground text-2xl">
          {quizData.title}
        </h1>

        {/* Course and Meta Info */}
        <div className="space-y-2">
          <p className="text-lg text-muted-foreground">
            {quizData.description}
          </p>

          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              {(() => {
                const CourseIcon = getCourseIcon(quizData.course.icon);
                return <CourseIcon className="h-4 w-4" />;
              })()}
              <span>
                {quizData.course.code} - {quizData.course.title}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              <span>{quizData.course.school.name}</span>
            </div>

            <div className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              <span>{questions.length} questions</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Quiz Area - Takes remaining space */}
      <div className="flex-1 flex items-center justify-center min-h-0">
        <div className="relative w-full h-full max-w-4xl flex justify-center items-center">
          {hasQuestions && currentQuestion ? (
            <div className="relative w-full h-full mx-auto" style={{ containerType: "size" }}>
              {/* Question Card */}
              <Card className="w-full h-full bg-card shadow-lg rounded-xl overflow-hidden">
                <CardContent className="p-[clamp(0.75rem,3cqw,2rem)] h-full flex flex-col overflow-hidden min-h-0">
                  <div className="h-full flex flex-col min-h-0" style={{ gap: "clamp(0.5rem,2cqh,1.5rem)" }}>
                    
                    {/* Question Text */}
                    <div 
                      className="text-center"
                      style={{
                        fontSize: (() => {
                          const questionLength = currentQuestion?.question?.length || 0;
                          if (questionLength < 50) return "clamp(1rem,5cqw,2.5rem)"; // Short question
                          if (questionLength < 100) return "clamp(0.875rem,4.5cqw,2rem)"; // Medium question
                          if (questionLength < 200) return "clamp(0.75rem,4cqw,1.75rem)"; // Long question
                          return "clamp(0.625rem,3.5cqw,1.5rem)"; // Very long question
                        })(),
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
                        content={currentQuestion?.question || 'No question text'}
                        className="font-semibold text-gray-900 dark:text-gray-100"
                      />
                    </div>

                    {/* Options */}
                    <div 
                      className="grid min-h-0"
                      style={{
                        gridTemplateColumns: (() => {
                          // Filter options when user answered incorrectly - only show selected and correct answers
                          const visibleOptions = showFeedback && selectedAnswer !== (currentQuestion?.correctAnswer ?? -1)
                            ? (currentQuestion?.options || []).filter((_, optionIndex) => 
                                optionIndex === selectedAnswer || 
                                optionIndex === (currentQuestion?.correctAnswer ?? -1)
                              )
                            : (currentQuestion?.options || []);
                          
                          return visibleOptions.length === 4 ? "1fr 1fr" : 
                                 visibleOptions.length === 2 ? "1fr 1fr" : "1fr";
                        })(),
                        gridTemplateRows: (() => {
                          const visibleOptions = showFeedback && selectedAnswer !== (currentQuestion?.correctAnswer ?? -1)
                            ? (currentQuestion?.options || []).filter((_, optionIndex) => 
                                optionIndex === selectedAnswer || 
                                optionIndex === (currentQuestion?.correctAnswer ?? -1)
                              )
                            : (currentQuestion?.options || []);
                          
                          return visibleOptions.length === 4 ? "1fr 1fr" :
                                 visibleOptions.length === 2 ? "1fr" :
                                 visibleOptions.length === 3 ? "repeat(3, minmax(0, 1fr))" :
                                 `repeat(${visibleOptions.length}, minmax(0, 1fr))`;
                        })(),
                        gap: "clamp(0.25rem,1.5cqh,0.75rem)",
                        flex: "1 1 0",
                        minHeight: "0",
                        height: "100%",
                      }}
                    >
                      {(() => {
                        // Filter options when user answered incorrectly - only show selected and correct answers
                        const visibleOptions = showFeedback && selectedAnswer !== (currentQuestion?.correctAnswer ?? -1)
                          ? (currentQuestion?.options || []).map((option, index) => ({ option, index })).filter(({ index }) => 
                              index === selectedAnswer || 
                              index === (currentQuestion?.correctAnswer ?? -1)
                            )
                          : (currentQuestion?.options || []).map((option, index) => ({ option, index }));

                        // Calculate consistent font size based on longest option
                        const getOptionFontSize = (text: string, optionCount: number) => {
                          const length = text.length;
                          const baseScale = optionCount === 4 ? 1 : 1.2;
                          
                          if (length < 20) return `clamp(${1.25 * baseScale}rem,${5 * baseScale}cqw,${2.5 * baseScale}rem)`;
                          if (length < 40) return `clamp(${1 * baseScale}rem,${4.5 * baseScale}cqw,${2 * baseScale}rem)`;
                          if (length < 80) return `clamp(${0.875 * baseScale}rem,${4 * baseScale}cqw,${1.75 * baseScale}rem)`;
                          if (length < 120) return `clamp(${0.75 * baseScale}rem,${3.5 * baseScale}cqw,${1.5 * baseScale}rem)`;
                          return `clamp(${0.625 * baseScale}rem,${3 * baseScale}cqw,${1.25 * baseScale}rem)`;
                        };

                        const maxOptionLength = Math.max(
                          ...(currentQuestion?.options || []).map(opt => opt.length)
                        );
                        const consistentOptionFontSize = getOptionFontSize('x'.repeat(maxOptionLength), visibleOptions.length);

                        return visibleOptions.map(({ option, index }) => {
                        const isSelected = selectedAnswer === index;
                        const isCorrect = index === (currentQuestion?.correctAnswer ?? -1);
                        const shouldHighlight = showFeedback && (isSelected || isCorrect);
                        
                        let optionState = "default";
                        if (showFeedback) {
                          if (isSelected && isCorrect) optionState = "correct";
                          else if (isSelected && !isCorrect) optionState = "incorrect";
                          else if (!isSelected && isCorrect) optionState = "reveal-correct";
                          else optionState = "disabled";
                        }

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

                        const getOptionIcon = (state: string) => {
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
                          <motion.div 
                            key={index} 
                            className="min-h-0 min-w-0"
                            layout
                            initial={{ opacity: 1, scale: 1 }}
                            animate={{ 
                              opacity: 1,
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
                                "border-2 transition-all duration-300 flex-1",
                                getOptionClassName(optionState),
                                optionState === "default" && "cursor-pointer hover:shadow-md",
                              )}
                              onClick={() => !showFeedback && handleAnswerSelect(index)}
                              style={{ minHeight: "0", height: "100%", display: "flex", flexDirection: "column" }}
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
                                  style={{ gap: "clamp(0.25rem,min(1.5cqw,1.5cqh),0.75rem)" }}
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
                                    {String.fromCharCode(65 + index)}
                                  </div>

                                  {/* Option Text */}
                                  <div className="flex-1 min-w-0 overflow-hidden">
                                    <QuizContent
                                      content={option}
                                      className="leading-tight text-gray-900 dark:text-gray-100 font-medium"
                                      style={{
                                        fontSize: consistentOptionFontSize,
                                        lineHeight: "1.4",
                                        display: "-webkit-box",
                                        WebkitLineClamp: (() => {
                                          const optionCount = (currentQuestion?.options?.length || 0);
                                          if (optionCount === 4) {
                                            if (option.length < 30) return 3;
                                            if (option.length < 60) return 4;
                                            return 5;
                                          }
                                          if (option.length < 50) return 3;
                                          if (option.length < 100) return 4;
                                          if (option.length < 150) return 5;
                                          return 6;
                                        })(),
                                        WebkitBoxOrient: "vertical",
                                        overflow: "hidden"
                                      }}
                                    />
                                  </div>

                                  {/* State Icon */}
                                  <div className="flex-shrink-0">
                                    {getOptionIcon(optionState)}
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        );
                        });
                      })()}
                    </div>

                    {/* Feedback Section */}
                    {!showFeedback && (
                      <div 
                        className="text-center text-gray-500 dark:text-gray-400"
                        style={{
                          fontSize: "clamp(0.75rem,2cqw,0.875rem)",
                          flex: "0 0 auto"
                        }}
                      >
                        <p>Select an answer to see the result</p>
                      </div>
                    )}

                    {showFeedback && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-lg border overflow-hidden"
                        style={{
                          padding: "clamp(0.5rem,2cqh,1rem)",
                          flex: "0 0 auto"
                        }}
                      >
                        {selectedAnswer === (currentQuestion?.correctAnswer ?? -1) ? (
                          <div className="flex items-center text-green-700 dark:text-green-300" style={{ gap: "clamp(0.25rem,1.5cqw,0.75rem)" }}>
                            <Check style={{ width: "clamp(1rem,2.5cqw,1.25rem)", height: "clamp(1rem,2.5cqw,1.25rem)" }} />
                            <span className="font-medium" style={{ fontSize: "clamp(0.875rem,2.5cqw,1rem)" }}>
                              Correct!
                            </span>
                          </div>
                        ) : (
                          <div style={{ display: "flex", flexDirection: "column", gap: "clamp(0.5rem,1.5cqh,0.75rem)" }}>
                            <div className="flex items-center text-red-700 dark:text-red-300" style={{ gap: "clamp(0.25rem,1.5cqw,0.75rem)" }}>
                              <X style={{ width: "clamp(1rem,2.5cqw,1.25rem)", height: "clamp(1rem,2.5cqw,1.25rem)" }} />
                              <span className="font-medium" style={{ fontSize: "clamp(0.875rem,2.5cqw,1rem)" }}>
                                Incorrect. The correct answer is {String.fromCharCode(65 + (currentQuestion?.correctAnswer ?? 0))}.
                              </span>
                            </div>
                            {currentQuestion?.explanation && (
                              <div 
                                className="text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700"
                                style={{
                                  paddingTop: "clamp(0.5rem,1.5cqh,0.75rem)",
                                  marginTop: "clamp(0.5rem,1.5cqh,0.75rem)",
                                  fontSize: "clamp(0.75rem,2cqw,0.875rem)",
                                }}
                              >
                                <QuizContent content={currentQuestion?.explanation || ''} className="overflow-hidden" />
                              </div>
                            )}
                          </div>
                        )}

                        <div style={{ paddingTop: "clamp(0.5rem,1.5cqh,0.75rem)" }}>
                          <Button
                            onClick={handleNext}
                            variant="outline"
                            size="sm"
                            className="gap-2"
                          >
                            {isLastQuestion ? "Finish Quiz" : "Next Question"}
                          </Button>
                        </div>
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
                {currentQuestionIndex + 1}
              </div>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-muted-foreground mb-4">This quiz doesn't have any questions yet.</p>
              <SignUpButton mode="modal" forceRedirectUrl={typeof window !== 'undefined' ? window.location.href : undefined}>
                <Button className="cursor-pointer">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Sign Up to Create Quizzes
                </Button>
              </SignUpButton>
            </div>
          )}
        </div>
      </div>

      {/* Progress only */}
      <div className="flex-shrink-0 space-y-4 mt-4">
        <div className="text-sm font-medium text-center">{progressText}</div>

        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-3">
            Want to create your own quizzes or study with progress tracking?
          </p>
          <SignUpButton mode="modal" forceRedirectUrl={typeof window !== 'undefined' ? window.location.href : undefined}>
            <Button className="w-full sm:w-auto cursor-pointer">
              <UserPlus className="h-4 w-4 mr-2" />
              Sign Up to StudySpot
            </Button>
          </SignUpButton>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-background" style={{ height: "calc(100vh - 4rem)" }}>
      <div className="max-w-4xl mx-auto p-6 h-full overflow-hidden">
        {renderContent()}
      </div>
    </div>
  );
}