import { NextRequest, NextResponse } from "next/server";
import { QuizResponse, QuizWithQuestions } from "@/lib/types/QuizTypes";
import { supabaseService } from "@/lib/services/database/supabase.service";
import { auth, clerkClient } from "@clerk/nextjs/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ quizId: string }> },
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json<QuizResponse>(
        { success: false, data: null, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const { quizId } = await params;

    // Get the quiz with its questions
    const supabase = await supabaseService.createAuthenticatedClient();
    const { data: quizData, error: quizError } = await supabase
      .from("quizzes")
      .select(
        `
        id,
        title,
        description,
        course_id,
        created_by,
        created_at,
        updated_at,
        edited_from,
        difficulty_level,
        is_public,
        total_questions,
        courses!quizzes_course_id_fkey (
          title,
          code
        ),
        quiz_questions(*)
      `,
      )
      .eq("id", quizId)
      .single();

    if (quizError || !quizData) {
      console.error("Error fetching quiz:", quizError);
      return NextResponse.json<QuizResponse>(
        { success: false, data: null, error: "Quiz not found" },
        { status: 404 },
      );
    }
    console.log("quizData from Supabase:", JSON.stringify(quizData, null, 2));

    // The quiz_questions are now part of quizData
    const questionsData = (quizData as any).quiz_questions;

    // Get creator information from Clerk
    let creatorName = undefined;
    let creatorProfileImage = undefined;

    try {
      const client = await clerkClient();
      const creator = await client.users.getUser(quizData.created_by);
      creatorName = creator.firstName && creator.lastName
        ? `${creator.firstName} ${creator.lastName}`
        : creator.firstName || creator.lastName ||
          creator.emailAddresses?.[0]?.emailAddress || "Unknown User";
      creatorProfileImage = creator.imageUrl;
    } catch (error) {
      console.warn("Could not fetch creator information:", error);
      creatorName = "Unknown User";
    }

    // Get original title if this is an edited quiz
    let originalTitle = undefined;
    if (quizData.edited_from) {
      try {
        const { data: originalQuiz } = await supabase
          .from("quizzes")
          .select("title")
          .eq("id", quizData.edited_from)
          .single();
        originalTitle = originalQuiz?.title;
      } catch (error) {
        console.warn("Could not fetch original quiz title:", error);
      }
    }

    // Construct the response
    const quiz: QuizWithQuestions = {
      id: quizData.id,
      title: quizData.title || "",
      description: quizData.description || "",
      course_id: quizData.course_id,
      user_id: quizData.created_by,
      created_at: quizData.created_at,
      updated_at: quizData.updated_at,
      edited_from: quizData.edited_from,
      difficulty_level: quizData.difficulty_level,
      is_public: quizData.is_public,
      question_count: quizData.total_questions || questionsData?.length || 0,
      creator_name: creatorName,
      creator_profile_image: creatorProfileImage,
      course_name: (quizData.courses as any)?.title,
      course_code: (quizData.courses as any)?.code,
      original_title: originalTitle,
      is_owned_by_current_user: quizData.created_by === userId,
      questions: questionsData || [],
    };

    return NextResponse.json<QuizResponse>({
      success: true,
      data: quiz,
    });
  } catch (error) {
    console.error("Unexpected error in quiz API:", error);
    return NextResponse.json<QuizResponse>(
      { success: false, data: null, error: "Internal server error" },
      { status: 500 },
    );
  }
}
