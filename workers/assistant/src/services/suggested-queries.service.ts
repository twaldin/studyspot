import { createAnthropic } from '@ai-sdk/anthropic';
import { generateText } from 'ai';
import { getSupabaseClient } from './supabase.service.js';
import { ConfigLoaderService } from './config-loader.service.js';

interface QueryMetadata {
  generatedAt: number;
  contentHash: string;
  documentCount: number;
}

interface QueryResult {
  queries: string[];
  fromCache: boolean;
  isStale: boolean;
}

export class SuggestedQueriesService {
  private readonly CACHE_TTL = 86400; // 24 hours in seconds
  private readonly STALE_WHILE_REVALIDATE = 3600; // 1 hour grace period
  private env: any;
  
  constructor(private kv: KVNamespace, env?: any) {
    this.env = env || (globalThis as any).__workerEnv || process.env;
    
    console.log('[SuggestedQueriesService] Initialized with env:', {
      hasEnv: !!this.env,
      hasSupabaseUrl: !!this.env?.SUPABASE_URL,
      hasSupabaseKey: !!this.env?.SUPABASE_SERVICE_ROLE_KEY,
      hasAnthropicKey: !!this.env?.ANTHROPIC_API_KEY
    });
  }
  
  async getQueries(courseId: string, schoolId: string, forceRefresh = false): Promise<QueryResult> {
    const key = `queries:${courseId}:${schoolId}`;
    const metaKey = `queries-meta:${courseId}:${schoolId}`;
    
    console.log('[SuggestedQueriesService] Getting queries:', {
      courseId,
      schoolId,
      forceRefresh,
      key,
      metaKey
    });
    
    if (!forceRefresh) {
      // Check cache with metadata
      const [cached, metadata] = await Promise.all([
        this.kv.get(key, "json"),
        this.kv.get(metaKey, "json")
      ]);
      
      console.log('[SuggestedQueriesService] Cache check:', {
        hasCached: !!cached,
        hasMetadata: !!metadata,
        cached,
        metadata
      });
      
      if (cached && metadata) {
        const { generatedAt } = metadata as QueryMetadata;
        const age = Date.now() - generatedAt;
        const isStale = age > this.CACHE_TTL * 1000;
        
        // Return cached but mark as stale
        if (isStale && age < (this.CACHE_TTL + this.STALE_WHILE_REVALIDATE) * 1000) {
          // Trigger background refresh
          this.triggerBackgroundRefresh(courseId, schoolId);
          
          console.log('[SuggestedQueriesService] Returning stale cached queries');
          return {
            queries: cached as string[],
            fromCache: true,
            isStale: true
          };
        }
        
        if (!isStale) {
          console.log('[SuggestedQueriesService] Returning fresh cached queries');
          return {
            queries: cached as string[],
            fromCache: true,
            isStale: false
          };
        }
      }
    }
    
    console.log('[SuggestedQueriesService] Cache miss or force refresh, generating new queries');
    // Generate new queries
    return await this.generateAndCache(courseId, schoolId);
  }
  
  private async generateAndCache(courseId: string, schoolId: string): Promise<QueryResult> {
    try {
      // Get course details
      const course = await this.getCourseDetails(courseId, schoolId);
      console.log('[SuggestedQueriesService] Course details:', course);
      
      if (!course) {
        console.log('[SuggestedQueriesService] No course found, returning defaults');
        return {
          queries: this.getDefaultQueries(),
          fromCache: false,
          isStale: false
        };
      }
      
      // Get content samples for context
      const contentSamples = await this.getCourseContentSample(courseId);
      console.log('[SuggestedQueriesService] Content samples count:', contentSamples.length);
      
      // Generate queries using AI
      const queries = await this.generateQueriesWithAI(course, contentSamples);
      console.log('[SuggestedQueriesService] Generated queries:', queries);
      
      // Get content state for metadata
      const contentState = await this.getCourseContentState(courseId);
      
      // Cache the queries
      await this.cacheQueries(courseId, schoolId, queries, contentState);
      console.log('[SuggestedQueriesService] Cached queries successfully');
      
      return {
        queries,
        fromCache: false,
        isStale: false
      };
    } catch (error) {
      console.error('[SuggestedQueriesService] Error generating queries:', error);
      return {
        queries: this.getDefaultQueries(),
        fromCache: false,
        isStale: false
      };
    }
  }
  
  private async generateQueriesWithAI(
    course: { code: string; title: string }, 
    contentSamples: string[]
  ): Promise<string[]> {
    const apiKey = this.env?.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY || (globalThis as any).__workerEnv?.ANTHROPIC_API_KEY;
    
    if (!apiKey) {
      console.error('[SuggestedQueriesService] No Anthropic API key found in any source');
      return this.getDefaultQueries();
    }
    
    const anthropic = createAnthropic({
      apiKey,
    });
    
    const prompt = `Generate 2 specific, practical questions that a college student might ask about the course "${course.code} - ${course.title}". The questions should be:
1. Specific to the actual subject matter and content (not generic)
2. Academically relevant (about exams, assignments, labs, concepts, etc.)
3. Between 5-12 words each
4. Written in a natural, student-like tone

Base your questions on the actual course content below. Look for specific topics, concepts, assignments, labs, or exam materials mentioned:

--- Course Content ---
${contentSamples.join('\n\n')}
--- End Course Content ---

Return only the 2 questions, each on a separate line, without numbering or quotes.`;
    
    try {
      const result = await generateText({
        model: anthropic('claude-3-5-sonnet-20241022'),
        prompt,
        maxTokens: 200,
        temperature: 0.7
      });
      
      const queries = result.text
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
    } catch (error) {
      console.error('AI generation failed:', error);
    }
    
    return this.getDefaultQueries();
  }
  
