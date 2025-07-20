import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/lib/types/database';
import { FunctionTool } from '@/lib/utils/llamaindex-imports';
import { DocumentRetrievalTool } from './document-retrieval.tool';
import logger from '@/lib/utils/logger';

export class ToolManager {
  private supabase: SupabaseClient<Database>;
  private documentRetrievalTool: DocumentRetrievalTool;
  private tools: FunctionTool<any, any>[] = [];

  constructor(supabase: SupabaseClient<Database>) {
    this.supabase = supabase;
    this.documentRetrievalTool = new DocumentRetrievalTool(supabase);
    this.initializeTools();
  }

  private initializeTools(): void {
    this.tools = [
      this.documentRetrievalTool.getTool()
    ];

    logger.info({ 
      toolCount: this.tools.length,
      toolNames: this.tools.map(t => t.metadata.name)
    }, '[ToolManager] Initialized tools');
  }

  getTools(): FunctionTool<any, any>[] {
    // VERBOSE LOGGING: Log tool details every time tools are requested
    logger.info({ 
      toolCount: this.tools.length,
      toolDetails: this.tools.map(tool => ({
        name: tool.metadata?.name,
        description: tool.metadata?.description?.substring(0, 100) + '...',
        hasFunction: typeof tool.call === 'function',
        metadataKeys: tool.metadata ? Object.keys(tool.metadata) : []
      }))
    }, '[ToolManager] VERBOSE: Tools being provided to Claude');
    
    return this.tools;
  }

  getToolByName(name: string): FunctionTool<any, any> | undefined {
    return this.tools.find(tool => tool.metadata.name === name);
  }

  getToolNames(): string[] {
    return this.tools.map(tool => tool.metadata.name);
  }

  async executeToolCall(toolName: string, params: any): Promise<any> {
    const tool = this.getToolByName(toolName);
    if (!tool) {
      logger.error({ toolName }, '[ToolManager] Tool not found');
      throw new Error(`Tool not found: ${toolName}`);
    }

    logger.info({ toolName, params }, '[ToolManager] Executing tool call');
    
    try {
      const result = await tool.call(params);
      logger.info({ toolName, success: true }, '[ToolManager] Tool call completed successfully');
      return result;
    } catch (error) {
      logger.error({ toolName, error, params }, '[ToolManager] Tool call failed');
      throw error;
    }
  }
}