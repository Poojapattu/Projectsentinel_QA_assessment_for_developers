export interface AIIssue {
  id: string;
  type: 'security' | 'performance' | 'bug' | 'style' | 'time-complexity' | 'algorithm';
  severity: 'critical' | 'high' | 'medium' | 'low';
  message: string;
  line: number;
  fix: string;
  codeSnippet: string;
  suggestedFix: string;
  confidence: number;
  timeComplexity?: {
    current: string;
    improved: string;
    improvement: string;
    explanation: string;
  };
  spaceComplexity?: {
    current: string;
    improved: string;
  };
  recommendations?: {
    algorithm: string;
    method: string;
    libraries: string[];
    benefits: string[];
  };
  explanation: string;
}

// Smart mock analysis - No API key needed
export const analyzeCodeWithAI = async (code: string): Promise<AIIssue[]> => {
  console.log('🔍 Analyzing code complexity and performance...');
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  return getSmartComplexityAnalysis(code);
};

export const applyAIFix = async (code: string, issue: AIIssue): Promise<string> => {
  // Actually replace the code with the fix
  if (code.includes(issue.codeSnippet)) {
    return code.replace(issue.codeSnippet, issue.suggestedFix);
  }
  return code;
};

export const bulkApplyFixes = async (code: string, issues: AIIssue[]): Promise<string> => {
  let fixedCode = code;
  issues.forEach(issue => {
    if (fixedCode.includes(issue.codeSnippet)) {
      fixedCode = fixedCode.replace(issue.codeSnippet, issue.suggestedFix);
    }
  });
  return fixedCode;
};

