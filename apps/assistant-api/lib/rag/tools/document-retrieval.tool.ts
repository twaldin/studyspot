import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/lib/types/database';
import logger from '@/lib/utils/logger';
import { FunctionTool } from '@/lib/utils/llamaindex-imports';

export interface DocumentRetrievalToolParams {
  doc_id: string;
}

export interface DocumentRetrievalToolResult {
  success: boolean;
  document?: {
    id: string;
    file_name: string;
    file_type: string;
    content: string;
  };
  error?: string;
  [key: string]: any; // Index signature to satisfy JSONValue constraint
}

export class DocumentRetrievalTool {
  private supabase: SupabaseClient<Database>;
  private tool: FunctionTool<any, any>;

  constructor(supabase: SupabaseClient<Database>) {
    this.supabase = supabase;
    this.tool = new FunctionTool(
      this.retrieveDocument.bind(this),
      {
        name: 'get_full_document',
        description: 'Retrieve the complete content of a document when you need more context beyond the provided chunk. Use this when the chunk content is insufficient to answer the user\'s question and you need to see the full document.',
        parameters: {
          type: 'object',
          properties: {
            doc_id: {
              type: 'string',
              description: 'The document ID (UUID) from the chunk context that you want to retrieve in full'
            }
          },
          required: ['doc_id']
        }
      }
    );
  }

  getTool(): FunctionTool<any, any> {
    return this.tool;
  }

  private async retrieveDocument(params: DocumentRetrievalToolParams): Promise<DocumentRetrievalToolResult> {
    const { doc_id } = params;
    
    logger.info({ doc_id }, '[DocumentRetrievalTool] Retrieving full document content by fetching all chunks');

    try {
      // 1. Fetch the document metadata to get the file name for context
      const { data: document, error: docError } = await this.supabase
        .from('docs')
        .select('id, file_name, file_type')
        .eq('id', doc_id)
        .single();

      if (docError) {
        logger.error({ error: docError, doc_id }, '[DocumentRetrievalTool] Error fetching document metadata');
        return {
          success: false,
          error: `Document not found or access denied: ${docError.message}`
        };
      }

      if (!document) {
        logger.warn({ doc_id }, '[DocumentRetrievalTool] Document not found');
        return {
          success: false,
          error: 'Document not found'
        };
      }

      // 2. Fetch all chunks for the given doc_id, ordered by their sequence
      const { data: chunks, error: chunksError } = await this.supabase
        .from('chunks')
        .select('content')
        .eq('doc_id', doc_id)
        .order('chunk_count', { ascending: true });

      if (chunksError) {
        logger.error({ error: chunksError, doc_id }, '[DocumentRetrievalTool] Error fetching document chunks');
        return {
          success: false,
          error: `Error fetching document chunks: ${chunksError.message}`
        };
      }

      if (!chunks || chunks.length === 0) {
        logger.warn({ doc_id }, '[DocumentRetrievalTool] No chunks found for this document');
        return {
          success: false,
          error: 'No content found for this document'
        };
      }

      // 3. Concatenate the content of all chunks
      let fullContent = chunks.map(chunk => chunk.content).join('\n\n');

      // 4. Truncate content if it's excessively long to avoid context window issues
      const maxLength = 100000; // ~100k characters, a safe limit
      if (fullContent.length > maxLength) {
        fullContent = fullContent.substring(0, maxLength) + '\n\n[Content truncated due to length...]';
        logger.info({ doc_id, original_length: fullContent.length, truncated_length: maxLength }, '[DocumentRetrievalTool] Concatenated content truncated');
      }

      logger.info({ 
        doc_id, 
        file_name: document.file_name, 
        content_length: fullContent.length,
        chunk_count: chunks.length
      }, '[DocumentRetrievalTool] Successfully retrieved and assembled document content from chunks');

      return {
        success: true,
        document: {
          id: document.id,
          file_name: document.file_name,
          file_type: document.file_type,
          content: fullContent
        }
      };

    } catch (error) {
      logger.error({ error, doc_id }, '[DocumentRetrievalTool] Unexpected error during document retrieval from chunks');
      return {
        success: false,
        error: `Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }
}