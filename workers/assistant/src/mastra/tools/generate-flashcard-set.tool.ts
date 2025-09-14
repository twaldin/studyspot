import { createTool } from '@mastra/core';
import { z } from 'zod';
import { SupabaseService } from '../../services/supabase.service.js';
import { SubscriptionChecker } from '../../services/subscription-checker.service.js';
import { randomUUID } from 'crypto';

// Global store for created flashcard sets (per session)
const flashcardStore = new Map<string, string[]>();

export function getFlashcardSetsFromStore(sessionKey: string): string[] {
  return flashcardStore.get(sessionKey) || [];
}

export function addFlashcardSetToStore(sessionKey: string, setId: string): void {
  const existing = flashcardStore.get(sessionKey) || [];
  existing.push(setId);
  flashcardStore.set(sessionKey, existing);
}

export function clearFlashcardStore(sessionKey: string): void {
  flashcardStore.delete(sessionKey);
}

/**
 * Tool for generating flashcard sets from course content
 * Allows the AI to create flashcards based on course materials and user requests
 */
export const generateFlashcardSetTool = createTool({
  id: 'create_flashcards',
  description: 'ALWAYS use this tool when users ask for flashcards, study cards, or flash cards. Generate a set of interactive flashcards (max 50) for studying course topics. Creates actual flashcard sets that users can study with flip animations and editing capabilities.',
  inputSchema: z.object({
    title: z.string().min(1, 'Title cannot be empty')
      .describe('Title for the flashcard set (e.g., "Chapter 5: Photosynthesis", "Spanish Vocabulary - Unit 3")'),
    description: z.string().min(1, 'Description cannot be empty')
      .describe('Brief description of what the flashcards cover'),
    courseId: z.string().uuid('Course ID must be a valid UUID').optional()
      .describe('Course ID (optional, will use runtime context if not provided)'),
    userId: z.string().uuid('User ID must be a valid UUID').optional()
      .describe('User ID (optional, will use runtime context if not provided)'),
    topic: z.string().min(1, 'Topic cannot be empty')
      .describe('Specific topic or subject matter for the flashcards'),
    cardCount: z.number().int().positive().max(50).optional().default(20)
      .describe('Number of flashcards to generate (max 50, default: 20)'),
    flashcards: z.array(z.object({
      side1: z.string().min(1, 'Side 1 text cannot be empty')
        .describe('Front side of the flashcard (question, term, concept)'),
      side2: z.string().min(1, 'Side 2 text cannot be empty')
        .describe('Back side of the flashcard (answer, definition, explanation)')
    })).min(1).max(50)
      .describe('Array of flashcard objects with side1 and side2')
  }),
  outputSchema: z.object({
    setId: z.string().describe('UUID of the created flashcard set'),
    title: z.string().describe('Title of the flashcard set'),
    description: z.string().describe('Description of the flashcard set'),
    cardCount: z.number().describe('Number of flashcards created'),
    success: z.boolean().describe('Whether the flashcard set was created successfully'),
    error: z.string().optional().describe('Error message if creation failed'),
    // Resource display information for the frontend
    resourceInfo: z.object({
      type: z.literal('flashcard_set'),
      id: z.string(),
      title: z.string(),
      description: z.string(),
      metadata: z.object({
        cardCount: z.number()
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
      cardCount,
      flashcards 
    } = context;
    
    // Use provided IDs or fall back to runtime context
    const courseId = providedCourseId || runtimeContext?.get?.('courseId');
    const userId = providedUserId || runtimeContext?.get?.('userId');
    
    if (!courseId) {
      console.warn(`[GenerateFlashcardSetTool] No course ID provided`);
      return {
        setId: '',
        title,
        description,
        cardCount: 0,
        success: false,
        error: 'Course ID is required to generate flashcards'
      };
    }

    if (!userId) {
      console.warn(`[GenerateFlashcardSetTool] No user ID provided`);
      return {
        setId: '',
        title,
        description,
        cardCount: 0,
        success: false,
        error: 'User ID is required to generate flashcards'
      };
    }

    // Check subscription limits before generating
    const subscriptionCheck = await SubscriptionChecker.canGenerateContent(userId);
    if (!subscriptionCheck.canGenerate) {
      console.warn(`[GenerateFlashcardSetTool] User ${userId} has reached their generation limit`);
      return {
        setId: '',
        title,
        description,
        cardCount: 0,
        success: false,
        error: subscriptionCheck.reason || 'You have reached your daily generation limit. Please upgrade to Pro for unlimited flashcard generation.'
      };
    }
    
    console.log(`[GenerateFlashcardSetTool] Creating flashcard set "${title}" for course ${courseId}, user ${userId}, ${flashcards.length} cards`);

    try {
      // Validate course access
      const hasAccess = await SupabaseService.validateCourseAccess(courseId);
      if (!hasAccess) {
        console.warn(`[GenerateFlashcardSetTool] No access to course: ${courseId}`);
        return {
          setId: '',
          title,
          description,
          cardCount: 0,
          success: false,
          error: 'Course not found or access denied'
        };
      }

      // Generate UUIDs for the set and cards
      const setId = randomUUID();
      const now = new Date().toISOString();

      // Create the flashcard set
      const flashcardSetData = {
        id: setId,
        title,
        description,
        course_id: courseId,
        user_id: userId,
        created_at: now,
        updated_at: now
      };

      const setResult = await SupabaseService.createFlashcardSet(flashcardSetData);
      if (!setResult.success) {
        console.error(`[GenerateFlashcardSetTool] Failed to create flashcard set`);
        return {
          setId: '',
          title,
          description,
          cardCount: 0,
          success: false,
          error: 'Failed to create flashcard set'
        };
      }

      // Create the individual flashcards
      const flashcardData = flashcards.map((card, index) => ({
        card_id: randomUUID(),
        set_id: setId,
        side1: card.side1,
        side2: card.side2,
        card_number: index + 1
      }));

      const cardsResult = await SupabaseService.createFlashcards(flashcardData);
      if (!cardsResult.success) {
        console.error(`[GenerateFlashcardSetTool] Failed to create flashcards`);
        // Clean up the set if cards failed
        await SupabaseService.deleteFlashcardSet(setId);
        return {
          setId: '',
          title,
          description,
          cardCount: 0,
          success: false,
          error: 'Failed to create flashcards'
        };
      }

      console.log(`[GenerateFlashcardSetTool] Successfully created flashcard set ${setId} with ${flashcards.length} cards`);

      // Store the created flashcard set ID in the global store (using courseId as the key)
      addFlashcardSetToStore(courseId, setId);

      // Increment usage counter for free users
      await SubscriptionChecker.incrementContentGeneration(userId);

      return {
        setId,
        title,
        description,
        cardCount: flashcards.length,
        success: true,
        resourceInfo: {
          type: 'flashcard_set' as const,
          id: setId,
          title,
          description,
          metadata: {
            cardCount: flashcards.length
          }
        }
      };

    } catch (error) {
      console.error(`[GenerateFlashcardSetTool] Error creating flashcard set:`, error);
      
      return {
        setId: '',
        title,
        description,
        cardCount: 0,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
});