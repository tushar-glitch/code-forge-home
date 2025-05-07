
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, CheckCircle, XCircle, Clock } from "lucide-react";
import { format } from "date-fns";

interface TestResultsViewProps {
  assignmentId: number;
  submissionId?: number;
}

interface TestResult {
  id: string;
  status: "pending" | "running" | "passed" | "failed";
  test_output: any;
  logs: string;
  screenshot_urls: string[];
  created_at: string;
}

export function TestResultsView({ assignmentId, submissionId }: TestResultsViewProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [testResults, setTestResults] = useState<TestResult[]>([]);

  useEffect(() => {
    const loadTestResults = async () => {
      setIsLoading(true);
      try {
        let query = supabase
          .from("test_results")
          .select("*")
          .eq("assignment_id", assignmentId)
          .order("created_at", { ascending: false });

        if (submissionId) {
          query = query.eq("submission_id", submissionId);
        }

        const { data, error } = await query;

        if (error) throw error;
        setTestResults(data || []);
      } catch (error) {
        console.error("Error loading test results:", error);
        toast({
          title: "Error",
          description: "Failed to load test results",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (assignmentId) {
      loadTestResults();
    }
  }, [assignmentId, submissionId, toast]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-6">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (testResults.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <div className="mb-4">
          <Clock className="h-12 w-12 mx-auto text-muted-foreground/50" />
        </div>
        <h3 className="text-lg font-medium">No Test Results Available</h3>
        <p className="max-w-md mx-auto mt-2">
          No automated tests have been run for this submission yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {testResults.map((result) => (
        <Card key={result.id}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">
                Test Results
                <span className="text-sm font-normal ml-4 text-muted-foreground">
                  {format(new Date(result.created_at), "MMM d, yyyy h:mm a")}
                </span>
              </CardTitle>
              <StatusBadge status={result.status} />
            </div>
          </CardHeader>
          <CardContent>
            {/* Test Output */}
            {result.test_output && (
              <div className="mb-4">
                <h4 className="font-medium mb-2">Test Output</h4>
                <pre className="bg-muted p-4 rounded-md overflow-auto text-sm max-h-60">
                  {JSON.stringify(result.test_output, null, 2)}
                </pre>
              </div>
            )}

            {/* Logs */}
            {result.logs && (
              <div>
                <h4 className="font-medium mb-2">Logs</h4>
                <pre className="bg-muted p-4 rounded-md overflow-auto text-sm max-h-60 whitespace-pre-wrap">
                  {result.logs}
                </pre>
              </div>
            )}

            {/* Screenshots */}
            {result.screenshot_urls && result.screenshot_urls.length > 0 && (
              <div className="mt-4">
                <h4 className="font-medium mb-2">Screenshots</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {result.screenshot_urls.map((url, index) => (
                    <div key={index} className="border rounded-md overflow-hidden">
                      <img src={url} alt={`Test screenshot ${index + 1}`} className="w-full" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case "passed":
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
          <CheckCircle className="h-3 w-3 mr-1" /> Passed
        </Badge>
      );
    case "failed":
      return (
        <Badge className="bg-red-100 text-red-800 hover:bg-red-200">
          <XCircle className="h-3 w-3 mr-1" /> Failed
        </Badge>
      );
    case "running":
      return (
        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
          <Loader2 className="h-3 w-3 mr-1 animate-spin" /> Running
        </Badge>
      );
    case "pending":
    default:
      return (
        <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">
          <Clock className="h-3 w-3 mr-1" /> Pending
        </Badge>
      );
  }
}
