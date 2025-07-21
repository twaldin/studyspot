import logger from '@/lib/utils/logger';
import {
  Document,
  SentenceSplitter,
  TextNode,
} from '@/lib/utils/llamaindex-imports';

// --- 2. Split Document Function (from assistant/utils/split.document.ts) ---
export function splitDocumentsToNodes(documents: Document[]): TextNode[] {
  if (!documents || documents.length === 0) {
    logger.info("Document Ingestion: No documents to split.");
    return [];
  }
  const nodeParser = new SentenceSplitter({
    chunkSize: 512, // Reduced from 1024 to 512
    chunkOverlap: 100, // Also reducing overlap proportionally, was 200. Consider if this is desired.
  });
  const nodes = nodeParser.getNodesFromDocuments(documents);
  logger.info({ numDocuments: documents.length, numNodes: nodes.length }, "Document Ingestion: Documents split into nodes.");
  return nodes;
}