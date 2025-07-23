import { ConfigLoaderService } from './services/config-loader.service.js';
import { StudySpotAgent } from './mastra/agents/studyspot-agent.js';
import { QueryReformulationAgent } from './mastra/agents/query-reformulation-agent.js';

/**
 * Initialize the Mastra API components
 * This handles async initialization that can't be done during module loading
 */
export async function initializeAPI() {
  try {
    console.log('[Init] Starting Mastra API initialization...');
    
    // Test config loading
    console.log('[Init] Testing configuration loading...');
    const config = await ConfigLoaderService.getActiveConfig();
    console.log(`[Init] Configuration loaded successfully: ${config.name}`);
    
    // Initialize agents
    console.log('[Init] Initializing agents...');
    const studySpotAgent = await StudySpotAgent.getInstance();
    const queryAgent = await QueryReformulationAgent.getInstance();
    console.log('[Init] Agents initialized successfully');
    
    console.log('[Init] Mastra API initialization completed successfully!');
    
    return {
      studySpotAgent,
      queryAgent,
      config
    };
    
  } catch (error) {
    console.error('[Init] Failed to initialize Mastra API:', error);
    throw error;
  }
}

// Initialize immediately if this file is run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  initializeAPI()
    .then(() => {
      console.log('[Init] Initialization test completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('[Init] Initialization test failed:', error);
      process.exit(1);
    });
}