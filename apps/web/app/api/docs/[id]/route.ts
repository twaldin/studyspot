import { NextResponse } from 'next/server';
import { authService } from '@/lib/services/auth/auth.service';
import { deleteUploadThingFile } from '@/lib/services/file/uploadthing-cleanup';
import logger from '@/lib/logger';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await authService.validateAuthWithSchool();
    const supabase = auth.supabase;
    const { id: documentId } = await params;

    logger.info({ documentId, userId: auth.userId }, 'Starting document deletion');

    // Get the document first to retrieve file info for cleanup
    const { data: doc, error: fetchError } = await supabase
      .from('docs')
      .select('id, file_name, file_url, course_id')
      .eq('id', documentId)
      .single();

    if (fetchError || !doc) {
      logger.warn({ documentId, error: fetchError }, 'Document not found for deletion');
      return NextResponse.json(
        { message: 'Document not found' },
        { status: 404 }
      );
    }

    // Delete all chunks associated with this document
    const { error: chunksError } = await supabase
      .from('chunks')
      .delete()
      .eq('doc_id', documentId);

    if (chunksError) {
      logger.error({ documentId, error: chunksError }, 'Failed to delete document chunks');
      throw new Error(`Failed to delete document chunks: ${chunksError.message}`);
    }

    // Delete the document record
    const { error: docError } = await supabase
      .from('docs')
      .delete()
      .eq('id', documentId);

    if (docError) {
      logger.error({ documentId, error: docError }, 'Failed to delete document record');
      throw new Error(`Failed to delete document: ${docError.message}`);
    }

    // Clean up the file from UploadThing storage
    try {
      await deleteUploadThingFile(doc.file_url);
      logger.info({ documentId, fileUrl: doc.file_url }, 'Successfully cleaned up file from storage');
    } catch (cleanupError) {
      // Log but don't fail the request since the database deletion succeeded
      logger.warn({ 
        documentId, 
        fileUrl: doc.file_url, 
        error: cleanupError 
      }, 'Failed to cleanup file from storage, but document deleted from database');
    }

    logger.info({ documentId, fileName: doc.file_name }, 'Document deleted successfully');

    return NextResponse.json({ 
      message: 'Document deleted successfully',
      documentId,
      fileName: doc.file_name
    });

  } catch (error) {
    logger.error({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, 'Error deleting document');

    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ message }, { status: 500 });
  }
}