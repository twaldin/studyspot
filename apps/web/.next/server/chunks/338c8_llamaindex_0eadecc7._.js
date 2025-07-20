module.exports = {

"[project]/node_modules/.pnpm/llamaindex@0.11.19_@llama-flow+core@0.4.4_next@15.3.4_react-dom@19.1.0_react@19.1.0__re_1d30be2795de4d1906fac150e4bc1023/node_modules/llamaindex/agent/dist/index.js [app-route] (ecmascript) <locals>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "ReACTAgentWorker": (()=>ReACTAgentWorker),
    "ReActAgent": (()=>ReActAgent)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$agent$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/agent/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$utils$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/utils/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$env$40$0$2e$1$2e$30$2f$node_modules$2f40$llamaindex$2f$env$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+env@0.1.30/node_modules/@llamaindex/env/dist/index.js [app-route] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$async_hooks__$5b$external$5d$__$28$node$3a$async_hooks$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:async_hooks [external] (node:async_hooks, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:crypto [external] (node:crypto, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/global/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$indices$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/indices/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$node$2d$parser$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/node-parser/dist/index.js [app-route] (ecmascript)");
;
;
;
;
;
;
;
const getReACTAgentSystemHeader = (tools)=>{
    const description = tools.map((tool)=>`- ${tool.metadata.name}: ${tool.metadata.description} with schema: ${JSON.stringify(tool.metadata.parameters)}`).join("\n");
    const names = tools.map((tool)=>tool.metadata.name).join(", ");
    return `You are designed to help with a variety of tasks, from answering questions to providing summaries to other types of analyses.

## Tools
You have access to a wide variety of tools. You are responsible for using
the tools in any sequence you deem appropriate to complete the task at hand.
This may require breaking the task into subtasks and using different tools
to complete each subtask.

You have access to the following tools:
${description}

## Output Format
To answer the question, please use the following format.

"""
Thought: I need to use a tool to help me answer the question.
Action: tool name (one of ${names}) if using a tool.
Action Input: the input to the tool, in a JSON format representing the kwargs (e.g. {{"input": "hello world", "num_beams": 5}})
"""

Please ALWAYS start with a Thought.

Please use a valid JSON format for the Action Input. Do NOT do this {{'input': 'hello world', 'num_beams': 5}}.

If this format is used, the user will respond in the following format:

""""
Observation: tool response
""""

You should keep repeating the above format until you have enough information
to answer the question without using any more tools. At that point, you MUST respond
in the one of the following two formats:

""""
Thought: I can answer without using any more tools.
Answer: [your answer here]
""""

""""
Thought: I cannot answer the question with the provided tools.
Answer: Sorry, I cannot answer your query.
""""

## Current Conversation
Below is the current conversation consisting of interleaving human and assistant messages.`;
};
/**
 * @internal
 */ class GlobalSettings {
    #prompt;
    #promptHelper;
    #nodeParser;
    #chunkOverlap;
    #promptHelperAsyncLocalStorage;
    #nodeParserAsyncLocalStorage;
    #chunkOverlapAsyncLocalStorage;
    #promptAsyncLocalStorage;
    get debug() {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Settings"].debug;
    }
    get llm() {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Settings"].llm;
    }
    set llm(llm) {
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Settings"].llm = llm;
    }
    withLLM(llm, fn) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Settings"].withLLM(llm, fn);
    }
    get promptHelper() {
        if (this.#promptHelper === null) {
            this.#promptHelper = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$indices$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PromptHelper"]();
        }
        return this.#promptHelperAsyncLocalStorage.getStore() ?? this.#promptHelper;
    }
    set promptHelper(promptHelper) {
        this.#promptHelper = promptHelper;
    }
    withPromptHelper(promptHelper, fn) {
        return this.#promptHelperAsyncLocalStorage.run(promptHelper, fn);
    }
    get embedModel() {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Settings"].embedModel;
    }
    set embedModel(embedModel) {
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Settings"].embedModel = embedModel;
    }
    withEmbedModel(embedModel, fn) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Settings"].withEmbedModel(embedModel, fn);
    }
    get nodeParser() {
        if (this.#nodeParser === null) {
            this.#nodeParser = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$node$2d$parser$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SentenceSplitter"]({
                chunkSize: this.chunkSize,
                chunkOverlap: this.chunkOverlap
            });
        }
        return this.#nodeParserAsyncLocalStorage.getStore() ?? this.#nodeParser;
    }
    set nodeParser(nodeParser) {
        this.#nodeParser = nodeParser;
    }
    withNodeParser(nodeParser, fn) {
        return this.#nodeParserAsyncLocalStorage.run(nodeParser, fn);
    }
    get callbackManager() {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Settings"].callbackManager;
    }
    set callbackManager(callbackManager) {
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Settings"].callbackManager = callbackManager;
    }
    withCallbackManager(callbackManager, fn) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Settings"].withCallbackManager(callbackManager, fn);
    }
    set chunkSize(chunkSize) {
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Settings"].chunkSize = chunkSize;
    }
    get chunkSize() {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Settings"].chunkSize;
    }
    withChunkSize(chunkSize, fn) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Settings"].withChunkSize(chunkSize, fn);
    }
    get chunkOverlap() {
        return this.#chunkOverlapAsyncLocalStorage.getStore() ?? this.#chunkOverlap;
    }
    set chunkOverlap(chunkOverlap) {
        if (typeof chunkOverlap === "number") {
            this.#chunkOverlap = chunkOverlap;
        }
    }
    withChunkOverlap(chunkOverlap, fn) {
        return this.#chunkOverlapAsyncLocalStorage.run(chunkOverlap, fn);
    }
    get prompt() {
        return this.#promptAsyncLocalStorage.getStore() ?? this.#prompt;
    }
    set prompt(prompt) {
        this.#prompt = prompt;
    }
    withPrompt(prompt, fn) {
        return this.#promptAsyncLocalStorage.run(prompt, fn);
    }
    constructor(){
        this.#prompt = {};
        this.#promptHelper = null;
        this.#nodeParser = null;
        this.#promptHelperAsyncLocalStorage = new __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$async_hooks__$5b$external$5d$__$28$node$3a$async_hooks$2c$__cjs$29$__["AsyncLocalStorage"]();
        this.#nodeParserAsyncLocalStorage = new __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$async_hooks__$5b$external$5d$__$28$node$3a$async_hooks$2c$__cjs$29$__["AsyncLocalStorage"]();
        this.#chunkOverlapAsyncLocalStorage = new __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$async_hooks__$5b$external$5d$__$28$node$3a$async_hooks$2c$__cjs$29$__["AsyncLocalStorage"]();
        this.#promptAsyncLocalStorage = new __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$async_hooks__$5b$external$5d$__$28$node$3a$async_hooks$2c$__cjs$29$__["AsyncLocalStorage"]();
    }
}
const Settings = new GlobalSettings();
function reasonFormatter(reason) {
    switch(reason.type){
        case "observation":
            return `Observation: ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$utils$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["stringifyJSONToMessageContent"])(reason.observation)}`;
        case "action":
            return `Thought: ${reason.thought}\nAction: ${reason.action}\nInput: ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$utils$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["stringifyJSONToMessageContent"])(reason.input)}`;
        case "response":
            {
                return `Thought: ${reason.thought}\nAnswer: ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$utils$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["extractText"])(reason.response.message.content)}`;
            }
    }
}
function extractJsonStr(text) {
    const pattern = /\{.*\}/s;
    const match = text.match(pattern);
    if (!match) {
        throw new SyntaxError(`Could not extract json string from output: ${text}`);
    }
    return match[0];
}
function extractFinalResponse(inputText) {
    const pattern = /\s*Thought:(.*?)Answer:(.*?)$/s;
    const match = inputText.match(pattern);
    if (!match) {
        throw new Error(`Could not extract final answer from input text: ${inputText}`);
    }
    const thought = match[1].trim();
    const answer = match[2].trim();
    return [
        thought,
        answer
    ];
}
function extractToolUse(inputText) {
    const pattern = /\s*Thought: (.*?)\nAction: ([a-zA-Z0-9_]+).*?\.*[Input:]*.*?(\{.*?\})/s;
    const match = inputText.match(pattern);
    if (!match) {
        throw new Error(`Could not extract tool use from input text: "${inputText}"`);
    }
    const thought = match[1].trim();
    const action = match[2].trim();
    const actionInput = match[3].trim();
    return [
        thought,
        action,
        actionInput
    ];
}
function actionInputParser(jsonStr) {
    const processedString = jsonStr.replace(/(?<!\w)'|'(?!\w)/g, '"');
    const pattern = /"(\w+)":\s*"([^"]*)"/g;
    const matches = [
        ...processedString.matchAll(pattern)
    ];
    return Object.fromEntries(matches);
}
const reACTOutputParser = async (output, onResolveType)=>{
    let reason = null;
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$utils$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isAsyncIterable"])(output)) {
        const [peakStream, finalStream] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$agent$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createReadableStream"])(output).tee();
        const reader = peakStream.getReader();
        let type = null;
        let content = "";
        for(;;){
            const { done, value } = await reader.read();
            if (done) {
                break;
            }
            content += value.delta;
            if (content.includes("Action:")) {
                type = "action";
            } else if (content.includes("Answer:")) {
                type = "answer";
            }
        }
        if (type === null) {
            // `Thought:` is always present at the beginning of the output.
            type = "thought";
        }
        reader.releaseLock();
        if (!type) {
            throw new Error("Could not determine type of output");
        }
        onResolveType(type, finalStream);
        // step 2: do the parsing from content
        switch(type){
            case "action":
                {
                    // have to consume the stream to get the full content
                    const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$agent$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["consumeAsyncIterable"])(peakStream, content);
                    const [thought, action, input] = extractToolUse(response.content);
                    const jsonStr = extractJsonStr(input);
                    let json;
                    try {
                        json = JSON.parse(jsonStr);
                    } catch (e) {
                        json = actionInputParser(jsonStr);
                    }
                    reason = {
                        type: "action",
                        thought,
                        action,
                        input: json
                    };
                    break;
                }
            case "thought":
                {
                    const thought = "(Implicit) I can answer without any more tools!";
                    const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$agent$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["consumeAsyncIterable"])(peakStream, content);
                    reason = {
                        type: "response",
                        thought,
                        response: {
                            raw: peakStream,
                            message: response
                        }
                    };
                    break;
                }
            case "answer":
                {
                    const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$agent$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["consumeAsyncIterable"])(peakStream, content);
                    const [thought, answer] = extractFinalResponse(response.content);
                    reason = {
                        type: "response",
                        thought,
                        response: {
                            raw: response,
                            message: {
                                role: "assistant",
                                content: answer
                            }
                        }
                    };
                    break;
                }
            default:
                {
                    throw new Error(`Invalid type: ${type}`);
                }
        }
    } else {
        const content = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$utils$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["extractText"])(output.message.content);
        const type = content.includes("Answer:") ? "answer" : content.includes("Action:") ? "action" : "thought";
        onResolveType(type, output);
        // step 2: do the parsing from content
        switch(type){
            case "action":
                {
                    const [thought, action, input] = extractToolUse(content);
                    const jsonStr = extractJsonStr(input);
                    let json;
                    try {
                        json = JSON.parse(jsonStr);
                    } catch (e) {
                        json = actionInputParser(jsonStr);
                    }
                    reason = {
                        type: "action",
                        thought,
                        action,
                        input: json
                    };
                    break;
                }
            case "thought":
                {
                    const thought = "(Implicit) I can answer without any more tools!";
                    reason = {
                        type: "response",
                        thought,
                        response: {
                            raw: output,
                            message: {
                                role: "assistant",
                                content: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$utils$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["extractText"])(output.message.content)
                            }
                        }
                    };
                    break;
                }
            case "answer":
                {
                    const [thought, answer] = extractFinalResponse(content);
                    reason = {
                        type: "response",
                        thought,
                        response: {
                            raw: output,
                            message: {
                                role: "assistant",
                                content: answer
                            }
                        }
                    };
                    break;
                }
            default:
                {
                    throw new Error(`Invalid type: ${type}`);
                }
        }
    }
    if (reason === null) {
        throw new TypeError("Reason is null");
    }
    return reason;
};
const chatFormatter = async (tools, messages, currentReasons)=>{
    const header = getReACTAgentSystemHeader(tools);
    const reasonMessages = [];
    for (const reason of currentReasons){
        const response = await reasonFormatter(reason);
        reasonMessages.push({
            role: reason.type === "observation" ? "user" : "assistant",
            content: response
        });
    }
    return [
        {
            role: "system",
            content: header
        },
        ...messages,
        ...reasonMessages
    ];
};
class ReACTAgentWorker extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$agent$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AgentWorker"] {
    constructor(...args){
        super(...args), this.taskHandler = ReActAgent.taskHandler;
    }
}
class ReActAgent extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$agent$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["AgentRunner"] {
    constructor(params){
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$agent$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["validateAgentParams"])(params);
        super({
            llm: params.llm ?? Settings.llm,
            chatHistory: params.chatHistory ?? [],
            runner: new ReACTAgentWorker(),
            systemPrompt: params.systemPrompt ?? null,
            tools: "tools" in params ? params.tools : params.toolRetriever.retrieve.bind(params.toolRetriever),
            verbose: params.verbose ?? false
        });
    }
    createStore() {
        return {
            reasons: []
        };
    }
    static{
        this.taskHandler = async (step, enqueueOutput)=>{
            const { llm, stream, getTools } = step.context;
            const lastMessage = step.context.store.messages.at(-1).content;
            const tools = await getTools(lastMessage);
            const messages = await chatFormatter(tools, step.context.store.messages, step.context.store.reasons);
            const response = await llm.chat({
                // @ts-expect-error boolean
                stream,
                messages
            });
            const reason = await reACTOutputParser(response, (type, response)=>{
                enqueueOutput({
                    taskStep: step,
                    output: response,
                    isLast: type !== "action"
                });
            });
            step.context.logger.log("current reason: %O", reason);
            step.context.store.reasons = [
                ...step.context.store.reasons,
                reason
            ];
            if (reason.type === "action") {
                const tool = tools.find((tool)=>tool.metadata.name === reason.action);
                const toolOutput = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$agent$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["callTool"])(tool, {
                    id: (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["randomUUID"])(),
                    input: reason.input,
                    name: reason.action
                }, step.context.logger);
                step.context.store.reasons = [
                    ...step.context.store.reasons,
                    {
                        type: "observation",
                        observation: toolOutput.output
                    }
                ];
            }
        };
    }
}
;
}}),
"[project]/node_modules/.pnpm/llamaindex@0.11.19_@llama-flow+core@0.4.4_next@15.3.4_react-dom@19.1.0_react@19.1.0__re_1d30be2795de4d1906fac150e4bc1023/node_modules/llamaindex/agent/dist/index.js [app-route] (ecmascript) <module evaluation>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$agent$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/agent/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$utils$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/utils/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$env$40$0$2e$1$2e$30$2f$node_modules$2f40$llamaindex$2f$env$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+env@0.1.30/node_modules/@llamaindex/env/dist/index.js [app-route] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/global/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$indices$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/indices/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$node$2d$parser$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/node-parser/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$llamaindex$40$0$2e$11$2e$19_$40$llama$2d$flow$2b$core$40$0$2e$4$2e$4_next$40$15$2e$3$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$re_1d30be2795de4d1906fac150e4bc1023$2f$node_modules$2f$llamaindex$2f$agent$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/llamaindex@0.11.19_@llama-flow+core@0.4.4_next@15.3.4_react-dom@19.1.0_react@19.1.0__re_1d30be2795de4d1906fac150e4bc1023/node_modules/llamaindex/agent/dist/index.js [app-route] (ecmascript) <locals>");
}}),
"[project]/node_modules/.pnpm/llamaindex@0.11.19_@llama-flow+core@0.4.4_next@15.3.4_react-dom@19.1.0_react@19.1.0__re_1d30be2795de4d1906fac150e4bc1023/node_modules/llamaindex/cloud/dist/index.js [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "LLamaCloudFileService": (()=>LLamaCloudFileService),
    "LlamaCloudIndex": (()=>LlamaCloudIndex),
    "LlamaCloudRetriever": (()=>LlamaCloudRetriever)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$cloud$40$4$2e$0$2e$24_$40$llama$2d$flow$2b$core$40$0$2e$4$2e$4_next$40$15$2e$3$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1_80eeee9fe2264cd96589698f7343c8cb$2f$node_modules$2f40$llamaindex$2f$cloud$2f$api$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+cloud@4.0.24_@llama-flow+core@0.4.4_next@15.3.4_react-dom@19.1.0_react@19.1_80eeee9fe2264cd96589698f7343c8cb/node_modules/@llamaindex/cloud/api/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/global/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$env$40$0$2e$1$2e$30$2f$node_modules$2f40$llamaindex$2f$env$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+env@0.1.30/node_modules/@llamaindex/env/dist/index.js [app-route] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$env$40$0$2e$1$2e$30$2f$node_modules$2f40$llamaindex$2f$env$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+env@0.1.30/node_modules/@llamaindex/env/dist/index.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$async_hooks__$5b$external$5d$__$28$node$3a$async_hooks$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:async_hooks [external] (node:async_hooks, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$query$2d$engine$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/query-engine/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$retriever$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/retriever/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$schema$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/schema/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$utils$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/utils/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$indices$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/indices/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$node$2d$parser$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/node-parser/dist/index.js [app-route] (ecmascript)");
;
;
;
;
;
;
;
;
;
function getBaseUrl(baseUrl) {
    return baseUrl ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$env$40$0$2e$1$2e$30$2f$node_modules$2f40$llamaindex$2f$env$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["getEnv"])("LLAMA_CLOUD_BASE_URL") ?? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DEFAULT_BASE_URL"];
}
function getAppBaseUrl() {
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$cloud$40$4$2e$0$2e$24_$40$llama$2d$flow$2b$core$40$0$2e$4$2e$4_next$40$15$2e$3$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1_80eeee9fe2264cd96589698f7343c8cb$2f$node_modules$2f40$llamaindex$2f$cloud$2f$api$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["client"].getConfig().baseUrl?.replace(/api\./, "") ?? "";
}
// fixme: refactor this to init at the top level or module level
let initOnce = false;
function initService({ apiKey, baseUrl } = {}) {
    if (initOnce) {
        return;
    }
    initOnce = true;
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$cloud$40$4$2e$0$2e$24_$40$llama$2d$flow$2b$core$40$0$2e$4$2e$4_next$40$15$2e$3$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1_80eeee9fe2264cd96589698f7343c8cb$2f$node_modules$2f40$llamaindex$2f$cloud$2f$api$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["client"].setConfig({
        baseUrl: getBaseUrl(baseUrl),
        throwOnError: true
    });
    const token = apiKey ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$env$40$0$2e$1$2e$30$2f$node_modules$2f40$llamaindex$2f$env$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["getEnv"])("LLAMA_CLOUD_API_KEY");
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$cloud$40$4$2e$0$2e$24_$40$llama$2d$flow$2b$core$40$0$2e$4$2e$4_next$40$15$2e$3$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1_80eeee9fe2264cd96589698f7343c8cb$2f$node_modules$2f40$llamaindex$2f$cloud$2f$api$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["client"].interceptors.request.use((request)=>{
        request.headers.set("Authorization", `Bearer ${token}`);
        return request;
    });
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$cloud$40$4$2e$0$2e$24_$40$llama$2d$flow$2b$core$40$0$2e$4$2e$4_next$40$15$2e$3$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1_80eeee9fe2264cd96589698f7343c8cb$2f$node_modules$2f40$llamaindex$2f$cloud$2f$api$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["client"].interceptors.error.use((error)=>{
        throw new Error(`LlamaCloud API request failed. Error details: ${JSON.stringify(error)}`);
    });
    if (!token) {
        throw new Error("API Key is required for LlamaCloudIndex. Please pass the apiKey parameter");
    }
}
async function getProjectId(projectName, organizationId) {
    const { data: projects } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$cloud$40$4$2e$0$2e$24_$40$llama$2d$flow$2b$core$40$0$2e$4$2e$4_next$40$15$2e$3$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1_80eeee9fe2264cd96589698f7343c8cb$2f$node_modules$2f40$llamaindex$2f$cloud$2f$api$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["listProjectsApiV1ProjectsGet"])({
        query: {
            project_name: projectName,
            organization_id: organizationId ?? null
        },
        throwOnError: true
    });
    if (projects.length === 0) {
        throw new Error(`Unknown project name ${projectName}. Please confirm a managed project with this name exists.`);
    } else if (projects.length > 1) {
        throw new Error(`Multiple projects found with name ${projectName}. Please specify organization_id.`);
    }
    const project = projects[0];
    if (!project.id) {
        throw new Error(`No project found with name ${projectName}`);
    }
    return project.id;
}
async function getPipelineId(name, projectName, organizationId) {
    const { data: pipelines } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$cloud$40$4$2e$0$2e$24_$40$llama$2d$flow$2b$core$40$0$2e$4$2e$4_next$40$15$2e$3$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1_80eeee9fe2264cd96589698f7343c8cb$2f$node_modules$2f40$llamaindex$2f$cloud$2f$api$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["searchPipelinesApiV1PipelinesGet"])({
        query: {
            project_id: await getProjectId(projectName, organizationId),
            pipeline_name: name
        },
        throwOnError: true
    });
    if (pipelines.length === 0 || !pipelines[0].id) {
        throw new Error(`No pipeline found with name ${name} in project ${projectName}`);
    }
    return pipelines[0].id;
}
class LLamaCloudFileService {
    /**
   * Get list of projects, each project contains a list of pipelines
   */ static async getAllProjectsWithPipelines() {
        initService();
        try {
            const { data: projects } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$cloud$40$4$2e$0$2e$24_$40$llama$2d$flow$2b$core$40$0$2e$4$2e$4_next$40$15$2e$3$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1_80eeee9fe2264cd96589698f7343c8cb$2f$node_modules$2f40$llamaindex$2f$cloud$2f$api$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["listProjectsApiV1ProjectsGet"])({
                throwOnError: true
            });
            const { data: pipelines } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$cloud$40$4$2e$0$2e$24_$40$llama$2d$flow$2b$core$40$0$2e$4$2e$4_next$40$15$2e$3$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1_80eeee9fe2264cd96589698f7343c8cb$2f$node_modules$2f40$llamaindex$2f$cloud$2f$api$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["searchPipelinesApiV1PipelinesGet"])({
                throwOnError: true
            });
            return projects.map((project)=>({
                    ...project,
                    pipelines: pipelines.filter((p)=>p.project_id === project.id)
                }));
        } catch (error) {
            console.error("Error listing projects and pipelines:", error);
            return [];
        }
    }
    /**
   * Upload a file to a pipeline in LlamaCloud
   */ static async addFileToPipeline(projectId, pipelineId, uploadFile, customMetadata = {}) {
        initService();
        const { data: file } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$cloud$40$4$2e$0$2e$24_$40$llama$2d$flow$2b$core$40$0$2e$4$2e$4_next$40$15$2e$3$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1_80eeee9fe2264cd96589698f7343c8cb$2f$node_modules$2f40$llamaindex$2f$cloud$2f$api$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["uploadFileApiV1FilesPost"])({
            query: {
                project_id: projectId
            },
            body: {
                upload_file: uploadFile
            },
            throwOnError: true
        });
        const files = [
            {
                file_id: file.id,
                custom_metadata: {
                    file_id: file.id,
                    ...customMetadata
                }
            }
        ];
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$cloud$40$4$2e$0$2e$24_$40$llama$2d$flow$2b$core$40$0$2e$4$2e$4_next$40$15$2e$3$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1_80eeee9fe2264cd96589698f7343c8cb$2f$node_modules$2f40$llamaindex$2f$cloud$2f$api$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["addFilesToPipelineApiApiV1PipelinesPipelineIdFilesPut"])({
            path: {
                pipeline_id: pipelineId
            },
            body: files
        });
        // Wait 2s for the file to be processed
        const maxAttempts = 20;
        let attempt = 0;
        while(attempt < maxAttempts){
            const { data: result } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$cloud$40$4$2e$0$2e$24_$40$llama$2d$flow$2b$core$40$0$2e$4$2e$4_next$40$15$2e$3$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1_80eeee9fe2264cd96589698f7343c8cb$2f$node_modules$2f40$llamaindex$2f$cloud$2f$api$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getPipelineFileStatusApiV1PipelinesPipelineIdFilesFileIdStatusGet"])({
                path: {
                    pipeline_id: pipelineId,
                    file_id: file.id
                },
                throwOnError: true
            });
            if (result.status === "ERROR") {
                throw new Error(`File processing failed: ${JSON.stringify(result)}`);
            }
            if (result.status === "SUCCESS") {
                // File is ingested - return the file id
                return file.id;
            }
            attempt += 1;
            await new Promise((resolve)=>setTimeout(resolve, 100)); // Sleep for 100ms
        }
        throw new Error(`File processing did not complete after ${maxAttempts} attempts. Check your LlamaCloud index at https://cloud.llamaindex.ai/project/${projectId}/deploy/${pipelineId} for more details.`);
    }
    /**
   * Get download URL for a file in LlamaCloud
   */ static async getFileUrl(pipelineId, filename) {
        initService();
        const { data: allPipelineFiles } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$cloud$40$4$2e$0$2e$24_$40$llama$2d$flow$2b$core$40$0$2e$4$2e$4_next$40$15$2e$3$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1_80eeee9fe2264cd96589698f7343c8cb$2f$node_modules$2f40$llamaindex$2f$cloud$2f$api$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["listPipelineFilesApiV1PipelinesPipelineIdFilesGet"])({
            path: {
                pipeline_id: pipelineId
            },
            throwOnError: true
        });
        const file = allPipelineFiles.find((file)=>file.name === filename);
        if (!file?.file_id) return null;
        const { data: fileContent } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$cloud$40$4$2e$0$2e$24_$40$llama$2d$flow$2b$core$40$0$2e$4$2e$4_next$40$15$2e$3$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1_80eeee9fe2264cd96589698f7343c8cb$2f$node_modules$2f40$llamaindex$2f$cloud$2f$api$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["readFileContentApiV1FilesIdContentGet"])({
            path: {
                id: file.file_id
            },
            query: {
                project_id: file.project_id
            },
            throwOnError: true
        });
        return fileContent.url;
    }
}
class LlamaCloudRetriever extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$retriever$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BaseRetriever"] {
    resultNodesToNodeWithScore(nodes) {
        return nodes.map((node)=>{
            const textNode = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$schema$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsonToNode"])(node.node, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$schema$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ObjectType"].TEXT);
            textNode.metadata = {
                ...textNode.metadata,
                ...node.node.extra_info
            };
            return {
                // Currently LlamaCloud only supports text nodes
                node: textNode,
                score: node.score ?? undefined
            };
        });
    }
    // LlamaCloud expects null values for filters, but LlamaIndexTS uses undefined for empty values
    // This function converts the undefined values to null
    convertFilter(filters) {
        if (!filters) return null;
        const processFilter = (filter)=>{
            if ("filters" in filter) {
                // type MetadataFilters
                return {
                    ...filter,
                    filters: filter.filters.map(processFilter)
                };
            }
            return {
                ...filter,
                value: filter.value ?? null
            };
        };
        return {
            ...filters,
            filters: filters.filters.map(processFilter)
        };
    }
    constructor(params){
        super(), this.projectName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DEFAULT_PROJECT_NAME"];
        this.clientParams = {
            apiKey: params.apiKey,
            baseUrl: params.baseUrl
        };
        initService(this.clientParams);
        this.retrieveParams = params;
        this.pipelineName = params.name;
        if (params.projectName) {
            this.projectName = params.projectName;
        }
        if (params.organizationId) {
            this.organizationId = params.organizationId;
        }
    }
    async _retrieve(query) {
        const pipelineId = await getPipelineId(this.pipelineName, this.projectName, this.organizationId);
        const filters = this.convertFilter(this.retrieveParams.filters);
        const { data: results } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$cloud$40$4$2e$0$2e$24_$40$llama$2d$flow$2b$core$40$0$2e$4$2e$4_next$40$15$2e$3$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1_80eeee9fe2264cd96589698f7343c8cb$2f$node_modules$2f40$llamaindex$2f$cloud$2f$api$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["runSearchApiV1PipelinesPipelineIdRetrievePost"])({
            throwOnError: true,
            path: {
                pipeline_id: pipelineId
            },
            body: {
                ...this.retrieveParams,
                query: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$utils$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["extractText"])(query),
                search_filters: filters,
                dense_similarity_top_k: this.retrieveParams.similarityTopK
            }
        });
        return this.resultNodesToNodeWithScore(results.retrieval_nodes);
    }
}
/**
 * @internal
 */ class GlobalSettings {
    #prompt;
    #promptHelper;
    #nodeParser;
    #chunkOverlap;
    #promptHelperAsyncLocalStorage;
    #nodeParserAsyncLocalStorage;
    #chunkOverlapAsyncLocalStorage;
    #promptAsyncLocalStorage;
    get debug() {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Settings"].debug;
    }
    get llm() {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Settings"].llm;
    }
    set llm(llm) {
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Settings"].llm = llm;
    }
    withLLM(llm, fn) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Settings"].withLLM(llm, fn);
    }
    get promptHelper() {
        if (this.#promptHelper === null) {
            this.#promptHelper = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$indices$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PromptHelper"]();
        }
        return this.#promptHelperAsyncLocalStorage.getStore() ?? this.#promptHelper;
    }
    set promptHelper(promptHelper) {
        this.#promptHelper = promptHelper;
    }
    withPromptHelper(promptHelper, fn) {
        return this.#promptHelperAsyncLocalStorage.run(promptHelper, fn);
    }
    get embedModel() {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Settings"].embedModel;
    }
    set embedModel(embedModel) {
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Settings"].embedModel = embedModel;
    }
    withEmbedModel(embedModel, fn) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Settings"].withEmbedModel(embedModel, fn);
    }
    get nodeParser() {
        if (this.#nodeParser === null) {
            this.#nodeParser = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$node$2d$parser$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SentenceSplitter"]({
                chunkSize: this.chunkSize,
                chunkOverlap: this.chunkOverlap
            });
        }
        return this.#nodeParserAsyncLocalStorage.getStore() ?? this.#nodeParser;
    }
    set nodeParser(nodeParser) {
        this.#nodeParser = nodeParser;
    }
    withNodeParser(nodeParser, fn) {
        return this.#nodeParserAsyncLocalStorage.run(nodeParser, fn);
    }
    get callbackManager() {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Settings"].callbackManager;
    }
    set callbackManager(callbackManager) {
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Settings"].callbackManager = callbackManager;
    }
    withCallbackManager(callbackManager, fn) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Settings"].withCallbackManager(callbackManager, fn);
    }
    set chunkSize(chunkSize) {
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Settings"].chunkSize = chunkSize;
    }
    get chunkSize() {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Settings"].chunkSize;
    }
    withChunkSize(chunkSize, fn) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Settings"].withChunkSize(chunkSize, fn);
    }
    get chunkOverlap() {
        return this.#chunkOverlapAsyncLocalStorage.getStore() ?? this.#chunkOverlap;
    }
    set chunkOverlap(chunkOverlap) {
        if (typeof chunkOverlap === "number") {
            this.#chunkOverlap = chunkOverlap;
        }
    }
    withChunkOverlap(chunkOverlap, fn) {
        return this.#chunkOverlapAsyncLocalStorage.run(chunkOverlap, fn);
    }
    get prompt() {
        return this.#promptAsyncLocalStorage.getStore() ?? this.#prompt;
    }
    set prompt(prompt) {
        this.#prompt = prompt;
    }
    withPrompt(prompt, fn) {
        return this.#promptAsyncLocalStorage.run(prompt, fn);
    }
    constructor(){
        this.#prompt = {};
        this.#promptHelper = null;
        this.#nodeParser = null;
        this.#promptHelperAsyncLocalStorage = new __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$async_hooks__$5b$external$5d$__$28$node$3a$async_hooks$2c$__cjs$29$__["AsyncLocalStorage"]();
        this.#nodeParserAsyncLocalStorage = new __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$async_hooks__$5b$external$5d$__$28$node$3a$async_hooks$2c$__cjs$29$__["AsyncLocalStorage"]();
        this.#chunkOverlapAsyncLocalStorage = new __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$async_hooks__$5b$external$5d$__$28$node$3a$async_hooks$2c$__cjs$29$__["AsyncLocalStorage"]();
        this.#promptAsyncLocalStorage = new __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$async_hooks__$5b$external$5d$__$28$node$3a$async_hooks$2c$__cjs$29$__["AsyncLocalStorage"]();
    }
}
const Settings = new GlobalSettings();
const DEFAULT_NAME = "query_engine_tool";
const DEFAULT_DESCRIPTION = "Useful for running a natural language query against a knowledge base and get back a natural language response.";
const DEFAULT_PARAMETERS = {
    type: "object",
    properties: {
        query: {
            type: "string",
            description: "The query to search for"
        }
    },
    required: [
        "query"
    ]
};
class QueryEngineTool {
    constructor({ queryEngine, metadata, includeSourceNodes }){
        this.queryEngine = queryEngine;
        this.metadata = {
            name: metadata?.name ?? DEFAULT_NAME,
            description: metadata?.description ?? DEFAULT_DESCRIPTION,
            parameters: metadata?.parameters ?? DEFAULT_PARAMETERS
        };
        this.includeSourceNodes = includeSourceNodes ?? false;
    }
    async call({ query }) {
        const response = await this.queryEngine.query({
            query
        });
        if (!this.includeSourceNodes) {
            return {
                content: response.message.content
            };
        }
        return {
            content: response.message.content,
            sourceNodes: response.sourceNodes
        };
    }
}
class LlamaCloudIndex {
    constructor(params){
        this.params = params;
        initService(this.params);
    }
    async waitForPipelineIngestion(verbose = Settings.debug, raiseOnError = false) {
        const pipelineId = await this.getPipelineId();
        if (verbose) {
            console.log("Waiting for pipeline ingestion: ");
        }
        while(true){
            const { data: pipelineStatus } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$cloud$40$4$2e$0$2e$24_$40$llama$2d$flow$2b$core$40$0$2e$4$2e$4_next$40$15$2e$3$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1_80eeee9fe2264cd96589698f7343c8cb$2f$node_modules$2f40$llamaindex$2f$cloud$2f$api$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getPipelineStatusApiV1PipelinesPipelineIdStatusGet"])({
                path: {
                    pipeline_id: pipelineId
                },
                throwOnError: true
            });
            if (pipelineStatus.status === "SUCCESS") {
                if (verbose) {
                    console.log("Pipeline ingestion completed successfully");
                }
                break;
            }
            if (pipelineStatus.status === "ERROR") {
                if (verbose) {
                    console.error("Pipeline ingestion failed");
                }
                if (raiseOnError) {
                    throw new Error("Pipeline ingestion failed");
                }
            }
            if (verbose) {
                process.stdout.write(".");
            }
            await new Promise((resolve)=>setTimeout(resolve, 1000));
        }
    }
    async waitForDocumentIngestion(docIds, verbose = Settings.debug, raiseOnError = false) {
        const pipelineId = await this.getPipelineId();
        if (verbose) {
            console.log("Loading data: ");
        }
        const pendingDocs = new Set(docIds);
        while(pendingDocs.size){
            const docsToRemove = new Set();
            for (const doc of pendingDocs){
                const { data: { status } } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$cloud$40$4$2e$0$2e$24_$40$llama$2d$flow$2b$core$40$0$2e$4$2e$4_next$40$15$2e$3$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1_80eeee9fe2264cd96589698f7343c8cb$2f$node_modules$2f40$llamaindex$2f$cloud$2f$api$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getPipelineDocumentStatusApiV1PipelinesPipelineIdDocumentsDocumentIdStatusGet"])({
                    path: {
                        pipeline_id: pipelineId,
                        document_id: doc
                    },
                    throwOnError: true
                });
                if (status === "NOT_STARTED" || status === "IN_PROGRESS") {
                    continue;
                }
                if (status === "ERROR") {
                    if (verbose) {
                        console.error(`Document ingestion failed for ${doc}`);
                    }
                    if (raiseOnError) {
                        throw new Error(`Document ingestion failed for ${doc}`);
                    }
                }
                docsToRemove.add(doc);
            }
            for (const doc of docsToRemove){
                pendingDocs.delete(doc);
            }
            if (pendingDocs.size) {
                if (verbose) {
                    process.stdout.write(".");
                }
                await new Promise((resolve)=>setTimeout(resolve, 500));
            }
        }
        if (verbose) {
            console.log("Done!");
        }
        await this.waitForPipelineIngestion(verbose, raiseOnError);
    }
    async getPipelineId(name, projectName, organizationId) {
        return await getPipelineId(name ?? this.params.name, projectName ?? this.params.projectName, organizationId ?? this.params.organizationId);
    }
    async getProjectId(projectName, organizationId) {
        return await getProjectId(projectName ?? this.params.projectName, organizationId ?? this.params.organizationId);
    }
    /**
   * Adds documents to the given index parameters. If the index does not exist, it will be created.
   *
   * @param params - An object containing the following properties:
   *   - documents: An array of Document objects to be added to the index.
   *   - verbose: Optional boolean to enable verbose logging.
   *   - Additional properties from CloudConstructorParams.
   * @returns A Promise that resolves to a new LlamaCloudIndex instance.
   */ static async fromDocuments(params, config) {
        const index = new LlamaCloudIndex({
            ...params
        });
        await index.ensureIndex({
            ...config,
            verbose: params.verbose ?? false
        });
        await index.addDocuments(params.documents, params.verbose);
        return index;
    }
    async addDocuments(documents, verbose) {
        const apiUrl = getAppBaseUrl();
        const projectId = await this.getProjectId();
        const pipelineId = await this.getPipelineId();
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$cloud$40$4$2e$0$2e$24_$40$llama$2d$flow$2b$core$40$0$2e$4$2e$4_next$40$15$2e$3$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1_80eeee9fe2264cd96589698f7343c8cb$2f$node_modules$2f40$llamaindex$2f$cloud$2f$api$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["upsertBatchPipelineDocumentsApiV1PipelinesPipelineIdDocumentsPut"])({
            path: {
                pipeline_id: pipelineId
            },
            body: documents.map((doc)=>({
                    metadata: doc.metadata,
                    text: doc.text,
                    excluded_embed_metadata_keys: doc.excludedEmbedMetadataKeys,
                    excluded_llm_metadata_keys: doc.excludedEmbedMetadataKeys,
                    id: doc.id_
                }))
        });
        while(true){
            const { data: pipelineStatus } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$cloud$40$4$2e$0$2e$24_$40$llama$2d$flow$2b$core$40$0$2e$4$2e$4_next$40$15$2e$3$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1_80eeee9fe2264cd96589698f7343c8cb$2f$node_modules$2f40$llamaindex$2f$cloud$2f$api$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getPipelineStatusApiV1PipelinesPipelineIdStatusGet"])({
                path: {
                    pipeline_id: pipelineId
                },
                throwOnError: true
            });
            if (pipelineStatus.status === "SUCCESS") {
                console.info("Documents ingested successfully, pipeline is ready to use");
                break;
            }
            if (pipelineStatus.status === "ERROR") {
                console.error(`Some documents failed to ingest, check your pipeline logs at ${apiUrl}/project/${projectId}/deploy/${pipelineId}`);
                throw new Error("Some documents failed to ingest");
            }
            if (pipelineStatus.status === "PARTIAL_SUCCESS") {
                console.info(`Documents ingestion partially succeeded, to check a more complete status check your pipeline at ${apiUrl}/project/${projectId}/deploy/${pipelineId}`);
                break;
            }
            if (verbose) {
                process.stdout.write(".");
            }
            await new Promise((resolve)=>setTimeout(resolve, 1000));
        }
        if (verbose) {
            console.info(`Ingestion completed, find your index at ${apiUrl}/project/${projectId}/deploy/${pipelineId}`);
        }
    }
    asRetriever(params = {}) {
        return new LlamaCloudRetriever({
            ...this.params,
            ...params
        });
    }
    asQueryEngine(params) {
        const retriever = new LlamaCloudRetriever({
            ...this.params,
            ...params
        });
        return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$query$2d$engine$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["RetrieverQueryEngine"](retriever, params?.responseSynthesizer, params?.nodePostprocessors);
    }
    asQueryTool(params) {
        if (params.options) {
            params.retriever = this.asRetriever(params.options);
        }
        return new QueryEngineTool({
            queryEngine: this.asQueryEngine(params),
            metadata: params?.metadata,
            includeSourceNodes: params?.includeSourceNodes ?? false
        });
    }
    queryTool(params) {
        return this.asQueryTool(params);
    }
    async insert(document) {
        const pipelineId = await this.getPipelineId();
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$cloud$40$4$2e$0$2e$24_$40$llama$2d$flow$2b$core$40$0$2e$4$2e$4_next$40$15$2e$3$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1_80eeee9fe2264cd96589698f7343c8cb$2f$node_modules$2f40$llamaindex$2f$cloud$2f$api$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createBatchPipelineDocumentsApiV1PipelinesPipelineIdDocumentsPost"])({
            path: {
                pipeline_id: pipelineId
            },
            body: [
                {
                    metadata: document.metadata,
                    text: document.text,
                    excluded_embed_metadata_keys: document.excludedLlmMetadataKeys,
                    excluded_llm_metadata_keys: document.excludedEmbedMetadataKeys,
                    id: document.id_
                }
            ]
        });
        await this.waitForDocumentIngestion([
            document.id_
        ]);
    }
    async delete(document) {
        const pipelineId = await this.getPipelineId();
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$cloud$40$4$2e$0$2e$24_$40$llama$2d$flow$2b$core$40$0$2e$4$2e$4_next$40$15$2e$3$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1_80eeee9fe2264cd96589698f7343c8cb$2f$node_modules$2f40$llamaindex$2f$cloud$2f$api$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["deletePipelineDocumentApiV1PipelinesPipelineIdDocumentsDocumentIdDelete"])({
            path: {
                pipeline_id: pipelineId,
                document_id: document.id_
            }
        });
        await this.waitForPipelineIngestion();
    }
    async refreshDoc(document) {
        const pipelineId = await this.getPipelineId();
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$cloud$40$4$2e$0$2e$24_$40$llama$2d$flow$2b$core$40$0$2e$4$2e$4_next$40$15$2e$3$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1_80eeee9fe2264cd96589698f7343c8cb$2f$node_modules$2f40$llamaindex$2f$cloud$2f$api$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["upsertBatchPipelineDocumentsApiV1PipelinesPipelineIdDocumentsPut"])({
            path: {
                pipeline_id: pipelineId
            },
            body: [
                {
                    metadata: document.metadata,
                    text: document.text,
                    excluded_embed_metadata_keys: document.excludedLlmMetadataKeys,
                    excluded_llm_metadata_keys: document.excludedEmbedMetadataKeys,
                    id: document.id_
                }
            ]
        });
        await this.waitForDocumentIngestion([
            document.id_
        ]);
    }
    async ensureIndex(config) {
        const projectId = await this.getProjectId();
        const { data: pipelines } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$cloud$40$4$2e$0$2e$24_$40$llama$2d$flow$2b$core$40$0$2e$4$2e$4_next$40$15$2e$3$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1_80eeee9fe2264cd96589698f7343c8cb$2f$node_modules$2f40$llamaindex$2f$cloud$2f$api$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["searchPipelinesApiV1PipelinesGet"])({
            query: {
                project_id: projectId,
                pipeline_name: this.params.name
            },
            throwOnError: true
        });
        if (pipelines.length === 0) {
            // no pipeline found, create a new one
            let embeddingConfig = config?.embedding;
            if (!embeddingConfig) {
                // no embedding config provided, use OpenAI as default
                const openAIApiKey = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$env$40$0$2e$1$2e$30$2f$node_modules$2f40$llamaindex$2f$env$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["getEnv"])("OPENAI_API_KEY");
                const embeddingModel = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$env$40$0$2e$1$2e$30$2f$node_modules$2f40$llamaindex$2f$env$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["getEnv"])("EMBEDDING_MODEL");
                if (!openAIApiKey || !embeddingModel) {
                    throw new Error("No embedding configuration provided. Fallback to OpenAI embedding model. OPENAI_API_KEY and EMBEDDING_MODEL environment variables must be set.");
                }
                embeddingConfig = {
                    type: "OPENAI_EMBEDDING",
                    component: {
                        api_key: openAIApiKey,
                        model_name: embeddingModel
                    }
                };
            }
            let transformConfig = config?.transform;
            if (!transformConfig) {
                transformConfig = {
                    mode: "auto",
                    chunk_size: 1024,
                    chunk_overlap: 200
                };
            }
            const { data: pipeline } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$cloud$40$4$2e$0$2e$24_$40$llama$2d$flow$2b$core$40$0$2e$4$2e$4_next$40$15$2e$3$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1_80eeee9fe2264cd96589698f7343c8cb$2f$node_modules$2f40$llamaindex$2f$cloud$2f$api$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["upsertPipelineApiV1PipelinesPut"])({
                query: {
                    project_id: projectId
                },
                body: {
                    name: this.params.name,
                    embedding_config: embeddingConfig,
                    transform_config: transformConfig
                },
                throwOnError: true
            });
            if (config?.verbose) {
                console.log(`Created pipeline ${pipeline.id} with name ${pipeline.name}`);
            }
        }
    }
}
;
}}),
"[project]/node_modules/.pnpm/llamaindex@0.11.19_@llama-flow+core@0.4.4_next@15.3.4_react-dom@19.1.0_react@19.1.0__re_1d30be2795de4d1906fac150e4bc1023/node_modules/llamaindex/selectors/dist/index.js [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "BaseSelector": (()=>BaseSelector),
    "LLMMultiSelector": (()=>LLMMultiSelector),
    "LLMSingleSelector": (()=>LLMSingleSelector),
    "getSelectorFromContext": (()=>getSelectorFromContext)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$prompts$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/prompts/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$utils$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/utils/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/global/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$indices$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/indices/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$node$2d$parser$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/node-parser/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$env$40$0$2e$1$2e$30$2f$node_modules$2f40$llamaindex$2f$env$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+env@0.1.30/node_modules/@llamaindex/env/dist/index.js [app-route] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$async_hooks__$5b$external$5d$__$28$node$3a$async_hooks$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:async_hooks [external] (node:async_hooks, cjs)");
