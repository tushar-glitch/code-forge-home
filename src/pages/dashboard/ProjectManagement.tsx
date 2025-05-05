
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Loader2, Plus, File, Folder, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { format } from 'date-fns';

interface FileNode {
  id: string;
  name: string;
  content?: string;
  isFolder: boolean;
  defaultContent?: string;
  children?: FileNode[];
}

const ProjectManagement = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, userRole, isAuthorized } = useAuth();
  
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [uploadMethod, setUploadMethod] = useState('template'); // 'template' or 'upload'
  const [isUploading, setIsUploading] = useState(false);
  
  const [projectFiles, setProjectFiles] = useState<FileNode[]>([]);
  const [currentFile, setCurrentFile] = useState<FileNode | null>(null);
  const [fileContent, setFileContent] = useState('');

  // Ensure only recruiters can access this page
  useEffect(() => {
    if (!isAuthorized(['recruiter'])) {
      navigate('/signin');
      toast({
        title: "Unauthorized",
        description: "You don't have permission to access this page",
        variant: "destructive"
      });
    }
  }, [isAuthorized, navigate, toast]);

  // Load projects when component mounts
  useEffect(() => {
    const loadProjects = async () => {
      setIsLoading(true);
      try {
        if (user) {
          const { data, error } = await supabase
            .from('code_projects')
            .select('*')
            .order('created_at', { ascending: false });

          if (error) throw error;
          setProjects(data || []);
        }
      } catch (error) {
        console.error('Error loading projects:', error);
        toast({
          title: 'Error',
          description: 'Failed to load projects',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadProjects();
  }, [user, toast]);

  const createBlankProject = () => {
    setProjectFiles([
      {
        id: 'root-folder',
        name: 'src',
        isFolder: true,
        children: [
          {
            id: 'app-js',
            name: 'App.js',
            isFolder: false,
            defaultContent: `import React from 'react';

export default function App() {
  return (
    <div className="App">
      <h1>Hello Candidate!</h1>
      <p>This is a React app template. Start coding!</p>
    </div>
  );
}`
          },
          {
            id: 'index-js',
            name: 'index.js',
            isFolder: false,
            defaultContent: `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);`
          },
          {
            id: 'styles-css',
            name: 'styles.css',
            isFolder: false,
            defaultContent: `body {
  margin: 0;
  padding: 0;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', 
    Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

.App {
  text-align: center;
  padding: 2rem;
}`
          }
        ]
      }
    ]);
    
    setUploadMethod('template');
  };

  const selectTemplate = (template: string) => {
    switch (template) {
      case 'react-basic':
        // Already created above
        createBlankProject();
        break;
      case 'react-typescript':
        setProjectFiles([
          {
            id: 'root-folder',
            name: 'src',
            isFolder: true,
            children: [
              {
                id: 'app-tsx',
                name: 'App.tsx',
                isFolder: false,
                defaultContent: `import React from 'react';

interface AppProps {
  title?: string;
}

export default function App({ title = 'React TypeScript App' }: AppProps): React.ReactElement {
  return (
    <div className="App">
      <h1>{title}</h1>
      <p>This is a TypeScript React template. Start coding!</p>
    </div>
  );
}`
              },
              {
                id: 'index-tsx',
                name: 'index.tsx',
                isFolder: false,
                defaultContent: `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(<App />);`
              },
              {
                id: 'styles-css',
                name: 'styles.css',
                isFolder: false,
                defaultContent: `body {
  margin: 0;
  padding: 0;
  font-family: system-ui, sans-serif;
}

.App {
  text-align: center;
  padding: 2rem;
}`
              }
            ]
          }
        ]);
        break;
      // Add more templates as needed
    }
  };

  const handleFileSelect = (file: FileNode) => {
    if (!file.isFolder) {
      setCurrentFile(file);
      setFileContent(file.defaultContent || '');
    }
  };

  const handleFileContentChange = (content: string) => {
    setFileContent(content);
    if (currentFile) {
      const updatedFile = { ...currentFile, defaultContent: content };
      updateFileInTree(projectFiles, currentFile.id, updatedFile);
    }
  };

  const updateFileInTree = (files: FileNode[], fileId: string, updatedFile: FileNode): boolean => {
    for (let i = 0; i < files.length; i++) {
      if (files[i].id === fileId) {
        files[i] = updatedFile;
        return true;
      }
      if (files[i].children) {
        if (updateFileInTree(files[i].children!, fileId, updatedFile)) {
          return true;
        }
      }
    }
    return false;
  };

  const addNewFile = (parentFolderId: string | null = null) => {
    const fileName = window.prompt('Enter file name (with extension):');
    if (!fileName) return;

    const newFile: FileNode = {
      id: `file-${Date.now()}`,
      name: fileName,
      isFolder: false,
      defaultContent: '',
    };

    if (parentFolderId === null) {
      // Add to root
      setProjectFiles([...projectFiles, newFile]);
    } else {
      // Add to specific folder
      const updatedFiles = [...projectFiles];
      addFileToFolder(updatedFiles, parentFolderId, newFile);
      setProjectFiles(updatedFiles);
    }
  };

  const addNewFolder = (parentFolderId: string | null = null) => {
    const folderName = window.prompt('Enter folder name:');
    if (!folderName) return;

    const newFolder: FileNode = {
      id: `folder-${Date.now()}`,
      name: folderName,
      isFolder: true,
      children: [],
    };

    if (parentFolderId === null) {
      // Add to root
      setProjectFiles([...projectFiles, newFolder]);
    } else {
      // Add to specific folder
      const updatedFiles = [...projectFiles];
      addFileToFolder(updatedFiles, parentFolderId, newFolder);
      setProjectFiles(updatedFiles);
    }
  };

  const addFileToFolder = (files: FileNode[], folderId: string, newFile: FileNode): boolean => {
    for (let i = 0; i < files.length; i++) {
      if (files[i].id === folderId && files[i].isFolder) {
        if (!files[i].children) files[i].children = [];
        files[i].children.push(newFile);
        return true;
      }
      if (files[i].children) {
        if (addFileToFolder(files[i].children!, folderId, newFile)) {
          return true;
        }
      }
    }
    return false;
  };

  const renderFileTree = (files: FileNode[], depth = 0) => {
    return (
      <ul className={`pl-${depth > 0 ? 4 : 0}`}>
        {files.map((file) => (
          <li key={file.id} className="py-1">
            <div className="flex items-center gap-2">
              {file.isFolder ? (
                <>
                  <Folder className="h-4 w-4" />
                  <span 
                    className="cursor-pointer hover:text-primary"
                    onClick={() => file.children && file.children.length > 0 ? null : addFileToFolder(projectFiles, file.id, { id: '', name: '', isFolder: false })}
                  >
                    {file.name}
                  </span>
                  <div className="ml-auto space-x-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6" 
                      onClick={() => addNewFile(file.id)}
                    >
                      <File className="h-3 w-3" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6"
                      onClick={() => addNewFolder(file.id)}
                    >
                      <Folder className="h-3 w-3" />
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <File className="h-4 w-4" />
                  <span 
                    className={`cursor-pointer hover:text-primary ${currentFile?.id === file.id ? 'font-medium text-primary' : ''}`}
                    onClick={() => handleFileSelect(file)}
                  >
                    {file.name}
                  </span>
                </>
              )}
            </div>
            {file.isFolder && file.children && renderFileTree(file.children, depth + 1)}
          </li>
        ))}
      </ul>
    );
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    // Process the uploaded files here
    // This is a simplified version. In a real-world scenario,
    // you'd need to parse and handle file structure from a zip file or directory
    
    const uploadedFiles: FileNode[] = [];
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        uploadedFiles.push({
          id: `upload-${Date.now()}-${file.name}`,
          name: file.name,
          isFolder: false,
          defaultContent: content
        });
        setProjectFiles(uploadedFiles);
      };
      reader.readAsText(file);
    });
  };

  const convertFilesForSaving = (files: FileNode[]) => {
    const sandpackFormat: Record<string, string> = {};
    
    const processFile = (file: FileNode, path = '') => {
      if (file.isFolder && file.children) {
        file.children.forEach(child => {
          processFile(child, path ? `${path}/${file.name}` : file.name);
        });
      } else if (!file.isFolder) {
        const filePath = path ? `/${path}/${file.name}` : `/${file.name}`;
        sandpackFormat[filePath] = file.defaultContent || '';
      }
    };
    
    files.forEach(file => processFile(file));
    return sandpackFormat;
  };

  const handleCreateProject = async () => {
    if (!projectName.trim()) {
      toast({
        title: 'Missing information',
        description: 'Project name is required',
        variant: 'destructive'
      });
      return;
    }
    
    setIsCreating(true);
    try {
      // Convert project files to the format needed for Sandpack
      const filesForSandpack = convertFilesForSaving(projectFiles);
      
      // Save to Supabase
      const { data, error } = await supabase
        .from('code_projects')
        .insert({
          name: projectName,
          description: projectDescription,
          files_json: JSON.stringify(filesForSandpack)
        })
        .select();
      
      if (error) throw error;
      
      toast({
        title: 'Success',
        description: 'Project created successfully'
      });
      
      // Add to projects list
      if (data && data.length > 0) {
        setProjects([data[0], ...projects]);
      }
      
      // Reset form
      setProjectName('');
      setProjectDescription('');
      setProjectFiles([]);
      setCurrentFile(null);
      setFileContent('');
      setShowCreateDialog(false);
      
    } catch (error) {
      console.error('Error creating project:', error);
      toast({
        title: 'Error',
        description: 'Failed to create project',
        variant: 'destructive'
      });
    } finally {
      setIsCreating(false);
    }
  };

  const previewProject = (projectId: number) => {
    // Open a new tab or navigate to a preview page that loads the project into Sandpack
    window.open(`/project-preview/${projectId}`, '_blank');
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Project Management</h1>
            <p className="text-muted-foreground">
              Create and manage coding projects for your tests
            </p>
          </div>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="mr-1 h-4 w-4" /> Create Project
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl h-[80vh]">
              <DialogHeader>
                <DialogTitle>Create New Project</DialogTitle>
                <DialogDescription>
                  Create a coding project that candidates can work on
                </DialogDescription>
              </DialogHeader>
              
              <div className="flex flex-col space-y-4 h-full overflow-hidden">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="project-name" className="text-sm font-medium">
                      Project Name
                    </label>
                    <Input
                      id="project-name"
                      placeholder="Enter project name"
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="project-desc" className="text-sm font-medium">
                      Description
                    </label>
                    <Textarea
                      id="project-desc"
                      placeholder="Brief description of this project"
                      value={projectDescription}
                      onChange={(e) => setProjectDescription(e.target.value)}
                      rows={1}
                    />
                  </div>
                </div>
                
                <Tabs defaultValue="template" onValueChange={(value) => setUploadMethod(value)}>
                  <TabsList>
                    <TabsTrigger value="template">Use Template</TabsTrigger>
                    <TabsTrigger value="editor">File Editor</TabsTrigger>
                    <TabsTrigger value="upload">Upload Files</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="template" className="h-[calc(100%-2rem)]">
                    <div className="grid grid-cols-3 gap-4">
                      <Card className="cursor-pointer hover:border-primary" onClick={() => selectTemplate('react-basic')}>
                        <CardHeader>
                          <CardTitle>React Basic</CardTitle>
                          <CardDescription>Simple React application with JS</CardDescription>
                        </CardHeader>
                      </Card>
                      <Card className="cursor-pointer hover:border-primary" onClick={() => selectTemplate('react-typescript')}>
                        <CardHeader>
                          <CardTitle>React TypeScript</CardTitle>
                          <CardDescription>React app with TypeScript support</CardDescription>
                        </CardHeader>
                      </Card>
                      {/* Add more templates as needed */}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="editor" className="h-[calc(100%-2rem)]">
                    <div className="flex h-full border rounded-lg overflow-hidden">
                      {/* File Explorer */}
                      <div className="w-1/4 border-r p-3 overflow-y-auto">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="text-sm font-medium">Files</h3>
                          <div className="space-x-1">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-6 w-6" 
                              onClick={() => addNewFile()}
                            >
                              <File className="h-3 w-3" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-6 w-6"
                              onClick={() => addNewFolder()}
                            >
                              <Folder className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        {renderFileTree(projectFiles)}
                      </div>
                      
                      {/* Code Editor */}
                      <div className="flex-1 h-full">
                        {currentFile ? (
                          <textarea
                            className="w-full h-full p-4 font-mono text-sm resize-none border-0 focus:outline-none"
                            value={fileContent}
                            onChange={(e) => handleFileContentChange(e.target.value)}
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-muted-foreground">
                            Select a file to edit
                          </div>
                        )}
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="upload">
                    <div className="border-2 border-dashed rounded-lg p-10 text-center">
                      <Upload className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
                      <p className="mb-2">Drag and drop files or click to browse</p>
                      <p className="text-sm text-muted-foreground mb-4">
                        Upload individual files for your project
                      </p>
                      <Input
                        type="file"
                        multiple
                        className="mx-auto max-w-xs"
                        onChange={handleFileUpload}
                        webkitdirectory="true"
                        // accept=".js,.jsx,.ts,.tsx,.css,.html"
                      />
                      <p className="mt-4 text-xs text-muted-foreground">
                        Note: For complex projects, the file editor is recommended
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateProject} disabled={isCreating}>
                  {isCreating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Project'
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="w-[150px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    <p className="text-muted-foreground">No projects found</p>
                    <p className="text-sm">Create a project to get started</p>
                  </TableCell>
                </TableRow>
              ) : (
                projects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell className="font-medium">{project.name || 'Untitled Project'}</TableCell>
                    <TableCell>{project.description || 'No description'}</TableCell>
                    <TableCell>{format(new Date(project.created_at), 'MMM d, yyyy')}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => previewProject(project.id)}
                        >
                          Preview
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ProjectManagement;
