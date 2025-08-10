"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { ChatInputBar } from "@/components/chat-input-bar";
import { UserMessage } from "@/components/user-message";
import AssistantMessage from "@/components/assistant-message";
import { useChat, useUpdateChatCacheWithHistory } from "@/hooks/api/chats";
import { useSelectedCourse } from "@/hooks/api/courses";
import { queryKeys, useAuthenticatedUser } from "@/hooks/api/base";
import { Message } from "@/features/chat/chat.types";
import { ScrollToBottomButton } from "@/components/scroll-to-bottom";
import { chatStateService } from "@/features/chat/services/chat-state.service";
import { chatStreamingService } from "@/features/chat/services/chat-streaming.service";
import { streamingManager } from "@/features/chat/services/streaming-manager.service";
import { useStreamingChats } from "@/features/chat/PendingChatContext";
import { useAnonymousUserOptional } from "@/contexts/anonymous-user-context";
import { Button } from "@studyspot/ui/components/button";
import { GitBranch } from "lucide-react";
import toast from "react-hot-toast";
import logger from "@/lib/logger";

interface ChatPageContentProps {
  isPublicView?: boolean;
  onMessageLimitReached?: () => void;
}

export function ChatPageContent(
  { isPublicView = false, onMessageLimitReached }: ChatPageContentProps,
) {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const chatId = Array.isArray(params?.chatId)
    ? params.chatId[0]
    : params?.chatId;
  const [initialMessage, setInitialMessage] = useState<string | null>(null);

  // Fetch real chat data
  const { data: chat, isLoading: isLoadingChat, error: chatError } = useChat(
    chatId,
  );
  const { data: selectedCourse } = useSelectedCourse();
  const { userId } = useAuthenticatedUser();
  const {
    setStreamingStatus,
    updateStreamingMessage,
    getStreamingMessage,
    removeOptimisticChat,
  } = useStreamingChats();
  const updateChatCache = useUpdateChatCacheWithHistory();
  const anonymousUser = useAnonymousUserOptional();

  const [messages, setMessages] = useState<Message[]>([]);
  const [isReplying, setIsReplying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [toolActivity, setToolActivity] = useState<string | null>(null);
  const [isTextStreaming, setIsTextStreaming] = useState(false);
  const [isForking, setIsForking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const hasStartedStreamingRef = useRef<boolean>(false);
  const previousChatIdRef = useRef<string | undefined>();

  // Scroll to bottom function
  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, []);

  // Scroll to position user's message optimally for new responses
  const scrollToUserMessage = useCallback((messageIndex: number) => {
    if (chatContainerRef.current) {
      const messageElements = chatContainerRef.current.querySelectorAll(
        ".flex-col.gap-4 > *",
      );
      const targetElement = messageElements[messageIndex];

      if (targetElement) {
        // For new messages, position the user message at a comfortable reading position
        // This ensures the user can see their question while the AI responds
        const containerRect = chatContainerRef.current.getBoundingClientRect();
        const elementRect = targetElement.getBoundingClientRect();
        const currentScroll = chatContainerRef.current.scrollTop;
        
        // Position user message about 1/4 from the top of the viewport for optimal reading
        const targetPositionFromTop = containerRect.height * 0.25;
        const scrollPosition = currentScroll + (elementRect.top - containerRect.top) - targetPositionFromTop;

        chatContainerRef.current.scrollTo({
          top: Math.max(0, scrollPosition),
          behavior: "smooth",
        });
      }
    }
  }, []);

  // Check if user is near bottom of chat
  const handleScroll = useCallback(() => {
    if (chatContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } =
        chatContainerRef.current;
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 100; // 100px threshold
      setIsAtBottom(isAtBottom);
    }
  }, []);

  // Handle chat navigation and initial messages
  useEffect(() => {
    if (!chatId) return;

    // Reset streaming flag for new chats
    hasStartedStreamingRef.current = false;

    // Clear messages ONLY when switching to a different chat
    // This preserves state when returning to the same chat
    if (previousChatIdRef.current && previousChatIdRef.current !== chatId) {
      console.log(
        "[Navigation] Switching to different chat, clearing messages",
      );
      setMessages([]);
      setIsReplying(false);
      setToolActivity(null);
      setIsTextStreaming(false);
    }
    previousChatIdRef.current = chatId;

    // Check for initial message in sessionStorage
    const storedInitialMessage = sessionStorage.getItem(
      `initial-message-${chatId}`,
    );
    if (storedInitialMessage) {
      setInitialMessage(storedInitialMessage);
      sessionStorage.removeItem(`initial-message-${chatId}`);
    }
  }, [chatId]);

  // Load from cache AND check for active streams
  useEffect(() => {
    // Don't load from cache if we're waiting for initial message to stream
    if (!chat || !chat.chats || !chatId) return;

    // If we have an initial message waiting, the display is already handled
    if (initialMessage && messages.length === 0) return;

    // Check for active streaming FIRST
    const isStreamingActive = streamingManager.isStreaming(chatId);
    const streamingData = getStreamingMessage(chatId);
    const hasStreamingContent = streamingData && streamingData.message &&
      streamingData.message.trim().length > 0;

    console.log("[Chat Loading] State check:", {
      chatId,
      messagesInState: messages.length,
      messagesFromDB: chat.chats?.length || 0,
      isStreamingActive,
      hasStreamingContent,
      streamingDataPreview: streamingData?.message?.substring(0, 50) || "none",
    });

    // If we have messages in state already, check if we need to resume streaming
    if (messages.length > 0) {
      if (isStreamingActive && hasStreamingContent) {
        console.log("[Navigation] Resuming active stream for chat:", chatId);

        // Update streaming context to reconnect UI
        streamingManager.updateStreamContext(chatId, {
          setMessages,
          setIsReplying,
          updateStreamingMessage,
          setToolActivity,
          setIsTextStreaming,
          setStreamingStatus,
          updateChatCache: updateChatCache.mutate,
        });

        // Set streaming UI state
        setIsReplying(true);

        // Add streaming message if not already present
        const lastMessage = messages[messages.length - 1];
        if (
          !lastMessage || lastMessage.role !== "assistant" ||
          lastMessage.content !== streamingData.message
        ) {
          const assistantMessage: Message = {
            id: Date.now().toString() + "-streaming-assistant",
            content: streamingData.message,
            role: "assistant",
          };
          setMessages([...messages, assistantMessage]);
        }
      }
      return; // Don't reload from cache if we already have messages
    }

    // Load from cache if no messages in state
    console.log("[Simple Chat Loading] Loading from React Query cache:", {
      chatId,
      messagesFromDB: chat.chats?.length || 0,
    });

    // Convert database messages to UI format
    const uiMessages = chatStateService.loadChatFromDatabase(chat);

    // Check if streaming is active for this fresh load
    if (isStreamingActive && hasStreamingContent) {
      console.log(
        "[Navigation] Found active stream during fresh load:",
        chatId,
        "Content length:",
        streamingData.message.length,
      );

      // Set streaming UI state
      setIsReplying(true);

      // Update streaming context
      streamingManager.updateStreamContext(chatId, {
        setMessages,
        setIsReplying,
        updateStreamingMessage,
        setToolActivity,
        setIsTextStreaming,
        setStreamingStatus,
        updateChatCache: updateChatCache.mutate,
      });

      // Also check if there's tool activity stored in the streaming manager
      const currentToolActivity = streamingManager.getToolActivity(chatId);
      if (currentToolActivity) {
        setToolActivity(currentToolActivity);
      }

      // Remove any empty assistant message from cache and add the streaming one
      const messagesWithoutEmptyAssistant = uiMessages.filter(
        (msg, idx) =>
          !(msg.role === "assistant" && msg.content === "" &&
            idx === uiMessages.length - 1),
      );

      // Add the streaming message
      const assistantMessage: Message = {
        id: Date.now().toString() + "-streaming-assistant",
        content: streamingData.message,
        role: "assistant",
      };
      setMessages([...messagesWithoutEmptyAssistant, assistantMessage]);
    } else {
      // No active streaming, just load from cache
      setMessages(uiMessages);
    }

    // Process linked resources in background if needed (only for messages that don't already have full resources)
    const processResources = async () => {
      const baseMessages = isStreamingActive ? uiMessages : uiMessages;
      const messagesWithResources = await Promise.all(
        baseMessages.map(async (msg) => {
          // If message already has full linkedResources (from cache), use them
          if (msg.linkedResources && msg.linkedResources.length > 0) {
            return msg;
          }

          // Otherwise, convert refs to full resources (for fresh DB loads)
          if (msg.linkedResourceRefs && msg.linkedResourceRefs.length > 0) {
            const linkedResources = await chatStreamingService
              .convertRefsToResources(msg.linkedResourceRefs);
            return { ...msg, linkedResources };
          }

          return msg;
        }),
      );

      const hasAnyResources = messagesWithResources.some((msg) =>
        msg.linkedResources && msg.linkedResources.length > 0
      );
      if (hasAnyResources) {
        if (isStreamingActive && hasStreamingContent) {
          // Re-add streaming message after resources update
          const assistantMessage: Message = {
            id: Date.now().toString() + "-streaming-assistant",
            content: streamingData!.message,
            role: "assistant",
          };
          setMessages([...messagesWithResources, assistantMessage]);
        } else {
          setMessages(messagesWithResources);
        }
      }
    };

    processResources();
  }, [chat, chatId]); // Removed messages.length dependency to allow stream resumption

  // Clean up optimistic chats when real chat loads
  useEffect(() => {
    if (chat && chatId) {
      // Check if this chat came from optimistic creation
      // Look for any optimistic chats that have this as their real chat ID
      const tempIds = sessionStorage.getItem(`temp-ids-for-${chatId}`);
      if (tempIds) {
        const tempIdList = JSON.parse(tempIds);
        tempIdList.forEach((tempId: string) => {
          removeOptimisticChat(tempId);
        });
        sessionStorage.removeItem(`temp-ids-for-${chatId}`);
        logger.info("Cleaned up optimistic chats:", {
          chatId,
          tempIds: tempIdList,
        });
      }
    }
  }, [chat, chatId, removeOptimisticChat]);

  // Handle initial message streaming
  useEffect(() => {
    if (
      initialMessage && selectedCourse && chat && chatId &&
      !streamingManager.isStreaming(chatId) && !hasStartedStreamingRef.current
    ) {
      // This logic handles the first message in a new chat.
      // It can work either with:
      // 1. messages.length === 0 (optimistic state during navigation)
      // 2. messages.length === 2 with user + empty assistant (database loaded state)
      const shouldStartStreaming = (messages.length === 0) || // Optimistic state
        (messages.length === 2 &&
          messages[0].role === "user" &&
          messages[0].content === initialMessage &&
          messages[1].role === "assistant" &&
          messages[1].content === "");

      if (shouldStartStreaming) {
        // Mark that we've started streaming to prevent duplicate calls
        hasStartedStreamingRef.current = true;
        console.log(
          "[ChatClient] Starting initial message streaming (preventing duplicates)",
        );
        setIsReplying(true);

        // Update streaming status
        setStreamingStatus(chatId, chat.title || "Chat", true);

        const startStreaming = async () => {
          try {
            // If we're in optimistic state (messages.length === 0), add the initial messages
            if (messages.length === 0) {
              const userMessage = {
                id: Date.now().toString() + "-user",
                content: initialMessage,
                role: "user" as const,
              };
              const assistantMessage = {
                id: Date.now().toString() + "-assistant",
                content: "",
                role: "assistant" as const,
              };
              setMessages([userMessage, assistantMessage]);
            }

            // Start streaming (the empty assistant message exists now)
            await streamingManager.startStreaming(
              chatId,
              initialMessage,
              [], // Empty conversation history for first message
              selectedCourse.id,
              {
                setMessages,
                messageContent: initialMessage,
                conversationHistory: [],
                isNewChat: false,
                chatId: chatId,
                userId,
                router,
                selectedCourse,
                setIsReplying,
                updateStreamingMessage,
                setToolActivity,
                setIsTextStreaming,
                setStreamingStatus,
                updateChatCache: updateChatCache.mutate, // Add cache mutation to context
              },
            );

            // Streaming completed successfully, invalidate cache to refetch augmented data
            setIsReplying(false); // Ensure this is set to false after initial streaming completes
            setStreamingStatus(chatId, chat.title || "Chat", false);
            await queryClient.invalidateQueries({
              queryKey: queryKeys.chats.detail(chatId),
            });
          } catch (error) {
            console.error("Failed to start streaming:", error);
            setStreamingStatus(chatId, chat.title || "Chat", false);

            // CRITICAL: Ensure all streaming states are cleared on error
            setIsReplying(false);
            setToolActivity(null);
            setIsTextStreaming(false);

            // Remove the empty assistant message on error
            chatStateService.handleMessageError(
              { messages, setMessages, setIsReplying, setError },
              error instanceof Error
                ? error
                : new Error("Failed to start streaming"),
              1,
            );
          }
        };

        startStreaming();
      }
    }
  }, [
    initialMessage,
    selectedCourse,
    chat,
    chatId,
    messages,
    router,
    setStreamingStatus,
    updateStreamingMessage,
    userId,
  ]);

  // Handle chat loading errors
  useEffect(() => {
    if (chatError) {
      const errorMessage = chatError instanceof Error
        ? chatError.message
        : "Failed to load chat";
      setError(errorMessage);
    }
  }, [chatError]);

  // Cleanup streaming when component unmounts or chat changes
  useEffect(() => {
    return () => {
      // Only stop streaming if we're navigating away completely, not just to another chat
      // The streaming manager will handle active streams across navigation
    };
  }, [chatId]);

  const showThinkingIndicator = chatStateService.shouldShowThinkingIndicator(
    messages,
    isReplying,
  );

  // Debug thinking indicator logic
  console.log("[Thinking Debug]", {
    chatId,
    showThinkingIndicator,
    isReplying,
    messagesLength: messages.length,
    lastMessage: messages.length > 0
      ? {
        role: messages[messages.length - 1]?.role,
        content: messages[messages.length - 1]?.content?.substring(0, 50) ||
          "empty",
        contentLength: messages[messages.length - 1]?.content?.length || 0,
        isEmpty: messages[messages.length - 1]?.content === "",
      }
      : "no messages",
  });

  const handleFormSubmit = useCallback(async (values: { message: string }) => {
    // Check anonymous user limits first
    if (isPublicView && anonymousUser?.isAnonymous) {
      const canSendMessage = anonymousUser.useChatMessage();
      if (!canSendMessage) {
        onMessageLimitReached?.();
        return;
      }
    }

    if (!selectedCourse || !chatId) {
      setError("Please select a course first");
      return;
    }

    if (isReplying || streamingManager.isStreaming(chatId)) {
      console.log(
        "[ChatClient] Preventing duplicate submission - already streaming",
        {
          isReplying,
          isStreamingManagerActive: streamingManager.isStreaming(chatId),
          chatId,
        },
      );
      return;
    }

    console.log("[ChatClient] handleFormSubmit called with:", {
      message: values.message,
      chatId,
      courseId: selectedCourse.id,
    });

    setIsReplying(true);
    setError(null);

    // Update streaming status - new message streaming
    setStreamingStatus(chatId, chat?.title || "Chat", true);

    try {
      // Create initial messages
      const { userMessage, assistantMessage } = chatStateService
        .createInitialMessages(values.message);

      // Add messages to state
      chatStateService.addMessagesToChat(
        { messages, setMessages, setIsReplying, setError },
        userMessage,
        assistantMessage,
      );

      // Scroll to the new user message for better readability
      // Wait a tick for the DOM to update
      setTimeout(() => {
        const newUserMessageIndex = messages.length; // Index of the newly added user message
        scrollToUserMessage(newUserMessageIndex);
      }, 100);

      // Get conversation history
      const conversationHistory = chatStateService.getConversationHistory(
        messages,
      );

      // Use streaming manager for persistent streaming
      await streamingManager.startStreaming(
        chatId,
        values.message,
        conversationHistory,
        selectedCourse.id,
        {
          setMessages,
          messageContent: values.message,
          conversationHistory,
          isNewChat: false,
          chatId: chatId,
          userId,
          router,
          selectedCourse,
          setIsReplying,
          updateStreamingMessage,
          setToolActivity,
          setIsTextStreaming,
          setStreamingStatus,
          updateChatCache: updateChatCache.mutate, // Add cache mutation to context
        },
      );

      // Streaming completed successfully, invalidate cache to refetch augmented data
      console.log(
        "[ChatClient] Streaming completed successfully for chat:",
        chatId,
      );
      setIsReplying(false); // Ensure this is set to false after streaming completes
      setStreamingStatus(chatId, chat?.title || "Chat", false);
      await queryClient.invalidateQueries({
        queryKey: queryKeys.chats.detail(chatId),
      });
    } catch (error) {
      console.error("Failed to send message:", error);
      setStreamingStatus(chatId, chat?.title || "Chat", false);

      // CRITICAL: Ensure all streaming states are cleared on error
      setIsReplying(false);
      setToolActivity(null);
      setIsTextStreaming(false);

      chatStateService.handleMessageError(
        { messages, setMessages, setIsReplying, setError },
        error instanceof Error ? error : new Error("Failed to send message"),
      );
    }
  }, [
    chatId,
    selectedCourse,
    messages,
    router,
    setStreamingStatus,
    chat?.title,
    updateStreamingMessage,
    queryClient,
    scrollToUserMessage,
    userId,
    isPublicView,
    anonymousUser,
    onMessageLimitReached,
  ]);

  // Handle forking conversation
  const handleForkConversation = useCallback(async () => {
    if (!chatId || isForking) return;

    setIsForking(true);

    try {
      const response = await fetch(`/api/chats/${chatId}/fork`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to fork conversation");
      }

      const data = await response.json();

      toast.success("Conversation forked successfully");

      // Navigate to the new forked chat
      router.push(`/chat/${data.chatId}`);
    } catch (error) {
      console.error("Failed to fork conversation:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to fork conversation",
      );
      setIsForking(false);
    }
  }, [chatId, router]);

  if (!chatId) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div>Chat not found</div>
      </div>
    );
  }

  // Check if we have initial message that we're waiting to stream
  const hasInitialMessageWaiting = initialMessage && messages.length === 0;
  // Don't show empty state if we're still loading or have an initial message
  const showEmptyState = !isLoadingChat && !chat && !hasInitialMessageWaiting;

  // Check if current user owns this chat
  const isOwnChat = chat?.user_id === userId;
  const showForkButton = !isPublicView && chat && !isOwnChat;

  return (
    <div className="mx-auto w-full max-w-3xl h-full flex flex-col p-6 pt-0">
      {error && (
        <div className="bg-destructive/15 text-destructive px-4 py-2 rounded-md text-sm">
          {error}
        </div>
      )}

      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto scrollbar-hidden"
        onScroll={handleScroll}
      >
        <div className="flex flex-col gap-4 py-0">
          {showEmptyState
            ? (
              // Show empty state for failed loads
              <div className="flex items-center justify-center h-full text-muted-foreground">
                Chat not found
              </div>
            )
            : hasInitialMessageWaiting
              ? (
                // Show initial message while waiting for chat to load
                <>
                  <UserMessage className="w-fit max-w-2xl self-end">
                    {initialMessage}
                  </UserMessage>
                  <AssistantMessage
                    content=""
                    isStreaming={true}
                    isTextStreaming={false}
                    toolActivity="thinking"
                    chatId={chatId}
                    chatTitle={chat?.title}
                    chatContainerRef={chatContainerRef}
                  />
                </>
              )
              : (
                // Show actual messages
                messages.map((message, i) =>
                  message.role === "user"
                    ? (
                      <UserMessage
                        key={message.id || i}
                        className="w-fit max-w-2xl self-end"
                      >
                        {message.content}
                      </UserMessage>
                    )
                    : (
                      <AssistantMessage
                        key={message.id || i}
                        content={message.content}
                        linkedResources={message.linkedResources}
                        isStreaming={isReplying && i === messages.length - 1}
                        isTextStreaming={isTextStreaming &&
                          i === messages.length - 1}
                        toolActivity={i === messages.length - 1
                          ? toolActivity
                          : null}
                        chatId={chatId}
                        chatTitle={chat?.title}
                        chatContainerRef={chatContainerRef}
                      />
                    )
                )
              )}
          <div ref={messagesEndRef} />
          {/* Dynamic space for assistant responses - only when replying */}
          {isReplying && (
            <div 
              style={{ 
                height: `${Math.max(window.innerHeight * 0.6, 300)}px` 
              }} 
            />
          )}
        </div>
      </div>

      <ScrollToBottomButton
        isAtBottom={isAtBottom}
        scrollToBottom={scrollToBottom}
      />

      <div>
        {showForkButton
          ? (
            <div className="flex flex-col gap-2 p-4 bg-muted/50 rounded-lg border">
              <p className="text-sm text-muted-foreground">
                This conversation belongs to another user. Fork it to continue
                the conversation.
              </p>
              <Button
                onClick={handleForkConversation}
                disabled={isForking}
                className="w-full"
              >
                <GitBranch className="h-4 w-4 mr-2" />
                {isForking ? "Forking..." : "Fork Conversation"}
              </Button>
            </div>
          )
          : (
            <ChatInputBar
              onSubmit={handleFormSubmit}
              isSubmitting={isReplying}
              placeholder="Can you help me with..."
            />
          )}
      </div>
    </div>
  );
}

