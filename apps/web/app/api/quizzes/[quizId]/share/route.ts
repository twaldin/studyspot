import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { createServiceRoleClient } from '@/lib/services/database/supabase.service';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ quizId: string }> }
) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { quizId } = await params;
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

    // Update quiz share settings
    const supabase = createServiceRoleClient();
    const { data: updatedQuiz, error } = await supabase
      .from('quizzes')
      .update({
        is_public,
        visibility_mode: visibility_mode || 'private',
        // Generate new share token if making public for the first time
        ...(is_public && { share_token: crypto.randomUUID() })
      })
      .eq('id', quizId)
      .eq('created_by', user.id) // Ensure user owns the quiz
      .select('id, share_token, is_public, visibility_mode')
      .single();

    if (error) {
      console.error('Error updating quiz share settings:', error);
      return NextResponse.json({ error: 'Failed to update share settings' }, { status: 500 });
    }

    if (!updatedQuiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
    }

    // Return the share URL and settings
    const baseUrl = request.nextUrl.origin;
    const shareUrl = updatedQuiz.is_public 
      ? `${baseUrl}/quiz/${quizId}/share/${updatedQuiz.share_token}`
      : null;

    return NextResponse.json({
      share_url: shareUrl,
      share_token: updatedQuiz.share_token,
      is_public: updatedQuiz.is_public,
      visibility_mode: updatedQuiz.visibility_mode
    });

  } catch (error) {
    console.error('Error in quiz share API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ quizId: string }> }
) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { quizId } = await params;

    // Get current share settings
    const supabase = createServiceRoleClient();
    const { data: quiz, error } = await supabase
      .from('quizzes')
      .select('id, share_token, is_public, visibility_mode')
      .eq('id', quizId)
      .eq('created_by', user.id)
      .single();

    if (error) {
      console.error('Error fetching quiz share settings:', error);
      return NextResponse.json({ error: 'Failed to fetch share settings' }, { status: 500 });
    }

    if (!quiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
    }

    const baseUrl = request.nextUrl.origin;
    const shareUrl = quiz.is_public 
      ? `${baseUrl}/quiz/${quizId}/share/${quiz.share_token}`
      : null;

    return NextResponse.json({
      share_url: shareUrl,
      share_token: quiz.share_token,
      is_public: quiz.is_public,
      visibility_mode: quiz.visibility_mode
    });

  } catch (error) {
    console.error('Error in quiz share API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}