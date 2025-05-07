
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Sandpack,
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
  SandpackConsole,
} from "@codesandbox/sandpack-react";
import { atomDark } from "@codesandbox/sandpack-themes";
import { Button } from "@/components/ui/button";
import { Loader2, Bot, Code2, MessageSquare, Sparkles, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { SandpackFileExplorer } from "sandpack-file-explorer";
import {
  getAssignmentDetails,
  updateAssignmentStatus,
} from "@/lib/test-management-utils";
import { WorkspaceHeader } from "@/components/workspace/WorkspaceHeader";

// Type definition for project files
type ProjectFiles = Record<string, string>;

// Default template files if no project is loaded
const defaultFiles: ProjectFiles = {
  "/App.js": `import React from 'react';
  
export default function App() {
  return (
    <div className="App">
      <h1>Hello there!</h1>
      <p>Start editing to see your changes reflected in the preview.</p>
    </div>
  );
}`,
  "/index.js": `import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles.css';

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(<App />);`,
  "/styles.css": `body {
  margin: 0;
  padding: 0;
  font-family: system-ui, sans-serif;
}

.App {
  font-family: sans-serif;
  text-align: center;
  padding: 20px;
}

h1 {
  color: #2563eb;
}`,
};

const InterviewWorkspace = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { assignmentId } = useParams();

  const [isLoading, setIsLoading] = useState(true);
  const [projectFiles, setProjectFiles] = useState<ProjectFiles>(defaultFiles);
  const [activeFile, setActiveFile] = useState("/App.js");
  const [assignmentData, setAssignmentData] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [projectData, setProjectData] = useState<any>(null);
  const [autosaveStatus, setAutosaveStatus] = useState<"saved" | "saving" | "error">("saved");
  const [testStatus, setTestStatus] = useState<"pending" | "running" | "passed" | "failed" | "not_run">("not_run");
  const [testResults, setTestResults] = useState<any>(null);
  const [submissionId, setSubmissionId] = useState<number | null>(null);

  useEffect(() => {
    // Check if user is authenticated
    if (!user) {
      navigate("/signin");
      return;
    }

    const loadAssignment = async () => {
      setIsLoading(true);
      try {
        // If we have an assignmentId, fetch the assignment
        if (assignmentId) {
          const assignmentDetails = await getAssignmentDetails(
            parseInt(assignmentId)
          );

          if (!assignmentDetails) {
            throw new Error("Assignment not found");
          }

          setAssignmentData(assignmentDetails);

          // Mark the assignment as started if not already
          if (assignmentDetails.status === "pending") {
            await updateAssignmentStatus(
              parseInt(assignmentId),
              "in-progress",
              true,
              false
            );
          }

          // Get the project data for this test
          if (assignmentDetails.test?.project_id) {
            const { data: project, error: projectError } = await supabase
              .from("code_projects")
              .select("*")
              .eq("id", assignmentDetails.test.project_id)
              .single();

            if (projectError) throw projectError;
            setProjectData(project);

            // Load project files from project data if available
            if (project.files_json) {
              try {
                const filesData = project.files_json;
                if (filesData !== null) {
                  // Handle the case where files_json is already an object
                  const parsedFiles =
                    typeof filesData === "string"
                      ? JSON.parse(filesData)
                      : filesData;

                  if (parsedFiles && typeof parsedFiles === "object") {
                    setProjectFiles(parsedFiles as ProjectFiles);
                    // Set active file to the first file
                    const firstFilePath = Object.keys(parsedFiles)[0];
                    if (firstFilePath) setActiveFile(firstFilePath);
                  }
                }
              } catch (e) {
                console.error("Error parsing project files:", e);
                toast({
                  title: "Error",
                  description: "Failed to load project files",
                  variant: "destructive",
                });
              }
            }
          }

          // Check for existing submissions
          const { data: submissions, error: submissionsError } = await supabase
            .from("submissions")
            .select("*")
            .eq("assignment_id", parseInt(assignmentId))
            .order("created_at", { ascending: false });

          if (submissionsError) throw submissionsError;

          // If there are submissions, load the most recent one
          if (submissions && submissions.length > 0) {
            const latestSubmission = submissions[0];
            setSubmissionId(latestSubmission.id);
            
            // Load test status if available
            if (latestSubmission.test_status) {
              setTestStatus(latestSubmission.test_status);
            }
            
            // Load test results if available
            if (latestSubmission.test_results) {
              setTestResults(latestSubmission.test_results);
            }

            try {
              if (latestSubmission.content) {
                const contentStr = String(latestSubmission.content);
                const parsedContent = JSON.parse(contentStr);
                if (typeof parsedContent === "object") {
                  setProjectFiles(parsedContent as ProjectFiles);
                }
              }
            } catch (e) {
              // Handle single file content format
              if (latestSubmission.file_path && latestSubmission.content) {
                const filePath = String(latestSubmission.file_path);
                const content = String(latestSubmission.content);
                setProjectFiles((prev) => ({
                  ...prev,
                  [filePath]: content,
                }));
              }
            }
          }
        }
      } catch (error) {
        console.error("Error loading assignment:", error);
        toast({
          title: "Error",
          description: "Failed to load the assignment data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadAssignment();
  }, [user, assignmentId, navigate, toast]);

  // Poll for test results if tests are running
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (testStatus === "running" && submissionId) {
      interval = setInterval(async () => {
        try {
          const { data: submission, error } = await supabase
            .from("submissions")
            .select("test_status, test_results")
            .eq("id", submissionId)
            .single();
            
          if (error) throw error;
          
          if (submission && submission.test_status !== "running") {
            setTestStatus(submission.test_status);
            setTestResults(submission.test_results);
            clearInterval(interval);
          }
        } catch (err) {
          console.error("Error polling test results:", err);
        }
      }, 5000); // Poll every 5 seconds
    }
    
    return () => clearInterval(interval);
  }, [testStatus, submissionId]);

  // Handle file change
  const handleFileChange = async (files: ProjectFiles) => {
    // Automatically save content to Supabase when files change
    setAutosaveStatus("saving");
    if (assignmentId) {
      try {
        const { data: submission, error } = await supabase.from("submissions").insert({
          assignment_id: parseInt(assignmentId),
          content: JSON.stringify(files),
          saved_at: new Date().toISOString(),
        }).select().single();

        if (error) throw error;
        
        setSubmissionId(submission.id);
        setAutosaveStatus("saved");
      } catch (error) {
        console.error("Error saving submission:", error);
        setAutosaveStatus("error");
      }
    }
  };

  const runTests = async () => {
    if (!submissionId || !assignmentId) {
      toast({
        title: "Error",
        description: "Cannot run tests without a valid submission",
        variant: "destructive",
      });
      return;
    }
    
    setTestStatus("running");
    
    try {
      // Update the submission test status
      await supabase
        .from("submissions")
        .update({ test_status: "running" })
        .eq("id", submissionId);
        
      // Call the edge function to create GitHub repo and run tests
      const { data, error } = await supabase.functions.invoke("create-github-repo", {
        body: {
          assignment_id: parseInt(assignmentId),
          submission_id: submissionId,
          project_files: projectFiles,
          test_id: assignmentData.test.id
        }
      });
      
      if (error) throw error;
      
      toast({
        title: "Tests Started",
        description: "Your code is being tested. Results will appear shortly.",
      });
      
    } catch (error) {
      console.error("Error running tests:", error);
      setTestStatus("not_run");
      toast({
        title: "Error",
        description: "Failed to run tests. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async () => {
    if (!assignmentId) {
      toast({
        title: "Info",
        description:
          "This is just a demo. In a real test, your work would be submitted for review.",
      });
      // In a demo, just navigate back to the dashboard
      setTimeout(() => navigate("/candidate-dashboard"), 2000);
      return;
    }

    setIsSubmitting(true);
    try {
      // Create a final submission with current files if one doesn't exist
      let finalSubmissionId = submissionId;
      
      if (!finalSubmissionId) {
        const { data: submission, error: submissionError } = await supabase
          .from("submissions")
          .insert({
            assignment_id: parseInt(assignmentId),
            content: JSON.stringify(projectFiles),
            saved_at: new Date().toISOString(),
          })
          .select()
          .single();
  
        if (submissionError) throw submissionError;
        finalSubmissionId = submission.id;
      }
      
      // Run tests if they haven't been run yet
      if (testStatus === "not_run" || testStatus === "pending") {
        await runTests();
      }
      
      // Mark the assignment as completed
      const updated = await updateAssignmentStatus(
        parseInt(assignmentId),
        "completed",
        false,
        true
      );

      if (!updated) {
        throw new Error("Failed to update assignment status");
      }

      toast({
        title: "Submission Successful",
        description: "Your work has been submitted for review.",
      });

      // Redirect to the candidate dashboard
      setTimeout(() => navigate("/candidate-dashboard"), 2000);
    } catch (error) {
      console.error("Error submitting assignment:", error);
      toast({
        title: "Error",
        description: "Failed to submit your work. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Header with auto-save status and submission button */}
      <WorkspaceHeader 
        testTitle={assignmentData?.test?.test_title || "Coding Test"} 
        autosaveStatus={autosaveStatus} 
        onSubmit={handleSubmit} 
        isSubmitting={isSubmitting}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Sandpack Editor */}
        <div className="flex-1 min-h-0 overflow-hidden">
          <SandpackProvider
            theme={atomDark}
            files={projectFiles}
            template="react"
            customSetup={{
              dependencies: {
                react: "^18.0.0",
                "react-dom": "^18.0.0",
              },
            }}
            autorun
          >
            <SandpackLayout>
              <div
                style={{
                  display: "flex",
                  width: "100%",
                  minHeight: "300px",
                  height: "100%",
                  backgroundColor: `var(--sp-colors-surface1)`,
                }}
              >
                <div
                  style={{
                    minWidth: 150,
                    maxWidth: "300px",
                    overflow: "hidden",
                  }}
                >
                  <SandpackFileExplorer />
                </div>
                <div style={{ flex: "min-content" }}>
                  <SandpackCodeEditor
                    showLineNumbers={true}
                    style={{
                      minHeight: "100%",
                      maxHeight: "100%",
                      overflow: "auto",
                    }}
                    showInlineErrors
                    showTabs
                    wrapContent
                    closableTabs
                    className="flex-1 h-full"
                  />
                </div>
              </div>
              <SandpackPreview
                showNavigator={true}
                showRefreshButton
                showOpenInCodeSandbox={false}
              />
            </SandpackLayout>
          </SandpackProvider>
        </div>

        {/* Test Results Section */}
        <div className="border-t border-border p-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Test Results</h2>
            <Button 
              onClick={runTests} 
              disabled={testStatus === "running"} 
              variant={testStatus === "passed" ? "success" : "default"}
            >
              {testStatus === "running" && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {testStatus === "passed" && <CheckCircle className="mr-2 h-4 w-4" />}
              {testStatus === "failed" && <XCircle className="mr-2 h-4 w-4" />}
              {testStatus === "running" ? "Running Tests..." : "Run Tests"}
            </Button>
          </div>
          
          {/* Test Status */}
          {testStatus !== "not_run" && (
            <div className="mt-4">
              <div className={`p-4 rounded-md ${
                testStatus === "passed" ? "bg-green-100 border border-green-200" : 
                testStatus === "failed" ? "bg-red-100 border border-red-200" :
                "bg-gray-100 border border-gray-200"
              }`}>
                <div className="flex items-center">
                  {testStatus === "passed" && <CheckCircle className="h-5 w-5 text-green-500 mr-2" />}
                  {testStatus === "failed" && <XCircle className="h-5 w-5 text-red-500 mr-2" />}
                  {testStatus === "running" && <Loader2 className="h-5 w-5 animate-spin mr-2" />}
                  {testStatus === "pending" && <Code2 className="h-5 w-5 mr-2" />}
                  <span className="font-medium capitalize">{testStatus}</span>
                </div>
                
                {testResults && (
                  <div className="mt-4">
                    <h3 className="font-medium mb-2">Test Details:</h3>
                    <pre className="bg-gray-800 text-white p-3 rounded text-sm overflow-auto max-h-40">
                      {JSON.stringify(testResults, null, 2)}
                    </pre>
                  </div>
                )}
                
                {testStatus === "running" && (
                  <p className="text-sm mt-2">Tests are running. This might take a few moments...</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InterviewWorkspace;
