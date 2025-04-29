
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Lightbulb, Clock } from "lucide-react";
import { motion } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface WorkspaceHeaderProps {
  onSubmit: () => void;
  autosaveStatus: "saved" | "saving" | "error";
}

export const WorkspaceHeader: React.FC<WorkspaceHeaderProps> = ({
  onSubmit,
  autosaveStatus,
}) => {
  const navigate = useNavigate();
  
  // Dummy timer state - in a real app this would be controlled by the server
  const [timeRemaining, setTimeRemaining] = useState({
    hours: 1,
    minutes: 30,
    seconds: 0
  });

  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev.hours === 0 && prev.minutes === 0 && prev.seconds === 0) {
          clearInterval(timer);
          return prev;
        }
        
        let newSeconds = prev.seconds - 1;
        let newMinutes = prev.minutes;
        let newHours = prev.hours;
        
        if (newSeconds < 0) {
          newSeconds = 59;
          newMinutes -= 1;
        }
        
        if (newMinutes < 0) {
          newMinutes = 59;
          newHours -= 1;
        }
        
        return {
          hours: newHours,
          minutes: newMinutes,
          seconds: newSeconds
        };
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  // Format the time nicely
  const formatTime = () => {
    const { hours, minutes, seconds } = timeRemaining;
    const formattedHours = hours < 10 ? `0${hours}` : hours;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
    
    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  };

  return (
    <header className="h-14 border-b border-border bg-card flex items-center justify-between px-4">
      {/* Logo */}
      <div 
        className="text-xl font-bold gradient-text cursor-pointer"
        onClick={() => navigate("/")}
      >
        CodeProbe
      </div>
      
      {/* Timer */}
      <div className="flex items-center gap-2 bg-background rounded-full px-4 py-1.5 shadow-sm">
        <Clock className="h-4 w-4 text-muted-foreground" />
        <div className="font-mono font-semibold">
          {formatTime()}
        </div>
      </div>
      
      {/* Actions */}
      <div className="flex items-center gap-4">
        {/* Autosave indicator */}
        <div className="text-sm text-muted-foreground">
          {autosaveStatus === "saving" ? (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              Saving...
            </motion.span>
          ) : autosaveStatus === "saved" ? (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              All changes saved
            </motion.span>
          ) : (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-destructive"
              transition={{ duration: 0.2 }}
            >
              Error saving
            </motion.span>
          )}
        </div>
        
        {/* Hint button */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon">
                <Lightbulb className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Get hints</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        {/* Submit button */}
        <Button
          onClick={onSubmit}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          Submit Solution
        </Button>
      </div>
    </header>
  );
};
