
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export interface DeveloperBadge {
  id: string;
  name: string;
  icon: string; // URL to badge icon
  description: string;
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
}

interface BadgeDisplayProps {
  badge: DeveloperBadge;
  size?: "sm" | "md" | "lg";
}

const BadgeDisplay: React.FC<BadgeDisplayProps> = ({ badge, size = "md" }) => {
  const badgeColors = {
    common: "bg-slate-600 hover:bg-slate-500",
    uncommon: "bg-green-600 hover:bg-green-500",
    rare: "bg-blue-600 hover:bg-blue-500",
    epic: "bg-purple-600 hover:bg-purple-500",
    legendary: "bg-amber-600 hover:bg-amber-500",
  };
  
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={`relative flex-shrink-0 ${sizeClasses[size]} cursor-pointer transition-transform hover:scale-110`}>
            <div className={`absolute inset-0 rounded-full ${badgeColors[badge.rarity]} opacity-20`}></div>
            <div className="flex h-full w-full items-center justify-center rounded-full bg-card">
              {badge.icon ? (
                <img src={badge.icon} alt={badge.name} className="h-2/3 w-2/3 object-contain" />
              ) : (
                <span className="text-xs font-semibold">{badge.name.substring(0, 2)}</span>
              )}
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent side="top">
          <div>
            <p className="font-bold">{badge.name}</p>
            <p className="text-xs text-muted-foreground">{badge.description}</p>
            <Badge variant="outline" className="mt-1">
              {badge.rarity.charAt(0).toUpperCase() + badge.rarity.slice(1)}
            </Badge>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default BadgeDisplay;
