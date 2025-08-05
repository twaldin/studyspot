import { enhancedRagWorkflow } from './rag-workflow-enhanced.js';
import { mastra } from '../index.js';

// Test cases for the enhanced RAG workflow
const testCases = [
  {
    name: 'Factual Query (Should use RAG)',
    input: {
      question: 'What did the professor say about thermodynamics in lecture 3?',
      conversationHistory: [],
      courseId: 'test-course-id',
      userId: 'test-user',
      timeZone: 'America/New_York'
    }
  },
  {
    name: 'General Chat (Should skip RAG)',
    input: {
      question: 'Hello, how are you today?',
      conversationHistory: [],
      courseId: 'test-course-id',
      userId: 'test-user',
      timeZone: 'America/New_York'
    }
  },
  {
    name: 'Creative Request (Should skip RAG)',
    input: {
      question: 'Create a study schedule for my physics exam',
      conversationHistory: [],
      courseId: 'test-course-id',
      userId: 'test-user',
      timeZone: 'America/New_York'
    }
  },
  {
    name: 'Complex Query (Should use parallel RAG)',
    input: {
      question: 'Compare quantum mechanics and classical mechanics as discussed in both the textbook and lectures',
      conversationHistory: [],
      courseId: 'test-course-id',
      userId: 'test-user',
      timeZone: 'America/New_York'
    }
  }
];

async function runTests() {
  console.log('🧪 Testing Enhanced RAG Workflow\n');
  
  for (const testCase of testCases) {
    console.log(`\n📋 Test: ${testCase.name}`);
    console.log(`Question: "${testCase.input.question}"`);
    
    try {
      const startTime = Date.now();
      
      // Execute the workflow
      const result = await mastra
        .getWorkflow('enhancedRagWorkflow')
        .execute(testCase.input);
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      // Display results
      console.log(`✅ Success in ${duration}ms`);
      console.log(`RAG Used: ${result.metadata?.ragUsed ? 'Yes' : 'No'}`);
      console.log(`Query Type: ${result.metadata?.queryType || 'unknown'}`);
      
      if (result.metadata?.ragUsed) {
        console.log(`Documents Found: ${result.metadata.documentsFound}`);
        console.log(`Parallel Searches: ${result.metadata.parallelSearches || 0}`);
      }
      
      console.log(`Response Preview: ${result.response.substring(0, 100)}...`);
      
    } catch (error) {
      console.error(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  
  console.log('\n\n✨ Testing complete!');
}

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runTests().catch(console.error);
}

export { runTests };