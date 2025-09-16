import React from 'react';
import { notFound } from "next/navigation";
import { getQuiz } from "@/features/quiz/quiz-operations";
import QuizStartClient from './client';

export default async function QuizStartPage({ params }: { params: { quizId: string } }) {
  const quizData = await getQuiz(params.quizId);

  if (!quizData) {
    notFound();
  }

  return <QuizStartClient quizData={quizData} quizId={params.quizId} />;
}