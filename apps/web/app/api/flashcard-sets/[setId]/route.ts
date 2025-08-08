import { NextRequest, NextResponse } from "next/server";
import {
  FlashcardSetResponse,
  FlashcardSetWithCards,
} from "@/features/flashcards/types";
import { supabaseService } from "@/lib/services/database/supabase.service";
import { auth, clerkClient } from "@clerk/nextjs/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ setId: string }> },
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json<FlashcardSetResponse>(
        { success: false, data: null, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const { setId } = await params;

    // Get the flashcard set with its cards
    const supabase = await supabaseService.createAuthenticatedClient();
    const { data: flashcardSetData, error: setError } = await supabase
      .from("flashcard_sets")
      .select(
        `
        id,
        title,
        description,
        course_id,
        user_id,
        created_at,
        updated_at,
        edited_from,
        courses!flashcard_sets_course_id_fkey (
          title,
          code
        ),
        flashcards(*)
      `,
      )
      .eq("id", setId)
      .single();

    if (setError || !flashcardSetData) {
      console.error("Error fetching flashcard set:", setError);
      return NextResponse.json<FlashcardSetResponse>(
        { success: false, data: null, error: "Flashcard set not found" },
        { status: 404 },
      );
    }

    console.log(
      "flashcardSetData from Supabase:",
      JSON.stringify(flashcardSetData, null, 2),
    );

    // The flashcards are now part of flashcardSetData
    const flashcardsData = (flashcardSetData as any).flashcards;

    // Get creator information from Clerk
    let creatorName = undefined;
    let creatorProfileImage = undefined;

    try {
      const client = await clerkClient();
      const creator = await client.users.getUser(flashcardSetData.user_id);
      creatorName = creator.firstName && creator.lastName
        ? `${creator.firstName} ${creator.lastName}`
        : creator.firstName || creator.lastName ||
        creator.emailAddresses?.[0]?.emailAddress || "Unknown User";
      creatorProfileImage = creator.imageUrl;
    } catch (error) {
      console.warn("Could not fetch creator information:", error);
      creatorName = "Unknown User";
    }

    // Get original title if this is an edited set
    let originalTitle = undefined;
    if (flashcardSetData.edited_from) {
      try {
        const { data: originalSet } = await supabase
          .from("flashcard_sets")
          .select("title")
          .eq("id", flashcardSetData.edited_from)
          .single();
        originalTitle = originalSet?.title;
      } catch (error) {
        console.warn("Could not fetch original set title:", error);
      }
    }

    // Construct the response
    const flashcardSet: FlashcardSetWithCards = {
      id: flashcardSetData.id,
      title: flashcardSetData.title || "",
      description: flashcardSetData.description || "",
      course_id: flashcardSetData.course_id,
      user_id: flashcardSetData.user_id,
      created_at: flashcardSetData.created_at,
      updated_at: flashcardSetData.updated_at,
      edited_from: flashcardSetData.edited_from,
      card_count: flashcardsData?.length || 0,
      creator_name: creatorName,
      creator_profile_image: creatorProfileImage,
      course_name: (flashcardSetData.courses as any)?.title,
      course_code: (flashcardSetData.courses as any)?.code,
      original_title: originalTitle,
      is_owned_by_current_user: flashcardSetData.user_id === userId,
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
      { status: 500 },
    );
  }
}

