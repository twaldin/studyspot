/**
 * Environment variable utilities
 */

// Import WeakRef polyfill
import '@/lib/polyfills/weakref-polyfill';

// No-op function for compatibility
export function initializeEnv(): void {
  // No-op
}

export function getEnv(key: string, defaultValue?: string): string | undefined {
  return process.env[key] || defaultValue;
}

export function getRequiredEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export function isCloudflareWorkers(): boolean {
  return false;
}