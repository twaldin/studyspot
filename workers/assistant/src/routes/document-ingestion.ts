import { registerApiRoute } from '@mastra/core/server';
import { z } from 'zod';

// Input validation schema
const ingestionRequestSchema = z.object({
  files: z.array(z.object({
    fileKey: z.string(),
    fileName: z.string(),
    fileUrl: z.string(),
    fileType: z.string(),
  })),
  courseId: z.string(),
  userId: z.string(),
});

// Helper to format SSE message
function formatSSE(data: any): string {
  return `data: ${JSON.stringify(data)}\n\n`;
}

// Register the document ingestion SSE endpoint
export const documentIngestionRoute = registerApiRoute('/api/documents/ingest-stream', {
  method: 'POST',
  handler: async (c) => {
    // Validate request body
    const body = await c.req.json();
    const validationResult = ingestionRequestSchema.safeParse(body);
    
    if (!validationResult.success) {
      return c.json(
        { error: 'Invalid request', details: validationResult.error.errors },
        400
      );
    }
    
    const { files, courseId, userId } = validationResult.data;
    
    // Create SSE response
    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        const mastra = c.get('mastra');
        
        // Send initial connection message
        controller.enqueue(encoder.encode(formatSSE({
          type: 'connected',
          message: 'Connected to document ingestion stream',
          totalFiles: files.length
        })));
        
        // Process each file
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          
          try {
            // Send file start event
            controller.enqueue(encoder.encode(formatSSE({
              type: 'file-start',
              fileIndex: i,
              fileName: file.fileName,
              message: `Starting processing of ${file.fileName}`
            })));
            
            // Get the workflow
            const workflow = mastra.getWorkflow('document-ingestion');
            const run = await workflow.createRunAsync();
            
            // Start the workflow with streaming
            const stream = run.streamVNext({
              inputData: {
                fileKey: file.fileKey,
                fileName: file.fileName,
                fileUrl: file.fileUrl,
                fileType: file.fileType,
                courseId,
                userId,
              }
            });
            
            // Process workflow events
            for await (const event of stream) {
              // Map Mastra events to our SSE format
              let sseEvent = null;
              
              switch (event.type) {
                case 'step-start':
                  const stepName = event.payload?.id || 'unknown';
                  const stepMessages: Record<string, string> = {
                    'download-validate': 'Downloading file...',
                    'check-duplicate': 'Checking for duplicates...',
                    'extract-content': 'Extracting content with LlamaParse...',
                    'chunk-document': 'Creating document chunks...',
                    'check-relevance': 'Checking relevance to course...',
                    'generate-embeddings': 'Generating embeddings...',
                    'store-database': 'Storing in database...'
                  };
                  
                  sseEvent = {
                    type: 'step-progress',
                    fileIndex: i,
                    fileName: file.fileName,
                    step: stepName,
                    message: stepMessages[stepName] || `Processing ${stepName}...`
                  };
                  break;
                  
                case 'step-finish':
                  if (event.payload?.id === 'extract-content') {
                    sseEvent = {
                      type: 'extraction-complete',
                      fileIndex: i,
                      fileName: file.fileName,
                      message: 'Content extracted successfully'
                    };
                  }
                  break;
                  
                case 'finish':
                  // Get the workflow result
                  const result = await stream.result;
                  
                  if (result?.success) {
                    sseEvent = {
                      type: 'file-complete',
                      fileIndex: i,
                      fileName: file.fileName,
                      documentId: result.documentId,
                      status: result.status,
                      chunkCount: result.chunkCount,
                      message: result.status === 'duplicate' 
                        ? 'File already exists' 
                        : 'File processed successfully'
                    };
                  } else {
                    sseEvent = {
                      type: 'file-error',
                      fileIndex: i,
                      fileName: file.fileName,
                      error: result?.error || 'Processing failed',
                      message: 'Failed to process file'
                    };
                  }
                  break;
              }
              
              if (sseEvent) {
                controller.enqueue(encoder.encode(formatSSE(sseEvent)));
              }
            }
            
          } catch (error) {
            // Send error event
            controller.enqueue(encoder.encode(formatSSE({
              type: 'file-error',
              fileIndex: i,
              fileName: file.fileName,
              error: error instanceof Error ? error.message : 'Unknown error',
              message: 'Failed to process file'
            })));
          }
        }
        
        // Send completion event
        controller.enqueue(encoder.encode(formatSSE({
          type: 'complete',
          message: 'All files processed',
          totalFiles: files.length
        })));
        
        // Close the stream
        controller.close();
      }
    });
    
    // Return SSE response
    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*', // Configure based on your needs
      }
    });
  }
});