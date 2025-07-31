"use client";

import { Home } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useChat } from "@/hooks/api/chats";
import { useFlashcardSet } from "@/hooks/api/flashcards";
import { useQuiz } from "@/hooks/api/quizzes";
import { useSelectedCourse } from "@/hooks/api/courses";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface BreadcrumbData {
  featureName: string;
  featureHref: string;
  itemTitle?: string;
}

export function DynamicBreadcrumb() {
  const pathname = usePathname();
  const { data: selectedCourse } = useSelectedCourse();

  // Extract IDs from different URL patterns
  const chatId = pathname.startsWith("/chat/") && pathname !== "/chat" && pathname !== "/chat/creating"
    ? pathname.split("/chat/")[1]?.split("?")[0] // Remove query parameters
    : undefined;
  
  const flashcardSetId = pathname.startsWith("/flashcards/") && pathname !== "/flashcards"
    ? pathname.split("/flashcards/")[1]
    : undefined;

  const quizId = pathname.startsWith("/quiz/") && pathname !== "/quiz"
    ? pathname.split("/quiz/")[1]
    : undefined;

  // Fetch data based on detected IDs
  const { data: chat } = useChat(chatId);
  const { data: flashcardSet } = useFlashcardSet(flashcardSetId);
  const { data: quiz } = useQuiz(quizId);

  const isBasePage = pathname === "/courses";

  // Determine breadcrumb structure based on URL pattern
  const getBreadcrumbData = (): BreadcrumbData | null => {
    // Chat pages: /chat/[chatId]
    if (pathname.startsWith("/chat/") && chat) {
      return {
        featureName: "Chat",
        featureHref: "/chat",
        itemTitle: chat.title,
      };
    }
    
    // Flashcard pages: /flashcards/[setId] 
    if (pathname.startsWith("/flashcards/") && flashcardSet) {
      return {
        featureName: "Flashcards",
        featureHref: "/content",
        itemTitle: flashcardSet.title,
      };
    }

    // Quiz pages: /quiz/[quizId]
    if (pathname.startsWith("/quiz/") && quiz) {
      return {
        featureName: "Practice Quizzes",
        featureHref: "/content",
        itemTitle: quiz.title,
      };
    }

    // Base chat page: /chat or /
    if (pathname === "/chat" || pathname === "/") {
      return {
        featureName: "New Chat",
        featureHref: "/",
      };
    }

    // Content page: /content
    if (pathname === "/content") {
      return {
        featureName: "Course Content",
        featureHref: "/content",
      };
    }

    return null;
  };

  const breadcrumbData = getBreadcrumbData();
  const courseCode = selectedCourse?.code || "StudySpot";

  return (
    <Breadcrumb className="min-w-0 flex-1">
      <BreadcrumbList className="flex-nowrap break-normal">
        {isBasePage ? (
          // Courses page: show only "My Courses" with no course prefix
          <BreadcrumbItem>
            <BreadcrumbPage className="flex items-center gap-2 whitespace-nowrap">
              <Home className="h-4 w-4" />
              My Courses
            </BreadcrumbPage>
          </BreadcrumbItem>
        ) : !breadcrumbData ? (
          // Fallback: show only course level
          <BreadcrumbItem>
            <BreadcrumbPage className="flex items-center gap-2 whitespace-nowrap">
              <Home className="h-4 w-4" />
              {courseCode}
            </BreadcrumbPage>
          </BreadcrumbItem>
        ) : (
          // Show three-level breadcrumb: Course > Feature > Item
          <>
            {/* Course Level */}
            <BreadcrumbItem className="hidden lg:block">
              <BreadcrumbLink asChild>
                <Link
                  href="/"
                  className="flex items-center gap-2 whitespace-nowrap"
                >
                  <Home className="h-4 w-4" />
                  {courseCode}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden lg:block" />
            
            {/* Feature Level */}
            {breadcrumbData.itemTitle ? (
              // If we have an item title, make feature a link
              <>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink asChild>
                    <Link href={breadcrumbData.featureHref} className="whitespace-nowrap">
                      {breadcrumbData.featureName}
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                
                {/* Item Level */}
                <BreadcrumbItem className="min-w-0">
                  <BreadcrumbPage className="truncate">
                    {breadcrumbData.itemTitle}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </>
            ) : (
              // If no item title, feature is the final page
              <BreadcrumbItem className="min-w-0">
                <BreadcrumbPage className="truncate">
                  {breadcrumbData.featureName}
                </BreadcrumbPage>
              </BreadcrumbItem>
            )}
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

