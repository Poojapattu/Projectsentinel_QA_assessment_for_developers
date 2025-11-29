import { useState } from 'react';
import { Calendar, Users, Clock, Target, BarChart3, Zap } from 'lucide-react';

interface SprintMetrics {
  velocity: number;
  storyPointsCompleted: number;
  cycleTime: number;
  codeQuality: number;
  teamHappiness: number;
}

interface AgileStory {
  id: string;
  title: string;
  status: 'todo' | 'in-progress' | 'review' | 'done';
  storyPoints: number;
  complexity: string;
  optimizations: string[];
  aiRecommendations: string[];
}

export default function AgileIntegration() {
  const [sprintMetrics, setSprintMetrics] = useState<SprintMetrics>({
    velocity: 42,
    storyPointsCompleted: 38,
    cycleTime: 3.2,
    codeQuality: 88,
    teamHappiness: 4.2
  });

  const [stories] = useState<AgileStory[]>([
    {
      id: 'SENTINEL-123',
      title: 'Implement real-time complexity analysis',
      status: 'done',
      storyPoints: 8,
      complexity: 'O(n²) → O(n log n)',
      optimizations: ['Reduced nested loops', 'Added caching'],
      aiRecommendations: ['Use Map for O(1) lookups', 'Implement memoization']
    },
    {
      id: 'SENTINEL-124', 
      title: 'Add security vulnerability scanning',
      status: 'in-progress',
      storyPoints: 13,
      complexity: 'O(n) → O(1)',
      optimizations: ['Fixed SQL injection risks'],
      aiRecommendations: ['Parameterize all queries', 'Add input validation']
    },
    {
      id: 'SENTINEL-125',
      title: 'Optimize database queries',
      status: 'todo',
      storyPoints: 5,
      complexity: 'O(n) → O(log n)',
      optimizations: [],
      aiRecommendations: ['Add database indexes', 'Use query caching']
    }
  ]);

  const generateBurndownData = () => {
    return Array.from({ length: 10 }, (_, i) => ({
      day: i + 1,
      ideal: 50 - (i * 5),
      actual: 50 - (i * (4.2 + Math.random() * 1.5))
    }));
  };

  const burndownData = generateBurndownData();

  return (
    <div className="space-y-6">
      {/* Sprint Overview */}
      <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Target className="w-5 h-5" />
          Sprint Dashboard - Agile Integration
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white/5 rounded-lg p-4 text-center">
            <Users className="w-6 h-6 mx-auto mb-2 text-blue-400" />
            <div className="text-2xl font-bold text-white">{sprintMetrics.velocity}</div>
            <div className="text-xs text-white/70">Team Velocity</div>
          </div>
          <div className="bg-white/5 rounded-lg p-4 text-center">
            <Zap className="w-6 h-6 mx-auto mb-2 text-green-400" />
            <div className="text-2xl font-bold text-white">{sprintMetrics.storyPointsCompleted}</div>
            <div className="text-xs text-white/70">Points Done</div>
          </div>
          <div className="bg-white/5 rounded-lg p-4 text-center">
            <Clock className="w-6 h-6 mx-auto mb-2 text-yellow-400" />
            <div className="text-2xl font-bold text-white">{sprintMetrics.cycleTime}d</div>
            <div className="text-xs text-white/70">Cycle Time</div>
          </div>
          <div className="bg-white/5 rounded-lg p-4 text-center">
            <BarChart3 className="w-6 h-6 mx-auto mb-2 text-purple-400" />
            <div className="text-2xl font-bold text-white">{sprintMetrics.codeQuality}%</div>
            <div className="text-xs text-white/70">Code Quality</div>
          </div>
          <div className="bg-white/5 rounded-lg p-4 text-center">
            <div className="w-6 h-6 mx-auto mb-2 text-pink-400">😊</div>
            <div className="text-2xl font-bold text-white">{sprintMetrics.teamHappiness}/5</div>
            <div className="text-xs text-white/70">Happiness</div>
          </div>
        </div>

        {/* Burndown Chart */}
        <div className="bg-white/5 rounded-lg p-4">
          <h4 className="text-white font-semibold mb-4">Sprint Burndown</h4>
          <div className="h-32 flex items-end gap-1">
            {burndownData.map((day, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div className="text-xs text-white/70 mb-1">Day {index + 1}</div>
                <div className="flex gap-1 items-end">
                  <div 
                    className="w-3 bg-blue-500 rounded-t transition-all duration-500"
                    style={{ height: `${(day.ideal / 50) * 100}px` }}
                    title={`Ideal: ${day.ideal}`}
                  ></div>
                  <div 
                    className="w-3 bg-green-500 rounded-t transition-all duration-500"
                    style={{ height: `${(day.actual / 50) * 100}px` }} 
                    title={`Actual: ${day.actual}`}
                  ></div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-4 justify-center mt-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span className="text-xs text-white/70">Ideal</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span className="text-xs text-white/70">Actual</span>
            </div>
          </div>
        </div>
      </div>

      {/* User Stories with AI Optimization */}
      <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6">
        <h3 className="text-lg font-bold text-white mb-4">AI-Optimized User Stories</h3>
        
        <div className="space-y-4">
          {stories.map((story) => (
            <div key={story.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="text-white font-semibold">{story.id}: {story.title}</h4>
                  <div className="flex gap-4 mt-2">
                    <span className={`px-2 py-1 rounded text-xs ${
                      story.status === 'done' ? 'bg-green-500/20 text-green-400' :
                      story.status === 'in-progress' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-blue-500/20 text-blue-400'
                    }`}>
                      {story.status.replace('-', ' ').toUpperCase()}
                    </span>
                    <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs">
                      {story.storyPoints} points
                    </span>
                    <span className="px-2 py-1 bg-orange-500/20 text-orange-400 rounded text-xs">
                      {story.complexity}
                    </span>
                  </div>
                </div>
              </div>

              {/* AI Optimization Impact */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <h5 className="text-white font-medium mb-2 text-sm">🚀 AI Optimizations Applied</h5>
                  <ul className="text-white/70 text-sm space-y-1">
                    {story.optimizations.map((opt, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <div className="w-1 h-1 bg-green-400 rounded-full"></div>
                        {opt}
                      </li>
                    ))}
                    {story.optimizations.length === 0 && (
                      <li className="text-white/50 text-sm">No optimizations applied yet</li>
                    )}
                  </ul>
                </div>
                <div>
                  <h5 className="text-white font-medium mb-2 text-sm">💡 AI Recommendations</h5>
                  <ul className="text-white/70 text-sm space-y-1">
                    {story.aiRecommendations.map((rec, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Time Savings Calculation */}
              <div className="mt-4 p-3 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-lg border border-green-500/20">
                <div className="flex justify-between items-center">
                  <span className="text-white text-sm">Estimated Time Saved:</span>
                  <span className="text-green-400 font-bold">
                    {story.status === 'done' ? '4.5 hours' : 
                     story.status === 'in-progress' ? '2.1 hours' : 'Pending'}
                  </span>
                </div>
                <div className="text-xs text-white/60 mt-1">
                  {story.status === 'done' ? 'AI optimizations reduced implementation time by 68%' :
                   story.status === 'in-progress' ? 'AI assistance currently saving time' :
                   'AI ready to optimize when started'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Agile Metrics Improvement */}
      <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6">
        <h3 className="text-lg font-bold text-white mb-4">Agile Metrics Improvement</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="text-white font-semibold">Before Sentinel</h4>
            <div className="space-y-2">
              <MetricComparison 
                label="Code Review Time"
                before="4.2 hours"
                after="1.1 hours" 
                improvement="74%"
                direction="down"
              />
              <MetricComparison
                label="Bug Discovery Time" 
                before="Sprint 5"
                after="Sprint 2"
                improvement="60%"
                direction="down"
              />
              <MetricComparison
                label="Velocity Stability"
                before="±35%"
                after="±12%"
                improvement="66%"
                direction="up"
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-white font-semibold">Team Impact</h4>
            <div className="bg-white/5 rounded-lg p-4">
              <div className="text-center mb-4">
                <div className="text-3xl font-bold text-green-400">62%</div>
                <div className="text-white/70 text-sm">Reduction in Context Switching</div>
              </div>
              <div className="space-y-2 text-sm text-white/70">
                <div className="flex justify-between">
                  <span>Focus Time Increased:</span>
                  <span className="text-green-400">+3.1 hours/day</span>
                </div>
                <div className="flex justify-between">
                  <span>Meeting Time Reduced:</span>
                  <span className="text-green-400">-45 minutes/day</span>
                </div>
                <div className="flex justify-between">
                  <span>PR Cycle Time:</span>
                  <span className="text-green-400">-2.8 days</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper component for metric comparisons
function MetricComparison({ label, before, after, improvement, direction }: {
  label: string;
  before: string;
  after: string;
  improvement: string;
  direction: 'up' | 'down';
}) {
  return (
    <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
      <span className="text-white text-sm">{label}</span>
      <div className="flex items-center gap-3">
        <span className="text-white/50 text-sm line-through">{before}</span>
        <span className="text-green-400 text-sm font-semibold">{after}</span>
        <span className={`px-2 py-1 rounded text-xs ${
          direction === 'up' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'
        }`}>
          {improvement} {direction === 'up' ? '↑' : '↓'}
        </span>
      </div>
    </div>
  );
}