import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { createServiceRoleClient } from '@/lib/services/database/supabase.service';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ setId: string }> }
) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { setId } = await params;
    const body = await request.json();
    const { is_public, visibility_mode } = body;

    // Validate input
    if (typeof is_public !== 'boolean') {
      return NextResponse.json({ error: 'is_public must be a boolean' }, { status: 400 });
    }

    if (visibility_mode && !['private', 'link-only', 'course'].includes(visibility_mode)) {
      return NextResponse.json({ 
        error: 'visibility_mode must be private, link-only, or course' 
      }, { status: 400 });
    }

    // Update flashcard set share settings
    const supabase = createServiceRoleClient();
    const { data: updatedSet, error } = await supabase
      .from('flashcard_sets')
      .update({
        is_public,
        visibility_mode: visibility_mode || 'private',
        // Generate new share token if making public for the first time
        ...(is_public && { share_token: crypto.randomUUID() })
      })
      .eq('id', setId)
      .eq('user_id', user.id) // Ensure user owns the flashcard set
      .select('id, share_token, is_public, visibility_mode')
      .single();

    if (error) {
      console.error('Error updating flashcard set share settings:', error);
      return NextResponse.json({ error: 'Failed to update share settings' }, { status: 500 });
    }

    if (!updatedSet) {
      return NextResponse.json({ error: 'Flashcard set not found' }, { status: 404 });
    }

    // Return the share URL and settings
    const baseUrl = request.nextUrl.origin;
    const shareUrl = updatedSet.is_public 
      ? `${baseUrl}/flashcards/${setId}/share/${updatedSet.share_token}`
      : null;

    return NextResponse.json({
      share_url: shareUrl,
      share_token: updatedSet.share_token,
      is_public: updatedSet.is_public,
      visibility_mode: updatedSet.visibility_mode
    });

  } catch (error) {
    console.error('Error in flashcard share API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ setId: string }> }
) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { setId } = await params;

    // Get current share settings
    const supabase = createServiceRoleClient();
    const { data: set, error } = await supabase
      .from('flashcard_sets')
      .select('id, share_token, is_public, visibility_mode')
      .eq('id', setId)
      .eq('user_id', user.id)
      .single();

    if (error) {
      console.error('Error fetching flashcard set share settings:', error);
      return NextResponse.json({ error: 'Failed to fetch share settings' }, { status: 500 });
    }

    if (!set) {
      return NextResponse.json({ error: 'Flashcard set not found' }, { status: 404 });
    }

    const baseUrl = request.nextUrl.origin;
    const shareUrl = set.is_public 
      ? `${baseUrl}/flashcards/${setId}/share/${set.share_token}`
      : null;

    return NextResponse.json({
      share_url: shareUrl,
      share_token: set.share_token,
      is_public: set.is_public,
      visibility_mode: set.visibility_mode
    });

  } catch (error) {
    console.error('Error in flashcard share API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}