module.exports = {

"[project]/node_modules/.pnpm/uploadthing@7.7.3_next@15.3.4_react-dom@19.1.0_react@19.1.0__react@19.1.0__tailwindcss@4.1.11/node_modules/uploadthing/dist/package-Beb-iarE.js [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
//#region package.json
__turbopack_context__.s({
    "version": (()=>version)
});
var version = "7.7.3";
;
 //# sourceMappingURL=package-Beb-iarE.js.map
}}),
"[project]/node_modules/.pnpm/uploadthing@7.7.3_next@15.3.4_react-dom@19.1.0_react@19.1.0__react@19.1.0__tailwindcss@4.1.11/node_modules/uploadthing/dist/deprecations-pLmw6Ytd.js [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
//#region src/_internal/deprecations.ts
__turbopack_context__.s({
    "logDeprecationWarning": (()=>logDeprecationWarning)
});
const logDeprecationWarning = (message)=>{
    console.warn(`⚠️ [uploadthing][deprecated] ${message}`);
};
;
 //# sourceMappingURL=deprecations-pLmw6Ytd.js.map
}}),
"[project]/node_modules/.pnpm/uploadthing@7.7.3_next@15.3.4_react-dom@19.1.0_react@19.1.0__react@19.1.0__tailwindcss@4.1.11/node_modules/uploadthing/dist/shared-schemas-BIFDoqPF.js [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "ActionType": (()=>ActionType),
    "CallbackResultResponse": (()=>CallbackResultResponse),
    "MetadataFetchResponse": (()=>MetadataFetchResponse),
    "MetadataFetchStreamPart": (()=>MetadataFetchStreamPart),
    "UploadActionPayload": (()=>UploadActionPayload),
    "UploadThingHook": (()=>UploadThingHook),
    "UploadThingToken$1": (()=>UploadThingToken),
    "UploadedFileData$1": (()=>UploadedFileData)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$uploadthing$2b$shared$40$7$2e$1$2e$9$2f$node_modules$2f40$uploadthing$2f$shared$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@uploadthing+shared@7.1.9/node_modules/@uploadthing/shared/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Schema$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/effect@3.16.8/node_modules/effect/dist/esm/Schema.js [app-route] (ecmascript) <locals>");
;
;
//#region src/_internal/shared-schemas.ts
const ContentDispositionSchema = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Schema$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Literal"])(...__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$uploadthing$2b$shared$40$7$2e$1$2e$9$2f$node_modules$2f40$uploadthing$2f$shared$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ValidContentDispositions"]);
const ACLSchema = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Schema$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Literal"])(...__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$uploadthing$2b$shared$40$7$2e$1$2e$9$2f$node_modules$2f40$uploadthing$2f$shared$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ValidACLs"]);
/**
* Valid options for the `?actionType` query param
*/ const ActionType = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Schema$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Literal"])("upload");
/**
* Valid options for the `uploadthing-hook` header
* for requests coming from UT server
*/ const UploadThingHook = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Schema$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Literal"])("callback", "error");
/**
* =============================================================================
* =========================== Configuration ===================================
* =============================================================================
*/ const DecodeString = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Schema$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["transform"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Schema$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Uint8ArrayFromSelf"], __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Schema$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["String"], {
    decode: (data)=>new TextDecoder().decode(data),
    encode: (data)=>new TextEncoder().encode(data)
});
const ParsedToken = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Schema$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Struct"])({
    apiKey: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Schema$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Redacted"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Schema$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["String"].pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Schema$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["startsWith"])("sk_"))),
    appId: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Schema$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["String"],
    regions: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Schema$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["NonEmptyArray"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Schema$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["String"]),
    ingestHost: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Schema$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["String"].pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Schema$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["optionalWith"])({
        default: ()=>"ingest.uploadthing.com"
    }))
});
const UploadThingToken = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Schema$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Uint8ArrayFromBase64"].pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Schema$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["compose"])(DecodeString), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Schema$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["compose"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Schema$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["parseJson"])(ParsedToken)));
/**
* =============================================================================
* ======================== File Type Hierarchy ===============================
* =============================================================================
*/ /**
* Properties from the web File object, this is what the client sends when initiating an upload
*/ var FileUploadData = class extends (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Schema$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Class"])("FileUploadData")({
    name: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Schema$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["String"],
    size: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Schema$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Number"],
    type: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Schema$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["String"],
    lastModified: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Schema$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Number"].pipe(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Schema$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["optional"])
}) {
};
/**
* `.middleware()` can add a customId to the incoming file data
*/ var FileUploadDataWithCustomId = class extends FileUploadData.extend("FileUploadDataWithCustomId")({
    customId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Schema$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["NullOr"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Schema$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["String"])
}) {
};
/**
* When files are uploaded, we get back
* - a key
* - URLs for the file
* - the hash (md5-hex) of the uploaded file's contents
*/ var UploadedFileData = class extends FileUploadDataWithCustomId.extend("UploadedFileData")({
    key: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Schema$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["String"],
    url: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Schema$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["String"],
    appUrl: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Schema$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["String"],
    ufsUrl: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Schema$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["String"],
    fileHash: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Schema$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["String"]
}) {
};
var MetadataFetchStreamPart = class extends (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Schema$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Class"])("MetadataFetchStreamPart")({
    payload: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Schema$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["String"],
    signature: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Schema$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["String"],
    hook: UploadThingHook
}) {
};
var MetadataFetchResponse = class extends (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Schema$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Class"])("MetadataFetchResponse")({
    ok: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Schema$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Boolean"]
}) {
};
var CallbackResultResponse = class extends (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Schema$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Class"])("CallbackResultResponse")({
    ok: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Schema$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Boolean"]
}) {
};
/**
* =============================================================================
* ======================== Client Action Payloads ============================
* =============================================================================
*/ var UploadActionPayload = class extends (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Schema$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Class"])("UploadActionPayload")({
    files: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Schema$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Array"])(FileUploadData),
    input: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Schema$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Unknown"]
}) {
};
;
 //# sourceMappingURL=shared-schemas-BIFDoqPF.js.map
}}),
"[project]/node_modules/.pnpm/uploadthing@7.7.3_next@15.3.4_react-dom@19.1.0_react@19.1.0__react@19.1.0__tailwindcss@4.1.11/node_modules/uploadthing/dist/upload-builder-e0_p9NOT.js [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "AdapterArguments": (()=>AdapterArguments),
    "ApiUrl": (()=>ApiUrl),
    "IngestUrl": (()=>IngestUrl),
    "UTFiles$1": (()=>UTFiles),
    "UTRegion$1": (()=>UTRegion),
    "UTToken": (()=>UTToken),
    "UfsAppIdLocation": (()=>UfsAppIdLocation),
    "UfsHost": (()=>UfsHost),
    "configProvider": (()=>configProvider),
    "createBuilder": (()=>createBuilder),
    "createRequestHandler": (()=>createRequestHandler),
    "extractRouterConfig": (()=>extractRouterConfig),
    "logHttpClientError": (()=>logHttpClientError),
    "logHttpClientResponse": (()=>logHttpClientResponse),
    "makeAdapterHandler": (()=>makeAdapterHandler),
    "makeRuntime": (()=>makeRuntime)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$uploadthing$40$7$2e$7$2e$3_next$40$15$2e$3$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0_$5f$tailwindcss$40$4$2e$1$2e$11$2f$node_modules$2f$uploadthing$2f$dist$2f$package$2d$Beb$2d$iarE$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/uploadthing@7.7.3_next@15.3.4_react-dom@19.1.0_react@19.1.0__react@19.1.0__tailwindcss@4.1.11/node_modules/uploadthing/dist/package-Beb-iarE.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$uploadthing$40$7$2e$7$2e$3_next$40$15$2e$3$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0_$5f$tailwindcss$40$4$2e$1$2e$11$2f$node_modules$2f$uploadthing$2f$dist$2f$deprecations$2d$pLmw6Ytd$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/uploadthing@7.7.3_next@15.3.4_react-dom@19.1.0_react@19.1.0__react@19.1.0__tailwindcss@4.1.11/node_modules/uploadthing/dist/deprecations-pLmw6Ytd.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$uploadthing$40$7$2e$7$2e$3_next$40$15$2e$3$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0_$5f$tailwindcss$40$4$2e$1$2e$11$2f$node_modules$2f$uploadthing$2f$dist$2f$shared$2d$schemas$2d$BIFDoqPF$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/uploadthing@7.7.3_next@15.3.4_react-dom@19.1.0_react@19.1.0__react@19.1.0__tailwindcss@4.1.11/node_modules/uploadthing/dist/shared-schemas-BIFDoqPF.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$uploadthing$2b$shared$40$7$2e$1$2e$9$2f$node_modules$2f40$uploadthing$2f$shared$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@uploadthing+shared@7.1.9/node_modules/@uploadthing/shared/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/effect@3.16.8/node_modules/effect/dist/esm/Effect.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$effect$2b$platform$40$0$2e$85$2e$2_effect$40$3$2e$16$2e$8$2f$node_modules$2f40$effect$2f$platform$2f$dist$2f$esm$2f$HttpApp$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@effect+platform@0.85.2_effect@3.16.8/node_modules/@effect/platform/dist/esm/HttpApp.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$effect$2b$platform$40$0$2e$85$2e$2_effect$40$3$2e$16$2e$8$2f$node_modules$2f40$effect$2f$platform$2f$dist$2f$esm$2f$HttpBody$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@effect+platform@0.85.2_effect@3.16.8/node_modules/@effect/platform/dist/esm/HttpBody.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$effect$2b$platform$40$0$2e$85$2e$2_effect$40$3$2e$16$2e$8$2f$node_modules$2f40$effect$2f$platform$2f$dist$2f$esm$2f$HttpClient$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@effect+platform@0.85.2_effect@3.16.8/node_modules/@effect/platform/dist/esm/HttpClient.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$effect$2b$platform$40$0$2e$85$2e$2_effect$40$3$2e$16$2e$8$2f$node_modules$2f40$effect$2f$platform$2f$dist$2f$esm$2f$HttpClientRequest$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@effect+platform@0.85.2_effect@3.16.8/node_modules/@effect/platform/dist/esm/HttpClientRequest.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$effect$2b$platform$40$0$2e$85$2e$2_effect$40$3$2e$16$2e$8$2f$node_modules$2f40$effect$2f$platform$2f$dist$2f$esm$2f$HttpIncomingMessage$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@effect+platform@0.85.2_effect@3.16.8/node_modules/@effect/platform/dist/esm/HttpIncomingMessage.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$effect$2b$platform$40$0$2e$85$2e$2_effect$40$3$2e$16$2e$8$2f$node_modules$2f40$effect$2f$platform$2f$dist$2f$esm$2f$HttpClientResponse$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@effect+platform@0.85.2_effect@3.16.8/node_modules/@effect/platform/dist/esm/HttpClientResponse.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$effect$2b$platform$40$0$2e$85$2e$2_effect$40$3$2e$16$2e$8$2f$node_modules$2f40$effect$2f$platform$2f$dist$2f$esm$2f$HttpRouter$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@effect+platform@0.85.2_effect@3.16.8/node_modules/@effect/platform/dist/esm/HttpRouter.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$effect$2b$platform$40$0$2e$85$2e$2_effect$40$3$2e$16$2e$8$2f$node_modules$2f40$effect$2f$platform$2f$dist$2f$esm$2f$HttpServerRequest$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@effect+platform@0.85.2_effect@3.16.8/node_modules/@effect/platform/dist/esm/HttpServerRequest.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$effect$2b$platform$40$0$2e$85$2e$2_effect$40$3$2e$16$2e$8$2f$node_modules$2f40$effect$2f$platform$2f$dist$2f$esm$2f$HttpServerResponse$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@effect+platform@0.85.2_effect@3.16.8/node_modules/@effect/platform/dist/esm/HttpServerResponse.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Config$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/effect@3.16.8/node_modules/effect/dist/esm/Config.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Context$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/effect@3.16.8/node_modules/effect/dist/esm/Context.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Match$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/effect@3.16.8/node_modules/effect/dist/esm/Match.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Redacted$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/effect@3.16.8/node_modules/effect/dist/esm/Redacted.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Schema$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/effect@3.16.8/node_modules/effect/dist/esm/Schema.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$ConfigProvider$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/effect@3.16.8/node_modules/effect/dist/esm/ConfigProvider.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Stream$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/effect@3.16.8/node_modules/effect/dist/esm/Stream.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$ConfigError$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/effect@3.16.8/node_modules/effect/dist/esm/ConfigError.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Either$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/effect@3.16.8/node_modules/effect/dist/esm/Either.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Layer$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/effect@3.16.8/node_modules/effect/dist/esm/Layer.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Logger$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/effect@3.16.8/node_modules/effect/dist/esm/Logger.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$LogLevel$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/effect@3.16.8/node_modules/effect/dist/esm/LogLevel.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Cause$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/effect@3.16.8/node_modules/effect/dist/esm/Cause.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Data$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/effect@3.16.8/node_modules/effect/dist/esm/Data.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/effect@3.16.8/node_modules/effect/dist/esm/Runtime.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$effect$2b$platform$40$0$2e$85$2e$2_effect$40$3$2e$16$2e$8$2f$node_modules$2f40$effect$2f$platform$2f$dist$2f$esm$2f$FetchHttpClient$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@effect+platform@0.85.2_effect@3.16.8/node_modules/@effect/platform/dist/esm/FetchHttpClient.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$effect$2b$platform$40$0$2e$85$2e$2_effect$40$3$2e$16$2e$8$2f$node_modules$2f40$effect$2f$platform$2f$dist$2f$esm$2f$Headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@effect+platform@0.85.2_effect@3.16.8/node_modules/@effect/platform/dist/esm/Headers.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$FiberRef$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/effect@3.16.8/node_modules/effect/dist/esm/FiberRef.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$ManagedRuntime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/effect@3.16.8/node_modules/effect/dist/esm/ManagedRuntime.js [app-route] (ecmascript)");
