module.exports = {

"[project]/apps/web/features/document/extract-document.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "extractDocument": (()=>extractDocument)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/lib/logger.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$llamaindex$2d$imports$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/apps/web/lib/llamaindex-imports.ts [app-route] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$readers$40$3$2e$1$2e$14_$40$llamaindex$2b$core$40$0$2e$6$2e$15_$40$llamaindex$2b$env$40$0$2e$1$2e$30$2f$node_modules$2f40$llamaindex$2f$readers$2f$csv$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+readers@3.1.14_@llamaindex+core@0.6.15_@llamaindex+env@0.1.30/node_modules/@llamaindex/readers/csv/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$readers$40$3$2e$1$2e$14_$40$llamaindex$2b$core$40$0$2e$6$2e$15_$40$llamaindex$2b$env$40$0$2e$1$2e$30$2f$node_modules$2f40$llamaindex$2f$readers$2f$docx$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+readers@3.1.14_@llamaindex+core@0.6.15_@llamaindex+env@0.1.30/node_modules/@llamaindex/readers/docx/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$readers$40$3$2e$1$2e$14_$40$llamaindex$2b$core$40$0$2e$6$2e$15_$40$llamaindex$2b$env$40$0$2e$1$2e$30$2f$node_modules$2f40$llamaindex$2f$readers$2f$html$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+readers@3.1.14_@llamaindex+core@0.6.15_@llamaindex+env@0.1.30/node_modules/@llamaindex/readers/html/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$readers$40$3$2e$1$2e$14_$40$llamaindex$2b$core$40$0$2e$6$2e$15_$40$llamaindex$2b$env$40$0$2e$1$2e$30$2f$node_modules$2f40$llamaindex$2f$readers$2f$image$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+readers@3.1.14_@llamaindex+core@0.6.15_@llamaindex+env@0.1.30/node_modules/@llamaindex/readers/image/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$readers$40$3$2e$1$2e$14_$40$llamaindex$2b$core$40$0$2e$6$2e$15_$40$llamaindex$2b$env$40$0$2e$1$2e$30$2f$node_modules$2f40$llamaindex$2f$readers$2f$json$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+readers@3.1.14_@llamaindex+core@0.6.15_@llamaindex+env@0.1.30/node_modules/@llamaindex/readers/json/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$readers$40$3$2e$1$2e$14_$40$llamaindex$2b$core$40$0$2e$6$2e$15_$40$llamaindex$2b$env$40$0$2e$1$2e$30$2f$node_modules$2f40$llamaindex$2f$readers$2f$markdown$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+readers@3.1.14_@llamaindex+core@0.6.15_@llamaindex+env@0.1.30/node_modules/@llamaindex/readers/markdown/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$readers$40$3$2e$1$2e$14_$40$llamaindex$2b$core$40$0$2e$6$2e$15_$40$llamaindex$2b$env$40$0$2e$1$2e$30$2f$node_modules$2f40$llamaindex$2f$readers$2f$pdf$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+readers@3.1.14_@llamaindex+core@0.6.15_@llamaindex+env@0.1.30/node_modules/@llamaindex/readers/pdf/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$readers$40$3$2e$1$2e$14_$40$llamaindex$2b$core$40$0$2e$6$2e$15_$40$llamaindex$2b$env$40$0$2e$1$2e$30$2f$node_modules$2f40$llamaindex$2f$readers$2f$text$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+readers@3.1.14_@llamaindex+core@0.6.15_@llamaindex+env@0.1.30/node_modules/@llamaindex/readers/text/dist/index.js [app-route] (ecmascript)");
;
;
;
// --- 1. Extract Document Function (from assistant/utils/extract.document.ts) ---
const extToReader = {
    csv: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$readers$40$3$2e$1$2e$14_$40$llamaindex$2b$core$40$0$2e$6$2e$15_$40$llamaindex$2b$env$40$0$2e$1$2e$30$2f$node_modules$2f40$llamaindex$2f$readers$2f$csv$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["CSVReader"](),
    docx: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$readers$40$3$2e$1$2e$14_$40$llamaindex$2b$core$40$0$2e$6$2e$15_$40$llamaindex$2b$env$40$0$2e$1$2e$30$2f$node_modules$2f40$llamaindex$2f$readers$2f$docx$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DocxReader"](),
    html: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$readers$40$3$2e$1$2e$14_$40$llamaindex$2b$core$40$0$2e$6$2e$15_$40$llamaindex$2b$env$40$0$2e$1$2e$30$2f$node_modules$2f40$llamaindex$2f$readers$2f$html$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["HTMLReader"](),
    htm: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$readers$40$3$2e$1$2e$14_$40$llamaindex$2b$core$40$0$2e$6$2e$15_$40$llamaindex$2b$env$40$0$2e$1$2e$30$2f$node_modules$2f40$llamaindex$2f$readers$2f$html$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["HTMLReader"](),
    jpg: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$readers$40$3$2e$1$2e$14_$40$llamaindex$2b$core$40$0$2e$6$2e$15_$40$llamaindex$2b$env$40$0$2e$1$2e$30$2f$node_modules$2f40$llamaindex$2f$readers$2f$image$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ImageReader"](),
    jpeg: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$readers$40$3$2e$1$2e$14_$40$llamaindex$2b$core$40$0$2e$6$2e$15_$40$llamaindex$2b$env$40$0$2e$1$2e$30$2f$node_modules$2f40$llamaindex$2f$readers$2f$image$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ImageReader"](),
    png: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$readers$40$3$2e$1$2e$14_$40$llamaindex$2b$core$40$0$2e$6$2e$15_$40$llamaindex$2b$env$40$0$2e$1$2e$30$2f$node_modules$2f40$llamaindex$2f$readers$2f$image$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ImageReader"](),
    json: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$readers$40$3$2e$1$2e$14_$40$llamaindex$2b$core$40$0$2e$6$2e$15_$40$llamaindex$2b$env$40$0$2e$1$2e$30$2f$node_modules$2f40$llamaindex$2f$readers$2f$json$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["JSONReader"](),
    md: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$readers$40$3$2e$1$2e$14_$40$llamaindex$2b$core$40$0$2e$6$2e$15_$40$llamaindex$2b$env$40$0$2e$1$2e$30$2f$node_modules$2f40$llamaindex$2f$readers$2f$markdown$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["MarkdownReader"](),
    pdf: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$readers$40$3$2e$1$2e$14_$40$llamaindex$2b$core$40$0$2e$6$2e$15_$40$llamaindex$2b$env$40$0$2e$1$2e$30$2f$node_modules$2f40$llamaindex$2f$readers$2f$pdf$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PDFReader"](),
    txt: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$readers$40$3$2e$1$2e$14_$40$llamaindex$2b$core$40$0$2e$6$2e$15_$40$llamaindex$2b$env$40$0$2e$1$2e$30$2f$node_modules$2f40$llamaindex$2f$readers$2f$text$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["TextFileReader"]()
};
async function extractDocument(filePath) {
    const ext = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].extname(filePath).replace(/^\./, "").toLowerCase();
    const reader = extToReader[ext];
    if (!reader) {
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].error({
            filePath,
            extension: ext
        }, "Document Ingestion: Unsupported file extension.");
        throw new Error(`Unsupported file extension: .${ext}`);
    }
    __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].info({
        filePath,
        extension: ext
    }, "Document Ingestion: Loading data from file.");
    return await reader.loadData(filePath);
}
}}),
"[project]/apps/web/features/document/split-document.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "splitDocumentsToNodes": (()=>splitDocumentsToNodes)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/lib/logger.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$llamaindex$2d$imports$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/apps/web/lib/llamaindex-imports.ts [app-route] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$node$2d$parser$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/node-parser/dist/index.js [app-route] (ecmascript)");
;
;
function splitDocumentsToNodes(documents) {
    if (!documents || documents.length === 0) {
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].info("Document Ingestion: No documents to split.");
        return [];
    }
    const nodeParser = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$node$2d$parser$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SentenceSplitter"]({
        chunkSize: 512,
        chunkOverlap: 100
    });
    const nodes = nodeParser.getNodesFromDocuments(documents);
    __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].info({
        numDocuments: documents.length,
        numNodes: nodes.length
    }, "Document Ingestion: Documents split into nodes.");
    return nodes;
}
}}),
"[project]/apps/web/features/document/document-embedding.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "generateEmbeddings": (()=>generateEmbeddings)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/lib/logger.ts [app-route] (ecmascript)"); // --- 3. Generate Embeddings Function (from assistant/utils/embed.text.ts) ---
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$openai$40$5$2e$10$2e$1_ws$40$8$2e$18$2e$3_zod$40$3$2e$25$2e$76$2f$node_modules$2f$openai$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/openai@5.10.1_ws@8.18.3_zod@3.25.76/node_modules/openai/index.mjs [app-route] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$openai$40$5$2e$10$2e$1_ws$40$8$2e$18$2e$3_zod$40$3$2e$25$2e$76$2f$node_modules$2f$openai$2f$client$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__OpenAI__as__default$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/openai@5.10.1_ws@8.18.3_zod@3.25.76/node_modules/openai/client.mjs [app-route] (ecmascript) <export OpenAI as default>");
;
;
// Initialize OpenAI client - ensure OPENAI_API_KEY is in .env
const openai = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$openai$40$5$2e$10$2e$1_ws$40$8$2e$18$2e$3_zod$40$3$2e$25$2e$76$2f$node_modules$2f$openai$2f$client$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__OpenAI__as__default$3e$__["default"](); // API key is read from process.env.OPENAI_API_KEY by default
async function generateEmbeddings({ nodeTexts, fileKey }) {
    if (!process.env.OPENAI_API_KEY) {
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].error({
            fileKey
        }, "Document Ingestion: OPENAI_API_KEY is not set. Cannot proceed with embedding.");
        return null;
    }
    if (nodeTexts.length === 0) {
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].info({
            fileKey
        }, "Document Ingestion: No text nodes to embed.");
        return [];
    }
    __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].info({
        fileKey,
        numToEmbed: nodeTexts.length
    }, "Document Ingestion: Starting batch embedding with OpenAI API.");
    try {
        const embeddingResponse = await openai.embeddings.create({
            model: "text-embedding-3-small",
            input: nodeTexts
        });
        const embeddings = embeddingResponse.data.map((item)=>item.embedding);
        if (embeddings.length !== nodeTexts.length) {
            __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].error({
                fileKey,
                expected: nodeTexts.length,
                received: embeddings.length
            }, "Document Ingestion: Mismatch in number of embeddings received from OpenAI.");
            return null;
        }
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].info({
            fileKey,
            numEmbedded: embeddings.length
        }, "Document Ingestion: OpenAI API embedding complete.");
        return embeddings;
    } catch (error) {
        if (error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$openai$40$5$2e$10$2e$1_ws$40$8$2e$18$2e$3_zod$40$3$2e$25$2e$76$2f$node_modules$2f$openai$2f$client$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__OpenAI__as__default$3e$__["default"].APIError) {
            __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].error({
                fileKey,
                errorName: error.name,
                statusCode: error.status,
                errorMessage: error.message,
                errorHeaders: error.headers
            }, "Document Ingestion: OpenAI API error during embedding.");
        } else if (error instanceof Error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].error({
                error: {
                    message: error.message,
                    name: error.name,
                    stack: error.stack
                },
                fileKey
            }, "Document Ingestion: Error during embedding generation.");
        } else {
            __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].error({
                error,
                fileKey
            }, "Document Ingestion: An unknown error occurred during embedding generation.");
        }
        return null;
    }
}
}}),
"[project]/apps/web/features/document/document-relevance.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "checkCourseProvided": (()=>checkCourseProvided),
    "checkDocumentRelevance": (()=>checkDocumentRelevance)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/lib/logger.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$llamaindex$2d$imports$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/apps/web/lib/llamaindex-imports.ts [app-route] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$google$40$0$2e$3$2e$14_$40$llamaindex$2b$core$40$0$2e$6$2e$15_$40$llamaindex$2b$env$40$0$2e$1$2e$30$2f$node_modules$2f40$llamaindex$2f$google$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+google@0.3.14_@llamaindex+core@0.6.15_@llamaindex+env@0.1.30/node_modules/@llamaindex/google/dist/index.js [app-route] (ecmascript) <locals>");
