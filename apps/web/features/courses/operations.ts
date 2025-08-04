import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/lib/database.types";
import logger from "@/lib/logger";
import crypto from "crypto";
import { openAIService } from "@/lib/services/ai/openai.service";
import { ICourse, ICourseInsert } from "@/features/courses/course.model";
import { cleanupTempFiles } from "@/lib/services/file";
import { documentIngestionService } from "@/lib/services/document-ingestion/document-ingestion.service";
import { clerkClient } from "@clerk/nextjs/server";

/**
 * Fetch courses for a specific school
 */
export async function fetchCourses(
  supabase: SupabaseClient<Database>,
  schoolId: string,
): Promise<ICourse[]> {
  logger.info({ schoolId }, "Fetching courses for school");

  const { data: courses, error } = await supabase
    .from("courses")
    .select("*")
    .eq("school_id", schoolId)
    .order("code", { ascending: true });

  if (error) {
    logger.error({ error, schoolId }, "Error fetching courses");
    throw new Error("Failed to fetch courses from database");
  }

  logger.info({ schoolId, courseCount: courses?.length || 0 }, "Successfully fetched courses");
  return courses || [];
}

/**
 * Verify a course code against school database and patterns
 */
export async function verifyCourse(
  supabase: SupabaseClient<Database>,
  courseCode: string,
  schoolId: string,
  schoolName: string,
): Promise<{ verified: boolean; message: string; reason?: string }> {
  logger.info({ courseCode, schoolId, schoolName }, "Starting course verification");

  // Check for duplicate course codes in the same school
  const { data: existingCourse, error: duplicateCheckError } = await supabase
    .from("courses")
    .select("code")
    .eq("school_id", schoolId)
    .eq("code", courseCode)
    .single();

  if (duplicateCheckError && duplicateCheckError.code !== "PGRST116") {
    logger.error({ error: duplicateCheckError, courseCode, schoolId }, "Error checking for duplicate course code");
    throw new Error("Failed to verify course uniqueness");
  }

  if (existingCourse) {
    logger.warn({ courseCode, schoolId }, "Duplicate course code found");
    return {
      verified: false,
      message: `A course with code ${courseCode} already exists at this school`,
    };
  }

  // Content safety check
  const safetyPrompt = `You are a content safety moderator for an educational platform. Analyze the course code "${courseCode}" for any inappropriate, harmful, or non-academic content.

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
      reason: safetyResult.reason,
    };
  }

  return {
    verified: true,
    message: "Course verified for academic use",
    reason: safetyResult.reason,
  };
}

/**
 * Create a new course with optional syllabus processing
 */
export async function createCourse(
  supabase: SupabaseClient<Database>,
  params: {
    title: string;
    code: string;
    schoolId: string;
    uploadedFileUrl?: string;
    tempFileKeys?: string[];
    canvas_course_id?: number;
  },
): Promise<{ course: ICourse; message: string; type: "success" | "partial_success" }> {
  logger.info({
    title: params.title,
    code: params.code,
    schoolId: params.schoolId,
    hasFile: !!params.uploadedFileUrl,
    canvasCourseId: params.canvas_course_id,
  }, "Starting course creation");

  const courseToCreate: ICourseInsert = {
    title: params.title,
    code: params.code,
    school_id: params.schoolId,
    canvas_course_id: params.canvas_course_id,
  };

  // Create the course in database
  const { data: newCourse, error: courseError } = await supabase
    .from("courses")
    .insert(courseToCreate)
    .select()
    .single();

  if (courseError) {
    logger.error({ error: courseError, courseToCreate }, "Error creating course");

    // Clean up temp files if course creation fails
    if (params.tempFileKeys && params.tempFileKeys.length > 0) {
      logger.info({ tempFileKeys: params.tempFileKeys }, "Cleaning up temp files after course creation failure");
      await cleanupTempFiles(params.tempFileKeys);
    }

    if (courseError.code === "23505") {
      throw new Error("A course with this code already exists at your school.");
    }

    throw new Error("Failed to create course in database");
  }

  // Process syllabus if uploaded
  if (params.uploadedFileUrl && newCourse) {
    const syllabusResult = await processSyllabus({
      fileKey: crypto.randomUUID(),
      fileName: "Course Syllabus.pdf",
      fileUrl: params.uploadedFileUrl,
      fileType: "application/pdf",
      courseId: newCourse.id,
    });

    if (!syllabusResult) {
      logger.warn({ courseId: newCourse.id }, "Syllabus processing failed");
      return {
        course: newCourse as ICourse,
        message: "Course created but failed to process syllabus. You can upload it again later.",
        type: "partial_success",
      };
    }

    logger.info({ courseId: newCourse.id }, "Course created with successful syllabus processing");
  }

  return {
    course: newCourse as ICourse,
    message: "Course created successfully",
    type: "success",
  };
}

/**
 * Update an existing course
 */
export async function updateCourse(
  supabase: SupabaseClient<Database>,
  courseId: string,
  updates: Partial<ICourse>,
): Promise<ICourse> {
  logger.info({ courseId, updates }, "Updating course");

  const { data: updatedCourse, error } = await supabase
    .from("courses")
    .update(updates)
    .eq("id", courseId)
    .select()
    .single();

  if (error) {
    logger.error({ error, courseId, updates }, "Error updating course");
    throw new Error("Failed to update course in database");
  }

  logger.info({ courseId }, "Successfully updated course");
  return updatedCourse as ICourse;
}

/**
 * Delete a course and all associated data
 */
export async function deleteCourse(
  supabase: SupabaseClient<Database>,
  courseId: string,
): Promise<void> {
  logger.info({ courseId }, "Starting course deletion");

  // Get all documents for this course
  const { data: docs, error: docsQueryError } = await supabase
    .from("docs")
    .select("id")
    .eq("course_id", courseId);

  if (docsQueryError) {
    logger.error({ error: docsQueryError, courseId }, "Failed to query documents for course deletion");
    throw new Error(`Failed to query documents: ${docsQueryError.message}`);
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
      logger.error({ error: chunksError, courseId, docIds }, "Failed to delete chunks");
      throw new Error(`Failed to delete chunks: ${chunksError.message}`);
    }

    // Delete all documents
    const { error: docsError } = await supabase
      .from("docs")
      .delete()
      .in("id", docIds);

    if (docsError) {
      logger.error({ error: docsError, courseId, docIds }, "Failed to delete documents");
      throw new Error(`Failed to delete documents: ${docsError.message}`);
    }
  }

  // Delete all chats for this course
  const { error: chatsError } = await supabase
    .from("chats")
    .delete()
    .eq("course_id", courseId);

  if (chatsError) {
    logger.error({ error: chatsError, courseId }, "Failed to delete chats");
    throw new Error(`Failed to delete chats: ${chatsError.message}`);
  }

  // Handle lecture chat sessions and messages
  const { data: sessions, error: sessionsQueryError } = await supabase
    .from("lecture_chat_sessions")
    .select("id")
    .eq("course_id", courseId);

  if (sessionsQueryError) {
    logger.error({ error: sessionsQueryError, courseId }, "Failed to query lecture chat sessions");
    throw new Error(`Failed to query lecture chat sessions: ${sessionsQueryError.message}`);
  }

  if (sessions && sessions.length > 0) {
    const sessionIds = sessions.map((session) => session.id);

    // Delete all messages for these sessions
    const { error: messagesError } = await supabase
      .from("lecture_chat_messages")
      .delete()
      .in("session_id", sessionIds);

    if (messagesError) {
      logger.error({ error: messagesError, courseId, sessionIds }, "Failed to delete lecture chat messages");
      throw new Error(`Failed to delete lecture chat messages: ${messagesError.message}`);
    }
  }

  // Delete all sessions for this course
  const { error: sessionsError } = await supabase
    .from("lecture_chat_sessions")
    .delete()
    .eq("course_id", courseId);

  if (sessionsError) {
    logger.error({ error: sessionsError, courseId }, "Failed to delete lecture chat sessions");
    throw new Error(`Failed to delete lecture chat sessions: ${sessionsError.message}`);
  }

  // Clean up user metadata before deleting the course
  await cleanupUserMetadataForDeletedCourse(courseId);

  // Finally delete the course
  const { error: courseError } = await supabase
    .from("courses")
    .delete()
    .eq("id", courseId);

  if (courseError) {
    logger.error({ error: courseError, courseId }, "Failed to delete course");
    throw new Error(`Failed to delete course: ${courseError.message}`);
  }

  logger.info({ courseId }, "Successfully deleted course and all associated data");
}

/**
 * Process syllabus file for a course
 */
async function processSyllabus(params: {
  fileKey: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  courseId: string;
}): Promise<boolean> {
  try {
    logger.info({ courseId: params.courseId }, "Starting syllabus processing");

    const ingestionSuccess = await documentIngestionService.ingestDocument({
      fileKey: params.fileKey,
      fileName: params.fileName,
      fileUrl: params.fileUrl,
      fileType: params.fileType,
      courseId: params.courseId,
    });

    if (!ingestionSuccess) {
      logger.warn({ courseId: params.courseId }, "Syllabus ingestion failed");
      return false;
    }

    logger.info({ courseId: params.courseId }, "Syllabus processing completed successfully");
    return true;
  } catch (error) {
    logger.error({ error, courseId: params.courseId }, "Error during syllabus processing");
    return false;
  }
}

/**
 * Clean up user metadata for a deleted course
 */
async function cleanupUserMetadataForDeletedCourse(courseId: string): Promise<void> {
  try {
    logger.info({ courseId }, "Starting user metadata cleanup for deleted course");
    
    const client = await clerkClient();
    
    // Get all users (this will be paginated in a real system with many users)
    const userList = await client.users.getUserList({
      limit: 500, // Clerk's max per request
    });
    
    let usersUpdated = 0;
    
    for (const user of userList.data) {
      let needsUpdate = false;
      const currentMetadata = user.publicMetadata || {};
      const updatedMetadata = { ...currentMetadata };
      
      // Check and clean joinedCourses array
      const joinedCourses = currentMetadata.joinedCourses as string[] || [];
      if (joinedCourses.includes(courseId)) {
        updatedMetadata.joinedCourses = joinedCourses.filter(id => id !== courseId);
        needsUpdate = true;
        logger.info({ userId: user.id, courseId }, "Removed course from user's joined courses");
      }
      
      // Check and clean selectedCourseId
      const selectedCourseId = currentMetadata.selectedCourseId as string;
      if (selectedCourseId === courseId) {
        updatedMetadata.selectedCourseId = undefined;
        needsUpdate = true;
        logger.info({ userId: user.id, courseId }, "Cleared user's selected course");
      }
      
      // Update user metadata if changes were made
      if (needsUpdate) {
        try {
          await client.users.updateUserMetadata(user.id, {
            publicMetadata: updatedMetadata,
          });
          usersUpdated++;
        } catch (error) {
          logger.error(
            { error, userId: user.id, courseId },
            "Failed to update user metadata during course cleanup"
          );
          // Continue with other users even if one fails
        }
      }
    }
    
    // Handle pagination if there are more users
    if (userList.totalCount > userList.data.length) {
      logger.warn(
        { 
          totalUsers: userList.totalCount, 
          processedUsers: userList.data.length,
          courseId 
        },
        "User metadata cleanup may be incomplete due to pagination limits"
      );
    }
    
    logger.info(
      { courseId, usersUpdated, totalUsers: userList.data.length },
      "Completed user metadata cleanup for deleted course"
    );
    
  } catch (error) {
    logger.error(
      { error, courseId },
      "Error during user metadata cleanup for deleted course"
    );
    // Don't throw - we want course deletion to continue even if user cleanup fails
  }
}