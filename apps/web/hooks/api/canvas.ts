"use client";

import { useQuery } from '@tanstack/react-query';
import { CanvasCourse } from '@/lib/services/canvas/canvas.service';

async function getCanvasCourses(accessToken: string): Promise<CanvasCourse[]> {
  const response = await fetch(`/api/canvas/courses?accessToken=${accessToken}`);
  if (!response.ok) {
    throw new Error('Failed to fetch Canvas courses');
  }
  return response.json();
}

export function useCanvasCourses(accessToken: string) {
  return useQuery({
    queryKey: ['canvas-courses', accessToken],
    queryFn: () => getCanvasCourses(accessToken),
    enabled: !!accessToken,
  });
}