;
;
;
;
;
;
function wrapChoice(choice) {
    if (typeof choice === "string") {
        return {
            description: choice
        };
    } else {
        return choice;
    }
}
class BaseSelector extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$prompts$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PromptMixin"] {
    async select(choices, query) {
        const metadata = choices.map((choice)=>wrapChoice(choice));
        return await this._select(metadata, query);
    }
}
/**
 * Error class for output parsing. Due to the nature of LLMs, anytime we use LLM
 * to generate structured output, it's possible that it will hallucinate something
 * that doesn't match the expected output format. So make sure to catch these
 * errors in production.
 */ class OutputParserError extends Error {
    constructor(message, options = {}){
        super(message, options); // https://github.com/tc39/proposal-error-cause
        this.name = "OutputParserError";
        if (!this.cause) {
            // Need to check for those environments that have implemented the proposal
            this.cause = options.cause;
        }
        this.output = options.output;
        // This line is to maintain proper stack trace in V8
        // (https://v8.dev/docs/stack-trace-api)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, OutputParserError);
        }
    }
}
/**
 *
 * @param text A markdown block with JSON
 * @returns parsed JSON object
 */ function parseJsonMarkdown(text) {
    text = text.trim();
    const left_square = text.indexOf("[");
    const left_brace = text.indexOf("{");
    let left;
    let right;
    if (left_square < left_brace && left_square != -1) {
        left = left_square;
        right = text.lastIndexOf("]");
    } else {
        left = left_brace;
        right = text.lastIndexOf("}");
    }
    const jsonText = text.substring(left, right + 1);
    try {
        //Single JSON object case
        if (left_square === -1) {
            return [
                JSON.parse(jsonText)
            ];
        }
        //Multiple JSON object case.
        return JSON.parse(jsonText);
    } catch (e) {
        throw new OutputParserError("Not a json markdown", {
            output: text
        });
    }
}
const formatStr = `The output should be ONLY JSON formatted as a JSON instance.

Here is an example:
[
    {
        "choice": 1,
        "reason": "<insert reason for choice>"
    },
    ...
]
`;
/*
 * An OutputParser is used to extract structured data from the raw output of the LLM.
 */ class SelectionOutputParser {
    /**
   *
   * @param output
   */ parse(output) {
        let parsed;
        try {
            parsed = parseJsonMarkdown(output);
        } catch (e) {
            try {
                parsed = JSON.parse(output);
            } catch (e) {
                throw new Error(`Got invalid JSON object. Error: ${e}. Got JSON string: ${output}`);
            }
        }
        return {
            rawOutput: output,
            parsedOutput: parsed
        };
    }
    format(output) {
        return output + "\n\n" + formatStr;
    }
}
const defaultSingleSelectPrompt = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$prompts$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PromptTemplate"]({
    templateVars: [
        "context",
        "query",
        "numChoices"
    ],
    template: `Some choices are given below. It is provided in a numbered list (1 to {numChoices}), where each item in the list corresponds to a summary.
---------------------
{context}
---------------------
Using only the choices above and not prior knowledge, return the choice that is most relevant to the question: '{query}'
`
});
const defaultMultiSelectPrompt = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$prompts$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PromptTemplate"]({
    templateVars: [
        "contextList",
        "query",
        "maxOutputs",
        "numChoices"
    ],
    template: `Some choices are given below. It is provided in a numbered list (1 to {numChoices}), where each item in the list corresponds to a summary.
---------------------
{contextList}
---------------------
Using only the choices above and not prior knowledge, return the top choices (no more than {maxOutputs}, but only select what is needed) that are most relevant to the question: '{query}'
`
});
function buildChoicesText(choices) {
    const texts = [];
    for (const [ind, choice] of choices.entries()){
        let text = choice.description.split("\n").join(" ");
        text = `(${ind + 1}) ${text}`; // to one indexing
        texts.push(text);
    }
    return texts.join("");
}
function structuredOutputToSelectorResult(output) {
    const structuredOutput = output;
    const answers = structuredOutput.parsedOutput;
    // adjust for zero indexing
    const selections = answers.map((answer)=>{
        return {
            index: answer.choice - 1,
            reason: answer.reason
        };
    });
    return {
        selections
    };
}
/**
 * A selector that uses the LLM to select a single or multiple choices from a list of choices.
 */ class LLMMultiSelector extends BaseSelector {
    constructor(init){
        super();
        this.llm = init.llm;
        this.prompt = init.prompt ?? defaultMultiSelectPrompt;
        this.maxOutputs = init.maxOutputs ?? 10;
        this.outputParser = init.outputParser ?? new SelectionOutputParser();
    }
    _getPrompts() {
        return {
            prompt: this.prompt
        };
    }
    _updatePrompts(prompts) {
        if ("prompt" in prompts) {
            this.prompt = prompts.prompt;
        }
    }
    _getPromptModules() {
        throw new Error("Method not implemented.");
    }
    /**
   * Selects a single choice from a list of choices.
   * @param choices
   * @param query
   */ async _select(choices, query) {
        const choicesText = buildChoicesText(choices);
        const prompt = this.prompt.format({
            contextList: choicesText,
            query: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$utils$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["extractText"])(query.query),
            maxOutputs: `${this.maxOutputs}`,
            numChoices: `${choicesText.length}`
        });
        const formattedPrompt = this.outputParser?.format(prompt);
        const prediction = await this.llm.complete({
            prompt: formattedPrompt
        });
        const parsed = this.outputParser?.parse(prediction.text);
        if (!parsed) {
            throw new Error("Parsed output is undefined");
        }
        return structuredOutputToSelectorResult(parsed);
    }
    asQueryComponent() {
        throw new Error("Method not implemented.");
    }
}
/**
 * A selector that uses the LLM to select a single choice from a list of choices.
 */ class LLMSingleSelector extends BaseSelector {
    constructor(init){
        super();
        this.llm = init.llm;
        this.prompt = init.prompt ?? defaultSingleSelectPrompt;
        this.outputParser = init.outputParser ?? new SelectionOutputParser();
    }
    _getPrompts() {
        return {
            prompt: this.prompt
        };
    }
    _updatePrompts(prompts) {
        if ("prompt" in prompts) {
            this.prompt = prompts.prompt;
        }
    }
    /**
   * Selects a single choice from a list of choices.
   * @param choices
   * @param query
   */ async _select(choices, query) {
        const choicesText = buildChoicesText(choices);
        const prompt = this.prompt.format({
            numChoices: `${choicesText.length}`,
            context: choicesText,
            query: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$utils$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["extractText"])(query)
        });
        const formattedPrompt = this.outputParser.format(prompt);
        const prediction = await this.llm.complete({
            prompt: formattedPrompt
        });
        const parsed = this.outputParser?.parse(prediction.text);
        if (!parsed) {
            throw new Error("Parsed output is undefined");
        }
        return structuredOutputToSelectorResult(parsed);
    }
    asQueryComponent() {
        throw new Error("Method not implemented.");
    }
    _getPromptModules() {
        return {};
    }
}
/**
 * @internal
 */ class GlobalSettings {
    #prompt;
    #promptHelper;
    #nodeParser;
    #chunkOverlap;
    #promptHelperAsyncLocalStorage;
    #nodeParserAsyncLocalStorage;
    #chunkOverlapAsyncLocalStorage;
    #promptAsyncLocalStorage;
    get debug() {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Settings"].debug;
    }
    get llm() {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Settings"].llm;
    }
    set llm(llm) {
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Settings"].llm = llm;
    }
    withLLM(llm, fn) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Settings"].withLLM(llm, fn);
    }
    get promptHelper() {
        if (this.#promptHelper === null) {
            this.#promptHelper = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$indices$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PromptHelper"]();
        }
        return this.#promptHelperAsyncLocalStorage.getStore() ?? this.#promptHelper;
    }
    set promptHelper(promptHelper) {
        this.#promptHelper = promptHelper;
    }
    withPromptHelper(promptHelper, fn) {
        return this.#promptHelperAsyncLocalStorage.run(promptHelper, fn);
    }
    get embedModel() {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Settings"].embedModel;
    }
    set embedModel(embedModel) {
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Settings"].embedModel = embedModel;
    }
    withEmbedModel(embedModel, fn) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Settings"].withEmbedModel(embedModel, fn);
    }
    get nodeParser() {
        if (this.#nodeParser === null) {
            this.#nodeParser = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$node$2d$parser$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SentenceSplitter"]({
                chunkSize: this.chunkSize,
                chunkOverlap: this.chunkOverlap
            });
        }
        return this.#nodeParserAsyncLocalStorage.getStore() ?? this.#nodeParser;
    }
    set nodeParser(nodeParser) {
        this.#nodeParser = nodeParser;
    }
    withNodeParser(nodeParser, fn) {
        return this.#nodeParserAsyncLocalStorage.run(nodeParser, fn);
    }
    get callbackManager() {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Settings"].callbackManager;
    }
    set callbackManager(callbackManager) {
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Settings"].callbackManager = callbackManager;
    }
    withCallbackManager(callbackManager, fn) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Settings"].withCallbackManager(callbackManager, fn);
    }
    set chunkSize(chunkSize) {
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Settings"].chunkSize = chunkSize;
    }
    get chunkSize() {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Settings"].chunkSize;
    }
    withChunkSize(chunkSize, fn) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Settings"].withChunkSize(chunkSize, fn);
    }
    get chunkOverlap() {
        return this.#chunkOverlapAsyncLocalStorage.getStore() ?? this.#chunkOverlap;
    }
    set chunkOverlap(chunkOverlap) {
        if (typeof chunkOverlap === "number") {
            this.#chunkOverlap = chunkOverlap;
        }
    }
    withChunkOverlap(chunkOverlap, fn) {
        return this.#chunkOverlapAsyncLocalStorage.run(chunkOverlap, fn);
    }
    get prompt() {
        return this.#promptAsyncLocalStorage.getStore() ?? this.#prompt;
    }
    set prompt(prompt) {
        this.#prompt = prompt;
    }
    withPrompt(prompt, fn) {
        return this.#promptAsyncLocalStorage.run(prompt, fn);
    }
    constructor(){
        this.#prompt = {};
        this.#promptHelper = null;
        this.#nodeParser = null;
        this.#promptHelperAsyncLocalStorage = new __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$async_hooks__$5b$external$5d$__$28$node$3a$async_hooks$2c$__cjs$29$__["AsyncLocalStorage"]();
        this.#nodeParserAsyncLocalStorage = new __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$async_hooks__$5b$external$5d$__$28$node$3a$async_hooks$2c$__cjs$29$__["AsyncLocalStorage"]();
        this.#chunkOverlapAsyncLocalStorage = new __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$async_hooks__$5b$external$5d$__$28$node$3a$async_hooks$2c$__cjs$29$__["AsyncLocalStorage"]();
        this.#promptAsyncLocalStorage = new __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$async_hooks__$5b$external$5d$__$28$node$3a$async_hooks$2c$__cjs$29$__["AsyncLocalStorage"]();
    }
}
const Settings = new GlobalSettings();
const getSelectorFromContext = (isMulti = false)=>{
    let selector = null;
    const llm = Settings.llm;
    if (isMulti) {
        selector = new LLMMultiSelector({
            llm
        });
    } else {
        selector = new LLMSingleSelector({
            llm
        });
    }
    if (selector === null) {
        throw new Error("Selector is null");
    }
    return selector;
};
;
}}),
"[project]/node_modules/.pnpm/llamaindex@0.11.19_@llama-flow+core@0.4.4_next@15.3.4_react-dom@19.1.0_react@19.1.0__re_1d30be2795de4d1906fac150e4bc1023/node_modules/llamaindex/engines/dist/index.js [app-route] (ecmascript) <locals>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "CondenseQuestionChatEngine": (()=>CondenseQuestionChatEngine),
    "RouterQueryEngine": (()=>RouterQueryEngine),
    "SubQuestionQueryEngine": (()=>SubQuestionQueryEngine)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$chat$2d$engine$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/chat-engine/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$decorator$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/decorator/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$memory$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/memory/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$prompts$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/prompts/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$utils$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/utils/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/global/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$indices$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/indices/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$node$2d$parser$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/node-parser/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$env$40$0$2e$1$2e$30$2f$node_modules$2f40$llamaindex$2f$env$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+env@0.1.30/node_modules/@llamaindex/env/dist/index.js [app-route] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$async_hooks__$5b$external$5d$__$28$node$3a$async_hooks$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:async_hooks [external] (node:async_hooks, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$query$2d$engine$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/query-engine/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$response$2d$synthesizers$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/response-synthesizers/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$llamaindex$40$0$2e$11$2e$19_$40$llama$2d$flow$2b$core$40$0$2e$4$2e$4_next$40$15$2e$3$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$re_1d30be2795de4d1906fac150e4bc1023$2f$node_modules$2f$llamaindex$2f$selectors$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/llamaindex@0.11.19_@llama-flow+core@0.4.4_next@15.3.4_react-dom@19.1.0_react@19.1.0__re_1d30be2795de4d1906fac150e4bc1023/node_modules/llamaindex/selectors/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$schema$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/schema/dist/index.js [app-route] (ecmascript)");
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
;
;
;
/**
 * @internal
 */ class GlobalSettings {
    #prompt;
    #promptHelper;
    #nodeParser;
    #chunkOverlap;
    #promptHelperAsyncLocalStorage;
    #nodeParserAsyncLocalStorage;
    #chunkOverlapAsyncLocalStorage;
    #promptAsyncLocalStorage;
    get debug() {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Settings"].debug;
    }
    get llm() {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Settings"].llm;
    }
    set llm(llm) {
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Settings"].llm = llm;
    }
    withLLM(llm, fn) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Settings"].withLLM(llm, fn);
    }
    get promptHelper() {
        if (this.#promptHelper === null) {
            this.#promptHelper = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$indices$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PromptHelper"]();
        }
        return this.#promptHelperAsyncLocalStorage.getStore() ?? this.#promptHelper;
    }
    set promptHelper(promptHelper) {
        this.#promptHelper = promptHelper;
    }
    withPromptHelper(promptHelper, fn) {
        return this.#promptHelperAsyncLocalStorage.run(promptHelper, fn);
    }
    get embedModel() {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Settings"].embedModel;
    }
    set embedModel(embedModel) {
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Settings"].embedModel = embedModel;
    }
    withEmbedModel(embedModel, fn) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Settings"].withEmbedModel(embedModel, fn);
    }
    get nodeParser() {
        if (this.#nodeParser === null) {
            this.#nodeParser = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$node$2d$parser$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SentenceSplitter"]({
                chunkSize: this.chunkSize,
                chunkOverlap: this.chunkOverlap
            });
        }
        return this.#nodeParserAsyncLocalStorage.getStore() ?? this.#nodeParser;
    }
    set nodeParser(nodeParser) {
        this.#nodeParser = nodeParser;
    }
    withNodeParser(nodeParser, fn) {
        return this.#nodeParserAsyncLocalStorage.run(nodeParser, fn);
    }
    get callbackManager() {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Settings"].callbackManager;
    }
    set callbackManager(callbackManager) {
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Settings"].callbackManager = callbackManager;
    }
    withCallbackManager(callbackManager, fn) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Settings"].withCallbackManager(callbackManager, fn);
    }
    set chunkSize(chunkSize) {
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Settings"].chunkSize = chunkSize;
    }
    get chunkSize() {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Settings"].chunkSize;
    }
    withChunkSize(chunkSize, fn) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Settings"].withChunkSize(chunkSize, fn);
    }
    get chunkOverlap() {
        return this.#chunkOverlapAsyncLocalStorage.getStore() ?? this.#chunkOverlap;
    }
    set chunkOverlap(chunkOverlap) {
        if (typeof chunkOverlap === "number") {
            this.#chunkOverlap = chunkOverlap;
        }
    }
    withChunkOverlap(chunkOverlap, fn) {
        return this.#chunkOverlapAsyncLocalStorage.run(chunkOverlap, fn);
    }
    get prompt() {
        return this.#promptAsyncLocalStorage.getStore() ?? this.#prompt;
    }
    set prompt(prompt) {
        this.#prompt = prompt;
    }
    withPrompt(prompt, fn) {
        return this.#promptAsyncLocalStorage.run(prompt, fn);
    }
    constructor(){
        this.#prompt = {};
        this.#promptHelper = null;
        this.#nodeParser = null;
        this.#promptHelperAsyncLocalStorage = new __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$async_hooks__$5b$external$5d$__$28$node$3a$async_hooks$2c$__cjs$29$__["AsyncLocalStorage"]();
        this.#nodeParserAsyncLocalStorage = new __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$async_hooks__$5b$external$5d$__$28$node$3a$async_hooks$2c$__cjs$29$__["AsyncLocalStorage"]();
        this.#chunkOverlapAsyncLocalStorage = new __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$async_hooks__$5b$external$5d$__$28$node$3a$async_hooks$2c$__cjs$29$__["AsyncLocalStorage"]();
        this.#promptAsyncLocalStorage = new __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$async_hooks__$5b$external$5d$__$28$node$3a$async_hooks$2c$__cjs$29$__["AsyncLocalStorage"]();
    }
}
const Settings = new GlobalSettings();
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
 * CondenseQuestionChatEngine is used in conjunction with a Index (for example VectorStoreIndex).
 * It does two steps on taking a user's chat message: first, it condenses the chat message
 * with the previous chat history into a question with more context.
 * Then, it queries the underlying Index using the new question with context and returns
 * the response.
 * CondenseQuestionChatEngine performs well when the input is primarily questions about the
 * underlying data. It performs less well when the chat messages are not questions about the
 * data, or are very referential to previous context.
 */ class CondenseQuestionChatEngine extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$chat$2d$engine$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BaseChatEngine"] {
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
        super(), _initProto(this);
        this.queryEngine = init.queryEngine;
        this.memory = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$memory$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createMemory"])(init.chatHistory);
        this.llm = Settings.llm;
        this.condenseMessagePrompt = init?.condenseMessagePrompt ?? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$prompts$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["defaultCondenseQuestionPrompt"];
    }
    _getPromptModules() {
        return {};
    }
    _getPrompts() {
        return {
            condenseMessagePrompt: this.condenseMessagePrompt
        };
    }
    _updatePrompts(promptsDict) {
        if (promptsDict.condenseMessagePrompt) {
            this.condenseMessagePrompt = promptsDict.condenseMessagePrompt;
        }
    }
    async condenseQuestion(chatHistory, question) {
        const chatHistoryStr = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$utils$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["messagesToHistory"])(await chatHistory.getLLM());
        return this.llm.complete({
            prompt: this.condenseMessagePrompt.format({
                question: question,
                chatHistory: chatHistoryStr
            })
        });
    }
    async chat(params) {
        const { message, stream } = params;
        const chatHistory = params.chatHistory ? params.chatHistory instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$memory$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Memory"] ? params.chatHistory : (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$memory$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createMemory"])(params.chatHistory) : this.memory;
        const condensedQuestion = (await this.condenseQuestion(chatHistory, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$utils$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["extractText"])(message))).text;
        await chatHistory.add({
            content: message,
            role: "user"
        });
        if (stream) {
            const stream = await this.queryEngine.query({
                query: condensedQuestion,
                stream: true
            });
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$utils$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["streamReducer"])({
                stream,
                initialValue: "",
                reducer: (accumulator, part)=>accumulator += (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$utils$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["extractText"])(part.message.content),
                finished: (accumulator)=>{
                    void chatHistory.add({
                        content: accumulator,
                        role: "assistant"
                    });
                }
            });
        }
        const response = await this.queryEngine.query({
            query: condensedQuestion
        });
        await chatHistory.add({
            content: response.message.content,
            role: "assistant"
        });
        return response;
    }
    reset() {
        void this.memory.clear();
    }
}
async function combineResponses(summarizer, responses, queryBundle, verbose = false) {
    if (verbose) {
        console.log("Combining responses from multiple query engines.");
    }
    const sourceNodes = [];
    for (const response of responses){
        if (response?.sourceNodes) {
            sourceNodes.push(...response.sourceNodes);
        }
    }
    return await summarizer.synthesize({
        query: queryBundle,
        nodes: sourceNodes
    });
}
/**
 * A query engine that uses multiple query engines and selects the best one.
 */ class RouterQueryEngine extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$query$2d$engine$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BaseQueryEngine"] {
    constructor(init){
        super();
        this.selector = init.selector;
        this.queryEngines = init.queryEngineTools.map((tool)=>tool.queryEngine);
        this.metadatas = init.queryEngineTools.map((tool)=>({
                description: tool.description
            }));
        this.summarizer = init.summarizer || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$response$2d$synthesizers$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getResponseSynthesizer"])("tree_summarize");
        this.verbose = init.verbose ?? false;
    }
    async _query(strOrQueryBundle, stream) {
        const response = await this.queryRoute(typeof strOrQueryBundle === "string" ? {
            query: strOrQueryBundle
        } : strOrQueryBundle);
        if (stream) {
            throw new Error("Streaming is not supported yet.");
        }
        return response;
    }
    _getPrompts() {
        return {};
    }
    _updatePrompts() {}
    _getPromptModules() {
        return {
            selector: this.selector,
            summarizer: this.summarizer
        };
    }
    static fromDefaults(init) {
        return new RouterQueryEngine({
            selector: init.selector ?? new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$llamaindex$40$0$2e$11$2e$19_$40$llama$2d$flow$2b$core$40$0$2e$4$2e$4_next$40$15$2e$3$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$re_1d30be2795de4d1906fac150e4bc1023$2f$node_modules$2f$llamaindex$2f$selectors$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["LLMSingleSelector"]({
                llm: Settings.llm
            }),
            queryEngineTools: init.queryEngineTools,
            summarizer: init.summarizer,
            verbose: init.verbose
        });
    }
    async queryRoute(query) {
        const result = await this.selector.select(this.metadatas, query);
        if (result.selections.length > 1) {
            const responses = [];
            for(let i = 0; i < result.selections.length; i++){
                const engineInd = result.selections[i];
                const logStr = `Selecting query engine ${engineInd.index}: ${result.selections[i].index}.`;
                if (this.verbose) {
                    console.log(logStr + "\n");
                }
                const selectedQueryEngine = this.queryEngines[engineInd.index];
                responses.push(await selectedQueryEngine.query({
                    query,
                    stream: false
                }));
            }
            if (responses.length > 1) {
                const finalResponse = await combineResponses(this.summarizer, responses, query, this.verbose);
                return finalResponse;
            } else {
                return responses[0];
            }
        } else {
            let selectedQueryEngine;
            try {
                selectedQueryEngine = this.queryEngines[result.selections[0].index];
                const logStr = `Selecting query engine ${result.selections[0].index}: ${result.selections[0].reason}`;
                if (this.verbose) {
                    console.log(logStr + "\n");
                }
            } catch (e) {
                throw new Error("Failed to select query engine");
            }
            if (!selectedQueryEngine) {
                throw new Error("Selected query engine is null");
            }
            const finalResponse = await selectedQueryEngine.query({
                query: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$utils$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["extractText"])(query)
            });
            // add selected result
            finalResponse.metadata = finalResponse.metadata || {};
            finalResponse.metadata["selectorResult"] = result;
            return finalResponse;
        }
    }
}
/**
 * Error class for output parsing. Due to the nature of LLMs, anytime we use LLM
 * to generate structured output, it's possible that it will hallucinate something
 * that doesn't match the expected output format. So make sure to catch these
 * errors in production.
 */ class OutputParserError extends Error {
    constructor(message, options = {}){
        super(message, options); // https://github.com/tc39/proposal-error-cause
        this.name = "OutputParserError";
        if (!this.cause) {
            // Need to check for those environments that have implemented the proposal
            this.cause = options.cause;
        }
        this.output = options.output;
        // This line is to maintain proper stack trace in V8
        // (https://v8.dev/docs/stack-trace-api)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, OutputParserError);
        }
    }
}
/**
 *
 * @param text A markdown block with JSON
 * @returns parsed JSON object
 */ function parseJsonMarkdown(text) {
    text = text.trim();
    const left_square = text.indexOf("[");
    const left_brace = text.indexOf("{");
    let left;
    let right;
    if (left_square < left_brace && left_square != -1) {
        left = left_square;
        right = text.lastIndexOf("]");
    } else {
        left = left_brace;
        right = text.lastIndexOf("}");
    }
    const jsonText = text.substring(left, right + 1);
    try {
        //Single JSON object case
        if (left_square === -1) {
            return [
                JSON.parse(jsonText)
            ];
        }
        //Multiple JSON object case.
        return JSON.parse(jsonText);
    } catch (e) {
        throw new OutputParserError("Not a json markdown", {
            output: text
        });
    }
}
/**
 * SubQuestionOutputParser is used to parse the output of the SubQuestionGenerator.
 */ class SubQuestionOutputParser {
    parse(output) {
        const parsed = parseJsonMarkdown(output);
        return {
            rawOutput: output,
            parsedOutput: parsed
        };
    }
    format(output) {
        return output;
    }
}
/**
 * LLMQuestionGenerator uses the LLM to generate new questions for the LLM using tools and a user query.
 */ class LLMQuestionGenerator extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$prompts$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PromptMixin"] {
    constructor(init){
        super();
        this.llm = init?.llm ?? Settings.llm;
        this.prompt = init?.prompt ?? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$prompts$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["defaultSubQuestionPrompt"];
        this.outputParser = init?.outputParser ?? new SubQuestionOutputParser();
    }
    _getPrompts() {
        return {
            subQuestion: this.prompt
        };
    }
    _updatePrompts(promptsDict) {
        if ("subQuestion" in promptsDict) {
            this.prompt = promptsDict.subQuestion;
        }
    }
    async generate(tools, query) {
        const toolsStr = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$utils$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["toToolDescriptions"])(tools);
        const queryStr = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$utils$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["extractText"])(query);
        const prediction = (await this.llm.complete({
            prompt: this.prompt.format({
                toolsStr,
                queryStr
            })
        })).text;
        const structuredOutput = this.outputParser.parse(prediction);
        return structuredOutput.parsedOutput;
    }
    _getPromptModules() {
        return {};
    }
}
/**
 * SubQuestionQueryEngine decomposes a question into subquestions and then
 */ class SubQuestionQueryEngine extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$query$2d$engine$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BaseQueryEngine"] {
    constructor(init){
        super();
        this.questionGen = init.questionGen;
        this.responseSynthesizer = init.responseSynthesizer ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$response$2d$synthesizers$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getResponseSynthesizer"])("compact");
        this.queryEngines = init.queryEngineTools;
        this.metadatas = init.queryEngineTools.map((tool)=>tool.metadata);
    }
    async _query(strOrQueryBundle, stream) {
        let query;
        if (typeof strOrQueryBundle === "string") {
            query = {
                query: strOrQueryBundle
            };
        } else {
            query = strOrQueryBundle;
        }
        const subQuestions = await this.questionGen.generate(this.metadatas, strOrQueryBundle);
        const subQNodes = await Promise.all(subQuestions.map((subQ)=>this.querySubQ(subQ)));
        const nodesWithScore = subQNodes.filter((node)=>node !== null);
        if (stream) {
            return this.responseSynthesizer.synthesize({
                query,
                nodes: nodesWithScore
            }, true);
        }
        return this.responseSynthesizer.synthesize({
            query,
            nodes: nodesWithScore
        }, false);
    }
    _getPrompts() {
        return {};
    }
    _updatePrompts() {}
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    _getPromptModules() {
        return {
            questionGen: this.questionGen,
            responseSynthesizer: this.responseSynthesizer
        };
    }
    static fromDefaults(init) {
        const questionGen = init.questionGen ?? new LLMQuestionGenerator();
        const responseSynthesizer = init.responseSynthesizer ?? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$response$2d$synthesizers$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getResponseSynthesizer"])("compact");
        return new SubQuestionQueryEngine({
            questionGen,
            responseSynthesizer,
            queryEngineTools: init.queryEngineTools
        });
    }
    async querySubQ(subQ) {
        try {
            const question = subQ.subQuestion;
            const queryEngine = this.queryEngines.find((tool)=>tool.metadata.name === subQ.toolName);
            if (!queryEngine) {
                return null;
            }
            const responseValue = await queryEngine?.call?.({
                query: question
            });
            if (responseValue == null) {
                return null;
            }
            const nodeText = `Sub question: ${question}\nResponse: ${typeof responseValue === "string" ? responseValue : JSON.stringify(responseValue)}`;
            const node = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$schema$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["TextNode"]({
                text: nodeText
            });
            return {
                node,
                score: 0
            };
        } catch (error) {
            return null;
        }
    }
}
;
}}),
"[project]/node_modules/.pnpm/llamaindex@0.11.19_@llama-flow+core@0.4.4_next@15.3.4_react-dom@19.1.0_react@19.1.0__re_1d30be2795de4d1906fac150e4bc1023/node_modules/llamaindex/engines/dist/index.js [app-route] (ecmascript) <module evaluation>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$chat$2d$engine$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/chat-engine/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$decorator$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/decorator/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$memory$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/memory/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$prompts$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/prompts/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$utils$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/utils/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/global/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$indices$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/indices/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$node$2d$parser$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/node-parser/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$env$40$0$2e$1$2e$30$2f$node_modules$2f40$llamaindex$2f$env$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+env@0.1.30/node_modules/@llamaindex/env/dist/index.js [app-route] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$query$2d$engine$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/query-engine/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$response$2d$synthesizers$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/response-synthesizers/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$llamaindex$40$0$2e$11$2e$19_$40$llama$2d$flow$2b$core$40$0$2e$4$2e$4_next$40$15$2e$3$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$re_1d30be2795de4d1906fac150e4bc1023$2f$node_modules$2f$llamaindex$2f$selectors$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/llamaindex@0.11.19_@llama-flow+core@0.4.4_next@15.3.4_react-dom@19.1.0_react@19.1.0__re_1d30be2795de4d1906fac150e4bc1023/node_modules/llamaindex/selectors/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$schema$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/schema/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$llamaindex$40$0$2e$11$2e$19_$40$llama$2d$flow$2b$core$40$0$2e$4$2e$4_next$40$15$2e$3$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$re_1d30be2795de4d1906fac150e4bc1023$2f$node_modules$2f$llamaindex$2f$engines$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/llamaindex@0.11.19_@llama-flow+core@0.4.4_next@15.3.4_react-dom@19.1.0_react@19.1.0__re_1d30be2795de4d1906fac150e4bc1023/node_modules/llamaindex/engines/dist/index.js [app-route] (ecmascript) <locals>");
}}),
"[project]/node_modules/.pnpm/llamaindex@0.11.19_@llama-flow+core@0.4.4_next@15.3.4_react-dom@19.1.0_react@19.1.0__re_1d30be2795de4d1906fac150e4bc1023/node_modules/llamaindex/evaluation/dist/index.js [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "CorrectnessEvaluator": (()=>CorrectnessEvaluator),
    "FaithfulnessEvaluator": (()=>FaithfulnessEvaluator),
    "RelevancyEvaluator": (()=>RelevancyEvaluator),
    "defaultCorrectnessSystemPrompt": (()=>defaultCorrectnessSystemPrompt),
    "defaultEvaluationParser": (()=>defaultEvaluationParser),
    "defaultFaithfulnessRefinePrompt": (()=>defaultFaithfulnessRefinePrompt),
    "defaultFaithfulnessTextQaPrompt": (()=>defaultFaithfulnessTextQaPrompt),
    "defaultRelevancyEvalPrompt": (()=>defaultRelevancyEvalPrompt),
    "defaultRelevancyRefinePrompt": (()=>defaultRelevancyRefinePrompt),
    "defaultUserPrompt": (()=>defaultUserPrompt)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$prompts$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/prompts/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$schema$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/schema/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$utils$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/utils/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/global/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$indices$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/indices/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$node$2d$parser$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/node-parser/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$env$40$0$2e$1$2e$30$2f$node_modules$2f40$llamaindex$2f$env$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+env@0.1.30/node_modules/@llamaindex/env/dist/index.js [app-route] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$async_hooks__$5b$external$5d$__$28$node$3a$async_hooks$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:async_hooks [external] (node:async_hooks, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs$2f$promises__$5b$external$5d$__$28$node$3a$fs$2f$promises$2c$__cjs$29$__$3c$export__default__as__fs$3e$__ = __turbopack_context__.i("[externals]/node:fs/promises [external] (node:fs/promises, cjs) <export default as fs>");
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__$3c$export__default__as__path$3e$__ = __turbopack_context__.i("[externals]/node:path [external] (node:path, cjs) <export default as path>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$env$40$0$2e$1$2e$30$2f$node_modules$2f40$llamaindex$2f$env$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+env@0.1.30/node_modules/@llamaindex/env/dist/index.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$data$2d$structs$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/data-structs/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$response$2d$synthesizers$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/response-synthesizers/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$retriever$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/retriever/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lodash$40$4$2e$17$2e$21$2f$node_modules$2f$lodash$2f$lodash$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lodash@4.17.21/node_modules/lodash/lodash.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$chat$2d$engine$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/chat-engine/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$decorator$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/decorator/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$memory$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/memory/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$query$2d$engine$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/query-engine/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$llamaindex$40$0$2e$11$2e$19_$40$llama$2d$flow$2b$core$40$0$2e$4$2e$4_next$40$15$2e$3$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$re_1d30be2795de4d1906fac150e4bc1023$2f$node_modules$2f$llamaindex$2f$selectors$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/llamaindex@0.11.19_@llama-flow+core@0.4.4_next@15.3.4_react-dom@19.1.0_react@19.1.0__re_1d30be2795de4d1906fac150e4bc1023/node_modules/llamaindex/selectors/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$storage$2f$index$2d$store$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/storage/index-store/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$embeddings$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/embeddings/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$vector$2d$store$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/vector-store/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$storage$2f$doc$2d$store$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/storage/doc-store/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$storage$2f$kv$2d$store$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/storage/kv-store/dist/index.js [app-route] (ecmascript)");
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
;
;
;
;
;
;
;
;
;
/**
 * @internal
 */ class GlobalSettings {
    #prompt;
    #promptHelper;
    #nodeParser;
    #chunkOverlap;
    #promptHelperAsyncLocalStorage;
    #nodeParserAsyncLocalStorage;
    #chunkOverlapAsyncLocalStorage;
    #promptAsyncLocalStorage;
    get debug() {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Settings"].debug;
    }
    get llm() {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Settings"].llm;
    }
    set llm(llm) {
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Settings"].llm = llm;
    }
    withLLM(llm, fn) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Settings"].withLLM(llm, fn);
    }
    get promptHelper() {
        if (this.#promptHelper === null) {
            this.#promptHelper = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$indices$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PromptHelper"]();
        }
        return this.#promptHelperAsyncLocalStorage.getStore() ?? this.#promptHelper;
    }
    set promptHelper(promptHelper) {
        this.#promptHelper = promptHelper;
    }
    withPromptHelper(promptHelper, fn) {
        return this.#promptHelperAsyncLocalStorage.run(promptHelper, fn);
    }
    get embedModel() {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Settings"].embedModel;
    }
    set embedModel(embedModel) {
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Settings"].embedModel = embedModel;
    }
    withEmbedModel(embedModel, fn) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Settings"].withEmbedModel(embedModel, fn);
    }
    get nodeParser() {
        if (this.#nodeParser === null) {
            this.#nodeParser = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$node$2d$parser$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SentenceSplitter"]({
                chunkSize: this.chunkSize,
                chunkOverlap: this.chunkOverlap
            });
        }
        return this.#nodeParserAsyncLocalStorage.getStore() ?? this.#nodeParser;
    }
    set nodeParser(nodeParser) {
        this.#nodeParser = nodeParser;
    }
    withNodeParser(nodeParser, fn) {
        return this.#nodeParserAsyncLocalStorage.run(nodeParser, fn);
    }
    get callbackManager() {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Settings"].callbackManager;
    }
    set callbackManager(callbackManager) {
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Settings"].callbackManager = callbackManager;
    }
    withCallbackManager(callbackManager, fn) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Settings"].withCallbackManager(callbackManager, fn);
    }
    set chunkSize(chunkSize) {
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Settings"].chunkSize = chunkSize;
    }
    get chunkSize() {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Settings"].chunkSize;
    }
    withChunkSize(chunkSize, fn) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Settings"].withChunkSize(chunkSize, fn);
    }
    get chunkOverlap() {
        return this.#chunkOverlapAsyncLocalStorage.getStore() ?? this.#chunkOverlap;
    }
    set chunkOverlap(chunkOverlap) {
        if (typeof chunkOverlap === "number") {
            this.#chunkOverlap = chunkOverlap;
        }
    }
    withChunkOverlap(chunkOverlap, fn) {
        return this.#chunkOverlapAsyncLocalStorage.run(chunkOverlap, fn);
    }
    get prompt() {
        return this.#promptAsyncLocalStorage.getStore() ?? this.#prompt;
    }
    set prompt(prompt) {
        this.#prompt = prompt;
    }
    withPrompt(prompt, fn) {
        return this.#promptAsyncLocalStorage.run(prompt, fn);
    }
    constructor(){
        this.#prompt = {};
        this.#promptHelper = null;
        this.#nodeParser = null;
        this.#promptHelperAsyncLocalStorage = new __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$async_hooks__$5b$external$5d$__$28$node$3a$async_hooks$2c$__cjs$29$__["AsyncLocalStorage"]();
        this.#nodeParserAsyncLocalStorage = new __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$async_hooks__$5b$external$5d$__$28$node$3a$async_hooks$2c$__cjs$29$__["AsyncLocalStorage"]();
        this.#chunkOverlapAsyncLocalStorage = new __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$async_hooks__$5b$external$5d$__$28$node$3a$async_hooks$2c$__cjs$29$__["AsyncLocalStorage"]();
        this.#promptAsyncLocalStorage = new __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$async_hooks__$5b$external$5d$__$28$node$3a$async_hooks$2c$__cjs$29$__["AsyncLocalStorage"]();
    }
}
const Settings = new GlobalSettings();
const defaultUserPrompt = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$prompts$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PromptTemplate"]({
    templateVars: [
        "query",
        "referenceAnswer",
        "generatedAnswer"
    ],
    template: `
## User Query
{query}

## Reference Answer
{referenceAnswer}

## Generated Answer
{generatedAnswer}
`
});
const defaultCorrectnessSystemPrompt = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$prompts$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PromptTemplate"]({
    template: `You are an expert evaluation system for a question answering chatbot.

You are given the following information:
- a user query, and
- a generated answer

You may also be given a reference answer to use for reference in your evaluation.

Your job is to judge the relevance and correctness of the generated answer.
Output a single score that represents a holistic evaluation.
You must return your response in a line with only the score.
Do not return answers in any other format.
On a separate line provide your reasoning for the score as well.

Follow these guidelines for scoring:
- Your score has to be between 1 and 5, where 1 is the worst and 5 is the best.
- If the generated answer is not relevant to the user query,
you should give a score of 1.
- If the generated answer is relevant but contains mistakes,
you should give a score between 2 and 3.
- If the generated answer is relevant and fully correct,
you should give a score between 4 and 5.

Example Response:
4.0
The generated answer has the exact same metrics as the reference answer
but it is not as concise.
`
});
const defaultFaithfulnessRefinePrompt = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$prompts$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PromptTemplate"]({
    templateVars: [
        "query",
        "existingAnswer",
        "context"
    ],
    template: `
We want to understand if the following information is present
in the context information: {query}
We have provided an existing YES/NO answer: {existingAnswer}
We have the opportunity to refine the existing answer
(only if needed) with some more context below.
------------
{context}
------------
If the existing answer was already YES, still answer YES.
If the information is present in the new context, answer YES.
Otherwise answer NO.
`
});
const defaultFaithfulnessTextQaPrompt = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$prompts$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PromptTemplate"]({
    templateVars: [
        "context",
        "query"
    ],
    template: `
Please tell if a given piece of information
is supported by the context.
You need to answer with either YES or NO.
Answer YES if any of the context supports the information, even
if most of the context is unrelated.
Some examples are provided below.

Information: Apple pie is generally double-crusted.
Context: An apple pie is a fruit pie in which the principal filling
ingredient is apples.
Apple pie is often served with whipped cream, ice cream
('apple pie à la mode'), custard or cheddar cheese.
It is generally double-crusted, with pastry both above
and below the filling; the upper crust may be solid or
latticed (woven of crosswise strips).
Answer: YES
Information: Apple pies tastes bad.
Context: An apple pie is a fruit pie in which the principal filling
ingredient is apples.
Apple pie is often served with whipped cream, ice cream
('apple pie à la mode'), custard or cheddar cheese.
It is generally double-crusted, with pastry both above
and below the filling; the upper crust may be solid or
latticed (woven of crosswise strips).
Answer: NO
Information: {query}
Context: {context}
Answer:
`
});
const defaultRelevancyEvalPrompt = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$prompts$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PromptTemplate"]({
    templateVars: [
        "context",
        "query"
    ],
    template: `Your task is to evaluate if the response for the query is in line with the context information provided.
You have two options to answer. Either YES/ NO.
Answer - YES, if the response for the query is in line with context information otherwise NO.
Query and Response: {query}
Context: {context}
Answer: `
});
const defaultRelevancyRefinePrompt = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$prompts$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PromptTemplate"]({
    templateVars: [
        "query",
        "existingAnswer",
        "contextMsg"
    ],
    template: `We want to understand if the following query and response is
in line with the context information: 
{query}
We have provided an existing YES/NO answer: 
{existingAnswer}
We have the opportunity to refine the existing answer
(only if needed) with some more context below.
------------
{contextMsg}
------------
If the existing answer was already YES, still answer YES.
If the information is present in the new context, answer YES.
Otherwise answer NO.
`
});
const defaultEvaluationParser = (evalResponse)=>{
    const [scoreStr, reasoningStr] = evalResponse.split("\n");
    const score = parseFloat(scoreStr);
    const reasoning = reasoningStr.trim();
    return [
        score,
        reasoning
    ];
};
/** Correctness Evaluator */ class CorrectnessEvaluator extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$prompts$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PromptMixin"] {
    constructor(params){
        super(), this.correctnessPrompt = defaultCorrectnessSystemPrompt;
        this.llm = Settings.llm;
        this.correctnessPrompt = defaultCorrectnessSystemPrompt;
        this.scoreThreshold = params?.scoreThreshold ?? 4.0;
        this.parserFunction = params?.parserFunction ?? defaultEvaluationParser;
    }
    _getPrompts() {
        return {
            correctnessPrompt: this.correctnessPrompt
        };
    }
    _getPromptModules() {
        return {};
    }
    _updatePrompts(prompts) {
        if ("correctnessPrompt" in prompts) {
            this.correctnessPrompt = prompts["correctnessPrompt"];
        }
    }
    /**
   *
   * @param query Query to evaluate
   * @param response  Response to evaluate
   * @param contexts Array of contexts
   * @param reference  Reference response
   */ async evaluate({ query, response, contexts, reference }) {
        if (query === null || response === null) {
            throw new Error("query, and response must be provided");
        }
        const messages = [
            {
                role: "system",
                content: this.correctnessPrompt.format()
            },
            {
                role: "user",
                content: defaultUserPrompt.format({
                    query: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$utils$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["extractText"])(query),
                    generatedAnswer: response,
                    referenceAnswer: reference || "(NO REFERENCE ANSWER SUPPLIED)"
                })
            }
        ];
        const evalResponse = await this.llm.chat({
            messages
        });
        const [score, reasoning] = this.parserFunction((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$utils$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["extractText"])(evalResponse.message.content));
        return {
            query: query,
            response: response,
            passing: score >= this.scoreThreshold || score === null,
            score: score,
            feedback: reasoning
        };
    }
    /**
   * @param query Query to evaluate
   * @param response  Response to evaluate
   */ async evaluateResponse({ query, response }) {
        const responseStr = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$utils$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["extractText"])(response?.message.content);
        const contexts = [];
        if (response) {
            for (const node of response.sourceNodes || []){
                contexts.push(node.node.getContent(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$schema$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["MetadataMode"].ALL));
            }
        }
        return this.evaluate({
            query,
            response: responseStr,
            contexts
        });
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
 * CondenseQuestionChatEngine is used in conjunction with a Index (for example VectorStoreIndex).
 * It does two steps on taking a user's chat message: first, it condenses the chat message
 * with the previous chat history into a question with more context.
 * Then, it queries the underlying Index using the new question with context and returns
 * the response.
 * CondenseQuestionChatEngine performs well when the input is primarily questions about the
 * underlying data. It performs less well when the chat messages are not questions about the
 * data, or are very referential to previous context.
 */ class CondenseQuestionChatEngine extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$chat$2d$engine$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BaseChatEngine"] {
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
        super(), _initProto(this);
        this.queryEngine = init.queryEngine;
        this.memory = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$memory$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createMemory"])(init.chatHistory);
        this.llm = Settings.llm;
        this.condenseMessagePrompt = init?.condenseMessagePrompt ?? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$prompts$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["defaultCondenseQuestionPrompt"];
    }
    _getPromptModules() {
        return {};
    }
    _getPrompts() {
        return {
            condenseMessagePrompt: this.condenseMessagePrompt
        };
    }
    _updatePrompts(promptsDict) {
        if (promptsDict.condenseMessagePrompt) {
            this.condenseMessagePrompt = promptsDict.condenseMessagePrompt;
        }
    }
    async condenseQuestion(chatHistory, question) {
        const chatHistoryStr = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$utils$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["messagesToHistory"])(await chatHistory.getLLM());
        return this.llm.complete({
            prompt: this.condenseMessagePrompt.format({
                question: question,
                chatHistory: chatHistoryStr
            })
        });
    }
    async chat(params) {
        const { message, stream } = params;
        const chatHistory = params.chatHistory ? params.chatHistory instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$memory$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Memory"] ? params.chatHistory : (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$memory$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createMemory"])(params.chatHistory) : this.memory;
        const condensedQuestion = (await this.condenseQuestion(chatHistory, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$utils$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["extractText"])(message))).text;
        await chatHistory.add({
            content: message,
            role: "user"
        });
        if (stream) {
            const stream = await this.queryEngine.query({
                query: condensedQuestion,
                stream: true
            });
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$utils$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["streamReducer"])({
                stream,
                initialValue: "",
                reducer: (accumulator, part)=>accumulator += (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$utils$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["extractText"])(part.message.content),
                finished: (accumulator)=>{
                    void chatHistory.add({
                        content: accumulator,
                        role: "assistant"
                    });
                }
            });
        }
        const response = await this.queryEngine.query({
            query: condensedQuestion
        });
        await chatHistory.add({
            content: response.message.content,
            role: "assistant"
        });
        return response;
    }
    reset() {
        void this.memory.clear();
    }
}
// FS utility helpers
/**
 * Checks if a file exists.
 * Analogous to the os.path.exists function from Python.
 * @param path The path to the file to check.
 * @returns A promise that resolves to true if the file exists, false otherwise.
 */ async function exists(path) {
    try {
        await __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs$2f$promises__$5b$external$5d$__$28$node$3a$fs$2f$promises$2c$__cjs$29$__$3c$export__default__as__fs$3e$__["fs"].access(path);
        return true;
    } catch  {
        return false;
    }
}
const LEARNER_MODES = new Set([
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$vector$2d$store$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["VectorStoreQueryMode"].SVM,
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$vector$2d$store$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["VectorStoreQueryMode"].LINEAR_REGRESSION,
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$vector$2d$store$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["VectorStoreQueryMode"].LOGISTIC_REGRESSION
]);
const MMR_MODE = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$vector$2d$store$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["VectorStoreQueryMode"].MMR;
// Mapping of filter operators to metadata filter functions
const OPERATOR_TO_FILTER = {
    [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$vector$2d$store$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["FilterOperator"].EQ]: ({ key, value }, metadata)=>{
        return metadata[key] === (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$vector$2d$store$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parsePrimitiveValue"])(value);
    },
    [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$vector$2d$store$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["FilterOperator"].NE]: ({ key, value }, metadata)=>{
        return metadata[key] !== (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$vector$2d$store$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parsePrimitiveValue"])(value);
    },
    [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$vector$2d$store$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["FilterOperator"].IN]: ({ key, value }, metadata)=>{
        return !!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$vector$2d$store$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parseArrayValue"])(value).find((v)=>metadata[key] === v);
    },
    [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$vector$2d$store$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["FilterOperator"].NIN]: ({ key, value }, metadata)=>{
        return !(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$vector$2d$store$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parseArrayValue"])(value).find((v)=>metadata[key] === v);
    },
    [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$vector$2d$store$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["FilterOperator"].ANY]: ({ key, value }, metadata)=>{
        if (!Array.isArray(metadata[key])) return false;
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$vector$2d$store$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parseArrayValue"])(value).some((v)=>metadata[key].includes(v));
    },
    [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$vector$2d$store$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["FilterOperator"].ALL]: ({ key, value }, metadata)=>{
        if (!Array.isArray(metadata[key])) return false;
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$vector$2d$store$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parseArrayValue"])(value).every((v)=>metadata[key].includes(v));
    },
    [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$vector$2d$store$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["FilterOperator"].TEXT_MATCH]: ({ key, value }, metadata)=>{
        return metadata[key].includes((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$vector$2d$store$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parsePrimitiveValue"])(value));
    },
    [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$vector$2d$store$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["FilterOperator"].CONTAINS]: ({ key, value }, metadata)=>{
        if (!Array.isArray(metadata[key])) return false;
        return !!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$vector$2d$store$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parseArrayValue"])(metadata[key]).find((v)=>v === value);
    },
    [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$vector$2d$store$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["FilterOperator"].GT]: ({ key, value }, metadata)=>{
        return metadata[key] > (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$vector$2d$store$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parsePrimitiveValue"])(value);
    },
    [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$vector$2d$store$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["FilterOperator"].LT]: ({ key, value }, metadata)=>{
        return metadata[key] < (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$vector$2d$store$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parsePrimitiveValue"])(value);
    },
    [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$vector$2d$store$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["FilterOperator"].GTE]: ({ key, value }, metadata)=>{
        return metadata[key] >= (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$vector$2d$store$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parsePrimitiveValue"])(value);
    },
    [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$vector$2d$store$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["FilterOperator"].LTE]: ({ key, value }, metadata)=>{
        return metadata[key] <= (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$vector$2d$store$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parsePrimitiveValue"])(value);
    }
};
// Build a filter function based on the metadata and the preFilters
const buildFilterFn = (metadata, preFilters)=>{
    if (!preFilters) return true;
    if (!metadata) return false;
    const { filters, condition } = preFilters;
    const queryCondition = condition || "and"; // default to and
    const itemFilterFn = (filter)=>{
        if (filter.operator === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$vector$2d$store$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["FilterOperator"].IS_EMPTY) {
            // for `is_empty` operator, return true if the metadata key is not present or the value is empty
            const value = metadata[filter.key];
            return value === undefined || value === null || value === "" || Array.isArray(value) && value.length === 0;
        }
        if (metadata[filter.key] === undefined) {
            // for other operators, always return false if the metadata key is not present
            return false;
        }
        const metadataLookupFn = OPERATOR_TO_FILTER[filter.operator];
        if (!metadataLookupFn) throw new Error(`Unsupported operator: ${filter.operator}`);
        return metadataLookupFn(filter, metadata);
    };
    if (queryCondition === "and") return filters.every(itemFilterFn);
    return filters.some(itemFilterFn);
};
class SimpleVectorStoreData {
    constructor(){
        this.embeddingDict = {};
        this.textIdToRefDocId = {};
        this.metadataDict = {};
    }
}
class SimpleVectorStore extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$vector$2d$store$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BaseVectorStore"] {
    constructor(init){
        super(init), this.storesText = false;
        this.data = init?.data || new SimpleVectorStoreData();
    }
    static async fromPersistDir(persistDir = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DEFAULT_PERSIST_DIR"], embedModel) {
        const persistPath = __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__$3c$export__default__as__path$3e$__["path"].join(persistDir, "vector_store.json");
        return await SimpleVectorStore.fromPersistPath(persistPath, embedModel);
    }
    client() {
        return null;
    }
    async get(textId) {
        return this.data.embeddingDict[textId];
    }
    async add(embeddingResults) {
        for (const node of embeddingResults){
            this.data.embeddingDict[node.id_] = node.getEmbedding();
            if (!node.sourceNode) {
                continue;
            }
            this.data.textIdToRefDocId[node.id_] = node.sourceNode?.nodeId;
            // Add metadata to the metadataDict
            const metadata = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$vector$2d$store$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["nodeToMetadata"])(node, true, undefined, false);
            delete metadata["_node_content"];
            this.data.metadataDict[node.id_] = metadata;
        }
        if (this.persistPath) {
            await this.persist(this.persistPath);
        }
        return embeddingResults.map((result)=>result.id_);
    }
    async delete(refDocId) {
        const textIdsToDelete = Object.keys(this.data.textIdToRefDocId).filter((textId)=>this.data.textIdToRefDocId[textId] === refDocId);
        for (const textId of textIdsToDelete){
            delete this.data.embeddingDict[textId];
            delete this.data.textIdToRefDocId[textId];
            if (this.data.metadataDict) delete this.data.metadataDict[textId];
        }
        if (this.persistPath) {
            await this.persist(this.persistPath);
        }
        return Promise.resolve();
    }
    async filterNodes(query) {
        const items = Object.entries(this.data.embeddingDict);
        const queryFilterFn = (nodeId)=>{
            const metadata = this.data.metadataDict[nodeId];
            return buildFilterFn(metadata, query.filters);
        };
        const nodeFilterFn = (nodeId)=>{
            if (!query.docIds) return true;
            const availableIds = new Set(query.docIds);
            return availableIds.has(nodeId);
        };
        const queriedItems = items.filter((item)=>nodeFilterFn(item[0]) && queryFilterFn(item[0]));
        const nodeIds = queriedItems.map((item)=>item[0]);
        const embeddings = queriedItems.map((item)=>item[1]);
        return {
            nodeIds,
            embeddings
        };
    }
    async query(query) {
        const { nodeIds, embeddings } = await this.filterNodes(query);
        const queryEmbedding = query.queryEmbedding;
        let topSimilarities, topIds;
        if (LEARNER_MODES.has(query.mode)) {
            // fixme: unfinished
            throw new Error("Learner modes not implemented for SimpleVectorStore yet.");
        } else if (query.mode === MMR_MODE) {
            const mmrThreshold = query.mmrThreshold;
            [topSimilarities, topIds] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$embeddings$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getTopKMMREmbeddings"])(queryEmbedding, embeddings, null, query.similarityTopK, nodeIds, mmrThreshold);
        } else if (query.mode === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$vector$2d$store$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["VectorStoreQueryMode"].DEFAULT) {
            [topSimilarities, topIds] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$embeddings$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getTopKEmbeddings"])(queryEmbedding, embeddings, query.similarityTopK, nodeIds);
        } else {
            throw new Error(`Invalid query mode: ${query.mode}`);
        }
        return Promise.resolve({
            similarities: topSimilarities,
            ids: topIds
        });
    }
    async persist(persistPath = __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__$3c$export__default__as__path$3e$__["path"].join(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DEFAULT_PERSIST_DIR"], "vector_store.json")) {
        await SimpleVectorStore.persistData(persistPath, this.data);
    }
    static async persistData(persistPath, data) {
        const dirPath = __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__$3c$export__default__as__path$3e$__["path"].dirname(persistPath);
        if (!await exists(dirPath)) {
            await __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs$2f$promises__$5b$external$5d$__$28$node$3a$fs$2f$promises$2c$__cjs$29$__$3c$export__default__as__fs$3e$__["fs"].mkdir(dirPath);
        }
        await __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs$2f$promises__$5b$external$5d$__$28$node$3a$fs$2f$promises$2c$__cjs$29$__$3c$export__default__as__fs$3e$__["fs"].writeFile(persistPath, JSON.stringify(data));
    }
    static async fromPersistPath(persistPath, embeddingModel) {
        const dirPath = __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__$3c$export__default__as__path$3e$__["path"].dirname(persistPath);
        if (!await exists(dirPath)) {
            await __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs$2f$promises__$5b$external$5d$__$28$node$3a$fs$2f$promises$2c$__cjs$29$__$3c$export__default__as__fs$3e$__["fs"].mkdir(dirPath, {
                recursive: true
            });
        }
        let dataDict = {};
        if (!await exists(persistPath)) {
            console.info(`Starting new store from path: ${persistPath}`);
        } else {
            try {
                const fileData = await __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs$2f$promises__$5b$external$5d$__$28$node$3a$fs$2f$promises$2c$__cjs$29$__$3c$export__default__as__fs$3e$__["fs"].readFile(persistPath);
                dataDict = JSON.parse(fileData.toString());
            } catch (e) {
                throw new Error(`Failed to load data from path: ${persistPath}`, {
                    cause: e
                });
            }
        }
        const data = new SimpleVectorStoreData();
        // @ts-expect-error TS2322
        data.embeddingDict = dataDict.embeddingDict ?? {};
        // @ts-expect-error TS2322
        data.textIdToRefDocId = dataDict.textIdToRefDocId ?? {};
        // @ts-expect-error TS2322
        data.metadataDict = dataDict.metadataDict ?? {};
        const store = new SimpleVectorStore({
            data,
            embeddingModel
        });
        store.persistPath = persistPath;
        return store;
    }
    static fromDict(saveDict, embeddingModel) {
        const data = new SimpleVectorStoreData();
        data.embeddingDict = saveDict.embeddingDict;
        data.textIdToRefDocId = saveDict.textIdToRefDocId;
        data.metadataDict = saveDict.metadataDict;
        return new SimpleVectorStore({
            data,
            embeddingModel
        });
    }
    toDict() {
        return {
            embeddingDict: this.data.embeddingDict,
            textIdToRefDocId: this.data.textIdToRefDocId,
            metadataDict: this.data.metadataDict
        };
    }
}
class SimpleDocumentStore extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$storage$2f$doc$2d$store$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["KVDocumentStore"] {
    constructor(kvStore, namespace){
        kvStore = kvStore || new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$storage$2f$kv$2d$store$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SimpleKVStore"]();
        namespace = namespace || __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DEFAULT_NAMESPACE"];
        super(kvStore, namespace);
        this.kvStore = kvStore;
    }
    static async fromPersistDir(persistDir = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DEFAULT_PERSIST_DIR"], namespace) {
        const persistPath = __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__$3c$export__default__as__path$3e$__["path"].join(persistDir, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DEFAULT_DOC_STORE_PERSIST_FILENAME"]);
        return await SimpleDocumentStore.fromPersistPath(persistPath, namespace);
    }
    static async fromPersistPath(persistPath, namespace) {
        const simpleKVStore = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$storage$2f$kv$2d$store$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SimpleKVStore"].fromPersistPath(persistPath);
        return new SimpleDocumentStore(simpleKVStore, namespace);
    }
    async persist(persistPath = __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__$3c$export__default__as__path$3e$__["path"].join(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DEFAULT_PERSIST_DIR"], __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DEFAULT_DOC_STORE_PERSIST_FILENAME"])) {
        if (__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lodash$40$4$2e$17$2e$21$2f$node_modules$2f$lodash$2f$lodash$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].isObject(this.kvStore) && this.kvStore instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$storage$2f$kv$2d$store$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BaseInMemoryKVStore"]) {
            await this.kvStore.persist(persistPath);
        }
    }
    static fromDict(saveDict, namespace) {
        const simpleKVStore = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$storage$2f$kv$2d$store$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SimpleKVStore"].fromDict(saveDict);
        return new SimpleDocumentStore(simpleKVStore, namespace);
    }
    toDict() {
        if (__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lodash$40$4$2e$17$2e$21$2f$node_modules$2f$lodash$2f$lodash$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].isObject(this.kvStore) && this.kvStore instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$storage$2f$kv$2d$store$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SimpleKVStore"]) {
            return this.kvStore.toDict();
        }
        // If the kvstore is not a SimpleKVStore, you might want to throw an error or return a default value.
        throw new Error("KVStore is not a SimpleKVStore");
    }
}
async function storageContextFromDefaults({ docStore, indexStore, vectorStore, vectorStores, persistDir }) {
    vectorStores = vectorStores ?? {};
    if (!persistDir) {
        docStore = docStore ?? new SimpleDocumentStore();
        indexStore = indexStore ?? new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$storage$2f$index$2d$store$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SimpleIndexStore"]();
        if (!(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$schema$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ModalityType"].TEXT in vectorStores)) {
            vectorStores[__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$schema$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ModalityType"].TEXT] = vectorStore ?? new SimpleVectorStore();
        }
    } else {
        const embedModel = Settings.embedModel;
        docStore = docStore || await SimpleDocumentStore.fromPersistDir(persistDir, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DEFAULT_NAMESPACE"]);
        indexStore = indexStore || await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$storage$2f$index$2d$store$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SimpleIndexStore"].fromPersistDir(persistDir);
        if (!(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$schema$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ObjectType"].TEXT in vectorStores)) {
            vectorStores[__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$schema$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ModalityType"].TEXT] = vectorStore ?? await SimpleVectorStore.fromPersistDir(persistDir, embedModel);
        }
    }
    return {
        docStore,
        indexStore,
        vectorStores
    };
}
const transformToJSON = (obj)=>{
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const seen = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const replacer = (key, value)=>{
        if (value != null && typeof value == "object") {
            if (seen.indexOf(value) >= 0) {
                return;
            }
            seen.push(value);
        }
        return value;
    };
    // this is a custom replacer function that will allow us to handle circular references
    const jsonStr = JSON.stringify(obj, replacer);
    return jsonStr;
};
function getTransformationHash(nodes, transform) {
    const nodesStr = nodes.map((node)=>node.getContent(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$schema$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["MetadataMode"].ALL)).join("");
    const transformString = transformToJSON(transform);
    const hash = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$env$40$0$2e$1$2e$30$2f$node_modules$2f40$llamaindex$2f$env$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createSHA256"])();
    hash.update(nodesStr + transformString + transform.id);
    return hash.digest();
}
async function runTransformations(nodesToRun, transformations, transformOptions = {}, { inPlace = true, cache, docStoreStrategy } = {}) {
    let nodes = nodesToRun;
    if (!inPlace) {
        nodes = [
            ...nodesToRun
        ];
    }
    if (docStoreStrategy) {
        nodes = await docStoreStrategy(nodes);
    }
    for (const transform of transformations){
        if (cache) {
            const hash = getTransformationHash(nodes, transform);
            const cachedNodes = await cache.get(hash);
            if (cachedNodes) {
                nodes = cachedNodes;
            } else {
                nodes = await transform(nodes, transformOptions);
                await cache.put(hash, nodes);
            }
        } else {
            nodes = await transform(nodes, transformOptions);
        }
    }
    return nodes;
}
const DEFAULT_NAME = "query_engine_tool";
const DEFAULT_DESCRIPTION = "Useful for running a natural language query against a knowledge base and get back a natural language response.";
const DEFAULT_PARAMETERS = {
    type: "object",
    properties: {
        query: {
            type: "string",
            description: "The query to search for"
        }
    },
    required: [
        "query"
    ]
};
class QueryEngineTool {
    constructor({ queryEngine, metadata, includeSourceNodes }){
        this.queryEngine = queryEngine;
        this.metadata = {
            name: metadata?.name ?? DEFAULT_NAME,
            description: metadata?.description ?? DEFAULT_DESCRIPTION,
            parameters: metadata?.parameters ?? DEFAULT_PARAMETERS
        };
        this.includeSourceNodes = includeSourceNodes ?? false;
    }
    async call({ query }) {
        const response = await this.queryEngine.query({
            query
        });
        if (!this.includeSourceNodes) {
            return {
                content: response.message.content
            };
        }
        return {
            content: response.message.content,
            sourceNodes: response.sourceNodes
        };
    }
}
/**
 * Indexes are the data structure that we store our nodes and embeddings in so
 * they can be retrieved for our queries.
 */ class BaseIndex {
    constructor(init){
        this.storageContext = init.storageContext;
        this.docStore = init.docStore;
        this.indexStore = init.indexStore;
        this.indexStruct = init.indexStruct;
    }
    /**
   * Returns a query tool by calling asQueryEngine.
   * Either options or retriever can be passed, but not both.
   * If options are provided, they are passed to generate a retriever.
   */ asQueryTool(params) {
        if (params.options) {
            params.retriever = this.asRetriever(params.options);
        }
        return new QueryEngineTool({
            queryEngine: this.asQueryEngine(params),
            metadata: params?.metadata,
            includeSourceNodes: params?.includeSourceNodes ?? false
        });
    }
    /**
   * Insert a document into the index.
   * @param document
   */ async insert(document) {
        const nodes = await runTransformations([
            document
        ], [
            Settings.nodeParser
        ]);
        await this.insertNodes(nodes);
        await this.docStore.setDocumentHash(document.id_, document.hash);
    }
    /**
   * Alias for asRetriever
   * @param options
   */ // eslint-disable-next-line @typescript-eslint/no-explicit-any
    retriever(options) {
        return this.asRetriever(options);
    }
    /**
   * Alias for asQueryEngine
   * @param options you can supply your own custom Retriever and ResponseSynthesizer
   */ queryEngine(options) {
        return this.asQueryEngine(options);
    }
    /**
   * Alias for asQueryTool
   * Either options or retriever can be passed, but not both.
   * If options are provided, they are passed to generate a retriever.
   */ queryTool(params) {
        return this.asQueryTool(params);
    }
}
const defaultFormatNodeBatchFn = (summaryNodes)=>{
    return summaryNodes.map((node, idx)=>{
        return `
Document ${idx + 1}:
${node.getContent(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$schema$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["MetadataMode"].LLM)}
        `.trim();
    }).join("\n\n");
};
const defaultParseChoiceSelectAnswerFn = (answer, numChoices, raiseErr = false)=>{
    // split the line into the answer number and relevance score portions
    const lineTokens = answer.split("\n").map((line)=>{
        const lineTokens = line.split(",");
        if (lineTokens.length !== 2) {
            if (raiseErr) {
                throw new Error(`Invalid answer line: ${line}. Answer line must be of the form: answer_num: <int>, answer_relevance: <float>`);
            } else {
                return null;
            }
        }
        return lineTokens;
    }).filter((lineTokens)=>!__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lodash$40$4$2e$17$2e$21$2f$node_modules$2f$lodash$2f$lodash$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].isNil(lineTokens));
    // parse the answer number and relevance score
    return lineTokens.reduce((parseResult, lineToken)=>{
        try {
            const docNum = parseInt(lineToken[0].split(":")[1].trim());
            const answerRelevance = parseFloat(lineToken[1].split(":")[1].trim());
            if (docNum < 1 || docNum > numChoices) {
                if (raiseErr) {
                    throw new Error(`Invalid answer number: ${docNum}. Answer number must be between 1 and ${numChoices}`);
                }
            } else {
                parseResult[docNum] = answerRelevance;
            }
        } catch (e) {
            if (raiseErr) {
                throw e;
            }
        }
        return parseResult;
    }, {});
};
/**
 * A SummaryIndex keeps nodes in a sequential order for use with summarization.
 */ class SummaryIndex extends BaseIndex {
    constructor(init){
        super(init);
    }
    static async init(options) {
        const storageContext = options.storageContext ?? await storageContextFromDefaults({});
        const { docStore, indexStore } = storageContext;
        // Setup IndexStruct from storage
        const indexStructs = await indexStore.getIndexStructs();
        let indexStruct;
        if (options.indexStruct && indexStructs.length > 0) {
            throw new Error("Cannot initialize index with both indexStruct and indexStore");
        }
        if (options.indexStruct) {
            indexStruct = options.indexStruct;
        } else if (indexStructs.length == 1) {
            indexStruct = indexStructs[0].type === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$data$2d$structs$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["IndexStructType"].LIST ? indexStructs[0] : null;
        } else if (indexStructs.length > 1 && options.indexId) {
            indexStruct = await indexStore.getIndexStruct(options.indexId);
        } else {
            indexStruct = null;
        }
        // check indexStruct type
        if (indexStruct && indexStruct.type !== __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$data$2d$structs$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["IndexStructType"].LIST) {
            throw new Error("Attempting to initialize SummaryIndex with non-list indexStruct");
        }
        if (indexStruct) {
            if (options.nodes) {
                throw new Error("Cannot initialize SummaryIndex with both nodes and indexStruct");
            }
        } else {
            if (!options.nodes) {
                throw new Error("Cannot initialize SummaryIndex without nodes or indexStruct");
            }
            indexStruct = await SummaryIndex.buildIndexFromNodes(options.nodes, storageContext.docStore);
            await indexStore.addIndexStruct(indexStruct);
        }
        return new SummaryIndex({
            storageContext,
            docStore,
            indexStore,
            indexStruct
        });
    }
    static async fromDocuments(documents, args = {}) {
        let { storageContext } = args;
        storageContext = storageContext ?? await storageContextFromDefaults({});
        const docStore = storageContext.docStore;
        await docStore.addDocuments(documents, true);
        for (const doc of documents){
            await docStore.setDocumentHash(doc.id_, doc.hash);
        }
        const nodes = await Settings.nodeParser.getNodesFromDocuments(documents);
        const index = await SummaryIndex.init({
            nodes,
            storageContext
        });
        return index;
    }
    asRetriever(options) {
        const { mode = "default" } = options ?? {};
        switch(mode){
            case "default":
                return new SummaryIndexRetriever(this);
            case "llm":
                return new SummaryIndexLLMRetriever(this);
            default:
                throw new Error(`Unknown retriever mode: ${mode}`);
        }
    }
    asQueryEngine(options) {
        let { retriever, responseSynthesizer } = options ?? {};
        if (!retriever) {
            retriever = this.asRetriever();
        }
        if (!responseSynthesizer) {
            responseSynthesizer = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$response$2d$synthesizers$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getResponseSynthesizer"])("compact");
        }
        return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$query$2d$engine$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["RetrieverQueryEngine"](retriever, responseSynthesizer, options?.nodePostprocessors);
    }
    asChatEngine(options) {
        const { retriever, mode, ...contextChatEngineOptions } = options ?? {};
        return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$chat$2d$engine$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ContextChatEngine"]({
            retriever: retriever ?? this.asRetriever({
                mode: mode ?? "default"
            }),
            ...contextChatEngineOptions
        });
    }
    static async buildIndexFromNodes(nodes, docStore, indexStruct) {
        indexStruct = indexStruct || new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$data$2d$structs$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["IndexList"]();
        await docStore.addDocuments(nodes, true);
        for (const node of nodes){
            indexStruct.addNode(node);
        }
        return indexStruct;
    }
    async insertNodes(nodes) {
        for (const node of nodes){
            this.indexStruct.addNode(node);
        }
    }
    async deleteRefDoc(refDocId, deleteFromDocStore) {
        const refDocInfo = await this.docStore.getRefDocInfo(refDocId);
        if (!refDocInfo) {
            return;
        }
        await this.deleteNodes(refDocInfo.nodeIds, false);
        if (deleteFromDocStore) {
            await this.docStore.deleteRefDoc(refDocId, false);
        }
        return;
    }
    async deleteNodes(nodeIds, deleteFromDocStore) {
        this.indexStruct.nodes = this.indexStruct.nodes.filter((existingNodeId)=>!nodeIds.includes(existingNodeId));
        if (deleteFromDocStore) {
            for (const nodeId of nodeIds){
                await this.docStore.deleteDocument(nodeId, false);
            }
        }
        await this.storageContext.indexStore.addIndexStruct(this.indexStruct);
    }
    async getRefDocInfo() {
        const nodeDocIds = this.indexStruct.nodes;
        const nodes = await this.docStore.getNodes(nodeDocIds);
        const refDocInfoMap = {};
        for (const node of nodes){
            const refNode = node.sourceNode;
            if (__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lodash$40$4$2e$17$2e$21$2f$node_modules$2f$lodash$2f$lodash$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].isNil(refNode)) {
                continue;
            }
            const refDocInfo = await this.docStore.getRefDocInfo(refNode.nodeId);
            if (__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lodash$40$4$2e$17$2e$21$2f$node_modules$2f$lodash$2f$lodash$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].isNil(refDocInfo)) {
                continue;
            }
            refDocInfoMap[refNode.nodeId] = refDocInfo;
        }
        return refDocInfoMap;
    }
}
/**
 * Simple retriever for SummaryIndex that returns all nodes
 */ class SummaryIndexRetriever extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$retriever$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BaseRetriever"] {
    constructor(index){
        super();
        this.index = index;
    }
    async _retrieve(queryBundle) {
        const nodeIds = this.index.indexStruct.nodes;
        const nodes = await this.index.docStore.getNodes(nodeIds);
        return nodes.map((node)=>({
                node: node,
                score: 1
            }));
    }
}
/**
 * LLM retriever for SummaryIndex which lets you select the most relevant chunks.
 */ class SummaryIndexLLMRetriever extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$retriever$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BaseRetriever"] {
    constructor(index, choiceSelectPrompt, choiceBatchSize = 10, formatNodeBatchFn, parseChoiceSelectAnswerFn){
        super();
        this.index = index;
        this.choiceSelectPrompt = choiceSelectPrompt || __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$prompts$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["defaultChoiceSelectPrompt"];
        this.choiceBatchSize = choiceBatchSize;
        this.formatNodeBatchFn = formatNodeBatchFn || defaultFormatNodeBatchFn;
        this.parseChoiceSelectAnswerFn = parseChoiceSelectAnswerFn || defaultParseChoiceSelectAnswerFn;
    }
    async _retrieve(query) {
        const nodeIds = this.index.indexStruct.nodes;
        const results = [];
        for(let idx = 0; idx < nodeIds.length; idx += this.choiceBatchSize){
            const nodeIdsBatch = nodeIds.slice(idx, idx + this.choiceBatchSize);
            const nodesBatch = await this.index.docStore.getNodes(nodeIdsBatch);
            const fmtBatchStr = this.formatNodeBatchFn(nodesBatch);
            const input = {
                context: fmtBatchStr,
                query: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$utils$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["extractText"])(query)
            };
            const llm = Settings.llm;
            const rawResponse = (await llm.complete({
                prompt: this.choiceSelectPrompt.format(input)
            })).text;
            // parseResult is a map from doc number to relevance score
            const parseResult = this.parseChoiceSelectAnswerFn(rawResponse, nodesBatch.length);
            const choiceNodeIds = nodeIdsBatch.filter((nodeId, idx)=>{
                return `${idx}` in parseResult;
            });
            const choiceNodes = await this.index.docStore.getNodes(choiceNodeIds);
            const nodeWithScores = choiceNodes.map((node, i)=>({
                    node: node,
                    score: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lodash$40$4$2e$17$2e$21$2f$node_modules$2f$lodash$2f$lodash$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].get(parseResult, `${i + 1}`, 1)
                }));
            results.push(...nodeWithScores);
        }
        return results;
    }
}
class FaithfulnessEvaluator extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$prompts$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PromptMixin"] {
    constructor(params){
        super();
        this.raiseError = params?.raiseError ?? false;
        this.evalTemplate = params?.faithfulnessSystemPrompt ?? defaultFaithfulnessTextQaPrompt;
        this.refineTemplate = params?.faithFulnessRefinePrompt ?? defaultFaithfulnessRefinePrompt;
    }
    _getPromptModules() {
        return {};
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    _getPrompts() {
        return {
            faithfulnessSystemPrompt: this.evalTemplate,
            faithFulnessRefinePrompt: this.refineTemplate
        };
    }
    _updatePrompts(promptsDict) {
        if (promptsDict.faithfulnessSystemPrompt) {
            this.evalTemplate = promptsDict.faithfulnessSystemPrompt;
        }
        if (promptsDict.faithFulnessRefinePrompt) {
            this.refineTemplate = promptsDict.faithFulnessRefinePrompt;
        }
    }
    /**
   * @param query Query to evaluate
   * @param response  Response to evaluate
   * @param contexts Array of contexts
   * @param reference  Reference response
   * @param sleepTimeInSeconds  Sleep time in seconds
   */ async evaluate({ query, response, contexts = [], reference, sleepTimeInSeconds = 0 }) {
        if (query === null || response === null) {
            throw new Error("query, and response must be provided");
        }
        await new Promise((resolve)=>setTimeout(resolve, sleepTimeInSeconds * 1000));
        const docs = contexts?.map((context)=>new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$schema$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Document"]({
                text: context
            }));
        const index = await SummaryIndex.fromDocuments(docs, {});
        const queryEngine = index.asQueryEngine();
        queryEngine.updatePrompts({
            "responseSynthesizer:textQATemplate": this.evalTemplate,
            "responseSynthesizer:refineTemplate": this.refineTemplate
        });
        const responseObj = await queryEngine.query({
            query: {
                query: response
            },
            stream: false
        });
        const rawResponseTxt = responseObj.toString();
        let passing;
        if (rawResponseTxt.toLowerCase().includes("yes")) {
            passing = true;
        } else {
            passing = false;
            if (this.raiseError) {
                throw new Error("The response is invalid");
            }
        }
        return {
            query,
            contexts,
            response,
            passing,
            score: passing ? 1.0 : 0.0,
            feedback: rawResponseTxt
        };
    }
    /**
   * @param query Query to evaluate
   * @param response  Response to evaluate
   */ async evaluateResponse({ query, response }) {
        const responseStr = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$utils$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["extractText"])(response?.message.content);
        const contexts = [];
        if (response) {
            for (const node of response.sourceNodes || []){
                contexts.push(node.node.getContent(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$schema$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["MetadataMode"].ALL));
            }
        }
        return this.evaluate({
            query,
            response: responseStr,
            contexts
        });
    }
}
class RelevancyEvaluator extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$prompts$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PromptMixin"] {
    constructor(params){
        super();
        this.raiseError = params?.raiseError ?? false;
        this.evalTemplate = params?.evalTemplate ?? defaultRelevancyEvalPrompt;
        this.refineTemplate = params?.refineTemplate ?? defaultRelevancyRefinePrompt;
    }
    _getPromptModules() {
        return {};
    }
    _getPrompts() {
        return {
            evalTemplate: this.evalTemplate,
            refineTemplate: this.refineTemplate
        };
    }
    _updatePrompts(prompts) {
        if ("evalTemplate" in prompts) {
            this.evalTemplate = prompts["evalTemplate"];
        }
        if ("refineTemplate" in prompts) {
            this.refineTemplate = prompts["refineTemplate"];
        }
    }
    async evaluate({ query, response, contexts = [], sleepTimeInSeconds = 0 }) {
        if (query === null || response === null) {
            throw new Error("query, contexts, and response must be provided");
        }
        await new Promise((resolve)=>setTimeout(resolve, sleepTimeInSeconds * 1000));
        const docs = contexts?.map((context)=>new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$schema$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Document"]({
                text: context
            }));
        const index = await SummaryIndex.fromDocuments(docs, {});
        const queryResponse = `Question: ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$utils$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["extractText"])(query)}\nResponse: ${response}`;
        const queryEngine = index.asQueryEngine();
        queryEngine.updatePrompts({
            "responseSynthesizer:textQATemplate": this.evalTemplate,
            "responseSynthesizer:refineTemplate": this.refineTemplate
        });
        const responseObj = await queryEngine.query({
            query: queryResponse
        });
        const rawResponseTxt = responseObj.toString();
        let passing;
        if (rawResponseTxt.toLowerCase().includes("yes")) {
            passing = true;
        } else {
            passing = false;
            if (this.raiseError) {
                throw new Error("The response is invalid");
            }
        }
        return {
            query,
            contexts,
            response,
            passing,
            score: passing ? 1.0 : 0.0,
            feedback: rawResponseTxt
        };
    }
    /**
   * @param query Query to evaluate
   * @param response  Response to evaluate
   */ async evaluateResponse({ query, response }) {
        const responseStr = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$utils$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["extractText"])(response?.message.content);
        const contexts = [];
        if (response) {
            for (const node of response.sourceNodes || []){
                contexts.push(node.node.getContent(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$schema$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["MetadataMode"].ALL));
            }
        }
        return this.evaluate({
            query,
            response: responseStr,
            contexts
        });
    }
}
;
}}),
"[project]/node_modules/.pnpm/llamaindex@0.11.19_@llama-flow+core@0.4.4_next@15.3.4_react-dom@19.1.0_react@19.1.0__re_1d30be2795de4d1906fac150e4bc1023/node_modules/llamaindex/extractors/dist/index.js [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "BaseExtractor": (()=>BaseExtractor),
    "KeywordExtractor": (()=>KeywordExtractor),
    "QuestionsAnsweredExtractor": (()=>QuestionsAnsweredExtractor),
    "SummaryExtractor": (()=>SummaryExtractor),
    "TitleExtractor": (()=>TitleExtractor)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$prompts$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/prompts/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$schema$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/schema/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/global/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$indices$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/indices/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$node$2d$parser$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/node-parser/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$env$40$0$2e$1$2e$30$2f$node_modules$2f40$llamaindex$2f$env$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+env@0.1.30/node_modules/@llamaindex/env/dist/index.js [app-route] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$async_hooks__$5b$external$5d$__$28$node$3a$async_hooks$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:async_hooks [external] (node:async_hooks, cjs)");
