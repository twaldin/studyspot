import { NextRequest, NextResponse } from 'next/server';
import { validateAuth, validateAuthWithSchool } from "@/features/auth/operations";
import { chatService } from '@/features/chat/services/chat.service';
import { updateChatMessages } from '@/features/chat/chat-operations';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ chatId: string }> }
) {
  try {
    const auth = await validateAuthWithSchool();
    const { chatId } = await params;
    
    if (!chatId) {
      return NextResponse.json(
        { message: 'Chat ID is required' },
        { status: 400 }
      );
    }

    const result = await chatService.getChat(chatId, auth.userId, auth.selectedSchool);
    return NextResponse.json({ data: result.chat });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    if (message === 'Chat not found') {
      return NextResponse.json({ message }, { status: 404 });
    }
    return NextResponse.json({ message }, { status: 500 });
  }
}



export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ chatId: string }> }
) {
  try {
    const auth = await validateAuthWithSchool();
    const { chatId } = await params;
    const body = await request.json();
    
    if (!chatId) {
      return NextResponse.json(
        { message: 'Chat ID is required' },
        { status: 400 }
      );
    }

    if (!body.messages || !Array.isArray(body.messages)) {
      return NextResponse.json(
        { message: 'Messages array is required' },
        { status: 400 }
      );
    }

    await updateChatMessages(chatId, auth.userId, body.messages);
    return NextResponse.json({ message: 'Chat updated successfully' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ chatId: string }> }
) {
  try {
    const auth = await validateAuthWithSchool();
    const { chatId } = await params;
    
    if (!chatId) {
      return NextResponse.json(
        { message: 'Chat ID is required' },
        { status: 400 }
      );
    }

    await chatService.deleteChat(chatId, auth.userId);
    return NextResponse.json({ message: 'Chat deleted successfully' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ message }, { status: 500 });
  }
}