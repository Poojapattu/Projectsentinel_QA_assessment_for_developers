export interface MemoryProfile {
  heapUsage: number;
  stackDepth: number;
  garbageCollection: number;
  memoryLeaks: string[];
}

export const analyzeMemoryUsage = (code: string): MemoryProfile => {
  const issues: string[] = [];
  
  // Detect potential memory leaks
  if (code.includes('addEventListener') && !code.includes('removeEventListener')) {
    issues.push('Potential event listener memory leak');
  }
  
  if (code.includes('setInterval') && !code.includes('clearInterval')) {
    issues.push('Potential interval memory leak');
  }
  
  if (code.includes('setTimeout') && code.includes('function') && !code.includes('clearTimeout')) {
    issues.push('Potential timeout memory leak');
  }
  
  // Detect large data structures
  if (code.includes('new Array(') || code.includes('Array(')) {
    const arraySizeMatch = code.match(/Array\((\d+)\)/);
    if (arraySizeMatch && parseInt(arraySizeMatch[1]) > 10000) {
      issues.push('Large array allocation detected');
    }
  }
  
  // Detect potential closure issues
  if (code.includes('function') && code.includes('return function')) {
    issues.push('Potential closure memory retention');
  }
  
  return {
    heapUsage: estimateHeapUsage(code),
    stackDepth: estimateStackDepth(code),
    garbageCollection: estimateGCCycles(code),
    memoryLeaks: issues
  };
};

const estimateHeapUsage = (code: string): number => {
  let usage = 0;
  
  // Estimate based on data structures
  if (code.includes('Array')) usage += 50;
  if (code.includes('Object')) usage += 30;
  if (code.includes('Map') || code.includes('Set')) usage += 40;
  if (code.includes('string') || code.includes('String')) usage += 20;
  
  // Scale with loops and data size hints
  const loops = (code.match(/for|while/g) || []).length;
  usage += loops * 10;
  
  return Math.max(10, usage);
};

const estimateStackDepth = (code: string): number => {
  let depth = 1;
  
  // Count function calls and recursion
  const functions = (code.match(/function\s+\w+|=>/g) || []).length;
  depth += functions;
  
  // Add for recursive patterns
  if (code.includes('function') && code.match(/\w+\(.*\)/g)) {
    depth += 2;
  }
  
  return Math.max(1, depth);
};

const estimateGCCycles = (code: string): number => {
  let cycles = 1;
  
  // More GC cycles for memory-intensive operations
  if (code.includes('new Array') || code.includes('JSON.parse')) cycles += 2;
  if (code.includes('.map') || code.includes('.filter')) cycles += 1;
  if (hasNestedLoops(code)) cycles += 3;
  
  return Math.max(1, cycles);
};

const hasNestedLoops = (code: string): boolean => {
  return /for\s*\([^)]*\)\s*\{[^}]*for\s*\([^)]*\)/.test(code);
};