
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Trophy, Users, Star, Filter, Medal, Calendar } from "lucide-react";
import { LeaderboardUser } from "@/components/candidate/LeaderboardEntry";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import BadgeDisplay, { DeveloperBadge } from "@/components/candidate/BadgeDisplay";

// Sample data
const dummyBadges: Record<string, DeveloperBadge> = {
  "bug_hunter": {
    id: "1",
    name: "Bug Hunter",
    icon: "🐞",
    description: "Found and fixed 10 bugs in challenges",
    rarity: "common"
  },
  "code_ninja": {
    id: "2",
    name: "Code Ninja",
    icon: "🥷",
    description: "Completed 5 advanced challenges",
    rarity: "rare"
  },
  "performance_guru": {
    id: "3",
    name: "Performance Guru",
    icon: "⚡",
    description: "Optimized a React app to improve performance by 50%",
    rarity: "epic"
  },
  "design_star": {
    id: "4",
    name: "Design Star",
    icon: "🎨",
    description: "Created beautifully designed UI components",
    rarity: "rare"
  },
  "database_expert": {
    id: "5",
    name: "Database Expert",
    icon: "🗄️",
    description: "Mastered complex database optimizations",
    rarity: "rare"
  },
  "team_player": {
    id: "6",
    name: "Team Player",
    icon: "👥",
    description: "Successfully collaborated on group challenges",
    rarity: "common"
  },
  "speed_demon": {
    id: "7",
    name: "Speed Demon",
    icon: "⚡",
    description: "Completed challenges in record time",
    rarity: "uncommon"
  },
  "bug_bounty_hunter": {
    id: "8",
    name: "Bug Bounty Hunter",
    icon: "🔍",
    description: "Found critical security vulnerabilities",
    rarity: "epic"
  },
  "algorithm_master": {
    id: "9",
    name: "Algorithm Master",
    icon: "🧮",
    description: "Solved complex algorithmic challenges",
    rarity: "legendary"
  },
  "full_stack_wizard": {
    id: "10",
    name: "Full Stack Wizard",
    icon: "🧙",
    description: "Demonstrated excellence in both frontend and backend",
    rarity: "legendary"
  }
};

const dummyLeaderboard: LeaderboardUser[] = [
  {
    id: "1",
    username: "reactninja",
    avatarUrl: "",
    score: 2450,
    rank: 1,
    badges: ["bug_hunter", "code_ninja", "performance_guru"],
    skillTags: ["React", "TypeScript", "Next.js"]
  },
  {
    id: "2",
    username: "devmaster",
    avatarUrl: "",
    score: 2330,
    rank: 2,
    badges: ["bug_hunter", "code_ninja", "algorithm_master"],
    skillTags: ["JavaScript", "React", "Node.js"]
  },
  {
    id: "3",
    username: "codewizard",
    avatarUrl: "",
    score: 2120,
    rank: 3,
    badges: ["bug_hunter", "performance_guru"],
    skillTags: ["Angular", "TypeScript", "RxJS"]
  },
  {
    id: "4",
    username: "javascriptguru",
    avatarUrl: "",
    score: 2050,
    rank: 4,
    badges: ["bug_hunter", "algorithm_master"],
    skillTags: ["JavaScript", "Vue.js", "Express"]
  },
  {
    id: "5",
    username: "typescriptpro",
    avatarUrl: "",
    score: 1950,
    rank: 5,
    badges: ["bug_hunter", "full_stack_wizard"],
    skillTags: ["TypeScript", "React", "GraphQL"]
  },
  {
    id: "6",
    username: "uimagician",
    avatarUrl: "",
    score: 1895,
    rank: 6,
    badges: ["design_star", "speed_demon"],
    skillTags: ["CSS", "UI/UX", "Animation"]
  },
  {
    id: "7",
    username: "backendninja",
    avatarUrl: "",
    score: 1880,
    rank: 7,
    badges: ["database_expert", "bug_bounty_hunter"],
    skillTags: ["Node.js", "MongoDB", "Express"]
  },
  {
    id: "8",
    username: "fullstackdev",
    avatarUrl: "",
    score: 1765,
    rank: 8,
    badges: ["team_player", "full_stack_wizard"],
    skillTags: ["React", "Node.js", "MongoDB"]
  },
  {
    id: "9",
    username: "performanceking",
    avatarUrl: "",
    score: 1742,
    rank: 9,
    badges: ["speed_demon", "performance_guru"],
    skillTags: ["Optimization", "Algorithms", "JavaScript"]
  },
  {
    id: "10",
    username: "securityexpert",
    avatarUrl: "",
    score: 1720,
    rank: 10,
    badges: ["bug_bounty_hunter", "team_player"],
    skillTags: ["Security", "Penetration Testing", "Authentication"]
  },
  {
    id: "11",
    username: "mobilemaster",
    avatarUrl: "",
    score: 1694,
    rank: 11,
    badges: ["design_star", "speed_demon"],
    skillTags: ["React Native", "Flutter", "Mobile UI"]
  },
  {
    id: "12",
    username: "datasciencepro",
    avatarUrl: "",
    score: 1680,
    rank: 12,
    badges: ["algorithm_master", "database_expert"],
    skillTags: ["Python", "Data Visualization", "Machine Learning"]
  },
  {
    id: "13",
    username: "cloudninja",
    avatarUrl: "",
    score: 1655,
    rank: 13,
    badges: ["team_player", "bug_hunter"],
    skillTags: ["AWS", "DevOps", "Infrastructure"]
  },
  {
    id: "14",
    username: "testingwizard",
    avatarUrl: "",
    score: 1632,
    rank: 14,
    badges: ["bug_bounty_hunter", "bug_hunter"],
    skillTags: ["Testing", "QA Automation", "Jest"]
  },
  {
    id: "15",
    username: "algorithmguru",
    avatarUrl: "",
    score: 1620,
    rank: 15,
    badges: ["algorithm_master", "speed_demon"],
    skillTags: ["Algorithms", "Data Structures", "Problem Solving"]
  },
  {
    id: "42",
    username: "yourcoolname",
    avatarUrl: "",
    score: 1250,
    rank: 27,
    badges: ["bug_hunter", "team_player"],
    skillTags: ["React", "JavaScript", "CSS"]
  },
];

