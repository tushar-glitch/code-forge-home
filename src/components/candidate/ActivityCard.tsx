
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Clock } from "lucide-react";

export interface Activity {
  id: string;
  title: string;
  type: "submission" | "badge_earned" | "contest_joined" | "challenge_completed" | "ranking_change";
  timestamp: string;
  details?: {
    challengeName?: string;
    contestName?: string;
    badgeName?: string;
    oldRank?: number;
    newRank?: number;
  };
}

interface ActivityCardProps {
  activity: Activity;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ activity }) => {
  const getActivityIcon = () => {
    switch (activity.type) {
      case "submission":
        return "📝";
      case "badge_earned":
        return "🏅";
      case "contest_joined":
        return "🎮";
      case "challenge_completed":
        return "✅";
      case "ranking_change":
        return "📈";
      default:
        return "📌";
    }
  };

  const getActivityColor = () => {
    switch (activity.type) {
      case "submission":
        return "border-l-blue-500";
      case "badge_earned":
        return "border-l-amber-500";
      case "contest_joined":
        return "border-l-purple-500";
      case "challenge_completed":
        return "border-l-green-500";
      case "ranking_change":
        return "border-l-pink-500";
      default:
        return "border-l-slate-500";
    }
  };

  const getActivityText = () => {
    switch (activity.type) {
      case "submission":
        return `You submitted a solution for ${activity.details?.challengeName}`;
      case "badge_earned":
        return `You earned the ${activity.details?.badgeName} badge!`;
      case "contest_joined":
        return `You joined the ${activity.details?.contestName} contest`;
      case "challenge_completed":
        return `You completed the ${activity.details?.challengeName} challenge`;
      case "ranking_change":
        return `Your rank changed from #${activity.details?.oldRank} to #${activity.details?.newRank}`;
      default:
        return activity.title;
    }
  };

  const date = new Date(activity.timestamp);
  const formattedDate = `${date.toDateString()} at ${date.toLocaleTimeString()}`;

  return (
    <Card className={`border-l-4 ${getActivityColor()} overflow-hidden transition-all hover:shadow-md`}>
      <CardContent className="flex items-center gap-4 p-4">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-muted text-lg">
          {getActivityIcon()}
        </div>
        <div className="flex-1 space-y-1">
          <p className="font-medium">{getActivityText()}</p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <CalendarDays className="h-3 w-3" /> 
            <span>{formattedDate}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityCard;
