import { NextRequest, NextResponse } from "next/server";
import { SaveQuizRequest, SaveQuizResponse } from "@/features/quiz/types";
import { supabaseService } from "@/lib/services/database/supabase.service";
import { auth } from "@clerk/nextjs/server";
import { randomUUID } from 'crypto';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ quizId: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json<SaveQuizResponse>(
        { success: false, data: null, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { quizId: originalQuizId } = await params;
    const body = await request.json();
    
    // Validate request body
    const saveRequest: SaveQuizRequest & { originalQuizId?: string } = {
      originalQuizId,
      ...body.quizData
    };

    if (!saveRequest.title || !saveRequest.course_id || !saveRequest.questions) {
      return NextResponse.json<SaveQuizResponse>(
        { success: false, data: null, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Verify the course exists (we'll add proper access control later)
    const supabase = await supabaseService.createAuthenticatedClient();
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('id')
      .eq('id', saveRequest.course_id)
      .single();

    if (courseError || !course) {
      return NextResponse.json<SaveQuizResponse>(
        { success: false, data: null, error: "Course not found" },
        { status: 404 }
      );
    }

    // Check if user owns the original quiz
    const { data: originalQuiz, error: originalQuizError } = await supabase
      .from('quizzes')
      .select('created_by')
      .eq('id', originalQuizId)
      .single();

    if (originalQuizError) {
      return NextResponse.json<SaveQuizResponse>(
        { success: false, data: null, error: "Original quiz not found" },
        { status: 404 }
      );
    }

    const isOwner = originalQuiz.created_by === userId;
    const now = new Date().toISOString();
    let quizId = originalQuizId;

    if (isOwner) {
      // Update the existing quiz
      const { error: quizError } = await supabase
        .from('quizzes')
        .update({
          title: saveRequest.title,
          description: saveRequest.description,
          difficulty_level: saveRequest.difficulty_level,
          updated_at: now
        })
        .eq('id', originalQuizId);

      if (quizError) {
        console.error("Error updating quiz:", quizError);
        return NextResponse.json<SaveQuizResponse>(
          { success: false, data: null, error: "Failed to update quiz" },
          { status: 500 }
        );
      }

      // Delete existing questions first
      await supabase
        .from('quiz_questions')
        .delete()
        .eq('quiz_id', originalQuizId);
    } else {
      // Create a new quiz
      quizId = randomUUID();
      const { error: quizError } = await supabase
        .from('quizzes')
        .insert({
          id: quizId,
          title: saveRequest.title,
          description: saveRequest.description,
          course_id: saveRequest.course_id,
          created_by: userId,
          difficulty_level: saveRequest.difficulty_level,
          edited_from: saveRequest.edited_from,
          created_at: now,
          updated_at: now
        });

      if (quizError) {
        console.error("Error creating quiz:", quizError);
        return NextResponse.json<SaveQuizResponse>(
          { success: false, data: null, error: "Failed to create quiz" },
          { status: 500 }
        );
      }
    }

    // Create/update the quiz questions
    const questionsToInsert = saveRequest.questions.map((question, index) => ({
      id: randomUUID(),
      quiz_id: quizId,
      question_text: question.question_text,
      option_a: question.option_a,
      option_b: question.option_b,
      option_c: question.option_c,
      option_d: question.option_d,
      correct_answer: question.correct_answer,
      explanation: question.explanation,
      order_index: question.order_index || index
    }));

    const { error: questionsError } = await supabase
      .from('quiz_questions')
      .insert(questionsToInsert);

    if (questionsError) {
      console.error("Error creating quiz questions:", questionsError);
      
      // Clean up the quiz if questions failed and we created a new one
      if (!isOwner) {
        await supabase
          .from('quizzes')
          .delete()
          .eq('id', quizId);
      }

      return NextResponse.json<SaveQuizResponse>(
        { success: false, data: null, error: "Failed to create quiz questions" },
        { status: 500 }
      );
    }

    return NextResponse.json<SaveQuizResponse>({
      success: true,
      data: { quiz_id: quizId }
    });

  } catch (error) {
    console.error("Unexpected error in save quiz API:", error);
    return NextResponse.json<SaveQuizResponse>(
      { success: false, data: null, error: "Internal server error" },
      { status: 500 }
    );
  }
}