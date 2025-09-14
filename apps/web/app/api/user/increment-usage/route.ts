import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { incrementUsage } from '@/lib/services/subscription/subscription.service';
import { SUBSCRIPTION_FEATURES, type FeatureId } from '@/lib/types/subscription.types';
import logger from '@/lib/logger';

export async function POST(request: NextRequest) {
  try {
    const { userId: providedUserId, featureId, courseId } = await request.json();
    
    // Use provided userId (from assistant worker) or get from auth
    const { userId: authUserId } = await auth();
    const userId = providedUserId || authUserId;
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    if (!featureId) {
      return NextResponse.json(
        { error: 'Feature ID is required' },
        { status: 400 }
      );
    }

    // Validate feature ID
    const validFeatures = Object.values(SUBSCRIPTION_FEATURES).map(f => f.id);
    if (!validFeatures.includes(featureId)) {
      return NextResponse.json(
        { error: 'Invalid feature ID' },
        { status: 400 }
      );
    }

    // Increment the usage
    await incrementUsage(userId, featureId as FeatureId, courseId);

    logger.info(
      { userId, featureId, courseId },
      'Successfully incremented usage'
    );

    return NextResponse.json({
      success: true,
      message: 'Usage incremented successfully'
    });

  } catch (error) {
    logger.error({ error }, 'Error incrementing usage');
    return NextResponse.json(
      { error: 'Failed to increment usage' },
      { status: 500 }
    );
  }
}