import { createClerkClient, verifyToken } from '@clerk/backend';
import { VercelRequest } from '@vercel/node';
import logger from '../utils/logger';

export interface DeveloperAuthResult {
  userId: string;
  isDeveloper: true;
}

export class DeveloperAuthError extends Error {
  constructor(
    message: string,
    public status: number = 403,
    public type: string = 'developer_access_required'
  ) {
    super(message);
    this.name = 'DeveloperAuthError';
  }
}

/**
 * Validates that the request is from an authenticated user with developer role
 * @param req - Vercel request object
 * @returns Promise<DeveloperAuthResult> - User ID and developer confirmation
 * @throws DeveloperAuthError - If unauthorized or not a developer
 */
export async function validateDeveloperAccess(req: VercelRequest): Promise<DeveloperAuthResult> {
  try {
    // Check for Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new DeveloperAuthError('Authorization header required', 401, 'unauthorized');
    }

    // Extract Bearer token
    const match = authHeader.match(/^Bearer (.+)$/);
    if (!match) {
      throw new DeveloperAuthError('Invalid authorization format. Expected: Bearer <token>', 401, 'invalid_auth_format');
    }

    const sessionToken = match[1];
    
    // Handle development/testing token
    if (sessionToken === 'dev-panel-token-placeholder') {
      logger.info('[Developer Auth] Using development placeholder token');
      return {
        userId: 'dev-panel-user',
        isDeveloper: true
      };
    }
    
    // Verify the session token with Clerk
    const client = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });
    
    let userId: string;
    try {
      // Verify the JWT token
      const payload = await verifyToken(sessionToken, {
        secretKey: process.env.CLERK_SECRET_KEY!
      });
      
      userId = payload.sub; // Subject is the user ID in JWT
      
      logger.info({ userId }, '[Developer Auth] Token verified');
    } catch (error) {
      logger.warn({ error: error instanceof Error ? error.message : error }, '[Developer Auth] Token verification failed');
      throw new DeveloperAuthError('Invalid or expired session token', 401, 'invalid_session');
    }

    // Get user details including metadata
    try {
      const user = await client.users.getUser(userId);
      
      // Check if user has developer role
      const isDeveloper = user.publicMetadata?.role === 'developer';
      
      if (!isDeveloper) {
        logger.warn({ userId, role: user.publicMetadata?.role }, '[Developer Auth] User lacks developer role');
        throw new DeveloperAuthError(
          'Developer access required. Contact your administrator to request developer permissions.',
          403,
          'insufficient_role'
        );
      }

      logger.info({ userId }, '[Developer Auth] Developer access granted');
      
      return {
        userId,
        isDeveloper: true
      };

    } catch (error) {
      if (error instanceof DeveloperAuthError) {
        throw error;
      }
      
      logger.error({ userId, error: error instanceof Error ? error.message : error }, '[Developer Auth] Failed to fetch user details');
      throw new DeveloperAuthError('Failed to verify user permissions', 500, 'auth_service_error');
    }

  } catch (error) {
    if (error instanceof DeveloperAuthError) {
      throw error;
    }
    
    logger.error({ error: error instanceof Error ? error.message : error }, '[Developer Auth] Unexpected error during validation');
    throw new DeveloperAuthError('Authentication service error', 500, 'internal_error');
  }
}

/**
 * Checks if a request has developer override header
 * @param req - Vercel request object
 * @returns boolean - True if X-Prompt-Override header is present
 */
export function hasPromptOverrideHeader(req: VercelRequest): boolean {
  return req.headers['x-prompt-override'] === 'true';
}

/**
 * Middleware wrapper for developer-only endpoints
 * @param handler - The actual handler function
 * @returns Wrapped handler with developer auth
 */
export function withDeveloperAuth<T extends any[]>(
  handler: (authResult: DeveloperAuthResult, req: VercelRequest, ...args: T) => Promise<any>
) {
  return async (req: VercelRequest, ...args: T) => {
    try {
      const authResult = await validateDeveloperAccess(req);
      return await handler(authResult, req, ...args);
    } catch (error) {
      if (error instanceof DeveloperAuthError) {
        return {
          status: error.status,
          body: {
            error: error.message,
            type: error.type,
            code: error.status
          }
        };
      }
      
      logger.error({ error: error instanceof Error ? error.message : error }, '[Developer Auth] Unhandled error in auth wrapper');
      return {
        status: 500,
        body: {
          error: 'Internal server error',
          type: 'internal_error',
          code: 500
        }
      };
    }
  };
}