const __TURBOPACK__import$2e$meta__ = {
    get url () {
        return `file://${__turbopack_context__.P("node_modules/.pnpm/uploadthing@7.7.3_next@15.3.4_react-dom@19.1.0_react@19.1.0__react@19.1.0__tailwindcss@4.1.11/node_modules/uploadthing/dist/upload-builder-e0_p9NOT.js")}`;
    }
};
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
//#region src/_internal/config.ts
/**
* Merge in `import.meta.env` to the built-in `process.env` provider
* Prefix keys with `UPLOADTHING_` so we can reference just the name.
* @example
* process.env.UPLOADTHING_TOKEN = "foo"
* Config.string("token"); // Config<"foo">
*/ const envProvider = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$ConfigProvider$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["fromEnv"])().pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$ConfigProvider$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["orElse"])(()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$ConfigProvider$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["fromMap"])(new Map(Object.entries((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$uploadthing$2b$shared$40$7$2e$1$2e$9$2f$node_modules$2f40$uploadthing$2f$shared$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["filterDefinedObjectValues"])(__TURBOPACK__import$2e$meta__?.env ?? {}))), {
        pathDelim: "_"
    })), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$ConfigProvider$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["nested"])("uploadthing"), __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$ConfigProvider$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["constantCase"]);
/**
* Config provider that merges the options from the object
* and environment variables prefixed with `UPLOADTHING_`.
* @remarks Options take precedence over environment variables.
*/ const configProvider = (options)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$ConfigProvider$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["fromJson"])(options ?? {}).pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$ConfigProvider$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["orElse"])(()=>envProvider));
const IsDevelopment = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Config$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["boolean"])("isDev").pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Config$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["orElse"])(()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Config$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["succeed"])(typeof process !== "undefined" ? ("TURBOPACK compile-time value", "development") : void 0).pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Config$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["map"])((_)=>_ === "development"))), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Config$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["withDefault"])(false));
const UTToken = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Schema$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Config"])("token", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$uploadthing$40$7$2e$7$2e$3_next$40$15$2e$3$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0_$5f$tailwindcss$40$4$2e$1$2e$11$2f$node_modules$2f$uploadthing$2f$dist$2f$shared$2d$schemas$2d$BIFDoqPF$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["UploadThingToken$1"]).pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["catchTags"])({
    ConfigError: (e)=>new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$uploadthing$2b$shared$40$7$2e$1$2e$9$2f$node_modules$2f40$uploadthing$2f$shared$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["UploadThingError"]({
            code: e._op === "InvalidData" ? "INVALID_SERVER_CONFIG" : "MISSING_ENV",
            message: e._op === "InvalidData" ? "Invalid token. A token is a base64 encoded JSON object matching { apiKey: string, appId: string, regions: string[] }." : "Missing token. Please set the `UPLOADTHING_TOKEN` environment variable or provide a token manually through config.",
            cause: e
        })
}));
const ApiUrl = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Config$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"])("apiUrl").pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Config$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["withDefault"])("https://api.uploadthing.com"), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Config$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["mapAttempt"])((_)=>new URL(_)), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Config$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["map"])((url)=>url.href.replace(/\/$/, "")));
const IngestUrl = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["fn"])(function*(preferredRegion) {
    const { regions, ingestHost } = yield* UTToken;
    const region = preferredRegion ? regions.find((r)=>r === preferredRegion) ?? regions[0] : regions[0];
    return yield* (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Config$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"])("ingestUrl").pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Config$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["withDefault"])(`https://${region}.${ingestHost}`), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Config$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["mapAttempt"])((_)=>new URL(_)), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Config$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["map"])((url)=>url.href.replace(/\/$/, "")));
});
const UtfsHost = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Config$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"])("utfsHost").pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Config$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["withDefault"])("utfs.io"));
const UfsHost = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Config$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"])("ufsHost").pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Config$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["withDefault"])("ufs.sh"));
const UfsAppIdLocation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Config$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["literal"])("subdomain", "path")("ufsAppIdLocation").pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Config$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["withDefault"])("subdomain"));
//#endregion
//#region src/_internal/error-formatter.ts
function defaultErrorFormatter(error) {
    return {
        message: error.message
    };
}
function formatError(error, router) {
    const firstSlug = Object.keys(router)[0];
    const errorFormatter = firstSlug ? router[firstSlug]?.errorFormatter ?? defaultErrorFormatter : defaultErrorFormatter;
    return errorFormatter(error);
}
//#endregion
//#region src/_internal/jsonl.ts
const handleJsonLineStream = (schema, onChunk)=>(stream)=>{
        let buf = "";
        return stream.pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Stream$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["decodeText"])(), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Stream$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["mapEffect"])((chunk)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["gen"])(function*() {
                buf += chunk;
                const parts = buf.split("\n");
                const validChunks = [];
                for (const part of parts)try {
                    validChunks.push(JSON.parse(part));
                    buf = buf.slice(part.length + 1);
                } catch  {}
                yield* (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logDebug"])("Received chunks").pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["annotateLogs"])("chunk", chunk), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["annotateLogs"])("parsedChunks", validChunks), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["annotateLogs"])("buf", buf));
                return validChunks;
            })), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Stream$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["mapEffect"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Schema$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["decodeUnknown"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Schema$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Array"])(schema))), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Stream$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["mapEffect"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["forEach"])((part)=>onChunk(part))), __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Stream$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["runDrain"], (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["withLogSpan"])("handleJsonLineStream"));
    };
//#endregion
//#region src/_internal/logger.ts
/**
* Config.logLevel counter-intuitively accepts LogLevel["label"]
* instead of a literal, ripping it and changing to accept literal
* Effect 4.0 will change this to accept a literal and then we can
* remove this and go back to the built-in validator.
*/ const ConfigLogLevel = (name)=>{
    const config = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Config$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["mapOrFail"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Config$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"])(), (literal)=>{
        const level = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$LogLevel$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["allLevels"].find((level$1)=>level$1._tag === literal);
        return level === void 0 ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Either$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["left"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$ConfigError$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["InvalidData"])([], `Expected a log level but received ${literal}`)) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Either$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["right"])(level);
    });
    return name === void 0 ? config : (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Config$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["nested"])(config, name);
};
const withMinimalLogLevel = ConfigLogLevel("logLevel").pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Config$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["withDefault"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$LogLevel$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Info"]), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["andThen"])((level)=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Logger$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__.minimumLogLevel(level)), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["tapError"])((e)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logError"])("Invalid log level").pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["annotateLogs"])("error", e))), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["catchTag"])("ConfigError", (e)=>new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$uploadthing$2b$shared$40$7$2e$1$2e$9$2f$node_modules$2f40$uploadthing$2f$shared$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["UploadThingError"]({
        code: "INVALID_SERVER_CONFIG",
        message: "Invalid server configuration",
        cause: e
    })), __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Layer$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["unwrapEffect"]);
const LogFormat = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Config$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["literal"])("json", "logFmt", "structured", "pretty")("logFormat");
const withLogFormat = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["gen"])(function*() {
    const isDev = yield* IsDevelopment;
    const logFormat = yield* LogFormat.pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Config$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["withDefault"])(isDev ? "pretty" : "json"));
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Logger$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__[logFormat];
}).pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["catchTag"])("ConfigError", (e)=>new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$uploadthing$2b$shared$40$7$2e$1$2e$9$2f$node_modules$2f40$uploadthing$2f$shared$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["UploadThingError"]({
        code: "INVALID_SERVER_CONFIG",
        message: "Invalid server configuration",
        cause: e
    })), __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Layer$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["unwrapEffect"]);
const logHttpClientResponse = (message, opts)=>{
    const mixin = opts?.mixin ?? "json";
    const level = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$LogLevel$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["fromLiteral"])(opts?.level ?? "Debug");
    return (response)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["flatMap"])(mixin !== "None" ? response[mixin] : __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["void"], ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logWithLevel"])(level, `${message} (${response.status})`).pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["annotateLogs"])("response", response)));
};
const logHttpClientError = (message)=>(err)=>err._tag === "ResponseError" ? logHttpClientResponse(message, {
            level: "Error"
        })(err.response) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logError"])(message).pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["annotateLogs"])("error", err));
//#endregion
//#region src/_internal/parser.ts
var ParserError = class extends (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Data$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["TaggedError"])("ParserError") {
    message = "Input validation failed. The original error with it's validation issues is in the error cause.";
};
function getParseFn(parser) {
    if ("parseAsync" in parser && typeof parser.parseAsync === "function") /**
	* Zod
	* TODO (next major): Consider wrapping ZodError in ParserError
	*/ return parser.parseAsync;
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Schema$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["isSchema"])(parser)) /**
	* Effect Schema
	*/ return (value)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Schema$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["decodeUnknownPromise"])(parser)(value).catch((error)=>{
            throw new ParserError({
                cause: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Cause$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["squash"])(error[__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Runtime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["FiberFailureCauseId"]])
            });
        });
    if ("~standard" in parser) /**
	* Standard Schema
	* TODO (next major): Consider moving this to the top of the function
	*/ return async (value)=>{
        const result = await parser["~standard"].validate(value);
        if (result.issues) throw new ParserError({
            cause: result.issues
        });
        return result.value;
    };
    throw new Error("Invalid parser");
}
//#endregion
//#region src/_internal/route-config.ts
var FileSizeMismatch = class extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Data$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Error"] {
    _tag = "FileSizeMismatch";
    name = "FileSizeMismatchError";
    constructor(type, max, actual){
        const reason = `You uploaded a ${type} file that was ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$uploadthing$2b$shared$40$7$2e$1$2e$9$2f$node_modules$2f40$uploadthing$2f$shared$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["bytesToFileSize"])(actual)}, but the limit for that type is ${max}`;
        super({
            reason
        });
    }
};
var FileCountMismatch = class extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Data$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Error"] {
    _tag = "FileCountMismatch";
    name = "FileCountMismatchError";
    constructor(type, boundtype, bound, actual){
        const reason = `You uploaded ${actual} file(s) of type '${type}', but the ${boundtype} for that type is ${bound}`;
        super({
            reason
        });
    }
};
const assertFilesMeetConfig = (files, routeConfig)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["gen"])(function*() {
        const counts = {};
        for (const file of files){
            const type = yield* (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$uploadthing$2b$shared$40$7$2e$1$2e$9$2f$node_modules$2f40$uploadthing$2f$shared$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["matchFileType"])(file, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$uploadthing$2b$shared$40$7$2e$1$2e$9$2f$node_modules$2f40$uploadthing$2f$shared$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["objectKeys"])(routeConfig));
            counts[type] = (counts[type] ?? 0) + 1;
            const sizeLimit = routeConfig[type]?.maxFileSize;
            if (!sizeLimit) return yield* new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$uploadthing$2b$shared$40$7$2e$1$2e$9$2f$node_modules$2f40$uploadthing$2f$shared$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["InvalidRouteConfigError"](type, "maxFileSize");
            const sizeLimitBytes = yield* (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$uploadthing$2b$shared$40$7$2e$1$2e$9$2f$node_modules$2f40$uploadthing$2f$shared$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["fileSizeToBytes"])(sizeLimit);
            if (file.size > sizeLimitBytes) return yield* new FileSizeMismatch(type, sizeLimit, file.size);
        }
        for(const _key in counts){
            const key = _key;
            const config = routeConfig[key];
            if (!config) return yield* new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$uploadthing$2b$shared$40$7$2e$1$2e$9$2f$node_modules$2f40$uploadthing$2f$shared$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["InvalidRouteConfigError"](key);
            const count = counts[key];
            const min = config.minFileCount;
            const max = config.maxFileCount;
            if (min > max) return yield* new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$uploadthing$2b$shared$40$7$2e$1$2e$9$2f$node_modules$2f40$uploadthing$2f$shared$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["UploadThingError"]({
                code: "BAD_REQUEST",
                message: "Invalid config during file count - minFileCount > maxFileCount",
                cause: `minFileCount must be less than maxFileCount for key ${key}. got: ${min} > ${max}`
            });
            if (count != null && count < min) return yield* new FileCountMismatch(key, "minimum", min, count);
            if (count != null && count > max) return yield* new FileCountMismatch(key, "maximum", max, count);
        }
        return null;
    });
