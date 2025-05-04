
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Sandpack,
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
  SandpackFileExplorer
} from "@codesandbox/sandpack-react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { getAssignmentDetails, updateAssignmentStatus } from "@/lib/test-management-utils";

// Default template files if no project is loaded
const defaultFiles = {
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
}`
};

const InterviewWorkspace2 = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { assignmentId } = useParams();
  
  const [isLoading, setIsLoading] = useState(true);
  const [projectFiles, setProjectFiles] = useState(defaultFiles);
  const [activeFile, setActiveFile] = useState("/App.js");
  const [assignmentData, setAssignmentData] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [projectData, setProjectData] = useState<any>(null);
  
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
          const assignmentDetails = await getAssignmentDetails(parseInt(assignmentId));
          
          if (!assignmentDetails) {
            throw new Error("Assignment not found");
          }
          
          setAssignmentData(assignmentDetails);

          // Mark the assignment as started if not already
          if (assignmentDetails.status === 'pending') {
            await updateAssignmentStatus(parseInt(assignmentId), 'in-progress', true, false);
          }

          // Get the project data for this test
          if (assignmentDetails.test?.project_id) {
            const { data: project, error: projectError } = await supabase
              .from('code_projects')
              .select('*')
              .eq('id', assignmentDetails.test.project_id)
              .single();

            if (projectError) throw projectError;
            setProjectData(project);

            // Load project files from project data if available
            if (project.files_json) {
              try {
                const filesData = JSON.parse(project.files_json);
                if (typeof filesData === 'object' && filesData !== null) {
                  // Transform the file structure to match Sandpack format
                  const sandpackFiles: Record<string, string> = {};
                  
                  // Handle flat file structure (simple object with paths as keys)
                  if (!Array.isArray(filesData)) {
                    setProjectFiles(filesData);
                    // Set active file to the first file
                    const firstFilePath = Object.keys(filesData)[0];
                    if (firstFilePath) setActiveFile(firstFilePath);
                  } 
                  // Handle array-based file structure (from your current implementation)
                  else if (Array.isArray(filesData)) {
                    const processFile = (file: any, parentPath = "") => {
                      const filePath = parentPath + "/" + file.name;
                      if (!file.isFolder && file.defaultContent) {
                        // Remove leading slash for consistency
                        const cleanPath = filePath.startsWith('/') ? filePath : '/' + filePath;
                        sandpackFiles[cleanPath] = file.defaultContent;
                      }
                      if (file.children && Array.isArray(file.children)) {
                        file.children.forEach((child: any) => processFile(child, filePath));
                      }
                    };
                    
                    filesData.forEach((file: any) => processFile(file, ""));
                    
                    if (Object.keys(sandpackFiles).length > 0) {
                      setProjectFiles(sandpackFiles);
                      setActiveFile(Object.keys(sandpackFiles)[0]);
                    }
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
            .from('submissions')
            .select('*')
            .eq('assignment_id', parseInt(assignmentId))
            .order('created_at', { ascending: false });

          if (submissionsError) throw submissionsError;

          // If there are submissions, load the most recent one
          if (submissions && submissions.length > 0) {
            const latestSubmission = submissions[0];
            
            try {
              if (latestSubmission.content) {
                const parsedContent = JSON.parse(latestSubmission.content);
                if (typeof parsedContent === 'object') {
                  setProjectFiles(parsedContent);
                }
              }
            } catch (e) {
              // Handle single file content format
              if (latestSubmission.file_path && latestSubmission.content) {
                setProjectFiles({
                  ...projectFiles,
                  [latestSubmission.file_path]: latestSubmission.content
                });
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
  const handleFileChange = async (files: Record<string, string>) => {
    // Automatically save content to Supabase when files change
    if (assignmentId) {
      try {
        const { error } = await supabase
          .from('submissions')
          .insert({
            assignment_id: parseInt(assignmentId),
            content: JSON.stringify(files),
            saved_at: new Date().toISOString()
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
        description: "This is just a demo. In a real test, your work would be submitted for review.",
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
        'completed', 
        false, 
        true
      );

      if (!updated) {
        throw new Error("Failed to update assignment status");
      }

      // Create a final submission with current files
      const { error: submissionError } = await supabase
        .from('submissions')
        .insert({
          assignment_id: parseInt(assignmentId),
          content: JSON.stringify(projectFiles),
          saved_at: new Date().toISOString()
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
            {assignmentData?.test?.primary_language || "JavaScript"} coding challenge
          </p>
        </div>
        <div className="flex gap-2">
          <div className="text-sm text-muted-foreground">
            Autosaving changes...
          </div>
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Test'
            )}
          </Button>
        </div>
      </div>
      
      {/* Sandpack Editor */}
      <div className="flex-1 overflow-hidden">
        <SandpackProvider
          files={projectFiles}
          template="react"
          customSetup={{
            dependencies: {
              "react": "^18.0.0",
              "react-dom": "^18.0.0"
            }
          }}
          autoSaveChanges
          autorun
        >
          <SandpackLayout>
            <SandpackFileExplorer className="h-full" />
            <SandpackCodeEditor
              showLineNumbers={true}
              showInlineErrors
              showTabs
              wrapContent
              closableTabs
              className="flex-1"
            />
            <SandpackPreview
              showNavigator={true}
              showRefreshButton
              className="flex-1"
            />
          </SandpackLayout>
        </SandpackProvider>
      </div>
    </div>
  );
};

export default InterviewWorkspace2;
