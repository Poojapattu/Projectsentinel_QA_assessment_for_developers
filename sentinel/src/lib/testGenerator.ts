// lib/testGenerator.ts
export interface TestCase {
  id: string;
  input: any;
  expectedOutput: any;
  description: string;
  category: 'edge-case' | 'normal-case' | 'stress-test';
  complexity: 'simple' | 'medium' | 'complex';
}

export const generateTestCases = (code: string): TestCase[] => {
  const testCases: TestCase[] = [];
  
  // Generate edge cases
  if (code.includes('array')) {
    testCases.push({
      id: 'edge-1',
      input: [],
      expectedOutput: null,
      description: 'Empty array input',
      category: 'edge-case',
      complexity: 'simple'
    });
  }
  
  if (code.includes('string')) {
    testCases.push({
      id: 'edge-2',
      input: '',
      expectedOutput: null,
      description: 'Empty string input',
      category: 'edge-case',
      complexity: 'simple'
    });
  }
  
  // Generate stress tests
  if (code.includes('O(n²)')) {
    testCases.push({
      id: 'stress-1',
      input: Array.from({length: 10000}, (_, i) => i),
      expectedOutput: 'Should complete within 1 second',
      description: 'Large dataset performance test',
      category: 'stress-test',
      complexity: 'complex'
    });
  }
  
  return testCases;
};