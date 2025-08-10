import { createTool } from '@mastra/core';
import { z } from 'zod';
import { SupabaseService } from '../../services/supabase.service.js';
import { randomUUID } from 'crypto';

// Global store for created quizzes (per session)
const quizStore = new Map<string, string[]>();

export function getQuizzesFromStore(sessionKey: string): string[] {
  const quizzes = quizStore.get(sessionKey) || [];
  console.log(`[QuizStore] Retrieved ${quizzes.length} quizzes from store with key: ${sessionKey}. Quiz IDs: ${quizzes.join(', ')}`);
  return quizzes;
}

export function addQuizToStore(sessionKey: string, quizId: string): void {
  const existing = quizStore.get(sessionKey) || [];
  existing.push(quizId);
  quizStore.set(sessionKey, existing);
  console.log(`[QuizStore] Added quiz ${quizId} to store with key: ${sessionKey}. Total quizzes: ${existing.length}`);
}

export function clearQuizStore(sessionKey: string): void {
  const existing = quizStore.get(sessionKey) || [];
  quizStore.delete(sessionKey);
  console.log(`[QuizStore] Cleared quiz store for key: ${sessionKey}. Removed ${existing.length} quizzes: ${existing.join(', ')}`);
}

/**
 * Tool for generating quiz sets from course content
 * Allows the AI to create multiple-choice quizzes based on course materials and user requests
 */
