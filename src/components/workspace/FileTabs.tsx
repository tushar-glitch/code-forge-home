
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
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
    return null;
  }

  return (
    <div className="border-b border-border overflow-x-auto">
      <ScrollArea orientation="horizontal" className="h-9">
        <div className="flex h-9">
          <AnimatePresence initial={false}>
            {files.map((file) => {
              const isActive = file.id === activeFileId;
              return (
                <motion.div
                  key={file.id}
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  className={cn(
                    "flex items-center h-9 px-4 border-r border-border relative",
                    isActive && "bg-background border-b-2 border-b-primary"
                  )}
                >
                  <div
                    onClick={() => onTabClick(file.id)}
                    className="flex items-center gap-2 cursor-pointer pr-8"
                  >
                    <span className={cn("text-sm", isActive ? "text-foreground" : "text-muted-foreground")}>
                      {file.name}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onTabClose(file.id)}
                    className="h-4 w-4 absolute right-1 top-1/2 transform -translate-y-1/2 opacity-60 hover:opacity-100"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </ScrollArea>
    </div>
  );
};
