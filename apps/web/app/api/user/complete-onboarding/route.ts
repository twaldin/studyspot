import { NextResponse } from 'next/server';
import { validateAuth } from '@/features/auth/operations';
import { clerkClient } from '@clerk/nextjs/server';
import logger from '@/lib/logger';

export async function POST(request: Request) {
  try {
    const { userId } = await validateAuth();

    const client = await clerkClient();
    await client.users.updateUserMetadata(userId, {
      publicMetadata: {
        hasCompletedOnboarding: true,
        onboardingCompletedAt: new Date().toISOString(),
      },
    });

    logger.info({ userId }, 'User has completed onboarding');

    return NextResponse.json({ success: true });

  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    logger.error(
      { 
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : '',
        error,
      }, 
      'Failed to mark onboarding as complete'
    );
    return NextResponse.json({ message }, { status: 500 });
  }
}
