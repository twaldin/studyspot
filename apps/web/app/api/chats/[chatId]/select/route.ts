import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/lib/services/auth/auth.service';
import { supabaseService } from '@/lib/services/database/supabase.service';
import { clerkClient } from '@clerk/nextjs/server';

export async function POST(
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

    const supabase = await supabaseService.createAuthenticatedClient();
    
    // Get the chat's course_id and course details, but only if it belongs to the current school
    const { data: chat, error } = await supabase
      .from('chats')
      .select(`
        course_id,
        courses!inner (
          id,
          title,
          code,
          school_id
        )
      `)
      .eq('id', chatId)
      .eq('user_id', auth.userId)
      .eq('courses.school_id', auth.selectedSchool)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { message: 'Chat not found' },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { message: 'Failed to fetch chat for course selection' },
        { status: 500 }
      );
    }

    if (!chat) {
      return NextResponse.json(
        { message: 'Chat not found' },
        { status: 404 }
      );
    }

    // Update Clerk metadata with the selected chat's course
    if (chat.course_id) {
      const client = await clerkClient();
      await client.users.updateUserMetadata(auth.userId, {
        publicMetadata: {
          selectedCourseId: chat.course_id
        }
      });

      return NextResponse.json({
        message: 'Selected course updated successfully',
        courseId: chat.course_id,
        course: chat.courses // Include full course details
      });
    }

    return NextResponse.json({
      message: 'No course associated with this chat',
      courseId: null,
      course: null
    });

  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ message }, { status: 500 });
  }
}