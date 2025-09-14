import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getUserUsageStats, checkUsageLimit } from '@/lib/services/subscription/subscription.service';
import { SUBSCRIPTION_FEATURES } from '@/lib/types/subscription.types';
import logger from '@/lib/logger';

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get current usage stats
    const usageStats = await getUserUsageStats(userId);
    
    // Check limits for each feature
    const chatLimit = await checkUsageLimit(SUBSCRIPTION_FEATURES.CHATS_50_PER_WEEK.id);
    const contentLimit = await checkUsageLimit(SUBSCRIPTION_FEATURES.GENERATE_10_QUIZZES_FLASHCARDS_PER_DAY.id);
    
    // For file uploads, we need to check per course
    const url = new URL(request.url);
    const courseId = url.searchParams.get('courseId');
    
    let fileUploadLimit = null;
    if (courseId) {
      fileUploadLimit = await checkUsageLimit(
        SUBSCRIPTION_FEATURES.UPLOAD_10_FILES_PER_COURSE_PER_DAY.id,
        courseId
      );
    }

    // Check if user has unlimited access
    const unlimitedChats = await checkUsageLimit(SUBSCRIPTION_FEATURES.UNLIMITED_CHATS.id);
    const unlimitedContent = await checkUsageLimit(SUBSCRIPTION_FEATURES.UNLIMITED_CONTENT_GENERATION.id);
    const unlimitedUpload = await checkUsageLimit(SUBSCRIPTION_FEATURES.UNLIMITED_FILE_UPLOAD.id);

    return NextResponse.json({
      usageStats,
      limits: {
        chats: unlimitedChats.hasAccess ? null : chatLimit,
        contentGeneration: unlimitedContent.hasAccess ? null : contentLimit,
        fileUpload: courseId ? (unlimitedUpload.hasAccess ? null : fileUploadLimit) : null
      },
      hasUnlimited: {
        chats: unlimitedChats.hasAccess,
        contentGeneration: unlimitedContent.hasAccess,
        fileUpload: unlimitedUpload.hasAccess
      }
    });

  } catch (error) {
    logger.error({ error }, 'Error fetching usage stats');
    return NextResponse.json(
      { error: 'Failed to fetch usage stats' },
      { status: 500 }
    );
  }
}