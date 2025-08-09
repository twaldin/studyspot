import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/services/database/supabase.service';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ quizId: string; shareToken: string }> }
) {
  try {
    const { quizId, shareToken } = await params;
    const supabase = createServiceRoleClient();

    // Verify public access and get quiz with related data
    const { data: quiz, error } = await supabase
      .from('quizzes')
      .select(`
        id,
        title,
        description,
        course_id,
        is_public,
        visibility_mode,
        courses!inner (
          id,
          code,
          title,
          icon,
          schools!inner (
            id,
            name
          )
        ),
        quiz_questions (*)
      `)
      .eq('id', quizId)
      .eq('share_token', shareToken)
      .eq('is_public', true)
      .single();

    if (error || !quiz) {
      return NextResponse.json({ 
        error: 'Quiz not found or not publicly accessible' 
      }, { status: 404 });
    }

    // Transform quiz questions to match PublicQuizViewer expected format
    const transformedQuestions = ((quiz as any).quiz_questions || []).map((dbQuestion: any) => {
      // Create options array from individual option fields
      const options = [
        dbQuestion.option_a,
        dbQuestion.option_b,
        dbQuestion.option_c,
        dbQuestion.option_d
      ].filter(Boolean); // Remove null/empty options

      // Convert correct_answer letter to index (A=0, B=1, C=2, D=3)
      const correctAnswerMap: { [key: string]: number } = { A: 0, B: 1, C: 2, D: 3 };
      const correctAnswer = correctAnswerMap[dbQuestion.correct_answer] ?? 0;

      return {
        id: dbQuestion.id,
        question: dbQuestion.question_text || dbQuestion.question, // Try question_text first, fallback to question
        options,
        correctAnswer,
        explanation: dbQuestion.explanation
      };
    });

    // Return only safe, necessary data for public view
    const response = {
      id: quiz.id,
      title: quiz.title,
      description: quiz.description,
      questions: transformedQuestions,
      course: {
        id: quiz.course_id,
        code: (quiz as any).courses.code,
        title: (quiz as any).courses.title,
        icon: (quiz as any).courses.icon,
        school: {
          name: (quiz as any).courses.schools.name
        }
      },
      visibility_mode: quiz.visibility_mode
    };
    
    return NextResponse.json(response);

  } catch (error) {
    console.error('Error fetching public quiz:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}