const extractRouterConfig = (router)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["forEach"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$uploadthing$2b$shared$40$7$2e$1$2e$9$2f$node_modules$2f40$uploadthing$2f$shared$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["objectKeys"])(router), (slug)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["map"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$uploadthing$2b$shared$40$7$2e$1$2e$9$2f$node_modules$2f40$uploadthing$2f$shared$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["fillInputRouteConfig"])(router[slug].routerConfig), (config)=>({
                slug,
                config
            })));
//#endregion
//#region src/_internal/runtime.ts
const makeRuntime = (fetch, config)=>{
    const fetchHttpClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Layer$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["provideMerge"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$effect$2b$platform$40$0$2e$85$2e$2_effect$40$3$2e$16$2e$8$2f$node_modules$2f40$effect$2f$platform$2f$dist$2f$esm$2f$FetchHttpClient$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["layer"], (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Layer$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["succeed"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$effect$2b$platform$40$0$2e$85$2e$2_effect$40$3$2e$16$2e$8$2f$node_modules$2f40$effect$2f$platform$2f$dist$2f$esm$2f$FetchHttpClient$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Fetch"], fetch));
    const withRedactedHeaders = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Layer$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["effectDiscard"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$FiberRef$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["update"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$effect$2b$platform$40$0$2e$85$2e$2_effect$40$3$2e$16$2e$8$2f$node_modules$2f40$effect$2f$platform$2f$dist$2f$esm$2f$Headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["currentRedactedNames"], (_)=>_.concat([
            "x-uploadthing-api-key"
        ])));
    const layer = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Layer$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["provide"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Layer$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["mergeAll"])(withLogFormat, withMinimalLogLevel, fetchHttpClient, withRedactedHeaders), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Layer$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["setConfigProvider"])(configProvider(config)));
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$ManagedRuntime$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["make"])(layer);
};
//#endregion
//#region src/_internal/types.ts
/**
* Marker used to select the region based on the incoming request
*/ const UTRegion = Symbol("uploadthing-region-symbol");
/**
* Marker used to append a `customId` to the incoming file data in `.middleware()`
* @example
* ```ts
* .middleware((opts) => {
*   return {
*     [UTFiles]: opts.files.map((file) => ({
*       ...file,
*       customId: generateId(),
*     }))
*   };
* })
* ```
*/ const UTFiles = Symbol("uploadthing-custom-id-symbol");
//#endregion
//#region src/_internal/handler.ts
var AdapterArguments = class extends (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Context$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Tag"])("uploadthing/AdapterArguments")() {
};
/**
* Create a request handler adapter for any framework or server library.
* Refer to the existing adapters for examples on how to use this function.
* @public
*
* @param makeAdapterArgs - Function that takes the args from your framework and returns an Effect that resolves to the adapter args.
* These args are passed to the `.middleware`, `.onUploadComplete`, and `.onUploadError` hooks.
* @param toRequest - Function that takes the args from your framework and returns an Effect that resolves to a web Request object.
* @param opts - The router config and other options that are normally passed to `createRequestHandler` of official adapters
* @param beAdapter - [Optional] The adapter name of the adapter, used for telemetry purposes
* @returns A function that takes the args from your framework and returns a promise that resolves to a Response object.
*/ const makeAdapterHandler = (makeAdapterArgs, toRequest, opts, beAdapter)=>{
    const managed = makeRuntime(opts.config?.fetch, opts.config);
    const handle = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["promise"])(()=>managed.runtime().then(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$effect$2b$platform$40$0$2e$85$2e$2_effect$40$3$2e$16$2e$8$2f$node_modules$2f40$effect$2f$platform$2f$dist$2f$esm$2f$HttpApp$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["toWebHandlerRuntime"]));
    const app = (...args)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["map"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["promise"])(()=>managed.runPromise(createRequestHandler(opts, beAdapter ?? "custom"))), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["provideServiceEffect"])(AdapterArguments, makeAdapterArgs(...args)));
    return async (...args)=>{
        const result = await handle.pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ap"])(app(...args)), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ap"])(toRequest(...args)), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["withLogSpan"])("requestHandler"), managed.runPromise);
        return result;
    };
};
const createRequestHandler = (opts, beAdapter)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["gen"])(function*() {
        const isDevelopment = yield* IsDevelopment;
        const routerConfig = yield* extractRouterConfig(opts.router);
        const handleDaemon = (()=>{
            if (opts.config?.handleDaemonPromise) return opts.config.handleDaemonPromise;
            return isDevelopment ? "void" : "await";
        })();
        if (isDevelopment && handleDaemon === "await") return yield* new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$uploadthing$2b$shared$40$7$2e$1$2e$9$2f$node_modules$2f40$uploadthing$2f$shared$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["UploadThingError"]({
            code: "INVALID_SERVER_CONFIG",
            message: "handleDaemonPromise: \"await\" is forbidden in development."
        });
        const GET = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["gen"])(function*() {
            return yield* (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$effect$2b$platform$40$0$2e$85$2e$2_effect$40$3$2e$16$2e$8$2f$node_modules$2f40$effect$2f$platform$2f$dist$2f$esm$2f$HttpServerResponse$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["json"])(routerConfig);
        });
        const POST = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["gen"])(function*() {
            const { "uploadthing-hook": uploadthingHook, "x-uploadthing-package": fePackage, "x-uploadthing-version": clientVersion } = yield* (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$effect$2b$platform$40$0$2e$85$2e$2_effect$40$3$2e$16$2e$8$2f$node_modules$2f40$effect$2f$platform$2f$dist$2f$esm$2f$HttpServerRequest$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["schemaHeaders"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Schema$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Struct"])({
                "uploadthing-hook": __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$uploadthing$40$7$2e$7$2e$3_next$40$15$2e$3$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0_$5f$tailwindcss$40$4$2e$1$2e$11$2f$node_modules$2f$uploadthing$2f$dist$2f$shared$2d$schemas$2d$BIFDoqPF$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["UploadThingHook"].pipe(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Schema$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["optional"]),
                "x-uploadthing-package": __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Schema$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["String"].pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Schema$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["optionalWith"])({
                    default: ()=>"unknown"
                })),
                "x-uploadthing-version": __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Schema$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["String"].pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Schema$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["optionalWith"])({
                    default: ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$uploadthing$40$7$2e$7$2e$3_next$40$15$2e$3$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0_$5f$tailwindcss$40$4$2e$1$2e$11$2f$node_modules$2f$uploadthing$2f$dist$2f$package$2d$Beb$2d$iarE$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["version"]
                }))
            }));
            if (clientVersion !== __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$uploadthing$40$7$2e$7$2e$3_next$40$15$2e$3$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0_$5f$tailwindcss$40$4$2e$1$2e$11$2f$node_modules$2f$uploadthing$2f$dist$2f$package$2d$Beb$2d$iarE$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["version"]) {
                const serverVersion = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$uploadthing$40$7$2e$7$2e$3_next$40$15$2e$3$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0_$5f$tailwindcss$40$4$2e$1$2e$11$2f$node_modules$2f$uploadthing$2f$dist$2f$package$2d$Beb$2d$iarE$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["version"];
                yield* (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logWarning"])("Client version mismatch. Things may not work as expected, please sync your versions to ensure compatibility.").pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["annotateLogs"])({
                    clientVersion,
                    serverVersion
                }));
            }
            const { slug, actionType } = yield* (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$effect$2b$platform$40$0$2e$85$2e$2_effect$40$3$2e$16$2e$8$2f$node_modules$2f40$effect$2f$platform$2f$dist$2f$esm$2f$HttpRouter$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["schemaParams"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Schema$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Struct"])({
                actionType: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$uploadthing$40$7$2e$7$2e$3_next$40$15$2e$3$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0_$5f$tailwindcss$40$4$2e$1$2e$11$2f$node_modules$2f$uploadthing$2f$dist$2f$shared$2d$schemas$2d$BIFDoqPF$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ActionType"].pipe(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Schema$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["optional"]),
                slug: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Schema$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["String"]
            }));
            const uploadable = opts.router[slug];
            if (!uploadable) {
                const msg = `No file route found for slug ${slug}`;
                yield* (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logError"])(msg);
                return yield* new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$uploadthing$2b$shared$40$7$2e$1$2e$9$2f$node_modules$2f40$uploadthing$2f$shared$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["UploadThingError"]({
                    code: "NOT_FOUND",
                    message: msg
                });
            }
            const { body, fiber } = yield* (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Match$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["value"])({
                actionType,
                uploadthingHook
            }).pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Match$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["when"])({
                actionType: "upload",
                uploadthingHook: void 0
            }, ()=>handleUploadAction({
                    uploadable,
                    fePackage,
                    beAdapter,
                    slug
                })), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Match$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["when"])({
                actionType: void 0,
                uploadthingHook: "callback"
            }, ()=>handleCallbackRequest({
                    uploadable,
                    fePackage,
                    beAdapter
                })), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Match$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["when"])({
                actionType: void 0,
                uploadthingHook: "error"
            }, ()=>handleErrorRequest({
                    uploadable
                })), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Match$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["orElse"])(()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["succeed"])({
                    body: null,
                    fiber: null
                })));
            if (fiber) {
                yield* (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logDebug"])("Running fiber as daemon").pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["annotateLogs"])("handleDaemon", handleDaemon));
                if (handleDaemon === "void") {} else if (handleDaemon === "await") yield* fiber.await;
                else if (typeof handleDaemon === "function") handleDaemon((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["runPromise"])(fiber.await));
            }
            yield* (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logDebug"])("Sending response").pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["annotateLogs"])("body", body));
            return yield* (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$effect$2b$platform$40$0$2e$85$2e$2_effect$40$3$2e$16$2e$8$2f$node_modules$2f40$effect$2f$platform$2f$dist$2f$esm$2f$HttpServerResponse$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["json"])(body);
        }).pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["catchTags"])({
            ParseError: (e)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$effect$2b$platform$40$0$2e$85$2e$2_effect$40$3$2e$16$2e$8$2f$node_modules$2f40$effect$2f$platform$2f$dist$2f$esm$2f$HttpServerResponse$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["json"])(formatError(new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$uploadthing$2b$shared$40$7$2e$1$2e$9$2f$node_modules$2f40$uploadthing$2f$shared$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["UploadThingError"]({
                    code: "BAD_REQUEST",
                    message: "Invalid input",
                    cause: e.message
                }), opts.router), {
                    status: 400
                }),
            UploadThingError: (e)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$effect$2b$platform$40$0$2e$85$2e$2_effect$40$3$2e$16$2e$8$2f$node_modules$2f40$effect$2f$platform$2f$dist$2f$esm$2f$HttpServerResponse$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["json"])(formatError(e, opts.router), {
                    status: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$uploadthing$2b$shared$40$7$2e$1$2e$9$2f$node_modules$2f40$uploadthing$2f$shared$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getStatusCodeFromError"])(e)
                })
        }));
        const appendResponseHeaders = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["map"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$effect$2b$platform$40$0$2e$85$2e$2_effect$40$3$2e$16$2e$8$2f$node_modules$2f40$effect$2f$platform$2f$dist$2f$esm$2f$HttpServerResponse$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["setHeader"])("x-uploadthing-version", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$uploadthing$40$7$2e$7$2e$3_next$40$15$2e$3$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0_$5f$tailwindcss$40$4$2e$1$2e$11$2f$node_modules$2f$uploadthing$2f$dist$2f$package$2d$Beb$2d$iarE$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["version"]));
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$effect$2b$platform$40$0$2e$85$2e$2_effect$40$3$2e$16$2e$8$2f$node_modules$2f40$effect$2f$platform$2f$dist$2f$esm$2f$HttpRouter$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["empty"].pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$effect$2b$platform$40$0$2e$85$2e$2_effect$40$3$2e$16$2e$8$2f$node_modules$2f40$effect$2f$platform$2f$dist$2f$esm$2f$HttpRouter$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["get"])("*", GET), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$effect$2b$platform$40$0$2e$85$2e$2_effect$40$3$2e$16$2e$8$2f$node_modules$2f40$effect$2f$platform$2f$dist$2f$esm$2f$HttpRouter$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["post"])("*", POST), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$effect$2b$platform$40$0$2e$85$2e$2_effect$40$3$2e$16$2e$8$2f$node_modules$2f40$effect$2f$platform$2f$dist$2f$esm$2f$HttpRouter$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["use"])(appendResponseHeaders));
    }).pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["withLogSpan"])("createRequestHandler"));
