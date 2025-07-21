import logger from '@/lib/utils/logger';
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
} from '@/lib/utils/llamaindex-imports';
import type { Metadata } from '@/lib/utils/llamaindex-imports';

// --- 1. Extract Document Function (from assistant/utils/extract.document.ts) ---
const extToReader: Record<string, any> = {
  csv: new CSVReader(),
  docx: new DocxReader(),
  html: new HTMLReader(),
  htm: new HTMLReader(),
  jpg: new ImageReader(), // Consider if text extraction from images is needed or if this is for metadata
  jpeg: new ImageReader(),
  png: new ImageReader(),
  json: new JSONReader(),
  md: new MarkdownReader(),
  pdf: new PDFReader(),
  txt: new TextFileReader(),
};

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
  return await reader.loadData(filePath);
}