  private async getCourseDetails(courseId: string, schoolId: string): Promise<{ code: string; title: string } | null> {
    try {
      // Ensure env has required Supabase credentials
      if (!this.env?.SUPABASE_URL || !this.env?.SUPABASE_SERVICE_ROLE_KEY) {
        console.error('[SuggestedQueriesService] Missing Supabase credentials:', {
          hasUrl: !!this.env?.SUPABASE_URL,
          hasKey: !!this.env?.SUPABASE_SERVICE_ROLE_KEY
        });
        return null;
      }
      
      const supabase = getSupabaseClient(this.env);
      const { data: course, error } = await supabase
        .from('courses')
        .select('code, title')
        .eq('id', courseId)
        .eq('school_id', schoolId)
        .single();
      
      if (error || !course?.code || !course?.title) {
        return null;
      }
      
      return {
        code: course.code,
        title: course.title
      };
    } catch (error) {
      console.error('Failed to fetch course details:', error);
      return null;
    }
  }
  
  private async getCourseContentSample(courseId: string): Promise<string[]> {
    try {
      const supabase = getSupabaseClient(this.env);
      
      // Get sample of documents from this course
      const { data: docs, error: docsError } = await supabase
        .from('docs')
        .select('id')
        .eq('course_id', courseId)
        .limit(5);
      
      if (docsError || !docs || docs.length === 0) {
        return [];
      }
      
      const docIds = docs.map(doc => doc.id);
      
      // Get content chunks from these documents
      const { data: chunks, error: chunksError } = await supabase
        .from('chunks')
        .select('content')
        .in('doc_id', docIds)
        .limit(10)
        .order('chunk_count', { ascending: true });
      
      if (chunksError || !chunks || chunks.length === 0) {
        return [];
      }
      
      // Return the content strings, limiting length
      return chunks
        .map(chunk => chunk.content.substring(0, 500))
        .filter(content => content.trim().length > 50);
    } catch (error) {
      console.error('Failed to get course content sample:', error);
      return [];
    }
  }
  
  private async getCourseContentState(courseId: string): Promise<{
    documentCount: number;
    contentHash: string;
  }> {
    try {
      const supabase = getSupabaseClient(this.env);
      
      const { count } = await supabase
        .from('docs')
        .select('id', { count: 'exact', head: true })
        .eq('course_id', courseId);
      
      // Simple hash based on document count and course ID
      // In production, you might want a more sophisticated hash
      const contentHash = `${courseId}-${count || 0}`;
      
      return {
        documentCount: count || 0,
        contentHash
      };
    } catch (error) {
      console.error('Failed to get content state:', error);
      return {
        documentCount: 0,
        contentHash: courseId
      };
    }
  }
  
  private async cacheQueries(
    courseId: string, 
    schoolId: string, 
    queries: string[], 
    contentState: { documentCount: number; contentHash: string }
  ): Promise<void> {
    const key = `queries:${courseId}:${schoolId}`;
    const metaKey = `queries-meta:${courseId}:${schoolId}`;
    
    const metadata: QueryMetadata = {
      generatedAt: Date.now(),
      contentHash: contentState.contentHash,
      documentCount: contentState.documentCount
    };
    
    await Promise.all([
      this.kv.put(key, JSON.stringify(queries), { 
        expirationTtl: this.CACHE_TTL + this.STALE_WHILE_REVALIDATE 
      }),
      this.kv.put(metaKey, JSON.stringify(metadata), { 
        expirationTtl: this.CACHE_TTL + this.STALE_WHILE_REVALIDATE 
      })
    ]);
  }
  
  private async triggerBackgroundRefresh(courseId: string, schoolId: string): void {
    // In a production environment, you might use Durable Objects or Queues
    // For now, we'll just log that a refresh should happen
    console.log(`Background refresh triggered for course ${courseId} in school ${schoolId}`);
    
    // In a real implementation, you could:
    // - Use Cloudflare Queues to process this asynchronously
    // - Use a Durable Object to coordinate refreshes
    // - Or simply let the next request handle the refresh
  }
  
  private getDefaultQueries(): string[] {
    // Import from config or use defaults
    const defaults = [
      "What are the key concepts for the next exam?",
      "Can you explain the last lecture in simpler terms?",
      "Summarize the main points of this week's readings.",
      "What are some practice problems for this topic?"
    ];
    console.log('[SuggestedQueriesService] Returning default queries:', defaults);
    return defaults;
  }
}

// Export handler function for use in Mastra routes
export async function getSuggestedQueriesHandler({
  courseId,
  schoolId,
  refresh,
  mastra,
  env,
}: {
  courseId: string;
  schoolId: string;
  refresh: boolean;
  mastra: any;
  env: any;
}): Promise<{
  suggestedQueries: string[];
  fromCache: boolean;
  metadata?: { isStale: boolean; generatedAt?: number };
}> {
  const service = new SuggestedQueriesService(env.SUGGESTED_QUERIES, env);
  const result = await service.getQueries(courseId, schoolId, refresh);
  
  return {
    suggestedQueries: result.queries,
    fromCache: result.fromCache,
    metadata: {
      isStale: result.isStale
    }
  };
}