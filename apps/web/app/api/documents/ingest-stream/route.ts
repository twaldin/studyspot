import { NextRequest } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';

export async function POST(request: NextRequest) {
  console.log('[Document Ingestion API] Starting request');
  
  try {
    // Authenticate user
    const { userId } = await auth();
    if (!userId) {
      return new Response('Unauthorized', { status: 401 });
    }

    // Get request body
    const body = await request.json();
    console.log('[Document Ingestion API] Request body:', {
      fileCount: body.files?.length,
      courseId: body.courseId,
      userId: body.userId
    });

    // Get Cloudflare context for service binding
    let assistantService: any;
    try {
      const context = getCloudflareContext();
      assistantService = context?.env?.ASSISTANT_SERVICE;
      console.log('[Document Ingestion API] Service binding available:', !!assistantService);
    } catch (error) {
      console.log('[Document Ingestion API] Could not get Cloudflare context (likely local dev):', error);
    }

    // If we have service binding, use it (production)
    if (assistantService) {
      console.log('[Document Ingestion API] Using service binding to assistant worker');
      
      const response = await assistantService.fetch(
        'https://internal/documents/ingest-stream',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...body,
            userId: userId // Use authenticated userId
          }),
        }
      );

      console.log('[Document Ingestion API] Service binding response status:', response.status);

      if (!response.ok) {
        const error = await response.text();
        console.error('[Document Ingestion API] Service binding error:', error);
        return new Response(error, { status: response.status });
      }

      // Return the streaming response from the assistant worker
      return new Response(response.body, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      });
    } 
    // Fallback to HTTP request (local development)
    else {
      const assistantUrl = process.env.NEXT_PUBLIC_ASSISTANT_API_URL || process.env.NEXT_PUBLIC_ASSISTANT_WORKER_URL;
      
      if (!assistantUrl) {
        console.error('[Document Ingestion API] No assistant URL configured');
        return new Response('Assistant service not configured', { status: 503 });
      }

      console.log('[Document Ingestion API] Using HTTP fallback to:', assistantUrl);

      const response = await fetch(
        `${assistantUrl}/documents/ingest-stream`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...body,
            userId: userId // Use authenticated userId
          }),
        }
      );

      console.log('[Document Ingestion API] HTTP response status:', response.status);

      if (!response.ok) {
        const error = await response.text();
        console.error('[Document Ingestion API] HTTP error:', error);
        return new Response(error, { status: response.status });
      }

      // Return the streaming response
      return new Response(response.body, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      });
    }
  } catch (error) {
    console.error('[Document Ingestion API] Error:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Internal server error' 
      }), 
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}