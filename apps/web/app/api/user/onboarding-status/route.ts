import { NextResponse } from 'next/server';
import { validateAuth, validateAuthWithSchool } from "@/features/auth/operations";
import { getUserOnboardingStatus } from '@/lib/clerk';

export async function GET(request: Request) {
  try {
    const auth = await validateAuth();
    const onboardingStatus = await getUserOnboardingStatus(auth.userId);
    return NextResponse.json(onboardingStatus);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ message }, { status: 500 });
  }
}