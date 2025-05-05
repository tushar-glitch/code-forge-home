
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export interface LeaderboardUser {
  id: string;
  username: string;
  avatarUrl?: string;
  score: number;
  rank: number;
  badges: string[];
  skillTags: string[];
}

interface LeaderboardEntryProps {
  user: LeaderboardUser;
  highlighted?: boolean;
  showSkills?: boolean;
}

const LeaderboardEntry: React.FC<LeaderboardEntryProps> = ({ 
  user, 
  highlighted = false,
  showSkills = true
}) => {
  const getRankColor = (rank: number) => {
    if (rank === 1) return "bg-amber-500 text-white";
    if (rank === 2) return "bg-slate-400 text-white";
    if (rank === 3) return "bg-amber-700 text-white";
    return "bg-muted text-foreground";
  };

  return (
    <div 
      className={`flex items-center gap-4 rounded-lg border p-3 transition-colors ${
        highlighted ? 'border-primary/50 bg-primary/5' : 'border-transparent'
      }`}
    >
      <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold ${getRankColor(user.rank)}`}>
        {user.rank}
      </div>
      
      <Avatar className="h-10 w-10 border-2 border-muted">
        <AvatarImage src={user.avatarUrl} />
        <AvatarFallback>{user.username.substring(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>
      
      <div className="flex-1 min-w-0">
        <div className="font-medium truncate">{user.username}</div>
        {showSkills && user.skillTags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {user.skillTags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs py-0">
                {tag}
              </Badge>
            ))}
            {user.skillTags.length > 3 && (
              <Badge variant="outline" className="text-xs py-0">
                +{user.skillTags.length - 3} more
              </Badge>
            )}
          </div>
        )}
      </div>
      
      <div className="text-right">
        <div className="font-bold text-primary">{user.score}</div>
        <div className="text-xs text-muted-foreground">points</div>
      </div>
    </div>
  );
};

export default LeaderboardEntry;
