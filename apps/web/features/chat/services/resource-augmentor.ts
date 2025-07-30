import { supabaseService } from '@/lib/services/database/supabase.service';
import logger from '@/lib/logger';
import { Message } from '../chat.types';

/**
 * Augment messages with full resource data from their IDs
 */
export async function augmentMessagesWithResources(messages: Message[]): Promise<Message[]> {
  const supabase = await supabaseService.createAuthenticatedClient();
  const resourceIds = {
    document: new Set<string>(),
    flashcard_set: new Set<string>(),
  };

  // Collect all unique resource IDs
  messages.forEach(message => {
    if (message.role === 'assistant' && message.linkedResources) {
      message.linkedResources.forEach(resource => {
        if (resource.type === 'document') {
          resourceIds.document.add(resource.id);
        } else if (resource.type === 'flashcard_set') {
          resourceIds.flashcard_set.add(resource.id);
        }
      });
    }
  });

  if (resourceIds.document.size === 0 && resourceIds.flashcard_set.size === 0) {
    return messages;
  }

  // Fetch all resources in parallel
  const [documentRes, flashcardSetRes] = await Promise.all([
    resourceIds.document.size > 0
      ? supabase.from('documents').select('id, file_name, file_type, file_url').in('id', Array.from(resourceIds.document))
      : Promise.resolve({ data: [], error: null }),
    resourceIds.flashcard_set.size > 0
      ? supabase.from('flashcard_sets').select('id, title, description, flashcards(count)').in('id', Array.from(resourceIds.flashcard_set))
      : Promise.resolve({ data: [], error: null }),
  ]);

  if (documentRes.error) logger.error({ error: documentRes.error }, '[ResourceAugmentor] Failed to fetch linked documents');
  if (flashcardSetRes.error) logger.error({ error: flashcardSetRes.error }, '[ResourceAugmentor] Failed to fetch linked flashcard sets');

  // Create a lookup map for quick access
  const resourceMap = new Map<string, any>();
  documentRes.data?.forEach(doc => resourceMap.set(`document-${doc.id}`, doc));
  flashcardSetRes.data?.forEach(set => resourceMap.set(`flashcard_set-${set.id}`, set));

  // Augment the messages
  return messages.map(message => {
    if (message.role === 'assistant' && message.linkedResources) {
      const augmentedResources = message.linkedResources.map(resource => {
        const fullResource = resourceMap.get(`${resource.type}-${resource.id}`);
        if (!fullResource) return resource; // Should not happen

        return {
          ...resource,
          title: fullResource.file_name || fullResource.title,
          description: fullResource.description,
          metadata: {
            file_type: fullResource.file_type,
            file_url: fullResource.file_url,
            cardCount: fullResource.flashcards?.[0]?.count || 0,
          },
        };
      });
      return { ...message, linkedResources: augmentedResources };
    }
    return message;
  });
}