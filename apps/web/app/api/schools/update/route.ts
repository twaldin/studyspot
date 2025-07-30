import { NextResponse } from 'next/server';
import { validateAuth, validateAuthWithSchool } from "@/features/auth/operations";
import logger from '@/lib/logger';

export async function POST(request: Request) {
  try {
    const auth = await validateAuth();
    const { schoolId, updates } = await request.json();

    if (!schoolId || !updates) {
      return NextResponse.json({ message: 'School ID and updates are required' }, { status: 400 });
    }

    const supabase = auth.supabase;
    const { data: school, error } = await supabase
      .from('schools')
      .update(updates)
      .eq('id', schoolId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    logger.info({ school }, 'Successfully updated school');
    return NextResponse.json({ school });

  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ message }, { status: 500 });
  }
}