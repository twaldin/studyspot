import { NextResponse } from 'next/server';
import { authService } from '@/lib/services/auth/auth.service';
import { getSelectedCourseForUser, setSelectedCourseForUser, clearSelectedCourseForUser } from '@/lib/clerk';
import logger, { LogContext } from '@/lib/logger';

export async function GET(request: Request) {
  try {
    const auth = await authService.validateAuth();
    logger.info(LogContext.api('user/selected-course', auth.userId), 'Getting selected course');

    const courseId = await getSelectedCourseForUser(auth.userId);
    
    if (!courseId) {
      logger.info(LogContext.api('user/selected-course', auth.userId), 'No course ID in Clerk metadata');
      return NextResponse.json({ 
        selectedCourse: null, 
        message: 'No course selected' 
      }, { status: 200 });
    }

    const supabase = auth.supabase;
    const { data: course, error } = await supabase
      .from('courses')
      .select('id, title, code, school_id')
      .eq('id', courseId)
      .single();

    if (error) {
      throw error;
    }

    if (!course) {
      logger.info(LogContext.api('user/selected-course', auth.userId, { courseId }), 'Course not found in database - clearing user metadata');
      
      // Clear the selected course from user metadata since it no longer exists
      try {
        await clearSelectedCourseForUser(auth.userId);
        logger.info(LogContext.api('user/selected-course', auth.userId, { courseId }), 'Cleared invalid selected course from user metadata');
      } catch (cleanupError) {
        logger.error(LogContext.api('user/selected-course', auth.userId, { courseId }), 'Failed to clear invalid selected course from user metadata', { error: cleanupError });
      }
      
      return NextResponse.json({ 
        selectedCourse: null, 
        message: 'Course not found' 
      }, { status: 200 }); // Changed to 200 since we successfully cleaned up
    }

    logger.info(LogContext.api('user/selected-course', auth.userId), 'Course found');
    return NextResponse.json({ selectedCourse: course });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const auth = await authService.validateAuthWithSchool();
    const { courseId } = await request.json();
    
    if (!courseId) {
      return NextResponse.json({ error: 'Course ID is required' }, { status: 400 });
    }

    logger.info(LogContext.api('user/selected-course', auth.userId, { courseId }), 'Setting selected course');

    const supabase = auth.supabase;
    const { data: course, error } = await supabase
      .from('courses')
      .select('id, title, code, school_id')
      .eq('id', courseId)
      .eq('school_id', auth.selectedSchool)
      .single();

    if (error || !course) {
      return NextResponse.json({ error: 'Course not found or not accessible' }, { status: 404 });
    }

    await setSelectedCourseForUser(auth.userId, courseId);

    logger.info(LogContext.api('user/selected-course', auth.userId, { courseId }), 'Successfully set selected course');

    return NextResponse.json({ 
      message: 'Selected course updated successfully',
      course
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const auth = await authService.validateAuth();
    logger.info(LogContext.api('user/selected-course', auth.userId), 'Clearing selected course');

    await clearSelectedCourseForUser(auth.userId);

    logger.info(LogContext.api('user/selected-course', auth.userId), 'Successfully cleared selected course');

    return NextResponse.json({ message: 'Selected course cleared successfully' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ message }, { status: 500 });
  }
}