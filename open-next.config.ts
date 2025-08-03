import { defineCloudflareConfig } from '@opennextjs/cloudflare';

export default defineCloudflareConfig({
  // Use dummy cache for now - can be replaced with R2 later
  incrementalCache: 'dummy',
});