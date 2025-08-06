import { NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { syncCanvasCourses, CanvasCourse } from '@/lib/services/canvas/canvas.service';
import { getUserOnboardingStatus, setSelectedCourseForUser } from '@/lib/clerk';

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { courses, accessToken } = await request.json();
    const { selectedSchool: schoolId } = await getUserOnboardingStatus(userId);

    if (!schoolId) {
      return NextResponse.json({ error: 'User is not associated with a school' }, { status: 400 });
    }

    if (!accessToken) {
      return NextResponse.json({ error: 'Canvas access token is required' }, { status: 400 });
    }

    if (!courses || !Array.isArray(courses) || courses.length === 0) {
      return NextResponse.json({ error: 'An array of courses to sync is required' }, { status: 400 });
    }

    const syncedCourses = await syncCanvasCourses(userId, schoolId, courses as { course: CanvasCourse; contentTypes: string[] }[], accessToken);

    if (syncedCourses.length > 0) {
      const clerk = await clerkClient();
      const user = await clerk.users.getUser(userId);
      const currentJoinedCourses = (user.publicMetadata?.joinedCourses as string[]) || [];
      const newCourseIds = syncedCourses.map(c => c.id).filter(id => !currentJoinedCourses.includes(id));

      if (newCourseIds.length > 0) {
        const updatedJoinedCourses = [...currentJoinedCourses, ...newCourseIds];
        await clerk.users.updateUserMetadata(userId, {
          publicMetadata: {
            ...user.publicMetadata,
            joinedCourses: updatedJoinedCourses,
          },
        });
      }

      await setSelectedCourseForUser(userId, syncedCourses[0].id);
    }

    return NextResponse.json({ syncedCourses });
  } catch (error) {
    console.error('Error syncing Canvas courses:', error);
    return NextResponse.json({ error: 'Failed to sync Canvas courses' }, { status: 500 });
  }
}
