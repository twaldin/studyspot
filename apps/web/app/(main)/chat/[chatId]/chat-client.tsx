"use client"

import React, { useState, useEffect, useCallback, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { ChatInputBar } from "@/components/chat-input-bar"
import { UserMessage } from "@/components/user-message"
import AssistantMessage from "@/components/assistant-message"
import { useChat, useCreateChat, useUpdateChat } from "@/hooks/api/chats"
import { useSelectedCourse } from "@/hooks/api/courses"
import { Message } from "@/features/chat/chat.types"
import { Skeleton } from "@/components/ui/skeleton"
import { ScrollToBottomButton } from "@/components/scroll-to-bottom"
import { chatStateService } from "@/features/chat/services/chat-state.service"
import { chatStreamingService } from "@/features/chat/services/chat-streaming.service"
import { useStreamingChats } from "@/features/chat/PendingChatContext"
import logger from "@/lib/logger"

export function ChatPageContent() {
  const params = useParams()
  const router = useRouter()
  const chatId = Array.isArray(params?.chatId) ? params.chatId[0] : params?.chatId
  const [initialMessage, setInitialMessage] = useState<string | null>(null)
  const [tempCourse, setTempCourse] = useState<any>(null)
  const [isTemporaryChat, setIsTemporaryChat] = useState(false)
  const [pendingStreamResponse, setPendingStreamResponse] = useState<{fullResponse: string, linkedDocumentIds: string[]} | null>(null)
  const tempStreamingStarted = useRef(false)
  const pendingResponseProcessed = useRef(false)
  const realChatId = useRef<string | null>(null)
  
  // Only fetch real chat data if not a temporary chat
  const { data: chat, isLoading: isLoadingChat, error: chatError } = useChat(
    chatId, 
    { enabled: chatId ? !chatId.startsWith('temp-') : false }
  )
  const { data: selectedCourse } = useSelectedCourse()
  const createChatMutation = useCreateChat()
  const updateChatMutation = useUpdateChat()
  const { setStreamingStatus } = useStreamingChats()
  
  const [messages, setMessages] = useState<Message[]>([])
  const [isReplying, setIsReplying] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isAtBottom, setIsAtBottom] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  // Custom streaming processor for temporary chats that captures the response
  const processTemporaryStreamingResponse = useCallback(async (response: Response, context: any) => {
    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    let fullResponse = '';

    if (!reader) {
      throw new Error('Response body is not readable');
    }

    try {
      let linkedDocumentIds: string[] = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));

              if (data.chunk) {
                fullResponse += data.chunk;
                // Update UI immediately
                setMessages(prev => {
                  const newMessages = [...prev];
                  const lastMessage = newMessages[newMessages.length - 1];
                  if (lastMessage && lastMessage.type === 'assistant') {
                    lastMessage.content = fullResponse;
                  }
                  return newMessages;
                });
              } else if (data.done) {
                linkedDocumentIds = data.linkedDocumentIds || [];
                // Update UI with final linked documents
                setMessages(prev => {
                  const newMessages = [...prev];
                  const lastMessage = newMessages[newMessages.length - 1];
                  if (lastMessage && lastMessage.type === 'assistant') {
                    lastMessage.linkedDocumentIds = linkedDocumentIds;
                  }
                  return newMessages;
                });
                break;
              } else if (data.error) {
                throw new Error(data.error);
              }
            } catch (parseError) {
              console.warn({ parseError, line }, 'Failed to parse streaming chunk');
            }
          }
        }
      }

      // Store the response for when real chat becomes available
      logger.info('Setting pending stream response:', { fullResponse, linkedDocumentIds });
      setPendingStreamResponse({ fullResponse, linkedDocumentIds });
      
      // If we already have a real chat ID, save immediately
      if (realChatId.current && !pendingResponseProcessed.current) {
        logger.info('Real chat ID available, saving response immediately:', { realChatId: realChatId.current });
        pendingResponseProcessed.current = true;
        
        const finalMessages = [
          { role: 'user', content: initialMessage || '' },
          { role: 'assistant', content: fullResponse, linkedDocumentIds }
        ];
        
        updateChatMutation.mutateAsync({
          chatId: realChatId.current,
          data: { messages: finalMessages }
        }).then(() => {
          logger.info('Successfully saved streaming response to real chat', { chatId: realChatId.current });
          
          // Cache will be updated automatically by updateChatMutation
          
          setPendingStreamResponse(null);
        }).catch((error) => {
          logger.error('Failed to save streaming response to real chat:', error);
          pendingResponseProcessed.current = false;
        });
      }

    } finally {
      reader.releaseLock();
      setIsReplying(false);
      
      // Update streaming status - streaming is complete
      if (chatId) {
        setStreamingStatus(chatId, 'Chat', false);
      }
    }
  }, [initialMessage, updateChatMutation, setPendingStreamResponse, setMessages, setIsReplying, chatId, setStreamingStatus]);

  // Scroll to bottom function
  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'end'
      })
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

  // Handle chat ID changes and initialize state
  useEffect(() => {
    if (!chatId) return;

    // Clear messages when chat changes
    setMessages([])
    
    if (chatId.startsWith('temp-')) {
      // Handle temporary chat
        setIsTemporaryChat(true)
      tempStreamingStarted.current = false
      pendingResponseProcessed.current = false
      
      const tempMessage = sessionStorage.getItem(`temp-message-${chatId}`)
      const tempCourseData = sessionStorage.getItem(`temp-course-${chatId}`)
      
      if (tempMessage) {
        setInitialMessage(tempMessage)
      }
      if (tempCourseData) {
        try {
          setTempCourse(JSON.parse(tempCourseData))
        } catch (e) {
          console.error('Failed to parse temp course data:', e)
        }
      }
    } else {
      // Handle real chat
      setIsTemporaryChat(false)
      realChatId.current = chatId // Store real chat ID
      const storedInitialMessage = sessionStorage.getItem(`initial-message-${chatId}`)
      if (storedInitialMessage) {
        setInitialMessage(storedInitialMessage)
        sessionStorage.removeItem(`initial-message-${chatId}`)
      }
    }
  }, [chatId])

  // Separate effect to handle pending response saving (only for real chats)
  useEffect(() => {
    if (!chatId || chatId.startsWith('temp-') || !pendingStreamResponse || pendingResponseProcessed.current) {
      logger.info('Skipping pending response save:', { 
        chatId, 
        isTemp: chatId?.startsWith('temp-'), 
        hasPendingResponse: !!pendingStreamResponse, 
        alreadyProcessed: pendingResponseProcessed.current 
      });
      return;
    }
    
    logger.info('Processing pending response for real chat:', { chatId, pendingStreamResponse });
    
    // Capture values to avoid dependencies on state
    const currentPendingResponse = pendingStreamResponse;
    const currentInitialMessage = initialMessage;
    
    pendingResponseProcessed.current = true;
    const finalMessages = [
      { role: 'user', content: currentInitialMessage || '' },
      { role: 'assistant', content: currentPendingResponse.fullResponse, linkedDocumentIds: currentPendingResponse.linkedDocumentIds }
    ];
    
    logger.info('Saving final messages to database:', { chatId, finalMessages });
    
    updateChatMutation.mutateAsync({
      chatId: chatId,
      data: { messages: finalMessages }
    }).then(() => {
      // Cache will be updated automatically by updateChatMutation
      
      // Use setTimeout to avoid immediate state update in same render cycle
      setTimeout(() => setPendingStreamResponse(null), 0);
      logger.info({ chatId }, 'Successfully updated real chat with pending stream response');
    }).catch((error) => {
      logger.error('Failed to update real chat with pending response:', error);
      pendingResponseProcessed.current = false; // Reset on error to allow retry
    });
  }, [chatId, pendingStreamResponse, initialMessage, updateChatMutation])

  // Load chat data when available, but only if messages are not already populated
  useEffect(() => {
    if (chat && chat.chats && messages.length === 0) {
      const convertedMessages = chatStateService.loadChatFromDatabase(chat)
      setMessages(convertedMessages)
      setError(null)
    }
  }, [chat, messages.length])


  // Handle immediate streaming for temporary chats
  useEffect(() => {
    if (isTemporaryChat && initialMessage && tempCourse && !isReplying && !tempStreamingStarted.current) {
      tempStreamingStarted.current = true // Prevent re-execution
      setIsReplying(true)
      
      // Update streaming status - streaming is starting
      if (chatId) {
        setStreamingStatus(chatId, 'New Chat', true);
      }
      
      // Immediately show user message and start streaming
      const userMessage: Message = {
        id: Date.now().toString() + '-user',
        content: initialMessage,
        type: 'user',
        linkedDocumentIds: []
      }
      
      const assistantMessage: Message = {
        id: Date.now().toString() + '-assistant',
        content: '',
        type: 'assistant',
        linkedDocumentIds: []
      }
      
      setMessages([userMessage, assistantMessage])
      
      const startImmediateStreaming = async () => {
        try {
          const response = await chatStreamingService.sendMessage(
            initialMessage,
            [], // Empty conversation history for first message
            tempCourse.id
          )

          // Use a custom streaming processor that captures the response for later
          await processTemporaryStreamingResponse(response, {
            setMessages,
            messageContent: initialMessage,
            conversationHistory: [],
            isNewChat: true,
            chatId: undefined, // No real chat ID yet
            createChatMutation,
            updateChatMutation,
            router,
            selectedCourse: tempCourse,
            setIsReplying
          })
          
        } catch (error) {
          console.error('Failed to start immediate streaming:', error)
          // Update streaming status - streaming failed
          if (chatId) {
            setStreamingStatus(chatId, 'New Chat', false);
          }
          chatStateService.handleMessageError(
            { messages: [], setMessages, setIsReplying, setError },
            error instanceof Error ? error : new Error('Failed to start streaming')
          )
        }
      }
      
      startImmediateStreaming()
    }
  }, [isTemporaryChat, initialMessage, tempCourse, isReplying, createChatMutation, updateChatMutation, router, processTemporaryStreamingResponse, chatId, setStreamingStatus])

  // Handle initial message streaming for real chats
  useEffect(() => {
    if (!isTemporaryChat && initialMessage && selectedCourse && chat && chatId && !isReplying) {
      // Check if we should start streaming (messages loaded from database)
      const shouldStartStreaming = messages.length > 0 && 
        messages[messages.length - 1].type === 'user' && 
        messages[messages.length - 1].content === initialMessage
      
      if (shouldStartStreaming) {
        setIsReplying(true)
        
        // Update streaming status for real chat
        if (chatId) {
          setStreamingStatus(chatId, 'Chat', true);
        }
        
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
            // Update streaming status - streaming failed
            if (chatId) {
              setStreamingStatus(chatId, 'Chat', false);
            }
            chatStateService.handleMessageError(
              { messages, setMessages, setIsReplying, setError },
              error instanceof Error ? error : new Error('Failed to start streaming')
            )
          }
        }
        
        startStreaming()
      }
    }
  }, [isTemporaryChat, initialMessage, selectedCourse, chat, chatId, isReplying, messages, createChatMutation, updateChatMutation, router, setStreamingStatus])

  // Handle chat loading errors
  useEffect(() => {
    if (chatError) {
      const errorMessage = chatError instanceof Error ? chatError.message : 'Failed to load chat'
      setError(errorMessage)
    }
  }, [chatError])


  const showThinkingIndicator = chatStateService.shouldShowThinkingIndicator(messages, isReplying)

  const handleFormSubmit = useCallback(async (values: { message: string }) => {
    const currentCourse = isTemporaryChat ? tempCourse : selectedCourse
    if (!currentCourse) {
      setError('Please select a course first')
      return
    }

    setIsReplying(true)
    setError(null)
    
    // Update streaming status - new message streaming
    if (chatId) {
      setStreamingStatus(chatId, 'Chat', true);
    }

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
        currentCourse.id
      )

      await chatStreamingService.processStreamingResponse(response, {
        setMessages,
        messageContent: values.message,
        conversationHistory,
        isNewChat: false,
        chatId: isTemporaryChat ? undefined : chatId!,
        createChatMutation,
        updateChatMutation,
        router,
        selectedCourse: currentCourse,
        setIsReplying
      })

    } catch (error) {
      console.error('Failed to send message:', error)
      // Update streaming status - streaming failed
      if (chatId) {
        setStreamingStatus(chatId, 'Chat', false);
      }
      chatStateService.handleMessageError(
        { messages, setMessages, setIsReplying, setError },
        error instanceof Error ? error : new Error('Failed to send message')
      )
    }
  }, [chatId, isTemporaryChat, tempCourse, selectedCourse, messages, createChatMutation, updateChatMutation, router, setStreamingStatus])

  if (!chatId) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div>Chat not found</div>
      </div>
    )
  }

  // For non-temporary chats, show the shell immediately with the input bar
  const showLoadingMessages = !isTemporaryChat && isLoadingChat;
  const showEmptyState = !isTemporaryChat && !isLoadingChat && !chat;

  if (!isTemporaryChat && isLoadingChat) {
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