import { createClient } from "@supabase/supabase-js";
import { auth } from "@clerk/nextjs/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";
import logger, { LogContext } from "@/lib/logger";
import { errorService } from "../core/error-response.service";

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
   * This is the primary method for server-side authenticated operations
   * @param options - Client configuration options
   * @returns Promise resolving to authenticated SupabaseClient
   */
  public async createAuthenticatedClient(
    options: SupabaseClientOptions = {},
  ): Promise<SupabaseClient<Database>> {
    try {
      const { getToken, userId } = await auth();

      if (!getToken || !userId) {
        throw errorService.createAuthError("unauthorized", {
          operation: "createAuthenticatedClient",
        });
      }

      // Get token and validate it
      const token = await getToken({ template: "supabase" });
      if (!token || !this.isTokenValid(token)) {
        // Clear any stale cached clients for this user
        this.clearUserCache(userId);
        throw errorService.createAuthError("unauthorized", {
          operation: "createAuthenticatedClient",
          userId,
        });
      }

      // Create user-specific cache key with token fingerprint
      const tokenFingerprint = this.getTokenFingerprint(token);
      const cacheKey = `auth_${userId}_${tokenFingerprint}`;

      // Check cache first
      if (this.clientCache.has(cacheKey)) {
        const cachedClient = this.clientCache.get(cacheKey)!;
        return cachedClient;
      }

      // Create new client
      const client = createClient<Database>(
        this.getSupabaseUrl(),
        this.getSupabaseAnonKey(),
        {
          accessToken: async () => await getToken({ template: "supabase" }),
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

      // Cache the client (with TTL handled by cleanup)
      this.clientCache.set(cacheKey, client);

      // Schedule cleanup after 15 minutes
      setTimeout(() => {
        this.clientCache.delete(cacheKey);
      }, 15 * 60 * 1000);

      logger.debug(
        LogContext.database("create_client", undefined, {
          cacheKey,
          timeout: options.timeout,
          type: "authenticated",
        }),
        "Created authenticated Supabase client",
      );
      return client;
    } catch (error) {
      if (errorService.isServiceError(error)) {
        throw error;
      }

      const serviceError = errorService.createError(
        "database_error",
        "Failed to create authenticated Supabase client",
        {
          originalError: error,
          context: { options },
        },
      );

      throw serviceError;
    }
  }

  /**
   * Create an anonymous Supabase client for public operations
   * @param options - Client configuration options
   * @returns Anonymous SupabaseClient
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
      const serviceError = errorService.createError(
        "database_error",
        "Failed to create anonymous Supabase client",
        {
          originalError: error,
          context: { options },
        },
      );

      throw serviceError;
    }
  }

  /**
   * Execute a database query with error handling and retries
   * @param queryFn - Function that executes the query
   * @param options - Query options
   * @returns Promise resolving to query result
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
          const dbError = errorService.mapDatabaseError(result.error, {
            attempt,
            maxRetries,
            useAuth,
          });

          // Don't retry certain errors
          if (this.shouldNotRetry(result.error)) {
            if (options.throwOnError !== false) {
              throw dbError;
            }
            return result;
          }

          lastError = dbError;

          if (attempt === maxRetries) {
            if (options.throwOnError !== false) {
              throw dbError;
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

        // Don't retry service errors that aren't database-related
        if (
          errorService.isServiceError(error) && error.type !== "database_error"
        ) {
          if (options.throwOnError !== false) {
            throw error;
          }
          return { data: null, error };
        }

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
      throw lastError ||
      errorService.createError(
        "database_error",
        "Query failed after all retries",
      );
    }

    return { data: null, error: lastError };
  }

  /**
   * Execute multiple queries in a transaction
   * @param queries - Array of query functions
   * @param options - Transaction options
   * @returns Promise resolving to array of results
   */
  public async executeTransaction<T>(
    queries: Array<
      (client: SupabaseClient<Database>) => Promise<DatabaseResult<T>>
    >,
    options: QueryOptions & { useAuth?: boolean } = {},
  ): Promise<DatabaseResult<T[]>> {
    try {
      const useAuth = options.useAuth !== false;
      const client = useAuth
        ? await this.createAuthenticatedClient({ timeout: options.timeout })
        : this.createAnonymousClient({ timeout: options.timeout });

      // Note: Supabase doesn't have explicit transaction support in the client library
      // This is a best-effort sequential execution
      // For true transactions, you'd need to use stored procedures or RPC calls

      const results: T[] = [];

      for (const queryFn of queries) {
        const result = await queryFn(client);

        if (result.error) {
          const dbError = errorService.mapDatabaseError(result.error, {
            operation: "transaction",
            queryIndex: results.length,
            totalQueries: queries.length,
          });

          return { data: null, error: dbError };
        }

        if (result.data !== null) {
          results.push(result.data);
        }
      }

      logger.debug({
        queryCount: queries.length,
        resultCount: results.length,
        useAuth,
      }, "Transaction executed successfully");

      return { data: results, error: null };
    } catch (error) {
      const serviceError = errorService.handleUnknownError(error, {
        operation: "transaction",
        queryCount: queries.length,
      });

      return { data: null, error: serviceError };
    }
  }

  /**
   * Helper method to safely execute a select query
   * @param tableName - Table to query
   * @param options - Query configuration
   * @returns Promise resolving to query result
   */
  public async select<T>(
    tableName: keyof Database["public"]["Tables"],
    options: {
      select?: string;
      filter?: (query: any) => any;
      limit?: number;
      offset?: number;
      orderBy?: { column: string; ascending?: boolean };
      single?: boolean;
      useAuth?: boolean;
    } & QueryOptions = {},
  ): Promise<DatabaseResult<T | T[]>> {
    return this.executeQuery<T | T[]>(async (client) => {
      const table = client.from(tableName as string);
      let query: any = table.select(options.select || "*");

      // Apply filter if provided
      if (options.filter) {
        query = options.filter(query);
      }

      // Apply ordering
      if (options.orderBy) {
        query = query.order(options.orderBy.column, {
          ascending: options.orderBy.ascending !== false,
        });
      }

      // Apply pagination
      if (options.limit) {
        query = query.limit(options.limit);
      }
      if (options.offset) {
        query = query.range(
          options.offset,
          (options.offset + (options.limit || 1000)) - 1,
        );
      }

      // Execute query and cast result
      const result = options.single ? await query.single() : await query;
      return result as DatabaseResult<T | T[]>;
    }, options);
  }

  /**
   * Helper method to safely execute an insert query
   * @param tableName - Table to insert into
   * @param data - Data to insert
   * @param options - Insert configuration
   * @returns Promise resolving to insert result
   */
  public async insert<T>(
    tableName: keyof Database["public"]["Tables"],
    data: any | any[],
    options: {
      select?: string;
      upsert?: boolean;
      onConflict?: string;
      returning?: boolean;
      useAuth?: boolean;
    } & QueryOptions = {},
  ): Promise<DatabaseResult<T | T[]>> {
    return this.executeQuery<T | T[]>(async (client) => {
      const table = client.from(tableName as string);
      let query: any;

      if (options.upsert) {
        query = table.upsert(data, {
          onConflict: options.onConflict,
          ignoreDuplicates: false,
        });
      } else {
        query = table.insert(data);
      }

      if (options.returning !== false && options.select) {
        query = query.select(options.select);
      } else if (options.returning !== false) {
        query = query.select();
      }

      const result = await query;
      return result as DatabaseResult<T | T[]>;
    }, options);
  }

  /**
   * Helper method to safely execute an update query
   * @param tableName - Table to update
   * @param data - Data to update
   * @param filter - Filter function to specify which rows to update
   * @param options - Update configuration
   * @returns Promise resolving to update result
   */
  public async update<T>(
    tableName: keyof Database["public"]["Tables"],
    data: any,
    filter: (query: any) => any,
    options: {
      select?: string;
      returning?: boolean;
      useAuth?: boolean;
    } & QueryOptions = {},
  ): Promise<DatabaseResult<T | T[]>> {
    return this.executeQuery<T | T[]>(async (client) => {
      const table = client.from(tableName as string);
      let query: any = table.update(data);

      // Apply filter
      query = filter(query);

      if (options.returning !== false && options.select) {
        query = query.select(options.select);
      } else if (options.returning !== false) {
        query = query.select();
      }

      const result = await query;
      return result as DatabaseResult<T | T[]>;
    }, options);
  }

  /**
   * Helper method to safely execute a delete query
   * @param tableName - Table to delete from
   * @param filter - Filter function to specify which rows to delete
   * @param options - Delete configuration
   * @returns Promise resolving to delete result
   */
  public async delete<T>(
    tableName: keyof Database["public"]["Tables"],
    filter: (query: any) => any,
    options: {
      select?: string;
      returning?: boolean;
      useAuth?: boolean;
    } & QueryOptions = {},
  ): Promise<DatabaseResult<T | T[]>> {
    return this.executeQuery<T | T[]>(async (client) => {
      const table = client.from(tableName as string);
      let query: any = table.delete();

      // Apply filter
      query = filter(query);

      if (options.returning !== false && options.select) {
        query = query.select(options.select);
      } else if (options.returning !== false) {
        query = query.select();
      }

      const result = await query;
      return result as DatabaseResult<T | T[]>;
    }, options);
  }

  /**
   * Execute a stored procedure or RPC call
   * @param functionName - Name of the stored procedure
   * @param params - Parameters to pass to the function
   * @param options - RPC configuration
   * @returns Promise resolving to RPC result
   */
  public async rpc<T>(
    functionName: string,
    params: Record<string, any> = {},
    options: {
      useAuth?: boolean;
    } & QueryOptions = {},
  ): Promise<DatabaseResult<T>> {
    return this.executeQuery<T>(async (client) => {
      const result = await client.rpc(functionName, params);
      return result as DatabaseResult<T>;
    }, options);
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
   * Clear cached clients for a specific user
   */
  public clearUserCache(userId: string): void {
    const keysToDelete: string[] = [];
    for (const key of this.clientCache.keys()) {
      if (key.startsWith(`auth_${userId}_`)) {
        keysToDelete.push(key);
      }
    }
    keysToDelete.forEach((key) => this.clientCache.delete(key));
    logger.debug(
      LogContext.cache("clear", "user_supabase_clients", {
        userId,
        keysCleared: keysToDelete.length,
      }),
      "Cleared user-specific Supabase client cache",
    );
  }

  /**
   * Validate JWT token (check expiration)
   */
  private isTokenValid(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const now = Math.floor(Date.now() / 1000);
      // Check if token expires within next 30 seconds (buffer)
      return payload.exp && payload.exp > (now + 30);
    } catch {
      return false;
    }
  }

  /**
   * Get a fingerprint of the token for cache keying
   */
  private getTokenFingerprint(token: string): string {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      // Use issued at time + first 8 chars of token as fingerprint
      return `${payload.iat || "unknown"}_${token.slice(-8)}`;
    } catch {
      return token.slice(-8) || "invalid";
    }
  }

  /**
   * Get current cache size
   */
  public getCacheSize(): number {
    return this.clientCache.size;
  }

  /**
   * Get Supabase URL from environment
   */
  private getSupabaseUrl(): string {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!url) {
      throw errorService.createError(
        "server_error",
        "NEXT_PUBLIC_SUPABASE_URL environment variable is not set",
      );
    }
    return url;
  }

  /**
   * Get Supabase anonymous key from environment
   */
  private getSupabaseAnonKey(): string {
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!key) {
      throw errorService.createError(
        "server_error",
        "NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable is not set",
      );
    }
    return key;
  }

  /**
   * Determine if an error should not be retried
   * @param error - Database error
   * @returns True if error should not be retried
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
 * Creates an authenticated Supabase client using Clerk for backward compatibility.
 *
 * @returns An server Supabase client instance.
 */

export function createServiceRoleClient() {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    logger.error("SUPABASE_SERVICE_ROLE_KEY is not set");
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set");
  }

  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}
