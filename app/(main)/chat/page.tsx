"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { ChatInputBar } from "@/components/chat-input-bar";
import { Card, CardContent } from "@/components/ui/card";

export default function ChatPage() {
  const searchParams = useSearchParams();
  const initialMessage = searchParams.get("message");
  
  const [messages, setMessages] = useState(initialMessage ? [{
    role: "user",
    content: initialMessage
  }] : []);
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNewMessage = (newMessage: {
    role: "user";
    content: string;
  }) => {
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  };

  const handleFormSubmit = async (values: { message: string }) => {
    setIsSubmitting(true);
    const newMessage = { role: "user" as const, content: values.message };
    handleNewMessage(newMessage);

    // Simulate an API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSubmitting(false);
  };
  
  return (
    <div className="mx-auto w-full max-w-3xl h-full flex flex-col p-6 gap-4">
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col gap-4">
          {messages.map((message, i) => (
            <Card key={i} className="w-fit max-w-2xl self-end py-0">
              <CardContent className="p-4">
                <p>{message.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <div>
        <ChatInputBar
          onSubmit={handleFormSubmit}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
} 