const handleErrorRequest = (opts)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["gen"])(function*() {
        const { uploadable } = opts;
        const request = yield* __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$effect$2b$platform$40$0$2e$85$2e$2_effect$40$3$2e$16$2e$8$2f$node_modules$2f40$effect$2f$platform$2f$dist$2f$esm$2f$HttpServerRequest$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["HttpServerRequest"];
        const { apiKey } = yield* UTToken;
        const verified = yield* (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$uploadthing$2b$shared$40$7$2e$1$2e$9$2f$node_modules$2f40$uploadthing$2f$shared$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["verifySignature"])((yield* request.text), request.headers["x-uploadthing-signature"] ?? null, apiKey);
        yield* (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logDebug"])(`Signature verified: ${verified}`);
        if (!verified) {
            yield* (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logError"])("Invalid signature");
            return yield* new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$uploadthing$2b$shared$40$7$2e$1$2e$9$2f$node_modules$2f40$uploadthing$2f$shared$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["UploadThingError"]({
                code: "BAD_REQUEST",
                message: "Invalid signature"
            });
        }
        const requestInput = yield* (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$effect$2b$platform$40$0$2e$85$2e$2_effect$40$3$2e$16$2e$8$2f$node_modules$2f40$effect$2f$platform$2f$dist$2f$esm$2f$HttpServerRequest$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["schemaBodyJson"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Schema$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Struct"])({
            fileKey: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Schema$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["String"],
            error: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Schema$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["String"]
        }));
        yield* (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logDebug"])("Handling error callback request with input:").pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["annotateLogs"])("json", requestInput));
        const adapterArgs = yield* AdapterArguments;
        const fiber = yield* (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["tryPromise"])({
            try: async ()=>uploadable.onUploadError({
                    ...adapterArgs,
                    error: new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$uploadthing$2b$shared$40$7$2e$1$2e$9$2f$node_modules$2f40$uploadthing$2f$shared$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["UploadThingError"]({
                        code: "UPLOAD_FAILED",
                        message: `Upload failed for ${requestInput.fileKey}: ${requestInput.error}`
                    }),
                    fileKey: requestInput.fileKey
                }),
            catch: (error)=>new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$uploadthing$2b$shared$40$7$2e$1$2e$9$2f$node_modules$2f40$uploadthing$2f$shared$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["UploadThingError"]({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Failed to run onUploadError",
                    cause: error
                })
        }).pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["tapError"])((error)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logError"])("Failed to run onUploadError. You probably shouldn't be throwing errors here.").pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["annotateLogs"])("error", error)))).pipe(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ignoreLogged"], __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["forkDaemon"]);
        return {
            body: null,
            fiber
        };
    }).pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["withLogSpan"])("handleErrorRequest"));
const handleCallbackRequest = (opts)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["gen"])(function*() {
        const { uploadable, fePackage, beAdapter } = opts;
        const request = yield* __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$effect$2b$platform$40$0$2e$85$2e$2_effect$40$3$2e$16$2e$8$2f$node_modules$2f40$effect$2f$platform$2f$dist$2f$esm$2f$HttpServerRequest$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["HttpServerRequest"];
        const { apiKey } = yield* UTToken;
        const verified = yield* (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$uploadthing$2b$shared$40$7$2e$1$2e$9$2f$node_modules$2f40$uploadthing$2f$shared$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["verifySignature"])((yield* request.text), request.headers["x-uploadthing-signature"] ?? null, apiKey);
        yield* (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logDebug"])(`Signature verified: ${verified}`);
        if (!verified) {
            yield* (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logError"])("Invalid signature");
            return yield* new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$uploadthing$2b$shared$40$7$2e$1$2e$9$2f$node_modules$2f40$uploadthing$2f$shared$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["UploadThingError"]({
                code: "BAD_REQUEST",
                message: "Invalid signature"
            });
        }
        const requestInput = yield* (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$effect$2b$platform$40$0$2e$85$2e$2_effect$40$3$2e$16$2e$8$2f$node_modules$2f40$effect$2f$platform$2f$dist$2f$esm$2f$HttpServerRequest$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["schemaBodyJson"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Schema$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Struct"])({
            status: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Schema$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["String"],
            file: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$uploadthing$40$7$2e$7$2e$3_next$40$15$2e$3$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0_$5f$tailwindcss$40$4$2e$1$2e$11$2f$node_modules$2f$uploadthing$2f$dist$2f$shared$2d$schemas$2d$BIFDoqPF$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["UploadedFileData$1"],
            origin: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Schema$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["String"],
            metadata: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Schema$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Record"])({
                key: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Schema$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["String"],
                value: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Schema$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Unknown"]
            })
        }));
        yield* (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logDebug"])("Handling callback request with input:").pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["annotateLogs"])("json", requestInput));
        /**
	* Run `.onUploadComplete` as a daemon to prevent the
	* request from UT to potentially timeout.
	*/ const fiber = yield* (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["gen"])(function*() {
            const adapterArgs = yield* AdapterArguments;
            const serverData = yield* (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["tryPromise"])({
                try: async ()=>uploadable.onUploadComplete({
                        ...adapterArgs,
                        file: {
                            ...requestInput.file,
                            get url () {
                                (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$uploadthing$40$7$2e$7$2e$3_next$40$15$2e$3$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0_$5f$tailwindcss$40$4$2e$1$2e$11$2f$node_modules$2f$uploadthing$2f$dist$2f$deprecations$2d$pLmw6Ytd$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logDeprecationWarning"])("`file.url` is deprecated and will be removed in uploadthing v9. Use `file.ufsUrl` instead.");
                                return requestInput.file.url;
                            },
                            get appUrl () {
                                (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$uploadthing$40$7$2e$7$2e$3_next$40$15$2e$3$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0_$5f$tailwindcss$40$4$2e$1$2e$11$2f$node_modules$2f$uploadthing$2f$dist$2f$deprecations$2d$pLmw6Ytd$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logDeprecationWarning"])("`file.appUrl` is deprecated and will be removed in uploadthing v9. Use `file.ufsUrl` instead.");
                                return requestInput.file.appUrl;
                            }
                        },
                        metadata: requestInput.metadata
                    }),
                catch: (error)=>new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$uploadthing$2b$shared$40$7$2e$1$2e$9$2f$node_modules$2f40$uploadthing$2f$shared$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["UploadThingError"]({
                        code: "INTERNAL_SERVER_ERROR",
                        message: "Failed to run onUploadComplete. You probably shouldn't be throwing errors here.",
                        cause: error
                    })
            });
            const payload = {
                fileKey: requestInput.file.key,
                callbackData: serverData ?? null
            };
            yield* (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logDebug"])("'onUploadComplete' callback finished. Sending response to UploadThing:").pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["annotateLogs"])("callbackData", payload));
            const httpClient = (yield* __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$effect$2b$platform$40$0$2e$85$2e$2_effect$40$3$2e$16$2e$8$2f$node_modules$2f40$effect$2f$platform$2f$dist$2f$esm$2f$HttpClient$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["HttpClient"]).pipe(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$effect$2b$platform$40$0$2e$85$2e$2_effect$40$3$2e$16$2e$8$2f$node_modules$2f40$effect$2f$platform$2f$dist$2f$esm$2f$HttpClient$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["filterStatusOk"]);
            yield* (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$effect$2b$platform$40$0$2e$85$2e$2_effect$40$3$2e$16$2e$8$2f$node_modules$2f40$effect$2f$platform$2f$dist$2f$esm$2f$HttpClientRequest$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["post"])(`/callback-result`).pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$effect$2b$platform$40$0$2e$85$2e$2_effect$40$3$2e$16$2e$8$2f$node_modules$2f40$effect$2f$platform$2f$dist$2f$esm$2f$HttpClientRequest$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prependUrl"])(requestInput.origin), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$effect$2b$platform$40$0$2e$85$2e$2_effect$40$3$2e$16$2e$8$2f$node_modules$2f40$effect$2f$platform$2f$dist$2f$esm$2f$HttpClientRequest$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["setHeaders"])({
                "x-uploadthing-api-key": (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Redacted$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["value"])(apiKey),
                "x-uploadthing-version": __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$uploadthing$40$7$2e$7$2e$3_next$40$15$2e$3$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0_$5f$tailwindcss$40$4$2e$1$2e$11$2f$node_modules$2f$uploadthing$2f$dist$2f$package$2d$Beb$2d$iarE$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["version"],
                "x-uploadthing-be-adapter": beAdapter,
                "x-uploadthing-fe-package": fePackage
            }), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$effect$2b$platform$40$0$2e$85$2e$2_effect$40$3$2e$16$2e$8$2f$node_modules$2f40$effect$2f$platform$2f$dist$2f$esm$2f$HttpClientRequest$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["bodyJson"])(payload), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["flatMap"])(httpClient.execute), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["tapError"])(logHttpClientError("Failed to register callback result")), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["flatMap"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$effect$2b$platform$40$0$2e$85$2e$2_effect$40$3$2e$16$2e$8$2f$node_modules$2f40$effect$2f$platform$2f$dist$2f$esm$2f$HttpIncomingMessage$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["schemaBodyJson"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$uploadthing$40$7$2e$7$2e$3_next$40$15$2e$3$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0_$5f$tailwindcss$40$4$2e$1$2e$11$2f$node_modules$2f$uploadthing$2f$dist$2f$shared$2d$schemas$2d$BIFDoqPF$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["CallbackResultResponse"])), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["tap"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["log"])("Sent callback result to UploadThing")), __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["scoped"]);
        }).pipe(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ignoreLogged"], __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["forkDaemon"]);
        return {
            body: null,
            fiber
        };
    }).pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["withLogSpan"])("handleCallbackRequest"));
const runRouteMiddleware = (opts)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["gen"])(function*() {
        const { json: { files, input }, uploadable } = opts;
        yield* (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logDebug"])("Running middleware");
        const adapterArgs = yield* AdapterArguments;
        const metadata = yield* (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["tryPromise"])({
            try: async ()=>uploadable.middleware({
                    ...adapterArgs,
                    input,
                    files
                }),
            catch: (error)=>error instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$uploadthing$2b$shared$40$7$2e$1$2e$9$2f$node_modules$2f40$uploadthing$2f$shared$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["UploadThingError"] ? error : new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$uploadthing$2b$shared$40$7$2e$1$2e$9$2f$node_modules$2f40$uploadthing$2f$shared$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["UploadThingError"]({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Failed to run middleware",
                    cause: error
                })
        });
        if (metadata[UTFiles] && metadata[UTFiles].length !== files.length) {
            const msg = `Expected files override to have the same length as original files, got ${metadata[UTFiles].length} but expected ${files.length}`;
            yield* (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logError"])(msg);
            return yield* new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$uploadthing$2b$shared$40$7$2e$1$2e$9$2f$node_modules$2f40$uploadthing$2f$shared$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["UploadThingError"]({
                code: "BAD_REQUEST",
                message: "Files override must have the same length as files",
                cause: msg
            });
        }
        const filesWithCustomIds = yield* (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["forEach"])(files, (file, idx)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["gen"])(function*() {
                const theirs = metadata[UTFiles]?.[idx];
                if (theirs && theirs.size !== file.size) yield* (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logWarning"])("File size mismatch. Reverting to original size");
                return {
                    name: theirs?.name ?? file.name,
                    size: file.size,
                    type: file.type,
                    customId: theirs?.customId,
                    lastModified: theirs?.lastModified ?? Date.now()
                };
            }));
        return {
            metadata,
            filesWithCustomIds,
            preferredRegion: metadata[UTRegion]
        };
    }).pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["withLogSpan"])("runRouteMiddleware"));
