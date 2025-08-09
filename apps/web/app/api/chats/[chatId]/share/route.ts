import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { createServiceRoleClient } from '@/lib/services/database/supabase.service';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ chatId: string }> }
) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { chatId } = await params;
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

    // Update chat share settings
    const supabase = createServiceRoleClient();
    const { data: updatedChat, error } = await supabase
      .from('chats')
      .update({
        is_public,
        visibility_mode: visibility_mode || 'private',
        // Generate new share token if making public for the first time
        ...(is_public && { share_token: crypto.randomUUID() })
      })
      .eq('id', chatId)
      .eq('user_id', user.id) // Ensure user owns the chat
      .select('id, share_token, is_public, visibility_mode')
      .single();

    if (error) {
      console.error('Error updating chat share settings:', error);
      return NextResponse.json({ error: 'Failed to update share settings' }, { status: 500 });
    }

    if (!updatedChat) {
      return NextResponse.json({ error: 'Chat not found' }, { status: 404 });
    }

    // Return the share URL and settings
    const baseUrl = request.nextUrl.origin;
    const shareUrl = updatedChat.is_public 
      ? `${baseUrl}/chat/${chatId}/share/${updatedChat.share_token}`
      : null;

    return NextResponse.json({
      share_url: shareUrl,
      share_token: updatedChat.share_token,
      is_public: updatedChat.is_public,
      visibility_mode: updatedChat.visibility_mode
    });

  } catch (error) {
    console.error('Error in share API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ chatId: string }> }
) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { chatId } = await params;

    // Get current share settings
    const supabase = createServiceRoleClient();
    const { data: chat, error } = await supabase
      .from('chats')
      .select('id, share_token, is_public, visibility_mode')
      .eq('id', chatId)
      .eq('user_id', user.id)
      .single();

    if (error) {
      console.error('Error fetching chat share settings:', error);
      return NextResponse.json({ error: 'Failed to fetch share settings' }, { status: 500 });
    }

    if (!chat) {
      return NextResponse.json({ error: 'Chat not found' }, { status: 404 });
    }

    const baseUrl = request.nextUrl.origin;
    const shareUrl = chat.is_public 
      ? `${baseUrl}/chat/${chatId}/share/${chat.share_token}`
      : null;

    return NextResponse.json({
      share_url: shareUrl,
      share_token: chat.share_token,
      is_public: chat.is_public,
      visibility_mode: chat.visibility_mode
    });

  } catch (error) {
    console.error('Error in share API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}