import { NextResponse } from 'next/server';
import { validateAuth, validateAuthWithSchool } from "@/features/auth/operations";
import type { School } from '@/features/auth/types';
import logger from '@/lib/logger';

export async function GET(request: Request) {
  try {
    const auth = await validateAuth();
    const supabase = auth.supabase;

    const { data: schools, error } = await supabase
      .from('schools')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      throw error;
    }

    // Log the schools data to verify domain is present (preserving original logging)
    logger.info({ 
      schoolCount: schools?.length,
      schoolsWithDomain: schools?.filter((s: School) => s.domain)?.length,
      sampleSchool: schools?.[0]
    }, 'Fetched schools from database');

    return NextResponse.json({ schools });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ message }, { status: 500 });
  }
}