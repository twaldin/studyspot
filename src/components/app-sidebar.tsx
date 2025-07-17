"use client";

import {
  Box,
  FlaskConical,
  Music,
  Pencil,
  Plus,
  PlusCircle,
  Radical,
  Settings,
  User,
  X,
} from "lucide-react";
import StudySpotLogo from "@/components/branding/studyspot-logo";
import Image from "next/image";
import Link from "next/link";
import {
  useCourses,
  useJoinedCourses,
  useSelectedCourse,
  useSetSelectedCourse,
} from "@/hooks/api/courses";
import { useUserSchool } from "@/hooks/api/user";
import { ICourse } from "@/features/courses/course.model";
import { JoinedCourseList } from "@/features/courses/components/joined-course-list";
import toast from "react-hot-toast";
import { useChats, useSelectChatCourse, usePreloadChat, useSelectChatAndNavigate } from "@/hooks/api/chats";
import { useAuthenticatedUser } from "@/hooks/api/base";
import { useCreateChat } from "@/hooks/api/chats";
import { useChatNavigation } from "@/features/chat/ChatNavigationContext";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { usePathname } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import React from "react";
import { useClerk, useUser } from "@clerk/nextjs";
import { useRemoveSchool } from "@/hooks/api";
import { useRouter } from "next/navigation";
import logger from "@/lib/logger";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Menu items.
const items = [
  {
    title: "Reaction Mechanisms & Synthesis Problems",
    url: "#",
    icon: FlaskConical,
  },
  {
    title: "Integration by Parts Practice",
    url: "#",
    icon: Radical,
  },
  {
    title: "Series Convergence Tests",
    url: "#",
    icon: Radical,
  },
  {
    title: "Persuasive Essay Structure & Thesis Development",
    url: "#",
    icon: Pencil,
  },
  {
    title: "Bebop vs. Cool Jazz Comparison",
    url: "#",
    icon: Music,
  },
];

