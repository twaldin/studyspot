import { AppSidebar } from "@/components/app-sidebar"
import { AppRightSidebar } from "@/components/app-right-sidebar"
import { DynamicBreadcrumb } from "@/components/dynamic-breadcrumb"
import { Separator } from "@workspace/ui/components/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@workspace/ui/components/sidebar"
import { CommandPalette } from "@/components/command-palette";
import { ChatNavigationProvider } from "@/features/chat/ChatNavigationContext";
import { PendingChatProvider } from "@/features/chat/PendingChatContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex w-full">
      <ChatNavigationProvider>
        <PendingChatProvider>
          <SidebarProvider>
          <CommandPalette />
          <AppSidebar />
        <SidebarInset>
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
          <main className="h-[calc(100vh-4rem)] overflow-y-auto">{children}</main>
        </SidebarInset>
          </SidebarProvider>
          <AppRightSidebar />
        </PendingChatProvider>
      </ChatNavigationProvider>
    </div>
  );
}