// Smart analysis based on code patterns
const getSmartComplexityAnalysis = (code: string): AIIssue[] => {
  const issues: AIIssue[] = [];
  
  // Detect nested loops - O(n²) complexity
  if (hasNestedLoops(code)) {
    issues.push({
      id: 'complexity-1',
      type: 'time-complexity',
      severity: 'high',
      message: 'Nested loops causing O(n²) time complexity',
      line: findLineNumber(code, 'for') || 1,
      fix: 'Use optimized algorithms or data structures',
      codeSnippet: extractNestedLoopSnippet(code),
      suggestedFix: `// Optimized: Use single loop with early exit or different approach
const seen = new Set();
for (let i = 0; i < array.length; i++) {
  if (seen.has(array[i])) continue;
  // Process unique element
  seen.add(array[i]);
}`,
      confidence: 92,
      timeComplexity: {
        current: 'O(n²)',
        improved: 'O(n log n)',
        improvement: '300% faster for n=1000',
        explanation: 'Nested loops process n² elements vs n log n for optimized algorithms'
      },
      spaceComplexity: {
        current: 'O(1)',
        improved: 'O(n)'
      },
      recommendations: {
        algorithm: 'Divide and Conquer / Two Pointer Technique',
        method: 'Sorting + Single Pass / Hash Map lookup',
        libraries: ['Lodash groupBy', 'Map data structure'],
        benefits: ['Faster execution', 'Better scalability', 'Efficient memory usage']
      },
      explanation: 'Nested loops are inefficient for large datasets. Consider using sorting combined with single pass, or hash maps for O(1) lookups.'
    });
  }

  // Detect inefficient array methods
  if (hasMultipleArrayIterations(code)) {
    issues.push({
      id: 'complexity-2',
      type: 'performance',
      severity: 'medium',
      message: 'Multiple array iterations increasing time complexity',
      line: findLineNumber(code, '.forEach') || 1,
      fix: 'Combine operations into single iteration',
      codeSnippet: extractArrayMethodSnippet(code),
      suggestedFix: `// Optimized: Single iteration with reduce
const result = array.reduce((acc, item) => {
  // Transform and filter in one pass
  if (item.condition) {
    acc.push(item.value);
  }
  return acc;
}, []);`,
      confidence: 88,
      timeComplexity: {
        current: 'O(2n) → O(n) but 2x slower',
        improved: 'O(n) single iteration',
        improvement: '50% faster',
        explanation: 'Multiple iterations process same data multiple times'
      },
      spaceComplexity: {
        current: 'O(n)',
        improved: 'O(n)'
      },
      recommendations: {
        algorithm: 'Single Pass Aggregation',
        method: 'Array.reduce() or for-loop with accumulation',
        libraries: ['Lodash transform', 'Native Array methods'],
        benefits: ['Reduced overhead', 'Better cache performance', 'Cleaner code']
      },
      explanation: 'Multiple array iterations create unnecessary overhead. Single iteration with accumulation is more efficient.'
    });
  }

  // Detect O(n²) array searches
  if (hasQuadraticSearches(code)) {
    issues.push({
      id: 'complexity-3',
      type: 'algorithm',
      severity: 'high',
      message: 'Inefficient O(n²) array searching algorithm',
      line: findLineNumber(code, '.includes') || findLineNumber(code, 'indexOf') || 1,
      fix: 'Use Set or Map for O(1) lookups',
      codeSnippet: extractSearchSnippet(code),
      suggestedFix: `// Optimized: Use Set for O(1) lookups
const lookupSet = new Set(array);
for (const item of data) {
  if (lookupSet.has(item.value)) {
    // Fast membership check
  }
}`,
      confidence: 95,
      timeComplexity: {
        current: 'O(n²)',
        improved: 'O(n)',
        improvement: '1000% faster for n=1000',
        explanation: 'Nested searching vs hash-based constant time lookups'
      },
      spaceComplexity: {
        current: 'O(1)',
        improved: 'O(n)'
      },
      recommendations: {
        algorithm: 'Hash-based Lookup',
        method: 'Set for membership, Map for key-value pairs',
        libraries: ['JavaScript Set', 'JavaScript Map', 'Lodash keyBy'],
        benefits: ['Constant time lookups', 'Faster execution', 'Better scalability']
      },
      explanation: 'Array.includes() inside loops creates O(n²) complexity. Sets provide O(1) membership testing.'
    });
  }

  // Detect recursive functions without memoization
  if (hasInefficientRecursion(code)) {
    issues.push({
      id: 'complexity-4',
      type: 'algorithm',
      severity: 'medium',
      message: 'Recursive function without memoization causing exponential time',
      line: findLineNumber(code, 'function') || 1,
      fix: 'Add memoization or use iterative approach',
      codeSnippet: extractRecursiveSnippet(code),
      suggestedFix: `// Optimized: Memoized recursion
function fibonacci(n, memo = {}) {
  if (n in memo) return memo[n];
  if (n <= 2) return 1;
  memo[n] = fibonacci(n - 1, memo) + fibonacci(n - 2, memo);
  return memo[n];
}`,
      confidence: 90,
      timeComplexity: {
        current: 'O(2^n) exponential',
        improved: 'O(n) linear with memoization',
        improvement: '99% faster for n=40',
        explanation: 'Exponential recursion vs linear with caching'
      },
      spaceComplexity: {
        current: 'O(n)',
        improved: 'O(n)'
      },
      recommendations: {
        algorithm: 'Dynamic Programming / Memoization',
        method: 'Cache results or use bottom-up iteration',
        libraries: ['Custom memoizer', 'Lodash memoize'],
        benefits: ['Dramatic speed improvement', 'Avoid stack overflow', 'Reusable solutions']
      },
      explanation: 'Recursive functions without memoization recalculate the same values repeatedly. Caching results reduces complexity from exponential to linear.'
    });
  }

  // Detect string concatenation in loops
  if (hasInefficientStringConcatenation(code)) {
    issues.push({
      id: 'complexity-5',
      type: 'performance',
      severity: 'medium',
      message: 'String concatenation in loop causing O(n²) time complexity',
      line: findLineNumber(code, '+=') || 1,
      fix: 'Use array join or template literals',
      codeSnippet: extractStringConcatSnippet(code),
      suggestedFix: `// Optimized: Array join for string building
const parts = [];
for (let i = 0; i < items.length; i++) {
  parts.push(items[i]);
}
const result = parts.join('');`,
      confidence: 85,
      timeComplexity: {
        current: 'O(n²)',
        improved: 'O(n)',
        improvement: '200% faster for large strings',
        explanation: 'String immutability causes repeated copying'
      },
      spaceComplexity: {
        current: 'O(n²)',
        improved: 'O(n)'
      },
      recommendations: {
        algorithm: 'Array Joining',
        method: 'Array.push() + Array.join() or String.concat()',
        libraries: ['Array methods', 'StringBuilder pattern'],
        benefits: ['Linear time complexity', 'Less memory allocation', 'Better performance']
      },
      explanation: 'String concatenation in loops creates new strings each time, causing O(n²) time and space complexity. Array joining is O(n).'
    });
  }

  // Add default optimization suggestion
  if (issues.length === 0 && code.length > 50) {
    issues.push({
      id: 'optimization-1',
      type: 'performance',
      severity: 'low',
      message: 'Code structure is good. Consider micro-optimizations',
      line: 1,
      fix: 'Review algorithm choices and data structures',
      codeSnippet: '// Your code shows good practices',
      suggestedFix: '// Consider profiling for specific bottlenecks',
      confidence: 75,
      timeComplexity: {
        current: 'O(n) - Good',
        improved: 'O(n) - Optimized',
        improvement: '10-20% with micro-optimizations',
        explanation: 'Current complexity is efficient'
      },
      recommendations: {
        algorithm: 'Continue current approach',
        method: 'Profile and optimize hotspots',
        libraries: ['Chrome DevTools', 'Node.js profiler'],
        benefits: ['Maintainable code', 'Good performance', 'Clean architecture']
      },
      explanation: 'Your code follows good practices. Use profiling tools to identify specific areas for improvement.'
    });
  }

  return issues;
};

