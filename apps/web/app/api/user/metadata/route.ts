import { NextRequest, NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';
import logger from '@/lib/logger';

export async function POST(request: NextRequest) {
  try {
    // This endpoint is called by the assistant worker to get user metadata
    const { userId } = await request.json();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Get the user's metadata from Clerk
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Return the private metadata which contains subscription info
    return NextResponse.json({
      metadata: user.privateMetadata || {},
      publicMetadata: user.publicMetadata || {}
    });

  } catch (error) {
    logger.error({ error }, 'Error fetching user metadata');
    return NextResponse.json(
      { error: 'Failed to fetch user metadata' },
      { status: 500 }
    );
  }
}

// Also support GET for authenticated users to get their own metadata
export async function GET() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      metadata: user.privateMetadata || {},
      publicMetadata: user.publicMetadata || {}
    });

  } catch (error) {
    logger.error({ error }, 'Error fetching user metadata');
    return NextResponse.json(
      { error: 'Failed to fetch user metadata' },
      { status: 500 }
    );
  }
}