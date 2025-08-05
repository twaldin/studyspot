import { mastra } from './mastra/index.js';
import { setWorkerEnv } from './utils/env';

// Export environment interface for TypeScript
export interface Env {
  ANTHROPIC_API_KEY: string;
  OPENAI_API_KEY: string;
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  GEMINI_API_KEY?: string;
  CLOUDFLARE_API_TOKEN?: string;
  SUGGESTED_QUERIES: KVNamespace;
}

// Store the handler
let mastraHandler: any = null;

// Export the handler with proper environment setup
export default {
  // Handle HTTP requests with Mastra
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    // Set global env for services to access BEFORE accessing mastra
    (globalThis as any).__workerEnv = env;
    
    // Set process.env for compatibility
    if (typeof globalThis !== 'undefined') {
      (globalThis as any).process = (globalThis as any).process || { env: {} };
      Object.assign((globalThis as any).process.env, env);
    }
    
    // Also set our custom env handler
    setWorkerEnv(env);
    
    // Log environment for debugging
    console.log('[Worker] Environment check:', {
      hasAnthropicKey: !!env.ANTHROPIC_API_KEY,
      hasSupabaseUrl: !!env.SUPABASE_URL,
      hasSupabaseKey: !!env.SUPABASE_SERVICE_ROLE_KEY,
      processEnvSupabaseUrl: !!process.env.SUPABASE_URL,
      processEnvSupabaseKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      envKeys: Object.keys(env),
      ctx: ctx,
    });
    
    // Initialize handler if not already done
    if (!mastraHandler) {
      try {
        // Get the server handler - mastra will be created lazily with env already set
        const server = mastra.server;
        if (server && server.handler) {
          mastraHandler = server.handler;
        } else if (server && server.app) {
          mastraHandler = server.app;
        } else {
          // Fallback: try to get the handler directly
          console.error('[Worker] Mastra server structure:', {
            hasServer: !!mastra.server,
            serverKeys: mastra.server ? Object.keys(mastra.server) : [],
            mastraKeys: Object.keys(mastra),
          });
          throw new Error('Mastra server not initialized properly');
        }
      } catch (error) {
        console.error('[Worker] Failed to initialize handler:', error);
        throw error;
      }
    }
    
    // Log cold start if this is the first request
    if (!globalThis.__workerStartTime) {
      globalThis.__workerStartTime = Date.now();
      console.log('[Worker] Cold start detected at:', new Date().toISOString());
    }
    
    return mastraHandler.fetch(request, env, ctx);
  },
};