const handleUploadAction = (opts)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["gen"])(function*() {
        const httpClient = (yield* __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$effect$2b$platform$40$0$2e$85$2e$2_effect$40$3$2e$16$2e$8$2f$node_modules$2f40$effect$2f$platform$2f$dist$2f$esm$2f$HttpClient$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["HttpClient"]).pipe(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$effect$2b$platform$40$0$2e$85$2e$2_effect$40$3$2e$16$2e$8$2f$node_modules$2f40$effect$2f$platform$2f$dist$2f$esm$2f$HttpClient$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["filterStatusOk"]);
        const { uploadable, fePackage, beAdapter, slug } = opts;
        const json = yield* (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$effect$2b$platform$40$0$2e$85$2e$2_effect$40$3$2e$16$2e$8$2f$node_modules$2f40$effect$2f$platform$2f$dist$2f$esm$2f$HttpServerRequest$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["schemaBodyJson"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$uploadthing$40$7$2e$7$2e$3_next$40$15$2e$3$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0_$5f$tailwindcss$40$4$2e$1$2e$11$2f$node_modules$2f$uploadthing$2f$dist$2f$shared$2d$schemas$2d$BIFDoqPF$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["UploadActionPayload"]);
        yield* (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logDebug"])("Handling upload request").pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["annotateLogs"])("json", json));
        yield* (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logDebug"])("Parsing user input");
        const parsedInput = yield* (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["tryPromise"])({
            try: ()=>getParseFn(uploadable.inputParser)(json.input),
            catch: (error)=>new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$uploadthing$2b$shared$40$7$2e$1$2e$9$2f$node_modules$2f40$uploadthing$2f$shared$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["UploadThingError"]({
                    code: "BAD_REQUEST",
                    message: "Invalid input",
                    cause: error
                })
        });
        yield* (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logDebug"])("Input parsed successfully").pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["annotateLogs"])("input", parsedInput));
        const { metadata, filesWithCustomIds, preferredRegion } = yield* runRouteMiddleware({
            json: {
                input: parsedInput,
                files: json.files
            },
            uploadable
        });
        yield* (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logDebug"])("Parsing route config").pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["annotateLogs"])("routerConfig", uploadable.routerConfig));
        const parsedConfig = yield* (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$uploadthing$2b$shared$40$7$2e$1$2e$9$2f$node_modules$2f40$uploadthing$2f$shared$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["fillInputRouteConfig"])(uploadable.routerConfig).pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["catchTag"])("InvalidRouteConfig", (err)=>new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$uploadthing$2b$shared$40$7$2e$1$2e$9$2f$node_modules$2f40$uploadthing$2f$shared$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["UploadThingError"]({
                code: "BAD_REQUEST",
                message: "Invalid route config",
                cause: err
            })));
        yield* (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logDebug"])("Route config parsed successfully").pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["annotateLogs"])("routeConfig", parsedConfig));
        yield* (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logDebug"])("Validating files meet the config requirements").pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["annotateLogs"])("files", json.files));
        yield* assertFilesMeetConfig(json.files, parsedConfig).pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["mapError"])((e)=>new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$uploadthing$2b$shared$40$7$2e$1$2e$9$2f$node_modules$2f40$uploadthing$2f$shared$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["UploadThingError"]({
                code: "BAD_REQUEST",
                message: `Invalid config: ${e._tag}`,
                cause: "reason" in e ? e.reason : e.message
            })));
        yield* (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logDebug"])("Files validated.");
        const fileUploadRequests = yield* (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["forEach"])(filesWithCustomIds, (file)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["map"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$uploadthing$2b$shared$40$7$2e$1$2e$9$2f$node_modules$2f40$uploadthing$2f$shared$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["matchFileType"])(file, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$uploadthing$2b$shared$40$7$2e$1$2e$9$2f$node_modules$2f40$uploadthing$2f$shared$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["objectKeys"])(parsedConfig)), (type)=>({
                    name: file.name,
                    size: file.size,
                    type: file.type || type,
                    lastModified: file.lastModified,
                    customId: file.customId,
                    contentDisposition: parsedConfig[type]?.contentDisposition ?? "inline",
                    acl: parsedConfig[type]?.acl
                }))).pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["catchTags"])({
            InvalidFileType: (e)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["die"])(e),
            UnknownFileType: (e)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["die"])(e)
        }));
        const routeOptions = uploadable.routeOptions;
        const { apiKey, appId } = yield* UTToken;
        const ingestUrl = yield* IngestUrl(preferredRegion);
        const isDev = yield* IsDevelopment;
        yield* (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logDebug"])("Generating presigned URLs").pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["annotateLogs"])("fileUploadRequests", fileUploadRequests), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["annotateLogs"])("ingestUrl", ingestUrl));
        const presignedUrls = yield* (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["forEach"])(fileUploadRequests, (file)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["gen"])(function*() {
                const key = yield* (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$uploadthing$2b$shared$40$7$2e$1$2e$9$2f$node_modules$2f40$uploadthing$2f$shared$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["generateKey"])(file, appId, routeOptions.getFileHashParts);
                const url = yield* (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$uploadthing$2b$shared$40$7$2e$1$2e$9$2f$node_modules$2f40$uploadthing$2f$shared$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["generateSignedURL"])(`${ingestUrl}/${key}`, apiKey, {
                    ttlInSeconds: routeOptions.presignedURLTTL,
                    data: {
                        "x-ut-identifier": appId,
                        "x-ut-file-name": file.name,
                        "x-ut-file-size": file.size,
                        "x-ut-file-type": file.type,
                        "x-ut-slug": slug,
                        "x-ut-custom-id": file.customId,
                        "x-ut-content-disposition": file.contentDisposition,
                        "x-ut-acl": file.acl
                    }
                });
                return {
                    url,
                    key
                };
            }), {
            concurrency: "unbounded"
        });
        const serverReq = yield* __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$effect$2b$platform$40$0$2e$85$2e$2_effect$40$3$2e$16$2e$8$2f$node_modules$2f40$effect$2f$platform$2f$dist$2f$esm$2f$HttpServerRequest$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["HttpServerRequest"];
        const requestUrl = yield* (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$effect$2b$platform$40$0$2e$85$2e$2_effect$40$3$2e$16$2e$8$2f$node_modules$2f40$effect$2f$platform$2f$dist$2f$esm$2f$HttpServerRequest$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["toURL"])(serverReq);
        const devHookRequest = yield* (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Config$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["string"])("callbackUrl").pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Config$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["withDefault"])(requestUrl.origin + requestUrl.pathname), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["map"])((url)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$effect$2b$platform$40$0$2e$85$2e$2_effect$40$3$2e$16$2e$8$2f$node_modules$2f40$effect$2f$platform$2f$dist$2f$esm$2f$HttpClientRequest$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["post"])(url).pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$effect$2b$platform$40$0$2e$85$2e$2_effect$40$3$2e$16$2e$8$2f$node_modules$2f40$effect$2f$platform$2f$dist$2f$esm$2f$HttpClientRequest$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["appendUrlParam"])("slug", slug))));
        const metadataRequest = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$effect$2b$platform$40$0$2e$85$2e$2_effect$40$3$2e$16$2e$8$2f$node_modules$2f40$effect$2f$platform$2f$dist$2f$esm$2f$HttpClientRequest$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["post"])("/route-metadata").pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$effect$2b$platform$40$0$2e$85$2e$2_effect$40$3$2e$16$2e$8$2f$node_modules$2f40$effect$2f$platform$2f$dist$2f$esm$2f$HttpClientRequest$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prependUrl"])(ingestUrl), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$effect$2b$platform$40$0$2e$85$2e$2_effect$40$3$2e$16$2e$8$2f$node_modules$2f40$effect$2f$platform$2f$dist$2f$esm$2f$HttpClientRequest$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["setHeaders"])({
            "x-uploadthing-api-key": (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Redacted$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["value"])(apiKey),
            "x-uploadthing-version": __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$uploadthing$40$7$2e$7$2e$3_next$40$15$2e$3$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0_$5f$tailwindcss$40$4$2e$1$2e$11$2f$node_modules$2f$uploadthing$2f$dist$2f$package$2d$Beb$2d$iarE$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["version"],
            "x-uploadthing-be-adapter": beAdapter,
            "x-uploadthing-fe-package": fePackage
        }), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$effect$2b$platform$40$0$2e$85$2e$2_effect$40$3$2e$16$2e$8$2f$node_modules$2f40$effect$2f$platform$2f$dist$2f$esm$2f$HttpClientRequest$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["bodyJson"])({
            fileKeys: presignedUrls.map(({ key })=>key),
            metadata,
            isDev,
            callbackUrl: devHookRequest.url,
            callbackSlug: slug,
            awaitServerData: routeOptions.awaitServerData ?? true
        }), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["flatMap"])(httpClient.execute));
        const handleDevStreamError = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["fn"])("handleDevStreamError")(function*(err, chunk) {
            const schema = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Schema$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["parseJson"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Schema$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Struct"])({
                file: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$uploadthing$40$7$2e$7$2e$3_next$40$15$2e$3$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0_$5f$tailwindcss$40$4$2e$1$2e$11$2f$node_modules$2f$uploadthing$2f$dist$2f$shared$2d$schemas$2d$BIFDoqPF$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["UploadedFileData$1"]
            }));
            const parsedChunk = yield* (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Schema$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["decodeUnknown"])(schema)(chunk);
            const key = parsedChunk.file.key;
            yield* (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logError"])("Failed to forward callback request from dev stream").pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["annotateLogs"])({
                fileKey: key,
                error: err.message
            }));
            const httpResponse = yield* (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$effect$2b$platform$40$0$2e$85$2e$2_effect$40$3$2e$16$2e$8$2f$node_modules$2f40$effect$2f$platform$2f$dist$2f$esm$2f$HttpClientRequest$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["post"])("/callback-result").pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$effect$2b$platform$40$0$2e$85$2e$2_effect$40$3$2e$16$2e$8$2f$node_modules$2f40$effect$2f$platform$2f$dist$2f$esm$2f$HttpClientRequest$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prependUrl"])(ingestUrl), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$effect$2b$platform$40$0$2e$85$2e$2_effect$40$3$2e$16$2e$8$2f$node_modules$2f40$effect$2f$platform$2f$dist$2f$esm$2f$HttpClientRequest$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["setHeaders"])({
                "x-uploadthing-api-key": (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Redacted$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["value"])(apiKey),
                "x-uploadthing-version": __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$uploadthing$40$7$2e$7$2e$3_next$40$15$2e$3$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0_$5f$tailwindcss$40$4$2e$1$2e$11$2f$node_modules$2f$uploadthing$2f$dist$2f$package$2d$Beb$2d$iarE$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["version"],
                "x-uploadthing-be-adapter": beAdapter,
                "x-uploadthing-fe-package": fePackage
            }), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$effect$2b$platform$40$0$2e$85$2e$2_effect$40$3$2e$16$2e$8$2f$node_modules$2f40$effect$2f$platform$2f$dist$2f$esm$2f$HttpClientRequest$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["bodyJson"])({
                fileKey: key,
                error: `Failed to forward callback request from dev stream: ${err.message}`
            }), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["flatMap"])(httpClient.execute));
            yield* logHttpClientResponse("Reported callback error to UploadThing")(httpResponse);
        });
        const fiber = yield* (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["if"])(isDev, {
            onTrue: ()=>metadataRequest.pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["tapBoth"])({
                    onSuccess: logHttpClientResponse("Registered metadata", {
                        mixin: "None"
                    }),
                    onFailure: logHttpClientError("Failed to register metadata")
                }), __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$effect$2b$platform$40$0$2e$85$2e$2_effect$40$3$2e$16$2e$8$2f$node_modules$2f40$effect$2f$platform$2f$dist$2f$esm$2f$HttpClientResponse$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["stream"], handleJsonLineStream(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$uploadthing$40$7$2e$7$2e$3_next$40$15$2e$3$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0_$5f$tailwindcss$40$4$2e$1$2e$11$2f$node_modules$2f$uploadthing$2f$dist$2f$shared$2d$schemas$2d$BIFDoqPF$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["MetadataFetchStreamPart"], (chunk)=>devHookRequest.pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$effect$2b$platform$40$0$2e$85$2e$2_effect$40$3$2e$16$2e$8$2f$node_modules$2f40$effect$2f$platform$2f$dist$2f$esm$2f$HttpClientRequest$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["setHeaders"])({
                        "uploadthing-hook": chunk.hook,
                        "x-uploadthing-signature": chunk.signature
                    }), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$effect$2b$platform$40$0$2e$85$2e$2_effect$40$3$2e$16$2e$8$2f$node_modules$2f40$effect$2f$platform$2f$dist$2f$esm$2f$HttpClientRequest$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["setBody"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$effect$2b$platform$40$0$2e$85$2e$2_effect$40$3$2e$16$2e$8$2f$node_modules$2f40$effect$2f$platform$2f$dist$2f$esm$2f$HttpBody$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["text"])(chunk.payload, "application/json")), httpClient.execute, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["tap"])(logHttpClientResponse("Successfully forwarded callback request from dev stream")), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["catchTag"])("ResponseError", (err)=>handleDevStreamError(err, chunk.payload)), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["annotateLogs"])(chunk), __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["asVoid"], __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ignoreLogged"], __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["scoped"]))),
            onFalse: ()=>metadataRequest.pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["tapBoth"])({
                    onSuccess: logHttpClientResponse("Registered metadata"),
                    onFailure: logHttpClientError("Failed to register metadata")
                }), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["flatMap"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$effect$2b$platform$40$0$2e$85$2e$2_effect$40$3$2e$16$2e$8$2f$node_modules$2f40$effect$2f$platform$2f$dist$2f$esm$2f$HttpIncomingMessage$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["schemaBodyJson"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$uploadthing$40$7$2e$7$2e$3_next$40$15$2e$3$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0_$5f$tailwindcss$40$4$2e$1$2e$11$2f$node_modules$2f$uploadthing$2f$dist$2f$shared$2d$schemas$2d$BIFDoqPF$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["MetadataFetchResponse"])), __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["scoped"])
        }).pipe(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["forkDaemon"]);
        const presigneds = presignedUrls.map((p, i)=>({
                url: p.url,
                key: p.key,
                name: fileUploadRequests[i].name,
                customId: fileUploadRequests[i].customId ?? null
            }));
        yield* (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logInfo"])("Sending presigned URLs to client").pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["annotateLogs"])("presignedUrls", presigneds));
        return {
            body: presigneds,
            fiber
        };
    }).pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["withLogSpan"])("handleUploadAction"));
