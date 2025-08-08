import { createTool } from '@mastra/core';
import { z } from 'zod';
import { createAnthropic } from '@ai-sdk/anthropic';
import { generateText } from 'ai';

export const verifyCourseTool = createTool({
  id: 'verify-course',
  description: 'Verifies if a course code is safe and appropriate for academic use',
  inputSchema: z.object({
    courseCode: z.string(),
    schoolName: z.string(),
  }),
  outputSchema: z.object({
    verified: z.boolean(),
    message: z.string(),
    reason: z.string().optional(),
  }),
  execute: async ({ context }) => {
    const { courseCode, schoolName } = context;

    try {
      // Generate verification prompt
      const prompt = `Analyze the course code "${courseCode}" for any inappropriate, harmful, or non-academic content.

Remember: DO NOT reject courses based on whether they exist at a specific school or if you recognize the department code.

Respond with JSON only.`;

      // Get environment variables
      const env = (globalThis as any).__workerEnv || process.env;
      const apiKey = env?.ANTHROPIC_API_KEY;
      
      if (!apiKey) {
        console.warn('[Course Verification] No Anthropic API key found, defaulting to verified');
        return {
          verified: true,
          message: 'Course verified for academic use (AI check skipped)',
          reason: 'AI safety check unavailable',
        };
      }

      const anthropic = createAnthropic({ apiKey });

      // Use generateText directly for simplicity
      const response = await generateText({
        model: anthropic('claude-3-haiku-20240307'),
        prompt,
        maxTokens: 200,
        temperature: 0.1
      });

      console.log('[Course Verification] AI response:', response.text);

      let safetyResult;
      try {
        // Strip markdown code blocks if present
        let jsonText = response.text.trim();
        if (jsonText.startsWith('```json')) {
          jsonText = jsonText.slice(7); // Remove ```json
        }
        if (jsonText.startsWith('```')) {
          jsonText = jsonText.slice(3); // Remove ```
        }
        if (jsonText.endsWith('```')) {
          jsonText = jsonText.slice(0, -3); // Remove trailing ```
        }
        jsonText = jsonText.trim();
        
        safetyResult = JSON.parse(jsonText);
      } catch (parseError) {
        console.error('[Course Verification] Failed to parse JSON response:', parseError);
        // Default to safe if parsing fails
        return {
          verified: true,
          message: 'Course verified for academic use (AI check skipped)',
          reason: 'AI safety check unavailable',
        };
      }

      // Only block if content is clearly unsafe with high confidence
      if (!safetyResult.isSafe && safetyResult.confidence > 0.8) {
        return {
          verified: false,
          message: `Course content blocked: ${safetyResult.reason}`,
          reason: safetyResult.reason,
        };
      }

      return {
        verified: true,
        message: 'Course verified for academic use',
        reason: safetyResult.reason,
      };

    } catch (error) {
      console.error('[Course Verification] Error:', error);
      // Default to safe if AI check fails
      return {
        verified: true,
        message: 'Course verified for academic use (AI check skipped)',
        reason: 'AI safety check unavailable',
      };
    }
  },
});