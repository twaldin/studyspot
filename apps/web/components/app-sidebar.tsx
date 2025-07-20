"use client";

import {
  Box,
  FlaskConical,
  Music,
  Pencil,
  Plus,
  PlusCircle,
  Radical,
} from "lucide-react";
import StudySpotLogo from "@/components/branding/studyspot-logo";
import Image from "next/image";
import Link from "next/link";
import {
  useCourses,
  useJoinedCourses,
  useSelectedCourse,
} from "@/hooks/api/courses";
import { useUserSchool } from "@/hooks/api/user";
import { ICourse } from "@/features/courses/course.model";
import { JoinedCourseList } from "@/features/courses/components/joined-course-list";
import toast from "react-hot-toast";
import {
  useChats,
  usePreloadChat,
  useSelectChatAndNavigate,
  useSelectChatCourse,
} from "@/hooks/api/chats";
import { useAuthenticatedUser } from "@/hooks/api/base";
import { useCreateChat } from "@/hooks/api/chats";
import { useChatNavigation } from "@/features/chat/ChatNavigationContext";
import { useStreamingChats } from "@/features/chat/PendingChatContext";
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
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import React from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { UserButton } from "@/components/user-button";
import { SettingsButton } from "@/components/settings-button";

// Custom hook to handle mobile sidebar closing
const useMobileSidebarClose = () => {
  const { isMobile, setOpenMobile } = useSidebar();

  const closeMobileIfOpen = React.useCallback(() => {
    if (isMobile) {
      setOpenMobile(false);
    }
  }, [isMobile, setOpenMobile]);

  return { closeMobileIfOpen };
};

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
  const { data: userSchool } = useUserSchool();
  const router = useRouter();

  // Chat functionality
  const {
    data: chats = [],
    isLoading: isLoadingChats,
    error: chatsError,
    refetch: refetchChats,
  } = useChats();
  const selectChatCourseMutation = useSelectChatCourse();
  const selectChatAndNavigateMutation = useSelectChatAndNavigate();
  const preloadChat = usePreloadChat();
  const { handleChatSelect, handleNewChat, handleDeleteChat } =
    useChatNavigation();
  const { streamingChats, isStreaming } = useStreamingChats();
  const pathname = usePathname();
  const hasJoinedCourses = joinedCourseIds && joinedCourseIds.length > 0;

  // Debug logging
  React.useEffect(() => {
    console.log('Sidebar: streaming chats updated:', streamingChats);
  }, [streamingChats]);

  // Get pending chats for backward compatibility
  const pendingChats = streamingChats.filter(chat => chat.isStreaming);

  // Refresh chats when joined courses change
  const joinedCoursesString = React.useMemo(
    () => joinedCourseIds?.join(",") || "",
    [joinedCourseIds],
  );

  React.useEffect(() => {
    if (joinedCoursesString) {
      refetchChats();
    }
  }, [joinedCoursesString, refetchChats]);

  // Mobile sidebar close functionality
  const { closeMobileIfOpen } = useMobileSidebarClose();

  // Filter courses to only show joined ones
  const joinedCourses = allCourses.filter((course) =>
    joinedCourseIds.includes(course.id)
  );

  // Get selected chat ID from URL for UI highlighting
  const selectedChatId = pathname.startsWith("/chat/")
    ? pathname.split("/")[2]
    : null;

  const onChatSelect = (chatId: string) => {
    // Navigate immediately for instant feel (optimistic navigation)
    handleChatSelect(chatId);
    
    // Close mobile sidebar immediately
    closeMobileIfOpen();

    // Update course selection in background with optimistic update
    selectChatAndNavigateMutation.mutate(chatId, {
      onError: (error) => {
        console.error("Failed to select chat course:", error);
        toast.error("Failed to update course selection");
        // The optimistic update will be rolled back automatically by React Query
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
    // Close mobile sidebar after navigation
    closeMobileIfOpen();
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
                width={48}
                height={48}
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
          className="w-full justify-start gap-2 group-data-[collapsible=icon]:w-fit group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:self-center"
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
                onAddMoreClick={closeMobileIfOpen}
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

              {!isLoadingChats && !chatsError && chats.length === 0 && pendingChats.length === 0 && (
                <div className="px-2 py-1 text-sm text-muted-foreground">
                  No chats yet. Start a new conversation!
                </div>
              )}

              {/* Render pending chats first - only show chats that don't exist in regular chats */}
              {pendingChats
                .filter(pendingChat => !chats.some(chat => chat.id === pendingChat.chatId))
                .map((pendingChat) => (
                <SidebarMenuItem
                  key={`pending-${pendingChat.chatId}`}
                  className="group-data-[collapsible=icon]:hidden"
                >
                  <SidebarMenuButton
                    asChild
                    className="group-data-[collapsible=icon]:justify-center"
                    isActive={selectedChatId === pendingChat.chatId}
                  >
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        onChatSelect(pendingChat.chatId);
                      }}
                    >
                      <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
                      <span className="group-data-[collapsible=icon]:hidden truncate min-w-0">
                        {pendingChat.title}
                      </span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

              {/* Render actual chats */}
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
                      {isStreaming(chat.id) ? (
                        <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
                      ) : (
                        <FlaskConical className="h-4 w-4 shrink-0" />
                      )}
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
          <SettingsButton variant="sidebar" />
          <UserButton variant="sidebar" />
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
