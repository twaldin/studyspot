import { geminiService } from "@/lib/services/ai/gemini.service";
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/lib/database.types';
import logger, { LogContext } from '@/lib/logger';

/**
 * Check if a document is relevant to a specific course
 * Uses Gemini AI to analyze document content
 * Maintains exact same functionality as original assistant API
 */
export async function checkDocumentRelevance(
  courseCode: string,
  courseTitle: string,
  fileName: string,
  documentText: string
): Promise<boolean> {
  try {
    logger.info({
      courseCode,
      courseTitle,
      fileName,
      textLength: documentText.length
    }, 'Starting document relevance check');

    const prompt = `
You are an AI assistant that determines whether a document is relevant to a college course. 

Course: ${courseCode} - ${courseTitle}
Document: ${fileName}

Analyze the following document content and determine if it's relevant to the course:

${documentText}

Return ONLY "true" if the document is relevant to the course, or "false" if it's not relevant.

Consider these criteria:
- Does the content relate to the course subject matter?
- Is it educational material that would help students in this course?
- Could it contain information useful for studying this subject?

Be generous in your assessment - when in doubt, return "true". Only return "false" for clearly unrelated content like:
- Lorem ipsum placeholder text
- Random or nonsensical content
- Documents about completely different subjects
- Test files or empty documents

Response (true/false):`;

    const response = await geminiService.chat([
      { role: 'user', content: prompt }
    ]);

    if (!response.success || !response.data) {
      logger.warn({
        courseCode,
        fileName,
        error: 'No response from Gemini'
      }, 'Failed to get relevance check response, defaulting to relevant');
      return true; // Default to relevant when AI check fails
    }

    const isRelevant = response.data.toLowerCase().trim() === 'true';
    
    logger.info({
      courseCode,
      fileName,
      isRelevant,
      aiResponse: response.data.trim()
    }, 'Document relevance check completed');

    return isRelevant;

  } catch (error) {
    logger.error({
      error: error instanceof Error ? error.message : 'Unknown error',
      courseCode,
      fileName
    }, 'Error in document relevance check, defaulting to relevant');
    
    // Default to relevant when there's an error to avoid blocking legitimate documents
    return true;
  }
}

/**
 * Check if a document is provided by the course (official material) vs student-created
 * Uses Gemini AI to analyze document content and structure
 * Maintains exact same functionality as original assistant API
 */
export async function checkCourseProvided(
  courseCode: string,
  courseTitle: string,
  fileName: string,
  documentText: string
): Promise<boolean> {
  try {
    logger.info({
      courseCode,
      courseTitle,
      fileName,
      textLength: documentText.length
    }, 'Starting course provided check');

    const prompt = `
You are an AI assistant that determines whether a document is official course material (provided by the course/instructor) or student-created content.

Course: ${courseCode} - ${courseTitle}
Document: ${fileName}

Analyze the following document content:

${documentText}

Official course materials typically include:
- Syllabi and course schedules
- Assignment instructions and rubrics
- Exam questions and answer keys
- Lab instructions and procedures
- Lecture slides and presentation materials
- Course readings and textbook chapters
- Official handouts and worksheets

Student-created content typically includes:
- Lecture notes taken by students
- Lab reports written by students
- Student project submissions
- Personal study guides
- Student homework submissions
- Personal reflections and journals

Key indicators of official course material:
- Formal academic language and structure
- Official university/department formatting
- References to course policies and procedures
- Instructor contact information or office hours
- Grading rubrics or evaluation criteria
- Assignment due dates and requirements

Return ONLY "true" if this appears to be official course material, or "false" if it appears to be student-created content.

Response (true/false):`;

    const response = await geminiService.chat([
      { role: 'user', content: prompt }
    ]);

    if (!response.success || !response.data) {
      logger.warn({
        courseCode,
        fileName,
        error: 'No response from Gemini'
      }, 'Failed to get course provided check response, defaulting to not provided');
      return false; // Default to student-created when AI check fails
    }

    const isProvided = response.data.toLowerCase().trim() === 'true';
    
    logger.info({
      courseCode,
      fileName,
      isProvided,
      aiResponse: response.data.trim()
    }, 'Course provided check completed');

    return isProvided;

  } catch (error) {
    logger.error({
      error: error instanceof Error ? error.message : 'Unknown error',
      courseCode,
      fileName
    }, 'Error in course provided check, defaulting to not provided');
    
    // Default to student-created when there's an error
    return false;
  }
}