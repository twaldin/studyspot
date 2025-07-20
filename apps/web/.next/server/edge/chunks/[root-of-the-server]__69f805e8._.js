(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push(["chunks/[root-of-the-server]__69f805e8._.js", {

"[externals]/node:buffer [external] (node:buffer, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("node:buffer", () => require("node:buffer"));

module.exports = mod;
}}),
"[externals]/node:async_hooks [external] (node:async_hooks, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("node:async_hooks", () => require("node:async_hooks"));

module.exports = mod;
}}),
"[project]/apps/web/lib/logger.ts [middleware-edge] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "LogContext": (()=>LogContext),
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$pino$40$9$2e$7$2e$0$2f$node_modules$2f$pino$2f$browser$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/pino@9.7.0/node_modules/pino/browser.js [middleware-edge] (ecmascript)");
;
const isDevelopment = ("TURBOPACK compile-time value", "development") !== "production";
// NEXT_RUNTIME is set by Next.js in its server environments (e.g., 'nodejs', 'edge').
// We avoid pino-pretty transport in these Next.js server environments due to worker thread issues.
const shouldUsePrettyTransport = isDevelopment && typeof ("TURBOPACK compile-time value", "edge") === "undefined";
const logger = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$pino$40$9$2e$7$2e$0$2f$node_modules$2f$pino$2f$browser$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["default"])({
    level: ("TURBOPACK compile-time truthy", 1) ? "debug" : ("TURBOPACK unreachable", undefined),
    ...shouldUsePrettyTransport && {
        transport: {
            target: "pino-pretty",
            options: {
                colorize: true,
                translateTime: "SYS:standard",
                ignore: "pid,hostname"
            }
        }
    }
});
const LogContext = {
    /**
   * Create API route context
   */ api: (route, userId, additionalContext)=>({
            component: "API",
            route,
            ...userId && {
                userId
            },
            ...additionalContext
        }),
    /**
   * Create service context
   */ service: (serviceName, operation, additionalContext)=>({
            component: "SERVICE",
            service: serviceName,
            operation,
            ...additionalContext
        }),
    /**
   * Create database context
   */ database: (operation, table, additionalContext)=>({
            component: "DATABASE",
            operation,
            ...table && {
                table
            },
            ...additionalContext
        }),
    /**
   * Create cache context
   */ cache: (operation, key, additionalContext)=>({
            component: "CACHE",
            operation,
            ...key && {
                key
            },
            ...additionalContext
        }),
    /**
   * Create auth context
   */ auth: (operation, userId, additionalContext)=>({
            component: "AUTH",
            operation,
            ...userId && {
                userId
            },
            ...additionalContext
        }),
    /**
   * Create middleware context
   */ middleware: (middlewareName, additionalContext)=>({
            component: "MIDDLEWARE",
            middleware: middlewareName,
            ...additionalContext
        }),
    /**
   * Create AI service context
   */ ai: (operation, provider, additionalContext)=>({
            component: "AI",
            operation,
            ...provider && {
                provider
            },
            ...additionalContext
        }),
    /**
   * Create file operation context
   */ file: (operation, fileId, additionalContext)=>({
            component: "FILE",
            operation,
            ...fileId && {
                fileId
            },
            ...additionalContext
        })
};
const __TURBOPACK__default__export__ = logger;
}}),
"[project]/apps/web/lib/clerk.ts [middleware-edge] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "clearAllUserCache": (()=>clearAllUserCache),
    "clearSelectedCourseForUser": (()=>clearSelectedCourseForUser),
    "clearUserCache": (()=>clearUserCache),
    "getSelectedCourseForUser": (()=>getSelectedCourseForUser),
    "getUserOnboardingStatus": (()=>getUserOnboardingStatus),
    "setSelectedCourseForUser": (()=>setSelectedCourseForUser)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$nextjs$40$6$2e$25$2e$4_next$40$15$2e$3$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0_$5f$react$2d$dom_993f2304ac49737132d3038eea44a508$2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$server$2f$clerkClient$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+nextjs@6.25.4_next@15.3.4_react-dom@19.1.0_react@19.1.0__react@19.1.0__react-dom_993f2304ac49737132d3038eea44a508/node_modules/@clerk/nextjs/dist/esm/server/clerkClient.js [middleware-edge] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$logger$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/lib/logger.ts [middleware-edge] (ecmascript)");