export const generateQuizTool = createTool({
  id: 'create_quiz',
  description: 'ALWAYS use this tool when users ask for a quiz, test, practice exam, problems, or multiple choice questions. Generate interactive multiple-choice quizzes (max 50 questions) for testing knowledge of course topics. Creates actual quiz sets that users can take with immediate feedback and explanations. Do thorough research using available tools before creating questions to ensure they match the complexity and style of the course material.',
  inputSchema: z.object({
    title: z.string().min(1, 'Title cannot be empty')
      .describe('Title for the quiz (e.g., "Chapter 5: Photosynthesis Quiz", "Spanish Grammar Test - Unit 3")'),
    description: z.string().min(1, 'Description cannot be empty')
      .describe('Brief description of what the quiz covers and its purpose'),
    courseId: z.string().uuid('Course ID must be a valid UUID').optional()
      .describe('Course ID (optional, will use runtime context if not provided)'),
    userId: z.string().uuid('User ID must be a valid UUID').optional()
      .describe('User ID (optional, will use runtime context if not provided)'),
    topic: z.string().min(1, 'Topic cannot be empty')
      .describe('Specific topic or subject matter for the quiz questions'),
    questionCount: z.number().int().positive().max(50).optional().default(10)
      .describe('Number of questions to generate (max 50, default: 10)'),
    questions: z.array(z.object({
      questionText: z.string().min(1, 'Question text cannot be empty')
        .describe('The question text (clear, specific, and well-formatted)'),
      optionA: z.string().min(1, 'Option A cannot be empty')
        .describe('First multiple choice option'),
      optionB: z.string().min(1, 'Option B cannot be empty')
        .describe('Second multiple choice option'),
      optionC: z.string().min(1, 'Option C cannot be empty')
        .describe('Third multiple choice option'),
      optionD: z.string().min(1, 'Option D cannot be empty')
        .describe('Fourth multiple choice option'),
      correctAnswer: z.enum(['A', 'B', 'C', 'D'])
        .describe('The letter of the correct answer (A, B, C, or D)'),
      explanation: z.string().optional()
        .describe('Optional explanation of why the correct answer is right (recommended for learning)')
    })).min(1).max(50)
      .describe('Array of quiz questions with 4 multiple choice options each')
  }),
  outputSchema: z.object({
    quizId: z.string().describe('UUID of the created quiz'),
    title: z.string().describe('Title of the quiz'),
    description: z.string().describe('Description of the quiz'),
    questionCount: z.number().describe('Number of questions created'),
    success: z.boolean().describe('Whether the quiz was created successfully'),
    error: z.string().optional().describe('Error message if creation failed'),
    // Resource display information for the frontend
    resourceInfo: z.object({
      type: z.literal('quiz'),
      id: z.string(),
      title: z.string(),
      description: z.string(),
      metadata: z.object({
        questionCount: z.number()
      })
    }).optional().describe('Resource information for frontend display')
  }),
  execute: async ({ context, runtimeContext }) => {
    const { 
      title, 
      description, 
      courseId: providedCourseId, 
      userId: providedUserId,
      topic,
      questionCount,
      questions 
    } = context;
    
    // Use provided IDs or fall back to runtime context
    const courseId = providedCourseId || runtimeContext?.get?.('courseId');
    const userId = providedUserId || runtimeContext?.get?.('userId');
    
    if (!courseId) {
      console.warn(`[GenerateQuizTool] No course ID provided`);
      return {
        quizId: '',
        title,
        description,
        questionCount: 0,
        success: false,
        error: 'Course ID is required to generate quiz'
      };
    }

    if (!userId) {
      console.warn(`[GenerateQuizTool] No user ID provided`);
      return {
        quizId: '',
        title,
        description,
        questionCount: 0,
        success: false,
        error: 'User ID is required to generate quiz'
      };
    }
    
    console.log(`[GenerateQuizTool] Creating quiz "${title}" for course ${courseId}, user ${userId}, ${questions.length} questions`);

    try {
      // Validate course access
      const hasAccess = await SupabaseService.validateCourseAccess(courseId);
      if (!hasAccess) {
        console.warn(`[GenerateQuizTool] No access to course: ${courseId}`);
        return {
          quizId: '',
          title,
          description,
          questionCount: 0,
            success: false,
          error: 'Course not found or access denied'
        };
      }

      // Generate UUIDs for the quiz and questions
      const quizId = randomUUID();
      const now = new Date().toISOString();

      // Create the quiz
      const quizData = {
        id: quizId,
        title,
        description,
        course_id: courseId,
        created_by: userId,
        is_public: false, // Default to private
        total_questions: questions.length,
        created_at: now,
        updated_at: now
      };

      const quizResult = await SupabaseService.createQuiz(quizData);
      if (!quizResult.success) {
        console.error(`[GenerateQuizTool] Failed to create quiz`);
        return {
          quizId: '',
          title,
          description,
          questionCount: 0,
            success: false,
          error: 'Failed to create quiz'
        };
      }

      // Create the individual questions
      const questionsData = questions.map((question, index) => ({
        id: randomUUID(),
        quiz_id: quizId,
        question_text: question.questionText,
        option_a: question.optionA,
        option_b: question.optionB,
        option_c: question.optionC,
        option_d: question.optionD,
        correct_answer: question.correctAnswer,
        explanation: question.explanation,
        order_index: index,
        created_at: now,
        updated_at: now
      }));

      const questionsResult = await SupabaseService.createQuizQuestions(questionsData);
      if (!questionsResult.success) {
        console.error(`[GenerateQuizTool] Failed to create quiz questions`);
        // Clean up the quiz if questions failed
        await SupabaseService.deleteQuiz(quizId);
        return {
          quizId: '',
          title,
          description,
          questionCount: 0,
            success: false,
          error: 'Failed to create quiz questions'
        };
      }

      console.log(`[GenerateQuizTool] Successfully created quiz ${quizId} with ${questions.length} questions`);

      // Store the created quiz ID in the global store (using courseId as the key)
      addQuizToStore(courseId, quizId);

      return {
        quizId,
        title,
        description,
        questionCount: questions.length,
        success: true,
        resourceInfo: {
          type: 'quiz' as const,
          id: quizId,
          title,
          description,
          metadata: {
            questionCount: questions.length
          }
        }
      };

    } catch (error) {
      console.error(`[GenerateQuizTool] Error creating quiz:`, error);
      
      return {
        quizId: '',
        title,
        description,
        questionCount: 0,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
});