;
;
;
;
;
;
/**
 * @internal
 */ class GlobalSettings {
    #prompt;
    #promptHelper;
    #nodeParser;
    #chunkOverlap;
    #promptHelperAsyncLocalStorage;
    #nodeParserAsyncLocalStorage;
    #chunkOverlapAsyncLocalStorage;
    #promptAsyncLocalStorage;
    get debug() {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Settings"].debug;
    }
    get llm() {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Settings"].llm;
    }
    set llm(llm) {
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Settings"].llm = llm;
    }
    withLLM(llm, fn) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Settings"].withLLM(llm, fn);
    }
    get promptHelper() {
        if (this.#promptHelper === null) {
            this.#promptHelper = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$indices$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PromptHelper"]();
        }
        return this.#promptHelperAsyncLocalStorage.getStore() ?? this.#promptHelper;
    }
    set promptHelper(promptHelper) {
        this.#promptHelper = promptHelper;
    }
    withPromptHelper(promptHelper, fn) {
        return this.#promptHelperAsyncLocalStorage.run(promptHelper, fn);
    }
    get embedModel() {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Settings"].embedModel;
    }
    set embedModel(embedModel) {
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Settings"].embedModel = embedModel;
    }
    withEmbedModel(embedModel, fn) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Settings"].withEmbedModel(embedModel, fn);
    }
    get nodeParser() {
        if (this.#nodeParser === null) {
            this.#nodeParser = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$node$2d$parser$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SentenceSplitter"]({
                chunkSize: this.chunkSize,
                chunkOverlap: this.chunkOverlap
            });
        }
        return this.#nodeParserAsyncLocalStorage.getStore() ?? this.#nodeParser;
    }
    set nodeParser(nodeParser) {
        this.#nodeParser = nodeParser;
    }
    withNodeParser(nodeParser, fn) {
        return this.#nodeParserAsyncLocalStorage.run(nodeParser, fn);
    }
    get callbackManager() {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Settings"].callbackManager;
    }
    set callbackManager(callbackManager) {
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Settings"].callbackManager = callbackManager;
    }
    withCallbackManager(callbackManager, fn) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Settings"].withCallbackManager(callbackManager, fn);
    }
    set chunkSize(chunkSize) {
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Settings"].chunkSize = chunkSize;
    }
    get chunkSize() {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Settings"].chunkSize;
    }
    withChunkSize(chunkSize, fn) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Settings"].withChunkSize(chunkSize, fn);
    }
    get chunkOverlap() {
        return this.#chunkOverlapAsyncLocalStorage.getStore() ?? this.#chunkOverlap;
    }
    set chunkOverlap(chunkOverlap) {
        if (typeof chunkOverlap === "number") {
            this.#chunkOverlap = chunkOverlap;
        }
    }
    withChunkOverlap(chunkOverlap, fn) {
        return this.#chunkOverlapAsyncLocalStorage.run(chunkOverlap, fn);
    }
    get prompt() {
        return this.#promptAsyncLocalStorage.getStore() ?? this.#prompt;
    }
    set prompt(prompt) {
        this.#prompt = prompt;
    }
    withPrompt(prompt, fn) {
        return this.#promptAsyncLocalStorage.run(prompt, fn);
    }
    constructor(){
        this.#prompt = {};
        this.#promptHelper = null;
        this.#nodeParser = null;
        this.#promptHelperAsyncLocalStorage = new __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$async_hooks__$5b$external$5d$__$28$node$3a$async_hooks$2c$__cjs$29$__["AsyncLocalStorage"]();
        this.#nodeParserAsyncLocalStorage = new __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$async_hooks__$5b$external$5d$__$28$node$3a$async_hooks$2c$__cjs$29$__["AsyncLocalStorage"]();
        this.#chunkOverlapAsyncLocalStorage = new __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$async_hooks__$5b$external$5d$__$28$node$3a$async_hooks$2c$__cjs$29$__["AsyncLocalStorage"]();
        this.#promptAsyncLocalStorage = new __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$async_hooks__$5b$external$5d$__$28$node$3a$async_hooks$2c$__cjs$29$__["AsyncLocalStorage"]();
    }
}
const Settings = new GlobalSettings();
/*
 * Abstract class for all extractors.
 */ class BaseExtractor extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$schema$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["TransformComponent"] {
    constructor(){
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        super(async (nodes, options)=>{
            return this.processNodes(nodes, options?.excludedEmbedMetadataKeys, options?.excludedLlmMetadataKeys);
        }), this.isTextNodeOnly = true, this.showProgress = true, this.metadataMode = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$schema$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["MetadataMode"].ALL, this.disableTemplateRewrite = false, this.inPlace = true, this.numWorkers = 4;
    }
    /**
   *
   * @param nodes Nodes to extract metadata from.
   * @param excludedEmbedMetadataKeys Metadata keys to exclude from the embedding.
   * @param excludedLlmMetadataKeys Metadata keys to exclude from the LLM.
   * @returns Metadata extracted from the nodes.
   */ async processNodes(nodes, excludedEmbedMetadataKeys = undefined, excludedLlmMetadataKeys = undefined) {
        let newNodes;
        if (this.inPlace) {
            newNodes = nodes;
        } else {
            newNodes = nodes.slice();
        }
        const curMetadataList = await this.extract(newNodes);
        for(const idx in newNodes){
            newNodes[idx].metadata = {
                ...newNodes[idx].metadata,
                ...curMetadataList[idx]
            };
        }
        for(const idx in newNodes){
            if (excludedEmbedMetadataKeys) {
                newNodes[idx].excludedEmbedMetadataKeys.concat(excludedEmbedMetadataKeys);
            }
            if (excludedLlmMetadataKeys) {
                newNodes[idx].excludedLlmMetadataKeys.concat(excludedLlmMetadataKeys);
            }
            if (!this.disableTemplateRewrite) {
                if (newNodes[idx] instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$schema$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["TextNode"]) {
                    newNodes[idx] = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$schema$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["TextNode"]({
                        ...newNodes[idx],
                        textTemplate: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$prompts$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["defaultNodeTextTemplate"].format()
                    });
                }
            }
        }
        return newNodes;
    }
}
const STRIP_REGEX = /(\r\n|\n|\r)/gm;
/**
 * Extract keywords from a list of nodes.
 */ class KeywordExtractor extends BaseExtractor {
    /**
   * Constructor for the KeywordExtractor class.
   * @param {LLM} llm LLM instance.
   * @param {number} keywords Number of keywords to extract.
   * @throws {Error} If keywords is less than 1.
   */ constructor(options){
        if (options?.keywords && options.keywords < 1) throw new Error("Keywords must be greater than 0");
        super(), /**
   * Number of keywords to extract.
   * @type {number}
   * @default 5
   */ this.keywords = 5;
        this.llm = options?.llm ?? Settings.llm;
        this.keywords = options?.keywords ?? 5;
        this.promptTemplate = options?.promptTemplate ? new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$prompts$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PromptTemplate"]({
            templateVars: [
                "context",
                "maxKeywords"
            ],
            template: options.promptTemplate
        }) : __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$prompts$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["defaultKeywordExtractPrompt"];
    }
    /**
   *
   * @param node Node to extract keywords from.
   * @returns Keywords extracted from the node.
   */ async extractKeywordsFromNodes(node) {
        if (this.isTextNodeOnly && !(node instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$schema$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["TextNode"])) {
            return {};
        }
        const completion = await this.llm.complete({
            prompt: this.promptTemplate.format({
                context: node.getContent(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$schema$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["MetadataMode"].ALL),
                maxKeywords: this.keywords.toString()
            })
        });
        return {
            excerptKeywords: completion.text
        };
    }
    /**
   *
   * @param nodes Nodes to extract keywords from.
   * @returns Keywords extracted from the nodes.
   */ async extract(nodes) {
        const results = await Promise.all(nodes.map((node)=>this.extractKeywordsFromNodes(node)));
        return results;
    }
}
/**
 * Extract title from a list of nodes.
 */ class TitleExtractor extends BaseExtractor {
    /**
   * Constructor for the TitleExtractor class.
   * @param {LLM} llm LLM instance.
   * @param {number} nodes Number of nodes to extract titles from.
   * @param {TitleExtractorPrompt} nodeTemplate The prompt template to use for the title extractor.
   * @param {string} combineTemplate The prompt template to merge title with..
   */ constructor(options){
        super(), /**
   * Can work for mixture of text and non-text nodes
   * @type {boolean}
   * @default false
   */ this.isTextNodeOnly = false, /**
   * Number of nodes to extrct titles from.
   * @type {number}
   * @default 5
   */ this.nodes = 5;
        this.llm = options?.llm ?? Settings.llm;
        this.nodes = options?.nodes ?? 5;
        this.nodeTemplate = options?.nodeTemplate ? new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$prompts$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PromptTemplate"]({
            templateVars: [
                "context"
            ],
            template: options.nodeTemplate
        }) : __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$prompts$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["defaultTitleExtractorPromptTemplate"];
        this.combineTemplate = options?.combineTemplate ? new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$prompts$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PromptTemplate"]({
            templateVars: [
                "context"
            ],
            template: options.combineTemplate
        }) : __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$prompts$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["defaultTitleCombinePromptTemplate"];
    }
    /**
   * Extract titles from a list of nodes.
   * @param {BaseNode[]} nodes Nodes to extract titles from.
   * @returns {Promise<BaseNode<ExtractTitle>[]>} Titles extracted from the nodes.
   */ async extract(nodes) {
        const nodesToExtractTitle = this.filterNodes(nodes);
        if (!nodesToExtractTitle.length) {
            return [];
        }
        const nodesByDocument = this.separateNodesByDocument(nodesToExtractTitle);
        const titlesByDocument = await this.extractTitles(nodesByDocument);
        return nodesToExtractTitle.map((node)=>{
            return {
                documentTitle: titlesByDocument[node.sourceNode?.nodeId ?? ""]
            };
        });
    }
    filterNodes(nodes) {
        return nodes.filter((node)=>{
            if (this.isTextNodeOnly && !(node instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$schema$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["TextNode"])) {
                return false;
            }
            return true;
        });
    }
    separateNodesByDocument(nodes) {
        const nodesByDocument = {};
        for (const node of nodes){
            const parentNode = node.sourceNode?.nodeId;
            if (!parentNode) {
                continue;
            }
            if (!nodesByDocument[parentNode]) {
                nodesByDocument[parentNode] = [];
            }
            nodesByDocument[parentNode].push(node);
        }
        return nodesByDocument;
    }
    async extractTitles(nodesByDocument) {
        const titlesByDocument = {};
        for (const [key, nodes] of Object.entries(nodesByDocument)){
            const titleCandidates = await this.getTitlesCandidates(nodes);
            const combinedTitles = titleCandidates.join(", ");
            const completion = await this.llm.complete({
                prompt: this.combineTemplate.format({
                    context: combinedTitles
                })
            });
            titlesByDocument[key] = completion.text;
        }
        return titlesByDocument;
    }
    async getTitlesCandidates(nodes) {
        const titleJobs = nodes.map(async (node)=>{
            const completion = await this.llm.complete({
                prompt: this.nodeTemplate.format({
                    context: node.getContent(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$schema$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["MetadataMode"].ALL)
                })
            });
            return completion.text;
        });
        return await Promise.all(titleJobs);
    }
}
/**
 * Extract questions from a list of nodes.
 */ class QuestionsAnsweredExtractor extends BaseExtractor {
    /**
   * Constructor for the QuestionsAnsweredExtractor class.
   * @param {LLM} llm LLM instance.
   * @param {number} questions Number of questions to generate.
   * @param {TextQAPrompt} promptTemplate The prompt template to use for the question extractor.
   * @param {boolean} embeddingOnly Wheter to use metadata for embeddings only.
   */ constructor(options){
        if (options?.questions && options.questions < 1) throw new Error("Questions must be greater than 0");
        super(), /**
   * Number of questions to generate.
   * @type {number}
   * @default 5
   */ this.questions = 5, /**
   * Wheter to use metadata for embeddings only
   * @type {boolean}
   * @default false
   */ this.embeddingOnly = false;
        this.llm = options?.llm ?? Settings.llm;
        this.questions = options?.questions ?? 5;
        this.promptTemplate = options?.promptTemplate ? new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$prompts$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PromptTemplate"]({
            templateVars: [
                "numQuestions",
                "context"
            ],
            template: options.promptTemplate
        }).partialFormat({
            numQuestions: "5"
        }) : __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$prompts$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["defaultQuestionExtractPrompt"];
        this.embeddingOnly = options?.embeddingOnly ?? false;
    }
    /**
   * Extract answered questions from a node.
   * @param {BaseNode} node Node to extract questions from.
   * @returns {Promise<Array<ExtractQuestion> | Array<{}>>} Questions extracted from the node.
   */ async extractQuestionsFromNode(node) {
        if (this.isTextNodeOnly && !(node instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$schema$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["TextNode"])) {
            return {};
        }
        const contextStr = node.getContent(this.metadataMode);
        const prompt = this.promptTemplate.format({
            context: contextStr,
            numQuestions: this.questions.toString()
        });
        const questions = await this.llm.complete({
            prompt
        });
        return {
            questionsThisExcerptCanAnswer: questions.text.replace(STRIP_REGEX, "")
        };
    }
    /**
   * Extract answered questions from a list of nodes.
   * @param {BaseNode[]} nodes Nodes to extract questions from.
   * @returns {Promise<Array<ExtractQuestion> | Array<{}>>} Questions extracted from the nodes.
   */ async extract(nodes) {
        const results = await Promise.all(nodes.map((node)=>this.extractQuestionsFromNode(node)));
        return results;
    }
}
/**
 * Extract summary from a list of nodes.
 */ class SummaryExtractor extends BaseExtractor {
    constructor(options){
        const summaries = options?.summaries ?? [
            "self"
        ];
        if (summaries && !summaries.some((s)=>[
                "self",
                "prev",
                "next"
            ].includes(s))) throw new Error("Summaries must be one of 'self', 'prev', 'next'");
        super();
        this.llm = options?.llm ?? Settings.llm;
        this.summaries = summaries;
        this.promptTemplate = options?.promptTemplate ? new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$prompts$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PromptTemplate"]({
            templateVars: [
                "context"
            ],
            template: options.promptTemplate
        }) : __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$prompts$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["defaultSummaryPrompt"];
        this.selfSummary = summaries?.includes("self") ?? false;
        this.prevSummary = summaries?.includes("prev") ?? false;
        this.nextSummary = summaries?.includes("next") ?? false;
    }
    /**
   * Extract summary from a node.
   * @param {BaseNode} node Node to extract summary from.
   * @returns {Promise<string>} Summary extracted from the node.
   */ async generateNodeSummary(node) {
        if (this.isTextNodeOnly && !(node instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$schema$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["TextNode"])) {
            return "";
        }
        const context = node.getContent(this.metadataMode);
        const prompt = this.promptTemplate.format({
            context
        });
        const summary = await this.llm.complete({
            prompt
        });
        return summary.text.replace(STRIP_REGEX, "");
    }
    /**
   * Extract summaries from a list of nodes.
   * @param {BaseNode[]} nodes Nodes to extract summaries from.
   * @returns {Promise<Array<ExtractSummary> | Arry<{}>>} Summaries extracted from the nodes.
   */ async extract(nodes) {
        if (!nodes.every((n)=>n instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$schema$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["TextNode"])) throw new Error("Only `TextNode` is allowed for `Summary` extractor");
        const nodeSummaries = await Promise.all(nodes.map((node)=>this.generateNodeSummary(node)));
        const metadataList = nodes.map(()=>({}));
        for(let i = 0; i < nodes.length; i++){
            if (i > 0 && this.prevSummary && nodeSummaries[i - 1]) {
                metadataList[i]["prevSectionSummary"] = nodeSummaries[i - 1];
            }
            if (i < nodes.length - 1 && this.nextSummary && nodeSummaries[i + 1]) {
                metadataList[i]["nextSectionSummary"] = nodeSummaries[i + 1];
            }
            if (this.selfSummary && nodeSummaries[i]) {
                metadataList[i]["sectionSummary"] = nodeSummaries[i];
            }
        }
        return metadataList;
    }
}
;
}}),
"[project]/node_modules/.pnpm/llamaindex@0.11.19_@llama-flow+core@0.4.4_next@15.3.4_react-dom@19.1.0_react@19.1.0__re_1d30be2795de4d1906fac150e4bc1023/node_modules/llamaindex/indices/dist/index.js [app-route] (ecmascript) <locals>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "BaseIndex": (()=>BaseIndex),
    "KeywordTableIndex": (()=>KeywordTableIndex),
    "KeywordTableLLMRetriever": (()=>KeywordTableLLMRetriever),
    "KeywordTableRAKERetriever": (()=>KeywordTableRAKERetriever),
    "KeywordTableRetrieverMode": (()=>KeywordTableRetrieverMode),
    "KeywordTableSimpleRetriever": (()=>KeywordTableSimpleRetriever),
    "SummaryIndex": (()=>SummaryIndex),
    "SummaryIndexLLMRetriever": (()=>SummaryIndexLLMRetriever),
    "SummaryIndexRetriever": (()=>SummaryIndexRetriever),
    "SummaryRetrieverMode": (()=>SummaryRetrieverMode),
    "VectorIndexRetriever": (()=>VectorIndexRetriever),
    "VectorStoreIndex": (()=>VectorStoreIndex),
    "defaultFormatNodeBatchFn": (()=>defaultFormatNodeBatchFn),
    "defaultParseChoiceSelectAnswerFn": (()=>defaultParseChoiceSelectAnswerFn),
    "expandTokensWithSubtokens": (()=>expandTokensWithSubtokens),
    "extractKeywordsGivenResponse": (()=>extractKeywordsGivenResponse),
    "rakeExtractKeywords": (()=>rakeExtractKeywords),
    "simpleExtractKeywords": (()=>simpleExtractKeywords)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$indices$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/indices/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$schema$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/schema/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$storage$2f$doc$2d$store$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/storage/doc-store/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$storage$2f$kv$2d$store$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/storage/kv-store/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$env$40$0$2e$1$2e$30$2f$node_modules$2f40$llamaindex$2f$env$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+env@0.1.30/node_modules/@llamaindex/env/dist/index.js [app-route] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$env$40$0$2e$1$2e$30$2f$node_modules$2f40$llamaindex$2f$env$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+env@0.1.30/node_modules/@llamaindex/env/dist/index.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$async_hooks__$5b$external$5d$__$28$node$3a$async_hooks$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:async_hooks [external] (node:async_hooks, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs$2f$promises__$5b$external$5d$__$28$node$3a$fs$2f$promises$2c$__cjs$29$__$3c$export__default__as__fs$3e$__ = __turbopack_context__.i("[externals]/node:fs/promises [external] (node:fs/promises, cjs) <export default as fs>");
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__$3c$export__default__as__path$3e$__ = __turbopack_context__.i("[externals]/node:path [external] (node:path, cjs) <export default as path>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/global/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$node$2d$parser$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/node-parser/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$query$2d$engine$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/query-engine/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$response$2d$synthesizers$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/response-synthesizers/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$utils$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/utils/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$llamaindex$40$0$2e$11$2e$19_$40$llama$2d$flow$2b$core$40$0$2e$4$2e$4_next$40$15$2e$3$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$re_1d30be2795de4d1906fac150e4bc1023$2f$node_modules$2f$llamaindex$2f$selectors$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/llamaindex@0.11.19_@llama-flow+core@0.4.4_next@15.3.4_react-dom@19.1.0_react@19.1.0__re_1d30be2795de4d1906fac150e4bc1023/node_modules/llamaindex/selectors/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$prompts$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/prompts/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$storage$2f$index$2d$store$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/storage/index-store/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$embeddings$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/embeddings/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$vector$2d$store$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/vector-store/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lodash$40$4$2e$17$2e$21$2f$node_modules$2f$lodash$2f$lodash$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lodash@4.17.21/node_modules/lodash/lodash.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$data$2d$structs$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/data-structs/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$retriever$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/retriever/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$chat$2d$engine$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/chat-engine/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$decorator$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/decorator/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$memory$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/memory/dist/index.js [app-route] (ecmascript)");
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
const transformToJSON = (obj)=>{
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const seen = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const replacer = (key, value)=>{
        if (value != null && typeof value == "object") {
            if (seen.indexOf(value) >= 0) {
                return;
            }
            seen.push(value);
        }
        return value;
    };
    // this is a custom replacer function that will allow us to handle circular references
    const jsonStr = JSON.stringify(obj, replacer);
    return jsonStr;
};
function getTransformationHash(nodes, transform) {
    const nodesStr = nodes.map((node)=>node.getContent(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$schema$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["MetadataMode"].ALL)).join("");
    const transformString = transformToJSON(transform);
    const hash = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$env$40$0$2e$1$2e$30$2f$node_modules$2f40$llamaindex$2f$env$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createSHA256"])();
    hash.update(nodesStr + transformString + transform.id);
    return hash.digest();
}
async function classify(docStore, nodes) {
    const existingDocIds = Object.values(await docStore.getAllDocumentHashes());
    const docIdsFromNodes = new Set();
    const dedupedNodes = [];
    const unusedDocs = [];
    for (const node of nodes){
        const refDocId = node.sourceNode?.nodeId || node.id_;
        docIdsFromNodes.add(refDocId);
        const existingHash = await docStore.getDocumentHash(refDocId);
        if (!existingHash) {
            // document doesn't exist, so add it
            dedupedNodes.push(node);
        } else if (existingHash && existingHash !== node.hash) {
            // document exists but hash is different, so mark doc as unused and add node as deduped
            unusedDocs.push(refDocId);
            dedupedNodes.push(node);
        }
    // otherwise, document exists and hash is the same, so do nothing
    }
    const missingDocs = existingDocIds.filter((id)=>!docIdsFromNodes.has(id));
    return {
        dedupedNodes,
        missingDocs,
        unusedDocs
    };
}
class RollbackableTransformComponent extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$schema$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["TransformComponent"] {
    // Remove unused docs from the doc store. It is useful in case
    // generating embeddings fails and we want to remove the unused docs
    // TODO: override this in UpsertsStrategy if we want to revert removed docs also
    async rollback(docStore, nodes) {
        const { unusedDocs } = await classify(docStore, nodes);
        for (const docId of unusedDocs){
            await docStore.deleteDocument(docId, false);
        }
        docStore.persist();
    }
}
/**
 * Handle doc store duplicates by checking all hashes.
 */ class DuplicatesStrategy extends RollbackableTransformComponent {
    constructor(docStore){
        super(async (nodes)=>{
            const hashes = await this.docStore.getAllDocumentHashes();
            const currentHashes = new Set();
            const nodesToRun = [];
            for (const node of nodes){
                if (!(node.hash in hashes) && !currentHashes.has(node.hash)) {
                    await this.docStore.setDocumentHash(node.id_, node.hash);
                    nodesToRun.push(node);
                    currentHashes.add(node.hash);
                }
            }
            await this.docStore.addDocuments(nodesToRun, true);
            return nodesToRun;
        });
        this.docStore = docStore;
    }
}
/**
 * Handle docstore upserts by checking hashes and ids.
 * Identify missing docs and delete them from docstore and vector store
 */ class UpsertsAndDeleteStrategy extends RollbackableTransformComponent {
    constructor(docStore, vectorStores){
        super(async (nodes)=>{
            const { dedupedNodes, missingDocs, unusedDocs } = await classify(this.docStore, nodes);
            // remove unused docs
            for (const refDocId of unusedDocs){
                await this.docStore.deleteRefDoc(refDocId, false);
                if (this.vectorStores) {
                    for (const vectorStore of this.vectorStores){
                        await vectorStore.delete(refDocId);
                    }
                }
            }
            // remove missing docs
            for (const docId of missingDocs){
                await this.docStore.deleteDocument(docId, true);
                if (this.vectorStores) {
                    for (const vectorStore of this.vectorStores){
                        await vectorStore.delete(docId);
                    }
                }
            }
            await this.docStore.addDocuments(dedupedNodes, true);
            return dedupedNodes;
        });
        this.docStore = docStore;
        this.vectorStores = vectorStores;
    }
}
/**
 * Handles doc store upserts by checking hashes and ids.
 */ class UpsertsStrategy extends RollbackableTransformComponent {
    constructor(docStore, vectorStores){
        super(async (nodes)=>{
            const { dedupedNodes, unusedDocs } = await classify(this.docStore, nodes);
            // remove unused docs
            for (const refDocId of unusedDocs){
                await this.docStore.deleteRefDoc(refDocId, false);
                if (this.vectorStores) {
                    for (const vectorStore of this.vectorStores){
                        await vectorStore.delete(refDocId);
                    }
                }
            }
            // add non-duplicate docs
            await this.docStore.addDocuments(dedupedNodes, true);
            return dedupedNodes;
        });
        this.docStore = docStore;
        this.vectorStores = vectorStores;
    }
}
/**
 * Document de-deduplication strategies work by comparing the hashes or ids stored in the document store.
 * They require a document store to be set which must be persisted across pipeline runs.
 */ var DocStoreStrategy = /*#__PURE__*/ function(DocStoreStrategy) {
    // Use upserts to handle duplicates. Checks if the a document is already in the doc store based on its id. If it is not, or if the hash of the document is updated, it will update the document in the doc store and run the transformations.
    DocStoreStrategy["UPSERTS"] = "upserts";
    // Only handle duplicates. Checks if the hash of a document is already in the doc store. Only then it will add the document to the doc store and run the transformations
    DocStoreStrategy["DUPLICATES_ONLY"] = "duplicates_only";
    // Use upserts and delete to handle duplicates. Like the upsert strategy but it will also delete non-existing documents from the doc store
    DocStoreStrategy["UPSERTS_AND_DELETE"] = "upserts_and_delete";
    DocStoreStrategy["NONE"] = "none";
    return DocStoreStrategy;
}({});
class NoOpStrategy extends RollbackableTransformComponent {
    constructor(){
        super(async (nodes)=>nodes);
    }
}
function createDocStoreStrategy(docStoreStrategy, docStore, vectorStores = []) {
    if (docStoreStrategy === "none") {
        return new NoOpStrategy();
    }
    if (!docStore) {
        throw new Error("docStore is required to create a doc store strategy.");
    }
    if (vectorStores.length > 0) {
        if (docStoreStrategy === "upserts") {
            return new UpsertsStrategy(docStore, vectorStores);
        } else if (docStoreStrategy === "upserts_and_delete") {
            return new UpsertsAndDeleteStrategy(docStore, vectorStores);
        } else if (docStoreStrategy === "duplicates_only") {
            return new DuplicatesStrategy(docStore);
        } else {
            throw new Error(`Invalid docstore strategy: ${docStoreStrategy}`);
        }
    } else {
        if (docStoreStrategy === "upserts") {
            console.warn("Docstore strategy set to upserts, but no vector store. Switching to duplicates_only strategy.");
        } else if (docStoreStrategy === "upserts_and_delete") {
            console.warn("Docstore strategy set to upserts and delete, but no vector store. Switching to duplicates_only strategy.");
        }
        return new DuplicatesStrategy(docStore);
    }
}
async function runTransformations(nodesToRun, transformations, transformOptions = {}, { inPlace = true, cache, docStoreStrategy } = {}) {
    let nodes = nodesToRun;
    if (!inPlace) {
        nodes = [
            ...nodesToRun
        ];
    }
    if (docStoreStrategy) {
        nodes = await docStoreStrategy(nodes);
    }
    for (const transform of transformations){
        if (cache) {
            const hash = getTransformationHash(nodes, transform);
            const cachedNodes = await cache.get(hash);
            if (cachedNodes) {
                nodes = cachedNodes;
            } else {
                nodes = await transform(nodes, transformOptions);
                await cache.put(hash, nodes);
            }
        } else {
            nodes = await transform(nodes, transformOptions);
        }
    }
    return nodes;
}
async function addNodesToVectorStores(nodes, vectorStores, nodesAdded) {
    const nodeMap = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$schema$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["splitNodesByType"])(nodes);
    for(const type in nodeMap){
        const nodes = nodeMap[type];
        if (nodes) {
            const vectorStore = vectorStores[type];
            if (!vectorStore) {
                throw new Error(`Cannot insert nodes of type ${type} without assigned vector store`);
            }
            const newIds = await vectorStore.add(nodes);
            if (nodesAdded) {
                await nodesAdded(newIds, nodes, vectorStore);
            }
        }
    }
}
/**
 * @internal
 */ class GlobalSettings {
    #prompt;
    #promptHelper;
    #nodeParser;
    #chunkOverlap;
    #promptHelperAsyncLocalStorage;
    #nodeParserAsyncLocalStorage;
    #chunkOverlapAsyncLocalStorage;
    #promptAsyncLocalStorage;
    get debug() {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Settings"].debug;
    }
    get llm() {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Settings"].llm;
    }
    set llm(llm) {
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Settings"].llm = llm;
    }
    withLLM(llm, fn) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Settings"].withLLM(llm, fn);
    }
    get promptHelper() {
        if (this.#promptHelper === null) {
            this.#promptHelper = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$indices$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PromptHelper"]();
        }
        return this.#promptHelperAsyncLocalStorage.getStore() ?? this.#promptHelper;
    }
    set promptHelper(promptHelper) {
        this.#promptHelper = promptHelper;
    }
    withPromptHelper(promptHelper, fn) {
        return this.#promptHelperAsyncLocalStorage.run(promptHelper, fn);
    }
    get embedModel() {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Settings"].embedModel;
    }
    set embedModel(embedModel) {
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Settings"].embedModel = embedModel;
    }
    withEmbedModel(embedModel, fn) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Settings"].withEmbedModel(embedModel, fn);
    }
    get nodeParser() {
        if (this.#nodeParser === null) {
            this.#nodeParser = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$node$2d$parser$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SentenceSplitter"]({
                chunkSize: this.chunkSize,
                chunkOverlap: this.chunkOverlap
            });
        }
        return this.#nodeParserAsyncLocalStorage.getStore() ?? this.#nodeParser;
    }
    set nodeParser(nodeParser) {
        this.#nodeParser = nodeParser;
    }
    withNodeParser(nodeParser, fn) {
        return this.#nodeParserAsyncLocalStorage.run(nodeParser, fn);
    }
    get callbackManager() {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Settings"].callbackManager;
    }
    set callbackManager(callbackManager) {
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Settings"].callbackManager = callbackManager;
    }
    withCallbackManager(callbackManager, fn) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Settings"].withCallbackManager(callbackManager, fn);
    }
    set chunkSize(chunkSize) {
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Settings"].chunkSize = chunkSize;
    }
    get chunkSize() {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Settings"].chunkSize;
    }
    withChunkSize(chunkSize, fn) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Settings"].withChunkSize(chunkSize, fn);
    }
    get chunkOverlap() {
        return this.#chunkOverlapAsyncLocalStorage.getStore() ?? this.#chunkOverlap;
    }
    set chunkOverlap(chunkOverlap) {
        if (typeof chunkOverlap === "number") {
            this.#chunkOverlap = chunkOverlap;
        }
    }
    withChunkOverlap(chunkOverlap, fn) {
        return this.#chunkOverlapAsyncLocalStorage.run(chunkOverlap, fn);
    }
    get prompt() {
        return this.#promptAsyncLocalStorage.getStore() ?? this.#prompt;
    }
    set prompt(prompt) {
        this.#prompt = prompt;
    }
    withPrompt(prompt, fn) {
        return this.#promptAsyncLocalStorage.run(prompt, fn);
    }
    constructor(){
        this.#prompt = {};
        this.#promptHelper = null;
        this.#nodeParser = null;
        this.#promptHelperAsyncLocalStorage = new __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$async_hooks__$5b$external$5d$__$28$node$3a$async_hooks$2c$__cjs$29$__["AsyncLocalStorage"]();
        this.#nodeParserAsyncLocalStorage = new __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$async_hooks__$5b$external$5d$__$28$node$3a$async_hooks$2c$__cjs$29$__["AsyncLocalStorage"]();
        this.#chunkOverlapAsyncLocalStorage = new __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$async_hooks__$5b$external$5d$__$28$node$3a$async_hooks$2c$__cjs$29$__["AsyncLocalStorage"]();
        this.#promptAsyncLocalStorage = new __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$async_hooks__$5b$external$5d$__$28$node$3a$async_hooks$2c$__cjs$29$__["AsyncLocalStorage"]();
    }
}
const Settings = new GlobalSettings();
const DEFAULT_NAME = "query_engine_tool";
const DEFAULT_DESCRIPTION = "Useful for running a natural language query against a knowledge base and get back a natural language response.";
const DEFAULT_PARAMETERS = {
    type: "object",
    properties: {
        query: {
            type: "string",
            description: "The query to search for"
        }
    },
    required: [
        "query"
    ]
};
class QueryEngineTool {
    constructor({ queryEngine, metadata, includeSourceNodes }){
        this.queryEngine = queryEngine;
        this.metadata = {
            name: metadata?.name ?? DEFAULT_NAME,
            description: metadata?.description ?? DEFAULT_DESCRIPTION,
            parameters: metadata?.parameters ?? DEFAULT_PARAMETERS
        };
        this.includeSourceNodes = includeSourceNodes ?? false;
    }
    async call({ query }) {
        const response = await this.queryEngine.query({
            query
        });
        if (!this.includeSourceNodes) {
            return {
                content: response.message.content
            };
        }
        return {
            content: response.message.content,
            sourceNodes: response.sourceNodes
        };
    }
}
/**
 * Indexes are the data structure that we store our nodes and embeddings in so
 * they can be retrieved for our queries.
 */ class BaseIndex {
    constructor(init){
        this.storageContext = init.storageContext;
        this.docStore = init.docStore;
        this.indexStore = init.indexStore;
        this.indexStruct = init.indexStruct;
    }
    /**
   * Returns a query tool by calling asQueryEngine.
   * Either options or retriever can be passed, but not both.
   * If options are provided, they are passed to generate a retriever.
   */ asQueryTool(params) {
        if (params.options) {
            params.retriever = this.asRetriever(params.options);
        }
        return new QueryEngineTool({
            queryEngine: this.asQueryEngine(params),
            metadata: params?.metadata,
            includeSourceNodes: params?.includeSourceNodes ?? false
        });
    }
    /**
   * Insert a document into the index.
   * @param document
   */ async insert(document) {
        const nodes = await runTransformations([
            document
        ], [
            Settings.nodeParser
        ]);
        await this.insertNodes(nodes);
        await this.docStore.setDocumentHash(document.id_, document.hash);
    }
    /**
   * Alias for asRetriever
   * @param options
   */ // eslint-disable-next-line @typescript-eslint/no-explicit-any
    retriever(options) {
        return this.asRetriever(options);
    }
    /**
   * Alias for asQueryEngine
   * @param options you can supply your own custom Retriever and ResponseSynthesizer
   */ queryEngine(options) {
        return this.asQueryEngine(options);
    }
    /**
   * Alias for asQueryTool
   * Either options or retriever can be passed, but not both.
   * If options are provided, they are passed to generate a retriever.
   */ queryTool(params) {
        return this.asQueryTool(params);
    }
}
// FS utility helpers
/**
 * Checks if a file exists.
 * Analogous to the os.path.exists function from Python.
 * @param path The path to the file to check.
 * @returns A promise that resolves to true if the file exists, false otherwise.
 */ async function exists(path) {
    try {
        await __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs$2f$promises__$5b$external$5d$__$28$node$3a$fs$2f$promises$2c$__cjs$29$__$3c$export__default__as__fs$3e$__["fs"].access(path);
        return true;
    } catch  {
        return false;
    }
}
const LEARNER_MODES = new Set([
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$vector$2d$store$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["VectorStoreQueryMode"].SVM,
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$vector$2d$store$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["VectorStoreQueryMode"].LINEAR_REGRESSION,
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$vector$2d$store$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["VectorStoreQueryMode"].LOGISTIC_REGRESSION
]);
const MMR_MODE = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$vector$2d$store$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["VectorStoreQueryMode"].MMR;
// Mapping of filter operators to metadata filter functions
const OPERATOR_TO_FILTER = {
    [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$vector$2d$store$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["FilterOperator"].EQ]: ({ key, value }, metadata)=>{
        return metadata[key] === (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$vector$2d$store$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parsePrimitiveValue"])(value);
    },
    [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$vector$2d$store$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["FilterOperator"].NE]: ({ key, value }, metadata)=>{
        return metadata[key] !== (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$vector$2d$store$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parsePrimitiveValue"])(value);
    },
    [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$vector$2d$store$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["FilterOperator"].IN]: ({ key, value }, metadata)=>{
        return !!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$vector$2d$store$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parseArrayValue"])(value).find((v)=>metadata[key] === v);
    },
    [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$vector$2d$store$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["FilterOperator"].NIN]: ({ key, value }, metadata)=>{
        return !(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$vector$2d$store$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parseArrayValue"])(value).find((v)=>metadata[key] === v);
    },
    [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$vector$2d$store$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["FilterOperator"].ANY]: ({ key, value }, metadata)=>{
        if (!Array.isArray(metadata[key])) return false;
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$vector$2d$store$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parseArrayValue"])(value).some((v)=>metadata[key].includes(v));
    },
    [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$vector$2d$store$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["FilterOperator"].ALL]: ({ key, value }, metadata)=>{
        if (!Array.isArray(metadata[key])) return false;
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$vector$2d$store$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parseArrayValue"])(value).every((v)=>metadata[key].includes(v));
    },
    [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$vector$2d$store$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["FilterOperator"].TEXT_MATCH]: ({ key, value }, metadata)=>{
        return metadata[key].includes((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$vector$2d$store$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parsePrimitiveValue"])(value));
    },
    [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$vector$2d$store$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["FilterOperator"].CONTAINS]: ({ key, value }, metadata)=>{
        if (!Array.isArray(metadata[key])) return false;
        return !!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$vector$2d$store$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parseArrayValue"])(metadata[key]).find((v)=>v === value);
    },
    [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$vector$2d$store$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["FilterOperator"].GT]: ({ key, value }, metadata)=>{
        return metadata[key] > (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$vector$2d$store$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parsePrimitiveValue"])(value);
    },
    [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$vector$2d$store$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["FilterOperator"].LT]: ({ key, value }, metadata)=>{
        return metadata[key] < (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$vector$2d$store$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parsePrimitiveValue"])(value);
    },
    [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$vector$2d$store$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["FilterOperator"].GTE]: ({ key, value }, metadata)=>{
        return metadata[key] >= (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$vector$2d$store$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parsePrimitiveValue"])(value);
    },
    [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$vector$2d$store$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["FilterOperator"].LTE]: ({ key, value }, metadata)=>{
        return metadata[key] <= (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$vector$2d$store$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parsePrimitiveValue"])(value);
    }
};
// Build a filter function based on the metadata and the preFilters
const buildFilterFn = (metadata, preFilters)=>{
    if (!preFilters) return true;
    if (!metadata) return false;
    const { filters, condition } = preFilters;
    const queryCondition = condition || "and"; // default to and
    const itemFilterFn = (filter)=>{
        if (filter.operator === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$vector$2d$store$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["FilterOperator"].IS_EMPTY) {
            // for `is_empty` operator, return true if the metadata key is not present or the value is empty
            const value = metadata[filter.key];
            return value === undefined || value === null || value === "" || Array.isArray(value) && value.length === 0;
        }
        if (metadata[filter.key] === undefined) {
            // for other operators, always return false if the metadata key is not present
            return false;
        }
        const metadataLookupFn = OPERATOR_TO_FILTER[filter.operator];
        if (!metadataLookupFn) throw new Error(`Unsupported operator: ${filter.operator}`);
        return metadataLookupFn(filter, metadata);
    };
    if (queryCondition === "and") return filters.every(itemFilterFn);
    return filters.some(itemFilterFn);
};
class SimpleVectorStoreData {
    constructor(){
        this.embeddingDict = {};
        this.textIdToRefDocId = {};
        this.metadataDict = {};
    }
}
class SimpleVectorStore extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$vector$2d$store$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BaseVectorStore"] {
    constructor(init){
        super(init), this.storesText = false;
        this.data = init?.data || new SimpleVectorStoreData();
    }
    static async fromPersistDir(persistDir = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DEFAULT_PERSIST_DIR"], embedModel) {
        const persistPath = __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__$3c$export__default__as__path$3e$__["path"].join(persistDir, "vector_store.json");
        return await SimpleVectorStore.fromPersistPath(persistPath, embedModel);
    }
    client() {
        return null;
    }
    async get(textId) {
        return this.data.embeddingDict[textId];
    }
    async add(embeddingResults) {
        for (const node of embeddingResults){
            this.data.embeddingDict[node.id_] = node.getEmbedding();
            if (!node.sourceNode) {
                continue;
            }
            this.data.textIdToRefDocId[node.id_] = node.sourceNode?.nodeId;
            // Add metadata to the metadataDict
            const metadata = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$vector$2d$store$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["nodeToMetadata"])(node, true, undefined, false);
            delete metadata["_node_content"];
            this.data.metadataDict[node.id_] = metadata;
        }
        if (this.persistPath) {
            await this.persist(this.persistPath);
        }
        return embeddingResults.map((result)=>result.id_);
    }
    async delete(refDocId) {
        const textIdsToDelete = Object.keys(this.data.textIdToRefDocId).filter((textId)=>this.data.textIdToRefDocId[textId] === refDocId);
        for (const textId of textIdsToDelete){
            delete this.data.embeddingDict[textId];
            delete this.data.textIdToRefDocId[textId];
            if (this.data.metadataDict) delete this.data.metadataDict[textId];
        }
        if (this.persistPath) {
            await this.persist(this.persistPath);
        }
        return Promise.resolve();
    }
    async filterNodes(query) {
        const items = Object.entries(this.data.embeddingDict);
        const queryFilterFn = (nodeId)=>{
            const metadata = this.data.metadataDict[nodeId];
            return buildFilterFn(metadata, query.filters);
        };
        const nodeFilterFn = (nodeId)=>{
            if (!query.docIds) return true;
            const availableIds = new Set(query.docIds);
            return availableIds.has(nodeId);
        };
        const queriedItems = items.filter((item)=>nodeFilterFn(item[0]) && queryFilterFn(item[0]));
        const nodeIds = queriedItems.map((item)=>item[0]);
        const embeddings = queriedItems.map((item)=>item[1]);
        return {
            nodeIds,
            embeddings
        };
    }
    async query(query) {
        const { nodeIds, embeddings } = await this.filterNodes(query);
        const queryEmbedding = query.queryEmbedding;
        let topSimilarities, topIds;
        if (LEARNER_MODES.has(query.mode)) {
            // fixme: unfinished
            throw new Error("Learner modes not implemented for SimpleVectorStore yet.");
        } else if (query.mode === MMR_MODE) {
            const mmrThreshold = query.mmrThreshold;
            [topSimilarities, topIds] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$embeddings$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getTopKMMREmbeddings"])(queryEmbedding, embeddings, null, query.similarityTopK, nodeIds, mmrThreshold);
        } else if (query.mode === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$vector$2d$store$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["VectorStoreQueryMode"].DEFAULT) {
            [topSimilarities, topIds] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$embeddings$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getTopKEmbeddings"])(queryEmbedding, embeddings, query.similarityTopK, nodeIds);
        } else {
            throw new Error(`Invalid query mode: ${query.mode}`);
        }
        return Promise.resolve({
            similarities: topSimilarities,
            ids: topIds
        });
    }
    async persist(persistPath = __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__$3c$export__default__as__path$3e$__["path"].join(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DEFAULT_PERSIST_DIR"], "vector_store.json")) {
        await SimpleVectorStore.persistData(persistPath, this.data);
    }
    static async persistData(persistPath, data) {
        const dirPath = __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__$3c$export__default__as__path$3e$__["path"].dirname(persistPath);
        if (!await exists(dirPath)) {
            await __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs$2f$promises__$5b$external$5d$__$28$node$3a$fs$2f$promises$2c$__cjs$29$__$3c$export__default__as__fs$3e$__["fs"].mkdir(dirPath);
        }
        await __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs$2f$promises__$5b$external$5d$__$28$node$3a$fs$2f$promises$2c$__cjs$29$__$3c$export__default__as__fs$3e$__["fs"].writeFile(persistPath, JSON.stringify(data));
    }
    static async fromPersistPath(persistPath, embeddingModel) {
        const dirPath = __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__$3c$export__default__as__path$3e$__["path"].dirname(persistPath);
        if (!await exists(dirPath)) {
            await __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs$2f$promises__$5b$external$5d$__$28$node$3a$fs$2f$promises$2c$__cjs$29$__$3c$export__default__as__fs$3e$__["fs"].mkdir(dirPath, {
                recursive: true
            });
        }
        let dataDict = {};
        if (!await exists(persistPath)) {
            console.info(`Starting new store from path: ${persistPath}`);
        } else {
            try {
                const fileData = await __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs$2f$promises__$5b$external$5d$__$28$node$3a$fs$2f$promises$2c$__cjs$29$__$3c$export__default__as__fs$3e$__["fs"].readFile(persistPath);
                dataDict = JSON.parse(fileData.toString());
            } catch (e) {
                throw new Error(`Failed to load data from path: ${persistPath}`, {
                    cause: e
                });
            }
        }
        const data = new SimpleVectorStoreData();
        // @ts-expect-error TS2322
        data.embeddingDict = dataDict.embeddingDict ?? {};
        // @ts-expect-error TS2322
        data.textIdToRefDocId = dataDict.textIdToRefDocId ?? {};
        // @ts-expect-error TS2322
        data.metadataDict = dataDict.metadataDict ?? {};
        const store = new SimpleVectorStore({
            data,
            embeddingModel
        });
        store.persistPath = persistPath;
        return store;
    }
    static fromDict(saveDict, embeddingModel) {
        const data = new SimpleVectorStoreData();
        data.embeddingDict = saveDict.embeddingDict;
        data.textIdToRefDocId = saveDict.textIdToRefDocId;
        data.metadataDict = saveDict.metadataDict;
        return new SimpleVectorStore({
            data,
            embeddingModel
        });
    }
    toDict() {
        return {
            embeddingDict: this.data.embeddingDict,
            textIdToRefDocId: this.data.textIdToRefDocId,
            metadataDict: this.data.metadataDict
        };
    }
}
class SimpleDocumentStore extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$storage$2f$doc$2d$store$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["KVDocumentStore"] {
    constructor(kvStore, namespace){
        kvStore = kvStore || new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$storage$2f$kv$2d$store$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SimpleKVStore"]();
        namespace = namespace || __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DEFAULT_NAMESPACE"];
        super(kvStore, namespace);
        this.kvStore = kvStore;
    }
    static async fromPersistDir(persistDir = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DEFAULT_PERSIST_DIR"], namespace) {
        const persistPath = __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__$3c$export__default__as__path$3e$__["path"].join(persistDir, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DEFAULT_DOC_STORE_PERSIST_FILENAME"]);
        return await SimpleDocumentStore.fromPersistPath(persistPath, namespace);
    }
    static async fromPersistPath(persistPath, namespace) {
        const simpleKVStore = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$storage$2f$kv$2d$store$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SimpleKVStore"].fromPersistPath(persistPath);
        return new SimpleDocumentStore(simpleKVStore, namespace);
    }
    async persist(persistPath = __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__$3c$export__default__as__path$3e$__["path"].join(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DEFAULT_PERSIST_DIR"], __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DEFAULT_DOC_STORE_PERSIST_FILENAME"])) {
        if (__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lodash$40$4$2e$17$2e$21$2f$node_modules$2f$lodash$2f$lodash$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].isObject(this.kvStore) && this.kvStore instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$storage$2f$kv$2d$store$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BaseInMemoryKVStore"]) {
            await this.kvStore.persist(persistPath);
        }
    }
    static fromDict(saveDict, namespace) {
        const simpleKVStore = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$storage$2f$kv$2d$store$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SimpleKVStore"].fromDict(saveDict);
        return new SimpleDocumentStore(simpleKVStore, namespace);
    }
    toDict() {
        if (__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lodash$40$4$2e$17$2e$21$2f$node_modules$2f$lodash$2f$lodash$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].isObject(this.kvStore) && this.kvStore instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$storage$2f$kv$2d$store$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SimpleKVStore"]) {
            return this.kvStore.toDict();
        }
        // If the kvstore is not a SimpleKVStore, you might want to throw an error or return a default value.
        throw new Error("KVStore is not a SimpleKVStore");
    }
}
async function storageContextFromDefaults({ docStore, indexStore, vectorStore, vectorStores, persistDir }) {
    vectorStores = vectorStores ?? {};
    if (!persistDir) {
        docStore = docStore ?? new SimpleDocumentStore();
        indexStore = indexStore ?? new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$storage$2f$index$2d$store$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SimpleIndexStore"]();
        if (!(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$schema$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ModalityType"].TEXT in vectorStores)) {
            vectorStores[__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$schema$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ModalityType"].TEXT] = vectorStore ?? new SimpleVectorStore();
        }
    } else {
        const embedModel = Settings.embedModel;
        docStore = docStore || await SimpleDocumentStore.fromPersistDir(persistDir, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DEFAULT_NAMESPACE"]);
        indexStore = indexStore || await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$storage$2f$index$2d$store$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SimpleIndexStore"].fromPersistDir(persistDir);
        if (!(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$schema$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ObjectType"].TEXT in vectorStores)) {
            vectorStores[__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$schema$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ModalityType"].TEXT] = vectorStore ?? await SimpleVectorStore.fromPersistDir(persistDir, embedModel);
        }
    }
    return {
        docStore,
        indexStore,
        vectorStores
    };
}
// generate from "tsup ./src/index.js --format esm"
var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod)=>function __require() {
        return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = {
            exports: {}
        }).exports, mod), mod.exports;
    };
// src/stopwords.js
var require_stopwords = __commonJS({
    "src/stopwords.js" (exports, module) {
        module.exports = {
            stopwords: [
                "a",
                "about",
                "above",
                "across",
                "after",
                "again",
                "against",
                "all",
                "almost",
                "alone",
                "along",
                "already",
                "also",
                "although",
                "always",
                "among",
                "an",
                "and",
                "another",
                "any",
                "anybody",
                "anyone",
                "anything",
                "anywhere",
                "are",
                "area",
                "areas",
                "around",
                "as",
                "ask",
                "asked",
                "asking",
                "asks",
                "at",
                "away",
                "b",
                "back",
                "backed",
                "backing",
                "backs",
                "be",
                "because",
                "become",
                "becomes",
                "became",
                "been",
                "before",
                "began",
                "behind",
                "being",
                "beings",
                "best",
                "better",
                "between",
                "big",
                "both",
                "but",
                "by",
                "c",
                "came",
                "can",
                "cannot",
                "case",
                "cases",
                "certain",
                "certainly",
                "clear",
                "clearly",
                "come",
                "contains",
                "could",
                "d",
                "did",
                "differ",
                "different",
                "differently",
                "do",
                "does",
                "done",
                "down",
                "downed",
                "downing",
                "downs",
                "during",
                "e",
                "each",
                "early",
                "either",
                "end",
                "ended",
                "ending",
                "ends",
                "enough",
                "even",
                "evenly",
                "ever",
                "every",
                "everybody",
                "everyone",
                "everything",
                "everywhere",
                "f",
                "face",
                "faces",
                "fact",
                "facts",
                "far",
                "felt",
                "few",
                "find",
                "finds",
                "first",
                "for",
                "four",
                "from",
                "full",
                "fully",
                "further",
                "furthered",
                "furthering",
                "furthers",
                "g",
                "gave",
                "general",
                "generally",
                "get",
                "gets",
                "give",
                "given",
                "gives",
                "go",
                "going",
                "good",
                "goods",
                "got",
                "great",
                "greater",
                "greatest",
                "group",
                "grouped",
                "grouping",
                "groups",
                "h",
                "had",
                "has",
                "have",
                "having",
                "he",
                "her",
                "herself",
                "here",
                "high",
                "higher",
                "highest",
                "him",
                "himself",
                "his",
                "how",
                "however",
                "i",
                "if",
                "important",
                "in",
                "interest",
                "interested",
                "interesting",
                "interests",
                "into",
                "is",
                "it",
                "its",
                "itself",
                "j",
                "just",
                "k",
                "keep",
                "keeps",
                "kind",
                "knew",
                "know",
                "known",
                "knows",
                "l",
                "large",
                "largely",
                "last",
                "later",
                "latest",
                "least",
                "less",
                "let",
                "lets",
                "like",
                "likely",
                "long",
                "longer",
                "longest",
                "m",
                "made",
                "make",
                "making",
                "man",
                "many",
                "may",
                "me",
                "member",
                "members",
                "men",
                "might",
                "more",
                "most",
                "mostly",
                "mr",
                "mrs",
                "much",
                "must",
                "my",
                "myself",
                "n",
                "necessary",
                "need",
                "needed",
                "needing",
                "needs",
                "never",
                "new",
                "newer",
                "newest",
                "next",
                "no",
                "non",
                "not",
                "nobody",
                "noone",
                "nothing",
                "now",
                "nowhere",
                "number",
                "numbers",
                "o",
                "of",
                "off",
                "often",
                "old",
                "older",
                "oldest",
                "on",
                "once",
                "one",
                "only",
                "open",
                "opened",
                "opening",
                "opens",
                "or",
                "order",
                "ordered",
                "ordering",
                "orders",
                "other",
                "others",
                "our",
                "out",
                "over",
                "p",
                "part",
                "parted",
                "parting",
                "parts",
                "per",
                "perhaps",
                "place",
                "places",
                "point",
                "pointed",
                "pointing",
                "points",
                "possible",
                "present",
                "presented",
                "presenting",
                "presents",
                "problem",
                "problems",
                "put",
                "puts",
                "q",
                "quite",
                "r",
                "rather",
                "really",
                "right",
                "room",
                "rooms",
                "s",
                "said",
                "same",
                "saw",
                "say",
                "says",
                "second",
                "seconds",
                "see",
                "sees",
                "seem",
                "seemed",
                "seeming",
                "seems",
                "several",
                "shall",
                "she",
                "should",
                "show",
                "showed",
                "showing",
                "shows",
                "side",
                "sides",
                "since",
                "small",
                "smaller",
                "smallest",
                "so",
                "some",
                "somebody",
                "someone",
                "something",
                "somewhere",
                "state",
                "states",
                "still",
                "such",
                "sure",
                "t",
                "take",
                "taken",
                "than",
                "that",
                "the",
                "their",
                "them",
                "then",
                "there",
                "therefore",
                "these",
                "they",
                "thing",
                "things",
                "think",
                "thinks",
                "this",
                "those",
                "though",
                "thought",
                "thoughts",
                "three",
                "through",
                "thus",
                "to",
                "today",
                "together",
                "too",
                "took",
                "toward",
                "turn",
                "turned",
                "turning",
                "turns",
                "two",
                "u",
                "under",
                "until",
                "up",
                "upon",
                "us",
                "use",
                "uses",
                "used",
                "v",
                "very",
                "w",
                "want",
                "wanted",
                "wanting",
                "wants",
                "was",
                "way",
                "ways",
                "we",
                "well",
                "wells",
                "went",
                "were",
                "what",
                "when",
                "where",
                "whether",
                "which",
                "while",
                "who",
                "whole",
                "whose",
                "why",
                "will",
                "with",
                "within",
                "without",
                "work",
                "worked",
                "working",
                "works",
                "would",
                "y",
                "year",
                "years",
                "yet",
                "you",
                "young",
                "younger",
                "youngest",
                "your",
                "yours",
                "eoc",
                "mu",
                "sigma",
                "mu sigma",
                "musigma",
                "client",
                "clients",
                "capabilities",
                "capability",
                "firm",
                "firms",
                "biggest",
                "-"
            ]
        };
    }
});
const { fromPairs, sortBy, toPairs } = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lodash$40$4$2e$17$2e$21$2f$node_modules$2f$lodash$2f$lodash$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"];
var stopwords = require_stopwords();
function isNumber(str) {
    return /\d/.test(str);
}
function isAcceptable(phrase, minCharLength, maxWordsLength) {
    if (phrase < minCharLength) {
        return false;
    }
    let words = phrase.split(" ");
    if (words.length > maxWordsLength) {
        return false;
    }
    let digits = 0;
    let alpha = 0;
    for(let i = 0; i < phrase.length; i++){
        if (/\d/.test(phrase[i])) digits += 1;
        if (/[a-zA-Z]/.test(phrase[i])) alpha += 1;
    }
    if (alpha == 0) {
        return false;
    }
    if (digits > alpha) {
        return false;
    }
    return true;
}
function countOccurances(haystack, needle) {
    return haystack.reduce((n, value)=>{
        return n + (value === needle);
    }, 0);
}
function generateCandidateKeywordScores(phraseList, wordScore, minKeywordFrequency = 1) {
    let keywordCandidates = {};
    phraseList.forEach((phrase)=>{
        if (minKeywordFrequency > 1) {
            if (countOccurances(phraseList, phrase) < minKeywordFrequency) {
                return;
            }
        }
        phrase in keywordCandidates || (keywordCandidates[phrase] = 0);
        let wordList = separateWords(phrase, 0);
        let candidateScore = 0;
        wordList.forEach((word)=>{
            candidateScore += wordScore[word];
            keywordCandidates[phrase] = candidateScore;
        });
    });
    return keywordCandidates;
}
function separateWords(text, minWordReturnSize) {
    let wordDelimiters = /[^a-zA-Z0-9_\+\-/]/;
    let words = [];
    text.split(wordDelimiters).forEach((singleWord)=>{
        let currentWord = singleWord.trim().toLowerCase();
        if (currentWord.length > minWordReturnSize && currentWord != "" && !isNumber(currentWord)) {
            words.push(currentWord);
        }
    });
    return words;
}
function calculateWordScores(phraseList) {
    let wordFrequency = {};
    let wordDegree = {};
    phraseList.forEach((phrase)=>{
        let wordList = separateWords(phrase, 0);
        let wordListLength = wordList.length;
        let wordListDegree = wordListLength - 1;
        wordList.forEach((word)=>{
            word in wordFrequency || (wordFrequency[word] = 0);
            wordFrequency[word] += 1;
            word in wordDegree || (wordDegree[word] = 0);
            wordDegree[word] += wordListDegree;
        });
    });
    Object.keys(wordFrequency).forEach((item)=>{
        wordDegree[item] = wordDegree[item] + wordFrequency[item];
    });
    let wordScore = {};
    Object.keys(wordFrequency).forEach((item)=>{
        item in wordScore || (wordScore[item] = 0);
        wordScore[item] = wordDegree[item] / (wordFrequency[item] * 1);
    });
    return wordScore;
}
function generateCandidateKeywords(sentenceList, stopWordPattern, minCharLength = 1, maxWordsLength = 5) {
    let phraseList = [];
    sentenceList.forEach((sentence)=>{
        let tmp = stopWordPattern[Symbol.replace](sentence, "|");
        let phrases = tmp.split("|");
        phrases.forEach((ph)=>{
            let phrase = ph.trim().toLowerCase();
            if (phrase != "" && isAcceptable(phrase, minCharLength, maxWordsLength)) {
                phraseList.push(phrase);
            }
        });
    });
    return phraseList;
}
function buildStopWordRegex(path) {
    let stopWordList = loadStopWords();
    let stopWordRegexList = [];
    stopWordList.forEach((word)=>{
        if (/\w+/.test(word)) {
            let wordRegex = `\\b${word}\\b`;
            stopWordRegexList.push(wordRegex);
        }
    });
    let stopWordPattern = new RegExp(stopWordRegexList.join("|"), "ig");
    return stopWordPattern;
}
function splitSentences(text) {
    let sentenceDelimiters = /[\[\]\n.!?,;:\t\\-\\"\\(\\)\\\'\u2019\u2013]/;
    return text.split(sentenceDelimiters);
}
function loadStopWords(path) {
    let contents = stopwords.stopwords;
    return contents;
}
function rake(text, stopWordsPath, minCharLength = 3, maxWordsLength = 5, minKeywordFrequency = 1) {
    let stopWordPattern = buildStopWordRegex();
    let sentenceList = splitSentences(text);
    let phraseList = generateCandidateKeywords(sentenceList, stopWordPattern, minCharLength, maxWordsLength);
    let wordScores = calculateWordScores(phraseList);
    let keywordCandidates = generateCandidateKeywordScores(phraseList, wordScores, minKeywordFrequency);
    let sortedKeywords = fromPairs(sortBy(toPairs(keywordCandidates), (pair)=>pair[1]).reverse());
    return sortedKeywords;
}
// Get subtokens from a list of tokens., filtering for stopwords.
function expandTokensWithSubtokens(tokens) {
    const results = new Set();
    const regex = /\w+/g;
    for (const token of tokens){
        results.add(token);
        const subTokens = token.match(regex);
        if (subTokens && subTokens.length > 1) {
            for (const w of subTokens){
                results.add(w);
            }
        }
    }
    return results;
}
function extractKeywordsGivenResponse(response, startToken = "", lowercase = true) {
    const results = [];
    response = response.trim();
    if (response.startsWith(startToken)) {
        response = response.substring(startToken.length);
    }
    const keywords = response.split(",");
    for (const k of keywords){
        let rk = k;
        if (lowercase) {
            rk = rk.toLowerCase();
        }
        results.push(rk.trim());
    }
    return expandTokensWithSubtokens(new Set(results));
}
function simpleExtractKeywords(textChunk, maxKeywords) {
    const regex = /\w+/g;
    const tokens = [
        ...textChunk.matchAll(regex)
    ].map((token)=>token[0].toLowerCase().trim());
    // Creating a frequency map
    const valueCounts = {};
    for (const token of tokens){
        valueCounts[token] = (valueCounts[token] || 0) + 1;
    }
    // Sorting tokens by frequency
    const sortedTokens = Object.keys(valueCounts).sort((a, b)=>valueCounts[b] - valueCounts[a]);
    const keywords = maxKeywords ? sortedTokens.slice(0, maxKeywords) : sortedTokens;
    return new Set(keywords);
}
function rakeExtractKeywords(textChunk, maxKeywords) {
    const keywords = Object.keys(rake(textChunk));
    const limitedKeywords = maxKeywords ? keywords.slice(0, maxKeywords) : keywords;
    return new Set(limitedKeywords);
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
 * CondenseQuestionChatEngine is used in conjunction with a Index (for example VectorStoreIndex).
 * It does two steps on taking a user's chat message: first, it condenses the chat message
 * with the previous chat history into a question with more context.
 * Then, it queries the underlying Index using the new question with context and returns
 * the response.
 * CondenseQuestionChatEngine performs well when the input is primarily questions about the
 * underlying data. It performs less well when the chat messages are not questions about the
 * data, or are very referential to previous context.
 */ class CondenseQuestionChatEngine extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$chat$2d$engine$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BaseChatEngine"] {
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
        super(), _initProto(this);
        this.queryEngine = init.queryEngine;
        this.memory = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$memory$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createMemory"])(init.chatHistory);
        this.llm = Settings.llm;
        this.condenseMessagePrompt = init?.condenseMessagePrompt ?? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$prompts$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["defaultCondenseQuestionPrompt"];
    }
    _getPromptModules() {
        return {};
    }
    _getPrompts() {
        return {
            condenseMessagePrompt: this.condenseMessagePrompt
        };
    }
    _updatePrompts(promptsDict) {
        if (promptsDict.condenseMessagePrompt) {
            this.condenseMessagePrompt = promptsDict.condenseMessagePrompt;
        }
    }
    async condenseQuestion(chatHistory, question) {
        const chatHistoryStr = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$utils$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["messagesToHistory"])(await chatHistory.getLLM());
        return this.llm.complete({
            prompt: this.condenseMessagePrompt.format({
                question: question,
                chatHistory: chatHistoryStr
            })
        });
    }
    async chat(params) {
        const { message, stream } = params;
        const chatHistory = params.chatHistory ? params.chatHistory instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$memory$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Memory"] ? params.chatHistory : (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$memory$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createMemory"])(params.chatHistory) : this.memory;
        const condensedQuestion = (await this.condenseQuestion(chatHistory, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$utils$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["extractText"])(message))).text;
        await chatHistory.add({
            content: message,
            role: "user"
        });
        if (stream) {
            const stream = await this.queryEngine.query({
                query: condensedQuestion,
                stream: true
            });
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$utils$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["streamReducer"])({
                stream,
                initialValue: "",
                reducer: (accumulator, part)=>accumulator += (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$utils$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["extractText"])(part.message.content),
                finished: (accumulator)=>{
                    void chatHistory.add({
                        content: accumulator,
                        role: "assistant"
                    });
                }
            });
        }
        const response = await this.queryEngine.query({
            query: condensedQuestion
        });
        await chatHistory.add({
            content: response.message.content,
            role: "assistant"
        });
        return response;
    }
    reset() {
        void this.memory.clear();
    }
}
var KeywordTableRetrieverMode = /*#__PURE__*/ function(KeywordTableRetrieverMode) {
    KeywordTableRetrieverMode["DEFAULT"] = "DEFAULT";
    KeywordTableRetrieverMode["SIMPLE"] = "SIMPLE";
    KeywordTableRetrieverMode["RAKE"] = "RAKE";
    return KeywordTableRetrieverMode;
}({});
// Base Keyword Table Retriever
class BaseKeywordTableRetriever extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$retriever$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BaseRetriever"] {
    constructor({ index, keywordExtractTemplate, queryKeywordExtractTemplate, maxKeywordsPerQuery = 10, numChunksPerQuery = 10 }){
        super();
        this.index = index;
        this.indexStruct = index.indexStruct;
        this.docstore = index.docStore;
        this.llm = Settings.llm;
        this.maxKeywordsPerQuery = maxKeywordsPerQuery;
        this.numChunksPerQuery = numChunksPerQuery;
        this.keywordExtractTemplate = keywordExtractTemplate || __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$prompts$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["defaultKeywordExtractPrompt"];
        this.queryKeywordExtractTemplate = queryKeywordExtractTemplate || __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$prompts$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["defaultQueryKeywordExtractPrompt"];
    }
    async _retrieve(query) {
        const keywords = await this.getKeywords((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$utils$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["extractText"])(query));
        const chunkIndicesCount = {};
        const filteredKeywords = keywords.filter((keyword)=>this.indexStruct.table.has(keyword));
        for (const keyword of filteredKeywords){
            for (const nodeId of this.indexStruct.table.get(keyword) || []){
                chunkIndicesCount[nodeId] = (chunkIndicesCount[nodeId] ?? 0) + 1;
            }
        }
        const sortedChunkIndices = Object.keys(chunkIndicesCount).sort((a, b)=>chunkIndicesCount[b] - chunkIndicesCount[a]).slice(0, this.numChunksPerQuery);
        const sortedNodes = await this.docstore.getNodes(sortedChunkIndices);
        return sortedNodes.map((node)=>({
                node
            }));
    }
}
// Extracts keywords using LLMs.
class KeywordTableLLMRetriever extends BaseKeywordTableRetriever {
    async getKeywords(query) {
        const response = await this.llm.complete({
            prompt: this.queryKeywordExtractTemplate.format({
                question: query,
                maxKeywords: `${this.maxKeywordsPerQuery}`
            })
        });
        const keywords = extractKeywordsGivenResponse(response.text, "KEYWORDS:");
        return [
            ...keywords
        ];
    }
}
// Extracts keywords using simple regex-based keyword extractor.
class KeywordTableSimpleRetriever extends BaseKeywordTableRetriever {
    getKeywords(query) {
        return Promise.resolve([
            ...simpleExtractKeywords(query, this.maxKeywordsPerQuery)
        ]);
    }
}
// Extracts keywords using RAKE keyword extractor
class KeywordTableRAKERetriever extends BaseKeywordTableRetriever {
    getKeywords(query) {
        return Promise.resolve([
            ...rakeExtractKeywords(query, this.maxKeywordsPerQuery)
        ]);
    }
}
const KeywordTableRetrieverMap = {
    ["DEFAULT"]: KeywordTableLLMRetriever,
    ["SIMPLE"]: KeywordTableSimpleRetriever,
    ["RAKE"]: KeywordTableRAKERetriever
};
/**
 * The KeywordTableIndex, an index that extracts keywords from each Node and builds a mapping from each keyword to the corresponding Nodes of that keyword.
 */ class KeywordTableIndex extends BaseIndex {
    constructor(init){
        super(init);
    }
    static async init(options) {
        const storageContext = options.storageContext ?? await storageContextFromDefaults({});
        const { docStore, indexStore } = storageContext;
        // Setup IndexStruct from storage
        const indexStructs = await indexStore.getIndexStructs();
        let indexStruct;
        if (options.indexStruct && indexStructs.length > 0) {
            throw new Error("Cannot initialize index with both indexStruct and indexStore");
        }
        if (options.indexStruct) {
            indexStruct = options.indexStruct;
        } else if (indexStructs.length == 1) {
            indexStruct = indexStructs[0];
        } else if (indexStructs.length > 1 && options.indexId) {
            indexStruct = await indexStore.getIndexStruct(options.indexId);
        } else {
            indexStruct = null;
        }
        // check indexStruct type
        if (indexStruct && indexStruct.type !== __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$data$2d$structs$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["IndexStructType"].KEYWORD_TABLE) {
            throw new Error("Attempting to initialize KeywordTableIndex with non-keyword table indexStruct");
        }
        if (indexStruct) {
            if (options.nodes) {
                throw new Error("Cannot initialize KeywordTableIndex with both nodes and indexStruct");
            }
        } else {
            if (!options.nodes) {
                throw new Error("Cannot initialize KeywordTableIndex without nodes or indexStruct");
            }
            indexStruct = await KeywordTableIndex.buildIndexFromNodes(options.nodes, storageContext.docStore);
            await indexStore.addIndexStruct(indexStruct);
        }
        return new KeywordTableIndex({
            storageContext,
            docStore,
            indexStore,
            indexStruct
        });
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    asRetriever(options) {
        const { mode = "DEFAULT", ...otherOptions } = options ?? {};
        const KeywordTableRetriever = KeywordTableRetrieverMap[mode];
        if (KeywordTableRetriever) {
            return new KeywordTableRetriever({
                index: this,
                ...otherOptions
            });
        }
        throw new Error(`Unknown retriever mode: ${mode}`);
    }
    asQueryEngine(options) {
        const { retriever, responseSynthesizer } = options ?? {};
        return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$query$2d$engine$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["RetrieverQueryEngine"](retriever ?? this.asRetriever(), responseSynthesizer, options?.nodePostprocessors);
    }
    asChatEngine(options) {
        const { retriever, ...contextChatEngineOptions } = options ?? {};
        return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$chat$2d$engine$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ContextChatEngine"]({
            retriever: retriever ?? this.asRetriever(),
            ...contextChatEngineOptions
        });
    }
    static async extractKeywords(text) {
        const llm = Settings.llm;
        const response = await llm.complete({
            prompt: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$prompts$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["defaultKeywordExtractPrompt"].format({
                context: text
            })
        });
        return extractKeywordsGivenResponse(response.text, "KEYWORDS:");
    }
    /**
   * High level API: split documents, get keywords, and build index.
   * @param documents
   * @param args
   * @param args.storageContext
   * @returns
   */ static async fromDocuments(documents, args = {}) {
        let { storageContext } = args;
        storageContext = storageContext ?? await storageContextFromDefaults({});
        const docStore = storageContext.docStore;
        await docStore.addDocuments(documents, true);
        for (const doc of documents){
            await docStore.setDocumentHash(doc.id_, doc.hash);
        }
        const nodes = await Settings.nodeParser.getNodesFromDocuments(documents);
        const index = await KeywordTableIndex.init({
            nodes,
            storageContext
        });
        return index;
    }
    /**
   * Get keywords for nodes and place them into the index.
   * @param nodes
   * @param docStore
   * @returns
   */ static async buildIndexFromNodes(nodes, docStore) {
        const indexStruct = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$data$2d$structs$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["KeywordTable"]();
        await docStore.addDocuments(nodes, true);
        for (const node of nodes){
            const keywords = await KeywordTableIndex.extractKeywords(node.getContent(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$schema$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["MetadataMode"].LLM));
            indexStruct.addNode([
                ...keywords
            ], node.id_);
        }
        return indexStruct;
    }
    async insertNodes(nodes) {
        for (const node of nodes){
            const keywords = await KeywordTableIndex.extractKeywords(node.getContent(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$schema$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["MetadataMode"].LLM));
            this.indexStruct.addNode([
                ...keywords
            ], node.id_);
        }
    }
    deleteNode(nodeId) {
        const keywordsToDelete = new Set();
        for (const [keyword, existingNodeIds] of Object.entries(this.indexStruct.table)){
            const index = existingNodeIds.indexOf(nodeId);
            if (index !== -1) {
                existingNodeIds.splice(index, 1);
                // Delete keywords that have zero nodes
                if (existingNodeIds.length === 0) {
                    keywordsToDelete.add(keyword);
                }
            }
        }
        this.indexStruct.deleteNode([
            ...keywordsToDelete
        ], nodeId);
    }
    async deleteNodes(nodeIds, deleteFromDocStore) {
        nodeIds.forEach((nodeId)=>{
            this.deleteNode(nodeId);
        });
        if (deleteFromDocStore) {
            for (const nodeId of nodeIds){
                await this.docStore.deleteDocument(nodeId, false);
            }
        }
        await this.storageContext.indexStore.addIndexStruct(this.indexStruct);
    }
    async deleteRefDoc(refDocId, deleteFromDocStore) {
        const refDocInfo = await this.docStore.getRefDocInfo(refDocId);
        if (!refDocInfo) {
            return;
        }
        await this.deleteNodes(refDocInfo.nodeIds, false);
        if (deleteFromDocStore) {
            await this.docStore.deleteRefDoc(refDocId, false);
        }
        return;
    }
}
const defaultFormatNodeBatchFn = (summaryNodes)=>{
    return summaryNodes.map((node, idx)=>{
        return `
Document ${idx + 1}:
${node.getContent(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$schema$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["MetadataMode"].LLM)}
        `.trim();
    }).join("\n\n");
};
const defaultParseChoiceSelectAnswerFn = (answer, numChoices, raiseErr = false)=>{
    // split the line into the answer number and relevance score portions
    const lineTokens = answer.split("\n").map((line)=>{
        const lineTokens = line.split(",");
        if (lineTokens.length !== 2) {
            if (raiseErr) {
                throw new Error(`Invalid answer line: ${line}. Answer line must be of the form: answer_num: <int>, answer_relevance: <float>`);
            } else {
                return null;
            }
        }
        return lineTokens;
    }).filter((lineTokens)=>!__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lodash$40$4$2e$17$2e$21$2f$node_modules$2f$lodash$2f$lodash$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].isNil(lineTokens));
    // parse the answer number and relevance score
    return lineTokens.reduce((parseResult, lineToken)=>{
        try {
            const docNum = parseInt(lineToken[0].split(":")[1].trim());
            const answerRelevance = parseFloat(lineToken[1].split(":")[1].trim());
            if (docNum < 1 || docNum > numChoices) {
                if (raiseErr) {
                    throw new Error(`Invalid answer number: ${docNum}. Answer number must be between 1 and ${numChoices}`);
                }
            } else {
                parseResult[docNum] = answerRelevance;
            }
        } catch (e) {
            if (raiseErr) {
                throw e;
            }
        }
        return parseResult;
    }, {});
};
var SummaryRetrieverMode = /*#__PURE__*/ function(SummaryRetrieverMode) {
    SummaryRetrieverMode["DEFAULT"] = "default";
    // EMBEDDING = "embedding",
    SummaryRetrieverMode["LLM"] = "llm";
    return SummaryRetrieverMode;
}({});
/**
 * A SummaryIndex keeps nodes in a sequential order for use with summarization.
 */ class SummaryIndex extends BaseIndex {
    constructor(init){
        super(init);
    }
    static async init(options) {
        const storageContext = options.storageContext ?? await storageContextFromDefaults({});
        const { docStore, indexStore } = storageContext;
        // Setup IndexStruct from storage
        const indexStructs = await indexStore.getIndexStructs();
        let indexStruct;
        if (options.indexStruct && indexStructs.length > 0) {
            throw new Error("Cannot initialize index with both indexStruct and indexStore");
        }
        if (options.indexStruct) {
            indexStruct = options.indexStruct;
        } else if (indexStructs.length == 1) {
            indexStruct = indexStructs[0].type === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$data$2d$structs$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["IndexStructType"].LIST ? indexStructs[0] : null;
        } else if (indexStructs.length > 1 && options.indexId) {
            indexStruct = await indexStore.getIndexStruct(options.indexId);
        } else {
            indexStruct = null;
        }
        // check indexStruct type
        if (indexStruct && indexStruct.type !== __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$data$2d$structs$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["IndexStructType"].LIST) {
            throw new Error("Attempting to initialize SummaryIndex with non-list indexStruct");
        }
        if (indexStruct) {
            if (options.nodes) {
                throw new Error("Cannot initialize SummaryIndex with both nodes and indexStruct");
            }
        } else {
            if (!options.nodes) {
                throw new Error("Cannot initialize SummaryIndex without nodes or indexStruct");
            }
            indexStruct = await SummaryIndex.buildIndexFromNodes(options.nodes, storageContext.docStore);
            await indexStore.addIndexStruct(indexStruct);
        }
        return new SummaryIndex({
            storageContext,
            docStore,
            indexStore,
            indexStruct
        });
    }
    static async fromDocuments(documents, args = {}) {
        let { storageContext } = args;
        storageContext = storageContext ?? await storageContextFromDefaults({});
        const docStore = storageContext.docStore;
        await docStore.addDocuments(documents, true);
        for (const doc of documents){
            await docStore.setDocumentHash(doc.id_, doc.hash);
        }
        const nodes = await Settings.nodeParser.getNodesFromDocuments(documents);
        const index = await SummaryIndex.init({
            nodes,
            storageContext
        });
        return index;
    }
    asRetriever(options) {
        const { mode = "default" } = options ?? {};
        switch(mode){
            case "default":
                return new SummaryIndexRetriever(this);
            case "llm":
                return new SummaryIndexLLMRetriever(this);
            default:
                throw new Error(`Unknown retriever mode: ${mode}`);
        }
    }
    asQueryEngine(options) {
        let { retriever, responseSynthesizer } = options ?? {};
        if (!retriever) {
            retriever = this.asRetriever();
        }
        if (!responseSynthesizer) {
            responseSynthesizer = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$response$2d$synthesizers$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getResponseSynthesizer"])("compact");
        }
        return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$query$2d$engine$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["RetrieverQueryEngine"](retriever, responseSynthesizer, options?.nodePostprocessors);
    }
    asChatEngine(options) {
        const { retriever, mode, ...contextChatEngineOptions } = options ?? {};
        return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$chat$2d$engine$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ContextChatEngine"]({
            retriever: retriever ?? this.asRetriever({
                mode: mode ?? "default"
            }),
            ...contextChatEngineOptions
        });
    }
    static async buildIndexFromNodes(nodes, docStore, indexStruct) {
        indexStruct = indexStruct || new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$data$2d$structs$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["IndexList"]();
        await docStore.addDocuments(nodes, true);
        for (const node of nodes){
            indexStruct.addNode(node);
        }
        return indexStruct;
    }
    async insertNodes(nodes) {
        for (const node of nodes){
            this.indexStruct.addNode(node);
        }
    }
    async deleteRefDoc(refDocId, deleteFromDocStore) {
        const refDocInfo = await this.docStore.getRefDocInfo(refDocId);
        if (!refDocInfo) {
            return;
        }
        await this.deleteNodes(refDocInfo.nodeIds, false);
        if (deleteFromDocStore) {
            await this.docStore.deleteRefDoc(refDocId, false);
        }
        return;
    }
    async deleteNodes(nodeIds, deleteFromDocStore) {
        this.indexStruct.nodes = this.indexStruct.nodes.filter((existingNodeId)=>!nodeIds.includes(existingNodeId));
        if (deleteFromDocStore) {
            for (const nodeId of nodeIds){
                await this.docStore.deleteDocument(nodeId, false);
            }
        }
        await this.storageContext.indexStore.addIndexStruct(this.indexStruct);
    }
    async getRefDocInfo() {
        const nodeDocIds = this.indexStruct.nodes;
        const nodes = await this.docStore.getNodes(nodeDocIds);
        const refDocInfoMap = {};
        for (const node of nodes){
            const refNode = node.sourceNode;
            if (__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lodash$40$4$2e$17$2e$21$2f$node_modules$2f$lodash$2f$lodash$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].isNil(refNode)) {
                continue;
            }
            const refDocInfo = await this.docStore.getRefDocInfo(refNode.nodeId);
            if (__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lodash$40$4$2e$17$2e$21$2f$node_modules$2f$lodash$2f$lodash$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].isNil(refDocInfo)) {
                continue;
            }
            refDocInfoMap[refNode.nodeId] = refDocInfo;
        }
        return refDocInfoMap;
    }
}
/**
 * Simple retriever for SummaryIndex that returns all nodes
 */ class SummaryIndexRetriever extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$retriever$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BaseRetriever"] {
    constructor(index){
        super();
        this.index = index;
    }
    async _retrieve(queryBundle) {
        const nodeIds = this.index.indexStruct.nodes;
        const nodes = await this.index.docStore.getNodes(nodeIds);
        return nodes.map((node)=>({
                node: node,
                score: 1
            }));
    }
}
/**
 * LLM retriever for SummaryIndex which lets you select the most relevant chunks.
 */ class SummaryIndexLLMRetriever extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$retriever$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BaseRetriever"] {
    constructor(index, choiceSelectPrompt, choiceBatchSize = 10, formatNodeBatchFn, parseChoiceSelectAnswerFn){
        super();
        this.index = index;
        this.choiceSelectPrompt = choiceSelectPrompt || __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$prompts$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["defaultChoiceSelectPrompt"];
        this.choiceBatchSize = choiceBatchSize;
        this.formatNodeBatchFn = formatNodeBatchFn || defaultFormatNodeBatchFn;
        this.parseChoiceSelectAnswerFn = parseChoiceSelectAnswerFn || defaultParseChoiceSelectAnswerFn;
    }
    async _retrieve(query) {
        const nodeIds = this.index.indexStruct.nodes;
        const results = [];
        for(let idx = 0; idx < nodeIds.length; idx += this.choiceBatchSize){
            const nodeIdsBatch = nodeIds.slice(idx, idx + this.choiceBatchSize);
            const nodesBatch = await this.index.docStore.getNodes(nodeIdsBatch);
            const fmtBatchStr = this.formatNodeBatchFn(nodesBatch);
            const input = {
                context: fmtBatchStr,
                query: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$utils$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["extractText"])(query)
            };
            const llm = Settings.llm;
            const rawResponse = (await llm.complete({
                prompt: this.choiceSelectPrompt.format(input)
            })).text;
            // parseResult is a map from doc number to relevance score
            const parseResult = this.parseChoiceSelectAnswerFn(rawResponse, nodesBatch.length);
            const choiceNodeIds = nodeIdsBatch.filter((nodeId, idx)=>{
                return `${idx}` in parseResult;
            });
            const choiceNodes = await this.index.docStore.getNodes(choiceNodeIds);
            const nodeWithScores = choiceNodes.map((node, i)=>({
                    node: node,
                    score: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lodash$40$4$2e$17$2e$21$2f$node_modules$2f$lodash$2f$lodash$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].get(parseResult, `${i + 1}`, 1)
                }));
            results.push(...nodeWithScores);
        }
        return results;
    }
}
/**
 * The VectorStoreIndex, an index that stores the nodes only according to their vector embeddings.
 */ class VectorStoreIndex extends BaseIndex {
    constructor(init){
        super(init);
        this.indexStore = init.indexStore;
        this.vectorStores = init.vectorStores ?? init.storageContext.vectorStores;
        this.embedModel = Settings.embedModel;
    }
    /**
   * The async init function creates a new VectorStoreIndex.
   * @param options
   * @returns
   */ static async init(options) {
        const storageContext = options.storageContext ?? await storageContextFromDefaults({});
        const indexStore = storageContext.indexStore;
        const docStore = storageContext.docStore;
        let indexStruct = await VectorStoreIndex.setupIndexStructFromStorage(indexStore, options);
        if (!options.nodes && !indexStruct) {
            throw new Error("Cannot initialize VectorStoreIndex without nodes or indexStruct");
        }
        indexStruct = indexStruct ?? new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$data$2d$structs$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["IndexDict"]();
        const index = new this({
            storageContext,
            docStore,
            indexStruct,
            indexStore,
            vectorStores: options.vectorStores
        });
        if (options.nodes) {
            // If nodes are passed in, then we need to update the index
            await index.buildIndexFromNodes(options.nodes, {
                logProgress: options.logProgress
            });
        }
        return index;
    }
    static async setupIndexStructFromStorage(indexStore, options) {
        const indexStructs = await indexStore.getIndexStructs();
        let indexStruct;
        if (options.indexStruct && indexStructs.length > 0) {
            throw new Error("Cannot initialize index with both indexStruct and indexStore");
        }
        if (options.indexStruct) {
            indexStruct = options.indexStruct;
        } else if (indexStructs.length == 1) {
            indexStruct = indexStructs[0].type === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$data$2d$structs$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["IndexStructType"].SIMPLE_DICT ? indexStructs[0] : undefined;
            indexStruct = indexStructs[0];
        } else if (indexStructs.length > 1 && options.indexId) {
            indexStruct = await indexStore.getIndexStruct(options.indexId);
        }
        // Check indexStruct type
        if (indexStruct && indexStruct.type !== __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$data$2d$structs$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["IndexStructType"].SIMPLE_DICT) {
            throw new Error("Attempting to initialize VectorStoreIndex with non-vector indexStruct");
        }
        return indexStruct;
    }
    /**
   * Calculates the embeddings for the given nodes.
   *
   * @param nodes - An array of BaseNode objects representing the nodes for which embeddings are to be calculated.
   * @param {Object} [options] - An optional object containing additional parameters.
   *   @param {boolean} [options.logProgress] - A boolean indicating whether to log progress to the console (useful for debugging).
   */ async getNodeEmbeddingResults(nodes, options) {
        const nodeMap = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$schema$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["splitNodesByType"])(nodes);
        for(const type in nodeMap){
            const nodes = nodeMap[type];
            const embedModel = this.vectorStores[type]?.embedModel ?? this.embedModel;
            if (embedModel && nodes) {
                await embedModel(nodes, {
                    logProgress: options?.logProgress
                });
            }
        }
        return nodes;
    }
    /**
   * Get embeddings for nodes and place them into the index.
   * @param nodes
   * @returns
   */ async buildIndexFromNodes(nodes, options) {
        await this.insertNodes(nodes, options);
    }
    /**
   * High level API: split documents, get embeddings, and build index.
   * @param documents
   * @param args
   * @returns
   */ static async fromDocuments(documents, args = {}) {
        args.storageContext = args.storageContext ?? await storageContextFromDefaults({});
        args.vectorStores = args.vectorStores ?? args.storageContext.vectorStores;
        args.docStoreStrategy = args.docStoreStrategy ?? // set doc store strategy defaults to the same as for the IngestionPipeline
        (args.vectorStores ? DocStoreStrategy.UPSERTS : DocStoreStrategy.DUPLICATES_ONLY);
        const docStore = args.storageContext.docStore;
        if (args.logProgress) {
            console.log("Using node parser on documents...");
        }
        // use doc store strategy to avoid duplicates
        const vectorStores = Object.values(args.vectorStores ?? {});
        const docStoreStrategy = createDocStoreStrategy(args.docStoreStrategy, docStore, vectorStores);
        args.nodes = await runTransformations(documents, [
            Settings.nodeParser
        ], {}, {
            docStoreStrategy
        });
        if (args.logProgress) {
            console.log("Finished parsing documents.");
        }
        try {
            return await this.init(args);
        } catch (error) {
            await docStoreStrategy.rollback(args.storageContext.docStore, args.nodes);
            throw error;
        }
    }
    static async fromVectorStores(vectorStores) {
        if (!vectorStores[__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$schema$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ModalityType"].TEXT]?.storesText) {
            throw new Error("Cannot initialize from a vector store that does not store text");
        }
        const storageContext = await storageContextFromDefaults({
            vectorStores
        });
        const index = await this.init({
            nodes: [],
            storageContext
        });
        return index;
    }
    static async fromVectorStore(vectorStore) {
        return this.fromVectorStores({
            [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$schema$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ModalityType"].TEXT]: vectorStore
        });
    }
    asRetriever(options) {
        return new VectorIndexRetriever({
            index: this,
            ...options
        });
    }
    /**
   * Create a RetrieverQueryEngine.
   * similarityTopK is only used if no existing retriever is provided.
   */ asQueryEngine(options) {
        const { retriever, responseSynthesizer, preFilters, customParams, nodePostprocessors, similarityTopK } = options ?? {};
        return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$query$2d$engine$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["RetrieverQueryEngine"](retriever ?? this.asRetriever({
            similarityTopK,
            filters: preFilters,
            customParams: customParams ?? undefined
        }), responseSynthesizer, nodePostprocessors);
    }
    /**
   * Convert the index to a chat engine.
   * @param options The options for creating the chat engine
   * @returns A ContextChatEngine that uses the index's retriever to get context for each query
   */ asChatEngine(options = {}) {
        const { retriever, similarityTopK, preFilters, customParams, ...contextChatEngineOptions } = options;
        return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$chat$2d$engine$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ContextChatEngine"]({
            retriever: retriever ?? this.asRetriever({
                similarityTopK,
                filters: preFilters,
                customParams: customParams ?? undefined
            }),
            ...contextChatEngineOptions
        });
    }
    async insertNodesToStore(newIds, nodes, vectorStore) {
        // NOTE: if the vector store doesn't store text,
        // we need to add the nodes to the index struct and document store
        // NOTE: if the vector store keeps text,
        // we only need to add image and index nodes
        for(let i = 0; i < nodes.length; ++i){
            const { type } = nodes[i];
            if (!vectorStore.storesText || type === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$schema$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ObjectType"].INDEX || type === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$schema$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ObjectType"].IMAGE) {
                const nodeWithoutEmbedding = nodes[i].clone();
                nodeWithoutEmbedding.embedding = undefined;
                this.indexStruct.addNode(nodeWithoutEmbedding, newIds[i]);
                await this.docStore.addDocuments([
                    nodeWithoutEmbedding
                ], true);
            }
        }
    }
    async insertNodes(nodes, options) {
        if (!nodes || nodes.length === 0) {
            return;
        }
        nodes = await this.getNodeEmbeddingResults(nodes, options);
        await addNodesToVectorStores(nodes, this.vectorStores, this.insertNodesToStore.bind(this));
        await this.indexStore.addIndexStruct(this.indexStruct);
    }
    async deleteRefDoc(refDocId, deleteFromDocStore = true) {
        for (const vectorStore of Object.values(this.vectorStores)){
            await this.deleteRefDocFromStore(vectorStore, refDocId);
        }
        if (deleteFromDocStore) {
            await this.docStore.deleteDocument(refDocId, false);
        }
    }
    async deleteRefDocFromStore(vectorStore, refDocId) {
        await vectorStore.delete(refDocId);
        if (!vectorStore.storesText) {
            const refDocInfo = await this.docStore.getRefDocInfo(refDocId);
            if (refDocInfo) {
                for (const nodeId of refDocInfo.nodeIds){
                    this.indexStruct.delete(nodeId);
                    await vectorStore.delete(nodeId);
                }
            }
            await this.indexStore.addIndexStruct(this.indexStruct);
        }
    }
}
class VectorIndexRetriever extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$retriever$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BaseRetriever"] {
    constructor(options){
        super();
        this.index = options.index;
        this.queryMode = options.mode ?? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$vector$2d$store$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["VectorStoreQueryMode"].DEFAULT;
        if ("topK" in options && options.topK) {
            this.topK = options.topK;
        } else {
            this.topK = {
                [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$schema$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ModalityType"].TEXT]: "similarityTopK" in options && options.similarityTopK ? options.similarityTopK : __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$embeddings$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DEFAULT_SIMILARITY_TOP_K"],
                [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$schema$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ModalityType"].IMAGE]: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$embeddings$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DEFAULT_SIMILARITY_TOP_K"],
                [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$schema$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ModalityType"].AUDIO]: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$embeddings$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DEFAULT_SIMILARITY_TOP_K"]
            };
        }
        this.filters = options.filters;
        this.customParams = options.customParams;
    }
    /**
   * @deprecated, pass similarityTopK or topK in constructor instead or directly modify topK
   */ set similarityTopK(similarityTopK) {
        this.topK[__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$schema$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ModalityType"].TEXT] = similarityTopK;
    }
    async _retrieve(params) {
        const { query } = params;
        const vectorStores = this.index.vectorStores;
        let nodesWithScores = [];
        for(const type in vectorStores){
            const vectorStore = vectorStores[type];
            nodesWithScores = nodesWithScores.concat(await this.retrieveQuery(query, type, vectorStore));
        }
        return nodesWithScores;
    }
    async retrieveQuery(query, type, vectorStore, filters, customParams) {
        // convert string message to multi-modal format
        let queryStr = query;
        if (typeof query === "string") {
            queryStr = query;
            query = [
                {
                    type: "text",
                    text: queryStr
                }
            ];
        } else {
            queryStr = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$utils$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["extractText"])(query);
        }
        // overwrite embed model if specified, otherwise use the one from the vector store
        const embedModel = this.index.embedModel ?? vectorStore.embedModel;
        let nodes = [];
        // query each content item (e.g. text or image) separately
        for (const item of query){
            const queryEmbedding = await embedModel.getQueryEmbedding(item);
            if (queryEmbedding) {
                const result = await vectorStore.query({
                    queryStr,
                    queryEmbedding,
                    mode: this.queryMode ?? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$vector$2d$store$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["VectorStoreQueryMode"].DEFAULT,
                    similarityTopK: this.topK[type],
                    filters: this.filters ?? filters ?? undefined,
                    customParams: this.customParams ?? customParams ?? undefined
                });
                nodes = nodes.concat(this.buildNodeListFromQueryResult(result));
            }
        }
        return nodes;
    }
    buildNodeListFromQueryResult(result) {
        const nodesWithScores = [];
        for(let i = 0; i < result.ids.length; i++){
            const nodeFromResult = result.nodes?.[i];
            if (!this.index.indexStruct.nodesDict[result.ids[i]] && nodeFromResult) {
                this.index.indexStruct.nodesDict[result.ids[i]] = nodeFromResult;
            }
            const node = this.index.indexStruct.nodesDict[result.ids[i]];
            // XXX: Hack, if it's an image node, we reconstruct the image from the URL
            // Alternative: Store image in doc store and retrieve it here
            if (node instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$schema$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ImageNode"]) {
                node.image = node.getUrl();
            }
            nodesWithScores.push({
                node: node,
                score: result.similarities[i]
            });
        }
        return nodesWithScores;
    }
}
;
}}),
"[project]/node_modules/.pnpm/llamaindex@0.11.19_@llama-flow+core@0.4.4_next@15.3.4_react-dom@19.1.0_react@19.1.0__re_1d30be2795de4d1906fac150e4bc1023/node_modules/llamaindex/indices/dist/index.js [app-route] (ecmascript) <module evaluation>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$indices$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/indices/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$schema$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/schema/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$storage$2f$doc$2d$store$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/storage/doc-store/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$storage$2f$kv$2d$store$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/storage/kv-store/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$env$40$0$2e$1$2e$30$2f$node_modules$2f40$llamaindex$2f$env$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+env@0.1.30/node_modules/@llamaindex/env/dist/index.js [app-route] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/global/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$node$2d$parser$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/node-parser/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$query$2d$engine$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/query-engine/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$response$2d$synthesizers$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/response-synthesizers/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$utils$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/utils/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$llamaindex$40$0$2e$11$2e$19_$40$llama$2d$flow$2b$core$40$0$2e$4$2e$4_next$40$15$2e$3$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$re_1d30be2795de4d1906fac150e4bc1023$2f$node_modules$2f$llamaindex$2f$selectors$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/llamaindex@0.11.19_@llama-flow+core@0.4.4_next@15.3.4_react-dom@19.1.0_react@19.1.0__re_1d30be2795de4d1906fac150e4bc1023/node_modules/llamaindex/selectors/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$prompts$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/prompts/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$storage$2f$index$2d$store$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/storage/index-store/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$embeddings$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/embeddings/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$vector$2d$store$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/vector-store/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lodash$40$4$2e$17$2e$21$2f$node_modules$2f$lodash$2f$lodash$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lodash@4.17.21/node_modules/lodash/lodash.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$data$2d$structs$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/data-structs/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$retriever$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/retriever/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$chat$2d$engine$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/chat-engine/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$decorator$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/decorator/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$memory$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/memory/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$llamaindex$40$0$2e$11$2e$19_$40$llama$2d$flow$2b$core$40$0$2e$4$2e$4_next$40$15$2e$3$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$re_1d30be2795de4d1906fac150e4bc1023$2f$node_modules$2f$llamaindex$2f$indices$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/llamaindex@0.11.19_@llama-flow+core@0.4.4_next@15.3.4_react-dom@19.1.0_react@19.1.0__re_1d30be2795de4d1906fac150e4bc1023/node_modules/llamaindex/indices/dist/index.js [app-route] (ecmascript) <locals>");
}}),
"[project]/node_modules/.pnpm/llamaindex@0.11.19_@llama-flow+core@0.4.4_next@15.3.4_react-dom@19.1.0_react@19.1.0__re_1d30be2795de4d1906fac150e4bc1023/node_modules/llamaindex/ingestion/dist/index.js [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "DocStoreStrategy": (()=>DocStoreStrategy),
    "DuplicatesStrategy": (()=>DuplicatesStrategy),
    "IngestionCache": (()=>IngestionCache),
    "IngestionPipeline": (()=>IngestionPipeline),
    "RollbackableTransformComponent": (()=>RollbackableTransformComponent),
    "UpsertsAndDeleteStrategy": (()=>UpsertsAndDeleteStrategy),
    "UpsertsStrategy": (()=>UpsertsStrategy),
    "addNodesToVectorStores": (()=>addNodesToVectorStores),
    "classify": (()=>classify),
    "createDocStoreStrategy": (()=>createDocStoreStrategy),
    "getTransformationHash": (()=>getTransformationHash),
    "runTransformations": (()=>runTransformations)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$schema$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/schema/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$storage$2f$doc$2d$store$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/storage/doc-store/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$storage$2f$kv$2d$store$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/storage/kv-store/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$env$40$0$2e$1$2e$30$2f$node_modules$2f40$llamaindex$2f$env$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+env@0.1.30/node_modules/@llamaindex/env/dist/index.js [app-route] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$env$40$0$2e$1$2e$30$2f$node_modules$2f40$llamaindex$2f$env$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+env@0.1.30/node_modules/@llamaindex/env/dist/index.js [app-route] (ecmascript) <locals>");
