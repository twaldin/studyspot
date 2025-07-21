import logger from '@/lib/utils/logger';
import { Gemini, GEMINI_MODEL } from '@/lib/utils/llamaindex-imports';

// Simple check for obvious placeholder text
async function checkForNonsensicalContent(content: string): Promise<{
  isNonsensical: boolean;
  reason: string;
  confidence: 'low' | 'medium' | 'high';
}> {
  // Only check for the most obvious cases of placeholder text
  const placeholderPatterns = [
    { pattern: /lorem\s+ipsum/i, reason: 'Lorem ipsum placeholder text' },
    { pattern: /\b(test\s+content|example\s+text|placeholder\s+text|dummy\s+text|sample\s+text)\b/i, reason: 'Test/example content' },
  ];

  for (const { pattern, reason } of placeholderPatterns) {
    if (pattern.test(content)) {
      return {
        isNonsensical: true,
        reason: `Detected ${reason}`,
        confidence: 'high',
      };
    }
  }

  // Content seems legitimate
  return {
    isNonsensical: false,
    reason: '',
    confidence: 'high',
  };
}

const gemini = new Gemini({
  model: GEMINI_MODEL.GEMINI_PRO_FLASH_LATEST,
});

// --- 4. Document Relevance Check Function ---
export async function checkDocumentRelevance(courseCode: string, courseTitle: string, fileName: string, documentContent: string): Promise<boolean> {
  try {
    if (!process.env.GOOGLE_API_KEY) {
      logger.warn("GOOGLE_API_KEY not set, skipping relevance check");
      return true; // Default to allowing documents if Gemini isn't available
    }

    // Limit content length to avoid token limits
    const contentPreview = documentContent.substring(0, 2000);

    // First, check for nonsensical or placeholder content
    const nonsensicalCheck = await checkForNonsensicalContent(contentPreview);
    if (nonsensicalCheck.isNonsensical) {
      logger.info({
        courseCode,
        fileName,
        reason: nonsensicalCheck.reason,
        confidence: nonsensicalCheck.confidence
      }, "Document rejected - detected nonsensical or placeholder content");
      return false;
    }

    const prompt = `You are evaluating if a document is relevant to a college course.

Course: ${courseCode} - ${courseTitle}
Document Name: ${fileName}
Document Content Preview: ${contentPreview}

Analyze this document and determine if it is relevant and appropriate for the course "${courseCode} - ${courseTitle}".

First, verify that the content appears to be legitimate text and not placeholder or nonsensical content. Specifically check if:
1. The text contains complete sentences and coherent thoughts
2. The vocabulary is appropriate for an academic context
3. There are no obvious placeholders or test patterns

Then evaluate if the content is relevant to the course by considering:
1. Does the subject matter align with the course topic?
2. Is this the type of material that would be used in an academic setting?

Reject the document if:
- It contains obvious placeholder text (e.g., lorem ipsum, "test content")
- The text is completely incoherent or appears randomly generated
- It's clearly not related to any academic subject

Respond with only "true" if the document is relevant and appropriate, or "false" if it should be rejected.`;

    const response = await gemini.chat({
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    });

    // Handle the response content safely
    let responseText = '';
    if (Array.isArray(response.message.content)) {
      const textContent = response.message.content.find(
        content => 'type' in content && content.type === 'text'
      );
      responseText = textContent?.text || '';
    } else {
      responseText = response.message.content || '';
    }

    const isRelevant = responseText.trim().toLowerCase() === 'true';

    logger.info({
      courseCode,
      courseTitle,
      fileName,
      geminiResponse: responseText.trim(),
      isRelevant
    }, "Document relevance check completed");

    return isRelevant;

  } catch (error) {
    logger.error({ error, courseCode, courseTitle, fileName }, "Error in document relevance check, defaulting to allow");
    return true; // Default to allowing documents if check fails
  }
}

export async function checkCourseProvided(courseCode: string, courseTitle: string, fileName: string, documentContent: string): Promise<boolean> {
  try {
    if (!process.env.GOOGLE_API_KEY) {
      logger.warn("GOOGLE_API_KEY not set, skipping relevance check");
      return true; // Default to allowing documents if Gemini isn't available
    }

    // Limit content length to avoid token limits
    const contentPreview = documentContent.substring(0, 2000);

    const prompt = `You are evaluating if a document is relevant to a college course.

Course: ${courseCode} - ${courseTitle}
Document Name: ${fileName}
Document Content Preview: ${contentPreview}

- Does the content contain official course materials such as syllabus, assignments, exams, or lab instruction (if so respond true)?
- Is it students' own work such as lecture notes, lab reports, or student projects(if so respond false)?

Respond with only "true" or "false" (no explanation needed).`;

    const response = await gemini.chat({
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    });

    // Handle the response content safely
    let responseText = '';
    if (Array.isArray(response.message.content)) {
      const textContent = response.message.content.find(
        content => 'type' in content && content.type === 'text'
      );
      responseText = textContent?.text || '';
    } else {
      responseText = response.message.content || '';
    }

    const isProvided = responseText.trim().toLowerCase() === 'true';

    logger.info({
      courseCode,
      courseTitle,
      fileName,
      geminiResponse: responseText.trim(),
      isProvided
    }, "Document relevance check completed");

    return isProvided;

  } catch (error) {
    logger.error({ error, courseCode, courseTitle, fileName }, "Error in document relevance check, defaulting to allow");
    return true; // Default to allowing documents if check fails
  }
}