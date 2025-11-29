export type Language = 'javascript' | 'typescript' | 'python' | 'java' | 'cpp';

export interface LanguageConfig {
  name: string;
  extension: string;
  icon: string;
  complexityKeywords: string[];
  performancePatterns: RegExp[];
}

export const SUPPORTED_LANGUAGES: Record<Language, LanguageConfig> = {
  javascript: {
    name: 'JavaScript',
    extension: 'js',
    icon: '🟨',
    complexityKeywords: ['forEach', 'map', 'filter', 'reduce', 'includes', 'indexOf'],
    performancePatterns: [
      /\.forEach.*\.forEach/, // Nested forEach
      /for\s*\([^)]*\)\s*\{[^}]*for\s*\([^)]*\)/, // Nested for loops
      /\.includes.*for/ // Includes in loop
    ]
  },
  typescript: {
    name: 'TypeScript',
    extension: 'ts',
    icon: '🔷',
    complexityKeywords: ['forEach', 'map', 'filter', 'reduce', 'includes', 'indexOf'],
    performancePatterns: [
      /\.forEach.*\.forEach/,
      /for\s*\([^)]*\)\s*\{[^}]*for\s*\([^)]*\)/,
      /\.includes.*for/
    ]
  },
  python: {
    name: 'Python',
    extension: 'py',
    icon: '🐍',
    complexityKeywords: ['for', 'in', 'range', 'len', 'append', 'list comprehension'],
    performancePatterns: [
      /for\s+\w+\s+in[^:]+:\s*for\s+\w+\s+in/, // Nested for loops
      /\.append.*for/, // Append in loop
      /in\s+list.*for/ // List membership in loop
    ]
  },
  java: {
    name: 'Java',
    extension: 'java',
    icon: '☕',
    complexityKeywords: ['for', 'forEach', 'stream', 'contains', 'indexOf'],
    performancePatterns: [
      /for\s*\([^)]*\)\s*\{[^}]*for\s*\([^)]*\)/, // Nested for loops
      /\.stream\(\)\.forEach/, // Stream forEach
      /\.contains.*for/ // Contains in loop
    ]
  },
  cpp: {
    name: 'C++',
    extension: 'cpp',
    icon: '⚡',
    complexityKeywords: ['for', 'while', 'vector', 'push_back', 'find'],
    performancePatterns: [
      /for\s*\([^)]*\)\s*\{[^}]*for\s*\([^)]*\)/, // Nested for loops
      /\.push_back.*for/, // Push back in loop
      /std::find.*for/ // Find in loop
    ]
  }
};

export const detectLanguage = (code: string): Language => {
  if (code.includes('def ') || code.includes('import ') || code.includes('print(')) {
    return 'python';
  }
  if (code.includes('public class') || code.includes('import java.') || code.includes('System.out.')) {
    return 'java';
  }
  if (code.includes('#include') || code.includes('std::') || code.includes('cout <<')) {
    return 'cpp';
  }
  if (code.includes(':') && code.includes('type') && code.includes('interface')) {
    return 'typescript';
  }
  return 'javascript';
};

export const getLanguageAnalysis = (code: string, language: Language): string[] => {
  const config = SUPPORTED_LANGUAGES[language];
  const issues: string[] = [];
  
  config.performancePatterns.forEach((pattern, index) => {
    if (pattern.test(code)) {
      issues.push(`Detected ${config.name} performance pattern: ${pattern.toString()}`);
    }
  });
  
  return issues;
};

export const getLanguageIcon = (language: Language): string => {
  return SUPPORTED_LANGUAGES[language].icon;
};

export const getLanguageName = (language: Language): string => {
  return SUPPORTED_LANGUAGES[language].name;
};