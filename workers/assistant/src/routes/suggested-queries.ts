import { SuggestedQueriesService } from '../services/suggested-queries.service.js';

import { registerApiRoute } from '@mastra/core/server';

// CORS preflight handler
export const suggestedQueriesOptionsRoute = registerApiRoute('/suggested-queries', {
  method: 'OPTIONS' as any,
  handler: async (c) => {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '86400',
      },
    });
  },
});

export const suggestedQueriesRoute = registerApiRoute('/suggested-queries', {
  method: 'GET',
  handler: async (c) => {
    const request = c.req as Request;
    // Try multiple ways to get env
    let env = c.env;
    if (!env || !env.SUGGESTED_QUERIES) {
      env = (globalThis as any).__workerEnv;
    }
    if (!env || !env.SUGGESTED_QUERIES) {
      // Last resort - try process.env for secrets
      env = {
        ...process.env,
        SUGGESTED_QUERIES: c.env?.SUGGESTED_QUERIES || (globalThis as any).__workerEnv?.SUGGESTED_QUERIES
      };
    }
    
    // Debug logging
    console.log('[Suggested Queries] Environment check:', {
      hasEnv: !!env,
      envKeys: env ? Object.keys(env) : [],
      hasKV: !!env?.SUGGESTED_QUERIES,
      hasSupabaseUrl: !!env?.SUPABASE_URL,
      hasSupabaseKey: !!env?.SUPABASE_SERVICE_ROLE_KEY,
      hasAnthropicKey: !!env?.ANTHROPIC_API_KEY,
    });
    
    try {
      // Parse query parameters
      const url = new URL(request.url);
      const courseId = url.searchParams.get('courseId');
      const schoolId = url.searchParams.get('schoolId');
      const refresh = url.searchParams.get('refresh') === 'true';
      
      // Validate required parameters
      if (!courseId || !schoolId) {
        return c.json({ 
          error: 'Missing required parameters: courseId and schoolId' 
        }, 400);
      }
      
      // Get KV namespace - try multiple sources
      const kv = env?.SUGGESTED_QUERIES || c.env?.SUGGESTED_QUERIES || (globalThis as any).__workerEnv?.SUGGESTED_QUERIES;
      if (!kv) {
        console.error('[Suggested Queries] SUGGESTED_QUERIES KV namespace not configured in any source');
        console.error('[Suggested Queries] Available env keys:', {
          cEnvKeys: c.env ? Object.keys(c.env) : [],
          envKeys: env ? Object.keys(env) : [],
          globalEnvKeys: (globalThis as any).__workerEnv ? Object.keys((globalThis as any).__workerEnv) : []
        });
        return c.json({ 
          error: 'Service temporarily unavailable' 
        }, 503);
      }
      
      console.log('[Suggested Queries] KV namespace found, creating service');
      
      // Get suggested queries with properly configured env
      const service = new SuggestedQueriesService(kv, env);
      const result = await service.getQueries(courseId, schoolId, refresh);
      
      // Log the result for debugging
      console.log('[Suggested Queries] Result:', {
        queries: result.queries,
        fromCache: result.fromCache,
        isStale: result.isStale,
        queryCount: result.queries.length
      });
      
      // Return response
      const response = {
        suggestedQueries: result.queries,
        fromCache: result.fromCache,
        isStale: result.isStale,
        canRefresh: !refresh && result.fromCache // Show refresh button if cached
      };
      
      console.log('[Suggested Queries] Sending response:', JSON.stringify(response));
      
      return c.json(response, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': result.fromCache ? 'public, max-age=300' : 'no-cache'
        }
      });
    } catch (error) {
      console.error('Error in suggested queries route:', error);
      
      return c.json({ 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      }, 500);
    }
  }
});