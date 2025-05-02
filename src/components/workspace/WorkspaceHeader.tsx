
import React from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";

interface WorkspaceHeaderProps {
  testTitle: string;
  autosaveStatus: "saved" | "saving" | "error";
  onSubmit: () => void;
  isSubmitting?: boolean;
}

export function WorkspaceHeader({ testTitle, autosaveStatus, onSubmit, isSubmitting = false }: WorkspaceHeaderProps) {
  return (
    <header className="h-16 border-b border-border bg-card flex items-center justify-between px-4 md:px-6">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-medium">{testTitle}</h1>
        <Separator orientation="vertical" className="h-6" />
        <div className="text-sm text-muted-foreground">
          {autosaveStatus === "saved" && "All changes saved"}
          {autosaveStatus === "saving" && "Saving..."}
          {autosaveStatus === "error" && "Error saving changes"}
        </div>
      </div>
      <div>
        <Button 
          onClick={onSubmit} 
          disabled={isSubmitting}
          className="gap-2"
        >
          {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
          {isSubmitting ? "Submitting..." : "Submit Test"}
        </Button>
      </div>
    </header>
  );
}
