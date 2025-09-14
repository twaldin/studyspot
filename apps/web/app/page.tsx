"use client";

import { Button } from "@studyspot/ui/components/button";
import { Separator } from "@studyspot/ui/components/separator";
import { Zap, ArrowRight, Upload, MessagesSquare } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import dynamicImport from "next/dynamic";

// Force dynamic rendering for authentication and data fetching
export const dynamic = 'force-dynamic';

// Dynamically import heavy dialogs to reduce initial bundle size
const FileUploadDialog = dynamicImport(
  () => import("@/components/file-upload-dialog").then(mod => ({ default: mod.FileUploadDialog })),
  {
    loading: () => null, // No loading state for dialogs
    ssr: false
  }
);

import { ChatInputBar } from "@/components/chat-input-bar";
import { useRouter } from "next/navigation";
import { useSuggestedQueries, useSelectedCourse } from "@/hooks/api/courses";
import { Skeleton } from "@studyspot/ui/components/skeleton";
import { useCreateChat } from "@/hooks/api/chats";
import { CardGrid } from "@/components/ui/card-grid";
import logger from "@/lib/logger";
import { useStreamingChats } from "@/features/chat/PendingChatContext";


export default function Home() {
  const { data: selectedCourse, isLoading, error } = useSelectedCourse();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isCreatingChat, setIsCreatingChat] = useState(false);
  const router = useRouter();
  const { data: suggestedQueries = [], isLoading: isLoadingSuggestedQueries } = useSuggestedQueries(selectedCourse?.id);
  
  // DEBUG: Log what we're getting from the hook
  useEffect(() => {
    console.log('[HomePage] Suggested queries state:', {
      selectedCourseId: selectedCourse?.id,
      isLoading: isLoadingSuggestedQueries,
      suggestedQueries,
      queriesLength: suggestedQueries.length,
      defaultUsed: suggestedQueries.length === 0
    });
  }, [suggestedQueries, isLoadingSuggestedQueries, selectedCourse?.id]);
  const createChatMutation = useCreateChat();
  const { setStreamingStatus, addOptimisticChat, updateOptimisticChat, failOptimisticChat } = useStreamingChats();

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
    
    // Generate optimistic chat ID
    const tempId = `creating-${Date.now()}`;
    
    try {
      logger.info('Starting optimistic chat creation:', { tempId, messageContent: messageContent.substring(0, 50) });
      
      // 1. Add optimistic chat to context immediately
      addOptimisticChat(tempId, messageContent, selectedCourse.id);
      
      // 2. Navigate instantly to creating page (zero delay!)
      router.push(`/chat/creating?temp=${tempId}`);
      
      // 3. Create real chat in background
      const createRequest = {
        initialMessages: [
          { role: 'user', content: messageContent },
          { role: 'assistant', content: '' } // Empty assistant message for streaming
        ]
      };
      
      const newChat = await createChatMutation.mutateAsync(createRequest);
      logger.info('Created real chat:', { chatId: newChat.id, title: newChat.title });
      
      // 4. Update optimistic chat with real chat ID
      updateOptimisticChat(tempId, newChat.id);
      
      // 5. Store initial message for streaming logic
      sessionStorage.setItem(`initial-message-${newChat.id}`, messageContent);
      
      logger.info('Optimistic chat ready for navigation:', { tempId, realChatId: newChat.id });
      
    } catch (error) {
      logger.error('Failed to create chat:', { error, tempId });
      // Mark optimistic chat as failed
      const errorMessage = error instanceof Error ? error.message : 'Failed to create chat';
      failOptimisticChat(tempId, errorMessage);
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
        <div className="w-full">
          <div className="flex flex-col gap-2 items-start pl-1">
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
                className="rounded-full w-full md:w-auto"
                onClick={() => handleSuggestedQueryClick(suggestion)}
                disabled={isCreatingChat}
              >
                <Zap className="w-4 h-4 mr-1 flex-shrink-0" />
                <span className="truncate">{suggestion}</span>
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
        <div className="flex justify-center @md:justify-between items-center">
          <div className="flex items-center">
            <Button variant="ghost" onClick={() => setIsUploadDialogOpen(true)}>
              <Upload className="w-4 h-4" />
              Upload Files
            </Button>
            <Separator
              orientation="vertical"
              className="data-[orientation=vertical]:h-4"
            />
             <Link href="/content" className="@md:hidden">
              <Button variant="ghost">
                All Course Content
              </Button>
            </Link>
          </div>
          <Link href="/content" className="hidden @md:block">
            <Button variant="secondary">
              All Course Content
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>

      <FileUploadDialog
        open={isUploadDialogOpen}
        onOpenChange={setIsUploadDialogOpen}
      />
    </div>
  );
}