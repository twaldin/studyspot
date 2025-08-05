import logger from '@/lib/logger';

/**
 * AI SDK Service - replaces LlamaIndex for AI operations
 * Fully compatible with Cloudflare Workers
 */

// Default models for each provider
const DEFAULT_MODELS = {
  anthropic: 'claude-3-5-sonnet-20241022',
  openai: 'gpt-4o-mini',
  google: 'gemini-2.5-flash',
} as const;


/**
 * Check if document is relevant to a course using AI
 */
export async function checkDocumentRelevance(
  courseCode: string,
  courseTitle: string,
  fileName: string,
  documentText: string
): Promise<boolean> {
  try {
    // Check for Google API key
    if (!getEnv('GOOGLE_API_KEY') && !getEnv('GEMINI_API_KEY')) {
      logger.error('No Google/Gemini API key found for document relevance check');
      // Default to relevant if AI check not available
      return true;
    }

    // Use the working geminiService instead of reimplementing
    const { geminiService } = await import('./gemini.service');

    logger.info({
      courseCode,
      courseTitle,
      fileName,
      textPreview: documentText.substring(0, 100)
    }, 'Attempting document relevance check with Google AI');

    const result = await geminiService.chat([
      {
        role: 'user',
        content: `Respond with ONLY the word "true" or "false" - no explanation, no other text.

Is the document "${fileName}" relevant to the course "${courseTitle}" (${courseCode})?

Document preview: ${documentText.substring(0, 500)}`
      }
    ], {
      temperature: 0.1,  // Lower temperature for more consistent responses
      maxTokens: 10,     // Limit tokens to force short response
      disableThinking: true  // Disable thinking for simple classification
    });

    logger.info({
      courseCode,
      fileName,
      success: result.success,
      data: result.data,
      error: result.error,
      provider: result.provider,
      model: result.model
    }, 'Gemini service result for relevance check');

    if (!result.success || !result.data) {
      logger.warn({
        courseCode,
        fileName,
        error: result.error,
        fullResult: result
      }, 'Gemini service failed for relevance check - defaulting to relevant');
      return true;
    }

    // Parse the response
    const responseText = result.data.toLowerCase().trim();
    
    // If we get an empty response, log it and default to true
    if (!responseText) {
      logger.warn({
        courseCode,
        fileName,
        originalResponse: result.data
      }, 'Empty response from Google AI for relevance check - defaulting to relevant');
      return true;
    }
    
    // Check for various forms of "true" or "relevant"
    const isRelevant = responseText.includes('true') || responseText.includes('relevant');
    
    logger.info({
      courseCode,
      courseTitle,
      fileName,
      isRelevant,
      response: result.data,
      parsedResponse: responseText
    }, 'Document relevance check completed');

    return isRelevant;

  } catch (error) {
    logger.error({
      error: error instanceof Error ? error.message : 'Unknown error',
      errorStack: error instanceof Error ? error.stack : undefined,
      courseCode,
      fileName,
      apiKeyPresent: !!process.env.GOOGLE_API_KEY
    }, 'Error checking document relevance - defaulting to relevant');
    
    // Default to relevant if AI check fails
    return true;
  }
}

/**
 * Check if document is course-provided material
 */
export async function checkCourseProvided(
  courseCode?: string,
  courseTitle?: string,
  fileName?: string,
  documentText?: string
): Promise<boolean> {
  if (!courseCode || !courseTitle || !fileName || !documentText) {
    return false; // Default to student-uploaded
  }

  try {
    // Check for Google API key
    if (!process.env.GOOGLE_API_KEY) {
      logger.error('No Google API key found for course provided check');
      // Default to false (student-uploaded) if AI check not available
      return false;
    }

    // Use the working geminiService
    const { geminiService } = await import('./gemini.service');

    const result = await geminiService.chat([
      {
        role: 'user',
        content: `Respond with ONLY the word "true" or "false" - no explanation, no other text.

Is "${fileName}" an official course document from instructors (like syllabus, exam, assignment)?

Document preview: ${documentText.substring(0, 500)}`
      }
    ], {
      temperature: 0.1,  // Lower temperature for more consistent responses
      maxTokens: 10,     // Limit tokens to force short response
      disableThinking: true  // Disable thinking for simple classification
    });

    logger.info({
      courseCode,
      fileName,
      success: result.success,
      data: result.data,
      error: result.error,
      provider: result.provider,
      model: result.model
    }, 'Gemini service result for course provided check');

    if (!result.success || !result.data) {
      logger.warn({
        courseCode,
        fileName,
        error: result.error,
        fullResult: result
      }, 'Gemini service failed for course provided check - defaulting to false');
      return false;
    }

    // Parse the response more robustly
    const responseText = result.data.toLowerCase().trim();
    
    // If empty response, default to false (student-uploaded)
    if (!responseText) {
      logger.warn({
        courseCode,
        fileName
      }, 'Empty response for course provided check - defaulting to false');
      return false;
    }
    
    // Check for various forms of "true" or "official"
    const isProvided = responseText.includes('true') || responseText.includes('official');

    logger.info({
      courseCode,
      courseTitle,
      fileName,
      isProvided,
      response: result.data,
      parsedResponse: responseText
    }, 'Course provided check completed');

    return isProvided;

  } catch (error) {
    logger.error({
      error: error instanceof Error ? error.message : 'Unknown error',
      courseCode,
      fileName
    }, 'Error checking if document is course provided');
    
    // Default to false (student-uploaded) if AI check fails
    return false;
  }
}

