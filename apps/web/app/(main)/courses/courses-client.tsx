"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@workspace/ui/components/alert-dialog";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { Pencil, PlusCircle, Search, X } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import React from "react";
import { CreateCourseDialog } from "@/components/create-course-dialog";
import { useRouter, useSearchParams } from "next/navigation";
import { OnboardingSuccessDialog } from "@/components/onboarding-success-dialog";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  useCourses,
  useJoinCourse,
  useJoinedCourses,
  useLeaveCourse,
  useSelectedCourse,
  useSetSelectedCourse,
} from "@/hooks/api/courses";
import { ICourse } from "@/features/courses/course.model";

export function CoursesPageContent() {
  const searchInputRef = React.useRef<HTMLInputElement>(null);
  
  const [isCreateCourseDialogOpen, setCreateCourseDialogOpen] = React.useState(
    false,
  );
  const [isOnboardingSuccessDialogOpen, setOnboardingSuccessDialogOpen] = React
    .useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: courses, isLoading, error } = useCourses();
  const { data: joinedCourses = [], isLoading: isJoinedCoursesLoading } =
    useJoinedCourses();
  const { data: selectedCourse } = useSelectedCourse();
  const joinCourseMutation = useJoinCourse();
  const leaveCourseMutation = useLeaveCourse();
  const setSelectedCourseMutation = useSetSelectedCourse();

  
  // Auto-focus the search input when component mounts
  React.useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);
  
  React.useEffect(() => {
    if (searchParams.get("onboarding") === "success") {
      setOnboardingSuccessDialogOpen(true);
    }
  }, [courses, searchParams]);

  const handleOnboardingSuccessDialogChange = (open: boolean) => {
    if (!open && isOnboardingSuccessDialogOpen) {
      toast(
        "Get started by adding your courses, creating a chat, and asking a question.",
        {
          title: "Welcome to StudySpot!",
          icon: <Pencil className="h-4 w-4" />,
          duration: Infinity,
        } as any,
      );
    }
    setOnboardingSuccessDialogOpen(open);
  };

  const handleJoinCourse = (course: ICourse) => {
    joinCourseMutation.mutate({ courseId: course.id, courseData: course }, {
      onSuccess: () => {
        toast.success(`Successfully joined ${course.code}`);
      },
      onError: (error: any) => {
        toast.error(error.message || "Failed to join course");
      },
    });
  };

  const handleEnterCourse = (course: ICourse) => {
    // If this course is already selected, navigate to home
    if (selectedCourse?.id === course.id) {
      router.push("/");
      return;
    }
    
    // Navigate immediately for instant feel (optimistic navigation)
    router.push("/");
    
    // Update course selection in background with optimistic update
    setSelectedCourseMutation.mutate(course, {
      onError: (error: any) => {
        toast.error(error.message || "Failed to select course");
        // The optimistic update will be rolled back automatically by React Query
      },
    });
  };

  const handleLeaveCourse = (courseId: string) => {
    leaveCourseMutation.mutate(courseId, {
      onSuccess: () => {
        toast.success("Successfully left course");
      },
      onError: (error: any) => {
        toast.error(error.message || "Failed to leave course");
      },
    });
  };

  return (
    <>
      <div className="mx-auto w-full max-w-3xl h-full flex flex-col p-6 gap-4 @container">
        <h2 className="text-3xl font-crimson-text leading-none">
          Find your courses
        </h2>
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[250px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              ref={searchInputRef}
              type="search"
              placeholder="Search for courses..."
              className="w-full rounded-lg bg-background pl-8"
            />
          </div>
          <div className="flex items-center gap-4">
            <p className="text-sm text-muted-foreground">
              Can&apos;t find your course?
            </p>
            <Button
              className="gap-2"
              variant="secondary"
              onClick={() => setCreateCourseDialogOpen(true)}
            >
              <PlusCircle className="h-4 w-4" />
              Create Course
            </Button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
          {isLoading
            ? (
              <div className="flex items-center justify-center h-32">
                <p className="text-muted-foreground">Loading courses...</p>
              </div>
            )
            : error
            ? (
              <div className="flex items-center justify-center h-32">
                <p className="text-red-600">
                  Error loading courses. Please try again.
                </p>
              </div>
            )
            : courses?.length === 0
            ? (
              <div className="flex items-center justify-center h-32">
                <p className="text-muted-foreground">
                  No courses found. Create your first course!
                </p>
              </div>
            )
            : (
              <div className="grid gap-4 @md:grid-cols-2 @lg:grid-cols-3">
                {courses?.map((course, i) => {
                  const isJoined = !isJoinedCoursesLoading &&
                    joinedCourses.includes(course.id);
                  const isJoinedLoading = isJoinedCoursesLoading;
                  return (
                    <Card key={i} className="flex flex-col">
                      <CardHeader className="flex-1">
                        <div className="flex items-start gap-4">
                          {/*<course.icon className="h-6 w-6 text-muted-foreground mt-1" />*/}
                          <div className="flex-1">
                            <CardTitle>{course.code}</CardTitle>
                            <CardDescription className="mt-1">
                              {course.title}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardFooter>
                        {isJoinedLoading
                          ? (
                            <Button
                              variant="secondary"
                              className="w-full"
                              disabled
                            >
                              Loading...
                            </Button>
                          )
                          : isJoined
                          ? (
                            <div className="flex gap-2 w-full">
                              <Button 
                                variant="secondary" 
                                className="w-full flex-1"
                                onClick={() => handleEnterCourse(course)}
                              >
                                Enter Course
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <X className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      Leave course?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      You can always rejoin this course later.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>
                                      Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() =>
                                        handleLeaveCourse(course.id)}
                                      disabled={leaveCourseMutation.isPending &&
                                        leaveCourseMutation.variables ===
                                          course.id}
                                    >
                                      {leaveCourseMutation.isPending &&
                                          leaveCourseMutation.variables ===
                                            course.id
                                        ? "Leaving..."
                                        : "Continue"}
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          )
                          : (
                            <Button
                              variant="primary"
                              className="w-full gap-2"
                              onClick={() => handleJoinCourse(course)}
                              disabled={joinCourseMutation.isPending &&
                                joinCourseMutation.variables?.courseId === course.id}
                            >
                              <PlusCircle className="h-4 w-4" />
                              {joinCourseMutation.isPending &&
                                  joinCourseMutation.variables?.courseId === course.id
                                ? "Joining..."
                                : "Join Course"}
                            </Button>
                          )}
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            )}
        </div>
        <CreateCourseDialog
          open={isCreateCourseDialogOpen}
          onOpenChange={setCreateCourseDialogOpen}
        />
        <OnboardingSuccessDialog
          open={isOnboardingSuccessDialogOpen}
          onOpenChange={handleOnboardingSuccessDialogChange}
        />
      </div>
    </>
  );
}
