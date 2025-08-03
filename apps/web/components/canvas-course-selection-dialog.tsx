"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CanvasCourse } from "@/lib/services/canvas/canvas.service";
import { useCanvasCourses } from "@/hooks/api/canvas";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "react-hot-toast";

interface CanvasCourseSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSync: (selectedCourses: CanvasCourse[]) => void;
  isProcessing: boolean;
  accessToken: string;
}

export function CanvasCourseSelectionDialog({
  open,
  onOpenChange,
  onSync,
  isProcessing,
  accessToken,
}: CanvasCourseSelectionDialogProps) {
  const [selectedCourses, setSelectedCourses] = React.useState<number[]>([]);
  const { data: courses, isLoading, error } = useCanvasCourses(accessToken);

  React.useEffect(() => {
    if (courses) {
      setSelectedCourses(courses.map(course => course.id));
    }
  }, [courses]);

  React.useEffect(() => {
    if (error) {
      toast.error(error.message);
    }
  }, [error]);

  const handleSelectCourse = (courseId: number) => {
    setSelectedCourses((prev) =>
      prev.includes(courseId)
        ? prev.filter((id) => id !== courseId)
        : [...prev, courseId]
    );
  };

  const handleSync = () => {
    const selectedCourseObjects = (courses as any)?.filter((course: CanvasCourse) => selectedCourses.includes(course.id)) || [];
    onSync(selectedCourseObjects);
  };

  const handleOpenChange = (open: boolean) => {
    if (isProcessing) {
      return;
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]" showCloseButton={!isProcessing}>
        <DialogHeader>
          <DialogTitle>Select Canvas Courses</DialogTitle>
          <DialogDescription>
            Choose which courses you want to sync with StudySpot.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-72">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : (
            <Accordion type="single" collapsible className="w-full">
              {(courses as any)?.map((course: CanvasCourse) => (
                <AccordionItem value={`course-${course.id}`} key={course.id}>
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={selectedCourses.includes(course.id)}
                      onCheckedChange={() => handleSelectCourse(course.id)}
                      className="mt-4"
                    />
                    <AccordionTrigger>
                      <span>{course.name}</span>
                    </AccordionTrigger>
                  </div>
                  <AccordionContent>
                    <p className="text-sm text-muted-foreground">{course.course_code}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </ScrollArea>
        <DialogFooter>
          <Button onClick={handleSync} disabled={selectedCourses.length === 0 || isProcessing}>
            {isProcessing ? "Syncing..." : "Sync Selected Courses"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
