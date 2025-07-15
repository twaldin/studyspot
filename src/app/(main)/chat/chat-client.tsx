"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { ChatInputBar } from "@/components/chat-input-bar"
import { UserMessage } from "@/components/user-message"
import { AssistantMessage } from "@/components/assistant-message"

type Message = {
  role: "user" | "assistant"
  content: string
}

export function ChatPageContent() {
  const searchParams = useSearchParams()
  const initialMessage = searchParams.get("message")

  const [messages, setMessages] = useState<Message[]>(() => {
    const initialMessages: Message[] = []
    if (initialMessage) {
      initialMessages.push({
        role: "user",
        content: initialMessage,
      })
      initialMessages.push({
        role: "assistant",
        content: "This is a sample response.",
      })
    } else {
      initialMessages.push({
        role: "assistant",
        content: "Hello! How can I help you today?",
      })
    }
    return initialMessages
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleNewMessage = (newMessage: Message) => {
    setMessages(prevMessages => [...prevMessages, newMessage])
  }

  const handleFormSubmit = async (values: { message: string }) => {
    setIsSubmitting(true)
    const newMessage = { role: "user" as const, content: values.message }
    handleNewMessage(newMessage)

    // Simulate an API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    setIsSubmitting(false)
  }

  return (
    <div className="mx-auto w-full max-w-3xl h-full flex flex-col p-6 gap-4">
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col gap-4">
          {messages.map((message, i) =>
            message.role === "user" ? (
              <UserMessage key={i} className="w-fit max-w-2xl self-end">
                {message.content}
              </UserMessage>
            ) : (
              <AssistantMessage key={i} className="w-fit max-w-2xl self-start">
                {message.content}
              </AssistantMessage>
            )
          )}
        </div>
      </div>
      <div>
        <ChatInputBar onSubmit={handleFormSubmit} isSubmitting={isSubmitting} />
      </div>
    </div>
  )
} 