
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Star, Award, Github, Linkedin, ExternalLink } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import BadgeDisplay, { DeveloperBadge } from "./BadgeDisplay";

export interface ProfileData {
  id: string;
  username: string;
  fullName?: string;
  avatarUrl?: string;
  bio?: string;
  joinDate: string;
  skills: string[];
  rank: number;
  totalScore: number;
  challengesSolved: number;
  badges: DeveloperBadge[];
  githubUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
}

interface ProfileSummaryProps {
  profile: ProfileData;
  isPreview?: boolean;
}

const ProfileSummary: React.FC<ProfileSummaryProps> = ({ profile, isPreview = false }) => {
  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: 'long', year: 'numeric' });
  }

  return (
    <Card className={`border ${isPreview ? "shadow-md" : ""}`}>
      <CardHeader>
        <div className="flex flex-col items-center sm:flex-row sm:justify-between sm:items-start gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={profile.avatarUrl} />
              <AvatarFallback className="text-xl font-bold">
                {profile.username.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div className="text-center sm:text-left">
              <CardTitle className="text-2xl">{profile.username}</CardTitle>
              {profile.fullName && (
                <p className="text-sm text-muted-foreground mt-1">{profile.fullName}</p>
              )}
              <div className="flex flex-wrap justify-center sm:justify-start gap-1 mt-2">
                <Badge variant="outline" className="flex gap-1 items-center">
                  <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" /> 
                  Rank #{profile.rank}
                </Badge>
                <Badge variant="outline" className="flex gap-1 items-center">
                  <Award className="h-3 w-3" /> 
                  {profile.totalScore} points
                </Badge>
                <Badge variant="outline">
                  Joined {formatDate(profile.joinDate)}
                </Badge>
              </div>
            </div>
          </div>

          {!isPreview && (
            <Button variant="outline" size="sm" className="gap-2">
              <FileText className="h-4 w-4" />
              Export Profile
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {profile.bio && (
          <p className="text-sm text-muted-foreground">{profile.bio}</p>
        )}
        
        {/* Skills */}
        <div>
          <h4 className="text-sm font-semibold mb-2">Skills</h4>
          <div className="flex flex-wrap gap-1">
            {profile.skills.map((skill) => (
              <Badge key={skill} variant="secondary">
                {skill}
              </Badge>
            ))}
          </div>
        </div>
        
        {/* Badges */}
        <div>
          <h4 className="text-sm font-semibold mb-2">Badges Earned ({profile.badges.length})</h4>
          <div className="flex flex-wrap gap-2">
            {profile.badges.map((badge) => (
              <BadgeDisplay key={badge.id} badge={badge} size="md" />
            ))}
          </div>
        </div>
        
        <Separator />
        
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="text-center p-2 rounded-md bg-muted/50">
            <p className="text-2xl font-bold text-primary">{profile.challengesSolved}</p>
            <p className="text-xs text-muted-foreground">Challenges Solved</p>
          </div>
          <div className="text-center p-2 rounded-md bg-muted/50">
            <p className="text-2xl font-bold text-primary">{profile.totalScore}</p>
            <p className="text-xs text-muted-foreground">Total Score</p>
          </div>
          <div className="text-center p-2 rounded-md bg-muted/50">
            <p className="text-2xl font-bold text-primary">{profile.badges.length}</p>
            <p className="text-xs text-muted-foreground">Badges Earned</p>
          </div>
        </div>
        
        {/* Social Links */}
        {(profile.githubUrl || profile.linkedinUrl || profile.portfolioUrl) && (
          <div className="flex gap-2 justify-center sm:justify-start">
            {profile.githubUrl && (
              <Button variant="outline" size="icon" asChild>
                <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer">
                  <Github className="h-4 w-4" />
                </a>
              </Button>
            )}
            {profile.linkedinUrl && (
              <Button variant="outline" size="icon" asChild>
                <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer">
                  <Linkedin className="h-4 w-4" />
                </a>
              </Button>
            )}
            {profile.portfolioUrl && (
              <Button variant="outline" size="icon" asChild>
                <a href={profile.portfolioUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfileSummary;
