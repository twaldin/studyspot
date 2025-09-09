'use client';

import { usePathname } from 'next/navigation';
import { AppSidebar } from "@/components/app-sidebar";
import { AppRightSidebar } from "@/components/app-right-sidebar";
import { DynamicBreadcrumb } from "@/components/dynamic-breadcrumb";
import { Separator } from "@studyspot/ui/components/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { CommandPalette } from "@/components/command-palette";
import { ChatNavigationProvider } from "@/features/chat/ChatNavigationContext";
import { PendingChatProvider } from "@/features/chat/PendingChatContext";
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@studyspot/ui/components/button';
import { Menu } from 'lucide-react';
import { useChat } from '@/hooks/api/chats';
import { useParams } from 'next/navigation';

// Define routes that should NOT have the sidebar layout
const NO_SIDEBAR_ROUTES = ["/sign-in", "/sign-up", "/onboarding", "/post", "/terms"];

import type { ReactNode } from 'react';

function AppHeader() {
  const isMobile = useIsMobile();
  const { setOpenMobile } = useSidebar();
  const params = useParams();
  const chatId = Array.isArray(params?.chatId)
    ? params.chatId[0]
    : params?.chatId;
  const { data: chat } = useChat(chatId);
  const pathname = usePathname();
  const isChatPage = pathname.startsWith('/chat/');

  if (isMobile) {
    return (
      <header className="flex h-16 items-center justify-between gap-4 px-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setOpenMobile(true)}
          className="cursor-pointer -ml-1"
        >
          <Menu className="h-6 w-6" />
        </Button>
        <h1 className="text-lg font-semibold">
          {isChatPage ? chat?.title || "Chat" : <DynamicBreadcrumb />}
        </h1>
        {/* Placeholder for potential actions */}
        <div className="w-6" />
      </header>
    );
  }

  return (
    <header className="flex h-16 items-center gap-4 px-6">
      <SidebarTrigger className="cursor-pointer -ml-1" />
      <Separator
        orientation="vertical"
        className="mr-2 data-[orientation=vertical]:h-4"
      />
      <DynamicBreadcrumb />
      <p className="hidden text-sm text-muted-foreground lg:block">
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span className="text-xs">⌘</span>K
        </kbd>
      </p>
    </header>
  );
}

export function ConditionalLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  
  // Check if current route should have sidebar
  const shouldShowSidebar = !NO_SIDEBAR_ROUTES.some(route => 
    pathname.startsWith(route)
  );

  // If no sidebar needed, return children directly
  if (!shouldShowSidebar) {
    return <>{children}</>;
  }

  // Otherwise, render the full app layout with sidebar
  return (
    <div className="flex w-full">
      <ChatNavigationProvider>
        <PendingChatProvider>
          <SidebarProvider>
            <CommandPalette />
            <AppSidebar />
            <SidebarInset>
              <AppHeader />
              <main className="h-[calc(100vh-4rem)] overflow-y-auto scrollbar-hidden">{children}</main>
            </SidebarInset>
          </SidebarProvider>
          <AppRightSidebar />
        </PendingChatProvider>
      </ChatNavigationProvider>
    </div>
  );
}