import {
  Document,
  SentenceSplitter,
  TextNode,
} from '@/lib/llamaindex-imports';
import logger from '@/lib/logger';

/**
 * Split documents into smaller text nodes for processing
 * Maintains exact same functionality as original assistant API
 */
export function splitDocumentsToNodes(documents: Document[]): TextNode[] {
  if (!documents || documents.length === 0) {
    logger.info("Document Ingestion: No documents to split.");
    return [];
  }
  
  const nodeParser = new SentenceSplitter({
    chunkSize: 512, // Same as original - reduced from 1024 to 512
    chunkOverlap: 100, // Same as original - proportionally reduced overlap
  });
  
  try {
    const nodes = nodeParser.getNodesFromDocuments(documents);
    logger.info({ numDocuments: documents.length, numNodes: nodes.length }, "Document Ingestion: Documents split into nodes.");
    return nodes;
  } catch (error) {
    logger.error({ 
      error: error instanceof Error ? error.message : 'Unknown error',
      numDocuments: documents.length 
    }, "Document Ingestion: Error splitting documents.");
    throw error;
  }
}