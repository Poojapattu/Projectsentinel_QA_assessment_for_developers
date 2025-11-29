export interface CoverageReport {
  lineCoverage: number;
  branchCoverage: number;
  functionCoverage: number;
  uncoveredLines: number[];
  missingBranches: string[];
}

export const analyzeTestCoverage = (code: string, testCases: any[]): CoverageReport => {
  const lines = code.split('\n').length;
  
  // Simple coverage calculation based on test cases
  const baseCoverage = Math.min(80, testCases.length * 15);
  const lineCoverage = Math.min(100, baseCoverage + (code.includes('function') ? 10 : 0));
  
  return {
    lineCoverage,
    branchCoverage: Math.min(100, lineCoverage - 10),
    functionCoverage: Math.min(100, lineCoverage + 5),
    uncoveredLines: Array.from({ length: Math.max(0, lines - Math.floor(lines * lineCoverage / 100)) }, (_, i) => i + 1),
    missingBranches: ['edge-case handling', 'null input validation']
  };
};