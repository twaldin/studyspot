import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/database.types';
import { supabaseService } from '@/lib/services/database/supabase.service';
import { getUserOnboardingStatus, getSelectedCourseForUser } from '@/lib/clerk';
import { geminiService } from '@/lib/services/ai/gemini.service';
import { API_CONSTANTS, DEFAULT_MESSAGES } from '@/lib/constants';
import logger, { LogContext } from '@/lib/logger';

// Server-side cache for suggested queries
const suggestedQueriesCache = new Map<string, { queries: string[], timestamp: number }>();
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

/**
 * Gets suggested queries for a course with intelligent fallbacks
 */
export async function getSuggestedQueries(
  userId: string,
  courseId?: string
): Promise<{ suggestedQueries: string[], fromCache: boolean }> {
  try {
    // Get user's onboarding status for school context
    const onboardingStatus = await getUserOnboardingStatus(userId);
    
    if (!onboardingStatus.hasCompletedOnboarding || !onboardingStatus.selectedSchool) {
      logger.info(LogContext.api('suggested-queries', userId), 'User not onboarded, returning default queries');
      return {
        suggestedQueries: [...DEFAULT_MESSAGES.SUGGESTED_QUERIES],
        fromCache: false
      };
    }

    // Resolve course ID - use provided courseId or get user's selected course
    let resolvedCourseId: string | null = null;
    if (courseId) {
      resolvedCourseId = courseId;
    } else {
      try {
        resolvedCourseId = await getSelectedCourseForUser(userId);
      } catch (error) {
        logger.warn(LogContext.api('suggested-queries', userId), 'Failed to get selected course');
      }
    }
    
    if (!resolvedCourseId) {
      logger.info(LogContext.api('suggested-queries', userId), 'No course selected, returning default queries');
      return {
        suggestedQueries: [...DEFAULT_MESSAGES.SUGGESTED_QUERIES],
        fromCache: false
      };
    }

    // Check cache first
    const cacheKey = `${resolvedCourseId}-${onboardingStatus.selectedSchool}`;
    const cachedResult = getCachedQueries(cacheKey);
    if (cachedResult) {
      logger.debug(LogContext.api('suggested-queries', userId, { cacheKey }), 'Returning cached queries');
      return {
        suggestedQueries: cachedResult,
        fromCache: true
      };
    }

    // Generate new queries
    const generatedQueries = await generateQueriesForCourse(
      resolvedCourseId, 
      onboardingStatus.selectedSchool,
      userId
    );

    // Cache the result
    setCachedQueries(cacheKey, generatedQueries);

    logger.info(LogContext.api('suggested-queries', userId, { 
      courseId: resolvedCourseId,
      queryCount: generatedQueries.length 
    }), 'Generated new suggested queries');

    return {
      suggestedQueries: generatedQueries,
      fromCache: false
    };

  } catch (error) {
    logger.error(LogContext.api('suggested-queries', userId, { 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }), 'Error generating suggested queries, falling back to defaults');

    return {
      suggestedQueries: [...DEFAULT_MESSAGES.SUGGESTED_QUERIES],
      fromCache: false
    };
  }
}

/**
 * Gets cached queries if they exist and haven't expired
 */
function getCachedQueries(cacheKey: string): string[] | null {
  const cachedEntry = suggestedQueriesCache.get(cacheKey);
  
  if (cachedEntry && (Date.now() - cachedEntry.timestamp) < CACHE_DURATION) {
    return cachedEntry.queries;
  }

  // Clean up expired entry
  if (cachedEntry) {
    suggestedQueriesCache.delete(cacheKey);
  }

  return null;
}

/**
 * Caches queries with current timestamp
 */
function setCachedQueries(cacheKey: string, queries: string[]): void {
  suggestedQueriesCache.set(cacheKey, {
    queries: [...queries], // Convert readonly array to mutable
    timestamp: Date.now()
  });
}

/**
 * Generates course-specific queries using AI
 */
