"use client"

import { useCallback, useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { ChatInputBar } from "@/components/chat-input-bar"
import { UserMessage } from "@/components/user-message"
import AssistantMessage from "@/components/assistant-message"
import { useCreateChat, useUpdateChat, useChat, useDeleteChat } from "@/hooks/api/chats"
import { useSelectedCourse, useSuggestedQueries } from "@/hooks/api/courses"
import { Message } from "@/features/chat/chat.types"
import { Skeleton } from "@/components/ui/skeleton"
import { chatStateService } from "@/features/chat/services/chat-state.service"
import { chatNavigationService } from "@/features/chat/services/chat-navigation.service"
import { chatStreamingService } from "@/features/chat/services/chat-streaming.service"
import { Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import logger from "@/lib/logger"

export function ChatPageContent({ chatId }: { chatId?: string }) {
  const router = useRouter()
  const { data: selectedCourse } = useSelectedCourse()

  // Local state for this chat instance
  const [messages, setMessages] = useState<Message[]>([])
  const [isReplying, setIsReplying] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Only fetch chat data if chatId is provided and it's not an optimistic ID
  const isOptimisticId = chatStateService.isOptimisticChatId(chatId)
  const { data: chat, isLoading: isLoadingChat, error: chatError } = useChat(
    isOptimisticId ? undefined : chatId
  )

  // React Query mutations
  const createChatMutation = useCreateChat()
  const updateChatMutation = useUpdateChat()
  const deleteChatMutation = useDeleteChat()
  
  const { data: suggestedQueries = [], isLoading: isLoadingSuggestedQueries } = useSuggestedQueries(selectedCourse?.id)

  const continueStreamingForOptimisticChat = useCallback(async (
    messageContent: string, 
    optimisticChatId: string
  ) => {
    try {
      logger.info({ optimisticChatId, messageContent }, '[ChatPage] Continuing streaming for optimistic chat');
      
      if (!selectedCourse) {
        throw new Error('Please select a course first');
      }

      const response = await chatStreamingService.sendMessage(
        messageContent,
        [], // Empty conversation history for new chats
        selectedCourse.id
      );

      await chatStreamingService.processStreamingResponse(response, {
        setMessages,
        messageContent,
        conversationHistory: [],
        isNewChat: true,
        chatId: optimisticChatId,
        createChatMutation,
        updateChatMutation,
        router,
        selectedCourse
      });

    } catch (error) {
      chatStateService.handleMessageError({ messages, setMessages, setIsReplying, setError }, error as Error, 1);
    } finally {
      setIsReplying(false);
    }
  }, [selectedCourse, createChatMutation, updateChatMutation, router, messages]);

  const continueStreamingRef = useRef(continueStreamingForOptimisticChat);
  continueStreamingRef.current = continueStreamingForOptimisticChat;

  // Load chat data from database for real chats or session storage for optimistic ones
  useEffect(() => {
    if (chat && chatId && !isOptimisticId && !isReplying) {
      const convertedMessages = chatStateService.loadChatFromDatabase(chat)
      setMessages(convertedMessages)
      setError(null)
    } else if (!chatId) {
      // Dashboard mode - show welcome message
      setMessages([{
        id: 'welcome',
        type: 'assistant',
        content: 'Hello! How can I help you today?',
        linkedDocumentIds: []
      }])
      setError(null)
      setIsReplying(false)
    } else if (isOptimisticId) {
      const storedState = chatStateService.loadOptimisticChatState(chatId);
      if (storedState) {
        setMessages(storedState.messages);
        setIsReplying(true);
        
        if (storedState.shouldContinueStreaming && storedState.userMessage) {
          setTimeout(() => {
            continueStreamingRef.current(storedState.userMessage!, chatId);
          }, 0);
        }
      }
    }
  }, [chat, chatId, isOptimisticId, isReplying]);

  // Handle chat loading errors
  useEffect(() => {
    if (chatError) {
      const errorMessage = chatError instanceof Error ? chatError.message : 'Failed to load chat'
      setError(errorMessage)
      logger.error({ error: chatError, chatId }, '[ChatPage] Failed to load chat')
    }
  }, [chatError, chatId])

  // Track previous chatId to detect real chat switches
  const [previousChatId, setPreviousChatId] = useState<string | undefined>(chatId)
  
  // Clear state when switching between different real chats
  useEffect(() => {
    const shouldClear = chatNavigationService.shouldClearStateForNavigation(
      previousChatId, 
      chatId
    )
    
    if (shouldClear) {
      chatStateService.clearChatState({ messages, setMessages, setIsReplying, setError }, 'Real chat navigation')
    }
    
    chatNavigationService.logNavigationTransition(previousChatId, chatId, shouldClear)
    setPreviousChatId(chatId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatId, previousChatId])

  const handleSendMessage = useCallback(async (messageContent: string, targetChatId?: string) => {
    if (!selectedCourse) {
      setError('Please select a course first')
      return
    }
    
    setIsReplying(true)
    setError(null)

    const isNewChat = !targetChatId
    let currentChatId = targetChatId
    
    if (isNewChat) {
      setMessages([]) 
      currentChatId = chatStateService.generateOptimisticChatId()
      chatNavigationService.navigateToOptimisticChat(router, currentChatId!)
    }

    const { userMessage, assistantMessage } = chatStateService.createInitialMessages(messageContent)
    
    setMessages(prev => [...(isNewChat ? [] : prev), userMessage, assistantMessage])

    try {
      const conversationHistory = chatStateService.getConversationHistory(isNewChat ? [] : messages)

      const response = await chatStreamingService.sendMessage(
        messageContent,
        conversationHistory,
        selectedCourse.id
      )

      await chatStreamingService.processStreamingResponse(response, {
        setMessages,
        messageContent,
        conversationHistory,
        isNewChat,
        chatId: currentChatId!,
        createChatMutation,
        updateChatMutation,
        router,
        selectedCourse,
      })
    } catch (error) {
      chatStateService.handleMessageError({ messages, setMessages, setIsReplying, setError }, error as Error)
    } finally {
      setIsReplying(false)
    }
  }, [messages, selectedCourse, createChatMutation, updateChatMutation, router])

  const handleDeleteChat = useCallback(async (chatIdToDelete: string) => {
    try {
      await deleteChatMutation.mutateAsync(chatIdToDelete)
      chatNavigationService.handleChatDeletionNavigation(
        { router, currentChatId: chatId },
        chatIdToDelete
      )
      logger.info({ chatId: chatIdToDelete }, '[ChatPage] Deleted chat')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete chat'
      setError(errorMessage)
      logger.error({ error, chatId: chatIdToDelete }, '[ChatPage] Failed to delete chat')
    }
  }, [deleteChatMutation, router, chatId])

  const handleSuggestedQueryClick = useCallback((query: string) => {
    handleSendMessage(query)
  }, [handleSendMessage])

  const handleFormSubmit = async (values: { message: string }) => {
    await handleSendMessage(values.message, chatId)
  }

  const showThinkingIndicator = chatStateService.shouldShowThinkingIndicator(messages, isReplying)

  return (
    <div className="mx-auto w-full max-w-3xl h-full flex flex-col p-6 gap-4">
      {error && <div className="text-red-500 p-4 text-center bg-red-100 rounded-md">{error}</div>}
      
      <div className="flex-1 overflow-y-auto no-scrollbar">
        <div className="flex flex-col gap-4">
          {messages.map((message, i) =>
            message.type === "user" ? (
              <UserMessage key={message.id || i} className="w-fit max-w-[80%] self-end">
                {message.content}
              </UserMessage>
            ) : (
              <AssistantMessage 
                key={message.id || i} 
                content={message.content}
                linkedDocumentIds={message.linkedDocumentIds}
                isStreaming={isReplying && i === messages.length - 1}
                className="w-fit max-w-[80%] self-start"
              />

            )
          )}
        </div>
      </div>
      
      <div>
        {chatId === undefined && (isLoadingSuggestedQueries || suggestedQueries.length > 0) && (
          <div className="w-full overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] mb-4">
            <div className="flex gap-2">
              {isLoadingSuggestedQueries ? (
                <>
                  <Skeleton className="h-8 w-32 rounded-full" />
                  <Skeleton className="h-8 w-40 rounded-full" />
                  <Skeleton className="h-8 w-24 rounded-full" />
                </>
              ) : (
                suggestedQueries.map((suggestion, index) => (
                  <Button
                    key={index}
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
        )}
        
        {showThinkingIndicator && (
          <div className="mx-auto w-full max-w-3xl flex justify-start mb-4">
            <div className="py-0 max-w-xl">
              <div className="flex items-center space-x-2 text-gray-500">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                </div>
                <span className="text-sm">StudySpot is thinking...</span>
              </div>
            </div>
          </div>
        )}
        
        <ChatInputBar onSubmit={handleFormSubmit} isSubmitting={isReplying} />
      </div>
    </div>
  )
}