// Helper functions for pattern detection
const hasNestedLoops = (code: string): boolean => {
  return /for\s*\([^)]*\)\s*\{[^}]*for\s*\([^)]*\)/.test(code) || 
         /while\s*\([^)]*\)\s*\{[^}]*(for|while)\s*\([^)]*\)/.test(code);
};

const hasMultipleArrayIterations = (code: string): boolean => {
  const arrayMethods = code.match(/(\.forEach|\.map|\.filter|\.reduce)/g);
  return arrayMethods ? arrayMethods.length > 2 : false;
};

const hasQuadraticSearches = (code: string): boolean => {
  return /\.includes\(.*\)/.test(code) && code.includes('for') ||
         /\.indexOf\(.*\)/.test(code) && code.includes('for');
};

const hasInefficientRecursion = (code: string): boolean => {
  return /function\s+\w+\([^)]*\)\s*\{[^}]*\w+\([^)]*\)/.test(code) && 
         !code.includes('memo') && !code.includes('cache');
};

const hasInefficientStringConcatenation = (code: string): boolean => {
  return /(\+\=|\=\s*\w+\s*\+).*for.*\(/.test(code) || 
         /(\+\=|\=\s*\w+\s*\+).*while.*\(/.test(code);
};

// Helper functions for code extraction
const findLineNumber = (code: string, ...patterns: string[]): number => {
  const lines = code.split('\n');
  for (const pattern of patterns) {
    const lineIndex = lines.findIndex(line => line.includes(pattern));
    if (lineIndex >= 0) return lineIndex + 1;
  }
  return 1;
};

const extractNestedLoopSnippet = (code: string): string => {
  const lines = code.split('\n');
  const loopLine = lines.find(line => line.includes('for') && line.includes('{'));
  return loopLine ? loopLine.trim() : 'for (let i = 0; i < n; i++) { for (let j = 0; j < n; j++) { ... } }';
};

const extractArrayMethodSnippet = (code: string): string => {
  const lines = code.split('\n');
  const methodLine = lines.find(line => /\.(forEach|map|filter|reduce)/.test(line));
  return methodLine ? methodLine.trim() : 'array.forEach(...); array.map(...);';
};

const extractSearchSnippet = (code: string): string => {
  const lines = code.split('\n');
  const searchLine = lines.find(line => line.includes('.includes') || line.includes('.indexOf'));
  return searchLine ? searchLine.trim() : 'if (array.includes(value)) { ... }';
};

const extractRecursiveSnippet = (code: string): string => {
  const lines = code.split('\n');
  const functionLine = lines.find(line => line.includes('function') && line.includes('('));
  return functionLine ? functionLine.trim() : 'function recursive(n) { return recursive(n-1) + recursive(n-2); }';
};

const extractStringConcatSnippet = (code: string): string => {
  const lines = code.split('\n');
  const concatLine = lines.find(line => line.includes('+=') || (line.includes('+') && line.includes('for')));
  return concatLine ? concatLine.trim() : 'str += "text";';
};