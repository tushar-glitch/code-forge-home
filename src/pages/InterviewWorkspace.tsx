import React, { useState, useEffect } from "react";
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
  const [projectData, setProjectData] = useState<any>(null);
  const [editorHeight, setEditorHeight] = useState(300);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [startHeight, setStartHeight] = useState(0);
  const [autosaveStatus, setAutosaveStatus] = useState<"saved" | "saving" | "error">("saved");
  const [testStatus, setTestStatus] = useState<"pending" | "running" | "passed" | "failed" | "not_run">("not_run");
  const [testResults, setTestResults] = useState<any>(null);
  const [submissionId, setSubmissionId] = useState<number | null>(null);
  const [accessLink, setAccessLink] = useState<string | null>(location.state?.accessLink || null);

  // Load assignment (handles both recruiter + candidate flows)
  useEffect(() => {
    const loadAssignment = async () => {
      console.log("🔹 loadAssignment triggered for assignmentId:", assignmentId);
      setIsLoading(true);
      try {
        let assignmentDetails;

        if (user) {
          console.log("🔹 Logged-in recruiter flow");
          assignmentDetails = await getAssignmentDetails(parseInt(assignmentId!));
        } else {
          console.log("🔹 Candidate flow using access link");
          assignmentDetails = await getAssignmentDetailsByAccessLink(accessLink || assignmentId!);
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

        // Load project files
        if (assignmentDetails.test?.project_id) {
          const project = await api.get<any>(
            `/code-projects/${assignmentDetails.test.project_id}`,
            session?.token
          );

          setProjectData(project);

          if (project.files_json) {
            const filesData = project.files_json;
            const parsedFiles = typeof filesData === "string" ? JSON.parse(filesData) : filesData;
            setProjectFiles(parsedFiles);
            const firstFilePath = Object.keys(parsedFiles)[0];
            if (firstFilePath) setActiveFile(firstFilePath);
          }
        }

        // Load any existing submissions
        const submissions = await api.get<any[]>(
          `/submissions?assignment_id=${assignmentId}`,
          session?.token
        );

        if (submissions?.length > 0) {
          const latest = submissions[0];
          setSubmissionId(latest.id);
          if (latest.test_status) setTestStatus(latest.test_status);
          if (latest.test_results) setTestResults(latest.test_results);

          try {
            if (latest.content) {
              const parsed = JSON.parse(String(latest.content));
              if (typeof parsed === "object") setProjectFiles(parsed);
            }
          } catch {
            if (latest.file_path && latest.content) {
              setProjectFiles((prev) => ({
                ...prev,
                [latest.file_path]: String(latest.content),
              }));
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
  }, [user, assignmentId, accessLink]);

  // Poll test results
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (testStatus === "running" && submissionId) {
      interval = setInterval(async () => {
        try {
          const submission = await api.get<any>(`/submissions/${submissionId}`, session?.token);
          if (submission && submission.test_status !== "running") {
            setTestStatus(submission.test_status);
            setTestResults(submission.test_results);
            clearInterval(interval);
          }
        } catch (err) {
          console.error("❌ Error polling test results:", err);
        }
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [testStatus, submissionId]);

  // Auto-save changes
  const handleFileChange = async (files: ProjectFiles) => {
    setAutosaveStatus("saving");
    try {
      const submission = await api.post<any>(
        `/submissions`,
        {
          assignment_id: parseInt(assignmentId!),
          content: JSON.stringify(files),
          saved_at: new Date().toISOString(),
        },
        session?.token
      );
      setSubmissionId(submission.id);
      setAutosaveStatus("saved");
    } catch (error) {
      console.error("❌ Error saving submission:", error);
      setAutosaveStatus("error");
    }
  };

  // Run tests — automatically creates temp submission if needed
  const runTests = async () => {
    console.log("🔹 runTests triggered");

    let currentSubmissionId = submissionId;

    if (!currentSubmissionId) {
      try {
        console.log("🔹 Creating temporary submission...");
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
        currentSubmissionId = submission.id;
        setSubmissionId(currentSubmissionId);
      } catch (err) {
        toast({
          title: "Error",
          description: "Could not create temporary submission for testing.",
          variant: "destructive",
        });
        return;
      }
    }

    setTestStatus("running");

    try {
      await api.post<any>(
        `/github/create-repo-and-run-tests`,
        {
          assignment_id: assignmentId ? parseInt(assignmentId) : null,
          access_link: accessLink || null,
          submission_id: currentSubmissionId,
          project_files: projectFiles,
          test_id: assignmentData?.test?.id,
          access_link: assignmentData?.access_link,
        },
        session?.token
      );

      toast({
        title: "Tests Started",
        description: "Your code is being tested. Results will appear shortly.",
      });
    } catch (error) {
      console.error("❌ Error running tests:", error);
      setTestStatus("not_run");
      toast({
        title: "Error",
        description: "Failed to run tests. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Submit final test
  const handleSubmit = async () => {
    if (!assignmentId) return;
    setIsSubmitting(true);
    try {
      let finalSubmissionId = submissionId;

      if (!finalSubmissionId) {
        const submission = await api.post<any>(
          `/submissions`,
          {
            assignment_id: parseInt(assignmentId),
            content: JSON.stringify(projectFiles),
            saved_at: new Date().toISOString(),
          },
          session?.token
        );
        finalSubmissionId = submission.id;
      }

      if (testStatus === "not_run" || testStatus === "pending") {
        await runTests();
      }

      await updateAssignmentStatus(parseInt(assignmentId), "completed", false, true);

      toast({
        title: "Submission Successful",
        description: "Your work has been submitted for review.",
      });

      setTimeout(() => navigate("/candidate-dashboard"), 2000);
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

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
        <p>Loading workspace...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <WorkspaceHeader
        testTitle={assignmentData?.test?.test_title || "Coding Test"}
        autosaveStatus={autosaveStatus}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />

      <div className="flex-1 flex flex-col">
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
            <div style={{ display: "flex", width: "100%", height: `${editorHeight}px`, backgroundColor: `var(--sp-colors-surface1)` }}>
              <div style={{ minWidth: 150, maxWidth: "300px", overflow: "hidden" }}>
                <SandpackFileExplorer />
              </div>
              <div style={{ flex: "min-content" }}>
                <SandpackCodeEditor showLineNumbers showTabs wrapContent closableTabs className="flex-1 h-full" />
              </div>
            </div>

            <div
              style={{
                width: "100%",
                height: "8px",
                backgroundColor: "#2d2d2d",
                cursor: "row-resize",
              }}
              onMouseDown={handleDragStart}
            >
              <div style={{ width: "100%", height: "4px", backgroundColor: "#404040" }} />
            </div>

            <SandpackPreview showNavigator showRefreshButton showOpenInCodeSandbox={false} />
          </SandpackLayout>
        </SandpackProvider>

        <div className="border-t border-border p-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Test Results</h2>
            <Button onClick={runTests} disabled={testStatus === "running"}>
              {testStatus === "running" && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {testStatus === "passed" && <CheckCircle className="mr-2 h-4 w-4" />}
              {testStatus === "failed" && <XCircle className="mr-2 h-4 w-4" />}
              {testStatus === "running" ? "Running Tests..." : "Run Tests"}
            </Button>
          </div>

          {testStatus !== "not_run" && (
            <div className="mt-4">
              <div
                className={`p-4 rounded-md ${
                  testStatus === "passed"
                    ? "bg-green-100 border border-green-200"
                    : testStatus === "failed"
                    ? "bg-red-100 border border-red-200"
                    : "bg-gray-100 border border-gray-200"
                }`}
              >
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
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InterviewWorkspace;