import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/services/database/supabase.service';
import { augmentMessagesWithPublicResources } from '@/features/chat/services/resource-augmentor';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ chatId: string; shareToken: string }> }
) {
  try {
    const { chatId, shareToken } = await params;
    const supabase = createServiceRoleClient();

    // Verify public access and get chat with related data
    const { data: chat, error } = await supabase
      .from('chats')
      .select(`
        id,
        title,
        chats,
        course_id,
        is_public,
        visibility_mode,
        courses!inner (
          id,
          code,
          title,
          schools!inner (
            id,
            name
          )
        )
      `)
      .eq('id', chatId)
      .eq('share_token', shareToken)
      .eq('is_public', true)
      .single();

    if (error || !chat) {
      return NextResponse.json({ 
        error: 'Chat not found or not publicly accessible' 
      }, { status: 404 });
    }

    // Augment messages with public linkedResources
    const messages = chat.chats || [];
    const augmentedMessages = await augmentMessagesWithPublicResources(messages);

    // Return only safe, necessary data for public view
    return NextResponse.json({
      id: chat.id,
      title: chat.title,
      messages: augmentedMessages, // The conversation history with linkedResources
      course: {
        id: chat.course_id,
        code: chat.courses.code,
        title: chat.courses.title,
        school: {
          name: chat.courses.schools.name
        }
      },
      visibility_mode: chat.visibility_mode
    });

  } catch (error) {
    console.error('Error fetching public chat:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}