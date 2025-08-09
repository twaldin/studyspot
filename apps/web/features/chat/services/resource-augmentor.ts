import { supabaseService, createServiceRoleClient } from '@/lib/services/database/supabase.service';
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
    quiz: new Set<string>(),
  };

  // Collect all unique resource IDs from both formats
  messages.forEach(message => {
    if (message.role === 'assistant') {
      // Handle UI format (linkedResources)
      if (message.linkedResources) {
        message.linkedResources.forEach(resource => {
          if (resource.type === 'document') {
            resourceIds.document.add(resource.id);
          } else if (resource.type === 'flashcard_set') {
            resourceIds.flashcard_set.add(resource.id);
          } else if (resource.type === 'quiz') {
            resourceIds.quiz.add(resource.id);
          }
        });
      }
      
      // Handle database format (linkedResourceRefs)
      const dbResourceRefs = (message as any).linkedResourceRefs;
      if (dbResourceRefs && Array.isArray(dbResourceRefs)) {
        dbResourceRefs.forEach(resource => {
          if (resource.type === 'document') {
            resourceIds.document.add(resource.id);
          } else if (resource.type === 'flashcard_set') {
            resourceIds.flashcard_set.add(resource.id);
          } else if (resource.type === 'quiz') {
            resourceIds.quiz.add(resource.id);
          }
        });
      }
      
      // Handle legacy database format (linked_resources)
      const dbResources = (message as any).linked_resources;
      if (dbResources && Array.isArray(dbResources)) {
        dbResources.forEach(resource => {
          if (resource.type === 'document') {
            resourceIds.document.add(resource.id);
          } else if (resource.type === 'flashcard_set') {
            resourceIds.flashcard_set.add(resource.id);
          } else if (resource.type === 'quiz') {
            resourceIds.quiz.add(resource.id);
          }
        });
      }
    }
  });

  if (resourceIds.document.size === 0 && resourceIds.flashcard_set.size === 0 && resourceIds.quiz.size === 0) {
    return messages;
  }

  // Fetch all resources in parallel
  const [documentRes, flashcardSetRes, quizRes] = await Promise.all([
    resourceIds.document.size > 0
      ? supabase.from('docs').select('id, file_name, file_type, file_url').in('id', Array.from(resourceIds.document))
      : Promise.resolve({ data: [], error: null }),
    resourceIds.flashcard_set.size > 0
      ? supabase.from('flashcard_sets').select('id, title, description, flashcards(count)').in('id', Array.from(resourceIds.flashcard_set))
      : Promise.resolve({ data: [], error: null }),
    resourceIds.quiz.size > 0
      ? supabase.from('quizzes').select('id, title, description, quiz_questions(count)').in('id', Array.from(resourceIds.quiz))
      : Promise.resolve({ data: [], error: null }),
  ]);

  if (documentRes.error) logger.error({ error: documentRes.error }, '[ResourceAugmentor] Failed to fetch linked documents');
  if (flashcardSetRes.error) logger.error({ error: flashcardSetRes.error }, '[ResourceAugmentor] Failed to fetch linked flashcard sets');
  if (quizRes.error) logger.error({ error: quizRes.error }, '[ResourceAugmentor] Failed to fetch linked quizzes');

  // Create a lookup map for quick access
  const resourceMap = new Map<string, any>();
  documentRes.data?.forEach(doc => resourceMap.set(`document-${doc.id}`, doc));
  flashcardSetRes.data?.forEach(set => resourceMap.set(`flashcard_set-${set.id}`, set));
  quizRes.data?.forEach(quiz => resourceMap.set(`quiz-${quiz.id}`, quiz));

  // Augment the messages
  return messages.map(message => {
    if (message.role === 'assistant') {
      // Convert linkedResourceRefs to linkedResources if needed
      if (message.linkedResourceRefs && !message.linkedResources) {
        message.linkedResources = message.linkedResourceRefs.map(ref => ({
          id: ref.id,
          type: ref.type,
          title: '', // Will be filled below
          description: '',
          cardCount: 0,
          questionCount: 0
        }));
      }

      if (message.linkedResources) {
        const augmentedResources = message.linkedResources.map(resource => {
          const fullResource = resourceMap.get(`${resource.type}-${resource.id}`);
          if (!fullResource) return resource; // Return as-is if not found

          if (resource.type === 'document') {
            return {
              ...resource,
              title: fullResource.file_name,
              file_type: fullResource.file_type,
              file_url: fullResource.file_url,
            };
          } else if (resource.type === 'flashcard_set') {
            return {
              ...resource,
              title: fullResource.title,
              description: fullResource.description,
              cardCount: fullResource.flashcards?.[0]?.count || 0,
            };
          } else if (resource.type === 'quiz') {
            return {
              ...resource,
              title: fullResource.title,
              description: fullResource.description,
              questionCount: fullResource.quiz_questions?.[0]?.count || 0,
            };
          }

          return resource;
        });
        
        return { ...message, linkedResources: augmentedResources };
      }
    }
    return message;
  });
}

