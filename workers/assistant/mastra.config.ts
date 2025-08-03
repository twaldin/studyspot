import { Mastra } from '@mastra/core';
import { CloudflareDeployer } from '@mastra/deployer-cloudflare';
import { Agent } from '@mastra/core';
import { createAnthropic } from '@ai-sdk/anthropic';

// Import agents
import { queryReformulationAgent } from './src/mastra/agents/query-reformulation-agent.js';
import { relevanceCheckerAgent } from './src/mastra/agents/relevance-checker-agent.js';

// Import tools
import { getFullDocumentTool } from './src/mastra/tools/get-full-document.tool.js';
import { listAllDocumentsTool } from './src/mastra/tools/list-all-documents.tool.js';
import { semanticSearchTool } from './src/mastra/tools/semantic-search.tool.js';
import { setSourcesTool } from './src/mastra/tools/set-sources.tool.js';
import { vectorSearchTool } from './src/mastra/tools/vector-search.tool.js';

// Import workflows
import { ragWorkflow } from './src/mastra/workflows/rag-workflow.js';
import { documentIngestionWorkflow } from './src/mastra/workflows/document-ingestion-workflow.js';

// Import additional tools for studyspot agent
import { generateFlashcardSetTool } from './src/mastra/tools/generate-flashcard-set.tool.js';
import { generateQuizTool } from './src/mastra/tools/generate-quiz.tool.js';

// Create anthropic instance
const anthropic = createAnthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Import the ConfigLoaderService to get the system prompt
import { ConfigLoaderService } from './src/services/config-loader.service.js';

// Import custom routes
import { documentIngestionRoute } from './src/routes/document-ingestion.js';

// Create studyspot agent directly with the full system prompt
const systemPrompt = await ConfigLoaderService.getSystemPrompt();
const studyspotAgent = new Agent({
  name: 'studyspot-assistant',
  description: 'AI assistant for college students with access to course-specific documents and materials',
  instructions: systemPrompt,
  model: anthropic('claude-3-5-sonnet-20241022'),
  tools: {
    get_full_document: getFullDocumentTool,
    list_all_documents: listAllDocumentsTool,
    semantic_search: semanticSearchTool,
    set_sources: setSourcesTool,
    vector_search: vectorSearchTool,
    create_flashcards: generateFlashcardSetTool,
    create_quiz: generateQuizTool
  }
});

export const mastra = new Mastra({
  // Agents
  agents: {
    'studyspot-agent': studyspotAgent,
    'query-reformulation-agent': queryReformulationAgent,
    'relevance-checker': relevanceCheckerAgent,
  },

  // Workflows
  workflows: {
    'rag-workflow': ragWorkflow,
    'document-ingestion': documentIngestionWorkflow,
  },

  // Cloudflare deployer configuration
  deployer: new CloudflareDeployer({
    projectName: 'studyspot-assistant',
    // Authentication is configured via environment variables
  }),

  // Server configuration with custom routes
  server: {
    apiRoutes: [documentIngestionRoute],
  },
});

export default mastra;