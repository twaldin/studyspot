import { clerkClient } from "@clerk/nextjs/server";
import logger from "@/lib/logger";

export const setSelectedCourseForUser = async (
  userId: string,
  courseId: string,
) => {
  try {
    const client = await clerkClient();
    await client.users.updateUserMetadata(userId, {
      publicMetadata: {
        selectedCourseId: courseId,
      },
    });
    
    // Clear cache after updating metadata
    clearUserCache(userId);
    
    logger.info(
      { userId, courseId },
      "Successfully set selected course for user",
    );
  } catch (error) {
    logger.error(
      { error, userId, courseId },
      "Error updating user metadata with selected course",
    );
    throw new Error("Failed to set selected course for user.");
  }
};

export const clearSelectedCourseForUser = async (userId: string) => {
  try {
    const client = await clerkClient();
    await client.users.updateUserMetadata(userId, {
      publicMetadata: {
        selectedCourseId: undefined,
      },
    });
    
    // Clear cache after updating metadata
    clearUserCache(userId);
    
    logger.info({ userId }, "Successfully cleared selected course for user");
  } catch (error) {
    logger.error({ error, userId }, "Error clearing selected course for user");
    throw new Error("Failed to clear selected course for user.");
  }
};

// Cache for user data to avoid redundant Clerk API calls
const userDataCache = new Map<string, { user: any; timestamp: number }>();

// Production-aware cache duration
const getCacheDuration = () => {
  const isProduction = process.env.NODE_ENV === 'production';
  // Shorter cache in production to handle metadata updates better
  return isProduction ? 30 * 1000 : 5 * 60 * 1000; // 30 seconds in prod, 5 minutes in dev
};

async function getCachedUser(userId: string, bypassCache = false) {
  const cached = userDataCache.get(userId);
  const now = Date.now();
  const CACHE_DURATION = getCacheDuration();
  
  // Allow cache bypass for critical operations
  if (!bypassCache && cached && (now - cached.timestamp) < CACHE_DURATION) {
    return cached.user;
  }
  
  try {
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    
    // Cache the user data with timestamp
    userDataCache.set(userId, { user, timestamp: now });
    
    return user;
  } catch (error) {
    logger.error({ error, userId }, "Error fetching user from Clerk");
    throw error;
  }
}

// Force fresh user data - bypasses cache entirely
async function getFreshUser(userId: string) {
  return getCachedUser(userId, true);
}

// Clear cache for a specific user (useful when metadata is updated)
export const clearUserCache = (userId: string) => {
  userDataCache.delete(userId);
};

// Clear all cached user data
export const clearAllUserCache = () => {
  userDataCache.clear();
};

export const getSelectedCourseForUser = async (userId: string, forceFresh = false) => {
  try {
    const user = forceFresh ? await getFreshUser(userId) : await getCachedUser(userId);
    return user.publicMetadata.selectedCourseId as string | undefined;
  } catch (error) {
    logger.error(
      { error, userId },
      "Error fetching user metadata for selected course",
    );
    // It's possible the user doesn't have this metadata set yet, so don't throw an error, just return undefined.
    return undefined;
  }
};

export const getUserOnboardingStatus = async (userId: string, forceFresh = false) => {
  try {
    const user = forceFresh ? await getFreshUser(userId) : await getCachedUser(userId);

    // Handle cases where metadata might be null or undefined during transitions
    const publicMetadata = user.publicMetadata || {};
    const hasCompletedOnboarding = publicMetadata
      .hasCompletedOnboarding as boolean;
    const selectedSchool = publicMetadata.selectedSchool as string | undefined;
    const selectedSchoolName = publicMetadata.selectedSchoolName as
      | string
      | undefined;
    const selectedSchoolDomain = publicMetadata.selectedSchoolDomain as
      | string
      | undefined;

    return {
      hasCompletedOnboarding: !!hasCompletedOnboarding,
      selectedSchool: selectedSchool || undefined,
      selectedSchoolName: selectedSchoolName || undefined,
      selectedSchoolDomain: selectedSchoolDomain || undefined,
    };
  } catch (error) {
    logger.error({ error, userId }, "Error fetching user onboarding status");
    return {
      hasCompletedOnboarding: false,
    };
  }
};

