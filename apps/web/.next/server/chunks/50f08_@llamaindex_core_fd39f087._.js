module.exports = {

"[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/global/dist/index.js [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "CallbackManager": (()=>CallbackManager),
    "DEFAULT_BASE_URL": (()=>DEFAULT_BASE_URL),
    "DEFAULT_CHUNK_OVERLAP": (()=>DEFAULT_CHUNK_OVERLAP),
    "DEFAULT_CHUNK_OVERLAP_RATIO": (()=>DEFAULT_CHUNK_OVERLAP_RATIO),
    "DEFAULT_CHUNK_SIZE": (()=>DEFAULT_CHUNK_SIZE),
    "DEFAULT_COLLECTION": (()=>DEFAULT_COLLECTION),
    "DEFAULT_CONTEXT_WINDOW": (()=>DEFAULT_CONTEXT_WINDOW),
    "DEFAULT_DOC_STORE_PERSIST_FILENAME": (()=>DEFAULT_DOC_STORE_PERSIST_FILENAME),
    "DEFAULT_EU_BASE_URL": (()=>DEFAULT_EU_BASE_URL),
    "DEFAULT_GRAPH_STORE_PERSIST_FILENAME": (()=>DEFAULT_GRAPH_STORE_PERSIST_FILENAME),
    "DEFAULT_INDEX_STORE_PERSIST_FILENAME": (()=>DEFAULT_INDEX_STORE_PERSIST_FILENAME),
    "DEFAULT_NAMESPACE": (()=>DEFAULT_NAMESPACE),
    "DEFAULT_NUM_OUTPUTS": (()=>DEFAULT_NUM_OUTPUTS),
    "DEFAULT_PADDING": (()=>DEFAULT_PADDING),
    "DEFAULT_PERSIST_DIR": (()=>DEFAULT_PERSIST_DIR),
    "DEFAULT_PROJECT_NAME": (()=>DEFAULT_PROJECT_NAME),
    "DEFAULT_VECTOR_STORE_PERSIST_FILENAME": (()=>DEFAULT_VECTOR_STORE_PERSIST_FILENAME),
    "EventCaller": (()=>EventCaller),
    "Settings": (()=>Settings),
    "getEventCaller": (()=>getEventCaller),
    "withEventCaller": (()=>withEventCaller)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$env$40$0$2e$1$2e$30$2f$node_modules$2f40$llamaindex$2f$env$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+env@0.1.30/node_modules/@llamaindex/env/dist/index.js [app-route] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__$3c$export__default__as__path$3e$__ = __turbopack_context__.i("[externals]/node:path [external] (node:path, cjs) <export default as path>");
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$async_hooks__$5b$external$5d$__$28$node$3a$async_hooks$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:async_hooks [external] (node:async_hooks, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:crypto [external] (node:crypto, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$env$40$0$2e$1$2e$30$2f$node_modules$2f40$llamaindex$2f$env$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+env@0.1.30/node_modules/@llamaindex/env/dist/index.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$env$40$0$2e$1$2e$30$2f$node_modules$2f40$llamaindex$2f$env$2f$tokenizers$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+env@0.1.30/node_modules/@llamaindex/env/tokenizers/dist/index.js [app-route] (ecmascript)");
;
;
//#region llm
const DEFAULT_CONTEXT_WINDOW = 3900;
const DEFAULT_NUM_OUTPUTS = 256;
const DEFAULT_CHUNK_SIZE = 1024;
const DEFAULT_CHUNK_OVERLAP = 20;
const DEFAULT_CHUNK_OVERLAP_RATIO = 0.1;
const DEFAULT_PADDING = 5;
//#endregion
//#region storage
const DEFAULT_COLLECTION = "data";
const DEFAULT_PERSIST_DIR = __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__$3c$export__default__as__path$3e$__["path"].join("./storage");
const DEFAULT_INDEX_STORE_PERSIST_FILENAME = "index_store.json";
const DEFAULT_DOC_STORE_PERSIST_FILENAME = "doc_store.json";
const DEFAULT_VECTOR_STORE_PERSIST_FILENAME = "vector_store.json";
const DEFAULT_GRAPH_STORE_PERSIST_FILENAME = "graph_store.json";
const DEFAULT_NAMESPACE = "docstore";
//#endregion
//#region llama cloud
const DEFAULT_PROJECT_NAME = "Default";
const DEFAULT_BASE_URL = "https://api.cloud.llamaindex.ai";
const DEFAULT_EU_BASE_URL = "https://api.cloud.eu.llamaindex.ai"; //#endregion
const eventReasonAsyncLocalStorage = new __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$async_hooks__$5b$external$5d$__$28$node$3a$async_hooks$2c$__cjs$29$__["AsyncLocalStorage"]();
/**
 * EventCaller is used to track the caller of an event.
 */ class EventCaller {
    constructor(caller, parent){
        this.caller = caller;
        this.parent = parent;
        this.id = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["randomUUID"])();
        this.#computedCallers = null;
    }
    #computedCallers;
    get computedCallers() {
        if (this.#computedCallers != null) {
            return this.#computedCallers;
        }
        const callers = [
            this.caller
        ];
        let parent = this.parent;
        while(parent != null){
            callers.push(parent.caller);
            parent = parent.parent;
        }
        this.#computedCallers = callers;
        return callers;
    }
    static create(caller, parent) {
        return new EventCaller(caller, parent);
    }
}
function getEventCaller() {
    return eventReasonAsyncLocalStorage.getStore() ?? null;
}
/**
 * @param caller who is calling this function, pass in `this` if it's a class method
 * @param fn
 */ function withEventCaller(caller, fn) {
    // create a chain of event callers
    const parentCaller = getEventCaller();
    return eventReasonAsyncLocalStorage.run(EventCaller.create(caller, parentCaller), fn);
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
class LlamaIndexCustomEvent extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$env$40$0$2e$1$2e$30$2f$node_modules$2f40$llamaindex$2f$env$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["CustomEvent"] {
    constructor(event, options){
        super(event, options), this.reason = null;
        this.reason = options?.reason ?? null;
    }
    static fromEvent(type, detail) {
        return new LlamaIndexCustomEvent(type, {
            detail: detail,
            reason: getEventCaller()
        });
    }
}
class CallbackManager {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    #handlers;
    on(event, handler) {
        if (!this.#handlers.has(event)) {
            this.#handlers.set(event, []);
        }
        this.#handlers.get(event).push(handler);
        return this;
    }
    off(event, handler) {
        if (!this.#handlers.has(event)) {
            return this;
        }
        const cbs = this.#handlers.get(event);
        const index = cbs.indexOf(handler);
        if (index > -1) {
            cbs.splice(index, 1);
        }
        return this;
    }
    dispatchEvent(event, detail, sync = false) {
        const cbs = this.#handlers.get(event);
        if (!cbs) {
            return;
        }
        if (typeof queueMicrotask === "undefined") {
            console.warn("queueMicrotask is not available, dispatching synchronously");
            sync = true;
        }
        if (sync) {
            cbs.forEach((handler)=>handler(LlamaIndexCustomEvent.fromEvent(event, {
                    ...detail
                })));
        } else {
            queueMicrotask(()=>{
                cbs.forEach((handler)=>handler(LlamaIndexCustomEvent.fromEvent(event, {
                        ...detail
                    })));
            });
        }
    }
    constructor(){
        this.#handlers = new Map();
    }
}
const globalCallbackManager = new CallbackManager();
const callbackManagerAsyncLocalStorage = new __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$async_hooks__$5b$external$5d$__$28$node$3a$async_hooks$2c$__cjs$29$__["AsyncLocalStorage"]();
let currentCallbackManager = globalCallbackManager;
function getCallbackManager() {
    return callbackManagerAsyncLocalStorage.getStore() ?? currentCallbackManager;
}
function setCallbackManager(callbackManager1) {
    currentCallbackManager = callbackManager1;
}
function withCallbackManager(callbackManager1, fn) {
    return callbackManagerAsyncLocalStorage.run(callbackManager1, fn);
}
const chunkSizeAsyncLocalStorage$1 = new __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$async_hooks__$5b$external$5d$__$28$node$3a$async_hooks$2c$__cjs$29$__["AsyncLocalStorage"]();
let globalChunkSize = 1024;
function getChunkSize() {
    return chunkSizeAsyncLocalStorage$1.getStore() ?? globalChunkSize;
}
function setChunkSize(chunkSize1) {
    if (chunkSize1 !== undefined) {
        globalChunkSize = chunkSize1;
    }
}
function withChunkSize(embeddedModel, fn) {
    return chunkSizeAsyncLocalStorage$1.run(embeddedModel, fn);
}
const embeddedModelAsyncLocalStorage = new __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$async_hooks__$5b$external$5d$__$28$node$3a$async_hooks$2c$__cjs$29$__["AsyncLocalStorage"]();
let globalEmbeddedModel = null;
function getEmbeddedModel() {
    const currentEmbeddedModel = embeddedModelAsyncLocalStorage.getStore() ?? globalEmbeddedModel;
    if (!currentEmbeddedModel) {
        throw new Error("Cannot find Embedding, please set `Settings.embedModel = ...` on the top of your code. Check https://ts.llamaindex.ai/docs/llamaindex/modules/models/embeddings for details.");
    }
    return currentEmbeddedModel;
}
function setEmbeddedModel(embeddedModel) {
    globalEmbeddedModel = embeddedModel;
}
function withEmbeddedModel(embeddedModel, fn) {
    return embeddedModelAsyncLocalStorage.run(embeddedModel, fn);
}
const llmAsyncLocalStorage = new __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$async_hooks__$5b$external$5d$__$28$node$3a$async_hooks$2c$__cjs$29$__["AsyncLocalStorage"]();
let globalLLM;
function getLLM() {
    const currentLLM = llmAsyncLocalStorage.getStore() ?? globalLLM;
    if (!currentLLM) {
        throw new Error("Cannot find LLM, please set `Settings.llm = ...` on the top of your code. Check https://ts.llamaindex.ai/docs/llamaindex/modules/models/llms for details.");
    }
    return currentLLM;
}
function setLLM(llm1) {
    globalLLM = llm1;
}
function withLLM(llm1, fn) {
    return llmAsyncLocalStorage.run(llm1, fn);
}
const chunkSizeAsyncLocalStorage = new __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$async_hooks__$5b$external$5d$__$28$node$3a$async_hooks$2c$__cjs$29$__["AsyncLocalStorage"]();
let globalTokenizer = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$env$40$0$2e$1$2e$30$2f$node_modules$2f40$llamaindex$2f$env$2f$tokenizers$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["tokenizers"].tokenizer();
function getTokenizer() {
    return chunkSizeAsyncLocalStorage.getStore() ?? globalTokenizer;
}
function setTokenizer(tokenizer1) {
    if (tokenizer1 !== undefined) {
        globalTokenizer = tokenizer1;
    }
}
function withTokenizer(tokenizer1, fn) {
    return chunkSizeAsyncLocalStorage.run(tokenizer1, fn);
}
const Settings = {
    get llm () {
        return getLLM();
    },
    set llm (llm){
        setLLM(llm);
    },
    withLLM (llm1, fn) {
        return withLLM(llm1, fn);
    },
    get embedModel () {
        return getEmbeddedModel();
    },
    set embedModel (embedModel){
        setEmbeddedModel(embedModel);
    },
    withEmbedModel (embedModel1, fn) {
        return withEmbeddedModel(embedModel1, fn);
    },
    get tokenizer () {
        return getTokenizer();
    },
    set tokenizer (tokenizer){
        setTokenizer(tokenizer);
    },
    withTokenizer (tokenizer1, fn) {
        return withTokenizer(tokenizer1, fn);
    },
    get chunkSize () {
        return getChunkSize();
    },
    set chunkSize (chunkSize){
        setChunkSize(chunkSize);
    },
    withChunkSize (chunkSize1, fn) {
        return withChunkSize(chunkSize1, fn);
    },
    get callbackManager () {
        return getCallbackManager();
    },
    set callbackManager (callbackManager){
        setCallbackManager(callbackManager);
    },
    withCallbackManager (callbackManager1, fn) {
        return withCallbackManager(callbackManager1, fn);
    },
    get debug () {
        let debug = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$env$40$0$2e$1$2e$30$2f$node_modules$2f40$llamaindex$2f$env$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["getEnv"])("DEBUG");
        if ("TURBOPACK compile-time falsy", 0) {
            "TURBOPACK unreachable";
        }
        return Boolean(debug) && debug?.includes("llamaindex") || debug === "*" || debug === "true";
    }
};
;
}}),
"[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/utils/dist/index.js [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "base64ToBlob": (()=>base64ToBlob),
    "base64ToUint8Array": (()=>base64ToUint8Array),
    "blobToDataUrl": (()=>blobToDataUrl),
    "extractDataUrlComponents": (()=>extractDataUrlComponents),
    "extractImage": (()=>extractImage),
    "extractSingleText": (()=>extractSingleText),
    "extractText": (()=>extractText),
    "getMimeTypeFromDataUrl": (()=>getMimeTypeFromDataUrl),
    "imageToDataUrl": (()=>imageToDataUrl),
    "isAsyncIterable": (()=>isAsyncIterable),
    "isIterable": (()=>isIterable),
    "isPromise": (()=>isPromise),
    "messagesToHistory": (()=>messagesToHistory),
    "objectEntries": (()=>objectEntries),
    "prettifyError": (()=>prettifyError),
    "streamCallbacks": (()=>streamCallbacks),
    "streamConverter": (()=>streamConverter),
    "streamReducer": (()=>streamReducer),
    "stringifyJSONToMessageContent": (()=>stringifyJSONToMessageContent),
    "toToolDescriptions": (()=>toToolDescriptions),
    "uint8ArrayToBase64": (()=>uint8ArrayToBase64)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$env$40$0$2e$1$2e$30$2f$node_modules$2f40$llamaindex$2f$env$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+env@0.1.30/node_modules/@llamaindex/env/dist/index.js [app-route] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs$2f$promises__$5b$external$5d$__$28$node$3a$fs$2f$promises$2c$__cjs$29$__$3c$export__default__as__fs$3e$__ = __turbopack_context__.i("[externals]/node:fs/promises [external] (node:fs/promises, cjs) <export default as fs>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$magic$2d$bytes$2e$js$40$1$2e$12$2e$1$2f$node_modules$2f$magic$2d$bytes$2e$js$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/magic-bytes.js@1.12.1/node_modules/magic-bytes.js/dist/index.js [app-route] (ecmascript)");