export function AppSidebar() {
  // React Query hooks for course data
  const { data: allCourses = [] } = useCourses();
  const { data: joinedCourseIds = [] } = useJoinedCourses();
  const { data: selectedCourse } = useSelectedCourse();
  const setSelectedCourseMutation = useSetSelectedCourse();
  const { data: userSchool } = useUserSchool();
  const { openUserProfile, signOut } = useClerk();
  const removeSchoolMutation = useRemoveSchool();
  const router = useRouter();
  const { user } = useUser();

  // Chat functionality
  const { data: chats = [], isLoading: isLoadingChats, error: chatsError } = useChats();
  const selectChatCourseMutation = useSelectChatCourse();
  const selectChatAndNavigateMutation = useSelectChatAndNavigate();
  const preloadChat = usePreloadChat();
  const { handleChatSelect, handleNewChat, handleDeleteChat } = useChatNavigation();
  const pathname = usePathname();
  const hasJoinedCourses = joinedCourseIds && joinedCourseIds.length > 0;

  // Filter courses to only show joined ones
  const joinedCourses = allCourses.filter((course) =>
    joinedCourseIds.includes(course.id)
  );

  const handleCourseSelect = (course: ICourse) => {
    setSelectedCourseMutation.mutate(course, {
      onError: (error: any) => {
        toast.error(error.message || "Failed to select course");
      },
    });
  };

  // Get selected chat ID from URL for UI highlighting
  const selectedChatId = pathname.startsWith("/chat/")
    ? pathname.split("/")[2]
    : null;

  const onChatSelect = (chatId: string) => {
    // Navigate immediately for instant feel
    handleChatSelect(chatId);
    
    // Update course selection in background
    selectChatAndNavigateMutation.mutate(chatId, {
      onError: (error) => {
        console.error("Failed to select chat course:", error);
        // User has already navigated, so just log the error
      },
    });
  };

  const onChatHover = (chatId: string) => {
    // Preload chat data on hover for faster perceived loading
    preloadChat(chatId);
  };

  const onDeleteChat = (chatId: string) => {
    handleDeleteChat(chatId);
  };

  const onNewChatClick = () => {
    if (!hasJoinedCourses) {
      toast.error("You must join a course before starting a new chat.");
      return;
    }
    if (!selectedCourse) {
      toast.error("You must select a course before starting a new chat.");
      router.push("/courses");
      return;
    }
    handleNewChat();
  };

  const handleSignOut = () => {
    signOut();
  };

  const handleManageAccount = () => {
    openUserProfile();
  };

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
    <Sidebar collapsible="icon">
      <SidebarHeader className="flex flex-col gap-4 border-b border-sidebar-border p-4">
        <div className="flex items-center justify-start gap-4 group-data-[collapsible=icon]:justify-center">
          {userSchool?.logo_url && (
            <>
              <Image
                src={userSchool.logo_url}
                alt={`${userSchool.name} Logo`}
                width={52}
                height={52}
                className="mr-2 object-contain rounded-lg"
                onError={(e) => {
                  // Hide the image if it fails to load
                  e.currentTarget.style.display = "none";
                }}
              />
              <Separator
                orientation="vertical"
                className="h-8 group-data-[collapsible=icon]:hidden"
              />
            </>
          )}
          <StudySpotLogo className="h-10 w-auto group-data-[collapsible=icon]:hidden" />
        </div>
        <Button
          className="w-full justify-start gap-2 group-data-[collapsible=icon]:w-fit group-data-[collapsible=icon]:justify-center"
          variant="secondary"
          onClick={onNewChatClick}
        >
          <Plus className="h-4 w-4" />
          <span className="group-data-[collapsible=icon]:hidden">
            New Chat
          </span>
        </Button>
      </SidebarHeader>
      <SidebarContent>
        {/* My Courses section - only show when right sidebar is collapsed (on screens smaller than lg) */}
        <SidebarGroup className="lg:hidden">
          <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">
            My Courses
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="flex flex-col gap-1 items-start">
              <JoinedCourseList
                courses={joinedCourses}
                selectedCourseId={selectedCourse?.id}
                onCourseSelect={handleCourseSelect}
                isLoading={setSelectedCourseMutation.isPending}
              />
            </div>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">
            Past Chats
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {isLoadingChats && (
                <div className="px-2 py-1 text-sm text-muted-foreground">
                  Loading chats...
                </div>
              )}
              
              {chatsError && (
                <div className="px-2 py-1 text-sm text-destructive">
                  Failed to load chats
                </div>
              )}
              
              {!isLoadingChats && !chatsError && chats.length === 0 && (
                <div className="px-2 py-1 text-sm text-muted-foreground">
                  No chats yet. Start a new conversation!
                </div>
              )}
              
              {chats.map((chat) => (
                <SidebarMenuItem
                  key={chat.id}
                  className="group-data-[collapsible=icon]:hidden"
                >
                  <SidebarMenuButton
                    asChild
                    className="group-data-[collapsible=icon]:justify-center"
                    isActive={selectedChatId === chat.id}
                  >
                    <a 
                      href="#" 
                      onClick={(e) => {
                        e.preventDefault();
                        onChatSelect(chat.id);
                      }}
                      onMouseEnter={() => onChatHover(chat.id)}
                    >
                      <FlaskConical className="h-4 w-4 shrink-0" />
                      <span className="group-data-[collapsible=icon]:hidden truncate min-w-0">
                        {chat.title}
                      </span>
                    </a>
                  </SidebarMenuButton>
                  <SidebarMenuAction
                    showOnHover
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      onDeleteChat(chat.id);
                    }}
                    aria-label="Delete chat"
                    className={cn(
                      "cursor-pointer opacity-0 group-hover/menu-item:opacity-100",
                      selectedChatId === chat.id && "!opacity-0",
                    )}
                  >
                    <X className="h-3 w-3" />
                  </SidebarMenuAction>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer with settings and user options - only show when right sidebar is collapsed */}
      <SidebarFooter className="border-t border-sidebar-border p-2 lg:hidden">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleManageAccount}
              className="group-data-[collapsible=icon]:justify-center"
            >
              <Settings className="h-4 w-4 shrink-0" />
              <span className="group-data-[collapsible=icon]:hidden">
                Settings
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className="group-data-[collapsible=icon]:justify-center w-full"
                >
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 shrink-0" />
                    <span className="group-data-[collapsible=icon]:hidden">
                      {user?.fullName || ''}
                    </span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48 mb-2" side="top" align="start">
              <DropdownMenuItem onClick={handleManageAccount}>
                Manage Account
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleRemoveSchool}>
                Change Schools
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>Sign Out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

