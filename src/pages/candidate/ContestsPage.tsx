
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar, Search, Trophy, Users } from "lucide-react";
import ContestCard, { Contest } from "@/components/candidate/ContestCard";
import LeaderboardEntry, { LeaderboardUser } from "@/components/candidate/LeaderboardEntry";
import SponsoredBanner from "@/components/candidate/SponsoredBanner";

// Sample data
const dummyContests: Contest[] = [
  {
    id: "1",
    title: "Frontend Masters Challenge",
    description: "Build a complex UI with React and TypeScript in 3 hours. Demonstrate your frontend skills!",
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
    description: "Find and fix as many bugs as possible in a broken application. Debug like a pro!",
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 86400000 * 2).toISOString(),
    participantsCount: 84,
    sponsor: {
      name: "BugFix Inc"
    },
    status: "active",
    skills: ["Debugging", "JavaScript", "Problem Solving"]
  },
  {
    id: "3",
    title: "Full Stack Challenge",
    description: "Build a complete web application with user authentication and database integration.",
    startDate: new Date(Date.now() - 86400000 * 5).toISOString(),
    endDate: new Date(Date.now() - 86400000 * 2).toISOString(),
    participantsCount: 97,
    prize: "MacBook Pro",
    sponsor: {
      name: "Startup Hub",
      logo: "https://placehold.co/100x50?text=StartupHub"
    },
    status: "ended",
    skills: ["Node.js", "React", "MongoDB"]
  },
  {
    id: "4",
    title: "Hackathon: Build a Climate Change Solution",
    description: "Create an innovative solution to help combat climate change using technology.",
    startDate: new Date(Date.now() + 86400000 * 10).toISOString(),
    endDate: new Date(Date.now() + 86400000 * 12).toISOString(),
    participantsCount: 42,
    prize: "$1000 + Mentorship Opportunity",
    sponsor: {
      name: "Green Tech Alliance",
      logo: "https://placehold.co/100x50?text=GreenTech"
    },
    status: "upcoming",
    skills: ["Any Language", "Innovation", "Sustainability"]
  },
  {
    id: "5",
    title: "Mobile App UI Challenge",
    description: "Design and implement a beautiful mobile app UI following design system principles.",
    startDate: new Date(Date.now() + 86400000 * 1).toISOString(),
    endDate: new Date(Date.now() + 86400000 * 3).toISOString(),
    participantsCount: 68,
    sponsor: {
      name: "DesignHub"
    },
    status: "upcoming",
    skills: ["React Native", "Flutter", "UI/UX", "Mobile"]
  },
  {
    id: "6",
    title: "Algorithm Optimization Contest",
    description: "Optimize complex algorithms for better performance and resource usage.",
    startDate: new Date(Date.now() - 86400000 * 7).toISOString(),
    endDate: new Date(Date.now() - 86400000 * 5).toISOString(),
    participantsCount: 112,
    prize: "Gaming Laptop",
    sponsor: {
      name: "AlgoMasters"
    },
    status: "ended",
    skills: ["Algorithms", "Data Structures", "Performance"]
  },
];

