import { useState, useEffect } from 'react';
import { Database, supabase } from '../../lib/supabase';
import { ArrowLeft, ArrowRight, Plus, Edit2, Trash2, RefreshCw, Loader } from 'lucide-react';
import TestCaseCard from './TestCaseCard';
import TestCaseModal from './TestCaseModal';

type Project = Database['public']['Tables']['projects']['Row'];
type TestCase = Database['public']['Tables']['test_cases']['Row'];

interface Phase2GenerationProps {
  project: Project;
  onComplete: () => void;
  onBack: () => void;
}

export default function Phase2Generation({ project, onComplete, onBack }: Phase2GenerationProps) {
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingCase, setEditingCase] = useState<TestCase | null>(null);

  useEffect(() => {
    loadTestCases();
  }, [project.id]);

  const loadTestCases = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('test_cases')
      .select('*')
      .eq('project_id', project.id)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setTestCases(data);
      if (data.length === 0) {
        generateTestCases();
      }
    }
    setLoading(false);
  };

  const generateTestCases = async () => {
    setGenerating(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-test-cases`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            projectId: project.id,
            projectName: project.name,
            moduleName: project.module_name,
            testType: project.test_type,
            parameters: project.parameters
          })
        }
      );

      if (response.ok) {
        await loadTestCases();
      }
    } catch (error) {
      console.error('Error generating test cases:', error);
    } finally {
      setGenerating(false);
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('test_cases')
      .delete()
      .eq('id', id);

    if (!error) {
      setTestCases(testCases.filter(tc => tc.id !== id));
    }
  };

  const handleEdit = (testCase: TestCase) => {
    setEditingCase(testCase);
    setShowModal(true);
  };

  const handleSave = async (testCaseData: Partial<TestCase>) => {
    if (editingCase) {
      const { data, error } = await supabase
        .from('test_cases')
        .update(testCaseData)
        .eq('id', editingCase.id)
        .select()
        .single();

      if (!error && data) {
        setTestCases(testCases.map(tc => tc.id === data.id ? data : tc));
      }
    } else {
      const { data, error } = await supabase
        .from('test_cases')
        .insert({ ...testCaseData, project_id: project.id })
        .select()
        .single();

      if (!error && data) {
        setTestCases([data, ...testCases]);
      }
    }

    setShowModal(false);
    setEditingCase(null);
  };

  const getPriorityStats = () => {
    const high = testCases.filter(tc => tc.priority === 'high').length;
    const medium = testCases.filter(tc => tc.priority === 'medium').length;
    const low = testCases.filter(tc => tc.priority === 'low').length;
    return { high, medium, low, total: testCases.length };
  };

  const stats = getPriorityStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-12 h-12 border-4 border-blue-400/30 border-t-blue-400 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-1">
        <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6 sticky top-6">
          <h3 className="text-lg font-semibold text-white mb-4">Test Summary</h3>

          <div className="space-y-3 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-blue-200 text-sm">Total Tests</span>
              <span className="text-white font-semibold text-lg">{stats.total}</span>
            </div>
            <div className="h-px bg-white/10"></div>
            <div className="flex justify-between items-center">
              <span className="text-red-300 text-sm">High Priority</span>
              <span className="text-red-300 font-semibold">{stats.high}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-yellow-300 text-sm">Medium Priority</span>
              <span className="text-yellow-300 font-semibold">{stats.medium}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-green-300 text-sm">Low Priority</span>
              <span className="text-green-300 font-semibold">{stats.low}</span>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => {
                setEditingCase(null);
                setShowModal(true);
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-200 border border-white/20"
            >
              <Plus className="w-4 h-4" />
              Add Test Case
            </button>

            <button
              onClick={generateTestCases}
              disabled={generating}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {generating ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  Regenerate All
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="lg:col-span-3">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-white mb-2">Test Cases</h2>
          <p className="text-blue-200">Review, edit, or add test cases for your project</p>
        </div>

        {generating && testCases.length === 0 ? (
          <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-12 text-center">
            <div className="w-16 h-16 border-4 border-blue-400/30 border-t-blue-400 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white font-semibold mb-2">Generating Test Cases</p>
            <p className="text-blue-200 text-sm">AI is creating comprehensive test scenarios...</p>
          </div>
        ) : testCases.length === 0 ? (
          <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-12 text-center">
            <p className="text-white font-semibold mb-2">No test cases yet</p>
            <p className="text-blue-200 text-sm">Click "Add Test Case" or "Regenerate All" to get started</p>
          </div>
        ) : (
          <div className="space-y-4">
            {testCases.map((testCase) => (
              <TestCaseCard
                key={testCase.id}
                testCase={testCase}
                onEdit={() => handleEdit(testCase)}
                onDelete={() => handleDelete(testCase.id)}
              />
            ))}
          </div>
        )}

        <div className="flex justify-between mt-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-200 border border-white/20"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>

          <button
            onClick={onComplete}
            disabled={testCases.length === 0}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue to Analysis
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {showModal && (
        <TestCaseModal
          testCase={editingCase}
          onClose={() => {
            setShowModal(false);
            setEditingCase(null);
          }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
