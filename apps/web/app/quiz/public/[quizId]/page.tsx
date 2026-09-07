import { getQuizForPublic } from "@/features/quiz/quiz-operations";
import { PublicQuizViewer } from "@/components/public-quiz-viewer";
import { notFound } from "next/navigation";

export default async function PublicQuizPage({
  params,
}: {
  params: { quizId: string };
}) {
  const quiz = await getQuizForPublic(params.quizId);

  if (!quiz) {
    return notFound();
  }

  return <PublicQuizViewer quizData={quiz} onSignUpPrompt={() => {}} />;
}
