"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { CanvasCourseSelectionDialog } from '@/components/canvas-course-selection-dialog';
import { CanvasCourse } from '@/lib/services/canvas/canvas.service';
import { toast } from 'react-hot-toast';
import { queryKeys } from '@/hooks/api/base';
import { useSyncCanvasCourses } from '@/hooks/api/canvas';

interface CanvasSyncManagerProps {
  accessToken: string;
}

export function CanvasSyncManager({ accessToken }: CanvasSyncManagerProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();
  const syncMutation = useSyncCanvasCourses();

  const handleSync = (selectedCourses: CanvasCourse[]) => {
    syncMutation.mutate({ courses: selectedCourses, accessToken }, {
      onSuccess: async () => {
        toast.success('Courses synced successfully! Updating your data...');
        await queryClient.invalidateQueries({ queryKey: queryKeys.user.all });
        await queryClient.invalidateQueries({ queryKey: queryKeys.courses.all });
        
        // Refetch queries to ensure data is fresh before navigation
        await queryClient.refetchQueries({ queryKey: queryKeys.user.all, exact: true });
        await queryClient.refetchQueries({ queryKey: queryKeys.courses.all, exact: true });

        toast.success('Setup complete! Redirecting to your courses...');
        router.push('/courses');
        setIsDialogOpen(false);
      },
      onError: () => {
        toast.error('Failed to sync courses. Please try again.');
      },
    });
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
          isProcessing={syncMutation.isPending}
          accessToken={accessToken}
        />
      )}
    </>
  );
}
