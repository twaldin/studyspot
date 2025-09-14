import { auth, clerkClient } from "@clerk/nextjs/server";
import { currentUser } from "@clerk/nextjs/server";
import logger from "@/lib/logger";
import {
  FeatureId,
  SUBSCRIPTION_FEATURES,
  UsageTracking,
  UserSubscriptionMetadata,
} from "@/lib/types/subscription.types";
import { clearUserCache } from "@/lib/clerk";

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

/**
 * Check if a user has access to a specific feature based on their subscription
 */
export async function hasFeatureAccess(featureId: FeatureId): Promise<boolean> {
  try {
    const { has } = await auth();
    
    // First try to use Clerk's built-in has() method if available
    if (has) {
      const hasAccess = await has({ feature: featureId });
      if (hasAccess !== undefined) {
        return hasAccess;
      }
    }
    
    // Fallback to checking based on user metadata
    const user = await currentUser();
    if (!user) {
      logger.warn("No user found when checking feature access");
      return false;
    }
    
    const metadata = user.privateMetadata as UserSubscriptionMetadata;
    
    // If user has paid subscription, they have access to all unlimited features
    if (metadata?.subscriptionPlan === 'paid') {
      const paidFeatures = [
        SUBSCRIPTION_FEATURES.UNLIMITED_CHATS.id,
        SUBSCRIPTION_FEATURES.UNLIMITED_FILE_UPLOAD.id,
        SUBSCRIPTION_FEATURES.UNLIMITED_CONTENT_GENERATION.id,
      ];
      
      if (paidFeatures.includes(featureId)) {
        return true;
      }
    }
    
    // For free users or users without a plan, they have access to free features
    const freeFeatures = [
      SUBSCRIPTION_FEATURES.CHATS_50_PER_WEEK.id,
      SUBSCRIPTION_FEATURES.GENERATE_10_QUIZZES_FLASHCARDS_PER_DAY.id,
      SUBSCRIPTION_FEATURES.UPLOAD_10_FILES_PER_COURSE_PER_DAY.id,
    ];
    
    return freeFeatures.includes(featureId);
  } catch (error) {
    logger.error({ error, featureId }, "Error checking feature access");
    return false;
  }
}

/**
 * Check if a user has remaining usage for a limited feature
 */
export async function checkUsageLimit(
  featureId: FeatureId,
  courseId?: string
): Promise<{ hasAccess: boolean; remaining?: number; limit?: number }> {
  try {
    const user = await currentUser();
    if (!user) {
      return { hasAccess: false };
    }
    
    const metadata = user.privateMetadata as UserSubscriptionMetadata;
    
    // Paid users have unlimited access
    if (metadata?.subscriptionPlan === 'paid') {
      const paidFeatures = [
        SUBSCRIPTION_FEATURES.UNLIMITED_CHATS.id,
        SUBSCRIPTION_FEATURES.UNLIMITED_FILE_UPLOAD.id,
        SUBSCRIPTION_FEATURES.UNLIMITED_CONTENT_GENERATION.id,
      ];
      
      if (paidFeatures.includes(featureId)) {
        return { hasAccess: true };
      }
    }
    
    // Check usage for free features
    const usageTracking = metadata?.usageTracking || getDefaultUsageTracking();
    
    switch (featureId) {
      case SUBSCRIPTION_FEATURES.CHATS_50_PER_WEEK.id: {
        const weekStart = getWeekStartDate();
        const chatData = usageTracking.chatCount;
        
        // Reset if it's a new week
        if (chatData.weekStartDate !== weekStart) {
          chatData.count = 0;
          chatData.weekStartDate = weekStart;
        }
        
        const limit = SUBSCRIPTION_FEATURES.CHATS_50_PER_WEEK.limit!;
        const remaining = Math.max(0, limit - chatData.count);
        
        return {
          hasAccess: chatData.count < limit,
          remaining,
          limit,
        };
      }
      
      case SUBSCRIPTION_FEATURES.GENERATE_10_QUIZZES_FLASHCARDS_PER_DAY.id: {
        const today = getTodayDate();
        const generationData = usageTracking.quizFlashcardGeneration;
        
        // Reset if it's a new day
        if (generationData.date !== today) {
          generationData.count = 0;
          generationData.date = today;
        }
        
        const limit = SUBSCRIPTION_FEATURES.GENERATE_10_QUIZZES_FLASHCARDS_PER_DAY.limit!;
        const remaining = Math.max(0, limit - generationData.count);
        
        return {
          hasAccess: generationData.count < limit,
          remaining,
          limit,
        };
      }
      
      case SUBSCRIPTION_FEATURES.UPLOAD_10_FILES_PER_COURSE_PER_DAY.id: {
        if (!courseId) {
          logger.warn("No courseId provided for file upload limit check");
          return { hasAccess: false };
        }
        
        const today = getTodayDate();
        const uploadData = usageTracking.fileUploads[courseId] || {
          count: 0,
          date: today,
        };
        
        // Reset if it's a new day
        if (uploadData.date !== today) {
          uploadData.count = 0;
          uploadData.date = today;
        }
        
        const limit = SUBSCRIPTION_FEATURES.UPLOAD_10_FILES_PER_COURSE_PER_DAY.limit!;
        const remaining = Math.max(0, limit - uploadData.count);
        
        return {
          hasAccess: uploadData.count < limit,
          remaining,
          limit,
        };
      }
      
      default:
        return { hasAccess: true };
    }
  } catch (error) {
    logger.error({ error, featureId }, "Error checking usage limit");
    return { hasAccess: false };
  }
}

