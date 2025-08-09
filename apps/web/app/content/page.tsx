"use client";

// Force dynamic rendering for authentication and data fetching
export const dynamic = 'force-dynamic';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@studyspot/ui/components/card";
import { Input } from "@studyspot/ui/components/input";
import { Badge } from "@studyspot/ui/components/badge";
import { Search, ArrowDownNarrowWide, Funnel } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@studyspot/ui/components/select";
import { Button } from "@studyspot/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@studyspot/ui/components/dropdown-menu";
import React from "react";
import { CardGrid } from "@/components/ui/card-grid";
import { LinkedResourceCard } from "@/components/linked-resource-card";
import { useSelectedCourse } from "@/hooks/api/courses";
import { useDocuments } from "@/hooks/api/documents";
import { useContentFlashcards, useContentQuizzes, ContentItem } from "@/hooks/api/content";
import { LinkedResource } from "@/features/chat/chat.types";

export default function ContentPage() {
  const searchInputRef = React.useRef<HTMLInputElement>(null);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [sortBy, setSortBy] = React.useState<'alphabetical' | 'recently-added'>('alphabetical');
  const [debouncedSortBy, setDebouncedSortBy] = React.useState<'alphabetical' | 'recently-added'>('alphabetical');
  const [isSortTransitioning, setIsSortTransitioning] = React.useState(false);
  
  const [showDocuments, setShowDocuments] = React.useState(true);
  const [showQuizzes, setShowQuizzes] = React.useState(true);
  const [showFlashcards, setShowFlashcards] = React.useState(true);
  
  const { data: selectedCourse, isLoading: courseLoading, error: courseError } = useSelectedCourse();
  const { data: documents = [], isLoading: documentsLoading, error: documentsError } = useDocuments(selectedCourse?.id);
  const { data: flashcards = [], isLoading: flashcardsLoading, error: flashcardsError } = useContentFlashcards(selectedCourse?.id);
  const { data: quizzes = [], isLoading: quizzesLoading, error: quizzesError } = useContentQuizzes(selectedCourse?.id);


  // Auto-focus the search input when component mounts
  React.useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  // Debounce sort changes to prevent rapid re-renders
  React.useEffect(() => {
    setIsSortTransitioning(true);
    
    const debounceTimer = setTimeout(() => {
      setDebouncedSortBy(sortBy);
      setIsSortTransitioning(false);
    }, 300); // 300ms debounce

    return () => {
      clearTimeout(debounceTimer);
    };
  }, [sortBy]);

  // Combine all content items and apply filtering and sorting
  const allContent = React.useMemo(() => {
    const items: LinkedResource[] = [];
    
    // Add documents if enabled
    if (showDocuments) {
      documents.forEach(doc => {
        items.push({
          id: doc.id,
          type: 'document',
          title: doc.file_name,
          file_type: doc.file_type,
          file_url: doc.file_url,
        });
      });
    }
    
    // Add flashcards if enabled
    if (showFlashcards) {
      flashcards.forEach(set => {
        items.push({
          id: set.id,
          type: 'flashcard_set',
          title: set.title,
          description: set.description,
          cardCount: set.cardCount,
        });
      });
    }
    
    // Add quizzes if enabled
    if (showQuizzes) {
      quizzes.forEach(quiz => {
        items.push({
          id: quiz.id,
          type: 'quiz',
          title: quiz.title,
          description: quiz.description,
          questionCount: quiz.questionCount,
        });
      });
    }
    
    return items;
  }, [documents, flashcards, quizzes, showDocuments, showFlashcards, showQuizzes]);

  // Filter content based on search query
  const filteredContent = React.useMemo(() => {
    if (!searchQuery.trim()) return allContent;
    
    const query = searchQuery.toLowerCase().trim();
    return allContent.filter(item => 
      item.title.toLowerCase().includes(query) ||
      (item.description && item.description.toLowerCase().includes(query))
    );
  }, [allContent, searchQuery]);

  // Sort content using debounced sort value
  const sortedContent = React.useMemo(() => {
    const sorted = [...filteredContent];
    
    if (debouncedSortBy === 'recently-added') {
      // For documents, we'd need created_at. For now, maintain order
      return sorted;
    } else if (debouncedSortBy === 'alphabetical') {
      // Sort alphabetically by title
      return sorted.sort((a, b) => {
        return a.title.toLowerCase().localeCompare(b.title.toLowerCase());
      });
    }
    
    return sorted;
  }, [filteredContent, debouncedSortBy]);

  const isLoading = courseLoading || documentsLoading || flashcardsLoading || quizzesLoading;
  const hasError = courseError || documentsError || flashcardsError || quizzesError;
  const isContentLoading = isLoading || isSortTransitioning;

  return (
    <div className="mx-auto w-full max-w-3xl h-full flex flex-col p-6 gap-4 @container">
      <h2 className="text-3xl font-crimson-text leading-none">
        Search course content
      </h2>
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[250px]">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            ref={searchInputRef}
            type="search"
            placeholder="Search all course content..."
            className="w-full rounded-lg bg-background pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="font-normal">
                <Funnel className="w-4 h-4" />
                Content Type
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="start">
              <DropdownMenuCheckboxItem
                checked={showDocuments}
                onCheckedChange={setShowDocuments}
              >
                Documents
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={showQuizzes}
                onCheckedChange={setShowQuizzes}
              >
                Practice Quizzes
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={showFlashcards}
                onCheckedChange={setShowFlashcards}
              >
                Flashcards
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="[&>svg:last-child]:hidden">
              <ArrowDownNarrowWide className="w-4 h-4" />
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="alphabetical">Alphabetical</SelectItem>
              <SelectItem value="recently-added">Recently Added</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
        {isContentLoading ? (
          <div className="flex items-center justify-center h-32">
            <p className="text-muted-foreground">
              {isSortTransitioning ? "Sorting content..." : "Loading content..."}
            </p>
          </div>
        ) : hasError ? (
          <div className="flex items-center justify-center h-32">
            <p className="text-red-600">Error loading content. Please try again.</p>
          </div>
        ) : !selectedCourse ? (
          <div className="flex items-center justify-center h-32">
            <p className="text-muted-foreground">Please select a course to view content.</p>
          </div>
        ) : sortedContent.length === 0 ? (
          <div className="flex items-center justify-center h-32">
            <p className="text-muted-foreground">
              {searchQuery 
                ? `No content matches your search "${searchQuery}"` 
                : 'No content found for this course.'}
            </p>
          </div>
        ) : (
          <div className="grid gap-4 @md:grid-cols-2 @lg:grid-cols-3">
            {sortedContent.map((item) => (
              <LinkedResourceCard
                key={`${item.type}-${item.id}`}
                resource={item}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}