import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/lib/database.types";
import logger, { LogContext } from "@/lib/logger";
import crypto from "crypto";
import { openAIService } from "@/lib/services/ai/openai.service";
import { geminiService } from "@/lib/services/ai/gemini.service";

import {
  CourseExtractionRequest,
  CourseExtractionResponse,
  CourseInfoSchema,
} from "@/lib/types/AITypes";
import {
  CourseCreationParams,
  CourseCreationResult,
  CourseDeletionResult,
  CourseFetchParams,
  CourseFetchResult,
  CourseServiceConfig,
  CourseServiceError,
  CourseUpdateParams,
  CourseUpdateResult,
  CourseVerificationParams,
  CourseVerificationResult,
  SyllabusProcessingParams,
  SyllabusProcessingResult,
} from "@/lib/types/CourseTypes";

import { ICourse, ICourseInsert } from "@/features/courses/course.model";
import { cleanupTempFiles } from "@/lib/services/file";

// Note: Cache invalidation is handled client-side by React Query hooks

/**
 * CourseService - Centralized business logic for course operations
 *
 * This service extracts all business logic from API routes and provides:
 * - Course CRUD operations
 * - Course verification against school databases
 * - File upload handling and syllabus processing
 * - Document ingestion orchestration
 * - Integration with React Query caching patterns
 * - Comprehensive error handling and logging
 */
export class CourseService {
  private static instance: CourseService;
  private config: CourseServiceConfig;

  private constructor(config: CourseServiceConfig = {}) {
    this.config = {
      cacheEnabled: config.cacheEnabled ?? true,
      cacheTTL: config.cacheTTL ?? 15 * 60 * 1000, // 15 minutes
      maxRetries: config.maxRetries ?? 3,
      openAIModel: config.openAIModel ?? "gpt-3.5-turbo",
      ...config,
    };
  }

