
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronDown, File, Folder, FileText, PlusCircle, Trash2, FilePlus2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { FileType } from "@/types/file";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Input } from "@/components/ui/input";

interface FileExplorerProps {
  files: FileType[];
  activeFileId: string | null;
  onFileClick: (file: FileType) => void;
  className?: string;
}

export const FileExplorer: React.FC<FileExplorerProps> = ({
  files,
  activeFileId,
  onFileClick,
  className
}) => {
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    "root": true,
    "pages": true,
    "components": true
  });
  const [newItemType, setNewItemType] = useState<"file" | "folder" | null>(null);
  const [newItemParentId, setNewItemParentId] = useState<string | null>(null);
  const [newItemName, setNewItemName] = useState("");

  const toggleFolder = (folderId: string) => {
    setExpandedFolders(prev => ({
      ...prev,
      [folderId]: !prev[folderId]
    }));
  };

  const handleFileAdd = (parentId: string, type: "file" | "folder") => {
    setNewItemType(type);
    setNewItemParentId(parentId);
    setNewItemName("");
  };

  const handleFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    
    switch (extension) {
      case 'js':
      case 'jsx':
        return <FileText className="w-4 h-4 text-yellow-500" />;
      case 'ts':
      case 'tsx':
        return <FileText className="w-4 h-4 text-blue-500" />;
      case 'json':
        return <FileText className="w-4 h-4 text-orange-400" />;
      case 'md':
        return <FileText className="w-4 h-4 text-gray-400" />;
      default:
        return <File className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const renderFiles = (fileList: FileType[], level = 0) => {
    return fileList.map((file) => {
      const isExpanded = expandedFolders[file.id];
      const isActive = file.id === activeFileId;
      
      return (
        <div key={file.id}>
          <ContextMenu>
            <ContextMenuTrigger>
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
                className={cn(
                  "flex items-center py-1 px-2 cursor-pointer text-sm group",
                  isActive && !file.isFolder && "bg-accent text-accent-foreground",
                  !isActive && "hover:bg-accent/50"
                )}
                style={{ paddingLeft: `${(level + 1) * 12}px` }}
                onClick={() => file.isFolder ? toggleFolder(file.id) : onFileClick(file)}
                onDoubleClick={() => file.isFolder && toggleFolder(file.id)}
              >
                <div className="w-4 h-4 mr-2 flex-shrink-0">
                  {file.isFolder ? (
                    isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    )
                  ) : (
                    handleFileIcon(file.name)
                  )}
                </div>
                <div className="truncate mr-2">
                  {file.name}
                </div>
                
                {file.isFolder && (
                  <div className="ml-auto opacity-0 group-hover:opacity-100 flex gap-1">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-5 w-5" 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleFileAdd(file.id, "file");
                            }}
                          >
                            <FilePlus2 className="h-3 w-3" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Add File</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-5 w-5" 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleFileAdd(file.id, "folder");
                            }}
                          >
                            <PlusCircle className="h-3 w-3" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Add Folder</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                )}
              </motion.div>
            </ContextMenuTrigger>
            <ContextMenuContent className="w-64">
              {file.isFolder ? (
                <>
                  <ContextMenuItem
                    onClick={() => handleFileAdd(file.id, "file")}
                  >
                    <FilePlus2 className="mr-2 h-4 w-4" />
                    New File
                  </ContextMenuItem>
                  <ContextMenuItem
                    onClick={() => handleFileAdd(file.id, "folder")}
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    New Folder
                  </ContextMenuItem>
                </>
              ) : (
                <>
                  <ContextMenuItem
                    onClick={() => onFileClick(file)}
                  >
                    <File className="mr-2 h-4 w-4" />
                    Open File
                  </ContextMenuItem>
                </>
              )}
              <ContextMenuItem className="text-destructive focus:text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
          
          {/* New item input field */}
          {newItemParentId === file.id && newItemType && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="pl-8 pr-2 py-1"
            >
              <div className="flex items-center">
                <div className="w-4 h-4 mr-2">
                  {newItemType === "folder" ? 
                    <Folder className="w-4 h-4 text-muted-foreground" /> : 
                    <File className="w-4 h-4 text-muted-foreground" />}
                </div>
                <Input
                  className="h-7 py-1 text-sm"
                  placeholder={newItemType === "folder" ? "Folder name..." : "File name..."}
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && newItemName) {
                      // Logic for creating a new file would go here
                      setNewItemType(null);
                      setNewItemParentId(null);
                    } else if (e.key === "Escape") {
                      setNewItemType(null);
                      setNewItemParentId(null);
                    }
                  }}
                  onBlur={() => {
                    setNewItemType(null);
                    setNewItemParentId(null);
                  }}
                />
              </div>
            </motion.div>
          )}
          
          {file.isFolder && isExpanded && file.children && file.children.length > 0 && (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                {renderFiles(file.children, level + 1)}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      );
    });
  };

  return (
    <div className={cn("h-full overflow-auto p-1", className)}>
      <div className="font-medium text-sm px-3 py-2 flex items-center justify-between">
        <div>Explorer</div>
        <div className="flex gap-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6" 
                  onClick={() => handleFileAdd("root", "file")}
                >
                  <FilePlus2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Add File</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6" 
                  onClick={() => handleFileAdd("root", "folder")}
                >
                  <PlusCircle className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Add Folder</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      <div className="mt-2 space-y-1">
        {renderFiles(files)}
      </div>
    </div>
  );
};
