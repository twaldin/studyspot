'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface AnonymousUserLimits {
  chatMessagesRemaining: number;
  canEdit: boolean;
  canNavigate: boolean;
}

interface AnonymousUserContextType {
  limits: AnonymousUserLimits;
  useChatMessage: () => boolean;
  resetLimits: () => void;
  isAnonymous: boolean;
}

const AnonymousUserContext = createContext<AnonymousUserContextType | undefined>(undefined);

const ANONYMOUS_STORAGE_KEY = 'studyspot_anonymous_limits';

interface AnonymousUserProviderProps {
  children: React.ReactNode;
  isAnonymous?: boolean;
}

export function AnonymousUserProvider({ children, isAnonymous = false }: AnonymousUserProviderProps) {
  const [limits, setLimits] = useState<AnonymousUserLimits>({
    chatMessagesRemaining: 1,
    canEdit: false,
    canNavigate: false,
  });

  // Load limits from localStorage on mount
  useEffect(() => {
    if (isAnonymous && typeof window !== 'undefined') {
      const stored = localStorage.getItem(ANONYMOUS_STORAGE_KEY);
      if (stored) {
        try {
          const parsedLimits = JSON.parse(stored);
          setLimits(parsedLimits);
        } catch (error) {
          console.error('Failed to parse anonymous user limits:', error);
        }
      }
    }
  }, [isAnonymous]);

  // Save limits to localStorage whenever they change
  useEffect(() => {
    if (isAnonymous && typeof window !== 'undefined') {
      localStorage.setItem(ANONYMOUS_STORAGE_KEY, JSON.stringify(limits));
    }
  }, [limits, isAnonymous]);

  const useChatMessage = (): boolean => {
    if (!isAnonymous) return true;
    
    if (limits.chatMessagesRemaining > 0) {
      setLimits(prev => ({
        ...prev,
        chatMessagesRemaining: prev.chatMessagesRemaining - 1,
      }));
      return true;
    }
    
    return false;
  };

  const resetLimits = () => {
    const newLimits = {
      chatMessagesRemaining: 1,
      canEdit: false,
      canNavigate: false,
    };
    setLimits(newLimits);
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem(ANONYMOUS_STORAGE_KEY);
    }
  };

  const contextValue: AnonymousUserContextType = {
    limits,
    useChatMessage,
    resetLimits,
    isAnonymous,
  };

  return (
    <AnonymousUserContext.Provider value={contextValue}>
      {children}
    </AnonymousUserContext.Provider>
  );
}

export function useAnonymousUser() {
  const context = useContext(AnonymousUserContext);
  if (context === undefined) {
    throw new Error('useAnonymousUser must be used within an AnonymousUserProvider');
  }
  return context;
}

export function useAnonymousUserOptional() {
  return useContext(AnonymousUserContext);
}