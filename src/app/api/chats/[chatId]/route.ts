import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/lib/services/auth/auth.service';
import { chatService } from '@/features/chat/services/chat.service';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ chatId: string }> }
) {
  try {
    const auth = await authService.validateAuthWithSchool();
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
    const auth = await authService.validateAuthWithSchool();
    const { chatId } = await params;
    const { messages } = await request.json();

    if (!chatId) {
      return NextResponse.json(
        { message: 'Chat ID is required' },
        { status: 400 }
      );
    }

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { message: 'Messages array is required' },
        { status: 400 }
      );
    }

    const result = await chatService.updateChat(chatId, { messages }, auth.userId);
    return NextResponse.json({ data: result });
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
    const auth = await authService.validateAuthWithSchool();
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