/**
 * Augment messages with full resource data from their IDs (public version using service role client)
 * Only fetches resources that are publicly shared
 */
export async function augmentMessagesWithPublicResources(messages: Message[]): Promise<Message[]> {
  const supabase = createServiceRoleClient();
  const resourceIds = {
    document: new Set<string>(),
    flashcard_set: new Set<string>(),
    quiz: new Set<string>(),
  };

  // Collect all unique resource IDs from messages
  messages.forEach(message => {
    if (message.role === 'assistant') {
      // console.log('🔍 [AUGMENTOR] Processing assistant message:', JSON.stringify(message, null, 2));
      
      // Handle UI format (linkedResources)
      if (message.linkedResources) {
        message.linkedResources.forEach(resource => {
          if (resource.type === 'document') {
            resourceIds.document.add(resource.id);
          } else if (resource.type === 'flashcard_set') {
            resourceIds.flashcard_set.add(resource.id);
          } else if (resource.type === 'quiz') {
            resourceIds.quiz.add(resource.id);
          }
        });
      }
      
      // Handle database format (linkedResourceRefs)
      const dbResourceRefs = (message as any).linkedResourceRefs;
      if (dbResourceRefs && Array.isArray(dbResourceRefs)) {
        dbResourceRefs.forEach(resource => {
          if (resource.type === 'document') {
            resourceIds.document.add(resource.id);
          } else if (resource.type === 'flashcard_set') {
            resourceIds.flashcard_set.add(resource.id);
          } else if (resource.type === 'quiz') {
            resourceIds.quiz.add(resource.id);
          }
        });
      }
      
      // Handle RAW database format (linked_resources) - CRITICAL for public chats
      const dbRawResources = (message as any).linked_resources;
      if (dbRawResources && Array.isArray(dbRawResources)) {
        // Found linked_resources in message
        dbRawResources.forEach(resource => {
          if (resource.type === 'document') {
            resourceIds.document.add(resource.id);
          } else if (resource.type === 'flashcard_set') {
            resourceIds.flashcard_set.add(resource.id);
          } else if (resource.type === 'quiz') {
            resourceIds.quiz.add(resource.id);
          }
        });
      }
    }
  });
  
  logger.info({ 
    documents: resourceIds.document.size, 
    flashcards: resourceIds.flashcard_set.size, 
    quizzes: resourceIds.quiz.size 
  }, '[ResourceAugmentor] Collected resource IDs for public augmentation');

  if (resourceIds.document.size === 0 && resourceIds.flashcard_set.size === 0 && resourceIds.quiz.size === 0) {
    return messages;
  }

  // Fetch all PUBLIC resources in parallel (including share tokens)
  // Note: Using service role client bypasses RLS, so we need to explicitly filter for public resources
  const [documentRes, flashcardSetRes, quizRes] = await Promise.all([
    resourceIds.document.size > 0
      ? supabase.from('docs').select('id, file_name, file_type, file_url').in('id', Array.from(resourceIds.document))
      : Promise.resolve({ data: [], error: null }),
    resourceIds.flashcard_set.size > 0
      ? supabase.from('flashcard_sets').select('id, title, description, share_token, is_public, flashcards(count)').eq('is_public', true).in('id', Array.from(resourceIds.flashcard_set))
      : Promise.resolve({ data: [], error: null }),
    resourceIds.quiz.size > 0
      ? supabase.from('quizzes').select('id, title, description, share_token, is_public, quiz_questions(count)').eq('is_public', true).in('id', Array.from(resourceIds.quiz))
      : Promise.resolve({ data: [], error: null }),
  ]);

  if (documentRes.error) logger.error({ error: documentRes.error }, '[ResourceAugmentor] Failed to fetch linked documents (public)');
  if (flashcardSetRes.error) logger.error({ error: flashcardSetRes.error }, '[ResourceAugmentor] Failed to fetch linked flashcard sets (public)');
  if (quizRes.error) logger.error({ error: quizRes.error }, '[ResourceAugmentor] Failed to fetch linked quizzes (public)');

  // Debug: Check if resources are actually public
  console.log('🔍 [DEBUG] Query results:');
  console.log('  - Document IDs requested:', Array.from(resourceIds.document));
  console.log('  - Flashcard IDs requested:', Array.from(resourceIds.flashcard_set));
  console.log('  - Quiz IDs requested:', Array.from(resourceIds.quiz));
  console.log('  - Documents found:', documentRes.data);
  console.log('  - Flashcards found:', flashcardSetRes.data);
  console.log('  - Quizzes found:', quizRes.data);

  logger.info({ 
    documents: documentRes.data?.length || 0, 
    flashcards: flashcardSetRes.data?.length || 0, 
    quizzes: quizRes.data?.length || 0 
  }, '[ResourceAugmentor] Fetched public resources from database');

  // Create a lookup map for quick access
  const resourceMap = new Map<string, any>();
  documentRes.data?.forEach(doc => resourceMap.set(`document-${doc.id}`, doc));
  flashcardSetRes.data?.forEach(set => resourceMap.set(`flashcard_set-${set.id}`, set));
  quizRes.data?.forEach(quiz => resourceMap.set(`quiz-${quiz.id}`, quiz));

  // Augment the messages
  return messages.map(message => {
    if (message.role === 'assistant') {
      // Convert raw database format (linked_resources) to linkedResources first
      const rawLinkedResources = (message as any).linked_resources;
      if (rawLinkedResources && Array.isArray(rawLinkedResources) && !message.linkedResources) {
        message.linkedResources = rawLinkedResources.map(ref => ({
          id: ref.id,
          type: ref.type,
          title: '', // Will be filled below
          description: '',
          cardCount: 0,
          questionCount: 0
        }));
      }
      
      // Convert linkedResourceRefs to linkedResources if needed
      if (message.linkedResourceRefs && !message.linkedResources) {
        message.linkedResources = message.linkedResourceRefs.map(ref => ({
          id: ref.id,
          type: ref.type,
          title: '', // Will be filled below
          description: '',
          cardCount: 0,
          questionCount: 0
        }));
      }

      if (message.linkedResources) {
        // Only include resources that we successfully fetched (i.e., are public)
        const augmentedResources = message.linkedResources.map(resource => {
          const fullResource = resourceMap.get(`${resource.type}-${resource.id}`);
          if (!fullResource) {
            // Resource not found or not public - filter it out
            return null;
          }

          if (resource.type === 'document') {
            return {
              ...resource,
              title: fullResource.file_name,
              file_type: fullResource.file_type,
              file_url: fullResource.file_url,
            };
          } else if (resource.type === 'flashcard_set') {
            return {
              ...resource,
              title: fullResource.title,
              description: fullResource.description,
              cardCount: fullResource.flashcards?.[0]?.count || 0,
              share_token: fullResource.share_token,
            };
          } else if (resource.type === 'quiz') {
            return {
              ...resource,
              title: fullResource.title,
              description: fullResource.description,
              questionCount: fullResource.quiz_questions?.[0]?.count || 0,
              share_token: fullResource.share_token,
            };
          }

          return resource;
        }).filter(Boolean); // Remove null entries
        
        return { ...message, linkedResources: augmentedResources };
      }
    }
    return message;
  });
}