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

    const { projectId, projectName, moduleName, testType, parameters } = await req.json();

    const testCases = generateTestCases(projectName, moduleName, testType, parameters);

    const testCaseInserts = testCases.map(tc => ({
      project_id: projectId,
      title: tc.title,
      description: tc.description,
      input: tc.input,
      expected_output: tc.expected_output,
      priority: tc.priority,
      status: 'pending'
    }));

    const { data, error } = await supabase
      .from('test_cases')
      .insert(testCaseInserts)
      .select();

    if (error) throw error;

    return new Response(
      JSON.stringify({ success: true, testCases: data }),
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

function generateTestCases(projectName: string, moduleName: string, testType: string, parameters: any) {
  const baseScenarios = {
    unit: [
      {
        title: 'Valid Input Test',
        description: `Test ${moduleName} with valid input parameters`,
        input: { valid: true, data: parameters.expectedInputs || 'sample input' },
        expected_output: { success: true, result: parameters.expectedOutputs || 'expected result' },
        priority: 'high'
      },
      {
        title: 'Invalid Input Test',
        description: `Test ${moduleName} with invalid or malformed input`,
        input: { valid: false, data: null },
        expected_output: { success: false, error: 'Invalid input' },
        priority: 'high'
      },
      {
        title: 'Boundary Value Test',
        description: `Test ${moduleName} with boundary values`,
        input: { value: 0, edge: true },
        expected_output: { success: true, handled: true },
        priority: 'medium'
      },
      {
        title: 'Empty Input Test',
        description: `Test ${moduleName} with empty or null input`,
        input: {},
        expected_output: { success: false, error: 'Required fields missing' },
        priority: 'medium'
      },
      {
        title: 'Type Validation Test',
        description: `Test ${moduleName} with incorrect data types`,
        input: { wrongType: 'string instead of number' },
        expected_output: { success: false, error: 'Type validation failed' },
        priority: 'low'
      }
    ],
    integration: [
      {
        title: 'End-to-End Flow Test',
        description: `Test complete workflow of ${moduleName}`,
        input: { workflow: 'complete', steps: ['init', 'process', 'finalize'] },
        expected_output: { success: true, completed: true },
        priority: 'high'
      },
      {
        title: 'Module Interaction Test',
        description: `Test ${moduleName} interaction with dependent modules`,
        input: { dependency: true, modules: ['module1', 'module2'] },
        expected_output: { success: true, integrated: true },
        priority: 'high'
      },
      {
        title: 'Error Propagation Test',
        description: `Test error handling across ${moduleName} boundaries`,
        input: { causeError: true },
        expected_output: { success: false, errorHandled: true },
        priority: 'medium'
      },
      {
        title: 'Data Consistency Test',
        description: `Test data consistency across ${moduleName} operations`,
        input: { operation: 'multiple', consistency: true },
        expected_output: { success: true, dataConsistent: true },
        priority: 'high'
      },
      {
        title: 'Concurrent Operations Test',
        description: `Test ${moduleName} behavior with concurrent requests`,
        input: { concurrent: true, count: 10 },
        expected_output: { success: true, allCompleted: true },
        priority: 'medium'
      }
    ],
    performance: [
      {
        title: 'Response Time Test',
        description: `Measure ${moduleName} response time under normal load`,
        input: { load: 'normal', requests: 100 },
        expected_output: { avgResponseTime: '< 200ms', success: true },
        priority: 'high'
      },
      {
        title: 'Heavy Load Test',
        description: `Test ${moduleName} performance under heavy load`,
        input: { load: 'heavy', requests: 1000 },
        expected_output: { maxResponseTime: '< 1000ms', success: true },
        priority: 'high'
      },
      {
        title: 'Memory Usage Test',
        description: `Monitor ${moduleName} memory consumption`,
        input: { monitorMemory: true, duration: '5min' },
        expected_output: { memoryLeak: false, peakUsage: '< 500MB' },
        priority: 'medium'
      },
      {
        title: 'Throughput Test',
        description: `Measure ${moduleName} throughput capacity`,
        input: { measure: 'throughput', duration: '1min' },
        expected_output: { requestsPerSecond: '> 1000', success: true },
        priority: 'high'
      },
      {
        title: 'Resource Utilization Test',
        description: `Test ${moduleName} CPU and resource usage`,
        input: { monitorResources: true },
        expected_output: { cpuUsage: '< 70%', resourcesOptimal: true },
        priority: 'medium'
      }
    ]
  };

  return baseScenarios[testType as keyof typeof baseScenarios] || baseScenarios.unit;
}
