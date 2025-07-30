import { NextRequest, NextResponse } from "next/server";
import { SaveFlashcardSetRequest, SaveFlashcardSetResponse } from "@/features/flashcards/types";
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

    // Check if user owns the original set
    const { data: originalSet, error: originalSetError } = await supabase
      .from('flashcard_sets')
      .select('user_id')
      .eq('id', originalSetId)
      .single();

    if (originalSetError) {
      return NextResponse.json<SaveFlashcardSetResponse>(
        { success: false, data: null, error: "Original set not found" },
        { status: 404 }
      );
    }

    const isOwner = originalSet.user_id === userId;
    const now = new Date().toISOString();
    let setId = originalSetId;

    if (isOwner) {
      // Update the existing set
      const { error: setError } = await supabase
        .from('flashcard_sets')
        .update({
          title: saveRequest.title,
          description: saveRequest.description,
          updated_at: now
        })
        .eq('id', originalSetId);

      if (setError) {
        console.error("Error updating flashcard set:", setError);
        return NextResponse.json<SaveFlashcardSetResponse>(
          { success: false, data: null, error: "Failed to update flashcard set" },
          { status: 500 }
        );
      }

      // Delete existing cards first
      await supabase
        .from('flashcards')
        .delete()
        .eq('set_id', originalSetId);
    } else {
      // Create a new set
      setId = randomUUID();
      const { error: setError } = await supabase
        .from('flashcard_sets')
        .insert({
          id: setId,
          title: saveRequest.title,
          description: saveRequest.description,
          course_id: saveRequest.course_id,
          user_id: userId,
          edited_from: saveRequest.edited_from,
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
    }

    // Create/update the flashcards
    const flashcardsToInsert = saveRequest.cards.map((card, index) => ({
      card_id: randomUUID(),
      set_id: setId,
      side1: card.side1,
      side2: card.side2,
      card_number: card.card_number || index + 1
    }));

    const { error: cardsError } = await supabase
      .from('flashcards')
      .insert(flashcardsToInsert);

    if (cardsError) {
      console.error("Error creating flashcards:", cardsError);
      
      // Clean up the set if cards failed and we created a new one
      if (!isOwner) {
        await supabase
          .from('flashcard_sets')
          .delete()
          .eq('id', setId);
      }

      return NextResponse.json<SaveFlashcardSetResponse>(
        { success: false, data: null, error: "Failed to create flashcards" },
        { status: 500 }
      );
    }

    return NextResponse.json<SaveFlashcardSetResponse>({
      success: true,
      data: { set_id: setId }
    });

  } catch (error) {
    console.error("Unexpected error in save flashcard set API:", error);
    return NextResponse.json<SaveFlashcardSetResponse>(
      { success: false, data: null, error: "Internal server error" },
      { status: 500 }
    );
  }
}