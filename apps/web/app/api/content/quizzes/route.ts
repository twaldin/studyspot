import { NextRequest, NextResponse } from 'next/server';
import { validateAuthWithSchool } from '@/features/auth/operations';
import { supabaseService } from '@/lib/services/database/supabase.service';
import logger from '@/lib/logger';

export async function GET(request: NextRequest) {
  try {
    const auth = await validateAuthWithSchool();
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('courseId');

    if (!courseId) {
      return NextResponse.json({ error: 'courseId is required' }, { status: 400 });
    }

    logger.info({ userId: auth.userId, courseId }, '[Content API] Fetching quizzes for course');

    const supabase = await supabaseService.createAuthenticatedClient();
    
    // Get quizzes that are either:
    // 1. Course-wide visible (visibility_mode = 'course')
    // 2. User's own private quizzes (created_by = user_id)
    const { data: quizzes, error } = await supabase
      .from('quizzes')
      .select(`
        id,
        title,
        description,
        total_questions,
        created_by,
        course_id,
        visibility_mode,
        is_public,
        created_at,
        updated_at
      `)
      .eq('course_id', courseId)
      .or(`visibility_mode.eq.course,created_by.eq.${auth.userId}`)
      .order('created_at', { ascending: false });

    if (error) {
      logger.error({ error, courseId, userId: auth.userId }, '[Content API] Failed to fetch quizzes');
      return NextResponse.json({ error: 'Failed to fetch quizzes' }, { status: 500 });
    }

    // Transform to include question count from total_questions column
    const transformedQuizzes = quizzes.map(quiz => ({
      id: quiz.id,
      type: 'quiz' as const,
      title: quiz.title,
      description: quiz.description,
      questionCount: quiz.total_questions || 0,
      created_by: quiz.created_by,
      visibility_mode: quiz.visibility_mode,
      is_public: quiz.is_public,
      created_at: quiz.created_at,
      updated_at: quiz.updated_at
    }));

    logger.info({ 
      courseId, 
      userId: auth.userId, 
      count: transformedQuizzes.length 
    }, '[Content API] Successfully fetched quizzes');

    return NextResponse.json({ quizzes: transformedQuizzes });

  } catch (error) {
    logger.error({ error }, '[Content API] Unexpected error fetching quizzes');
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}