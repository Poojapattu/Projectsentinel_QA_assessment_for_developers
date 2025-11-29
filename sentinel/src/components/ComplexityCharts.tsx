// components/ComplexityCharts.tsx
import React from 'react';
import { PerformanceResult } from '../lib/performanceTest';

interface ComplexityChartsProps {
  performanceResults?: PerformanceResult[] | null;
  timeComplexity?: {
    current: string;
    suggested: string;
    improvement: string;
  } | null;
  spaceComplexity?: {
    current: string;
    suggested: string;
    improvement: string;
  } | null;
}

const ComplexityCharts: React.FC<ComplexityChartsProps> = ({
  performanceResults = [],
  timeComplexity = null,
  spaceComplexity = null,
}) => {
  // Safe mapping with defaults
  const performanceData = (performanceResults || []).map((result) => ({
    name: result?.testName ?? 'Unknown Test',
    executionTime: result?.executionTime ?? 0,
    memoryUsage: result?.memoryUsage ?? 0,
    improvement:
      result?.beforeTime != null &&
      result?.afterTime != null &&
      result.beforeTime > 0
        ? ((result.beforeTime - result.afterTime) / result.beforeTime) * 100
        : 0,
    status: result?.status ?? 'passed',
    complexity: result?.complexity ?? 'O(n)',
    beforeTime: result?.beforeTime ?? null,
    afterTime: result?.afterTime ?? null,
  }));

  // Render fallback if no data
  if (!performanceData.length) {
    return (
      <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6">
        <h3 className="text-lg font-bold text-white mb-4">Performance Charts</h3>
        <div className="text-center text-white/50 py-8">
          <p>No performance data available</p>
          <p className="text-sm">Run performance tests to see charts</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6">
      <h3 className="text-lg font-bold text-white mb-6">
        📊 Performance & Complexity Analysis
      </h3>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Execution Time */}
        <div className="bg-black/20 rounded-lg p-4">
          <h4 className="text-white font-semibold mb-4">Execution Time (ms)</h4>
          <div className="space-y-3">
            {performanceData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <span className="text-white text-sm">{item.name}</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-gray-600 rounded-full h-3">
                    <div
                      className="bg-blue-500 h-3 rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(
                          100,
                          ((item.executionTime ?? 0) / 500) * 100
                        )}%`,
                      }}
                    />
                  </div>
                  <span className="text-white text-sm w-12 text-right">
                    {item.executionTime ?? 0}ms
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Memory Usage */}
        <div className="bg-black/20 rounded-lg p-4">
          <h4 className="text-white font-semibold mb-4">Memory Usage (MB)</h4>
          <div className="space-y-3">
            {performanceData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <span className="text-white text-sm">{item.name}</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-gray-600 rounded-full h-3">
                    <div
                      className="bg-green-500 h-3 rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(
                          100,
                          ((item.memoryUsage ?? 0) / 200) * 100
                        )}%`,
                      }}
                    />
                  </div>
                  <span className="text-white text-sm w-12 text-right">
                    {item.memoryUsage ?? 0}MB
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Complexity Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Time Complexity */}
        <div className="bg-black/20 rounded-lg p-4">
          <h4 className="text-white font-semibold mb-4">Time Complexity</h4>
          {timeComplexity ? (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-white/70">Current:</span>
                <span className="text-red-400 font-mono">
                  {timeComplexity.current}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/70">Suggested:</span>
                <span className="text-green-400 font-mono">
                  {timeComplexity.suggested}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/70">Improvement:</span>
                <span className="text-blue-400">
                  {timeComplexity.improvement}
                </span>
              </div>
            </div>
          ) : (
            <div className="text-center text-white/50 py-4">
              No complexity data available
            </div>
          )}
        </div>

        {/* Space Complexity */}
        <div className="bg-black/20 rounded-lg p-4">
          <h4 className="text-white font-semibold mb-4">Space Complexity</h4>
          {spaceComplexity ? (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-white/70">Current:</span>
                <span className="text-red-400 font-mono">
                  {spaceComplexity.suggested}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/70">Suggested:</span>
                <span className="text-green-400 font-mono">
                  {spaceComplexity.suggested}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/70">Improvement:</span>
                <span className="text-blue-400">{spaceComplexity.improvement}</span>
              </div>
            </div>
          ) : (
            <div className="text-center text-white/50 py-4">
              No complexity data available
            </div>
          )}
        </div>
      </div>

      {/* Before/After Comparison */}
      {performanceData.some((r) => r.beforeTime != null && r.afterTime != null) && (
        <div className="mt-6 bg-black/20 rounded-lg p-4">
          <h4 className="text-white font-semibold mb-4">Optimization Impact</h4>
          <div className="space-y-4">
            {performanceData
              .filter((r) => r.beforeTime != null && r.afterTime != null)
              .map((r, idx) => {
                const beforeTime = r.beforeTime ?? 0;
                const afterTime = r.afterTime ?? 0;
                const improvement =
                  beforeTime > 0 ? ((beforeTime - afterTime) / beforeTime) * 100 : 0;

                return (
                  <div key={idx} className="flex items-center justify-between">
                    <span className="text-white text-sm flex-1">{r.name}</span>
                    <div className="flex items-center gap-4 flex-1">
                      <span className="text-red-400 text-sm line-through">{beforeTime}ms</span>
                      <span className="text-white">→</span>
                      <span className="text-green-400 text-sm">{afterTime}ms</span>
                      <span className="text-blue-400 text-sm w-16 text-right">
                        {improvement > 0 ? `-${Math.round(improvement)}%` : 'No change'}
                      </span>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ComplexityCharts;
