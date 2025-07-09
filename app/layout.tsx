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
import { cn } from "@/lib/utils";

const crimsonText = Crimson_Text({
  weight: ["400", "600", "700"],
  variable: "--font-crimson-text",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "StudySpot UI",
  description: "StudySpot UI Testing Environment",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("flex", crimsonText.variable)}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
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
                    <BreadcrumbItem className="hidden lg:block">
                      <BreadcrumbLink href="/" className="flex items-center gap-2 whitespace-nowrap">
                        <Home className="h-4 w-4" />
                        CHEM 103
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden lg:block" />
                    <BreadcrumbItem className="min-w-0">
                      <BreadcrumbPage className="truncate">
                        Reaction Mechanisms & Synthesis Problems
                      </BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
                <p className="hidden text-sm text-muted-foreground lg:block">
                  <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                    <span className="text-xs">⌘</span>K
                  </kbd>
                </p>
              </header>
              <main className="h-[calc(100vh-4rem)]">{children}</main>
            </SidebarInset>
          </SidebarProvider>
          <AppRightSidebar />
        </ThemeProvider>
      </body>
    </html>
  );
}
