import { NextRequest, NextResponse } from "next/server";
import { validateAuthWithSchool } from "@/features/auth/operations";
import { supabaseService } from "@/lib/services/database/supabase.service";
import logger from "@/lib/logger";

export async function GET(request: NextRequest) {
  try {
    const auth = await validateAuthWithSchool();
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get("courseId");

    if (!courseId) {
      return NextResponse.json({ error: "courseId is required" }, {
        status: 400,
      });
    }

    logger.info(
      { userId: auth.userId, courseId },
      "[Content API] Fetching flashcards for course",
    );

    const supabase = await supabaseService.createAuthenticatedClient();

    // Get flashcard sets that are either:
    // 1. Course-wide visible (visibility_mode = 'course')
    // 2. User's own private sets (created_by = user_id)
    const { data: flashcardSets, error } = await supabase
      .from("flashcard_sets")
      .select(`
        id,
        title,
        description,
        user_id,
        course_id,
        visibility_mode,
        is_public,
        created_at,
        updated_at,
        flashcards(count)
      `)
      .eq("course_id", courseId)
      .or(`visibility_mode.eq.course,user_id.eq.${auth.userId}`)
      .order("created_at", { ascending: false });

    if (error) {
      logger.error(
        { error, courseId, userId: auth.userId },
        "[Content API] Failed to fetch flashcards",
      );
      return NextResponse.json({ error: "Failed to fetch flashcards" }, {
        status: 500,
      });
    }

    // Transform to include card count
    const transformedSets = flashcardSets.map((set) => ({
      id: set.id,
      type: "flashcard_set" as const,
      title: set.title,
      description: set.description,
      cardCount: (set as any).flashcards?.[0]?.count || 0,
      created_by: set.user_id,
      visibility_mode: set.visibility_mode,
      is_public: set.is_public,
      created_at: set.created_at,
      updated_at: set.updated_at,
    }));

    logger.info({
      courseId,
      userId: auth.userId,
      count: transformedSets.length,
    }, "[Content API] Successfully fetched flashcards");

    return NextResponse.json({ flashcardSets: transformedSets });
  } catch (error) {
    logger.error(
      { error },
      "[Content API] Unexpected error fetching flashcards",
    );
    const message = error instanceof Error
      ? error.message
      : "An unknown error occurred";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

