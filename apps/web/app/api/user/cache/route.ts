import { NextResponse } from 'next/server';
import { authService } from '@/lib/services/auth/auth.service';
import { clearUserCache } from '@/lib/clerk';
import logger from '@/lib/logger';

export async function DELETE(request: Request) {
  try {
    const auth = await authService.validateAuth();
    const { userId } = await request.json();
    
    // Ensure user can only clear their own cache
    if (userId !== auth.userId) {
      return NextResponse.json({ 
        error: 'Unauthorized to clear cache for other users' 
      }, { status: 403 });
    }
    
    // Clear the user cache
    clearUserCache(userId);
    
    logger.info({ userId }, 'User cache cleared successfully');
    
    return NextResponse.json({ 
      message: 'Cache cleared successfully' 
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    logger.error({ error }, 'Failed to clear user cache');
    return NextResponse.json({ message }, { status: 500 });
  }
}