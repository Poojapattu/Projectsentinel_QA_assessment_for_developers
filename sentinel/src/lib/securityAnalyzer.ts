export interface SecurityIssue {
  type: 'sql-injection' | 'xss' | 'code-injection' | 'data-leak';
  severity: 'critical' | 'high' | 'medium';
  line: number;
  description: string;
  fix: string;
  cweId: string;
}

export const scanSecurityIssues = (code: string): SecurityIssue[] => {
  const issues: SecurityIssue[] = [];
  
  // SQL Injection detection
  if ((code.includes('SELECT') || code.includes('INSERT') || code.includes('UPDATE')) && 
      code.includes('+') && code.match(/\+\s*\w+/)) {
    issues.push({
      type: 'sql-injection',
      severity: 'critical',
      line: findLineNumber(code, 'SELECT', 'INSERT', 'UPDATE'),
      description: 'Potential SQL injection vulnerability - user input concatenated directly into SQL query',
      fix: 'Use parameterized queries or prepared statements',
      cweId: 'CWE-89'
    });
  }
  
  // XSS detection
  if (code.includes('innerHTML') || code.includes('document.write')) {
    issues.push({
      type: 'xss',
      severity: 'high',
      line: findLineNumber(code, 'innerHTML', 'document.write'),
      description: 'Potential Cross-Site Scripting (XSS) vulnerability',
      fix: 'Use textContent or proper input sanitization',
      cweId: 'CWE-79'
    });
  }
  
  // Code injection detection
  if (code.includes('eval(') || code.includes('Function(') || code.includes('setTimeout(') && code.includes('"')) {
    issues.push({
      type: 'code-injection',
      severity: 'critical',
      line: findLineNumber(code, 'eval', 'Function', 'setTimeout'),
      description: 'Potential code injection vulnerability',
      fix: 'Avoid eval() and dynamic code execution with user input',
      cweId: 'CWE-94'
    });
  }
  
  // Data leak detection
  if (code.includes('console.log') && (code.includes('password') || code.includes('secret') || code.includes('token'))) {
    issues.push({
      type: 'data-leak',
      severity: 'medium',
      line: findLineNumber(code, 'console.log'),
      description: 'Potential sensitive data exposure in console logs',
      fix: 'Remove debug statements containing sensitive information',
      cweId: 'CWE-532'
    });
  }
  
  return issues;
};

const findLineNumber = (code: string, ...patterns: string[]): number => {
  const lines = code.split('\n');
  for (const pattern of patterns) {
    const lineIndex = lines.findIndex(line => line.includes(pattern));
    if (lineIndex >= 0) return lineIndex + 1;
  }
  return 1;
};