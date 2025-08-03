import { defineCloudflareConfig } from '@opennextjs/cloudflare';

export default defineCloudflareConfig({
  // Use dummy cache for now - can be replaced with R2 later
  incrementalCache: 'dummy',
  
  // Ensure proper routing configuration
  buildOutputDirectory: '.next',
  
  // Enable debugging for development
  debug: process.env.NODE_ENV === 'development',
  
  // Ensure all routes are handled correctly
  appBuildOutputPath: '.next',
  
  // Configure edge runtime settings
  edgeRuntime: 'nodejs',
});