;
;
/**
 * Converts a base64 string (without data: prefix) to a Uint8Array
 * @param base64 - The base64 string without data: prefix
 * @returns The Uint8Array
 */ function base64ToUint8Array(base64) {
    // Decode Base64 string
    const binaryString = atob(base64);
    // Convert binary string to Uint8Array
    const bytes = new Uint8Array(binaryString.length);
    for(let i = 0; i < binaryString.length; i++){
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
}
/**
 * Converts a Uint8Array to a base64 string.
 * @param uint8Array The Uint8Array to convert.
 * @returns The base64-encoded string.
 */ function uint8ArrayToBase64(uint8Array) {
    let binary = "";
    for(let i = 0; i < uint8Array.byteLength; i++){
        // Asserts that the value is not undefined, for `noUncheckedIndexedAccess`
        binary += String.fromCharCode(uint8Array[i]);
    }
    return btoa(binary);
}
/**
 * Extracts the MIME type from a data URL.
 * @param dataUrl The data URL string.
 * @returns The MIME type from the data URL.
 * @throws An error if the data URL is malformed.
 */ function getMimeTypeFromDataUrl(dataUrl) {
    if (!dataUrl.startsWith("data:")) {
        throw new Error("Not a data URL");
    }
    const commaIndex = dataUrl.indexOf(",");
    if (commaIndex === -1) {
        throw new Error("Invalid data URL format");
    }
    const header = dataUrl.slice(0, commaIndex);
    const semicolonIndex = header.indexOf(";base64");
    if (semicolonIndex === -1) {
        throw new Error("Invalid data URL format: missing base64 encoding");
    }
    return header.slice(5, semicolonIndex);
}
/**
 * Convert base64 data to Blob
 * @param base64 - The base64 string
 * @param mimeType - The MIME type of the file
 * @returns The Blob
 */ function base64ToBlob(base64, mimeType) {
    let extractedMimeType = mimeType;
    let base64Data = base64;
    // Extract mimeType from data URL if not provided
    if (!mimeType && base64.startsWith("data:")) {
        extractedMimeType = getMimeTypeFromDataUrl(base64);
        base64Data = base64.slice(base64.indexOf(",") + 1);
    } else if (!mimeType) {
        throw new Error("No MIME type provided and base64 is not in data URL format");
    } else {
        // Extract base64 data from data URL if present
        const commaIndex = base64.indexOf(",");
        base64Data = commaIndex !== -1 ? base64.slice(commaIndex + 1) : base64;
    }
    if (!extractedMimeType) {
        throw new Error("No MIME type found in base64 data");
    }
    // convert base64 to Uint8Array
    const bytes = base64ToUint8Array(base64Data);
    // Create Blob
    return new Blob([
        bytes
    ], {
        type: extractedMimeType
    });
}
async function blobToDataUrl(input) {
    const arrayBuffer = await input.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    const mimes = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$magic$2d$bytes$2e$js$40$1$2e$12$2e$1$2f$node_modules$2f$magic$2d$bytes$2e$js$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["filetypemime"])(uint8Array);
    if (mimes.length < 1) {
        throw new Error("Unsupported image type");
    }
    const base64 = uint8ArrayToBase64(uint8Array);
    return `data:${mimes[0]};base64,${base64}`;
}
/**
 * Extracts just the text whether from
 *  a multi-modal message
 *  a single text message
 *  or a query
 *
 * @param message The message to extract text from.
 * @returns The extracted text
 */ function extractText(message) {
    if (typeof message === "object" && "query" in message) {
        return extractText(message.query);
    }
    if (typeof message !== "string" && !Array.isArray(message)) {
        console.warn("extractText called with non-MessageContent message, this is likely a bug.");
        return `${message}`;
    } else if (typeof message !== "string" && Array.isArray(message)) {
        // message is of type MessageContentDetail[] - retrieve just the text parts and concatenate them
        // so we can pass them to the context generator
        return message.filter((c)=>c.type === "text").map((c)=>c.text).join("\n\n");
    } else {
        return message;
    }
}
/**
 * Extracts a single text from a multi-modal message content
 *
 * @param message The message to extract images from.
 * @returns The extracted images
 */ function extractSingleText(message) {
    if (message.type === "text") {
        return message.text;
    }
    return null;
}
/**
 * Extracts an image from a multi-modal message content
 *
 * @param message The message to extract images from.
 * @returns The extracted images
 */ function extractImage(message) {
    if (message.type === "image_url") {
        return new URL(message.image_url.url);
    }
    return null;
}
const extractDataUrlComponents = (dataUrl)=>{
    const parts = dataUrl.split(";base64,");
    if (parts.length !== 2 || !parts[0].startsWith("data:")) {
        throw new Error("Invalid data URL");
    }
    const mimeType = parts[0].slice(5);
    const base64 = parts[1];
    return {
        mimeType,
        base64
    };
};
function messagesToHistory(messages) {
    return messages.reduce((acc, message)=>{
        acc += acc ? "\n" : "";
        if (message.role === "user") {
            acc += `Human: ${message.content}`;
        } else {
            acc += `Assistant: ${message.content}`;
        }
        return acc;
    }, "");
}
function toToolDescriptions(tools) {
    const toolsObj = tools.reduce((acc, tool)=>{
        acc[tool.name] = tool.description;
        return acc;
    }, {});
    return JSON.stringify(toolsObj, null, 4);
}
async function imageToDataUrl(input) {
    // first ensure, that the input is a Blob
    if (input instanceof URL && input.protocol === "file:" || typeof input === "string") {
        // string or file URL
        const dataBuffer = await __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs$2f$promises__$5b$external$5d$__$28$node$3a$fs$2f$promises$2c$__cjs$29$__$3c$export__default__as__fs$3e$__["fs"].readFile(input instanceof URL ? input.pathname : input);
        input = new Blob([
            dataBuffer
        ]);
    } else if (!(input instanceof Blob)) {
        if (input instanceof URL) {
            throw new Error(`Unsupported URL with protocol: ${input.protocol}`);
        } else if (input instanceof Uint8Array) {
            input = new Blob([
                input
            ]); // convert Uint8Array to Blob
        } else {
            throw new Error(`Unsupported input type: ${typeof input}`);
        }
    }
    return await blobToDataUrl(input);
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
/**
 * Type safe version of `Object.entries`
 */ // eslint-disable-next-line @typescript-eslint/no-explicit-any
function objectEntries(obj) {
    return Object.entries(obj);
}
async function* streamConverter(stream, converter) {
    for await (const data of stream){
        const newData = converter(data);
        if (newData === null) {
            return;
        }
        yield newData;
    }
}
const isPromise = (obj)=>{
    return obj != null && typeof obj === "object" && "then" in obj;
};
const isAsyncIterable = (obj)=>{
    return obj != null && typeof obj === "object" && Symbol.asyncIterator in obj;
};
const isIterable = (obj)=>{
    return obj != null && typeof obj === "object" && Symbol.iterator in obj;
};
async function* streamCallbacks(stream, callbacks) {
    let value;
    for await (value of stream){
        yield value;
    }
    if (callbacks.finished) {
        callbacks.finished(value);
    }
}
async function* streamReducer(params) {
    let value = params.initialValue;
    for await (const data of params.stream){
        value = params.reducer(value, data);
        yield data;
    }
    if (params.finished) {
        params.finished(value);
    }
}
/**
 * Prettify an error for AI to read
 */ function prettifyError(error) {
    if (error instanceof Error) {
        return `Error(${error.name}): ${error.message}`;
    } else {
        return `${error}`;
    }
}
function stringifyJSONToMessageContent(value) {
    return JSON.stringify(value, null, 2).replace(/"([^"]*)"/g, "$1");
}
;
}}),
"[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/decorator/dist/index.js [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "lazyInitHash": (()=>lazyInitHash),
    "wrapEventCaller": (()=>wrapEventCaller),
    "wrapLLMEvent": (()=>wrapLLMEvent)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$env$40$0$2e$1$2e$30$2f$node_modules$2f40$llamaindex$2f$env$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+env@0.1.30/node_modules/@llamaindex/env/dist/index.js [app-route] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$async_hooks__$5b$external$5d$__$28$node$3a$async_hooks$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:async_hooks [external] (node:async_hooks, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:crypto [external] (node:crypto, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/global/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$utils$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/utils/dist/index.js [app-route] (ecmascript)");
;
;
;
function wrapEventCaller(originalMethod, context) {
    const name = context.name;
    context.addInitializer(function() {
        // @ts-expect-error - this is a valid assignment
        const fn = this[name].bind(this);
        // @ts-expect-error - this is a valid assignment
        this[name] = (...args)=>{
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["withEventCaller"])(this, ()=>fn(...args));
        };
    });
    return function(...args) {
        const result = originalMethod.call(this, ...args);
        // patch for iterators because AsyncLocalStorage doesn't work with them
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$utils$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isAsyncIterable"])(result)) {
            const iter = result[Symbol.asyncIterator]();
            const snapshot = __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$async_hooks__$5b$external$5d$__$28$node$3a$async_hooks$2c$__cjs$29$__["AsyncLocalStorage"].snapshot();
            return async function* asyncGeneratorWrapper() {
                while(true){
                    const { value, done } = await snapshot(()=>iter.next());
                    if (done) {
                        break;
                    }
                    yield value;
                }
            }();
        } else if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$utils$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isIterable"])(result)) {
            const iter = result[Symbol.iterator]();
            const snapshot = __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$async_hooks__$5b$external$5d$__$28$node$3a$async_hooks$2c$__cjs$29$__["AsyncLocalStorage"].snapshot();
            return function* generatorWrapper() {
                while(true){
                    const { value, done } = snapshot(()=>iter.next());
                    if (done) {
                        break;
                    }
                    yield value;
                }
            }();
        }
        return result;
    };
}
function lazyInitHash(value, _context) {
    return {
        get () {
            const oldValue = value.get.call(this);
            if (oldValue === "") {
                const hash = this.generateHash();
                value.set.call(this, hash);
            }
            return value.get.call(this);
        },
        set (newValue) {
            value.set.call(this, newValue);
        },
        init (value) {
            return value;
        }
    };
}
function wrapLLMEvent(originalMethod, _context) {
    return async function withLLMEvent(...params) {
        const id = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["randomUUID"])();
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Settings"].callbackManager.dispatchEvent("llm-start", {
            id,
            messages: params[0].messages
        });
        const response = await originalMethod.call(this, ...params);
        if (Symbol.asyncIterator in response) {
            // save snapshot to restore it after the response is done
            const snapshot = __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$async_hooks__$5b$external$5d$__$28$node$3a$async_hooks$2c$__cjs$29$__["AsyncLocalStorage"].snapshot();
            const originalAsyncIterator = {
                [Symbol.asyncIterator]: response[Symbol.asyncIterator].bind(response)
            };
            response[Symbol.asyncIterator] = async function*() {
                const finalResponse = {
                    raw: [],
                    message: {
                        content: "",
                        role: "assistant",
                        options: {}
                    }
                };
                let firstOne = false;
                for await (const chunk of originalAsyncIterator){
                    if (!firstOne) {
                        firstOne = true;
                        finalResponse.message.content = chunk.delta;
                    } else {
                        finalResponse.message.content += chunk.delta;
                    }
                    if (chunk.options) {
                        finalResponse.message.options = {
                            ...finalResponse.message.options,
                            ...chunk.options
                        };
                    }
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Settings"].callbackManager.dispatchEvent("llm-stream", {
                        id,
                        chunk
                    });
                    finalResponse.raw.push(chunk);
                    yield chunk;
                }
                snapshot(()=>{
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Settings"].callbackManager.dispatchEvent("llm-end", {
                        id,
                        response: finalResponse
                    });
                });
            };
        } else {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Settings"].callbackManager.dispatchEvent("llm-end", {
                id,
                response
            });
        }
        return response;
    };
}
;
}}),
"[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/schema/dist/index.js [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "BaseNode": (()=>BaseNode),
    "Document": (()=>Document),
    "EngineResponse": (()=>EngineResponse),
    "FileReader": (()=>FileReader),
    "ImageDocument": (()=>ImageDocument),
    "ImageNode": (()=>ImageNode),
    "IndexNode": (()=>IndexNode),
    "MetadataMode": (()=>MetadataMode),
    "ModalityType": (()=>ModalityType),
    "NodeRelationship": (()=>NodeRelationship),
    "ObjectType": (()=>ObjectType),
    "TextNode": (()=>TextNode),
    "TransformComponent": (()=>TransformComponent),
    "anyFunctionSchema": (()=>anyFunctionSchema),
    "baseToolSchema": (()=>baseToolSchema),
    "baseToolWithCallSchema": (()=>baseToolWithCallSchema),
    "buildNodeFromSplits": (()=>buildNodeFromSplits),
    "jsonToNode": (()=>jsonToNode),
    "sentenceSplitterSchema": (()=>sentenceSplitterSchema),
    "sentenceWindowNodeParserSchema": (()=>sentenceWindowNodeParserSchema),
    "splitNodesByType": (()=>splitNodesByType),
    "toolMetadataSchema": (()=>toolMetadataSchema)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$env$40$0$2e$1$2e$30$2f$node_modules$2f40$llamaindex$2f$env$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+env@0.1.30/node_modules/@llamaindex/env/dist/index.js [app-route] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$env$40$0$2e$1$2e$30$2f$node_modules$2f40$llamaindex$2f$env$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+env@0.1.30/node_modules/@llamaindex/env/dist/index.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:crypto [external] (node:crypto, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__$3c$export__default__as__path$3e$__ = __turbopack_context__.i("[externals]/node:path [external] (node:path, cjs) <export default as path>");
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs$2f$promises__$5b$external$5d$__$28$node$3a$fs$2f$promises$2c$__cjs$29$__$3c$export__default__as__fs$3e$__ = __turbopack_context__.i("[externals]/node:fs/promises [external] (node:fs/promises, cjs) <export default as fs>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$decorator$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/decorator/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/global/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$utils$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/utils/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zod@3.25.76/node_modules/zod/v3/external.js [app-route] (ecmascript) <export * as z>");
;
;
;
;
;
function chunkSizeCheck(contentGetter, _context) {
    return function(...args) {
        const content = contentGetter.call(this, ...args);
        const chunkSize = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Settings"].chunkSize;
        const enableChunkSizeCheck = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$env$40$0$2e$1$2e$30$2f$node_modules$2f40$llamaindex$2f$env$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["getEnv"])("ENABLE_CHUNK_SIZE_CHECK") === "true";
        if (enableChunkSizeCheck && chunkSize !== undefined && content.length > chunkSize) {
            console.warn(`Node (${this.id_}) is larger than chunk size: ${content.length} > ${chunkSize}`);
            {
                console.warn("Will truncate the content if it is larger than chunk size");
                console.warn("If you want to disable this behavior:");
                console.warn("  1. Set Settings.chunkSize = undefined");
                console.warn("  2. Set Settings.chunkSize to a larger value");
                console.warn("  3. Change the way of splitting content into smaller chunks");
            }
            return content.slice(0, chunkSize);
        }
        return content;
    };
}
function applyDecs2203RFactory() {
    function createAddInitializerMethod(initializers, decoratorFinishedRef) {
        return function addInitializer(initializer) {
            assertNotFinished(decoratorFinishedRef, "addInitializer");
            assertCallable(initializer, "An initializer");
            initializers.push(initializer);
        };
    }
    function memberDec(dec, name, desc, initializers, kind, isStatic, isPrivate, metadata, value) {
        var kindStr;
        switch(kind){
            case 1:
                kindStr = "accessor";
                break;
            case 2:
                kindStr = "method";
                break;
            case 3:
                kindStr = "getter";
                break;
            case 4:
                kindStr = "setter";
                break;
            default:
                kindStr = "field";
        }
        var ctx = {
            kind: kindStr,
            name: isPrivate ? "#" + name : name,
            static: isStatic,
            private: isPrivate,
            metadata: metadata
        };
        var decoratorFinishedRef = {
            v: false
        };
        ctx.addInitializer = createAddInitializerMethod(initializers, decoratorFinishedRef);
        var get, set;
        if (kind === 0) {
            if (isPrivate) {
                get = desc.get;
                set = desc.set;
            } else {
                get = function() {
                    return this[name];
                };
                set = function(v) {
                    this[name] = v;
                };
            }
        } else if (kind === 2) {
            get = function() {
                return desc.value;
            };
        } else {
            if (kind === 1 || kind === 3) {
                get = function() {
                    return desc.get.call(this);
                };
            }
            if (kind === 1 || kind === 4) {
                set = function(v) {
                    desc.set.call(this, v);
                };
            }
        }
        ctx.access = get && set ? {
            get: get,
            set: set
        } : get ? {
            get: get
        } : {
            set: set
        };
        try {
            return dec(value, ctx);
        } finally{
            decoratorFinishedRef.v = true;
        }
    }
    function assertNotFinished(decoratorFinishedRef, fnName) {
        if (decoratorFinishedRef.v) {
            throw new Error("attempted to call " + fnName + " after decoration was finished");
        }
    }
    function assertCallable(fn, hint) {
        if (typeof fn !== "function") {
            throw new TypeError(hint + " must be a function");
        }
    }
    function assertValidReturnValue(kind, value) {
        var type = typeof value;
        if (kind === 1) {
            if (type !== "object" || value === null) {
                throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");
            }
            if (value.get !== undefined) {
                assertCallable(value.get, "accessor.get");
            }
            if (value.set !== undefined) {
                assertCallable(value.set, "accessor.set");
            }
            if (value.init !== undefined) {
                assertCallable(value.init, "accessor.init");
            }
        } else if (type !== "function") {
            var hint;
            if (kind === 0) {
                hint = "field";
            } else if (kind === 10) {
                hint = "class";
            } else {
                hint = "method";
            }
            throw new TypeError(hint + " decorators must return a function or void 0");
        }
    }
    function applyMemberDec(ret, base, decInfo, name, kind, isStatic, isPrivate, initializers, metadata) {
        var decs = decInfo[0];
        var desc, init, value;
        if (isPrivate) {
            if (kind === 0 || kind === 1) {
                desc = {
                    get: decInfo[3],
                    set: decInfo[4]
                };
            } else if (kind === 3) {
                desc = {
                    get: decInfo[3]
                };
            } else if (kind === 4) {
                desc = {
                    set: decInfo[3]
                };
            } else {
                desc = {
                    value: decInfo[3]
                };
            }
        } else if (kind !== 0) {
            desc = Object.getOwnPropertyDescriptor(base, name);
        }
        if (kind === 1) {
            value = {
                get: desc.get,
                set: desc.set
            };
        } else if (kind === 2) {
            value = desc.value;
        } else if (kind === 3) {
            value = desc.get;
        } else if (kind === 4) {
            value = desc.set;
        }
        var newValue, get, set;
        if (typeof decs === "function") {
            newValue = memberDec(decs, name, desc, initializers, kind, isStatic, isPrivate, metadata, value);
            if (newValue !== void 0) {
                assertValidReturnValue(kind, newValue);
                if (kind === 0) {
                    init = newValue;
                } else if (kind === 1) {
                    init = newValue.init;
                    get = newValue.get || value.get;
                    set = newValue.set || value.set;
                    value = {
                        get: get,
                        set: set
                    };
                } else {
                    value = newValue;
                }
            }
        } else {
            for(var i = decs.length - 1; i >= 0; i--){
                var dec = decs[i];
                newValue = memberDec(dec, name, desc, initializers, kind, isStatic, isPrivate, metadata, value);
                if (newValue !== void 0) {
                    assertValidReturnValue(kind, newValue);
                    var newInit;
                    if (kind === 0) {
                        newInit = newValue;
                    } else if (kind === 1) {
                        newInit = newValue.init;
                        get = newValue.get || value.get;
                        set = newValue.set || value.set;
                        value = {
                            get: get,
                            set: set
                        };
                    } else {
                        value = newValue;
                    }
                    if (newInit !== void 0) {
                        if (init === void 0) {
                            init = newInit;
                        } else if (typeof init === "function") {
                            init = [
                                init,
                                newInit
                            ];
                        } else {
                            init.push(newInit);
                        }
                    }
                }
            }
        }
        if (kind === 0 || kind === 1) {
            if (init === void 0) {
                init = function(instance, init) {
                    return init;
                };
            } else if (typeof init !== "function") {
                var ownInitializers = init;
                init = function(instance, init) {
                    var value = init;
                    for(var i = 0; i < ownInitializers.length; i++){
                        value = ownInitializers[i].call(instance, value);
                    }
                    return value;
                };
            } else {
                var originalInitializer = init;
                init = function(instance, init) {
                    return originalInitializer.call(instance, init);
                };
            }
            ret.push(init);
        }
        if (kind !== 0) {
            if (kind === 1) {
                desc.get = value.get;
                desc.set = value.set;
            } else if (kind === 2) {
                desc.value = value;
            } else if (kind === 3) {
                desc.get = value;
            } else if (kind === 4) {
                desc.set = value;
            }
            if (isPrivate) {
                if (kind === 1) {
                    ret.push(function(instance, args) {
                        return value.get.call(instance, args);
                    });
                    ret.push(function(instance, args) {
                        return value.set.call(instance, args);
                    });
                } else if (kind === 2) {
                    ret.push(value);
                } else {
                    ret.push(function(instance, args) {
                        return value.call(instance, args);
                    });
                }
            } else {
                Object.defineProperty(base, name, desc);
            }
        }
    }
    function applyMemberDecs(Class, decInfos, metadata) {
        var ret = [];
        var protoInitializers;
        var staticInitializers;
        var existingProtoNonFields = new Map();
        var existingStaticNonFields = new Map();
        for(var i = 0; i < decInfos.length; i++){
            var decInfo = decInfos[i];
            if (!Array.isArray(decInfo)) continue;
            var kind = decInfo[1];
            var name = decInfo[2];
            var isPrivate = decInfo.length > 3;
            var isStatic = kind >= 5;
            var base;
            var initializers;
            if (isStatic) {
                base = Class;
                kind = kind - 5;
                staticInitializers = staticInitializers || [];
                initializers = staticInitializers;
            } else {
                base = Class.prototype;
                protoInitializers = protoInitializers || [];
                initializers = protoInitializers;
            }
            if (kind !== 0 && !isPrivate) {
                var existingNonFields = isStatic ? existingStaticNonFields : existingProtoNonFields;
                var existingKind = existingNonFields.get(name) || 0;
                if (existingKind === true || existingKind === 3 && kind !== 4 || existingKind === 4 && kind !== 3) {
                    throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: " + name);
                } else if (!existingKind && kind > 2) {
                    existingNonFields.set(name, kind);
                } else {
                    existingNonFields.set(name, true);
                }
            }
            applyMemberDec(ret, base, decInfo, name, kind, isStatic, isPrivate, initializers, metadata);
        }
        pushInitializers(ret, protoInitializers);
        pushInitializers(ret, staticInitializers);
        return ret;
    }
    function pushInitializers(ret, initializers) {
        if (initializers) {
            ret.push(function(instance) {
                for(var i = 0; i < initializers.length; i++){
                    initializers[i].call(instance);
                }
                return instance;
            });
        }
    }
    function applyClassDecs(targetClass, classDecs, metadata) {
        if (classDecs.length > 0) {
            var initializers = [];
            var newClass = targetClass;
            var name = targetClass.name;
            for(var i = classDecs.length - 1; i >= 0; i--){
                var decoratorFinishedRef = {
                    v: false
                };
                try {
                    var nextNewClass = classDecs[i](newClass, {
                        kind: "class",
                        name: name,
                        addInitializer: createAddInitializerMethod(initializers, decoratorFinishedRef),
                        metadata
                    });
                } finally{
                    decoratorFinishedRef.v = true;
                }
                if (nextNewClass !== undefined) {
                    assertValidReturnValue(10, nextNewClass);
                    newClass = nextNewClass;
                }
            }
            return [
                defineMetadata(newClass, metadata),
                function() {
                    for(var i = 0; i < initializers.length; i++){
                        initializers[i].call(newClass);
                    }
                }
            ];
        }
    }
    function defineMetadata(Class, metadata) {
        return Object.defineProperty(Class, Symbol.metadata || Symbol.for("Symbol.metadata"), {
            configurable: true,
            enumerable: true,
            value: metadata
        });
    }
    return function applyDecs2203R(targetClass, memberDecs, classDecs, parentClass) {
        if (parentClass !== void 0) {
            var parentMetadata = parentClass[Symbol.metadata || Symbol.for("Symbol.metadata")];
        }
        var metadata = Object.create(parentMetadata === void 0 ? null : parentMetadata);
        var e = applyMemberDecs(targetClass, memberDecs, metadata);
        if (!classDecs.length) defineMetadata(targetClass, metadata);
        return {
            e: e,
            get c () {
                return applyClassDecs(targetClass, classDecs, metadata);
            }
        };
    };
}
function _apply_decs_2203_r(targetClass, memberDecs, classDecs, parentClass) {
    return (_apply_decs_2203_r = applyDecs2203RFactory())(targetClass, memberDecs, classDecs, parentClass);
}
var _init_hash, _initProto, _initProto1;
var NodeRelationship = /*#__PURE__*/ function(NodeRelationship) {
    NodeRelationship["SOURCE"] = "SOURCE";
    NodeRelationship["PREVIOUS"] = "PREVIOUS";
    NodeRelationship["NEXT"] = "NEXT";
    NodeRelationship["PARENT"] = "PARENT";
    NodeRelationship["CHILD"] = "CHILD";
    return NodeRelationship;
}({});
var ObjectType = /*#__PURE__*/ function(ObjectType) {
    ObjectType["TEXT"] = "TEXT";
    ObjectType["IMAGE"] = "IMAGE";
    ObjectType["INDEX"] = "INDEX";
    ObjectType["DOCUMENT"] = "DOCUMENT";
    ObjectType["IMAGE_DOCUMENT"] = "IMAGE_DOCUMENT";
    return ObjectType;
}({});
var MetadataMode = /*#__PURE__*/ function(MetadataMode) {
    MetadataMode["ALL"] = "ALL";
    MetadataMode["EMBED"] = "EMBED";
    MetadataMode["LLM"] = "LLM";
    MetadataMode["NONE"] = "NONE";
    return MetadataMode;
}({});
/**
 * Generic abstract class for retrievable nodes
 */ class BaseNode {
    static{
        ({ e: [_init_hash, _initProto] } = _apply_decs_2203_r(this, [
            [
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$decorator$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["lazyInitHash"],
                1,
                "hash"
            ]
        ], []));
    }
    #___private_hash_1;
    get hash() {
        return this.#___private_hash_1;
    }
    set hash(_v) {
        this.#___private_hash_1 = _v;
    }
    constructor(init){
        this.#___private_hash_1 = (_initProto(this), _init_hash(this, ""));
        const { id_, metadata, excludedEmbedMetadataKeys, excludedLlmMetadataKeys, relationships, hash, embedding } = init || {};
        this.id_ = id_ ?? (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["randomUUID"])();
        this.metadata = metadata ?? {};
        this.excludedEmbedMetadataKeys = excludedEmbedMetadataKeys ?? [];
        this.excludedLlmMetadataKeys = excludedLlmMetadataKeys ?? [];
        this.relationships = relationships ?? {};
        this.embedding = embedding;
    }
    get sourceNode() {
        const relationship = this.relationships["SOURCE"];
        if (Array.isArray(relationship)) {
            throw new Error("Source object must be a single RelatedNodeInfo object");
        }
        return relationship;
    }
    get prevNode() {
        const relationship = this.relationships["PREVIOUS"];
        if (Array.isArray(relationship)) {
            throw new Error("Previous object must be a single RelatedNodeInfo object");
        }
        return relationship;
    }
    get nextNode() {
        const relationship = this.relationships["NEXT"];
        if (Array.isArray(relationship)) {
            throw new Error("Next object must be a single RelatedNodeInfo object");
        }
        return relationship;
    }
    get parentNode() {
        const relationship = this.relationships["PARENT"];
        if (Array.isArray(relationship)) {
            throw new Error("Parent object must be a single RelatedNodeInfo object");
        }
        return relationship;
    }
    get childNodes() {
        const relationship = this.relationships["CHILD"];
        if (!Array.isArray(relationship)) {
            throw new Error("Child object must be a an array of RelatedNodeInfo objects");
        }
        return relationship;
    }
    getEmbedding() {
        if (this.embedding === undefined) {
            throw new Error("Embedding not set");
        }
        return this.embedding;
    }
    asRelatedNodeInfo() {
        return {
            nodeId: this.id_,
            metadata: this.metadata,
            hash: this.hash
        };
    }
    /**
   * Called by built in JSON.stringify (see https://javascript.info/json)
   * Properties are read-only as they are not deep-cloned (not necessary for stringification).
   * @see toMutableJSON - use to return a mutable JSON instead
   */ // eslint-disable-next-line @typescript-eslint/no-explicit-any
    toJSON() {
        return {
            ...this,
            type: this.type,
            // hash is an accessor property, so it's not included in the rest operator
            hash: this.hash
        };
    }
    clone() {
        return jsonToNode(this.toMutableJSON());
    }
    /**
   * Converts the object to a JSON representation.
   * Properties can be safely modified as a deep clone of the properties are created.
   * @return {Record<string, any>} - The JSON representation of the object.
   */ // eslint-disable-next-line @typescript-eslint/no-explicit-any
    toMutableJSON() {
        return structuredClone(this.toJSON());
    }
}
/**
 * TextNode is the default node type for text. Most common node type in LlamaIndex.TS
 */ class TextNode extends BaseNode {
    static{
        ({ e: [_initProto1] } = _apply_decs_2203_r(this, [
            [
                chunkSizeCheck,
                2,
                "getContent"
            ]
        ], []));
    }
    constructor(init = {}){
        super(init), _initProto1(this);
        const { text, textTemplate, startCharIdx, endCharIdx, metadataSeparator } = init;
        this.text = text ?? "";
        this.textTemplate = textTemplate ?? "";
        if (startCharIdx) {
            this.startCharIdx = startCharIdx;
        }
        if (endCharIdx) {
            this.endCharIdx = endCharIdx;
        }
        this.metadataSeparator = metadataSeparator ?? "\n";
    }
    /**
   * Generate a hash of the text node.
   * The ID is not part of the hash as it can change independent of content.
   * @returns
   */ generateHash() {
        const hashFunction = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$env$40$0$2e$1$2e$30$2f$node_modules$2f40$llamaindex$2f$env$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createSHA256"])();
        hashFunction.update(`type=${this.type}`);
        hashFunction.update(`startCharIdx=${this.startCharIdx} endCharIdx=${this.endCharIdx}`);
        hashFunction.update(this.getContent("ALL"));
        return hashFunction.digest();
    }
    get type() {
        return "TEXT";
    }
    getContent(metadataMode = "NONE") {
        const metadataStr = this.getMetadataStr(metadataMode).trim();
        return `${metadataStr}\n\n${this.text}`.trim();
    }
    getMetadataStr(metadataMode) {
        if (metadataMode === "NONE") {
            return "";
        }
        const usableMetadataKeys = new Set(Object.keys(this.metadata).sort());
        if (metadataMode === "LLM") {
            for (const key of this.excludedLlmMetadataKeys){
                usableMetadataKeys.delete(key);
            }
        } else if (metadataMode === "EMBED") {
            for (const key of this.excludedEmbedMetadataKeys){
                usableMetadataKeys.delete(key);
            }
        }
        return [
            ...usableMetadataKeys
        ].map((key)=>`${key}: ${this.metadata[key]}`).join(this.metadataSeparator);
    }
    setContent(value) {
        this.text = value;
        this.hash = this.generateHash();
    }
    getNodeInfo() {
        return {
            start: this.startCharIdx,
            end: this.endCharIdx
        };
    }
    getText() {
        return this.getContent("NONE");
    }
}
class IndexNode extends TextNode {
    constructor(init){
        super(init);
        const { indexId } = init || {};
        this.indexId = indexId ?? "";
    }
    get type() {
        return "INDEX";
    }
}
/**
 * A document is just a special text node with a docId.
 */ class Document extends TextNode {
    constructor(init){
        super(init);
    }
    get type() {
        return "DOCUMENT";
    }
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function jsonToNode(json, type) {
    if (!json.type && !type) {
        throw new Error("Node type not found");
    }
    const nodeType = type || json.type;
    switch(nodeType){
        case "TEXT":
            return new TextNode(json);
        case "INDEX":
            return new IndexNode(json);
        case "DOCUMENT":
            return new Document(json);
        case "IMAGE_DOCUMENT":
            return new ImageDocument(json);
        case "IMAGE":
            return new ImageNode(json);
        default:
            throw new Error(`Invalid node type: ${nodeType}`);
    }
}
class ImageNode extends TextNode {
    constructor(init){
        super(init);
        const { image } = init;
        this.image = image;
    }
    get type() {
        return "IMAGE";
    }
    getUrl() {
        // id_ stores the relative path, convert it to the URL of the file
        const absPath = __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__$3c$export__default__as__path$3e$__["path"].resolve(this.id_);
        return new URL(`file://${absPath}`);
    }
    // Calculates the image part of the hash
    generateImageHash() {
        const hashFunction = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$env$40$0$2e$1$2e$30$2f$node_modules$2f40$llamaindex$2f$env$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createSHA256"])();
        if (this.image instanceof Blob) {
            // TODO: ideally we should use the blob's content to calculate the hash:
            // hashFunction.update(new Uint8Array(await this.image.arrayBuffer()));
            // as this is async, we're using the node's ID for the time being
            hashFunction.update(this.id_);
        } else if (this.image instanceof URL) {
            hashFunction.update(this.image.toString());
        } else if (typeof this.image === "string") {
            hashFunction.update(this.image);
        } else {
            throw new Error(`Unknown image type: ${typeof this.image}. Can't calculate hash`);
        }
        return hashFunction.digest();
    }
    generateHash() {
        const hashFunction = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$env$40$0$2e$1$2e$30$2f$node_modules$2f40$llamaindex$2f$env$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createSHA256"])();
        // calculates hash based on hash of both components (image and text)
        hashFunction.update(super.generateHash());
        hashFunction.update(this.generateImageHash());
        return hashFunction.digest();
    }
}
class ImageDocument extends ImageNode {
    constructor(init){
        super(init);
    }
    get type() {
        return "IMAGE_DOCUMENT";
    }
}
var ModalityType = /*#__PURE__*/ function(ModalityType) {
    ModalityType["TEXT"] = "TEXT";
    ModalityType["IMAGE"] = "IMAGE";
    ModalityType["AUDIO"] = "AUDIO";
    return ModalityType;
}({});
function splitNodesByType(nodes) {
    const result = {};
    for (const node of nodes){
        let type;
        if (node.type === "IMAGE" || node.type === "IMAGE_DOCUMENT") {
            type = "IMAGE";
        } else if (node.type === "TEXT" || node.type === "DOCUMENT" || node.type === "INDEX") {
            type = "TEXT";
        } else {
            throw new Error(`Unknown node type: ${node.type}`);
        }
        if (type in result) {
            result[type]?.push(node);
        } else {
            result[type] = [
                node
            ];
        }
    }
    return result;
}
function buildNodeFromSplits(textSplits, doc, refDoc = doc, idGenerator = ()=>(0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["randomUUID"])()) {
    const nodes = [];
    const relationships = {
        ["SOURCE"]: refDoc.asRelatedNodeInfo()
    };
    textSplits.forEach((textChunk, i)=>{
        if (doc.type === "IMAGE" || doc.type === "IMAGE_DOCUMENT") {
            const imageDoc = doc;
            const imageNode = new ImageNode({
                id_: idGenerator(i, imageDoc),
                text: textChunk,
                image: imageDoc.image,
                embedding: imageDoc.embedding,
                excludedEmbedMetadataKeys: [
                    ...imageDoc.excludedEmbedMetadataKeys
                ],
                excludedLlmMetadataKeys: [
                    ...imageDoc.excludedLlmMetadataKeys
                ],
                metadataSeparator: imageDoc.metadataSeparator,
                textTemplate: imageDoc.textTemplate,
                relationships: {
                    ...relationships
                }
            });
            nodes.push(imageNode);
        } else if (doc.type === "DOCUMENT" || doc.type === "TEXT") {
            const textDoc = doc;
            const node = new TextNode({
                id_: idGenerator(i, textDoc),
                text: textChunk,
                embedding: textDoc.embedding,
                excludedEmbedMetadataKeys: [
                    ...textDoc.excludedEmbedMetadataKeys
                ],
                excludedLlmMetadataKeys: [
                    ...textDoc.excludedLlmMetadataKeys
                ],
                metadataSeparator: textDoc.metadataSeparator,
                textTemplate: textDoc.textTemplate,
                relationships: {
                    ...relationships
                }
            });
            nodes.push(node);
        } else {
            throw new Error(`Unknown document type: ${doc.type}`);
        }
    });
    return nodes;
}
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
class TransformComponent {
    constructor(transformFn){
        Object.defineProperties(transformFn, Object.getOwnPropertyDescriptors(this.constructor.prototype));
        const transform = function transform(...args) {
            return transformFn(...args);
        };
        Reflect.setPrototypeOf(transform, new.target.prototype);
        transform.id = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["randomUUID"])();
        return transform;
    }
}
/**
 * A FileReader takes file paths and imports data into Document objects.
 */ class FileReader {
    async loadData(filePath) {
        let fileContent;
        let filename;
        // Check if filePath is a URL
        if (filePath.startsWith("http://") || filePath.startsWith("https://")) {
            // Handle URL
            const response = await fetch(filePath);
            if (!response.ok) {
                throw new Error(`Failed to fetch URL: ${filePath}, status: ${response.status}`);
            }
            const buffer = await response.arrayBuffer();
            fileContent = new Uint8Array(buffer);
            // Extract filename from URL
            const url = new URL(filePath);
            filename = __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__$3c$export__default__as__path$3e$__["path"].basename(url.pathname) || "url_document";
        } else {
            // Handle local file
            fileContent = await __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs$2f$promises__$5b$external$5d$__$28$node$3a$fs$2f$promises$2c$__cjs$29$__$3c$export__default__as__fs$3e$__["fs"].readFile(filePath);
            filename = __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__$3c$export__default__as__path$3e$__["path"].basename(filePath);
        }
        const docs = await this.loadDataAsContent(fileContent, filename);
        docs.forEach(FileReader.addMetaData(filePath));
        return docs;
    }
    static addMetaData(filePath) {
        return (doc, index)=>{
            // generate id as loadDataAsContent is only responsible for the content
            doc.id_ = `${filePath}_${index + 1}`;
            doc.metadata["file_path"] = __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__$3c$export__default__as__path$3e$__["path"].resolve(filePath);
            doc.metadata["file_name"] = __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__$3c$export__default__as__path$3e$__["path"].basename(filePath);
        };
    }
}
class EngineResponse {
    constructor(chatResponse, stream, sourceNodes){
        this.metadata = {};
        this.message = chatResponse.message;
        this.raw = chatResponse.raw;
        this.sourceNodes = sourceNodes;
        this.stream = stream;
    }
    static fromResponse(response, stream, sourceNodes) {
        return new EngineResponse(EngineResponse.toChatResponse(response), stream, sourceNodes);
    }
    static toChatResponse(response, raw = null) {
        return {
            message: {
                content: response,
                role: "assistant"
            },
            raw
        };
    }
    static fromChatResponse(chatResponse, sourceNodes) {
        return new EngineResponse(chatResponse, false, sourceNodes);
    }
    static fromChatResponseChunk(chunk, sourceNodes) {
        return new EngineResponse(EngineResponse.toChatResponse(chunk.delta, chunk.raw), true, sourceNodes);
    }
    /**
   * @deprecated Use `message` instead.
   */ get response() {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$utils$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["extractText"])(this.message.content);
    }
    get delta() {
        if (!this.stream) {
            console.warn("delta is only available for streaming responses. Consider using 'message' instead.");
        }
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$utils$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["extractText"])(this.message.content);
    }
    toString() {
        return this.response ?? "";
    }
}
const anyFunctionSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].function(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].tuple([]).rest(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].any()), __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].any());
const toolMetadataSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    description: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    name: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(),
    parameters: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].record(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].any())
});
const baseToolSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    call: anyFunctionSchema.optional(),
    metadata: toolMetadataSchema
});
const baseToolWithCallSchema = baseToolSchema.extend({
    call: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].function()
});
const sentenceSplitterSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    chunkSize: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number({
        description: "The token chunk size for each chunk."
    }).gt(0).optional().default(()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Settings"].chunkSize ?? 1024),
    chunkOverlap: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number({
        description: "The token overlap of each chunk when splitting."
    }).gte(0).optional().default(200),
    separator: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string({
        description: "Default separator for splitting into words"
    }).default(" "),
    paragraphSeparator: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string({
        description: "Separator between paragraphs."
    }).optional().default("\n\n\n"),
    secondaryChunkingRegex: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string({
        description: "Backup regex for splitting into sentences."
    }).optional().default("[^,.;。？！]+[,.;。？！]?"),
    extraAbbreviations: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string(), {
        description: "Extra abbreviations to consider while splitting into sentences. For example, for contracts, you may want to consider 'LLC.' as an important abbreviation"
    }).optional().default([])
}).refine((data)=>data.chunkOverlap < data.chunkSize, "Chunk overlap must be less than chunk size.");
const sentenceWindowNodeParserSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    windowSize: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number({
        description: "The number of sentences on each side of a sentence to capture."
    }).gt(0).default(3),
    windowMetadataKey: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string({
        description: "The metadata key to store the sentence window under."
    }).default("window"),
    originalTextMetadataKey: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string({
        description: "The metadata key to store the original sentence in."
    }).default("originalText")
});
;
}}),
"[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/node-parser/dist/index.js [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "MarkdownNodeParser": (()=>MarkdownNodeParser),
    "MetadataAwareTextSplitter": (()=>MetadataAwareTextSplitter),
    "NodeParser": (()=>NodeParser),
    "SentenceSplitter": (()=>SentenceSplitter),
    "SentenceWindowNodeParser": (()=>SentenceWindowNodeParser),
    "SimpleNodeParser": (()=>SimpleNodeParser),
    "TextSplitter": (()=>TextSplitter),
    "TokenTextSplitter": (()=>TokenTextSplitter),
    "splitByChar": (()=>splitByChar),
    "splitByPhraseRegex": (()=>splitByPhraseRegex),
    "splitByRegex": (()=>splitByRegex),
    "splitBySentenceTokenizer": (()=>splitBySentenceTokenizer),
    "splitBySep": (()=>splitBySep),
    "truncateText": (()=>truncateText)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/global/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$schema$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/schema/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$utils$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/utils/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$env$40$0$2e$1$2e$30$2f$node_modules$2f40$llamaindex$2f$env$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+env@0.1.30/node_modules/@llamaindex/env/dist/index.js [app-route] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:crypto [external] (node:crypto, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zod@3.25.76/node_modules/zod/v3/external.js [app-route] (ecmascript) <export * as z>");
;
;
;
;
;
class NodeParser extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$schema$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["TransformComponent"] {
    constructor(){
        super((nodes)=>{
            // alex: should we fix `as` type?
            return this.getNodesFromDocuments(nodes);
        }), this.includeMetadata = true, this.includePrevNextRel = true;
    }
    postProcessParsedNodes(nodes, parentDocMap) {
        nodes.forEach((node, i)=>{
            const parentDoc = parentDocMap.get(node.sourceNode?.nodeId || "");
            if (parentDoc) {
                const startCharIdx = parentDoc.text.indexOf(node.getContent(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$schema$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["MetadataMode"].NONE));
                if (startCharIdx >= 0) {
                    node.startCharIdx = startCharIdx;
                    node.endCharIdx = startCharIdx + node.getContent(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$schema$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["MetadataMode"].NONE).length;
                }
                if (this.includeMetadata && node.metadata && parentDoc.metadata) {
                    node.metadata = {
                        ...node.metadata,
                        ...parentDoc.metadata
                    };
                }
            }
            if (this.includePrevNextRel && node.sourceNode) {
                const previousNode = i > 0 ? nodes[i - 1] : null;
                const nextNode = i < nodes.length - 1 ? nodes[i + 1] : null;
                if (previousNode && previousNode.sourceNode && previousNode.sourceNode.nodeId === node.sourceNode.nodeId) {
                    node.relationships = {
                        ...node.relationships,
                        [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$schema$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NodeRelationship"].PREVIOUS]: previousNode.asRelatedNodeInfo()
                    };
                }
                if (nextNode && nextNode.sourceNode && nextNode.sourceNode.nodeId === node.sourceNode.nodeId) {
                    node.relationships = {
                        ...node.relationships,
                        [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$schema$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NodeRelationship"].NEXT]: nextNode.asRelatedNodeInfo()
                    };
                }
            }
        });
        return nodes;
    }
    getNodesFromDocuments(documents) {
        const docsId = new Map(documents.map((doc)=>[
                doc.id_,
                doc
            ]));
        const callbackManager = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Settings"].callbackManager;
        callbackManager.dispatchEvent("node-parsing-start", {
            documents
        });
        const parsedNodes = this.parseNodes(documents);
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$utils$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isPromise"])(parsedNodes)) {
            return parsedNodes.then((parsedNodes)=>{
                const nodes = this.postProcessParsedNodes(parsedNodes, docsId);
                callbackManager.dispatchEvent("node-parsing-end", {
                    nodes
                });
                return nodes;
            });
        } else {
            const nodes = this.postProcessParsedNodes(parsedNodes, docsId);
            callbackManager.dispatchEvent("node-parsing-end", {
                nodes
            });
            return nodes;
        }
    }
}
class TextSplitter extends NodeParser {
    splitTexts(texts) {
        return texts.flatMap((text)=>this.splitText(text));
    }
    parseNodes(nodes) {
        return nodes.reduce((allNodes, node)=>{
            const splits = this.splitText(node.getContent(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$schema$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["MetadataMode"].ALL));
            const nodes = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$schema$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["buildNodeFromSplits"])(splits, node);
            return allNodes.concat(nodes);
        }, []);
    }
}
class MetadataAwareTextSplitter extends TextSplitter {
    splitTextsMetadataAware(texts, metadata) {
        if (texts.length !== metadata.length) {
            throw new TypeError("`texts` and `metadata` must have the same length");
        }
        return texts.flatMap((text, i)=>this.splitTextMetadataAware(text, metadata[i]));
    }
    getMetadataString(node) {
        const embedStr = node.getMetadataStr(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$schema$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["MetadataMode"].EMBED);
        const llmStr = node.getMetadataStr(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$schema$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["MetadataMode"].LLM);
        if (embedStr.length > llmStr.length) {
            return embedStr;
        } else {
            return llmStr;
        }
    }
    parseNodes(nodes) {
        return nodes.reduce((allNodes, node)=>{
            const metadataStr = this.getMetadataString(node);
            const splits = this.splitTextMetadataAware(node.getContent(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$schema$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["MetadataMode"].NONE), metadataStr);
            return allNodes.concat((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$schema$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["buildNodeFromSplits"])(splits, node));
        }, []);
    }
}
const abbreviations = {
    english: [
        "i.e.",
        "etc.",
        "vs.",
        "Inc.",
        "A.S.A.P.",
        "Mr.",
        "Mrs.",
        "Ms.",
        "Dr.",
        "Prof.",
        "Sr.",
        "Jr.",
        "Tel.",
        "a.m.",
        "p.m.",
        "Art."
    ],
    spanish: [
        "Sr.",
        "Sres.",
        "Srs.",
        "Sra.",
        "Sras.",
        "Srta.",
        "Srtas.",
        "Dr.",
        "Drs.",
        "Dra.",
        "Dras.",
        "Prof.",
        "Profs.",
        "Profa.",
        "Profas.",
        "Ing.",
        "Lic.",
        "Arq.",
        "Ab.",
        "Abs."
    ]
};
/*
Copyright (c) 2024, Hugo W.L. ter Doest

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/ var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod)=>function __require() {
        return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = {
            exports: {}
        }).exports, mod), mod.exports;
    };
// lib/natural/tokenizers/tokenizer.js
var require_tokenizer = __commonJS({
    "lib/natural/tokenizers/tokenizer.js" (exports, module) {
        var Tokenizer = class {
            trim(array) {
                while(array[array.length - 1] === ""){
                    array.pop();
                }
                while(array[0] === ""){
                    array.shift();
                }
                return array;
            }
        };
        module.exports = Tokenizer;
    }
});
// lib/natural/tokenizers/sentence_tokenizer.js
var require_sentence_tokenizer = __commonJS({
    "lib/natural/tokenizers/sentence_tokenizer.js" (exports, module) {
        const Tokenizer = require_tokenizer();
        // Strings that will be used to create placeholders
        const NUM = "NUMBER";
        const DELIM = "DELIM";
        const URI = "URI";
        const ABBREV = "ABBREV";
        function generateUniqueCode(base, index) {
            // Surround the placeholder with {{}} to prevent shorter numbers to be recognized
            // in larger numbers
            return `{{${base}_${index}}}`;
        }
        function escapeRegExp(string) {
            return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        }
        class SentenceTokenizer extends Tokenizer {
            constructor(abbreviations, trimSentences){
                super();
                if (abbreviations) {
                    this.abbreviations = abbreviations;
                } else {
                    this.abbreviations = [];
                }
                if (trimSentences === undefined) {
                    this.trimSentences = true;
                } else {
                    this.trimSentences = trimSentences;
                }
                this.replacementMap = null;
                this.replacementCounter = 0;
            }
            replaceUrisWithPlaceholders(text) {
                const urlPattern = /(https?:\/\/\S+|www\.\S+|ftp:\/\/\S+|(mailto:)?[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}|file:\/\/\S+)/gi;
                const modifiedText = text.replace(urlPattern, (match)=>{
                    const placeholder = generateUniqueCode(URI, this.replacementCounter++);
                    this.replacementMap.set(placeholder, match);
                    return placeholder;
                });
                return modifiedText;
            }
            replaceAbbreviations(text) {
                if (this.abbreviations.length === 0) {
                    return text;
                }
                const pattern = new RegExp(`(${this.abbreviations.map((abbrev)=>escapeRegExp(abbrev)).join("|")})`, "gi");
                const replacedText = text.replace(pattern, (match)=>{
                    const code = generateUniqueCode(ABBREV, this.replacementCounter++);
                    this.replacementMap.set(code, match);
                    return code;
                });
                return replacedText;
            }
            replaceDelimitersWithPlaceholders(text) {
                // Regular expression for sentence delimiters optionally followed by a bracket or quote
                // Multiple delimiters with spaces in between are allowed
                // The expression makes sure that the sentence delimiter group ends with a sentence delimiter
                const delimiterPattern = /([.?!… ]*)([.?!…])(["'”’)}\]]?)/g;
                const modifiedText = text.replace(delimiterPattern, (match, p1, p2, p3)=>{
                    const placeholder = generateUniqueCode(DELIM, this.replacementCounter++);
                    this.delimiterMap.set(placeholder, p1 + p2 + p3);
                    return placeholder;
                });
                return modifiedText;
            }
            splitOnPlaceholders(text, placeholders) {
                if (this.delimiterMap.size === 0) {
                    return [
                        text
                    ];
                }
                const keys = Array.from(this.delimiterMap.keys());
                const pattern = new RegExp(`(${keys.map(escapeRegExp).join("|")})`);
                const parts = text.split(pattern);
                const sentences = [];
                for(let i = 0; i < parts.length; i += 2){
                    const sentence = parts[i];
                    const placeholder = parts[i + 1] || "";
                    sentences.push(sentence + placeholder);
                }
                return sentences;
            }
            replaceNumbersWithCode(text) {
                // Regular expression to match numbers, including decimal points and commas
                const numberPattern = /\b\d{1,3}(?:,\d{3})*(?:\.\d+)?\b/g;
                const replacedText = text.replace(numberPattern, (match)=>{
                    const code = generateUniqueCode(NUM, this.replacementCounter++);
                    this.replacementMap.set(code, match);
                    return code;
                });
                return replacedText;
            }
            revertReplacements(text) {
                let originalText = text;
                for (const [placeholder, replacement] of this.replacementMap.entries()){
                    const pattern = new RegExp(escapeRegExp(placeholder), "g");
                    originalText = originalText.replace(pattern, replacement);
                }
                return originalText;
            }
            revertDelimiters(text) {
                let originalText = text;
                for (const [placeholder, replacement] of this.delimiterMap.entries()){
                    const pattern = new RegExp(escapeRegExp(placeholder), "g");
                    originalText = originalText.replace(pattern, replacement);
                }
                return originalText;
            }
            tokenize(text) {
                this.replacementCounter = 0;
                this.replacementMap = /* @__PURE__ */ new Map();
                this.delimiterMap = /* @__PURE__ */ new Map();
                // Replace abbreviations
                const result1 = this.replaceAbbreviations(text);
                // Replace URIs
                const result2 = this.replaceUrisWithPlaceholders(result1);
                // Replace delimiters followed by optional quotes, brackets, and braces
                const result3 = this.replaceNumbersWithCode(result2);
                // Replace delimiters followed by optional quotes, brackets, and braces
                const result4 = this.replaceDelimitersWithPlaceholders(result3);
                // Split on placeholders for sentence delimiters
                const sentences = this.splitOnPlaceholders(result4);
                // Replace back all abbreviations, URIs, and delimiters
                const newSentences = sentences.map((s)=>{
                    const s1 = this.revertReplacements(s);
                    return this.revertDelimiters(s1);
                });
                const trimmedSentences = this.trim(newSentences);
                const trimmedSentences2 = trimmedSentences.map((sent)=>this.trimSentences ? sent.trim() : sent);
                return trimmedSentences2;
            }
        }
        module.exports = SentenceTokenizer;
    }
});
var SentenceTokenizer = require_sentence_tokenizer();
const truncateText = (text, textSplitter)=>{
    const chunks = textSplitter.splitText(text);
    return chunks[0] ?? text;
};
const splitTextKeepSeparator = (text, separator)=>{
    const parts = text.split(separator);
    const result = parts.map((part, index)=>index > 0 ? separator + part : part);
    return result.filter((s)=>s);
};
const splitBySep = (sep, keepSep = true)=>{
    if (keepSep) {
        return (text)=>splitTextKeepSeparator(text, sep);
    } else {
        return (text)=>text.split(sep);
    }
};
const splitByChar = ()=>{
    return (text)=>text.split("");
};
const splitBySentenceTokenizer = (extraAbbreviations = [], trimSentences = false)=>{
    const tokenizer = new SentenceTokenizer([
        ...abbreviations.english,
        ...abbreviations.spanish,
        // Add the extra abbreviations provided by the user, e.g. for business-specific context
        ...extraAbbreviations
    ], trimSentences);
    return (text)=>{
        try {
            return tokenizer.tokenize(text);
        } catch  {
            return [
                text
            ];
        }
    };
};
const splitByRegex = (regex)=>{
    return (text)=>text.match(new RegExp(regex, "g")) || [];
};
const splitByPhraseRegex = ()=>{
    const regex = "[^,.;]+[,.;]?";
    return splitByRegex(regex);
};
/**
 * Parse text with a preference for complete sentences.
 */ class SentenceSplitter extends MetadataAwareTextSplitter {
    #chunkingTokenizerFn;
    #splitFns;
    #subSentenceSplitFns;
    #tokenizer;
    constructor(params){
        super(), /**
   * The token chunk size for each chunk.
   */ this.chunkSize = 1024, /**
   * The token overlap of each chunk when splitting.
   */ this.chunkOverlap = 200, /**
   * Default separator for splitting into words
   */ this.separator = " ", /**
   * Separator between paragraphs.
   */ this.paragraphSeparator = "\n\n\n", /**
   * Backup regex for splitting into sentences.
   */ this.secondaryChunkingRegex = "[^,.;。？！]+[,.;。？！]?", /**
   * Extra abbreviations to consider while splitting into sentences.
   * For example, for contracts, you may want to consider "LLC." as an important abbreviation
   */ this.extraAbbreviations = [], this.#chunkingTokenizerFn = splitBySentenceTokenizer(), this.#splitFns = new Set(), this.#subSentenceSplitFns = new Set(), this.tokenSize = (text)=>this.#tokenizer.encode(text).length;
        if (params) {
            const parsedParams = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$schema$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sentenceSplitterSchema"].parse(params);
            this.chunkSize = parsedParams.chunkSize;
            this.chunkOverlap = parsedParams.chunkOverlap;
            this.separator = parsedParams.separator;
            this.paragraphSeparator = parsedParams.paragraphSeparator;
            this.secondaryChunkingRegex = parsedParams.secondaryChunkingRegex;
            this.extraAbbreviations = parsedParams.extraAbbreviations;
        }
        this.#chunkingTokenizerFn = splitBySentenceTokenizer(this.extraAbbreviations);
        this.#tokenizer = params?.tokenizer ?? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Settings"].tokenizer;
        this.#splitFns.add(splitBySep(this.paragraphSeparator));
        this.#splitFns.add(this.#chunkingTokenizerFn);
        this.#subSentenceSplitFns.add(splitByRegex(this.secondaryChunkingRegex));
        this.#subSentenceSplitFns.add(splitBySep(this.separator));
        this.#subSentenceSplitFns.add(splitByChar());
    }
    splitTextMetadataAware(text, metadata) {
        const metadataLength = this.tokenSize(metadata);
        const effectiveChunkSize = this.chunkSize - metadataLength;
        if (effectiveChunkSize <= 0) {
            throw new Error(`Metadata length (${metadataLength}) is longer than chunk size (${this.chunkSize}). Consider increasing the chunk size or decreasing the size of your metadata to avoid this.`);
        } else if (effectiveChunkSize < 50) {
            console.log(`Metadata length (${metadataLength}) is close to chunk size (${this.chunkSize}). Resulting chunks are less than 50 tokens. Consider increasing the chunk size or decreasing the size of your metadata to avoid this.`);
        }
        return this._splitText(text, effectiveChunkSize);
    }
    splitText(text) {
        return this._splitText(text, this.chunkSize);
    }
    _splitText(text, chunkSize) {
        if (text === "") return [
            text
        ];
        const callbackManager = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Settings"].callbackManager;
        callbackManager.dispatchEvent("chunking-start", {
            text: [
                text
            ]
        });
        const splits = this.#split(text, chunkSize);
        const chunks = this.#merge(splits, chunkSize);
        callbackManager.dispatchEvent("chunking-end", {
            chunks
        });
        return chunks;
    }
    *#split(text, chunkSize, tokenSize) {
        const _tokenSize = tokenSize ?? this.tokenSize(text);
        if (_tokenSize <= chunkSize) {
            yield [
                text,
                true,
                _tokenSize
            ];
            return;
        }
        const [textSplitsByFns, isSentence] = this.#getSplitsByFns(text);
        for (const textSplit of textSplitsByFns){
            const textSplitTokenSize = this.tokenSize(textSplit);
            if (textSplitTokenSize <= chunkSize) {
                yield [
                    textSplit,
                    isSentence,
                    textSplitTokenSize
                ];
            } else {
                yield* this.#split(textSplit, chunkSize, textSplitTokenSize);
            }
        }
    }
    #getSplitsByFns(text) {
        for (const splitFn of this.#splitFns){
            const splits = splitFn(text);
            if (splits.length > 1) {
                return [
                    splits,
                    true
                ];
            }
        }
        for (const splitFn of this.#subSentenceSplitFns){
            const splits = splitFn(text);
            if (splits.length > 1) {
                return [
                    splits,
                    false
                ];
            }
        }
        return [
            [
                text
            ],
            true
        ];
    }
    #merge(splits, chunkSize) {
        const chunks = [];
        let currentChunk = [];
        let lastChunk = [];
        let currentChunkLength = 0;
        let newChunk = true;
        const closeChunk = ()=>{
            chunks.push(currentChunk.map(([text])=>text).join(""));
            lastChunk = currentChunk;
            currentChunk = [];
            currentChunkLength = 0;
            newChunk = true;
            let lastIndex = lastChunk.length - 1;
            while(lastIndex >= 0 && currentChunkLength + lastChunk[lastIndex][1] <= this.chunkOverlap){
                const [text, length] = lastChunk[lastIndex];
                currentChunkLength += length;
                currentChunk.unshift([
                    text,
                    length
                ]);
                lastIndex -= 1;
            }
        };
        const splitsIterator = splits[Symbol.iterator]();
        let currentSplitResult = splitsIterator.next();
        while(!currentSplitResult.done){
            const [text, isSentence, tokenSize] = currentSplitResult.value;
            if (tokenSize > chunkSize) {
                throw new Error("Single token exceeded chunk size");
            }
            if (currentChunkLength + tokenSize > chunkSize && !newChunk) {
                closeChunk();
            } else {
                if (isSentence || currentChunkLength + tokenSize <= chunkSize || newChunk) {
                    currentChunkLength += tokenSize;
                    currentChunk.push([
                        text,
                        tokenSize
                    ]);
                    newChunk = false;
                    currentSplitResult = splitsIterator.next();
                } else {
                    closeChunk();
                }
            }
        }
        // Handle the last chunk
        if (!newChunk) {
            chunks.push(currentChunk.map(([text])=>text).join(""));
        }
        return this.#postprocessChunks(chunks);
    }
    /**
   * Remove whitespace only chunks and remove leading and trailing whitespace.
   */ #postprocessChunks(chunks) {
        const newChunks = [];
        for (const chunk of chunks){
            const trimmedChunk = chunk.trim();
            if (trimmedChunk !== "") {
                newChunks.push(trimmedChunk);
            }
        }
        return newChunks;
    }
}
class MarkdownNodeParser extends NodeParser {
    parseNodes(nodes, showProgress) {
        return nodes.reduce((allNodes, node)=>{
            const markdownNodes = this.getNodesFromNode(node);
            return allNodes.concat(markdownNodes);
        }, []);
    }
    getNodesFromNode(node) {
        const text = node.getContent(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$schema$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["MetadataMode"].NONE);
        const markdownNodes = [];
        const lines = text.split("\n");
        let metadata = {};
        let codeBlock = false;
        let currentSection = "";
        for (const line of lines){
            if (line.trim().startsWith("```")) {
                codeBlock = !codeBlock;
            }
            const headerMatch = /^(#+)\s(.*)/.exec(line);
            if (headerMatch && !codeBlock) {
                if (currentSection !== "") {
                    markdownNodes.push(this.buildNodeFromSplit(currentSection.trim(), node, metadata));
                }
                metadata = this.updateMetadata(metadata, headerMatch[2], headerMatch[1].trim().length);
                currentSection = `${headerMatch[2]}\n`;
            } else {
                currentSection += line + "\n";
            }
        }
        if (currentSection !== "") {
            markdownNodes.push(this.buildNodeFromSplit(currentSection.trim(), node, metadata));
        }
        return markdownNodes;
    }
    updateMetadata(headersMetadata, newHeader, newHeaderLevel) {
        const updatedHeaders = {};
        for(let i = 1; i < newHeaderLevel; i++){
            const key = `Header_${i}`;
            if (key in headersMetadata) {
                updatedHeaders[key] = headersMetadata[key];
            }
        }
        updatedHeaders[`Header_${newHeaderLevel}`] = newHeader;
        return updatedHeaders;
    }
    buildNodeFromSplit(textSplit, node, metadata) {
        const newNode = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$schema$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["buildNodeFromSplits"])([
            textSplit
        ], node, undefined)[0];
        if (this.includeMetadata) {
            newNode.metadata = {
                ...newNode.metadata,
                ...metadata
            };
        }
        return newNode;
    }
}
class SentenceWindowNodeParser extends NodeParser {
    static{
        this.DEFAULT_WINDOW_SIZE = 3;
    }
    static{
        this.DEFAULT_WINDOW_METADATA_KEY = "window";
    }
    static{
        this.DEFAULT_ORIGINAL_TEXT_METADATA_KEY = "originalText";
    }
    constructor(params){
        super(), this.sentenceSplitter = splitBySentenceTokenizer([], true), this.idGenerator = ()=>(0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["randomUUID"])();
        if (params) {
            const parsedParams = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$schema$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sentenceWindowNodeParserSchema"].parse(params);
            this.windowSize = parsedParams.windowSize;
            this.windowMetadataKey = parsedParams.windowMetadataKey;
            this.originalTextMetadataKey = parsedParams.originalTextMetadataKey;
        } else {
            this.windowSize = SentenceWindowNodeParser.DEFAULT_WINDOW_SIZE;
            this.windowMetadataKey = SentenceWindowNodeParser.DEFAULT_WINDOW_METADATA_KEY;
            this.originalTextMetadataKey = SentenceWindowNodeParser.DEFAULT_ORIGINAL_TEXT_METADATA_KEY;
        }
    }
    parseNodes(nodes, showProgress) {
        return nodes.reduce((allNodes, node)=>{
            const nodes = this.buildWindowNodesFromDocuments([
                node
            ]);
            return allNodes.concat(nodes);
        }, []);
    }
    buildWindowNodesFromDocuments(documents) {
        const allNodes = [];
        for (const doc of documents){
            const text = doc.text;
            const textSplits = this.sentenceSplitter(text);
            const nodes = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$schema$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["buildNodeFromSplits"])(textSplits, doc, undefined, this.idGenerator);
            nodes.forEach((node, i)=>{
                const windowNodes = nodes.slice(Math.max(0, i - this.windowSize), Math.min(i + this.windowSize + 1, nodes.length));
                node.metadata[this.windowMetadataKey] = windowNodes.map((n)=>n.text).join(" ");
                node.metadata[this.originalTextMetadataKey] = node.text;
                node.excludedEmbedMetadataKeys.push(this.windowMetadataKey, this.originalTextMetadataKey);
                node.excludedLlmMetadataKeys.push(this.windowMetadataKey, this.originalTextMetadataKey);
            });
            allNodes.push(...nodes);
        }
        return allNodes;
    }
}
const DEFAULT_METADATA_FORMAT_LEN = 2;
const tokenTextSplitterSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    chunkSize: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().positive().default(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DEFAULT_CHUNK_SIZE"]),
    chunkOverlap: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].number().nonnegative().default(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DEFAULT_CHUNK_OVERLAP"]),
    separator: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().default(" "),
    backupSeparators: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()).default([
        "\n"
    ])
});
class TokenTextSplitter extends MetadataAwareTextSplitter {
    #tokenizer;
    #splitFns;
    constructor(params){
        super(), this.chunkSize = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DEFAULT_CHUNK_SIZE"], this.chunkOverlap = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DEFAULT_CHUNK_OVERLAP"], this.separator = " ", this.backupSeparators = [
            "\n"
        ], this.#splitFns = [];
        if (params) {
            const parsedParams = tokenTextSplitterSchema.parse(params);
            this.chunkSize = parsedParams.chunkSize;
            this.chunkOverlap = parsedParams.chunkOverlap;
            this.separator = parsedParams.separator;
            this.backupSeparators = parsedParams.backupSeparators;
        }
        if (this.chunkOverlap > this.chunkSize) {
            throw new Error(`Got a larger chunk overlap (${this.chunkOverlap}) than chunk size (${this.chunkSize}), should be smaller.`);
        }
        this.#tokenizer = params?.tokenizer ?? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Settings"].tokenizer;
        const allSeparators = [
            this.separator,
            ...this.backupSeparators
        ];
        this.#splitFns = allSeparators.map((sep)=>splitBySep(sep));
        this.#splitFns.push(splitByChar());
    }
    /**
   * Split text into chunks, reserving space required for metadata string.
   * @param text The text to split.
   * @param metadata The metadata string.
   * @returns An array of text chunks.
   */ splitTextMetadataAware(text, metadata) {
        const metadataLength = this.tokenSize(metadata) + DEFAULT_METADATA_FORMAT_LEN;
        const effectiveChunkSize = this.chunkSize - metadataLength;
        if (effectiveChunkSize <= 0) {
            throw new Error(`Metadata length (${metadataLength}) is longer than chunk size (${this.chunkSize}). ` + `Consider increasing the chunk size or decreasing the size of your metadata to avoid this.`);
        } else if (effectiveChunkSize < 50) {
            console.warn(`Metadata length (${metadataLength}) is close to chunk size (${this.chunkSize}). ` + `Resulting chunks are less than 50 tokens. Consider increasing the chunk size or decreasing the size of your metadata to avoid this.`);
        }
        return this._splitText(text, effectiveChunkSize);
    }
    /**
   * Split text into chunks.
   * @param text The text to split.
   * @returns An array of text chunks.
   */ splitText(text) {
        return this._splitText(text, this.chunkSize);
    }
    /**
   * Internal method to split text into chunks up to a specified size.
   * @param text The text to split.
   * @param chunkSize The maximum size of each chunk.
   * @returns An array of text chunks.
   */ _splitText(text, chunkSize) {
        if (text === "") return [
            text
        ];
        // Dispatch chunking start event
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Settings"].callbackManager.dispatchEvent("chunking-start", {
            text: [
                text
            ]
        });
        const splits = this._split(text, chunkSize);
        const chunks = this._merge(splits, chunkSize);
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Settings"].callbackManager.dispatchEvent("chunking-end", {
            chunks
        });
        return chunks;
    }
    /**
   * Break text into splits that are smaller than the chunk size.
   * @param text The text to split.
   * @param chunkSize The maximum size of each split.
   * @returns An array of text splits.
   */ _split(text, chunkSize) {
        if (this.tokenSize(text) <= chunkSize) {
            return [
                text
            ];
        }
        for (const splitFn of this.#splitFns){
            const splits = splitFn(text);
            if (splits.length > 1) {
                const newSplits = [];
                for (const split of splits){
                    const splitLen = this.tokenSize(split);
                    if (splitLen <= chunkSize) {
                        newSplits.push(split);
                    } else {
                        newSplits.push(...this._split(split, chunkSize));
                    }
                }
                return newSplits;
            }
        }
        return [
            text
        ];
    }
    /**
   * Merge splits into chunks with overlap.
   * @param splits The array of text splits.
   * @param chunkSize The maximum size of each chunk.
   * @returns An array of merged text chunks.
   */ _merge(splits, chunkSize) {
        const chunks = [];
        let currentChunk = [];
        let currentLength = 0;
        for (const split of splits){
            const splitLength = this.tokenSize(split);
            if (splitLength > chunkSize) {
                console.warn(`Got a split of size ${splitLength}, larger than chunk size ${chunkSize}.`);
            }
            if (currentLength + splitLength > chunkSize) {
                const chunk = currentChunk.join("").trim();
                if (chunk) {
                    chunks.push(chunk);
                }
                currentChunk = [];
                currentLength = 0;
                const overlapTokens = this.chunkOverlap;
                const overlapSplits = [];
                let overlapLength = 0;
                while(overlapSplits.length < splits.length && overlapLength < overlapTokens){
                    const overlapSplit = currentChunk.shift();
                    if (!overlapSplit) break;
                    overlapSplits.push(overlapSplit);
                    overlapLength += this.tokenSize(overlapSplit);
                }
                for (const overlapSplit of overlapSplits.reverse()){
                    currentChunk.push(overlapSplit);
                    currentLength += this.tokenSize(overlapSplit);
                    if (currentLength >= overlapTokens) break;
                }
            }
            currentChunk.push(split);
            currentLength += splitLength;
        }
        const finalChunk = currentChunk.join("").trim();
        if (finalChunk) {
            chunks.push(finalChunk);
        }
        return chunks;
    }
    /**
   * Calculate the number of tokens in the text using the tokenizer.
   * @param text The text to tokenize.
   * @returns The number of tokens.
   */ tokenSize(text) {
        return this.#tokenizer.encode(text).length;
    }
}
/**
 * @deprecated Use `SentenceSplitter` instead
 */ const SimpleNodeParser = SentenceSplitter;
