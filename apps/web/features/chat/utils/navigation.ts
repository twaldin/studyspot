import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import logger from '@/lib/logger';

/**
 * Navigates to dashboard (new chat view)
 */
export function navigateToDashboard(router: AppRouterInstance): void {
  router.push('/');
  logger.info({}, '[ChatNavigation] Navigated to dashboard');
}

/**
 * Navigates to a specific chat by ID
 */
export function navigateToChat(router: AppRouterInstance, chatId: string): void {
  router.push(`/chat/${chatId}`);
  logger.info({ chatId }, '[ChatNavigation] Navigated to chat');
}

/**
 * Handles navigation after chat deletion
 */
export function handleChatDeletionNavigation(
  router: AppRouterInstance,
  currentChatId: string | undefined,
  deletedChatId: string
): void {
  // Navigate to dashboard if we're currently viewing the deleted chat
  if (currentChatId === deletedChatId) {
    navigateToDashboard(router);
    logger.info({ deletedChatId }, '[ChatNavigation] Navigated to dashboard after chat deletion');
  }
}

/**
 * Determines if navigation state should be cleared based on chat ID transitions
 */
export function shouldClearStateForNavigation(
  previousChatId: string | undefined,
  currentChatId: string | undefined
): boolean {
  // Clear state when switching between different real chats
  return currentChatId !== previousChatId && 
         previousChatId !== undefined && 
         currentChatId !== undefined;
}

/**
 * Checks if current URL matches expected chat state
 */
export function isUrlInSync(currentPath: string, expectedChatId?: string): boolean {
  if (!expectedChatId) {
    return currentPath === '/';
  }
  
  return currentPath === `/chat/${expectedChatId}`;
}

/**
 * Gets the appropriate chat path for navigation
 */
export function getChatPath(chatId?: string): string {
  if (!chatId) {
    return '/';
  }
  
  return `/chat/${chatId}`;
}

/**
 * Extracts chat ID from a chat path
 */
export function extractChatIdFromPath(path: string): string | undefined {
  const match = path.match(/^\/chat\/(.+)$/);
  return match?.[1];
}

/**
 * Checks if a path represents a chat page
 */
export function isChatPath(path: string): boolean {
  return path.startsWith('/chat/') || path === '/';
}

/**
 * Validates chat ID format
 */
export function isValidChatId(chatId: string): boolean {
  // Real chat IDs are UUIDs
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(chatId);
}