import { useState } from 'react';
import { Play, StopCircle, CheckCircle, XCircle, Clock } from 'lucide-react';
import { TestCase } from '../lib/testGenerator';

interface TestResult {
  testCaseId: string;
  passed: boolean;
  executionTime: number;
  error?: string;
}

interface TestRunnerProps {
  code: string;
  testCases: TestCase[];
}

export default function TestRunner({ code, testCases }: TestRunnerProps) {
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<TestResult[]>([]);
  
  const runTests = async () => {
    setRunning(true);
    const testResults: TestResult[] = [];
    
    for (const testCase of testCases) {
      const startTime = performance.now();
      try {
        // Simulate test execution
        await new Promise(resolve => setTimeout(resolve, 100));
        const passed = Math.random() > 0.3; // Simulate 70% pass rate
        
        testResults.push({
          testCaseId: testCase.id,
          passed,
          executionTime: performance.now() - startTime
        });
      } catch (error) {
        testResults.push({
          testCaseId: testCase.id,
          passed: false,
          executionTime: performance.now() - startTime,
          error: error instanceof Error ? error.message : 'Test failed'
        });
      }
    }
    
    setResults(testResults);
    setRunning(false);
  };
  
  const calculateCoverage = (results: TestResult[]): number => {
    const passed = results.filter(r => r.passed).length;
    return Math.round((passed / results.length) * 100);
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Play className="w-5 h-5 text-green-400" />
          Test Runner
        </h3>
        <button
          onClick={runTests}
          disabled={running}
          className="flex items-center gap-2 px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-300 rounded border border-green-500/30 disabled:opacity-50"
        >
          {running ? <Clock className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
          {running ? 'Running Tests...' : `Run ${testCases.length} Tests`}
        </button>
      </div>
      
      <div className="space-y-3">
        {testCases.map((testCase, index) => (
          <div key={testCase.id} className="flex items-center justify-between p-3 bg-black/20 rounded">
            <div className="flex items-center gap-3">
              {results[index] ? (
                results[index].passed ? (
                  <CheckCircle className="w-5 h-5 text-green-400" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-400" />
                )
              ) : (
                <div className="w-5 h-5 border-2 border-gray-400 rounded"></div>
              )}
              <div>
                <div className="text-white font-medium">{testCase.description}</div>
                <div className="text-gray-400 text-sm">
                  {testCase.category} • {testCase.complexity}
                </div>
              </div>
            </div>
            {results[index] && (
              <div className="text-sm">
                <span className={results[index].passed ? 'text-green-400' : 'text-red-400'}>
                  {results[index].executionTime.toFixed(1)}ms
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {results.length > 0 && (
        <div className="mt-4 p-3 bg-blue-500/10 rounded border border-blue-500/20">
          <div className="flex justify-between text-sm">
            <span className="text-blue-300">
              Passed: {results.filter(r => r.passed).length}/{results.length}
            </span>
            <span className="text-blue-300">
              Coverage: {calculateCoverage(results)}%
            </span>
          </div>
        </div>
      )}
    </div>
  );
}