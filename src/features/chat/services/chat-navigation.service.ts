import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

export interface NavigationContext {
  router: AppRouterInstance;
  currentChatId?: string;
}

export class ChatNavigationService {
  private static instance: ChatNavigationService;

  public static getInstance(): ChatNavigationService {
    if (!ChatNavigationService.instance) {
      ChatNavigationService.instance = new ChatNavigationService();
    }
    return ChatNavigationService.instance;
  }

  private constructor() {}


  /**
   * Navigates to dashboard (new chat view)
   */
  navigateToDashboard(router: AppRouterInstance): void {
    router.push('/');
    
    console.info({}, '[ChatNavigation] Navigated to dashboard');
  }

  /**
   * Navigates to a specific chat by ID
   */
  navigateToChat(router: AppRouterInstance, chatId: string): void {
    router.push(`/chat/${chatId}`);
    
    console.info({ chatId }, '[ChatNavigation] Navigated to chat');
  }

  /**
   * Handles navigation after chat deletion
   */
  handleChatDeletionNavigation(
    context: NavigationContext,
    deletedChatId: string
  ): void {
    // Navigate to dashboard if we're currently viewing the deleted chat
    if (context.currentChatId === deletedChatId) {
      this.navigateToDashboard(context.router);
      
      console.info({ 
        deletedChatId 
      }, '[ChatNavigation] Navigated to dashboard after chat deletion');
    }
  }

  /**
   * Determines if navigation state should be cleared based on chat ID transitions
   */
  shouldClearStateForNavigation(
    previousChatId: string | undefined,
    currentChatId: string | undefined
  ): boolean {
    // Clear state when switching between different real chats
    return currentChatId !== previousChatId && 
           previousChatId !== undefined && 
           currentChatId !== undefined;
  }

  /**
   * Logs navigation transitions for debugging
   */
  logNavigationTransition(
    previousChatId: string | undefined,
    currentChatId: string | undefined,
    shouldClear: boolean
  ): void {
    if (shouldClear) {
      console.info({ 
        oldChatId: previousChatId, 
        newChatId: currentChatId 
      }, '[ChatNavigation] Switched between real chats, should clear state');
    } else {
      console.debug({ 
        oldChatId: previousChatId, 
        newChatId: currentChatId 
      }, '[ChatNavigation] Navigation transition (no state clear needed)');
    }
  }

  /**
   * Checks if current URL matches expected chat state
   */
  isUrlInSync(currentPath: string, expectedChatId?: string): boolean {
    if (!expectedChatId) {
      return currentPath === '/';
    }
    
    return currentPath === `/chat/${expectedChatId}`;
  }


  /**
   * Gets the appropriate chat path for navigation
   */
  getChatPath(chatId?: string): string {
    if (!chatId) {
      return '/';
    }
    
    return `/chat/${chatId}`;
  }

  /**
   * Extracts chat ID from a chat path
   */
  extractChatIdFromPath(path: string): string | undefined {
    const match = path.match(/^\/chat\/(.+)$/);
    return match?.[1];
  }

  /**
   * Checks if a path represents a chat page
   */
  isChatPath(path: string): boolean {
    return path.startsWith('/chat/') || path === '/';
  }

  /**
   * Validates chat ID format
   */
  isValidChatId(chatId: string): boolean {
    // Real chat IDs are UUIDs
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(chatId);
  }
}

// Export singleton instance
export const chatNavigationService = ChatNavigationService.getInstance();