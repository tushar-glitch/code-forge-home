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
import { Loader2, Bot, Code2, MessageSquare, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { SandpackFileExplorer } from "sandpack-file-explorer";
import {
  getAssignmentDetails,
  updateAssignmentStatus,
} from "@/lib/test-management-utils";

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
  const [editorHeight, setEditorHeight] = useState(300);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [startHeight, setStartHeight] = useState(0);

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

  // Handle file change
  const handleFileChange = async (files: ProjectFiles) => {
    // Automatically save content to Supabase when files change
    if (assignmentId) {
      try {
        const { error } = await supabase.from("submissions").insert({
          assignment_id: parseInt(assignmentId),
          content: JSON.stringify(files),
          saved_at: new Date().toISOString(),
        });

        if (error) throw error;
      } catch (error) {
        console.error("Error saving submission:", error);
      }
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

      // Create a final submission with current files
      const { error: submissionError } = await supabase
        .from("submissions")
        .insert({
          assignment_id: parseInt(assignmentId),
          content: JSON.stringify(projectFiles),
          saved_at: new Date().toISOString(),
        });

      if (submissionError) throw submissionError;

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
      {/* Header */}
      <div className="bg-card border-b border-border p-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-semibold">
            {assignmentData?.test?.test_title || "Coding Test"}
          </h1>
          <p className="text-muted-foreground text-sm">
            {assignmentData?.test?.primary_language || "JavaScript"} coding
            challenge
          </p>
        </div>
        <div className="flex gap-2">
          <div className="text-sm text-muted-foreground">
            Autosaving changes...
          </div>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Test"
            )}
          </Button>
        </div>
      </div>

      {/* Main Content - Split into two sections */}
      <div className="flex-1 flex flex-col">
        {/* Sandpack Editor - Top Half */}
        {/* <div className="h-1/2 min-h-0 overflow-hidden"> */}
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
              {/* <SandpackConsole
                // className="h-48 overflow-auto bg-black text-white p-2 text-sm"
                standalone={false}
                showHeader={false}
              /> */}
            </SandpackLayout>
          </SandpackProvider>
        {/* </div> */}

        {/* AI Interviewer - Bottom Half (Coming Soon) */}
        {/* <div className="h-1/2 border-t border-border bg-muted/30 p-6">
          <div className="h-full flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/20 bg-background/50">
            <div className="text-center max-w-md p-6">
              <Bot className="w-16 h-16 mx-auto mb-4 text-primary/60" />
              <h2 className="text-2xl font-bold mb-2">
                AI Interviewer Coming Soon
              </h2>
              <p className="text-muted-foreground mb-6">
                Our AI interviewer is currently under construction. Soon, you'll
                be able to chat with an AI that will ask coding questions and
                provide helpful feedback.
              </p>
              <div className="flex gap-4 justify-center">
                <div className="flex items-center p-2 rounded-md bg-muted/80">
                  <Code2 className="h-5 w-5 mr-2 text-blue-500" />
                  <span className="text-sm">Code Analysis</span>
                </div>
                <div className="flex items-center p-2 rounded-md bg-muted/80">
                  <MessageSquare className="h-5 w-5 mr-2 text-green-500" />
                  <span className="text-sm">Live Chat</span>
                </div>
                <div className="flex items-center p-2 rounded-md bg-muted/80">
                  <Sparkles className="h-5 w-5 mr-2 text-amber-500" />
                  <span className="text-sm">Smart Suggestions</span>
                </div>
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default InterviewWorkspace;
