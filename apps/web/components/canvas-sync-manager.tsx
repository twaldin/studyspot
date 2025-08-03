"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { CanvasCourseSelectionDialog } from '@/components/canvas-course-selection-dialog';
import { CanvasCourse } from '@/lib/services/canvas/canvas.service';
import { toast } from 'react-hot-toast';
import { queryKeys } from '@/hooks/api/base';

interface CanvasSyncManagerProps {
  accessToken: string;
}

export function CanvasSyncManager({ accessToken }: CanvasSyncManagerProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();

  const handleSync = async (selectedCourses: CanvasCourse[]) => {
    setIsProcessing(true);
    try {
      const response = await fetch('/api/canvas/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courses: selectedCourses,
          accessToken,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to sync courses');
      }

      const { syncedCourses } = await response.json();

      if (syncedCourses && syncedCourses.length > 0) {
        // Optimistically update the cache
        queryClient.setQueryData(queryKeys.courses.lists(), (oldData: any) => {
          const existingCourses = oldData || [];
          const newCourses = syncedCourses.filter((sc: any) => !existingCourses.some((ec: any) => ec.id === sc.id));
          return [...existingCourses, ...newCourses];
        });

        queryClient.setQueryData(queryKeys.user.joinedCourses(), (oldData: any) => {
          const existingJoined = oldData || [];
          const newJoinedIds = syncedCourses.map((c: any) => c.id).filter((id: any) => !existingJoined.includes(id));
          return [...existingJoined, ...newJoinedIds];
        });

        queryClient.setQueryData(queryKeys.user.profile(), (oldData: any) => {
            if (!oldData) return oldData;
            const existingJoined = oldData.publicMetadata.joinedCourses || [];
            const newJoinedIds = syncedCourses.map((c: any) => c.id).filter((id: any) => !existingJoined.includes(id));
            return {
                ...oldData,
                publicMetadata: {
                    ...oldData.publicMetadata,
                    joinedCourses: [...existingJoined, ...newJoinedIds],
                }
            };
        });

        queryClient.setQueryData(queryKeys.user.selectedCourse(), syncedCourses[0]);
      }

      toast.success('Courses synced successfully!');
      
      // Invalidate queries to ensure data consistency in the background
      await queryClient.invalidateQueries({ queryKey: queryKeys.user.all });
      await queryClient.invalidateQueries({ queryKey: queryKeys.courses.all });

      router.push('/courses');
    } catch (error) {
      toast.error('Failed to sync courses. Please try again.');
    } finally {
      setIsProcessing(false);
      setIsDialogOpen(false);
    }
  };

  return (
    <>
      <Button onClick={() => setIsDialogOpen(true)} disabled={!accessToken}>
        Sync with Canvas
      </Button>
      {isDialogOpen && (
        <CanvasCourseSelectionDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onSync={handleSync}
          isProcessing={isProcessing}
          accessToken={accessToken}
        />
      )}
    </>
  );
}