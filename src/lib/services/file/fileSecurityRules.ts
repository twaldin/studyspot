/**
 * File Security Rules Configuration
 * 
 * This module defines comprehensive security rules for file content verification.
 * It includes patterns for detecting malicious content, allowlists for legitimate
 * educational content, and severity levels for different types of threats.
 */

// Severity levels for different types of threats
export enum ThreatSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

// Security rule interface
export interface SecurityRule {
  pattern: RegExp;
  description: string;
  severity: ThreatSeverity;
  category: string;
  enabled: boolean;
}

// File type magic numbers for header validation
export const FILE_MAGIC_NUMBERS = {
  PDF: [0x25, 0x50, 0x44, 0x46], // %PDF
  DOC: [0xD0, 0xCF, 0x11, 0xE0, 0xA1, 0xB1, 0x1A, 0xE1], // Microsoft Office compound document
  DOCX: [0x50, 0x4B, 0x03, 0x04], // ZIP archive (DOCX is ZIP-based)
  ZIP: [0x50, 0x4B, 0x03, 0x04], // ZIP archive
  TXT: null, // Plain text has no magic number
} as const;

// Suspicious URL patterns that may indicate malicious content
export const SUSPICIOUS_URL_PATTERNS: SecurityRule[] = [
  {
    pattern: /(?:https?:\/\/)?(?:[\w-]+\.)*(?:bit\.ly|tinyurl\.com|t\.co|goo\.gl|short\.link|ow\.ly|is\.gd|buff\.ly|adf\.ly|lnkd\.in|tiny\.cc|cli\.gs|linktr\.ee)\/[\w-]+/gi,
    description: 'Suspicious shortened URLs detected',
    severity: ThreatSeverity.MEDIUM,
    category: 'suspicious_urls',
    enabled: true
  },
  {
    pattern: /(?:https?:\/\/)?(?:[\w-]+\.)*(?:onion|bit|tk|ml|ga|cf|top|click|download|zip|exe|scr|bat|cmd|com|pif|vbs|js)(?:\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?/gi,
    description: 'Suspicious domain extensions detected',
    severity: ThreatSeverity.HIGH,
    category: 'suspicious_urls',
    enabled: true
  },
  {
    pattern: /(?:https?:\/\/)?(?:[\w-]+\.)*(?:phishing|malware|virus|trojan|botnet|exploit|hack|crack|keygen|serial|warez|pirate)[\w-]*\.[\w]+/gi,
    description: 'Potentially malicious domain names detected',
    severity: ThreatSeverity.HIGH,
    category: 'suspicious_urls',
    enabled: true
  }
];

// Script and code injection patterns
export const SCRIPT_INJECTION_PATTERNS: SecurityRule[] = [
  {
    pattern: /<script[\s\S]*?<\/script>/gi,
    description: 'JavaScript script tags detected',
    severity: ThreatSeverity.HIGH,
    category: 'script_injection',
    enabled: true
  },
  {
    pattern: /javascript:\s*[\w\W]*?(?:\(|;|$)/gi,
    description: 'JavaScript protocol URLs detected',
    severity: ThreatSeverity.HIGH,
    category: 'script_injection',
    enabled: true
  },
  {
    pattern: /vbscript:\s*[\w\W]*?(?:\(|;|$)/gi,
    description: 'VBScript protocol URLs detected',
    severity: ThreatSeverity.HIGH,
    category: 'script_injection',
    enabled: true
  },
  {
    pattern: /data:\s*[\w\/\-\+]*;base64,[\w\W]*?(?:\s|$)/gi,
    description: 'Base64 encoded data URLs detected',
    severity: ThreatSeverity.MEDIUM,
    category: 'script_injection',
    enabled: true
  },
  {
    pattern: /on(?:click|load|error|focus|blur|change|submit|reset|select|resize|scroll|unload|beforeunload|hashchange|popstate|storage|message|offline|online)\s*=\s*['"]/gi,
    description: 'HTML event handlers detected',
    severity: ThreatSeverity.MEDIUM,
    category: 'script_injection',
    enabled: true
  }
];

// Office document macro patterns
export const MACRO_PATTERNS: SecurityRule[] = [
  {
    pattern: /(?:Sub|Function|Private|Public|Dim)\s+[\w\s]+\s*\(/gi,
    description: 'VBA macro keywords detected',
    severity: ThreatSeverity.HIGH,
    category: 'macros',
    enabled: true
  },
  {
    pattern: /Application\.Run|Shell|CreateObject|GetObject|Environ|Dir|Kill|Open|Print|Write|Input|Close/gi,
    description: 'Potentially dangerous VBA functions detected',
    severity: ThreatSeverity.CRITICAL,
    category: 'macros',
    enabled: true
  },
  {
    pattern: /WScript\.Shell|WScript\.CreateObject|ActiveXObject/gi,
    description: 'Windows Script Host objects detected',
    severity: ThreatSeverity.CRITICAL,
    category: 'macros',
    enabled: true
  },
  {
    pattern: /PowerShell|cmd\.exe|powershell\.exe|wscript\.exe|cscript\.exe/gi,
    description: 'System command execution detected',
    severity: ThreatSeverity.CRITICAL,
    category: 'macros',
    enabled: true
  }
];

// PDF-specific security patterns
export const PDF_SECURITY_PATTERNS: SecurityRule[] = [
  {
    pattern: /\/JavaScript\s*\[/gi,
    description: 'PDF JavaScript code detected',
    severity: ThreatSeverity.HIGH,
    category: 'pdf_javascript',
    enabled: true
  },
  {
    pattern: /\/JS\s*\[/gi,
    description: 'PDF JavaScript (JS) code detected',
    severity: ThreatSeverity.HIGH,
    category: 'pdf_javascript',
    enabled: true
  },
  {
    pattern: /\/OpenAction/gi,
    description: 'PDF auto-execution actions detected',
    severity: ThreatSeverity.MEDIUM,
    category: 'pdf_actions',
    enabled: true
  },
  {
    pattern: /\/Launch/gi,
    description: 'PDF launch actions detected',
    severity: ThreatSeverity.HIGH,
    category: 'pdf_actions',
    enabled: true
  },
  {
    pattern: /\/EmbeddedFile/gi,
    description: 'PDF embedded files detected',
    severity: ThreatSeverity.MEDIUM,
    category: 'pdf_embedded',
    enabled: true
  },
  {
    pattern: /\/XFA/gi,
    description: 'PDF XFA forms detected',
    severity: ThreatSeverity.LOW,
    category: 'pdf_forms',
    enabled: true
  },
  {
    pattern: /\/AcroForm/gi,
    description: 'PDF AcroForms detected',
    severity: ThreatSeverity.LOW,
    category: 'pdf_forms',
    enabled: true
  }
];

// Executable and binary patterns
export const EXECUTABLE_PATTERNS: SecurityRule[] = [
  {
    pattern: /(?:\.exe|\.scr|\.bat|\.cmd|\.com|\.pif|\.vbs|\.jar|\.msi|\.deb|\.rpm|\.dmg|\.pkg|\.app)(?:\s|$|")/gi,
    description: 'Executable file extensions detected',
    severity: ThreatSeverity.CRITICAL,
    category: 'executables',
    enabled: true
  },
  {
    pattern: /MZ[\x00-\xFF]{2}[\x00-\xFF]*PE\x00\x00/g,
    description: 'Windows PE executable header detected',
    severity: ThreatSeverity.CRITICAL,
    category: 'executables',
    enabled: true
  },
  {
    pattern: /\x7fELF/g,
    description: 'Linux ELF executable header detected',
    severity: ThreatSeverity.CRITICAL,
    category: 'executables',
    enabled: true
  }
];

// Social engineering and phishing patterns
export const SOCIAL_ENGINEERING_PATTERNS: SecurityRule[] = [
  {
    pattern: /(?:urgent|immediate|expire|suspend|verify|confirm|click here|download now|act now|limited time|congratulations|winner|prize|lottery|inheritance|millions?|billions?)/gi,
    description: 'Social engineering keywords detected',
    severity: ThreatSeverity.LOW,
    category: 'social_engineering',
    enabled: true
  },
  {
    pattern: /(?:password|username|ssn|social security|credit card|bank account|routing number|pin|cvv|security code)/gi,
    description: 'Sensitive information requests detected',
    severity: ThreatSeverity.MEDIUM,
    category: 'social_engineering',
    enabled: true
  }
];

// Allowlist patterns for legitimate educational content
export const EDUCATIONAL_ALLOWLIST_PATTERNS = [
  // Academic domains
  /(?:\.edu|\.ac\.|\.uni-)/i,
  // Common educational platforms
  /(?:coursera|edx|udemy|khanacademy|mit\.edu|stanford\.edu|harvard\.edu|berkeley\.edu)/i,
  // Academic publishers
  /(?:springer|wiley|elsevier|ieee|acm|nature|science|jstor|pubmed)/i,
  // Learning management systems
  /(?:blackboard|canvas|moodle|brightspace|sakai)/i,
  // Educational tools
  /(?:wolfram|mathematica|matlab|rstudio|jupyter|github\.com|stackoverflow)/i,
  // Academic repositories
  /(?:arxiv|researchgate|academia\.edu|scholar\.google)/i
];

// Combine all security rules
export const ALL_SECURITY_RULES: SecurityRule[] = [
  ...SUSPICIOUS_URL_PATTERNS,
  ...SCRIPT_INJECTION_PATTERNS,
  ...MACRO_PATTERNS,
  ...PDF_SECURITY_PATTERNS,
  ...EXECUTABLE_PATTERNS,
  ...SOCIAL_ENGINEERING_PATTERNS
];

// Configuration for file size limits and processing
export const FILE_PROCESSING_CONFIG = {
  // Maximum content length to scan for each file type (in characters)
  MAX_SCAN_LENGTH: {
    PDF: 50000,
    DOC: 30000,
    DOCX: 30000,
    TXT: 20000
  },
  
  // Maximum processing time per file (in milliseconds)
  MAX_PROCESSING_TIME: 30000, // 30 seconds
  
  // Buffer size for streaming file processing
  STREAM_BUFFER_SIZE: 8192, // 8KB chunks
  
  // Maximum number of embedded files to extract from containers
  MAX_EMBEDDED_FILES: 10,
  
  // Memory limits for file processing
  MAX_MEMORY_USAGE: 100 * 1024 * 1024, // 100MB
} as const;

/**
 * Retrieves all enabled security rules that match the specified category.
 *
 * @param category - The category of security rules to retrieve
 * @returns An array of enabled security rules belonging to the given category
 */
export function getRulesByCategory(category: string): SecurityRule[] {
  return ALL_SECURITY_RULES.filter(rule => rule.category === category && rule.enabled);
}

/**
 * Returns all enabled security rules that match the specified threat severity.
 *
 * @param severity - The threat severity level to filter by
 * @returns An array of enabled security rules with the given severity
 */
export function getRulesBySeverity(severity: ThreatSeverity): SecurityRule[] {
  return ALL_SECURITY_RULES.filter(rule => rule.severity === severity && rule.enabled);
}

/**
 * Determines whether a given URL matches any pattern in the educational allowlist.
 *
 * @param url - The URL to check against the educational allowlist patterns
 * @returns True if the URL is recognized as belonging to an educational domain; otherwise, false
 */
export function isEducationalDomain(url: string): boolean {
  return EDUCATIONAL_ALLOWLIST_PATTERNS.some(pattern => pattern.test(url));
}

// Configuration for different file types
export const FILE_TYPE_CONFIG = {
  'application/pdf': {
    rules: [...PDF_SECURITY_PATTERNS, ...SUSPICIOUS_URL_PATTERNS, ...SOCIAL_ENGINEERING_PATTERNS],
    requiresDeepScan: true,
    allowJavaScript: false,
    allowEmbeddedFiles: false,
    allowForms: true // Educational PDFs may have forms
  },
  'application/msword': {
    rules: [...MACRO_PATTERNS, ...SCRIPT_INJECTION_PATTERNS, ...SUSPICIOUS_URL_PATTERNS],
    requiresDeepScan: true,
    allowMacros: false,
    allowEmbeddedObjects: false
  },
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': {
    rules: [...MACRO_PATTERNS, ...SCRIPT_INJECTION_PATTERNS, ...SUSPICIOUS_URL_PATTERNS],
    requiresDeepScan: true,
    allowMacros: false,
    allowEmbeddedObjects: false
  },
  'text/plain': {
    rules: [...SUSPICIOUS_URL_PATTERNS, ...SCRIPT_INJECTION_PATTERNS, ...SOCIAL_ENGINEERING_PATTERNS],
    requiresDeepScan: false,
    encoding: 'utf-8'
  }
} as const;

export type FileTypeConfig = typeof FILE_TYPE_CONFIG;
export type SupportedMimeType = keyof FileTypeConfig;