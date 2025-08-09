'use client';

import { useParams, notFound, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { PublicChatViewer } from '@/components/public-chat-viewer';
import { AnonymousUserProvider } from '@/contexts/anonymous-user-context';
import { AnonymousSignInPrompt } from '@/components/anonymous-signin-prompt';
import { SignUpButton, SignInButton, useUser } from '@clerk/nextjs';
import { Button } from '@studyspot/ui/components/button';
import { UserPlus, LogIn, MessageSquare, Eye } from 'lucide-react';
import toast from 'react-hot-toast';

export default function PublicChatPage() {
  const params = useParams();
  const router = useRouter();
  const { isSignedIn, isLoaded } = useUser();
  const chatId = Array.isArray(params?.chatId) ? params.chatId[0] : params?.chatId;
  const shareToken = Array.isArray(params?.shareToken) ? params.shareToken[0] : params?.shareToken;
  
  const [isValidShare, setIsValidShare] = useState<boolean | null>(null);
  const [showSignInPrompt, setShowSignInPrompt] = useState(false);
  const [chatData, setChatData] = useState<any>(null);

  // Redirect authenticated users to the full chat page
  useEffect(() => {
    if (isLoaded && isSignedIn && chatId) {
      router.push(`/chat/${chatId}`);
    }
  }, [isLoaded, isSignedIn, chatId, router]);

  // Verify access on mount (only for unauthenticated users)
  useEffect(() => {
    if (!chatId || !shareToken || !isLoaded || isSignedIn) return;

    const verifyAccess = async () => {
      try {
        // First verify access
        const verifyResponse = await fetch('/api/public/verify-access', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            resource_type: 'chat',
            resource_id: chatId,
            share_token: shareToken,
          }),
        });

        if (verifyResponse.ok) {
          const verifyData = await verifyResponse.json();
          if (verifyData.has_access) {
            // Access verified, now fetch the chat data
            const chatResponse = await fetch(`/api/public/chat/${chatId}/${shareToken}`);
            if (chatResponse.ok) {
              const chatData = await chatResponse.json();
              setChatData(chatData);
              setIsValidShare(true);
            } else {
              setIsValidShare(false);
            }
          } else {
            setIsValidShare(false);
          }
        } else {
          setIsValidShare(false);
        }
      } catch (error) {
        console.error('Failed to verify access:', error);
        setIsValidShare(false);
      }
    };

    verifyAccess();
  }, [chatId, shareToken, isLoaded, isSignedIn]);

  // Handle invalid share
  if (isValidShare === false) {
    notFound();
  }

  // Loading state (auth or share verification)
  if (!isLoaded || isValidShare === null) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
        </div>
      </div>
    );
  }

  return (
    <AnonymousUserProvider isAnonymous={true}>
      <div className="h-[calc(100vh-4rem)] flex flex-col">
        {/* Chat content */}
        <div className="flex-1 overflow-hidden">
          {chatData ? (
            <PublicChatViewer 
              chatData={chatData}
              onSignUpPrompt={() => setShowSignInPrompt(true)}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <MessageSquare className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Loading chat...</p>
              </div>
            </div>
          )}
        </div>

        {/* Sign-in prompt modal */}
        <AnonymousSignInPrompt 
          isOpen={showSignInPrompt}
          onClose={() => setShowSignInPrompt(false)}
          context="chat"
          title={chatData?.title || "Chat"}
        />
      </div>
    </AnonymousUserProvider>
  );
}