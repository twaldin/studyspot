import { NextResponse } from 'next/server';
import { authService } from '@/lib/services/auth/auth.service';
import { assistantStreamHandler } from '@/features/assistant/services';

export async function POST(request: Request) {
  try {
    const auth = await authService.validateAuth();
    
    // Parse and validate request body
    const requestBody = await request.json();
    const { question, conversationHistory, courseId, timeZone } = 
      assistantStreamHandler.validateStreamingRequest(requestBody);

    // Delegate to the stream handler service
    return await assistantStreamHandler.handleStreamingResponse(
      auth.supabase,
      question,
      conversationHistory,
      courseId,
      timeZone,
      auth.userId
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ message }, { status: 500 });
  }
}