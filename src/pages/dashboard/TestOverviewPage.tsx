import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  fetchTestSummary, 
  fetchTestAssignmentsWithResults, 
  TestSummary, 
  TestAssignmentWithResult 
} from "@/lib/test-management-utils";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CheckCircle, XCircle, Users } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const TestOverviewPage = () => {
  const { testId } = useParams<{ testId: string }>();
  const { toast } = useToast();
  const [summary, setSummary] = useState<TestSummary | null>(null);
  const [assignments, setAssignments] = useState<TestAssignmentWithResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!testId) {
        toast({
          title: "Error",
          description: "Test ID is missing.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const fetchedSummary = await fetchTestSummary(testId);
        if (fetchedSummary) {
          setSummary(fetchedSummary);
        }

        const fetchedAssignments = await fetchTestAssignmentsWithResults(testId);
        if (fetchedAssignments) {
          setAssignments(fetchedAssignments);
        }
      } catch (error) {
        console.error("Failed to load test overview data:", error);
        toast({
          title: "Error",
          description: "Failed to load test overview data.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [testId, toast]);

  if (isLoading) {
    return (
      <DashboardLayout title="Test Overview">
        <div className="flex justify-center items-center h-full">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading test overview...</span>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Test Overview">
      <div className="container mx-auto py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Test Overview</h1>
          <p className="text-muted-foreground">
            Detailed insights into test assignments and results.
          </p>
          <Separator className="my-4" />
        </div>

        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Invited</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{summary.totalInvited}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Completed</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{summary.totalCompleted}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                <span className="text-muted-foreground">%</span>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{summary.averageScore}%</div>
              </CardContent>
            </Card>
          </div>
        )}

        <h2 className="text-2xl font-bold mb-4">Assignments & Results</h2>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Candidate Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Evaluation Status</TableHead>
                <TableHead>Submitted At</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assignments.length > 0 ? (
                assignments.map((assignment) => (
                  <TableRow key={assignment.id}>
                    <TableCell className="font-medium">{assignment.candidate?.email || "N/A"}</TableCell>
                    <TableCell>
                      <Badge variant={assignment.status === "completed" ? "default" : "secondary"}>
                        {assignment.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{assignment.test_result?.score !== null ? `${assignment.test_result?.score}%` : "N/A"}</TableCell>
                    <TableCell>
                      <Badge variant={assignment.test_result?.evaluationStatus === "completed" ? "default" : "outline"}>
                        {assignment.test_result?.evaluationStatus || "N/A"}
                      </Badge>
                    </TableCell>
                    <TableCell>{assignment.test_result?.created_at ? new Date(assignment.test_result.created_at).toLocaleString() : "N/A"}</TableCell>
                    <TableCell>
                      {assignment.submission_id && (
                        <Link to={`/dashboard/submissions/${assignment.submission_id}`}>
                          <Button variant="outline" size="sm">View Submission</Button>
                        </Link>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No assignments found for this test.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TestOverviewPage;
