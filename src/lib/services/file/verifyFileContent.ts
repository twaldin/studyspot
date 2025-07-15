/**
 * File Content Verification Service
 * 
 * This service provides comprehensive security verification for uploaded files,
 * including magic number validation, malicious content detection, and deep
 * content analysis for different file types.
 */

import { fileTypeFromBuffer } from 'file-type';
import * as yauzl from 'yauzl';
import { ReadableStreamBuffer } from 'stream-buffers';
import { promisify } from 'util';
import logger from '@/lib/logger';
import {
  ALL_SECURITY_RULES,
  FILE_MAGIC_NUMBERS,
  FILE_PROCESSING_CONFIG,
  FILE_TYPE_CONFIG,
  ThreatSeverity,
  SecurityRule,
  SupportedMimeType,
  isEducationalDomain
} from './fileSecurityRules';

// Types for verification results
export interface VerificationThreat {
  rule: SecurityRule;
  matches: string[];
  context: string;
  severity: ThreatSeverity;
}

export interface VerificationResult {
  isValid: boolean;
  mimeType: string;
  declaredMimeType: string;
  fileSize: number;
  threats: VerificationThreat[];
  warnings: string[];
  metadata: {
    hasEmbeddedFiles: boolean;
    hasJavaScript: boolean;
    hasMacros: boolean;
    hasForms: boolean;
    hasExternalReferences: boolean;
    encoding?: string;
  };
  processingTime: number;
  summary: {
    threatLevel: ThreatSeverity;
    threatCount: number;
    warningCount: number;
    recommendation: 'ALLOW' | 'REVIEW' | 'BLOCK';
  };
}

export interface VerificationOptions {
  maxProcessingTime?: number;
  skipDeepScan?: boolean;
  allowEducationalContent?: boolean;
  strictMode?: boolean;
  customRules?: SecurityRule[];
}

/**
 * Main file content verification service class
 */
export class FileContentVerificationService {
  private readonly defaultOptions: VerificationOptions = {
    maxProcessingTime: FILE_PROCESSING_CONFIG.MAX_PROCESSING_TIME,
    skipDeepScan: false,
    allowEducationalContent: true,
    strictMode: false,
    customRules: []
  };

