"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Zap, ArrowRight, Upload, MessagesSquare } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { FileUploadDialog } from "@/components/file-upload-dialog";
import Link from "next/link";
import { NewPostDialog } from "@/components/new-post-dialog";
import { ChatInputBar } from "@/components/chat-input-bar";
import { useRouter } from "next/navigation";
import { useSuggestedQueries, useSelectedCourse } from "@/hooks/api/courses";
import { Skeleton } from "@/components/ui/skeleton";
import { useCreateChat } from "@/hooks/api/chats";
import { CardGrid } from "@/components/ui/card-grid";
import logger from "@/lib/logger";
import { useStreamingChats } from "@/features/chat/PendingChatContext";


export default function Home() {
  const { data: selectedCourse, isLoading, error } = useSelectedCourse();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isNewPostDialogOpen, setIsNewPostDialogOpen] = useState(false);
  const [isCreatingChat, setIsCreatingChat] = useState(false);
  const router = useRouter();
  const { data: suggestedQueries = [], isLoading: isLoadingSuggestedQueries } = useSuggestedQueries(selectedCourse?.id);
  const createChatMutation = useCreateChat();
  const { setStreamingStatus } = useStreamingChats();

  // Auto-focus the textarea when component mounts
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  const handleNewChat = async (messageContent: string) => {
    if (!selectedCourse || isCreatingChat) {
      return;
    }
    
    setIsCreatingChat(true);
    
    // Generate a temporary ID for immediate UI feedback
    const tempChatId = `temp-creating-${Date.now()}`;
    
    try {
      logger.info('Creating real chat immediately');
      
      // Immediately show creating state in sidebar
      setStreamingStatus(tempChatId, 'Creating chat...', true);
      
      // Create real chat with just the user message
      const createRequest = {
        initialMessages: [
          { role: 'user', content: messageContent }
        ]
      };
      
      const newChat = await createChatMutation.mutateAsync(createRequest);
      logger.info('Created real chat:', { chatId: newChat.id, title: newChat.title });
      
      // Transfer streaming status from temp to real chat
      setStreamingStatus(tempChatId, 'Creating chat...', false); // Remove temp
      setStreamingStatus(newChat.id, newChat.title, true); // Add real with streaming
      
      // Store initial message for the streaming logic
      sessionStorage.setItem(`initial-message-${newChat.id}`, messageContent);
      
      // Navigate to the real chat immediately
      logger.info('Navigating to real chat:', { chatId: newChat.id });
      router.push(`/chat/${newChat.id}`);
      
    } catch (error) {
      console.error('Failed to create chat:', error);
      // Clean up temp streaming status on error
      setStreamingStatus(tempChatId, 'Creating chat...', false);
      // Stay on dashboard and show error (could add toast here)
    } finally {
      setIsCreatingChat(false);
    }
  };

  const handleFormSubmit = async (values: { message: string }) => {
    await handleNewChat(values.message);
  };

  const handleSuggestedQueryClick = async (query: string) => {
    await handleNewChat(query);
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
                disabled={isCreatingChat}
              >
                <Zap className="w-4 h-4 mr-1" />
                {suggestion}
              </Button>
            ))
          )}
        </div>
        </div>
        <ChatInputBar ref={textareaRef} onSubmit={handleFormSubmit} isSubmitting={isCreatingChat} />

        {/* Dynamic CardGrid section from 'dev' branch */}
        <div className="hidden @md:block">
          {error && <div>Error loading course</div>}
          {selectedCourse && <CardGrid courseId={selectedCourse.id} viewAll={false} />}
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