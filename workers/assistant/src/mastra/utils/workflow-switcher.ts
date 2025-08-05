import { ragWorkflow } from '../workflows/rag-workflow.js';
import { enhancedRagWorkflow } from '../workflows/rag-workflow-enhanced.js';

export type WorkflowVersion = 'original' | 'enhanced';

/**
 * Utility for A/B testing between original and enhanced RAG workflows
 */
export class WorkflowSwitcher {
  private static version: WorkflowVersion = 'enhanced'; // Default to enhanced
  
  /**
   * Get the current workflow version
   */
  static getVersion(): WorkflowVersion {
    return this.version;
  }
  
  /**
   * Set the workflow version to use
   */
  static setVersion(version: WorkflowVersion): void {
    console.log(`[WorkflowSwitcher] Switching to ${version} workflow`);
    this.version = version;
  }
  
  /**
   * Get the active workflow based on current version
   */
  static getActiveWorkflow() {
    return this.version === 'enhanced' ? enhancedRagWorkflow : ragWorkflow;
  }
  
  /**
   * Execute the active workflow with the given input
   */
  static async execute(input: any) {
    const workflow = this.getActiveWorkflow();
    console.log(`[WorkflowSwitcher] Executing ${this.version} workflow`);
    return await workflow.execute(input);
  }
  
  /**
   * A/B test configuration - can be extended for percentage-based routing
   */
  static shouldUseEnhanced(userId?: string): boolean {
    // For now, always use enhanced unless explicitly set
    if (this.version === 'original') return false;
    
    // Future: Implement percentage-based or user-based routing
    // Example: Use enhanced for 50% of users
    // if (userId) {
    //   const hash = userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    //   return hash % 100 < 50;
    // }
    
    return true;
  }
}