// Centralized LlamaIndex imports to avoid duplicate import issues
// All files should import LlamaIndex types and classes from here

// Core LlamaIndex exports
export { Document, FunctionTool, SentenceSplitter, TextNode } from "llamaindex";

// Export types separately to avoid conflicts
export type { ChatMessage, MessageType, Metadata } from "llamaindex";

// Re-export specialized packages
export { Anthropic } from "@llamaindex/anthropic";
export { Gemini, GEMINI_MODEL } from "@llamaindex/google";

// Readers - re-export to ensure single import path
export { CSVReader } from "@llamaindex/readers/csv";
export { DocxReader } from "@llamaindex/readers/docx";
export { HTMLReader } from "@llamaindex/readers/html";
export { ImageReader } from "@llamaindex/readers/image";
export { JSONReader } from "@llamaindex/readers/json";
export { MarkdownReader } from "@llamaindex/readers/markdown";
export { PDFReader } from "@llamaindex/readers/pdf";
export { TextFileReader } from "@llamaindex/readers/text";
