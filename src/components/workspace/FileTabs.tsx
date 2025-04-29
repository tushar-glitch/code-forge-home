
import React from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { FileType } from "@/types/file";

interface FileTabsProps {
  files: FileType[];
  activeFileId: string | null;
  onTabClick: (fileId: string) => void;
  onTabClose: (fileId: string) => void;
}

export const FileTabs: React.FC<FileTabsProps> = ({
  files,
  activeFileId,
  onTabClick,
  onTabClose,
}) => {
  if (files.length === 0) {
    return (
      <div className="h-10 border-b border-border flex items-center px-4 text-sm text-muted-foreground">
        No files open
      </div>
    );
  }

  return (
    <ScrollArea className="border-b border-border flex-shrink-0">
      <div className="flex h-10 items-center">
        {files.map((file) => (
          <div
            key={file.id}
            className={cn(
              "group flex h-9 items-center gap-2 border-r border-border px-4 text-sm",
              activeFileId === file.id
                ? "bg-background text-foreground"
                : "bg-muted/30 text-muted-foreground hover:bg-muted/50"
            )}
          >
            <button
              onClick={() => onTabClick(file.id)}
              className="flex items-center gap-2"
            >
              <span>{file.name}</span>
            </button>
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5 rounded-full opacity-0 transition-opacity group-hover:opacity-100"
              onClick={(e) => {
                e.stopPropagation();
                onTabClose(file.id);
              }}
            >
              <X className="h-3 w-3" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};
