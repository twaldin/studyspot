import { NextRequest, NextResponse } from 'next/server';
import { validateAuth, validateAuthWithSchool } from "@/features/auth/operations";
import { chatService } from '@/features/chat/services/chat.service';
import { getSelectedCourseForUser } from '@/lib/clerk';

export async function GET(request: Request) {
  try {
    const auth = await validateAuthWithSchool();
    const result = await chatService.getChats(auth.userId, auth.selectedSchool);
    return NextResponse.json({ chats: result.chats });
  } catch (error) {
    // Handle auth errors specifically
    if (error && typeof error === 'object' && 'status' in error) {
      return NextResponse.json(
        { message: (error as any).message || 'Authentication failed' },
        { status: (error as any).status || 500 }
      );
    }
    
    console.error('[ChatService] Failed to fetch chats:', error);
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const auth = await validateAuthWithSchool();
    const { title, initialMessages } = await request.json();

    if (!initialMessages || initialMessages.length === 0) {
      return NextResponse.json(
        { message: 'Initial messages are required to create a chat.' },
        { status: 400 }
      );
    }

    // Get user's selected course
    const selectedCourseId = await getSelectedCourseForUser(auth.userId);
    
    if (!selectedCourseId) {
      return NextResponse.json(
        { message: 'Please select a course first.' },
        { status: 400 }
      );
    }

    const result = await chatService.createChat(
      { title, initialMessages },
      auth.userId,
      selectedCourseId
    );
    
    return NextResponse.json(result.chat, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ message }, { status: 500 });
  }
}