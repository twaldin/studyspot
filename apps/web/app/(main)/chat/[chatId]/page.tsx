"use client"

import { Suspense } from "react"
import { ChatPageContent } from "./chat-client"
import { ChatPageShell } from "./chat-shell"

export default function ChatPage() {
  return (
    <Suspense fallback={<ChatPageShell />}>
      <ChatPageContent />
    </Suspense>
  )
}
