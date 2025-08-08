import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import { generateEmbedding } from '../../services/embedding.service.js';
import { searchDocumentChunks } from '../../services/supabase.service.js';

export const semanticSearchTool = createTool({
  id: 'semantic_search',
  description: 'Search for relevant content using semantic similarity. Use this when you need to find information related to a specific topic, concept, or question. You can customize the search query, similarity threshold, and number of results.',
  inputSchema: z.object({
    query: z.string().min(1, 'Search query cannot be empty')
      .describe('The search query - describe what information you are looking for'),
    courseId: z.string().uuid('Course ID must be a valid UUID').optional()
      .describe('Course ID (optional, will use runtime context if not provided)'),
    limit: z.number().int().positive().max(20).optional().default(5)
      .describe('Maximum number of results to return (default: 5)'),
    minSimilarity: z.number().min(0).max(1).optional().default(0.5)
      .describe('Minimum similarity threshold (0-1, default: 0.5, lower = more results)')
  }),
  outputSchema: z.object({
    documents: z.array(z.object({
      id: z.string().describe('Chunk ID'),
      docId: z.string().describe('Document ID that contains this chunk'),
      content: z.string().describe('The matching text content'),
      similarity: z.number().describe('Similarity score (0-1)')
    })),
    totalResults: z.number().describe('Total number of results found'),
    searchQuery: z.string().describe('The query that was used for search'),
    success: z.boolean().describe('Whether the search was successful'),
    error: z.string().optional().describe('Error message if search failed')
  }),
  execute: async ({ context, runtimeContext }) => {
    const { query, courseId: providedCourseId, limit, minSimilarity } = context;
    
    // Use provided courseId or fall back to runtime context
    const courseId = providedCourseId || runtimeContext?.get?.('courseId');
    
    if (!courseId) {
      console.warn(`[SemanticSearchTool] No course ID provided in tool input or runtime context`);
      return {
        documents: [],
        totalResults: 0,
        searchQuery: query,
        success: false,
        error: 'Course ID is required for semantic search'
      };
    }
    
    console.log(`[SemanticSearchTool] Semantic searching course ${courseId} with query: "${query.substring(0, 100)}${query.length > 100 ? '...' : ''}", limit: ${limit}, minSimilarity: ${minSimilarity}`);

    try {
      // Validate course access
      const { SupabaseService } = await import('../../services/supabase.service.js');
      const hasAccess = await SupabaseService.validateCourseAccess(courseId);
      if (!hasAccess) {
        console.warn(`[SemanticSearchTool] No access to course: ${courseId}`);
        return {
          documents: [],
          totalResults: 0,
          searchQuery: query,
          success: false,
          error: 'Course not found or access denied'
        };
      }
    
      // Perform vector search using SupabaseService
      const searchResult = await SupabaseService.performVectorSearch(
        query, 
        courseId, 
        limit
      );

      if (!searchResult.success) {
        console.warn(`[SemanticSearchTool] Vector search failed`);
        return {
          documents: [],
          totalResults: 0,
          searchQuery: query,
          success: false,
          error: 'Vector search failed'
        };
      }

      // Filter by minimum similarity if specified
      const filteredDocuments = searchResult.documents.filter(doc => 
        (doc.similarity || 0) >= minSimilarity
      );

      console.log(`[SemanticSearchTool] Found ${filteredDocuments.length} documents above similarity threshold ${minSimilarity}`);

      return {
        documents: filteredDocuments.map(doc => ({
          id: doc.id,
          docId: doc.doc_id,
          content: doc.content,
          similarity: doc.similarity || 0
        })),
        totalResults: filteredDocuments.length,
        searchQuery: query,
        success: true
      };

    } catch (error) {
      console.error(`[SemanticSearchTool] Error in semantic search:`, error);
      
      return {
        documents: [],
        totalResults: 0,
        searchQuery: query,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
});