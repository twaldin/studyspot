import { NextRequest, NextResponse } from 'next/server';
import { validateAuthWithSchool } from '@/features/auth/operations';
import { supabaseService } from '@/lib/services/database/supabase.service';
import logger from '@/lib/logger';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ chatId: string }> }
) {
  try {
    const auth = await validateAuthWithSchool();
    const { chatId } = await params;
    
    logger.info({ chatId, userId: auth.userId }, '[Fork Chat] Starting chat fork');

    const supabase = await supabaseService.createAuthenticatedClient();
    
    // Get the original chat with all its messages
    const { data: originalChat, error: fetchError } = await supabase
      .from('chats')
      .select(`
        *,
        courses!inner (
          school_id
        )
      `)
      .eq('id', chatId)
      .eq('courses.school_id', auth.selectedSchool)
      .single();

    if (fetchError || !originalChat) {
      logger.error({ error: fetchError, chatId }, '[Fork Chat] Failed to fetch original chat');
      return NextResponse.json(
        { message: 'Chat not found or access denied' },
        { status: 404 }
      );
    }

    // Check if user is trying to fork their own chat (not allowed)
    if (originalChat.user_id === auth.userId) {
      return NextResponse.json(
        { message: 'Cannot fork your own chat' },
        { status: 400 }
      );
    }

    // Create a new chat with the same messages but for the current user
    const forkedChatData = {
      user_id: auth.userId,
      course_id: originalChat.course_id,
      title: `${originalChat.title} (Forked)`,
      chats: originalChat.chats || [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Insert the forked chat
    const { data: forkedChat, error: insertError } = await supabase
      .from('chats')
      .insert(forkedChatData)
      .select()
      .single();

    if (insertError || !forkedChat) {
      logger.error({ error: insertError }, '[Fork Chat] Failed to create forked chat');
      return NextResponse.json(
        { message: 'Failed to fork chat' },
        { status: 500 }
      );
    }

    logger.info({ 
      originalChatId: chatId, 
      forkedChatId: forkedChat.id,
      userId: auth.userId 
    }, '[Fork Chat] Successfully forked chat');

    return NextResponse.json({
      success: true,
      chatId: forkedChat.id,
      message: 'Chat forked successfully'
    });

  } catch (error) {
    logger.error({ error }, '[Fork Chat] Unexpected error');
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ message }, { status: 500 });
  }
}