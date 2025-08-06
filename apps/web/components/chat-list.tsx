"use client";

import React from "react";
import { Loader2, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useStreamingChats } from "@/features/chat/PendingChatContext";
import { getCourseIcon } from "@/lib/utils/course-icons";
import { ICourse } from "@/features/courses/course.model";

export interface ChatSummary {
  id: string;
  title: string;
  created_at: string;
  course_id: string;
}

interface ChatListProps {
  chats: ChatSummary[];
  courses?: ICourse[];
  isLoading: boolean;
  error: any;
  onChatSelect: (chatId: string) => void;
  onChatHover: (chatId: string) => void;
  onDeleteChat: (chatId: string) => void;
}

export function ChatList({
  chats,
  courses,
  isLoading,
  error,
  onChatSelect,
  onChatHover,
  onDeleteChat,
}: ChatListProps) {
  const pathname = usePathname();
  const { streamingChats, isStreaming } = useStreamingChats();

  // Get selected chat ID from URL for UI highlighting
  const selectedChatId = pathname.startsWith("/chat/")
    ? pathname.split("/")[2]
    : null;

  // Get streaming chats that are currently active
  const activeStreamingChats = streamingChats.filter(chat => chat.isStreaming);
  const streamingChatIds = new Set(activeStreamingChats.map(chat => chat.chatId));
  
  // Get temporary chats that don't exist in the actual chat list yet (e.g., during creation)
  const temporaryChats = activeStreamingChats.filter(streamingChat => 
    !chats.some(chat => chat.id === streamingChat.chatId)
  );

  return (
    <SidebarMenu>
      {isLoading && (
        <div className="px-2 py-1 text-sm text-muted-foreground">
          Loading chats...
        </div>
      )}

      {error && (
        <div className="px-2 py-1 text-sm text-destructive">
          Failed to load chats
        </div>
      )}

      {!isLoading && !error && chats.length === 0 && streamingChatIds.size === 0 && (
        <div className="px-2 py-1 text-sm text-muted-foreground">
          No chats yet. Start a new conversation!
        </div>
      )}

      {/* Render temporary chats first (e.g., during creation) */}
      {temporaryChats.map((tempChat) => (
        <SidebarMenuItem
          key={`temp-${tempChat.chatId}`}
          className="group-data-[collapsible=icon]:hidden"
        >
          <SidebarMenuButton
            asChild
            className="group-data-[collapsible=icon]:justify-center"
            isActive={selectedChatId === tempChat.chatId}
          >
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                // Don't navigate to temporary chats, they're just for visual feedback
              }}
            >
              <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
              <span className="group-data-[collapsible=icon]:hidden truncate min-w-0">
                {tempChat.title}
              </span>
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}

      {/* Render actual chats */}
      {chats.map((chat) => {
        // Find the course for this chat to get its icon
        const course = courses?.find(c => c.id === chat.course_id);
        const IconComponent = getCourseIcon(course?.icon);
        
        return (
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
                {streamingChatIds.has(chat.id) ? (
                  <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
                ) : (
                  <IconComponent className="h-4 w-4 shrink-0" />
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
            className="cursor-pointer opacity-0 group-hover/menu-item:opacity-100"
          >
            <X className="h-3 w-3" />
          </SidebarMenuAction>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}