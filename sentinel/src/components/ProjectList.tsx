import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../contexts/AuthContext";
import { FileCode, Trash2, Clock, ChevronRight } from "lucide-react";

// ---- FIXED: Removed Database type error ----
type Project = {
  id: string;
  name: string;
  module_name: string;
  test_type: string;
  current_phase: number;
  updated_at: string;
};

// ---- Props ----
interface ProjectListProps {
  onProjectSelect: (projectId: string) => void;
}

export default function ProjectList({ onProjectSelect }: ProjectListProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();

  // ---- Fetch projects on load ----
  useEffect(() => {
    loadProjects();
  }, [user]);

  const loadProjects = async () => {
    if (!user) return;

    setLoading(true);

    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("updated_at", { ascending: false });

    if (!error && data) {
      setProjects(data as Project[]);
    }

    setLoading(false);
  };

  // ---- Delete project ----
  const handleDelete = async (
    e: React.MouseEvent,
    projectId: string
  ) => {
    e.stopPropagation();

    if (!confirm("Are you sure you want to delete this project?")) return;

    const { error } = await supabase
      .from("projects")
      .delete()
      .eq("id", projectId);

    if (!error) {
      setProjects((prev) => prev.filter((p) => p.id !== projectId));
    }
  };

  // ---- UI Helper: badge color ----
  const getTestTypeColor = (type: string) => {
    switch (type) {
      case "unit":
        return "from-green-400 to-emerald-400";
      case "integration":
        return "from-blue-400 to-cyan-400";
      case "performance":
        return "from-orange-400 to-amber-400";
      default:
        return "from-gray-400 to-slate-400";
    }
  };

  // ---- UI Helper: phase label ----
  const getPhaseLabel = (phase: number) => {
    switch (phase) {
      case 1:
        return "Input";
      case 2:
        return "Generation";
      case 3:
        return "Analysis";
      default:
        return "Unknown";
    }
  };

  // ---- Loading UI ----
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-12 h-12 border-4 border-blue-400/30 border-t-blue-400 rounded-full animate-spin"></div>
      </div>
    );
  }

  // ---- Empty State ----
  if (projects.length === 0) {
    return (
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-12 text-center">
        <div className="bg-gradient-to-br from-blue-400/20 to-cyan-400/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
          <FileCode className="w-10 h-10 text-blue-300" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">
          No projects yet
        </h3>
        <p className="text-blue-200">
          Create your first project to get started with AI-powered testing
        </p>
      </div>
    );
  }

  // ---- Main UI ----
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <div
          key={project.id}
          onClick={() => onProjectSelect(project.id)}
          className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6 hover:bg-white/10 transition-all duration-200 cursor-pointer group hover:scale-105"
        >
          <div className="flex items-start justify-between mb-4">
            <div
              className={`bg-gradient-to-br ${getTestTypeColor(
                project.test_type
              )} p-3 rounded-lg`}
            >
              <FileCode className="w-6 h-6 text-white" />
            </div>

            <button
              onClick={(e) => handleDelete(e, project.id)}
              className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-500/20 rounded-lg transition-all duration-200"
            >
              <Trash2 className="w-4 h-4 text-red-400" />
            </button>
          </div>

          <h3 className="text-lg font-semibold text-white mb-1 truncate">
            {project.name}
          </h3>

          <p className="text-sm text-blue-200 mb-4 truncate">
            {project.module_name}
          </p>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-blue-300">
              <Clock className="w-4 h-4" />
              Phase {project.current_phase}:{" "}
              {getPhaseLabel(project.current_phase)}
            </div>

            <div className="flex items-center text-blue-300">
              <span className="capitalize">{project.test_type}</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
