
import { Mastra } from '@mastra/core/mastra';
import { ragWorkflow } from './workflows/rag-workflow.js';

// Create Mastra instance
export const mastra = new Mastra({
  workflows: { ragWorkflow },
  agents: {}
});

// Export agent classes for direct use
export { StudySpotAgent } from './agents/studyspot-agent.js';
export { QueryReformulationAgent } from './agents/query-reformulation-agent.js';
