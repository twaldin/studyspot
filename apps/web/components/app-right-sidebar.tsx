"use client";

import * as React from "react";
import {
  CheckCircle,
  Info,
  LoaderCircle,
  PartyPopper,
  X,
  XCircle,
} from "lucide-react";
import { Button } from "@studyspot/ui/components/button";
import { Alert, AlertDescription, AlertTitle } from "@studyspot/ui/components/alert";
import toast, { useToaster } from "react-hot-toast";
import { useUser } from "@clerk/nextjs";
import {
  useCourses,
  useJoinedCourses,
  useSelectedCourse,
} from "@/hooks/api/courses";
import { JoinedCourseList } from "@/features/courses/components/joined-course-list";
import { usePathname } from "next/navigation";
import { useIsMobile } from "@/hooks/use-mobile";
import { UserButton } from "@/components/user-button";
import { DarkModeButton } from "@/components/dark-mode-button";
import { CanvasSyncDialog } from "./canvas-sync-dialog";

function CustomToaster() {
  const { toasts, handlers } = useToaster();
  const { startPause, endPause, calculateOffset, updateHeight } = handlers;
  const isMobile = useIsMobile();

  return (
    <div
      className={
        isMobile
          ? "fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-80 max-w-[calc(100vw-2rem)] px-4"
          : "fixed bottom-4 right-4 z-50 w-64 px-4"
      }
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
  const pathname = usePathname();
  const { user } = useUser();
  const [isSyncDialogOpen, setIsSyncDialogOpen] = React.useState(false);

  // React Query hooks for course data
  const { data: allCourses = [] } = useCourses();
  const { data: joinedCourseIds = [] } = useJoinedCourses();
  const { data: selectedCourse } = useSelectedCourse();

  // Filter courses to only show joined ones
  const joinedCourses = allCourses.filter((course) =>
    joinedCourseIds.includes(course.id),
  );

  // Track course changes to provide feedback when course switches due to chat selection
  const prevSelectedCourse = React.useRef<string | undefined>(
    selectedCourse?.id,
  );
  React.useEffect(() => {
    const isInChat = pathname.startsWith("/chat/");

    // If course changed while in a chat (likely due to chat selection), show feedback
    if (
      isInChat &&
      selectedCourse &&
      prevSelectedCourse.current &&
      selectedCourse.id !== prevSelectedCourse.current
    ) {
      toast.success(
        `Switched to ${selectedCourse.title || selectedCourse.code}`,
        {
          duration: 3000,
        },
      );
    }

    prevSelectedCourse.current = selectedCourse?.id;
  }, [selectedCourse, pathname]);

  


  return (
    <>
      <div className="hidden lg:flex flex-col w-72 border-l border-sidebar-border">
        <div className="border-b border-sidebar-border flex flex-col gap-4 p-4">
          <div className="flex items-center justify-end gap-2">
            <DarkModeButton variant="right-sidebar" />
            <UserButton variant="right-sidebar" />
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
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button variant="outline" onClick={() => setIsSyncDialogOpen(true)}>
              Sync with Canvas
            </Button>
          </div>
        </div>
        <div className="flex-1">
          {/* Placeholder for future content */}
        </div>
      </div>
      <CanvasSyncDialog open={isSyncDialogOpen} onOpenChange={setIsSyncDialogOpen} />
      <CustomToaster />
    </>
  );
}
