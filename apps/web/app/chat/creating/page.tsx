"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { UserMessage } from "@/components/user-message";
import AssistantMessage from "@/components/assistant-message";
import { ChatInputBar } from "@/components/chat-input-bar";
import { useStreamingChats } from "@/features/chat/PendingChatContext";
import { useSelectedCourse } from "@/hooks/api/courses";
import logger from "@/lib/logger";

function CreatingChatContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tempId = searchParams.get("temp");
  const { getOptimisticChat, isOptimisticChatReady } = useStreamingChats();
  const { data: selectedCourse } = useSelectedCourse();
  
  const [optimisticChat, setOptimisticChat] = useState(tempId ? getOptimisticChat(tempId) : null);
  const [hasNavigated, setHasNavigated] = useState(false);

  // Check if optimistic chat is ready and navigate to real chat
  useEffect(() => {
    if (!tempId || hasNavigated) return;

    const interval = setInterval(() => {
      const chatData = getOptimisticChat(tempId);
      setOptimisticChat(chatData);
      
      if (chatData?.status === 'created' && chatData.realChatId) {
        logger.info('Optimistic chat ready, navigating to real chat', { 
          tempId, 
          realChatId: chatData.realChatId 
        });
        
        // Store tempId mapping for cleanup
        sessionStorage.setItem(`temp-ids-for-${chatData.realChatId}`, JSON.stringify([tempId]));
        
        setHasNavigated(true);
        router.replace(`/chat/${chatData.realChatId}`);
        return;
      }
      
      if (chatData?.status === 'failed') {
        logger.error('Optimistic chat creation failed', { tempId, error: chatData.error });
        clearInterval(interval);
        // Stay on creating page and show error state
        return;
      }
    }, 100); // Check every 100ms for smooth transition

    return () => clearInterval(interval);
  }, [tempId, getOptimisticChat, router, hasNavigated]);

  // Redirect to dashboard if no temp ID or optimistic chat
  useEffect(() => {
    if (!tempId || (!optimisticChat && tempId)) {
      logger.warn('No temp ID or optimistic chat found, redirecting to dashboard');
      router.replace('/');
    }
  }, [tempId, optimisticChat, router]);

  if (!optimisticChat) {
    return (
      <div className="mx-auto w-full max-w-3xl h-full flex flex-col p-6 pt-0">
        <div className="flex-1 flex items-center justify-center">
          <div>Loading...</div>
        </div>
      </div>
    );
  }

  const handleRetry = () => {
    // Navigate back to dashboard to retry
    router.push('/');
  };

  const handleFormSubmit = async () => {
    // Prevent form submission on creating page
    return;
  };

  // Show error state if chat creation failed
  if (optimisticChat?.status === 'failed') {
    return (
      <div className="mx-auto w-full max-w-3xl h-full flex flex-col p-6 pt-0">
        <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
          <div className="flex flex-col gap-4 py-4">
            {/* User message */}
            <UserMessage className="w-fit max-w-2xl self-end">
              {optimisticChat.userMessage}
            </UserMessage>
            
            {/* Error state */}
            <div className="w-fit max-w-2xl self-start">
              <div className="bg-red-50 text-red-700 p-4 rounded-lg">
                <p className="font-medium">Failed to create chat</p>
                <p className="text-sm mt-1">{optimisticChat.error || 'Something went wrong'}</p>
                <button 
                  onClick={handleRetry}
                  className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        </div>

        <div>
          <ChatInputBar 
            onSubmit={handleFormSubmit} 
            isSubmitting={false}
            placeholder="Chat creation failed"
            disabled={true}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl h-full flex flex-col p-6 pt-0">
      <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
        <div className="flex flex-col gap-4 py-4">
          {/* User message */}
          <UserMessage className="w-fit max-w-2xl self-end">
            {optimisticChat.userMessage}
          </UserMessage>
          
          {/* Assistant thinking state */}
          <div className="w-fit max-w-2xl self-start">
            <AssistantMessage
              content=""
              isStreaming={true}
              isTextStreaming={false}
              toolActivity="thinking"
            />
          </div>
        </div>
      </div>

      <div>
        <ChatInputBar 
          onSubmit={handleFormSubmit} 
          isSubmitting={true}
          placeholder="Creating your chat..."
          disabled={true}
        />
      </div>
    </div>
  );
}

export default function CreatingChatPage() {
  return (
    <Suspense fallback={
      <div className="mx-auto w-full max-w-3xl h-full flex flex-col p-6 pt-0">
        <div className="flex-1 flex items-center justify-center">
          <div>Loading...</div>
        </div>
      </div>
    }>
      <CreatingChatContent />
    </Suspense>
  );
}