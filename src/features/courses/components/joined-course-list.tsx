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
import Link from "next/link";
import { ICourse } from "@/features/courses/course.model";

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
  onCourseSelect: (course: ICourse) => void;
  isLoading?: boolean;
  onAddMoreClick?: () => void; // Optional callback for when "Add More" is clicked
}

export function JoinedCourseList({
  courses,
  selectedCourseId,
  onCourseSelect,
  isLoading = false,
  onAddMoreClick,
}: JoinedCourseListProps) {
  const handleAddMoreClick = () => {
    // Call the optional callback if provided (for mobile sidebar closing)
    if (onAddMoreClick) {
      onAddMoreClick();
    }
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
          <Button
            key={course.id}
            variant={isSelected ? "flat" : "ghost"}
            onClick={() => onCourseSelect(course)}
            className="gap-2 transition-none active:bg-inherit active:text-inherit hover:bg-inherit hover:text-inherit"
          >
            <IconComponent className="h-4 w-4" />
            <span className="truncate">{course.code || "Unknown"}</span>
          </Button>
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