  /**
   * Verify file content for security threats
   */
  async verifyFileContent(
    buffer: Buffer,
    declaredMimeType: string,
    fileName: string,
    options: VerificationOptions = {}
  ): Promise<VerificationResult> {
    const startTime = Date.now();
    const opts = { ...this.defaultOptions, ...options };

    logger.info({
      fileName,
      declaredMimeType,
      fileSize: buffer.length,
      options: opts
    }, '[FileVerification] Starting file content verification');

    try {
      // Initialize result object
      const result: VerificationResult = {
        isValid: true,
        mimeType: declaredMimeType,
        declaredMimeType,
        fileSize: buffer.length,
        threats: [],
        warnings: [],
        metadata: {
          hasEmbeddedFiles: false,
          hasJavaScript: false,
          hasMacros: false,
          hasForms: false,
          hasExternalReferences: false
        },
        processingTime: 0,
        summary: {
          threatLevel: ThreatSeverity.LOW,
          threatCount: 0,
          warningCount: 0,
          recommendation: 'ALLOW'
        }
      };

      // Step 1: Validate file magic numbers
      await this.validateMagicNumbers(buffer, declaredMimeType, result);

      // Step 2: Detect actual file type
      const detectedType = await fileTypeFromBuffer(buffer);
      if (detectedType) {
        result.mimeType = detectedType.mime;
        
        // Check if declared type matches detected type
        if (detectedType.mime !== declaredMimeType) {
          result.warnings.push(`Declared MIME type '${declaredMimeType}' does not match detected type '${detectedType.mime}'`);
        }
      }

      // Step 3: Check if file type is supported
      if (!this.isSupportedFileType(result.mimeType)) {
        result.isValid = false;
        result.threats.push({
          rule: {
            pattern: new RegExp(result.mimeType),
            description: `Unsupported file type: ${result.mimeType}`,
            severity: ThreatSeverity.HIGH,
            category: 'unsupported_type',
            enabled: true
          },
          matches: [result.mimeType],
          context: 'File type detection',
          severity: ThreatSeverity.HIGH
        });
      }

      // Step 4: Memory and size validation
      this.validateFileSize(buffer, result);

      // Step 5: Content analysis based on file type
      if (result.isValid && !opts.skipDeepScan) {
        await this.performDeepContentAnalysis(buffer, result.mimeType as SupportedMimeType, result, opts);
      }

      // Step 6: Apply security rules
      await this.applySecurityRules(buffer, result, opts);

      // Step 7: Calculate final assessment
      this.calculateFinalAssessment(result, opts);

      result.processingTime = Date.now() - startTime;

      logger.info({
        fileName,
        isValid: result.isValid,
        threatCount: result.threats.length,
        warningCount: result.warnings.length,
        recommendation: result.summary.recommendation,
        processingTime: result.processingTime
      }, '[FileVerification] File verification completed');

      return result;

    } catch (error) {
      logger.error({
        error,
        fileName,
        declaredMimeType,
        fileSize: buffer.length
      }, '[FileVerification] Error during file verification');

      return {
        isValid: false,
        mimeType: declaredMimeType,
        declaredMimeType,
        fileSize: buffer.length,
        threats: [{
          rule: {
            pattern: /error/,
            description: 'Verification process failed',
            severity: ThreatSeverity.HIGH,
            category: 'processing_error',
            enabled: true
          },
          matches: [error instanceof Error ? error.message : 'Unknown error'],
          context: 'Verification process',
          severity: ThreatSeverity.HIGH
        }],
        warnings: ['File verification process encountered an error'],
        metadata: {
          hasEmbeddedFiles: false,
          hasJavaScript: false,
          hasMacros: false,
          hasForms: false,
          hasExternalReferences: false
        },
        processingTime: Date.now() - startTime,
        summary: {
          threatLevel: ThreatSeverity.HIGH,
          threatCount: 1,
          warningCount: 1,
          recommendation: 'BLOCK'
        }
      };
    }
  }

  /**
   * Validate file magic numbers against declared MIME type
   */
  private async validateMagicNumbers(buffer: Buffer, declaredMimeType: string, result: VerificationResult): Promise<void> {
    const magicNumbers = this.getMagicNumbersForMimeType(declaredMimeType);
    
    if (magicNumbers && magicNumbers.length > 0) {
      const fileHeader = Array.from(buffer.slice(0, magicNumbers.length));
      const matches = magicNumbers.every((byte, index) => fileHeader[index] === byte);
      
      if (!matches) {
        result.warnings.push(`File magic numbers do not match declared MIME type '${declaredMimeType}'`);
        logger.warn({
          declaredMimeType,
          expectedMagic: magicNumbers,
          actualMagic: fileHeader
        }, '[FileVerification] Magic number mismatch detected');
      }
    }
  }

  /**
   * Perform deep content analysis based on file type
   */
  private async performDeepContentAnalysis(
    buffer: Buffer,
    mimeType: SupportedMimeType,
    result: VerificationResult,
    options: VerificationOptions
  ): Promise<void> {
    const config = FILE_TYPE_CONFIG[mimeType];
    if (!config) return;

    switch (mimeType) {
      case 'application/pdf':
        await this.analyzePDFContent(buffer, result, options);
        break;
      case 'application/msword':
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        await this.analyzeOfficeDocumentContent(buffer, result, options);
        break;
      case 'text/plain':
        await this.analyzeTextContent(buffer, result, options);
        break;
    }
  }

