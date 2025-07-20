"use client";

import React from "react";
import { FlaskConical, Loader2, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useStreamingChats } from "@/features/chat/PendingChatContext";

export interface ChatSummary {
  id: string;
  title: string;
  created_at: string;
  course_id: string;
}

interface ChatListProps {
  chats: ChatSummary[];
  isLoading: boolean;
  error: any;
  onChatSelect: (chatId: string) => void;
  onChatHover: (chatId: string) => void;
  onDeleteChat: (chatId: string) => void;
}

export function ChatList({
  chats,
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

  // Get pending chats that are currently streaming
  const pendingChats = streamingChats.filter(chat => chat.isStreaming);

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

      {!isLoading && !error && chats.length === 0 && pendingChats.length === 0 && (
        <div className="px-2 py-1 text-sm text-muted-foreground">
          No chats yet. Start a new conversation!
        </div>
      )}

      {/* Render pending/temporary chats first - only show chats that don't exist in regular chats */}
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
  );
}