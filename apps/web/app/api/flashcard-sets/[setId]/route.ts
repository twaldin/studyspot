import { NextRequest, NextResponse } from "next/server";
import { FlashcardSetResponse, FlashcardSetWithCards } from "@/lib/types/FlashcardTypes";
import { supabaseService } from "@/lib/services/database/supabase.service";
import { auth } from "@clerk/nextjs/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ setId: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json<FlashcardSetResponse>(
        { success: false, data: null, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { setId } = await params;

    // Get the flashcard set with its cards
    const supabase = await supabaseService.createAuthenticatedClient();
    const { data: flashcardSetData, error: setError } = await supabase
      .from('flashcard_sets')
      .select(
        `
        id,
        title,
        description,
        course_id,
        user_id,
        created_at,
        updated_at,
        courses!flashcard_set_course_id_fkey (
          title,
          code
        ),
        flashcards(*)
      `
      )
      .eq('id', setId)
      .single();

    if (setError || !flashcardSetData) {
      console.error("Error fetching flashcard set:", setError);
      return NextResponse.json<FlashcardSetResponse>(
        { success: false, data: null, error: "Flashcard set not found" },
        { status: 404 }
      );
    }

    console.log("flashcardSetData from Supabase:", JSON.stringify(flashcardSetData, null, 2));

    // The flashcards are now part of flashcardSetData
    const flashcardsData = (flashcardSetData as any).flashcards;

    // For now, we'll skip creator information until we have a users table
    // This can be enhanced later when user profiles are implemented
    const creatorName = undefined;
    const creatorProfileImage = undefined;

    // Construct the response
    const flashcardSet: FlashcardSetWithCards = {
      id: flashcardSetData.id,
      title: flashcardSetData.title || '',
      description: flashcardSetData.description || '',
      course_id: flashcardSetData.course_id,
      user_id: flashcardSetData.user_id,
      created_at: flashcardSetData.created_at,
      updated_at: flashcardSetData.updated_at,
      card_count: flashcardsData?.length || 0,
      creator_name: creatorName,
      creator_profile_image: creatorProfileImage,
      course_name: (flashcardSetData.courses as any)?.title,
      course_code: (flashcardSetData.courses as any)?.code,
      cards: flashcardsData || [],
    };

    return NextResponse.json<FlashcardSetResponse>({
      success: true,
      data: flashcardSet,
    });
  } catch (error) {
    console.error("Unexpected error in flashcard set API:", error);
    return NextResponse.json<FlashcardSetResponse>(
      { success: false, data: null, error: "Internal server error" },
      { status: 500 }
    );
  }
}