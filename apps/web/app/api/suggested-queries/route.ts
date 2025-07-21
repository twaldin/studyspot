import { NextResponse } from 'next/server';
import { authService } from '@/lib/services/auth/auth.service';
import { suggestedQueriesService } from '@/features/assistant/services';

export async function GET(request: Request) {
  try {
    const auth = await authService.validateAuth();
    // Parse courseId from URL search params
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('courseId') || undefined;

    // Delegate to the service
    const result = await suggestedQueriesService.getSuggestedQueries(auth.userId, courseId);

    return NextResponse.json({
      suggestedQueries: result.suggestedQueries,
      fromCache: result.fromCache
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ message }, { status: 500 });
  }
}