  public static getInstance(config?: CourseServiceConfig): CourseService {
    if (!CourseService.instance) {
      CourseService.instance = new CourseService(config);
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
    try {
      logger.info({ schoolId: params.schoolId }, "Fetching courses for school");

      const { data: courses, error } = await supabase
        .from("courses")
        .select("*")
        .eq("school_id", params.schoolId)
        .order("code", { ascending: true });

      if (error) {
        logger.error(
          { error, schoolId: params.schoolId },
          "Supabase error fetching courses",
        );
        throw this.createServiceError(
          "Failed to fetch courses from database",
          "database",
          error,
        );
      }

      logger.info({
        schoolId: params.schoolId,
        courseCount: courses?.length || 0,
      }, "Successfully fetched courses");

      return {
        success: true,
        courses: courses || [],
      };
    } catch (error) {
      logger.error(
        { error, schoolId: params.schoolId },
        "Failed to fetch courses",
      );
      return {
        success: false,
        message: error instanceof Error
          ? error.message
          : "Failed to fetch courses",
      };
    }
  }

  /**
   * Verify a course code against school database and patterns
   */
  public async verifyCourse(
    supabase: SupabaseClient<Database>,
    params: CourseVerificationParams,
  ): Promise<CourseVerificationResult> {
    try {
      logger.info({
        courseCode: params.courseCode,
        schoolId: params.schoolId,
        schoolName: params.schoolName,
      }, "Starting course verification");

      // Check for duplicate course codes in the same school
      const duplicateResult = await this.checkForDuplicateCourse(
        supabase,
        params.courseCode,
        params.schoolId,
      );
      if (!duplicateResult.verified) {
        return duplicateResult;
      }

      // Focus on content safety rather than course existence verification
      const safetyPrompt =
        `You are a content safety moderator for an educational platform. Analyze the course code "${params.courseCode}" and title (if provided) for any inappropriate, harmful, or non-academic content.

Check for:
1. Offensive, profane, or inappropriate language
2. Non-academic or spam-like content
3. Potentially harmful or misleading course names
4. Basic format compliance (contains letters/numbers, reasonable length)

DO NOT reject courses based on:
- Whether the course exists at a specific school
- Whether you recognize the department code
- Obscure or new course offerings
- Regional or specialized academic programs

Respond with a JSON object containing:
{
  "isSafe": boolean,
  "confidence": number (0-1),
  "reason": string (brief explanation if unsafe, otherwise "Content appears appropriate for academic use")
}`;

      const safetyResponse = await openAIService.chatCompletion([
        { role: "user", content: safetyPrompt },
      ], {
        model: "gpt-3.5-turbo",
        temperature: 0,
        responseFormat: { type: "json_object" },
      });

      if (!safetyResponse.success || !safetyResponse.data) {
        throw new Error("Failed to validate course content safety");
      }

      const safetyResult = JSON.parse(safetyResponse.data);

      // Only block if content is clearly unsafe with high confidence
      if (!safetyResult.isSafe && safetyResult.confidence > 0.8) {
        return {
          verified: false,
          message: `Course content blocked: ${safetyResult.reason}`,
          confidence: safetyResult.confidence,
          type: "content_unsafe",
        };
      }

      // Allow all courses that pass basic safety checks
      return {
        verified: true,
        message: "Course verified for academic use",
        confidence: safetyResult.confidence,
        reason: safetyResult.reason,
      };
    } catch (error) {
      logger.error({ error, params }, "Failed to verify course");
      throw this.createServiceError(
        "Failed to verify course",
        "external_api",
        error,
      );
    }
  }

  /**
   * Create a new course with optional syllabus processing
   */
  public async createCourse(
    supabase: SupabaseClient<Database>,
    params: CourseCreationParams,
  ): Promise<CourseCreationResult> {
    let cleanupRequired = false;

    try {
      logger.info({
        title: params.title,
        code: params.code,
        schoolId: params.schoolId,
        hasFile: !!params.uploadedFileUrl,
      }, "Starting course creation");

      // Validate required parameters
      if (!params.title || !params.code) {
        throw this.createServiceError(
          "Title and code are required",
          "validation",
        );
      }

      const courseToCreate: ICourseInsert = {
        title: params.title,
        code: params.code,
        school_id: params.schoolId,
      };

      // Create the course in database
      const { data: newCourse, error: courseError } = await supabase
        .from("courses")
        .insert(courseToCreate)
        .select()
        .single();

      if (courseError) {
        logger.error(
          { error: courseError, courseToCreate },
          "Supabase error creating course",
        );

        // Mark for cleanup if course creation fails
        cleanupRequired = true;

        if (courseError.code === "23505") {
          return {
            success: false,
            message: "A course with this code already exists at your school.",
            type: "duplicate",
          };
        }

        throw this.createServiceError(
          "Failed to create course in database",
          "database",
          courseError,
        );
      }

      // Process syllabus if uploaded
      if (params.uploadedFileUrl && newCourse) {
        const syllabusResult = await this.processSyllabus({
          fileKey: crypto.randomUUID(),
          fileName: "Course Syllabus.pdf",
          fileUrl: params.uploadedFileUrl,
          fileType: "application/pdf",
          courseId: newCourse.id,
        });

        if (!syllabusResult.success) {
          logger.warn({ courseId: newCourse.id }, "Syllabus processing failed");

          // Cache invalidation handled by client-side React Query hooks

          return {
            success: true,
            course: newCourse as ICourse,
            message:
              "Course created but failed to process syllabus. You can upload it again later.",
            type: "partial_success",
          };
        }

        logger.info(
          { courseId: newCourse.id },
          "Course created with successful syllabus processing",
        );
      }

      // Cache invalidation handled by client-side React Query hooks

      return {
        success: true,
        course: newCourse as ICourse,
        message: "Course created successfully",
        type: "success",
      };
    } catch (error) {
      logger.error({ error, params }, "Failed to create course");

      // Clean up temp files if course creation fails
      if (
        cleanupRequired && params.tempFileKeys && params.tempFileKeys.length > 0
      ) {
        logger.info(
          { tempFileKeys: params.tempFileKeys },
          "Cleaning up temp files after course creation failure",
        );
        await cleanupTempFiles(params.tempFileKeys);
      }

      const err = error as Error;
      if (err instanceof CourseServiceError) {
        return {
          success: false,
          message: err.message,
          type: "error",
          confidence: err.confidence,
        };
      }

      return {
        success: false,
        message: err?.message ||
          "An unexpected error occurred while creating the course",
        type: "error",
      };
    }
  }

  /**
   * Update an existing course
   */
  public async updateCourse(
    supabase: SupabaseClient<Database>,
    params: CourseUpdateParams,
  ): Promise<CourseUpdateResult> {
    try {
      logger.info(
        { courseId: params.courseId, updates: params.updates },
        "Updating course",
      );

      const { data: updatedCourse, error } = await supabase
        .from("courses")
        .update(params.updates)
        .eq("id", params.courseId)
        .select()
        .single();

      if (error) {
        logger.error({ error, params }, "Supabase error updating course");
        throw this.createServiceError(
          "Failed to update course in database",
          "database",
          error,
        );
      }

      logger.info({ courseId: params.courseId }, "Successfully updated course");

      // Cache invalidation handled by client-side React Query hooks

      return {
        success: true,
        course: updatedCourse as ICourse,
        message: "Course updated successfully",
      };
    } catch (error) {
      logger.error({ error, params }, "Failed to update course");

      const err = error as Error;
      if (err instanceof CourseServiceError) {
        return {
          success: false,
          message: err.message,
        };
      }

      return {
        success: false,
        message: err?.message || "Failed to update course",
      };
    }
  }

  /**
   * Delete a course and all associated data
   */
  public async deleteCourse(
    supabase: SupabaseClient<Database>,
    courseId: string,
  ): Promise<CourseDeletionResult> {
    try {
      logger.info({ courseId }, "Starting course deletion");

      // Get all documents for this course
      const { data: docs, error: docsQueryError } = await supabase
        .from("docs")
        .select("id")
        .eq("course_id", courseId);

      if (docsQueryError) {
        logger.error(
          { error: docsQueryError, courseId },
          "Failed to query documents for course deletion",
        );
        throw this.createServiceError(
          `Failed to query documents: ${docsQueryError.message}`,
          "database",
          docsQueryError,
        );
      }

      // Delete chunks and documents if they exist
      if (docs && docs.length > 0) {
        const docIds = docs.map((doc) => doc.id);

        // Delete all chunks for these documents
        const { error: chunksError } = await supabase
          .from("chunks")
          .delete()
          .in("doc_id", docIds);

        if (chunksError) {
          logger.error(
            { error: chunksError, courseId, docIds },
            "Failed to delete chunks",
          );
          throw this.createServiceError(
            `Failed to delete chunks: ${chunksError.message}`,
            "database",
            chunksError,
          );
        }

        // Delete all documents
        const { error: docsError } = await supabase
          .from("docs")
          .delete()
          .in("id", docIds);

        if (docsError) {
          logger.error(
            { error: docsError, courseId, docIds },
            "Failed to delete documents",
          );
          throw this.createServiceError(
            `Failed to delete documents: ${docsError.message}`,
            "database",
            docsError,
          );
        }
      }

      // Delete all chats for this course
      const { error: chatsError } = await supabase
        .from("chats")
        .delete()
        .eq("course_id", courseId);

      if (chatsError) {
        logger.error({ error: chatsError, courseId }, "Failed to delete chats");
        throw this.createServiceError(
          `Failed to delete chats: ${chatsError.message}`,
          "database",
          chatsError,
        );
      }

      // Handle lecture chat sessions and messages
      const { data: sessions, error: sessionsQueryError } = await supabase
        .from("lecture_chat_sessions")
        .select("id")
        .eq("course_id", courseId);

      if (sessionsQueryError) {
        logger.error(
          { error: sessionsQueryError, courseId },
          "Failed to query lecture chat sessions",
        );
        throw this.createServiceError(
          `Failed to query lecture chat sessions: ${sessionsQueryError.message}`,
          "database",
          sessionsQueryError,
        );
      }

      if (sessions && sessions.length > 0) {
        const sessionIds = sessions.map((session) => session.id);

        // Delete all messages for these sessions
        const { error: messagesError } = await supabase
          .from("lecture_chat_messages")
          .delete()
          .in("session_id", sessionIds);

        if (messagesError) {
          logger.error(
            { error: messagesError, courseId, sessionIds },
            "Failed to delete lecture chat messages",
          );
          throw this.createServiceError(
            `Failed to delete lecture chat messages: ${messagesError.message}`,
            "database",
            messagesError,
          );
        }
      }

      // Delete all sessions for this course
      const { error: sessionsError } = await supabase
        .from("lecture_chat_sessions")
        .delete()
        .eq("course_id", courseId);

      if (sessionsError) {
        logger.error(
          { error: sessionsError, courseId },
          "Failed to delete lecture chat sessions",
        );
        throw this.createServiceError(
          `Failed to delete lecture chat sessions: ${sessionsError.message}`,
          "database",
          sessionsError,
        );
      }

      // Finally delete the course
      const { error: courseError } = await supabase
        .from("courses")
        .delete()
        .eq("id", courseId);

      if (courseError) {
        logger.error(
          { error: courseError, courseId },
          "Failed to delete course",
        );
        throw this.createServiceError(
          `Failed to delete course: ${courseError.message}`,
          "database",
          courseError,
        );
      }

      logger.info(
        { courseId },
        "Successfully deleted course and all associated data",
      );

      // Cache invalidation handled by client-side React Query hooks

      return { success: true };
    } catch (error) {
      logger.error({ error, courseId }, "Error in course deletion process");

      const err = error as Error;
      if (err instanceof CourseServiceError) {
        return {
          success: false,
          error: err.message,
        };
      }

      return {
        success: false,
        error: err?.message || "An unknown error occurred",
      };
    }
  }

  /**
   * Process syllabus file for a course
   */
  private async processSyllabus(
    params: SyllabusProcessingParams,
  ): Promise<SyllabusProcessingResult> {
    try {
      logger.info(
        { courseId: params.courseId },
        "Starting syllabus processing",
      );

      const { ingestDocument } = await import(
        "@/features/document/document-ingestion.service"
      );
      const ingestionSuccess = await ingestDocument({
        fileKey: params.fileKey,
        fileName: params.fileName,
        fileUrl: params.fileUrl,
        fileType: params.fileType,
        courseId: params.courseId,
      });

      if (!ingestionSuccess) {
        logger.warn({ courseId: params.courseId }, "Syllabus ingestion failed");
        return {
          success: false,
          message: "Failed to process syllabus document",
        };
      }

      logger.info(
        { courseId: params.courseId },
        "Syllabus processing completed successfully",
      );
      return {
        success: true,
        message: "Syllabus processed successfully",
      };
    } catch (error) {
      logger.error(
        { error, courseId: params.courseId },
        "Error during syllabus processing",
      );
      return {
        success: false,
        message: error instanceof Error
          ? error.message
          : "Unknown error during syllabus processing",
      };
    }
  }

  /**
   * Check for duplicate course codes in the same school
   */
  private async checkForDuplicateCourse(
    supabase: SupabaseClient<Database>,
    courseCode: string,
    schoolId: string,
  ): Promise<CourseVerificationResult> {
    const { data: existingCourse, error: duplicateCheckError } = await supabase
      .from("courses")
      .select("code")
      .eq("school_id", schoolId)
      .eq("code", courseCode)
      .single();

    if (duplicateCheckError && duplicateCheckError.code !== "PGRST116") { // PGRST116 = no rows found
      logger.error(
        { error: duplicateCheckError, courseCode, schoolId },
        "Error checking for duplicate course code",
      );
      throw this.createServiceError(
        "Failed to verify course uniqueness",
        "database",
        duplicateCheckError,
      );
    }

    if (existingCourse) {
      logger.warn({ courseCode, schoolId }, "Duplicate course code found");
      return {
        verified: false,
        message:
          `A course with code ${courseCode} already exists at this school`,
        type: "duplicate",
      };
    }

    return { verified: true, message: "No duplicate found" };
  }

  /**
   * Create a standardized service error
   */
  private createServiceError(
    message: string,
    type: CourseServiceError["type"],
    originalError?: any,
    confidence?: number,
  ): CourseServiceError {
    const error = new CourseServiceError(
      message,
      type,
      originalError?.code,
      confidence,
    );

    if (originalError) {
      error.cause = originalError;
    }

    return error;
  }

  // Cache invalidation is handled client-side by React Query hooks
  // Server-side services should not directly manipulate client caches
}

// Export singleton instance for easy access
export const courseService = CourseService.getInstance();

/**
 * Returns the singleton CourseService instance with React Query cache integration.
 *
 * @returns The singleton CourseService instance
 */
export function createCourseService(): CourseService {
  return CourseService.getInstance();
}

// PDF Parser type definitions
interface PDFTextItem {
  R: Array<{ T: string }>;
}

interface PDFPage {
  Texts: PDFTextItem[];
}

interface PDFData {
  Pages: PDFPage[];
}

function extractJSONFromText(text: string): unknown {
  let cleanText = text.trim();

  // Method 1: Look for JSON in markdown code blocks
  const markdownMatch = cleanText.match(/```(?:json)?\s*\{[[\s\S]*?]\}\s*```/);
  if (markdownMatch && markdownMatch[1]) {
    try {
      return JSON.parse(markdownMatch[1].trim());
    } catch (e) {
      // Continue to next method
    }
  }

  // Method 2: Look for first JSON object in the text
  const jsonMatch = cleanText.match(/\{[\s\S]*?\}/);
  if (jsonMatch && jsonMatch[0]) {
    try {
      return JSON.parse(jsonMatch[0]);
    } catch (e) {
      // Continue to next method
    }
  }

  // Method 3: Remove markdown markers manually
  const cleanedText = cleanText
    .replace(/^```(?:json)?/gm, "")
    .replace(/```$/gm, "")
    .trim();

  try {
    return JSON.parse(cleanedText);
  } catch (e) {
    throw new Error(
      `Failed to parse JSON from response: ${text.substring(0, 200)}...`,
    );
  }
}

/**
 * Extract course information from document content
 */
export async function extractCourseInfo(
  request: CourseExtractionRequest,
): Promise<CourseExtractionResponse> {
  try {
    logger.info(
      LogContext.ai("extract_course_info", "gemini", {
        fileUrl: request.fileUrl,
      }),
      "Starting course info extraction",
    );

    // Fetch and process file content
    const response = await fetch(request.fileUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch file: ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const contentType = response.headers.get("content-type") || "";

    let text = "";
    if (contentType.includes("application/pdf")) {
      // Use existing PDF parsing logic
      const PDFParser = require("pdf2json");
      const buffer = Buffer.from(arrayBuffer);
      text = await new Promise<string>((resolve, reject) => {
        const pdfParser = new PDFParser();
        pdfParser.on("pdfParser_dataReady", (pdfData: PDFData) => {
          try {
            const extractedText = pdfData.Pages
              .map((page: PDFPage) =>
                page.Texts
                  .map((text: PDFTextItem) => decodeURIComponent(text.R[0].T))
                  .join(" ")
              )
              .join("\n")
              .trim();
            resolve(extractedText);
          } catch (error) {
            reject(new Error("Failed to extract text from PDF structure"));
          }
        });
        pdfParser.on("pdfParser_dataError", (error: Error) => {
          reject(new Error(`PDF parsing error: ${error}`));
        });
        pdfParser.parseBuffer(buffer);
      });
    } else if (contentType.includes("text/")) {
      text = new TextDecoder().decode(arrayBuffer);
    } else {
      throw new Error(`Unsupported file type: ${contentType}`);
    }

    if (!text.trim()) {
      throw new Error("No text content found in file");
    }

    // Truncate very long text to avoid token limits
    if (text.length > 10000) {
      text = text.substring(0, 10000);
    }

    const prompt = `
        Extract course information from the following syllabus text. You must respond with ONLY valid JSON in this exact format:

        {
          "courseCode": "COURSE_CODE_HERE_OR_NULL",
          "courseTitle": "COURSE_TITLE_HERE_OR_NULL", 
          "schoolName": "SCHOOL_NAME_HERE_OR_NULL"
        }

        Rules:
        - Return null for any field that cannot be found or determined with confidence
        - Do not include any explanatory text, only the JSON object
        - Do not wrap the JSON in markdown code blocks
        - Ensure the JSON is valid and parseable

        Syllabus text:
        ${text}
      `;

    const geminiResponse = await geminiService.chat([
      { role: "user", content: prompt },
    ]);

    if (!geminiResponse.success || !geminiResponse.data) {
      throw new Error("Failed to get response from Gemini");
    }

    // Parse the structured response
    const parsedJSON = extractJSONFromText(geminiResponse.data);
    const courseInfo = CourseInfoSchema.parse(parsedJSON);

    // Normalize the response
    const normalizedResponse = {
      courseCode: courseInfo.courseCode || "",
      courseTitle: courseInfo.courseTitle || "",
      confidence: 0.8,
    };

    logger.info(
      LogContext.ai("extract_course_info", "gemini", {
        hasCode: !!normalizedResponse.courseCode,
        hasTitle: !!normalizedResponse.courseTitle,
      }),
      "Course info extraction completed",
    );

    return {
      success: true,
      data: courseInfo,
      provider: "gemini",
      confidence: 0.8,
    };
  } catch (error) {
    logger.error(
      LogContext.ai("extract_course_info", "gemini", {
        error: error instanceof Error ? error.message : "Unknown error",
        fileUrl: request.fileUrl,
      }),
      "Course info extraction failed",
    );

    return {
      success: false,
      error: error instanceof Error
        ? error.message
        : "Failed to extract course information",
      provider: "gemini",
      confidence: 0,
      data: {
        courseCode: null,
        courseTitle: null,
        schoolName: null,
      },
    };
  }
}