interface FilterState {
  search: string;
  skill: string;
  period: string;
}

const LeaderboardPage = () => {
  const [currentTab, setCurrentTab] = useState<'global' | 'challenges' | 'contests'>('global');
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    skill: '',
    period: 'all-time'
  });
  const [selectedUser, setSelectedUser] = useState<LeaderboardUser | null>(null);
  const currentUser = dummyLeaderboard.find(u => u.username === "yourcoolname") || null;
  
  // Extract all unique skills
  const allSkills = Array.from(
    new Set(dummyLeaderboard.flatMap(user => user.skillTags))
  ).sort();
  
  // Filter users based on filters
  const filteredLeaderboard = dummyLeaderboard.filter(user => {
    // Search filter
    if (filters.search && !user.username.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    
    // Skill filter
    if (filters.skill && !user.skillTags.includes(filters.skill)) {
      return false;
    }
    
    // We would normally filter by period here using timestamps
    // but for this demo we'll just include all users
    
    return true;
  });
  
  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };
  
  const resetFilters = () => {
    setFilters({
      search: '',
      skill: '',
      period: 'all-time'
    });
  };
  
  // Get formatted rank display with medal icons for top 3
  const getRankDisplay = (rank: number) => {
    if (rank === 1) {
      return (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500 text-white">
          <Trophy className="h-4 w-4" />
        </div>
      );
    } else if (rank === 2) {
      return (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-400 text-white">
          <Medal className="h-4 w-4" />
        </div>
      );
    } else if (rank === 3) {
      return (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-700 text-white">
          <Medal className="h-4 w-4" />
        </div>
      );
    } else {
      return (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-foreground">
          <span className="text-sm font-bold">{rank}</span>
        </div>
      );
    }
  };
  
  return (
    <div className="container max-w-7xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Leaderboard</h1>
        <p className="text-muted-foreground">
          See how you stack up against other developers in the community
        </p>
      </div>
      
      <div className="mb-8">
        <Tabs 
          defaultValue="global" 
          onValueChange={(value) => setCurrentTab(value as 'global' | 'challenges' | 'contests')}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <TabsList>
              <TabsTrigger value="global" className="flex items-center gap-2">
                <Trophy className="h-4 w-4" />
                Global Rankings
              </TabsTrigger>
              <TabsTrigger value="challenges" className="flex items-center gap-2">
                <Star className="h-4 w-4" />
                By Challenge
              </TabsTrigger>
              <TabsTrigger value="contests" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                By Contest
              </TabsTrigger>
            </TabsList>
            
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select
                value={filters.period}
                onValueChange={(value) => handleFilterChange('period', value)}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Time Period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-time">All Time</SelectItem>
                  <SelectItem value="this-month">This Month</SelectItem>
                  <SelectItem value="this-week">This Week</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                className="pl-10"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>
            
            <Select
              value={filters.skill}
              onValueChange={(value) => handleFilterChange('skill', value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by Skill" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Skills</SelectItem>
                {allSkills.map(skill => (
                  <SelectItem key={skill} value={skill}>{skill}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button variant="ghost" size="sm" onClick={resetFilters}>
              Reset
            </Button>
          </div>
          
          <TabsContent value="global" className="space-y-6 mt-0">
            {/* Top 3 Users - Desktop View */}
            <div className="hidden md:flex gap-4">
              {filteredLeaderboard.slice(0, 3).map((user, index) => (
                <Card key={user.id} className={`flex-1 overflow-hidden ${index === 0 ? 'bg-gradient-to-b from-amber-500/10 to-transparent border-amber-500/30' : ''}`}>
                  <CardHeader className="text-center pb-0">
                    <div className={`mx-auto p-2 rounded-full ${
                      index === 0 ? "bg-amber-500" : 
                      index === 1 ? "bg-slate-400" : 
                      "bg-amber-700"
                    } text-white`}>
                      <Trophy className="h-6 w-6" />
                    </div>
                    <div className="mt-2">
                      <Badge variant="outline" className="font-bold">
                        Rank #{user.rank}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="text-center pt-4">
                    <Avatar className={`h-20 w-20 mx-auto border-4 ${
                      index === 0 ? "border-amber-500" : 
                      index === 1 ? "border-slate-400" : 
                      "border-amber-700"
                    }`}>
                      <AvatarImage src={user.avatarUrl} />
                      <AvatarFallback className="text-xl font-bold">
                        {user.username.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    
                    <h3 className="text-xl font-bold mt-3">{user.username}</h3>
                    <p className="text-2xl font-bold mt-2 text-primary">{user.score} points</p>
                    
                    <div className="flex flex-wrap justify-center gap-1 mt-3">
                      {user.skillTags.slice(0, 3).map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex justify-center gap-1 mt-4">
                      {user.badges.slice(0, 3).map(badgeId => (
                        <BadgeDisplay 
                          key={badgeId} 
                          badge={dummyBadges[badgeId]} 
                          size="sm" 
                        />
                      ))}
                    </div>
                    
                    <Button variant="outline" className="mt-4" onClick={() => setSelectedUser(user)}>
                      View Profile
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {/* Main Leaderboard Table */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Global Rankings</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-1">
                  {filteredLeaderboard.map(user => {
                    const isCurrentUser = user.id === currentUser?.id;
                    
                    return (
                      <div 
                        key={user.id} 
                        className={`flex items-center gap-4 p-3 hover:bg-muted/50 cursor-pointer transition-colors ${
                          isCurrentUser ? 'border-l-4 border-primary bg-primary/5' : ''
                        }`}
                        onClick={() => setSelectedUser(user)}
                      >
                        <div className="flex-shrink-0">
                          {getRankDisplay(user.rank)}
                        </div>
                        
                        <Avatar className="h-10 w-10 border border-muted">
                          <AvatarImage src={user.avatarUrl} />
                          <AvatarFallback>
                            {user.username.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center">
                            <span className="font-medium">{user.username}</span>
                            {isCurrentUser && (
                              <Badge className="ml-2 text-xs" variant="secondary">You</Badge>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {user.skillTags.slice(0, 2).map(tag => (
                              <Badge key={tag} variant="outline" className="text-[10px] py-0 px-1">
                                {tag}
                              </Badge>
                            ))}
                            {user.skillTags.length > 2 && (
                              <span className="text-[10px] text-muted-foreground">
                                +{user.skillTags.length - 2} more
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex gap-1.5 mr-2">
                          {user.badges.slice(0, 3).map(badgeId => (
                            <div key={badgeId} className="w-5 h-5 bg-muted rounded-full flex items-center justify-center text-xs overflow-hidden">
                              {dummyBadges[badgeId]?.icon || '🏆'}
                            </div>
                          ))}
                          {user.badges.length > 3 && (
                            <div className="w-5 h-5 bg-muted rounded-full flex items-center justify-center text-[8px] font-medium">
                              +{user.badges.length - 3}
                            </div>
                          )}
                        </div>
                        
                        <div className="text-right">
                          <div className="font-bold text-primary">{user.score}</div>
                          <div className="text-xs text-muted-foreground">points</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
            
            {/* Your Position */}
            {currentUser && (
              <Card className="border-primary/30">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Your Position</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                      {getRankDisplay(currentUser.rank)}
                    </div>
                    
                    <Avatar className="h-10 w-10 border-2 border-primary">
                      <AvatarImage src={currentUser.avatarUrl} />
                      <AvatarFallback>
                        {currentUser.username.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="font-bold">{currentUser.username}</div>
                      <div className="text-muted-foreground text-sm">
                        {currentUser.score} points
                      </div>
                    </div>
                    
                    <div>
                      <Button size="sm" onClick={() => setSelectedUser(currentUser)}>
                        View Your Profile
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="challenges">
            <div className="text-center py-12 bg-muted/20 rounded-lg">
              <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-1">Challenge-specific leaderboards</h3>
              <p className="text-muted-foreground mb-4">
                Select a specific challenge to see rankings by performance
              </p>
              <Select>
                <SelectTrigger className="w-[240px] mx-auto">
                  <SelectValue placeholder="Select a challenge" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="react">React Performance Challenge</SelectItem>
                  <SelectItem value="css">CSS Animation Challenge</SelectItem>
                  <SelectItem value="algo">Algorithm Optimization Contest</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>
          
          <TabsContent value="contests">
            <div className="text-center py-12 bg-muted/20 rounded-lg">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-1">Contest-specific leaderboards</h3>
              <p className="text-muted-foreground mb-4">
                Select a specific contest to see its leaderboard
              </p>
              <Select>
                <SelectTrigger className="w-[240px] mx-auto">
                  <SelectValue placeholder="Select a contest" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="frontend">Frontend Masters Challenge</SelectItem>
                  <SelectItem value="bug">Bug Hunting Challenge</SelectItem>
                  <SelectItem value="fullstack">Full Stack Challenge</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default LeaderboardPage;
