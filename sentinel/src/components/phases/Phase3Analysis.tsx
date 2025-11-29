import { useState, useEffect } from 'react';
import { Database, supabase } from '../../lib/supabase';
import { ArrowLeft, Download, FileJson, Loader, TrendingUp, AlertTriangle, CheckCircle2, Lightbulb } from 'lucide-react';

type Project = Database['public']['Tables']['projects']['Row'];
type AnalysisResult = Database['public']['Tables']['analysis_results']['Row'];
type TestCase = Database['public']['Tables']['test_cases']['Row'];

interface Phase3AnalysisProps {
  project: Project;
  onComplete: () => void;
  onBack: () => void;
}

export default function Phase3Analysis({ project, onComplete, onBack }: Phase3AnalysisProps) {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    loadAnalysis();
    loadTestCases();
  }, [project.id]);

  const loadTestCases = async () => {
    const { data } = await supabase
      .from('test_cases')
      .select('*')
      .eq('project_id', project.id);

    if (data) {
      setTestCases(data);
    }
  };

  const loadAnalysis = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('analysis_results')
      .select('*')
      .eq('project_id', project.id)
      .order('created_at', { ascending: false })
      .maybeSingle();

    if (!error && data) {
      setAnalysis(data);
      setLoading(false);
    } else {
      runAnalysis();
    }
  };

  const runAnalysis = async () => {
    setAnalyzing(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-tests`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            projectId: project.id,
            testType: project.test_type
          })
        }
      );

      if (response.ok) {
        await loadAnalysis();
      }
    } catch (error) {
      console.error('Error analyzing tests:', error);
    } finally {
      setAnalyzing(false);
      setLoading(false);
    }
  };

  const exportAsJSON = () => {
    const exportData = {
      project: {
        name: project.name,
        module: project.module_name,
        testType: project.test_type
      },
      testCases: testCases.map(tc => ({
        title: tc.title,
        description: tc.description,
        priority: tc.priority,
        status: tc.status,
        input: tc.input,
        expectedOutput: tc.expected_output
      })),
      analysis: analysis ? {
        coverageLevel: analysis.coverage_level,
        insights: analysis.insights,
        errors: analysis.errors,
        recommendations: analysis.recommendations
      } : null
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.name.replace(/\s+/g, '-')}-analysis.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getCoverageColor = (level: number) => {
    if (level >= 80) return 'text-green-400';
    if (level >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-400 bg-red-500/20 border-red-400/30';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20 border-yellow-400/30';
      case 'low': return 'text-blue-400 bg-blue-500/20 border-blue-400/30';
      default: return 'text-blue-400 bg-blue-500/20 border-blue-400/30';
    }
  };

  if (loading || analyzing) {
    return (
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-12 text-center">
        <div className="w-16 h-16 border-4 border-blue-400/30 border-t-blue-400 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-white font-semibold mb-2">
          {analyzing ? 'Analyzing Test Cases' : 'Loading Analysis'}
        </p>
        <p className="text-blue-200 text-sm">AI is reviewing your tests for potential improvements...</p>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-12 text-center">
        <p className="text-white font-semibold mb-2">Analysis not available</p>
        <button
          onClick={runAnalysis}
          className="mt-4 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all duration-200"
        >
          Run Analysis
        </button>
      </div>
    );
  }

  const insights = Array.isArray(analysis.insights) ? analysis.insights : [];
  const errors = Array.isArray(analysis.errors) ? analysis.errors : [];
  const recommendations = Array.isArray(analysis.recommendations) ? analysis.recommendations : [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Test Analysis Results</h2>
          <p className="text-blue-200">AI-powered insights and recommendations</p>
        </div>

        <button
          onClick={exportAsJSON}
          className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-200 border border-white/20"
        >
          <Download className="w-5 h-5" />
          Export JSON
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-xl rounded-xl border border-blue-400/30 p-6">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-6 h-6 text-blue-400" />
            <h3 className="text-sm font-medium text-blue-200">Coverage</h3>
          </div>
          <p className={`text-4xl font-bold ${getCoverageColor(analysis.coverage_level)}`}>
            {analysis.coverage_level}%
          </p>
        </div>

        <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-xl rounded-xl border border-green-400/30 p-6">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle2 className="w-6 h-6 text-green-400" />
            <h3 className="text-sm font-medium text-green-200">Tests</h3>
          </div>
          <p className="text-4xl font-bold text-green-400">{testCases.length}</p>
        </div>

        <div className="bg-gradient-to-br from-red-500/20 to-orange-500/20 backdrop-blur-xl rounded-xl border border-red-400/30 p-6">
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle className="w-6 h-6 text-red-400" />
            <h3 className="text-sm font-medium text-red-200">Errors</h3>
          </div>
          <p className="text-4xl font-bold text-red-400">{errors.length}</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-500/20 to-amber-500/20 backdrop-blur-xl rounded-xl border border-yellow-400/30 p-6">
          <div className="flex items-center gap-3 mb-2">
            <Lightbulb className="w-6 h-6 text-yellow-400" />
            <h3 className="text-sm font-medium text-yellow-200">Insights</h3>
          </div>
          <p className="text-4xl font-bold text-yellow-400">{insights.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-400" />
            AI Insights
          </h3>
          <div className="space-y-3">
            {insights.length > 0 ? (
              insights.map((insight, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${getSeverityColor(insight.severity || 'low')}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <p className="font-medium mb-1">{insight.type || 'Insight'}</p>
                      <p className="text-sm opacity-90">{insight.message}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-blue-200 text-center py-4">No insights available</p>
            )}
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            Detected Issues
          </h3>
          <div className="space-y-3">
            {errors.length > 0 ? (
              errors.map((error, index) => (
                <div key={index} className="p-4 rounded-lg bg-red-500/20 border border-red-400/30">
                  <p className="text-red-300 font-medium mb-2">{error.message}</p>
                  {error.suggestion && (
                    <p className="text-sm text-red-200/80">
                      <span className="font-medium">Suggestion:</span> {error.suggestion}
                    </p>
                  )}
                </div>
              ))
            ) : (
              <p className="text-green-200 text-center py-4">No issues detected</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-green-400" />
          Recommendations
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendations.length > 0 ? (
            recommendations.map((rec, index) => (
              <div key={index} className="p-4 rounded-lg bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-400/20">
                <div className="flex items-start gap-3">
                  <div
                    className={`w-2 h-2 rounded-full mt-2 ${
                      rec.priority === 'high' ? 'bg-red-400' : rec.priority === 'medium' ? 'bg-yellow-400' : 'bg-green-400'
                    }`}
                  ></div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-white mb-1">{rec.title}</h4>
                    <p className="text-sm text-blue-200">{rec.description}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-blue-200 text-center py-4 col-span-2">No recommendations available</p>
          )}
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-200 border border-white/20"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        <button
          onClick={onComplete}
          className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-semibold hover:from-green-600 hover:to-emerald-600 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          Complete
          <CheckCircle2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
