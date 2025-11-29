import { useState, useEffect } from 'react';
import { supabase, Database } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { X } from 'lucide-react';
import Phase1Input from './phases/Phase1Input';
import Phase2Generation from './phases/Phase2Generation';
import Phase3Analysis from './phases/Phase3Analysis';

type Project = Database['public']['Tables']['projects']['Row'];

interface ProjectWizardProps {
  projectId: string | null;
  onClose: () => void;
  onComplete: () => void;
}

export default function ProjectWizard({ projectId, onClose, onComplete }: ProjectWizardProps) {
  const [project, setProject] = useState<Project | null>(null);
  const [currentPhase, setCurrentPhase] = useState(1);
  const [loading, setLoading] = useState(!!projectId);
  const { user } = useAuth();

  useEffect(() => {
    if (projectId) {
      loadProject();
    }
  }, [projectId]);

  const loadProject = async () => {
    if (!projectId) return;

    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .maybeSingle();

    if (!error && data) {
      setProject(data);
      setCurrentPhase(data.current_phase);
    }
    setLoading(false);
  };

  const handlePhase1Complete = async (projectData: Omit<Project, 'id' | 'created_at' | 'updated_at'>) => {
    if (!user) return;

    if (projectId) {
      const { data, error } = await supabase
        .from('projects')
        .update({ ...projectData, current_phase: 2, updated_at: new Date().toISOString() })
        .eq('id', projectId)
        .select()
        .single();

      if (!error && data) {
        setProject(data);
        setCurrentPhase(2);
      }
    } else {
      const { data, error } = await supabase
        .from('projects')
        .insert({ ...projectData, current_phase: 2 })
        .select()
        .single();

      if (!error && data) {
        setProject(data);
        setCurrentPhase(2);
      }
    }
  };

  const handlePhase2Complete = async () => {
    if (!project) return;

    const { error } = await supabase
      .from('projects')
      .update({ current_phase: 3, updated_at: new Date().toISOString() })
      .eq('id', project.id);

    if (!error) {
      setCurrentPhase(3);
      setProject({ ...project, current_phase: 3 });
    }
  };

  const handlePhase3Complete = () => {
    onComplete();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-400/30 border-t-blue-400 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiIgc3Ryb2tlPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDMpIiBzdHJva2Utd2lkdGg9IjIiLz48L2c+PC9zdmc+')] opacity-20"></div>

      <div className="relative z-10">
        <div className="bg-white/5 backdrop-blur-xl border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-8">
                {[1, 2, 3].map((phase) => (
                  <div
                    key={phase}
                    className={`flex items-center gap-2 ${
                      phase === currentPhase ? 'text-white' : phase < currentPhase ? 'text-green-400' : 'text-blue-300/50'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                        phase === currentPhase
                          ? 'bg-gradient-to-br from-blue-400 to-cyan-400'
                          : phase < currentPhase
                          ? 'bg-green-500'
                          : 'bg-white/10'
                      }`}
                    >
                      {phase}
                    </div>
                    <span className="font-medium">
                      {phase === 1 ? 'Input' : phase === 2 ? 'Generation' : 'Analysis'}
                    </span>
                  </div>
                ))}
              </div>

              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {currentPhase === 1 && (
            <Phase1Input
              project={project}
              onComplete={handlePhase1Complete}
            />
          )}
          {currentPhase === 2 && project && (
            <Phase2Generation
              project={project}
              onComplete={handlePhase2Complete}
              onBack={() => setCurrentPhase(1)}
            />
          )}
          {currentPhase === 3 && project && (
            <Phase3Analysis
              project={project}
              onComplete={handlePhase3Complete}
              onBack={() => setCurrentPhase(2)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