const dummyLeaderboard: LeaderboardUser[] = [
  {
    id: "1",
    username: "reactninja",
    avatarUrl: "",
    score: 895,
    rank: 1,
    badges: ["Bug Hunter", "Code Ninja", "Performance Guru"],
    skillTags: ["React", "TypeScript", "Next.js"]
  },
  {
    id: "2",
    username: "devmaster",
    avatarUrl: "",
    score: 842,
    rank: 2,
    badges: ["Bug Hunter", "Code Ninja"],
    skillTags: ["JavaScript", "React", "Node.js"]
  },
  {
    id: "3",
    username: "codewizard",
    avatarUrl: "",
    score: 780,
    rank: 3,
    badges: ["Bug Hunter"],
    skillTags: ["Angular", "TypeScript", "RxJS"]
  },
  {
    id: "4",
    username: "javascriptguru",
    avatarUrl: "",
    score: 745,
    rank: 4,
    badges: ["Bug Hunter"],
    skillTags: ["JavaScript", "Vue.js", "Express"]
  },
  {
    id: "5",
    username: "typescriptpro",
    avatarUrl: "",
    score: 730,
    rank: 5,
    badges: ["Bug Hunter"],
    skillTags: ["TypeScript", "React", "GraphQL"]
  },
  {
    id: "6",
    username: "uimagician",
    avatarUrl: "",
    score: 695,
    rank: 6,
    badges: ["Design Star"],
    skillTags: ["CSS", "UI/UX", "Animation"]
  },
  {
    id: "7",
    username: "backendninja",
    avatarUrl: "",
    score: 680,
    rank: 7,
    badges: ["Database Expert"],
    skillTags: ["Node.js", "MongoDB", "Express"]
  },
  {
    id: "8",
    username: "fullstackdev",
    avatarUrl: "",
    score: 665,
    rank: 8,
    badges: ["Team Player"],
    skillTags: ["React", "Node.js", "MongoDB"]
  },
  {
    id: "9",
    username: "performanceking",
    avatarUrl: "",
    score: 642,
    rank: 9,
    badges: ["Speed Demon"],
    skillTags: ["Optimization", "Algorithms", "JavaScript"]
  },
  {
    id: "10",
    username: "securityexpert",
    avatarUrl: "",
    score: 620,
    rank: 10,
    badges: ["Bug Bounty Hunter"],
    skillTags: ["Security", "Penetration Testing", "Authentication"]
  },
];

interface FilterState {
  search: string;
  skill: string;
  status: string;
}