async function generateQueriesForCourse(
  courseId: string, 
  schoolId: string,
  userId: string
): Promise<string[]> {
  try {
    // Fetch course details
    const course = await getCourseDetails(courseId, schoolId);
    if (!course) {
      logger.warn(LogContext.api('suggested-queries', userId, { courseId }), 'Course not found');
      return [...DEFAULT_MESSAGES.SUGGESTED_QUERIES];
    }

    // Get content samples for context
    const contentSamples = await getCourseContentSample(courseId);

    // Generate AI queries
    const aiResult = await geminiService.chat([
      {
        role: 'user',
        content: `Generate 2 specific, practical questions that a college student might ask about the course "${course.code} - ${course.title}". The questions should be:
1. Specific to the actual subject matter and content (not generic)
2. Academically relevant (about exams, assignments, labs, concepts, etc.)
3. Between 5-12 words each
4. Written in a natural, student-like tone

Base your questions on the actual course content below. Look for specific topics, concepts, assignments, labs, or exam materials mentioned:

--- Course Content ---
${contentSamples.join('\n\n')}
--- End Course Content ---

Return only the 2 questions, each on a separate line, without numbering or quotes.`
      }
    ]);

    // Validate AI result
    if (aiResult.success && aiResult.data) {
      const queries = aiResult.data
        .trim()
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .map(line => line.replace(/^[\d\.\-\*]\s*/, '')) // Remove any numbering/bullets
        .map(line => line.replace(/^["']|["']$/g, '')) // Remove quotes
        .slice(0, 2);
      
      if (queries.length === 2) {
        return queries;
      }
    }

    logger.warn(LogContext.api('suggested-queries', userId, { 
      courseId,
      aiSuccess: aiResult.success,
      queryCount: aiResult.data?.length 
    }), 'AI query generation failed or returned invalid results');

    return [...DEFAULT_MESSAGES.SUGGESTED_QUERIES];

  } catch (error) {
    logger.error(LogContext.api('suggested-queries', userId, { 
      courseId,
      error: error instanceof Error ? error.message : 'Unknown error' 
    }), 'Error in AI query generation');

    return [...DEFAULT_MESSAGES.SUGGESTED_QUERIES];
  }
}

/**
 * Fetches course details from database
 */
async function getCourseDetails(courseId: string, schoolId: string): Promise<{ code: string, title: string } | null> {
  try {
    const supabase = await supabaseService.createAuthenticatedClient();
    const { data: course, error } = await supabase
      .from('courses')
      .select('code, title')
      .eq('id', courseId)
      .eq('school_id', schoolId)
      .single();

    if (error) {
      throw error;
    }
    
    if (!course?.code || !course?.title) {
      return null;
    }

    return {
      code: course.code,
      title: course.title
    };
  } catch (error) {
    logger.error({ error, courseId, schoolId }, 'Failed to fetch course details');
    return null;
  }
}

/**
 * Samples course content for AI context
 */
async function getCourseContentSample(courseId: string): Promise<string[]> {
  try {
    const supabase = await supabaseService.createAuthenticatedClient();
    // Get sample of documents from this course
    const { data: docs, error: docsError } = await supabase
      .from('docs')
      .select('id')
      .eq('course_id', courseId)
      .limit(API_CONSTANTS.RAG_COURSE_DOCS_LIMIT);

    if (docsError) {
      throw docsError;
    }

    if (!docs || docs.length === 0) {
      return [];
    }

    const docIds = docs.map((doc: any) => doc.id);

    // Get content chunks from these documents
    const { data: chunks, error: chunksError } = await supabase
      .from('chunks')
      .select('content')
      .in('doc_id', docIds)
      .limit(API_CONSTANTS.RAG_DOCUMENT_LIMIT)
      .order('chunk_count', { ascending: true });

    if (chunksError) {
      throw chunksError;
    }

    if (!chunks || chunks.length === 0) {
      return [];
    }

    // Return the content strings, limiting length to avoid token limits
    return chunks
      .map((chunk: any) => chunk.content.substring(0, API_CONSTANTS.CHUNK_CONTENT_PREVIEW_LENGTH))
      .filter((content: string) => content.trim().length > API_CONSTANTS.CONTENT_CHUNK_MIN_LENGTH);
      
  } catch (error) {
    logger.warn({ error, courseId }, 'Failed to get course content sample');
    return [];
  }
}

/**
 * Clears the cache (useful for testing or manual cache invalidation)
 */
export function clearSuggestedQueriesCache(): void {
  suggestedQueriesCache.clear();
  logger.info({}, 'Suggested queries cache cleared');
}

/**
 * Gets cache statistics for monitoring
 */
export function getSuggestedQueriesCacheStats(): { size: number, entries: { key: string, age: number }[] } {
  const now = Date.now();
  const entries = Array.from(suggestedQueriesCache.entries()).map(([key, value]) => ({
    key,
    age: now - value.timestamp
  }));

  return {
    size: suggestedQueriesCache.size,
    entries
  };
}