//#endregion
//#region src/_internal/upload-builder.ts
function internalCreateBuilder(initDef = {}) {
    const _def = {
        $types: {},
        routerConfig: {
            image: {
                maxFileSize: "4MB"
            }
        },
        routeOptions: {
            awaitServerData: true
        },
        inputParser: {
            parseAsync: ()=>Promise.resolve(void 0),
            _input: void 0,
            _output: void 0
        },
        middleware: ()=>({}),
        onUploadError: ()=>{},
        onUploadComplete: ()=>void 0,
        errorFormatter: initDef.errorFormatter ?? defaultErrorFormatter,
        ...initDef
    };
    return {
        input (userParser) {
            return internalCreateBuilder({
                ..._def,
                inputParser: userParser
            });
        },
        middleware (userMiddleware) {
            return internalCreateBuilder({
                ..._def,
                middleware: userMiddleware
            });
        },
        onUploadComplete (userUploadComplete) {
            return {
                ..._def,
                onUploadComplete: userUploadComplete
            };
        },
        onUploadError (userOnUploadError) {
            return internalCreateBuilder({
                ..._def,
                onUploadError: userOnUploadError
            });
        }
    };
}
/**
* Create a builder for your backend adapter.
* Refer to the existing adapters for examples on how to use this function.
* @public
*
* @param opts - Options for the builder
* @returns A file route builder for making UploadThing file routes
*/ function createBuilder(opts) {
    return (input, config)=>{
        return internalCreateBuilder({
            routerConfig: input,
            routeOptions: config ?? {},
            ...opts
        });
    };
}
;
 //# sourceMappingURL=upload-builder-e0_p9NOT.js.map
}}),
"[project]/node_modules/.pnpm/uploadthing@7.7.3_next@15.3.4_react-dom@19.1.0_react@19.1.0__react@19.1.0__tailwindcss@4.1.11/node_modules/uploadthing/next/index.js [app-route] (ecmascript) <locals>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "createRouteHandler": (()=>createRouteHandler),
    "createUploadthing": (()=>createUploadthing)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$uploadthing$40$7$2e$7$2e$3_next$40$15$2e$3$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0_$5f$tailwindcss$40$4$2e$1$2e$11$2f$node_modules$2f$uploadthing$2f$dist$2f$upload$2d$builder$2d$e0_p9NOT$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/uploadthing@7.7.3_next@15.3.4_react-dom@19.1.0_react@19.1.0__react@19.1.0__tailwindcss@4.1.11/node_modules/uploadthing/dist/upload-builder-e0_p9NOT.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/effect@3.16.8/node_modules/effect/dist/esm/Effect.js [app-route] (ecmascript)");
;
;
;
;
;
//#region src/next.ts
const createUploadthing = (opts)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$uploadthing$40$7$2e$7$2e$3_next$40$15$2e$3$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0_$5f$tailwindcss$40$4$2e$1$2e$11$2f$node_modules$2f$uploadthing$2f$dist$2f$upload$2d$builder$2d$e0_p9NOT$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createBuilder"])(opts);
const createRouteHandler = (opts)=>{
    const handler = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$uploadthing$40$7$2e$7$2e$3_next$40$15$2e$3$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0_$5f$tailwindcss$40$4$2e$1$2e$11$2f$node_modules$2f$uploadthing$2f$dist$2f$upload$2d$builder$2d$e0_p9NOT$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["makeAdapterHandler"])((req)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["succeed"])({
            req
        }), (req)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["succeed"])(req), opts, "nextjs-app");
    return {
        POST: handler,
        GET: handler
    };
};
;
 //# sourceMappingURL=index.js.map
}}),
"[project]/node_modules/.pnpm/uploadthing@7.7.3_next@15.3.4_react-dom@19.1.0_react@19.1.0__react@19.1.0__tailwindcss@4.1.11/node_modules/uploadthing/server/index.js [app-route] (ecmascript) <locals>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "UTApi": (()=>UTApi),
    "UTFile": (()=>UTFile),
    "createRouteHandler": (()=>createRouteHandler),
    "createUploadthing": (()=>createUploadthing),
    "extractRouterConfig": (()=>extractRouterConfig$1)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$uploadthing$40$7$2e$7$2e$3_next$40$15$2e$3$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0_$5f$tailwindcss$40$4$2e$1$2e$11$2f$node_modules$2f$uploadthing$2f$dist$2f$package$2d$Beb$2d$iarE$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/uploadthing@7.7.3_next@15.3.4_react-dom@19.1.0_react@19.1.0__react@19.1.0__tailwindcss@4.1.11/node_modules/uploadthing/dist/package-Beb-iarE.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$uploadthing$40$7$2e$7$2e$3_next$40$15$2e$3$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0_$5f$tailwindcss$40$4$2e$1$2e$11$2f$node_modules$2f$uploadthing$2f$dist$2f$deprecations$2d$pLmw6Ytd$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/uploadthing@7.7.3_next@15.3.4_react-dom@19.1.0_react@19.1.0__react@19.1.0__tailwindcss@4.1.11/node_modules/uploadthing/dist/deprecations-pLmw6Ytd.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$uploadthing$40$7$2e$7$2e$3_next$40$15$2e$3$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0_$5f$tailwindcss$40$4$2e$1$2e$11$2f$node_modules$2f$uploadthing$2f$dist$2f$upload$2d$builder$2d$e0_p9NOT$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/uploadthing@7.7.3_next@15.3.4_react-dom@19.1.0_react@19.1.0__react@19.1.0__tailwindcss@4.1.11/node_modules/uploadthing/dist/upload-builder-e0_p9NOT.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Array$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/effect@3.16.8/node_modules/effect/dist/esm/Array.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$uploadthing$2b$shared$40$7$2e$1$2e$9$2f$node_modules$2f40$uploadthing$2f$shared$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@uploadthing+shared@7.1.9/node_modules/@uploadthing/shared/dist/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Function$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/effect@3.16.8/node_modules/effect/dist/esm/Function.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Predicate$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/effect@3.16.8/node_modules/effect/dist/esm/Predicate.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/effect@3.16.8/node_modules/effect/dist/esm/Effect.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$effect$2b$platform$40$0$2e$85$2e$2_effect$40$3$2e$16$2e$8$2f$node_modules$2f40$effect$2f$platform$2f$dist$2f$esm$2f$HttpClient$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@effect+platform@0.85.2_effect@3.16.8/node_modules/@effect/platform/dist/esm/HttpClient.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$effect$2b$platform$40$0$2e$85$2e$2_effect$40$3$2e$16$2e$8$2f$node_modules$2f40$effect$2f$platform$2f$dist$2f$esm$2f$HttpClientRequest$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@effect+platform@0.85.2_effect@3.16.8/node_modules/@effect/platform/dist/esm/HttpClientRequest.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$effect$2b$platform$40$0$2e$85$2e$2_effect$40$3$2e$16$2e$8$2f$node_modules$2f40$effect$2f$platform$2f$dist$2f$esm$2f$HttpIncomingMessage$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@effect+platform@0.85.2_effect@3.16.8/node_modules/@effect/platform/dist/esm/HttpIncomingMessage.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Redacted$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/effect@3.16.8/node_modules/effect/dist/esm/Redacted.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Schema$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/effect@3.16.8/node_modules/effect/dist/esm/Schema.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Cause$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/effect@3.16.8/node_modules/effect/dist/esm/Cause.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$uploadthing$2b$mime$2d$types$40$0$2e$3$2e$5$2f$node_modules$2f40$uploadthing$2f$mime$2d$types$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@uploadthing+mime-types@0.3.5/node_modules/@uploadthing/mime-types/dist/index.js [app-route] (ecmascript)");
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
//#region src/sdk/ut-file.ts
/**
* Extension of the Blob class that simplifies setting the `name` and `customId` properties,
* similar to the built-in File class from Node > 20.
*/ var UTFile = class extends Blob {
    name;
    lastModified;
    customId;
    constructor(parts, name, options){
        const optionsWithDefaults = {
            ...options,
            type: options?.type ?? ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$uploadthing$2b$mime$2d$types$40$0$2e$3$2e$5$2f$node_modules$2f40$uploadthing$2f$mime$2d$types$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["lookup"])(name) || "application/octet-stream"),
            lastModified: options?.lastModified ?? Date.now()
        };
        super(parts, optionsWithDefaults);
        this.name = name;
        this.customId = optionsWithDefaults.customId;
        this.lastModified = optionsWithDefaults.lastModified;
    }
};
//#endregion
//#region src/_internal/upload-server.ts
const uploadWithoutProgress = (file, presigned)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["gen"])(function*() {
        const formData = new FormData();
        formData.append("file", file);
        const httpClient = (yield* __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$effect$2b$platform$40$0$2e$85$2e$2_effect$40$3$2e$16$2e$8$2f$node_modules$2f40$effect$2f$platform$2f$dist$2f$esm$2f$HttpClient$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["HttpClient"]).pipe(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$effect$2b$platform$40$0$2e$85$2e$2_effect$40$3$2e$16$2e$8$2f$node_modules$2f40$effect$2f$platform$2f$dist$2f$esm$2f$HttpClient$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["filterStatusOk"]);
        const json = yield* (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$effect$2b$platform$40$0$2e$85$2e$2_effect$40$3$2e$16$2e$8$2f$node_modules$2f40$effect$2f$platform$2f$dist$2f$esm$2f$HttpClientRequest$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["put"])(presigned.url).pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$effect$2b$platform$40$0$2e$85$2e$2_effect$40$3$2e$16$2e$8$2f$node_modules$2f40$effect$2f$platform$2f$dist$2f$esm$2f$HttpClientRequest$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["bodyFormData"])(formData), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$effect$2b$platform$40$0$2e$85$2e$2_effect$40$3$2e$16$2e$8$2f$node_modules$2f40$effect$2f$platform$2f$dist$2f$esm$2f$HttpClientRequest$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["setHeader"])("Range", "bytes=0-"), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$effect$2b$platform$40$0$2e$85$2e$2_effect$40$3$2e$16$2e$8$2f$node_modules$2f40$effect$2f$platform$2f$dist$2f$esm$2f$HttpClientRequest$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["setHeader"])("x-uploadthing-version", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$uploadthing$40$7$2e$7$2e$3_next$40$15$2e$3$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0_$5f$tailwindcss$40$4$2e$1$2e$11$2f$node_modules$2f$uploadthing$2f$dist$2f$package$2d$Beb$2d$iarE$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["version"]), httpClient.execute, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["tapError"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$uploadthing$40$7$2e$7$2e$3_next$40$15$2e$3$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0_$5f$tailwindcss$40$4$2e$1$2e$11$2f$node_modules$2f$uploadthing$2f$dist$2f$upload$2d$builder$2d$e0_p9NOT$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logHttpClientError"])("Failed to upload file")), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["mapError"])((e)=>new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$uploadthing$2b$shared$40$7$2e$1$2e$9$2f$node_modules$2f40$uploadthing$2f$shared$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["UploadThingError"]({
                code: "UPLOAD_FAILED",
                message: "Failed to upload file",
                cause: e
            })), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["andThen"])((_)=>_.json), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["andThen"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Function$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["unsafeCoerce"]), __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["scoped"]);
        yield* (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logDebug"])(`File ${file.name} uploaded successfully`).pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["annotateLogs"])("json", json));
        return {
            ...json,
            get url () {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$uploadthing$40$7$2e$7$2e$3_next$40$15$2e$3$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0_$5f$tailwindcss$40$4$2e$1$2e$11$2f$node_modules$2f$uploadthing$2f$dist$2f$deprecations$2d$pLmw6Ytd$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logDeprecationWarning"])("`file.url` is deprecated and will be removed in uploadthing v9. Use `file.ufsUrl` instead.");
                return json.url;
            },
            get appUrl () {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$uploadthing$40$7$2e$7$2e$3_next$40$15$2e$3$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0_$5f$tailwindcss$40$4$2e$1$2e$11$2f$node_modules$2f$uploadthing$2f$dist$2f$deprecations$2d$pLmw6Ytd$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logDeprecationWarning"])("`file.appUrl` is deprecated and will be removed in uploadthing v9. Use `file.ufsUrl` instead.");
                return json.appUrl;
            }
        };
    });