/**
 * Generate embeddings using OpenAI
 */
export async function generateEmbeddings(params: {
  nodeTexts: string[];
  fileKey: string;
}): Promise<number[][] | null> {
  const { nodeTexts, fileKey } = params;

  try {
    logger.info({ 
      fileKey, 
      chunkCount: nodeTexts.length 
    }, 'Generating embeddings');

    // Use OpenAI embeddings API directly
    const response = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'text-embedding-3-small',
        input: nodeTexts,
        encoding_format: 'float',
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const embeddings = data.data.map((item: any) => item.embedding);

    logger.info({ 
      fileKey, 
      embeddingCount: embeddings.length,
      dimensionSize: embeddings[0]?.length || 0
    }, 'Embeddings generated successfully');

    return embeddings;

  } catch (error) {
    logger.error({
      error: error instanceof Error ? error.message : 'Unknown error',
      fileKey
    }, 'Error generating embeddings');
    
    return null;
  }
}

/**
 * Generic chat completion using Google Gemini
 */
export async function chatCompletion(prompt: string, options?: {
  temperature?: number;
  maxOutputTokens?: number;
  disableThinking?: boolean;
}): Promise<string> {
  try {
    // Check for Google API key
    if (!process.env.GOOGLE_API_KEY) {
      throw new Error('No Google API key found for chat completion');
    }

    // Dynamically import AI SDK to reduce bundle size
    const { generateText } = await import('ai');
    const { google } = await import('@ai-sdk/google');
    
    // Use the same pattern as geminiService - don't pass apiKey explicitly
    const model = google(DEFAULT_MODELS.google);
    
    const result = await generateText({
      model,
      prompt,
      temperature: options?.temperature || 0.7,
      maxOutputTokens: options?.maxOutputTokens || 2048,
      // Disable thinking for simple queries to avoid empty responses
      providerOptions: options?.disableThinking === true ? {
        google: {
          thinkingConfig: {
            thinkingBudget: 0,  // 0 disables thinking completely
            includeThoughts: false
          }
        }
      } : undefined
    });

    // Check if result.text is empty
    if (!result.text || result.text.trim() === '') {
      logger.warn({ 
        prompt,
        options,
        resultText: result.text,
        disableThinking: options?.disableThinking,
      }, "chatCompletion returned empty response from Gemini");
      throw new Error("Empty response from Gemini");
    }

    return result.text;

  } catch (error) {
    logger.error({
      error: error instanceof Error ? error.message : 'Unknown error'
    }, 'Error in chat completion');
    
    throw error;
  }
}

/**
 * Generate chat title using AI
 */
export async function generateChatTitle(messages: string[]): Promise<string> {
  try {
    // Dynamically import AI SDK to reduce bundle size
    const { generateText } = await import('ai');
    const { anthropic } = await import('@ai-sdk/anthropic');
    
    const model = anthropic(DEFAULT_MODELS.anthropic);
    
    const conversationText = messages.slice(0, 3).join('\n\n'); // First few messages
    
    const result = await generateText({
      model,
      prompt: `Generate a concise, descriptive title (max 6 words) for this conversation:

${conversationText}

The title should capture the main topic or question being discussed. Be specific and helpful for later reference.

IMPORTANT: Respond with ONLY the title text, no prefixes like "Title:" or quotes. Just the title itself.`,
      maxOutputTokens: 50,
      temperature: 0.7,
    });

    // Clean the response: remove quotes, "Title:" prefix, and other common prefixes
    let cleanTitle = result.text.trim()
      .replace(/^["']|["']$/g, '') // Remove quotes
      .replace(/^(Title:\s*|Subject:\s*|Topic:\s*)/i, '') // Remove common prefixes
      .trim();
    
    return cleanTitle;

  } catch (error) {
    logger.error({
      error: error instanceof Error ? error.message : 'Unknown error'
    }, 'Error generating chat title');
    
    return 'New Chat';
  }
}