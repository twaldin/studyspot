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
import { useSuggestedQueries, useSelectedCourse } from "@/hooks/api/courses";
import { Skeleton } from "@/components/ui/skeleton";
import { chatStateService } from "@/features/chat/services/chat-state.service";
import { chatNavigationService } from "@/features/chat/services/chat-navigation.service";
import { CardGrid } from "@/components/ui/card-grid";


export default function Home() {
  const { data: selectedCourse, isLoading, error } = useSelectedCourse();

  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isNewPostDialogOpen, setIsNewPostDialogOpen] = useState(false);
  const router = useRouter();
  const { data: suggestedQueries = [], isLoading: isLoadingSuggestedQueries } = useSuggestedQueries(selectedCourse?.id);

  const handleNewChat = (messageContent: string) => {
    const optimisticChatId = chatStateService.generateOptimisticChatId();
    const { userMessage, assistantMessage } = chatStateService.createInitialMessages(messageContent);
    
    const initialMessages = [userMessage, assistantMessage];
    
    chatStateService.storeOptimisticChatState(optimisticChatId, initialMessages);
    chatNavigationService.navigateToOptimisticChat(router, optimisticChatId);
  };

  const handleFormSubmit = (values: { message: string }) => {
    handleNewChat(values.message);
  };

  const handleSuggestedQueryClick = (query: string) => {
    handleNewChat(query);
  };

  return (
    <div className="mx-auto w-full max-w-3xl h-full flex flex-col p-6 @container">
      <div className="my-auto flex flex-col gap-4">
        <h2 className="text-3xl font-crimson-text leading-none">
          What are we learning today?
        </h2>
        <div className="w-full overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
          <div className="flex gap-2">
          {isLoadingSuggestedQueries ? (
            <>
              <Skeleton className="h-8 w-32 rounded-full" />
              <Skeleton className="h-8 w-40 rounded-full" />
              <Skeleton className="h-8 w-24 rounded-full" />
            </>
          ) : (
            suggestedQueries.map((suggestion) => (
              <Button
                key={suggestion}
                variant="outline"
                className="whitespace-nowrap rounded-full"
                onClick={() => handleSuggestedQueryClick(suggestion)}
              >
                <Zap className="w-4 h-4 mr-1" />
                {suggestion}
              </Button>
            ))
          )}
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