//#endregion
//#region src/sdk/utils.ts
function guardServerOnly() {
    if ("TURBOPACK compile-time falsy", 0) {
        "TURBOPACK unreachable";
    }
}
const downloadFile = (_url)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["gen"])(function*() {
        let url = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Predicate$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isRecord"])(_url) ? _url.url : _url;
        if (typeof url === "string") {
            if (url.startsWith("data:")) return yield* (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["fail"])({
                code: "BAD_REQUEST",
                message: "Please use uploadFiles() for data URLs. uploadFilesFromUrl() is intended for use with remote URLs only.",
                data: void 0
            });
        }
        url = new URL(url);
        const { name = url.pathname.split("/").pop() ?? "unknown-filename", customId = void 0 } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Predicate$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isRecord"])(_url) ? _url : {};
        const httpClient = (yield* __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$effect$2b$platform$40$0$2e$85$2e$2_effect$40$3$2e$16$2e$8$2f$node_modules$2f40$effect$2f$platform$2f$dist$2f$esm$2f$HttpClient$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["HttpClient"]).pipe(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$effect$2b$platform$40$0$2e$85$2e$2_effect$40$3$2e$16$2e$8$2f$node_modules$2f40$effect$2f$platform$2f$dist$2f$esm$2f$HttpClient$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["filterStatusOk"]);
        const arrayBuffer = yield* (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$effect$2b$platform$40$0$2e$85$2e$2_effect$40$3$2e$16$2e$8$2f$node_modules$2f40$effect$2f$platform$2f$dist$2f$esm$2f$HttpClientRequest$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["get"])(url).pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$effect$2b$platform$40$0$2e$85$2e$2_effect$40$3$2e$16$2e$8$2f$node_modules$2f40$effect$2f$platform$2f$dist$2f$esm$2f$HttpClientRequest$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["modify"])({
            headers: {}
        }), httpClient.execute, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["flatMap"])((_)=>_.arrayBuffer), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["mapError"])((cause)=>{
            return {
                code: "BAD_REQUEST",
                message: `Failed to download requested file: ${cause.message}`,
                data: cause.toJSON()
            };
        }), __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["scoped"]);
        return new UTFile([
            arrayBuffer
        ], name, {
            customId,
            lastModified: Date.now()
        });
    }).pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["withLogSpan"])("downloadFile"));
const generatePresignedUrl = (file, cd, acl)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["gen"])(function*() {
        const { apiKey, appId } = yield* __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$uploadthing$40$7$2e$7$2e$3_next$40$15$2e$3$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0_$5f$tailwindcss$40$4$2e$1$2e$11$2f$node_modules$2f$uploadthing$2f$dist$2f$upload$2d$builder$2d$e0_p9NOT$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["UTToken"];
        const baseUrl = yield* (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$uploadthing$40$7$2e$7$2e$3_next$40$15$2e$3$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0_$5f$tailwindcss$40$4$2e$1$2e$11$2f$node_modules$2f$uploadthing$2f$dist$2f$upload$2d$builder$2d$e0_p9NOT$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["IngestUrl"])(void 0);
        const key = yield* (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$uploadthing$2b$shared$40$7$2e$1$2e$9$2f$node_modules$2f40$uploadthing$2f$shared$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["generateKey"])(file, appId);
        const url = yield* (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$uploadthing$2b$shared$40$7$2e$1$2e$9$2f$node_modules$2f40$uploadthing$2f$shared$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["generateSignedURL"])(`${baseUrl}/${key}`, apiKey, {
            data: {
                "x-ut-identifier": appId,
                "x-ut-file-name": file.name,
                "x-ut-file-size": file.size,
                "x-ut-file-type": file.type,
                "x-ut-custom-id": file.customId,
                "x-ut-content-disposition": cd,
                "x-ut-acl": acl
            }
        });
        return {
            url,
            key
        };
    }).pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["withLogSpan"])("generatePresignedUrl"));
const uploadFile = (file, opts)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["gen"])(function*() {
        const presigned = yield* generatePresignedUrl(file, opts.contentDisposition ?? "inline", opts.acl).pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["catchTag"])("UploadThingError", (e)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["fail"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$uploadthing$2b$shared$40$7$2e$1$2e$9$2f$node_modules$2f40$uploadthing$2f$shared$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["UploadThingError"].toObject(e))), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["catchTag"])("ConfigError", ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["fail"])({
                code: "INVALID_SERVER_CONFIG",
                message: "Failed to generate presigned URL"
            })));
        const response = yield* uploadWithoutProgress(file, presigned).pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["catchTag"])("UploadThingError", (e)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["fail"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$uploadthing$2b$shared$40$7$2e$1$2e$9$2f$node_modules$2f40$uploadthing$2f$shared$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["UploadThingError"].toObject(e))), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["catchTag"])("ResponseError", (e)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["fail"])({
                code: "UPLOAD_FAILED",
                message: "Failed to upload file",
                data: e.toJSON()
            })));
        return {
            key: presigned.key,
            url: response.url,
            appUrl: response.appUrl,
            ufsUrl: response.ufsUrl,
            lastModified: file.lastModified ?? Date.now(),
            name: file.name,
            size: file.size,
            type: file.type,
            customId: file.customId ?? null,
            fileHash: response.fileHash
        };
    }).pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["withLogSpan"])("uploadFile"));
