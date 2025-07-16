"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import { ChatInputBar } from "@/components/chat-input-bar"
import { UserMessage } from "@/components/user-message"
import { AssistantMessage } from "@/components/assistant-message"
import { useChat, useCreateChat, useUpdateChat } from "@/hooks/api/chats"
import { useSelectedCourse } from "@/hooks/api/courses"
import { Message } from "@/features/chat/chat.types"
import { Skeleton } from "@/components/ui/skeleton"
import { chatStateService } from "@/features/chat/services/chat-state.service"
import { chatStreamingService } from "@/features/chat/services/chat-streaming.service"

export function ChatPageContent() {
  const params = useParams()
  const router = useRouter()
  const chatId = Array.isArray(params?.chatId) ? params.chatId[0] : params?.chatId
  
  // Check if this is an optimistic ID
  const isOptimisticId = chatStateService.isOptimisticChatId(chatId)
  
  const { data: chat, isLoading: isLoadingChat, error: chatError } = useChat(
    isOptimisticId ? undefined : chatId,  // Skip API call for optimistic IDs
    { enabled: !isOptimisticId }  // Disable query for optimistic IDs
  )
  const { data: selectedCourse } = useSelectedCourse()
  const createChatMutation = useCreateChat()
  const updateChatMutation = useUpdateChat()
  
  const [messages, setMessages] = useState<Message[]>([])
  const [isReplying, setIsReplying] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load chat data when available (for real chats)
  useEffect(() => {
    if (chat && chat.chats && !isOptimisticId) {
      const convertedMessages = chatStateService.loadChatFromDatabase(chat)
      setMessages(convertedMessages)
      setError(null)
    }
  }, [chat, isOptimisticId])

  // Load optimistic chat state if this is an optimistic ID
  useEffect(() => {
    if (isOptimisticId && chatId) {
      const storedState = chatStateService.loadOptimisticChatState(chatId)
      
      if (storedState) {
        setMessages(storedState.messages)
        
        // Continue streaming if needed
        if (storedState.shouldContinueStreaming && storedState.userMessage && selectedCourse) {
          setIsReplying(true)
          
          const continueStreaming = async () => {
            try {
              const response = await chatStreamingService.sendMessage(
                storedState.userMessage!,
                [],
                selectedCourse.id
              )

              await chatStreamingService.processStreamingResponse(response, {
                setMessages,
                messageContent: storedState.userMessage!,
                conversationHistory: [],
                isNewChat: true,
                chatId,
                createChatMutation,
                updateChatMutation,
                router,
                selectedCourse
              })
            } catch (error) {
              console.error('Failed to continue streaming:', error)
              chatStateService.handleMessageError(
                { messages, setMessages, setIsReplying, setError },
                error instanceof Error ? error : new Error('Failed to continue streaming')
              )
            } finally {
              setIsReplying(false)
            }
          }
          
          continueStreaming()
        }
      }
    }
  }, [isOptimisticId, chatId, selectedCourse, createChatMutation, updateChatMutation, router])

  // Handle chat loading errors
  useEffect(() => {
    if (chatError && !isOptimisticId) {
      const errorMessage = chatError instanceof Error ? chatError.message : 'Failed to load chat'
      setError(errorMessage)
    }
  }, [chatError, isOptimisticId])

  const handleFormSubmit = useCallback(async (values: { message: string }) => {
    if (!selectedCourse) {
      setError('Please select a course first')
      return
    }

    setIsReplying(true)
    setError(null)

    try {
      // Create initial messages
      const { userMessage, assistantMessage } = chatStateService.createInitialMessages(values.message)
      
      // Add messages to state
      chatStateService.addMessagesToChat(
        { messages, setMessages, setIsReplying, setError },
        userMessage,
        assistantMessage
      )

      // Get conversation history
      const conversationHistory = chatStateService.getConversationHistory(messages)

      // Start streaming
      const response = await chatStreamingService.sendMessage(
        values.message,
        conversationHistory,
        selectedCourse.id
      )

      await chatStreamingService.processStreamingResponse(response, {
        setMessages,
        messageContent: values.message,
        conversationHistory,
        isNewChat: false,
        chatId: chatId!,
        createChatMutation,
        updateChatMutation,
        router,
        selectedCourse
      })

    } catch (error) {
      console.error('Failed to send message:', error)
      chatStateService.handleMessageError(
        { messages, setMessages, setIsReplying, setError },
        error instanceof Error ? error : new Error('Failed to send message')
      )
    } finally {
      setIsReplying(false)
    }
  }, [chatId, selectedCourse, messages, createChatMutation, updateChatMutation, router])

  if (!chatId) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div>Chat not found</div>
      </div>
    )
  }

  if (isLoadingChat && !isOptimisticId) {
    return (
      <div className="mx-auto w-full max-w-3xl h-full flex flex-col p-6 gap-4">
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
    <div className="mx-auto w-full max-w-3xl h-full flex flex-col p-6 gap-4">
      {error && (
        <div className="bg-destructive/15 text-destructive px-4 py-2 rounded-md text-sm">
          {error}
        </div>
      )}
      
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col gap-4">
          {messages.map((message, i) =>
            message.type === "user" ? (
              <UserMessage key={message.id || i} className="w-fit max-w-2xl self-end">
                {message.content}
              </UserMessage>
            ) : (
              <AssistantMessage 
                key={message.id || i} 
                className="w-fit max-w-2xl self-start"
                isThinking={chatStateService.shouldShowThinkingIndicator(messages, isReplying) && i === messages.length - 1}
                isStreaming={isReplying && i === messages.length - 1 && message.content.trim().length > 0}
              >
                {message.content}
              </AssistantMessage>
            )
          )}
        </div>
      </div>
      
      <div>
        <ChatInputBar onSubmit={handleFormSubmit} isSubmitting={isReplying} />
      </div>
    </div>
  )
}