;
}}),
"[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/prompts/dist/index.js [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "BasePromptTemplate": (()=>BasePromptTemplate),
    "PromptMixin": (()=>PromptMixin),
    "PromptTemplate": (()=>PromptTemplate),
    "anthropicSummaryPrompt": (()=>anthropicSummaryPrompt),
    "anthropicTextQaPrompt": (()=>anthropicTextQaPrompt),
    "defaultChoiceSelectPrompt": (()=>defaultChoiceSelectPrompt),
    "defaultCondenseQuestionPrompt": (()=>defaultCondenseQuestionPrompt),
    "defaultContextSystemPrompt": (()=>defaultContextSystemPrompt),
    "defaultKeywordExtractPrompt": (()=>defaultKeywordExtractPrompt),
    "defaultNodeTextTemplate": (()=>defaultNodeTextTemplate),
    "defaultQueryKeywordExtractPrompt": (()=>defaultQueryKeywordExtractPrompt),
    "defaultQuestionExtractPrompt": (()=>defaultQuestionExtractPrompt),
    "defaultRefinePrompt": (()=>defaultRefinePrompt),
    "defaultSubQuestionPrompt": (()=>defaultSubQuestionPrompt),
    "defaultSummaryPrompt": (()=>defaultSummaryPrompt),
    "defaultTextQAPrompt": (()=>defaultTextQAPrompt),
    "defaultTitleCombinePromptTemplate": (()=>defaultTitleCombinePromptTemplate),
    "defaultTitleExtractorPromptTemplate": (()=>defaultTitleExtractorPromptTemplate),
    "defaultTreeSummarizePrompt": (()=>defaultTreeSummarizePrompt)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$utils$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/utils/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zod@3.25.76/node_modules/zod/v3/external.js [app-route] (ecmascript) <export * as z>");
'use strict';
;
;
/**
 * MIT License
 *
 * Copyright (c) 2019 jhonararipe
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */ function formatImpl(...args_) {
    // Create variables
    let self = this;
    const __patterns__ = self.match(/({.*?})/g);
    const { REF, FILL_CHAR, MASK_NUMBER, ALIGN_OP, CROP_SIZE, FRACTION, TYPE_VAR } = {
        REF: 1,
        FILL_CHAR: 2,
        MASK_NUMBER: 3,
        ALIGN_OP: 4,
        CROP_SIZE: 5,
        FRACTION: 7,
        TYPE_VAR: 8
    };
    const DEFAULT_PLACE = 6;
    const ALL_REGEXP = /{(\w+)?:([^>\^<\d#]|0)?([#%,])?([>^<\.])?(\d+)?(\.)?(\d+)?([eEfFgGdxXobn#%])?}/g;
    const regExpBasic = /{\[?(\w+)\]?}/; // it's not best solution
    const isObject = typeof args_[0] === "object";
    // types/use logic
    __patterns__?.map((pattern, patt_index)=>{
        const kargs = ALL_REGEXP.exec(pattern) || ALL_REGEXP.exec(pattern);
        const wargs = regExpBasic.exec(pattern);
        // Insert values (one 2 one / array / object)
        const INDEX_VAR = (wargs ? wargs[REF] : kargs ? kargs[REF] : patt_index) || patt_index;
        // @ts-expect-error
        const NATUAL_VALUE = isObject ? args_[0][INDEX_VAR] : args_[INDEX_VAR];
        // @ts-expect-error
        let ACTUAL_VALUE = isObject ? args_[0][INDEX_VAR] : args_[INDEX_VAR];
        // Verify sintax/semantic
        if (ACTUAL_VALUE === null || ACTUAL_VALUE === undefined) throw new Error(`Replacement index ${INDEX_VAR} out of range for positional args tuple`);
        if (kargs) {
            // If TYPE_VAR is not defined and the first argument is a number, pad a string should from left, so set TYPE_VAR to "d"
            if (kargs[TYPE_VAR] === undefined && typeof ACTUAL_VALUE === "number") {
                kargs[TYPE_VAR] = "d";
            }
            const LETTER = (!kargs[FILL_CHAR] ? false : !kargs[ALIGN_OP] && [
                ..."FfbefoxXn"
            ].includes(kargs[FILL_CHAR].toLowerCase()) ? kargs[FILL_CHAR] : kargs[TYPE_VAR]) || kargs[TYPE_VAR];
            //  padronaze
            if (LETTER) {
                const floatSize = pattern.includes(".") ? Number(kargs[FRACTION] || kargs[CROP_SIZE]) : DEFAULT_PLACE;
                switch(LETTER){
                    case "E":
                        ACTUAL_VALUE = ACTUAL_VALUE.toExponential(DEFAULT_PLACE).toUpperCase();
                        break;
                    case "e":
                        ACTUAL_VALUE = ACTUAL_VALUE.toExponential(DEFAULT_PLACE);
                        break;
                    case "X":
                        ACTUAL_VALUE = ACTUAL_VALUE.toString(16).toUpperCase();
                        break;
                    case "x":
                        ACTUAL_VALUE = ACTUAL_VALUE.toString(16); // Hexadecimal
                        break;
                    case "b":
                        ACTUAL_VALUE = ACTUAL_VALUE.toString(2); // Binary
                        break;
                    case "f":
                    case "F":
                        ACTUAL_VALUE = ACTUAL_VALUE.toFixed(floatSize);
                        break;
                    case "o":
                        ACTUAL_VALUE = ACTUAL_VALUE.toString(8); // Octal
                        break;
                }
                //  mask
                switch(kargs[MASK_NUMBER]){
                    case "#":
                        const MASK = {
                            x: "0x",
                            X: "0X",
                            o: "0o",
                            b: "0b"
                        }[LETTER];
                        ACTUAL_VALUE = MASK + ACTUAL_VALUE;
                        break;
                }
            }
            // signal
            if ([
                ..." +-,%"
            ].includes(kargs[FILL_CHAR]) && typeof NATUAL_VALUE === "number") {
                ACTUAL_VALUE = ACTUAL_VALUE.toString().replace("-", "");
                if (NATUAL_VALUE >= 0) switch(kargs[FILL_CHAR]){
                    case "+":
                        ACTUAL_VALUE = "+" + ACTUAL_VALUE;
                        break;
                    case " ":
                        ACTUAL_VALUE = " " + ACTUAL_VALUE;
                        break;
                    case ",":
                        ACTUAL_VALUE = NATUAL_VALUE.toString().split(/(?=(?:...)*$)/).join(kargs[FILL_CHAR]);
                        break;
                    case "%":
                        ACTUAL_VALUE = (NATUAL_VALUE * 100).toFixed(kargs[FRACTION] || DEFAULT_PLACE) + "%";
                        break;
                }
                else ACTUAL_VALUE = "-" + ACTUAL_VALUE;
            }
            // space / order / trim
            if (kargs[CROP_SIZE]) {
                ACTUAL_VALUE = ACTUAL_VALUE.toString();
                const FILL_ELEMENT = kargs[FILL_CHAR] || " ";
                const SIZE_STRING = ACTUAL_VALUE.length;
                const SIZE_ARG = kargs[CROP_SIZE];
                const FILL_LENGTH = SIZE_STRING > SIZE_ARG ? SIZE_STRING : SIZE_ARG;
                const FILL = FILL_ELEMENT.repeat(FILL_LENGTH);
                switch(kargs[ALIGN_OP] || kargs[FILL_CHAR]){
                    case "<":
                        ACTUAL_VALUE = ACTUAL_VALUE.padEnd(FILL_LENGTH, FILL_ELEMENT);
                        break;
                    case ".":
                        if (!(LETTER && /[fF]/.test(LETTER))) ACTUAL_VALUE = ACTUAL_VALUE.slice(0, SIZE_ARG);
                        break;
                    case ">":
                        ACTUAL_VALUE = ACTUAL_VALUE.padStart(FILL_LENGTH, FILL_ELEMENT);
                        break;
                    case "^":
                        const length_start = Math.floor((FILL_LENGTH - SIZE_STRING) / 2);
                        const string_start = length_start > 0 ? FILL_ELEMENT.repeat(length_start) + ACTUAL_VALUE : ACTUAL_VALUE;
                        ACTUAL_VALUE = FILL.replace(RegExp(`.{${string_start.length}}`), string_start);
                        break;
                    default:
                        ACTUAL_VALUE = LETTER ? ACTUAL_VALUE.padStart(FILL_LENGTH, FILL_ELEMENT) : ACTUAL_VALUE.padEnd(FILL_LENGTH, FILL_ELEMENT);
                        break;
                }
            }
        }
        // SET Definitive value
        self = self.replace(pattern, ACTUAL_VALUE);
    });
    return self;
}
const format = (inputString, ...param)=>formatImpl.apply(inputString, param);
const promptType = {
    SUMMARY: "summary",
    TREE_INSERT: "insert",
    TREE_SELECT: "tree_select",
    TREE_SELECT_MULTIPLE: "tree_select_multiple",
    QUESTION_ANSWER: "text_qa",
    REFINE: "refine",
    KEYWORD_EXTRACT: "keyword_extract",
    QUERY_KEYWORD_EXTRACT: "query_keyword_extract",
    SCHEMA_EXTRACT: "schema_extract",
    TEXT_TO_SQL: "text_to_sql",
    TEXT_TO_GRAPH_QUERY: "text_to_graph_query",
    TABLE_CONTEXT: "table_context",
    KNOWLEDGE_TRIPLET_EXTRACT: "knowledge_triplet_extract",
    SIMPLE_INPUT: "simple_input",
    PANDAS: "pandas",
    JSON_PATH: "json_path",
    SINGLE_SELECT: "single_select",
    MULTI_SELECT: "multi_select",
    VECTOR_STORE_QUERY: "vector_store_query",
    SUB_QUESTION: "sub_question",
    SQL_RESPONSE_SYNTHESIS: "sql_response_synthesis",
    SQL_RESPONSE_SYNTHESIS_V2: "sql_response_synthesis_v2",
    CONVERSATION: "conversation",
    DECOMPOSE: "decompose",
    CHOICE_SELECT: "choice_select",
    CUSTOM: "custom",
    RANKGPT_RERANK: "rankgpt_rerank"
};
const promptTypeSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
    promptType.SUMMARY,
    promptType.TREE_INSERT,
    promptType.TREE_SELECT,
    promptType.TREE_SELECT_MULTIPLE,
    promptType.QUESTION_ANSWER,
    promptType.REFINE,
    promptType.KEYWORD_EXTRACT,
    promptType.QUERY_KEYWORD_EXTRACT,
    promptType.SCHEMA_EXTRACT,
    promptType.TEXT_TO_SQL,
    promptType.TEXT_TO_GRAPH_QUERY,
    promptType.TABLE_CONTEXT,
    promptType.KNOWLEDGE_TRIPLET_EXTRACT,
    promptType.SIMPLE_INPUT,
    promptType.PANDAS,
    promptType.JSON_PATH,
    promptType.SINGLE_SELECT,
    promptType.MULTI_SELECT,
    promptType.VECTOR_STORE_QUERY,
    promptType.SUB_QUESTION,
    promptType.SQL_RESPONSE_SYNTHESIS,
    promptType.SQL_RESPONSE_SYNTHESIS_V2,
    promptType.CONVERSATION,
    promptType.DECOMPOSE,
    promptType.CHOICE_SELECT,
    promptType.CUSTOM,
    promptType.RANKGPT_RERANK
]);
const PromptType = promptTypeSchema.enum;
class BasePromptTemplate {
    constructor(options){
        this.metadata = {};
        /**
   * Set of template variables used in the prompt template. Used for type hints only.
   * To get the list of template variables used in the prompt at run-time, use the `vars` method.
   */ this.templateVars = new Set();
        this.options = {};
        this.templateVarMappings = {};
        this.functionMappings = {};
        const { metadata, templateVars, outputParser, templateVarMappings, functionMappings } = options;
        if (metadata) {
            this.metadata = metadata;
        }
        if (templateVars) {
            this.templateVars = new Set(templateVars);
        }
        if (options.options) {
            this.options = options.options;
        }
        this.outputParser = outputParser;
        if (templateVarMappings) {
            this.templateVarMappings = templateVarMappings;
        }
        if (functionMappings) {
            this.functionMappings = functionMappings;
        }
    }
    mapTemplateVars(options) {
        const templateVarMappings = this.templateVarMappings;
        return Object.fromEntries((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$utils$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["objectEntries"])(options).map(([k, v])=>[
                templateVarMappings[k] || k,
                v
            ]));
    }
    mapFunctionVars(options) {
        const functionMappings = this.functionMappings;
        const newOptions = {};
        for (const [k, v] of (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$utils$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["objectEntries"])(functionMappings)){
            newOptions[k] = v(options);
        }
        for (const [k, v] of (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$utils$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["objectEntries"])(options)){
            if (!(k in newOptions)) {
                newOptions[k] = v;
            }
        }
        return newOptions;
    }
    mapAllVars(options) {
        const newOptions = this.mapFunctionVars(options);
        return this.mapTemplateVars(newOptions);
    }
}
class PromptTemplate extends BasePromptTemplate {
    #template;
    constructor(options){
        const { template, promptType, ...rest } = options;
        super(rest);
        this.#template = template;
        this.promptType = promptType ?? PromptType.custom;
    }
    partialFormat(options) {
        const prompt = new PromptTemplate({
            template: this.template,
            templateVars: [
                ...this.templateVars
            ],
            options: this.options,
            outputParser: this.outputParser,
            templateVarMappings: this.templateVarMappings,
            functionMappings: this.functionMappings,
            metadata: this.metadata,
            promptType: this.promptType
        });
        prompt.options = {
            ...prompt.options,
            ...options
        };
        return prompt;
    }
    format(options) {
        const allOptions = {
            ...this.options,
            ...options
        };
        const mappedAllOptions = this.mapAllVars(allOptions);
        const prompt = format(this.template, mappedAllOptions);
        if (this.outputParser) {
            return this.outputParser.format(prompt);
        }
        return prompt;
    }
    formatMessages(options) {
        const prompt = this.format(options);
        return [
            {
                role: "user",
                content: prompt
            }
        ];
    }
    get template() {
        return this.#template;
    }
    /**
   * Returns all the template variables used in the prompt template.
   */ vars() {
        const template = this.template;
        const matches = template.match(/\{([^}]+)\}/g) || [];
        return [
            ...new Set(matches.map((match)=>match.slice(1, -1)))
        ];
    }
}
class PromptMixin {
    validatePrompts(promptsDict, moduleDict) {
        for (const key of Object.keys(promptsDict)){
            if (key.includes(":")) {
                throw new Error(`Prompt key ${key} cannot contain ':'.`);
            }
        }
        for (const key of Object.keys(moduleDict)){
            if (key.includes(":")) {
                throw new Error(`Module key ${key} cannot contain ':'.`);
            }
        }
    }
    getPrompts() {
        const promptsDict = this._getPrompts();
        const moduleDict = this._getPromptModules();
        this.validatePrompts(promptsDict, moduleDict);
        const allPrompts = {
            ...promptsDict
        };
        for (const [module_name, prompt_module] of (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$utils$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["objectEntries"])(moduleDict)){
            for (const [key, prompt] of (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$utils$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["objectEntries"])(prompt_module.getPrompts())){
                allPrompts[`${module_name}:${key}`] = prompt;
            }
        }
        return allPrompts;
    }
    updatePrompts(prompts) {
        const promptModules = this._getPromptModules();
        this._updatePrompts(prompts);
        const subPrompt = {};
        for(const key in prompts){
            if (key.includes(":")) {
                const [moduleName, subKey] = key.split(":");
                if (!subPrompt[moduleName]) {
                    subPrompt[moduleName] = {};
                }
                subPrompt[moduleName][subKey] = prompts[key];
            }
        }
        for (const [moduleName, subPromptDict] of Object.entries(subPrompt)){
            if (!promptModules[moduleName]) {
                throw new Error(`Module ${moduleName} not found.`);
            }
            const moduleToUpdate = promptModules[moduleName];
            moduleToUpdate.updatePrompts(subPromptDict);
        }
    }
}
const defaultTextQAPrompt = new PromptTemplate({
    templateVars: [
        "context",
        "query"
    ],
    template: `Context information is below.
---------------------
{context}
---------------------
Given the context information and not prior knowledge, answer the query.
Query: {query}
Answer:`
});
const anthropicTextQaPrompt = new PromptTemplate({
    templateVars: [
        "context",
        "query"
    ],
    template: `Context information:
<context>
{context}
</context>
Given the context information and not prior knowledge, answer the query.
Query: {query}`
});
const defaultSummaryPrompt = new PromptTemplate({
    templateVars: [
        "context"
    ],
    template: `Write a summary of the following. Try to use only the information provided. Try to include as many key details as possible.


{context}


SUMMARY:"""
`
});
const anthropicSummaryPrompt = new PromptTemplate({
    templateVars: [
        "context"
    ],
    template: `Summarize the following text. Try to use only the information provided. Try to include as many key details as possible.
<original-text>
{context}
</original-text>

SUMMARY:
`
});
const defaultRefinePrompt = new PromptTemplate({
    templateVars: [
        "query",
        "existingAnswer",
        "context"
    ],
    template: `The original query is as follows: {query}
We have provided an existing answer: {existingAnswer}
We have the opportunity to refine the existing answer
(only if needed) with some more context below.
------------
{context}
------------
Given the new context, refine the original answer to better answer the query.
If the context isn't useful, return the original answer.
Refined Answer:`
});
const defaultTreeSummarizePrompt = new PromptTemplate({
    templateVars: [
        "context",
        "query"
    ],
    template: `Context information from multiple sources is below.
---------------------
{context}
---------------------
Given the information from multiple sources and not prior knowledge, answer the query.
Query: {query}
Answer:`
});
const defaultChoiceSelectPrompt = new PromptTemplate({
    templateVars: [
        "context",
        "query"
    ],
    template: `A list of documents is shown below. Each document has a number next to it along 
with a summary of the document. A question is also provided.
Respond with the numbers of the documents
you should consult to answer the question, in order of relevance, as well
as the relevance score. The relevance score is a number from 1-10 based on
how relevant you think the document is to the question.
Do not include any documents that are not relevant to the question.
Example format:
Document 1:
<summary of document 1>

Document 2:
<summary of document 2>

...

Document 10:\n<summary of document 10>

Question: <question>
Answer:
Doc: 9, Relevance: 7
Doc: 3, Relevance: 4
Doc: 7, Relevance: 3

Let's try this now:

{context}
Question: {query}
Answer:`
});
function buildToolsText(tools) {
    const toolsObj = tools.reduce((acc, tool)=>{
        acc[tool.name] = tool.description;
        return acc;
    }, {});
    return JSON.stringify(toolsObj, null, 4);
}
const exampleTools = [
    {
        name: "uber_10k",
        description: "Provides information about Uber financials for year 2021"
    },
    {
        name: "lyft_10k",
        description: "Provides information about Lyft financials for year 2021"
    }
];
const exampleQueryStr = `Compare and contrast the revenue growth and EBITDA of Uber and Lyft for year 2021`;
const exampleOutput = [
    {
        subQuestion: "What is the revenue growth of Uber",
        toolName: "uber_10k"
    },
    {
        subQuestion: "What is the EBITDA of Uber",
        toolName: "uber_10k"
    },
    {
        subQuestion: "What is the revenue growth of Lyft",
        toolName: "lyft_10k"
    },
    {
        subQuestion: "What is the EBITDA of Lyft",
        toolName: "lyft_10k"
    }
];
const defaultSubQuestionPrompt = new PromptTemplate({
    templateVars: [
        "toolsStr",
        "queryStr"
    ],
    template: `Given a user question, and a list of tools, output a list of relevant sub-questions that when composed can help answer the full user question:

# Example 1
<Tools>
\`\`\`json
${buildToolsText(exampleTools)}
\`\`\`

<User Question>
${exampleQueryStr}

<Output>
\`\`\`json
${JSON.stringify(exampleOutput, null, 4)}
\`\`\`

# Example 2
<Tools>
\`\`\`json
{toolsStr}
\`\`\`

<User Question>
{queryStr}

<Output>
`
});
const defaultCondenseQuestionPrompt = new PromptTemplate({
    templateVars: [
        "chatHistory",
        "question"
    ],
    template: `Given a conversation (between Human and Assistant) and a follow up message from Human, rewrite the message to be a standalone question that captures all relevant context from the conversation.

<Chat History>
{chatHistory}

<Follow Up Message>
{question}

<Standalone question>
`
});
const defaultContextSystemPrompt = new PromptTemplate({
    templateVars: [
        "context"
    ],
    template: `Context information is below.
---------------------
{context}
---------------------`
});
const defaultKeywordExtractPrompt = new PromptTemplate({
    templateVars: [
        "maxKeywords",
        "context"
    ],
    template: `
Some text is provided below. Given the text, extract up to {maxKeywords} keywords from the text. Avoid stopwords.
---------------------
{context}
---------------------
Provide keywords in the following comma-separated format: 'KEYWORDS: <keywords>'
`
}).partialFormat({
    maxKeywords: "10"
});
const defaultQueryKeywordExtractPrompt = new PromptTemplate({
    templateVars: [
        "maxKeywords",
        "question"
    ],
    template: `(
  "A question is provided below. Given the question, extract up to {maxKeywords} "
  "keywords from the text. Focus on extracting the keywords that we can use "
  "to best lookup answers to the question. Avoid stopwords."
  "---------------------"
  "{question}"
  "---------------------"
  "Provide keywords in the following comma-separated format: 'KEYWORDS: <keywords>'"
)`
}).partialFormat({
    maxKeywords: "10"
});
const defaultQuestionExtractPrompt = new PromptTemplate({
    templateVars: [
        "numQuestions",
        "context"
    ],
    template: `(
  "Given the contextual informations below, generate {numQuestions} questions this context can provides specific answers to which are unlikely to be found else where. Higher-level summaries of surrounding context may be provided as well. "
  "Try using these summaries to generate better questions that this context can answer."
  "---------------------"
  "{context}"
  "---------------------"
  "Provide questions in the following format: 'QUESTIONS: <questions>'"
)`
}).partialFormat({
    numQuestions: "5"
});
const defaultTitleExtractorPromptTemplate = new PromptTemplate({
    templateVars: [
        "context"
    ],
    template: `{context}
Give a title that summarizes all of the unique entities, titles or themes found in the context. 
Title: `
});
const defaultTitleCombinePromptTemplate = new PromptTemplate({
    templateVars: [
        "context"
    ],
    template: `{context} 
Based on the above candidate titles and contents, what is the comprehensive title for this document? 
Title: `
});
new PromptTemplate({
    templateVars: [
        "context",
        "numKeywords"
    ],
    template: `{context}
Give {numKeywords} unique keywords for this document. 
Format as comma separated. 
Keywords: `
}).partialFormat({
    keywordCount: "5"
});
const defaultNodeTextTemplate = new PromptTemplate({
    templateVars: [
        "metadataStr",
        "content"
    ],
    template: `[Excerpt from document]
{metadataStr}
Excerpt:
-----
{content}
-----
`
}).partialFormat({
    metadataStr: "",
    content: ""
});
;
}}),
"[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/indices/dist/index.js [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "PromptHelper": (()=>PromptHelper),
    "getBiggestPrompt": (()=>getBiggestPrompt)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/global/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$node$2d$parser$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/node-parser/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$prompts$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/prompts/dist/index.js [app-route] (ecmascript)");
