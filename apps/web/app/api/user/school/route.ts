import { NextResponse } from 'next/server';
import { validateAuth, validateAuthWithSchool } from "@/features/auth/operations";
import type { School } from '@/features/auth/types';
import { clerkClient } from '@clerk/nextjs/server';
import logger from '@/lib/logger';

export async function GET(request: Request) {
  try {
    const auth = await validateAuthWithSchool();
    const supabase = auth.supabase;

    const { data: school, error } = await supabase
      .from('schools')
      .select('id, name, city, state, domain, logo_url')
      .eq('id', auth.selectedSchool)
      .single();

    if (error) {
      throw error;
    }

    if (!school) {
      return NextResponse.json({ 
        school: null, 
        message: 'School not found' 
      }, { status: 404 });
    }

    return NextResponse.json({ school });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const auth = await validateAuth();
    logger.info({ userId: auth.userId }, '[User School] Removing school selection');

    const client = await clerkClient();
    const user = await client.users.getUser(auth.userId);

    const newPublicMetadata = {
      ...user.publicMetadata,
      hasCompletedOnboarding: false,
      selectedSchool: null,
      selectedSchoolName: null,
      selectedSchoolDomain: null,
      selectedCourseId: null,
      onboardingCompletedAt: null,
    };

    await client.users.updateUserMetadata(auth.userId, {
      publicMetadata: newPublicMetadata,
      privateMetadata: {},
    });

    logger.info({ userId: auth.userId }, '[User School] Successfully removed school selection');

    return NextResponse.json({ 
      message: 'School selection removed successfully' 
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ message }, { status: 500 });
  }
}