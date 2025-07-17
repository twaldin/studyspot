"use client"

import { Home } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useChat } from "@/hooks/api/chats"
import { useSelectedCourse } from "@/hooks/api/courses"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export function DynamicBreadcrumb() {
  const pathname = usePathname()
  const { data: selectedCourse } = useSelectedCourse()
  
  // Extract chatId from pathname if we're on a chat page
  const chatId = pathname.startsWith('/chat/') ? pathname.split('/chat/')[1] : undefined
  const { data: chat } = useChat(chatId)
  
  // Determine the current page title
  let currentPageTitle = "StudySpot"
  
  if (pathname === '/') {
    currentPageTitle = "New Chat"
  } else if (pathname === '/chat') {
    currentPageTitle = "New Chat"
  } else if (pathname.startsWith('/chat/') && chat) {
    currentPageTitle = chat.title
  } else if (pathname === '/content') {
    currentPageTitle = "Course Content"
  } else if (pathname === '/courses') {
    currentPageTitle = "My Courses"
  } else if (pathname === '/onboarding') {
    currentPageTitle = "Getting Started"
  }
  
  // Get course display name
  const courseDisplayName = selectedCourse ? 
    `${selectedCourse.code} - ${selectedCourse.title}` : 
    "Select a course"

  return (
    <Breadcrumb className="min-w-0 flex-1">
      <BreadcrumbList className="flex-nowrap break-normal">
        <BreadcrumbItem className="hidden lg:block">
          <BreadcrumbLink asChild>
            <Link
              href="/"
              className="flex items-center gap-2 whitespace-nowrap"
            >
              <Home className="h-4 w-4" />
              {selectedCourse?.code || "StudySpot"}
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator className="hidden lg:block" />
        <BreadcrumbItem className="min-w-0">
          <BreadcrumbPage className="truncate">
            {currentPageTitle}
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}