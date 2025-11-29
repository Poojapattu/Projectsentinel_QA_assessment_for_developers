import { useState, useEffect } from 'react';
import { Database } from '../../lib/supabase';
import { X } from 'lucide-react';

type TestCase = Database['public']['Tables']['test_cases']['Row'];

interface TestCaseModalProps {
  testCase: TestCase | null;
  onClose: () => void;
  onSave: (data: Partial<TestCase>) => void;
}

export default function TestCaseModal({ testCase, onClose, onSave }: TestCaseModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    input: '{}',
    expected_output: '{}',
    priority: 'medium' as 'high' | 'medium' | 'low',
    status: 'pending' as 'pending' | 'passed' | 'failed'
  });

  useEffect(() => {
    if (testCase) {
      setFormData({
        title: testCase.title,
        description: testCase.description,
        input: JSON.stringify(testCase.input, null, 2),
        expected_output: JSON.stringify(testCase.expected_output, null, 2),
        priority: testCase.priority,
        status: testCase.status
      });
    }
  }, [testCase]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const data = {
        title: formData.title,
        description: formData.description,
        input: JSON.parse(formData.input),
        expected_output: JSON.parse(formData.expected_output),
        priority: formData.priority,
        status: formData.status
      };

      onSave(data);
    } catch (error) {
      alert('Invalid JSON format in input or expected output');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 rounded-2xl border border-white/20 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-slate-900 border-b border-white/10 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">
            {testCase ? 'Edit Test Case' : 'Create Test Case'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-blue-100 mb-2">
              Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent text-white placeholder-blue-300/50 transition-all"
              placeholder="Test case title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-blue-100 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              rows={3}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent text-white placeholder-blue-300/50 transition-all resize-none"
              placeholder="Describe what this test case validates"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-blue-100 mb-2">
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as 'high' | 'medium' | 'low' })}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent text-white transition-all"
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-100 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'pending' | 'passed' | 'failed' })}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent text-white transition-all"
              >
                <option value="pending">Pending</option>
                <option value="passed">Passed</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-blue-100 mb-2">
              Input (JSON)
            </label>
            <textarea
              value={formData.input}
              onChange={(e) => setFormData({ ...formData, input: e.target.value })}
              rows={6}
              className="w-full px-4 py-3 bg-black/20 border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent text-white placeholder-blue-300/50 transition-all resize-none font-mono text-sm"
              placeholder='{"key": "value"}'
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-blue-100 mb-2">
              Expected Output (JSON)
            </label>
            <textarea
              value={formData.expected_output}
              onChange={(e) => setFormData({ ...formData, expected_output: e.target.value })}
              rows={6}
              className="w-full px-4 py-3 bg-black/20 border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent text-white placeholder-blue-300/50 transition-all resize-none font-mono text-sm"
              placeholder='{"result": "expected"}'
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-200 border border-white/20"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Save Test Case
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
