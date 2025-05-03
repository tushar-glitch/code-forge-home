
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/hooks/use-toast";
import { updateAssignmentStatus, getAssignmentDetails, TestAssignment } from "@/lib/test-management-utils";
import { Loader2 } from "lucide-react";

const InterviewWorkspace = () => {
  const { assignmentId } = useParams();
  const { user, userRole } = useAuth();
  const navigate = useNavigate();
  const [assignment, setAssignment] = useState<TestAssignment | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchAssignmentDetails = async () => {
      if (!assignmentId || !user) return;
      
      try {
        // Make sure the assignment ID is a number
        const id = parseInt(assignmentId);
        if (isNaN(id)) {
          toast({
            title: "Invalid assignment",
            description: "The assignment ID is not valid",
            variant: "destructive",
          });
          navigate("/candidate-dashboard");
          return;
        }

        // First, get assignment details
        const assignmentData = await getAssignmentDetails(id);
        
        if (!assignmentData) {
          toast({
            title: "Assignment not found",
            description: "This assignment does not exist or you don't have access to it",
            variant: "destructive",
          });
          navigate("/candidate-dashboard");
          return;
        }
        
        // For candidates, verify email matches
        if (userRole === "candidate" && assignmentData.candidate?.email !== user.email) {
          toast({
            title: "Access denied",
            description: "You don't have access to this assignment",
            variant: "destructive",
          });
          navigate("/candidate-dashboard");
          return;
        }

        setAssignment(assignmentData as TestAssignment);

        // If the assignment hasn't been started yet, mark it as in-progress
        if (assignmentData.status === "pending") {
          await updateAssignmentStatus(id, "in-progress", true, false);
          // Update local state
          setAssignment(prev => prev ? {...prev, status: "in-progress" as "in-progress", started_at: new Date().toISOString()} : null);
        }
      } catch (error) {
        console.error("Error fetching assignment:", error);
        toast({
          title: "Error",
          description: "Failed to load assignment details",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAssignmentDetails();
  }, [assignmentId, user, navigate, userRole]);

  const handleSubmitTest = async () => {
    if (!assignmentId || !assignment) return;
    
    setSubmitting(true);
    try {
      const id = parseInt(assignmentId);
      
      // Save a submission record
      await supabase
        .from('submissions')
        .insert({
          assignment_id: id,
          content: "Test submitted", // Placeholder for actual test content
          file_path: "", // Placeholder for file path if needed
          saved_at: new Date().toISOString()
        });
      
      // Update the assignment status to completed
      await updateAssignmentStatus(id, "completed", false, true);
      
      toast({
        title: "Success",
        description: "Your test has been successfully submitted!",
      });
      
      navigate("/candidate-dashboard");
    } catch (error) {
      console.error("Error submitting test:", error);
      toast({
        title: "Error",
        description: "Failed to submit your test. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
        <h1 className="mb-4 text-2xl font-bold">Assignment Not Found</h1>
        <p className="mb-6 text-muted-foreground">
          The assignment you're looking for doesn't exist or you don't have permission to access it.
        </p>
        <Button onClick={() => navigate("/candidate-dashboard")}>
          Back to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background px-4 md:px-6">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold">
            {assignment.test?.test_title || "Interview Workspace"}
          </h1>
          <div className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
            {assignment.status}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handleSubmitTest} disabled={submitting || assignment.status === "completed"}>
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : assignment.status === "completed" ? (
              "Already Submitted"
            ) : (
              "Submit Test"
            )}
          </Button>
        </div>
      </header>

      <div className="flex flex-1 flex-col md:grid md:grid-cols-[1fr_3fr] lg:grid-cols-[1fr_4fr]">
        {/* Instructions panel */}
        <div className="border-r p-4 overflow-y-auto">
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Instructions</h2>
            <div className="prose prose-sm max-w-none">
              <p>{assignment.test?.instructions || "No instructions provided."}</p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Time Limit:</span>
                <span className="font-medium">{assignment.test?.time_limit || 60} minutes</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Language:</span>
                <span className="font-medium">{assignment.test?.primary_language || "Not specified"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content area - placeholder for actual editor/workspace */}
        <div className="flex flex-1 flex-col p-4">
          <div className="border border-dashed rounded-lg bg-muted/40 flex flex-1 items-center justify-center p-8">
            <div className="text-center">
              <h3 className="text-lg font-medium mb-2">Editor Workspace</h3>
              <p className="text-sm text-muted-foreground mb-4">
                This is where the code editor and file explorer would be displayed.
                <br />
                Not implemented in this demo.
              </p>
              <Button 
                onClick={handleSubmitTest}
                disabled={submitting || assignment.status === "completed"}
                variant="default"
                size="lg"
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : assignment.status === "completed" ? (
                  "Already Submitted"
                ) : (
                  "Submit Test"
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewWorkspace;