;
;
;
/**
 * Get the empty prompt text given a prompt.
 */ function getEmptyPromptTxt(prompt) {
    return prompt.format(Object.fromEntries([
        ...prompt.templateVars.keys()
    ].map((key)=>[
            key,
            ""
        ])));
}
/**
 * Get biggest empty prompt size from a list of prompts.
 * Used to calculate the maximum size of inputs to the LLM.
 */ function getBiggestPrompt(prompts) {
    const emptyPromptTexts = prompts.map(getEmptyPromptTxt);
    const emptyPromptLengths = emptyPromptTexts.map((text)=>text.length);
    const maxEmptyPromptLength = Math.max(...emptyPromptLengths);
    const maxEmptyPromptIndex = emptyPromptLengths.indexOf(maxEmptyPromptLength);
    return prompts[maxEmptyPromptIndex];
}
/**
 * A collection of helper functions for working with prompts.
 */ class PromptHelper {
    constructor(options = {}){
        const { contextWindow = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DEFAULT_CONTEXT_WINDOW"], numOutput = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DEFAULT_NUM_OUTPUTS"], chunkOverlapRatio = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DEFAULT_CHUNK_OVERLAP_RATIO"], chunkSizeLimit, tokenizer, separator = " " } = options;
        this.contextWindow = contextWindow;
        this.numOutput = numOutput;
        this.chunkOverlapRatio = chunkOverlapRatio;
        this.chunkSizeLimit = chunkSizeLimit;
        this.tokenizer = tokenizer ?? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Settings"].tokenizer;
        this.separator = separator;
    }
    /**
   * Calculate the available context size based on the number of prompt tokens.
   */ #getAvailableContextSize(numPromptTokens) {
        const contextSizeTokens = this.contextWindow - numPromptTokens - this.numOutput;
        if (contextSizeTokens < 0) {
            throw new Error(`Calculated available context size ${contextSizeTokens} is not non-negative.`);
        }
        return contextSizeTokens;
    }
    /**
   * Calculate the available chunk size based on the prompt and other parameters.
   */ #getAvailableChunkSize(prompt, numChunks = 1, padding = 5) {
        let numPromptTokens = 0;
        if (prompt instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$prompts$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PromptTemplate"]) {
            numPromptTokens = this.tokenizer.encode(getEmptyPromptTxt(prompt)).length;
        }
        const availableContextSize = this.#getAvailableContextSize(numPromptTokens);
        let result = Math.floor(availableContextSize / numChunks) - padding;
        if (this.chunkSizeLimit !== undefined) {
            result = Math.min(this.chunkSizeLimit, result);
        }
        return result;
    }
    /**
   * Creates a text splitter configured to maximally pack the available context window.
   */ getTextSplitterGivenPrompt(prompt, numChunks = 1, padding = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DEFAULT_PADDING"]) {
        const chunkSize = this.#getAvailableChunkSize(prompt, numChunks, padding);
        if (chunkSize <= 0) {
            throw new TypeError(`Chunk size ${chunkSize} is not positive.`);
        }
        const chunkOverlap = Math.floor(this.chunkOverlapRatio * chunkSize);
        return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$node$2d$parser$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["TokenTextSplitter"]({
            separator: this.separator,
            chunkSize,
            chunkOverlap,
            tokenizer: this.tokenizer
        });
    }
    /**
   * Truncate text chunks to fit within the available context window.
   */ truncate(prompt, textChunks, padding = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DEFAULT_PADDING"]) {
        const textSplitter = this.getTextSplitterGivenPrompt(prompt, textChunks.length, padding);
        return textChunks.map((chunk)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$node$2d$parser$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["truncateText"])(chunk, textSplitter));
    }
    /**
   * Repack text chunks to better utilize the available context window.
   */ repack(prompt, textChunks, padding = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DEFAULT_PADDING"]) {
        const textSplitter = this.getTextSplitterGivenPrompt(prompt, 1, padding);
        const combinedStr = textChunks.map((c)=>c.trim()).filter((c)=>c.length > 0).join("\n\n");
        return textSplitter.splitText(combinedStr);
    }
    static fromLLMMetadata(metadata, options) {
        const { chunkOverlapRatio = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DEFAULT_CHUNK_OVERLAP_RATIO"], chunkSizeLimit = undefined, tokenizer = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Settings"].tokenizer, separator = " " } = options ?? {};
        return new PromptHelper({
            contextWindow: metadata.contextWindow,
            // fixme: numOutput is not in LLMMetadata
            numOutput: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DEFAULT_NUM_OUTPUTS"],
            chunkOverlapRatio,
            chunkSizeLimit,
            tokenizer,
            separator
        });
    }
}
;
}}),
"[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/storage/chat-store/dist/index.js [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "BaseChatStore": (()=>BaseChatStore),
    "SimpleChatStore": (()=>SimpleChatStore)
});
class BaseChatStore {
}
class SimpleChatStore extends BaseChatStore {
    #store;
    setMessages(key, messages) {
        this.#store.set(key, messages);
    }
    getMessages(key) {
        return this.#store.get(key) ?? [];
    }
    addMessage(key, message, idx) {
        const messages = this.#store.get(key) ?? [];
        if (idx === undefined) {
            messages.push(message);
        } else {
            messages.splice(idx, 0, message);
        }
        this.#store.set(key, messages);
    }
    deleteMessages(key) {
        this.#store.delete(key);
    }
    deleteMessage(key, idx) {
        const messages = this.#store.get(key) ?? [];
        messages.splice(idx, 1);
        this.#store.set(key, messages);
    }
    getKeys() {
        return this.#store.keys();
    }
    constructor(...args){
        super(...args), this.#store = new Map();
    }
}
;
}}),
"[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/memory/dist/index.js [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "BaseMemory": (()=>BaseMemory),
    "BaseMemoryBlock": (()=>BaseMemoryBlock),
    "ChatMemoryBuffer": (()=>ChatMemoryBuffer),
    "ChatMessageAdapter": (()=>ChatMessageAdapter),
    "ChatSummaryMemoryBuffer": (()=>ChatSummaryMemoryBuffer),
    "FactExtractionMemoryBlock": (()=>FactExtractionMemoryBlock),
    "Memory": (()=>Memory),
    "StaticMemoryBlock": (()=>StaticMemoryBlock),
    "VercelMessageAdapter": (()=>VercelMessageAdapter),
    "createMemory": (()=>createMemory),
    "factExtractionBlock": (()=>factExtractionBlock),
    "loadMemory": (()=>loadMemory),
    "staticBlock": (()=>staticBlock)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/global/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$storage$2f$chat$2d$store$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/storage/chat-store/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$utils$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/utils/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$env$40$0$2e$1$2e$30$2f$node_modules$2f40$llamaindex$2f$env$2f$tokenizers$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+env@0.1.30/node_modules/@llamaindex/env/tokenizers/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$prompts$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/prompts/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$env$40$0$2e$1$2e$30$2f$node_modules$2f40$llamaindex$2f$env$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+env@0.1.30/node_modules/@llamaindex/env/dist/index.js [app-route] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:crypto [external] (node:crypto, cjs)");
;
;
;
;
;
;
const DEFAULT_TOKEN_LIMIT_RATIO = 0.75;
const DEFAULT_CHAT_STORE_KEY = "chat_history";
/**
 * A ChatMemory is used to keep the state of back and forth chat messages
 * @deprecated Use Memory instead.
 */ class BaseMemory {
    _tokenCountForMessages(messages) {
        if (messages.length === 0) {
            return 0;
        }
        const tokenizer = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Settings"].tokenizer;
        const str = messages.map((m)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$utils$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["extractText"])(m.content)).join(" ");
        return tokenizer.encode(str).length;
    }
}
/**
 * @deprecated Use Memory with snapshot feature with your own storage instead.
 */ class BaseChatStoreMemory extends BaseMemory {
    constructor(chatStore = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$storage$2f$chat$2d$store$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SimpleChatStore"](), chatStoreKey = DEFAULT_CHAT_STORE_KEY){
        super(), this.chatStore = chatStore, this.chatStoreKey = chatStoreKey;
    }
    getAllMessages() {
        return this.chatStore.getMessages(this.chatStoreKey);
    }
    put(messages) {
        this.chatStore.addMessage(this.chatStoreKey, messages);
    }
    set(messages) {
        this.chatStore.setMessages(this.chatStoreKey, messages);
    }
    reset() {
        this.chatStore.deleteMessages(this.chatStoreKey);
    }
}
/**
 * @deprecated Use Memory instead.
 */ class ChatMemoryBuffer extends BaseChatStoreMemory {
    constructor(options){
        super(options?.chatStore, options?.chatStoreKey);
        const llm = options?.llm ?? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Settings"].llm;
        const contextWindow = llm.metadata.contextWindow;
        this.tokenLimit = options?.tokenLimit ?? Math.ceil(contextWindow * DEFAULT_TOKEN_LIMIT_RATIO);
        if (options?.chatHistory) {
            this.chatStore.setMessages(this.chatStoreKey, options.chatHistory);
        }
    }
    async getMessages(transientMessages, initialTokenCount = 0) {
        const messages = await this.getAllMessages();
        if (initialTokenCount > this.tokenLimit) {
            throw new Error("Initial token count exceeds token limit");
        }
        // Add input messages as transient messages
        const messagesWithInput = transientMessages ? [
            ...transientMessages,
            ...messages
        ] : messages;
        let messageCount = messagesWithInput.length;
        let currentMessages = messagesWithInput.slice(-messageCount);
        let tokenCount = this._tokenCountForMessages(messagesWithInput) + initialTokenCount;
        while(tokenCount > this.tokenLimit && messageCount > 1){
            messageCount -= 1;
            if (messagesWithInput.at(-messageCount).role === "assistant") {
                messageCount -= 1;
            }
            currentMessages = messagesWithInput.slice(-messageCount);
            tokenCount = this._tokenCountForMessages(currentMessages) + initialTokenCount;
        }
        if (tokenCount > this.tokenLimit && messageCount <= 0) {
            return [];
        }
        return messagesWithInput.slice(-messageCount);
    }
}
/**
 * @deprecated Use Memory instead.
 */ class ChatSummaryMemoryBuffer extends BaseMemory {
    constructor(options){
        super();
        this.messages = options?.messages ?? [];
        this.summaryPrompt = options?.summaryPrompt ?? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$prompts$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["defaultSummaryPrompt"];
        this.llm = options?.llm ?? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Settings"].llm;
        if (!this.llm.metadata.maxTokens) {
            throw new Error("LLM maxTokens is not set. Needed so the summarizer ensures the context window size of the LLM.");
        }
        this.tokenizer = options?.tokenizer ?? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$env$40$0$2e$1$2e$30$2f$node_modules$2f40$llamaindex$2f$env$2f$tokenizers$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["tokenizers"].tokenizer();
        this.tokensToSummarize = this.llm.metadata.contextWindow - this.llm.metadata.maxTokens;
        if (this.tokensToSummarize < this.llm.metadata.contextWindow * 0.25) {
            throw new Error("The number of tokens that trigger the summarize process are less than 25% of the context window. Try lowering maxTokens or use a model with a larger context window.");
        }
    }
    async summarize() {
        // get the conversation messages to create summary
        const messagesToSummarize = this.calcConversationMessages();
        let promptMessages;
        do {
            promptMessages = [
                {
                    content: this.summaryPrompt.format({
                        context: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$utils$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["messagesToHistory"])(messagesToSummarize)
                    }),
                    role: "user",
                    options: {}
                }
            ];
            // remove oldest message until the chat history is short enough for the context window
            messagesToSummarize.shift();
        }while (this.tokenizer.encode(promptMessages[0].content).length > this.tokensToSummarize)
        const response = await this.llm.chat({
            messages: promptMessages
        });
        return {
            content: response.message.content,
            role: "memory"
        };
    }
    // Find last summary message
    get lastSummaryIndex() {
        const reversedMessages = this.messages.slice().reverse();
        const index = reversedMessages.findIndex((message)=>message.role === "memory");
        if (index === -1) {
            return null;
        }
        return this.messages.length - 1 - index;
    }
    getLastSummary() {
        const lastSummaryIndex = this.lastSummaryIndex;
        return lastSummaryIndex ? this.messages[lastSummaryIndex] : null;
    }
    get systemMessages() {
        // get array of all system messages
        return this.messages.filter((message)=>message.role === "system");
    }
    get nonSystemMessages() {
        // get array of all non-system messages
        return this.messages.filter((message)=>message.role !== "system");
    }
    /**
   * Calculates the messages that describe the conversation so far.
   * If there's no memory, all non-system messages are used.
   * If there's a memory, uses all messages after the last summary message.
   */ calcConversationMessages(transformSummary) {
        const lastSummaryIndex = this.lastSummaryIndex;
        if (!lastSummaryIndex) {
            // there's no memory, so just use all non-system messages
            return this.nonSystemMessages;
        } else {
            // there's a memory, so use all messages after the last summary message
            // and convert summary message so it can be send to the LLM
            const summaryMessage = transformSummary ? {
                content: `Summary of the conversation so far: ${this.messages[lastSummaryIndex].content}`,
                role: "system"
            } : this.messages[lastSummaryIndex];
            return [
                summaryMessage,
                ...this.messages.slice(lastSummaryIndex + 1)
            ];
        }
    }
    calcCurrentRequestMessages(transientMessages) {
        // currently, we're sending:
        // system messages first, then transient messages and then the messages that describe the conversation so far
        return [
            ...this.systemMessages,
            ...transientMessages ? transientMessages : [],
            ...this.calcConversationMessages(true)
        ];
    }
    reset() {
        this.messages = [];
    }
    async getMessages(transientMessages) {
        const requestMessages = this.calcCurrentRequestMessages(transientMessages);
        // get tokens of current request messages and the transient messages
        const tokens = requestMessages.reduce((count, message)=>count + this.tokenizer.encode((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$utils$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["extractText"])(message.content)).length, 0);
        if (tokens > this.tokensToSummarize) {
            // if there are too many tokens for the next request, call summarize
            const memoryMessage = await this.summarize();
            const lastMessage = this.messages.at(-1);
            if (lastMessage && lastMessage.role === "user") {
                // if last message is a user message, ensure that it's sent after the new memory message
                this.messages.pop();
                this.messages.push(memoryMessage);
                this.messages.push(lastMessage);
            } else {
                // otherwise just add the memory message
                this.messages.push(memoryMessage);
            }
            // TODO: we still might have too many tokens
            // e.g. too large system messages or transient messages
            // how should we deal with that?
            return this.calcCurrentRequestMessages(transientMessages);
        }
        return requestMessages;
    }
    async getAllMessages() {
        return this.getMessages();
    }
    put(message) {
        this.messages.push(message);
    }
}
class ChatMessageAdapter {
    fromMemory(message) {
        return {
            content: message.content,
            role: message.role,
            options: message.options
        };
    }
    toMemory(message) {
        return {
            id: (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["randomUUID"])(),
            createdAt: new Date(),
            ...message
        };
    }
    isCompatible(message) {
        return !!(message && typeof message === "object" && "role" in message && message.role && "content" in message);
    }
}
/**
 * Utility class for converting between LlamaIndex ChatMessage and Vercel UI Message formats
 */ class VercelMessageAdapter {
    /**
   * Convert LlamaIndex ChatMessage to Vercel UI Message format
   */ fromMemory(memoryMessage) {
        const parts = this.convertMessageContentToVercelParts(memoryMessage.content);
        // Convert role to UI message role
        let role;
        switch(memoryMessage.role){
            case "system":
            case "user":
            case "assistant":
                role = memoryMessage.role;
                break;
            case "memory":
                role = "system";
                break;
            case "developer":
                role = "user";
                break;
            default:
                role = "user"; // Default fallback, should not happen
        }
        return {
            id: memoryMessage.id,
            role,
            content: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$utils$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["extractText"])(memoryMessage.content),
            parts,
            createdAt: memoryMessage.createdAt,
            annotations: memoryMessage.annotations
        };
    }
    /**
   * Convert Vercel UI Message to LlamaIndex ChatMessage format
   */ toMemory(uiMessage) {
        // Convert UI message role to MessageType
        let role;
        switch(uiMessage.role){
            case "system":
            case "user":
            case "assistant":
                role = uiMessage.role;
                break;
            case "data":
                role = "user"; // Map data role to user
                break;
            default:
                role = "user"; // Default fallback, should not happen
        }
        // Convert parts to MessageContent
        const content = this.convertVercelPartsToMessageContent(uiMessage.parts);
        return {
            id: uiMessage.id,
            content: content ?? uiMessage.content,
            role,
            createdAt: uiMessage.createdAt,
            annotations: uiMessage.annotations
        };
    }
    /**
   * Validate if object matches VercelMessage structure
   */ isCompatible(message) {
        return !!(message && typeof message === "object" && "role" in message && "content" in message && "parts" in message);
    }
    /**
   * Convert UI parts to MessageContent
   */ convertVercelPartsToMessageContent(parts) {
        if (parts.length === 0) {
            return null;
        }
        const details = [];
        for (const part of parts){
            switch(part.type){
                case "file":
                    {
                        details.push({
                            type: "file",
                            data: part.data,
                            mimeType: part.mimeType
                        });
                        break;
                    }
                default:
                    // For other part types, convert to text
                    details.push({
                        type: "text",
                        text: part.text
                    });
                    break;
            }
        }
        // If only one text detail, return as string
        if (details.length === 1 && details[0]?.type === "text") {
            return details[0].text;
        }
        return details;
    }
    /**
   * Convert MessageContent to UI parts
   */ convertMessageContentToVercelParts(content) {
        if (typeof content === "string") {
            return [
                {
                    type: "text",
                    text: content
                }
            ];
        }
        const parts = [];
        for (const detail of content){
            switch(detail.type){
                case "text":
                    parts.push({
                        type: "text",
                        text: detail.text
                    });
                    break;
                case "image_url":
                    parts.push({
                        type: "text",
                        text: `[Image URL: ${detail.image_url.url}]`
                    });
                    break;
                case "audio":
                case "video":
                case "image":
                case "file":
                    parts.push({
                        type: "file",
                        data: detail.data,
                        mimeType: detail.type
                    });
                    break;
                default:
                    // For unknown types, create a text representation
                    parts.push({
                        type: "text",
                        text: JSON.stringify(detail)
                    });
            }
        }
        return parts;
    }
}
/**
 * A base class for memory blocks.
 */ class BaseMemoryBlock {
    constructor(options){
        this.id = options.id ?? `memory-block-${(0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["randomUUID"])()}`;
        this.priority = options.priority;
        this.isLongTerm = options.isLongTerm ?? true;
    }
}
const DEFAULT_EXTRACTION_PROMPT = `
You are a precise fact extraction system designed to identify key information from conversations.

CONVERSATION SEGMENT:
{{conversation}}

EXISTING FACTS:
{{existing_facts}}

INSTRUCTIONS: 
1. Review the conversation segment provided above.
2. Extract specific, concrete facts the user has disclosed or important information discovered
3. Focus on factual information like preferences, personal details, requirements, constraints, or context
4. Do not include opinions, summaries, or interpretations - only extract explicit information
5. Do not duplicate facts that are already in the existing facts list

Respond with the new facts from the conversation segment using the following JSON format:
{
  "facts": ["fact1", "fact2", "fact3", ...]
}
`;
const DEFAULT_SUMMARY_PROMPT = `
You are a precise fact condensing system designed to summarize facts in a concise manner.

EXISTING FACTS:
{{existing_facts}}

INSTRUCTIONS:
1. Review the current list of existing facts
2. Condense the facts into a more concise list, less than {{ max_facts }} facts
3. Focus on factual information like preferences, personal details, requirements, constraints, or context
4. Do not include opinions, summaries, or interpretations - only extract explicit information
5. Do not duplicate facts that are already in the existing facts list

Respond with the condensed facts using the following JSON format:
{
  "facts": ["fact1", "fact2", "fact3", ...]
}
`;
/**
 * A memory block that stores facts extracted from conversations.
 */ class FactExtractionMemoryBlock extends BaseMemoryBlock {
    constructor(options){
        super(options), this.facts = [];
        this.llm = options.llm;
        this.maxFacts = options.maxFacts;
        this.extractionPrompt = options.extractionPrompt ?? DEFAULT_EXTRACTION_PROMPT;
        this.summaryPrompt = options.summaryPrompt ?? DEFAULT_SUMMARY_PROMPT;
    }
    async get() {
        const fact = {
            id: this.id,
            content: this.facts.join("\n"),
            role: "memory"
        };
        return [
            fact
        ];
    }
    async put(messages) {
        if (messages.length === 0) {
            return;
        }
        // Format existing facts
        const existingFactsStr = `{ facts: [${this.facts.join(", ")}] }`;
        // Format conversation
        const conversation = `\n\t${messages.map((m)=>m.content).join("\n\t")}`;
        // Format prompt
        const prompt = this.extractionPrompt.replace("{{conversation}}", conversation).replace("{{existing_facts}}", existingFactsStr);
        // Call the LLM
        const response = await this.llm.complete({
            prompt
        });
        // Parse and validate the response
        const newFacts = JSON.parse(response.text);
        if (newFacts.facts === undefined || !Array.isArray(newFacts.facts)) {
            throw new Error(`[FactExtraction] Invalid response from LLM: ${response.text}`);
        }
        // No new facts, so no need to update the facts
        if (newFacts.facts.length === 0) {
            return;
        }
        // Update the facts
        this.facts.push(...newFacts.facts);
        // Condense the facts
        if (this.facts.length > this.maxFacts) {
            const existingFactsStr = `{ facts: [${this.facts.join(", ")}] }`;
            const prompt = this.summaryPrompt.replace("{{existing_facts}}", existingFactsStr).replace("{{max_facts}}", this.maxFacts.toString());
            const response = await this.llm.complete({
                prompt
            });
            const condensedFacts = JSON.parse(response.text);
            if (condensedFacts.facts === undefined || !Array.isArray(condensedFacts.facts) || condensedFacts.facts.length === 0) {
                throw new Error("Invalid response from LLM");
            }
            // Only get the first maxFacts facts (in case the LLM returned more)
            this.facts = condensedFacts.facts.slice(0, this.maxFacts);
        }
    }
}
/**
 * A memory block that stores static content that doesn't change.
 * Static content is always included in the memory context.
 */ class StaticMemoryBlock extends BaseMemoryBlock {
    constructor(options){
        super({
            ...options,
            priority: 0,
            isLongTerm: false
        });
        this.content = options.content;
        this.messageRole = options.messageRole ?? "user";
    }
    /**
   * Returns the static content.
   * The messages parameter is ignored since this block contains static content.
   */ async get() {
        return [
            {
                id: this.id,
                role: this.messageRole,
                content: this.content
            }
        ];
    }
    async put(_messages) {
    // No-op: static content doesn't change
    }
}
const DEFAULT_TOKEN_LIMIT = 30000;
const DEFAULT_SHORT_TERM_TOKEN_LIMIT_RATIO = 0.7;
class Memory {
    constructor(messages = [], options = {}){
        /**
   * Hold all messages put into the memory.
   */ this.messages = [];
        /**
   * The token limit for memory retrieval results.
   */ this.tokenLimit = DEFAULT_TOKEN_LIMIT;
        /**
   * The ratio of the token limit for short term memory.
   */ this.shortTermTokenLimitRatio = DEFAULT_SHORT_TERM_TOKEN_LIMIT_RATIO;
        /**
   * The memory blocks for the memory.
   */ this.memoryBlocks = [];
        /**
   * The cursor for the messages that have been processed into long-term memory.
   */ this.memoryCursor = 0;
        this.messages = messages;
        this.tokenLimit = options.tokenLimit ?? DEFAULT_TOKEN_LIMIT;
        this.shortTermTokenLimitRatio = options.shortTermTokenLimitRatio ?? DEFAULT_SHORT_TERM_TOKEN_LIMIT_RATIO;
        this.memoryBlocks = options.memoryBlocks ?? [];
        this.memoryCursor = options.memoryCursor ?? 0;
        this.adapters = {
            ...options.customAdapters,
            vercel: new VercelMessageAdapter(),
            llamaindex: new ChatMessageAdapter()
        };
    }
    /**
   * Add a message to the memory
   * @param message - The message to add to the memory
   */ async add(message) {
        let memoryMessage = null;
        // Try to find a compatible adapter among the other adapters
        for(const key in this.adapters){
            const adapter = this.adapters[key];
            if (adapter?.isCompatible(message)) {
                memoryMessage = adapter.toMemory(message);
                break;
            }
        }
        if (memoryMessage) {
            this.messages.push(memoryMessage);
            // Automatically manage memory blocks when new messages are added
            await this.manageMemoryBlocks();
        } else {
            throw new Error(`None of the adapters ${Object.keys(this.adapters).join(", ")} are compatible with the message. ${JSON.stringify(message)}`);
        }
    }
    /**
   * Get the messages of specific type from the memory
   * @param options - The options for the get method
   * @returns The messages of specific type
   */ async get(options = {}) {
        const { type = "llamaindex", transientMessages } = options;
        const adapter = this.adapters[type];
        if (!adapter) {
            throw new Error(`No adapter registered for type "${String(type)}"`);
        }
        let messages = this.messages;
        if (transientMessages && transientMessages.length > 0) {
            messages = [
                ...this.messages,
                ...transientMessages.map((m)=>this.adapters.llamaindex.toMemory(m))
            ];
        }
        // Convert memory messages to chat messages for memory block processing
        const chatMessages = messages.map((m)=>adapter.fromMemory(m));
        return chatMessages;
    }
    /**
   * Get the messages from the memory, optionally including transient messages.
   * only return messages that are within context window of the LLM
   * @param llm - To fit the result messages to the context window of the LLM. If not provided, the default token limit will be used.
   * @param transientMessages - Optional transient messages to include.
   * @returns The messages from the memory, optionally including transient messages.
   */ async getLLM(llm, transientMessages) {
        // Priority of result messages:
        // [Fixed blocks (priority=0), Long term blocks, Short term messages(oldest to newest), Transient messages]
        const contextWindow = llm?.metadata.contextWindow;
        const tokenLimit = contextWindow ? Math.ceil(contextWindow * DEFAULT_TOKEN_LIMIT_RATIO) : this.tokenLimit;
        // Start with fixed block messages (priority=0)
        // as it must always be included in the retrieval result
        const messages = await this.getMemoryBlockMessages(this.memoryBlocks.filter((block)=>block.priority === 0), tokenLimit);
        // remaining token limit for short-term and memory blocks content
        const remainingTokenLimit = tokenLimit - this.countMessagesToken([
            ...messages,
            ...transientMessages || []
        ]);
        // if transient messages are provided, we need to check if they fit within the token limit
        if (remainingTokenLimit < 0) {
            throw new Error(`Could not fit fixed blocks and transient messages within memory context`);
        }
        // Get messages for short-term and memory blocks
        const shortTermTokenLimit = Math.ceil(remainingTokenLimit * this.shortTermTokenLimitRatio);
        const memoryBlocksTokenLimit = remainingTokenLimit - shortTermTokenLimit;
        // Add long-term memory blocks (priority > 0)
        const longTermBlocks = [
            ...this.memoryBlocks
        ].filter((block)=>block.priority !== 0).sort((a, b)=>b.priority - a.priority);
        const longTermBlockMessages = await this.getMemoryBlockMessages(longTermBlocks, memoryBlocksTokenLimit);
        messages.push(...longTermBlockMessages);
        // Process short-term messages (newest first for token efficiency, but maintain chronological order in result)
        const shortTermMessagesResult = [];
        const unprocessedMessages = this.messages.slice(this.memoryCursor);
        // Process from newest to oldest for token efficiency
        for(let i = unprocessedMessages.length - 1; i >= 0; i--){
            const memoryMessage = unprocessedMessages[i];
            if (!memoryMessage) continue;
            const chatMessage = this.adapters.llamaindex.fromMemory(memoryMessage);
            // Check if adding this message would exceed token limit
            const newTokenCount = this.countMessagesToken(shortTermMessagesResult) + this.countMessagesToken([
                chatMessage
            ]) + this.countMessagesToken(transientMessages || []);
            if (newTokenCount > shortTermTokenLimit) {
                break;
            }
            shortTermMessagesResult.push(chatMessage);
        }
        // reverse the short-term messages to maintain chronological order (oldest to newest)
        messages.push(...shortTermMessagesResult.reverse());
        // Add transient messages at the end
        if (transientMessages && transientMessages.length > 0) {
            messages.push(...transientMessages);
        }
        return messages;
    }
    /**
   * Get the content from the memory blocks
   * also convert the content to chat messages
   * @param blocks - The blocks to get the content from
   * @param tokenLimit - The token limit for the memory blocks, if not provided, all the memory blocks will be included
   */ async getMemoryBlockMessages(blocks, tokenLimit) {
        if (blocks.length === 0) {
            return [];
        }
        // Sort memory blocks by priority (highest first)
        const sortedBlocks = [
            ...blocks
        ].sort((a, b)=>b.priority - a.priority);
        const memoryContent = [];
        // Get up to the token limit of the memory blocks
        let addedTokenCount = 0;
        for (const block of sortedBlocks){
            try {
                const content = await block.get();
                for (const message of content){
                    const chatMessage = this.adapters.llamaindex.fromMemory(message);
                    const messageTokenCount = this.countMessagesToken([
                        chatMessage
                    ]);
                    if (tokenLimit && addedTokenCount + messageTokenCount > tokenLimit) {
                        return memoryContent;
                    }
                    memoryContent.push(chatMessage);
                    addedTokenCount += messageTokenCount;
                }
            } catch (error) {
                console.warn(`Failed to get content from memory block ${block.id}:`, error);
            }
        }
        return memoryContent;
    }
    /**
   * Manage the memory blocks
   * This method processes new messages into memory blocks when short-term memory exceeds its token limit.
   * It uses a cursor system to track which messages have already been processed into long-term memory.
   */ async manageMemoryBlocks() {
        // Early return if no memory blocks configured
        if (this.memoryBlocks.length === 0) {
            return;
        }
        // Should always calculate the number
        const shortTermTokenLimit = Math.ceil(this.tokenLimit * this.shortTermTokenLimitRatio);
        // Check if unprocessed messages exceed the short term token limit
        const unprocessedMessages = this.getUnprocessedMessages();
        const unprocessedMessagesTokenCount = this.countMemoryMessagesToken(unprocessedMessages);
        if (unprocessedMessagesTokenCount <= shortTermTokenLimit) {
            // No need to manage memory blocks yet
            return;
        }
        await this.processMessagesIntoMemoryBlocks(unprocessedMessages);
        this.updateMemoryCursor(unprocessedMessages.length);
    }
    /**
   * Get messages that haven't been processed into long-term memory yet
   */ getUnprocessedMessages() {
        if (this.memoryCursor >= this.messages.length) {
            return [];
        }
        return this.messages.slice(this.memoryCursor);
    }
    /**
   * Process new messages into all memory blocks
   */ async processMessagesIntoMemoryBlocks(newMessages) {
        const longTermMemoryBlocks = this.memoryBlocks.filter((block)=>block.isLongTerm);
        const promises = longTermMemoryBlocks.map(async (block)=>{
            try {
                await block.put(newMessages);
            } catch (error) {
                console.warn(`Failed to process messages into memory block ${block.id}:`, error);
            // Continue processing other blocks even if one fails
            }
        });
        // Wait for all memory blocks to process the messages
        await Promise.all(promises);
    }
    /**
   * Update the memory cursor after successful processing
   */ updateMemoryCursor(processedCount) {
        this.memoryCursor += processedCount;
        // Ensure cursor doesn't exceed message count
        this.memoryCursor = Math.min(this.memoryCursor, this.messages.length);
    }
    /**
   * Clear all the messages in the memory
   */ async clear() {
        this.messages = [];
        this.memoryCursor = 0; // Reset cursor when clearing messages
    }
    /**
   * Creates a snapshot of the current memory state
   * Note: Memory blocks are not included in snapshots as they may contain non-serializable content.
   * Memory blocks should be recreated when loading from snapshot.
   * @returns A JSON-serializable object containing the memory state
   */ snapshot() {
        return JSON.stringify({
            messages: this.messages,
            memoryCursor: this.memoryCursor
        });
    }
    countMemoryMessagesToken(messages) {
        return this.countMessagesToken(messages.map((m)=>this.adapters.llamaindex.fromMemory(m)));
    }
    countMessagesToken(messages) {
        if (messages.length === 0) {
            return 0;
        }
        const tokenizer = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Settings"].tokenizer;
        const str = messages.map((m)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$utils$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["extractText"])(m.content)).join(" ");
        return tokenizer.encode(str).length;
    }
}
/**
 * Create a Memory instance
 * @param messagesOrOptions - Either initial messages or options
 * @param options - Memory configuration options (when first param is messages)
 * @returns A new Memory instance
 */ function createMemory(messagesOrOptions = [], options = {}) {
    let messages = [];
    if (Array.isArray(messagesOrOptions)) {
        const firstMessage = messagesOrOptions[0];
        if (firstMessage) {
            if ("id" in firstMessage) {
                messages = messagesOrOptions;
            } else {
                const adapter = new ChatMessageAdapter();
                messages = messagesOrOptions.map((chatMessage)=>adapter.toMemory(chatMessage));
            }
        }
    }
    // Determine the correct options to pass to Memory
    const resolvedOptions = Array.isArray(messagesOrOptions) ? options : messagesOrOptions;
    return new Memory(messages, resolvedOptions);
}
/**
 * create a StaticMemoryBlock
 * @param options - Configuration options for the static memory block
 * @returns A new StaticMemoryBlock instance
 */ function staticBlock(options) {
    return new StaticMemoryBlock(options);
}
/**
 * create a FactExtractionMemoryBlock
 * @param options - Configuration options for the fact extraction memory block
 * @returns A new FactExtractionMemoryBlock instance
 */ function factExtractionBlock(options) {
    return new FactExtractionMemoryBlock(options);
}
/**
 * Creates a new Memory instance from a snapshot
 * @param snapshot The snapshot to load from
 * @param options Optional MemoryOptions to apply when loading (including memory blocks)
 * @returns A new Memory instance with the snapshot data and provided options
 */ function loadMemory(snapshot, options) {
    const { messages, tokenLimit, memoryCursor } = JSON.parse(snapshot);
    // Merge snapshot data with provided options
    const mergedOptions = {
        tokenLimit: options?.tokenLimit ?? tokenLimit ?? DEFAULT_TOKEN_LIMIT,
        ...options?.shortTermTokenLimitRatio && {
            shortTermTokenLimitRatio: options.shortTermTokenLimitRatio
        },
        ...options?.customAdapters && {
            customAdapters: options.customAdapters
        },
        memoryBlocks: options?.memoryBlocks ?? [],
        memoryCursor: memoryCursor ?? 0
    };
    return new Memory(messages, mergedOptions);
}
;
}}),
"[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/response-synthesizers/dist/index.js [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "BaseSynthesizer": (()=>BaseSynthesizer),
    "CompactAndRefine": (()=>CompactAndRefine),
    "MultiModal": (()=>MultiModal),
    "Refine": (()=>Refine),
    "TreeSummarize": (()=>TreeSummarize),
    "createMessageContent": (()=>createMessageContent),
    "getResponseSynthesizer": (()=>getResponseSynthesizer),
    "responseModeSchema": (()=>responseModeSchema)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$env$40$0$2e$1$2e$30$2f$node_modules$2f40$llamaindex$2f$env$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+env@0.1.30/node_modules/@llamaindex/env/dist/index.js [app-route] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:crypto [external] (node:crypto, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/global/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$indices$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/indices/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$prompts$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/prompts/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$schema$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/schema/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zod@3.25.76/node_modules/zod/v3/external.js [app-route] (ecmascript) <export * as z>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$utils$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/utils/dist/index.js [app-route] (ecmascript)");
;
;
;
;
;
;
;
class BaseSynthesizer extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$prompts$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PromptMixin"] {
    constructor(options){
        super();
        this.llm = options.llm ?? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Settings"].llm;
        this.promptHelper = options.promptHelper ?? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$indices$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PromptHelper"].fromLLMMetadata(this.llm.metadata);
    }
    async synthesize(query, stream = false) {
        const callbackManager = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Settings"].callbackManager;
        const id = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["randomUUID"])();
        callbackManager.dispatchEvent("synthesize-start", {
            id,
            query
        });
        let response;
        if (query.nodes.length === 0) {
            if (stream) {
                response = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$schema$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["EngineResponse"].fromResponse("Empty Response", true, []);
            } else {
                response = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$schema$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["EngineResponse"].fromResponse("Empty Response", false, []);
            }
        } else {
            const queryMessage = typeof query.query === "string" ? query.query : query.query.query;
            response = await this.getResponse(queryMessage, query.nodes, stream);
        }
        callbackManager.dispatchEvent("synthesize-end", {
            id,
            query,
            response
        });
        return response;
    }
}
async function createContentPerModality(prompt, type, nodes, extraParams, metadataMode) {
    switch(type){
        case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$schema$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ModalityType"].TEXT:
            return [
                {
                    type: "text",
                    text: prompt.format({
                        ...extraParams,
                        context: nodes.map((r)=>r.getContent(metadataMode)).join("\n\n")
                    })
                }
            ];
        case __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$schema$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ModalityType"].IMAGE:
            return Promise.all(nodes.map(async (node)=>{
                return {
                    type: "image_url",
                    image_url: {
                        url: await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$utils$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["imageToDataUrl"])(node.image)
                    }
                };
            }));
        default:
            return [];
    }
}
async function createMessageContent(prompt, nodes, extraParams = {}, metadataMode = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$schema$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["MetadataMode"].NONE) {
    const content = [];
    const nodeMap = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$schema$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["splitNodesByType"])(nodes);
    for(const type in nodeMap){
        // for each retrieved modality type, create message content
        const nodes = nodeMap[type];
        if (nodes) {
            content.push(...await createContentPerModality(prompt, type, nodes, extraParams, metadataMode));
        }
    }
    return content;
}
const responseModeSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].enum([
    "refine",
    "compact",
    "tree_summarize",
    "multi_modal"
]);
/**
 * A response builder that uses the query to ask the LLM generate a better response using multiple text chunks.
 */ class Refine extends BaseSynthesizer {
    constructor(options){
        super(options);
        this.textQATemplate = options.textQATemplate ?? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$prompts$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["defaultTextQAPrompt"];
        this.refineTemplate = options.refineTemplate ?? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$prompts$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["defaultRefinePrompt"];
    }
    _getPromptModules() {
        return {};
    }
    _getPrompts() {
        return {
            textQATemplate: this.textQATemplate,
            refineTemplate: this.refineTemplate
        };
    }
    _updatePrompts(prompts) {
        if (prompts.textQATemplate) {
            this.textQATemplate = prompts.textQATemplate;
        }
        if (prompts.refineTemplate) {
            this.refineTemplate = prompts.refineTemplate;
        }
    }
    async getResponse(query, nodes, stream) {
        let response = undefined;
        const textChunks = nodes.map(({ node })=>node.getContent(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$schema$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["MetadataMode"].LLM));
        for(let i = 0; i < textChunks.length; i++){
            const text = textChunks[i];
            const lastChunk = i === textChunks.length - 1;
            if (!response) {
                response = await this.giveResponseSingle(query, text, !!stream && lastChunk);
            } else {
                response = await this.refineResponseSingle(response, query, text, !!stream && lastChunk);
            }
        }
        if (response === undefined) {
            response = stream ? async function*() {
                yield "";
            }() : "";
        }
        if (typeof response === "string") {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$schema$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["EngineResponse"].fromResponse(response, false, nodes);
        } else {
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$utils$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["streamConverter"])(response, (text)=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$schema$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["EngineResponse"].fromResponse(text, true, nodes));
        }
    }
    async giveResponseSingle(query, textChunk, stream) {
        const textQATemplate = this.textQATemplate.partialFormat({
            query: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$utils$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["extractText"])(query)
        });
        const textChunks = this.promptHelper.repack(textQATemplate, [
            textChunk
        ]);
        let response = undefined;
        for(let i = 0; i < textChunks.length; i++){
            const chunk = textChunks[i];
            const lastChunk = i === textChunks.length - 1;
            if (!response) {
                response = await this.complete({
                    prompt: textQATemplate.format({
                        context: chunk
                    }),
                    stream: stream && lastChunk
                });
            } else {
                response = await this.refineResponseSingle(response, query, chunk, stream && lastChunk);
            }
        }
        return response;
    }
    async refineResponseSingle(initialReponse, query, textChunk, stream) {
        const refineTemplate = this.refineTemplate.partialFormat({
            query: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$utils$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["extractText"])(query)
        });
        const textChunks = this.promptHelper.repack(refineTemplate, [
            textChunk
        ]);
        let response = initialReponse;
        for(let i = 0; i < textChunks.length; i++){
            const chunk = textChunks[i];
            const lastChunk = i === textChunks.length - 1;
            response = await this.complete({
                prompt: refineTemplate.format({
                    context: chunk,
                    existingAnswer: response
                }),
                stream: stream && lastChunk
            });
        }
        return response;
    }
    async complete(params) {
        if (params.stream) {
            const response = await this.llm.complete({
                ...params,
                stream: true
            });
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$utils$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["streamConverter"])(response, (chunk)=>chunk.text);
        } else {
            const response = await this.llm.complete({
                ...params,
                stream: false
            });
            return response.text;
        }
    }
}
/**
 * CompactAndRefine is a slight variation of Refine that first compacts the text chunks into the smallest possible number of chunks.
 */ class CompactAndRefine extends Refine {
    async getResponse(query, nodes, stream) {
        const textQATemplate = this.textQATemplate.partialFormat({
            query: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$utils$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["extractText"])(query)
        });
        const refineTemplate = this.refineTemplate.partialFormat({
            query: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$utils$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["extractText"])(query)
        });
        const textChunks = nodes.map(({ node })=>node.getContent(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$schema$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["MetadataMode"].LLM));
        const maxPrompt = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$indices$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getBiggestPrompt"])([
            textQATemplate,
            refineTemplate
        ]);
        const newTexts = this.promptHelper.repack(maxPrompt, textChunks);
        const newNodes = newTexts.map((text)=>new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$schema$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["TextNode"]({
                text
            }));
        if (stream) {
            const streamResponse = await super.getResponse(query, newNodes.map((node)=>({
                    node
                })), true);
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$utils$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["streamConverter"])(streamResponse, (chunk)=>{
                chunk.sourceNodes = nodes;
                return chunk;
            });
        }
        const originalResponse = await super.getResponse(query, newNodes.map((node)=>({
                node
            })), false);
        originalResponse.sourceNodes = nodes;
        return originalResponse;
    }
}
/**
 * TreeSummarize repacks the text chunks into the smallest possible number of chunks and then summarizes them, then recursively does so until there's one chunk left.
 */ class TreeSummarize extends BaseSynthesizer {
    constructor(options){
        super(options);
        this.summaryTemplate = options.summaryTemplate ?? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$prompts$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["defaultTreeSummarizePrompt"];
    }
    _getPromptModules() {
        return {};
    }
    _getPrompts() {
        return {
            summaryTemplate: this.summaryTemplate
        };
    }
    _updatePrompts(prompts) {
        if (prompts.summaryTemplate) {
            this.summaryTemplate = prompts.summaryTemplate;
        }
    }
    async getResponse(query, nodes, stream) {
        const textChunks = nodes.map(({ node })=>node.getContent(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$schema$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["MetadataMode"].LLM));
        if (!textChunks || textChunks.length === 0) {
            throw new Error("Must have at least one text chunk");
        }
        // Should we send the query here too?
        const packedTextChunks = this.promptHelper.repack(this.summaryTemplate, textChunks);
        if (packedTextChunks.length === 1) {
            const params = {
                prompt: this.summaryTemplate.format({
                    context: packedTextChunks[0],
                    query: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$utils$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["extractText"])(query)
                })
            };
            if (stream) {
                const response = await this.llm.complete({
                    ...params,
                    stream
                });
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$utils$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["streamConverter"])(response, (chunk)=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$schema$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["EngineResponse"].fromResponse(chunk.text, true, nodes));
            }
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$schema$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["EngineResponse"].fromResponse((await this.llm.complete(params)).text, false, nodes);
        } else {
            const summaries = await Promise.all(packedTextChunks.map((chunk)=>this.llm.complete({
                    prompt: this.summaryTemplate.format({
                        context: chunk,
                        query: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$utils$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["extractText"])(query)
                    })
                })));
            if (stream) {
                return this.getResponse(query, summaries.map((s)=>({
                        node: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$schema$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["TextNode"]({
                            text: s.text
                        })
                    })), true);
            }
            return this.getResponse(query, summaries.map((s)=>({
                    node: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$schema$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["TextNode"]({
                        text: s.text
                    })
                })), false);
        }
    }
}
class MultiModal extends BaseSynthesizer {
    constructor({ textQATemplate, metadataMode, ...options } = {}){
        super(options);
        this.metadataMode = metadataMode ?? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$schema$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["MetadataMode"].NONE;
        this.textQATemplate = textQATemplate ?? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$prompts$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["defaultTextQAPrompt"];
    }
    _getPromptModules() {
        return {};
    }
    _getPrompts() {
        return {
            textQATemplate: this.textQATemplate
        };
    }
    _updatePrompts(promptsDict) {
        if (promptsDict.textQATemplate) {
            this.textQATemplate = promptsDict.textQATemplate;
        }
    }
    async getResponse(query, nodes, stream) {
        const prompt = await createMessageContent(this.textQATemplate, nodes.map(({ node })=>node), {
            query: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$utils$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["extractText"])(query)
        }, this.metadataMode);
        const llm = this.llm;
        if (stream) {
            const response = await llm.complete({
                prompt,
                stream
            });
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$utils$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["streamConverter"])(response, ({ text })=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$schema$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["EngineResponse"].fromResponse(text, true, nodes));
        }
        const response = await llm.complete({
            prompt
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$schema$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["EngineResponse"].fromResponse(response.text, false, nodes);
    }
}
const modeToSynthesizer = {
    compact: CompactAndRefine,
    refine: Refine,
    tree_summarize: TreeSummarize,
    multi_modal: MultiModal
};
function getResponseSynthesizer(mode, options = {}) {
    const Synthesizer = modeToSynthesizer[mode];
    if (!Synthesizer) {
        throw new Error(`Invalid response mode: ${mode}`);
    }
    return new Synthesizer(options);
}
;
}}),
"[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/chat-engine/dist/index.js [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "BaseChatEngine": (()=>BaseChatEngine),
    "ContextChatEngine": (()=>ContextChatEngine),
    "DefaultContextGenerator": (()=>DefaultContextGenerator),
    "SimpleChatEngine": (()=>SimpleChatEngine)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$decorator$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/decorator/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/global/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$memory$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/memory/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$prompts$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/prompts/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$schema$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/schema/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$utils$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/utils/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$response$2d$synthesizers$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/response-synthesizers/dist/index.js [app-route] (ecmascript)");
