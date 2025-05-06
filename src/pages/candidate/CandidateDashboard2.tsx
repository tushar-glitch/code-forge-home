import React, { useState, useEffect } from "react";
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
  ChevronRight,
  Loader2
} from "lucide-react";
import CandidateNavbar from "@/components/candidate/CandidateNavbar";
import ActivityCard, { Activity } from "@/components/candidate/ActivityCard";
import ProgressTracker from "@/components/candidate/ProgressTracker";
import BadgeDisplay, { DeveloperBadge } from "@/components/candidate/BadgeDisplay";
import LeaderboardEntry, { LeaderboardUser } from "@/components/candidate/LeaderboardEntry";
import ChallengeCard, { Challenge } from "@/components/candidate/ChallengeCard";
import ContestCard, { Contest } from "@/components/candidate/ContestCard";
import SponsoredBanner from "@/components/candidate/SponsoredBanner";
import ProfileSummary, { ProfileData } from "@/components/candidate/ProfileSummary";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const CandidateDashboard2 = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [badges, setBadges] = useState<DeveloperBadge[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [contests, setContests] = useState<Contest[]>([]);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [currentUserRank, setCurrentUserRank] = useState<LeaderboardUser | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // Fetch user profile
        const { data: profileData, error: profileError } = await supabase
          .from('developer_profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError) {
          console.error('Error fetching profile:', profileError);
        } else if (profileData) {
          // Fetch user badges
          const { data: userBadgesData, error: userBadgesError } = await supabase
            .from('user_badges')
            .select('badge_id')
            .eq('user_id', user.id);

          let userBadges: DeveloperBadge[] = [];
          
          if (!userBadgesError && userBadgesData.length > 0) {
            const badgeIds = userBadgesData.map(ub => ub.badge_id);
            
            const { data: badgesData, error: badgesError } = await supabase
              .from('developer_badges')
              .select('*')
              .in('id', badgeIds);
              
            if (!badgesError && badgesData) {
              userBadges = badgesData as DeveloperBadge[];
            }
          }
          
          // Transform profile data to match our interface
          const formattedProfile: ProfileData = {
            id: profileData.id,
            username: profileData.username,
            fullName: profileData.full_name || profileData.username,
            avatarUrl: profileData.avatar_url || "",
            bio: profileData.bio || "Frontend developer passionate about creating clean, accessible and performant web applications.",
            joinDate: profileData.join_date,
            skills: [],  // Will fetch separately
            rank: 0,  // Will calculate later
            totalScore: profileData.xp_points,
            challengesSolved: 0,  // Will calculate later
            badges: userBadges,
            githubUrl: profileData.github_url || "https://github.com",
            linkedinUrl: profileData.linkedin_url || "https://linkedin.com"
          };

          setProfile(formattedProfile);
        }

        // Fetch user activities
        const { data: activitiesData, error: activitiesError } = await supabase
          .from('user_activities')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(4);

        if (!activitiesError && activitiesData) {
          setActivities(activitiesData as Activity[]);
        }

        // Fetch leaderboard data
        const { data: leaderboardData, error: leaderboardError } = await supabase
          .from('developer_profiles')
          .select('id, username, xp_points, avatar_url')
          .order('xp_points', { ascending: false })
          .limit(5);

        if (!leaderboardError && leaderboardData) {
          // Transform the data
          const formattedLeaderboard = await Promise.all(leaderboardData.map(async (user, index) => {
            // Fetch user badges
            const { data: userBadges } = await supabase
              .from('user_badges')
              .select('badge_id, developer_badges!inner(name)')
              .eq('user_id', user.id);

            // Fetch user skills
            const { data: userSkills } = await supabase
              .from('user_skills')
              .select('skill')
              .eq('user_id', user.id);

            const leaderboardUser: LeaderboardUser = {
              id: user.id,
              username: user.username,
              avatarUrl: user.avatar_url || undefined,
              score: user.xp_points,
              rank: index + 1,
              badges: userBadges ? userBadges.map(b => b.developer_badges.name) : [],
              skillTags: userSkills ? userSkills.map(s => s.skill) : []
            };

            // If this is the current user, save their rank
            if (user.id === profile?.id) {
              setCurrentUserRank(leaderboardUser);
            }

            return leaderboardUser;
          }));

          setLeaderboard(formattedLeaderboard);

          // If current user is not in top 5, fetch their rank separately
          if (!formattedLeaderboard.some(u => u.id === user.id) && profile) {
            // Count users with higher score
            const { count, error } = await supabase
              .from('developer_profiles')
              .select('*', { count: 'exact', head: true })
              .gt('xp_points', profile.totalScore);

            if (!error) {
              // Fetch user badges and skills
              const { data: userBadges } = await supabase
                .from('user_badges')
                .select('badge_id, developer_badges!inner(name)')
                .eq('user_id', user.id);

              const { data: userSkills } = await supabase
                .from('user_skills')
                .select('skill')
                .eq('user_id', user.id);

              setCurrentUserRank({
                id: user.id,
                username: profile.username,
                avatarUrl: profile.avatarUrl,
                score: profile.totalScore,
                rank: (count || 0) + 1,
                badges: userBadges ? userBadges.map(b => b.developer_badges.name) : [],
                skillTags: userSkills ? userSkills.map(s => s.skill) : []
              });
            }
          }
        }

        // Fetch challenges
        const { data: challengesData, error: challengesError } = await supabase
          .from('challenges')
          .select(`
            *,
            challenge_attempts(user_id, status),
            challenge_attempts!challenge_attempts_challenge_id_fkey(count)
          `)
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(2);

        if (!challengesError && challengesData) {
          const formattedChallenges: Challenge[] = challengesData.map(challenge => {
            // Check if the current user has completed this challenge
            const userAttempt = challenge.challenge_attempts.find((attempt: any) => 
              attempt.user_id === user.id
            );
            
            // Count total attempts
            const totalAttempts = challenge.challenge_attempts_fkey?.length || 0;
            
            // Count successful solves
            const solvedCount = challenge.challenge_attempts_fkey?.filter((attempt: any) => 
              attempt.status === 'completed'
            ).length || 0;
            
            // Calculate days active
            const createdDate = new Date(challenge.created_at);
            const today = new Date();
            const daysActive = Math.floor((today.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24));

            return {
              id: challenge.id,
              title: challenge.title,
              description: challenge.description,
              difficulty: challenge.difficulty,
              tags: challenge.tags,
              solvedCount,
              totalAttempts,
              daysActive,
              topContributors: [], // Would need additional query to get this
              isCompleted: userAttempt?.status === 'completed'
            };
          });

          setChallenges(formattedChallenges);
        }

        // Fetch contests
        const { data: contestsData, error: contestsError } = await supabase
          .from('contests')
          .select('*')
          .in('status', ['upcoming', 'active'])
          .order('start_date', { ascending: true })
          .limit(2);

        if (!contestsError && contestsData) {
          const formattedContests: Contest[] = contestsData.map(contest => {
            return {
              id: contest.id,
              title: contest.title,
              description: contest.description,
              startDate: contest.start_date,
              endDate: contest.end_date,
              participantsCount: 0, // Would need additional query
              prize: contest.prize,
              sponsor: {
                name: contest.sponsor_name || '',
                logo: contest.sponsor_logo || undefined
              },
              status: contest.status,
              skills: contest.skills
            };
          });

          setContests(formattedContests);
        }

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Fallback data when profile isn't loaded yet
  const profileData: ProfileData = profile || {
    id: "placeholder",
    username: "developer",
    fullName: "Developer",
    avatarUrl: "",
    bio: "Loading profile...",
    joinDate: new Date().toISOString(),
    skills: [],
    rank: 0,
    totalScore: 0,
    challengesSolved: 0,
    badges: [],
    githubUrl: "",
    linkedinUrl: ""
  };

  return (
    <div className="min-h-screen bg-background">
      <CandidateNavbar />
      
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
                    <TabsTrigger value="pending">Not Started</TabsTrigger>
                    <TabsTrigger value="in-progress">In Progress</TabsTrigger>
                    <TabsTrigger value="completed">Completed</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="pending">
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No pending assessments</p>
                      <Button 
                        variant="outline" 
                        className="mt-4"
                        onClick={() => navigate('/candidate-dashboard')}
                      >
                        Go to Assessments
                      </Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="in-progress">
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No tests in progress</p>
                      <Button 
                        variant="outline" 
                        className="mt-4"
                        onClick={() => navigate('/candidate-dashboard')}
                      >
                        Go to Assessments
                      </Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="completed">
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No completed tests</p>
                      <Button 
                        variant="outline" 
                        className="mt-4"
                        onClick={() => navigate('/candidate-dashboard')}
                      >
                        Go to Assessments
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
              
              {challenges.length === 0 ? (
                <div className="text-center py-8 bg-muted/20 rounded-lg">
                  <p className="text-muted-foreground">No challenges available</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => navigate('/candidate/challenges')}
                  >
                    Browse Challenges
                  </Button>
                </div>
              ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {challenges.map(challenge => (
                    <ChallengeCard 
                      key={challenge.id} 
                      challenge={challenge} 
                      onClick={() => navigate(`/challenges/${challenge.id}`)} 
                    />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {challenges.map(challenge => (
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
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs"
                  onClick={() => navigate('/candidate/profile')}
                >
                  View All
                </Button>
              </div>
              
              <div className="space-y-3">
                {activities.length === 0 ? (
                  <div className="text-center py-8 bg-muted/20 rounded-lg">
                    <p className="text-muted-foreground">No recent activity</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Start solving challenges to see your activity here
                    </p>
                  </div>
                ) : (
                  activities.map(activity => (
                    <ActivityCard key={activity.id} activity={activity} />
                  ))
                )}
              </div>
            </div>
            
            {/* Upcoming Contests */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-primary" /> 
                  Upcoming Contests
                </h2>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs"
                  onClick={() => navigate('/candidate/contests')}
                >
                  View All
                </Button>
              </div>
              
              {contests.length === 0 ? (
                <div className="text-center py-8 bg-muted/20 rounded-lg">
                  <p className="text-muted-foreground">No upcoming contests</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => navigate('/candidate/contests')}
                  >
                    Explore Contests
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {contests.map(contest => (
                    <ContestCard 
                      key={contest.id} 
                      contest={contest} 
                      onClick={() => navigate(`/contests/${contest.id}`)} 
                    />
                  ))}
                </div>
              )}
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
                  currentXP={profileData.totalScore} 
                  nextLevelXP={1000} 
                  level={profile?.level || 1}
                  userId={user?.id}
                />
                
                <Separator />
                
                {/* Badges */}
                <div>
                  <h3 className="text-sm font-medium mb-3">Recent Badges</h3>
                  <div className="flex flex-wrap gap-2">
                    {badges.length === 0 ? (
                      <div className="text-center w-full py-2">
                        <p className="text-xs text-muted-foreground">
                          Complete challenges to earn badges
                        </p>
                      </div>
                    ) : (
                      badges.map(badge => (
                        <BadgeDisplay key={badge.id} badge={badge} size="sm" />
                      ))
                    )}
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="rounded-full w-8 h-8"
                      onClick={() => navigate('/candidate/profile')}
                    >
                      <PlusCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <Separator />
                
                {/* Stats */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col items-center justify-center bg-muted/50 p-3 rounded-md">
                    <span className="text-2xl font-bold text-primary">
                      {challenges.filter(c => c.isCompleted).length}
                    </span>
                    <span className="text-xs text-muted-foreground">Challenges Completed</span>
                  </div>
                  <div className="flex flex-col items-center justify-center bg-muted/50 p-3 rounded-md">
                    <span className="text-2xl font-bold text-primary">
                      {/* This would need additional data fetching */}
                      {currentUserRank?.rank || "-"}
                    </span>
                    <span className="text-xs text-muted-foreground">Current Rank</span>
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
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => navigate('/candidate/leaderboard')}
                  >
                    Full Rankings
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {leaderboard.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground">No leaderboard data available</p>
                  </div>
                ) : (
                  <>
                    {leaderboard.map(user => (
                      <LeaderboardEntry 
                        key={user.id} 
                        user={user} 
                        highlighted={user.id === profile?.id}
                      />
                    ))}
                    
                    {currentUserRank && !leaderboard.some(u => u.id === profile?.id) && (
                      <>
                        <Separator />
                        <LeaderboardEntry 
                          user={currentUserRank} 
                          highlighted={true}
                          showSkills={false}
                        />
                      </>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
            
            {/* Profile Preview / Proof of Work */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Your Proof-of-Work
                </h2>
                <Button 
                  size="sm" 
                  onClick={() => navigate('/candidate/profile')}
                >
                  View Profile
                </Button>
              </div>
              
              <ProfileSummary profile={profileData} isPreview={true} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateDashboard2;
