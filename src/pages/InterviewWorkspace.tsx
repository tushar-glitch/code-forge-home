
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { SandpackProvider, SandpackLayout, SandpackCodeEditor, SandpackPreview } from "@codesandbox/sandpack-react";
import { monokaiPro } from "@codesandbox/sandpack-themes";
import WorkspaceHeader from "@/components/workspace/WorkspaceHeader";
import FileExplorer from "@/components/workspace/FileExplorer";
import FileTabs from "@/components/workspace/FileTabs";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, Loader2, Send, Bot } from "lucide-react";

// Import test data
import { getAssignmentById } from "@/lib/test-management-utils";

const InterviewWorkspace = () => {
  const { assignmentId } = useParams<{ assignmentId: string }>();
  const [loading, setLoading] = useState(true);
  const [assignment, setAssignment] = useState<any>(null);
  const [activeFile, setActiveFile] = useState("App.js");
  const [projectFiles, setProjectFiles] = useState<any>({
    "App.js": {
      code: `import React from "react";

export default function App() {
  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
    </div>
  );
}`,
    },
    "index.js": {
      code: `import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);`,
    },
  });
  
  const [aiMessages, setAiMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([
    { role: 'assistant', content: 'Hello! I\'ll be your AI interviewer today. I\'m here to help evaluate your coding skills and provide guidance as needed. Feel free to ask me any questions about the challenge.' }
  ]);
  const [userMessage, setUserMessage] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  
  useEffect(() => {
    const fetchAssignment = async () => {
      if (assignmentId) {
        try {
          const data = await getAssignmentById(assignmentId);
          setAssignment(data);
          
          // If there is a project linked to the assignment, update the files
          if (data?.test?.project_id) {
            const projectData = data.test.project;
            
            if (projectData?.files_json) {
              const parsedFiles = JSON.parse(projectData.files_json);
              
              // Transform the file format to what Sandpack expects
              const transformedFiles: Record<string, { code: string }> = {};
              for (const file of parsedFiles) {
                transformedFiles[file.path] = { code: file.content };
              }
              
              setProjectFiles(transformedFiles);
              
              // Set the first file as active file
              if (parsedFiles.length > 0) {
                setActiveFile(parsedFiles[0].path);
              }
            }
          }
        } catch (error) {
          console.error("Error fetching assignment:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchAssignment();
  }, [assignmentId]);
  
  const handleFileClick = (filePath: string) => {
    setActiveFile(filePath);
  };
  
  const handleSendMessage = () => {
    if (!userMessage.trim()) return;
    
    // Add user message
    setAiMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    
    // Clear input
    setUserMessage('');
    
    // Simulate AI response
    setAiLoading(true);
    setTimeout(() => {
      setAiMessages(prev => [
        ...prev, 
        { 
          role: 'assistant', 
          content: "I'm analyzing your code and progress. The AI interviewer feature is still under development, but will be available soon. In the meantime, feel free to work on your assessment and submit when you're ready." 
        }
      ]);
      setAiLoading(false);
    }, 1500);
  };
  
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col">
      <WorkspaceHeader assignment={assignment} />
      <div className="flex flex-1 overflow-hidden">
        <div className="hidden md:flex w-64 flex-col border-r">
          <FileExplorer
            files={Object.keys(projectFiles)}
            activeFile={activeFile}
            onFileClick={handleFileClick}
          />
        </div>
        <div className="flex flex-1 flex-col overflow-hidden">
          <FileTabs
            files={Object.keys(projectFiles)}
            activeFile={activeFile}
            onFileClick={handleFileClick}
          />
          <div className="flex flex-1 flex-col lg:flex-row overflow-hidden">
            <div className="h-1/2 lg:h-auto lg:w-1/2 overflow-hidden">
              <SandpackProvider
                theme={monokaiPro}
                files={projectFiles}
                template="react"
                customSetup={{
                  dependencies: {
                    react: "^18.0.0",
                    "react-dom": "^18.0.0"
                  },
                }}
              >
                <SandpackLayout>
                  <SandpackCodeEditor
                    showLineNumbers
                    showInlineErrors
                    showTabs={false}
                    wrapContent
                  />
                  <SandpackPreview />
                </SandpackLayout>
              </SandpackProvider>
            </div>
            
            {/* AI Interview Section */}
            <div className="h-1/2 lg:h-auto lg:w-1/2 border-t lg:border-t-0 lg:border-l flex flex-col bg-card">
              <div className="p-4 border-b bg-background">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Bot className="h-5 w-5 text-primary" />
                  AI Interviewer
                </h2>
                <p className="text-sm text-muted-foreground">
                  Get real-time feedback and guidance for your coding assessment
                </p>
              </div>
              
              <Tabs defaultValue="chat" className="flex-1 flex flex-col">
                <div className="px-4 py-2 border-b">
                  <TabsList>
                    <TabsTrigger value="chat" className="gap-2">
                      <MessageCircle className="h-4 w-4" />
                      Chat
                    </TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent value="chat" className="mt-0 flex-1 flex flex-col">
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {aiMessages.map((msg, idx) => (
                      <div 
                        key={idx}
                        className={`flex gap-3 ${msg.role === 'assistant' ? '' : 'flex-row-reverse'}`}
                      >
                        <Avatar className={`h-8 w-8 ${msg.role === 'assistant' ? 'bg-primary/10' : 'bg-secondary'}`}>
                          {msg.role === 'assistant' ? (
                            <Bot className="h-4 w-4 text-primary" />
                          ) : (
                            <AvatarFallback>U</AvatarFallback>
                          )}
                        </Avatar>
                        <div 
                          className={`rounded-lg px-4 py-2 max-w-[80%] ${
                            msg.role === 'assistant' 
                              ? 'bg-muted text-foreground' 
                              : 'bg-primary text-primary-foreground'
                          }`}
                        >
                          <p className="text-sm">{msg.content}</p>
                        </div>
                      </div>
                    ))}
                    
                    {aiLoading && (
                      <div className="flex gap-3">
                        <Avatar className="h-8 w-8 bg-primary/10">
                          <Bot className="h-4 w-4 text-primary" />
                        </Avatar>
                        <div className="rounded-lg px-4 py-2 bg-muted">
                          <div className="flex space-x-2 items-center">
                            <div className="h-2 w-2 rounded-full bg-primary/60 animate-bounce [animation-delay:-0.3s]"></div>
                            <div className="h-2 w-2 rounded-full bg-primary/60 animate-bounce [animation-delay:-0.15s]"></div>
                            <div className="h-2 w-2 rounded-full bg-primary/60 animate-bounce"></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4 border-t">
                    <div className="flex gap-2">
                      <Textarea 
                        placeholder="Type your message..."
                        className="min-h-[60px] resize-none"
                        value={userMessage}
                        onChange={(e) => setUserMessage(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                      />
                      <Button 
                        className="shrink-0" 
                        onClick={handleSendMessage}
                        disabled={aiLoading || !userMessage.trim()}
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Press Enter to send, Shift+Enter for new line
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewWorkspace;