;
;
;
;
const transformToJSON = (obj)=>{
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const seen = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const replacer = (key, value)=>{
        if (value != null && typeof value == "object") {
            if (seen.indexOf(value) >= 0) {
                return;
            }
            seen.push(value);
        }
        return value;
    };
    // this is a custom replacer function that will allow us to handle circular references
    const jsonStr = JSON.stringify(obj, replacer);
    return jsonStr;
};
function getTransformationHash(nodes, transform) {
    const nodesStr = nodes.map((node)=>node.getContent(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$schema$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["MetadataMode"].ALL)).join("");
    const transformString = transformToJSON(transform);
    const hash = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$env$40$0$2e$1$2e$30$2f$node_modules$2f40$llamaindex$2f$env$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createSHA256"])();
    hash.update(nodesStr + transformString + transform.id);
    return hash.digest();
}
class IngestionCache {
    constructor(collection){
        this.collection = "llama_cache";
        this.nodesKey = "nodes";
        if (collection) {
            this.collection = collection;
        }
        this.cache = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$storage$2f$kv$2d$store$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SimpleKVStore"]();
    }
    async put(hash, nodes) {
        const val = {
            [this.nodesKey]: nodes.map((node)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$storage$2f$doc$2d$store$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["docToJson"])(node, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$storage$2f$doc$2d$store$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsonSerializer"]))
        };
        await this.cache.put(hash, val, this.collection);
    }
    async get(hash) {
        const json = await this.cache.get(hash, this.collection);
        if (!json || !json[this.nodesKey] || !Array.isArray(json[this.nodesKey])) {
            return undefined;
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return json[this.nodesKey].map((doc)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$storage$2f$doc$2d$store$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsonToDoc"])(doc, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$storage$2f$doc$2d$store$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["jsonSerializer"]));
    }
}
async function classify(docStore, nodes) {
    const existingDocIds = Object.values(await docStore.getAllDocumentHashes());
    const docIdsFromNodes = new Set();
    const dedupedNodes = [];
    const unusedDocs = [];
    for (const node of nodes){
        const refDocId = node.sourceNode?.nodeId || node.id_;
        docIdsFromNodes.add(refDocId);
        const existingHash = await docStore.getDocumentHash(refDocId);
        if (!existingHash) {
            // document doesn't exist, so add it
            dedupedNodes.push(node);
        } else if (existingHash && existingHash !== node.hash) {
            // document exists but hash is different, so mark doc as unused and add node as deduped
            unusedDocs.push(refDocId);
            dedupedNodes.push(node);
        }
    // otherwise, document exists and hash is the same, so do nothing
    }
    const missingDocs = existingDocIds.filter((id)=>!docIdsFromNodes.has(id));
    return {
        dedupedNodes,
        missingDocs,
        unusedDocs
    };
}
class RollbackableTransformComponent extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$schema$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["TransformComponent"] {
    // Remove unused docs from the doc store. It is useful in case
    // generating embeddings fails and we want to remove the unused docs
    // TODO: override this in UpsertsStrategy if we want to revert removed docs also
    async rollback(docStore, nodes) {
        const { unusedDocs } = await classify(docStore, nodes);
        for (const docId of unusedDocs){
            await docStore.deleteDocument(docId, false);
        }
        docStore.persist();
    }
}
/**
 * Handle doc store duplicates by checking all hashes.
 */ class DuplicatesStrategy extends RollbackableTransformComponent {
    constructor(docStore){
        super(async (nodes)=>{
            const hashes = await this.docStore.getAllDocumentHashes();
            const currentHashes = new Set();
            const nodesToRun = [];
            for (const node of nodes){
                if (!(node.hash in hashes) && !currentHashes.has(node.hash)) {
                    await this.docStore.setDocumentHash(node.id_, node.hash);
                    nodesToRun.push(node);
                    currentHashes.add(node.hash);
                }
            }
            await this.docStore.addDocuments(nodesToRun, true);
            return nodesToRun;
        });
        this.docStore = docStore;
    }
}
/**
 * Handle docstore upserts by checking hashes and ids.
 * Identify missing docs and delete them from docstore and vector store
 */ class UpsertsAndDeleteStrategy extends RollbackableTransformComponent {
    constructor(docStore, vectorStores){
        super(async (nodes)=>{
            const { dedupedNodes, missingDocs, unusedDocs } = await classify(this.docStore, nodes);
            // remove unused docs
            for (const refDocId of unusedDocs){
                await this.docStore.deleteRefDoc(refDocId, false);
                if (this.vectorStores) {
                    for (const vectorStore of this.vectorStores){
                        await vectorStore.delete(refDocId);
                    }
                }
            }
            // remove missing docs
            for (const docId of missingDocs){
                await this.docStore.deleteDocument(docId, true);
                if (this.vectorStores) {
                    for (const vectorStore of this.vectorStores){
                        await vectorStore.delete(docId);
                    }
                }
            }
            await this.docStore.addDocuments(dedupedNodes, true);
            return dedupedNodes;
        });
        this.docStore = docStore;
        this.vectorStores = vectorStores;
    }
}
/**
 * Handles doc store upserts by checking hashes and ids.
 */ class UpsertsStrategy extends RollbackableTransformComponent {
    constructor(docStore, vectorStores){
        super(async (nodes)=>{
            const { dedupedNodes, unusedDocs } = await classify(this.docStore, nodes);
            // remove unused docs
            for (const refDocId of unusedDocs){
                await this.docStore.deleteRefDoc(refDocId, false);
                if (this.vectorStores) {
                    for (const vectorStore of this.vectorStores){
                        await vectorStore.delete(refDocId);
                    }
                }
            }
            // add non-duplicate docs
            await this.docStore.addDocuments(dedupedNodes, true);
            return dedupedNodes;
        });
        this.docStore = docStore;
        this.vectorStores = vectorStores;
    }
}
/**
 * Document de-deduplication strategies work by comparing the hashes or ids stored in the document store.
 * They require a document store to be set which must be persisted across pipeline runs.
 */ var DocStoreStrategy = /*#__PURE__*/ function(DocStoreStrategy) {
    // Use upserts to handle duplicates. Checks if the a document is already in the doc store based on its id. If it is not, or if the hash of the document is updated, it will update the document in the doc store and run the transformations.
    DocStoreStrategy["UPSERTS"] = "upserts";
    // Only handle duplicates. Checks if the hash of a document is already in the doc store. Only then it will add the document to the doc store and run the transformations
    DocStoreStrategy["DUPLICATES_ONLY"] = "duplicates_only";
    // Use upserts and delete to handle duplicates. Like the upsert strategy but it will also delete non-existing documents from the doc store
    DocStoreStrategy["UPSERTS_AND_DELETE"] = "upserts_and_delete";
    DocStoreStrategy["NONE"] = "none";
    return DocStoreStrategy;
}({});
class NoOpStrategy extends RollbackableTransformComponent {
    constructor(){
        super(async (nodes)=>nodes);
    }
}
function createDocStoreStrategy(docStoreStrategy, docStore, vectorStores = []) {
    if (docStoreStrategy === "none") {
        return new NoOpStrategy();
    }
    if (!docStore) {
        throw new Error("docStore is required to create a doc store strategy.");
    }
    if (vectorStores.length > 0) {
        if (docStoreStrategy === "upserts") {
            return new UpsertsStrategy(docStore, vectorStores);
        } else if (docStoreStrategy === "upserts_and_delete") {
            return new UpsertsAndDeleteStrategy(docStore, vectorStores);
        } else if (docStoreStrategy === "duplicates_only") {
            return new DuplicatesStrategy(docStore);
        } else {
            throw new Error(`Invalid docstore strategy: ${docStoreStrategy}`);
        }
    } else {
        if (docStoreStrategy === "upserts") {
            console.warn("Docstore strategy set to upserts, but no vector store. Switching to duplicates_only strategy.");
        } else if (docStoreStrategy === "upserts_and_delete") {
            console.warn("Docstore strategy set to upserts and delete, but no vector store. Switching to duplicates_only strategy.");
        }
        return new DuplicatesStrategy(docStore);
    }
}
async function runTransformations(nodesToRun, transformations, transformOptions = {}, { inPlace = true, cache, docStoreStrategy } = {}) {
    let nodes = nodesToRun;
    if (!inPlace) {
        nodes = [
            ...nodesToRun
        ];
    }
    if (docStoreStrategy) {
        nodes = await docStoreStrategy(nodes);
    }
    for (const transform of transformations){
        if (cache) {
            const hash = getTransformationHash(nodes, transform);
            const cachedNodes = await cache.get(hash);
            if (cachedNodes) {
                nodes = cachedNodes;
            } else {
                nodes = await transform(nodes, transformOptions);
                await cache.put(hash, nodes);
            }
        } else {
            nodes = await transform(nodes, transformOptions);
        }
    }
    return nodes;
}
class IngestionPipeline {
    constructor(init){
        this.transformations = [];
        this.docStoreStrategy = DocStoreStrategy.UPSERTS;
        this.disableCache = false;
        Object.assign(this, init);
        if (!this.docStore) {
            this.docStoreStrategy = DocStoreStrategy.NONE;
        }
        this.vectorStores = this.vectorStores ?? (this.vectorStore ? {
            [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$schema$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ModalityType"].TEXT]: this.vectorStore
        } : undefined);
        this._docStoreStrategy = createDocStoreStrategy(this.docStoreStrategy, this.docStore, this.vectorStores ? Object.values(this.vectorStores) : undefined);
        if (!this.disableCache) {
            this.cache = new IngestionCache();
        }
    }
    async prepareInput(documents, nodes) {
        const inputNodes = [];
        if (documents) {
            inputNodes.push(documents);
        }
        if (nodes) {
            inputNodes.push(nodes);
        }
        if (this.documents) {
            inputNodes.push(this.documents);
        }
        if (this.reader) {
            // fixme: empty parameter might cause error
            inputNodes.push(await this.reader.loadData());
        }
        return inputNodes.flat();
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async run(args = {}, transformOptions) {
        args.cache = args.cache ?? this.cache;
        args.docStoreStrategy = args.docStoreStrategy ?? this._docStoreStrategy;
        const inputNodes = await this.prepareInput(args.documents, args.nodes);
        const nodes = await runTransformations(inputNodes, this.transformations, transformOptions, args);
        if (this.vectorStores) {
            const nodesToAdd = nodes.filter((node)=>node.embedding);
            await addNodesToVectorStores(nodesToAdd, this.vectorStores);
        }
        return nodes;
    }
}
async function addNodesToVectorStores(nodes, vectorStores, nodesAdded) {
    const nodeMap = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$schema$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["splitNodesByType"])(nodes);
    for(const type in nodeMap){
        const nodes = nodeMap[type];
        if (nodes) {
            const vectorStore = vectorStores[type];
            if (!vectorStore) {
                throw new Error(`Cannot insert nodes of type ${type} without assigned vector store`);
            }
            const newIds = await vectorStore.add(nodes);
            if (nodesAdded) {
                await nodesAdded(newIds, nodes, vectorStore);
            }
        }
    }
}
;
}}),
"[project]/node_modules/.pnpm/llamaindex@0.11.19_@llama-flow+core@0.4.4_next@15.3.4_react-dom@19.1.0_react@19.1.0__re_1d30be2795de4d1906fac150e4bc1023/node_modules/llamaindex/node-parser/dist/index.js [app-route] (ecmascript) <locals>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$node$2d$parser$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/node-parser/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$node$2d$parser$40$2$2e$0$2e$15_$40$llamaindex$2b$core$40$0$2e$6$2e$15_$40$llamaindex$2b$env$40$0$2e$1$2e$30_tree$2d$sitter$40$0$2e$22$2e$4_web$2d$tree$2d$sitter$40$0$2e$24$2e$7$2f$node_modules$2f40$llamaindex$2f$node$2d$parser$2f$code$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+node-parser@2.0.15_@llamaindex+core@0.6.15_@llamaindex+env@0.1.30_tree-sitter@0.22.4_web-tree-sitter@0.24.7/node_modules/@llamaindex/node-parser/code/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$node$2d$parser$40$2$2e$0$2e$15_$40$llamaindex$2b$core$40$0$2e$6$2e$15_$40$llamaindex$2b$env$40$0$2e$1$2e$30_tree$2d$sitter$40$0$2e$22$2e$4_web$2d$tree$2d$sitter$40$0$2e$24$2e$7$2f$node_modules$2f40$llamaindex$2f$node$2d$parser$2f$html$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+node-parser@2.0.15_@llamaindex+core@0.6.15_@llamaindex+env@0.1.30_tree-sitter@0.22.4_web-tree-sitter@0.24.7/node_modules/@llamaindex/node-parser/html/dist/index.js [app-route] (ecmascript)");
;
;
;
}}),
"[project]/node_modules/.pnpm/llamaindex@0.11.19_@llama-flow+core@0.4.4_next@15.3.4_react-dom@19.1.0_react@19.1.0__re_1d30be2795de4d1906fac150e4bc1023/node_modules/llamaindex/node-parser/dist/index.js [app-route] (ecmascript) <module evaluation>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$node$2d$parser$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/node-parser/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$node$2d$parser$40$2$2e$0$2e$15_$40$llamaindex$2b$core$40$0$2e$6$2e$15_$40$llamaindex$2b$env$40$0$2e$1$2e$30_tree$2d$sitter$40$0$2e$22$2e$4_web$2d$tree$2d$sitter$40$0$2e$24$2e$7$2f$node_modules$2f40$llamaindex$2f$node$2d$parser$2f$code$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+node-parser@2.0.15_@llamaindex+core@0.6.15_@llamaindex+env@0.1.30_tree-sitter@0.22.4_web-tree-sitter@0.24.7/node_modules/@llamaindex/node-parser/code/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$node$2d$parser$40$2$2e$0$2e$15_$40$llamaindex$2b$core$40$0$2e$6$2e$15_$40$llamaindex$2b$env$40$0$2e$1$2e$30_tree$2d$sitter$40$0$2e$22$2e$4_web$2d$tree$2d$sitter$40$0$2e$24$2e$7$2f$node_modules$2f40$llamaindex$2f$node$2d$parser$2f$html$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+node-parser@2.0.15_@llamaindex+core@0.6.15_@llamaindex+env@0.1.30_tree-sitter@0.22.4_web-tree-sitter@0.24.7/node_modules/@llamaindex/node-parser/html/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$llamaindex$40$0$2e$11$2e$19_$40$llama$2d$flow$2b$core$40$0$2e$4$2e$4_next$40$15$2e$3$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$re_1d30be2795de4d1906fac150e4bc1023$2f$node_modules$2f$llamaindex$2f$node$2d$parser$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/llamaindex@0.11.19_@llama-flow+core@0.4.4_next@15.3.4_react-dom@19.1.0_react@19.1.0__re_1d30be2795de4d1906fac150e4bc1023/node_modules/llamaindex/node-parser/dist/index.js [app-route] (ecmascript) <locals>");
}}),
"[project]/node_modules/.pnpm/llamaindex@0.11.19_@llama-flow+core@0.4.4_next@15.3.4_react-dom@19.1.0_react@19.1.0__re_1d30be2795de4d1906fac150e4bc1023/node_modules/llamaindex/objects/dist/index.js [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "ObjectIndex": (()=>ObjectIndex),
    "SimpleToolNodeMapping": (()=>SimpleToolNodeMapping)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$objects$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/objects/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$schema$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/schema/dist/index.js [app-route] (ecmascript)");
