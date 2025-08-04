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
import { Label } from "@/components/ui/label";

interface CanvasCourseSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSync: (selectedCourses: { course: CanvasCourse; contentTypes: string[] }[]) => void;
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
  const [selectedContentTypes, setSelectedContentTypes] = React.useState<{ [courseId: number]: string[] }>({});
  const { data: courses, isLoading, error } = useCanvasCourses(accessToken);

  React.useEffect(() => {
    if (courses) {
      const initialSelectedCourses = courses.map(course => course.id);
      setSelectedCourses(initialSelectedCourses);
      const initialContentTypes = courses.reduce((acc, course) => {
        acc[course.id] = course.availableContentTypes || [];
        return acc;
      }, {} as { [courseId: number]: string[] });
      setSelectedContentTypes(initialContentTypes);
    }
  }, [courses]);

  React.useEffect(() => {
    if (error) {
      toast.error(error.message);
    }
  }, [error]);

  const handleSelectCourse = (courseId: number) => {
    const isSelected = selectedCourses.includes(courseId);
    const course = courses?.find(c => c.id === courseId);
    if (isSelected) {
      setSelectedCourses(prev => prev.filter(id => id !== courseId));
      setSelectedContentTypes(prev => {
        const newContentTypes = { ...prev };
        delete newContentTypes[courseId];
        return newContentTypes;
      });
    } else {
      setSelectedCourses(prev => [...prev, courseId]);
      setSelectedContentTypes(prev => ({
        ...prev,
        [courseId]: course?.availableContentTypes || [],
      }));
    }
  };

  const handleSelectContentType = (courseId: number, contentType: string) => {
    setSelectedContentTypes(prev => {
      const currentContentTypes = prev[courseId] || [];
      const newContentTypes = currentContentTypes.includes(contentType)
        ? currentContentTypes.filter(ct => ct !== contentType)
        : [...currentContentTypes, contentType];
      
      if (newContentTypes.length === 0) {
        setSelectedCourses(prevSelected => prevSelected.filter(id => id !== courseId));
      } else if (!selectedCourses.includes(courseId)) {
        setSelectedCourses(prevSelected => [...prevSelected, courseId]);
      }

      return {
        ...prev,
        [courseId]: newContentTypes,
      };
    });
  };

  const handleSync = () => {
    const selectedCourseObjects = (courses as any)?.filter((course: CanvasCourse) => selectedCourses.includes(course.id))
      .map(course => ({
        course,
        contentTypes: selectedContentTypes[course.id] || [],
      })) || [];
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
            Choose which courses and content types you want to sync with StudySpot.
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
            <Accordion type="multiple" className="w-full">
              {(courses as any)?.map((course: CanvasCourse) => (
                <AccordionItem value={`course-${course.id}`} key={course.id}>
                  <div className="flex items-center gap-3 w-full pr-4">
                    <Checkbox
                      className="ml-4"
                      checked={selectedCourses.includes(course.id)}
                      onCheckedChange={() => handleSelectCourse(course.id)}
                    />
                    <AccordionTrigger className="flex-1">
                      <span>{course.name}</span>
                    </AccordionTrigger>
                  </div>
                  <AccordionContent>
                    <div className="space-y-2 pl-12">
                      {(course.availableContentTypes || []).map(contentType => (
                        <div key={contentType} className="flex items-center gap-2">
                          <Checkbox
                            id={`ct-${course.id}-${contentType}`}
                            checked={(selectedContentTypes[course.id] || []).includes(contentType)}
                            onCheckedChange={() => handleSelectContentType(course.id, contentType)}
                          />
                          <Label htmlFor={`ct-${course.id}-${contentType}`}>{contentType}</Label>
                        </div>
                      ))}
                    </div>
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
