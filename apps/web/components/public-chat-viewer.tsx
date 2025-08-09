'use client';

import React from 'react';
import { UserMessage } from '@/components/user-message';
import AssistantMessage from '@/components/assistant-message';
import { Button } from '@studyspot/ui/components/button';
import { SignUpButton } from '@clerk/nextjs';
import { UserPlus, MessageSquare } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  linkedResources?: any[];
}

interface PublicChatViewerProps {
  chatData: {
    id: string;
    title: string;
    messages: Message[];
    course: {
      code: string;
      title: string;
      school: {
        name: string;
      };
    };
  };
  onSignUpPrompt: () => void;
}

export function PublicChatViewer({ chatData, onSignUpPrompt }: PublicChatViewerProps) {
  const messages = Array.isArray(chatData.messages) ? chatData.messages : [];

  return (
    <div className="mx-auto w-full max-w-3xl h-full flex flex-col p-6">
      {messages.length > 0 ? (
        <>
          {/* Messages - scrollable area */}
          <div className="flex-1 overflow-y-auto">
            <div className="flex flex-col gap-4 py-4">
              {messages.map((message, i) =>
                message.role === 'user' ? (
                  <UserMessage key={i} className="w-fit max-w-2xl self-end">
                    {message.content}
                  </UserMessage>
                ) : (
                  <AssistantMessage
                    key={i}
                    content={message.content}
                    linkedResources={message.linkedResources}
                    isStreaming={false}
                    isTextStreaming={false}
                    chatId={chatData.id}
                    chatTitle={chatData.title}
                    isPublicShare={true}
                  />
                )
              )}
            </div>
          </div>

          {/* Call to action - sticky at bottom */}
          <div className="border-t pt-4 text-center flex-shrink-0">
            <p className="text-sm text-muted-foreground mb-3">
              Want to continue this conversation or start your own?
            </p>
            <SignUpButton mode="modal" forceRedirectUrl={typeof window !== 'undefined' ? window.location.href : undefined}>
              <Button className="w-full sm:w-auto cursor-pointer">
                <UserPlus className="h-4 w-4 mr-2" />
                Sign Up to StudySpot
              </Button>
            </SignUpButton>
          </div>
        </>
      ) : (
        /* Empty state - centered in full viewport */
        <div className="flex-1 flex items-center justify-center text-center">
          <div>
            <MessageSquare className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">This chat doesn't have any messages yet.</p>
            <SignUpButton mode="modal" forceRedirectUrl={typeof window !== 'undefined' ? window.location.href : undefined}>
              <Button className="cursor-pointer">
                <UserPlus className="h-4 w-4 mr-2" />
                Sign Up to Start Chatting
              </Button>
            </SignUpButton>
          </div>
        </div>
      )}
    </div>
  );
}