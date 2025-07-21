import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { supabaseService } from "../database/supabase.service";
import { getSelectedCourseForUser, getUserOnboardingStatus } from "@/lib/clerk";
import logger, { LogContext } from "@/lib/logger";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";

/**
 * Standard auth validation result
 */
export interface AuthResult {
  userId: string;
  supabase: SupabaseClient<Database>;
}

/**
 * Auth result with school information
 */
export interface AuthWithSchoolResult extends AuthResult {
  selectedSchool: string;
  selectedSchoolName: string;
  selectedSchoolDomain?: string;
  hasCompletedOnboarding: true;
}

/**
 * Auth result with course information
 */
export interface AuthWithCourseResult extends AuthWithSchoolResult {
  selectedCourseId: string;
}

/**
 * Onboarding status information
 */
export interface OnboardingStatus {
  hasCompletedOnboarding: boolean;
  selectedSchool?: string;
  selectedSchoolName?: string;
  selectedSchoolDomain?: string;
}

/**
 * Error response for auth failures
 */
export interface AuthError {
  message: string;
  status: number;
  type:
    | "unauthorized"
    | "not_onboarded"
    | "no_school"
    | "no_course"
    | "server_error";
}

/**
 * User metadata types for Clerk
 */
interface UserPublicMetadata {
  [key: string]: unknown;
}

interface UserPrivateMetadata {
  starredDocs?: string[];
  reportedDocs?: string[];
  [key: string]: unknown;
}

interface ClerkUserMetadataUpdate {
  publicMetadata?: UserPublicMetadata;
  privateMetadata?: UserPrivateMetadata;
}

interface ClerkUser {
  privateMetadata: UserPrivateMetadata;
}

/**
 * Authentication service that provides reusable auth patterns for API routes
 */
export class AuthService {
  private static instance: AuthService;

  private constructor() {}

  /**
   * Get singleton instance
   */
  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  /**
   * Basic auth validation - checks if user is authenticated
   * @returns Promise resolving to AuthResult or throwing AuthError
   */
  public async validateAuth(): Promise<AuthResult> {
    try {
      const authResult = await auth();
      const userId = authResult?.userId;

      if (!userId) {
        throw {
          message: "Unauthorized",
          status: 401,
          type: "unauthorized",
        } as AuthError;
      }

      const supabase = await supabaseService.createAuthenticatedClient();

      return {
        userId,
        supabase,
      };
    } catch (error) {
      if (this.isAuthError(error)) {
        throw error;
      }

      logger.error(
        LogContext.auth("validate_auth", undefined, {
          error: error instanceof Error ? error.message : "Unknown error",
        }),
        "Auth validation failed",
      );
      throw {
        message: "Authentication failed",
        status: 500,
        type: "server_error",
      } as AuthError;
    }
  }

  /**
   * Auth validation with school verification - checks if user is authenticated and has completed onboarding
   * @returns Promise resolving to AuthWithSchoolResult or throwing AuthError
   */
  public async validateAuthWithSchool(): Promise<AuthWithSchoolResult> {
    const authResult = await this.validateAuth();

    try {
      const onboardingStatus = await getUserOnboardingStatus(authResult.userId);

      if (!onboardingStatus.hasCompletedOnboarding) {
        throw {
          message: "Please complete onboarding first",
          status: 400,
          type: "not_onboarded",
        } as AuthError;
      }

      if (
        !onboardingStatus.selectedSchool || !onboardingStatus.selectedSchoolName
      ) {
        throw {
          message: "No school selected",
          status: 400,
          type: "no_school",
        } as AuthError;
      }

      return {
        ...authResult,
        selectedSchool: onboardingStatus.selectedSchool,
        selectedSchoolName: onboardingStatus.selectedSchoolName,
        selectedSchoolDomain: onboardingStatus.selectedSchoolDomain,
        hasCompletedOnboarding: true,
      };
    } catch (error) {
      if (this.isAuthError(error)) {
        throw error;
      }

      logger.error(
        LogContext.auth("validate_school", authResult.userId, {
          error: error instanceof Error ? error.message : "Unknown error",
        }),
        "School validation failed",
      );
      throw {
        message: "Failed to validate school access",
        status: 500,
        type: "server_error",
      } as AuthError;
    }
  }

