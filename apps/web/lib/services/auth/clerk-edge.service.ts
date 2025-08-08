import { createClerkClient } from '@clerk/backend';
import { NextRequest } from 'next/server';

/**
 * Edge Runtime compatible Clerk service
 * Uses @clerk/backend which works in Cloudflare Workers and Edge Runtime
 */
class ClerkEdgeService {
  private client;

  constructor() {
    if (!process.env.CLERK_SECRET_KEY) {
      throw new Error('CLERK_SECRET_KEY is required');
    }
    
    this.client = createClerkClient({
      secretKey: process.env.CLERK_SECRET_KEY,
    });
  }

  /**
   * Verify JWT token from request headers
   */
  async verifyToken(request: NextRequest) {
    try {
      const token = request.headers.get('authorization')?.replace('Bearer ', '');
      if (!token) {
        return null;
      }

      const verified = await this.client.verifyToken(token);
      return verified;
    } catch (error) {
      console.error('Token verification failed:', error);
      return null;
    }
  }

  /**
   * Get user information by ID
   */
  async getUser(userId: string) {
    try {
      const user = await this.client.users.getUser(userId);
      return {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        emailAddress: user.emailAddresses?.[0]?.emailAddress,
        imageUrl: user.imageUrl,
        fullName: user.firstName && user.lastName 
          ? `${user.firstName} ${user.lastName}`
          : user.firstName || user.lastName || user.emailAddresses?.[0]?.emailAddress || 'Unknown User'
      };
    } catch (error) {
      console.error('Failed to get user:', error);
      return null;
    }
  }

  /**
   * Authenticate request and return user info
   */
  async authenticateRequest(request: NextRequest) {
    try {
      const requestState = await this.client.authenticateRequest(request, {
        authorizedParties: [process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!.split('_')[1]]
      });
      
      const auth = requestState.toAuth();
      if (!auth.userId) {
        return null;
      }

      return {
        userId: auth.userId,
        sessionId: auth.sessionId,
        orgId: auth.orgId,
      };
    } catch (error) {
      console.error('Request authentication failed:', error);
      return null;
    }
  }
}

export const clerkEdgeService = new ClerkEdgeService();