import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, Plus, Sparkles, Brain, Zap, Cpu, BarChart3, Target } from 'lucide-react';
import ProjectList from './ProjectList';
import ProjectWizard from './ProjectWizard';
import AIRepairSystem from './AIRepairSystem';
import AlgorithmAnimations from './AlgorithmAnimations';
import AgileIntegration from './AgileIntegration';
import ComplexityCharts from './ComplexityCharts';

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const [showWizard, setShowWizard] = useState(false);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [showAIRepair, setShowAIRepair] = useState(false);
  const [activeView, setActiveView] = useState<'main' | 'analytics' | 'enterprise'>('main');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleProjectCreated = () => {
    setShowWizard(false);
    setRefreshTrigger(prev => prev + 1);
  };

  const handleProjectSelect = (projectId: string) => {
    setSelectedProject(projectId);
    setShowWizard(true);
  };

  if (showAIRepair) {
    return <AIRepairSystem onBack={() => setShowAIRepair(false)} />;
  }

  if (showWizard || selectedProject) {
    return (
      <ProjectWizard
        projectId={selectedProject}
        onClose={() => {
          setShowWizard(false);
          setSelectedProject(null);
          setRefreshTrigger(prev => prev + 1);
        }}
        onComplete={handleProjectCreated}
      />
    );
  }

  const renderMainView = () => (
    <>
      {/* Welcome Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Welcome to <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Project Sentinel</span>
        </h1>
        <p className="text-xl text-blue-200 max-w-2xl mx-auto">
          AI-powered code optimization, performance analysis, and automated testing in one platform
        </p>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6 hover:border-blue-500/30 transition-all duration-300">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-gradient-to-br from-green-400 to-blue-400 p-2 rounded-lg">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-bold text-white">AI Code Optimizer</h3>
          </div>
          <p className="text-blue-200 text-sm">
            Analyze and optimize your code with AI-powered complexity analysis, performance testing, and automated fixes.
          </p>
          <ul className="mt-3 space-y-1 text-sm text-white/70">
            <li>• Time & Space Complexity Analysis</li>
            <li>• Live Performance Testing</li>
            <li>• Multi-language Support</li>
            <li>• Algorithm Recommendations</li>
          </ul>
        </div>

        <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6 hover:border-purple-500/30 transition-all duration-300">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-gradient-to-br from-purple-400 to-pink-400 p-2 rounded-lg">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-bold text-white">Advanced Analytics</h3>
          </div>
          <p className="text-blue-200 text-sm">
            Interactive algorithm animations and comprehensive performance analytics with visual complexity charts.
          </p>
          <ul className="mt-3 space-y-1 text-sm text-white/70">
            <li>• Algorithm Visualizations</li>
            <li>• Real-time Performance Charts</li>
            <li>• Big O Notation Analysis</li>
            <li>• Educational Content</li>
          </ul>
        </div>

        <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6 hover:border-orange-500/30 transition-all duration-300">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-gradient-to-br from-orange-400 to-red-400 p-2 rounded-lg">
              <Target className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-bold text-white">Enterprise Agile</h3>
          </div>
          <p className="text-blue-200 text-sm">
            Agile methodology integration with sprint tracking, team metrics, and productivity analytics.
          </p>
          <ul className="mt-3 space-y-1 text-sm text-white/70">
            <li>• Sprint Dashboard</li>
            <li>• Team Velocity Tracking</li>
            <li>• Code Quality Metrics</li>
            <li>• ROI Calculations</li>
          </ul>
        </div>
      </div>

      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Your Projects</h2>
          <p className="text-blue-200">Manage and track your testing projects</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setShowAIRepair(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg font-semibold hover:from-green-600 hover:to-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl group"
          >
            <Brain className="w-5 h-5 group-hover:scale-110 transition-transform" />
            AI Code Optimizer
          </button>
          
          <button
            onClick={() => setShowWizard(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 shadow-lg hover:shadow-xl group"
          >
            <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
            New Project
          </button>
        </div>
      </div>

      <ProjectList
        key={refreshTrigger}
        onProjectSelect={handleProjectSelect}
      />

      {/* Quick Start Section */}
      <div className="mt-12 bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-xl rounded-xl border border-blue-500/20 p-8">
        <h3 className="text-2xl font-bold text-white mb-4 text-center">🚀 Quick Start</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="space-y-2">
            <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-blue-300 font-bold">1</span>
            </div>
            <h4 className="text-white font-semibold">Click AI Code Optimizer</h4>
            <p className="text-blue-200 text-sm">Start analyzing your code instantly</p>
          </div>
          <div className="space-y-2">
            <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-purple-300 font-bold">2</span>
            </div>
            <h4 className="text-white font-semibold">Paste Your Code</h4>
            <p className="text-blue-200 text-sm">Any language, any complexity level</p>
          </div>
          <div className="space-y-2">
            <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-green-300 font-bold">3</span>
            </div>
            <h4 className="text-white font-semibold">Get Optimizations</h4>
            <p className="text-blue-200 text-sm">AI-powered fixes and performance boosts</p>
          </div>
        </div>
      </div>
    </>
  );

  const renderAnalyticsView = () => (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">
          🎯 Advanced Analytics
        </h1>
        <p className="text-xl text-blue-200">
          Interactive algorithm visualizations and performance analytics
        </p>
      </div>
      
      <AlgorithmAnimations />
      <ComplexityCharts 
        performanceResults={[]}
        timeComplexity={{ current: 'O(n²)', improved: 'O(n log n)' }}
        spaceComplexity={{ current: 'O(n)', improved: 'O(1)' }}
      />
    </div>
  );

  const renderEnterpriseView = () => (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">
          🏢 Enterprise Agile Integration
        </h1>
        <p className="text-xl text-blue-200">
          Agile methodology with team metrics and productivity analytics
        </p>
      </div>
      
      <AgileIntegration />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiIgc3Ryb2tlPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDMpIiBzdHJva2Utd2lkdGg9IjIiLz48L2c+PC9zdmc+')] opacity-20"></div>

      <nav className="relative z-10 bg-white/5 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-400 to-cyan-400 p-2 rounded-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Project Sentinel</h1>
                <p className="text-xs text-blue-300">AI-Powered Code Optimization Platform</p>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-2 bg-white/5 rounded-lg p-1">
              {[
                { key: 'main', label: 'Dashboard', icon: Sparkles },
                { key: 'analytics', label: 'Analytics', icon: BarChart3 },
                { key: 'enterprise', label: 'Enterprise', icon: Target }
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveView(key as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200 ${
                    activeView === key
                      ? 'bg-blue-500 text-white shadow-lg'
                      : 'text-blue-200 hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm text-blue-200">{user?.email}</span>
              <button
                onClick={() => signOut()}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-200 border border-white/20"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeView === 'main' && renderMainView()}
        {activeView === 'analytics' && renderAnalyticsView()}
        {activeView === 'enterprise' && renderEnterpriseView()}
      </main>
    </div>
  );
}