"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Box,
  FlaskConical,
  Music,
  PartyPopper,
  PlusCircle,
  Radical,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ICourse } from "@/features/courses/course.model";
import { useSetSelectedCourse } from "@/hooks/api/courses";
import toast from "react-hot-toast";

// Default icons for courses (will be used if no specific icon is provided)
const defaultCourseIcons = [FlaskConical, Radical, Box, Music, PartyPopper];

// Helper function to get icon for course
const getCourseIcon = (courseCode: string, index: number) => {
  // You can add logic here to determine icons based on course code
  // For now, we'll cycle through default icons
  return defaultCourseIcons[index % defaultCourseIcons.length];
};

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
      <div className="text-center text-muted-foreground py-4">
        <p className="text-sm mb-2">No courses joined yet</p>
        <Button asChild variant="ghost" className="gap-2" onClick={handleAddMoreClick}>
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
      {courses.map((course, index) => {
        const IconComponent = getCourseIcon(course.code || "", index);
        const isSelected = selectedCourseId === course.id;

        return (
          <button
            key={course.id}
            onClick={() => handleCourseClick(course)}
            disabled={setSelectedCourseMutation.isPending}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors hover:bg-accent hover:text-accent-foreground disabled:opacity-50",
              isSelected 
                ? "bg-secondary text-secondary-foreground" 
                : "text-muted-foreground"
            )}
          >
            <IconComponent className="h-4 w-4" />
            <span className="truncate">{course.code || "Unknown"}</span>
          </button>
        );
      })}
      <Button asChild variant="ghost" className="gap-2" onClick={handleAddMoreClick}>
        <Link href="/courses">
          <PlusCircle className="h-4 w-4" />
          Add More
        </Link>
      </Button>
    </>
  );
}