;
;
// Simple check for obvious placeholder text
async function checkForNonsensicalContent(content) {
    // Only check for the most obvious cases of placeholder text
    const placeholderPatterns = [
        {
            pattern: /lorem\s+ipsum/i,
            reason: 'Lorem ipsum placeholder text'
        },
        {
            pattern: /\b(test\s+content|example\s+text|placeholder\s+text|dummy\s+text|sample\s+text)\b/i,
            reason: 'Test/example content'
        }
    ];
    for (const { pattern, reason } of placeholderPatterns){
        if (pattern.test(content)) {
            return {
                isNonsensical: true,
                reason: `Detected ${reason}`,
                confidence: 'high'
            };
        }
    }
    // Content seems legitimate
    return {
        isNonsensical: false,
        reason: '',
        confidence: 'high'
    };
}
const gemini = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$google$40$0$2e$3$2e$14_$40$llamaindex$2b$core$40$0$2e$6$2e$15_$40$llamaindex$2b$env$40$0$2e$1$2e$30$2f$node_modules$2f40$llamaindex$2f$google$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Gemini"]({
    model: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$google$40$0$2e$3$2e$14_$40$llamaindex$2b$core$40$0$2e$6$2e$15_$40$llamaindex$2b$env$40$0$2e$1$2e$30$2f$node_modules$2f40$llamaindex$2f$google$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["GEMINI_MODEL"].GEMINI_PRO_FLASH_LATEST
});
async function checkDocumentRelevance(courseCode, courseTitle, fileName, documentContent) {
    try {
        if (!process.env.GOOGLE_API_KEY) {
            __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].warn("GOOGLE_API_KEY not set, skipping relevance check");
            return true; // Default to allowing documents if Gemini isn't available
        }
        // Limit content length to avoid token limits
        const contentPreview = documentContent.substring(0, 2000);
        // First, check for nonsensical or placeholder content
        const nonsensicalCheck = await checkForNonsensicalContent(contentPreview);
        if (nonsensicalCheck.isNonsensical) {
            __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].info({
                courseCode,
                fileName,
                reason: nonsensicalCheck.reason,
                confidence: nonsensicalCheck.confidence
            }, "Document rejected - detected nonsensical or placeholder content");
            return false;
        }
        const prompt = `You are evaluating if a document is relevant to a college course.

Course: ${courseCode} - ${courseTitle}
Document Name: ${fileName}
Document Content Preview: ${contentPreview}

Analyze this document and determine if it is relevant and appropriate for the course "${courseCode} - ${courseTitle}".

First, verify that the content appears to be legitimate text and not placeholder or nonsensical content. Specifically check if:
1. The text contains complete sentences and coherent thoughts
2. The vocabulary is appropriate for an academic context
3. There are no obvious placeholders or test patterns

Then evaluate if the content is relevant to the course by considering:
1. Does the subject matter align with the course topic?
2. Is this the type of material that would be used in an academic setting?

Reject the document if:
- It contains obvious placeholder text (e.g., lorem ipsum, "test content")
- The text is completely incoherent or appears randomly generated
- It's clearly not related to any academic subject

Respond with only "true" if the document is relevant and appropriate, or "false" if it should be rejected.`;
        const response = await gemini.chat({
            messages: [
                {
                    role: 'user',
                    content: prompt
                }
            ]
        });
        // Handle the response content safely
        let responseText = '';
        if (Array.isArray(response.message.content)) {
            const textContent = response.message.content.find((content)=>'type' in content && content.type === 'text');
            responseText = textContent?.text || '';
        } else {
            responseText = response.message.content || '';
        }
        const isRelevant = responseText.trim().toLowerCase() === 'true';
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].info({
            courseCode,
            courseTitle,
            fileName,
            geminiResponse: responseText.trim(),
            isRelevant
        }, "Document relevance check completed");
        return isRelevant;
    } catch (error) {
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].error({
            error,
            courseCode,
            courseTitle,
            fileName
        }, "Error in document relevance check, defaulting to allow");
        return true; // Default to allowing documents if check fails
    }
}
async function checkCourseProvided(courseCode, courseTitle, fileName, documentContent) {
    try {
        if (!process.env.GOOGLE_API_KEY) {
            __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].warn("GOOGLE_API_KEY not set, skipping relevance check");
            return true; // Default to allowing documents if Gemini isn't available
        }
        // Limit content length to avoid token limits
        const contentPreview = documentContent.substring(0, 2000);
        const prompt = `You are evaluating if a document is relevant to a college course.

Course: ${courseCode} - ${courseTitle}
Document Name: ${fileName}
Document Content Preview: ${contentPreview}

- Does the content contain official course materials such as syllabus, assignments, exams, or lab instruction (if so respond true)?
- Is it students' own work such as lecture notes, lab reports, or student projects(if so respond false)?

Respond with only "true" or "false" (no explanation needed).`;
        const response = await gemini.chat({
            messages: [
                {
                    role: 'user',
                    content: prompt
                }
            ]
        });
        // Handle the response content safely
        let responseText = '';
        if (Array.isArray(response.message.content)) {
            const textContent = response.message.content.find((content)=>'type' in content && content.type === 'text');
            responseText = textContent?.text || '';
        } else {
            responseText = response.message.content || '';
        }
        const isProvided = responseText.trim().toLowerCase() === 'true';
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].info({
            courseCode,
            courseTitle,
            fileName,
            geminiResponse: responseText.trim(),
            isProvided
        }, "Document relevance check completed");
        return isProvided;
    } catch (error) {
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].error({
            error,
            courseCode,
            courseTitle,
            fileName
        }, "Error in document relevance check, defaulting to allow");
        return true; // Default to allowing documents if check fails
    }
}
}}),
"[project]/apps/web/features/document/sanitize-text.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "sanitizeText": (()=>sanitizeText),
    "sanitizeTextArray": (()=>sanitizeTextArray)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/lib/logger.ts [app-route] (ecmascript)");
