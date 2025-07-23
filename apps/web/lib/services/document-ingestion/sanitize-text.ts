import logger from "@/lib/logger";

/**
 * Sanitizes text content to remove problematic Unicode characters that cause
 * PostgreSQL insertion failures, particularly null bytes and control characters
 * commonly found in PDF extractions.
 * 
 * Maintains exact same functionality as original assistant API
 */
export function sanitizeText(text: string, context?: string): string {
  if (!text || typeof text !== 'string') {
    return '';
  }

  const originalLength = text.length;
  
  // Remove null bytes and problematic control characters
  // Keep newlines (\n, \r), tabs (\t), and other whitespace
  let sanitized = text
    // Remove null bytes (the main culprit)
    .replace(/\u0000/g, '')
    // Remove other control characters except newlines and tabs
    .replace(/[\u0001-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    // Handle common PDF extraction artifacts
    .replace(/\uFFFD/g, '') // Unicode replacement character
    .replace(/[\uE000-\uF8FF]/g, '') // Private use area characters
    // Normalize excessive whitespace but preserve paragraph breaks
    .replace(/[ \t]+/g, ' ') // Multiple spaces/tabs to single space
    .replace(/\n\s*\n\s*\n/g, '\n\n') // Multiple newlines to double newline
    .trim();

  // Log if significant sanitization occurred
  const removedChars = originalLength - sanitized.length;
  if (removedChars > 0) {
    logger.info({
      context,
      originalLength,
      sanitizedLength: sanitized.length,
      removedChars,
    }, "Text sanitization: Removed problematic characters");
  }

  return sanitized;
}

/**
 * Sanitizes an array of text strings
 */
export function sanitizeTextArray(texts: string[], context?: string): string[] {
  return texts.map((text, index) => 
    sanitizeText(text, context ? `${context}[${index}]` : undefined)
  );
}