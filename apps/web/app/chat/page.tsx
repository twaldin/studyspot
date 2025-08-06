"use client"

// Force dynamic rendering for authentication
export const dynamic = 'force-dynamic';

import { ChatPageContent } from "./chat-client"

export default function NewChatPage() {
  return <ChatPageContent />
}