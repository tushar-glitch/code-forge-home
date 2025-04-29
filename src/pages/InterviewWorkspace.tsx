import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Editor from "@monaco-editor/react";
import { FileExplorer } from "@/components/workspace/FileExplorer";
import { WorkspaceHeader } from "@/components/workspace/WorkspaceHeader";
import { FileTabs } from "@/components/workspace/FileTabs";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft, Terminal } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { dummyFileSystem } from "@/lib/dummy-data";
import { FileType } from "@/types/file";

const InterviewWorkspace: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isBottomPanelOpen, setIsBottomPanelOpen] = useState(false);
  const [openFiles, setOpenFiles] = useState<FileType[]>([]);
  const [activeFileId, setActiveFileId] = useState<string | null>(null);
  const [fileContents, setFileContents] = useState<Record<string, string>>({});
  const [autosaveStatus, setAutosaveStatus] = useState<"saved" | "saving" | "error">("saved");
  
  // Initialize file system with dummy data
  const [fileSystem, setFileSystem] = useState(dummyFileSystem);

  useEffect(() => {
    // Initialize with some open files for demo
    const initialFile = dummyFileSystem.find(f => f.id === "index-js");
    if (initialFile && !initialFile.isFolder) {
      handleFileOpen(initialFile);
    }
  }, []);

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

  const handleEditorChange = (value: string | undefined, fileId: string) => {
    if (value === undefined) return;
    
    setFileContents(prev => ({
      ...prev,
      [fileId]: value
    }));
    
    // Show autosave animation
    setAutosaveStatus("saving");
    setTimeout(() => setAutosaveStatus("saved"), 800);
  };

  const handleSubmit = () => {
    toast({
      title: "Submission Successful",
      description: "Your work has been submitted for review.",
    });
    
    // In a real app, this would send the code to the backend
    setTimeout(() => navigate("/"), 2000);
  };

  return (
    <div className="h-screen w-full bg-background flex flex-col overflow-hidden">
      {/* Header */}
      <WorkspaceHeader 
        onSubmit={handleSubmit}
        autosaveStatus={autosaveStatus}
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
                    {"> Ready on http://localhost:3000"}
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