  /**
   * Auth validation with course verification - checks if user is authenticated, has school, and has selected course
   * @returns Promise resolving to AuthWithCourseResult or throwing AuthError
   */
  public async validateAuthWithCourse(): Promise<AuthWithCourseResult> {
    const authWithSchool = await this.validateAuthWithSchool();

    try {
      const selectedCourseId = await getSelectedCourseForUser(
        authWithSchool.userId,
      );

      if (!selectedCourseId) {
        throw {
          message: "No course selected",
          status: 400,
          type: "no_course",
        } as AuthError;
      }

      return {
        ...authWithSchool,
        selectedCourseId,
      };
    } catch (error) {
      if (this.isAuthError(error)) {
        throw error;
      }

      logger.error(
        LogContext.auth("validate_course", authWithSchool.userId, {
          error: error instanceof Error ? error.message : "Unknown error",
        }),
        "Course validation failed",
      );
      throw {
        message: "Failed to validate course access",
        status: 500,
        type: "server_error",
      } as AuthError;
    }
  }

  /**
   * Get user's onboarding status
   * @param userId - User ID
   * @returns Promise resolving to OnboardingStatus
   */
  public async getOnboardingStatus(userId: string): Promise<OnboardingStatus> {
    try {
      return await getUserOnboardingStatus(userId);
    } catch (error) {
      logger.error({ error, userId }, "Failed to get onboarding status");
      throw {
        message: "Failed to get onboarding status",
        status: 500,
        type: "server_error",
      } as AuthError;
    }
  }

  /**
   * Get user's selected course ID
   * @param userId - User ID
   * @returns Promise resolving to course ID or undefined
   */
  public async getSelectedCourse(userId: string): Promise<string | undefined> {
    try {
      return await getSelectedCourseForUser(userId);
    } catch (error) {
      logger.error({ error, userId }, "Failed to get selected course");
      throw {
        message: "Failed to get selected course",
        status: 500,
        type: "server_error",
      } as AuthError;
    }
  }

  /**
   * Update user's Clerk metadata
   * @param userId - User ID
   * @param publicMetadata - Public metadata to update
   * @param privateMetadata - Private metadata to update
   */
  public async updateUserMetadata(
    userId: string,
    publicMetadata?: UserPublicMetadata,
    privateMetadata?: UserPrivateMetadata,
  ): Promise<void> {
    try {
      const client = await clerkClient();
      const metadata: ClerkUserMetadataUpdate = {};

      if (publicMetadata) {
        metadata.publicMetadata = publicMetadata;
      }

      if (privateMetadata) {
        metadata.privateMetadata = privateMetadata;
      }

      await client.users.updateUserMetadata(userId, metadata);
    } catch (error) {
      logger.error({ error, userId }, "Failed to update user metadata");
      throw {
        message: "Failed to update user metadata",
        status: 500,
        type: "server_error",
      } as AuthError;
    }
  }

  /**
   * Get user's starred and reported documents from Clerk metadata
   * @param userId - User ID
   * @returns Object with starred and reported document IDs
   */
  public async getUserDocumentMetadata(userId: string): Promise<{
    starredDocs: string[];
    reportedDocs: string[];
  }> {
    try {
      const client = await clerkClient();
      const user = await client.users.getUser(userId);
      const clerkUser = user as ClerkUser;

      return {
        starredDocs: clerkUser.privateMetadata.starredDocs || [],
        reportedDocs: clerkUser.privateMetadata.reportedDocs || [],
      };
    } catch (error) {
      logger.error({ error, userId }, "Failed to get user document metadata");
      throw {
        message: "Failed to get user document metadata",
        status: 500,
        type: "server_error",
      } as AuthError;
    }
  }

