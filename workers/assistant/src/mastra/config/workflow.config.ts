/**
 * Configuration for enhanced RAG workflow
 */
export const workflowConfig = {
  // Query intent analysis settings
  queryAnalysis: {
    // Confidence threshold for RAG decision (0-1)
    ragConfidenceThreshold: 0.7,
    // Maximum search terms to extract
    maxSearchTerms: 5,
    // Include conversation history for context (last N messages)
    historyContextWindow: 3,
  },
  
  // Parallel search configuration
  parallelSearch: {
    // Maximum concurrent searches
    maxParallelSearches: parseInt(process.env.MAX_PARALLEL_SEARCHES || '5'),
    // Results per search
    resultsPerSearch: 5,
    // Minimum relevance score to include document
    minRelevanceScore: 0.5,
    // Maximum unique documents to retrieve
    maxUniqueDocuments: 8,
  },
  
  // Document retrieval settings
  documentRetrieval: {
    // Maximum full documents to fetch
    maxFullDocuments: parseInt(process.env.MAX_DOCUMENTS_TO_FETCH || '3'),
    // Maximum content length per document (characters)
    maxDocumentContentLength: 2000,
    // Timeout for document fetch (ms)
    fetchTimeout: 5000,
  },
  
  // Performance settings
  performance: {
    // Enable workflow caching
    enableCaching: false,
    // Cache TTL in seconds
    cacheTTL: 300,
    // Enable detailed logging
    verboseLogging: process.env.VERBOSE_LOGGING === 'true',
  },
  
  // Feature flags
  features: {
    // Use enhanced workflow by default
    useEnhancedWorkflow: process.env.USE_ENHANCED_WORKFLOW !== 'false',
    // Enable parallel search
    enableParallelSearch: true,
    // Enable query intent analysis
    enableQueryAnalysis: true,
    // Enable full document retrieval
    enableFullDocumentRetrieval: true,
  },
};