;
;
;
;
;
;
;
class BaseChatEngine {
}
class DefaultContextGenerator extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$prompts$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PromptMixin"] {
    constructor(init){
        super();
        this.retriever = init.retriever;
        this.contextSystemPrompt = init?.contextSystemPrompt ?? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$prompts$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["defaultContextSystemPrompt"];
        this.nodePostprocessors = init.nodePostprocessors || [];
        this.contextRole = init.contextRole ?? "system";
        this.metadataMode = init.metadataMode ?? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$schema$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["MetadataMode"].NONE;
    }
    _getPromptModules() {
        return {};
    }
    _getPrompts() {
        return {
            contextSystemPrompt: this.contextSystemPrompt
        };
    }
    _updatePrompts(promptsDict) {
        if (promptsDict.contextSystemPrompt) {
            this.contextSystemPrompt = promptsDict.contextSystemPrompt;
        }
    }
    async applyNodePostprocessors(nodes, query) {
        let nodesWithScore = nodes;
        for (const postprocessor of this.nodePostprocessors){
            nodesWithScore = await postprocessor.postprocessNodes(nodesWithScore, query);
        }
        return nodesWithScore;
    }
    async generate(message) {
        const sourceNodesWithScore = await this.retriever.retrieve({
            query: message
        });
        const nodes = await this.applyNodePostprocessors(sourceNodesWithScore, message);
        const content = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$response$2d$synthesizers$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createMessageContent"])(this.contextSystemPrompt, nodes.map((r)=>r.node), undefined, this.metadataMode);
        return {
            message: {
                content,
                role: this.contextRole
            },
            nodes
        };
    }
}
function applyDecs2203RFactory$1() {
    function createAddInitializerMethod(initializers, decoratorFinishedRef) {
        return function addInitializer(initializer) {
            assertNotFinished(decoratorFinishedRef, "addInitializer");
            assertCallable(initializer, "An initializer");
            initializers.push(initializer);
        };
    }
    function memberDec(dec, name, desc, initializers, kind, isStatic, isPrivate, metadata, value) {
        var kindStr;
        switch(kind){
            case 1:
                kindStr = "accessor";
                break;
            case 2:
                kindStr = "method";
                break;
            case 3:
                kindStr = "getter";
                break;
            case 4:
                kindStr = "setter";
                break;
            default:
                kindStr = "field";
        }
        var ctx = {
            kind: kindStr,
            name: isPrivate ? "#" + name : name,
            static: isStatic,
            private: isPrivate,
            metadata: metadata
        };
        var decoratorFinishedRef = {
            v: false
        };
        ctx.addInitializer = createAddInitializerMethod(initializers, decoratorFinishedRef);
        var get, set;
        if (kind === 0) {
            if (isPrivate) {
                get = desc.get;
                set = desc.set;
            } else {
                get = function() {
                    return this[name];
                };
                set = function(v) {
                    this[name] = v;
                };
            }
        } else if (kind === 2) {
            get = function() {
                return desc.value;
            };
        } else {
            if (kind === 1 || kind === 3) {
                get = function() {
                    return desc.get.call(this);
                };
            }
            if (kind === 1 || kind === 4) {
                set = function(v) {
                    desc.set.call(this, v);
                };
            }
        }
        ctx.access = get && set ? {
            get: get,
            set: set
        } : get ? {
            get: get
        } : {
            set: set
        };
        try {
            return dec(value, ctx);
        } finally{
            decoratorFinishedRef.v = true;
        }
    }
    function assertNotFinished(decoratorFinishedRef, fnName) {
        if (decoratorFinishedRef.v) {
            throw new Error("attempted to call " + fnName + " after decoration was finished");
        }
    }
    function assertCallable(fn, hint) {
        if (typeof fn !== "function") {
            throw new TypeError(hint + " must be a function");
        }
    }
    function assertValidReturnValue(kind, value) {
        var type = typeof value;
        if (kind === 1) {
            if (type !== "object" || value === null) {
                throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");
            }
            if (value.get !== undefined) {
                assertCallable(value.get, "accessor.get");
            }
            if (value.set !== undefined) {
                assertCallable(value.set, "accessor.set");
            }
            if (value.init !== undefined) {
                assertCallable(value.init, "accessor.init");
            }
        } else if (type !== "function") {
            var hint;
            if (kind === 0) {
                hint = "field";
            } else if (kind === 10) {
                hint = "class";
            } else {
                hint = "method";
            }
            throw new TypeError(hint + " decorators must return a function or void 0");
        }
    }
    function applyMemberDec(ret, base, decInfo, name, kind, isStatic, isPrivate, initializers, metadata) {
        var decs = decInfo[0];
        var desc, init, value;
        if (isPrivate) {
            if (kind === 0 || kind === 1) {
                desc = {
                    get: decInfo[3],
                    set: decInfo[4]
                };
            } else if (kind === 3) {
                desc = {
                    get: decInfo[3]
                };
            } else if (kind === 4) {
                desc = {
                    set: decInfo[3]
                };
            } else {
                desc = {
                    value: decInfo[3]
                };
            }
        } else if (kind !== 0) {
            desc = Object.getOwnPropertyDescriptor(base, name);
        }
        if (kind === 1) {
            value = {
                get: desc.get,
                set: desc.set
            };
        } else if (kind === 2) {
            value = desc.value;
        } else if (kind === 3) {
            value = desc.get;
        } else if (kind === 4) {
            value = desc.set;
        }
        var newValue, get, set;
        if (typeof decs === "function") {
            newValue = memberDec(decs, name, desc, initializers, kind, isStatic, isPrivate, metadata, value);
            if (newValue !== void 0) {
                assertValidReturnValue(kind, newValue);
                if (kind === 0) {
                    init = newValue;
                } else if (kind === 1) {
                    init = newValue.init;
                    get = newValue.get || value.get;
                    set = newValue.set || value.set;
                    value = {
                        get: get,
                        set: set
                    };
                } else {
                    value = newValue;
                }
            }
        } else {
            for(var i = decs.length - 1; i >= 0; i--){
                var dec = decs[i];
                newValue = memberDec(dec, name, desc, initializers, kind, isStatic, isPrivate, metadata, value);
                if (newValue !== void 0) {
                    assertValidReturnValue(kind, newValue);
                    var newInit;
                    if (kind === 0) {
                        newInit = newValue;
                    } else if (kind === 1) {
                        newInit = newValue.init;
                        get = newValue.get || value.get;
                        set = newValue.set || value.set;
                        value = {
                            get: get,
                            set: set
                        };
                    } else {
                        value = newValue;
                    }
                    if (newInit !== void 0) {
                        if (init === void 0) {
                            init = newInit;
                        } else if (typeof init === "function") {
                            init = [
                                init,
                                newInit
                            ];
                        } else {
                            init.push(newInit);
                        }
                    }
                }
            }
        }
        if (kind === 0 || kind === 1) {
            if (init === void 0) {
                init = function(instance, init) {
                    return init;
                };
            } else if (typeof init !== "function") {
                var ownInitializers = init;
                init = function(instance, init) {
                    var value = init;
                    for(var i = 0; i < ownInitializers.length; i++){
                        value = ownInitializers[i].call(instance, value);
                    }
                    return value;
                };
            } else {
                var originalInitializer = init;
                init = function(instance, init) {
                    return originalInitializer.call(instance, init);
                };
            }
            ret.push(init);
        }
        if (kind !== 0) {
            if (kind === 1) {
                desc.get = value.get;
                desc.set = value.set;
            } else if (kind === 2) {
                desc.value = value;
            } else if (kind === 3) {
                desc.get = value;
            } else if (kind === 4) {
                desc.set = value;
            }
            if (isPrivate) {
                if (kind === 1) {
                    ret.push(function(instance, args) {
                        return value.get.call(instance, args);
                    });
                    ret.push(function(instance, args) {
                        return value.set.call(instance, args);
                    });
                } else if (kind === 2) {
                    ret.push(value);
                } else {
                    ret.push(function(instance, args) {
                        return value.call(instance, args);
                    });
                }
            } else {
                Object.defineProperty(base, name, desc);
            }
        }
    }
    function applyMemberDecs(Class, decInfos, metadata) {
        var ret = [];
        var protoInitializers;
        var staticInitializers;
        var existingProtoNonFields = new Map();
        var existingStaticNonFields = new Map();
        for(var i = 0; i < decInfos.length; i++){
            var decInfo = decInfos[i];
            if (!Array.isArray(decInfo)) continue;
            var kind = decInfo[1];
            var name = decInfo[2];
            var isPrivate = decInfo.length > 3;
            var isStatic = kind >= 5;
            var base;
            var initializers;
            if (isStatic) {
                base = Class;
                kind = kind - 5;
                staticInitializers = staticInitializers || [];
                initializers = staticInitializers;
            } else {
                base = Class.prototype;
                protoInitializers = protoInitializers || [];
                initializers = protoInitializers;
            }
            if (kind !== 0 && !isPrivate) {
                var existingNonFields = isStatic ? existingStaticNonFields : existingProtoNonFields;
                var existingKind = existingNonFields.get(name) || 0;
                if (existingKind === true || existingKind === 3 && kind !== 4 || existingKind === 4 && kind !== 3) {
                    throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: " + name);
                } else if (!existingKind && kind > 2) {
                    existingNonFields.set(name, kind);
                } else {
                    existingNonFields.set(name, true);
                }
            }
            applyMemberDec(ret, base, decInfo, name, kind, isStatic, isPrivate, initializers, metadata);
        }
        pushInitializers(ret, protoInitializers);
        pushInitializers(ret, staticInitializers);
        return ret;
    }
    function pushInitializers(ret, initializers) {
        if (initializers) {
            ret.push(function(instance) {
                for(var i = 0; i < initializers.length; i++){
                    initializers[i].call(instance);
                }
                return instance;
            });
        }
    }
    function applyClassDecs(targetClass, classDecs, metadata) {
        if (classDecs.length > 0) {
            var initializers = [];
            var newClass = targetClass;
            var name = targetClass.name;
            for(var i = classDecs.length - 1; i >= 0; i--){
                var decoratorFinishedRef = {
                    v: false
                };
                try {
                    var nextNewClass = classDecs[i](newClass, {
                        kind: "class",
                        name: name,
                        addInitializer: createAddInitializerMethod(initializers, decoratorFinishedRef),
                        metadata
                    });
                } finally{
                    decoratorFinishedRef.v = true;
                }
                if (nextNewClass !== undefined) {
                    assertValidReturnValue(10, nextNewClass);
                    newClass = nextNewClass;
                }
            }
            return [
                defineMetadata(newClass, metadata),
                function() {
                    for(var i = 0; i < initializers.length; i++){
                        initializers[i].call(newClass);
                    }
                }
            ];
        }
    }
    function defineMetadata(Class, metadata) {
        return Object.defineProperty(Class, Symbol.metadata || Symbol.for("Symbol.metadata"), {
            configurable: true,
            enumerable: true,
            value: metadata
        });
    }
    return function applyDecs2203R(targetClass, memberDecs, classDecs, parentClass) {
        if (parentClass !== void 0) {
            var parentMetadata = parentClass[Symbol.metadata || Symbol.for("Symbol.metadata")];
        }
        var metadata = Object.create(parentMetadata === void 0 ? null : parentMetadata);
        var e = applyMemberDecs(targetClass, memberDecs, metadata);
        if (!classDecs.length) defineMetadata(targetClass, metadata);
        return {
            e: e,
            get c () {
                return applyClassDecs(targetClass, classDecs, metadata);
            }
        };
    };
}
function _apply_decs_2203_r$1(targetClass, memberDecs, classDecs, parentClass) {
    return (_apply_decs_2203_r$1 = applyDecs2203RFactory$1())(targetClass, memberDecs, classDecs, parentClass);
}
var _initProto$1;
/**
 * ContextChatEngine uses the Index to get the appropriate context for each query.
 * The context is stored in the system prompt, and the chat history is chunk,
 * allowing the appropriate context to be surfaced for each query.
 */ class ContextChatEngine extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$prompts$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PromptMixin"] {
    static{
        ({ e: [_initProto$1] } = _apply_decs_2203_r$1(this, [
            [
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$decorator$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["wrapEventCaller"],
                2,
                "chat"
            ]
        ], []));
    }
    get chatHistory() {
        return this.memory.getLLM();
    }
    constructor(init){
        super(), _initProto$1(this);
        this.chatModel = init.chatModel ?? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Settings"].llm;
        this.memory = init?.chatHistory instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$memory$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Memory"] ? init.chatHistory : (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$memory$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createMemory"])(init?.chatHistory ?? []);
        this.contextGenerator = new DefaultContextGenerator({
            retriever: init.retriever,
            contextSystemPrompt: init?.contextSystemPrompt,
            nodePostprocessors: init?.nodePostprocessors,
            contextRole: init?.contextRole,
            metadataMode: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$schema$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["MetadataMode"].LLM
        });
        this.systemPrompt = init.systemPrompt;
    }
    _getPrompts() {
        return {
            ...this.contextGenerator.getPrompts()
        };
    }
    _updatePrompts(prompts) {
        this.contextGenerator.updatePrompts(prompts);
    }
    _getPromptModules() {
        return {
            contextGenerator: this.contextGenerator
        };
    }
    async chat(params) {
        const { message, stream } = params;
        const chatHistory = params.chatHistory ? params.chatHistory instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$memory$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Memory"] ? params.chatHistory : (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$memory$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createMemory"])(params.chatHistory) : this.memory;
        const requestMessages = await this.prepareRequestMessages(message, chatHistory);
        if (stream) {
            const stream = await this.chatModel.chat({
                messages: requestMessages.messages,
                stream: true,
                additionalChatOptions: params.chatOptions
            });
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$utils$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["streamConverter"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$utils$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["streamReducer"])({
                stream,
                initialValue: "",
                reducer: (accumulator, part)=>accumulator += part.delta,
                finished: (accumulator)=>{
                    void chatHistory.add({
                        content: accumulator,
                        role: "assistant"
                    });
                }
            }), (r)=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$schema$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["EngineResponse"].fromChatResponseChunk(r, requestMessages.nodes));
        }
        const response = await this.chatModel.chat({
            messages: requestMessages.messages,
            additionalChatOptions: params.chatOptions
        });
        await chatHistory.add(response.message);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$schema$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["EngineResponse"].fromChatResponse(response, requestMessages.nodes);
    }
    async reset() {
        await this.memory.clear();
    }
    async prepareRequestMessages(message, chatHistory) {
        await chatHistory.add({
            content: message,
            role: "user"
        });
        const textOnly = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$utils$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["extractText"])(message);
        const context = await this.contextGenerator.generate(textOnly);
        const systemMessage = this.prependSystemPrompt(context.message);
        const messages = await chatHistory.getLLM(this.chatModel, [
            systemMessage
        ]);
        return {
            nodes: context.nodes,
            messages
        };
    }
    prependSystemPrompt(message) {
        if (!this.systemPrompt) return message;
        return {
            ...message,
            content: this.systemPrompt.trim() + "\n" + (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$utils$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["extractText"])(message.content)
        };
    }
}
function applyDecs2203RFactory() {
    function createAddInitializerMethod(initializers, decoratorFinishedRef) {
        return function addInitializer(initializer) {
            assertNotFinished(decoratorFinishedRef, "addInitializer");
            assertCallable(initializer, "An initializer");
            initializers.push(initializer);
        };
    }
    function memberDec(dec, name, desc, initializers, kind, isStatic, isPrivate, metadata, value) {
        var kindStr;
        switch(kind){
            case 1:
                kindStr = "accessor";
                break;
            case 2:
                kindStr = "method";
                break;
            case 3:
                kindStr = "getter";
                break;
            case 4:
                kindStr = "setter";
                break;
            default:
                kindStr = "field";
        }
        var ctx = {
            kind: kindStr,
            name: isPrivate ? "#" + name : name,
            static: isStatic,
            private: isPrivate,
            metadata: metadata
        };
        var decoratorFinishedRef = {
            v: false
        };
        ctx.addInitializer = createAddInitializerMethod(initializers, decoratorFinishedRef);
        var get, set;
        if (kind === 0) {
            if (isPrivate) {
                get = desc.get;
                set = desc.set;
            } else {
                get = function() {
                    return this[name];
                };
                set = function(v) {
                    this[name] = v;
                };
            }
        } else if (kind === 2) {
            get = function() {
                return desc.value;
            };
        } else {
            if (kind === 1 || kind === 3) {
                get = function() {
                    return desc.get.call(this);
                };
            }
            if (kind === 1 || kind === 4) {
                set = function(v) {
                    desc.set.call(this, v);
                };
            }
        }
        ctx.access = get && set ? {
            get: get,
            set: set
        } : get ? {
            get: get
        } : {
            set: set
        };
        try {
            return dec(value, ctx);
        } finally{
            decoratorFinishedRef.v = true;
        }
    }
    function assertNotFinished(decoratorFinishedRef, fnName) {
        if (decoratorFinishedRef.v) {
            throw new Error("attempted to call " + fnName + " after decoration was finished");
        }
    }
    function assertCallable(fn, hint) {
        if (typeof fn !== "function") {
            throw new TypeError(hint + " must be a function");
        }
    }
    function assertValidReturnValue(kind, value) {
        var type = typeof value;
        if (kind === 1) {
            if (type !== "object" || value === null) {
                throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");
            }
            if (value.get !== undefined) {
                assertCallable(value.get, "accessor.get");
            }
            if (value.set !== undefined) {
                assertCallable(value.set, "accessor.set");
            }
            if (value.init !== undefined) {
                assertCallable(value.init, "accessor.init");
            }
        } else if (type !== "function") {
            var hint;
            if (kind === 0) {
                hint = "field";
            } else if (kind === 10) {
                hint = "class";
            } else {
                hint = "method";
            }
            throw new TypeError(hint + " decorators must return a function or void 0");
        }
    }
    function applyMemberDec(ret, base, decInfo, name, kind, isStatic, isPrivate, initializers, metadata) {
        var decs = decInfo[0];
        var desc, init, value;
        if (isPrivate) {
            if (kind === 0 || kind === 1) {
                desc = {
                    get: decInfo[3],
                    set: decInfo[4]
                };
            } else if (kind === 3) {
                desc = {
                    get: decInfo[3]
                };
            } else if (kind === 4) {
                desc = {
                    set: decInfo[3]
                };
            } else {
                desc = {
                    value: decInfo[3]
                };
            }
        } else if (kind !== 0) {
            desc = Object.getOwnPropertyDescriptor(base, name);
        }
        if (kind === 1) {
            value = {
                get: desc.get,
                set: desc.set
            };
        } else if (kind === 2) {
            value = desc.value;
        } else if (kind === 3) {
            value = desc.get;
        } else if (kind === 4) {
            value = desc.set;
        }
        var newValue, get, set;
        if (typeof decs === "function") {
            newValue = memberDec(decs, name, desc, initializers, kind, isStatic, isPrivate, metadata, value);
            if (newValue !== void 0) {
                assertValidReturnValue(kind, newValue);
                if (kind === 0) {
                    init = newValue;
                } else if (kind === 1) {
                    init = newValue.init;
                    get = newValue.get || value.get;
                    set = newValue.set || value.set;
                    value = {
                        get: get,
                        set: set
                    };
                } else {
                    value = newValue;
                }
            }
        } else {
            for(var i = decs.length - 1; i >= 0; i--){
                var dec = decs[i];
                newValue = memberDec(dec, name, desc, initializers, kind, isStatic, isPrivate, metadata, value);
                if (newValue !== void 0) {
                    assertValidReturnValue(kind, newValue);
                    var newInit;
                    if (kind === 0) {
                        newInit = newValue;
                    } else if (kind === 1) {
                        newInit = newValue.init;
                        get = newValue.get || value.get;
                        set = newValue.set || value.set;
                        value = {
                            get: get,
                            set: set
                        };
                    } else {
                        value = newValue;
                    }
                    if (newInit !== void 0) {
                        if (init === void 0) {
                            init = newInit;
                        } else if (typeof init === "function") {
                            init = [
                                init,
                                newInit
                            ];
                        } else {
                            init.push(newInit);
                        }
                    }
                }
            }
        }
        if (kind === 0 || kind === 1) {
            if (init === void 0) {
                init = function(instance, init) {
                    return init;
                };
            } else if (typeof init !== "function") {
                var ownInitializers = init;
                init = function(instance, init) {
                    var value = init;
                    for(var i = 0; i < ownInitializers.length; i++){
                        value = ownInitializers[i].call(instance, value);
                    }
                    return value;
                };
            } else {
                var originalInitializer = init;
                init = function(instance, init) {
                    return originalInitializer.call(instance, init);
                };
            }
            ret.push(init);
        }
        if (kind !== 0) {
            if (kind === 1) {
                desc.get = value.get;
                desc.set = value.set;
            } else if (kind === 2) {
                desc.value = value;
            } else if (kind === 3) {
                desc.get = value;
            } else if (kind === 4) {
                desc.set = value;
            }
            if (isPrivate) {
                if (kind === 1) {
                    ret.push(function(instance, args) {
                        return value.get.call(instance, args);
                    });
                    ret.push(function(instance, args) {
                        return value.set.call(instance, args);
                    });
                } else if (kind === 2) {
                    ret.push(value);
                } else {
                    ret.push(function(instance, args) {
                        return value.call(instance, args);
                    });
                }
            } else {
                Object.defineProperty(base, name, desc);
            }
        }
    }
    function applyMemberDecs(Class, decInfos, metadata) {
        var ret = [];
        var protoInitializers;
        var staticInitializers;
        var existingProtoNonFields = new Map();
        var existingStaticNonFields = new Map();
        for(var i = 0; i < decInfos.length; i++){
            var decInfo = decInfos[i];
            if (!Array.isArray(decInfo)) continue;
            var kind = decInfo[1];
            var name = decInfo[2];
            var isPrivate = decInfo.length > 3;
            var isStatic = kind >= 5;
            var base;
            var initializers;
            if (isStatic) {
                base = Class;
                kind = kind - 5;
                staticInitializers = staticInitializers || [];
                initializers = staticInitializers;
            } else {
                base = Class.prototype;
                protoInitializers = protoInitializers || [];
                initializers = protoInitializers;
            }
            if (kind !== 0 && !isPrivate) {
                var existingNonFields = isStatic ? existingStaticNonFields : existingProtoNonFields;
                var existingKind = existingNonFields.get(name) || 0;
                if (existingKind === true || existingKind === 3 && kind !== 4 || existingKind === 4 && kind !== 3) {
                    throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: " + name);
                } else if (!existingKind && kind > 2) {
                    existingNonFields.set(name, kind);
                } else {
                    existingNonFields.set(name, true);
                }
            }
            applyMemberDec(ret, base, decInfo, name, kind, isStatic, isPrivate, initializers, metadata);
        }
        pushInitializers(ret, protoInitializers);
        pushInitializers(ret, staticInitializers);
        return ret;
    }
    function pushInitializers(ret, initializers) {
        if (initializers) {
            ret.push(function(instance) {
                for(var i = 0; i < initializers.length; i++){
                    initializers[i].call(instance);
                }
                return instance;
            });
        }
    }
    function applyClassDecs(targetClass, classDecs, metadata) {
        if (classDecs.length > 0) {
            var initializers = [];
            var newClass = targetClass;
            var name = targetClass.name;
            for(var i = classDecs.length - 1; i >= 0; i--){
                var decoratorFinishedRef = {
                    v: false
                };
                try {
                    var nextNewClass = classDecs[i](newClass, {
                        kind: "class",
                        name: name,
                        addInitializer: createAddInitializerMethod(initializers, decoratorFinishedRef),
                        metadata
                    });
                } finally{
                    decoratorFinishedRef.v = true;
                }
                if (nextNewClass !== undefined) {
                    assertValidReturnValue(10, nextNewClass);
                    newClass = nextNewClass;
                }
            }
            return [
                defineMetadata(newClass, metadata),
                function() {
                    for(var i = 0; i < initializers.length; i++){
                        initializers[i].call(newClass);
                    }
                }
            ];
        }
    }
    function defineMetadata(Class, metadata) {
        return Object.defineProperty(Class, Symbol.metadata || Symbol.for("Symbol.metadata"), {
            configurable: true,
            enumerable: true,
            value: metadata
        });
    }
    return function applyDecs2203R(targetClass, memberDecs, classDecs, parentClass) {
        if (parentClass !== void 0) {
            var parentMetadata = parentClass[Symbol.metadata || Symbol.for("Symbol.metadata")];
        }
        var metadata = Object.create(parentMetadata === void 0 ? null : parentMetadata);
        var e = applyMemberDecs(targetClass, memberDecs, metadata);
        if (!classDecs.length) defineMetadata(targetClass, metadata);
        return {
            e: e,
            get c () {
                return applyClassDecs(targetClass, classDecs, metadata);
            }
        };
    };
}
function _apply_decs_2203_r(targetClass, memberDecs, classDecs, parentClass) {
    return (_apply_decs_2203_r = applyDecs2203RFactory())(targetClass, memberDecs, classDecs, parentClass);
}
var _initProto;
/**
 * SimpleChatEngine is the simplest possible chat engine. Useful for using your own custom prompts.
 */ class SimpleChatEngine {
    static{
        ({ e: [_initProto] } = _apply_decs_2203_r(this, [
            [
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$decorator$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["wrapEventCaller"],
                2,
                "chat"
            ]
        ], []));
    }
    get chatHistory() {
        return this.memory.getLLM();
    }
    constructor(init){
        _initProto(this);
        this.llm = init?.llm ?? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Settings"].llm;
        this.memory = init?.memory ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$memory$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createMemory"])();
    }
    async chat(params) {
        const { message, stream } = params;
        const chatHistory = params.chatHistory ? params.chatHistory instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$memory$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Memory"] ? params.chatHistory : (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$memory$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createMemory"])(params.chatHistory) : this.memory;
        await chatHistory.add({
            content: message,
            role: "user"
        });
        if (stream) {
            const stream = await this.llm.chat({
                messages: await chatHistory.getLLM(this.llm),
                stream: true
            });
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$utils$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["streamConverter"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$utils$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["streamReducer"])({
                stream,
                initialValue: "",
                reducer: (accumulator, part)=>accumulator + part.delta,
                finished: (accumulator)=>{
                    void chatHistory.add({
                        content: accumulator,
                        role: "assistant"
                    });
                }
            }), __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$schema$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["EngineResponse"].fromChatResponseChunk);
        }
        const response = await this.llm.chat({
            stream: false,
            messages: await chatHistory.getLLM(this.llm)
        });
        await chatHistory.add(response.message);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$schema$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["EngineResponse"].fromChatResponse(response);
    }
    async reset() {
        await this.memory.clear();
    }
}
;
}}),
"[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/agent/dist/index.js [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "AgentRunner": (()=>AgentRunner),
    "AgentWorker": (()=>AgentWorker),
    "LLMAgent": (()=>LLMAgent),
    "LLMAgentWorker": (()=>LLMAgentWorker),
    "callTool": (()=>callTool),
    "consumeAsyncIterable": (()=>consumeAsyncIterable),
    "createReadableStream": (()=>createReadableStream),
    "stepTools": (()=>stepTools),
    "stepToolsStreaming": (()=>stepToolsStreaming),
    "validateAgentParams": (()=>validateAgentParams)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$env$40$0$2e$1$2e$30$2f$node_modules$2f40$llamaindex$2f$env$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+env@0.1.30/node_modules/@llamaindex/env/dist/index.js [app-route] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$env$40$0$2e$1$2e$30$2f$node_modules$2f40$llamaindex$2f$env$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+env@0.1.30/node_modules/@llamaindex/env/dist/index.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:crypto [external] (node:crypto, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$chat$2d$engine$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/chat-engine/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$decorator$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/decorator/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/global/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$memory$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/memory/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$schema$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/schema/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zod@3.25.76/node_modules/zod/v3/external.js [app-route] (ecmascript) <export * as z>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$utils$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/utils/dist/index.js [app-route] (ecmascript)");
;
;
;
;
;
;
;
;
// #TODO stepTools and stepToolsStreaming should be moved to a better abstraction
async function stepToolsStreaming({ response, tools, step, enqueueOutput }) {
    const responseChunkStream = new ReadableStream({
        async start (controller) {
            for await (const chunk of response){
                controller.enqueue(chunk);
            }
            controller.close();
        }
    });
    const [pipStream, finalStream] = responseChunkStream.tee();
    const reader = pipStream.getReader();
    const { value } = await reader.read();
    reader.releaseLock();
    if (value === undefined) {
        throw new Error("first chunk value is undefined, this should not happen");
    }
    // check if first chunk has tool calls, if so, this is a function call
    // otherwise, it's a regular message
    const hasToolCall = !!(value.options && "toolCall" in value.options);
    enqueueOutput({
        taskStep: step,
        output: finalStream,
        isLast: !hasToolCall
    });
    if (hasToolCall) {
        // you need to consume the response to get the full toolCalls
        const toolCalls = new Map();
        for await (const chunk of pipStream){
            if (chunk.options && "toolCall" in chunk.options) {
                const toolCall = chunk.options.toolCall;
                toolCall.forEach((toolCall)=>{
                    toolCalls.set(toolCall.id, toolCall);
                });
            }
        }
        // If there are toolCalls, but they didn't get read into the stream, used for Gemini
        if (!toolCalls.size && value.options && "toolCall" in value.options) {
            value.options.toolCall.forEach((toolCall)=>{
                toolCalls.set(toolCall.id, toolCall);
            });
        }
        step.context.store.messages = [
            ...step.context.store.messages,
            {
                role: "assistant",
                content: "",
                options: {
                    toolCall: [
                        ...toolCalls.values()
                    ]
                }
            }
        ];
        for (const toolCall of toolCalls.values()){
            const targetTool = tools.find((tool)=>tool.metadata.name === toolCall.name);
            const toolOutput = await callTool(targetTool, toolCall, step.context.logger);
            step.context.store.messages = [
                ...step.context.store.messages,
                {
                    role: "user",
                    content: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$utils$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["stringifyJSONToMessageContent"])(toolOutput.output),
                    options: {
                        toolResult: {
                            result: toolOutput.output,
                            isError: toolOutput.isError,
                            id: toolCall.id
                        }
                    }
                }
            ];
            step.context.store.toolOutputs.push(toolOutput);
        }
    }
}
async function stepTools({ response, tools, step, enqueueOutput }) {
    step.context.store.messages = [
        ...step.context.store.messages,
        response.message
    ];
    const options = response.message.options ?? {};
    enqueueOutput({
        taskStep: step,
        output: response,
        isLast: !("toolCall" in options)
    });
    if ("toolCall" in options) {
        const { toolCall } = options;
        for (const call of toolCall){
            const targetTool = tools.find((tool)=>tool.metadata.name === call.name);
            const toolOutput = await callTool(targetTool, call, step.context.logger);
            step.context.store.toolOutputs.push(toolOutput);
            step.context.store.messages = [
                ...step.context.store.messages,
                {
                    content: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$utils$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["stringifyJSONToMessageContent"])(toolOutput.output),
                    role: "user",
                    options: {
                        toolResult: {
                            result: toolOutput.output,
                            isError: toolOutput.isError,
                            id: call.id
                        }
                    }
                }
            ];
        }
    }
}
async function callTool(tool, toolCall, logger) {
    let input;
    if (typeof toolCall.input === "string") {
        try {
            input = JSON.parse(toolCall.input);
        } catch (e) {
            const output = `Tool ${toolCall.name} can't be called. Input is not a valid JSON object.`;
            logger.error(`${output} Try increasing the maxTokens parameter of your LLM. Invalid Input: ${toolCall.input}`);
            return {
                tool,
                input: {},
                output,
                isError: true
            };
        }
    } else {
        input = toolCall.input;
    }
    if (!tool) {
        logger.error(`Tool ${toolCall.name} does not exist.`);
        const output = `Tool ${toolCall.name} does not exist.`;
        return {
            tool,
            input,
            output,
            isError: true
        };
    }
    const call = tool.call;
    let output;
    if (!call) {
        logger.error(`Tool ${tool.metadata.name} (remote:${toolCall.name}) does not have a implementation.`);
        output = `Tool ${tool.metadata.name} (remote:${toolCall.name}) does not have a implementation.`;
        return {
            tool,
            input,
            output,
            isError: true
        };
    }
    try {
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Settings"].callbackManager.dispatchEvent("llm-tool-call", {
            toolCall: {
                ...toolCall,
                input
            }
        });
        output = await call.call(tool, input);
        logger.log(`Tool ${tool.metadata.name} (remote:${toolCall.name}) succeeded.`);
        logger.log(`Output: ${JSON.stringify(output)}`);
        const toolOutput = {
            tool,
            input,
            output,
            isError: false
        };
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Settings"].callbackManager.dispatchEvent("llm-tool-result", {
            toolCall: {
                ...toolCall,
                input
            },
            toolResult: {
                ...toolOutput
            }
        });
        return toolOutput;
    } catch (e) {
        output = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$utils$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prettifyError"])(e);
        logger.error(`Tool ${tool.metadata.name} (remote:${toolCall.name}) failed: ${output}`);
    }
    return {
        tool,
        input,
        output,
        isError: true
    };
}
async function consumeAsyncIterable(input, previousContent = "") {
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$utils$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isAsyncIterable"])(input)) {
        const result = {
            content: previousContent,
            // only assistant will give streaming response
            role: "assistant",
            options: {}
        };
        for await (const chunk of input){
            result.content += chunk.delta;
            if (chunk.options) {
                result.options = {
                    ...result.options,
                    ...chunk.options
                };
            }
        }
        return result;
    } else {
        return input;
    }
}
function createReadableStream(asyncIterable) {
    return new ReadableStream({
        async start (controller) {
            for await (const chunk of asyncIterable){
                controller.enqueue(chunk);
            }
            controller.close();
        }
    });
}
function validateAgentParams(params) {
    if ("tools" in params) {
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].array(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$schema$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["baseToolWithCallSchema"]).parse(params.tools);
    }
}
function applyDecs2203RFactory() {
    function createAddInitializerMethod(initializers, decoratorFinishedRef) {
        return function addInitializer(initializer) {
            assertNotFinished(decoratorFinishedRef, "addInitializer");
            assertCallable(initializer, "An initializer");
            initializers.push(initializer);
        };
    }
    function memberDec(dec, name, desc, initializers, kind, isStatic, isPrivate, metadata, value) {
        var kindStr;
        switch(kind){
            case 1:
                kindStr = "accessor";
                break;
            case 2:
                kindStr = "method";
                break;
            case 3:
                kindStr = "getter";
                break;
            case 4:
                kindStr = "setter";
                break;
            default:
                kindStr = "field";
        }
        var ctx = {
            kind: kindStr,
            name: isPrivate ? "#" + name : name,
            static: isStatic,
            private: isPrivate,
            metadata: metadata
        };
        var decoratorFinishedRef = {
            v: false
        };
        ctx.addInitializer = createAddInitializerMethod(initializers, decoratorFinishedRef);
        var get, set;
        if (kind === 0) {
            if (isPrivate) {
                get = desc.get;
                set = desc.set;
            } else {
                get = function() {
                    return this[name];
                };
                set = function(v) {
                    this[name] = v;
                };
            }
        } else if (kind === 2) {
            get = function() {
                return desc.value;
            };
        } else {
            if (kind === 1 || kind === 3) {
                get = function() {
                    return desc.get.call(this);
                };
            }
            if (kind === 1 || kind === 4) {
                set = function(v) {
                    desc.set.call(this, v);
                };
            }
        }
        ctx.access = get && set ? {
            get: get,
            set: set
        } : get ? {
            get: get
        } : {
            set: set
        };
        try {
            return dec(value, ctx);
        } finally{
            decoratorFinishedRef.v = true;
        }
    }
    function assertNotFinished(decoratorFinishedRef, fnName) {
        if (decoratorFinishedRef.v) {
            throw new Error("attempted to call " + fnName + " after decoration was finished");
        }
    }
    function assertCallable(fn, hint) {
        if (typeof fn !== "function") {
            throw new TypeError(hint + " must be a function");
        }
    }
    function assertValidReturnValue(kind, value) {
        var type = typeof value;
        if (kind === 1) {
            if (type !== "object" || value === null) {
                throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");
            }
            if (value.get !== undefined) {
                assertCallable(value.get, "accessor.get");
            }
            if (value.set !== undefined) {
                assertCallable(value.set, "accessor.set");
            }
            if (value.init !== undefined) {
                assertCallable(value.init, "accessor.init");
            }
        } else if (type !== "function") {
            var hint;
            if (kind === 0) {
                hint = "field";
            } else if (kind === 10) {
                hint = "class";
            } else {
                hint = "method";
            }
            throw new TypeError(hint + " decorators must return a function or void 0");
        }
    }
    function applyMemberDec(ret, base, decInfo, name, kind, isStatic, isPrivate, initializers, metadata) {
        var decs = decInfo[0];
        var desc, init, value;
        if (isPrivate) {
            if (kind === 0 || kind === 1) {
                desc = {
                    get: decInfo[3],
                    set: decInfo[4]
                };
            } else if (kind === 3) {
                desc = {
                    get: decInfo[3]
                };
            } else if (kind === 4) {
                desc = {
                    set: decInfo[3]
                };
            } else {
                desc = {
                    value: decInfo[3]
                };
            }
        } else if (kind !== 0) {
            desc = Object.getOwnPropertyDescriptor(base, name);
        }
        if (kind === 1) {
            value = {
                get: desc.get,
                set: desc.set
            };
        } else if (kind === 2) {
            value = desc.value;
        } else if (kind === 3) {
            value = desc.get;
        } else if (kind === 4) {
            value = desc.set;
        }
        var newValue, get, set;
        if (typeof decs === "function") {
            newValue = memberDec(decs, name, desc, initializers, kind, isStatic, isPrivate, metadata, value);
            if (newValue !== void 0) {
                assertValidReturnValue(kind, newValue);
                if (kind === 0) {
                    init = newValue;
                } else if (kind === 1) {
                    init = newValue.init;
                    get = newValue.get || value.get;
                    set = newValue.set || value.set;
                    value = {
                        get: get,
                        set: set
                    };
                } else {
                    value = newValue;
                }
            }
        } else {
            for(var i = decs.length - 1; i >= 0; i--){
                var dec = decs[i];
                newValue = memberDec(dec, name, desc, initializers, kind, isStatic, isPrivate, metadata, value);
                if (newValue !== void 0) {
                    assertValidReturnValue(kind, newValue);
                    var newInit;
                    if (kind === 0) {
                        newInit = newValue;
                    } else if (kind === 1) {
                        newInit = newValue.init;
                        get = newValue.get || value.get;
                        set = newValue.set || value.set;
                        value = {
                            get: get,
                            set: set
                        };
                    } else {
                        value = newValue;
                    }
                    if (newInit !== void 0) {
                        if (init === void 0) {
                            init = newInit;
                        } else if (typeof init === "function") {
                            init = [
                                init,
                                newInit
                            ];
                        } else {
                            init.push(newInit);
                        }
                    }
                }
            }
        }
        if (kind === 0 || kind === 1) {
            if (init === void 0) {
                init = function(instance, init) {
                    return init;
                };
            } else if (typeof init !== "function") {
                var ownInitializers = init;
                init = function(instance, init) {
                    var value = init;
                    for(var i = 0; i < ownInitializers.length; i++){
                        value = ownInitializers[i].call(instance, value);
                    }
                    return value;
                };
            } else {
                var originalInitializer = init;
                init = function(instance, init) {
                    return originalInitializer.call(instance, init);
                };
            }
            ret.push(init);
        }
        if (kind !== 0) {
            if (kind === 1) {
                desc.get = value.get;
                desc.set = value.set;
            } else if (kind === 2) {
                desc.value = value;
            } else if (kind === 3) {
                desc.get = value;
            } else if (kind === 4) {
                desc.set = value;
            }
            if (isPrivate) {
                if (kind === 1) {
                    ret.push(function(instance, args) {
                        return value.get.call(instance, args);
                    });
                    ret.push(function(instance, args) {
                        return value.set.call(instance, args);
                    });
                } else if (kind === 2) {
                    ret.push(value);
                } else {
                    ret.push(function(instance, args) {
                        return value.call(instance, args);
                    });
                }
            } else {
                Object.defineProperty(base, name, desc);
            }
        }
    }
    function applyMemberDecs(Class, decInfos, metadata) {
        var ret = [];
        var protoInitializers;
        var staticInitializers;
        var existingProtoNonFields = new Map();
        var existingStaticNonFields = new Map();
        for(var i = 0; i < decInfos.length; i++){
            var decInfo = decInfos[i];
            if (!Array.isArray(decInfo)) continue;
            var kind = decInfo[1];
            var name = decInfo[2];
            var isPrivate = decInfo.length > 3;
            var isStatic = kind >= 5;
            var base;
            var initializers;
            if (isStatic) {
                base = Class;
                kind = kind - 5;
                staticInitializers = staticInitializers || [];
                initializers = staticInitializers;
            } else {
                base = Class.prototype;
                protoInitializers = protoInitializers || [];
                initializers = protoInitializers;
            }
            if (kind !== 0 && !isPrivate) {
                var existingNonFields = isStatic ? existingStaticNonFields : existingProtoNonFields;
                var existingKind = existingNonFields.get(name) || 0;
                if (existingKind === true || existingKind === 3 && kind !== 4 || existingKind === 4 && kind !== 3) {
                    throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: " + name);
                } else if (!existingKind && kind > 2) {
                    existingNonFields.set(name, kind);
                } else {
                    existingNonFields.set(name, true);
                }
            }
            applyMemberDec(ret, base, decInfo, name, kind, isStatic, isPrivate, initializers, metadata);
        }
        pushInitializers(ret, protoInitializers);
        pushInitializers(ret, staticInitializers);
        return ret;
    }
    function pushInitializers(ret, initializers) {
        if (initializers) {
            ret.push(function(instance) {
                for(var i = 0; i < initializers.length; i++){
                    initializers[i].call(instance);
                }
                return instance;
            });
        }
    }
    function applyClassDecs(targetClass, classDecs, metadata) {
        if (classDecs.length > 0) {
            var initializers = [];
            var newClass = targetClass;
            var name = targetClass.name;
            for(var i = classDecs.length - 1; i >= 0; i--){
                var decoratorFinishedRef = {
                    v: false
                };
                try {
                    var nextNewClass = classDecs[i](newClass, {
                        kind: "class",
                        name: name,
                        addInitializer: createAddInitializerMethod(initializers, decoratorFinishedRef),
                        metadata
                    });
                } finally{
                    decoratorFinishedRef.v = true;
                }
                if (nextNewClass !== undefined) {
                    assertValidReturnValue(10, nextNewClass);
                    newClass = nextNewClass;
                }
            }
            return [
                defineMetadata(newClass, metadata),
                function() {
                    for(var i = 0; i < initializers.length; i++){
                        initializers[i].call(newClass);
                    }
                }
            ];
        }
    }
    function defineMetadata(Class, metadata) {
        return Object.defineProperty(Class, Symbol.metadata || Symbol.for("Symbol.metadata"), {
            configurable: true,
            enumerable: true,
            value: metadata
        });
    }
    return function applyDecs2203R(targetClass, memberDecs, classDecs, parentClass) {
        if (parentClass !== void 0) {
            var parentMetadata = parentClass[Symbol.metadata || Symbol.for("Symbol.metadata")];
        }
        var metadata = Object.create(parentMetadata === void 0 ? null : parentMetadata);
        var e = applyMemberDecs(targetClass, memberDecs, metadata);
        if (!classDecs.length) defineMetadata(targetClass, metadata);
        return {
            e: e,
            get c () {
                return applyClassDecs(targetClass, classDecs, metadata);
            }
        };
    };
}
function _apply_decs_2203_r(targetClass, memberDecs, classDecs, parentClass) {
    return (_apply_decs_2203_r = applyDecs2203RFactory())(targetClass, memberDecs, classDecs, parentClass);
}
var _computedKey, _initProto;
const MAX_TOOL_CALLS = 10;
function createTaskOutputStream(handler, context) {
    const steps = [];
    return new ReadableStream({
        pull: async (controller)=>{
            const step = {
                id: (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["randomUUID"])(),
                context,
                prevStep: null,
                nextSteps: new Set()
            };
            if (steps.length > 0) {
                step.prevStep = steps[steps.length - 1];
            }
            const taskOutputs = [];
            steps.push(step);
            const enqueueOutput = (output)=>{
                context.logger.log("Enqueueing output for step(id, %s).", step.id);
                taskOutputs.push(output);
                controller.enqueue(output);
            };
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Settings"].callbackManager.dispatchEvent("agent-start", {
                startStep: step
            });
            context.logger.log("Starting step(id, %s).", step.id);
            await handler(step, enqueueOutput);
            context.logger.log("Finished step(id, %s).", step.id);
            // fixme: support multi-thread when there are multiple outputs
            // todo: for now we pretend there is only one task output
            const { isLast, taskStep } = taskOutputs[0];
            context = {
                ...taskStep.context,
                store: {
                    ...taskStep.context.store
                },
                toolCallCount: 1
            };
            if (isLast) {
                context.logger.log("Final step(id, %s) reached, closing task.", step.id);
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Settings"].callbackManager.dispatchEvent("agent-end", {
                    endStep: step
                });
                controller.close();
            }
        }
    });
}
_computedKey = Symbol.toStringTag;
/**
 * Worker will schedule tasks and handle the task execution
 * @deprecated Use agent instead.
 */ class AgentWorker {
    #taskSet;
    createTask(query, context) {
        context.store.messages.push({
            role: "user",
            content: query
        });
        const taskOutputStream = createTaskOutputStream(this.taskHandler, context);
        return new ReadableStream({
            pull: async (controller)=>{
                for await (const stepOutput of taskOutputStream){
                    this.#taskSet.add(stepOutput.taskStep);
                    if (stepOutput.isLast) {
                        let currentStep = stepOutput.taskStep;
                        while(currentStep){
                            this.#taskSet.delete(currentStep);
                            currentStep = currentStep.prevStep;
                        }
                        const { output, taskStep } = stepOutput;
                        if (output instanceof ReadableStream) {
                            let content = "";
                            let options = undefined;
                            const transformedStream = output.pipeThrough(new TransformStream({
                                transform (chunk, controller) {
                                    content += chunk.delta;
                                    if (!options && chunk.options) {
                                        options = chunk.options;
                                    }
                                    controller.enqueue(chunk); // Pass the chunk through unchanged
                                },
                                // When stream finishes, store the accumulated message in context
                                flush () {
                                    taskStep.context.store.messages = [
                                        ...taskStep.context.store.messages,
                                        {
                                            role: "assistant",
                                            content,
                                            options
                                        }
                                    ];
                                }
                            }));
                            stepOutput.output = transformedStream;
                        }
                        controller.enqueue(stepOutput);
                        controller.close();
                    } else {
                        controller.enqueue(stepOutput);
                    }
                }
            }
        });
    }
    constructor(){
        this.#taskSet = new Set();
        this[_computedKey] = "AgentWorker";
    }
}
/**
 * Runner will manage the task execution and provide a high-level API for the user
 * @deprecated Use agent instead.
 */ class AgentRunner extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$chat$2d$engine$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BaseChatEngine"] {
    static{
        ({ e: [_initProto] } = _apply_decs_2203_r(this, [
            [
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$decorator$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["wrapEventCaller"],
                2,
                "chat"
            ]
        ], []));
    }
    #llm;
    #tools;
    #systemPrompt;
    #chatHistory;
    #runner;
    #verbose;
    static defaultCreateStore() {
        return Object.create(null);
    }
    static{
        this.defaultTaskHandler = async (step, enqueueOutput)=>{
            const { llm, getTools, stream, additionalChatOptions } = step.context;
            const lastMessage = step.context.store.messages.at(-1).content;
            const tools = await getTools(lastMessage);
            if (!stream) {
                const response = await llm.chat({
                    stream,
                    tools,
                    messages: [
                        ...step.context.store.messages
                    ],
                    additionalChatOptions
                });
                await stepTools({
                    response,
                    tools,
                    step,
                    enqueueOutput
                });
            } else {
                const response = await llm.chat({
                    stream,
                    tools,
                    messages: [
                        ...step.context.store.messages
                    ],
                    additionalChatOptions
                });
                await stepToolsStreaming({
                    response,
                    tools,
                    step,
                    enqueueOutput
                });
            }
        };
    }
    constructor(params){
        super(), this.#systemPrompt = (_initProto(this), null);
        const { llm, chatHistory, systemPrompt, runner, tools, verbose } = params;
        this.#llm = llm;
        this.#chatHistory = chatHistory;
        this.#runner = runner;
        if (systemPrompt) {
            this.#systemPrompt = systemPrompt;
        }
        this.#tools = tools;
        this.#verbose = verbose;
    }
    get llm() {
        return this.#llm;
    }
    get chatHistory() {
        return this.#chatHistory;
    }
    get verbose() {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Settings"].debug || this.#verbose;
    }
    reset() {
        this.#chatHistory = [];
    }
    getTools(query) {
        return typeof this.#tools === "function" ? this.#tools(query) : this.#tools;
    }
    static shouldContinue(task) {
        return task.context.toolCallCount < MAX_TOOL_CALLS;
    }
    createTask(message, stream = false, verbose = undefined, chatHistory, additionalChatOptions) {
        const initialMessages = [
            ...chatHistory ?? this.#chatHistory
        ];
        if (this.#systemPrompt !== null) {
            const systemPrompt = this.#systemPrompt;
            const alreadyHasSystemPrompt = initialMessages.filter((msg)=>msg.role === "system").some((msg)=>Object.is(msg.content, systemPrompt));
            if (!alreadyHasSystemPrompt) {
                initialMessages.push({
                    content: systemPrompt,
                    role: "system"
                });
            }
        }
        return this.#runner.createTask(message, {
            stream,
            toolCallCount: 0,
            llm: this.#llm,
            additionalChatOptions: additionalChatOptions ?? {},
            getTools: (message)=>this.getTools(message),
            store: {
                ...this.createStore(),
                messages: initialMessages,
                toolOutputs: []
            },
            shouldContinue: AgentRunner.shouldContinue,
            logger: verbose === false ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$env$40$0$2e$1$2e$30$2f$node_modules$2f40$llamaindex$2f$env$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["emptyLogger"] : verbose || this.verbose ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$env$40$0$2e$1$2e$30$2f$node_modules$2f40$llamaindex$2f$env$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["consoleLogger"] : __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$env$40$0$2e$1$2e$30$2f$node_modules$2f40$llamaindex$2f$env$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["emptyLogger"]
        });
    }
    async chat(params) {
        let chatHistory = [];
        if (params.chatHistory instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$memory$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BaseMemory"]) {
            chatHistory = await params.chatHistory.getMessages();
        } else {
            chatHistory = params.chatHistory;
        }
        const task = this.createTask(params.message, !!params.stream, false, chatHistory, params.chatOptions);
        for await (const stepOutput of task){
            // update chat history for each round
            this.#chatHistory = [
                ...stepOutput.taskStep.context.store.messages
            ];
            if (stepOutput.isLast) {
                const { output } = stepOutput;
                if (output instanceof ReadableStream) {
                    return output.pipeThrough(new TransformStream({
                        transform (chunk, controller) {
                            controller.enqueue(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$schema$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["EngineResponse"].fromChatResponseChunk(chunk));
                        }
                    }));
                } else {
                    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$schema$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["EngineResponse"].fromChatResponse(output);
                }
            }
        }
        throw new Error("Task ended without a last step.");
    }
}
class LLMAgentWorker extends AgentWorker {
    constructor(...args){
        super(...args), this.taskHandler = AgentRunner.defaultTaskHandler;
    }
}
/**
 * @deprecated Use agent instead.
 */ class LLMAgent extends AgentRunner {
    constructor(params){
        validateAgentParams(params);
        const llm = params.llm ?? (__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Settings"].llm ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Settings"].llm : null);
        if (!llm) throw new Error("llm must be provided for either in params or Settings.llm");
        super({
            llm,
            chatHistory: params.chatHistory ?? [],
            systemPrompt: params.systemPrompt ?? null,
            runner: new LLMAgentWorker(),
            tools: "tools" in params ? params.tools : params.toolRetriever.retrieve.bind(params.toolRetriever),
            verbose: params.verbose ?? false
        }), this.createStore = AgentRunner.defaultCreateStore, this.taskHandler = AgentRunner.defaultTaskHandler;
    }
}
;
}}),
"[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/data-structs/dist/index.js [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "IndexDict": (()=>IndexDict),
    "IndexList": (()=>IndexList),
    "IndexStruct": (()=>IndexStruct),
    "IndexStructType": (()=>IndexStructType),
    "KeywordTable": (()=>KeywordTable),
    "jsonToIndexStruct": (()=>jsonToIndexStruct)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$env$40$0$2e$1$2e$30$2f$node_modules$2f40$llamaindex$2f$env$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+env@0.1.30/node_modules/@llamaindex/env/dist/index.js [app-route] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:crypto [external] (node:crypto, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$schema$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/schema/dist/index.js [app-route] (ecmascript)");
;
;
const IndexStructType = {
    NODE: "node",
    TREE: "tree",
    LIST: "list",
    KEYWORD_TABLE: "keyword_table",
    DICT: "dict",
    SIMPLE_DICT: "simple_dict",
    WEAVIATE: "weaviate",
    PINECONE: "pinecone",
    QDRANT: "qdrant",
    LANCEDB: "lancedb",
    MILVUS: "milvus",
    CHROMA: "chroma",
    MYSCALE: "myscale",
    CLICKHOUSE: "clickhouse",
    VECTOR_STORE: "vector_store",
    OPENSEARCH: "opensearch",
    DASHVECTOR: "dashvector",
    CHATGPT_RETRIEVAL_PLUGIN: "chatgpt_retrieval_plugin",
    DEEPLAKE: "deeplake",
    EPSILLA: "epsilla",
    MULTIMODAL_VECTOR_STORE: "multimodal",
    SQL: "sql",
    KG: "kg",
    SIMPLE_KG: "simple_kg",
    SIMPLE_LPG: "simple_lpg",
    NEBULAGRAPH: "nebulagraph",
    FALKORDB: "falkordb",
    EMPTY: "empty",
    COMPOSITE: "composite",
    PANDAS: "pandas",
    DOCUMENT_SUMMARY: "document_summary",
    VECTARA: "vectara",
    ZILLIZ_CLOUD_PIPELINE: "zilliz_cloud_pipeline",
    POSTGRESML: "postgresml"
};
class IndexStruct {
    constructor(indexId = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["randomUUID"])(), summary = undefined){
        this.indexId = indexId;
        this.summary = summary;
    }
    toJson() {
        return {
            indexId: this.indexId,
            summary: this.summary
        };
    }
    getSummary() {
        if (this.summary === undefined) {
            throw new Error("summary field of the index struct is not set");
        }
        return this.summary;
    }
}
// A table of keywords mapping keywords to text chunks.
class KeywordTable extends IndexStruct {
    addNode(keywords, nodeId) {
        keywords.forEach((keyword)=>{
            if (!this.table.has(keyword)) {
                this.table.set(keyword, new Set());
            }
            this.table.get(keyword).add(nodeId);
        });
    }
    deleteNode(keywords, nodeId) {
        keywords.forEach((keyword)=>{
            if (this.table.has(keyword)) {
                this.table.get(keyword).delete(nodeId);
            }
        });
    }
    toJson() {
        return {
            ...super.toJson(),
            table: Array.from(this.table.entries()).reduce((acc, [keyword, nodeIds])=>{
                acc[keyword] = Array.from(nodeIds);
                return acc;
            }, {}),
            type: this.type
        };
    }
    constructor(...args){
        super(...args), this.table = new Map(), this.type = IndexStructType.KEYWORD_TABLE;
    }
}
class IndexDict extends IndexStruct {
    addNode(node, textId) {
        const vectorId = textId ?? node.id_;
        this.nodesDict[vectorId] = node;
    }
    toJson() {
        const nodesDict = {};
        for (const [key, node] of Object.entries(this.nodesDict)){
            nodesDict[key] = node.toJSON();
        }
        return {
            ...super.toJson(),
            nodesDict,
            type: this.type
        };
    }
    delete(nodeId) {
        delete this.nodesDict[nodeId];
    }
    constructor(...args){
        super(...args), this.nodesDict = {}, this.type = IndexStructType.SIMPLE_DICT;
    }
}
class IndexList extends IndexStruct {
    addNode(node) {
        this.nodes.push(node.id_);
    }
    toJson() {
        return {
            ...super.toJson(),
            nodes: this.nodes,
            type: this.type
        };
    }
    constructor(...args){
        super(...args), this.nodes = [], this.type = IndexStructType.LIST;
    }
}
function jsonToIndexStruct(json) {
    if (json.type === IndexStructType.LIST) {
        const indexList = new IndexList(json.indexId, json.summary);
        indexList.nodes = json.nodes;
        return indexList;
    } else if (json.type === IndexStructType.SIMPLE_DICT) {
        const indexDict = new IndexDict(json.indexId, json.summary);
        indexDict.nodesDict = Object.entries(json.nodesDict).reduce((acc, [key, value])=>{
            acc[key] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$schema$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsonToNode"])(value);
            return acc;
        }, {});
        return indexDict;
    } else {
        throw new Error(`Unknown index struct type: ${json.type}`);
    }
}
;
}}),
"[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/embeddings/dist/index.js [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "BaseEmbedding": (()=>BaseEmbedding),
    "DEFAULT_SIMILARITY_TOP_K": (()=>DEFAULT_SIMILARITY_TOP_K),
    "MultiModalEmbedding": (()=>MultiModalEmbedding),
    "SimilarityType": (()=>SimilarityType),
    "batchEmbeddings": (()=>batchEmbeddings),
    "getTopKEmbeddings": (()=>getTopKEmbeddings),
    "getTopKMMREmbeddings": (()=>getTopKMMREmbeddings),
    "similarity": (()=>similarity),
    "truncateMaxTokens": (()=>truncateMaxTokens)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$schema$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/schema/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$utils$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/utils/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$env$40$0$2e$1$2e$30$2f$node_modules$2f40$llamaindex$2f$env$2f$tokenizers$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+env@0.1.30/node_modules/@llamaindex/env/tokenizers/dist/index.js [app-route] (ecmascript)");
