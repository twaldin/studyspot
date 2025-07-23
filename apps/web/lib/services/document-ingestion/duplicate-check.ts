import { createClient } from '@supabase/supabase-js';
import { Database } from '@/lib/database.types';
import logger from '@/lib/logger';

/**
 * Check for duplicate content by file hash
 * Maintains exact same functionality as original assistant API
 */
export async function checkForDuplicateContent(
  courseId: string, 
  fileHash: string
): Promise<{ id: string; file_name: string } | null> {
  try {
    const supabase = createClient<Database>(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    
    const { data: existingDoc, error: hashCheckError } = await supabase
      .from('docs')
      .select('id, file_name')
      .eq('course_id', courseId)
      .eq('file_hash', fileHash)
      .single();

    if (hashCheckError && hashCheckError.code !== 'PGRST116') {
      logger.error({
        error: hashCheckError,
        courseId,
        fileHash
      }, 'Error checking for duplicate hash');
      throw new Error('Error checking for duplicate content');
    }

    if (existingDoc) {
      logger.info({
        existingFileName: existingDoc.file_name,
        fileHash,
        courseId
      }, 'File with identical content already exists');
      
      return existingDoc;
    }

    return null;

  } catch (error) {
    logger.error({
      error: error instanceof Error ? error.message : 'Unknown error',
      courseId,
      fileHash
    }, 'Error in duplicate content check');
    throw error;
  }
}