  /**
   * Analyze PDF content for security threats
   */
  private async analyzePDFContent(buffer: Buffer, result: VerificationResult, options: VerificationOptions): Promise<void> {
    const content = buffer.toString('latin1');
    const maxLength = Math.min(content.length, FILE_PROCESSING_CONFIG.MAX_SCAN_LENGTH.PDF);
    const scanContent = content.substring(0, maxLength);

    // Check for JavaScript
    if (/\/JavaScript\s*\[|\/JS\s*\[/i.test(scanContent)) {
      result.metadata.hasJavaScript = true;
      result.warnings.push('PDF contains JavaScript code');
    }

    // Check for embedded files
    if (/\/EmbeddedFile/i.test(scanContent)) {
      result.metadata.hasEmbeddedFiles = true;
      result.warnings.push('PDF contains embedded files');
    }

    // Check for forms
    if (/\/AcroForm|\/XFA/i.test(scanContent)) {
      result.metadata.hasForms = true;
      if (options.strictMode) {
        result.warnings.push('PDF contains interactive forms');
      }
    }

    // Check for external references
    if (/\/URI\s*\(|\/URL\s*\(/i.test(scanContent)) {
      result.metadata.hasExternalReferences = true;
    }

    logger.debug({
      hasJavaScript: result.metadata.hasJavaScript,
      hasEmbeddedFiles: result.metadata.hasEmbeddedFiles,
      hasForms: result.metadata.hasForms,
      hasExternalReferences: result.metadata.hasExternalReferences
    }, '[FileVerification] PDF analysis completed');
  }

  /**
   * Analyze Office document content for security threats
   */
  private async analyzeOfficeDocumentContent(buffer: Buffer, result: VerificationResult, options: VerificationOptions): Promise<void> {
    try {
      // For DOCX files (ZIP-based), we need to extract and analyze content
      if (result.mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        await this.analyzeDocxContent(buffer, result, options);
      } else {
        // For legacy DOC files, analyze as binary
        await this.analyzeDocContent(buffer, result, options);
      }
    } catch (error) {
      logger.warn({
        error,
        mimeType: result.mimeType
      }, '[FileVerification] Error analyzing office document');
      result.warnings.push('Could not fully analyze office document content');
    }
  }

  /**
   * Analyze DOCX content by extracting ZIP contents
   */
  private async analyzeDocxContent(buffer: Buffer, result: VerificationResult, options: VerificationOptions): Promise<void> {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('DOCX analysis timeout'));
      }, options.maxProcessingTime || FILE_PROCESSING_CONFIG.MAX_PROCESSING_TIME);

      yauzl.fromBuffer(buffer, { lazyEntries: true }, (err, zipfile) => {
        if (err) {
          clearTimeout(timeout);
          return reject(err);
        }

        if (!zipfile) {
          clearTimeout(timeout);
          return resolve();
        }

        let processedEntries = 0;
        const maxEntries = FILE_PROCESSING_CONFIG.MAX_EMBEDDED_FILES;

        zipfile.readEntry();
        zipfile.on('entry', (entry) => {
          if (processedEntries >= maxEntries) {
            clearTimeout(timeout);
            zipfile.close();
            return resolve();
          }

          if (/\.(xml|rels)$/i.test(entry.fileName)) {
            zipfile.openReadStream(entry, (err, readStream) => {
              if (err) {
                processedEntries++;
                zipfile.readEntry();
                return;
              }

              if (!readStream) {
                processedEntries++;
                zipfile.readEntry();
                return;
              }

              let content = '';
              readStream.on('data', (chunk) => {
                content += chunk.toString('utf8');
              });

              readStream.on('end', () => {
                this.analyzeXMLContent(content, result);
                processedEntries++;
                zipfile.readEntry();
              });
            });
          } else {
            processedEntries++;
            zipfile.readEntry();
          }
        });

        zipfile.on('end', () => {
          clearTimeout(timeout);
          resolve();
        });

        zipfile.on('error', (err) => {
          clearTimeout(timeout);
          reject(err);
        });
      });
    });
  }

  /**
   * Analyze legacy DOC content
   */
  private async analyzeDocContent(buffer: Buffer, result: VerificationResult, options: VerificationOptions): Promise<void> {
    const content = buffer.toString('latin1');
    const maxLength = Math.min(content.length, FILE_PROCESSING_CONFIG.MAX_SCAN_LENGTH.DOC);
    const scanContent = content.substring(0, maxLength);

    // Check for macro indicators in binary content
    if (/(?:Sub|Function|Private|Public|Dim)\s+/i.test(scanContent)) {
      result.metadata.hasMacros = true;
      result.warnings.push('Document may contain macros');
    }

    // Check for embedded objects
    if (/Embedded|Object|OLE/i.test(scanContent)) {
      result.metadata.hasEmbeddedFiles = true;
      result.warnings.push('Document contains embedded objects');
    }
  }

  /**
   * Analyze XML content from Office documents
   */
  private analyzeXMLContent(content: string, result: VerificationResult): void {
    // Check for macro references
    if (/vbaProject|macrosheet|xlm:|macro/i.test(content)) {
      result.metadata.hasMacros = true;
      if (!result.warnings.includes('Document may contain macros')) {
        result.warnings.push('Document may contain macros');
      }
    }

    // Check for external references
    if (/http:|https:|ftp:|file:/i.test(content)) {
      result.metadata.hasExternalReferences = true;
    }
  }

  /**
   * Analyze plain text content
   */
  private async analyzeTextContent(buffer: Buffer, result: VerificationResult, options: VerificationOptions): Promise<void> {
    // Detect encoding
    const encoding = this.detectTextEncoding(buffer);
    result.metadata.encoding = encoding as string;

    const content = buffer.toString(encoding);
    const maxLength = Math.min(content.length, FILE_PROCESSING_CONFIG.MAX_SCAN_LENGTH.TXT);
    const scanContent = content.substring(0, maxLength);

    // Check for binary content in text file
    if (this.containsBinaryContent(scanContent)) {
      result.warnings.push('Text file contains binary or non-printable characters');
    }

    // Text files are relatively simple, main analysis happens in security rules
    logger.debug({
      encoding,
      contentLength: content.length,
      hasBinaryContent: this.containsBinaryContent(scanContent)
    }, '[FileVerification] Text analysis completed');
  }

  /**
   * Apply security rules to file content
   */
  private async applySecurityRules(buffer: Buffer, result: VerificationResult, options: VerificationOptions): Promise<void> {
    const mimeType = result.mimeType as SupportedMimeType;
    const config = FILE_TYPE_CONFIG[mimeType];
    if (!config) return;

    // Get rules for this file type
    const applicableRules = [...config.rules];
    if (options.customRules) {
      applicableRules.push(...options.customRules);
    }

    // Convert buffer to string for pattern matching
    const content = buffer.toString('utf8');
    const maxLength = Math.min(content.length, FILE_PROCESSING_CONFIG.MAX_SCAN_LENGTH[mimeType.includes('pdf') ? 'PDF' : 'TXT']);
    const scanContent = content.substring(0, maxLength);

    // Apply each rule
    for (const rule of applicableRules) {
      if (!rule.enabled) continue;

      const matches = scanContent.match(rule.pattern);
      if (matches && matches.length > 0) {
        // Check if matches are in educational allowlist
        if (options.allowEducationalContent && rule.category === 'suspicious_urls') {
          const allowedMatches = matches.filter(match => !isEducationalDomain(match));
          if (allowedMatches.length === 0) continue;
        }

        const threat: VerificationThreat = {
          rule,
          matches: matches.slice(0, 10), // Limit matches to prevent log spam
          context: this.getContextAroundMatch(scanContent, matches[0]),
          severity: rule.severity
        };

        result.threats.push(threat);
        logger.debug({
          rule: rule.description,
          category: rule.category,
          severity: rule.severity,
          matchCount: matches.length
        }, '[FileVerification] Security rule triggered');
      }
    }
  }

  /**
   * Calculate final assessment and recommendation
   */
  private calculateFinalAssessment(result: VerificationResult, options: VerificationOptions): void {
    result.summary.threatCount = result.threats.length;
    result.summary.warningCount = result.warnings.length;

    // Determine highest threat level
    let highestThreat = ThreatSeverity.LOW;
    for (const threat of result.threats) {
      if (this.getThreatLevel(threat.severity) > this.getThreatLevel(highestThreat)) {
        highestThreat = threat.severity;
      }
    }
    result.summary.threatLevel = highestThreat;

    // Make recommendation
    if (result.threats.some(t => t.severity === ThreatSeverity.CRITICAL)) {
      result.summary.recommendation = 'BLOCK';
      result.isValid = false;
    } else if (result.threats.some(t => t.severity === ThreatSeverity.HIGH)) {
      result.summary.recommendation = options.strictMode ? 'BLOCK' : 'REVIEW';
      result.isValid = !options.strictMode;
    } else if (result.threats.some(t => t.severity === ThreatSeverity.MEDIUM)) {
      result.summary.recommendation = 'REVIEW';
    } else {
      result.summary.recommendation = 'ALLOW';
    }

    logger.info({
      threatLevel: result.summary.threatLevel,
      threatCount: result.summary.threatCount,
      warningCount: result.summary.warningCount,
      recommendation: result.summary.recommendation,
      isValid: result.isValid
    }, '[FileVerification] Final assessment calculated');
  }

  /**
   * Helper methods
   */
  private getMagicNumbersForMimeType(mimeType: string): number[] | null {
    switch (mimeType) {
      case 'application/pdf':
        return FILE_MAGIC_NUMBERS.PDF ? [...FILE_MAGIC_NUMBERS.PDF] : null;
      case 'application/msword':
        return FILE_MAGIC_NUMBERS.DOC ? [...FILE_MAGIC_NUMBERS.DOC] : null;
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        return FILE_MAGIC_NUMBERS.DOCX ? [...FILE_MAGIC_NUMBERS.DOCX] : null;
      case 'text/plain':
        return FILE_MAGIC_NUMBERS.TXT ? [...FILE_MAGIC_NUMBERS.TXT] : null;
      default:
        return null;
    }
  }

  private isSupportedFileType(mimeType: string): boolean {
    return mimeType in FILE_TYPE_CONFIG;
  }

  private validateFileSize(buffer: Buffer, result: VerificationResult): void {
    if (buffer.length > FILE_PROCESSING_CONFIG.MAX_MEMORY_USAGE) {
      result.warnings.push(`File size (${buffer.length} bytes) exceeds maximum processing limit`);
    }
  }

  private detectTextEncoding(buffer: Buffer): BufferEncoding {
    // Simple encoding detection - look for BOM or assume UTF-8
    if (buffer.length >= 3 && buffer[0] === 0xEF && buffer[1] === 0xBB && buffer[2] === 0xBF) {
      return 'utf8';
    }
    if (buffer.length >= 2 && buffer[0] === 0xFF && buffer[1] === 0xFE) {
      return 'utf16le';
    }
    if (buffer.length >= 2 && buffer[0] === 0xFE && buffer[1] === 0xFF) {
      return 'utf16le'; // Using utf16le as Node.js doesn't have utf16be
    }
    return 'utf8';
  }

  private containsBinaryContent(content: string): boolean {
    // Check for non-printable characters that might indicate binary content
    return /[\x00-\x08\x0E-\x1F\x7F-\x9F]/.test(content);
  }

  private getContextAroundMatch(content: string, match: string): string {
    const index = content.indexOf(match);
    if (index === -1) return match;
    
    const start = Math.max(0, index - 50);
    const end = Math.min(content.length, index + match.length + 50);
    return content.substring(start, end);
  }

  private getThreatLevel(severity: ThreatSeverity): number {
    switch (severity) {
      case ThreatSeverity.LOW: return 1;
      case ThreatSeverity.MEDIUM: return 2;
      case ThreatSeverity.HIGH: return 3;
      case ThreatSeverity.CRITICAL: return 4;
      default: return 0;
    }
  }
}

// Export singleton instance
export const fileContentVerificationService = new FileContentVerificationService();

/**
 * Verifies the security and integrity of a file buffer using content analysis and configurable rules.
 *
 * Performs layered checks including magic number validation, MIME type detection, deep content analysis, and threat assessment to determine if the file should be allowed, reviewed, or blocked.
 *
 * @param buffer - The file content to verify
 * @param declaredMimeType - The MIME type provided for the file
 * @param fileName - The name of the file being verified
 * @param options - Optional verification settings to customize analysis
 * @returns The result of the verification, including detected threats, warnings, metadata, and a final recommendation
 */
export async function verifyFileContent(
  buffer: Buffer,
  declaredMimeType: string,
  fileName: string,
  options?: VerificationOptions
): Promise<VerificationResult> {
  return fileContentVerificationService.verifyFileContent(buffer, declaredMimeType, fileName, options);
}

// Re-export types for external use
export type {
  ThreatSeverity
} from './fileSecurityRules';