;
;
;
function truncateMaxTokens(tokenizer, value, maxTokens) {
    // the maximum number of tokens per one character is 2 (e.g. 爨)
    if (value.length * 2 < maxTokens) return value;
    const t = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$env$40$0$2e$1$2e$30$2f$node_modules$2f40$llamaindex$2f$env$2f$tokenizers$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["tokenizers"].tokenizer(tokenizer);
    let tokens = t.encode(value);
    if (tokens.length > maxTokens) {
        // truncate tokens
        tokens = tokens.slice(0, maxTokens);
        value = t.decode(tokens);
        // if we truncate at an UTF-8 boundary (some characters have more than one token), tiktoken returns a � character - remove it
        return value.replace("�", "");
    }
    return value;
}
const DEFAULT_SIMILARITY_TOP_K = 2;
/**
 * Similarity type
 * Default is cosine similarity. Dot product and negative Euclidean distance are also supported.
 */ var SimilarityType = /*#__PURE__*/ function(SimilarityType) {
    SimilarityType["DEFAULT"] = "cosine";
    SimilarityType["DOT_PRODUCT"] = "dot_product";
    SimilarityType["EUCLIDEAN"] = "euclidean";
    return SimilarityType;
}({});
/**
 * The similarity between two embeddings.
 * @param embedding1
 * @param embedding2
 * @param mode
 * @returns similarity score with higher numbers meaning the two embeddings are more similar
 */ function similarity(embedding1, embedding2, mode = "cosine") {
    if (embedding1.length !== embedding2.length) {
        throw new Error("Embedding length mismatch");
    }
    // NOTE I've taken enough Kahan to know that we should probably leave the
    // numeric programming to numeric programmers. The naive approach here
    // will probably cause some avoidable loss of floating point precision
    // ml-distance is worth watching although they currently also use the naive
    // formulas
    function norm(x) {
        let result = 0;
        for(let i = 0; i < x.length; i++){
            result += x[i] * x[i];
        }
        return Math.sqrt(result);
    }
    switch(mode){
        case "euclidean":
            {
                const difference = embedding1.map((x, i)=>x - embedding2[i]);
                return -norm(difference);
            }
        case "dot_product":
            {
                let result = 0;
                for(let i = 0; i < embedding1.length; i++){
                    result += embedding1[i] * embedding2[i];
                }
                return result;
            }
        case "cosine":
            {
                return similarity(embedding1, embedding2, "dot_product") / (norm(embedding1) * norm(embedding2));
            }
        default:
            throw new Error("Not implemented yet");
    }
}
/**
 * Get the top K embeddings from a list of embeddings ordered by similarity to the query.
 * @param queryEmbedding
 * @param embeddings list of embeddings to consider
 * @param similarityTopK max number of embeddings to return, default 2
 * @param embeddingIds ids of embeddings in the embeddings list
 * @param similarityCutoff minimum similarity score
 * @returns
 */ function getTopKEmbeddings(queryEmbedding, embeddings, similarityTopK = 2, embeddingIds = null, similarityCutoff = null) {
    if (embeddingIds == null) {
        embeddingIds = Array(embeddings.length).map((_, i)=>i);
    }
    if (embeddingIds.length !== embeddings.length) {
        throw new Error("getTopKEmbeddings: embeddings and embeddingIds length mismatch");
    }
    const similarities = [];
    for(let i = 0; i < embeddings.length; i++){
        const sim = similarity(queryEmbedding, embeddings[i]);
        if (similarityCutoff == null || sim > similarityCutoff) {
            similarities.push({
                similarity: sim,
                id: embeddingIds[i]
            });
        }
    }
    similarities.sort((a, b)=>b.similarity - a.similarity); // Reverse sort
    const resultSimilarities = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const resultIds = [];
    for(let i = 0; i < similarityTopK; i++){
        if (i >= similarities.length) {
            break;
        }
        resultSimilarities.push(similarities[i].similarity);
        resultIds.push(similarities[i].id);
    }
    return [
        resultSimilarities,
        resultIds
    ];
}
function getTopKMMREmbeddings(queryEmbedding, embeddings, similarityFn = null, similarityTopK = null, embeddingIds = null, _similarityCutoff = null, mmrThreshold = null) {
    const threshold = mmrThreshold || 0.5;
    similarityFn = similarityFn || similarity;
    if (embeddingIds === null || embeddingIds.length === 0) {
        embeddingIds = Array.from({
            length: embeddings.length
        }, (_, i)=>i);
    }
    const fullEmbedMap = new Map(embeddingIds.map((value, i)=>[
            value,
            i
        ]));
    const embedMap = new Map(fullEmbedMap);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const embedSimilarity = new Map();
    let score = Number.NEGATIVE_INFINITY;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let highScoreId = null;
    for(let i = 0; i < embeddings.length; i++){
        const emb = embeddings[i];
        const similarity = similarityFn(queryEmbedding, emb);
        embedSimilarity.set(embeddingIds[i], similarity);
        if (similarity * threshold > score) {
            highScoreId = embeddingIds[i];
            score = similarity * threshold;
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const results = [];
    const embeddingLength = embeddings.length;
    const similarityTopKCount = similarityTopK || embeddingLength;
    while(results.length < Math.min(similarityTopKCount, embeddingLength)){
        results.push([
            score,
            highScoreId
        ]);
        embedMap.delete(highScoreId);
        const recentEmbeddingId = highScoreId;
        score = Number.NEGATIVE_INFINITY;
        for (const embedId of Array.from(embedMap.keys())){
            const overlapWithRecent = similarityFn(embeddings[embedMap.get(embedId)], embeddings[fullEmbedMap.get(recentEmbeddingId)]);
            if (threshold * embedSimilarity.get(embedId) - (1 - threshold) * overlapWithRecent > score) {
                score = threshold * embedSimilarity.get(embedId) - (1 - threshold) * overlapWithRecent;
                highScoreId = embedId;
            }
        }
    }
    const resultSimilarities = results.map(([s, _])=>s);
    const resultIds = results.map(([_, n])=>n);
    return [
        resultSimilarities,
        resultIds
    ];
}
const DEFAULT_EMBED_BATCH_SIZE = 10;
class BaseEmbedding extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$schema$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["TransformComponent"] {
    constructor(transformFn){
        if (transformFn) {
            super(transformFn), this.embedBatchSize = DEFAULT_EMBED_BATCH_SIZE, /**
   * Optionally override this method to retrieve multiple embeddings in a single request
   * @param texts
   */ this.getTextEmbeddings = async (texts)=>{
                const embeddings = [];
                for (const text of texts){
                    const embedding = await this.getTextEmbedding(text);
                    embeddings.push(embedding);
                }
                return embeddings;
            };
        } else {
            super(async (nodes, options)=>{
                const texts = nodes.map((node)=>node.getContent(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$schema$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["MetadataMode"].EMBED));
                const embeddings = await this.getTextEmbeddingsBatch(texts, options);
                for(let i = 0; i < nodes.length; i++){
                    nodes[i].embedding = embeddings[i];
                }
                return nodes;
            }), this.embedBatchSize = DEFAULT_EMBED_BATCH_SIZE, this.getTextEmbeddings = async (texts)=>{
                const embeddings = [];
                for (const text of texts){
                    const embedding = await this.getTextEmbedding(text);
                    embeddings.push(embedding);
                }
                return embeddings;
            };
        }
    }
    similarity(embedding1, embedding2, mode = SimilarityType.DEFAULT) {
        return similarity(embedding1, embedding2, mode);
    }
    async getQueryEmbedding(query) {
        const text = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$utils$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["extractSingleText"])(query);
        if (text) {
            return await this.getTextEmbedding(text);
        }
        return null;
    }
    /**
   * Get embeddings for a batch of texts
   * @param texts
   * @param options
   */ async getTextEmbeddingsBatch(texts, options) {
        return await batchEmbeddings(texts, this.getTextEmbeddings, this.embedBatchSize, options);
    }
    truncateMaxTokens(input) {
        return input.map((s)=>{
            // truncate to max tokens
            if (!(this.embedInfo?.tokenizer && this.embedInfo?.maxTokens)) return s;
            return truncateMaxTokens(this.embedInfo.tokenizer, s, this.embedInfo.maxTokens);
        });
    }
}
async function batchEmbeddings(values, embedFunc, chunkSize, options) {
    const resultEmbeddings = [];
    const queue = values;
    const curBatch = [];
    for(let i = 0; i < queue.length; i++){
        curBatch.push(queue[i]);
        if (i == queue.length - 1 || curBatch.length == chunkSize) {
            const embeddings = await embedFunc(curBatch);
            resultEmbeddings.push(...embeddings);
            if (options?.progressCallback) {
                options?.progressCallback?.(i + 1, queue.length);
            }
            if (options?.logProgress) {
                console.log(`getting embedding progress: ${i + 1} / ${queue.length}`);
            }
            curBatch.length = 0;
        }
    }
    return resultEmbeddings;
}
/*
 * Base class for Multi Modal embeddings.
 */ class MultiModalEmbedding extends BaseEmbedding {
    constructor(){
        super(async (nodes, options)=>{
            const nodeMap = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$schema$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["splitNodesByType"])(nodes);
            const imageNodes = nodeMap[__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$schema$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ModalityType"].IMAGE] ?? [];
            const textNodes = nodeMap[__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$schema$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ModalityType"].TEXT] ?? [];
            const embeddings = await batchEmbeddings(textNodes.map((node)=>node.getContent(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$schema$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["MetadataMode"].EMBED)), this.getTextEmbeddings.bind(this), this.embedBatchSize, options);
            for(let i = 0; i < textNodes.length; i++){
                textNodes[i].embedding = embeddings[i];
            }
            const imageEmbeddings = await batchEmbeddings(imageNodes.map((n)=>n.image), this.getImageEmbeddings.bind(this), this.embedBatchSize, options);
            for(let i = 0; i < imageNodes.length; i++){
                imageNodes[i].embedding = imageEmbeddings[i];
            }
            return nodes;
        });
    }
    /**
   * Optionally override this method to retrieve multiple image embeddings in a single request
   * @param images
   */ async getImageEmbeddings(images) {
        return Promise.all(images.map((imgFilePath)=>this.getImageEmbedding(imgFilePath)));
    }
    async getQueryEmbedding(query) {
        const image = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$utils$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["extractImage"])(query);
        if (image) {
            return await this.getImageEmbedding(image);
        }
        const text = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$utils$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["extractSingleText"])(query);
        if (text) {
            return await this.getTextEmbedding(text);
        }
        return null;
    }
}
;
}}),
"[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/llms/dist/index.js [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "BaseLLM": (()=>BaseLLM),
    "LiveLLM": (()=>LiveLLM),
    "LiveLLMCapability": (()=>LiveLLMCapability),
    "LiveLLMSession": (()=>LiveLLMSession),
    "ToolCallLLM": (()=>ToolCallLLM),
    "addContentPart": (()=>addContentPart),
    "liveEvents": (()=>liveEvents)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$env$40$0$2e$1$2e$30$2f$node_modules$2f40$llamaindex$2f$env$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+env@0.1.30/node_modules/@llamaindex/env/dist/index.js [app-route] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$magic$2d$bytes$2e$js$40$1$2e$12$2e$1$2f$node_modules$2f$magic$2d$bytes$2e$js$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/magic-bytes.js@1.12.1/node_modules/magic-bytes.js/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$utils$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/utils/dist/index.js [app-route] (ecmascript)");
