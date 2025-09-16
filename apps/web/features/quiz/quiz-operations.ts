'use server';

import { createServiceRoleClient } from "@/lib/services/database/supabase.service";
import { TQuiz } from "@/features/quiz/types";

export async function getQuiz(quizId: string): Promise<TQuiz | null> {
  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from("quizzes")
    .select(
      `
      *,
      questions:quiz_questions(*),
      course:courses(code, title, icon, school:schools(name))
    `
    )
    .eq("id", quizId)
    .single();

  if (error) {
    console.error("Error fetching quiz:", error);
    return null;
  }

  return data as TQuiz;
}
