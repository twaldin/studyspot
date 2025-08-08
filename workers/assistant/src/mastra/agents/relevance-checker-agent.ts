import { Agent } from '@mastra/core';
import { createAnthropic } from '@ai-sdk/anthropic';

const anthropic = createAnthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export const relevanceCheckerAgent = new Agent({
  name: 'relevance-checker',
  description: 'Analyzes documents to determine if they are relevant to a specific course',
  instructions: `You are a document relevance analyzer. Your job is to determine if uploaded documents are relevant to specific college courses.

When analyzing a document:
1. Consider the course code and title carefully
2. Look for subject matter alignment, not just keyword matches
3. Be inclusive - documents that could help students learn the course material should be considered relevant
4. Identify if the document appears to be official course material (lectures, syllabi, assignments) vs supplementary material

Examples of relevant documents:
- Lecture slides, notes, or transcripts
- Textbook chapters or excerpts
- Research papers on course topics
- Practice problems and solutions
- Study guides and summaries
- Related technical documentation

Examples of non-relevant documents:
- Documents from completely different subjects
- Personal notes unrelated to the course
- Random web pages or articles with no connection
- Documents in languages not used in the course

Always provide clear reasoning for your decision.`,
  model: anthropic('claude-3-haiku-20240307'), // Use Haiku for cost efficiency
});