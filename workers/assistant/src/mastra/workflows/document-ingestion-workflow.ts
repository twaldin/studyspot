import { createStep, createWorkflow } from "@mastra/core";
import { z } from "zod";
import crypto from "crypto";
import { MDocument } from "@mastra/rag";
import { embedMany } from "ai";
import { openai } from "@ai-sdk/openai";
import { LlamaParse } from "llama-parse";
import { getSupabaseClient } from "../../services/supabase.service.js";
import { sanitizeText } from "../../../../shared/utils/sanitize-text.js";
import { relevanceCheckerAgent } from "../agents/relevance-checker-agent.js";

// Step 1: Download and validate file
const downloadAndValidateStep = createStep({
  id: "download-validate",
  inputSchema: z.object({
    fileUrl: z.string().url(),
    fileName: z.string(),
    fileType: z.string(),
  }),
  outputSchema: z.object({
    fileBuffer: z.instanceof(Buffer),
    fileHash: z.string(),
    fileSize: z.number(),
  }),
  execute: async ({ inputData }) => {
    console.log(`[Download] Starting download of ${inputData.fileName}`);

    const response = await fetch(inputData.fileUrl);
    if (!response.ok) {
      throw new Error(`Failed to download file: ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);
    const fileHash = crypto.createHash("sha256").update(fileBuffer).digest(
      "hex",
    );

    // Validate file size (32MB max)
    if (fileBuffer.length > 32 * 1024 * 1024) {
      throw new Error("File too large (max 32MB)");
    }

    console.log(
      `[Download] File downloaded: ${fileBuffer.length} bytes, hash: ${fileHash}`,
    );

    return {
      fileBuffer,
      fileHash,
      fileSize: fileBuffer.length,
    };
  },
});

// Step 2: Check for duplicates
const checkDuplicateStep = createStep({
  id: "check-duplicate",
  inputSchema: z.object({
    fileHash: z.string(),
    courseId: z.string(),
  }),
  outputSchema: z.object({
    isDuplicate: z.boolean(),
    existingDocId: z.string().optional(),
    existingFileName: z.string().optional(),
  }),
  execute: async ({ inputData }) => {
    console.log(`[Duplicate Check] Checking hash: ${inputData.fileHash}`);

    const supabase = getSupabaseClient();
    const { data: existing, error } = await supabase
      .from("docs")
      .select("id, file_name")
      .eq("file_hash", inputData.fileHash)
      .eq("course_id", inputData.courseId)
      .maybeSingle();

    if (error) {
      console.error("[Duplicate Check] Error:", error);
      throw new Error("Failed to check for duplicates");
    }

    const isDuplicate = !!existing;
    console.log(`[Duplicate Check] Is duplicate: ${isDuplicate}`);

    if (isDuplicate) {
      // Don't throw error, just return the duplicate info
      // The workflow can decide what to do
      return {
        isDuplicate,
        existingDocId: existing.id,
        existingFileName: existing.file_name,
      };
    }

    return { isDuplicate: false };
  },
});

// Step 3: Extract content with LlamaParse
const extractContentStep = createStep({
  id: "extract-content",
  inputSchema: z.object({
    fileBuffer: z.instanceof(Buffer),
    fileName: z.string(),
    isDuplicate: z.boolean(),
  }),
  outputSchema: z.object({
    markdown: z.string(),
    pageCount: z.number().optional(),
    skipped: z.boolean().optional(),
  }),
  execute: async ({ inputData }) => {
    // Skip if duplicate
    if (inputData.isDuplicate) {
      console.log("[Extract] Skipping duplicate file");
      return { markdown: "", skipped: true };
    }

    console.log(
      `[Extract] Starting LlamaParse extraction for ${inputData.fileName}`,
    );

    // Get env from global context if available
    const env = (globalThis as any).__workerEnv || process.env;
    const llamaApiKey = env?.LLAMA_CLOUD_API_KEY;
    
    if (!llamaApiKey) {
      throw new Error("LlamaParse API key not found in environment");
    }

    const parser = new LlamaParse({
      apiKey: llamaApiKey,
    });

    // Create a File object from buffer
    const file = new File([inputData.fileBuffer], inputData.fileName);

    try {
      const result = await parser.parseFile(file);

      if (!result || !result.markdown) {
        throw new Error("No content extracted from document");
      }

      console.log(`[Extract] Extracted ${result.markdown.length} characters`);

      return {
        markdown: result.markdown,
        pageCount: result.pages?.length,
      };
    } catch (error) {
      console.error("[Extract] LlamaParse error:", error);
      throw new Error(`Failed to extract content: ${error.message}`);
    }
  },
});

// Step 4: Chunk document
const chunkDocumentStep = createStep({
  id: "chunk-document",
  inputSchema: z.object({
    markdown: z.string(),
    fileName: z.string(),
    skipped: z.boolean().optional(),
  }),
  outputSchema: z.object({
    chunks: z.array(z.object({
      text: z.string(),
      metadata: z.any().optional(),
    })),
    skipped: z.boolean().optional(),
  }),
  execute: async ({ inputData }) => {
    // Skip if no content
    if (inputData.skipped || !inputData.markdown) {
      return { chunks: [], skipped: true };
    }

    console.log(`[Chunk] Starting chunking for ${inputData.fileName}`);

    // Create MDocument from markdown
    const doc = MDocument.fromMarkdown(inputData.markdown);

    // Use markdown-aware chunking strategy
    const chunks = await doc.chunk({
      strategy: "markdown",
      size: 512,
      overlap: 50,
      extract: {
        metadata: true, // Extract section headers, etc.
      },
    });

    console.log(`[Chunk] Created ${chunks.length} chunks`);

    // Sanitize chunk text
    const sanitizedChunks = chunks.map((chunk, index) => ({
      text: sanitizeText(chunk.text, `${inputData.fileName}-chunk-${index}`),
      metadata: chunk.metadata,
    }));

    return { chunks: sanitizedChunks };
  },
});

// Step 5: Check relevance
const checkRelevanceStep = createStep({
  id: "check-relevance",
  inputSchema: z.object({
    chunks: z.array(z.object({
      text: z.string(),
      metadata: z.any().optional(),
    })),
    courseId: z.string(),
    fileName: z.string(),
    skipped: z.boolean().optional(),
  }),
  outputSchema: z.object({
    isRelevant: z.boolean(),
    reason: z.string().optional(),
    courseProvided: z.boolean(),
    skipped: z.boolean().optional(),
  }),
  execute: async ({ inputData, mastra }) => {
    // Skip if no chunks
    if (inputData.skipped || inputData.chunks.length === 0) {
      return { isRelevant: true, courseProvided: false, skipped: true };
    }

    console.log(`[Relevance] Checking relevance for ${inputData.fileName}`);

    // Get course info
    const supabase = getSupabaseClient();
    const { data: course } = await supabase
      .from("courses")
      .select("code, title")
      .eq("id", inputData.courseId)
      .single();

    if (!course) {
      console.warn("[Relevance] Course not found, skipping relevance check");
      return { isRelevant: true, courseProvided: false };
    }

    // Use relevance checker agent directly (matching RAG workflow pattern)
    const relevanceAgent = relevanceCheckerAgent;

    // Take first 3000 chars for relevance check
    const sampleText = inputData.chunks
      .slice(0, 3)
      .map((c) => c.text)
      .join("\n\n")
      .substring(0, 3000);

    const result = await relevanceAgent.generate([{
      role: "user",
      content:
        `Analyze if this document is relevant to the course "${course.code} - ${course.title}".
        
Document sample:
${sampleText}

Filename: ${inputData.fileName}

Respond with a JSON object containing:
- isRelevant: boolean (true if related to the course topic)
- reason: string (brief explanation)
- courseProvided: boolean (true if this appears to be official course material like lecture slides, syllabus, etc.)`,
    }], {
      output: {
        type: "object",
        properties: {
          isRelevant: { type: "boolean" },
          reason: { type: "string" },
          courseProvided: { type: "boolean" },
        },
        required: ["isRelevant", "reason", "courseProvided"],
      },
    });

    console.log(`[Relevance] Result:`, result.object);

    return result.object;
  },
});

// Step 6: Generate embeddings
const generateEmbeddingsStep = createStep({
  id: "generate-embeddings",
  inputSchema: z.object({
    chunks: z.array(z.object({
      text: z.string(),
      metadata: z.any().optional(),
    })),
    isRelevant: z.boolean(),
    skipped: z.boolean().optional(),
  }),
  outputSchema: z.object({
    embeddings: z.array(z.array(z.number())),
    skipped: z.boolean().optional(),
  }),
  execute: async ({ inputData }) => {
    // Skip if not relevant or no chunks
    if (
      inputData.skipped || !inputData.isRelevant ||
      inputData.chunks.length === 0
    ) {
      return { embeddings: [], skipped: true };
    }

    console.log(
      `[Embeddings] Generating embeddings for ${inputData.chunks.length} chunks`,
    );

    try {
      const { embeddings } = await embedMany({
        model: openai.embedding("text-embedding-3-small"),
        values: inputData.chunks.map((chunk) => chunk.text),
      });

      console.log(`[Embeddings] Generated ${embeddings.length} embeddings`);

      return { embeddings };
    } catch (error) {
      console.error("[Embeddings] Error:", error);
      throw new Error(`Failed to generate embeddings: ${error.message}`);
    }
  },
});

// Step 7: Store in database
const storeInDatabaseStep = createStep({
  id: "store-database",
  inputSchema: z.object({
    fileName: z.string(),
    fileUrl: z.string(),
    fileType: z.string(),
    fileHash: z.string(),
    courseId: z.string(),
    courseProvided: z.boolean(),
    chunks: z.array(z.object({
      text: z.string(),
      metadata: z.any().optional(),
    })),
    embeddings: z.array(z.array(z.number())),
    isRelevant: z.boolean(),
    isDuplicate: z.boolean(),
    existingDocId: z.string().optional(),
    skipped: z.boolean().optional(),
  }),
  outputSchema: z.object({
    documentId: z.string(),
    chunkCount: z.number(),
    status: z.enum(["created", "duplicate", "skipped"]),
  }),
  execute: async ({ inputData }) => {
    // Handle duplicate case
    if (inputData.isDuplicate && inputData.existingDocId) {
      console.log(`[Store] Document is duplicate, returning existing ID`);
      return {
        documentId: inputData.existingDocId,
        chunkCount: 0,
        status: "duplicate",
      };
    }

    // Handle skipped/not relevant case
    if (inputData.skipped || !inputData.isRelevant) {
      console.log(`[Store] Document skipped or not relevant`);
      return {
        documentId: "",
        chunkCount: 0,
        status: "skipped",
      };
    }

    console.log(
      `[Store] Storing document and ${inputData.chunks.length} chunks`,
    );

    const supabase = getSupabaseClient();

    // Create document record
    const { data: doc, error: docError } = await supabase
      .from("docs")
      .insert({
        file_name: inputData.fileName,
        file_url: inputData.fileUrl,
        file_type: inputData.fileType,
        file_hash: inputData.fileHash,
        course_id: inputData.courseId,
        course_provided: inputData.courseProvided,
      })
      .select("id")
      .single();

    if (docError) {
      console.error("[Store] Document insert error:", docError);
      throw new Error("Failed to create document record");
    }

    // Prepare chunks for insertion
    const chunksToInsert = inputData.chunks.map((chunk, index) => ({
      doc_id: doc.id,
      content: chunk.text,
      embedding: inputData.embeddings[index],
      chunk_count: index,
      // Note: metadata is extracted during chunking but not stored in database
      // If you want to store metadata, add a JSONB column to chunks table:
      // ALTER TABLE chunks ADD COLUMN metadata JSONB DEFAULT '{}';
    }));

    // Insert chunks in batches of 100
    const batchSize = 100;
    for (let i = 0; i < chunksToInsert.length; i += batchSize) {
      const batch = chunksToInsert.slice(i, i + batchSize);
      const { error: chunkError } = await supabase
        .from("chunks")
        .insert(batch);

      if (chunkError) {
        console.error("[Store] Chunk insert error:", chunkError);
        throw new Error("Failed to insert chunks");
      }
    }

    console.log(
      `[Store] Successfully stored document ${doc.id} with ${chunksToInsert.length} chunks`,
    );

    return {
      documentId: doc.id,
      chunkCount: chunksToInsert.length,
      status: "created",
    };
  },
});

// Create a simplified workflow execution function for Cloudflare Workers
export async function executeDocumentIngestion(input: {
  fileKey: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  courseId: string;
  userId: string;
  onProgress?: (message: string) => void;
  mastra?: any; // Mastra instance for accessing agents
}): Promise<{
  success: boolean;
  documentId?: string;
  error?: string;
  status: "created" | "duplicate" | "skipped" | "failed";
  chunkCount?: number;
}> {
  const { onProgress } = input;

  try {
    // Step 1: Download and validate
    onProgress?.("Downloading and validating file...");
    const downloadResult = await downloadAndValidateStep.execute({
      inputData: {
        fileUrl: input.fileUrl,
        fileName: input.fileName,
        fileType: input.fileType,
      },
    });

    // Step 2: Check for duplicates
    onProgress?.("Checking for duplicates...");
    const duplicateResult = await checkDuplicateStep.execute({
      inputData: {
        fileHash: downloadResult.fileHash,
        courseId: input.courseId,
      },
    });

    if (duplicateResult.isDuplicate) {
      return {
        success: true,
        documentId: duplicateResult.existingDocId,
        status: "duplicate",
        chunkCount: 0,
      };
    }

    // Step 3: Extract content
    onProgress?.("Extracting content with LlamaParse...");
    const extractResult = await extractContentStep.execute({
      inputData: {
        fileBuffer: downloadResult.fileBuffer,
        fileName: input.fileName,
        isDuplicate: duplicateResult.isDuplicate,
      },
    });

    if (extractResult.skipped) {
      return {
        success: true,
        status: "skipped",
        chunkCount: 0,
      };
    }

    // Step 4: Chunk document
    onProgress?.("Processing document chunks...");
    const chunkResult = await chunkDocumentStep.execute({
      inputData: {
        markdown: extractResult.markdown,
        fileName: input.fileName,
        skipped: extractResult.skipped,
      },
    });

    // Step 5: Check relevance
    onProgress?.("Checking document relevance...");
    const relevanceResult = await checkRelevanceStep.execute({
      inputData: {
        chunks: chunkResult.chunks,
        courseId: input.courseId,
        fileName: input.fileName,
        skipped: chunkResult.skipped,
      },
      mastra: input.mastra, // Pass the mastra instance
    });

    if (!relevanceResult.isRelevant) {
      return {
        success: true,
        status: "skipped",
        chunkCount: 0,
      };
    }

    // Step 6: Generate embeddings
    onProgress?.("Generating embeddings...");
    const embeddingResult = await generateEmbeddingsStep.execute({
      inputData: {
        chunks: chunkResult.chunks,
        isRelevant: relevanceResult.isRelevant,
        skipped: relevanceResult.skipped,
      },
    });

    // Step 7: Store in database
    onProgress?.("Storing in database...");
    const storeResult = await storeInDatabaseStep.execute({
      inputData: {
        fileName: input.fileName,
        fileUrl: input.fileUrl,
        fileType: input.fileType,
        fileHash: downloadResult.fileHash,
        courseId: input.courseId,
        courseProvided: relevanceResult.courseProvided,
        chunks: chunkResult.chunks,
        embeddings: embeddingResult.embeddings,
        isRelevant: relevanceResult.isRelevant,
        isDuplicate: duplicateResult.isDuplicate,
        existingDocId: duplicateResult.existingDocId,
        skipped: embeddingResult.skipped,
      },
    });

    return {
      success: true,
      documentId: storeResult.documentId,
      status: storeResult.status,
      chunkCount: storeResult.chunkCount,
    };
  } catch (error) {
    console.error("[Document Ingestion] Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      status: "failed",
    };
  }
}

// Keep the original workflow for Mastra compatibility, but don't use chaining
export const documentIngestionWorkflow = createWorkflow({
  id: "document-ingestion",
  inputSchema: z.object({
    fileKey: z.string(),
    fileName: z.string(),
    fileUrl: z.string(),
    fileType: z.string(),
    courseId: z.string(),
    userId: z.string(),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    documentId: z.string().optional(),
    error: z.string().optional(),
    status: z.enum(["created", "duplicate", "skipped", "failed"]),
    chunkCount: z.number().optional(),
  }),
  execute: async ({ input, mastra }) => {
    // Use the simplified execution function with mastra instance
    return await executeDocumentIngestion({ ...input, mastra });
  },
});

