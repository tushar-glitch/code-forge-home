import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { getAssignmentDetailsByAccessLink, updateAssignmentStatus } from "@/lib/test-management-utils";
import { Loader2, PlayCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const TestTakerWorkspace = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { accessLink } = useParams<{ accessLink: string }>();

  const [isLoading, setIsLoading] = useState(true);
  const [assignmentData, setAssignmentData] = useState<any>(null);
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    const fetchAssignment = async () => {
      if (!accessLink) {
        toast({
          title: "Error",
          description: "Access link is missing.",
          variant: "destructive",
        });
        navigate("/");
        return;
      }

      setIsLoading(true);
      try {
        const details = await getAssignmentDetailsByAccessLink(accessLink);

        if (!details) {
          throw new Error("Assignment not found or invalid access link.");
        }
        setAssignmentData(details);
        setShowInstructions(true);
      } catch (error) {
        console.error("Error fetching assignment data:", error);
        toast({
          title: "Error",
          description: error.message || "Failed to load assignment details.",
          variant: "destructive",
        });
        navigate("/");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssignment();
  }, [accessLink, navigate, toast]);

  const handleStartTest = async () => {
    if (!assignmentData) return;

    setIsLoading(true); // Show loading while updating status
    try {
      // Mark the assignment as started if not already
      if (assignmentData.status === "pending") {
        const updated = await updateAssignmentStatus(
          assignmentData.access_link,
          "in-progress",
          true,
          false
        );
        if (!updated) {
          throw new Error("Failed to update assignment status.");
        }
      }

      // Redirect to the InterviewWorkspace using the assignment ID
      if( !assignmentData.id ) {
        throw new Error("Invalid assignment ID.");
      }
      navigate(`/interview/${assignmentData.id}`, { state: { accessLink: assignmentData.access_link } });
    } catch (error) {
      console.error("Error starting test:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to start the test.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-50">
        <div className="text-center p-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading test instructions...</p>
        </div>
      </div>
    );
  }

  if (showInstructions && assignmentData) {
    const test = assignmentData.Test;
    const candidate = assignmentData.Candidate;

    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-3xl shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center text-primary">
              {test?.test_title || "Coding Test"}
            </CardTitle>
            <CardDescription className="text-center text-muted-foreground mt-2">
              Welcome, {candidate?.first_name || candidate?.email}!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">Instructions</h2>
              <p className="text-muted-foreground whitespace-pre-wrap">
                {test?.instructions || "No specific instructions provided."}
              </p>
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">Problem Statement</h2>
              <p className="text-muted-foreground whitespace-pre-wrap">
                {test?.problem_statement || "No problem statement provided."}
              </p>
            </div>
            <Separator />
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium">Time Limit:</p>
                <p className="text-muted-foreground">{test?.time_limit} minutes</p>
              </div>
              <div>
                <p className="font-medium">Primary Language:</p>
                <p className="text-muted-foreground">{test?.primary_language || "N/A"}</p>
              </div>
            </div>
            <Separator />
            <div className="text-center">
              <Button onClick={handleStartTest} className="px-8 py-3 text-lg">
                <PlayCircle className="mr-2 h-5 w-5" />
                I Understand, Start Test
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
};

export default TestTakerWorkspace;