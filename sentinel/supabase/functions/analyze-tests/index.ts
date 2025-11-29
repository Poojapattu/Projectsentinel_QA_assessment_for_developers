import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { projectId, testType } = await req.json();

    const { data: testCases, error: testError } = await supabase
      .from('test_cases')
      .select('*')
      .eq('project_id', projectId);

    if (testError) throw testError;

    const analysis = analyzeTestCases(testCases, testType);

    const { data, error } = await supabase
      .from('analysis_results')
      .insert({
        project_id: projectId,
        coverage_level: analysis.coverageLevel,
        insights: analysis.insights,
        errors: analysis.errors,
        recommendations: analysis.recommendations
      })
      .select()
      .single();

    if (error) throw error;

    return new Response(
      JSON.stringify({ success: true, analysis: data }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});

function analyzeTestCases(testCases: any[], testType: string) {
  const totalTests = testCases.length;
  const highPriorityTests = testCases.filter(tc => tc.priority === 'high').length;
  const passedTests = testCases.filter(tc => tc.status === 'passed').length;
  const failedTests = testCases.filter(tc => tc.status === 'failed').length;

  const coverageLevel = Math.min(95, Math.max(45, 60 + (totalTests * 3) + (highPriorityTests * 5)));

  const insights = [];
  const errors = [];
  const recommendations = [];

  if (totalTests < 5) {
    insights.push({
      type: 'Coverage Gap',
      message: 'Low test count detected. Consider adding more test cases for better coverage.',
      severity: 'high'
    });
  } else if (totalTests >= 10) {
    insights.push({
      type: 'Good Coverage',
      message: 'Excellent test coverage with comprehensive test scenarios.',
      severity: 'low'
    });
  }

  if (highPriorityTests < totalTests * 0.3) {
    insights.push({
      type: 'Priority Distribution',
      message: 'Consider marking more critical test cases as high priority.',
      severity: 'medium'
    });
  }

  if (testType === 'unit') {
    const hasEdgeCases = testCases.some(tc => 
      tc.title.toLowerCase().includes('edge') || 
      tc.title.toLowerCase().includes('boundary')
    );
    if (!hasEdgeCases) {
      errors.push({
        testId: 'general',
        message: 'Missing edge case tests',
        suggestion: 'Add test cases for boundary values and edge conditions'
      });
    }

    const hasErrorHandling = testCases.some(tc => 
      tc.title.toLowerCase().includes('error') || 
      tc.title.toLowerCase().includes('invalid')
    );
    if (!hasErrorHandling) {
      errors.push({
        testId: 'general',
        message: 'Missing error handling tests',
        suggestion: 'Add test cases for error conditions and invalid inputs'
      });
    }
  }

  if (testType === 'integration') {
    insights.push({
      type: 'Integration Testing',
      message: 'Integration tests should verify component interactions and data flow.',
      severity: 'low'
    });

    const hasEndToEnd = testCases.some(tc => 
      tc.title.toLowerCase().includes('end-to-end') || 
      tc.title.toLowerCase().includes('e2e')
    );
    if (!hasEndToEnd) {
      recommendations.push({
        title: 'Add End-to-End Tests',
        description: 'Include complete workflow tests that verify the entire system integration.',
        priority: 'high'
      });
    }
  }

  if (testType === 'performance') {
    insights.push({
      type: 'Performance Metrics',
      message: 'Performance tests should include response time, throughput, and resource usage metrics.',
      severity: 'low'
    });

    recommendations.push({
      title: 'Establish Baselines',
      description: 'Create performance baselines to track improvements and regressions over time.',
      priority: 'high'
    });

    recommendations.push({
      title: 'Load Testing',
      description: 'Test system behavior under various load conditions (normal, peak, stress).',
      priority: 'medium'
    });
  }

  if (failedTests > 0) {
    testCases.filter(tc => tc.status === 'failed').forEach(tc => {
      errors.push({
        testId: tc.id,
        message: `Test "${tc.title}" is failing`,
        suggestion: 'Review test expectations and verify implementation matches requirements'
      });
    });
  }

  recommendations.push({
    title: 'Continuous Integration',
    description: 'Integrate these tests into your CI/CD pipeline for automated validation.',
    priority: 'high'
  });

  recommendations.push({
    title: 'Test Documentation',
    description: 'Document test purposes and expected outcomes for team reference.',
    priority: 'medium'
  });

  recommendations.push({
    title: 'Regular Review',
    description: 'Schedule periodic reviews to update tests as requirements evolve.',
    priority: 'low'
  });

  if (coverageLevel < 70) {
    recommendations.push({
      title: 'Increase Coverage',
      description: 'Add more test cases to cover additional scenarios and edge cases.',
      priority: 'high'
    });
  }

  return {
    coverageLevel,
    insights,
    errors,
    recommendations
  };
}
