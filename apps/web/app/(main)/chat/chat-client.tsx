"use client"

import { useCallback, useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { ChatInputBar } from "@/components/chat-input-bar"
import { UserMessage } from "@/components/user-message"
import AssistantMessage from "@/components/assistant-message"
import { useCreateChat, useChat, useDeleteChat } from "@/hooks/api/chats"
import { useSelectedCourse } from "@/hooks/api/courses"
import { Message } from "@/features/chat/chat.types"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { chatStateService } from "@/features/chat/services/chat-state.service"
import { chatNavigationService } from "@/features/chat/services/chat-navigation.service"
import { chatStreamingService } from "@/features/chat/services/chat-streaming.service"
import logger from "@/lib/logger"

export function ChatPageContent({ chatId }: { chatId?: string }) {
  const router = useRouter()
  const { data: selectedCourse } = useSelectedCourse()

  // Local state for this chat instance
  const [messages, setMessages] = useState<Message[]>([])
  const [isReplying, setIsReplying] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Only fetch chat data if chatId is provided
  const { data: chat, isLoading: isLoadingChat, error: chatError } = useChat(chatId)

  // React Query mutations
  const createChatMutation = useCreateChat()
  const deleteChatMutation = useDeleteChat()


  // Load chat data or show welcome message
  useEffect(() => {
    if (!chatId) {
      // Dashboard mode - show welcome message
      setMessages([{
        id: 'welcome',
        role: 'assistant',
        content: 'Hello! How can I help you today?'
      }])
      setError(null)
      setIsReplying(false)
    }
  }, [chatId]);

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
    
    if (!targetChatId) {
      setError('No chat ID provided')
      return
    }
    
    if (isReplying) {
      return // Prevent double submissions
    }
    
    setIsReplying(true)
    setError(null)

    try {
      const { userMessage, assistantMessage } = chatStateService.createInitialMessages(messageContent)
      setMessages(prev => [...prev, userMessage, assistantMessage])

      const conversationHistory = chatStateService.getConversationHistory(messages)
      
      const response = await chatStreamingService.sendMessage(
        messageContent,
        conversationHistory,
        selectedCourse.id
      )

      await chatStreamingService.processStreamingResponse(response, {
        setMessages,
        messageContent,
        conversationHistory,
        isNewChat: false,
        chatId: targetChatId,
        router,
        selectedCourse,
        setIsReplying
      })
    } catch (error) {
      chatStateService.handleMessageError({ messages, setMessages, setIsReplying, setError }, error as Error)
    }
  }, [messages, selectedCourse, router, isReplying])

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


  const handleFormSubmit = async (values: { message: string }) => {
    await handleSendMessage(values.message, chatId)
  }

  const showThinkingIndicator = chatStateService.shouldShowThinkingIndicator(messages, isReplying)

  return (
    <div className="mx-auto w-full max-w-3xl h-full flex flex-col p-6 pt-0">
      {error && <div className="text-red-500 p-4 text-center bg-red-100 rounded-md">{error}</div>}
      
      <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
        <div className="flex flex-col gap-4 py-4">
          {messages.map((message, i) =>
            message.role === "user" ? (
              <UserMessage key={message.id || i} className="w-fit max-w-[80%] self-end">
                {message.content}
              </UserMessage>
            ) : (
              <div key={message.id || i} className="w-fit max-w-[80%] self-start">
                <AssistantMessage 
                  content={message.content}
                  linkedResources={message.linkedResources}
                  isStreaming={isReplying && i === messages.length - 1}
                />
              </div>

            )
          )}
        </div>
      </div>
      
      <div>
        
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
