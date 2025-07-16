import { NextResponse } from 'next/server';
import { authService } from '@/lib/services/auth/auth.service';
import { clerkClient } from '@clerk/nextjs/server';

export async function GET(request: Request) {
  try {
    const auth = await authService.validateAuthWithSchool();
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('courseId');
    const ids = searchParams.get('ids');

    const supabase = auth.supabase;
    let query = supabase.from('docs').select('*');

    if (ids) {
      const idArray = ids.split(',');
      query = query.in('id', idArray);
    } else if (courseId) {
      query = query.eq('course_id', courseId).order('created_at', { ascending: false });
    } else {
      return NextResponse.json({ message: 'Course ID or document IDs are required' }, { status: 400 });
    }

    const { data: docs, error } = await query;

    if (error) {
      throw error;
    }

    // Get user's starred documents from Clerk metadata
    const client = await clerkClient();
    const user = await client.users.getUser(auth.userId);
    const starredDocs = (user.privateMetadata.starredDocs as string[] || []);
    const reportedDocs = (user.privateMetadata.reportedDocs as string[] || []);

    // Transform the results to include is_starred and has_reported booleans
    const transformedDocs = docs.map(doc => ({
      ...doc,
      is_starred: starredDocs.includes(doc.id),
      has_reported: reportedDocs.includes(doc.id)
    }));

    return NextResponse.json({ docs: transformedDocs });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ message }, { status: 500 });
  }
}