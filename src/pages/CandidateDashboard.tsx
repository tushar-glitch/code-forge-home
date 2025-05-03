
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { TestAssignment, getCandidateAssignments } from "@/lib/test-management-utils";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";

const CandidateDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [assignments, setAssignments] = useState<TestAssignment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssignments = async () => {
      if (!user?.email) return;
      
      try {
        const data = await getCandidateAssignments(user.email);
        // Type assertion to fix TypeScript error
        setAssignments(data as unknown as TestAssignment[]);
      } catch (error) {
        console.error("Error fetching assignments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, [user?.email]);

  // Filter assignments by status
  const pendingAssignments = assignments.filter(a => a.status === "pending");
  const inProgressAssignments = assignments.filter(a => a.status === "in-progress");
  const completedAssignments = assignments.filter(a => a.status === "completed");

  const renderAssignmentCard = (assignment: TestAssignment) => {
    const testTitle = assignment.test?.test_title || "Unnamed Test";
    const testDuration = assignment.test?.time_limit || 60;
    const testLanguage = assignment.test?.primary_language || "Not specified";
    
    const startedDate = assignment.started_at ? new Date(assignment.started_at) : null;
    const completedDate = assignment.completed_at ? new Date(assignment.completed_at) : null;
    
    return (
      <Card key={assignment.id} className="mb-4">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{testTitle}</CardTitle>
            <Badge 
              variant={
                assignment.status === "completed" ? "default" : 
                assignment.status === "in-progress" ? "secondary" : "outline"
              }
            >
              {assignment.status === "pending" ? "Not Started" : 
               assignment.status === "in-progress" ? "In Progress" : "Completed"}
            </Badge>
          </div>
          <CardDescription>
            {testDuration} minutes • {testLanguage}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {startedDate && (
              <div className="text-sm">
                <span className="font-medium">Started:</span> {format(startedDate, "PPp")}
              </div>
            )}
            {completedDate && (
              <div className="text-sm">
                <span className="font-medium">Completed:</span> {format(completedDate, "PPp")}
              </div>
            )}
            <Button 
              onClick={() => navigate(`/interview/${assignment.id}`)}
              variant={assignment.status === "completed" ? "outline" : "default"}
              disabled={assignment.status === "completed"}
            >
              {assignment.status === "pending" ? "Start Test" : 
               assignment.status === "in-progress" ? "Continue Test" : "View Submission"}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container py-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Candidate Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back{user?.email ? `, ${user.email.split('@')[0]}` : ''}. 
          Here are your assigned tests and submissions.
        </p>
      </div>
      
      <Tabs defaultValue={assignments.length > 0 ? (pendingAssignments.length > 0 ? "pending" : inProgressAssignments.length > 0 ? "in-progress" : "completed") : "pending"}>
        <TabsList className="mb-6">
          <TabsTrigger value="pending">
            Not Started ({pendingAssignments.length})
          </TabsTrigger>
          <TabsTrigger value="in-progress">
            In Progress ({inProgressAssignments.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({completedAssignments.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="pending">
          {pendingAssignments.length > 0 ? (
            pendingAssignments.map(renderAssignmentCard)
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No pending assignments</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="in-progress">
          {inProgressAssignments.length > 0 ? (
            inProgressAssignments.map(renderAssignmentCard)
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No tests in progress</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="completed">
          {completedAssignments.length > 0 ? (
            completedAssignments.map(renderAssignmentCard)
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No completed tests</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      {assignments.length === 0 && (
        <div className="my-12 text-center">
          <h2 className="text-2xl font-semibold mb-2">No Tests Assigned Yet</h2>
          <p className="text-muted-foreground mb-6">
            You don't have any tests assigned to you at the moment.
            <br />
            Check back later or contact your recruiter.
          </p>
        </div>
      )}
    </div>
  );
};

export default CandidateDashboard;
