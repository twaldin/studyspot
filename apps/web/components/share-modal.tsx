'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@studyspot/ui/components/dialog';
import { Button } from '@studyspot/ui/components/button';
import { Input } from '@studyspot/ui/components/input';
import { Label } from '@studyspot/ui/components/label';
import { Switch } from '@studyspot/ui/components/switch';
import toast from 'react-hot-toast';
import {
  Copy,
  MessageSquare,
  Instagram,
  Twitter,
  Share,
  Users,
  Link2,
  Check,
} from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  title: string;
  type: 'chat' | 'flashcard' | 'quiz';
  courseCode?: string;
  resourceId?: string;
  onVisibilityChange?: (visibility: 'course' | 'link-only') => void;
}

export function ShareModal({
  isOpen,
  onClose,
  url,
  title,
  type,
  courseCode,
  resourceId,
  onVisibilityChange,
}: ShareModalProps) {
  const [visibility, setVisibility] = useState<'course' | 'link-only'>('link-only');
  const [copied, setCopied] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [isPublic, setIsPublic] = useState(false);
  const [actualShareUrl, setActualShareUrl] = useState<string | null>(null);
  const [hasLoaded, setHasLoaded] = useState(false);

  const shareUrl = actualShareUrl || (typeof window !== 'undefined' 
    ? `${window.location.origin}${url}` 
    : url);

  const shareText = `Check out this ${type}: ${title}`;

  // Load current share settings when modal opens
  useEffect(() => {
    if (isOpen && resourceId) {
      loadShareSettings();
    }
  }, [isOpen, resourceId]);

  const loadShareSettings = async () => {
    if (!resourceId) return;

    try {
      let endpoint = '';
      switch (type) {
        case 'chat':
          endpoint = `/api/chats/${resourceId}/share`;
          break;
        case 'flashcard':
          endpoint = `/api/flashcard-sets/${resourceId}/share`;
          break;
        case 'quiz':
          endpoint = `/api/quizzes/${resourceId}/share`;
          break;
      }

      const response = await fetch(endpoint);
      if (response.ok) {
        const data = await response.json();
        setIsPublic(data.is_public || false);
        setVisibility(data.visibility_mode === 'course' ? 'course' : 'link-only');
        setActualShareUrl(data.share_url);
      }
    } catch (error) {
      console.error('Failed to load share settings:', error);
    } finally {
      setHasLoaded(true);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  const handleMakePublic = async () => {
    if (!resourceId || isSharing) return;
    
    setIsSharing(true);
    try {
      let endpoint = '';
      switch (type) {
        case 'chat':
          endpoint = `/api/chats/${resourceId}/share`;
          break;
        case 'flashcard':
          endpoint = `/api/flashcard-sets/${resourceId}/share`;
          break;
        case 'quiz':
          endpoint = `/api/quizzes/${resourceId}/share`;
          break;
      }

      const response = await fetch(endpoint, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          is_public: true,
          visibility_mode: 'link-only',
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setIsPublic(true);
        setVisibility('link-only');
        setActualShareUrl(data.share_url);
        toast.success('Content is now public and ready to share!');
      } else {
        throw new Error('Failed to make content public');
      }
    } catch (error) {
      console.error('Failed to make content public:', error);
      toast.error('Failed to make content public');
    } finally {
      setIsSharing(false);
    }
  };

  const handleVisibilityChange = async (checked: boolean) => {
    if (!resourceId || isSharing) return;
    
    const newVisibility = checked ? 'course' : 'link-only';
    
    setIsSharing(true);
    try {
      let endpoint = '';
      switch (type) {
        case 'chat':
          endpoint = `/api/chats/${resourceId}/share`;
          break;
        case 'flashcard':
          endpoint = `/api/flashcard-sets/${resourceId}/share`;
          break;
        case 'quiz':
          endpoint = `/api/quizzes/${resourceId}/share`;
          break;
      }

      const response = await fetch(endpoint, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          is_public: true,
          visibility_mode: newVisibility,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setVisibility(newVisibility);
        setIsPublic(true);
        setActualShareUrl(data.share_url);
        onVisibilityChange?.(newVisibility);
        toast.success('Sharing settings updated!');
      } else {
        throw new Error('Failed to update sharing settings');
      }
    } catch (error) {
      console.error('Failed to update sharing settings:', error);
      toast.error('Failed to update sharing settings');
    } finally {
      setIsSharing(false);
    }
  };

  const openShareWindow = (url: string) => {
    window.open(url, '_blank', 'width=600,height=400,resizable=yes,scrollbars=yes');
  };

  const handleMessages = () => {
    const encodedText = encodeURIComponent(`${shareText} ${shareUrl}`);
    
    // Detect platform and use appropriate messaging URL
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    
    if (isMac || isIOS) {
      // Use iMessage URL scheme
      window.location.href = `sms:&body=${encodedText}`;
    } else {
      // For Windows/Android, use SMS URL scheme
      window.location.href = `sms:?body=${encodedText}`;
    }
  };

  const handleInstagram = async () => {
    // Instagram doesn't have a direct share URL, so we copy and notify
    await handleCopy();
    toast('Link copied! Opening Instagram...');
    // Wait 0.5s before opening Instagram
    setTimeout(() => {
      window.open('https://www.instagram.com/direct/inbox/', '_blank');
    }, 500);
  };

  const handleTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitterUrl, '_blank', 'width=600,height=400,resizable=yes,scrollbars=yes');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share className="h-5 w-5" />
            Share {type === 'chat' ? 'Chat' : type === 'flashcard' ? 'Flashcard Set' : 'Quiz'}
          </DialogTitle>
          <DialogDescription>
            Share this {type} with others or on social media
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Make Public Section - Show when content is not yet public */}
          {hasLoaded && !isPublic && (
            <div className="space-y-3">
              <div className="rounded-lg border bg-muted/50 p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Share className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">Make {type === 'chat' ? 'Chat' : type === 'flashcard' ? 'Flashcard Set' : 'Quiz'} Public</span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  This {type} is currently private. Make it public to share with others.
                </p>
                <Button 
                  onClick={handleMakePublic}
                  disabled={isSharing}
                  className="w-full"
                >
                  {isSharing ? 'Making Public...' : 'Make Public'}
                </Button>
              </div>
            </div>
          )}

          {/* Visibility Toggle for Flashcards and Quizzes - Only show when public */}
          {hasLoaded && isPublic && type !== 'chat' && courseCode && (
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="course-visibility" className="text-sm font-normal">
                  Viewable by everyone in {courseCode}
                </Label>
              </div>
              <Switch
                id="course-visibility"
                checked={visibility === 'course'}
                onCheckedChange={handleVisibilityChange}
                disabled={isSharing}
              />
            </div>
          )}

          {/* Copy Link Section - Only show when public */}
          {hasLoaded && isPublic && (
            <div className="space-y-2">
              <Label htmlFor="share-link" className="text-sm font-medium">
                Share Link
              </Label>
              <div className="flex gap-2">
                <Input
                  id="share-link"
                  value={shareUrl}
                  readOnly
                  className="flex-1"
                />
                <Button
                  type="button"
                  size="icon"
                  variant={copied ? 'default' : 'outline'}
                  onClick={handleCopy}
                >
                  {copied ? (
                    <Link2 className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Social Share Buttons - Only show when public */}
          {hasLoaded && isPublic && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Share via</Label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleMessages}
                  className="flex items-center justify-center gap-2"
                >
                  <MessageSquare className="h-4 w-4" />
                  <span className="text-xs">Messages</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleInstagram}
                  className="flex items-center justify-center gap-2"
                >
                  <Instagram className="h-4 w-4" />
                  <span className="text-xs">Instagram</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleTwitter}
                  className="flex items-center justify-center gap-2"
                >
                  <Twitter className="h-4 w-4" />
                  <span className="text-xs">X</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopy}
                  className="flex items-center justify-center gap-2"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4" />
                      <span className="text-xs">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      <span className="text-xs">Copy Link</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Current Visibility Status - Only show when public */}
          {hasLoaded && isPublic && type !== 'chat' && (
            <div className="rounded-lg bg-muted px-3 py-2 text-xs text-muted-foreground">
              {visibility === 'course' ? (
                <span className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  Anyone in {courseCode} can view this {type}
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <Link2 className="h-3 w-3" />
                  Only people with the link can view this {type}
                </span>
              )}
            </div>
          )}

          {/* Loading state */}
          {!hasLoaded && (
            <div className="flex items-center justify-center py-8">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}