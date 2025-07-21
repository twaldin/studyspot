import { NextResponse } from 'next/server';
import { authService } from '@/lib/services/auth/auth.service';

export async function GET(request: Request) {
  try {
    const auth = await authService.validateAuth();
    const onboardingStatus = await authService.getOnboardingStatus(auth.userId);
    return NextResponse.json(onboardingStatus);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ message }, { status: 500 });
  }
}