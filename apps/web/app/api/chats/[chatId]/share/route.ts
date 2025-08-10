import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { createServiceRoleClient } from '@/lib/services/database/supabase.service';

/**
 * Auto-share linked resources (quizzes and flashcards) when a chat is made public
 */
async function autoShareLinkedResources(
  supabase: any, 
  chatId: string, 
  userId: string, 
  visibilityMode: string
): Promise<{ sharedQuizzes: number; sharedFlashcards: number; errors: string[] }> {
  const result = { sharedQuizzes: 0, sharedFlashcards: 0, errors: [] };
  
  try {
    // Get the chat with its messages to find linkedResourceRefs
    const { data: chat, error: chatError } = await supabase
      .from('chats')
      .select('chats')
      .eq('id', chatId)
      .eq('user_id', userId)
      .single();

    if (chatError || !chat) {
      result.errors.push('Failed to fetch chat for linkedResource analysis');
      return result;
    }

    // Extract all linkedResourceRefs from messages (check all possible formats)
    const linkedResourceRefs = [];
    const messages = chat.chats || [];
    
    for (const message of messages) {
      // Check linkedResourceRefs format (UI format)
      if (message.linkedResourceRefs && Array.isArray(message.linkedResourceRefs)) {
        linkedResourceRefs.push(...message.linkedResourceRefs);
      }
      
      // Check linked_resources format (raw database format)
      if (message.linked_resources && Array.isArray(message.linked_resources)) {
        linkedResourceRefs.push(...message.linked_resources);
      }
      
      // Check linkedResources format (augmented format)
      if (message.linkedResources && Array.isArray(message.linkedResources)) {
        linkedResourceRefs.push(...message.linkedResources.map(resource => ({
          type: resource.type,
          id: resource.id
        })));
      }
    }

    console.log(`[AUTO-SHARE] Found ${linkedResourceRefs.length} linked resources:`, linkedResourceRefs);

    // Group resources by type
    const quizIds = linkedResourceRefs
      .filter(ref => ref.type === 'quiz')
      .map(ref => ref.id)
      .filter(Boolean);
    
    const flashcardIds = linkedResourceRefs
      .filter(ref => ref.type === 'flashcard_set')
      .map(ref => ref.id)
      .filter(Boolean);

    console.log(`[AUTO-SHARE] Parsed ${quizIds.length} quiz IDs:`, quizIds);
    console.log(`[AUTO-SHARE] Parsed ${flashcardIds.length} flashcard IDs:`, flashcardIds);

    // Auto-share quizzes owned by the user
    if (quizIds.length > 0) {
      console.log(`[AUTO-SHARE] Attempting to auto-share ${quizIds.length} quizzes for user ${userId}`);
      
      const { data: updatedQuizzes, error: quizError } = await supabase
        .from('quizzes')
        .update({
          is_public: true,
          visibility_mode: visibilityMode,
          share_token: crypto.randomUUID()
        })
        .in('id', quizIds)
        .eq('created_by', userId) // Only share quizzes owned by the user
        .select('id');

      console.log(`[AUTO-SHARE] Quiz update result:`, { updatedQuizzes, quizError });

      if (quizError) {
        result.errors.push(`Failed to auto-share some quizzes: ${quizError.message}`);
      } else {
        result.sharedQuizzes = updatedQuizzes?.length || 0;
        console.log(`[AUTO-SHARE] Successfully shared ${result.sharedQuizzes} quizzes`);
      }
    }

    // Auto-share flashcard sets owned by the user
    if (flashcardIds.length > 0) {
      console.log(`[AUTO-SHARE] Attempting to auto-share ${flashcardIds.length} flashcard sets for user ${userId}`);
      
      const { data: updatedFlashcards, error: flashcardError } = await supabase
        .from('flashcard_sets')
        .update({
          is_public: true,
          visibility_mode: visibilityMode,
          share_token: crypto.randomUUID()
        })
        .in('id', flashcardIds)
        .eq('user_id', userId) // Only share flashcard sets owned by the user
        .select('id');

      console.log(`[AUTO-SHARE] Flashcard update result:`, { updatedFlashcards, flashcardError });

      if (flashcardError) {
        result.errors.push(`Failed to auto-share some flashcard sets: ${flashcardError.message}`);
      } else {
        result.sharedFlashcards = updatedFlashcards?.length || 0;
        console.log(`[AUTO-SHARE] Successfully shared ${result.sharedFlashcards} flashcard sets`);
      }
    }

  } catch (error) {
    result.errors.push(`Error during auto-share process: ${error.message}`);
  }

  return result;
}

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

    // Auto-share linked resources when making chat public
    let autoShareResult = null;
    if (is_public) {
      autoShareResult = await autoShareLinkedResources(
        supabase, 
        chatId, 
        user.id, 
        visibility_mode || 'link-only'
      );
      
      // Log auto-share results for debugging
      if (autoShareResult.sharedQuizzes > 0 || autoShareResult.sharedFlashcards > 0) {
        console.log(`Auto-shared ${autoShareResult.sharedQuizzes} quizzes and ${autoShareResult.sharedFlashcards} flashcard sets for chat ${chatId}`);
      }
      
      if (autoShareResult.errors.length > 0) {
        console.warn('Auto-share warnings:', autoShareResult.errors);
      }
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
      visibility_mode: updatedChat.visibility_mode,
      // Include auto-share results in response for UI feedback
      ...(autoShareResult && {
        linked_resources_shared: {
          quizzes: autoShareResult.sharedQuizzes,
          flashcards: autoShareResult.sharedFlashcards,
          warnings: autoShareResult.errors
        }
      })
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