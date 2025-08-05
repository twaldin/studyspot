import { registerApiRoute } from '@mastra/core/server';

export const testEnvRoute = registerApiRoute('/test-env', {
  method: 'GET',
  handler: async (c) => {
    const env = c.env;
    
    // Test actual access to the values
    let supabaseUrlType = 'none';
    let supabaseKeyType = 'none';
    try {
      if (env?.SUPABASE_URL) {
        supabaseUrlType = typeof env.SUPABASE_URL;
      }
      if (env?.SUPABASE_SERVICE_ROLE_KEY) {
        supabaseKeyType = typeof env.SUPABASE_SERVICE_ROLE_KEY;
      }
    } catch (e) {
      // Ignore errors
    }
    
    return c.json({
      message: 'Environment test',
      hasEnv: !!env,
      envKeys: env ? Object.keys(env) : [],
      hasSupabaseUrl: !!env?.SUPABASE_URL,
      hasSupabaseKey: !!env?.SUPABASE_SERVICE_ROLE_KEY,
      hasAnthropicKey: !!env?.ANTHROPIC_API_KEY,
      hasSuggestedQueries: !!env?.SUGGESTED_QUERIES,
      // Check the types
      supabaseUrlType,
      supabaseKeyType,
      // Test if they're actually strings
      supabaseUrlIsString: typeof env?.SUPABASE_URL === 'string',
      supabaseKeyIsString: typeof env?.SUPABASE_SERVICE_ROLE_KEY === 'string',
      // Check actual lengths
      supabaseUrlLength: env?.SUPABASE_URL ? env.SUPABASE_URL.length : -1,
      supabaseKeyLength: env?.SUPABASE_SERVICE_ROLE_KEY ? env.SUPABASE_SERVICE_ROLE_KEY.length : -1,
      // Test process.env
      processEnvExists: typeof process !== 'undefined' && !!process.env,
      processEnvSupabaseUrl: typeof process !== 'undefined' && !!process.env?.SUPABASE_URL,
    });
  }
});