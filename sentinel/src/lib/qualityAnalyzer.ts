export interface QualityMetrics {
  maintainabilityIndex: number;
  cyclomaticComplexity: number;
  halsteadVolume: number;
  cognitiveComplexity: number;
  technicalDebt: string;
  codeSmells: string[];
}

export const calculateQualityMetrics = (code: string): QualityMetrics => {
  const lines = code.split('\n');
  
  return {
    maintainabilityIndex: calculateMaintainability(code),
    cyclomaticComplexity: calculateCyclomaticComplexity(code),
    halsteadVolume: calculateHalsteadMetrics(code),
    cognitiveComplexity: calculateCognitiveComplexity(code),
    technicalDebt: estimateTechnicalDebt(code),
    codeSmells: detectCodeSmells(code)
  };
};

// Implement the missing functions
const calculateMaintainability = (code: string): number => {
  const lines = code.split('\n').length;
  const complexity = calculateCyclomaticComplexity(code);
  
  // Simple maintainability calculation (0-100)
  let score = 100;
  
  // Penalize long files
  if (lines > 100) score -= 20;
  else if (lines > 50) score -= 10;
  
  // Penalize high complexity
  if (complexity > 10) score -= 30;
  else if (complexity > 5) score -= 15;
  
  // Penalize code smells
  const smells = detectCodeSmells(code);
  score -= smells.length * 5;
  
  return Math.max(0, Math.min(100, score));
};

const calculateCyclomaticComplexity = (code: string): number => {
  let complexity = 1; // Base complexity
  
  // Count decision points
  complexity += (code.match(/if\s*\(/g) || []).length;
  complexity += (code.match(/for\s*\(/g) || []).length;
  complexity += (code.match(/while\s*\(/g) || []).length;
  complexity += (code.match(/case\s+/g) || []).length;
  complexity += (code.match(/\?\s*:/g) || []).length;
  complexity += (code.match(/&&|\|\|/g) || []).length;
  
  return complexity;
};

const calculateHalsteadMetrics = (code: string): number => {
  // Simplified Halstead Volume calculation
  const operators = (code.match(/[=+\-*/<>!&|^~%]=?|=>|\+\+|--|&&|\|\||[{}()[\];,:]/g) || []).length;
  const operands = (code.match(/\b[a-zA-Z_][a-zA-Z0-9_]*\b/g) || []).length;
  
  return operators + operands; // Simplified volume
};

const calculateCognitiveComplexity = (code: string): number => {
  let complexity = 0;
  
  // Nesting increases cognitive complexity
  let nesting = 0;
  const lines = code.split('\n');
  
  lines.forEach(line => {
    if (line.includes('{') || (line.includes('(') && /if|for|while/.test(line))) {
      nesting++;
      complexity += nesting;
    }
    if (line.includes('}') || line.includes(')')) {
      nesting = Math.max(0, nesting - 1);
    }
  });
  
  return complexity;
};

const estimateTechnicalDebt = (code: string): string => {
  const complexity = calculateCyclomaticComplexity(code);
  const smells = detectCodeSmells(code).length;
  
  const debtHours = complexity * 0.5 + smells * 2;
  
  if (debtHours < 4) return 'Low (1-4 hours)';
  if (debtHours < 8) return 'Medium (4-8 hours)';
  return 'High (8+ hours)';
};

const detectCodeSmells = (code: string): string[] => {
  const smells: string[] = [];
  
  // Detect long method
  if (code.split('\n').length > 50) {
    smells.push('Long Method');
  }
  
  // Detect complex conditionals
  if ((code.match(/&&|\|\|/g) || []).length > 3) {
    smells.push('Complex Conditional');
  }
  
  // Detect nested loops
  if (code.includes('for') && code.includes('{') && code.match(/for\s*\([^)]*\)\s*\{[^}]*for/g)) {
    smells.push('Nested Loops');
  }
  
  // Detect magic numbers
  if (code.match(/\b\d{3,}\b/g)) {
    smells.push('Magic Numbers');
  }
  
  // Detect duplicated code patterns
  if (code.match(/(\b\w+\b).*?\1/g)) {
    smells.push('Possible Code Duplication');
  }
  
  return smells;
};