;
;
const setSelectedCourseForUser = async (userId, courseId)=>{
    try {
        const client = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$nextjs$40$6$2e$25$2e$4_next$40$15$2e$3$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0_$5f$react$2d$dom_993f2304ac49737132d3038eea44a508$2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$server$2f$clerkClient$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["clerkClient"])();
        await client.users.updateUserMetadata(userId, {
            publicMetadata: {
                selectedCourseId: courseId
            }
        });
        // Clear cache after updating metadata
        clearUserCache(userId);
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$logger$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["default"].info({
            userId,
            courseId
        }, "Successfully set selected course for user");
    } catch (error) {
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$logger$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["default"].error({
            error,
            userId,
            courseId
        }, "Error updating user metadata with selected course");
        throw new Error("Failed to set selected course for user.");
    }
};
const clearSelectedCourseForUser = async (userId)=>{
    try {
        const client = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$nextjs$40$6$2e$25$2e$4_next$40$15$2e$3$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0_$5f$react$2d$dom_993f2304ac49737132d3038eea44a508$2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$server$2f$clerkClient$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["clerkClient"])();
        await client.users.updateUserMetadata(userId, {
            publicMetadata: {
                selectedCourseId: undefined
            }
        });
        // Clear cache after updating metadata
        clearUserCache(userId);
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$logger$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["default"].info({
            userId
        }, "Successfully cleared selected course for user");
    } catch (error) {
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$logger$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["default"].error({
            error,
            userId
        }, "Error clearing selected course for user");
        throw new Error("Failed to clear selected course for user.");
    }
};
// Cache for user data to avoid redundant Clerk API calls
const userDataCache = new Map();
// Production-aware cache duration
const getCacheDuration = ()=>{
    const isProduction = ("TURBOPACK compile-time value", "development") === 'production';
    // Shorter cache in production to handle metadata updates better
    return ("TURBOPACK compile-time falsy", 0) ? ("TURBOPACK unreachable", undefined) : 5 * 60 * 1000; // 30 seconds in prod, 5 minutes in dev
};
async function getCachedUser(userId, bypassCache = false) {
    const cached = userDataCache.get(userId);
    const now = Date.now();
    const CACHE_DURATION = getCacheDuration();
    // Allow cache bypass for critical operations
    if (!bypassCache && cached && now - cached.timestamp < CACHE_DURATION) {
        return cached.user;
    }
    try {
        const client = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$nextjs$40$6$2e$25$2e$4_next$40$15$2e$3$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0_$5f$react$2d$dom_993f2304ac49737132d3038eea44a508$2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$server$2f$clerkClient$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["clerkClient"])();
        const user = await client.users.getUser(userId);
        // Cache the user data with timestamp
        userDataCache.set(userId, {
            user,
            timestamp: now
        });
        return user;
    } catch (error) {
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$logger$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["default"].error({
            error,
            userId
        }, "Error fetching user from Clerk");
        throw error;
    }
}
// Force fresh user data - bypasses cache entirely
async function getFreshUser(userId) {
    return getCachedUser(userId, true);
}
const clearUserCache = (userId)=>{
    userDataCache.delete(userId);
};
const clearAllUserCache = ()=>{
    userDataCache.clear();
};
const getSelectedCourseForUser = async (userId, forceFresh = false)=>{
    try {
        const user = forceFresh ? await getFreshUser(userId) : await getCachedUser(userId);
        return user.publicMetadata.selectedCourseId;
    } catch (error) {
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$logger$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["default"].error({
            error,
            userId
        }, "Error fetching user metadata for selected course");
        // It's possible the user doesn't have this metadata set yet, so don't throw an error, just return undefined.
        return undefined;
    }
};
const getUserOnboardingStatus = async (userId, forceFresh = false)=>{
    try {
        const user = forceFresh ? await getFreshUser(userId) : await getCachedUser(userId);
        // Handle cases where metadata might be null or undefined during transitions
        const publicMetadata = user.publicMetadata || {};
        const hasCompletedOnboarding = publicMetadata.hasCompletedOnboarding;
        const selectedSchool = publicMetadata.selectedSchool;
        const selectedSchoolName = publicMetadata.selectedSchoolName;
        const selectedSchoolDomain = publicMetadata.selectedSchoolDomain;
        return {
            hasCompletedOnboarding: !!hasCompletedOnboarding,
            selectedSchool: selectedSchool || undefined,
            selectedSchoolName: selectedSchoolName || undefined,
            selectedSchoolDomain: selectedSchoolDomain || undefined
        };
    } catch (error) {
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$logger$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["default"].error({
            error,
            userId
        }, "Error fetching user onboarding status");
        return {
            hasCompletedOnboarding: false
        };
    }
};
}}),
"[project]/apps/web/middleware.ts [middleware-edge] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$nextjs$40$6$2e$25$2e$4_next$40$15$2e$3$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0_$5f$react$2d$dom_993f2304ac49737132d3038eea44a508$2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$server$2f$clerkMiddleware$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+nextjs@6.25.4_next@15.3.4_react-dom@19.1.0_react@19.1.0__react@19.1.0__react-dom_993f2304ac49737132d3038eea44a508/node_modules/@clerk/nextjs/dist/esm/server/clerkMiddleware.js [middleware-edge] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$nextjs$40$6$2e$25$2e$4_next$40$15$2e$3$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0_$5f$react$2d$dom_993f2304ac49737132d3038eea44a508$2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$server$2f$routeMatcher$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+nextjs@6.25.4_next@15.3.4_react-dom@19.1.0_react@19.1.0__react@19.1.0__react-dom_993f2304ac49737132d3038eea44a508/node_modules/@clerk/nextjs/dist/esm/server/routeMatcher.js [middleware-edge] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$28$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$esm$2f$api$2f$server$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.3.4_@babel+core@7.28.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/esm/api/server.js [middleware-edge] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$28$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@15.3.4_@babel+core@7.28.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/esm/server/web/spec-extension/response.js [middleware-edge] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$clerk$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/lib/clerk.ts [middleware-edge] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$nextjs$40$6$2e$25$2e$4_next$40$15$2e$3$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0_$5f$react$2d$dom_993f2304ac49737132d3038eea44a508$2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$server$2f$clerkClient$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@clerk+nextjs@6.25.4_next@15.3.4_react-dom@19.1.0_react@19.1.0__react@19.1.0__react-dom_993f2304ac49737132d3038eea44a508/node_modules/@clerk/nextjs/dist/esm/server/clerkClient.js [middleware-edge] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$logger$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/lib/logger.ts [middleware-edge] (ecmascript)");
;
;
;
;
;
const isProtectedRoute = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$nextjs$40$6$2e$25$2e$4_next$40$15$2e$3$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0_$5f$react$2d$dom_993f2304ac49737132d3038eea44a508$2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$server$2f$routeMatcher$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["createRouteMatcher"])([
    "/",
    "/courses(.*)",
    "/onboarding(.*)",
    "/content(.*)",
    "/chat(.*)"
]);
const isOnboardingRoute = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$nextjs$40$6$2e$25$2e$4_next$40$15$2e$3$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0_$5f$react$2d$dom_993f2304ac49737132d3038eea44a508$2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$server$2f$routeMatcher$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["createRouteMatcher"])([
    "/onboarding(.*)"
]);
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$nextjs$40$6$2e$25$2e$4_next$40$15$2e$3$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0_$5f$react$2d$dom_993f2304ac49737132d3038eea44a508$2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$server$2f$clerkMiddleware$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["clerkMiddleware"])(async (auth, req)=>{
    try {
        if (isProtectedRoute(req)) {
            const { userId } = await auth();
            if (!userId) {
                const signInUrl = new URL("/sign-in", req.url);
                signInUrl.searchParams.set("redirectUrl", req.url);
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$28$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(signInUrl);
            }
            // Always allow onboarding routes - no additional checks needed
            if (isOnboardingRoute(req)) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$28$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next();
            }
            const onboardingStatus = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$clerk$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["getUserOnboardingStatus"])(userId);
            // If user hasn't completed onboarding, redirect to onboarding
            if (!onboardingStatus.hasCompletedOnboarding) {
                const onboardingUrl = new URL("/onboarding/select-school", req.url);
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$28$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(onboardingUrl);
            }
            // User has completed onboarding, check for selected course only for non-courses pages
            if (!req.nextUrl.pathname.startsWith("/courses")) {
                try {
                    const client = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$clerk$2b$nextjs$40$6$2e$25$2e$4_next$40$15$2e$3$2e$4_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0_$5f$react$2d$dom_993f2304ac49737132d3038eea44a508$2f$node_modules$2f40$clerk$2f$nextjs$2f$dist$2f$esm$2f$server$2f$clerkClient$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["clerkClient"])();
                    const isProduction = ("TURBOPACK compile-time value", "development") === 'production';
                    // In production, add retry logic for metadata consistency
                    let user;
                    let selectedCourseId;
                    if ("TURBOPACK compile-time falsy", 0) {
                        "TURBOPACK unreachable";
                    } else {
                        // Development - single fetch
                        user = await client.users.getUser(userId);
                        selectedCourseId = user.publicMetadata?.selectedCourseId;
                    }
                    // Check if this might be a metadata propagation delay
                    const schoolSwitchCookie = req.cookies.get('school-switch-timestamp');
                    const timeSinceSwitch = schoolSwitchCookie ? Date.now() - parseInt(schoolSwitchCookie.value) : Infinity;
                    // If no selected course, check for grace periods before redirecting
                    if (!selectedCourseId) {
                        // Check for recent school switch (30 second window)
                        if (isProduction && timeSinceSwitch < 30000) {
                            "TURBOPACK unreachable";
                        }
                        // Check for recent course selection (allow navigation to main page after "Enter Course")
                        const courseSelectionCookie = req.cookies.get('course-selection-timestamp');
                        const timeSinceCourseSelection = courseSelectionCookie ? Date.now() - parseInt(courseSelectionCookie.value) : Infinity;
                        if (isProduction && timeSinceCourseSelection < 15000) {
                            "TURBOPACK unreachable";
                        }
                        // If we're navigating to the home page and it's recent activity, be more lenient
                        if ("TURBOPACK compile-time falsy", 0) {
                            "TURBOPACK unreachable";
                        }
                        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$logger$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["default"].info({
                            userId,
                            selectedCourseId,
                            timeSinceSwitch,
                            timeSinceCourseSelection,
                            pathname: req.nextUrl.pathname
                        }, "No selected course found, redirecting to courses page");
                        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$28$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL("/courses", req.url));
                    }
                } catch (error) {
                    __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$logger$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["default"].error({
                        error,
                        url: req.url
                    }, "Error checking selected course in middleware");
                    // In production, be more lenient with errors during metadata propagation
                    if ("TURBOPACK compile-time falsy", 0) {
                        "TURBOPACK unreachable";
                    }
                }
            }
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$28$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next();
    } catch (error) {
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$lib$2f$logger$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["default"].error({
            error,
            url: req.url
        }, "Middleware execution error");
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$15$2e$3$2e$4_$40$babel$2b$core$40$7$2e$28$2e$0_react$2d$dom$40$19$2e$1$2e$0_react$40$19$2e$1$2e$0_$5f$react$40$19$2e$1$2e$0$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next();
    }
});
}}),
}]);

//# sourceMappingURL=%5Broot-of-the-server%5D__69f805e8._.js.map