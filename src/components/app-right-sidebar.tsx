"use client";

import * as React from "react";
import {
  Box,
  CheckCircle,
  FlaskConical,
  Info,
  LoaderCircle,
  Music,
  PartyPopper,
  PlusCircle,
  Radical,
  Settings,
  User,
  X,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import toast, { useToaster } from "react-hot-toast";
import { useClerk, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useRemoveSchool } from "@/hooks/api";
import {
  useCourses,
  useJoinedCourses,
  useSelectedCourse,
  useSetSelectedCourse,
} from "@/hooks/api/courses";
import { ICourse } from "@/features/courses/course.model";
import { JoinedCourseList } from "@/features/courses/components/joined-course-list";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import logger from "@/lib/logger";
import { useRouter } from "next/navigation";


function CustomToaster() {
  const { toasts, handlers } = useToaster();
  const { startPause, endPause, calculateOffset, updateHeight } = handlers;

  return (
    <div
      className="fixed bottom-4 right-4 z-50 w-64 px-4"
      onMouseEnter={startPause}
      onMouseLeave={endPause}
    >
      {toasts.map((t) => {
        const offset = calculateOffset(t, {
          reverseOrder: false,
          gutter: 8,
        });

        const ref = (el: HTMLDivElement | null) => {
          if (el && typeof t.height !== "number") {
            const height = el.getBoundingClientRect().height;
            updateHeight(t.id, height);
          }
        };

        const getIcon = () => {
          if (t.icon) return t.icon;
          switch (t.type) {
            case "success":
              return <CheckCircle className="h-4 w-4" />;
            case "error":
              return <XCircle className="h-4 w-4" />;
            case "loading":
              return <LoaderCircle className="h-4 w-4 animate-spin" />;
            default:
              return <Info className="h-4 w-4" />;
          }
        };

        const getVariant = () => {
          return t.type === "error" ? "destructive" : "default";
        };

        return (
          <div
            key={t.id}
            ref={ref}
            className="relative"
            style={{
              position: "absolute",
              bottom: 0,
              right: 0,
              width: "100%",
              transition: "all 0.3s ease-out",
              opacity: t.visible ? 1 : 0,
              transform: `translateY(-${offset}px)`,
            }}
            {...t.ariaProps}
          >
            <Alert variant={getVariant()} className="pr-12">
              {getIcon()}
              <AlertTitle>
                {(t as any).title ||
                  (t.type === "loading" ? "Loading..." : "Notification")}
              </AlertTitle>
              <AlertDescription>
                {typeof t.message === "string" ? t.message : "Notification"}
              </AlertDescription>
              {t.type !== "loading" && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-2 h-6 w-6 p-0"
                  onClick={() => toast.dismiss(t.id)}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </Alert>
          </div>
        );
      })}
    </div>
  );
}

export function AppRightSidebar() {
  const { openUserProfile, signOut } = useClerk();
  const removeSchoolMutation = useRemoveSchool();
  const router = useRouter();

  // React Query hooks for course data
  const { data: allCourses = [] } = useCourses();
  const { data: joinedCourseIds = [] } = useJoinedCourses();
  const { data: selectedCourse } = useSelectedCourse();
  const setSelectedCourseMutation = useSetSelectedCourse();

  // Filter courses to only show joined ones
  const joinedCourses = allCourses.filter((course) =>
    joinedCourseIds.includes(course.id)
  );

  const handleSignOut = () => {
    signOut();
  };

  const handleManageAccount = () => {
    openUserProfile();
  };

  const handleCourseSelect = (course: ICourse) => {
    setSelectedCourseMutation.mutate(course, {
      onError: (error: any) => {
        toast.error(error.message || "Failed to select course");
      },
    });
  };
  const { user } = useUser();
  React.useEffect(() => {
    toast("We've just rolled out some exciting updates.", {
      id: "welcome-toast",
      title: "StudySpot v0.1.0",
      duration: Infinity,
      icon: <PartyPopper className="h-4 w-4" />,
    } as any);
  }, []);

  const handleRemoveSchool = async () => {
    if (removeSchoolMutation.isPending) return;

    // Confirm before removing school
    const confirmed = window.confirm(
      "Are you sure you want to remove your school selection? You will be redirected to select a new school. Your chats will be preserved and available when you return to this school.",
    );

    if (!confirmed) return;

    try {
      // Use React Query mutation to remove school - this will automatically clear all caches
      await removeSchoolMutation.mutateAsync();

      // Clear selected course using React Query mutation
      //await clearSelectedCourseMutation.mutateAsync();

      // Force refresh the user object to get updated metadata
      if (user) {
        await user.reload();
      }

      // Redirect to onboarding to select a new school
      router.push("/onboarding");
    } catch (error) {
      logger.error({ error }, "Error removing school");
      alert("Failed to remove school selection. Please try again.");
    }
  };

  return (
    <>
      <div className="hidden lg:flex flex-col w-72 border-l border-sidebar-border">
        <div className="border-b border-sidebar-border flex flex-col gap-4 p-4">
          <div className="flex items-center justify-end gap-2">
            <Button variant="secondary" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" className="gap-2">
                  <User className="h-4 w-4" />
                  {user?.fullName || ""}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={handleManageAccount}>
                  Manage Account
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleRemoveSchool}>
                  Change Schools
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="p-4 space-y-4">
          <div>
            <h4 className="mb-2 px-2 text-xs font-medium text-muted-foreground text-right">
              My Courses
            </h4>
            <div className="flex flex-col gap-1 items-end">
              <JoinedCourseList
                courses={joinedCourses}
                selectedCourseId={selectedCourse?.id}
                onCourseSelect={handleCourseSelect}
                isLoading={setSelectedCourseMutation.isPending}
              />
            </div>
          </div>
        </div>
        <div className="flex-1">
          {/* Placeholder for future content */}
        </div>
      </div>
      <CustomToaster />
    </>
  );
}
