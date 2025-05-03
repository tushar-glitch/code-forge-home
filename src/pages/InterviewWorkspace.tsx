
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Editor from "@monaco-editor/react";
import { FileExplorer } from "@/components/workspace/FileExplorer";
import { WorkspaceHeader } from "@/components/workspace/WorkspaceHeader";
import { FileTabs } from "@/components/workspace/FileTabs";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft, Terminal, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { dummyFileSystem } from "@/lib/dummy-data";
import { FileType } from "@/types/file";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { getAssignmentDetails, updateAssignmentStatus } from "@/lib/test-management-utils";

const InterviewWorkspace: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { assignmentId } = useParams(); // For getting the assignment ID from the URL
  
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isBottomPanelOpen, setIsBottomPanelOpen] = useState(false);
  const [openFiles, setOpenFiles] = useState<FileType[]>([]);
  const [activeFileId, setActiveFileId] = useState<string | null>(null);
  const [fileContents, setFileContents] = useState<Record<string, string>>({});
  const [autosaveStatus, setAutosaveStatus] = useState<"saved" | "saving" | "error">("saved");
  const [isLoading, setIsLoading] = useState(true);
  const [projectData, setProjectData] = useState<any>(null);
  const [assignmentData, setAssignmentData] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize file system with dummy data for now
  const [fileSystem, setFileSystem] = useState(dummyFileSystem);

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

            // Update file system from project data if available
            if (project.files_json) {
              try {
                const projectFiles = JSON.parse(project.files_json);
                if (Array.isArray(projectFiles) && projectFiles.length > 0) {
                  setFileSystem(projectFiles);
                }
              } catch (e) {
                console.error("Error parsing project files:", e);
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
            
            // Try to parse content as a file system or use as a single file content
            try {
              if (latestSubmission.content) {
                const parsedContent = JSON.parse(latestSubmission.content);
                if (typeof parsedContent === 'object') {
                  setFileContents(parsedContent);
                }
              }
            } catch (e) {
              // If it's not JSON, assume it's a single file content
              if (latestSubmission.file_path && latestSubmission.content) {
                setFileContents({
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

    // Initialize with the first file from the file system
    const initializeFirstFile = () => {
      const initialFile = fileSystem.find(f => !f.isFolder);
      if (initialFile) {
        handleFileOpen(initialFile);
      }
    };

    loadAssignment().then(() => {
      initializeFirstFile();
    });
  }, [user, assignmentId, navigate, toast]);

  const handleFileOpen = (file: FileType) => {
    if (file.isFolder) return;
    
    // Check if file is already open
    if (!openFiles.find(f => f.id === file.id)) {
      setOpenFiles(prev => [...prev, file]);
    }
    
    // Set as active file
    setActiveFileId(file.id);
    
    // Initialize content if not already present
    if (!fileContents[file.id]) {
      setFileContents(prev => ({
        ...prev,
        [file.id]: file.defaultContent || `// ${file.name}\n\n// Start coding here\n`
      }));
    }
    
    // Show autosave animation
    setAutosaveStatus("saving");
    setTimeout(() => setAutosaveStatus("saved"), 800);
  };

  const handleFileClose = (fileId: string) => {
    setOpenFiles(prev => prev.filter(f => f.id !== fileId));
    
    // If we're closing the active file, activate another file if available
    if (activeFileId === fileId) {
      const remainingFiles = openFiles.filter(f => f.id !== fileId);
      if (remainingFiles.length > 0) {
        setActiveFileId(remainingFiles[remainingFiles.length - 1].id);
      } else {
        setActiveFileId(null);
      }
    }
  };

  const handleEditorChange = async (value: string | undefined, fileId: string) => {
    if (value === undefined) return;
    
    setFileContents(prev => ({
      ...prev,
      [fileId]: value
    }));
    
    // Show autosave animation
    setAutosaveStatus("saving");
    
    // Save the content to Supabase if we have an assignment ID
    if (assignmentId) {
      try {
        const { error } = await supabase
          .from('submissions')
          .insert({
            assignment_id: parseInt(assignmentId),
            content: JSON.stringify({...fileContents, [fileId]: value}),
            saved_at: new Date().toISOString()
          });
          
        if (error) throw error;
        setAutosaveStatus("saved");
      } catch (error) {
        console.error("Error saving submission:", error);
        setAutosaveStatus("error");
      }
    } else {
      // Just simulate saving for the demo
      setTimeout(() => setAutosaveStatus("saved"), 800);
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

      // Create a final submission
      const { error: submissionError } = await supabase
        .from('submissions')
        .insert({
          assignment_id: parseInt(assignmentId),
          content: JSON.stringify(fileContents),
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
    <div className="h-screen w-full bg-background flex flex-col overflow-hidden">
      {/* Header */}
      <WorkspaceHeader 
        onSubmit={handleSubmit}
        autosaveStatus={autosaveStatus}
        testTitle={assignmentData?.test?.test_title || "Coding Test"}
        isSubmitting={isSubmitting}
      />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="flex-1">
          {/* Sidebar */}
          <AnimatePresence>
            {!isSidebarCollapsed && (
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "auto" }}
                exit={{ width: 0 }}
                className="h-full"
              >
                <ResizablePanel 
                  defaultSize={20} 
                  minSize={15} 
                  maxSize={30}
                  className="bg-card border-r border-border"
                >
                  <FileExplorer
                    files={fileSystem}
                    activeFileId={activeFileId}
                    onFileClick={handleFileOpen}
                    className="h-full"
                  />
                </ResizablePanel>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Toggle sidebar button */}
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10">
            <Button
              variant="secondary"
              size="icon"
              className="h-8 w-6 rounded-l-none border-l-0"
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            >
              {isSidebarCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            </Button>
          </div>
          
          {/* Editor area */}
          <ResizablePanel defaultSize={80} className="flex flex-col h-full overflow-hidden">
            {/* Tabs */}
            <FileTabs
              files={openFiles}
              activeFileId={activeFileId}
              onTabClick={setActiveFileId}
              onTabClose={handleFileClose}
            />
            
            {/* Editor */}
            <div className="flex-1 relative">
              {activeFileId ? (
                <Editor
                  height="100%"
                  defaultLanguage={getLanguageFromFileName(openFiles.find(f => f.id === activeFileId)?.name || "")}
                  theme="vs-dark"
                  value={fileContents[activeFileId] || ""}
                  onChange={(value) => handleEditorChange(value, activeFileId)}
                  options={{
                    minimap: { enabled: true },
                    fontSize: 14,
                    wordWrap: "on",
                    automaticLayout: true,
                    tabSize: 2,
                    scrollBeyondLastLine: false,
                  }}
                />
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  Select a file to start coding
                </div>
              )}
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
        
        {/* Bottom panel */}
        <AnimatePresence>
          {isBottomPanelOpen && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 200 }}
              exit={{ height: 0 }}
              className="border-t border-border bg-card"
            >
              <div className="p-4 h-full">
                <div className="text-sm font-medium mb-2">Terminal</div>
                <div className="bg-card h-[calc(100%-2rem)] p-2 rounded-md overflow-auto">
                  <div className="text-muted-foreground text-xs font-mono">
                    $ npm start<br />
                    Starting development server...<br />
                    Compiled successfully!<br />
                    You can now view the app in the browser.<br />
                    <br />
                    {'> Ready on http://localhost:3000'}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Toggle bottom panel button */}
        <div className="absolute bottom-4 right-4">
          <Button
            variant="secondary"
            size="sm"
            className={cn("gap-2", isBottomPanelOpen && "bg-primary text-primary-foreground")}
            onClick={() => setIsBottomPanelOpen(!isBottomPanelOpen)}
          >
            <Terminal size={14} />
            Terminal
          </Button>
        </div>
      </div>
    </div>
  );
};

// Helper function to determine language from file name
function getLanguageFromFileName(fileName: string): string {
  const extension = fileName.split('.').pop()?.toLowerCase() || '';
  
  switch (extension) {
    case 'js':
      return 'javascript';
    case 'jsx':
      return 'javascript';
    case 'ts':
      return 'typescript';
    case 'tsx':
      return 'typescript';
    case 'json':
      return 'json';
    case 'md':
      return 'markdown';
    case 'html':
      return 'html';
    case 'css':
      return 'css';
    default:
      return 'javascript';
  }
}

export default InterviewWorkspace;