;
;
const convertToolToNode = (tool)=>{
    const nodeText = `
    Tool name: ${tool.metadata.name}
    Tool description: ${tool.metadata.description}
  `;
    return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$schema$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["TextNode"]({
        text: nodeText,
        metadata: {
            name: tool.metadata.name
        },
        excludedEmbedMetadataKeys: [
            "name"
        ],
        excludedLlmMetadataKeys: [
            "name"
        ]
    });
};
class SimpleToolNodeMapping extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$objects$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BaseObjectNodeMapping"] {
    constructor(objs = []){
        super();
        this._tools = {};
        for (const tool of objs){
            this._tools[tool.metadata.name] = tool;
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    objNodeMapping() {
        return this._tools;
    }
    toNode(tool) {
        return convertToolToNode(tool);
    }
    _addObj(tool) {
        this._tools[tool.metadata.name] = tool;
    }
    _fromNode(node) {
        if (!node.metadata) {
            throw new Error("Metadata must be set");
        }
        return this._tools[node.metadata.name];
    }
    persist(persistDir, objNodeMappingFilename) {
    // Implement the persist method
    }
    toNodes(objs) {
        return objs.map((obj)=>this.toNode(obj));
    }
    addObj(obj) {
        this._addObj(obj);
    }
    fromNode(node) {
        return this._fromNode(node);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static fromObjects(objs, ...args) {
        return new SimpleToolNodeMapping(objs);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fromObjects(objs, ...args) {
        return new SimpleToolNodeMapping(objs);
    }
}
class ObjectIndex {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(index, objectNodeMapping){
        this._index = index;
        this._objectNodeMapping = objectNodeMapping;
    }
    static async fromObjects(objects, objectMapping, indexCls, indexKwargs) {
        if (objectMapping === null) {
            objectMapping = SimpleToolNodeMapping.fromObjects(objects, {});
        }
        const nodes = objectMapping.toNodes(objects);
        const index = await indexCls.init({
            nodes,
            ...indexKwargs
        });
        return new ObjectIndex(index, objectMapping);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async insertObject(obj) {
        this._objectNodeMapping.addObj(obj);
        const node = this._objectNodeMapping.toNode(obj);
        await this._index.insertNodes([
            node
        ]);
    }
    get tools() {
        return this._objectNodeMapping.objNodeMapping();
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async asRetriever(kwargs) {
        return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$objects$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ObjectRetriever"](this._index.asRetriever(kwargs), this._objectNodeMapping);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    asNodeRetriever(kwargs) {
        return this._index.asRetriever(kwargs);
    }
}
;
}}),
"[project]/node_modules/.pnpm/llamaindex@0.11.19_@llama-flow+core@0.4.4_next@15.3.4_react-dom@19.1.0_react@19.1.0__re_1d30be2795de4d1906fac150e4bc1023/node_modules/llamaindex/postprocessors/dist/index.js [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "JinaAIReranker": (()=>JinaAIReranker),
    "MetadataReplacementPostProcessor": (()=>MetadataReplacementPostProcessor),
    "SimilarityPostprocessor": (()=>SimilarityPostprocessor)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$schema$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/schema/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$utils$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/utils/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$env$40$0$2e$1$2e$30$2f$node_modules$2f40$llamaindex$2f$env$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+env@0.1.30/node_modules/@llamaindex/env/dist/index.js [app-route] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$env$40$0$2e$1$2e$30$2f$node_modules$2f40$llamaindex$2f$env$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+env@0.1.30/node_modules/@llamaindex/env/dist/index.js [app-route] (ecmascript) <locals>");
;
;
;
class MetadataReplacementPostProcessor {
    constructor(targetMetadataKey){
        this.targetMetadataKey = targetMetadataKey;
    }
    async postprocessNodes(nodes) {
        for (const n of nodes){
            n.node.setContent(n.node.metadata[this.targetMetadataKey] ?? n.node.getContent(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$schema$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["MetadataMode"].NONE));
        }
        return nodes;
    }
}
class JinaAIReranker {
    constructor(init){
        this.model = "jina-reranker-v1-base-en";
        this.apiKey = undefined;
        this.topN = init?.topN ?? 2;
        this.model = init?.model ?? "jina-reranker-v1-base-en";
        this.apiKey = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$env$40$0$2e$1$2e$30$2f$node_modules$2f40$llamaindex$2f$env$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["getEnv"])("JINAAI_API_KEY");
        if (!this.apiKey) {
            throw new Error("Set Jina AI API Key in JINAAI_API_KEY env variable. Get one for free or top up your key at https://jina.ai/reranker");
        }
    }
    async rerank(query, documents, topN = this.topN) {
        const url = "https://api.jina.ai/v1/rerank";
        const headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.apiKey}`
        };
        const data = {
            model: this.model,
            query: query,
            documents: documents,
            top_n: topN
        };
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: headers,
                body: JSON.stringify(data)
            });
            const jsonData = await response.json();
            return jsonData.results;
        } catch (error) {
            console.error("Error while reranking:", error);
            throw new Error("Failed to rerank documents due to an API error");
        }
    }
    async postprocessNodes(nodes, query) {
        if (nodes.length === 0) {
            return [];
        }
        if (query === undefined) {
            throw new Error("JinaAIReranker requires a query");
        }
        const documents = nodes.map((n)=>n.node.getContent(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$schema$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["MetadataMode"].ALL));
        const results = await this.rerank((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$utils$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["extractText"])(query), documents, this.topN);
        const newNodes = [];
        for (const result of results){
            const node = nodes[result.index];
            newNodes.push({
                node: node.node,
                score: result.relevance_score
            });
        }
        return newNodes;
    }
}
class SimilarityPostprocessor {
    constructor(options){
        this.similarityCutoff = options?.similarityCutoff;
    }
    async postprocessNodes(nodes) {
        if (this.similarityCutoff === undefined) return nodes;
        const cutoff = this.similarityCutoff || 0;
        return nodes.filter((node)=>node.score && node.score >= cutoff);
    }
}
;
}}),
"[project]/node_modules/.pnpm/llamaindex@0.11.19_@llama-flow+core@0.4.4_next@15.3.4_react-dom@19.1.0_react@19.1.0__re_1d30be2795de4d1906fac150e4bc1023/node_modules/llamaindex/tools/dist/index.js [app-route] (ecmascript) <locals>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "QueryEngineTool": (()=>QueryEngineTool)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$tools$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/tools/dist/index.js [app-route] (ecmascript)");
;
const DEFAULT_NAME = "query_engine_tool";
const DEFAULT_DESCRIPTION = "Useful for running a natural language query against a knowledge base and get back a natural language response.";
const DEFAULT_PARAMETERS = {
    type: "object",
    properties: {
        query: {
            type: "string",
            description: "The query to search for"
        }
    },
    required: [
        "query"
    ]
};
class QueryEngineTool {
    constructor({ queryEngine, metadata, includeSourceNodes }){
        this.queryEngine = queryEngine;
        this.metadata = {
            name: metadata?.name ?? DEFAULT_NAME,
            description: metadata?.description ?? DEFAULT_DESCRIPTION,
            parameters: metadata?.parameters ?? DEFAULT_PARAMETERS
        };
        this.includeSourceNodes = includeSourceNodes ?? false;
    }
    async call({ query }) {
        const response = await this.queryEngine.query({
            query
        });
        if (!this.includeSourceNodes) {
            return {
                content: response.message.content
            };
        }
        return {
            content: response.message.content,
            sourceNodes: response.sourceNodes
        };
    }
}
;
}}),
"[project]/node_modules/.pnpm/llamaindex@0.11.19_@llama-flow+core@0.4.4_next@15.3.4_react-dom@19.1.0_react@19.1.0__re_1d30be2795de4d1906fac150e4bc1023/node_modules/llamaindex/tools/dist/index.js [app-route] (ecmascript) <module evaluation>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$tools$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/tools/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$llamaindex$40$0$2e$11$2e$19_$40$llama$2d$flow$2b$core$40$0$2e$4$2e$4_next$40$15$2e$3$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$re_1d30be2795de4d1906fac150e4bc1023$2f$node_modules$2f$llamaindex$2f$tools$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/llamaindex@0.11.19_@llama-flow+core@0.4.4_next@15.3.4_react-dom@19.1.0_react@19.1.0__re_1d30be2795de4d1906fac150e4bc1023/node_modules/llamaindex/tools/dist/index.js [app-route] (ecmascript) <locals>");
}}),
"[project]/node_modules/.pnpm/llamaindex@0.11.19_@llama-flow+core@0.4.4_next@15.3.4_react-dom@19.1.0_react@19.1.0__re_1d30be2795de4d1906fac150e4bc1023/node_modules/llamaindex/dist/index.react-server.js [app-route] (ecmascript) <locals>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "LLMQuestionGenerator": (()=>LLMQuestionGenerator),
    "Settings": (()=>Settings),
    "SubQuestionOutputParser": (()=>SubQuestionOutputParser),
    "parseJsonMarkdown": (()=>parseJsonMarkdown),
    "storageContextFromDefaults": (()=>storageContextFromDefaults)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/global/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$indices$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/indices/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$node$2d$parser$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/node-parser/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$env$40$0$2e$1$2e$30$2f$node_modules$2f40$llamaindex$2f$env$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+env@0.1.30/node_modules/@llamaindex/env/dist/index.js [app-route] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$async_hooks__$5b$external$5d$__$28$node$3a$async_hooks$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:async_hooks [external] (node:async_hooks, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs$2f$promises__$5b$external$5d$__$28$node$3a$fs$2f$promises$2c$__cjs$29$__$3c$export__default__as__fs$3e$__ = __turbopack_context__.i("[externals]/node:fs/promises [external] (node:fs/promises, cjs) <export default as fs>");
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__$3c$export__default__as__path$3e$__ = __turbopack_context__.i("[externals]/node:path [external] (node:path, cjs) <export default as path>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$cloud$40$4$2e$0$2e$24_$40$llama$2d$flow$2b$core$40$0$2e$4$2e$4_next$40$15$2e$3$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1_80eeee9fe2264cd96589698f7343c8cb$2f$node_modules$2f40$llamaindex$2f$cloud$2f$reader$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+cloud@4.0.24_@llama-flow+core@0.4.4_next@15.3.4_react-dom@19.1.0_react@19.1_80eeee9fe2264cd96589698f7343c8cb/node_modules/@llamaindex/cloud/reader/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$agent$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/agent/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$chat$2d$engine$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/chat-engine/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$data$2d$structs$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/data-structs/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$embeddings$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/embeddings/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$llms$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/llms/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$memory$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/memory/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$postprocessor$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/postprocessor/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$prompts$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/prompts/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$query$2d$engine$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/query-engine/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$response$2d$synthesizers$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/response-synthesizers/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$retriever$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/retriever/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$schema$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/schema/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$storage$2f$chat$2d$store$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/storage/chat-store/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$storage$2f$doc$2d$store$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/storage/doc-store/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$storage$2f$index$2d$store$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/storage/index-store/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$storage$2f$kv$2d$store$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/storage/kv-store/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$utils$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/utils/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$llamaindex$40$0$2e$11$2e$19_$40$llama$2d$flow$2b$core$40$0$2e$4$2e$4_next$40$15$2e$3$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$re_1d30be2795de4d1906fac150e4bc1023$2f$node_modules$2f$llamaindex$2f$agent$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/llamaindex@0.11.19_@llama-flow+core@0.4.4_next@15.3.4_react-dom@19.1.0_react@19.1.0__re_1d30be2795de4d1906fac150e4bc1023/node_modules/llamaindex/agent/dist/index.js [app-route] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$llamaindex$40$0$2e$11$2e$19_$40$llama$2d$flow$2b$core$40$0$2e$4$2e$4_next$40$15$2e$3$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$re_1d30be2795de4d1906fac150e4bc1023$2f$node_modules$2f$llamaindex$2f$cloud$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/llamaindex@0.11.19_@llama-flow+core@0.4.4_next@15.3.4_react-dom@19.1.0_react@19.1.0__re_1d30be2795de4d1906fac150e4bc1023/node_modules/llamaindex/cloud/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$llamaindex$40$0$2e$11$2e$19_$40$llama$2d$flow$2b$core$40$0$2e$4$2e$4_next$40$15$2e$3$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$re_1d30be2795de4d1906fac150e4bc1023$2f$node_modules$2f$llamaindex$2f$engines$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/llamaindex@0.11.19_@llama-flow+core@0.4.4_next@15.3.4_react-dom@19.1.0_react@19.1.0__re_1d30be2795de4d1906fac150e4bc1023/node_modules/llamaindex/engines/dist/index.js [app-route] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$llamaindex$40$0$2e$11$2e$19_$40$llama$2d$flow$2b$core$40$0$2e$4$2e$4_next$40$15$2e$3$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$re_1d30be2795de4d1906fac150e4bc1023$2f$node_modules$2f$llamaindex$2f$evaluation$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/llamaindex@0.11.19_@llama-flow+core@0.4.4_next@15.3.4_react-dom@19.1.0_react@19.1.0__re_1d30be2795de4d1906fac150e4bc1023/node_modules/llamaindex/evaluation/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$llamaindex$40$0$2e$11$2e$19_$40$llama$2d$flow$2b$core$40$0$2e$4$2e$4_next$40$15$2e$3$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$re_1d30be2795de4d1906fac150e4bc1023$2f$node_modules$2f$llamaindex$2f$extractors$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/llamaindex@0.11.19_@llama-flow+core@0.4.4_next@15.3.4_react-dom@19.1.0_react@19.1.0__re_1d30be2795de4d1906fac150e4bc1023/node_modules/llamaindex/extractors/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$llamaindex$40$0$2e$11$2e$19_$40$llama$2d$flow$2b$core$40$0$2e$4$2e$4_next$40$15$2e$3$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$re_1d30be2795de4d1906fac150e4bc1023$2f$node_modules$2f$llamaindex$2f$indices$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/llamaindex@0.11.19_@llama-flow+core@0.4.4_next@15.3.4_react-dom@19.1.0_react@19.1.0__re_1d30be2795de4d1906fac150e4bc1023/node_modules/llamaindex/indices/dist/index.js [app-route] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$llamaindex$40$0$2e$11$2e$19_$40$llama$2d$flow$2b$core$40$0$2e$4$2e$4_next$40$15$2e$3$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$re_1d30be2795de4d1906fac150e4bc1023$2f$node_modules$2f$llamaindex$2f$ingestion$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/llamaindex@0.11.19_@llama-flow+core@0.4.4_next@15.3.4_react-dom@19.1.0_react@19.1.0__re_1d30be2795de4d1906fac150e4bc1023/node_modules/llamaindex/ingestion/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$llamaindex$40$0$2e$11$2e$19_$40$llama$2d$flow$2b$core$40$0$2e$4$2e$4_next$40$15$2e$3$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$re_1d30be2795de4d1906fac150e4bc1023$2f$node_modules$2f$llamaindex$2f$node$2d$parser$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/llamaindex@0.11.19_@llama-flow+core@0.4.4_next@15.3.4_react-dom@19.1.0_react@19.1.0__re_1d30be2795de4d1906fac150e4bc1023/node_modules/llamaindex/node-parser/dist/index.js [app-route] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$llamaindex$40$0$2e$11$2e$19_$40$llama$2d$flow$2b$core$40$0$2e$4$2e$4_next$40$15$2e$3$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$re_1d30be2795de4d1906fac150e4bc1023$2f$node_modules$2f$llamaindex$2f$objects$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/llamaindex@0.11.19_@llama-flow+core@0.4.4_next@15.3.4_react-dom@19.1.0_react@19.1.0__re_1d30be2795de4d1906fac150e4bc1023/node_modules/llamaindex/objects/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$llamaindex$40$0$2e$11$2e$19_$40$llama$2d$flow$2b$core$40$0$2e$4$2e$4_next$40$15$2e$3$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$re_1d30be2795de4d1906fac150e4bc1023$2f$node_modules$2f$llamaindex$2f$postprocessors$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/llamaindex@0.11.19_@llama-flow+core@0.4.4_next@15.3.4_react-dom@19.1.0_react@19.1.0__re_1d30be2795de4d1906fac150e4bc1023/node_modules/llamaindex/postprocessors/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$llamaindex$40$0$2e$11$2e$19_$40$llama$2d$flow$2b$core$40$0$2e$4$2e$4_next$40$15$2e$3$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$re_1d30be2795de4d1906fac150e4bc1023$2f$node_modules$2f$llamaindex$2f$selectors$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/llamaindex@0.11.19_@llama-flow+core@0.4.4_next@15.3.4_react-dom@19.1.0_react@19.1.0__re_1d30be2795de4d1906fac150e4bc1023/node_modules/llamaindex/selectors/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$vector$2d$store$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/vector-store/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lodash$40$4$2e$17$2e$21$2f$node_modules$2f$lodash$2f$lodash$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lodash@4.17.21/node_modules/lodash/lodash.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$llamaindex$40$0$2e$11$2e$19_$40$llama$2d$flow$2b$core$40$0$2e$4$2e$4_next$40$15$2e$3$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$re_1d30be2795de4d1906fac150e4bc1023$2f$node_modules$2f$llamaindex$2f$tools$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/llamaindex@0.11.19_@llama-flow+core@0.4.4_next@15.3.4_react-dom@19.1.0_react@19.1.0__re_1d30be2795de4d1906fac150e4bc1023/node_modules/llamaindex/tools/dist/index.js [app-route] (ecmascript) <module evaluation>");
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
/**
 * @internal
 */ class GlobalSettings {
    #prompt;
    #promptHelper;
    #nodeParser;
    #chunkOverlap;
    #promptHelperAsyncLocalStorage;
    #nodeParserAsyncLocalStorage;
    #chunkOverlapAsyncLocalStorage;
    #promptAsyncLocalStorage;
    get debug() {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Settings"].debug;
    }
    get llm() {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Settings"].llm;
    }
    set llm(llm) {
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Settings"].llm = llm;
    }
    withLLM(llm, fn) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Settings"].withLLM(llm, fn);
    }
    get promptHelper() {
        if (this.#promptHelper === null) {
            this.#promptHelper = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$indices$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PromptHelper"]();
        }
        return this.#promptHelperAsyncLocalStorage.getStore() ?? this.#promptHelper;
    }
    set promptHelper(promptHelper) {
        this.#promptHelper = promptHelper;
    }
    withPromptHelper(promptHelper, fn) {
        return this.#promptHelperAsyncLocalStorage.run(promptHelper, fn);
    }
    get embedModel() {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Settings"].embedModel;
    }
    set embedModel(embedModel) {
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Settings"].embedModel = embedModel;
    }
    withEmbedModel(embedModel, fn) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Settings"].withEmbedModel(embedModel, fn);
    }
    get nodeParser() {
        if (this.#nodeParser === null) {
            this.#nodeParser = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$node$2d$parser$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SentenceSplitter"]({
                chunkSize: this.chunkSize,
                chunkOverlap: this.chunkOverlap
            });
        }
        return this.#nodeParserAsyncLocalStorage.getStore() ?? this.#nodeParser;
    }
    set nodeParser(nodeParser) {
        this.#nodeParser = nodeParser;
    }
    withNodeParser(nodeParser, fn) {
        return this.#nodeParserAsyncLocalStorage.run(nodeParser, fn);
    }
    get callbackManager() {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Settings"].callbackManager;
    }
    set callbackManager(callbackManager) {
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Settings"].callbackManager = callbackManager;
    }
    withCallbackManager(callbackManager, fn) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Settings"].withCallbackManager(callbackManager, fn);
    }
    set chunkSize(chunkSize) {
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Settings"].chunkSize = chunkSize;
    }
    get chunkSize() {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Settings"].chunkSize;
    }
    withChunkSize(chunkSize, fn) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Settings"].withChunkSize(chunkSize, fn);
    }
    get chunkOverlap() {
        return this.#chunkOverlapAsyncLocalStorage.getStore() ?? this.#chunkOverlap;
    }
    set chunkOverlap(chunkOverlap) {
        if (typeof chunkOverlap === "number") {
            this.#chunkOverlap = chunkOverlap;
        }
    }
    withChunkOverlap(chunkOverlap, fn) {
        return this.#chunkOverlapAsyncLocalStorage.run(chunkOverlap, fn);
    }
    get prompt() {
        return this.#promptAsyncLocalStorage.getStore() ?? this.#prompt;
    }
    set prompt(prompt) {
        this.#prompt = prompt;
    }
    withPrompt(prompt, fn) {
        return this.#promptAsyncLocalStorage.run(prompt, fn);
    }
    constructor(){
        this.#prompt = {};
        this.#promptHelper = null;
        this.#nodeParser = null;
        this.#promptHelperAsyncLocalStorage = new __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$async_hooks__$5b$external$5d$__$28$node$3a$async_hooks$2c$__cjs$29$__["AsyncLocalStorage"]();
        this.#nodeParserAsyncLocalStorage = new __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$async_hooks__$5b$external$5d$__$28$node$3a$async_hooks$2c$__cjs$29$__["AsyncLocalStorage"]();
        this.#chunkOverlapAsyncLocalStorage = new __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$async_hooks__$5b$external$5d$__$28$node$3a$async_hooks$2c$__cjs$29$__["AsyncLocalStorage"]();
        this.#promptAsyncLocalStorage = new __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$async_hooks__$5b$external$5d$__$28$node$3a$async_hooks$2c$__cjs$29$__["AsyncLocalStorage"]();
    }
}
const Settings = new GlobalSettings();
/**
 * Error class for output parsing. Due to the nature of LLMs, anytime we use LLM
 * to generate structured output, it's possible that it will hallucinate something
 * that doesn't match the expected output format. So make sure to catch these
 * errors in production.
 */ class OutputParserError extends Error {
    constructor(message, options = {}){
        super(message, options); // https://github.com/tc39/proposal-error-cause
        this.name = "OutputParserError";
        if (!this.cause) {
            // Need to check for those environments that have implemented the proposal
            this.cause = options.cause;
        }
        this.output = options.output;
        // This line is to maintain proper stack trace in V8
        // (https://v8.dev/docs/stack-trace-api)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, OutputParserError);
        }
    }
}
/**
 *
 * @param text A markdown block with JSON
 * @returns parsed JSON object
 */ function parseJsonMarkdown(text) {
    text = text.trim();
    const left_square = text.indexOf("[");
    const left_brace = text.indexOf("{");
    let left;
    let right;
    if (left_square < left_brace && left_square != -1) {
        left = left_square;
        right = text.lastIndexOf("]");
    } else {
        left = left_brace;
        right = text.lastIndexOf("}");
    }
    const jsonText = text.substring(left, right + 1);
    try {
        //Single JSON object case
        if (left_square === -1) {
            return [
                JSON.parse(jsonText)
            ];
        }
        //Multiple JSON object case.
        return JSON.parse(jsonText);
    } catch (e) {
        throw new OutputParserError("Not a json markdown", {
            output: text
        });
    }
}
/**
 * SubQuestionOutputParser is used to parse the output of the SubQuestionGenerator.
 */ class SubQuestionOutputParser {
    parse(output) {
        const parsed = parseJsonMarkdown(output);
        return {
            rawOutput: output,
            parsedOutput: parsed
        };
    }
    format(output) {
        return output;
    }
}
/**
 * LLMQuestionGenerator uses the LLM to generate new questions for the LLM using tools and a user query.
 */ class LLMQuestionGenerator extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$prompts$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PromptMixin"] {
    constructor(init){
        super();
        this.llm = init?.llm ?? Settings.llm;
        this.prompt = init?.prompt ?? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$prompts$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["defaultSubQuestionPrompt"];
        this.outputParser = init?.outputParser ?? new SubQuestionOutputParser();
    }
    _getPrompts() {
        return {
            subQuestion: this.prompt
        };
    }
    _updatePrompts(promptsDict) {
        if ("subQuestion" in promptsDict) {
            this.prompt = promptsDict.subQuestion;
        }
    }
    async generate(tools, query) {
        const toolsStr = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$utils$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["toToolDescriptions"])(tools);
        const queryStr = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$utils$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["extractText"])(query);
        const prediction = (await this.llm.complete({
            prompt: this.prompt.format({
                toolsStr,
                queryStr
            })
        })).text;
        const structuredOutput = this.outputParser.parse(prediction);
        return structuredOutput.parsedOutput;
    }
    _getPromptModules() {
        return {};
    }
}
// FS utility helpers
/**
 * Checks if a file exists.
 * Analogous to the os.path.exists function from Python.
 * @param path The path to the file to check.
 * @returns A promise that resolves to true if the file exists, false otherwise.
 */ async function exists(path) {
    try {
        await __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs$2f$promises__$5b$external$5d$__$28$node$3a$fs$2f$promises$2c$__cjs$29$__$3c$export__default__as__fs$3e$__["fs"].access(path);
        return true;
    } catch  {
        return false;
    }
}
const LEARNER_MODES = new Set([
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$vector$2d$store$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["VectorStoreQueryMode"].SVM,
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$vector$2d$store$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["VectorStoreQueryMode"].LINEAR_REGRESSION,
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$vector$2d$store$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["VectorStoreQueryMode"].LOGISTIC_REGRESSION
]);
const MMR_MODE = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$vector$2d$store$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["VectorStoreQueryMode"].MMR;
// Mapping of filter operators to metadata filter functions
const OPERATOR_TO_FILTER = {
    [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$vector$2d$store$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["FilterOperator"].EQ]: ({ key, value }, metadata)=>{
        return metadata[key] === (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$vector$2d$store$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parsePrimitiveValue"])(value);
    },
    [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$vector$2d$store$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["FilterOperator"].NE]: ({ key, value }, metadata)=>{
        return metadata[key] !== (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$vector$2d$store$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parsePrimitiveValue"])(value);
    },
    [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$vector$2d$store$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["FilterOperator"].IN]: ({ key, value }, metadata)=>{
        return !!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$vector$2d$store$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parseArrayValue"])(value).find((v)=>metadata[key] === v);
    },
    [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$vector$2d$store$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["FilterOperator"].NIN]: ({ key, value }, metadata)=>{
        return !(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$vector$2d$store$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parseArrayValue"])(value).find((v)=>metadata[key] === v);
    },
    [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$vector$2d$store$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["FilterOperator"].ANY]: ({ key, value }, metadata)=>{
        if (!Array.isArray(metadata[key])) return false;
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$vector$2d$store$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parseArrayValue"])(value).some((v)=>metadata[key].includes(v));
    },
    [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$vector$2d$store$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["FilterOperator"].ALL]: ({ key, value }, metadata)=>{
        if (!Array.isArray(metadata[key])) return false;
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$vector$2d$store$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parseArrayValue"])(value).every((v)=>metadata[key].includes(v));
    },
    [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$vector$2d$store$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["FilterOperator"].TEXT_MATCH]: ({ key, value }, metadata)=>{
        return metadata[key].includes((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$vector$2d$store$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parsePrimitiveValue"])(value));
    },
    [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$vector$2d$store$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["FilterOperator"].CONTAINS]: ({ key, value }, metadata)=>{
        if (!Array.isArray(metadata[key])) return false;
        return !!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$vector$2d$store$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parseArrayValue"])(metadata[key]).find((v)=>v === value);
    },
    [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$vector$2d$store$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["FilterOperator"].GT]: ({ key, value }, metadata)=>{
        return metadata[key] > (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$vector$2d$store$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parsePrimitiveValue"])(value);
    },
    [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$vector$2d$store$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["FilterOperator"].LT]: ({ key, value }, metadata)=>{
        return metadata[key] < (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$vector$2d$store$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parsePrimitiveValue"])(value);
    },
    [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$vector$2d$store$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["FilterOperator"].GTE]: ({ key, value }, metadata)=>{
        return metadata[key] >= (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$vector$2d$store$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parsePrimitiveValue"])(value);
    },
    [__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$vector$2d$store$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["FilterOperator"].LTE]: ({ key, value }, metadata)=>{
        return metadata[key] <= (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$vector$2d$store$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parsePrimitiveValue"])(value);
    }
};
// Build a filter function based on the metadata and the preFilters
const buildFilterFn = (metadata, preFilters)=>{
    if (!preFilters) return true;
    if (!metadata) return false;
    const { filters, condition } = preFilters;
    const queryCondition = condition || "and"; // default to and
    const itemFilterFn = (filter)=>{
        if (filter.operator === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$vector$2d$store$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["FilterOperator"].IS_EMPTY) {
            // for `is_empty` operator, return true if the metadata key is not present or the value is empty
            const value = metadata[filter.key];
            return value === undefined || value === null || value === "" || Array.isArray(value) && value.length === 0;
        }
        if (metadata[filter.key] === undefined) {
            // for other operators, always return false if the metadata key is not present
            return false;
        }
        const metadataLookupFn = OPERATOR_TO_FILTER[filter.operator];
        if (!metadataLookupFn) throw new Error(`Unsupported operator: ${filter.operator}`);
        return metadataLookupFn(filter, metadata);
    };
    if (queryCondition === "and") return filters.every(itemFilterFn);
    return filters.some(itemFilterFn);
};
class SimpleVectorStoreData {
    constructor(){
        this.embeddingDict = {};
        this.textIdToRefDocId = {};
        this.metadataDict = {};
    }
}
class SimpleVectorStore extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$vector$2d$store$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BaseVectorStore"] {
    constructor(init){
        super(init), this.storesText = false;
        this.data = init?.data || new SimpleVectorStoreData();
    }
    static async fromPersistDir(persistDir = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DEFAULT_PERSIST_DIR"], embedModel) {
        const persistPath = __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__$3c$export__default__as__path$3e$__["path"].join(persistDir, "vector_store.json");
        return await SimpleVectorStore.fromPersistPath(persistPath, embedModel);
    }
    client() {
        return null;
    }
    async get(textId) {
        return this.data.embeddingDict[textId];
    }
    async add(embeddingResults) {
        for (const node of embeddingResults){
            this.data.embeddingDict[node.id_] = node.getEmbedding();
            if (!node.sourceNode) {
                continue;
            }
            this.data.textIdToRefDocId[node.id_] = node.sourceNode?.nodeId;
            // Add metadata to the metadataDict
            const metadata = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$vector$2d$store$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["nodeToMetadata"])(node, true, undefined, false);
            delete metadata["_node_content"];
            this.data.metadataDict[node.id_] = metadata;
        }
        if (this.persistPath) {
            await this.persist(this.persistPath);
        }
        return embeddingResults.map((result)=>result.id_);
    }
    async delete(refDocId) {
        const textIdsToDelete = Object.keys(this.data.textIdToRefDocId).filter((textId)=>this.data.textIdToRefDocId[textId] === refDocId);
        for (const textId of textIdsToDelete){
            delete this.data.embeddingDict[textId];
            delete this.data.textIdToRefDocId[textId];
            if (this.data.metadataDict) delete this.data.metadataDict[textId];
        }
        if (this.persistPath) {
            await this.persist(this.persistPath);
        }
        return Promise.resolve();
    }
    async filterNodes(query) {
        const items = Object.entries(this.data.embeddingDict);
        const queryFilterFn = (nodeId)=>{
            const metadata = this.data.metadataDict[nodeId];
            return buildFilterFn(metadata, query.filters);
        };
        const nodeFilterFn = (nodeId)=>{
            if (!query.docIds) return true;
            const availableIds = new Set(query.docIds);
            return availableIds.has(nodeId);
        };
        const queriedItems = items.filter((item)=>nodeFilterFn(item[0]) && queryFilterFn(item[0]));
        const nodeIds = queriedItems.map((item)=>item[0]);
        const embeddings = queriedItems.map((item)=>item[1]);
        return {
            nodeIds,
            embeddings
        };
    }
    async query(query) {
        const { nodeIds, embeddings } = await this.filterNodes(query);
        const queryEmbedding = query.queryEmbedding;
        let topSimilarities, topIds;
        if (LEARNER_MODES.has(query.mode)) {
            // fixme: unfinished
            throw new Error("Learner modes not implemented for SimpleVectorStore yet.");
        } else if (query.mode === MMR_MODE) {
            const mmrThreshold = query.mmrThreshold;
            [topSimilarities, topIds] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$embeddings$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getTopKMMREmbeddings"])(queryEmbedding, embeddings, null, query.similarityTopK, nodeIds, mmrThreshold);
        } else if (query.mode === __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$vector$2d$store$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["VectorStoreQueryMode"].DEFAULT) {
            [topSimilarities, topIds] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$embeddings$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getTopKEmbeddings"])(queryEmbedding, embeddings, query.similarityTopK, nodeIds);
        } else {
            throw new Error(`Invalid query mode: ${query.mode}`);
        }
        return Promise.resolve({
            similarities: topSimilarities,
            ids: topIds
        });
    }
    async persist(persistPath = __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__$3c$export__default__as__path$3e$__["path"].join(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DEFAULT_PERSIST_DIR"], "vector_store.json")) {
        await SimpleVectorStore.persistData(persistPath, this.data);
    }
    static async persistData(persistPath, data) {
        const dirPath = __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__$3c$export__default__as__path$3e$__["path"].dirname(persistPath);
        if (!await exists(dirPath)) {
            await __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs$2f$promises__$5b$external$5d$__$28$node$3a$fs$2f$promises$2c$__cjs$29$__$3c$export__default__as__fs$3e$__["fs"].mkdir(dirPath);
        }
        await __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs$2f$promises__$5b$external$5d$__$28$node$3a$fs$2f$promises$2c$__cjs$29$__$3c$export__default__as__fs$3e$__["fs"].writeFile(persistPath, JSON.stringify(data));
    }
    static async fromPersistPath(persistPath, embeddingModel) {
        const dirPath = __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__$3c$export__default__as__path$3e$__["path"].dirname(persistPath);
        if (!await exists(dirPath)) {
            await __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs$2f$promises__$5b$external$5d$__$28$node$3a$fs$2f$promises$2c$__cjs$29$__$3c$export__default__as__fs$3e$__["fs"].mkdir(dirPath, {
                recursive: true
            });
        }
        let dataDict = {};
        if (!await exists(persistPath)) {
            console.info(`Starting new store from path: ${persistPath}`);
        } else {
            try {
                const fileData = await __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs$2f$promises__$5b$external$5d$__$28$node$3a$fs$2f$promises$2c$__cjs$29$__$3c$export__default__as__fs$3e$__["fs"].readFile(persistPath);
                dataDict = JSON.parse(fileData.toString());
            } catch (e) {
                throw new Error(`Failed to load data from path: ${persistPath}`, {
                    cause: e
                });
            }
        }
        const data = new SimpleVectorStoreData();
        // @ts-expect-error TS2322
        data.embeddingDict = dataDict.embeddingDict ?? {};
        // @ts-expect-error TS2322
        data.textIdToRefDocId = dataDict.textIdToRefDocId ?? {};
        // @ts-expect-error TS2322
        data.metadataDict = dataDict.metadataDict ?? {};
        const store = new SimpleVectorStore({
            data,
            embeddingModel
        });
        store.persistPath = persistPath;
        return store;
    }
    static fromDict(saveDict, embeddingModel) {
        const data = new SimpleVectorStoreData();
        data.embeddingDict = saveDict.embeddingDict;
        data.textIdToRefDocId = saveDict.textIdToRefDocId;
        data.metadataDict = saveDict.metadataDict;
        return new SimpleVectorStore({
            data,
            embeddingModel
        });
    }
    toDict() {
        return {
            embeddingDict: this.data.embeddingDict,
            textIdToRefDocId: this.data.textIdToRefDocId,
            metadataDict: this.data.metadataDict
        };
    }
}
class SimpleDocumentStore extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$storage$2f$doc$2d$store$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["KVDocumentStore"] {
    constructor(kvStore, namespace){
        kvStore = kvStore || new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$storage$2f$kv$2d$store$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SimpleKVStore"]();
        namespace = namespace || __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DEFAULT_NAMESPACE"];
        super(kvStore, namespace);
        this.kvStore = kvStore;
    }
    static async fromPersistDir(persistDir = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DEFAULT_PERSIST_DIR"], namespace) {
        const persistPath = __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__$3c$export__default__as__path$3e$__["path"].join(persistDir, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DEFAULT_DOC_STORE_PERSIST_FILENAME"]);
        return await SimpleDocumentStore.fromPersistPath(persistPath, namespace);
    }
    static async fromPersistPath(persistPath, namespace) {
        const simpleKVStore = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$storage$2f$kv$2d$store$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SimpleKVStore"].fromPersistPath(persistPath);
        return new SimpleDocumentStore(simpleKVStore, namespace);
    }
    async persist(persistPath = __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__$3c$export__default__as__path$3e$__["path"].join(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DEFAULT_PERSIST_DIR"], __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DEFAULT_DOC_STORE_PERSIST_FILENAME"])) {
        if (__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lodash$40$4$2e$17$2e$21$2f$node_modules$2f$lodash$2f$lodash$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].isObject(this.kvStore) && this.kvStore instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$storage$2f$kv$2d$store$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BaseInMemoryKVStore"]) {
            await this.kvStore.persist(persistPath);
        }
    }
    static fromDict(saveDict, namespace) {
        const simpleKVStore = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$storage$2f$kv$2d$store$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SimpleKVStore"].fromDict(saveDict);
        return new SimpleDocumentStore(simpleKVStore, namespace);
    }
    toDict() {
        if (__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lodash$40$4$2e$17$2e$21$2f$node_modules$2f$lodash$2f$lodash$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].isObject(this.kvStore) && this.kvStore instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$storage$2f$kv$2d$store$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SimpleKVStore"]) {
            return this.kvStore.toDict();
        }
        // If the kvstore is not a SimpleKVStore, you might want to throw an error or return a default value.
        throw new Error("KVStore is not a SimpleKVStore");
    }
}
async function storageContextFromDefaults({ docStore, indexStore, vectorStore, vectorStores, persistDir }) {
    vectorStores = vectorStores ?? {};
    if (!persistDir) {
        docStore = docStore ?? new SimpleDocumentStore();
        indexStore = indexStore ?? new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$storage$2f$index$2d$store$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SimpleIndexStore"]();
        if (!(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$schema$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ModalityType"].TEXT in vectorStores)) {
            vectorStores[__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$schema$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ModalityType"].TEXT] = vectorStore ?? new SimpleVectorStore();
        }
    } else {
        const embedModel = Settings.embedModel;
        docStore = docStore || await SimpleDocumentStore.fromPersistDir(persistDir, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DEFAULT_NAMESPACE"]);
        indexStore = indexStore || await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$storage$2f$index$2d$store$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SimpleIndexStore"].fromPersistDir(persistDir);
        if (!(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$schema$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ObjectType"].TEXT in vectorStores)) {
            vectorStores[__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$schema$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ModalityType"].TEXT] = vectorStore ?? await SimpleVectorStore.fromPersistDir(persistDir, embedModel);
        }
    }
    return {
        docStore,
        indexStore,
        vectorStores
    };
}
;
}}),
"[project]/node_modules/.pnpm/llamaindex@0.11.19_@llama-flow+core@0.4.4_next@15.3.4_react-dom@19.1.0_react@19.1.0__re_1d30be2795de4d1906fac150e4bc1023/node_modules/llamaindex/dist/index.react-server.js [app-route] (ecmascript) <module evaluation>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$global$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/global/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$indices$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/indices/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$node$2d$parser$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/node-parser/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$env$40$0$2e$1$2e$30$2f$node_modules$2f40$llamaindex$2f$env$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+env@0.1.30/node_modules/@llamaindex/env/dist/index.js [app-route] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$cloud$40$4$2e$0$2e$24_$40$llama$2d$flow$2b$core$40$0$2e$4$2e$4_next$40$15$2e$3$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1_80eeee9fe2264cd96589698f7343c8cb$2f$node_modules$2f40$llamaindex$2f$cloud$2f$reader$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+cloud@4.0.24_@llama-flow+core@0.4.4_next@15.3.4_react-dom@19.1.0_react@19.1_80eeee9fe2264cd96589698f7343c8cb/node_modules/@llamaindex/cloud/reader/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$agent$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/agent/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$chat$2d$engine$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/chat-engine/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$data$2d$structs$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/data-structs/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$embeddings$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/embeddings/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$llms$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/llms/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$memory$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/memory/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$postprocessor$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/postprocessor/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$prompts$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/prompts/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$query$2d$engine$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/query-engine/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$response$2d$synthesizers$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/response-synthesizers/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$retriever$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/retriever/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$schema$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/schema/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$storage$2f$chat$2d$store$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/storage/chat-store/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$storage$2f$doc$2d$store$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/storage/doc-store/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$storage$2f$index$2d$store$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/storage/index-store/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$storage$2f$kv$2d$store$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/storage/kv-store/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$utils$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/utils/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$llamaindex$40$0$2e$11$2e$19_$40$llama$2d$flow$2b$core$40$0$2e$4$2e$4_next$40$15$2e$3$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$re_1d30be2795de4d1906fac150e4bc1023$2f$node_modules$2f$llamaindex$2f$agent$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/llamaindex@0.11.19_@llama-flow+core@0.4.4_next@15.3.4_react-dom@19.1.0_react@19.1.0__re_1d30be2795de4d1906fac150e4bc1023/node_modules/llamaindex/agent/dist/index.js [app-route] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$llamaindex$40$0$2e$11$2e$19_$40$llama$2d$flow$2b$core$40$0$2e$4$2e$4_next$40$15$2e$3$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$re_1d30be2795de4d1906fac150e4bc1023$2f$node_modules$2f$llamaindex$2f$cloud$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/llamaindex@0.11.19_@llama-flow+core@0.4.4_next@15.3.4_react-dom@19.1.0_react@19.1.0__re_1d30be2795de4d1906fac150e4bc1023/node_modules/llamaindex/cloud/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$llamaindex$40$0$2e$11$2e$19_$40$llama$2d$flow$2b$core$40$0$2e$4$2e$4_next$40$15$2e$3$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$re_1d30be2795de4d1906fac150e4bc1023$2f$node_modules$2f$llamaindex$2f$engines$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/llamaindex@0.11.19_@llama-flow+core@0.4.4_next@15.3.4_react-dom@19.1.0_react@19.1.0__re_1d30be2795de4d1906fac150e4bc1023/node_modules/llamaindex/engines/dist/index.js [app-route] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$llamaindex$40$0$2e$11$2e$19_$40$llama$2d$flow$2b$core$40$0$2e$4$2e$4_next$40$15$2e$3$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$re_1d30be2795de4d1906fac150e4bc1023$2f$node_modules$2f$llamaindex$2f$evaluation$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/llamaindex@0.11.19_@llama-flow+core@0.4.4_next@15.3.4_react-dom@19.1.0_react@19.1.0__re_1d30be2795de4d1906fac150e4bc1023/node_modules/llamaindex/evaluation/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$llamaindex$40$0$2e$11$2e$19_$40$llama$2d$flow$2b$core$40$0$2e$4$2e$4_next$40$15$2e$3$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$re_1d30be2795de4d1906fac150e4bc1023$2f$node_modules$2f$llamaindex$2f$extractors$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/llamaindex@0.11.19_@llama-flow+core@0.4.4_next@15.3.4_react-dom@19.1.0_react@19.1.0__re_1d30be2795de4d1906fac150e4bc1023/node_modules/llamaindex/extractors/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$llamaindex$40$0$2e$11$2e$19_$40$llama$2d$flow$2b$core$40$0$2e$4$2e$4_next$40$15$2e$3$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$re_1d30be2795de4d1906fac150e4bc1023$2f$node_modules$2f$llamaindex$2f$indices$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/llamaindex@0.11.19_@llama-flow+core@0.4.4_next@15.3.4_react-dom@19.1.0_react@19.1.0__re_1d30be2795de4d1906fac150e4bc1023/node_modules/llamaindex/indices/dist/index.js [app-route] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$llamaindex$40$0$2e$11$2e$19_$40$llama$2d$flow$2b$core$40$0$2e$4$2e$4_next$40$15$2e$3$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$re_1d30be2795de4d1906fac150e4bc1023$2f$node_modules$2f$llamaindex$2f$ingestion$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/llamaindex@0.11.19_@llama-flow+core@0.4.4_next@15.3.4_react-dom@19.1.0_react@19.1.0__re_1d30be2795de4d1906fac150e4bc1023/node_modules/llamaindex/ingestion/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$llamaindex$40$0$2e$11$2e$19_$40$llama$2d$flow$2b$core$40$0$2e$4$2e$4_next$40$15$2e$3$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$re_1d30be2795de4d1906fac150e4bc1023$2f$node_modules$2f$llamaindex$2f$node$2d$parser$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/llamaindex@0.11.19_@llama-flow+core@0.4.4_next@15.3.4_react-dom@19.1.0_react@19.1.0__re_1d30be2795de4d1906fac150e4bc1023/node_modules/llamaindex/node-parser/dist/index.js [app-route] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$llamaindex$40$0$2e$11$2e$19_$40$llama$2d$flow$2b$core$40$0$2e$4$2e$4_next$40$15$2e$3$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$re_1d30be2795de4d1906fac150e4bc1023$2f$node_modules$2f$llamaindex$2f$objects$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/llamaindex@0.11.19_@llama-flow+core@0.4.4_next@15.3.4_react-dom@19.1.0_react@19.1.0__re_1d30be2795de4d1906fac150e4bc1023/node_modules/llamaindex/objects/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$llamaindex$40$0$2e$11$2e$19_$40$llama$2d$flow$2b$core$40$0$2e$4$2e$4_next$40$15$2e$3$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$re_1d30be2795de4d1906fac150e4bc1023$2f$node_modules$2f$llamaindex$2f$postprocessors$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/llamaindex@0.11.19_@llama-flow+core@0.4.4_next@15.3.4_react-dom@19.1.0_react@19.1.0__re_1d30be2795de4d1906fac150e4bc1023/node_modules/llamaindex/postprocessors/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$llamaindex$40$0$2e$11$2e$19_$40$llama$2d$flow$2b$core$40$0$2e$4$2e$4_next$40$15$2e$3$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$re_1d30be2795de4d1906fac150e4bc1023$2f$node_modules$2f$llamaindex$2f$selectors$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/llamaindex@0.11.19_@llama-flow+core@0.4.4_next@15.3.4_react-dom@19.1.0_react@19.1.0__re_1d30be2795de4d1906fac150e4bc1023/node_modules/llamaindex/selectors/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$llamaindex$2b$core$40$0$2e$6$2e$15$2f$node_modules$2f40$llamaindex$2f$core$2f$vector$2d$store$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@llamaindex+core@0.6.15/node_modules/@llamaindex/core/vector-store/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$lodash$40$4$2e$17$2e$21$2f$node_modules$2f$lodash$2f$lodash$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/lodash@4.17.21/node_modules/lodash/lodash.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$llamaindex$40$0$2e$11$2e$19_$40$llama$2d$flow$2b$core$40$0$2e$4$2e$4_next$40$15$2e$3$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$re_1d30be2795de4d1906fac150e4bc1023$2f$node_modules$2f$llamaindex$2f$tools$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/llamaindex@0.11.19_@llama-flow+core@0.4.4_next@15.3.4_react-dom@19.1.0_react@19.1.0__re_1d30be2795de4d1906fac150e4bc1023/node_modules/llamaindex/tools/dist/index.js [app-route] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$llamaindex$40$0$2e$11$2e$19_$40$llama$2d$flow$2b$core$40$0$2e$4$2e$4_next$40$15$2e$3$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$re_1d30be2795de4d1906fac150e4bc1023$2f$node_modules$2f$llamaindex$2f$dist$2f$index$2e$react$2d$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/llamaindex@0.11.19_@llama-flow+core@0.4.4_next@15.3.4_react-dom@19.1.0_react@19.1.0__re_1d30be2795de4d1906fac150e4bc1023/node_modules/llamaindex/dist/index.react-server.js [app-route] (ecmascript) <locals>");
}}),

};

//# sourceMappingURL=338c8_llamaindex_0eadecc7._.js.map