/**
 * Increment usage for a feature
 */
export async function incrementUsage(
  userId: string,
  featureId: FeatureId,
  courseId?: string
): Promise<void> {
  try {
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const metadata = (user.privateMetadata || {}) as UserSubscriptionMetadata;
    
    // Initialize usage tracking if it doesn't exist
    if (!metadata.usageTracking) {
      metadata.usageTracking = getDefaultUsageTracking();
    }
    
    const usageTracking = metadata.usageTracking;
    
    switch (featureId) {
      case SUBSCRIPTION_FEATURES.CHATS_50_PER_WEEK.id: {
        const weekStart = getWeekStartDate();
        
        // Reset if it's a new week
        if (usageTracking.chatCount.weekStartDate !== weekStart) {
          usageTracking.chatCount.count = 0;
          usageTracking.chatCount.weekStartDate = weekStart;
        }
        
        usageTracking.chatCount.count++;
        break;
      }
      
      case SUBSCRIPTION_FEATURES.GENERATE_10_QUIZZES_FLASHCARDS_PER_DAY.id: {
        const today = getTodayDate();
        
        // Reset if it's a new day
        if (usageTracking.quizFlashcardGeneration.date !== today) {
          usageTracking.quizFlashcardGeneration.count = 0;
          usageTracking.quizFlashcardGeneration.date = today;
        }
        
        usageTracking.quizFlashcardGeneration.count++;
        break;
      }
      
      case SUBSCRIPTION_FEATURES.UPLOAD_10_FILES_PER_COURSE_PER_DAY.id: {
        if (!courseId) {
          logger.warn("No courseId provided for file upload increment");
          return;
        }
        
        const today = getTodayDate();
        
        if (!usageTracking.fileUploads[courseId]) {
          usageTracking.fileUploads[courseId] = {
            count: 0,
            date: today,
          };
        }
        
        const uploadData = usageTracking.fileUploads[courseId];
        
        // Reset if it's a new day
        if (uploadData.date !== today) {
          uploadData.count = 0;
          uploadData.date = today;
        }
        
        uploadData.count++;
        break;
      }
    }
    
    // Update user metadata
    await client.users.updateUserMetadata(userId, {
      privateMetadata: metadata,
    });
    
    // Clear cache after updating metadata
    clearUserCache(userId);
    
    logger.info(
      { userId, featureId, courseId },
      "Successfully incremented usage"
    );
  } catch (error) {
    logger.error(
      { error, userId, featureId, courseId },
      "Error incrementing usage"
    );
    throw error;
  }
}

/**
 * Get usage statistics for a user
 */
export async function getUserUsageStats(userId: string): Promise<UsageTracking> {
  try {
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const metadata = user.privateMetadata as UserSubscriptionMetadata;
    
    return metadata?.usageTracking || getDefaultUsageTracking();
  } catch (error) {
    logger.error({ error, userId }, "Error getting user usage stats");
    return getDefaultUsageTracking();
  }
}

/**
 * Reset usage for a specific feature (useful for testing or admin actions)
 */
export async function resetUsage(
  userId: string,
  featureId: FeatureId,
  courseId?: string
): Promise<void> {
  try {
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const metadata = (user.privateMetadata || {}) as UserSubscriptionMetadata;
    
    if (!metadata.usageTracking) {
      metadata.usageTracking = getDefaultUsageTracking();
    }
    
    const usageTracking = metadata.usageTracking;
    
    switch (featureId) {
      case SUBSCRIPTION_FEATURES.CHATS_50_PER_WEEK.id:
        usageTracking.chatCount = {
          count: 0,
          weekStartDate: getWeekStartDate(),
        };
        break;
        
      case SUBSCRIPTION_FEATURES.GENERATE_10_QUIZZES_FLASHCARDS_PER_DAY.id:
        usageTracking.quizFlashcardGeneration = {
          count: 0,
          date: getTodayDate(),
        };
        break;
        
      case SUBSCRIPTION_FEATURES.UPLOAD_10_FILES_PER_COURSE_PER_DAY.id:
        if (courseId && usageTracking.fileUploads[courseId]) {
          usageTracking.fileUploads[courseId] = {
            count: 0,
            date: getTodayDate(),
          };
        }
        break;
    }
    
    await client.users.updateUserMetadata(userId, {
      privateMetadata: metadata,
    });
    
    // Clear cache after updating metadata
    clearUserCache(userId);
    
    logger.info(
      { userId, featureId, courseId },
      "Successfully reset usage"
    );
  } catch (error) {
    logger.error(
      { error, userId, featureId, courseId },
      "Error resetting usage"
    );
    throw error;
  }
}

/**
 * Get default usage tracking object
 */
function getDefaultUsageTracking(): UsageTracking {
  return {
    chatCount: {
      count: 0,
      weekStartDate: getWeekStartDate(),
    },
    quizFlashcardGeneration: {
      count: 0,
      date: getTodayDate(),
    },
    fileUploads: {},
  };
}