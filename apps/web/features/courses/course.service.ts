import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/lib/database.types";

// Import the new simplified course operations
import * as courseOps from "@/lib/services/courses/course-operations";

import {
  CourseCreationParams,
  CourseCreationResult,
  CourseDeletionResult,
  CourseFetchParams,
  CourseFetchResult,
  CourseUpdateParams,
  CourseUpdateResult,
  CourseVerificationParams,
  CourseVerificationResult,
} from "@/lib/types/CourseTypes";

/**
 * Simplified CourseService - now just a thin wrapper around utility functions
 * Maintained for backward compatibility with existing code
 */
export class CourseService {
  private static instance: CourseService;

  private constructor() {}

  public static getInstance(): CourseService {
    if (!CourseService.instance) {
      CourseService.instance = new CourseService();
    }
    return CourseService.instance;
  }

  /**
   * Fetch courses for a specific school
   */
  public async fetchCourses(
    supabase: SupabaseClient<Database>,
    params: CourseFetchParams,
  ): Promise<CourseFetchResult> {
    return courseOps.fetchCourses(supabase, params);
  }

  /**
   * Verify a course code against school database and patterns
   */
  public async verifyCourse(
    supabase: SupabaseClient<Database>,
    params: CourseVerificationParams,
  ): Promise<CourseVerificationResult> {
    return courseOps.verifyCourse(supabase, params);
  }

  /**
   * Create a new course with optional syllabus processing
   */
  public async createCourse(
    supabase: SupabaseClient<Database>,
    params: CourseCreationParams,
  ): Promise<CourseCreationResult> {
    return courseOps.createCourse(supabase, params);
  }

  /**
   * Update an existing course
   */
  public async updateCourse(
    supabase: SupabaseClient<Database>,
    params: CourseUpdateParams,
  ): Promise<CourseUpdateResult> {
    return courseOps.updateCourse(supabase, params);
  }

  /**
   * Delete a course and all associated data
   */
  public async deleteCourse(
    supabase: SupabaseClient<Database>,
    courseId: string,
  ): Promise<CourseDeletionResult> {
    return courseOps.deleteCourse(supabase, courseId);
  }
}

// Export singleton instance for easy access
export const courseService = CourseService.getInstance();

/**
 * Returns the singleton CourseService instance
 */
export function createCourseService(): CourseService {
  return CourseService.getInstance();
}

// Export the course extraction function from its dedicated module
export { extractCourseInfo } from "@/lib/services/courses/course-extraction";