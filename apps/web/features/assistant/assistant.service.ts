import '@/lib/constants';
import type { ChatMessage } from '@/lib/llamaindex-imports';
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/lib/database.types';
import { auth } from '@clerk/nextjs/server';
import logger from '@/lib/logger';
import { getFullRagResponse, getFullRagResponseStream } from './rag.service';
import { AssistantResponse } from './assistant.types';

/**
 * Generates a complete assistant response to a user question using retrieval-augmented generation.
 */
export async function getAssistantResponse(
    supabase: SupabaseClient<Database>,
    question: string, 
    conversationHistory: ChatMessage[] = [],
    courseId?: string,
    timeZone?: string
): Promise<AssistantResponse> {
    const { userId } = await auth();
    logger.info(
        { 
            userId, 
            question,
            hasHistory: conversationHistory.length > 0 
        },
        "[AssistantService] Received new question. Forwarding to RAG service for full processing."
    );

    let finalCourseId: string | undefined = courseId;
    
    if (!userId) {
        logger.info("[AssistantService] No user found, cannot fetch selected course.");
    } else if (!finalCourseId) {
        // User exists but no courseId provided, try to get their selected course
        // For now, we'll skip this since we don't have the clerk helper yet
        logger.info({ userId }, "[AssistantService] User has not selected a course.");
    } else {
        // User exists and courseId was provided
        logger.info({ userId, courseId: finalCourseId }, "[AssistantService] Using provided course ID for user.");
    }

    // Delegate the core logic (reformulation, RAG, augmentation, final LLM call) to rag.service
    const ragServiceOutput = await getFullRagResponse(supabase, question, conversationHistory, finalCourseId, timeZone);

    logger.info(
        { 
            userId, 
            response: ragServiceOutput.message,
            linkedDocumentIds: ragServiceOutput.linkedDocumentIds
        },
        "[AssistantService] Response received from RAG service."
    );
    
    return ragServiceOutput;
}

// New streaming version using real LlamaIndex streaming
export async function* getAssistantResponseStream(
    supabase: SupabaseClient<Database>,
    question: string, 
    conversationHistory: ChatMessage[] = [],
    courseId?: string,
    timeZone?: string
): AsyncGenerator<{ chunk?: string; linkedDocumentIds?: string[]; done?: boolean; error?: string }> {
    const { userId } = await auth();
    logger.info(
        { 
            userId, 
            question,
            hasHistory: conversationHistory.length > 0 
        },
        "[AssistantService] Received new streaming question. Forwarding to RAG service for streaming processing."
    );

    let finalCourseId: string | undefined = courseId;
    
    if (!userId) {
        logger.info("[AssistantService] No user found, cannot fetch selected course.");
    } else if (!finalCourseId) {
        // User exists but no courseId provided, try to get their selected course
        // For now, we'll skip this since we don't have the clerk helper yet
        logger.info({ userId }, "[AssistantService] User has not selected a course.");
    } else {
        // User exists and courseId was provided
        logger.info({ userId, courseId: finalCourseId }, "[AssistantService] Using provided course ID for user.");
    }
    
    // Stream the response from the RAG service
    try {
        for await (const chunk of getFullRagResponseStream(supabase, question, conversationHistory, finalCourseId, timeZone)) {
            yield chunk;
        }
        
        logger.info({ userId }, "[AssistantService] Streaming response completed.");
    } catch (error) {
        logger.error({ error, userId }, "[AssistantService] Error during streaming response.");
        yield { error: error instanceof Error ? error.message : 'An unexpected error occurred during streaming' };
    }
}