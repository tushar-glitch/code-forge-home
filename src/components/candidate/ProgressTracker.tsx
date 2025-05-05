
import React from "react";
import { Progress } from "@/components/ui/progress";

interface ProgressTrackerProps {
  currentXP: number;
  nextLevelXP: number;
  level: number;
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({ 
  currentXP, 
  nextLevelXP, 
  level 
}) => {
  const percentage = Math.min(100, Math.floor((currentXP / nextLevelXP) * 100));
  
  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
            {level}
          </div>
          <span className="text-sm font-medium">Developer Level</span>
        </div>
        <span className="text-xs text-muted-foreground">{currentXP} / {nextLevelXP} XP</span>
      </div>
      <Progress value={percentage} className="h-2" />
      <p className="text-xs text-muted-foreground">
        {nextLevelXP - currentXP} XP needed for next level
      </p>
    </div>
  );
};

export default ProgressTracker;
