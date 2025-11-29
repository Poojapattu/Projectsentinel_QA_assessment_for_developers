import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Database {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          module_name: string;
          test_type: 'unit' | 'integration' | 'performance';
          parameters: Record<string, unknown>;
          current_phase: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['projects']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['projects']['Insert']>;
      };
      test_cases: {
        Row: {
          id: string;
          project_id: string;
          title: string;
          description: string;
          input: Record<string, unknown>;
          expected_output: Record<string, unknown>;
          priority: 'high' | 'medium' | 'low';
          status: 'pending' | 'passed' | 'failed';
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['test_cases']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['test_cases']['Insert']>;
      };
      analysis_results: {
        Row: {
          id: string;
          project_id: string;
          coverage_level: number;
          insights: Array<{ type: string; message: string; severity: string }>;
          errors: Array<{ testId: string; message: string; suggestion: string }>;
          recommendations: Array<{ title: string; description: string; priority: string }>;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['analysis_results']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['analysis_results']['Insert']>;
      };
    };
  };
}
