
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Trophy, Star, Users, LayoutDashboard, Loader2 } from "lucide-react";
import CandidateNavbar from "@/components/candidate/CandidateNavbar";
import LeaderboardEntry, { LeaderboardUser } from "@/components/candidate/LeaderboardEntry";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";


type TimeFrame = "all" | "month" | "week";
type SkillFilter = "all" | string;

const LeaderboardPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [currentUser, setCurrentUser] = useState<LeaderboardUser | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredLeaderboard, setFilteredLeaderboard] = useState<LeaderboardUser[]>([]);
  const [timeFrame, setTimeFrame] = useState<TimeFrame>("all");
  const [skillFilter, setSkillFilter] = useState<SkillFilter>("all");
  const [availableSkills, setAvailableSkills] = useState<string[]>([]);
  
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        // Fetch all developer profiles ordered by XP
        const profilesData = await api.get<any[]>(
          `/developer-profiles?_order=xp_points&_sort=desc&_limit=50`,
          session?.token
        );
        
        // Collect all skills for filtering
        const skillsSet = new Set<string>();
        
        // Process and transform profiles to leaderboard format
        if (profilesData) {
          const processedLeaderboard = await Promise.all(profilesData.map(async (profile, index) => {
            // Fetch user badges
            const userBadges = await api.get<any[]>(
              `/user-badges?user_id=${profile.id}`,
              session?.token
            );
              
            const developerBadges = userBadges ? await api.get<any[]>(
              `/developer-badges?id=${userBadges.map(ub => ub.badge_id).join(',')}`,
              session?.token
            ) : [];
              
            // Fetch user skills
            const userSkills = await api.get<any[]>(
              `/user-skills?user_id=${profile.id}`,
              session?.token
            );
              
            // Add skills to the set for filtering
            if (userSkills) {
              userSkills.forEach(s => skillsSet.add(s.skill));
            }
            
            const leaderboardUser: LeaderboardUser = {
              id: profile.id,
              username: profile.username,
              avatarUrl: profile.avatar_url || undefined,
              score: profile.xp_points,
              rank: index + 1,
              badges: userBadges ? userBadges.map(b => b.developer_badges.name) : [],
              skillTags: userSkills ? userSkills.map(s => s.skill) : []
            };
            
            // Check if this is the current user
            if (user && profile.id === user.id) {
              setCurrentUser(leaderboardUser);
            }
            
            return leaderboardUser;
          }));
          
          setLeaderboard(processedLeaderboard);
          setAvailableSkills(Array.from(skillsSet));
          
          // If current user wasn't found in the top 50, fetch separately
          if (user && !profilesData.some(p => p.id === user.id)) {
            const userProfile = await api.get<any>(
              `/developer-profiles?id=${user.id}`,
              session?.token
            );
              
            if (userProfile && userProfile.length > 0) {
              const currentUserProfile = userProfile[0];
              // Count users with higher score
              const higherRankUsers = await api.get<any[]>(
                `/developer-profiles?xp_points_gt=${currentUserProfile.xp_points}`,
                session?.token
              );
              const count = higherRankUsers ? higherRankUsers.length : 0;
                
              // Fetch user badges
              const userBadges = await api.get<any[]>(
                `/user-badges?user_id=${user.id}`,
                session?.token
              );
              const developerBadges = userBadges ? await api.get<any[]>(
                `/developer-badges?id=${userBadges.map(ub => ub.badge_id).join(',')}`,
                session?.token
              ) : [];
                
              // Fetch user skills
              const userSkills = await api.get<any[]>(
                `/user-skills?user_id=${user.id}`,
                session?.token
              );
                
              setCurrentUser({
                id: currentUserProfile.id,
                username: currentUserProfile.username,
                avatarUrl: currentUserProfile.avatar_url || undefined,
                score: currentUserProfile.xp_points,
                rank: (count || 0) + 1,
                badges: developerBadges ? developerBadges.map(b => b.name) : [],
                skillTags: userSkills ? userSkills.map(s => s.skill) : []
              });
            }
          }
        }
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchLeaderboard();
  }, [user]);
  
  // Apply filters whenever they change
  useEffect(() => {
    let result = [...leaderboard];
    
    // Apply skill filter
    if (skillFilter !== "all") {
      result = result.filter(user => 
        user.skillTags.some(s => s === skillFilter)
      );
    }
    
    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(user => 
        user.username.toLowerCase().includes(query)
      );
    }
    
    // For time filter, we would need actual timestamp data
    // This is a placeholder for future implementation
    if (timeFrame !== "all") {
      // Filter by time frame would be implemented here
      // For now, we'll just use the same data
    }
    
    setFilteredLeaderboard(result);
  }, [leaderboard, skillFilter, searchQuery, timeFrame]);
  
  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <CandidateNavbar />
        <div className="flex flex-1 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <CandidateNavbar />
      
      <div className="container max-w-7xl mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Leaderboard</h1>
            <p className="text-muted-foreground mt-1">
              See how you rank against other developers
            </p>
          </div>
          
          <Button
            onClick={() => window.history.back()}
            className="gap-2"
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Button>
        </div>
        
        {/* Top Winners Card */}
        <Card className="mb-8 overflow-hidden">
          <div className="relative h-32 bg-gradient-to-r from-primary to-primary/60">
            <div className="absolute inset-0 flex items-center justify-center">
              <Trophy className="h-16 w-16 text-primary-foreground/80" />
            </div>
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-center">Top Developers</CardTitle>
            <CardDescription className="text-center">
              Our highest ranked community members
            </CardDescription>
          </CardHeader>
          
          {leaderboard.length === 0 ? (
            <CardContent className="text-center py-6">
              <p className="text-mute-foreground">No leaderboard data available</p>
            </CardContent>
          ) : (
            <CardContent className="py-6">
              <div className="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-12">
                {/* Second Place */}
                {leaderboard.length > 1 && (
                  <div className="flex flex-col items-center">
                    <div className="relative">
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-slate-400 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                        2
                      </div>
                      <div className="h-20 w-20 rounded-full bg-muted overflow-hidden border-4 border-slate-400">
                        {leaderboard[1].avatarUrl ? (
                          <img
                            src={leaderboard[1].avatarUrl}
                            alt={leaderboard[1].username}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center bg-muted text-muted-foreground text-lg font-bold">
                            {leaderboard[1].username.substring(0, 2).toUpperCase()}
                          </div>
                        )}
                      </div>
                    </div>
                    <h3 className="font-medium mt-2">{leaderboard[1].username}</h3>
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="h-4 w-4 text-slate-400" />
                      <span>{leaderboard[1].score} XP</span>
                    </div>
                  </div>
                )}
                
                {/* First Place */}
                {leaderboard.length > 0 && (
                  <div className="flex flex-col items-center">
                    <div className="relative">
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-amber-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                        1
                      </div>
                      <div className="h-24 w-24 rounded-full bg-muted overflow-hidden border-4 border-amber-500">
                        {leaderboard[0].avatarUrl ? (
                          <img
                            src={leaderboard[0].avatarUrl}
                            alt={leaderboard[0].username}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center bg-muted text-muted-foreground text-xl font-bold">
                            {leaderboard[0].username.substring(0, 2).toUpperCase()}
                          </div>
                        )}
                      </div>
                    </div>
                    <h3 className="font-medium mt-2">{leaderboard[0].username}</h3>
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="h-4 w-4 text-amber-500" />
                      <span>{leaderboard[0].score} XP</span>
                    </div>
                  </div>
                )}
                
                {/* Third Place */}
                {leaderboard.length > 2 && (
                  <div className="flex flex-col items-center">
                    <div className="relative">
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-700 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                        3
                      </div>
                      <div className="h-20 w-20 rounded-full bg-muted overflow-hidden border-4 border-amber-700">
                        {leaderboard[2].avatarUrl ? (
                          <img
                            src={leaderboard[2].avatarUrl}
                            alt={leaderboard[2].username}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center bg-muted text-muted-foreground text-lg font-bold">
                            {leaderboard[2].username.substring(0, 2).toUpperCase()}
                          </div>
                        )}
                      </div>
                    </div>
                    <h3 className="font-medium mt-2">{leaderboard[2].username}</h3>
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="h-4 w-4 text-amber-700" />
                      <span>{leaderboard[2].score} XP</span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          )}
        </Card>
        
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search developers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select
            value={skillFilter}
            onValueChange={(value) => setSkillFilter(value)}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by skill" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Skills</SelectItem>
              {availableSkills.map((skill) => (
                <SelectItem key={skill} value={skill}>
                  {skill}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Tabs
            value={timeFrame}
            onValueChange={(value) => setTimeFrame(value as TimeFrame)}
            className="w-full sm:w-auto"
          >
            <TabsList>
              <TabsTrigger value="all">All Time</TabsTrigger>
              <TabsTrigger value="month">This Month</TabsTrigger>
              <TabsTrigger value="week">This Week</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        {/* Main Leaderboard */}
        <Card className="mb-8">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Developer Rankings
            </CardTitle>
            <CardDescription>
              Based on challenge performance, contests, and contributions
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredLeaderboard.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  {searchQuery || skillFilter !== "all" 
                    ? "No developers match your filters"
                    : "No leaderboard data available"}
                </p>
                {(searchQuery || skillFilter !== "all") && (
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => {
                      setSearchQuery("");
                      setSkillFilter("all");
                    }}
                  >
                    Reset Filters
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredLeaderboard.map(user => (
                  <LeaderboardEntry 
                    key={user.id} 
                    user={user}
                    highlighted={user.id === currentUser?.id}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Current User Card */}
        {currentUser && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Your Ranking</h2>
            <Card>
              <CardContent className="p-4">
                <LeaderboardEntry
                  user={currentUser}
                  highlighted={true}
                />
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaderboardPage;
