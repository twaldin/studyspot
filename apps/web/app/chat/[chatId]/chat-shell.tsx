"use client"

import { ChatInputBar } from "@/components/chat-input-bar"
import { Skeleton } from "@studyspot/ui/components/skeleton"

export function ChatPageShell() {
  return (
    <div className="mx-auto w-full max-w-3xl h-full flex flex-col p-6 gap-4">
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col gap-4">
          <Skeleton className="w-48 h-12 rounded-lg self-end" />
          <Skeleton className="w-64 h-16 rounded-lg self-start" />
          <Skeleton className="w-56 h-10 rounded-lg self-end" />
          <Skeleton className="w-72 h-20 rounded-lg self-start" />
        </div>
      </div>
      
      <div>
        {/* Show the actual input bar immediately for instant feel */}
        <ChatInputBar 
          onSubmit={() => {}} 
          isSubmitting={false}
          placeholder="Loading chat..."
          disabled={true}
        />
      </div>
    </div>
  )
}