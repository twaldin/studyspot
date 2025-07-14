import { NextResponse } from 'next/server';
import { authService } from '@/lib/services/auth/auth.service';
import { clerkClient } from '@clerk/nextjs/server';
import logger from '@/lib/logger';

export async function POST(request: Request) {
  try {
    const auth = await authService.validateAuth();
    const { selectedSchool, selectedSchoolName, selectedSchoolDomain } = await request.json();

    logger.info({ 
      userId: auth.userId,
      selectedSchool,
      selectedSchoolName,
      selectedSchoolDomain
    }, '[User Onboarding] Received school selection');

    // Validate required fields
    if (!selectedSchool || !selectedSchoolName) {
      return NextResponse.json({ 
        error: 'Selected school and school name are required' 
      }, { status: 400 });
    }

    // Update user metadata with selected school and onboarding completion
    const client = await clerkClient();
    const metadata = {
      publicMetadata: {
        selectedSchool,
        selectedSchoolName,
        selectedSchoolDomain,
        hasCompletedOnboarding: true,
        onboardingCompletedAt: new Date().toISOString(),
      },
    };

    logger.info({ 
      userId: auth.userId,
      metadata
    }, '[User Onboarding] Updating user metadata');

    await client.users.updateUserMetadata(auth.userId, metadata);

    // Verify the update was successful by fetching the user
    const updatedUser = await client.users.getUser(auth.userId);
    logger.info({ 
      userId: auth.userId,
      updatedMetadata: updatedUser.publicMetadata
    }, '[User Onboarding] Verified updated user metadata');

    return NextResponse.json({
      data: {
        selectedSchool,
        selectedSchoolName,
        selectedSchoolDomain,
      },
      message: 'Onboarding completed successfully'
    });

  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ message }, { status: 500 });
  }
}
