import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  PlusCircle,
  Trophy,
  Users,
  ActivityIcon,
  Star,
  ListIcon,
  LayoutGrid,
  FileText,
  ChevronRight
} from "lucide-react";
import ActivityCard, { Activity } from "@/components/candidate/ActivityCard";
import ProgressTracker from "@/components/candidate/ProgressTracker";
import BadgeDisplay, { DeveloperBadge } from "@/components/candidate/BadgeDisplay";
import LeaderboardEntry, { LeaderboardUser } from "@/components/candidate/LeaderboardEntry";
import ChallengeCard, { Challenge } from "@/components/candidate/ChallengeCard";
import ContestCard, { Contest } from "@/components/candidate/ContestCard";
import SponsoredBanner from "@/components/candidate/SponsoredBanner";
import ProfileSummary, { ProfileData } from "@/components/candidate/ProfileSummary";

// Sample data for showcasing the UI
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
  }
];

const dummyLeaderboard: LeaderboardUser[] = [
  {
    id: "1",
    username: "reactninja",
    score: 2450,
    rank: 1,
    badges: ["Bug Hunter", "Code Ninja", "Performance Guru"],
    skillTags: ["React", "TypeScript", "Next.js"]
  },
  {
    id: "2",
    username: "devmaster",
    score: 2330,
    rank: 2,
    badges: ["Bug Hunter", "Code Ninja"],
    skillTags: ["JavaScript", "React", "Node.js"]
  },
  {
    id: "3",
    username: "codewizard",
    score: 2120,
    rank: 3,
    badges: ["Bug Hunter"],
    skillTags: ["Angular", "TypeScript", "RxJS"]
  },
  {
    id: "4",
    username: "javascriptguru",
    score: 2050,
    rank: 4,
    badges: ["Bug Hunter"],
    skillTags: ["JavaScript", "Vue.js", "Express"]
  },
  {
    id: "5",
    username: "typescriptpro",
    score: 1950,
    rank: 5,
    badges: ["Bug Hunter"],
    skillTags: ["TypeScript", "React", "GraphQL"]
  }
];

const currentUser: LeaderboardUser = {
  id: "42",
  username: "yourcoolname",
  score: 1250,
  rank: 27,
  badges: ["Bug Hunter"],
  skillTags: ["React", "JavaScript"]
};

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
    ]
  }
];

const dummyContests: Contest[] = [
  {
    id: "1",
    title: "Frontend Masters Challenge",
    description: "Build a complex UI with React and TypeScript in 3 hours",
    startDate: new Date(Date.now() + 86400000 * 2).toISOString(),
    endDate: new Date(Date.now() + 86400000 * 5).toISOString(),
    participantsCount: 126,
    prize: "$500 Cash Prize",
    sponsor: {
      name: "TechCorp",
      logo: "https://placehold.co/100x50?text=TechCorp"
    },
    status: "upcoming",
    skills: ["React", "TypeScript", "UI/UX"]
  },
  {
    id: "2",
    title: "Bug Hunting Challenge",
    description: "Find and fix as many bugs as possible in a broken application",
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 86400000 * 2).toISOString(),
    participantsCount: 84,
    sponsor: {
      name: "BugFix Inc"
    },
    status: "active",
    skills: ["Debugging", "JavaScript", "Problem Solving"]
  }
];

const profileData: ProfileData = {
  id: "42",
  username: "yourcoolname",
  fullName: "Your Full Name",
  avatarUrl: "",
  bio: "Frontend developer passionate about creating clean, accessible and performant web applications.",
  joinDate: new Date(Date.now() - 86400000 * 60).toISOString(),
  skills: ["React", "TypeScript", "Tailwind CSS", "Node.js", "Express"],
  rank: 27,
  totalScore: 1250,
  challengesSolved: 15,
  badges: dummyBadges,
  githubUrl: "https://github.com",
  linkedinUrl: "https://linkedin.com"
};