;
;
;
/**
 * Extracts just the text whether from
 *  a multi-modal message
 *  a single text message
 *  or a query
 *
 * @param message The message to extract text from.
 * @returns The extracted text
 */ function extractText(message) {
    if (typeof message === "object" && "query" in message) {
        return extractText(message.query);
    }
    if (typeof message !== "string" && !Array.isArray(message)) {
        console.warn("extractText called with non-MessageContent message, this is likely a bug.");
        return `${message}`;
    } else if (typeof message !== "string" && Array.isArray(message)) {
        // message is of type MessageContentDetail[] - retrieve just the text parts and concatenate them
        // so we can pass them to the context generator
        return message.filter((c)=>c.type === "text").map((c)=>c.text).join("\n\n");
    } else {
        return message;
    }
}
async function* streamConverter(stream, converter) {
    for await (const data of stream){
        const newData = converter(data);
        if (newData === null) {
            return;
        }
        yield newData;
    }
}
const getToolCallsFromResponse = (response)=>{
    let options;
    if ("message" in response) {
        options = response.message.options;
    } else {
        options = response.options;
    }
    if (options && "toolCall" in options) {
        return options.toolCall.map((toolCall)=>({
                ...toolCall,
                input: // non-streaming
                typeof toolCall.input === "string" ? JSON.parse(toolCall.input) : toolCall.input
            }));
    }
    return [];
};
const callTool = async (tools, toolCall)=>{
    const tool = tools?.find((t)=>t.metadata.name === toolCall.name);
    // TODO: consider using BaseToolWithCall instead of BaseTool to avoid checking for tool.call
    if (tool && tool.call) {
        const result = await tool.call(toolCall.input);
        const toolResultMessage = {
            role: "user",
            content: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$utils$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["stringifyJSONToMessageContent"])(result),
            options: {
                toolResult: {
                    id: toolCall.id,
                    result
                }
            }
        };
        return toolResultMessage;
    }
    return null;
};
class BaseLLM {
    async complete(params) {
        const { prompt, stream, responseFormat } = params;
        if (stream) {
            const stream = await this.chat({
                messages: [
                    {
                        content: prompt,
                        role: "user"
                    }
                ],
                stream: true,
                ...responseFormat ? {
                    responseFormat
                } : {}
            });
            return streamConverter(stream, (chunk)=>{
                return {
                    raw: null,
                    text: chunk.delta
                };
            });
        }
        const chatResponse = await this.chat({
            messages: [
                {
                    content: prompt,
                    role: "user"
                }
            ],
            ...responseFormat ? {
                responseFormat
            } : {}
        });
        return {
            text: extractText(chatResponse.message.content),
            raw: chatResponse.raw
        };
    }
    async exec(params) {
        if (params.stream) {
            return this.streamExec(params);
        }
        const newMessages = [];
        const response = await this.chat(params);
        newMessages.push(response.message);
        const toolCalls = getToolCallsFromResponse(response);
        if (params.tools && toolCalls.length > 0) {
            for (const toolCall of toolCalls){
                const toolResultMessage = await callTool(params.tools, toolCall);
                if (toolResultMessage) {
                    newMessages.push(toolResultMessage);
                }
            }
        }
        return {
            newMessages,
            toolCalls
        };
    }
    async streamExec(params) {
        const responseStream = await this.chat(params);
        const iterator = responseStream[Symbol.asyncIterator]();
        const first = await iterator.next();
        // Set firstChunk to null if empty
        const firstChunk = !first.done ? first.value : null;
        const hasToolCallsInFirst = firstChunk?.options && "toolCall" in firstChunk.options;
        if (!hasToolCallsInFirst) {
            let content = firstChunk?.delta ?? "";
            let finished = false;
            return {
                stream: async function*() {
                    if (firstChunk) {
                        yield firstChunk;
                    }
                    for await (const chunk of {
                        [Symbol.asyncIterator]: ()=>iterator
                    }){
                        content += chunk.delta;
                        yield chunk;
                    }
                    finished = true;
                }(),
                toolCalls: [],
                newMessages () {
                    if (!finished) {
                        throw new Error("New messages are not ready yet. Call newMessages() after the stream is done.");
                    }
                    return content ? [
                        {
                            role: "assistant",
                            content
                        }
                    ] : [];
                }
            };
        }
        // Helper function to process a chunk
        function processChunk(chunk, toolCallMap) {
            if (chunk.options && "toolCall" in chunk.options) {
                // update tool call map
                for (const toolCall of chunk.options.toolCall){
                    if (toolCall.id) {
                        toolCallMap.set(toolCall.id, toolCall);
                    }
                }
                // return the current full response with the tool calls
                const toolCalls = Array.from(toolCallMap.values());
                return {
                    ...chunk,
                    options: {
                        ...chunk.options,
                        toolCall: toolCalls
                    }
                };
            }
            return null;
        }
        // Collect for tool call
        let fullResponse = null;
        const toolCallMap = new Map();
        // Process first chunk
        fullResponse = processChunk(firstChunk, toolCallMap);
        // Process remaining chunks
        while(true){
            const next = await iterator.next();
            if (next.done) break;
            const chunk = next.value;
            const potentialFull = processChunk(chunk, toolCallMap);
            if (potentialFull) {
                fullResponse = potentialFull;
            }
        }
        if (params.tools && fullResponse) {
            const toolCalls = getToolCallsFromResponse(fullResponse);
            const messages = [];
            messages.push({
                role: "assistant",
                content: "",
                options: {
                    toolCall: toolCalls
                }
            });
            for (const toolCall of toolCalls){
                const toolResultMessage = await callTool(params.tools, toolCall);
                if (toolResultMessage) {
                    messages.push(toolResultMessage);
                }
            }
            return {
                stream: async function*() {}(),
                newMessages () {
                    return messages;
                },
                toolCalls
            };
        } else {
            throw new Error("Cannot get tool calls from response");
        }
    }
}
class ToolCallLLM extends BaseLLM {
}
var LiveLLMCapability = /*#__PURE__*/ function(LiveLLMCapability) {
    LiveLLMCapability["EPHEMERAL_KEY"] = "ephemeral_key";
    LiveLLMCapability["AUDIO_CONFIG"] = "audio_config";
    return LiveLLMCapability;
}({});
class LiveLLMSession {
    isTextMessage(content) {
        return content.type === "text";
    }
    isAudioMessage(content) {
        return content.type === "audio";
    }
    isImageMessage(content) {
        return content.type === "image";
    }
    isVideoMessage(content) {
        return content.type === "video";
    }
    sendMessage(message) {
        const { content, role } = message;
        if (!Array.isArray(content)) {
            this.messageSender.sendTextMessage(content, role);
        } else {
            for (const item of content){
                this.processMessage(item, role);
            }
        }
    }
    processMessage(message, role) {
        if (this.isTextMessage(message)) {
            this.messageSender.sendTextMessage(message.text, role);
        } else if (this.isAudioMessage(message) && this.messageSender.sendAudioMessage) {
            this.messageSender.sendAudioMessage(message, role);
        } else if (this.isImageMessage(message) && this.messageSender.sendImageMessage) {
            this.messageSender.sendImageMessage(message, role);
        } else if (this.isVideoMessage(message) && this.messageSender.sendVideoMessage) {
            this.messageSender.sendVideoMessage(message, role);
        }
    }
    async *streamEvents() {
        while(true){
            const event = await this.nextEvent();
            if (event === undefined) {
                break;
            }
            yield event;
        }
    }
    async nextEvent() {
        if (this.eventQueue.length) {
            return Promise.resolve(this.eventQueue.shift());
        }
        return new Promise((resolve)=>{
            this.eventResolvers.push(resolve);
        });
    }
    //Uses an async queue to send events to the client
    // if the consumer is waiting for an event, it will be resolved immediately
    // otherwise, the event will be queued up and sent when the consumer is ready
    pushEventToQueue(event) {
        if (this.eventResolvers.length) {
            //resolving the promise with the event
            this.eventResolvers.shift()(event);
        } else {
            this.eventQueue.push(event);
        }
    }
    constructor(){
        this.eventQueue = [];
        this.eventResolvers = [];
        this.closed = false;
    }
}
class LiveLLM {
    hasCapability(capability) {
        return this.capabilities.has(capability);
    }
    constructor(){
        /**
   * Set of capabilities supported by this implementation.
   * Override in subclasses as needed.
   */ this.capabilities = new Set();
    }
}
const liveEvents = {
    open: {
        include: (e)=>e.type === "open"
    },
    audio: {
        include: (e)=>e.type === "audio"
    },
    text: {
        include: (e)=>e.type === "text"
    },
    error: {
        include: (e)=>e.type === "error"
    },
    close: {
        include: (e)=>e.type === "close"
    },
    setupComplete: {
        include: (e)=>e.type === "setupComplete"
    },
    interrupted: {
        include: (e)=>e.type === "interrupted"
    },
    generationComplete: {
        include: (e)=>e.type === "generationComplete"
    },
    turnComplete: {
        include: (e)=>e.type === "turnComplete"
    }
};
function addContentPart(message, part) {
    if (part.type === "text") {
        if (typeof message.content === "string") {
            message.content += part.text;
        } else {
            message.content.push(part);
        }
    } else {
        if (typeof message.content === "string") {
            if (message.content === "") {
                message.content = [
                    part
                ];
            } else {
                message.content = [
                    {
                        type: "text",
                        text: message.content
                    },
                    part
                ];
            }
        } else {
            message.content.push(part);
        }
    }
}
;
}}),
"[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/postprocessor/dist/index.js [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({});
}}),
"[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/query-engine/dist/index.js [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "BaseQueryEngine": (()=>BaseQueryEngine),
    "RetrieverQueryEngine": (()=>RetrieverQueryEngine)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$env$40$0$2e$1$2e$30$2f$node_modules$2f40$llamaindex$2f$env$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+env@0.1.30/node_modules/@llamaindex/env/dist/index.js [app-route] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:crypto [external] (node:crypto, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$decorator$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/decorator/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/global/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$prompts$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/prompts/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$response$2d$synthesizers$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/response-synthesizers/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$utils$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/utils/dist/index.js [app-route] (ecmascript)");
;
;
;
;
;
;
function applyDecs2203RFactory() {
    function createAddInitializerMethod(initializers, decoratorFinishedRef) {
        return function addInitializer(initializer) {
            assertNotFinished(decoratorFinishedRef, "addInitializer");
            assertCallable(initializer, "An initializer");
            initializers.push(initializer);
        };
    }
    function memberDec(dec, name, desc, initializers, kind, isStatic, isPrivate, metadata, value) {
        var kindStr;
        switch(kind){
            case 1:
                kindStr = "accessor";
                break;
            case 2:
                kindStr = "method";
                break;
            case 3:
                kindStr = "getter";
                break;
            case 4:
                kindStr = "setter";
                break;
            default:
                kindStr = "field";
        }
        var ctx = {
            kind: kindStr,
            name: isPrivate ? "#" + name : name,
            static: isStatic,
            private: isPrivate,
            metadata: metadata
        };
        var decoratorFinishedRef = {
            v: false
        };
        ctx.addInitializer = createAddInitializerMethod(initializers, decoratorFinishedRef);
        var get, set;
        if (kind === 0) {
            if (isPrivate) {
                get = desc.get;
                set = desc.set;
            } else {
                get = function() {
                    return this[name];
                };
                set = function(v) {
                    this[name] = v;
                };
            }
        } else if (kind === 2) {
            get = function() {
                return desc.value;
            };
        } else {
            if (kind === 1 || kind === 3) {
                get = function() {
                    return desc.get.call(this);
                };
            }
            if (kind === 1 || kind === 4) {
                set = function(v) {
                    desc.set.call(this, v);
                };
            }
        }
        ctx.access = get && set ? {
            get: get,
            set: set
        } : get ? {
            get: get
        } : {
            set: set
        };
        try {
            return dec(value, ctx);
        } finally{
            decoratorFinishedRef.v = true;
        }
    }
    function assertNotFinished(decoratorFinishedRef, fnName) {
        if (decoratorFinishedRef.v) {
            throw new Error("attempted to call " + fnName + " after decoration was finished");
        }
    }
    function assertCallable(fn, hint) {
        if (typeof fn !== "function") {
            throw new TypeError(hint + " must be a function");
        }
    }
    function assertValidReturnValue(kind, value) {
        var type = typeof value;
        if (kind === 1) {
            if (type !== "object" || value === null) {
                throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");
            }
            if (value.get !== undefined) {
                assertCallable(value.get, "accessor.get");
            }
            if (value.set !== undefined) {
                assertCallable(value.set, "accessor.set");
            }
            if (value.init !== undefined) {
                assertCallable(value.init, "accessor.init");
            }
        } else if (type !== "function") {
            var hint;
            if (kind === 0) {
                hint = "field";
            } else if (kind === 10) {
                hint = "class";
            } else {
                hint = "method";
            }
            throw new TypeError(hint + " decorators must return a function or void 0");
        }
    }
    function applyMemberDec(ret, base, decInfo, name, kind, isStatic, isPrivate, initializers, metadata) {
        var decs = decInfo[0];
        var desc, init, value;
        if (isPrivate) {
            if (kind === 0 || kind === 1) {
                desc = {
                    get: decInfo[3],
                    set: decInfo[4]
                };
            } else if (kind === 3) {
                desc = {
                    get: decInfo[3]
                };
            } else if (kind === 4) {
                desc = {
                    set: decInfo[3]
                };
            } else {
                desc = {
                    value: decInfo[3]
                };
            }
        } else if (kind !== 0) {
            desc = Object.getOwnPropertyDescriptor(base, name);
        }
        if (kind === 1) {
            value = {
                get: desc.get,
                set: desc.set
            };
        } else if (kind === 2) {
            value = desc.value;
        } else if (kind === 3) {
            value = desc.get;
        } else if (kind === 4) {
            value = desc.set;
        }
        var newValue, get, set;
        if (typeof decs === "function") {
            newValue = memberDec(decs, name, desc, initializers, kind, isStatic, isPrivate, metadata, value);
            if (newValue !== void 0) {
                assertValidReturnValue(kind, newValue);
                if (kind === 0) {
                    init = newValue;
                } else if (kind === 1) {
                    init = newValue.init;
                    get = newValue.get || value.get;
                    set = newValue.set || value.set;
                    value = {
                        get: get,
                        set: set
                    };
                } else {
                    value = newValue;
                }
            }
        } else {
            for(var i = decs.length - 1; i >= 0; i--){
                var dec = decs[i];
                newValue = memberDec(dec, name, desc, initializers, kind, isStatic, isPrivate, metadata, value);
                if (newValue !== void 0) {
                    assertValidReturnValue(kind, newValue);
                    var newInit;
                    if (kind === 0) {
                        newInit = newValue;
                    } else if (kind === 1) {
                        newInit = newValue.init;
                        get = newValue.get || value.get;
                        set = newValue.set || value.set;
                        value = {
                            get: get,
                            set: set
                        };
                    } else {
                        value = newValue;
                    }
                    if (newInit !== void 0) {
                        if (init === void 0) {
                            init = newInit;
                        } else if (typeof init === "function") {
                            init = [
                                init,
                                newInit
                            ];
                        } else {
                            init.push(newInit);
                        }
                    }
                }
            }
        }
        if (kind === 0 || kind === 1) {
            if (init === void 0) {
                init = function(instance, init) {
                    return init;
                };
            } else if (typeof init !== "function") {
                var ownInitializers = init;
                init = function(instance, init) {
                    var value = init;
                    for(var i = 0; i < ownInitializers.length; i++){
                        value = ownInitializers[i].call(instance, value);
                    }
                    return value;
                };
            } else {
                var originalInitializer = init;
                init = function(instance, init) {
                    return originalInitializer.call(instance, init);
                };
            }
            ret.push(init);
        }
        if (kind !== 0) {
            if (kind === 1) {
                desc.get = value.get;
                desc.set = value.set;
            } else if (kind === 2) {
                desc.value = value;
            } else if (kind === 3) {
                desc.get = value;
            } else if (kind === 4) {
                desc.set = value;
            }
            if (isPrivate) {
                if (kind === 1) {
                    ret.push(function(instance, args) {
                        return value.get.call(instance, args);
                    });
                    ret.push(function(instance, args) {
                        return value.set.call(instance, args);
                    });
                } else if (kind === 2) {
                    ret.push(value);
                } else {
                    ret.push(function(instance, args) {
                        return value.call(instance, args);
                    });
                }
            } else {
                Object.defineProperty(base, name, desc);
            }
        }
    }
    function applyMemberDecs(Class, decInfos, metadata) {
        var ret = [];
        var protoInitializers;
        var staticInitializers;
        var existingProtoNonFields = new Map();
        var existingStaticNonFields = new Map();
        for(var i = 0; i < decInfos.length; i++){
            var decInfo = decInfos[i];
            if (!Array.isArray(decInfo)) continue;
            var kind = decInfo[1];
            var name = decInfo[2];
            var isPrivate = decInfo.length > 3;
            var isStatic = kind >= 5;
            var base;
            var initializers;
            if (isStatic) {
                base = Class;
                kind = kind - 5;
                staticInitializers = staticInitializers || [];
                initializers = staticInitializers;
            } else {
                base = Class.prototype;
                protoInitializers = protoInitializers || [];
                initializers = protoInitializers;
            }
            if (kind !== 0 && !isPrivate) {
                var existingNonFields = isStatic ? existingStaticNonFields : existingProtoNonFields;
                var existingKind = existingNonFields.get(name) || 0;
                if (existingKind === true || existingKind === 3 && kind !== 4 || existingKind === 4 && kind !== 3) {
                    throw new Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: " + name);
                } else if (!existingKind && kind > 2) {
                    existingNonFields.set(name, kind);
                } else {
                    existingNonFields.set(name, true);
                }
            }
            applyMemberDec(ret, base, decInfo, name, kind, isStatic, isPrivate, initializers, metadata);
        }
        pushInitializers(ret, protoInitializers);
        pushInitializers(ret, staticInitializers);
        return ret;
    }
    function pushInitializers(ret, initializers) {
        if (initializers) {
            ret.push(function(instance) {
                for(var i = 0; i < initializers.length; i++){
                    initializers[i].call(instance);
                }
                return instance;
            });
        }
    }
    function applyClassDecs(targetClass, classDecs, metadata) {
        if (classDecs.length > 0) {
            var initializers = [];
            var newClass = targetClass;
            var name = targetClass.name;
            for(var i = classDecs.length - 1; i >= 0; i--){
                var decoratorFinishedRef = {
                    v: false
                };
                try {
                    var nextNewClass = classDecs[i](newClass, {
                        kind: "class",
                        name: name,
                        addInitializer: createAddInitializerMethod(initializers, decoratorFinishedRef),
                        metadata
                    });
                } finally{
                    decoratorFinishedRef.v = true;
                }
                if (nextNewClass !== undefined) {
                    assertValidReturnValue(10, nextNewClass);
                    newClass = nextNewClass;
                }
            }
            return [
                defineMetadata(newClass, metadata),
                function() {
                    for(var i = 0; i < initializers.length; i++){
                        initializers[i].call(newClass);
                    }
                }
            ];
        }
    }
    function defineMetadata(Class, metadata) {
        return Object.defineProperty(Class, Symbol.metadata || Symbol.for("Symbol.metadata"), {
            configurable: true,
            enumerable: true,
            value: metadata
        });
    }
    return function applyDecs2203R(targetClass, memberDecs, classDecs, parentClass) {
        if (parentClass !== void 0) {
            var parentMetadata = parentClass[Symbol.metadata || Symbol.for("Symbol.metadata")];
        }
        var metadata = Object.create(parentMetadata === void 0 ? null : parentMetadata);
        var e = applyMemberDecs(targetClass, memberDecs, metadata);
        if (!classDecs.length) defineMetadata(targetClass, metadata);
        return {
            e: e,
            get c () {
                return applyClassDecs(targetClass, classDecs, metadata);
            }
        };
    };
}
function _apply_decs_2203_r(targetClass, memberDecs, classDecs, parentClass) {
    return (_apply_decs_2203_r = applyDecs2203RFactory())(targetClass, memberDecs, classDecs, parentClass);
}
var _initProto;
class BaseQueryEngine extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$prompts$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PromptMixin"] {
    static{
        ({ e: [_initProto] } = _apply_decs_2203_r(this, [
            [
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$decorator$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["wrapEventCaller"],
                2,
                "query"
            ]
        ], []));
    }
    constructor(...args){
        super(...args), _initProto(this);
    }
    async retrieve(params) {
        throw new Error("This query engine does not support retrieve, use query directly");
    }
    async query(params) {
        const { stream, query } = params;
        const id = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["randomUUID"])();
        const callbackManager = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Settings"].callbackManager;
        callbackManager.dispatchEvent("query-start", {
            id,
            query
        });
        const response = await this._query(query, stream);
        callbackManager.dispatchEvent("query-end", {
            id,
            response
        });
        return response;
    }
}
class RetrieverQueryEngine extends BaseQueryEngine {
    constructor(retriever, responseSynthesizer, nodePostprocessors){
        super();
        this.retriever = retriever;
        this.responseSynthesizer = responseSynthesizer || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$response$2d$synthesizers$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getResponseSynthesizer"])("compact");
        this.nodePostprocessors = nodePostprocessors || [];
    }
    async _query(strOrQueryBundle, stream) {
        const nodesWithScore = await this.retrieve(typeof strOrQueryBundle === "string" ? strOrQueryBundle : (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$utils$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["extractText"])(strOrQueryBundle));
        if (stream) {
            return this.responseSynthesizer.synthesize({
                query: typeof strOrQueryBundle === "string" ? {
                    query: strOrQueryBundle
                } : strOrQueryBundle,
                nodes: nodesWithScore
            }, true);
        }
        return this.responseSynthesizer.synthesize({
            query: typeof strOrQueryBundle === "string" ? {
                query: strOrQueryBundle
            } : strOrQueryBundle,
            nodes: nodesWithScore
        });
    }
    _getPrompts() {
        return {};
    }
    _updatePrompts() {}
    _getPromptModules() {
        return {
            responseSynthesizer: this.responseSynthesizer
        };
    }
    async applyNodePostprocessors(nodes, query) {
        let nodesWithScore = nodes;
        for (const postprocessor of this.nodePostprocessors){
            nodesWithScore = await postprocessor.postprocessNodes(nodesWithScore, query);
        }
        return nodesWithScore;
    }
    async retrieve(query) {
        const nodes = await this.retriever.retrieve(query);
        const messageContent = typeof query === "string" ? query : query.query;
        return await this.applyNodePostprocessors(nodes, messageContent);
    }
}
;
}}),
"[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/retriever/dist/index.js [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "BaseRetriever": (()=>BaseRetriever)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$env$40$0$2e$1$2e$30$2f$node_modules$2f40$llamaindex$2f$env$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+env@0.1.30/node_modules/@llamaindex/env/dist/index.js [app-route] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:crypto [external] (node:crypto, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/global/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$prompts$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/prompts/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$schema$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/schema/dist/index.js [app-route] (ecmascript)");
;
;
;
;
class BaseRetriever extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$prompts$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PromptMixin"] {
    _updatePrompts() {}
    _getPrompts() {
        return {};
    }
    _getPromptModules() {
        return {};
    }
    constructor(){
        super(), this.objectMap = new Map();
    }
    async retrieve(params) {
        const cb = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Settings"].callbackManager;
        const queryBundle = typeof params === "string" ? {
            query: params
        } : params;
        const id = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["randomUUID"])();
        cb.dispatchEvent("retrieve-start", {
            id,
            query: queryBundle
        });
        let response = await this._retrieve(queryBundle);
        response = await this._handleRecursiveRetrieval(queryBundle, response);
        cb.dispatchEvent("retrieve-end", {
            id,
            query: queryBundle,
            nodes: response
        });
        return response;
    }
    async _handleRecursiveRetrieval(params, nodes) {
        const retrievedNodes = [];
        for (const { node, score = 1.0 } of nodes){
            if (node.type === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$schema$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ObjectType"].INDEX) {
                const indexNode = node;
                const object = this.objectMap.get(indexNode.indexId);
                if (object !== undefined) {
                    retrievedNodes.push(...this._retrieveFromObject(object, params, score));
                } else {
                    retrievedNodes.push({
                        node,
                        score
                    });
                }
            } else {
                retrievedNodes.push({
                    node,
                    score
                });
            }
        }
        return nodes;
    }
    _retrieveFromObject(object, queryBundle, score) {
        if (object == null) {
            throw new TypeError("Object is not retrievable");
        }
        if (typeof object !== "object") {
            throw new TypeError("Object is not retrievable");
        }
        if ("node" in object && object.node instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$schema$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BaseNode"]) {
            return [
                {
                    node: object.node,
                    score: "score" in object && typeof object.score === "number" ? object.score : score
                }
            ];
        }
        if (object instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$schema$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BaseNode"]) {
            return [
                {
                    node: object,
                    score
                }
            ];
        } else {
            // todo: support other types
            // BaseQueryEngine
            // BaseRetriever
            // QueryComponent
            throw new TypeError("Object is not retrievable");
        }
    }
}
;
}}),
"[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/storage/doc-store/dist/index.js [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "BaseDocumentStore": (()=>BaseDocumentStore),
    "KVDocumentStore": (()=>KVDocumentStore),
    "docToJson": (()=>docToJson),
    "isValidDocJson": (()=>isValidDocJson),
    "jsonSerializer": (()=>jsonSerializer),
    "jsonToDoc": (()=>jsonToDoc),
    "noneSerializer": (()=>noneSerializer)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$env$40$0$2e$1$2e$30$2f$node_modules$2f40$llamaindex$2f$env$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+env@0.1.30/node_modules/@llamaindex/env/dist/index.js [app-route] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__$3c$export__default__as__path$3e$__ = __turbopack_context__.i("[externals]/node:path [external] (node:path, cjs) <export default as path>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/global/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$schema$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/schema/dist/index.js [app-route] (ecmascript)");
