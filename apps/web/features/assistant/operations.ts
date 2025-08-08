import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/database.types';
import { supabaseService } from '@/lib/services/database/supabase.service';
import { getUserOnboardingStatus, getSelectedCourseForUser } from '@/lib/clerk';
import { geminiService } from '@/lib/services/ai/gemini.service';
import { API_CONSTANTS, DEFAULT_MESSAGES } from '@/lib/constants';
import logger, { LogContext } from '@/lib/logger';

/**
 * Gets suggested queries for a course from the assistant worker
 */
export async function getSuggestedQueries(
  userId: string,
  courseId?: string,
  env?: any
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

    // Try direct KV access first (Cloudflare Workers)
    console.log('[getSuggestedQueries] Checking for KV access:', {
      hasEnv: !!env,
      hasKV: !!env?.SUGGESTED_QUERIES,
      courseId: resolvedCourseId,
      schoolId: onboardingStatus.selectedSchool
    });
    
    if (env?.SUGGESTED_QUERIES) {
      try {
        const key = `queries:${resolvedCourseId}:${onboardingStatus.selectedSchool}`;
        const metaKey = `queries-meta:${resolvedCourseId}:${onboardingStatus.selectedSchool}`;
        
        console.log('[getSuggestedQueries] Reading from KV with key:', key);
        
        // Get queries and metadata from KV
        const [cached, metadata] = await Promise.all([
          env.SUGGESTED_QUERIES.get(key, "json"),
          env.SUGGESTED_QUERIES.get(metaKey, "json")
        ]);
        
        console.log('[getSuggestedQueries] KV response:', {
          hasCached: !!cached,
          hasMetadata: !!metadata,
          cached,
          metadata
        });
        
        if (cached && Array.isArray(cached) && cached.length > 0) {
          // Check if cache is stale
          const isStale = metadata ? (Date.now() - (metadata as any).generatedAt > 86400000) : false; // 24 hours
          
          if (!isStale) {
            logger.info(LogContext.api('suggested-queries', userId, { 
              courseId: resolvedCourseId,
              fromCache: true,
              via: 'direct-kv',
              queriesReceived: cached
            }), 'Retrieved suggested queries directly from KV');

            const result = {
              suggestedQueries: cached,
              fromCache: true
            };
            
            console.log('[getSuggestedQueries] Returning fresh KV queries to caller:', result);
            
            return result;
          } else {
            console.log('[getSuggestedQueries] KV cache is stale, will trigger refresh via service binding');
            // Don't return stale data, let it fall through to service binding for refresh
          }
        } else {
          console.log('[getSuggestedQueries] No valid queries in KV, will generate via service binding');
        }
      } catch (error) {
        logger.warn(LogContext.api('suggested-queries', userId, { 
          error: error instanceof Error ? error.message : 'Unknown error' 
        }), 'KV access failed, falling back to service binding');
      }
    } else {
      console.log('[getSuggestedQueries] No KV namespace available, trying service binding');
    }
    
    // Try service binding as second option (Cloudflare Workers)
    if (env?.ASSISTANT_SERVICE) {
      try {
        const url = new URL('https://internal/suggested-queries');
        url.searchParams.set('courseId', resolvedCourseId);
        url.searchParams.set('schoolId', onboardingStatus.selectedSchool);
        
        const response = await env.ASSISTANT_SERVICE.fetch(url.toString(), {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Assistant service returned ${response.status}`);
        }

        const data = await response.json();
        
        // DEBUG: Log exactly what we received
        console.log('[getSuggestedQueries] Raw response from assistant worker:', {
          data,
          hasQueries: !!data.suggestedQueries,
          queriesLength: data.suggestedQueries?.length,
          actualQueries: data.suggestedQueries,
          dataType: typeof data,
          dataKeys: Object.keys(data)
        });
        
        logger.info(LogContext.api('suggested-queries', userId, { 
          courseId: resolvedCourseId,
          fromCache: data.fromCache,
          isStale: data.isStale,
          via: 'service-binding',
          queriesReceived: data.suggestedQueries
        }), 'Retrieved suggested queries from assistant worker via service binding');

        const result = {
          suggestedQueries: data.suggestedQueries || [...DEFAULT_MESSAGES.SUGGESTED_QUERIES],
          fromCache: data.fromCache || false
        };
        
        console.log('[getSuggestedQueries] Returning to caller:', result);
        
        return result;
      } catch (error) {
        logger.warn(LogContext.api('suggested-queries', userId, { 
          error: error instanceof Error ? error.message : 'Unknown error' 
        }), 'Service binding failed, falling back to HTTP');
      }
    } else {
      console.log('[getSuggestedQueries] No service binding available, falling back to HTTP');
    }

    // Fallback to HTTP (for local development)
    const assistantWorkerUrl = process.env.NEXT_PUBLIC_ASSISTANT_API_URL;
    if (!assistantWorkerUrl) {
      logger.error(LogContext.api('suggested-queries', userId), 'Assistant API URL not configured');
      return {
        suggestedQueries: [...DEFAULT_MESSAGES.SUGGESTED_QUERIES],
        fromCache: false
      };
    }

    const response = await fetch(
      `${assistantWorkerUrl}/suggested-queries?` +
      `courseId=${encodeURIComponent(resolvedCourseId)}&` +
      `schoolId=${encodeURIComponent(onboardingStatus.selectedSchool)}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Assistant worker returned ${response.status}`);
    }

    const data = await response.json();
    
    // DEBUG: Log exactly what we received via HTTP
    console.log('[getSuggestedQueries] Raw response from assistant worker (HTTP):', {
      data,
      hasQueries: !!data.suggestedQueries,
      queriesLength: data.suggestedQueries?.length,
      actualQueries: data.suggestedQueries,
      dataType: typeof data,
      dataKeys: Object.keys(data)
    });
    
    logger.info(LogContext.api('suggested-queries', userId, { 
      courseId: resolvedCourseId,
      fromCache: data.fromCache,
      isStale: data.isStale,
      queriesReceived: data.suggestedQueries
    }), 'Retrieved suggested queries from assistant worker');

    const result = {
      suggestedQueries: data.suggestedQueries || [...DEFAULT_MESSAGES.SUGGESTED_QUERIES],
      fromCache: data.fromCache || false
    };
    
    console.log('[getSuggestedQueries] Returning to caller (HTTP):', result);
    
    return result;

  } catch (error) {
    logger.error(LogContext.api('suggested-queries', userId, { 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }), 'Error getting suggested queries from assistant worker, falling back to defaults');

    return {
      suggestedQueries: [...DEFAULT_MESSAGES.SUGGESTED_QUERIES],
      fromCache: false
    };
  }
}

// Legacy functions - no longer needed as caching is handled by assistant worker
export function clearSuggestedQueriesCache(): void {
  logger.info({}, 'Suggested queries cache now handled by assistant worker');
}

export function getSuggestedQueriesCacheStats(): { size: number, entries: { key: string, age: number }[] } {
  return {
    size: 0,
    entries: []
  };
}