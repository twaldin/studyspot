// Environment variable management for Cloudflare Workers
let workerEnv: any = {};

export function setWorkerEnv(env: any) {
  workerEnv = env;
  // Also try to set process.env for compatibility
  if (typeof process !== 'undefined' && process.env) {
    Object.assign(process.env, env);
  }
}

export function getEnv(key: string): string | undefined {
  // First check worker env
  if (workerEnv[key]) {
    return workerEnv[key];
  }
  
  // Fallback to process.env
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key];
  }
  
  return undefined;
}

export function getRequiredEnv(key: string): string {
  const value = getEnv(key);
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}