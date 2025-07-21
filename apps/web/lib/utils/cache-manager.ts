import { QueryClient } from "@tanstack/react-query";
import logger from "@/lib/logger";

/**
 * Comprehensive cache manager for school switching operations
 */
export class CacheManager {
  /**
   * Nuclear option: Clear ALL caches across the entire application
   * This ensures no stale data survives a school switch
   */
  static async clearAllCaches(userId?: string, queryClient?: QueryClient): Promise<void> {
    try {
      logger.info({ userId }, "Starting complete cache clear for school switch");

      // 1. Clear React Query cache completely (use provided client if available)
      if (queryClient) {
        await queryClient.clear();
      }
      
      // 2. Clear any client-side cached data
      if (typeof window !== 'undefined') {
        // Clear any cached database connections or tokens
        Object.keys(localStorage).forEach(key => {
          if (key.startsWith('supabase-') || key.includes('supabase')) {
            localStorage.removeItem(key);
          }
        });
      }
      
      // 3. Clear any client-side Clerk cache (if available)
      if (typeof window !== 'undefined') {
        // Clear any Clerk-related localStorage/sessionStorage
        Object.keys(localStorage).forEach(key => {
          if (key.startsWith('clerk-') || key.includes('clerk')) {
            localStorage.removeItem(key);
          }
        });
      }
      
      // 4. Clear browser session storage (temporary data)
      if (typeof window !== 'undefined') {
        sessionStorage.clear();
        
        // Clear any school-related cookies
        document.cookie = 'school-switch-timestamp=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        document.cookie = 'course-selection-timestamp=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      }
      
      // 5. Clear backend user cache
      if (userId) {
        try {
          await fetch('/api/user/cache', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId })
          });
        } catch (error) {
          logger.warn("Failed to clear backend user cache");
        }
      }

      logger.info({ userId }, "Complete cache clear successful");
    } catch (error) {
      logger.error({ error, userId }, "Failed to clear all caches");
      throw error;
    }
  }

  /**
   * Clear only React Query cache (for lighter operations)
   */
  static async clearReactQueryCache(queryClient?: QueryClient): Promise<void> {
    try {
      if (queryClient) {
        await queryClient.clear();
        logger.info("React Query cache cleared");
      }
    } catch (error) {
      logger.error({ error }, "Failed to clear React Query cache");
      throw error;
    }
  }

  /**
   * Force refresh all auth-related clients and tokens
   */
  static async refreshAuthClients(userId: string): Promise<void> {
    try {
      // Clear client-side auth storage
      if (typeof window !== 'undefined') {
        Object.keys(localStorage).forEach(key => {
          if (key.startsWith('clerk-') || key.includes('clerk') || key.startsWith('supabase-') || key.includes('supabase')) {
            localStorage.removeItem(key);
          }
        });
      }
      
      logger.info({ userId }, "Auth clients refreshed");
    } catch (error) {
      logger.error({ error, userId }, "Failed to refresh auth clients");
      throw error;
    }
  }
}