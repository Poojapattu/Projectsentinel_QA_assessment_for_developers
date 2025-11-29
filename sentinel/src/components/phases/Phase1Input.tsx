import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { FileCode, Package, TestTube, ArrowRight } from 'lucide-react';

// ---- FIXED: Removed invalid Database import ----
// Define your own Project type based on your Supabase "projects" table
type Project = {
  id: string;
  user_id: string;
  name: string;
  module_name: string;
  test_type: 'unit' | 'integration' | 'performance';
  parameters: {
    expectedInputs?: string;
    expectedOutputs?: string;
    additionalParams?: string;
  } | null;
  current_phase: number;
  created_at?: string;
  updated_at?: string;
};

// Props
interface Phase1InputProps {
  project: Project | null;
  onComplete: (data: Omit<Project, 'id' | 'created_at' | 'updated_at'>) => void;
}

export default function Phase1Input({ project, onComplete }: Phase1InputProps) {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: project?.name || '',
    module_name: project?.module_name || '',
    test_type: (project?.test_type || 'unit') as 'unit' | 'integration' | 'performance',
    expectedInputs: '',
    expectedOutputs: '',
    additionalParams: ''
  });

  // Load parameters from existing project
  useEffect(() => {
    if (project?.parameters) {
      const params = project.parameters;
      setFormData((prev) => ({
        ...prev,
        expectedInputs: params.expectedInputs || '',
        expectedOutputs: params.expectedOutputs || '',
        additionalParams: params.additionalParams || ''
      }));
    }
  }, [project]);

  // ---- FINAL SUBMIT ----
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const projectData = {
      user_id: user.id,
      name: formData.name,
      module_name: formData.module_name,
      test_type: formData.test_type,
      parameters: {
        expectedInputs: formData.expectedInputs,
        expectedOutputs: formData.expectedOutputs,
        additionalParams: formData.additionalParams
      },
      current_phase: 1
    };

    onComplete(projectData);
  };

  // ---- Test type cards ----
  const testTypes = [
    { value: 'unit', label: 'Unit Test', icon: TestTube, color: 'from-green-400 to-emerald-400', description: 'Test individual components' },
    { value: 'integration', label: 'Integration Test', icon: Package, color: 'from-blue-400 to-cyan-400', description: 'Test component interactions' },
    { value: 'performance', label: 'Performance Test', icon: FileCode, color: 'from-orange-400 to-amber-400', description: 'Test speed and efficiency' }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Project Configuration</h2>
          <p className="text-blue-200">Define your testing project parameters</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Project name + module */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-blue-100 mb-2">Project Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-400 text-white"
                placeholder="My Awesome Project"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-100 mb-2">Module Name</label>
              <input
                type="text"
                value={formData.module_name}
                onChange={(e) => setFormData({ ...formData, module_name: e.target.value })}
                required
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-400 text-white"
                placeholder="Authentication Module"
              />
            </div>
          </div>

          {/* Test type selection */}
          <div>
            <label className="block text-sm font-medium text-blue-100 mb-3">Test Type</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {testTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <label key={type.value} className="relative cursor-pointer">
                    <input
                      type="radio"
                      name="test_type"
                      value={type.value}
                      checked={formData.test_type === type.value}
                      onChange={(e) =>
                        setFormData({ ...formData, test_type: e.target.value as 'unit' | 'integration' | 'performance' })
                      }
                      className="sr-only"
                    />
                    <div
                      className={`p-6 rounded-xl border-2 transition-all ${
                        formData.test_type === type.value
                          ? 'bg-white/10 border-blue-400 shadow-lg'
                          : 'bg-white/5 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      <div className={`w-12 h-12 bg-gradient-to-br ${type.color} rounded-lg flex items-center justify-center mb-3`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-1">{type.label}</h3>
                      <p className="text-sm text-blue-200">{type.description}</p>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Inputs */}
          <div>
            <label className="block text-sm font-medium text-blue-100 mb-2">Expected Inputs</label>
            <textarea
              value={formData.expectedInputs}
              onChange={(e) => setFormData({ ...formData, expectedInputs: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white"
              placeholder="E.g., email: string, password: string"
            />
          </div>

          {/* Outputs */}
          <div>
            <label className="block text-sm font-medium text-blue-100 mb-2">Expected Outputs</label>
            <textarea
              value={formData.expectedOutputs}
              onChange={(e) => setFormData({ ...formData, expectedOutputs: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white"
              placeholder="E.g., success: boolean, token: string"
            />
          </div>

          {/* Additional params */}
          <div>
            <label className="block text-sm font-medium text-blue-100 mb-2">Additional Parameters (Optional)</label>
            <textarea
              value={formData.additionalParams}
              onChange={(e) => setFormData({ ...formData, additionalParams: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white"
              placeholder="Any additional context or requirements"
            />
          </div>

          {/* Button */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg font-semibold shadow-lg"
            >
              Continue to Test Generation
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
