import { SupabaseService } from './supabase.service.js';

export interface SubscriptionFeature {
  id: string;
  name: string;
  description: string;
  limit?: number;
  period?: 'daily' | 'weekly' | 'monthly';
}

export const SUBSCRIPTION_FEATURES = {
  // Free Plan Features
  CHATS_50_PER_WEEK: {
    id: '50_chats_per_week',
    name: 'Weekly Chats',
    description: '50 AI chat conversations per week',
    limit: 50,
    period: 'weekly' as const,
  },
  GENERATE_10_QUIZZES_FLASHCARDS_PER_DAY: {
    id: 'generate_10_quizzes_flashcards_per_day',
    name: 'Daily Content Generation',
    description: 'Generate up to 10 quizzes or flashcard sets per day',
    limit: 10,
    period: 'daily' as const,
  },
  UPLOAD_10_FILES_PER_COURSE_PER_DAY: {
    id: 'upload_10_files_per_course_per_day',
    name: 'Daily File Upload',
    description: 'Upload up to 10 files per course per day',
    limit: 10,
    period: 'daily' as const,
  },
  
  // Paid Plan Features
  UNLIMITED_CHATS: {
    id: 'unlimited_chats',
    name: 'Unlimited Chats',
    description: 'Unlimited AI chat conversations',
  },
  UNLIMITED_FILE_UPLOAD: {
    id: 'unlimited_file_upload',
    name: 'Unlimited File Upload',
    description: 'Upload unlimited files to your courses',
  },
  UNLIMITED_CONTENT_GENERATION: {
    id: 'unlimited_content_generation',
    name: 'Unlimited Content Generation',
    description: 'Generate unlimited quizzes and flashcard sets',
  },
} as const;

export interface UsageTracking {
  chatCount: {
    count: number;
    weekStartDate: string;
  };
  quizFlashcardGeneration: {
    count: number;
    date: string;
  };
  fileUploads: {
    [courseId: string]: {
      count: number;
      date: string;
    };
  };
}

// Helper to get the start of the current week (Monday)
function getWeekStartDate(): string {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const monday = new Date(now);
  monday.setDate(now.getDate() - daysToMonday);
  monday.setHours(0, 0, 0, 0);
  return monday.toISOString().split('T')[0];
}

// Helper to get today's date
function getTodayDate(): string {
  return new Date().toISOString().split('T')[0];
}

export class SubscriptionChecker {
  /**
   * Check if user can generate content (quiz/flashcard) based on their subscription
   * Returns true if they have access, false otherwise
   */
  static async canGenerateContent(userId: string): Promise<{ 
    canGenerate: boolean; 
    reason?: string;
    remaining?: number;
    limit?: number;
  }> {
    try {
      // Get user metadata from Clerk via our proxy endpoint
      const userMetadata = await SupabaseService.getUserMetadata(userId);
      
      if (!userMetadata) {
        console.warn('[SubscriptionChecker] No user metadata found for:', userId);
        return { 
          canGenerate: true, 
          reason: 'No metadata found, allowing by default' 
        };
      }

      // Check if user has paid subscription
      if (userMetadata.subscriptionPlan === 'paid') {
        return { canGenerate: true };
      }

      // For free users, check daily limit
      const today = getTodayDate();
      const usageTracking = userMetadata.usageTracking || {
        quizFlashcardGeneration: { count: 0, date: today }
      };

      // Reset count if it's a new day
      if (usageTracking.quizFlashcardGeneration.date !== today) {
        usageTracking.quizFlashcardGeneration.count = 0;
        usageTracking.quizFlashcardGeneration.date = today;
      }

      const limit = SUBSCRIPTION_FEATURES.GENERATE_10_QUIZZES_FLASHCARDS_PER_DAY.limit!;
      const current = usageTracking.quizFlashcardGeneration.count;
      const remaining = Math.max(0, limit - current);

      if (current >= limit) {
        return {
          canGenerate: false,
          reason: `Daily limit reached (${limit} quiz/flashcard sets per day). Upgrade to Pro for unlimited generation.`,
          remaining: 0,
          limit
        };
      }

      return { 
        canGenerate: true,
        remaining,
        limit
      };
    } catch (error) {
      console.error('[SubscriptionChecker] Error checking subscription:', error);
      // In case of error, allow the operation but log it
      return { 
        canGenerate: true, 
        reason: 'Error checking subscription, allowing by default' 
      };
    }
  }

  /**
   * Increment usage count after successful content generation
   */
  static async incrementContentGeneration(userId: string): Promise<void> {
    try {
      // This would typically call back to the main app to update Clerk metadata
      // For now, we'll log it and the main app will handle the increment
      console.log('[SubscriptionChecker] Content generation incremented for user:', userId);
      
      // Call the main app's API to increment usage
      await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/user/increment-usage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          featureId: SUBSCRIPTION_FEATURES.GENERATE_10_QUIZZES_FLASHCARDS_PER_DAY.id
        })
      });
    } catch (error) {
      console.error('[SubscriptionChecker] Error incrementing usage:', error);
      // Don't throw - we don't want to fail the operation if we can't increment
    }
  }
}