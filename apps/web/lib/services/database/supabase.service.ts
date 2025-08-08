import { createClient } from "@supabase/supabase-js";
import { auth } from "@clerk/nextjs/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";
import logger, { LogContext } from "@/lib/logger";

/**
 * Supabase client configuration options
 */
export interface SupabaseClientOptions {
  useAuth?: boolean;
  timeout?: number;
  retries?: number;
  schema?: string;
}

/**
 * Query options for database operations
 */
export interface QueryOptions {
  timeout?: number;
  retries?: number;
  throwOnError?: boolean;
}

/**
 * Database operation result
 */
export interface DatabaseResult<T = any> {
  data: T | null;
  error: any;
  count?: number | null;
}

/**
 * Service for managing Supabase client instances and database operations
 */
export class SupabaseService {
  private static instance: SupabaseService;
  private clientCache = new Map<string, SupabaseClient<Database>>();
  private readonly DEFAULT_TIMEOUT = 10000; // 10 seconds
  private readonly DEFAULT_RETRIES = 3;

  private constructor() { }

  /**
   * Get singleton instance
   */
  public static getInstance(): SupabaseService {
    if (!SupabaseService.instance) {
      SupabaseService.instance = new SupabaseService();
    }
    return SupabaseService.instance;
  }

  /**
   * Create an authenticated Supabase client using Clerk JWT
   */
  public async createAuthenticatedClient(
    options: SupabaseClientOptions = {},
  ): Promise<SupabaseClient<Database>> {
    try {
      const { getToken, userId } = await auth();

      if (!getToken || !userId) {
        throw new Error("Unauthorized");
      }

      const token = await getToken({ template: "supabase" });
      if (!token) {
        throw new Error("Unauthorized");
      }

      // Create new client without caching
      const client = createClient<Database>(
        this.getSupabaseUrl(),
        this.getSupabaseAnonKey(),
        {
          global: {
            headers: {
              Authorization: `Bearer ${token}`,
              "x-request-timeout": (options.timeout || this.DEFAULT_TIMEOUT)
                .toString(),
            },
          },
          db: {
            schema: (options.schema as "public") || "public",
          },
        },
      );

      logger.debug(
        LogContext.database("create_client", undefined, {
          type: "authenticated",
        }),
        "Created new authenticated Supabase client",
      );
      return client;
    } catch (error) {
      logger.error({ error }, "Failed to create authenticated Supabase client");
      throw error;
    }
  }

  /**
   * Create an anonymous Supabase client for public operations
   */
  public createAnonymousClient(
    options: SupabaseClientOptions = {},
  ): SupabaseClient<Database> {
    try {
      const cacheKey = "anonymous";

      // Check cache first
      if (this.clientCache.has(cacheKey)) {
        return this.clientCache.get(cacheKey)!;
      }

      // Create new anonymous client
      const client = createClient<Database>(
        this.getSupabaseUrl(),
        this.getSupabaseAnonKey(),
        {
          global: {
            headers: {
              "x-request-timeout": (options.timeout || this.DEFAULT_TIMEOUT)
                .toString(),
            },
          },
          db: {
            schema: (options.schema as "public") || "public",
          },
        },
      );

      // Cache the client
      this.clientCache.set(cacheKey, client);

      logger.debug(
        LogContext.database("create_client", undefined, {
          cacheKey,
          timeout: options.timeout,
          type: "anonymous",
        }),
        "Created anonymous Supabase client",
      );
      return client;
    } catch (error) {
      logger.error({ error }, "Failed to create anonymous Supabase client");
      throw error;
    }
  }

