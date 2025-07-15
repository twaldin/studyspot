import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/lib/database.types';
import logger from '@/lib/logger';
import { deleteUploadThingFile } from '@/lib/services/file';

export interface Document {
  id: string;
  file_name: string;
  file_url: string;
  file_type: string;
  course_id: string;
  created_at: string;
  is_starred?: boolean;
  report_count: number;
  has_reported?: boolean;
}

export const deleteDocument = async (supabase: SupabaseClient<Database>, documentId: string): Promise<{ success: boolean; error?: string }> => {
  try {
    // First, delete associated chunks
    const { error: chunksError } = await supabase
      .from('chunks')
      .delete()
      .eq('doc_id', documentId);

    if (chunksError) {
      throw new Error(`Failed to delete associated chunks: ${chunksError.message}`);
    }

    // Then get the document to get its storage URL
    const { data: document, error: fetchError } = await supabase
      .from('docs')
      .select('file_url')
      .eq('id', documentId)
      .single();

    if (fetchError) {
      throw new Error(`Failed to fetch document: ${fetchError.message}`);
    }

    if (!document) {
      throw new Error('Document not found');
    }

    // Delete the file from UploadThing storage
    const fileUrl = document.file_url;
    const storageResult = await deleteUploadThingFile(fileUrl);
    
    if (!storageResult.success) {
      logger.warn({ 
        documentId, 
        fileUrl, 
        error: storageResult.error 
      }, 'Failed to delete file from UploadThing storage, but continuing with database cleanup');
      // Continue with database cleanup even if storage deletion fails
      // This prevents orphaned database records
    }

    // Finally delete the document record
    const { error: deleteError } = await supabase
      .from('docs')
      .delete()
      .eq('id', documentId);

    if (deleteError) {
      throw new Error(`Failed to delete document record: ${deleteError.message}`);
    }

    return { success: true };
  } catch (error) {
    logger.error({ error, docId: documentId }, 'Failed to delete document');
    return { success: false, error: 'Failed to delete document' };
  }
};



