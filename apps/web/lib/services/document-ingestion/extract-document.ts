import path from "path";
import {
  Document,
  CSVReader,
  DocxReader,
  HTMLReader,
  ImageReader,
  JSONReader,
  MarkdownReader,
  PDFReader,
  TextFileReader
} from '@/lib/llamaindex-imports';
import type { Metadata } from '@/lib/llamaindex-imports';
import logger, { LogContext } from '@/lib/logger';

// Document readers by file extension
const extToReader: Record<string, any> = {
  csv: new CSVReader(),
  docx: new DocxReader(),
  html: new HTMLReader(),
  htm: new HTMLReader(),
  jpg: new ImageReader(), 
  jpeg: new ImageReader(),
  png: new ImageReader(),
  json: new JSONReader(),
  md: new MarkdownReader(),
  pdf: new PDFReader(),
  txt: new TextFileReader(),
};

/**
 * Extract document content from a file path using LlamaIndex readers
 * Maintains exact same functionality as original assistant API
 */
export async function extractDocument(
  filePath: string
): Promise<Document<Metadata>[]> {
  const ext = path.extname(filePath).replace(/^\./, "").toLowerCase();
  const reader = extToReader[ext];
  
  if (!reader) {
    logger.error({ filePath, extension: ext }, "Document Ingestion: Unsupported file extension.");
    throw new Error(`Unsupported file extension: .${ext}`);
  }
  
  logger.info({ filePath, extension: ext }, "Document Ingestion: Loading data from file.");
  
  try {
    const documents = await reader.loadData(filePath);
    logger.info({ filePath, documentCount: documents.length }, "Document Ingestion: Successfully extracted documents.");
    return documents;
  } catch (error) {
    logger.error({ 
      error: error instanceof Error ? error.message : 'Unknown error',
      filePath 
    }, "Document Ingestion: Error extracting document.");
    throw error;
  }
}