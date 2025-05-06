
import React, { useState, useEffect, useRef, ChangeEvent, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import {
  Search,
  PlusCircle,
  ChevronRight,
  MoreHorizontal,
  FileIcon,
  FolderIcon,
  TrashIcon,
  AlertTriangleIcon,
  Loader2,
  Eye,
  Edit,
  CopyIcon,
  FolderOpenIcon,
  FileText,
} from "lucide-react";
import { CodeTree, FileType } from "@/types/file";
import { supabase } from "@/integrations/supabase/client";

interface Project {
  id: number;
  name: string;
  description: string;
  created_at: string;
  files_json?: string;
}

const ProjectManagement = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateProject, setShowCreateProject] = useState(false);

  // New project form state
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDescription, setNewProjectDescription] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Delete project state
  const [deleteProjectId, setDeleteProjectId] = useState<number | null>(null);
  const [deleteProjectName, setDeleteProjectName] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  // Project file viewer state
  const [viewProjectId, setViewProjectId] = useState<number | null>(null);
  const [viewProjectName, setViewProjectName] = useState("");
  const [viewProjectFiles, setViewProjectFiles] = useState<CodeTree[]>([]);
  
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data, error } = await supabase
          .from('code_projects')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) {
          throw error;
        }
        
        setProjects(data || []);
      } catch (error) {
        console.error("Error fetching projects:", error);
        toast({
          title: "Error fetching projects",
          description: "Please try again later",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchProjects();
  }, []);

  const filteredProjects = useMemo(() => {
    if (!searchQuery.trim()) return projects;
    
    const query = searchQuery.toLowerCase();
    return projects.filter(
      (project) =>
        project.name.toLowerCase().includes(query) ||
        project.description?.toLowerCase().includes(query)
    );
  }, [projects, searchQuery]);

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFiles(e.target.files);
    }
  };

  const resetCreateForm = () => {
    setNewProjectName("");
    setNewProjectDescription("");
    setSelectedFiles(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setShowCreateProject(false);
  };

  const createProject = async () => {
    if (!newProjectName.trim()) {
      toast({
        title: "Project name is required",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      
      // First create the project
      const { data, error } = await supabase
        .from('code_projects')
        .insert({
          name: newProjectName.trim(),
          description: newProjectDescription,
        })
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      const newProject = data;
      
      if (selectedFiles && selectedFiles.length > 0) {
        const files = await processFiles(selectedFiles);
        
        // Update the project with file contents
        const { error: updateError } = await supabase
          .from('code_projects')
          .update({
            files_json: JSON.stringify(files)
          })
          .eq('id', newProject.id);
        
        if (updateError) {
          throw updateError;
        }
        
        newProject.files_json = JSON.stringify(files);
      }
      
      setProjects((prev) => [newProject, ...prev]);
      resetCreateForm();
      
      toast({
        title: "Project created successfully",
        description: `${newProjectName} has been created`,
      });
    } catch (error) {
      console.error("Error creating project:", error);
      toast({
        title: "Error creating project",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const processFiles = async (files: FileList): Promise<any[]> => {
    const result: { path: string; content: string; type: string }[] = [];
    const filePromises: Promise<void>[] = [];
    
    // Group files by directory
    const filesByDirectory: Record<string, File[]> = {};
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const relativePath = file.webkitRelativePath || file.name;
      const directoryPath = relativePath.includes("/")
        ? relativePath.substring(0, relativePath.lastIndexOf("/"))
        : "/";
        
      if (!filesByDirectory[directoryPath]) {
        filesByDirectory[directoryPath] = [];
      }
      
      filesByDirectory[directoryPath].push(file);
    }
    
    // Process each file
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const relativePath = file.webkitRelativePath || file.name;
      
      const filePromise = new Promise<void>((resolve) => {
        const reader = new FileReader();
        
        reader.onload = (e) => {
          if (e.target?.result) {
            result.push({
              path: relativePath,
              content: e.target.result as string,
              type: "file",
            });
          }
          resolve();
        };
        
        reader.onerror = () => {
          resolve();
        };
        
        reader.readAsText(file);
      });
      
      filePromises.push(filePromise);
    }
    
    await Promise.all(filePromises);
    return result;
  };

  const handleDeleteProject = async () => {
    if (!deleteProjectId) return;
    
    try {
      setIsDeleting(true);
      
      const { error } = await supabase
        .from('code_projects')
        .delete()
        .eq('id', deleteProjectId);
      
      if (error) {
        throw error;
      }
      
      setProjects((prev) => prev.filter((p) => p.id !== deleteProjectId));
      
      toast({
        title: "Project deleted",
        description: `${deleteProjectName} has been deleted`,
      });
    } catch (error) {
      console.error("Error deleting project:", error);
      toast({
        title: "Error deleting project",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setDeleteProjectId(null);
      setDeleteProjectName("");
    }
  };

  const openProjectFiles = (project: Project) => {
    setViewProjectId(project.id);
    setViewProjectName(project.name);
    
    if (project.files_json) {
      try {
        const parsedFiles = JSON.parse(project.files_json);
        setViewProjectFiles(parsedFiles);
      } catch (error) {
        console.error("Error parsing project files:", error);
        setViewProjectFiles([]);
        toast({
          title: "Error loading project files",
          description: "Could not parse project files",
          variant: "destructive",
        });
      }
    } else {
      setViewProjectFiles([]);
    }
  };

  return (
    <DashboardLayout title="Projects">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              className="pl-10 max-w-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button onClick={() => setShowCreateProject(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Project
          </Button>
        </div>

        {loading ? (
          <div className="flex h-[400px] w-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredProjects.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="rounded-full bg-muted p-3">
                <FileText className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">No projects found</h3>
              <p className="mb-4 mt-2 text-center text-sm text-muted-foreground">
                {searchQuery
                  ? "Try adjusting your search query"
                  : "Get started by creating your first project"}
              </p>
              {!searchQuery && (
                <Button onClick={() => setShowCreateProject(true)}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create Project
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project) => (
              <Card key={project.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between">
                    <span className="truncate">{project.name}</span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => navigate(`/project-preview/${project.id}`)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Preview
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => openProjectFiles(project)}
                        >
                          <FolderOpenIcon className="mr-2 h-4 w-4" />
                          View Files
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setDeleteProjectId(project.id);
                            setDeleteProjectName(project.name);
                          }}
                          className="text-destructive focus:text-destructive"
                        >
                          <TrashIcon className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardTitle>
                  <CardDescription className="line-clamp-2">
                    {project.description || "No description provided"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <CalendarIcon className="mr-1 h-4 w-4" />
                    Created{" "}
                    {new Date(project.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    variant="ghost"
                    className="w-full"
                    onClick={() => navigate(`/project-preview/${project.id}`)}
                  >
                    Preview
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        {/* Create Project Dialog */}
        <Dialog open={showCreateProject} onOpenChange={setShowCreateProject}>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Create Project</DialogTitle>
              <DialogDescription>
                Create a new code project for assessments
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Project Name *
                </label>
                <Input
                  id="name"
                  placeholder="Enter project name"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="description" className="text-sm font-medium">
                  Description
                </label>
                <Textarea
                  id="description"
                  placeholder="Enter project description"
                  value={newProjectDescription}
                  onChange={(e) => setNewProjectDescription(e.target.value)}
                  rows={3}
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="files" className="text-sm font-medium">
                  Project Files
                </label>
                <Input
                  id="files"
                  type="file"
                  multiple
                  className="cursor-pointer"
                  onChange={handleFileSelect}
                  ref={fileInputRef}
                  directory=""
                />
                <p className="text-xs text-muted-foreground">
                  To upload an entire folder, click "Choose Files", then select a folder
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={resetCreateForm}>
                Cancel
              </Button>
              <Button onClick={createProject} disabled={loading || !newProjectName.trim()}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Project"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Project Confirmation */}
        <AlertDialog
          open={!!deleteProjectId}
          onOpenChange={(open) => !open && setDeleteProjectId(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete the project <span className="font-semibold">{deleteProjectName}</span> and all associated files. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={(e) => {
                  e.preventDefault();
                  handleDeleteProject();
                }}
                disabled={isDeleting}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete Project"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* View Project Files */}
        <Dialog
          open={!!viewProjectId}
          onOpenChange={(open) => !open && setViewProjectId(null)}
        >
          <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-auto">
            <DialogHeader>
              <DialogTitle>
                {viewProjectName} Files
              </DialogTitle>
              <DialogDescription>
                View the files in this project
              </DialogDescription>
            </DialogHeader>

            {viewProjectFiles.length === 0 ? (
              <div className="py-8 text-center">
                <FolderIcon className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <p className="mt-2 text-sm text-muted-foreground">
                  No files available for this project
                </p>
              </div>
            ) : (
              <div className="border rounded-md overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>File Path</TableHead>
                      <TableHead className="w-[100px] text-right">Size</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {viewProjectFiles.map((file, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-mono text-sm">
                          <div className="flex items-center">
                            <FileIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                            {file.path}
                          </div>
                        </TableCell>
                        <TableCell className="text-right text-sm text-muted-foreground">
                          {/* Calculate approximate file size */}
                          {file.content
                            ? `${Math.ceil(file.content.length / 1024)} KB`
                            : "N/A"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setViewProjectId(null)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

// Quick calendar icon component for the project cards
const CalendarIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
    <line x1="16" x2="16" y1="2" y2="6" />
    <line x1="8" x2="8" y1="2" y2="6" />
    <line x1="3" x2="21" y1="10" y2="10" />
  </svg>
);

export default ProjectManagement;
