import toast from "react-hot-toast";

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
  message?: string;
}

interface RequestLog {
  timestamp: number;
  endpoint: string;
}

class RateLimiter {
  private requests: Map<string, RequestLog[]> = new Map();
  private toastCooldowns: Map<string, number> = new Map();
  private readonly TOAST_COOLDOWN_MS = 5000; // 5 seconds between rate limit toasts

  /**
   * Check if a request should be rate limited
   * @param endpoint - The API endpoint being called
   * @param config - Rate limit configuration
   * @returns true if request should be blocked
   */
  checkRateLimit(endpoint: string, config: RateLimitConfig): boolean {
    const now = Date.now();
    const windowStart = now - config.windowMs;

    // Get or create request log for this endpoint
    const requestLog = this.requests.get(endpoint) || [];

    // Remove old requests outside the time window
    const recentRequests = requestLog.filter((req) =>
      req.timestamp > windowStart
    );

    // Check if we've exceeded the limit
    if (recentRequests.length >= config.maxRequests) {
      this.showRateLimitToast(endpoint, config);
      return true;
    }

    // Add current request to log
    recentRequests.push({ timestamp: now, endpoint });
    this.requests.set(endpoint, recentRequests);

    return false;
  }

  /**
   * Show rate limit toast with cooldown to prevent spam
   */
  private showRateLimitToast(endpoint: string, config: RateLimitConfig) {
    const now = Date.now();
    const lastToast = this.toastCooldowns.get(endpoint) || 0;

    if (now - lastToast > this.TOAST_COOLDOWN_MS) {
      const message = config.message ||
        "Please slow down. You're making requests too quickly.";
      toast.error(message, {
        id: `rate-limit-${endpoint}`, // Prevent duplicate toasts
        duration: 4000,
      });
      this.toastCooldowns.set(endpoint, now);
    }
  }

  /**
   * Clear rate limit data for an endpoint
   */
  clearEndpoint(endpoint: string) {
    this.requests.delete(endpoint);
    this.toastCooldowns.delete(endpoint);
  }

  /**
   * Clear all rate limit data
   */
  clearAll() {
    this.requests.clear();
    this.toastCooldowns.clear();
  }
}

// Singleton instance
export const rateLimiter = new RateLimiter();

// Predefined rate limit configurations for common use cases
export const RATE_LIMITS = {
  // API calls - 60 requests per minute (1 per second average)
  API_CALLS: {
    maxRequests: 60,
    windowMs: 60 * 1000,
    message: "Please slow down. You're making API requests too quickly.",
  },

  // Chat messages - 30 messages per minute
  CHAT_MESSAGES: {
    maxRequests: 30,
    windowMs: 60 * 1000,
    message: "Please slow down. You're sending messages too quickly.",
  },

  // File uploads - 10 uploads per minute
  FILE_UPLOADS: {
    maxRequests: 10,
    windowMs: 60 * 1000,
    message: "Please slow down. You're uploading files too quickly.",
  },

  // Course creation - 5 courses per minute
  COURSE_CREATION: {
    maxRequests: 5,
    windowMs: 60 * 1000,
    message: "Please slow down. You're creating courses too quickly.",
  },

  // Search queries - 120 searches per minute (2 per second average)
  SEARCH_QUERIES: {
    maxRequests: 120,
    windowMs: 60 * 1000,
    message: "Please slow down. You're searching too quickly.",
  },

  // General interactions - 300 actions per minute (5 per second average)
  GENERAL_ACTIONS: {
    maxRequests: 300,
    windowMs: 60 * 1000,
    message: "Please slow down. You're performing actions too quickly.",
  },
} as const;

/**
 * Higher-order function to add rate limiting to API calls
 */
export function withRateLimit<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  endpoint: string,
  config: RateLimitConfig = RATE_LIMITS.API_CALLS,
): T {
  return ((...args: Parameters<T>) => {
    if (rateLimiter.checkRateLimit(endpoint, config)) {
      // Return a rejected promise to simulate blocked request
      return Promise.reject(new Error("Rate limit exceeded"));
    }

    return fn(...args);
  }) as T;
}

/**
 * Hook-style rate limiter for use in React components
 */
export function useRateLimit(
  endpoint: string,
  config: RateLimitConfig = RATE_LIMITS.GENERAL_ACTIONS,
) {
  return {
    checkRateLimit: () => rateLimiter.checkRateLimit(endpoint, config),
    clearRateLimit: () => rateLimiter.clearEndpoint(endpoint),
  };
}

