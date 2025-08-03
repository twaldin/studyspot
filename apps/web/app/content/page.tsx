"use client";

// Force dynamic rendering for authentication and data fetching
export const dynamic = 'force-dynamic';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, ArrowDownNarrowWide, Funnel } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import React from "react";
import { CardGrid } from "@/components/ui/card-grid";
import { useSelectedCourse } from "@/hooks/api/courses";

export default function ContentPage() {
  const searchInputRef = React.useRef<HTMLInputElement>(null);
  
  const [showDocuments, setShowDocuments] = React.useState(true);
  const [showQuizzes, setShowQuizzes] = React.useState(true);
  const [showFlashcards, setShowFlashcards] = React.useState(true);
  const { data: selectedCourse, isLoading, error } = useSelectedCourse();


  // Auto-focus the search input when component mounts
  React.useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

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
          <Select defaultValue="popularity">
            <SelectTrigger className="[&>svg:last-child]:hidden">
              <ArrowDownNarrowWide className="w-4 h-4" />
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popularity">Popularity</SelectItem>
              <SelectItem value="recently-added">Recently Added</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
        <div className="hidden @md:block">
        {isLoading && <div>Loading course...</div>}
        {error && <div>Error loading course</div>}
        {selectedCourse && <CardGrid courseId={selectedCourse.id} viewAll={true} />}
      </div>
    </div>
    </div>
  );
}