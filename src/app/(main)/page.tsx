"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Zap, ArrowRight, Upload, MessagesSquare } from "lucide-react";
import { useState } from "react";
import { FileUploadDialog } from "@/components/file-upload-dialog";
import Link from "next/link";
import { NewPostDialog } from "@/components/new-post-dialog";
import { ChatInputBar } from "@/components/chat-input-bar";
import { useRouter } from "next/navigation";
import { CardGrid } from "@/components/ui/card-grid";
import { useSelectedCourse } from "@/hooks/api/courses";

const suggestions = [
  "How do we use moles to solve stoichiometry problems?",
  "Will the thermochemistry exam cover energy units?",
];

export default function Home() {
  const { data: selectedCourse, isLoading, error } = useSelectedCourse();

  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isNewPostDialogOpen, setIsNewPostDialogOpen] = useState(false);
  const router = useRouter();

  const handleFormSubmit = (values: { message: string }) => {
    router.push(`/chat?message=${encodeURIComponent(values.message)}`);
  };

  return (
    <div className="mx-auto w-full max-w-3xl h-full flex flex-col p-6 @container">
      <div className="my-auto flex flex-col gap-4">
        <h2 className="text-3xl font-crimson-text leading-none">
          What are we learning today?
        </h2>
        <div className="w-full overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
          <div className="flex gap-2">
            {suggestions.map((suggestion) => (
              <Button
                key={suggestion}
                variant="outline"
                className="whitespace-nowrap rounded-full"
                onClick={() => handleFormSubmit({ message: suggestion })}
              >
                <Zap className="w-4 h-4" />
                {suggestion}
              </Button>
            ))}
          </div>
        </div>
        <ChatInputBar onSubmit={handleFormSubmit} />

        {/* Dynamic CardGrid section from 'dev' branch */}
        <div className="hidden @md:block">
          {isLoading && <div>Loading course...</div>}
          {error && <div>Error loading course</div>}
          {selectedCourse && <CardGrid courseId={selectedCourse.id} />}
        </div>

        {/* Buttons and desktop link from 'chore/mobile-fixes' branch */}
        <div className="flex @md:justify-between items-center">
          <div className="flex items-center">
            <Button variant="ghost" onClick={() => setIsUploadDialogOpen(true)}>
              <Upload className="w-4 h-4" />
              Upload Files
            </Button>
            <Separator
              orientation="vertical"
              className="data-[orientation=vertical]:h-4"
            />
            <Button variant="ghost" onClick={() => setIsNewPostDialogOpen(true)}>
              <MessagesSquare className="w-4 h-4" />
              New Post
            </Button>
          </div>
          <Link href="/content" className="hidden @md:block">
            <Button variant="secondary">
              All Course Content
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Mobile-only floating link from 'chore/mobile-fixes' branch */}
      <Link href="/content" className="fixed bottom-6 right-6 @md:hidden">
        <Button variant="secondary">
          All Course Content
          <ArrowRight className="w-4 h-4" />
        </Button>
      </Link>

      <FileUploadDialog
        open={isUploadDialogOpen}
        onOpenChange={setIsUploadDialogOpen}
      />
      <NewPostDialog
        open={isNewPostDialogOpen}
        onOpenChange={setIsNewPostDialogOpen}
      />
    </div>
  );
}