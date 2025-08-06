"use client"

import { Suspense } from "react"
import { ChatPageContent } from "./chat-client"
import { Skeleton } from "@studyspot/ui/components/skeleton"

function ChatLoading() {
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

export default function NewChatPage() {
  return (
    <Suspense fallback={<ChatLoading />}>
      <ChatPageContent />
    </Suspense>
  )
}