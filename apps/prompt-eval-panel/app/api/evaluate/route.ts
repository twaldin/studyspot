import { NextRequest, NextResponse } from 'next/server';
import { QualityEvaluation } from '../../../lib/types/testing.types';

export async function POST(request: NextRequest) {
  try {
    const { query, response, expectedContext, usedExpectedDocument } = await request.json();
    
    // Debug logging for evaluation requests
    console.log('Evaluation API called:', {
      queryLength: query?.length || 0,
      responseLength: response?.length || 0,
      usedExpectedDocument,
      timestamp: new Date().toISOString()
    });

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'ANTHROPIC_API_KEY not configured' }, { status: 500 });
    }

    const prompt = buildEvaluationPrompt(query, response, expectedContext, usedExpectedDocument);

    const anthropicResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 500,
        temperature: 0.3,
        system: `You are an expert evaluator for RAG (Retrieval-Augmented Generation) systems. Your goal is to provide an objective, critical evaluation of an AI assistant's response based on a user query and provided context. Follow the scoring rubric precisely.`,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      })
    });

    if (!anthropicResponse.ok) {
      const errorText = await anthropicResponse.text();
      console.error('Anthropic API error:', anthropicResponse.status, errorText);
      return NextResponse.json({ 
        error: `Anthropic API error: ${anthropicResponse.status}` 
      }, { status: 500 });
    }

    const data = await anthropicResponse.json();
    const content = data.content[0]?.text;
    
    // Debug logging for Anthropic response
    console.log('Anthropic API response:', {
      hasContent: !!content,
      contentLength: content?.length || 0,
      contentPreview: content?.substring(0, 200) + '...'
    });

    if (!content) {
      return NextResponse.json({ error: 'No response content from Anthropic' }, { status: 500 });
    }

    const evaluation = parseEvaluationResponse(content);
    
    // Debug logging for parsed evaluation
    console.log('Parsed evaluation:', {
      overallScore: evaluation.overallScore,
      criteria: evaluation.criteria,
      reasoning: evaluation.reasoning?.substring(0, 100) + '...'
    });
    
    return NextResponse.json(evaluation);

  } catch (error) {
    console.error('Evaluation API error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}

function buildEvaluationPrompt(
  query: string,
  response: string,
  expectedContext: string,
  usedExpectedDocument: boolean
): string {
  return `
You are an expert evaluator for RAG (Retrieval-Augmented Generation) systems. Your goal is to provide an objective, critical evaluation of an AI assistant's response based on a user query and provided context. Follow the scoring rubric precisely.

**QUERY:**
"${query}"

**AI RESPONSE:**
"${response}"

**EXPECTED CONTEXT:**
The query is asking about syllabus information, and the response should ideally reference relevant course policies, requirements, or important information from the syllabus.

**DOCUMENT USAGE:**
${usedExpectedDocument ? 'The response DID reference the expected syllabus document.' : 'The response did NOT reference the expected syllabus document.'}

---

**EVALUATION RUBRIC:**

Please evaluate the response on the following criteria using a 1-10 scale, where 1 is poor and 10 is excellent.

1.  **RELEVANCE (1-10):**
    -   1-3: Completely irrelevant or fails to address the core question.
    -   4-6: Partially addresses the question but misses key aspects or includes irrelevant information.
    -   7-8: Directly answers the question but could be more focused.
    -   9-10: Perfectly on-topic and directly addresses all parts of the user's query.

2.  **ACCURACY (1-10):**
    -   1-3: Contains significant factual errors or fabricates information.
    -   4-6: Mostly accurate but has minor inaccuracies or misleading statements.
    -   7-8: Factually correct and coherent.
    -   9-10: Impeccably accurate, with nuanced and precise information.

3.  **COMPLETENESS (1-10):**
    -   1-3: Misses the main point of the question entirely.
    -   4-6: Answers part of the question but omits important information.
    -   7-8: Covers the most important aspects of the question.
    -   9-10: Provides a comprehensive answer, covering all explicit and implicit parts of the query.

4.  **COHERENCE (1-10):**
    -   1-3: Disorganized, illogical, and very difficult to understand.
    -   4-6: Somewhat structured but may have confusing parts or an unnatural flow.
    -   7-8: Well-structured and easy to understand.
    -   9-10: Exceptionally clear, well-organized, and easy to follow.

5.  **SOURCE USAGE (1-10):**
    -   1-3: Ignores the expected document when it's clearly needed, or hallucinates sources.
    -   4-6: Uses the expected document but not effectively, or relies too heavily on it without adding value.
    -   7-8: Appropriately uses the expected document to support the answer.
    -   9-10: Perfectly integrates information from the expected document, demonstrating clear grounding and relevance. A score of 9-10 is only possible if the expected document was used.

---

**RESPONSE FORMAT:**

Respond with ONLY a JSON object in this exact format:
{
  "overallScore": <1-10>,
  "criteria": {
    "relevance": <1-10>,
    "accuracy": <1-10>,
    "completeness": <1-10>,
    "coherence": <1-10>,
    "sourceUsage": <1-10>
  },
  "reasoning": "<2-3 sentence explanation of the overall assessment, highlighting strengths and weaknesses. Be critical and specific.>"
}`;
}

function parseEvaluationResponse(content: string): QualityEvaluation {
  try {
    // Extract JSON from response (in case there's extra text)
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    const jsonStr = jsonMatch ? jsonMatch[0] : content;
    
    const evaluation = JSON.parse(jsonStr);

    // Validate the structure
    if (!evaluation.overallScore || !evaluation.criteria || !evaluation.reasoning) {
      throw new Error('Invalid evaluation response structure');
    }

    // Ensure all scores are within 1-10 range
    Object.keys(evaluation.criteria).forEach(key => {
      evaluation.criteria[key] = Math.max(1, Math.min(10, evaluation.criteria[key]));
    });

    // Calculate overall score as average of criteria scores with more precision
    const criteriaValues = Object.values(evaluation.criteria) as number[];
    const calculatedOverallScore = criteriaValues.reduce((sum, score) => sum + score, 0) / criteriaValues.length;
    evaluation.overallScore = Math.max(1, Math.min(10, Math.round(calculatedOverallScore * 10) / 10));

    return evaluation as QualityEvaluation;

  } catch (error) {
    console.error('Failed to parse evaluation response:', error);
    console.error('Raw content:', content);
    
    // Return fallback evaluation
    return {
      overallScore: 5,
      criteria: {
        relevance: 5,
        accuracy: 5,
        completeness: 5,
        coherence: 5,
        sourceUsage: 5
      },
      reasoning: 'Failed to parse evaluation response, using default scores'
    };
  }
}