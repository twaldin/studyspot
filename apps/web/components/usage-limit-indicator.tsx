"use client";

import { useEffect, useState } from "react";
import { Progress } from "@studyspot/ui/components/progress";
import { Card, CardContent } from "@studyspot/ui/components/card";
import { Button } from "@studyspot/ui/components/button";
import { Badge } from "@studyspot/ui/components/badge";
import { Sparkles, MessageSquare, FileText, Brain, Crown } from "lucide-react";
import Link from "next/link";

interface UsageLimits {
  usageStats: any;
  limits: {
    chats: { hasAccess: boolean; remaining?: number; limit?: number } | null;
    contentGeneration: { hasAccess: boolean; remaining?: number; limit?: number } | null;
    fileUpload: { hasAccess: boolean; remaining?: number; limit?: number } | null;
  };
  hasUnlimited: {
    chats: boolean;
    contentGeneration: boolean;
    fileUpload: boolean;
  };
}

export function UsageLimitIndicator({ courseId }: { courseId?: string }) {
  const [usage, setUsage] = useState<UsageLimits | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsageStats();
  }, [courseId]);

  const fetchUsageStats = async () => {
    try {
      const url = courseId 
        ? `/api/user/usage-stats?courseId=${courseId}`
        : '/api/user/usage-stats';
      
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setUsage(data);
      }
    } catch (error) {
      console.error('Error fetching usage stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !usage) {
    return null;
  }

  const hasAnyLimits = !usage.hasUnlimited.chats || 
                       !usage.hasUnlimited.contentGeneration || 
                       !usage.hasUnlimited.fileUpload;

  if (!hasAnyLimits) {
    return (
      <Card className="border-yellow-500/20 bg-gradient-to-r from-yellow-500/5 to-orange-500/5">
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-yellow-500" />
            <span className="text-sm font-medium">Pro Plan</span>
            <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-700">
              Unlimited Access
            </Badge>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold">Usage Limits</h3>
          <Link href="/subscriptions">
            <Button variant="ghost" size="sm" className="text-xs">
              <Sparkles className="h-3 w-3 mr-1" />
              Upgrade
            </Button>
          </Link>
        </div>

        {/* Chat Usage */}
        {usage.limits.chats && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                <span>Weekly Chats</span>
              </div>
              <span className="text-xs text-muted-foreground">
                {usage.limits.chats.remaining}/{usage.limits.chats.limit}
              </span>
            </div>
            <Progress 
              value={((usage.limits.chats.limit! - usage.limits.chats.remaining!) / usage.limits.chats.limit!) * 100}
              className="h-2"
            />
          </div>
        )}

        {/* Content Generation Usage */}
        {usage.limits.contentGeneration && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Brain className="h-4 w-4 text-muted-foreground" />
                <span>Daily Quiz/Flashcards</span>
              </div>
              <span className="text-xs text-muted-foreground">
                {usage.limits.contentGeneration.remaining}/{usage.limits.contentGeneration.limit}
              </span>
            </div>
            <Progress 
              value={((usage.limits.contentGeneration.limit! - usage.limits.contentGeneration.remaining!) / usage.limits.contentGeneration.limit!) * 100}
              className="h-2"
            />
          </div>
        )}

        {/* File Upload Usage */}
        {courseId && usage.limits.fileUpload && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span>Daily File Uploads</span>
              </div>
              <span className="text-xs text-muted-foreground">
                {usage.limits.fileUpload.remaining}/{usage.limits.fileUpload.limit}
              </span>
            </div>
            <Progress 
              value={((usage.limits.fileUpload.limit! - usage.limits.fileUpload.remaining!) / usage.limits.fileUpload.limit!) * 100}
              className="h-2"
            />
          </div>
        )}

        {/* Warning when approaching limits */}
        {usage.limits.chats && usage.limits.chats.remaining! <= 5 && (
          <div className="bg-orange-500/10 rounded-md p-2">
            <p className="text-xs text-orange-700">
              You have {usage.limits.chats.remaining} chats remaining this week.
              <Link href="/subscriptions" className="ml-1 underline">
                Upgrade to Pro
              </Link>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function UsageLimitBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    checkUsageLimits();
  }, []);

  const checkUsageLimits = async () => {
    try {
      const response = await fetch('/api/user/usage-stats');
      if (response.ok) {
        const data = await response.json();
        
        // Check if any limits are nearly reached
        if (data.limits.chats && data.limits.chats.remaining <= 5) {
          setMessage(`Only ${data.limits.chats.remaining} chats remaining this week!`);
          setShowBanner(true);
        } else if (data.limits.contentGeneration && data.limits.contentGeneration.remaining <= 2) {
          setMessage(`Only ${data.limits.contentGeneration.remaining} quiz/flashcard generations remaining today!`);
          setShowBanner(true);
        }
      }
    } catch (error) {
      console.error('Error checking usage limits:', error);
    }
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-4 right-4 max-w-sm z-50">
      <Card className="border-orange-500/50 bg-gradient-to-r from-orange-500/10 to-yellow-500/10">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Sparkles className="h-5 w-5 text-orange-500 mt-0.5" />
            <div className="flex-1 space-y-2">
              <p className="text-sm font-medium">{message}</p>
              <div className="flex gap-2">
                <Link href="/subscriptions">
                  <Button size="sm" variant="default" className="h-7">
                    Upgrade to Pro
                  </Button>
                </Link>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="h-7"
                  onClick={() => setShowBanner(false)}
                >
                  Dismiss
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}