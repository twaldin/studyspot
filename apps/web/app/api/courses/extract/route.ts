import { NextResponse } from 'next/server';
import { extractCourseInfo } from '@/features/courses/course-extraction';

export async function POST(request: Request) {
  try {
    const { fileUrl } = await request.json();

    if (!fileUrl) {
      return NextResponse.json(
        { message: 'No file URL provided' },
        { status: 400 }
      );
    }

    const result = await extractCourseInfo({
      fileUrl
    });

    if (!result.success) {
      return NextResponse.json(
        {
          message: result.error || 'Failed to extract course information',
          details: {
            courseCode: result.data?.courseCode || '',
            courseTitle: result.data?.courseTitle || '',
            confidence: result.confidence || 0
          }
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      courseCode: result.data?.courseCode || '',
      courseTitle: result.data?.courseTitle || '',
      icon: result.data?.icon || null,
      confidence: result.confidence || 0.8
    });
    
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ message }, { status: 500 });
  }
}