/*
  # Project Sentinel - 3-Phase Test Assistant Database Schema

  ## Overview
  This migration creates the complete database structure for Project Sentinel,
  a testing assistant that guides users through 3 phases: input, generation, and analysis.

  ## 1. New Tables
  
  ### `projects`
  Stores project information and metadata
  - `id` (uuid, primary key) - Unique identifier
  - `user_id` (uuid, foreign key) - Owner of the project
  - `name` (text) - Project name
  - `module_name` (text) - Module being tested
  - `test_type` (text) - Type of test (unit/integration/performance)
  - `parameters` (jsonb) - User-provided parameters
  - `current_phase` (integer) - Current phase (1, 2, or 3)
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### `test_cases`
  Stores generated test cases for each project
  - `id` (uuid, primary key) - Unique identifier
  - `project_id` (uuid, foreign key) - Associated project
  - `title` (text) - Test case title
  - `description` (text) - Detailed description
  - `input` (jsonb) - Test input data
  - `expected_output` (jsonb) - Expected results
  - `priority` (text) - Priority level (high/medium/low)
  - `status` (text) - Status (pending/passed/failed)
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### `analysis_results`
  Stores AI analysis results for projects
  - `id` (uuid, primary key) - Unique identifier
  - `project_id` (uuid, foreign key) - Associated project
  - `coverage_level` (integer) - Coverage percentage (0-100)
  - `insights` (jsonb) - Array of AI-generated insights
  - `errors` (jsonb) - Array of detected errors
  - `recommendations` (jsonb) - Array of recommendations
  - `created_at` (timestamptz) - Creation timestamp

  ## 2. Security
  - Enable RLS on all tables
  - Users can only access their own projects and related data
  - Authenticated access required for all operations
*/

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  module_name text NOT NULL,
  test_type text NOT NULL CHECK (test_type IN ('unit', 'integration', 'performance')),
  parameters jsonb DEFAULT '{}'::jsonb,
  current_phase integer DEFAULT 1 CHECK (current_phase BETWEEN 1 AND 3),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create test_cases table
CREATE TABLE IF NOT EXISTS test_cases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  input jsonb DEFAULT '{}'::jsonb,
  expected_output jsonb DEFAULT '{}'::jsonb,
  priority text DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'passed', 'failed')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create analysis_results table
CREATE TABLE IF NOT EXISTS analysis_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  coverage_level integer DEFAULT 0 CHECK (coverage_level BETWEEN 0 AND 100),
  insights jsonb DEFAULT '[]'::jsonb,
  errors jsonb DEFAULT '[]'::jsonb,
  recommendations jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_test_cases_project_id ON test_cases(project_id);
CREATE INDEX IF NOT EXISTS idx_analysis_results_project_id ON analysis_results(project_id);

-- Enable Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE analysis_results ENABLE ROW LEVEL SECURITY;

-- RLS Policies for projects table
CREATE POLICY "Users can view own projects"
  ON projects FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own projects"
  ON projects FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects"
  ON projects FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own projects"
  ON projects FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for test_cases table
CREATE POLICY "Users can view test cases for own projects"
  ON test_cases FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = test_cases.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create test cases for own projects"
  ON test_cases FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = test_cases.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update test cases for own projects"
  ON test_cases FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = test_cases.project_id
      AND projects.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = test_cases.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete test cases for own projects"
  ON test_cases FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = test_cases.project_id
      AND projects.user_id = auth.uid()
    )
  );

-- RLS Policies for analysis_results table
CREATE POLICY "Users can view analysis for own projects"
  ON analysis_results FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = analysis_results.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create analysis for own projects"
  ON analysis_results FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = analysis_results.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update analysis for own projects"
  ON analysis_results FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = analysis_results.project_id
      AND projects.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = analysis_results.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete analysis for own projects"
  ON analysis_results FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = analysis_results.project_id
      AND projects.user_id = auth.uid()
    )
  );