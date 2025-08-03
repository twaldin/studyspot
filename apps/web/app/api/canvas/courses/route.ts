import { NextResponse } from 'next/server';
import { getCanvasCourses as getCourses } from '@/lib/services/canvas/canvas.service';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const accessToken = searchParams.get('accessToken');

  if (!accessToken) {
    return NextResponse.json({ error: 'Canvas access token is required' }, { status: 400 });
  }

  try {
    const courses = await getCourses(accessToken);
    return NextResponse.json(courses);
  } catch (error) {
    console.error('Error fetching Canvas courses:', error);
    return NextResponse.json({ error: 'Failed to fetch Canvas courses' }, { status: 500 });
  }
}