//#endregion
//#region src/sdk/index.ts
var UTApi = class {
    fetch;
    defaultKeyType;
    runtime;
    opts;
    constructor(options){
        guardServerOnly();
        this.opts = options ?? {};
        this.fetch = this.opts.fetch ?? globalThis.fetch;
        this.defaultKeyType = this.opts.defaultKeyType ?? "fileKey";
        this.runtime = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$uploadthing$40$7$2e$7$2e$3_next$40$15$2e$3$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0_$5f$tailwindcss$40$4$2e$1$2e$11$2f$node_modules$2f$uploadthing$2f$dist$2f$upload$2d$builder$2d$e0_p9NOT$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["makeRuntime"])(this.fetch, this.opts);
    }
    requestUploadThing = (pathname, body, responseSchema)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["gen"])(this, function*() {
            const { apiKey } = yield* __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$uploadthing$40$7$2e$7$2e$3_next$40$15$2e$3$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0_$5f$tailwindcss$40$4$2e$1$2e$11$2f$node_modules$2f$uploadthing$2f$dist$2f$upload$2d$builder$2d$e0_p9NOT$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["UTToken"];
            const baseUrl = yield* __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$uploadthing$40$7$2e$7$2e$3_next$40$15$2e$3$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0_$5f$tailwindcss$40$4$2e$1$2e$11$2f$node_modules$2f$uploadthing$2f$dist$2f$upload$2d$builder$2d$e0_p9NOT$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ApiUrl"];
            const httpClient = (yield* __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$effect$2b$platform$40$0$2e$85$2e$2_effect$40$3$2e$16$2e$8$2f$node_modules$2f40$effect$2f$platform$2f$dist$2f$esm$2f$HttpClient$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["HttpClient"]).pipe(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$effect$2b$platform$40$0$2e$85$2e$2_effect$40$3$2e$16$2e$8$2f$node_modules$2f40$effect$2f$platform$2f$dist$2f$esm$2f$HttpClient$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["filterStatusOk"]);
            return yield* (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$effect$2b$platform$40$0$2e$85$2e$2_effect$40$3$2e$16$2e$8$2f$node_modules$2f40$effect$2f$platform$2f$dist$2f$esm$2f$HttpClientRequest$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["post"])(pathname).pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$effect$2b$platform$40$0$2e$85$2e$2_effect$40$3$2e$16$2e$8$2f$node_modules$2f40$effect$2f$platform$2f$dist$2f$esm$2f$HttpClientRequest$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prependUrl"])(baseUrl), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$effect$2b$platform$40$0$2e$85$2e$2_effect$40$3$2e$16$2e$8$2f$node_modules$2f40$effect$2f$platform$2f$dist$2f$esm$2f$HttpClientRequest$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["bodyUnsafeJson"])(body), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$effect$2b$platform$40$0$2e$85$2e$2_effect$40$3$2e$16$2e$8$2f$node_modules$2f40$effect$2f$platform$2f$dist$2f$esm$2f$HttpClientRequest$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["setHeaders"])({
                "x-uploadthing-version": __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$uploadthing$40$7$2e$7$2e$3_next$40$15$2e$3$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0_$5f$tailwindcss$40$4$2e$1$2e$11$2f$node_modules$2f$uploadthing$2f$dist$2f$package$2d$Beb$2d$iarE$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["version"],
                "x-uploadthing-be-adapter": "server-sdk",
                "x-uploadthing-api-key": (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Redacted$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["value"])(apiKey)
            }), httpClient.execute, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["tapBoth"])({
                onSuccess: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$uploadthing$40$7$2e$7$2e$3_next$40$15$2e$3$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0_$5f$tailwindcss$40$4$2e$1$2e$11$2f$node_modules$2f$uploadthing$2f$dist$2f$upload$2d$builder$2d$e0_p9NOT$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logHttpClientResponse"])("UploadThing API Response"),
                onFailure: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$uploadthing$40$7$2e$7$2e$3_next$40$15$2e$3$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0_$5f$tailwindcss$40$4$2e$1$2e$11$2f$node_modules$2f$uploadthing$2f$dist$2f$upload$2d$builder$2d$e0_p9NOT$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logHttpClientError"])("Failed to request UploadThing API")
            }), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["flatMap"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$effect$2b$platform$40$0$2e$85$2e$2_effect$40$3$2e$16$2e$8$2f$node_modules$2f40$effect$2f$platform$2f$dist$2f$esm$2f$HttpIncomingMessage$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["schemaBodyJson"])(responseSchema)), __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["scoped"]);
        }).pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["catchTag"])("ConfigError", (e)=>new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$uploadthing$2b$shared$40$7$2e$1$2e$9$2f$node_modules$2f40$uploadthing$2f$shared$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["UploadThingError"]({
                code: "INVALID_SERVER_CONFIG",
                message: "There was an error with the server configuration. More info can be found on this error's `cause` property",
                cause: e
            })), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["withLogSpan"])("utapi.#requestUploadThing"));
    executeAsync = async (program, signal)=>{
        const exit = await program.pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["withLogSpan"])("utapi.#executeAsync"), (e)=>this.runtime.runPromiseExit(e, signal ? {
                signal
            } : void 0));
        if (exit._tag === "Failure") throw (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Cause$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["squash"])(exit.cause);
        return exit.value;
    };
    uploadFiles(files, opts) {
        guardServerOnly();
        const concurrency = opts?.concurrency ?? 1;
        if (concurrency < 1 || concurrency > 25) throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$uploadthing$2b$shared$40$7$2e$1$2e$9$2f$node_modules$2f40$uploadthing$2f$shared$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["UploadThingError"]({
            code: "BAD_REQUEST",
            message: "concurrency must be a positive integer between 1 and 25"
        });
        const program = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["forEach"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Array$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ensure"])(files), (file)=>uploadFile(file, opts ?? {}).pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["match"])({
                onSuccess: (data)=>({
                        data,
                        error: null
                    }),
                onFailure: (error)=>({
                        data: null,
                        error
                    })
            })), {
            concurrency
        }).pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["map"])((ups)=>Array.isArray(files) ? ups : ups[0]), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["tap"])((res)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logDebug"])("Finished uploading").pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["annotateLogs"])("uploadResult", res))), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["withLogSpan"])("uploadFiles"));
        return this.executeAsync(program, opts?.signal);
    }
    uploadFilesFromUrl(urls, opts) {
        guardServerOnly();
        const concurrency = opts?.concurrency ?? 1;
        if (concurrency < 1 || concurrency > 25) throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$uploadthing$2b$shared$40$7$2e$1$2e$9$2f$node_modules$2f40$uploadthing$2f$shared$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["UploadThingError"]({
            code: "BAD_REQUEST",
            message: "concurrency must be a positive integer between 1 and 25"
        });
        const program = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["forEach"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Array$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ensure"])(urls), (url)=>downloadFile(url).pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["flatMap"])((file)=>uploadFile(file, opts ?? {})), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["match"])({
                onSuccess: (data)=>({
                        data,
                        error: null
                    }),
                onFailure: (error)=>({
                        data: null,
                        error
                    })
            })), {
            concurrency
        }).pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["map"])((ups)=>Array.isArray(urls) ? ups : ups[0]), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["tap"])((res)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logDebug"])("Finished uploading").pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["annotateLogs"])("uploadResult", res))), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["withLogSpan"])("uploadFiles")).pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["withLogSpan"])("uploadFilesFromUrl"));
        return this.executeAsync(program, opts?.signal);
    }
    /**
	* Request to delete files from UploadThing storage.
	* @param {string | string[]} fileKeys
	*
	* @example
	* await deleteFiles("2e0fdb64-9957-4262-8e45-f372ba903ac8_image.jpg");
	*
	* @example
	* await deleteFiles(["2e0fdb64-9957-4262-8e45-f372ba903ac8_image.jpg","1649353b-04ea-48a2-9db7-31de7f562c8d_image2.jpg"])
	*
	* @example
	* await deleteFiles("myCustomIdentifier", { keyType: "customId" })
	*/ deleteFiles = async (keys, opts)=>{
        guardServerOnly();
        const { keyType = this.defaultKeyType } = opts ?? {};
        class DeleteFileResponse extends (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Schema$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Class"])("DeleteFileResponse")({
            success: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Schema$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Boolean"],
            deletedCount: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Schema$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Number"]
        }) {
        }
        return await this.executeAsync(this.requestUploadThing("/v6/deleteFiles", keyType === "fileKey" ? {
            fileKeys: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Array$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ensure"])(keys)
        } : {
            customIds: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Array$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ensure"])(keys)
        }, DeleteFileResponse).pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["withLogSpan"])("deleteFiles")));
    };
    /**
	* Request file URLs from UploadThing storage.
	* @param {string | string[]} fileKeys
	*
	* @example
	* const data = await getFileUrls("2e0fdb64-9957-4262-8e45-f372ba903ac8_image.jpg");
	* console.log(data); // [{key: "2e0fdb64-9957-4262-8e45-f372ba903ac8_image.jpg", url: "https://uploadthing.com/f/2e0fdb64-9957-4262-8e45-f372ba903ac8_image.jpg"}]
	*
	* @example
	* const data = await getFileUrls(["2e0fdb64-9957-4262-8e45-f372ba903ac8_image.jpg","1649353b-04ea-48a2-9db7-31de7f562c8d_image2.jpg"])
	* console.log(data) // [{key: "2e0fdb64-9957-4262-8e45-f372ba903ac8_image.jpg", url: "https://uploadthing.com/f/2e0fdb64-9957-4262-8e45-f372ba903ac8_image.jpg" },{key: "1649353b-04ea-48a2-9db7-31de7f562c8d_image2.jpg", url: "https://uploadthing.com/f/1649353b-04ea-48a2-9db7-31de7f562c8d_image2.jpg"}]
	*
	* @deprecated - See https://docs.uploadthing.com/working-with-files#accessing-files for info how to access files
	*/ getFileUrls = async (keys, opts)=>{
        guardServerOnly();
        const { keyType = this.defaultKeyType } = opts ?? {};
        class GetFileUrlResponse extends (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Schema$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Class"])("GetFileUrlResponse")({
            data: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Schema$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Array"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Schema$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Struct"])({
                key: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Schema$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["String"],
                url: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Schema$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["String"]
            }))
        }) {
        }
        return await this.executeAsync(this.requestUploadThing("/v6/getFileUrl", keyType === "fileKey" ? {
            fileKeys: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Array$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ensure"])(keys)
        } : {
            customIds: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Array$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ensure"])(keys)
        }, GetFileUrlResponse).pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["withLogSpan"])("getFileUrls")));
    };
    /**
	* Request file list from UploadThing storage.
	* @param {object} opts
	* @param {number} opts.limit The maximum number of files to return
	* @param {number} opts.offset The number of files to skip
	*
	* @example
	* const data = await listFiles({ limit: 1 });
	* console.log(data); // { key: "2e0fdb64-9957-4262-8e45-f372ba903ac8_image.jpg", id: "2e0fdb64-9957-4262-8e45-f372ba903ac8" }
	*/ listFiles = async (opts)=>{
        guardServerOnly();
        class ListFileResponse extends (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Schema$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Class"])("ListFileResponse")({
            hasMore: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Schema$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Boolean"],
            files: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Schema$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Array"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Schema$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Struct"])({
                id: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Schema$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["String"],
                customId: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Schema$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["NullOr"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Schema$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["String"]),
                key: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Schema$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["String"],
                name: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Schema$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["String"],
                size: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Schema$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Number"],
                status: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Schema$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Literal"])("Deletion Pending", "Failed", "Uploaded", "Uploading"),
                uploadedAt: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Schema$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Number"]
            }))
        }) {
        }
        return await this.executeAsync(this.requestUploadThing("/v6/listFiles", {
            ...opts
        }, ListFileResponse).pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["withLogSpan"])("listFiles")));
    };
    renameFiles = async (updates)=>{
        guardServerOnly();
        class RenameFileResponse extends (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Schema$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Class"])("RenameFileResponse")({
            success: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Schema$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Boolean"]
        }) {
        }
        return await this.executeAsync(this.requestUploadThing("/v6/renameFiles", {
            updates: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Array$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ensure"])(updates)
        }, RenameFileResponse).pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["withLogSpan"])("renameFiles")));
    };
    getUsageInfo = async ()=>{
        guardServerOnly();
        class GetUsageInfoResponse extends (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Schema$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Class"])("GetUsageInfoResponse")({
            totalBytes: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Schema$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Number"],
            appTotalBytes: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Schema$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Number"],
            filesUploaded: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Schema$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Number"],
            limitBytes: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Schema$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Number"]
        }) {
        }
        return await this.executeAsync(this.requestUploadThing("/v6/getUsageInfo", {}, GetUsageInfoResponse).pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["withLogSpan"])("getUsageInfo")));
    };
    /**
	* Generate a presigned url for a private file
	* Unlike {@link getSignedURL}, this method does not make a fetch request to the UploadThing API
	* and is the recommended way to generate a presigned url for a private file.
	**/ generateSignedURL = async (key, opts)=>{
        guardServerOnly();
        const expiresIn = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$uploadthing$2b$shared$40$7$2e$1$2e$9$2f$node_modules$2f40$uploadthing$2f$shared$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parseTimeToSeconds"])(opts?.expiresIn ?? "5 minutes");
        if (opts?.expiresIn && isNaN(expiresIn)) throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$uploadthing$2b$shared$40$7$2e$1$2e$9$2f$node_modules$2f40$uploadthing$2f$shared$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["UploadThingError"]({
            code: "BAD_REQUEST",
            message: "expiresIn must be a valid time string, for example '1d', '2 days', or a number of seconds."
        });
        if (expiresIn > 86400 * 7) throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$uploadthing$2b$shared$40$7$2e$1$2e$9$2f$node_modules$2f40$uploadthing$2f$shared$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["UploadThingError"]({
            code: "BAD_REQUEST",
            message: "expiresIn must be less than 7 days (604800 seconds)."
        });
        const program = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["gen"])(function*() {
            const { apiKey, appId } = yield* __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$uploadthing$40$7$2e$7$2e$3_next$40$15$2e$3$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0_$5f$tailwindcss$40$4$2e$1$2e$11$2f$node_modules$2f$uploadthing$2f$dist$2f$upload$2d$builder$2d$e0_p9NOT$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["UTToken"];
            const appIdLocation = yield* __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$uploadthing$40$7$2e$7$2e$3_next$40$15$2e$3$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0_$5f$tailwindcss$40$4$2e$1$2e$11$2f$node_modules$2f$uploadthing$2f$dist$2f$upload$2d$builder$2d$e0_p9NOT$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["UfsAppIdLocation"];
            const ufsHost = yield* __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$uploadthing$40$7$2e$7$2e$3_next$40$15$2e$3$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0_$5f$tailwindcss$40$4$2e$1$2e$11$2f$node_modules$2f$uploadthing$2f$dist$2f$upload$2d$builder$2d$e0_p9NOT$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["UfsHost"];
            const proto = ufsHost.includes("local") ? "http" : "https";
            const urlBase = appIdLocation === "subdomain" ? `${proto}://${appId}.${ufsHost}/f/${key}` : `${proto}://${ufsHost}/a/${appId}/${key}`;
            const ufsUrl = yield* (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$uploadthing$2b$shared$40$7$2e$1$2e$9$2f$node_modules$2f40$uploadthing$2f$shared$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["generateSignedURL"])(urlBase, apiKey, {
                ttlInSeconds: expiresIn
            });
            return {
                ufsUrl
            };
        });
        return await this.executeAsync(program.pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["catchTag"])("ConfigError", (e)=>new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$uploadthing$2b$shared$40$7$2e$1$2e$9$2f$node_modules$2f40$uploadthing$2f$shared$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["UploadThingError"]({
                code: "INVALID_SERVER_CONFIG",
                message: "There was an error with the server configuration. More info can be found on this error's `cause` property",
                cause: e
            })), (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["withLogSpan"])("generateSignedURL")));
    };
    /**
	* Request a presigned url for a private file(s)
	* @remarks This method is no longer recommended as it makes a fetch
	* request to the UploadThing API which incurs redundant latency. It
	* will be deprecated in UploadThing v8 and removed in UploadThing v9.
	*
	* @see {@link generateSignedURL} for a more efficient way to generate a presigned url
	**/ getSignedURL = async (key, opts)=>{
        guardServerOnly();
        const expiresIn = opts?.expiresIn ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$uploadthing$2b$shared$40$7$2e$1$2e$9$2f$node_modules$2f40$uploadthing$2f$shared$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parseTimeToSeconds"])(opts.expiresIn) : void 0;
        const { keyType = this.defaultKeyType } = opts ?? {};
        if (opts?.expiresIn && isNaN(expiresIn)) throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$uploadthing$2b$shared$40$7$2e$1$2e$9$2f$node_modules$2f40$uploadthing$2f$shared$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["UploadThingError"]({
            code: "BAD_REQUEST",
            message: "expiresIn must be a valid time string, for example '1d', '2 days', or a number of seconds."
        });
        if (expiresIn && expiresIn > 86400 * 7) throw new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$uploadthing$2b$shared$40$7$2e$1$2e$9$2f$node_modules$2f40$uploadthing$2f$shared$2f$dist$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["UploadThingError"]({
            code: "BAD_REQUEST",
            message: "expiresIn must be less than 7 days (604800 seconds)."
        });
        class GetSignedUrlResponse extends (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Schema$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Class"])("GetSignedUrlResponse")({
            url: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Schema$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["String"],
            ufsUrl: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Schema$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["String"]
        }) {
        }
        return await this.executeAsync(this.requestUploadThing("/v6/requestFileAccess", keyType === "fileKey" ? {
            fileKey: key,
            expiresIn
        } : {
            customId: key,
            expiresIn
        }, GetSignedUrlResponse).pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["withLogSpan"])("getSignedURL")));
    };
    /**
	* Update the ACL of a file or set of files.
	*
	* @example
	* // Make a single file public
	* await utapi.updateACL("2e0fdb64-9957-4262-8e45-f372ba903ac8_image.jpg", "public-read");
	*
	* // Make multiple files private
	* await utapi.updateACL(
	*   [
	*     "2e0fdb64-9957-4262-8e45-f372ba903ac8_image.jpg",
	*     "1649353b-04ea-48a2-9db7-31de7f562c8d_image2.jpg",
	*   ],
	*   "private",
	* );
	*/ updateACL = async (keys, acl, opts)=>{
        guardServerOnly();
        const { keyType = this.defaultKeyType } = opts ?? {};
        const updates = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Array$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ensure"])(keys).map((key)=>{
            return keyType === "fileKey" ? {
                fileKey: key,
                acl
            } : {
                customId: key,
                acl
            };
        });
        const responseSchema = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Schema$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Struct"])({
            success: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Schema$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["Boolean"]
        });
        return await this.executeAsync(this.requestUploadThing("/v6/updateACL", {
            updates
        }, responseSchema).pipe((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["withLogSpan"])("updateACL")));
    };
};
//#endregion
//#region src/server.ts
const createUploadthing = (opts)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$uploadthing$40$7$2e$7$2e$3_next$40$15$2e$3$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0_$5f$tailwindcss$40$4$2e$1$2e$11$2f$node_modules$2f$uploadthing$2f$dist$2f$upload$2d$builder$2d$e0_p9NOT$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createBuilder"])(opts);
const createRouteHandler = (opts)=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$uploadthing$40$7$2e$7$2e$3_next$40$15$2e$3$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0_$5f$tailwindcss$40$4$2e$1$2e$11$2f$node_modules$2f$uploadthing$2f$dist$2f$upload$2d$builder$2d$e0_p9NOT$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["makeAdapterHandler"])((ev)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["succeed"])({
            req: "request" in ev ? ev.request : ev
        }), (ev)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["succeed"])("request" in ev ? ev.request : ev), opts, "server");
};
const extractRouterConfig$1 = (router)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$effect$40$3$2e$16$2e$8$2f$node_modules$2f$effect$2f$dist$2f$esm$2f$Effect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["runSync"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$uploadthing$40$7$2e$7$2e$3_next$40$15$2e$3$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0_$5f$tailwindcss$40$4$2e$1$2e$11$2f$node_modules$2f$uploadthing$2f$dist$2f$upload$2d$builder$2d$e0_p9NOT$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["extractRouterConfig"])(router));
;
 //# sourceMappingURL=index.js.map
}}),

};

//# sourceMappingURL=06364_uploadthing_449f1e84._.js.map