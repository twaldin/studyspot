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
import { ICourse } from "@/features/courses/course.model";
import { JoinedCourseList } from "@/features/courses/components/joined-course-list";
import toast from "react-hot-toast";
import { useChats, useSelectChatCourse } from "@/hooks/api/chats";
import { useChatNavigation } from "@/features/chat/ChatNavigationContext";
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
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

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

  // Chat functionality
  const { data: chats = [], isLoading: isLoadingChats, error: chatsError } = useChats();
  const selectChatCourseMutation = useSelectChatCourse();
  const { handleChatSelect, handleNewChat, handleDeleteChat } = useChatNavigation();
  const pathname = usePathname();

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
    // First select the course for this chat, then navigate
    selectChatCourseMutation.mutate(chatId, {
      onSuccess: () => {
        handleChatSelect(chatId);
      },
      onError: (error) => {
        console.error("Failed to select chat course:", error);
        // Navigate anyway, even if course selection fails
        handleChatSelect(chatId);
      },
    });
  };

  const onDeleteChat = handleDeleteChat;

  const onNewChatClick = () => {
    handleNewChat();
  };
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="flex flex-col gap-4 border-b border-sidebar-border p-4">
        <div className="flex items-center justify-start gap-4 group-data-[collapsible=icon]:justify-center">
          <div className="relative h-12 w-auto shrink-0">
            <Image
              src="/uw-madison-logo.png"
              alt="UW Madison Logo"
              width={48}
              height={48}
              className="h-12 w-auto object-contain"
            />
          </div>
          <Separator
            orientation="vertical"
            className="h-8 group-data-[collapsible=icon]:hidden"
          />
          <StudySpotLogo className="h-10 w-auto group-data-[collapsible=icon]:hidden" />
        </div>
        <Link href="/" className="group-data-[collapsible=icon]:self-center">
          <Button
            className="w-full justify-start gap-2 group-data-[collapsible=icon]:w-fit group-data-[collapsible=icon]:justify-center"
            variant="secondary"
          >
            <Plus className="h-4 w-4" />
            <span className="group-data-[collapsible=icon]:hidden">
              New Chat
            </span>
          </Button>
        </Link>
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
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <FlaskConical className="h-4 w-4 shrink-0" />
                        <span className="group-data-[collapsible=icon]:hidden truncate min-w-0">
                          {chat.title}
                        </span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteChat(chat.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity shrink-0 ml-2"
                        aria-label="Delete chat"
                      >
                        ×
                      </button>
                    </a>
                  </SidebarMenuButton>
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
              asChild
              className="group-data-[collapsible=icon]:justify-center"
            >
              <a href="#" className="flex items-center gap-2">
                <Settings className="h-4 w-4 shrink-0" />
                <span className="group-data-[collapsible=icon]:hidden">
                  Settings
                </span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="group-data-[collapsible=icon]:justify-center"
            >
              <a href="#" className="flex items-center gap-2">
                <User className="h-4 w-4 shrink-0" />
                <span className="group-data-[collapsible=icon]:hidden">
                  Reed Grenager
                </span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

