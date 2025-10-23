import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getAssignmentDetailsByAccessLink, updateAssignmentStatus } from "@/lib/test-management-utils";

const Welcome: React.FC = () => {
  const { accessLink } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [assignment, setAssignment] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAssignment = async () => {
      if (!accessLink) return;
      try {
        const data = await getAssignmentDetailsByAccessLink(accessLink);
        if (data) {
          setAssignment(data);
        } else {
          toast({ title: "Error", description: "Test not found", variant: "destructive" });
        }
      } catch (error) {
        toast({ title: "Error", description: "Failed to fetch test details", variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    };
    fetchAssignment();
  }, [accessLink, toast]);

  const handleStartTest = async () => {
    if (!assignment) return;
    try {
      await updateAssignmentStatus(accessLink, "in-progress", true, false);
      navigate(`/test/${accessLink}`);
    } catch (error) {
      toast({ title: "Error", description: "Failed to start the test", variant: "destructive" });
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <p>Test not found.</p>
      </div>
    );
  }

  return (
    <div className="h-screen w-full flex items-center justify-center bg-gray-50">
      <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-lg">
        <h1 className="text-3xl font-bold mb-4">Welcome to your test</h1>
        <p className="text-lg text-gray-600 mb-2">You have been invited to take the following test:</p>
        <p className="text-2xl font-semibold text-gray-800 mb-6">{assignment.Test.test_title}</p>
        <div className="text-left mb-6">
          <h2 className="text-xl font-semibold mb-2">Instructions</h2>
          <p className="text-gray-600 whitespace-pre-wrap">{assignment.Test.instructions}</p>
        </div>
        <div className="text-left mb-8">
          <h2 className="text-xl font-semibold mb-2">Time Limit</h2>
          <p className="text-gray-600">{assignment.Test.time_limit} minutes</p>
        </div>
        <Button onClick={handleStartTest} size="lg">
          Start Test
        </Button>
      </div>
    </div>
  );
};

export default Welcome;
