
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Trophy, Calendar } from "lucide-react";

export interface Contest {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  participantsCount: number;
  prize?: string;
  sponsor?: {
    name: string;
    logo?: string;
  };
  status: "upcoming" | "active" | "ended";
  skills: string[];
}

interface ContestCardProps {
  contest: Contest;
  onClick?: () => void;
}

const ContestCard: React.FC<ContestCardProps> = ({ contest, onClick }) => {
  const getStatusColor = () => {
    switch (contest.status) {
      case "upcoming": return "bg-blue-500 text-white";
      case "active": return "bg-green-500 text-white";
      case "ended": return "bg-slate-500 text-white";
    }
  };

  const getStatusText = () => {
    switch (contest.status) {
      case "upcoming": return "Upcoming";
      case "active": return "Active";
      case "ended": return "Ended";
    }
  };

  const getTimeLeft = () => {
    const now = new Date();
    const end = new Date(contest.endDate);
    const start = new Date(contest.startDate);
    
    if (contest.status === "upcoming") {
      const diffMs = start.getTime() - now.getTime();
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      
      if (diffDays > 0) {
        return `Starts in ${diffDays}d ${diffHours}h`;
      } else {
        return `Starts in ${diffHours}h`;
      }
    } else if (contest.status === "active") {
      const diffMs = end.getTime() - now.getTime();
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      
      if (diffDays > 0) {
        return `${diffDays}d ${diffHours}h left`;
      } else {
        return `${diffHours}h left`;
      }
    } else {
      return "Contest ended";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <Card className="h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1" onClick={onClick}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <Badge className={getStatusColor()}>
              {getStatusText()}
            </Badge>
            <CardTitle className="mt-2">{contest.title}</CardTitle>
          </div>
          {contest.sponsor && (
            <div className="flex-shrink-0 flex flex-col items-end">
              <span className="text-xs text-muted-foreground mb-1">Sponsored by</span>
              {contest.sponsor.logo ? (
                <img 
                  src={contest.sponsor.logo} 
                  alt={contest.sponsor.name} 
                  className="h-6 object-contain" 
                />
              ) : (
                <span className="text-sm font-medium">{contest.sponsor.name}</span>
              )}
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="text-sm space-y-4">
        <p className="text-muted-foreground line-clamp-2">{contest.description}</p>
        
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4 opacity-70" />
            <span>
              {formatDate(contest.startDate)} - {formatDate(contest.endDate)}
            </span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>{contest.participantsCount} participants</span>
          </div>

          {contest.prize && (
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-amber-500" />
              <span>{contest.prize}</span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-1">
          {contest.skills.map(skill => (
            <Badge key={skill} variant="secondary" className="text-xs">
              {skill}
            </Badge>
          ))}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between items-center">
        <div className="text-sm font-medium text-primary">
          {getTimeLeft()}
        </div>
        
        <Button 
          variant={contest.status === "ended" ? "outline" : "default"} 
          size="sm"
        >
          {contest.status === "upcoming" ? "Register" : 
            contest.status === "active" ? "Join Now" : "View Results"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ContestCard;
