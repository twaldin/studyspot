"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { ChatInputBar } from "@/components/chat-input-bar";
import { UserMessage } from "@/components/user-message";
import AssistantMessage from "@/components/assistant-message";
import { useChat, useUpdateChatCacheWithHistory } from "@/hooks/api/chats";
import { useSelectedCourse } from "@/hooks/api/courses";
import { useAuthenticatedUser, queryKeys } from "@/hooks/api/base";
import { Message } from "@/features/chat/chat.types";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollToBottomButton } from "@/components/scroll-to-bottom";
import { chatStateService } from "@/features/chat/services/chat-state.service";
import { chatStreamingService } from "@/features/chat/services/chat-streaming.service";
import { streamingManager } from "@/features/chat/services/streaming-manager.service";
import { useStreamingChats } from "@/features/chat/PendingChatContext";
import logger from "@/lib/logger";

export function ChatPageContent() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const chatId = Array.isArray(params?.chatId) ? params.chatId[0] : params?.chatId;
  const [initialMessage, setInitialMessage] = useState<string | null>(null)
  
  // Fetch real chat data
  const { data: chat, isLoading: isLoadingChat, error: chatError } = useChat(chatId)
  const { data: selectedCourse } = useSelectedCourse()
  const { userId } = useAuthenticatedUser()
  const { setStreamingStatus, updateStreamingMessage, getStreamingMessage, removeOptimisticChat } = useStreamingChats()
  const updateChatCache = useUpdateChatCacheWithHistory()
  
  const [messages, setMessages] = useState<Message[]>([])
  const [isReplying, setIsReplying] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isAtBottom, setIsAtBottom] = useState(true)
  const [toolActivity, setToolActivity] = useState<string | null>(null)
  const [isTextStreaming, setIsTextStreaming] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const hasStartedStreamingRef = useRef<boolean>(false)


  // Scroll to bottom function
  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'end'
      })
    }
  }, [])

  // Scroll to position user's message at top of viewport for better readability
  const scrollToUserMessage = useCallback((messageIndex: number) => {
    if (chatContainerRef.current) {
      const messageElements = chatContainerRef.current.querySelectorAll('.flex-col.gap-4 > *');
      const targetElement = messageElements[messageIndex];
      
      if (targetElement) {
        const containerTop = chatContainerRef.current.getBoundingClientRect().top;
        const elementTop = targetElement.getBoundingClientRect().top;
        const currentScroll = chatContainerRef.current.scrollTop;
        const offset = 20; // 20px from top for better visibility
        
        const scrollPosition = currentScroll + (elementTop - containerTop) - offset;
        
        chatContainerRef.current.scrollTo({
          top: scrollPosition,
          behavior: 'smooth'
        });
      }
    }
  }, [])

  // Check if user is near bottom of chat
  const handleScroll = useCallback(() => {
    if (chatContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 100 // 100px threshold
      setIsAtBottom(isAtBottom)
    }
  }, [])

  // Handle initial message from sessionStorage only
  useEffect(() => {
    if (!chatId) return;

    // Only handle initial message and streaming flag reset - DON'T clear messages
    hasStartedStreamingRef.current = false
    
    // Check for initial message in sessionStorage
    const storedInitialMessage = sessionStorage.getItem(`initial-message-${chatId}`)
    if (storedInitialMessage) {
      setInitialMessage(storedInitialMessage)
      sessionStorage.removeItem(`initial-message-${chatId}`)
    }
  }, [chatId])


  // Simple: Use React Query cached chat data to populate messages
  useEffect(() => {
    if (!chat || !chat.chats || messages.length > 0) return;
    
    console.log('[Simple Chat Loading] Loading from React Query cache:', {
      chatId,
      messagesFromDB: chat.chats?.length || 0
    });

    // Convert database messages to UI format
    const uiMessages = chatStateService.loadChatFromDatabase(chat);
    setMessages(uiMessages);
    
    // Process linked resources in background if needed
    const processResources = async () => {
      const messagesWithResources = await Promise.all(
        uiMessages.map(async (msg) => {
          if (msg.linkedResourceRefs && msg.linkedResourceRefs.length > 0) {
            const linkedResources = await chatStreamingService.convertRefsToResources(msg.linkedResourceRefs);
            return { ...msg, linkedResources };
          }
          return msg;
        })
      );
      
      const hasNewResources = messagesWithResources.some(msg => msg.linkedResources && msg.linkedResources.length > 0);
      if (hasNewResources) {
        setMessages(messagesWithResources);
      }
    };
    
    processResources();
  }, [chat, messages.length])

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
        logger.info('Cleaned up optimistic chats:', { chatId, tempIds: tempIdList });
      }
    }
  }, [chat, chatId, removeOptimisticChat]);

  // Handle initial message streaming
  useEffect(() => {
    if (initialMessage && selectedCourse && chat && chatId && !streamingManager.isStreaming(chatId) && !hasStartedStreamingRef.current) {
      // This logic is specifically for the first message in a new chat.
      // It looks for a user message followed by an empty assistant message.
      const shouldStartStreaming = messages.length === 2 &&
        messages[0].role === 'user' &&
        messages[0].content === initialMessage &&
        messages[1].role === 'assistant' &&
        messages[1].content === ''

      if (shouldStartStreaming) {
        // Mark that we've started streaming to prevent duplicate calls
        hasStartedStreamingRef.current = true
        console.log('[ChatClient] Starting initial message streaming (preventing duplicates)');
        setIsReplying(true)
        
        // Update streaming status
        setStreamingStatus(chatId, chat.title || 'Chat', true);
        
        const startStreaming = async () => {
          try {
            // The empty assistant message already exists, so we just stream into it.
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
                updateChatCache: updateChatCache.mutate // Add cache mutation to context
              }
            );
            
            // Streaming completed successfully, invalidate cache to refetch augmented data
            setIsReplying(false); // Ensure this is set to false after initial streaming completes
            setStreamingStatus(chatId, chat.title || 'Chat', false);
            await queryClient.invalidateQueries({
              queryKey: queryKeys.chats.detail(chatId),
            });
            
          } catch (error) {
            console.error('Failed to start streaming:', error)
            setStreamingStatus(chatId, chat.title || 'Chat', false);
            
            // CRITICAL: Ensure all streaming states are cleared on error
            setIsReplying(false);
            setToolActivity(null);
            setIsTextStreaming(false);
            
            // Remove the empty assistant message on error
            chatStateService.handleMessageError(
              { messages, setMessages, setIsReplying, setError },
              error instanceof Error ? error : new Error('Failed to start streaming'),
              1 
            )
          }
        }
        
        startStreaming()
      }
    }
  }, [initialMessage, selectedCourse, chat, chatId, messages, router, setStreamingStatus, updateStreamingMessage, userId])

  // Handle chat loading errors
  useEffect(() => {
    if (chatError) {
      const errorMessage = chatError instanceof Error ? chatError.message : 'Failed to load chat'
      setError(errorMessage)
    }
  }, [chatError])

  // Cleanup streaming when component unmounts or chat changes
  useEffect(() => {
    return () => {
      // Only stop streaming if we're navigating away completely, not just to another chat
      // The streaming manager will handle active streams across navigation
    }
  }, [chatId])


  const showThinkingIndicator = chatStateService.shouldShowThinkingIndicator(messages, isReplying)
  
  // Debug thinking indicator logic
  console.log('[Thinking Debug]', {
    chatId,
    showThinkingIndicator,
    isReplying,
    messagesLength: messages.length,
    lastMessage: messages.length > 0 ? { 
      role: messages[messages.length - 1]?.role, 
      content: messages[messages.length - 1]?.content?.substring(0, 50) || 'empty',
      contentLength: messages[messages.length - 1]?.content?.length || 0,
      isEmpty: messages[messages.length - 1]?.content === ''
    } : 'no messages'
  });

  const handleFormSubmit = useCallback(async (values: { message: string }) => {
    if (!selectedCourse || !chatId) {
      setError('Please select a course first')
      return
    }

    if (isReplying || streamingManager.isStreaming(chatId)) {
      console.log('[ChatClient] Preventing duplicate submission - already streaming', {
        isReplying,
        isStreamingManagerActive: streamingManager.isStreaming(chatId),
        chatId
      })
      return
    }

    console.log('[ChatClient] handleFormSubmit called with:', { message: values.message, chatId, courseId: selectedCourse.id });
    
    setIsReplying(true)
    setError(null)
    
    // Update streaming status - new message streaming
    setStreamingStatus(chatId, chat?.title || 'Chat', true);

    try {
      // Create initial messages
      const { userMessage, assistantMessage } = chatStateService.createInitialMessages(values.message)
      
      // Add messages to state
      chatStateService.addMessagesToChat(
        { messages, setMessages, setIsReplying, setError },
        userMessage,
        assistantMessage
      )

      // Scroll to the new user message for better readability
      // Wait a tick for the DOM to update
      setTimeout(() => {
        const newUserMessageIndex = messages.length; // Index of the newly added user message
        scrollToUserMessage(newUserMessageIndex);
      }, 100);

      // Get conversation history
      const conversationHistory = chatStateService.getConversationHistory(messages)

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
          updateChatCache: updateChatCache.mutate // Add cache mutation to context
        }
      );

      // Streaming completed successfully, invalidate cache to refetch augmented data
      console.log('[ChatClient] Streaming completed successfully for chat:', chatId);
      setIsReplying(false); // Ensure this is set to false after streaming completes
      setStreamingStatus(chatId, chat?.title || 'Chat', false);
      await queryClient.invalidateQueries({
        queryKey: queryKeys.chats.detail(chatId),
      });

    } catch (error) {
      console.error('Failed to send message:', error)
      setStreamingStatus(chatId, chat?.title || 'Chat', false);
      
      // CRITICAL: Ensure all streaming states are cleared on error
      setIsReplying(false);
      setToolActivity(null);
      setIsTextStreaming(false);
      
      chatStateService.handleMessageError(
        { messages, setMessages, setIsReplying, setError },
        error instanceof Error ? error : new Error('Failed to send message')
      )
    }
  }, [chatId, selectedCourse, messages, router, setStreamingStatus, chat?.title, updateStreamingMessage, queryClient, scrollToUserMessage, userId])

  if (!chatId) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div>Chat not found</div>
      </div>
    )
  }

  // Show loading state while chat is loading
  const showLoadingMessages = isLoadingChat;
  const showEmptyState = !isLoadingChat && !chat;

  // Debug render conditions
  console.log('[Render Debug]', {
    chatId,
    isLoadingChat,
    hasChatData: !!chat,
    messagesLength: messages.length,
    showLoadingMessages,
    showEmptyState,
    willShowMessages: !showLoadingMessages && !showEmptyState
  });

  if (isLoadingChat) {
    return (
      <div className="mx-auto w-full max-w-3xl h-full flex flex-col p-6 pt-0">
        <div className="flex-1 overflow-y-auto">
          <div className="flex flex-col gap-4">
            <Skeleton className="w-48 h-12 rounded-lg self-end" />
            <Skeleton className="w-64 h-16 rounded-lg self-end" />
          </div>
        </div>
        <div>
          <Skeleton className="w-full h-10" />
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-3xl h-full flex flex-col p-6 pt-0">
      {error && (
        <div className="bg-destructive/15 text-destructive px-4 py-2 rounded-md text-sm">
          {error}
        </div>
      )}
      
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']"
        onScroll={handleScroll}
      >
        <div className="flex flex-col gap-4 py-4">
          {showLoadingMessages ? (
            // Show message skeletons while loading
            <>
              <Skeleton className="w-48 h-12 rounded-lg self-end" />
              <Skeleton className="w-64 h-16 rounded-lg self-start" />
              <Skeleton className="w-56 h-10 rounded-lg self-end" />
              <Skeleton className="w-72 h-20 rounded-lg self-start" />
            </>
          ) : showEmptyState ? (
            // Show empty state for failed loads
            <div className="flex items-center justify-center h-full text-muted-foreground">
              Chat not found
            </div>
          ) : (
            // Show actual messages
            messages.map((message, i) =>
              message.role === "user" ? (
                <UserMessage key={message.id || i} className="w-fit max-w-2xl self-end">
                  {message.content}
                </UserMessage>
              ) : (
                <AssistantMessage 
                  key={message.id || i} 
                  content={message.content}
                  linkedResources={message.linkedResources}
                  isStreaming={isReplying && i === messages.length - 1}
                  isTextStreaming={isTextStreaming && i === messages.length - 1}
                  toolActivity={i === messages.length - 1 ? toolActivity : null}
                />
              )
            )
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <ScrollToBottomButton
        isAtBottom={isAtBottom}
        scrollToBottom={scrollToBottom}
      />
      
      <div>
        <ChatInputBar 
          onSubmit={handleFormSubmit} 
          isSubmitting={isReplying}
          placeholder={showLoadingMessages ? "Loading chat..." : "Can you help me with..."}
          disabled={showLoadingMessages}
        />
      </div>
    </div>
  )
}