  /**
   * Verify user has access to a specific school's data
   * @param userId - User ID
   * @param schoolId - School ID to verify access to
   * @returns Promise resolving to true if user has access
   */
  public async verifySchoolAccess(
    userId: string,
    schoolId: string,
  ): Promise<boolean> {
    try {
      const onboardingStatus = await getUserOnboardingStatus(userId);
      return onboardingStatus.selectedSchool === schoolId;
    } catch (error) {
      logger.error(
        { error, userId, schoolId },
        "Failed to verify school access",
      );
      return false;
    }
  }

  /**
   * Convert AuthError to NextResponse
   * @param error - AuthError to convert
   * @returns NextResponse with appropriate status and message
   */
  public authErrorToResponse(error: AuthError): NextResponse {
    return NextResponse.json(
      { message: error.message, type: error.type },
      { status: error.status },
    );
  }

  /**
   * Type guard to check if error is an AuthError
   * @param error - Error to check
   * @returns True if error is AuthError
   */
  private isAuthError(error: unknown): error is AuthError {
    return error !== null &&
      typeof error === "object" &&
      "message" in error &&
      "status" in error &&
      "type" in error &&
      typeof (error as AuthError).message === "string" &&
      typeof (error as AuthError).status === "number" &&
      typeof (error as AuthError).type === "string";
  }
}

/**
 * Wraps an API route handler with authentication and optional authorization checks.
 *
 * Depending on the provided options, enforces user authentication, onboarding completion with school selection, and/or course selection before invoking the handler. Returns an appropriate JSON error response if validation fails.
 *
 * @param handler - The API route handler to be protected
 * @param options - Optional flags to require school or course validation
 * @returns A handler function that performs authentication and authorization before executing the original handler
 */
export function withAuth<T = Response>(
  handler: (
    authResult: AuthResult,
    request: Request,
    ...args: unknown[]
  ) => Promise<Response>,
  options: { requireSchool?: boolean; requireCourse?: boolean } = {},
) {
  return async (request: Request, ...args: unknown[]): Promise<Response> => {
    const authService = AuthService.getInstance();

    try {
      let authResult: AuthResult | AuthWithSchoolResult | AuthWithCourseResult;

      if (options.requireCourse) {
        authResult = await authService.validateAuthWithCourse();
      } else if (options.requireSchool) {
        authResult = await authService.validateAuthWithSchool();
      } else {
        authResult = await authService.validateAuth();
      }

      return await handler(authResult, request, ...args);
    } catch (error) {
      if (authService["isAuthError"](error)) {
        return authService.authErrorToResponse(error as AuthError);
      }

      logger.error({ error }, "Unexpected error in auth wrapper");
      return NextResponse.json(
        { message: "Internal server error", type: "server_error" },
        { status: 500 },
      );
    }
  };
}

/**
 * Wraps an API route handler to require user authentication and verified school selection.
 *
 * The handler receives an `AuthWithSchoolResult` containing user ID, Supabase client, selected school, and onboarding status.
 * Returns a handler that enforces authentication and school validation, responding with appropriate errors if validation fails.
 *
 * @returns A handler function with authentication and school validation enforced
 */
export function withAuthAndSchool<T = Response>(
  handler: (
    authResult: AuthWithSchoolResult,
    request: Request,
    ...args: unknown[]
  ) => Promise<Response>,
) {
  return withAuth(
    handler as (
      authResult: AuthResult,
      request: Request,
      ...args: unknown[]
    ) => Promise<Response>,
    { requireSchool: true },
  );
}

/**
 * Wraps an API route handler to enforce authentication, onboarding completion, school selection, and course selection.
 *
 * The handler receives an `AuthWithCourseResult` containing user ID, Supabase client, selected school, onboarding status, and selected course ID.
 * Returns a handler that responds with appropriate error messages if any validation fails.
 *
 * @returns A handler function with all authentication and selection validations applied
 */
export function withAuthAndCourse<T = Response>(
  handler: (
    authResult: AuthWithCourseResult,
    request: Request,
    ...args: unknown[]
  ) => Promise<Response>,
) {
  return withAuth(
    handler as (
      authResult: AuthResult,
      request: Request,
      ...args: unknown[]
    ) => Promise<Response>,
    { requireCourse: true },
  );
}

// Export singleton instance for convenience
export const authService = AuthService.getInstance();
