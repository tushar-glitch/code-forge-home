import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

interface Submission {
  id: number;
  created_at: string;
  test_status: string;
  TestAssignment: {
    Candidate: {
      first_name?: string;
      last_name?: string;
      email: string;
    };
    Test: {
      User: {
        email: string;
      };
    };
  };
}

const Submissions = () => {
  const { testId } = useParams();
  const { session } = useAuth();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSubmissions = async () => {
      if (!session) return;
      setIsLoading(true);
      try {
        const url = testId ? `/submissions?testId=${testId}` : '/submissions';
        const data = await api.get<Submission[]>(url, session.token);
        setSubmissions(data);
      } catch (error) {
        console.error('Error fetching submissions:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSubmissions();
  }, [session, testId]);

  if (isLoading) {
    return <div>Loading submissions...</div>;
  }

  return (
    <DashboardLayout title="Submissions">
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-8">Submissions {testId ? `for Test ${testId}` : ""}</h1>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Candidate</TableHead>
              <TableHead>Submitted At</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {submissions.map((submission) => (
              <TableRow key={submission.id}>
                <TableCell>
                  {submission.TestAssignment.Candidate.first_name && submission.TestAssignment.Candidate.last_name
                    ? `${submission.TestAssignment.Candidate.first_name} ${submission.TestAssignment.Candidate.last_name}`
                    : submission.TestAssignment.Candidate.email}
                </TableCell>
                <TableCell>{new Date(submission.created_at).toLocaleString()}</TableCell>
                <TableCell>{submission.test_status}</TableCell>
                <TableCell>
                  <Link to={`/dashboard/submissions/${submission.id}/evaluation`}>
                    <Button variant="outline">View Results</Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </DashboardLayout>
  );
};

export default Submissions;