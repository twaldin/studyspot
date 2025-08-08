/**
 * Sanitize text content to remove problematic Unicode characters
 * that can cause issues with vector databases
 */
export function sanitizeText(text: string, context?: string): string {
  if (!text) return '';
  
  try {
    // Remove null bytes
    let sanitized = text.replace(/\0/g, '');
    
    // Remove other problematic Unicode characters
    // Unicode control characters (C0 and C1)
    sanitized = sanitized.replace(/[\x00-\x1F\x7F-\x9F]/g, ' ');
    
    // Remove Unicode replacement character
    sanitized = sanitized.replace(/\uFFFD/g, '');
    
    // Normalize whitespace
    sanitized = sanitized.replace(/\s+/g, ' ').trim();
    
    // Remove extremely long sequences of repeated characters (likely corruption)
    sanitized = sanitized.replace(/(.)\1{50,}/g, '$1$1$1');
    
    return sanitized;
  } catch (error) {
    console.error(`Error sanitizing text${context ? ` for ${context}` : ''}:`, error);
    // Return empty string on error to prevent ingestion failure
    return '';
  }
}