"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@studyspot/ui/components/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@studyspot/ui/components/dialog";
import { CanvasCourseSelectionView } from './canvas-course-selection-view';
import { CanvasCourse } from '@/lib/services/canvas/canvas.service';
import { toast } from 'react-hot-toast';
import { queryKeys } from '@/hooks/api/base';
import { useSyncCanvasCourses } from '@/hooks/api/canvas';
import { useUser } from '@clerk/nextjs';

interface CanvasSyncManagerProps {
  accessToken: string;
  disabled?: boolean;
}

export function CanvasSyncManager({ accessToken, disabled }: CanvasSyncManagerProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();
  const syncMutation = useSyncCanvasCourses();
  const { user } = useUser();

  const handleSync = (selectedCourses: { course: CanvasCourse; contentTypes: string[] }[]) => {
    syncMutation.mutate({ courses: selectedCourses, accessToken }, {
      onSuccess: async () => {
        toast.success('Courses synced successfully! Updating your data...');
        
        // Force a reload of the user object to get the latest metadata
        await user?.reload();
        
        await queryClient.invalidateQueries({ queryKey: queryKeys.user.all });
        await queryClient.invalidateQueries({ queryKey: queryKeys.courses.all });
        
        // Refetch queries to ensure data is fresh before navigation
        await queryClient.refetchQueries({ queryKey: queryKeys.user.all, exact: true });
        await queryClient.refetchQueries({ queryKey: queryKeys.courses.all, exact: true });

        toast.success('Setup complete! Redirecting to your courses...');
        router.push('/courses');
        setIsDialogOpen(false);
      },
      onError: (error: Error) => {
        toast.error(error.message || 'Failed to sync courses. Please try again.');
      },
    });
  };

  return (
    <>
      <Button onClick={() => setIsDialogOpen(true)} disabled={!accessToken || disabled}>
        Sync with Canvas
      </Button>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select Canvas Courses</DialogTitle>
            <DialogDescription>
              Choose which courses and content types you want to sync with StudySpot.
            </DialogDescription>
          </DialogHeader>
          <CanvasCourseSelectionView
            onSync={handleSync}
            isProcessing={syncMutation.isPending}
            accessToken={accessToken}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
