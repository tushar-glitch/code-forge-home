
import React from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CheckCircle, Clock, HelpCircle, Loader2 } from "lucide-react";

interface WorkspaceHeaderProps {
  onSubmit: () => void;
  autosaveStatus: "saved" | "saving" | "error";
  testTitle?: string;
}

export const WorkspaceHeader: React.FC<WorkspaceHeaderProps> = ({ 
  onSubmit,
  autosaveStatus,
  testTitle = "Coding Test"
}) => {
  return (
    <header className="border-b border-border flex items-center justify-between px-6 py-3 bg-card">
      <div className="flex items-center gap-2">
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-primary text-primary-foreground text-xs">CP</AvatarFallback>
        </Avatar>
        <span className="font-medium">{testTitle}</span>
      </div>

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        {autosaveStatus === "saved" && (
          <>
            <CheckCircle className="h-4 w-4 text-green-500" />
            All changes saved
          </>
        )}
        {autosaveStatus === "saving" && (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Saving...
          </>
        )}
        {autosaveStatus === "error" && (
          <>
            <span className="text-destructive">Error saving</span>
          </>
        )}
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          <Clock className="h-4 w-4" />
          <span className="text-sm">45:00</span>
        </div>

        <Button variant="outline" size="sm">
          <HelpCircle className="mr-1 h-4 w-4" />
          Help
        </Button>
        
        <Button onClick={onSubmit}>Submit</Button>
      </div>
    </header>
  );
};
