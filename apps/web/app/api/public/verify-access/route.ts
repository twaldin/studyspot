import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/services/database/supabase.service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { resource_type, resource_id, share_token } = body;

    // Validate input
    if (!resource_type || !resource_id || !share_token) {
      return NextResponse.json({ 
        error: 'resource_type, resource_id, and share_token are required' 
      }, { status: 400 });
    }

    if (!['chat', 'flashcard', 'quiz'].includes(resource_type)) {
      return NextResponse.json({ 
        error: 'resource_type must be chat, flashcard, or quiz' 
      }, { status: 400 });
    }

    let tableName: string;
    switch (resource_type) {
      case 'chat':
        tableName = 'chats';
        break;
      case 'flashcard':
        tableName = 'flashcard_sets';
        break;
      case 'quiz':
        tableName = 'quizzes';
        break;
      default:
        return NextResponse.json({ error: 'Invalid resource type' }, { status: 400 });
    }

    // Check if the resource is publicly accessible with the provided share token
    const supabase = createServiceRoleClient();
    const { data: resource, error } = await supabase
      .from(tableName)
      .select('id, is_public, visibility_mode, share_token')
      .eq('id', resource_id)
      .eq('share_token', share_token)
      .eq('is_public', true)
      .single();

    if (error) {
      console.error('Error verifying public access:', error);
      return NextResponse.json({ 
        has_access: false,
        error: 'Resource not found or not publicly accessible'
      }, { status: 404 });
    }

    if (!resource) {
      return NextResponse.json({ 
        has_access: false,
        error: 'Resource not found or not publicly accessible'
      }, { status: 404 });
    }

    // Resource is publicly accessible
    return NextResponse.json({
      has_access: true,
      visibility_mode: resource.visibility_mode,
      resource_type,
      resource_id
    });

  } catch (error) {
    console.error('Error in public access verification:', error);
    return NextResponse.json({ 
      has_access: false,
      error: 'Internal server error' 
    }, { status: 500 });
  }
}