;
function sanitizeText(text, context) {
    if (!text || typeof text !== 'string') {
        return '';
    }
    const originalLength = text.length;
    // Remove null bytes and problematic control characters
    // Keep newlines (\n, \r), tabs (\t), and other whitespace
    let sanitized = text// Remove null bytes (the main culprit)
    .replace(/\u0000/g, '')// Remove other control characters except newlines and tabs
    .replace(/[\u0001-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')// Handle common PDF extraction artifacts
    .replace(/\uFFFD/g, '') // Unicode replacement character
    .replace(/[\uE000-\uF8FF]/g, '') // Private use area characters
    // Normalize excessive whitespace but preserve paragraph breaks
    .replace(/[ \t]+/g, ' ') // Multiple spaces/tabs to single space
    .replace(/\n\s*\n\s*\n/g, '\n\n') // Multiple newlines to double newline
    .trim();
    // Log if significant sanitization occurred
    const removedChars = originalLength - sanitized.length;
    if (removedChars > 0) {
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].info({
            context,
            originalLength,
            sanitizedLength: sanitized.length,
            removedChars
        }, "Text sanitization: Removed problematic characters");
    }
    return sanitized;
}
function sanitizeTextArray(texts, context) {
    return texts.map((text, index)=>sanitizeText(text, context ? `${context}[${index}]` : undefined));
}
}}),
"[project]/apps/web/features/document/document-ingestion.service.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "ingestDocument": (()=>ingestDocument)
});
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$fs$2f$promises__$5b$external$5d$__$28$fs$2f$promises$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/fs/promises [external] (fs/promises, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$os__$5b$external$5d$__$28$os$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/os [external] (os, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/crypto [external] (crypto, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/lib/logger.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$services$2f$database$2f$supabase$2e$service$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/lib/services/database/supabase.service.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$features$2f$document$2f$extract$2d$document$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/features/document/extract-document.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$features$2f$document$2f$split$2d$document$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/features/document/split-document.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$features$2f$document$2f$document$2d$embedding$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/features/document/document-embedding.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$features$2f$document$2f$document$2d$relevance$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/features/document/document-relevance.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$services$2f$file$2f$index$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/apps/web/lib/services/file/index.ts [app-route] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$services$2f$file$2f$uploadthing$2d$cleanup$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/lib/services/file/uploadthing-cleanup.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$features$2f$document$2f$sanitize$2d$text$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/features/document/sanitize-text.ts [app-route] (ecmascript)");
;
;
;
;
;
;
;
;
;
;
;
;
async function ingestDocument({ fileKey, fileName, fileUrl, fileType, courseId }) {
    __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].info({
        fileKey,
        fileName,
        fileUrl,
        courseId
    }, "Starting document ingestion");
    // Check for required API keys
    if (!process.env.OPENAI_API_KEY) {
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].error({
            fileKey,
            fileName
        }, "Document Ingestion Service: OPENAI_API_KEY is not set. Cannot proceed.");
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$services$2f$file$2f$uploadthing$2d$cleanup$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cleanupFailedIngestion"])(fileKey, "Missing OPENAI_API_KEY");
        return false;
    }
    // Temp file path for where the temp download will be stored
    const tempDir = __TURBOPACK__imported__module__$5b$externals$5d2f$os__$5b$external$5d$__$28$os$2c$__cjs$29$__["default"].tmpdir();
    const tempFilePath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(tempDir, `${fileKey}_${Date.now()}_${fileName}`);
    let fileHash = null;
    try {
        // This service uses the service role... makes sense
        const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$services$2f$database$2f$supabase$2e$service$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createServiceRoleClient"])();
        // Download binary to make a hash for later duplicate prevention
        // TODO : make this its own function in a new file 'verify-document.ts'
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].info({
            fileKey,
            fileUrl,
            tempFilePath
        }, "Document Ingestion: Downloading file.");
        const response = await fetch(fileUrl);
        if (!response.ok || !response.body) {
            __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].error({
                fileKey,
                fileName,
                fileUrl,
                status: response.status
            }, "Document Ingestion: Failed to download file or empty response body.");
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$services$2f$file$2f$uploadthing$2d$cleanup$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cleanupFailedIngestion"])(fileKey, `Failed to download file: ${response.statusText}`);
            throw new Error(`Failed to download file: ${response.statusText}`);
        }
        const fileBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(fileBuffer);
        fileHash = __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["default"].createHash("sha256").update(buffer).digest("hex");
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].info({
            fileKey,
            fileName,
            fileHash
        }, "Document Ingestion: Generated file hash.");
        const { data: existingDoc, error: hashCheckError } = await supabase.from("docs").select("id, file_name").eq("course_id", courseId).eq("file_hash", fileHash).single();
        if (hashCheckError && hashCheckError.code !== "PGRST116") {
            __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].error({
                error: hashCheckError,
                fileKey,
                fileName,
                fileHash
            }, "Document Ingestion: Error checking for duplicate hash.");
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$services$2f$file$2f$uploadthing$2d$cleanup$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cleanupFailedIngestion"])(fileKey, "Error checking for duplicate hash");
            return false;
        } else if (existingDoc) {
            __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].info({
                fileKey,
                fileName,
                existingFileName: existingDoc.file_name,
                fileHash
            }, "Document Ingestion: File with identical content already exists in this course. Skipping ingestion to prevent duplicate content.");
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$services$2f$file$2f$uploadthing$2d$cleanup$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cleanupFailedIngestion"])(fileKey, "Duplicate content detected");
            return false;
        }
        await __TURBOPACK__imported__module__$5b$externals$5d2f$fs$2f$promises__$5b$external$5d$__$28$fs$2f$promises$2c$__cjs$29$__["default"].writeFile(tempFilePath, buffer);
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].info({
            fileKey,
            tempFilePath
        }, "Document Ingestion: File downloaded successfully.");
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].info({
            fileKey,
            tempFilePath
        }, "Document Ingestion: Extracting document content...");
        // Extract documents for content analysis
        const documents = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$features$2f$document$2f$extract$2d$document$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["extractDocument"])(tempFilePath);
        if (!documents || documents.length === 0) {
            __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].warn({
                fileKey,
                fileName,
                tempFilePath
            }, "Document Ingestion: No content extracted or document empty. Skipping further processing.");
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$services$2f$file$2f$uploadthing$2d$cleanup$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cleanupFailedIngestion"])(fileKey, "No content extracted or document empty");
            return false;
        }
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].info({
            fileKey,
            tempFilePath
        }, "Document Ingestion: Document content extracted successfully");
        // Sanitize extracted document text to remove problematic Unicode characters
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].info({
            fileKey,
            fileName
        }, "Document Ingestion: Sanitizing extracted text content...");
        documents.forEach((doc, index)=>{
            doc.text = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$features$2f$document$2f$sanitize$2d$text$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sanitizeText"])(doc.text, `${fileName}-doc-${index}`);
        });
        // Get course information for relevance check.
        const { data: course, error: courseError } = await supabase.from("courses").select("code, title").eq("id", courseId).single();
        if (courseError || !course) {
            __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].warn({
                error: courseError,
                courseId,
                fileKey
            }, "Document Ingestion: Could not fetch course information, proceeding without relevance check.");
        } else {
            // Check document relevance using Gemini (text already sanitized)
            const documentText = documents.map((doc)=>doc.text).join("\n\n").substring(0, 3000);
            const isRelevant = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$features$2f$document$2f$document$2d$relevance$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["checkDocumentRelevance"])(course.code || "", course.title || "", fileName, documentText);
            if (!isRelevant) {
                __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].info({
                    fileKey,
                    fileName,
                    courseCode: course.code,
                    courseTitle: course.title
                }, "Document Ingestion: Document deemed not relevant to course by Gemini. Skipping ingestion.");
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$services$2f$file$2f$uploadthing$2d$cleanup$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cleanupFailedIngestion"])(fileKey, "Document not relevant to course");
                return false;
            }
            __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].info({
                fileKey,
                fileName,
                courseCode: course.code,
                courseTitle: course.title
            }, "Document Ingestion: Document confirmed as relevant to course.");
        }
        // Check if document is course-provided (must be done after relevance check)
        const documentText = documents.map((doc)=>doc.text).join("\n\n").substring(0, 3000);
        const isProvided = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$features$2f$document$2f$document$2d$relevance$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["checkCourseProvided"])(course?.code, course?.title, fileName, documentText);
        // Create document record in database with hash (only after passing relevance check)
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].info({
            fileKey,
            fileName
        }, "Document Ingestion: Creating document record in database.");
        const { data: doc, error: docError } = await supabase.from("docs").insert({
            file_name: fileName,
            file_type: fileType,
            file_url: fileUrl,
            course_id: courseId,
            file_hash: fileHash,
            course_provided: isProvided
        }).select("id").single();
        if (docError) {
            __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].error({
                error: docError,
                fileKey,
                fileName
            }, "Document Ingestion: Could not create document in database.");
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$services$2f$file$2f$uploadthing$2d$cleanup$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cleanupFailedIngestion"])(fileKey, "Could not create document in database");
            return false;
        }
        const docId = doc.id;
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].info({
            docId,
            fileKey,
            fileName,
            fileHash
        }, "Document Ingestion: Document created in database.");
        // Split documents into nodes
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].info({
            fileKey,
            fileName
        }, "Splitting document into nodes...");
        const nodes = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$features$2f$document$2f$split$2d$document$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["splitDocumentsToNodes"])(documents);
        // Generate embeddings
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].info("Generating embeddings...");
        const nodeTexts = nodes.map((node)=>node.text);
        const embeddings = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$features$2f$document$2f$document$2d$embedding$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["generateEmbeddings"])({
            nodeTexts,
            fileKey
        });
        if (!embeddings) {
            __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].error({
                fileKey,
                fileName
            }, "Document Ingestion: Failed to generate embeddings. Aborting Supabase insert.");
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$services$2f$file$2f$uploadthing$2d$cleanup$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cleanupFailedIngestion"])(fileKey, "Failed to generate embeddings");
            return false;
        }
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].info({
            fileKey,
            fileName
        }, "Embeddings generated successfully");
        // Insert chunks with sanitized content
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].info({
            fileKey,
            fileName
        }, "Inserting chunks into database...");
        const chunksToInsert = nodes.map((node, index)=>({
                doc_id: docId,
                content: (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$features$2f$document$2f$sanitize$2d$text$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sanitizeText"])(node.text, `${fileName}-chunk-${index}`),
                embedding: embeddings[index],
                chunk_count: index
            }));
        const { error: insertError } = await supabase.from("chunks").insert(chunksToInsert);
        if (insertError) {
            __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].error({
                fileKey,
                fileName,
                dbError: insertError.message,
                dbDetails: insertError.details
            }, "Document Ingestion: Error inserting chunks into Supabase.");
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$services$2f$file$2f$uploadthing$2d$cleanup$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cleanupFailedIngestion"])(fileKey, "Error inserting chunks into database");
            return false;
        }
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].info({
            fileKey,
            fileName,
            numInserted: chunksToInsert.length
        }, "Document Ingestion: Chunks inserted into Supabase successfully.");
        return true;
    } catch (error) {
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].error({
            error,
            tempFilePath,
            fileKey,
            fileName
        }, "Document Ingestion: Error during ingestion pipeline.");
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$services$2f$file$2f$uploadthing$2d$cleanup$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cleanupFailedIngestion"])(fileKey, "Unexpected error during ingestion pipeline");
        return false;
    } finally{
        // Cleanup
        try {
            if (await __TURBOPACK__imported__module__$5b$externals$5d2f$fs$2f$promises__$5b$external$5d$__$28$fs$2f$promises$2c$__cjs$29$__["default"].stat(tempFilePath).catch(()=>false)) {
                await __TURBOPACK__imported__module__$5b$externals$5d2f$fs$2f$promises__$5b$external$5d$__$28$fs$2f$promises$2c$__cjs$29$__["default"].unlink(tempFilePath);
                __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].info({
                    tempFilePath,
                    fileKey
                }, "Document Ingestion: Temporary file deleted.");
            }
        } catch (cleanupError) {
            __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$logger$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].error({
                cleanupError,
                tempFilePath,
                fileKey,
                fileName
            }, "Document Ingestion: Error deleting temporary file.");
        }
    }
}
}}),

};

//# sourceMappingURL=apps_web_features_document_177a1cfe._.js.map