"use client";

import React from "react";
import { Button } from "@studyspot/ui/components/button";
import { PlusCircle } from "lucide-react";
import { cn } from "@studyspot/ui/lib/utils";
import Link from "next/link";
import { ICourse } from "@/features/courses/course.model";
import { useSetSelectedCourse } from "@/hooks/api/courses";
import toast from "react-hot-toast";
import { getCourseIcon } from "@/lib/utils/course-icons";

interface JoinedCourseListProps {
  courses: ICourse[];
  selectedCourseId?: string | null;
  onAddMoreClick?: () => void; // Optional callback for when "Add More" is clicked
}

export function JoinedCourseList({
  courses,
  selectedCourseId,
  onAddMoreClick,
}: JoinedCourseListProps) {
  const setSelectedCourseMutation = useSetSelectedCourse();

  const handleAddMoreClick = () => {
    // Call the optional callback if provided (for mobile sidebar closing)
    if (onAddMoreClick) {
      onAddMoreClick();
    }
  };

  const handleCourseClick = (course: ICourse) => {
    if (selectedCourseId === course.id) {
      // Course is already selected, no need to do anything
      return;
    }

    setSelectedCourseMutation.mutate(course, {
      onSuccess: () => {
        toast.success(`Switched to ${course.code}`);
      },
      onError: (error: any) => {
        toast.error(error.message || "Failed to select course");
      },
    });
  };

  if (courses.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-sm mb-2">No courses joined yet</p>
        <Button
          asChild
          variant="ghost"
          className="cursor-pointer gap-2"
          onClick={handleAddMoreClick}
        >
          <Link href="/courses">
            <PlusCircle className="h-4 w-4" />
            Join Courses
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      {courses.map((course) => {
        const IconComponent = getCourseIcon(course.icon);
        const isSelected = selectedCourseId === course.id;

        return (
          <button
            key={course.id}
            onClick={() => handleCourseClick(course)}
            className={cn(
              "cursor-pointer flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors hover:bg-accent hover:text-accent-foreground disabled:opacity-50",
              isSelected && "bg-secondary",
            )}
          >
            <IconComponent className="h-4 w-4" />
            <span className="truncate">{course.code || "Unknown"}</span>
          </button>
        );
      })}
      <Button
        asChild
        variant="ghost"
        className="cursor-pointer gap-2"
        onClick={handleAddMoreClick}
      >
        <Link href="/courses">
          <PlusCircle className="h-4 w-4" />
          Add More
        </Link>
      </Button>
    </>
  );
}

