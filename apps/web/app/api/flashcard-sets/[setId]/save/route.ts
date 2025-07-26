import { NextRequest, NextResponse } from "next/server";
import { SaveFlashcardSetRequest, SaveFlashcardSetResponse } from "@/lib/types/FlashcardTypes";
import { supabaseService } from "@/lib/services/database/supabase.service";
import { auth } from "@clerk/nextjs/server";
import { randomUUID } from 'crypto';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ setId: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json<SaveFlashcardSetResponse>(
        { success: false, data: null, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { setId: originalSetId } = await params;
    const body = await request.json();
    
    // Validate request body
    const saveRequest: SaveFlashcardSetRequest & { originalSetId?: string } = {
      originalSetId,
      ...body.flashcardSetData
    };

    if (!saveRequest.title || !saveRequest.course_id || !saveRequest.cards) {
      return NextResponse.json<SaveFlashcardSetResponse>(
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
      return NextResponse.json<SaveFlashcardSetResponse>(
        { success: false, data: null, error: "Course not found" },
        { status: 404 }
      );
    }

    const newSetId = randomUUID();
    const now = new Date().toISOString();

    // Create the new flashcard set
    const { error: setError } = await supabase
      .from('flashcard_sets')
      .insert({
        id: newSetId,
        title: saveRequest.title,
        description: saveRequest.description,
        course_id: saveRequest.course_id,
        user_id: userId,
        created_at: now,
        updated_at: now
      });

    if (setError) {
      console.error("Error creating flashcard set:", setError);
      return NextResponse.json<SaveFlashcardSetResponse>(
        { success: false, data: null, error: "Failed to create flashcard set" },
        { status: 500 }
      );
    }

    // Create the flashcards
    const flashcardsToInsert = saveRequest.cards.map((card, index) => ({
      card_id: randomUUID(),
      set_id: newSetId,
      side1: card.side1,
      side2: card.side2,
      card_number: card.card_number || index + 1
    }));

    const { error: cardsError } = await supabase
      .from('flashcards')
      .insert(flashcardsToInsert);

    if (cardsError) {
      console.error("Error creating flashcards:", cardsError);
      
      // Clean up the set if cards failed
      await supabase
        .from('flashcard_sets')
        .delete()
        .eq('id', newSetId);

      return NextResponse.json<SaveFlashcardSetResponse>(
        { success: false, data: null, error: "Failed to create flashcards" },
        { status: 500 }
      );
    }

    return NextResponse.json<SaveFlashcardSetResponse>({
      success: true,
      data: { set_id: newSetId }
    });

  } catch (error) {
    console.error("Unexpected error in save flashcard set API:", error);
    return NextResponse.json<SaveFlashcardSetResponse>(
      { success: false, data: null, error: "Internal server error" },
      { status: 500 }
    );
  }
}