
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  Trophy,
  Medal,
  Star,
  Calendar,
  User,
  FileText,
  Award,
  Code,
  Github,
  Linkedin,
  ExternalLink,
  Share2,
  Download,
  BarChart,
  Settings
} from "lucide-react";
import BadgeDisplay, { DeveloperBadge } from "@/components/candidate/BadgeDisplay";
import ChallengeCard, { Challenge } from "@/components/candidate/ChallengeCard";
import ActivityCard, { Activity } from "@/components/candidate/ActivityCard";

// Sample profile data
const profileData = {
  id: "42",
  username: "yourcoolname",
  fullName: "Your Full Name",
  avatarUrl: "",
  bio: "Frontend developer passionate about creating clean, accessible and performant web applications. I enjoy solving complex problems and continuously learning new technologies.",
  joinDate: new Date(Date.now() - 86400000 * 60).toISOString(),
  skills: ["React", "TypeScript", "Tailwind CSS", "Node.js", "Express", "MongoDB", "GraphQL"],
  level: 12,
  currentXP: 850,
  nextLevelXP: 1000,
  rank: 27,
  totalScore: 1250,
  totalSubmissions: 23,
  challengesSolved: 15,
  githubUrl: "https://github.com",
  linkedinUrl: "https://linkedin.com",
  portfolioUrl: "https://portfolio.com",
};

// Sample badges
const dummyBadges: DeveloperBadge[] = [
  {
    id: "1",
    name: "Bug Hunter",
    icon: "🐞",
    description: "Found and fixed 10 bugs in challenges",
    rarity: "common"
  },
  {
    id: "2",
    name: "Code Ninja",
    icon: "🥷",
    description: "Completed 5 advanced challenges",
    rarity: "rare"
  },
  {
    id: "3",
    name: "Performance Guru",
    icon: "⚡",
    description: "Optimized a React app to improve performance by 50%",
    rarity: "epic"
  },
  {
    id: "4",
    name: "Frontend Master",
    icon: "🎨",
    description: "Demonstrated exceptional UI/UX skills",
    rarity: "rare"
  },
  {
    id: "5",
    name: "Team Player",
    icon: "👥",
    description: "Successfully collaborated on group challenges",
    rarity: "common"
  }
];

// Sample challenges
const dummyChallenges: Challenge[] = [
  {
    id: "1",
    title: "React Performance Optimization",
    description: "Optimize a slow React app to improve rendering performance",
    difficulty: "advanced",
    tags: ["React", "Performance", "Hooks"],
    solvedCount: 128,
    totalAttempts: 345,
    daysActive: 14,
    topContributors: [
      { id: "1", username: "reactninja" },
      { id: "2", username: "devmaster" },
      { id: "3", username: "codewizard" }
    ],
    isCompleted: true
  },
  {
    id: "2",
    title: "Build a Responsive Dashboard",
    description: "Create a responsive admin dashboard with Tailwind CSS",
    difficulty: "intermediate",
    tags: ["Tailwind", "CSS", "Responsive"],
    solvedCount: 245,
    totalAttempts: 412,
    daysActive: 21,
    topContributors: [
      { id: "1", username: "reactninja" },
      { id: "4", username: "javascriptguru" },
      { id: "5", username: "typescriptpro" }
    ],
    isCompleted: true
  },
  {
    id: "3",
    title: "Authentication System with Node.js",
    description: "Build a secure authentication system with JWT",
    difficulty: "advanced",
    tags: ["Node.js", "Express", "JWT"],
    solvedCount: 87,
    totalAttempts: 320,
    daysActive: 30,
    topContributors: [
      { id: "2", username: "devmaster" },
      { id: "6", username: "backenddev" },
      { id: "7", username: "securityexpert" }
    ],
    isCompleted: true
  },
];

