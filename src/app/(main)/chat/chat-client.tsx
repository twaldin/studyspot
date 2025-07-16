"use client"

import { useCallback, useEffect, useState, useRef } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { ChatInputBar } from "@/components/chat-input-bar"
import { UserMessage } from "@/components/user-message"
import { AssistantMessage } from "@/components/assistant-message"
import { useCreateChat, useUpdateChat } from "@/hooks/api/chats"
import { useSelectedCourse } from "@/hooks/api/courses"
import { Message } from "@/features/chat/chat.types"
import { chatStateService } from "@/features/chat/services/chat-state.service"
import { chatNavigationService } from "@/features/chat/services/chat-navigation.service"
import { chatStreamingService } from "@/features/chat/services/chat-streaming.service"

export function ChatPageContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const initialMessage = searchParams.get("message")
  
  const { data: selectedCourse } = useSelectedCourse()
  const createChatMutation = useCreateChat()
  const updateChatMutation = useUpdateChat()

  const [messages, setMessages] = useState<Message[]>(() => {
    if (!initialMessage) {
      return [{
        id: Date.now().toString(),
        type: "assistant",
        content: "Hello! How can I help you today?",
        linkedDocumentIds: []
      }]
    }
    return []
  })

  const [isReplying, setIsReplying] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const initialMessageProcessed = useRef(false)

  // Handle new chat creation with optimistic updates
  const handleSendMessage = useCallback(async (messageContent: string) => {
    if (!selectedCourse) {
      setError('Please select a course first')
      return
    }

    setIsReplying(true)
    setError(null)

    try {
      // Generate optimistic chat ID
      const optimisticChatId = chatStateService.generateOptimisticChatId()
      
      // Create initial messages
      const { userMessage, assistantMessage } = chatStateService.createInitialMessages(messageContent)
      
      // Add messages to state
      chatStateService.addMessagesToChat(
        { messages, setMessages, setIsReplying, setError },
        userMessage,
        assistantMessage
      )

      // Store state and navigate to optimistic chat
      const allMessages = [...messages, userMessage, assistantMessage]
      chatStateService.storeOptimisticChatState(optimisticChatId, allMessages)
      chatNavigationService.navigateToOptimisticChat(router, optimisticChatId)

      // The optimistic chat page will handle the actual streaming and chat creation

    } catch (error) {
      console.error('Failed to create optimistic chat:', error)
      setError(error instanceof Error ? error.message : 'Failed to create chat')
      setIsReplying(false)
    }
  }, [selectedCourse, messages, createChatMutation, updateChatMutation, router])

  // Handle initial message from URL parameter
  useEffect(() => {
    if (initialMessage && selectedCourse && messages.length === 0 && !initialMessageProcessed.current) {
      initialMessageProcessed.current = true
      handleSendMessage(initialMessage)
    }
  }, [initialMessage, selectedCourse, messages.length]) // Remove handleSendMessage from deps

  const handleFormSubmit = async (values: { message: string }) => {
    await handleSendMessage(values.message)
  }

  return (
    <div className="mx-auto w-full max-w-3xl h-full flex flex-col p-6 gap-4">
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