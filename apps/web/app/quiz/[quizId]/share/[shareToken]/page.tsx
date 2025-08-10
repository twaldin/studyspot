'use client';

import { useParams, notFound, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { PublicQuizViewer } from '@/components/public-quiz-viewer';
import { AnonymousUserProvider } from '@/contexts/anonymous-user-context';
import { AnonymousSignInPrompt } from '@/components/anonymous-signin-prompt';
import { SignUpButton, SignInButton, useUser } from '@clerk/nextjs';
import { Button } from '@studyspot/ui/components/button';
import { UserPlus, LogIn, HelpCircle, Eye } from 'lucide-react';
import toast from 'react-hot-toast';

export default function PublicQuizPage() {
  const params = useParams();
  const router = useRouter();
  const { isSignedIn, isLoaded } = useUser();
  const quizId = Array.isArray(params?.quizId) ? params.quizId[0] : params?.quizId;
  const shareToken = Array.isArray(params?.shareToken) ? params.shareToken[0] : params?.shareToken;
  
  const [isValidShare, setIsValidShare] = useState<boolean | null>(null);
  const [showSignInPrompt, setShowSignInPrompt] = useState(false);
  const [quizData, setQuizData] = useState<any>(null);

  // Redirect authenticated users to the full quiz page
  useEffect(() => {
    if (isLoaded && isSignedIn && quizId) {
      router.push(`/quiz/${quizId}`);
    }
  }, [isLoaded, isSignedIn, quizId, router]);

  // Verify access on mount (only for unauthenticated users)
  useEffect(() => {
    if (!quizId || !shareToken || !isLoaded || isSignedIn) return;

    const verifyAccess = async () => {
      try {
        // First verify access
        const verifyResponse = await fetch('/api/public/verify-access', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            resource_type: 'quiz',
            resource_id: quizId,
            share_token: shareToken,
          }),
        });

        if (verifyResponse.ok) {
          const verifyData = await verifyResponse.json();
          if (verifyData.has_access) {
            // Access verified, now fetch the quiz data
            const quizResponse = await fetch(`/api/public/quizzes/${quizId}/${shareToken}`);
            if (quizResponse.ok) {
              const quizData = await quizResponse.json();
              setQuizData(quizData);
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
  }, [quizId, shareToken, isLoaded, isSignedIn]);

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
        {/* Quiz content */}
        <div className="flex-1 overflow-hidden">
          {quizData ? (
            <PublicQuizViewer 
              quizData={quizData}
              onSignUpPrompt={() => setShowSignInPrompt(true)}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <HelpCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Loading quiz...</p>
              </div>
            </div>
          )}
        </div>

        {/* Sign-in prompt modal */}
        <AnonymousSignInPrompt 
          isOpen={showSignInPrompt}
          onClose={() => setShowSignInPrompt(false)}
          context="quiz"
          title={quizData?.title || "Quiz"}
        />
      </div>
    </AnonymousUserProvider>
  );
}