;
;
;
const TYPE_KEY = "__type__";
const DATA_KEY = "__data__";
const jsonSerializer = {
    toPersistence (data) {
        return JSON.stringify(data);
    },
    fromPersistence (data) {
        return JSON.parse(data);
    }
};
const noneSerializer = {
    toPersistence (data) {
        return data;
    },
    fromPersistence (data) {
        return data;
    }
};
function isValidDocJson(docJson) {
    return typeof docJson === "object" && docJson !== null && docJson[TYPE_KEY] !== undefined && docJson[DATA_KEY] !== undefined;
}
function docToJson(doc, serializer) {
    return {
        [DATA_KEY]: serializer.toPersistence(doc.toJSON()),
        [TYPE_KEY]: doc.type
    };
}
function jsonToDoc(docDict, serializer) {
    const docType = docDict[TYPE_KEY];
    // fixme: zod type check this
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dataDict = serializer.fromPersistence(docDict[DATA_KEY]);
    let doc;
    if (docType === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$schema$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ObjectType"].DOCUMENT) {
        doc = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$schema$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Document"]({
            text: dataDict.text,
            id_: dataDict.id_,
            embedding: dataDict.embedding,
            hash: dataDict.hash,
            metadata: dataDict.metadata
        });
    } else if (docType === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$schema$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ObjectType"].TEXT) {
        doc = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$schema$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["TextNode"]({
            text: dataDict.text,
            id_: dataDict.id_,
            hash: dataDict.hash,
            metadata: dataDict.metadata,
            relationships: dataDict.relationships
        });
    } else {
        throw new Error(`Unknown doc type: ${docType}`);
    }
    return doc;
}
const DEFAULT_PERSIST_PATH = __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__$3c$export__default__as__path$3e$__["path"].join(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DEFAULT_PERSIST_DIR"], __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DEFAULT_DOC_STORE_PERSIST_FILENAME"]);
class BaseDocumentStore {
    // Save/load
    persist(persistPath = DEFAULT_PERSIST_PATH) {
    // Persist the docstore to a file.
    }
    // Nodes
    getNodes(nodeIds, raiseError = true) {
        return Promise.all(nodeIds.map((nodeId)=>this.getNode(nodeId, raiseError)));
    }
    async getNode(nodeId, raiseError = true) {
        const doc = await this.getDocument(nodeId, raiseError);
        if (!(doc instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$schema$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BaseNode"])) {
            throw new Error(`Document ${nodeId} is not a Node.`);
        }
        return doc;
    }
    async getNodeDict(nodeIdDict) {
        const result = {};
        for(const index in nodeIdDict){
            result[index] = await this.getNode(nodeIdDict[index]);
        }
        return result;
    }
    constructor(){
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.serializer = jsonSerializer;
    }
}
class KVDocumentStore extends BaseDocumentStore {
    constructor(kvstore, namespace = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DEFAULT_NAMESPACE"]){
        super();
        this.kvstore = kvstore;
        this.nodeCollection = `${namespace}/data`;
        this.refDocCollection = `${namespace}/ref_doc_info`;
        this.metadataCollection = `${namespace}/metadata`;
    }
    async docs() {
        const jsonDict = await this.kvstore.getAll(this.nodeCollection);
        const docs = {};
        for(const key in jsonDict){
            const value = jsonDict[key];
            if (isValidDocJson(value)) {
                docs[key] = jsonToDoc(value, this.serializer);
            } else {
                console.warn(`Invalid JSON for docId ${key}`);
            }
        }
        return docs;
    }
    async addDocuments(docs, allowUpdate = true) {
        for(let idx = 0; idx < docs.length; idx++){
            const doc = docs[idx];
            if (doc.id_ === null) {
                throw new Error("doc_id not set");
            }
            if (!allowUpdate && await this.documentExists(doc.id_)) {
                throw new Error(`doc_id ${doc.id_} already exists. Set allow_update to True to overwrite.`);
            }
            const nodeKey = doc.id_;
            const data = docToJson(doc, this.serializer);
            await this.kvstore.put(nodeKey, data, this.nodeCollection);
            const metadata = {
                docHash: doc.hash
            };
            if (doc.type === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$schema$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ObjectType"].TEXT && doc.sourceNode !== undefined) {
                const refDocInfo = await this.getRefDocInfo(doc.sourceNode.nodeId) || {
                    nodeIds: [],
                    extraInfo: {}
                };
                refDocInfo.nodeIds.push(doc.id_);
                if (Object.keys(refDocInfo.extraInfo).length === 0) {
                    refDocInfo.extraInfo = {};
                }
                await this.kvstore.put(doc.sourceNode.nodeId, refDocInfo, this.refDocCollection);
                metadata.refDocId = doc.sourceNode.nodeId;
            }
            await this.kvstore.put(nodeKey, metadata, this.metadataCollection);
        }
    }
    async getDocument(docId, raiseError = true) {
        const json = await this.kvstore.get(docId, this.nodeCollection);
        if (this.isNil(json)) {
            if (raiseError) {
                throw new Error(`docId ${docId} not found.`);
            } else {
                return;
            }
        }
        if (!isValidDocJson(json)) {
            throw new Error(`Invalid JSON for docId ${docId}`);
        }
        return jsonToDoc(json, this.serializer);
    }
    async getRefDocInfo(refDocId) {
        const refDocInfo = await this.kvstore.get(refDocId, this.refDocCollection);
        return refDocInfo ? structuredClone(refDocInfo) : undefined;
    }
    async getAllRefDocInfo() {
        const refDocInfos = await this.kvstore.getAll(this.refDocCollection);
        if (this.isNil(refDocInfos)) {
            return;
        }
        return refDocInfos;
    }
    async refDocExists(refDocId) {
        return !this.isNil(await this.getRefDocInfo(refDocId));
    }
    async documentExists(docId) {
        return !this.isNil(await this.kvstore.get(docId, this.nodeCollection));
    }
    async removeRefDocNode(docId) {
        const metadata = await this.kvstore.get(docId, this.metadataCollection);
        if (metadata === null) {
            return;
        }
        const refDocId = metadata.refDocId;
        if (this.isNil(refDocId)) {
            return;
        }
        const refDocInfo = await this.kvstore.get(refDocId, this.refDocCollection);
        if (!this.isNil(refDocInfo)) {
            if (refDocInfo.nodeIds.length > 0) {
                await this.kvstore.put(refDocId, refDocInfo, this.refDocCollection);
            }
            await this.kvstore.delete(refDocId, this.metadataCollection);
        }
    }
    async deleteDocument(docId, raiseError = true, removeRefDocNode = true) {
        if (removeRefDocNode) {
            await this.removeRefDocNode(docId);
        }
        const deleteSuccess = await this.kvstore.delete(docId, this.nodeCollection);
        await this.kvstore.delete(docId, this.metadataCollection);
        if (!deleteSuccess && raiseError) {
            throw new Error(`doc_id ${docId} not found.`);
        }
    }
    async deleteRefDoc(refDocId, raiseError = true) {
        const refDocInfo = await this.getRefDocInfo(refDocId);
        if (this.isNil(refDocInfo)) {
            if (raiseError) {
                throw new Error(`ref_doc_id ${refDocId} not found.`);
            } else {
                return;
            }
        }
        for (const docId of refDocInfo.nodeIds){
            await this.deleteDocument(docId, false, false);
        }
        await this.kvstore.delete(refDocId, this.metadataCollection);
        await this.kvstore.delete(refDocId, this.refDocCollection);
    }
    async setDocumentHash(docId, docHash) {
        const metadata = {
            docHash: docHash
        };
        await this.kvstore.put(docId, metadata, this.metadataCollection);
    }
    async getDocumentHash(docId) {
        const metadata = await this.kvstore.get(docId, this.metadataCollection);
        return metadata?.docHash;
    }
    async getAllDocumentHashes() {
        const hashes = {};
        const metadataDocs = await this.kvstore.getAll(this.metadataCollection);
        for(const docId in metadataDocs){
            const hash = await this.getDocumentHash(docId);
            if (hash) {
                hashes[hash] = docId;
            }
        }
        return hashes;
    }
    isNil(value) {
        return value === null || value === undefined;
    }
}
;
}}),
"[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/storage/kv-store/dist/index.js [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "BaseInMemoryKVStore": (()=>BaseInMemoryKVStore),
    "BaseKVStore": (()=>BaseKVStore),
    "SimpleKVStore": (()=>SimpleKVStore)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$env$40$0$2e$1$2e$30$2f$node_modules$2f40$llamaindex$2f$env$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+env@0.1.30/node_modules/@llamaindex/env/dist/index.js [app-route] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__$3c$export__default__as__path$3e$__ = __turbopack_context__.i("[externals]/node:path [external] (node:path, cjs) <export default as path>");
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs$2f$promises__$5b$external$5d$__$28$node$3a$fs$2f$promises$2c$__cjs$29$__$3c$export__default__as__fs$3e$__ = __turbopack_context__.i("[externals]/node:fs/promises [external] (node:fs/promises, cjs) <export default as fs>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/global/dist/index.js [app-route] (ecmascript)");
;
;
async function exists(path) {
    try {
        await __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs$2f$promises__$5b$external$5d$__$28$node$3a$fs$2f$promises$2c$__cjs$29$__$3c$export__default__as__fs$3e$__["fs"].access(path);
        return true;
    } catch  {
        return false;
    }
}
class BaseKVStore {
}
class BaseInMemoryKVStore extends BaseKVStore {
    static fromPersistPath(persistPath) {
        throw new Error("Method not implemented.");
    }
}
class SimpleKVStore extends BaseKVStore {
    constructor(data = {}){
        super(), this.data = data;
    }
    async put(key, val, collection = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DEFAULT_COLLECTION"]) {
        if (!(collection in this.data)) {
            this.data[collection] = {};
        }
        this.data[collection][key] = structuredClone(val); // Creating a shallow copy of the object
        if (this.persistPath) {
            await this.persist(this.persistPath);
        }
    }
    async get(key, collection = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DEFAULT_COLLECTION"]) {
        const collectionData = this.data[collection];
        if (collectionData == null) {
            return null;
        }
        if (!(key in collectionData)) {
            return null;
        }
        return structuredClone(collectionData[key]); // Creating a shallow copy of the object
    }
    async getAll(collection = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DEFAULT_COLLECTION"]) {
        if (this.data[collection]) {
            return structuredClone(this.data[collection]);
        }
        return {};
    }
    async delete(key, collection = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DEFAULT_COLLECTION"]) {
        if (key in this.data[collection]) {
            delete this.data[collection][key];
            if (this.persistPath) {
                await this.persist(this.persistPath);
            }
            return true;
        }
        return false;
    }
    async persist(persistPath) {
        // TODO: decide on a way to polyfill path
        const dirPath = __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__$3c$export__default__as__path$3e$__["path"].dirname(persistPath);
        if (!await exists(dirPath)) {
            await __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs$2f$promises__$5b$external$5d$__$28$node$3a$fs$2f$promises$2c$__cjs$29$__$3c$export__default__as__fs$3e$__["fs"].mkdir(dirPath);
        }
        await __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs$2f$promises__$5b$external$5d$__$28$node$3a$fs$2f$promises$2c$__cjs$29$__$3c$export__default__as__fs$3e$__["fs"].writeFile(persistPath, JSON.stringify(this.data));
    }
    static async fromPersistPath(persistPath) {
        const dirPath = __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__$3c$export__default__as__path$3e$__["path"].dirname(persistPath);
        if (!await exists(dirPath)) {
            await __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs$2f$promises__$5b$external$5d$__$28$node$3a$fs$2f$promises$2c$__cjs$29$__$3c$export__default__as__fs$3e$__["fs"].mkdir(dirPath, {
                recursive: true
            });
        }
        let data = {};
        if (!await exists(persistPath)) {
            console.info(`Starting new store from path: ${persistPath}`);
        } else {
            try {
                const fileData = await __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs$2f$promises__$5b$external$5d$__$28$node$3a$fs$2f$promises$2c$__cjs$29$__$3c$export__default__as__fs$3e$__["fs"].readFile(persistPath);
                data = JSON.parse(fileData.toString());
            } catch (e) {
                throw new Error(`Failed to load data from path: ${persistPath}`, {
                    cause: e
                });
            }
        }
        const store = new SimpleKVStore(data);
        store.persistPath = persistPath;
        return store;
    }
    toDict() {
        return this.data;
    }
    static fromDict(saveDict) {
        return new SimpleKVStore(saveDict);
    }
}
;
}}),
"[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/storage/index-store/dist/index.js [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "BaseIndexStore": (()=>BaseIndexStore),
    "DEFAULT_PERSIST_PATH": (()=>DEFAULT_PERSIST_PATH),
    "KVIndexStore": (()=>KVIndexStore),
    "SimpleIndexStore": (()=>SimpleIndexStore)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$env$40$0$2e$1$2e$30$2f$node_modules$2f40$llamaindex$2f$env$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+env@0.1.30/node_modules/@llamaindex/env/dist/index.js [app-route] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__$3c$export__default__as__path$3e$__ = __turbopack_context__.i("[externals]/node:path [external] (node:path, cjs) <export default as path>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$data$2d$structs$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/data-structs/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/global/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$storage$2f$kv$2d$store$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/storage/kv-store/dist/index.js [app-route] (ecmascript)");
;
;
;
;
const DEFAULT_PERSIST_PATH = __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__$3c$export__default__as__path$3e$__["path"].join(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DEFAULT_PERSIST_DIR"], __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DEFAULT_INDEX_STORE_PERSIST_FILENAME"]);
class BaseIndexStore {
    async persist(persistPath = DEFAULT_PERSIST_PATH) {
    // Persist the index store to disk.
    }
}
class KVIndexStore extends BaseIndexStore {
    constructor(kvStore, namespace = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DEFAULT_NAMESPACE"]){
        super();
        this._kvStore = kvStore;
        this._collection = `${namespace}/data`;
    }
    async addIndexStruct(indexStruct) {
        const key = indexStruct.indexId;
        const data = indexStruct.toJson();
        await this._kvStore.put(key, data, this._collection);
    }
    async deleteIndexStruct(key) {
        await this._kvStore.delete(key, this._collection);
    }
    async getIndexStruct(structId) {
        if (!structId) {
            const structs = await this.getIndexStructs();
            if (structs.length !== 1) {
                throw new Error("More than one index struct found");
            }
            return structs[0];
        } else {
            const json = await this._kvStore.get(structId, this._collection);
            if (json == null) {
                return;
            }
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$data$2d$structs$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsonToIndexStruct"])(json);
        }
    }
    async getIndexStructs() {
        const jsons = await this._kvStore.getAll(this._collection);
        return Object.values(jsons).map((json)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$data$2d$structs$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsonToIndexStruct"])(json));
    }
}
class SimpleIndexStore extends KVIndexStore {
    constructor(kvStore){
        kvStore = kvStore || new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$storage$2f$kv$2d$store$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SimpleKVStore"]();
        super(kvStore);
        this.kvStore = kvStore;
    }
    static async fromPersistDir(persistDir = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DEFAULT_PERSIST_DIR"]) {
        const persistPath = __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__$3c$export__default__as__path$3e$__["path"].join(persistDir, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DEFAULT_INDEX_STORE_PERSIST_FILENAME"]);
        return this.fromPersistPath(persistPath);
    }
    static async fromPersistPath(persistPath) {
        const simpleKVStore = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$storage$2f$kv$2d$store$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SimpleKVStore"].fromPersistPath(persistPath);
        return new SimpleIndexStore(simpleKVStore);
    }
    async persist(persistPath = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DEFAULT_PERSIST_DIR"]) {
        this.kvStore.persist(persistPath);
    }
    static fromDict(saveDict) {
        const simpleKVStore = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$storage$2f$kv$2d$store$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SimpleKVStore"].fromDict(saveDict);
        return new SimpleIndexStore(simpleKVStore);
    }
    toDict() {
        if (!(this.kvStore instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$storage$2f$kv$2d$store$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SimpleKVStore"])) {
            throw new Error("KVStore is not a SimpleKVStore");
        }
        return this.kvStore.toDict();
    }
}
;
}}),
"[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/vector-store/dist/index.js [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "BaseVectorStore": (()=>BaseVectorStore),
    "FilterCondition": (()=>FilterCondition),
    "FilterOperator": (()=>FilterOperator),
    "VectorStoreQueryMode": (()=>VectorStoreQueryMode),
    "escapeLikeString": (()=>escapeLikeString),
    "metadataDictToNode": (()=>metadataDictToNode),
    "nodeToMetadata": (()=>nodeToMetadata),
    "parseArrayValue": (()=>parseArrayValue),
    "parseNumberValue": (()=>parseNumberValue),
    "parsePrimitiveValue": (()=>parsePrimitiveValue),
    "validateIsFlat": (()=>validateIsFlat)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/global/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$schema$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/schema/dist/index.js [app-route] (ecmascript)");
;
;
const DEFAULT_TEXT_KEY = "text";
function validateIsFlat(obj) {
    for(const key in obj){
        if (typeof obj[key] === "object" && obj[key] !== null) {
            throw new Error(`Value for metadata ${key} must not be another object`);
        }
    }
}
function nodeToMetadata(node, removeText = false, textField = DEFAULT_TEXT_KEY, flatMetadata = false) {
    const { metadata, embedding, ...rest } = node.toMutableJSON();
    if (flatMetadata) {
        validateIsFlat(metadata);
    }
    if (removeText) {
        rest[textField] = "";
    }
    metadata["_node_content"] = JSON.stringify(rest);
    metadata["_node_type"] = node.constructor.name.replace("_", ""); // remove leading underscore to be compatible with Python
    metadata["document_id"] = node.sourceNode?.nodeId || "None";
    metadata["doc_id"] = node.sourceNode?.nodeId || "None";
    metadata["ref_doc_id"] = node.sourceNode?.nodeId || "None";
    return metadata;
}
function metadataDictToNode(metadata, options) {
    const { _node_content: nodeContent, _node_type: nodeType, document_id, doc_id, ref_doc_id, ...rest } = metadata;
    let nodeObj;
    if (!nodeContent) {
        if (options?.fallback) {
            nodeObj = options?.fallback;
        } else {
            throw new Error("Node content not found in metadata.");
        }
    } else {
        nodeObj = JSON.parse(nodeContent);
        nodeObj = {
            ...rest,
            ...options?.fallback,
            ...nodeObj
        };
        nodeObj.metadata = {
            ...options?.fallback && "metadata" in options.fallback && typeof options.fallback.metadata === "object" ? options?.fallback.metadata : {},
            ...rest
        };
    }
    // Note: we're using the name of the class stored in `_node_type`
    // and not the type attribute to reconstruct
    // the node. This way we're compatible with LlamaIndex Python
    switch(nodeType){
        case "IndexNode":
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$schema$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsonToNode"])(nodeObj, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$schema$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ObjectType"].INDEX);
        default:
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$schema$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsonToNode"])(nodeObj, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$schema$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ObjectType"].TEXT);
    }
}
const escapeLikeString = (value)=>{
    return value.replace(/[%_\\]/g, "\\$&");
};
var VectorStoreQueryMode = /*#__PURE__*/ function(VectorStoreQueryMode) {
    VectorStoreQueryMode["DEFAULT"] = "default";
    VectorStoreQueryMode["SPARSE"] = "sparse";
    VectorStoreQueryMode["HYBRID"] = "hybrid";
    // fit learners
    VectorStoreQueryMode["SVM"] = "svm";
    VectorStoreQueryMode["LOGISTIC_REGRESSION"] = "logistic_regression";
    VectorStoreQueryMode["LINEAR_REGRESSION"] = "linear_regression";
    // maximum marginal relevance
    VectorStoreQueryMode["MMR"] = "mmr";
    // for Azure AI Search
    VectorStoreQueryMode["SEMANTIC_HYBRID"] = "semantic_hybrid";
    return VectorStoreQueryMode;
}({});
var FilterOperator = /*#__PURE__*/ function(FilterOperator) {
    FilterOperator["EQ"] = "==";
    FilterOperator["IN"] = "in";
    FilterOperator["GT"] = ">";
    FilterOperator["LT"] = "<";
    FilterOperator["NE"] = "!=";
    FilterOperator["GTE"] = ">=";
    FilterOperator["LTE"] = "<=";
    FilterOperator["NIN"] = "nin";
    FilterOperator["ANY"] = "any";
    FilterOperator["ALL"] = "all";
    FilterOperator["TEXT_MATCH"] = "text_match";
    FilterOperator["CONTAINS"] = "contains";
    FilterOperator["IS_EMPTY"] = "is_empty";
    return FilterOperator;
}({});
var FilterCondition = /*#__PURE__*/ function(FilterCondition) {
    FilterCondition["AND"] = "and";
    FilterCondition["OR"] = "or";
    return FilterCondition;
}({});
class BaseVectorStore {
    constructor(params){
        this.embedModel = params?.embeddingModel ?? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Settings"].embedModel;
    }
}
const parsePrimitiveValue = (value)=>{
    if (typeof value !== "number" && typeof value !== "string") {
        throw new Error("Value must be a string or number");
    }
    return value;
};
const parseArrayValue = (value)=>{
    const isPrimitiveArray = Array.isArray(value) && value.every((v)=>typeof v === "string" || typeof v === "number");
    if (!isPrimitiveArray) {
        throw new Error("Value must be an array of strings or numbers");
    }
    return value;
};
const parseNumberValue = (value)=>{
    if (typeof value !== "number") throw new Error("Value must be a number");
    return value;
};
;
}}),
"[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/objects/dist/index.js [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "BaseObjectNodeMapping": (()=>BaseObjectNodeMapping),
    "ObjectRetriever": (()=>ObjectRetriever)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$utils$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/utils/dist/index.js [app-route] (ecmascript)");
;
// Assuming that necessary interfaces and classes (like OT, TextNode, BaseNode, etc.) are defined elsewhere
// Import statements (e.g., for TextNode, BaseNode) should be added based on your project's structure
class BaseObjectNodeMapping {
    // Concrete methods can be defined as usual
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    validateObject(obj) {}
    // Implementing the add object logic
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    addObj(obj) {
        this.validateObject(obj);
        this._addObj(obj);
    }
    // Implementing toNodes method
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    toNodes(objs) {
        return objs.map((obj)=>this.toNode(obj));
    }
    // Implementing fromNode method
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fromNode(node) {
        const obj = this._fromNode(node);
        this.validateObject(obj);
        return obj;
    }
}
class ObjectRetriever {
    constructor(retriever, objectNodeMapping){
        this._retriever = retriever;
        this._objectNodeMapping = objectNodeMapping;
    }
    // In TypeScript, getters are defined like this.
    get retriever() {
        return this._retriever;
    }
    // Translating the retrieve method
    async retrieve(strOrQueryBundle) {
        const nodes = await this.retriever.retrieve({
            query: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$utils$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["extractText"])(strOrQueryBundle)
        });
        const objs = nodes.map((n)=>this._objectNodeMapping.fromNode(n.node));
        return objs;
    }
}
;
}}),
"[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/tools/dist/index.js [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "FunctionTool": (()=>FunctionTool),
    "tool": (()=>tool)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zod@3.25.76/node_modules/zod/v3/external.js [app-route] (ecmascript) <export * as z>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$2d$to$2d$json$2d$schema$40$3$2e$24$2e$6_zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2d$to$2d$json$2d$schema$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zod-to-json-schema@3.24.6_zod@3.25.76/node_modules/zod-to-json-schema/dist/esm/index.js [app-route] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$2d$to$2d$json$2d$schema$40$3$2e$24$2e$6_zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2d$to$2d$json$2d$schema$2f$dist$2f$esm$2f$zodToJsonSchema$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/zod-to-json-schema@3.24.6_zod@3.25.76/node_modules/zod-to-json-schema/dist/esm/zodToJsonSchema.js [app-route] (ecmascript)");
;
;
class FunctionTool {
    #fn;
    #additionalArg;
    #metadata;
    #zodType;
    constructor(fn, metadata, zodType, additionalArg){
        this.#zodType = null;
        this.bind = (additionalArg)=>{
            return new FunctionTool(this.#fn, this.#metadata, this.#zodType ?? undefined, additionalArg);
        };
        this.call = (input)=>{
            let params = input;
            if (this.#zodType) {
                const result = this.#zodType.safeParse(input);
                if (result.success) {
                    params = result.data;
                } else {
                    console.warn(result.error.errors);
                }
            }
            return this.#fn.call(null, params, this.#additionalArg);
        };
        this.#fn = fn;
        this.#metadata = metadata;
        if (zodType) {
            this.#zodType = zodType;
        }
        this.#additionalArg = additionalArg;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static from(fnOrConfig, schema) {
        // Handle the case where an object with execute function is passed
        if (typeof schema === "undefined" && typeof fnOrConfig === "object" && fnOrConfig.execute) {
            const { execute, parameters, ...restConfig } = fnOrConfig;
            if (parameters instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].ZodSchema) {
                const jsonSchema = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$2d$to$2d$json$2d$schema$40$3$2e$24$2e$6_zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2d$to$2d$json$2d$schema$2f$dist$2f$esm$2f$zodToJsonSchema$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["zodToJsonSchema"])(parameters);
                return new FunctionTool(execute, {
                    ...restConfig,
                    parameters: jsonSchema
                }, parameters);
            }
            return new FunctionTool(execute, fnOrConfig);
        }
        // Handle the original cases
        if (schema && schema.parameters instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2f$v3$2f$external$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].ZodSchema) {
            const jsonSchema = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$zod$2d$to$2d$json$2d$schema$40$3$2e$24$2e$6_zod$40$3$2e$25$2e$76$2f$node_modules$2f$zod$2d$to$2d$json$2d$schema$2f$dist$2f$esm$2f$zodToJsonSchema$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["zodToJsonSchema"])(schema.parameters);
            return new FunctionTool(fnOrConfig, {
                ...schema,
                parameters: jsonSchema
            }, schema.parameters);
        }
        return new FunctionTool(fnOrConfig, schema);
    }
    get metadata() {
        return this.#metadata;
    }
}
/**
 * A simpler alias for creating a FunctionTool.
 */ const tool = FunctionTool.from;
;
}}),

};

//# sourceMappingURL=50f08_%40llamaindex_core_fd39f087._.js.map