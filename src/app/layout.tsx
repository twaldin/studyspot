"use client";

import type { Metadata } from "next";
import { Crimson_Text } from "next/font/google";
import "./globals.css";
import { Home } from "lucide-react"
import { AppSidebar } from "@/components/app-sidebar"
import { AppRightSidebar } from "@/components/app-right-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { CommandPalette } from "@/components/command-palette";
import { ThemeProvider } from "@/components/theme-provider";
import { ClerkProvider } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

const crimsonText = Crimson_Text({
  weight: ["400", "600", "700"],
  variable: "--font-crimson-text",
  subsets: ["latin"],
});

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  
  const authRoutes = ['/sign-in', '/sign-up', '/onboarding'];
  const isAuthRoute = authRoutes.includes(pathname);

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("flex", crimsonText.variable)}>
        <ClerkProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {isAuthRoute ? (
              // Render only the children for auth routes
              <main className="w-full h-screen">{children}</main>
            ) : (
              // Render full layout for all other routes
              <SidebarProvider>
                <CommandPalette />
                <AppSidebar />
                <SidebarInset>
                  <header className="flex h-16 items-center gap-4 px-6">
                    <SidebarTrigger className="-ml-1" />
                    <Separator
                      orientation="vertical"
                      className="mr-2 data-[orientation=vertical]:h-4"
                    />
                    <Breadcrumb className="min-w-0 flex-1">
                      <BreadcrumbList className="flex-nowrap break-normal">
                        <BreadcrumbItem className="hidden md:block">
                          <BreadcrumbLink href="#" className="flex items-center gap-2 whitespace-nowrap">
                            <Home className="h-4 w-4" />
                            CHEM 103
                          </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator className="hidden md:block" />
                        <BreadcrumbItem className="min-w-0">
                          <BreadcrumbPage className="truncate">
                            Reaction Mechanisms & Synthesis Problems
                          </BreadcrumbPage>
                        </BreadcrumbItem>
                      </BreadcrumbList>
                    </Breadcrumb>
                    <p className="hidden text-sm text-muted-foreground md:block">
                      <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                        <span className="text-xs">⌘</span>K
                      </kbd>
                    </p>
                  </header>
                  <main className="h-[calc(100vh-4rem)]">{children}</main>
                </SidebarInset>
                <AppRightSidebar />
              </SidebarProvider>
            )}
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}