  /**
   * Execute a database query with error handling and retries
   */
  public async executeQuery<T>(
    queryFn: (client: SupabaseClient<Database>) => Promise<DatabaseResult<T>>,
    options: QueryOptions & { useAuth?: boolean } = {},
  ): Promise<DatabaseResult<T>> {
    const maxRetries = options.retries || this.DEFAULT_RETRIES;
    const useAuth = options.useAuth !== false; // Default to true

    let lastError: any;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        // Get appropriate client
        const client = useAuth
          ? await this.createAuthenticatedClient({ timeout: options.timeout })
          : this.createAnonymousClient({ timeout: options.timeout });

        // Execute query
        const result = await queryFn(client);

        // Handle Supabase errors
        if (result.error) {
          lastError = result.error;

          // Don't retry certain errors
          if (this.shouldNotRetry(result.error)) {
            if (options.throwOnError !== false) {
              throw new Error(result.error.message || "Database error");
            }
            return result;
          }

          if (attempt === maxRetries) {
            if (options.throwOnError !== false) {
              throw new Error(result.error.message || "Database error");
            }
            return result;
          }

          // Wait before retry (exponential backoff)
          const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
          await new Promise((resolve) => setTimeout(resolve, delay));
          continue;
        }

        // Success
        logger.debug(
          LogContext.database("query_success", undefined, {
            attempt,
            dataCount: Array.isArray(result.data)
              ? result.data.length
              : result.data
                ? 1
                : 0,
            useAuth,
          }),
          "Query executed successfully",
        );

        return result;
      } catch (error) {
        lastError = error;

        if (attempt === maxRetries) {
          if (options.throwOnError !== false) {
            throw error;
          }
          return { data: null, error };
        }

        // Wait before retry
        const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    // Should never reach here, but just in case
    if (options.throwOnError !== false) {
      throw lastError || new Error("Query failed after all retries");
    }

    return { data: null, error: lastError };
  }

  /**
   * Clear cached clients
   */
  public clearCache(): void {
    this.clientCache.clear();
    logger.debug(
      LogContext.cache("clear", "supabase_clients"),
      "Cleared Supabase client cache",
    );
  }

  /**
   * Get Supabase URL from environment
   */
  private getSupabaseUrl(): string {
    // Ensure env is initialized
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!url) throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL');
    return url;
  }

  /**
   * Get Supabase anonymous key from environment
   */
  private getSupabaseAnonKey(): string {
    // Ensure env is initialized
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!key) throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY');
    return key;
  }

  /**
   * Determine if an error should not be retried
   */
  private shouldNotRetry(error: any): boolean {
    const code = error?.code;

    // Don't retry these PostgreSQL error codes
    const noRetryErrors = [
      "23505", // unique_violation
      "23503", // foreign_key_violation
      "23502", // not_null_violation
      "23514", // check_violation
      "42501", // insufficient_privilege
      "42602", // invalid_name
      "42703", // undefined_column
      "42P01", // undefined_table
      "42883", // undefined_function
    ];

    return noRetryErrors.includes(code);
  }
}

// Export singleton instance for convenience
export const supabaseService = SupabaseService.getInstance();

/**
 * Creates a service role client for admin operations
 */
// Import at the top of the file (will be no-op if not available)
let getCloudflareContext: any;
try {
  getCloudflareContext = require('@opennextjs/cloudflare').getCloudflareContext;
} catch (e) {
  // Not in Cloudflare environment
}

export function createServiceRoleClient() {
  let supabaseUrl: string | undefined;
  let serviceRoleKey: string | undefined;
  
  // Try Cloudflare context first (production)
  if (typeof getCloudflareContext === 'function') {
    try {
      const context = getCloudflareContext();
      if (context?.env) {
        // In Cloudflare Workers, secrets are in context.env
        supabaseUrl = context.env.SUPABASE_URL || context.env.NEXT_PUBLIC_SUPABASE_URL;
        serviceRoleKey = context.env.SUPABASE_SERVICE_ROLE_KEY;
        
        if (serviceRoleKey) {
          logger.info("Using SUPABASE_SERVICE_ROLE_KEY from Cloudflare context");
        }
      }
    } catch (error) {
      logger.warn("Failed to get Cloudflare context:", error);
    }
  }
  
  // Fallback to process.env (local dev)
  if (!supabaseUrl) {
    supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  }
  if (!serviceRoleKey) {
    serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (serviceRoleKey) {
      logger.info("Using SUPABASE_SERVICE_ROLE_KEY from process.env");
    }
  }
  
  if (!serviceRoleKey) {
    logger.error("SUPABASE_SERVICE_ROLE_KEY is not set in Cloudflare context or process.env");
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set");
  }
  
  if (!supabaseUrl) {
    logger.error("SUPABASE_URL is not set");
    throw new Error("SUPABASE_URL is not set");
  }

  return createClient<Database>(
    supabaseUrl,
    serviceRoleKey,
  );
}