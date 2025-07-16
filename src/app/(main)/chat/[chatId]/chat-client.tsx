"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import { ChatInputBar } from "@/components/chat-input-bar"
import { UserMessage } from "@/components/user-message"
import AssistantMessage from "@/components/assistant-message"
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
  const [initialMessage, setInitialMessage] = useState<string | null>(null)
  
  const { data: chat, isLoading: isLoadingChat, error: chatError } = useChat(chatId)
  const { data: selectedCourse } = useSelectedCourse()
  const createChatMutation = useCreateChat()
  const updateChatMutation = useUpdateChat()
  
  const [messages, setMessages] = useState<Message[]>([])
  const [isReplying, setIsReplying] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Check for initial message in sessionStorage
  useEffect(() => {
    if (chatId) {
      const storedInitialMessage = sessionStorage.getItem(`initial-message-${chatId}`)
      if (storedInitialMessage) {
        setInitialMessage(storedInitialMessage)
        // Clean up immediately after reading
        sessionStorage.removeItem(`initial-message-${chatId}`)
      }
    }
  }, [chatId])

  // Load chat data when available
  useEffect(() => {
    if (chat && chat.chats) {
      const convertedMessages = chatStateService.loadChatFromDatabase(chat)
      setMessages(convertedMessages)
      setError(null)
    }
  }, [chat])

  // Handle initial message streaming for new chats
  useEffect(() => {
    if (initialMessage && selectedCourse && chat && chatId && !isReplying) {
      // Check if we should start streaming (messages loaded from database)
      const shouldStartStreaming = messages.length > 0 && 
        messages[messages.length - 1].type === 'user' && 
        messages[messages.length - 1].content === initialMessage
      
      if (shouldStartStreaming) {
        setIsReplying(true)
        
        const startStreaming = async () => {
          try {
            // Create assistant message for streaming
            const assistantMessage: Message = {
              id: Date.now().toString() + '-assistant',
              content: '',
              type: 'assistant',
              linkedDocumentIds: []
            }
            
            setMessages(prev => [...prev, assistantMessage])
            
            // Start streaming with empty conversation history since this is the first message
            const response = await chatStreamingService.sendMessage(
              initialMessage,
              [], // Empty conversation history for first message
              selectedCourse.id
            )

            await chatStreamingService.processStreamingResponse(response, {
              setMessages,
              messageContent: initialMessage,
              conversationHistory: [],
              isNewChat: false,
              chatId: chatId,
              createChatMutation,
              updateChatMutation,
              router,
              selectedCourse,
              setIsReplying
            })
            
          } catch (error) {
            console.error('Failed to start streaming:', error)
            chatStateService.handleMessageError(
              { messages, setMessages, setIsReplying, setError },
              error instanceof Error ? error : new Error('Failed to start streaming')
            )
          }
        }
        
        startStreaming()
      }
    }
  }, [initialMessage, selectedCourse, chat, chatId, isReplying, messages, createChatMutation, updateChatMutation, router])

  // Handle chat loading errors
  useEffect(() => {
    if (chatError) {
      const errorMessage = chatError instanceof Error ? chatError.message : 'Failed to load chat'
      setError(errorMessage)
    }
  }, [chatError])

  const showThinkingIndicator = chatStateService.shouldShowThinkingIndicator(messages, isReplying)

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
        selectedCourse,
        setIsReplying
      })

    } catch (error) {
      console.error('Failed to send message:', error)
      chatStateService.handleMessageError(
        { messages, setMessages, setIsReplying, setError },
        error instanceof Error ? error : new Error('Failed to send message')
      )
    }
  }, [chatId, selectedCourse, messages, createChatMutation, updateChatMutation, router])

  if (!chatId) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div>Chat not found</div>
      </div>
    )
  }

  if (isLoadingChat) {
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
                content={message.content}
                linkedDocumentIds={message.linkedDocumentIds}
                isStreaming={isReplying && i === messages.length - 1 && message.content.trim().length > 0}
              />
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