import pino from "pino";

const isDevelopment = process.env.NODE_ENV !== "production";
// For standalone server, use pretty transport in development only
const shouldUsePrettyTransport = isDevelopment;

const logger = pino({
  level: isDevelopment ? "debug" : "info",
  ...(shouldUsePrettyTransport && { // Only add transport if not in Next.js server runtime
    transport: {
      target: "pino-pretty",
      options: {
        colorize: true,
        translateTime: "SYS:standard",
        ignore: "pid,hostname",
      },
    },
  }),
});

/**
 * Standardized logging context creators for consistent formatting
 */
export const LogContext = {
  /**
   * Create API route context
   */
  api: (
    route: string,
    userId?: string,
    additionalContext?: Record<string, any>,
  ) => ({
    component: "API",
    route,
    ...(userId && { userId }),
    ...additionalContext,
  }),

  /**
   * Create service context
   */
  service: (
    serviceName: string,
    operation: string,
    additionalContext?: Record<string, any>,
  ) => ({
    component: "SERVICE",
    service: serviceName,
    operation,
    ...additionalContext,
  }),

  /**
   * Create database context
   */
  database: (
    operation: string,
    table?: string,
    additionalContext?: Record<string, any>,
  ) => ({
    component: "DATABASE",
    operation,
    ...(table && { table }),
    ...additionalContext,
  }),

  /**
   * Create cache context
   */
  cache: (
    operation: "hit" | "miss" | "set" | "clear",
    key?: string,
    additionalContext?: Record<string, any>,
  ) => ({
    component: "CACHE",
    operation,
    ...(key && { key }),
    ...additionalContext,
  }),

  /**
   * Create auth context
   */
  auth: (
    operation: string,
    userId?: string,
    additionalContext?: Record<string, any>,
  ) => ({
    component: "AUTH",
    operation,
    ...(userId && { userId }),
    ...additionalContext,
  }),

  /**
   * Create middleware context
   */
  middleware: (
    middlewareName: string,
    additionalContext?: Record<string, any>,
  ) => ({
    component: "MIDDLEWARE",
    middleware: middlewareName,
    ...additionalContext,
  }),

  /**
   * Create AI service context
   */
  ai: (
    operation: string,
    provider?: string,
    additionalContext?: Record<string, any>,
  ) => ({
    component: "AI",
    operation,
    ...(provider && { provider }),
    ...additionalContext,
  }),

  /**
   * Create file operation context
   */
  file: (
    operation: string,
    fileId?: string,
    additionalContext?: Record<string, any>,
  ) => ({
    component: "FILE",
    operation,
    ...(fileId && { fileId }),
    ...additionalContext,
  }),
};

export default logger;
