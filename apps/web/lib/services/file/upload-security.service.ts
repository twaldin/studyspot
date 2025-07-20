import { UploadThingError } from "uploadthing/server";
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/lib/database.types';
import { getUserOnboardingStatus } from "@/lib/clerk";
import logger from "@/lib/logger";

// Rate limiting configuration
const RATE_LIMIT = 10; // uploads per window
const RATE_WINDOW = 60 * 1000; // 1 minute

// In-memory rate limiting store (consider Redis for production)
const uploadAttempts = new Map<string, { count: number; resetTime: number }>();

export interface CourseValidationResult {
  isValid: boolean;
  courseId: string;
  schoolId?: string;
  error?: string;
}

export interface UserAuthResult {
  userId: string;
  hasOnboarding: boolean;
  selectedSchool?: string;
  error?: string;
}

/**
 * Rate limiting service for upload attempts
 */
export class RateLimitService {
  /**
   * Checks if user has exceeded rate limit for uploads
   */
  static checkRateLimit(userId: string): void {
    const now = Date.now();
    const userAttempts = uploadAttempts.get(userId);

    if (!userAttempts || now > userAttempts.resetTime) {
      uploadAttempts.set(userId, { count: 1, resetTime: now + RATE_WINDOW });
      return;
    }

    if (userAttempts.count >= RATE_LIMIT) {
      throw new UploadThingError("Rate limit exceeded. Please try again later.");
    }

    userAttempts.count++;
  }

  /**
   * Gets current rate limit status for a user
   */
  static getRateLimitStatus(userId: string): {
    attempts: number;
    remaining: number;
    resetTime: number;
  } {
    const now = Date.now();
    const userAttempts = uploadAttempts.get(userId);

    if (!userAttempts || now > userAttempts.resetTime) {
      return {
        attempts: 0,
        remaining: RATE_LIMIT,
        resetTime: now + RATE_WINDOW
      };
    }

    return {
      attempts: userAttempts.count,
      remaining: Math.max(0, RATE_LIMIT - userAttempts.count),
      resetTime: userAttempts.resetTime
    };
  }

  /**
   * Clears rate limit for a user (useful for testing)
   */
  static clearRateLimit(userId: string): void {
    uploadAttempts.delete(userId);
  }
}

/**
 * User authentication and authorization service for uploads
 */
export class UploadAuthService {
  /**
   * Validates user authentication and onboarding status
   */
  static async validateUserAuth(userId: string): Promise<UserAuthResult> {
    if (!userId) {
      return {
        userId: '',
        hasOnboarding: false,
        error: "Unauthorized: No user ID found."
      };
    }

    try {
      const onboardingStatus = await getUserOnboardingStatus(userId);

      if (!onboardingStatus.hasCompletedOnboarding || !onboardingStatus.selectedSchool) {
        return {
          userId,
          hasOnboarding: false,
          error: "Please complete onboarding first"
        };
      }

      return {
        userId,
        hasOnboarding: true,
        selectedSchool: onboardingStatus.selectedSchool
      };
    } catch (error) {
      logger.error({ error, userId }, "Error validating user authentication");
      return {
        userId,
        hasOnboarding: false,
        error: "Error validating user authentication"
      };
    }
  }

  /**
   * Validates course access permissions for a user
   */
  static async validateCourseAccess(
    supabase: SupabaseClient<Database>,
    courseId: string,
    userSchool: string,
    userId: string
  ): Promise<CourseValidationResult> {
    // Skip validation for temporary course IDs used during course creation
    if (courseId === 'temp') {
      logger.info({ userId, courseId }, "Skipping course validation for temporary course ID");
      return { isValid: true, courseId };
    }

    try {
      const { data: course, error } = await supabase
        .from('courses')
        .select('id, school_id')
        .eq('id', courseId)
        .single();

      if (error || !course) {
        return {
          isValid: false,
          courseId,
          error: "Course not found"
        };
      }

      if (course.school_id !== userSchool) {
        return {
          isValid: false,
          courseId,
          schoolId: course.school_id,
          error: "Unauthorized: You don't have permission to upload to this course"
        };
      }

      return {
        isValid: true,
        courseId,
        schoolId: course.school_id
      };
    } catch (error) {
      logger.error({ error, userId, courseId }, "Error validating course permissions");
      return {
        isValid: false,
        courseId,
        error: "Error validating permissions"
      };
    }
  }

  /**
   * Comprehensive security check combining auth, rate limiting, and course validation
   */
  static async performSecurityChecks(
    supabase: SupabaseClient<Database>,
    userId: string,
    courseId: string
  ): Promise<{
    isValid: boolean;
    userId: string;
    courseId: string;
    userSchool?: string;
    error?: string;
  }> {
    // 1. Check rate limiting
    try {
      RateLimitService.checkRateLimit(userId);
    } catch (error) {
      return {
        isValid: false,
        userId,
        courseId,
        error: error instanceof UploadThingError ? error.message : "Rate limit exceeded"
      };
    }

    // 2. Validate user authentication
    const authResult = await this.validateUserAuth(userId);
    if (!authResult.hasOnboarding || authResult.error) {
      return {
        isValid: false,
        userId,
        courseId,
        error: authResult.error
      };
    }

    // 3. Validate course access (if not temp)
    if (courseId !== 'temp') {
      const courseResult = await this.validateCourseAccess(
        supabase,
        courseId,
        authResult.selectedSchool!,
        userId
      );

      if (!courseResult.isValid) {
        return {
          isValid: false,
          userId,
          courseId,
          error: courseResult.error
        };
      }
    }

    return {
      isValid: true,
      userId,
      courseId,
      userSchool: authResult.selectedSchool
    };
  }
}

/**
 * Upload security context that combines all security-related information
 */
export interface UploadSecurityContext {
  userId: string;
  courseId: string;
  userSchool?: string;
  rateLimitStatus: {
    attempts: number;
    remaining: number;
    resetTime: number;
  };
}

/**
 * Main security service that orchestrates all upload security checks
 */
export class UploadSecurityService {
  /**
   * Performs all security validations and returns security context
   */
  static async validateUploadSecurity(
    supabase: SupabaseClient<Database>,
    userId: string,
    courseId: string
  ): Promise<UploadSecurityContext> {
    const securityResult = await UploadAuthService.performSecurityChecks(
      supabase,
      userId,
      courseId
    );

    if (!securityResult.isValid) {
      throw new UploadThingError(securityResult.error || "Security validation failed");
    }

    const rateLimitStatus = RateLimitService.getRateLimitStatus(userId);

    return {
      userId: securityResult.userId,
      courseId: securityResult.courseId,
      userSchool: securityResult.userSchool,
      rateLimitStatus
    };
  }

  /**
   * Lightweight security check that just validates authentication
   */
  static async validateBasicAuth(userId: string): Promise<{
    userId: string;
    userSchool?: string;
  }> {
    const authResult = await UploadAuthService.validateUserAuth(userId);
    
    if (!authResult.hasOnboarding || authResult.error) {
      throw new UploadThingError(authResult.error || "Authentication failed");
    }

    return {
      userId: authResult.userId,
      userSchool: authResult.selectedSchool
    };
  }
}