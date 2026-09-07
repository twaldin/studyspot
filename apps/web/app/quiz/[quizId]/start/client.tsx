'use client';

import React from 'react';
import { Button } from '@studyspot/ui/components/button';
import { Target } from 'lucide-react';
import { getCourseIcon } from "@/lib/utils/course-icons";
import { useRouter } from 'next/navigation';

const QuizWelcomeScreen = ({ quizData, onStartQuiz }) => (
  <div className="flex flex-col items-center justify-center h-full text-center p-6">
    <h1 className="text-3xl font-bold mb-4">{quizData.title}</h1>
    <p className="text-muted-foreground mb-6">{quizData.description}</p>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 w-full max-w-md">
      <div className="relative flex items-center justify-center p-4 rounded-lg bg-muted">
        <Target className="absolute left-4 h-6 w-6 text-primary" />
        <div className="text-center">
          <div className="font-semibold">Questions</div>
          <div className="text-muted-foreground">{quizData.questions.length}</div>
        </div>
      </div>
      <div className="relative flex items-center justify-center p-4 rounded-lg bg-muted">
        {(() => {
          const CourseIcon = getCourseIcon(quizData.course.icon);
          return <CourseIcon className="absolute left-4 h-6 w-6 text-primary" />;
        })()}
        <div className="text-center">
          <div className="font-semibold">Course</div>
          <div className="text-muted-foreground">{quizData.course.code}</div>
        </div>
      </div>
    </div>
    <Button onClick={onStartQuiz} size="lg">
      Start Quiz
    </Button>
  </div>
);

export default function QuizStartClient({ quizData, quizId }: { quizData: any, quizId: string }) {
  const router = useRouter();

  const handleStartQuiz = () => {
    router.push(`/quiz/${quizId}?start=true`);
  };

  return (
    <div className="bg-background" style={{ height: "calc(100vh - 4rem)" }}>
      <div className="max-w-4xl mx-auto p-6 h-full overflow-hidden">
        <QuizWelcomeScreen quizData={quizData} onStartQuiz={handleStartQuiz} />
      </div>
    </div>
  );
}