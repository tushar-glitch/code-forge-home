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
import { Bot } from "lucide-react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  Sandpack,
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
} from "@codesandbox/sandpack-react";
import { atomDark } from "@codesandbox/sandpack-themes";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  CheckCircle,
  XCircle,
  Code2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { SandpackFileExplorer } from "sandpack-file-explorer";
import {
  getAssignmentDetails,
  updateAssignmentStatus,
  getAssignmentDetailsByAccessLink,
} from "@/lib/test-management-utils";
import { WorkspaceHeader } from "@/components/workspace/WorkspaceHeader";
import { api } from "@/lib/api";

type ProjectFiles = Record<string, string>;

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
  text-align: center;
  padding: 20px;
}

h1 {
  color: #2563eb;
}`,
};

// ========================================
// Proctoring Agent Component
// ========================================
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

// ========================================
// Main Interview Workspace Component
// ========================================
const InterviewWorkspace = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, session } = useAuth();
  const { assignmentId } = useParams();
  const location = useLocation();

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
  const [accessLink, setAccessLink] = useState<string | null>(location.state?.accessLink || null);

  // ========================================
  // Load Assignment Data
  // ========================================
  useEffect(() => {
    const loadAssignment = async () => {
      console.log("🔹 loadAssignment triggered for assignmentId:", assignmentId);
      setIsLoading(true);
      try {
        let assignmentDetails;

        if (user) {
          // Authenticated user: fetch by assignmentId
          console.log("🔹 Logged-in recruiter flow");
          assignmentDetails = await getAssignmentDetails(parseInt(assignmentId!));
        } else {
          // Unauthenticated user: fetch by accessLink
          console.log("🔹 Candidate flow using access link");
          const accessLinkFromState = location.state?.accessLink;
          if (accessLinkFromState) {
            assignmentDetails = await getAssignmentDetailsByAccessLink(accessLinkFromState);
          } else {
            throw new Error("Access link not found in state");
          }
        }

        console.log("✅ Assignment details loaded:", assignmentDetails);

        if (!assignmentDetails) throw new Error("Assignment not found");

        setAssignmentData(assignmentDetails);
        setAccessLink(assignmentDetails.access_link);

        // Update status to in-progress if pending
        if (assignmentDetails.status === "pending") {
          console.log("🔹 Updating assignment status to in-progress...");
          if (user) {
            await updateAssignmentStatus(parseInt(assignmentId!), "in-progress", true, false);
          } else if (assignmentDetails.access_link) {
            await updateAssignmentStatus(assignmentDetails.access_link, "in-progress", true, false);
          }
          console.log("✅ Status updated to in-progress");
        }

        // Load project files from Test.files_json
        if (assignmentDetails.Test?.files_json) {
          try {
            const filesData = assignmentDetails.Test.files_json;
            if (filesData !== null) {
              const parsedFiles =
                typeof filesData === "string" ? JSON.parse(filesData) : filesData;

              if (parsedFiles && typeof parsedFiles === "object") {
                setProjectFiles(parsedFiles as ProjectFiles);
                const firstFilePath = Object.keys(parsedFiles)[0];
                if (firstFilePath) setActiveFile(firstFilePath);
              }
            }
          } catch (e) {
            console.error("Error parsing project files:", e);
            toast({
              title: "Error",
              description: "Failed to load project files from test configuration",
              variant: "destructive",
            });
          }
        }

        // Load existing submissions (only for authenticated users)
        if (user) {
          const submissions = await api.get<any[]>(
            `/submissions?assignment_id=${assignmentId}`,
            session?.token
          );

          if (submissions && submissions.length > 0) {
            const latestSubmission = submissions[0];
            setSubmissionId(latestSubmission.id);

            if (latestSubmission.test_status) {
              setTestStatus(latestSubmission.test_status as "pending" | "running" | "passed" | "failed" | "not_run");
            }

            if (latestSubmission.test_results) {
              setTestResults(latestSubmission.test_results);
            }

            // Load saved code from previous submission
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
      } catch (error: any) {
        console.error("❌ Error loading assignment:", error);
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
  }, [user, assignmentId, location.state?.accessLink, session?.token, toast]);

  // ========================================
  // Poll Test Results (NEW EXEC API)
  // ========================================
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (testStatus === "running" && submissionId) {
      interval = setInterval(async () => {
        try {
          const res = await api.get<any>(`/exec/status/${submissionId}`);
          console.log("📊 Polling test status:", res);

          if (res && res.test_status && res.test_status !== "pending" && res.test_status !== "running") {
            setTestStatus(res.test_status as "pending" | "running" | "passed" | "failed" | "not_run");
            setTestResults(res.results);
            clearInterval(interval);
            
            toast({
              title: res.test_status === "passed" ? "Tests Passed! ✅" : "Tests Failed",
              description: res.test_status === "passed" 
                ? "All tests passed successfully!" 
                : "Some tests failed. Check the results below.",
              variant: res.test_status === "passed" ? "default" : "destructive",
            });
          }
        } catch (err) {
          console.error("❌ Error polling test results:", err);
          setTestStatus("failed");
          clearInterval(interval);
        }
      }, 3000); // Poll every 3 seconds
    }

    return () => clearInterval(interval);
  }, [testStatus, submissionId, toast]);

  // ========================================
  // Auto-save Project Files
  // ========================================
  useEffect(() => {
    if (!assignmentId || !assignmentData) return;

    const saveTimeout = setTimeout(async () => {
      setAutosaveStatus("saving");
      try {
        await api.post<any>(
          `/submissions`,
          {
            assignment_id: parseInt(assignmentId),
            content: JSON.stringify(projectFiles),
            saved_at: new Date().toISOString(),
          },
          session?.token
        );
        setAutosaveStatus("saved");
      } catch (error) {
        console.error("❌ Error saving submission:", error);
        setAutosaveStatus("error");
      }
    }, 2000); // Debounce 2 seconds

    return () => clearTimeout(saveTimeout);
  }, [projectFiles, assignmentId, assignmentData, session?.token]);

  // ========================================
  // Run Tests (NEW EXEC API)
  // ========================================
  const runTests = async () => {
    if (!assignmentData?.Test?.id) {
      toast({
        title: "Error",
        description: "Test configuration not loaded correctly.",
        variant: "destructive",
      });
      return;
    }

    console.log("🔹 runTests triggered");
    console.log("Frontend sending assignmentId (TestAssignment.id):", assignmentData.id);
    console.log("Frontend sending projectId (Test.id):", assignmentData.Test.id);

    setTestStatus("running");
    setTestResults(null);

    try {
      const payload = {
        assignmentId: assignmentData.id,
        files: projectFiles,
        projectId: assignmentData.Test.id,
      };
      
      console.log("📤 Frontend sending payload:", payload);
      
      const response = await api.post<any>("/exec/submit", payload);

      console.log("✅ Test execution started:", response);
      
      setSubmissionId(response.submissionId);

      toast({
        title: "Tests Started",
        description: "Your code is being tested. Results will appear shortly.",
      });
    } catch (error) {
      console.error("❌ Error running tests:", error);
      setTestStatus("failed");
      toast({
        title: "Error",
        description: "Failed to start tests. Please try again.",
        variant: "destructive",
      });
    }
  };

  // ========================================
  // Submit Final Assignment
  // ========================================
  const handleSubmit = async () => {
    if (!assignmentId && !accessLink) {
      toast({
        title: "Error",
        description: "Assignment information is missing.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Create final submission if not exists
      let finalSubmissionId = submissionId;

      if (!finalSubmissionId) {
        const submission = await api.post<any>(
          `/submissions`,
          {
            assignment_id: assignmentId ? parseInt(assignmentId) : null,
            access_link: accessLink || null,
            content: JSON.stringify(projectFiles),
            saved_at: new Date().toISOString(),
          },
          session?.token
        );
        finalSubmissionId = submission.id;
        setSubmissionId(finalSubmissionId);
      }

      // Run tests if not already run
      if (testStatus === "not_run" || testStatus === "pending") {
        await runTests();
      }

      // Mark assignment as completed
      if (user && assignmentId) {
        await updateAssignmentStatus(parseInt(assignmentId), "completed", false, true);
      } else if (accessLink) {
        await updateAssignmentStatus(accessLink, "completed", false, true);
      }

      toast({
        title: "Submission Successful",
        description: "Your work has been submitted for review.",
      });

      setTimeout(() => {
        if (user) {
          navigate("/candidate-dashboard");
        } else {
          toast({
            title: "Thank You!",
            description: "Your submission has been recorded. You can close this window.",
          });
        }
      }, 2000);
    } catch (error) {
      console.error("❌ Error submitting assignment:", error);
      toast({
        title: "Error",
        description: "Failed to submit your work. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  // ========================================
  // Editor Resize Handler
  // ========================================
  const handleDragStart = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setStartY(e.clientY);
    setStartHeight(editorHeight);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaY = e.clientY - startY;
      const newHeight = Math.max(200, Math.min(startHeight + deltaY, window.innerHeight - 200));
      setEditorHeight(newHeight);
    };

    const handleMouseUp = () => setIsDragging(false);

    if (isDragging) {
      document.body.style.cursor = "row-resize";
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.body.style.cursor = "";
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, startY, startHeight]);

  // ========================================
  // Loading State
  // ========================================
  if (isLoading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin mb-4" />
        <p>Loading workspace...</p>
      </div>
    );
  }

  // ========================================
  // Main Render
  // ========================================
  return (
    <div className="flex flex-col h-screen">
      {/* Proctoring Agent (WebSocket-based AI questions) */}
      <ProctoringAgent accessLink={accessLink} projectFiles={projectFiles} />

      {/* Header with auto-save status and submission button */}
      <WorkspaceHeader
        testTitle={assignmentData?.Test?.test_title || "Coding Test"}
        autosaveStatus={autosaveStatus}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />

      <div className="flex-1 flex flex-col min-h-0">
        {/* Sandpack Code Editor */}
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
        >
          <SandpackLayout>
            <div
              style={{
                display: "flex",
                width: "100%",
                height: `${editorHeight}px`,
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
              <div style={{ flex: 1 }}>
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
                />
              </div>
            </div>

            {/* Resize Handle */}
            <div
              style={{
                width: "100%",
                height: "8px",
                backgroundColor: "#2d2d2d",
                cursor: "row-resize",
              }}
              onMouseDown={handleDragStart}
            >
              <div
                style={{
                  width: "100%",
                  height: "4px",
                  backgroundColor: "#404040",
                  margin: "2px 0",
                }}
              />
            </div>

            {/* Preview Panel */}
            <SandpackPreview
              showNavigator
              showRefreshButton
              showOpenInCodeSandbox={false}
            />
          </SandpackLayout>
        </SandpackProvider>

        {/* Test Results Section */}
        <div className="border-t border-border p-4 bg-background">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Test Results</h2>
            <Button onClick={runTests} disabled={testStatus === "running"}>
              {testStatus === "running" && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {testStatus === "passed" && (
                <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
              )}
              {testStatus === "failed" && (
                <XCircle className="mr-2 h-4 w-4 text-red-500" />
              )}
              {testStatus === "running" ? "Running Tests..." : "Run Tests"}
            </Button>
          </div>

          {testStatus !== "not_run" && (
            <div
              className={`p-4 rounded-md ${
                testStatus === "passed"
                  ? "bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800"
                  : testStatus === "failed"
                  ? "bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800"
                  : "bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800"
              }`}
            >
              <div className="flex items-center mb-2">
                {testStatus === "passed" && (
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                )}
                {testStatus === "failed" && (
                  <XCircle className="h-5 w-5 text-red-500 mr-2" />
                )}
                {testStatus === "running" && (
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                )}
                {testStatus === "pending" && (
                  <Code2 className="h-5 w-5 mr-2" />
                )}
                <span className="font-medium capitalize">{testStatus}</span>
              </div>

              {testResults && (
                <div className="mt-4">
                  <h3 className="font-medium mb-2">Test Details:</h3>
                  <pre className="bg-gray-800 text-white p-3 rounded text-sm overflow-auto max-h-60">
                    {JSON.stringify(testResults, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InterviewWorkspace;