const ContestsPage = () => {
  const [currentTab, setCurrentTab] = useState<'upcoming' | 'active' | 'past'>('upcoming');
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    skill: '',
    status: ''
  });
  const [selectedContest, setSelectedContest] = useState<Contest | null>(null);
  
  // Extract all unique skills from contests
  const allSkills = Array.from(
    new Set(dummyContests.flatMap(contest => contest.skills))
  ).sort();
  
  // Filter contests based on tab and filter
  const getFilteredContests = () => {
    let filtered = dummyContests.filter(contest => {
      // First filter by tab
      switch (currentTab) {
        case 'upcoming':
          if (contest.status !== 'upcoming') return false;
          break;
        case 'active':
          if (contest.status !== 'active') return false;
          break;
        case 'past':
          if (contest.status !== 'ended') return false;
          break;
      }
      
      // Then apply search filter
      if (filters.search && !contest.title.toLowerCase().includes(filters.search.toLowerCase()) &&
          !contest.description.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }
      
      // Apply skill filter
      if (filters.skill && !contest.skills.includes(filters.skill)) {
        return false;
      }
      
      return true;
    });
    
    return filtered;
  };
  
  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };
  
  const resetFilters = () => {
    setFilters({
      search: '',
      skill: '',
      status: ''
    });
  };
  
  const filteredContests = getFilteredContests();
  
  return (
    <div className="container max-w-7xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Coding Contests</h1>
        <p className="text-muted-foreground">
          Participate in challenges, compete with others, and win prizes
        </p>
      </div>

      {/* Sponsored Banner */}
      <div className="mb-8">
        <SponsoredBanner
          title="Join TechCorp's Exclusive Frontend Masters Challenge"
          description="Demonstrate your React & TypeScript skills and win a $500 cash prize!"
          company="TechCorp"
          companyLogoUrl="https://placehold.co/100x50?text=TechCorp"
          ctaText="Register Now"
          ctaLink="#"
        />
      </div>
      
      {/* Tabs and Filters */}
      <div className="mb-8">
        <Tabs defaultValue="upcoming" onValueChange={(value) => setCurrentTab(value as 'upcoming' | 'active' | 'past')}>
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
            <TabsList>
              <TabsTrigger value="upcoming" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Upcoming ({dummyContests.filter(c => c.status === 'upcoming').length})
              </TabsTrigger>
              <TabsTrigger value="active" className="flex items-center gap-2">
                <Trophy className="h-4 w-4" />
                Active ({dummyContests.filter(c => c.status === 'active').length})
              </TabsTrigger>
              <TabsTrigger value="past" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Past ({dummyContests.filter(c => c.status === 'ended').length})
              </TabsTrigger>
            </TabsList>
            
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search contests..."
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
          </div>
          
          <TabsContent value="upcoming" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredContests.map(contest => (
                <ContestCard 
                  key={contest.id} 
                  contest={contest} 
                  onClick={() => setSelectedContest(contest)} 
                />
              ))}
            </div>
            {filteredContests.length === 0 && (
              <div className="text-center py-12 bg-muted/20 rounded-lg">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-1">No upcoming contests found</h3>
                <p className="text-muted-foreground">
                  Check back later or adjust your filters
                </p>
                {(filters.search || filters.skill) && (
                  <Button variant="outline" className="mt-4" onClick={resetFilters}>
                    Reset Filters
                  </Button>
                )}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="active" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredContests.map(contest => (
                <ContestCard 
                  key={contest.id} 
                  contest={contest}
                  onClick={() => setSelectedContest(contest)}
                />
              ))}
            </div>
            {filteredContests.length === 0 && (
              <div className="text-center py-12 bg-muted/20 rounded-lg">
                <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-1">No active contests right now</h3>
                <p className="text-muted-foreground">
                  Check back later or adjust your filters
                </p>
                {(filters.search || filters.skill) && (
                  <Button variant="outline" className="mt-4" onClick={resetFilters}>
                    Reset Filters
                  </Button>
                )}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="past" className="mt-0">
            {filteredContests.length > 0 && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredContests.map(contest => (
                    <ContestCard 
                      key={contest.id} 
                      contest={contest}
                      onClick={() => setSelectedContest(contest)}
                    />
                  ))}
                </div>
                
                {/* Leaderboard for past contests */}
                <div className="mt-12">
                  <h2 className="text-2xl font-bold mb-6">Latest Contest Leaderboard</h2>
                  
                  <div className="rounded-xl border bg-card overflow-hidden">
                    <div className="bg-muted/30 p-4">
                      <div className="flex items-center gap-4">
                        <Trophy className="h-10 w-10 text-amber-500" />
                        <div>
                          <h3 className="text-xl font-bold">{filteredContests[0]?.title || "Algorithm Optimization Contest"}</h3>
                          <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              <span>{filteredContests[0]?.participantsCount || 112} participants</span>
                            </div>
                            <Badge variant="outline">Contest Ended</Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 space-y-3">
                      {dummyLeaderboard.slice(0, 10).map(user => (
                        <LeaderboardEntry 
                          key={user.id} 
                          user={user} 
                          highlighted={false}
                        />
                      ))}
                    </div>
                    
                    <div className="border-t p-4 text-center">
                      <Button variant="outline">View Complete Results</Button>
                    </div>
                  </div>
                </div>
              </>
            )}
            {filteredContests.length === 0 && (
              <div className="text-center py-12 bg-muted/20 rounded-lg">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-1">No past contests found</h3>
                <p className="text-muted-foreground">
                  Check back later or adjust your filters
                </p>
                {(filters.search || filters.skill) && (
                  <Button variant="outline" className="mt-4" onClick={resetFilters}>
                    Reset Filters
                  </Button>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Practice Section */}
      <div className="mt-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Practice With Past Contests</h2>
          <Button variant="outline">View All</Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {dummyContests.filter(contest => contest.status === 'ended').slice(0, 3).map(contest => (
            <div key={contest.id} className="border rounded-lg overflow-hidden bg-card hover:shadow-md transition-shadow">
              <div className="p-4">
                <Badge variant="outline" className="mb-2">Practice Mode</Badge>
                <h3 className="font-medium text-lg">{contest.title}</h3>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{contest.description}</p>
                
                <div className="flex flex-wrap gap-1 mt-3">
                  {contest.skills.map(skill => (
                    <Badge key={skill} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
                
                <Button variant="default" size="sm" className="w-full mt-4">
                  Start Practice
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContestsPage;
