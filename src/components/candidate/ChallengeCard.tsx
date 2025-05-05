
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Calendar, CheckCircle, Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced" | "expert";
  tags: string[];
  solvedCount: number;
  totalAttempts: number;
  daysActive: number;
  topContributors: {
    id: string;
    username: string;
    avatarUrl?: string;
  }[];
  isCompleted?: boolean;
}

interface ChallengeCardProps {
  challenge: Challenge;
  onClick?: () => void;
}

const ChallengeCard: React.FC<ChallengeCardProps> = ({ challenge, onClick }) => {
  const difficultyColors = {
    beginner: "bg-green-500",
    intermediate: "bg-blue-500",
    advanced: "bg-amber-500",
    expert: "bg-red-500"
  };
  
  const difficultyText = {
    beginner: "Beginner",
    intermediate: "Intermediate",
    advanced: "Advanced",
    expert: "Expert"
  };
  
  const completionRate = Math.round((challenge.solvedCount / challenge.totalAttempts) * 100) || 0;

  return (
    <Card 
      className={`h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
        challenge.isCompleted ? "border-green-500/30" : ""
      }`}
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="line-clamp-2">{challenge.title}</CardTitle>
          {challenge.isCompleted && (
            <CheckCircle className="h-5 w-5 text-green-500" />
          )}
        </div>
        <div className="flex flex-wrap gap-1 mt-2">
          <Badge variant="outline" className={`${difficultyColors[challenge.difficulty]} text-white`}>
            {difficultyText[challenge.difficulty]}
          </Badge>
          {challenge.tags.slice(0, 3).map(tag => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
          {challenge.tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{challenge.tags.length - 3} more
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="text-sm text-muted-foreground">
        <p className="line-clamp-2 mb-3">{challenge.description}</p>
        
        <div className="grid grid-cols-2 gap-4 mb-3">
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Completion Rate</span>
            <div className="mt-1 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span>{completionRate}%</span>
                <span>{challenge.solvedCount}/{challenge.totalAttempts}</span>
              </div>
              <Progress value={completionRate} className="h-1.5" />
            </div>
          </div>
          
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Active for</span>
            <div className="flex items-center mt-1 gap-1">
              <Calendar className="h-3.5 w-3.5" />
              <span className="text-sm font-medium">{challenge.daysActive} days</span>
            </div>
          </div>
        </div>
        
        {challenge.topContributors.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground mr-1">Top Contributors:</span>
            <div className="flex -space-x-2">
              {challenge.topContributors.slice(0, 3).map((contributor) => (
                <Avatar key={contributor.id} className="h-5 w-5 border border-background">
                  <AvatarImage src={contributor.avatarUrl} />
                  <AvatarFallback className="text-[8px]">
                    {contributor.username.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              ))}
              {challenge.topContributors.length > 3 && (
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-muted text-[8px] font-medium border border-background">
                  +{challenge.topContributors.length - 3}
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter>
        <Button 
          variant={challenge.isCompleted ? "outline" : "default"} 
          size="sm" 
          className="w-full"
        >
          {challenge.isCompleted ? "View Solution" : "Start Challenge"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ChallengeCard;
