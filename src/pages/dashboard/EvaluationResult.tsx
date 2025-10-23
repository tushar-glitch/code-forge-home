import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

interface TestResult {
  id: string;
  created_at: string;
  status: string;
  test_output: any;
}

const EvaluationResult = () => {
  const { submissionId } = useParams();
  const { session } = useAuth();
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTestResult = async () => {
      if (!session || !submissionId) return;
      setIsLoading(true);
      try {
        const data = await api.get<TestResult[]>(
          `/test-results?submissionId=${submissionId}`,
          session.token
        );
        if (data && data.length > 0) {
          setTestResult(data[0]);
        }
      } catch (error) {
        console.error('Error fetching test result:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTestResult();
  }, [session, submissionId]);

  if (isLoading) {
    return <div>Loading evaluation result...</div>;
  }

  if (!testResult) {
    return <div>Evaluation result not found.</div>;
  }

  return (
    <DashboardLayout title="Evaluation Result">
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-8">Evaluation Result for Submission {submissionId}</h1>
        <div className="bg-card p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Test Summary</h2>
          <p><strong>Status:</strong> {testResult.status}</p>
          <p><strong>Date:</strong> {new Date(testResult.created_at).toLocaleString()}</p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">Test Output</h2>
          <pre className="bg-muted p-4 rounded-lg">
            {JSON.stringify(testResult.test_output, null, 2)}
          </pre>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EvaluationResult;