// Sample activities
const dummyActivities: Activity[] = [
  {
    id: "1",
    title: "You completed the React Performance Challenge",
    type: "challenge_completed",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    details: {
      challengeName: "React Performance Challenge"
    }
  },
  {
    id: "2",
    title: "You earned the Bug Hunter Badge",
    type: "badge_earned",
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    details: {
      badgeName: "Bug Hunter"
    }
  },
  {
    id: "3",
    title: "You joined the Frontend Masters Contest",
    type: "contest_joined",
    timestamp: new Date(Date.now() - 172800000).toISOString(),
    details: {
      contestName: "Frontend Masters Contest"
    }
  },
  {
    id: "4",
    title: "Your rank changed from #42 to #27",
    type: "ranking_change",
    timestamp: new Date(Date.now() - 259200000).toISOString(),
    details: {
      oldRank: 42,
      newRank: 27
    }
  }
];

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState<string>("overview");
  
  const percentage = Math.min(100, Math.floor((profileData.currentXP / profileData.nextLevelXP) * 100));
  
  return (
    <div className="container max-w-7xl mx-auto py-8 px-4">
      {/* Profile Header */}
      <div className="mb-8">
        <div className="rounded-xl border bg-card overflow-hidden">
          <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent h-32 relative">
            <div className="absolute -bottom-16 left-8">
              <Avatar className="h-32 w-32 border-4 border-background">
                <AvatarImage src={profileData.avatarUrl} />
                <AvatarFallback className="text-4xl font-bold">
                  {profileData.username.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="absolute top-4 right-4 flex gap-2">
              <Button variant="outline" size="sm" className="bg-background/80 backdrop-blur-sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share Profile
              </Button>
              <Button variant="outline" size="sm" className="bg-background/80 backdrop-blur-sm">
                <Download className="h-4 w-4 mr-2" />
                Export Resume
              </Button>
              <Button variant="outline" size="icon" size-="sm" className="bg-background/80 backdrop-blur-sm">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="mt-20 px-8 pb-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold">{profileData.username}</h1>
                {profileData.fullName && (
                  <p className="text-muted-foreground">{profileData.fullName}</p>
                )}
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="outline" className="flex gap-1 items-center">
                    <Trophy className="h-3 w-3" /> 
                    Rank #{profileData.rank}
                  </Badge>
                  <Badge variant="outline" className="flex gap-1 items-center">
                    <Calendar className="h-3 w-3" /> 
                    Joined {new Date(profileData.joinDate).toLocaleDateString("en-US", { month: 'long', year: 'numeric' })}
                  </Badge>
                </div>
              </div>
              
              <div className="flex gap-2">
                {profileData.githubUrl && (
                  <Button variant="outline" size="icon" asChild>
                    <a href={profileData.githubUrl} target="_blank" rel="noopener noreferrer">
                      <Github className="h-4 w-4" />
                    </a>
                  </Button>
                )}
                {profileData.linkedinUrl && (
                  <Button variant="outline" size="icon" asChild>
                    <a href={profileData.linkedinUrl} target="_blank" rel="noopener noreferrer">
                      <Linkedin className="h-4 w-4" />
                    </a>
                  </Button>
                )}
                {profileData.portfolioUrl && (
                  <Button variant="outline" size="icon" asChild>
                    <a href={profileData.portfolioUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                )}
              </div>
            </div>
            
            {/* Bio */}
            {profileData.bio && (
              <p className="mt-4 text-muted-foreground">{profileData.bio}</p>
            )}
            
            {/* Skills */}
            <div className="flex flex-wrap gap-1 mt-4">
              {profileData.skills.map(skill => (
                <Badge key={skill} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Profile Content with Tabs */}
      <div className="mb-8">
        <Tabs defaultValue="overview" onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="challenges" className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              Challenges ({dummyChallenges.length})
            </TabsTrigger>
            <TabsTrigger value="badges" className="flex items-center gap-2">
              <Award className="h-4 w-4" />
              Badges ({dummyBadges.length})
            </TabsTrigger>
            <TabsTrigger value="activity" className="flex items-center gap-2">
              <BarChart className="h-4 w-4" />
              Activity
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Trophy className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Rank</p>
                      <p className="text-2xl font-bold">#{profileData.rank}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Star className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Score</p>
                      <p className="text-2xl font-bold">{profileData.totalScore}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Code className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Challenges Solved</p>
                      <p className="text-2xl font-bold">{profileData.challengesSolved}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Medal className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Badges Earned</p>
                      <p className="text-2xl font-bold">{dummyBadges.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Progress Section */}
            <Card>
              <CardHeader>
                <CardTitle>Developer Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                        {profileData.level}
                      </div>
                      <span className="font-medium">Level {profileData.level}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">{profileData.currentXP} / {profileData.nextLevelXP} XP</span>
                  </div>
                  <Progress value={percentage} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    {profileData.nextLevelXP - profileData.currentXP} XP needed for next level
                  </p>
                </div>
                
                <Separator />
                
                {/* Recent Badges */}
                <div>
                  <h3 className="text-sm font-medium mb-3">Recently Earned Badges</h3>
                  <div className="flex flex-wrap gap-2">
                    {dummyBadges.slice(0, 4).map(badge => (
                      <BadgeDisplay key={badge.id} badge={badge} />
                    ))}
                    {dummyBadges.length > 4 && (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="rounded-full w-12 h-12"
                        onClick={() => setActiveTab("badges")}
                      >
                        +{dummyBadges.length - 4}
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Recent Challenges */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Recent Challenges</h2>
                <Button variant="ghost" size="sm" onClick={() => setActiveTab("challenges")}>
                  View All
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {dummyChallenges.slice(0, 3).map(challenge => (
                  <ChallengeCard key={challenge.id} challenge={challenge} />
                ))}
              </div>
            </div>
            
            {/* Recent Activity */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Recent Activity</h2>
                <Button variant="ghost" size="sm" onClick={() => setActiveTab("activity")}>
                  View All
                </Button>
              </div>
              
              <div className="space-y-3">
                {dummyActivities.slice(0, 3).map(activity => (
                  <ActivityCard key={activity.id} activity={activity} />
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="challenges">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Your Challenges</h2>
                <div className="flex items-center gap-2">
                  <Badge className="flex items-center gap-1">
                    <Star className="h-3 w-3" />
                    {dummyChallenges.length} Completed
                  </Badge>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {dummyChallenges.map(challenge => (
                  <ChallengeCard key={challenge.id} challenge={challenge} />
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="badges">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Your Badges</h2>
                <Badge className="flex items-center gap-1">
                  <Trophy className="h-3 w-3" />
                  {dummyBadges.length} Earned
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {dummyBadges.map(badge => (
                  <Card key={badge.id} className="overflow-hidden hover:shadow-md transition-shadow">
                    <div className={`h-1 w-full ${
                      badge.rarity === 'common' ? 'bg-slate-500' :
                      badge.rarity === 'uncommon' ? 'bg-green-500' :
                      badge.rarity === 'rare' ? 'bg-blue-500' :
                      badge.rarity === 'epic' ? 'bg-purple-500' :
                      'bg-amber-500'
                    }`} />
                    <CardContent className="pt-6 flex items-center gap-4">
                      <div className="flex-shrink-0">
                        <BadgeDisplay badge={badge} size="lg" />
                      </div>
                      <div>
                        <h3 className="font-medium">{badge.name}</h3>
                        <p className="text-sm text-muted-foreground">{badge.description}</p>
                        <Badge variant="outline" className="mt-2 text-xs">
                          {badge.rarity.charAt(0).toUpperCase() + badge.rarity.slice(1)}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="activity">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Activity History</h2>
                <Select>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Activity</SelectItem>
                    <SelectItem value="challenges">Challenges</SelectItem>
                    <SelectItem value="badges">Badges</SelectItem>
                    <SelectItem value="contests">Contests</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-3">
                {dummyActivities.map(activity => (
                  <ActivityCard key={activity.id} activity={activity} />
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Export Profile */}
      <Card>
        <CardContent className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-medium">Export Your Profile as a Resume</h3>
              <p className="text-sm text-muted-foreground">
                Showcase your skills, completed challenges, and badges to potential employers
              </p>
            </div>
          </div>
          <Button className="shrink-0">
            <Download className="h-4 w-4 mr-2" />
            Export Resume
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;