const CandidateDashboard2 = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  return (
    <div className="container max-w-7xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Developer Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {profileData.username}. Track your progress and explore new coding challenges.
        </p>
      </div>

      {/* Sponsored Banner */}
      <div className="mb-8">
        <SponsoredBanner 
          title="Join the React Performance Challenge sponsored by TechCorp"
          description="Optimize a React application and win exciting prizes!"
          company="TechCorp"
          companyLogoUrl="https://placehold.co/100x50?text=TechCorp"
          ctaText="Join Challenge"
          ctaLink="#"
        />
      </div>
      
      {/* Main Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Current Tests & Progress */}
        <div className="lg:col-span-2 space-y-8">
          {/* Existing Assessments Section */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Your Assessments</CardTitle>
              <CardDescription>
                Track your ongoing and upcoming technical assessments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="pending">
                <TabsList className="mb-6">
                  <TabsTrigger value="pending">Not Started (2)</TabsTrigger>
                  <TabsTrigger value="in-progress">In Progress (1)</TabsTrigger>
                  <TabsTrigger value="completed">Completed (3)</TabsTrigger>
                </TabsList>
                
                <TabsContent value="pending">
                  <div className="space-y-4">
                    <Card key="test1" className="mb-4">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle>Frontend Developer Assessment</CardTitle>
                          <Badge variant="outline">Not Started</Badge>
                        </div>
                        <CardDescription>
                          60 minutes • React
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <Button>Start Test</Button>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card key="test2" className="mb-4">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle>Algorithm Challenge</CardTitle>
                          <Badge variant="outline">Not Started</Badge>
                        </div>
                        <CardDescription>
                          45 minutes • JavaScript
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <Button>Start Test</Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                
                <TabsContent value="in-progress">
                  <Card key="test3" className="mb-4">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>Full Stack Challenge</CardTitle>
                        <Badge variant="secondary">In Progress</Badge>
                      </div>
                      <CardDescription>
                        90 minutes • Node.js & React
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="text-sm">
                          <span className="font-medium">Started:</span> May 4, 2025, 9:30 PM
                        </div>
                        <Button>Continue Test</Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="completed">
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">You have 3 completed assessments</p>
                    <Button variant="outline" className="mt-2">
                      View All Completed Assessments
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          
          {/* Recently Active & Upcoming Challenges */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Recent Challenges</h2>
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setViewMode('grid')}
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setViewMode('list')}
                >
                  <ListIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {dummyChallenges.map(challenge => (
                  <ChallengeCard 
                    key={challenge.id} 
                    challenge={challenge} 
                    onClick={() => navigate(`/challenges/${challenge.id}`)} 
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {dummyChallenges.map(challenge => (
                  <Card 
                    key={challenge.id}
                    className={`transition-all duration-300 hover:shadow-md ${
                      challenge.isCompleted ? "border-green-500/30" : ""
                    }`}
                    onClick={() => navigate(`/challenges/${challenge.id}`)}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{challenge.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">{challenge.description}</p>
                          <div className="flex gap-1 mt-2">
                            <Badge variant="outline" className={`text-xs ${
                              challenge.difficulty === 'beginner' ? 'bg-green-500' :
                              challenge.difficulty === 'intermediate' ? 'bg-blue-500' :
                              challenge.difficulty === 'advanced' ? 'bg-amber-500' : 
                              'bg-red-500'
                            } text-white`}>
                              {challenge.difficulty.charAt(0).toUpperCase() + challenge.difficulty.slice(1)}
                            </Badge>
                            {challenge.tags.slice(0, 2).map(tag => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <Button 
                          variant={challenge.isCompleted ? "outline" : "default"} 
                          size="sm"
                        >
                          {challenge.isCompleted ? "View Solution" : "Start Challenge"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
            
            <div className="mt-4">
              <Button 
                variant="outline" 
                className="w-full flex justify-center items-center gap-1"
                onClick={() => navigate('/candidate/challenges')}
              >
                View All Challenges
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Recent Activity */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <ActivityIcon className="h-5 w-5 text-primary" /> 
                Recent Activity
              </h2>
              <Button variant="ghost" size="sm" className="text-xs">
                View All
              </Button>
            </div>
            
            <div className="space-y-3">
              {dummyActivities.map(activity => (
                <ActivityCard key={activity.id} activity={activity} />
              ))}
            </div>
          </div>
          
          {/* Upcoming Contests */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Trophy className="h-5 w-5 text-primary" /> 
                Upcoming Contests
              </h2>
              <Button variant="ghost" size="sm" className="text-xs">
                View All
              </Button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {dummyContests.map(contest => (
                <ContestCard 
                  key={contest.id} 
                  contest={contest} 
                  onClick={() => navigate(`/contests/${contest.id}`)} 
                />
              ))}
            </div>
          </div>
        </div>
        
        {/* Right Column - Stats, Leaderboard, Profile */}
        <div className="space-y-8">
          {/* Progress & Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Your Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <ProgressTracker 
                currentXP={850} 
                nextLevelXP={1000} 
                level={12} 
              />
              
              <Separator />
              
              {/* Badges */}
              <div>
                <h3 className="text-sm font-medium mb-3">Recent Badges</h3>
                <div className="flex flex-wrap gap-2">
                  {dummyBadges.map(badge => (
                    <BadgeDisplay key={badge.id} badge={badge} size="sm" />
                  ))}
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="rounded-full w-8 h-8"
                    onClick={() => navigate('/profile')}
                  >
                    <PlusCircle className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <Separator />
              
              {/* Stats */}
              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col items-center justify-center bg-muted/50 p-3 rounded-md">
                  <span className="text-2xl font-bold text-primary">15</span>
                  <span className="text-xs text-muted-foreground">Challenges Completed</span>
                </div>
                <div className="flex flex-col items-center justify-center bg-muted/50 p-3 rounded-md">
                  <span className="text-2xl font-bold text-primary">3</span>
                  <span className="text-xs text-muted-foreground">Contests Joined</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Leaderboard */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" /> 
                  Leaderboard
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={() => navigate('/leaderboard')}>
                  Full Rankings
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {dummyLeaderboard.slice(0, 3).map(user => (
                <LeaderboardEntry 
                  key={user.id} 
                  user={user} 
                  highlighted={user.id === currentUser.id}
                />
              ))}
              
              <Separator />
              
              <LeaderboardEntry 
                user={currentUser} 
                highlighted={true}
                showSkills={false}
              />
            </CardContent>
          </Card>
          
          {/* Profile Preview / Proof of Work */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Your Proof-of-Work
              </h2>
              <Button size="sm" onClick={() => navigate('/candidate/profile')}>
                View Profile
              </Button>
            </div>
            
            <ProfileSummary profile={profileData} isPreview={true} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateDashboard2;
