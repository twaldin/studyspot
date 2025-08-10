import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/services/database/supabase.service';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ setId: string; shareToken: string }> }
) {
  try {
    const { setId, shareToken } = await params;
    const supabase = createServiceRoleClient();

    // Verify public access and get flashcard set with related data
    const { data: set, error } = await supabase
      .from('flashcard_sets')
      .select(`
        id,
        title,
        description,
        course_id,
        is_public,
        visibility_mode,
        courses (
          id,
          code,
          title,
          icon,
          schools (
            id,
            name
          )
        ),
        flashcards (*)
      `)
      .eq('id', setId)
      .eq('share_token', shareToken)
      .eq('is_public', true)
      .single();

    if (error || !set) {
      return NextResponse.json({ 
        error: 'Flashcard set not found or not publicly accessible'
      }, { status: 404 });
    }

    // Debug: Log the actual flashcard data structure
    console.log('Public flashcard set data:', JSON.stringify(set, null, 2));

    // Return only safe, necessary data for public view
    return NextResponse.json({
      id: set.id,
      title: set.title,
      description: set.description,
      flashcards: set.flashcards || [], // The flashcard data from the separate flashcards table
      course: set.courses ? {
        id: set.course_id,
        code: set.courses.code,
        title: set.courses.title,
        icon: set.courses.icon,
        school: set.courses.schools ? {
          name: set.courses.schools.name
        } : { name: 'Unknown School' }
      } : {
        id: set.course_id,
        code: 'Unknown',
        title: 'Unknown Course',
        icon: null,
        school: { name: 'Unknown School' }
      },
      visibility_mode: set.visibility_mode
    });

  } catch (error) {
    console.error('Error fetching public flashcard set:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}