import React, { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate, useParams, useLocation } from "react-router-dom";
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
// import { supabase } from "@/integrations/supabase/client"; // Removed Supabase import
import { useAuth } from "@/context/AuthContext";
import { SandpackFileExplorer } from "sandpack-file-explorer";
import {
  getAssignmentDetails,
  updateAssignmentStatus,
  getAssignmentDetailsByAccessLink,
} from "@/lib/test-management-utils";
import { WorkspaceHeader } from "@/components/workspace/WorkspaceHeader";
import { api } from "@/lib/api"; // Import our new API client

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

const ProctoringAgent = ({ accessLink, projectFiles }) => {
  const { toast } = useToast();
  const [aiQuestion, setAiQuestion] = useState<string | null>(null);
  const [answer, setAnswer] = useState("");
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!accessLink) return;

    const wsUrl = `ws://localhost:3001?accessLink=${accessLink}`;
    ws.current = new WebSocket(wsUrl);

    ws.current.onopen = () => {
      console.log("WebSocket connection established");
    };

    ws.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === "request.code.snapshot") {
        ws.current?.send(
          JSON.stringify({
            type: "code.snapshot",
            payload: { files: projectFiles },
          })
        );
      } else if (message.type === "question") {
        setAiQuestion(message.payload.question);
      }
    };

    ws.current.onclose = () => {
      console.log("WebSocket connection closed");
    };

    ws.current.onerror = (error) => {
      console.error("WebSocket error:", error);
      toast({
        title: "Proctoring Error",
        description: "Connection to the proctoring service was lost.",
        variant: "destructive",
      });
    };

    return () => {
      ws.current?.close();
    };
  }, [accessLink, projectFiles, toast]);

  const handleSendAnswer = () => {
    if (!answer.trim()) {
      toast({
        title: "Empty Answer",
        description: "Please provide an answer.",
        variant: "destructive",
      });
      return;
    }
    ws.current?.send(
      JSON.stringify({
        type: "answer",
        payload: { question: aiQuestion, answer },
      })
    );
    setAiQuestion(null);
    setAnswer("");
  };

  return (
    <Dialog open={!!aiQuestion} onOpenChange={() => setAiQuestion(null)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Bot className="mr-2" /> AI Proctor Question
          </DialogTitle>
          <DialogDescription>{aiQuestion}</DialogDescription>
        </DialogHeader>
        <Textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Type your answer here..."
        />
        <DialogFooter>
          <Button onClick={handleSendAnswer}>Send Answer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const InterviewWorkspace = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, session } = useAuth();
  const { assignmentId } = useParams();

  const [isLoading, setIsLoading] = useState(true);
  const [projectFiles, setProjectFiles] = useState<ProjectFiles>(defaultFiles);
  const [activeFile, setActiveFile] = useState("/App.js");
  const [assignmentData, setAssignmentData] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [editorHeight, setEditorHeight] = useState(300);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [startHeight, setStartHeight] = useState(0);
  const [autosaveStatus, setAutosaveStatus] = useState<"saved" | "saving" | "error">("saved");
  const [testStatus, setTestStatus] = useState<"pending" | "running" | "passed" | "failed" | "not_run">("not_run");
  const [testResults, setTestResults] = useState<any>(null);
  const [submissionId, setSubmissionId] = useState<number | null>(null);
  const { state } = useLocation();
  const [accessLink, setAccessLink] = useState<string | null>(state?.accessLink || null);

  useEffect(() => {
    const loadAssignment = async () => {
      setIsLoading(true);
      try {
        if (assignmentId) {
          let assignmentDetails;
          const accessLinkFromState = state?.accessLink;

          if (user) {
            // Authenticated user: fetch by assignmentId
            assignmentDetails = await getAssignmentDetails(parseInt(assignmentId));
          } else if (accessLinkFromState) {
            // Unauthenticated user: fetch by accessLink passed in state
            assignmentDetails = await getAssignmentDetailsByAccessLink(accessLinkFromState);
          } else {
            throw new Error("Assignment details or access link not found.");
          }

          if (!assignmentDetails) {
            throw new Error("Assignment not found");
          }

          setAssignmentData(assignmentDetails);
          setAccessLink(assignmentDetails.access_link); // Store accessLink
          console.log('assignmentDetails:', assignmentDetails);
          console.log('assignmentDetails.test?.project_id:', assignmentDetails.test?.project_id);

          // Mark the assignment as started if not already
          if (assignmentDetails.status === "pending") {
            if (user) {
              await updateAssignmentStatus(
                parseInt(assignmentId),
                "in-progress",
                true,
                false
              );
            } else if (assignmentDetails.access_link) {
              await updateAssignmentStatus(
                assignmentDetails.access_link,
                "in-progress",
                true,
                false
              );
            }
          }

          // Initialize project files from assignmentData.Test.files_json
          if (assignmentDetails.Test?.files_json) {
            try {
              const filesData = assignmentDetails.Test.files_json;
              if (filesData !== null) {
                const parsedFiles =
                  typeof filesData === "string"
                    ? JSON.parse(filesData)
                    : filesData;

                if (parsedFiles && typeof parsedFiles === "object") {
                  setProjectFiles(parsedFiles as ProjectFiles);
                  const firstFilePath = Object.keys(parsedFiles)[0];
                  if (firstFilePath) setActiveFile(firstFilePath);
                }
              }
            } catch (e) {
              console.error("Error parsing project files from assignmentDetails.Test.files_json:", e);
              toast({
                title: "Error",
                description: "Failed to load project files from test configuration",
                variant: "destructive",
              });
            }
          }

          // Only check for existing submissions if the user is authenticated
          if (user) {
            const submissions = await api.get<any[]>(
              `/submissions?assignment_id=${assignmentId}`,
              session?.token
            );

            // If there are submissions, load the most recent one
            if (submissions && submissions.length > 0) {
              const latestSubmission = submissions[0];
              setSubmissionId(latestSubmission.id);

              // Load test status if available
              if (latestSubmission.test_status) {
                setTestStatus(latestSubmission.test_status as "pending" | "running" | "passed" | "failed" | "not_run");
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
        }
      } catch (error) {
        console.error("Error loading assignment:", error);
        toast({
          title: "Error",
          description: error.message || "Failed to load the assignment data",
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

    if (testStatus === 'running' && submissionId) {
      interval = setInterval(async () => {
        try {
          const res = await api.get<any>(`/exec/status/${submissionId}`);
          if (res && res.status !== 'running' && res.test_status !== 'pending') {
            setTestStatus(res.test_status as | 'pending'| 'running'| 'passed'| 'failed'| 'not_run');
            setTestResults(res.results);
            clearInterval(interval);
          }
        } catch (err) {
          console.error('Error polling test results:', err);
          setTestStatus('failed');
          clearInterval(interval);
        }
      }, 3000); // Poll every 3 seconds
    }

    return () => clearInterval(interval);
  }, [testStatus, submissionId]);

  const runTests = async () => {
    if (!assignmentId || !assignmentData?.Test?.id) {
      toast({
        title: 'Error',
        description: 'Assignment details not loaded correctly.',
        variant: 'destructive',
      });
      return;
    }
    console.log('Frontend sending assignmentId (TestAssignment.id):', assignmentData.id);
    console.log('Frontend sending projectId (Test.id):', assignmentData.Test.id);

    setTestStatus('running');
    setTestResults(null);

    try {
      const payload = {
        assignmentId: assignmentData.id,
        files: projectFiles,
        projectId: assignmentData.Test.id,
      };
      console.log('Frontend sending payload:', payload);
      const response = await api.post<any>('/exec/submit', payload);

      setSubmissionId(response.submissionId);

      toast({
        title: 'Tests Started',
        description: 'Your code is being tested. Results will appear shortly.',
      });
    } catch (error) {
      console.error('Error running tests:', error);
      setTestStatus('failed');
      toast({
        title: 'Error',
        description: 'Failed to start tests. Please try again.',
        variant: 'destructive',
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
        const submission = await api.post<any>(
          `/submissions`,
          {
            assignment_id: parseInt(assignmentId),
            content: JSON.stringify(projectFiles),
            saved_at: new Date().toISOString(),
            accessLink: accessLink,
          },
          session?.token
        );
  
        finalSubmissionId = submission.id;
      }
      
      // Run tests if they haven't been run yet
      if (testStatus === "not_run" || testStatus === "pending") {
        await runTests();
      }
      
      // Mark the assignment as completed
      const updated = await updateAssignmentStatus(
        accessLink, // Use the accessLink state variable
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

  // Simplified drag handlers
  const handleDragStart = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setStartY(e.clientY);
    setStartHeight(editorHeight);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      e.preventDefault();
      const deltaY = e.clientY - startY;
      const newHeight = Math.max(200, Math.min(startHeight + deltaY, window.innerHeight - 200));
      setEditorHeight(newHeight);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.body.style.cursor = 'row-resize';
      document.body.style.userSelect = 'none';
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, startY, startHeight]);

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
      <ProctoringAgent accessLink={accessLink} projectFiles={projectFiles} />
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
            onFilesChange={setProjectFiles}
            onActiveFileChange={setActiveFile}
          >
            <SandpackLayout>
              <div
                style={{
                  display: "flex",
                  width: "100%",
                  height: `${editorHeight}px`,
                  backgroundColor: `var(--sp-colors-surface1)`,
                  position: 'relative',
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
                      height: "100%",
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
              
              <div
                style={{
                  width: "100%",
                  height: "8px",
                  backgroundColor: "#2d2d2d",
                  cursor: "row-resize",
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderTop: "1px solid #404040",
                  borderBottom: "1px solid #404040",
                  userSelect: "none",
                }}
                onMouseDown={handleDragStart}
              >
                <div
                  style={{
                    width: "100%",
                    height: "4px",
                    backgroundColor: "#404040",
                  }}
                />
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
              className={testStatus === "passed" ? "bg-green-600 hover:bg-green-700" : ""}
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