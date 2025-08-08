import { NextResponse } from 'next/server';
import { validateAuth, validateAuthWithSchool } from "@/features/auth/operations";
import { getSuggestedQueries } from '@/features/assistant/services';
import { getCloudflareContext } from '@opennextjs/cloudflare';

// Add service binding type
interface Env {
  ASSISTANT_SERVICE?: Fetcher;
  SUGGESTED_QUERIES?: KVNamespace;
}

export async function GET(request: Request) {
  // Get Cloudflare bindings
  let env: Env | undefined;
  try {
    const context = getCloudflareContext();
    env = context?.env as Env;
  } catch (error) {
    console.log('[API Route /api/suggested-queries] Could not get Cloudflare context (likely local dev):', error);
  }
  
  console.log('[API Route /api/suggested-queries] Starting request:', {
    url: request.url,
    hasEnv: !!env,
    hasAssistantService: !!(env?.ASSISTANT_SERVICE),
    hasKV: !!(env?.SUGGESTED_QUERIES)
  });
  
  try {
    const auth = await validateAuth();
    // Parse courseId and refresh from URL search params
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('courseId') || undefined;
    const refresh = searchParams.get('refresh') === 'true';
    
    console.log('[API Route /api/suggested-queries] Request params:', {
      courseId,
      refresh,
      userId: auth.userId
    });

    if (refresh && courseId) {
      const authWithSchool = await validateAuthWithSchool();
      if (!authWithSchool.selectedSchool) {
        return NextResponse.json({ message: 'No school selected' }, { status: 400 });
      }

      // Check if we have service binding available (Cloudflare deployment)
      if (env?.ASSISTANT_SERVICE) {
        try {
          // Use service binding for direct Worker-to-Worker communication
          const url = new URL('https://internal/suggested-queries');
          url.searchParams.set('courseId', courseId);
          url.searchParams.set('schoolId', authWithSchool.selectedSchool);
          url.searchParams.set('refresh', 'true');

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
          
          return NextResponse.json({
            suggestedQueries: data.suggestedQueries,
            fromCache: false
          });
        } catch (error) {
          console.error('Service binding error:', error);
          // Fall through to client redirect approach
        }
      }

      // Fallback: Return a special response telling the client to call the assistant directly
      // This handles local development and cases where service binding isn't available
      return NextResponse.json({
        redirect: true,
        assistantUrl: process.env.NEXT_PUBLIC_ASSISTANT_API_URL || process.env.NEXT_PUBLIC_ASSISTANT_WORKER_URL,
        params: {
          courseId,
          schoolId: authWithSchool.selectedSchool,
          refresh: true
        }
      });
    }

    // For non-refresh requests, use cached data from KV or service binding
    const result = await getSuggestedQueries(auth.userId, courseId, env);
    
    console.log('[API Route] getSuggestedQueries returned:', {
      result,
      suggestedQueries: result.suggestedQueries,
      fromCache: result.fromCache
    });

    const response = {
      suggestedQueries: result.suggestedQueries,
      fromCache: result.fromCache
    };
    
    console.log('[API Route] Sending response:', response);

    return NextResponse.json(response);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ message }, { status: 500 });
  }
}
