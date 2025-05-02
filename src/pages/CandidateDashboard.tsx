
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, ChevronRight, Loader } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { getCandidateAssignments, TestAssignment, updateAssignmentStatus } from "@/lib/test-management-utils";
import { formatDistanceToNow } from "date-fns";

const CandidateDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [assignments, setAssignments] = useState<TestAssignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!user) {
      navigate("/signin");
      return;
    }

    const loadAssignments = async () => {
      setIsLoading(true);
      if (user?.email) {
        const candidateAssignments = await getCandidateAssignments(user.email);
        setAssignments(candidateAssignments);
      }
      setIsLoading(false);
    };

    loadAssignments();
  }, [user, navigate]);

  const startTest = async (assignment: TestAssignment) => {
    // Update the assignment status to 'in-progress'
    if (assignment.id) {
      const updated = await updateAssignmentStatus(assignment.id, 'in-progress', true, false);
      
      if (updated) {
        // Navigate to the test workspace
        navigate(`/interview/${assignment.id}`);
      } else {
        toast({
          title: "Error",
          description: "Could not start the test. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const renderAssignmentCard = (assignment: TestAssignment) => {
    const isCompleted = assignment.status === 'completed';
    const isPending = assignment.status === 'pending';
    const isInProgress = assignment.status === 'in-progress';
    
    return (
      <Card key={assignment.id} className="mb-4">
        <CardHeader>
          <CardTitle className="flex justify-between">
            <span>{assignment.test?.test_title || "Untitled Test"}</span>
            {assignment.test?.time_limit && (
              <div className="flex items-center text-sm font-normal text-muted-foreground">
                <Clock className="w-4 h-4 mr-1" />
                <span>{assignment.test.time_limit} min</span>
              </div>
            )}
          </CardTitle>
          <CardDescription>
            {assignment.test?.primary_language && (
              <div className="inline-block bg-primary/10 text-primary text-xs px-2 py-1 rounded-full mr-2">
                {assignment.test.primary_language}
              </div>
            )}
            {isCompleted ? (
              <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                Completed
              </span>
            ) : isPending ? (
              <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                Pending
              </span>
            ) : (
              <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                In Progress
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-2">
            {assignment.test?.instructions?.substring(0, 150)}
            {(assignment.test?.instructions?.length || 0) > 150 ? "..." : ""}
          </p>
          {assignment.started_at && (
            <p className="text-xs text-muted-foreground">
              Started {formatDistanceToNow(new Date(assignment.started_at), { addSuffix: true })}
            </p>
          )}
        </CardContent>
        <CardFooter className="justify-end">
          {isCompleted ? (
            <Button variant="outline" disabled>
              Completed
            </Button>
          ) : (
            <Button 
              onClick={() => startTest(assignment)}
              className="gap-2"
            >
              {isInProgress ? "Continue Test" : "Start Test"}
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </CardFooter>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="h-8 w-8 animate-spin mr-2" />
        <p>Loading your assignments...</p>
      </div>
    );
  }

  const pendingAssignments = assignments.filter(a => a.status === 'pending');
  const inProgressAssignments = assignments.filter(a => a.status === 'in-progress');
  const completedAssignments = assignments.filter(a => a.status === 'completed');

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <h1 className="text-3xl font-bold mb-6">My Assignments</h1>
      
      {assignments.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl mb-2">You don't have any assignments yet</h3>
          <p className="text-muted-foreground">
            When you are invited to take a coding test, it will appear here.
          </p>
        </div>
      ) : (
        <Tabs defaultValue="all">
          <TabsList className="mb-6">
            <TabsTrigger value="all">All ({assignments.length})</TabsTrigger>
            <TabsTrigger value="pending">Pending ({pendingAssignments.length})</TabsTrigger>
            <TabsTrigger value="in-progress">In Progress ({inProgressAssignments.length})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({completedAssignments.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            {assignments.map(renderAssignmentCard)}
          </TabsContent>
          <TabsContent value="pending">
            {pendingAssignments.length > 0 ? 
              pendingAssignments.map(renderAssignmentCard) : 
              <p className="text-center text-muted-foreground py-8">No pending assignments</p>}
          </TabsContent>
          <TabsContent value="in-progress">
            {inProgressAssignments.length > 0 ? 
              inProgressAssignments.map(renderAssignmentCard) : 
              <p className="text-center text-muted-foreground py-8">No assignments in progress</p>}
          </TabsContent>
          <TabsContent value="completed">
            {completedAssignments.length > 0 ? 
              completedAssignments.map(renderAssignmentCard) : 
              <p className="text-center text-muted-foreground py-8">No completed assignments</p>}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default CandidateDashboard;
