import type { Metadata } from "next";
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
    <html lang="en">
      <body className="flex">
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              />
              <Breadcrumb className="min-w-0 flex-1">
                <BreadcrumbList className="flex-nowrap break-normal">
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="#" className="flex items-center gap-2">
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
            </header>
            <main>{children}</main>
          </SidebarInset>
        </SidebarProvider>
        <AppRightSidebar />
      </body>
    </html>
  );
}
