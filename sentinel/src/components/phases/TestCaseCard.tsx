import { Database } from '../../lib/supabase';
import { Edit2, Trash2, AlertCircle, CheckCircle, Clock } from 'lucide-react';

type TestCase = Database['public']['Tables']['test_cases']['Row'];

interface TestCaseCardProps {
  testCase: TestCase;
  onEdit: () => void;
  onDelete: () => void;
}

export default function TestCaseCard({ testCase, onEdit, onDelete }: TestCaseCardProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500/20 text-red-300 border-red-400/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-300 border-yellow-400/30';
      case 'low': return 'bg-green-500/20 text-green-300 border-green-400/30';
      default: return 'bg-blue-500/20 text-blue-300 border-blue-400/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'failed': return <AlertCircle className="w-4 h-4 text-red-400" />;
      default: return <Clock className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6 hover:bg-white/10 transition-all duration-200 group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-white">{testCase.title}</h3>
            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(testCase.priority)}`}>
              {testCase.priority}
            </span>
            <div className="flex items-center gap-1">
              {getStatusIcon(testCase.status)}
              <span className="text-sm text-blue-200 capitalize">{testCase.status}</span>
            </div>
          </div>
          <p className="text-blue-200 text-sm">{testCase.description}</p>
        </div>

        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={onEdit}
            className="p-2 hover:bg-blue-500/20 rounded-lg transition-colors"
          >
            <Edit2 className="w-4 h-4 text-blue-400" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4 text-red-400" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-white/10">
        <div>
          <h4 className="text-sm font-medium text-blue-100 mb-2">Input</h4>
          <div className="bg-black/20 rounded-lg p-3 border border-white/10">
            <pre className="text-xs text-blue-200 whitespace-pre-wrap font-mono">
              {JSON.stringify(testCase.input, null, 2)}
            </pre>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-blue-100 mb-2">Expected Output</h4>
          <div className="bg-black/20 rounded-lg p-3 border border-white/10">
            <pre className="text-xs text-blue-200 whitespace-pre-wrap font-mono">
              {JSON.stringify(testCase.expected_output, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
