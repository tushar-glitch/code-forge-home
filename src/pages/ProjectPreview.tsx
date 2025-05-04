
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Sandpack,
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
  SandpackFileExplorer,
  SandpackConsole
} from "@codesandbox/sandpack-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

const ProjectPreview = () => {
  const { projectId } = useParams();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [projectData, setProjectData] = useState<any>(null);
  const [files, setFiles] = useState<Record<string, string>>({
    "/App.js": 'export default function App() { return <h1>Loading project...</h1> }'
  });

  useEffect(() => {
    const loadProject = async () => {
      if (!projectId) return;
      
      setIsLoading(true);
      try {
        const { data: project, error } = await supabase
          .from('code_projects')
          .select('*')
          .eq('id', projectId)
          .single();
          
        if (error) throw error;
        
        setProjectData(project);
        
        if (project.files_json) {
          try {
            const filesData = JSON.parse(project.files_json);
            if (typeof filesData === 'object' && filesData !== null) {
              setFiles(filesData);
            }
          } catch (e) {
            console.error("Error parsing project files:", e);
            toast({
              title: "Error",
              description: "Failed to parse project files",
              variant: "destructive",
            });
          }
        }
      } catch (error) {
        console.error("Error loading project:", error);
        toast({
          title: "Error",
          description: "Failed to load project data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProject();
  }, [projectId, toast]);

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading project preview...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="bg-card border-b border-border p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-xl font-semibold">{projectData?.name || "Project Preview"}</h1>
            <p className="text-muted-foreground text-sm">
              {projectData?.description || "Preview environment"}
            </p>
          </div>
          <Button variant="outline" onClick={() => window.history.back()}>
            Back to Dashboard
          </Button>
        </div>
      </div>
      
      {/* Sandpack Editor */}
      <div className="flex-1 overflow-hidden">
        <SandpackProvider
          files={files}
          template="react"
          theme="dark"
        >
          <SandpackLayout>
            <SandpackFileExplorer />
            <SandpackCodeEditor
              showLineNumbers={true}
              showInlineErrors
              showTabs
              wrapContent
              closableTabs
            />
            <div className="flex flex-col w-[40%] h-full">
              <SandpackPreview
                showNavigator={true}
                showRefreshButton
                className="flex-1"
              />
              <SandpackConsole className="h-[30%] border-t" />
            </div>
          </SandpackLayout>
        </SandpackProvider>
      </div>
    </div>
  );
};

export default ProjectPreview;
