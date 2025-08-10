'use client';

import React from 'react';
import { SignUpButton, SignInButton } from '@clerk/nextjs';
import { Button } from '@studyspot/ui/components/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@studyspot/ui/components/dialog';
import { UserPlus, LogIn, MessageSquare, BookOpen, HelpCircle } from 'lucide-react';

interface AnonymousSignInPromptProps {
  isOpen: boolean;
  onClose: () => void;
  context: 'chat' | 'general';
  title?: string;
}

export function AnonymousSignInPrompt({ 
  isOpen, 
  onClose, 
  context, 
  title 
}: AnonymousSignInPromptProps) {
  const getContextContent = () => {
    switch (context) {
      case 'chat':
        return {
          icon: <MessageSquare className="h-12 w-12 text-primary mx-auto mb-4" />,
          heading: "Continue the Conversation",
          description: "You've used your free message! Sign up to continue chatting with StudySpot's AI assistant and unlock unlimited conversations.",
          benefits: [
            "Unlimited AI chat messages",
            "Create and save your own flashcards & quizzes", 
            "Access to all course materials",
            "Sync across all your devices"
          ]
        };
      default:
        return {
          icon: <BookOpen className="h-12 w-12 text-primary mx-auto mb-4" />,
          heading: "Join StudySpot",
          description: "Sign up to unlock the full StudySpot experience and enhance your learning journey.",
          benefits: [
            "Create unlimited chats with AI",
            "Build your own study materials",
            "Access exclusive course content",
            "Connect with study groups"
          ]
        };
    }
  };

  const content = getContextContent();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="text-center">
            {content.icon}
            <DialogTitle className="text-xl font-semibold mb-2">
              {content.heading}
            </DialogTitle>
            <DialogDescription className="text-center">
              {content.description}
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Benefits list */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-center">What you'll get:</p>
            <ul className="space-y-1 text-sm text-muted-foreground">
              {content.benefits.map((benefit, index) => (
                <li key={index} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0" />
                  {benefit}
                </li>
              ))}
            </ul>
          </div>

          {/* Action buttons */}
          <div className="space-y-3 pt-4">
            <SignUpButton mode="modal" forceRedirectUrl={typeof window !== 'undefined' ? window.location.href : undefined}>
              <Button className="w-full" size="lg">
                <UserPlus className="h-4 w-4 mr-2" />
                Sign Up - It's Free
              </Button>
            </SignUpButton>
            
            <SignInButton mode="modal" forceRedirectUrl={typeof window !== 'undefined' ? window.location.href : undefined}>
              <Button variant="outline" className="w-full" size="lg">
                <LogIn className="h-4 w-4 mr-2" />
                Sign In
              </Button>
            </SignInButton>

            <Button 
              variant="ghost" 
              className="w-full text-xs" 
              onClick={onClose}
            >
              Continue browsing as guest
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}