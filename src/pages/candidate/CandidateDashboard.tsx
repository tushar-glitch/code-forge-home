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

import { format } from "date-fns";
import { TestAssignment, getCandidateAssignments } from "@/lib/test-management-utils";
import { api } from "@/lib/api";

const CandidateDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const [loading, setLoading] = useState(true);
  const [assignments, setAssignments] = useState<TestAssignment[]>([]);
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
        const profileData = await api.get<any>(
          `/developer-profiles?userId=${user.id}`,
          session?.token
        );

        if (profileData && profileData.length > 0) {
          const userProfile = profileData[0];
          // Fetch user badges
          const userBadgesData = await api.get<any[]>(
            `/user-badges?user_id=${user.id}`,
            session?.token
          );

          let userBadges: DeveloperBadge[] = [];
          
          if (userBadgesData && userBadgesData.length > 0) {
            const badgeIds = userBadgesData.map(ub => ub.badge_id);
            
            const badgesData = await api.get<any[]>(
              `/developer-badges?id=${badgeIds.join(',')}`,
              session?.token
            );
              
            if (badgesData) {
              userBadges = badgesData as DeveloperBadge[];
            }
          }
          
          // Transform profile data to match our interface
          const formattedProfile: ProfileData = {
            id: userProfile.id,
            username: userProfile.username,
            fullName: userProfile.full_name || userProfile.username,
            avatarUrl: userProfile.avatar_url || "",
            bio: userProfile.bio || "Frontend developer passionate about creating clean, accessible and performant web applications.",
            joinDate: userProfile.join_date,
            skills: [],  // Will fetch separately
            rank: 0,  // Will calculate later
            totalScore: userProfile.xp_points,
            challengesSolved: 0,  // Will calculate later
            badges: userBadges,
            githubUrl: userProfile.github_url || "https://github.com",
            linkedinUrl: userProfile.linkedin_url || "https://linkedin.com"
          };

          setProfile(formattedProfile);
        }

        // Fetch user activities
        const activitiesData = await api.get<any[]>(
          `/user-activities?user_id=${user.id}&_order=created_at&_sort=desc&_limit=4`,
          session?.token
        );

        if (activitiesData) {
          setActivities(activitiesData.map(a => ({
            ...a,
            type: a.activity_type,
            timestamp: a.created_at
          })) as Activity[]);
        }

        // Fetch leaderboard data
        const leaderboardData = await api.get<any[]>(
          `/developer-profiles?_order=xp_points&_sort=desc&_limit=5`,
          session?.token
        );

        if (leaderboardData) {
          // Transform the data
          const formattedLeaderboard = await Promise.all(leaderboardData.map(async (userEntry, index) => {
            // Fetch user badges
            const userBadges = await api.get<any[]>(
              `/user-badges?user_id=${userEntry.id}`,
              session?.token
            );

            const developerBadges = userBadges ? await api.get<any[]>(
              `/developer-badges?id=${userBadges.map(ub => ub.badge_id).join(',')}`,
              session?.token
            ) : [];

            // Fetch user skills
            const userSkills = await api.get<any[]>(
              `/user-skills?user_id=${userEntry.id}`,
              session?.token
            );

            const leaderboardUser = {
              id: userEntry.id,
              username: userEntry.username,
              avatarUrl: userEntry.avatar_url || undefined,
              score: userEntry.xp_points,
              rank: index + 1,
              badges: developerBadges ? developerBadges.map(b => b.name) : [],
              skillTags: userSkills ? userSkills.map(s => s.skill) : []
            };

            // If this is the current user, save their rank
            if (userEntry.id === profile?.id) {
              setCurrentUserRank(leaderboardUser);
            }

            return leaderboardUser;
          }));

          setLeaderboard(formattedLeaderboard);

          // If current user is not in top 5, fetch their rank separately
          if (!formattedLeaderboard.some(u => u.id === user.id) && profile) {
            // Count users with higher score
            const higherRankUsers = await api.get<any[]>(
              `/developer-profiles?xp_points_gt=${profile.totalScore}`,
              session?.token
            );
            const count = higherRankUsers ? higherRankUsers.length : 0;

            // Fetch user badges and skills
            const userBadges = await api.get<any[]>(
              `/user-badges?user_id=${user.id}`,
              session?.token
            );
            const developerBadges = userBadges ? await api.get<any[]>(
              `/developer-badges?id=${userBadges.map(ub => ub.badge_id).join(',')}`,
              session?.token
            ) : [];

            const userSkills = await api.get<any[]>(
              `/user-skills?user_id=${user.id}`,
              session?.token
            );

            setCurrentUserRank({
              id: user.id,
              username: profile.username,
              avatarUrl: profile.avatarUrl,
              score: profile.totalScore,
              rank: (count || 0) + 1,
              badges: developerBadges ? developerBadges.map(b => b.name) : [],
              skillTags: userSkills ? userSkills.map(s => s.skill) : []
            });
          }
        }

        // Fetch challenges
        const challengesData = await api.get<any[]>(
          `/challenges?is_active=true&_order=created_at&_sort=desc&_limit=2`,
          session?.token
        );

        if (challengesData) {
          const formattedChallenges = await Promise.all(challengesData.map(async (challenge) => {
            // Fetch challenge attempts for the current user
            const userAttempts = await api.get<any[]>(
              `/challenge-attempts?challenge_id=${challenge.id}&user_id=${user.id}`,
              session?.token
            );
            const userAttempt = userAttempts && userAttempts.length > 0 ? userAttempts[0] : null;

            // Fetch all challenge attempts to count total and solved
            const allAttempts = await api.get<any[]>(
              `/challenge-attempts?challenge_id=${challenge.id}`,
              session?.token
            );
            
            // Count total attempts
            const totalAttempts = allAttempts ? allAttempts.length : 0;
            
            // Count successful solves
            const solvedCount = allAttempts ? allAttempts.filter((attempt) => 
              attempt.status === 'completed'
            ).length : 0;
            
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
          }));

          setChallenges(formattedChallenges as Challenge[]);
        }

        // Fetch contests
        const contestsData = await api.get<any[]>(
          `/contests?status_in=upcoming,active&_order=start_date&_sort=asc&_limit=2`,
          session?.token
        );

        if (contestsData) {
          const formattedContests = contestsData.map(contest => {
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

          setContests(formattedContests as Contest[]);
        }

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  useEffect(() => {
      const fetchAssignments = async () => {
        if (!user?.email) return;
        
        try {
          const data = await getCandidateAssignments(user.email);
          // Type assertion to fix TypeScript error
          setAssignments(data as unknown as TestAssignment[]);
        } catch (error) {
          console.error("Error fetching assignments:", error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchAssignments();
  }, [user?.email]);
  
  // Filter assignments by status
  const pendingAssignments = assignments.filter(a => a.status === "pending");
  const inProgressAssignments = assignments.filter(a => a.status === "in-progress");
  const completedAssignments = assignments.filter(a => a.status === "completed");

  const renderAssignmentCard = (assignment: TestAssignment) => {
    const testTitle = assignment.test?.test_title || "Unnamed Test";
    const testDuration = assignment.test?.time_limit || 60;
    const testLanguage = assignment.test?.primary_language || "Not specified";
    
    const startedDate = assignment.started_at ? new Date(assignment.started_at) : null;
    const completedDate = assignment.completed_at ? new Date(assignment.completed_at) : null;
    
    return (
      <Card key={assignment.id} className="mb-4">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{testTitle}</CardTitle>
            <Badge 
              variant={
                assignment.status === "completed" ? "default" : 
                assignment.status === "in-progress" ? "secondary" : "outline"
              }
            >
              {assignment.status === "pending" ? "Not Started" : 
               assignment.status === "in-progress" ? "In Progress" : "Completed"}
            </Badge>
          </div>
          <CardDescription>
            {testDuration} minutes • {testLanguage}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {startedDate && (
              <div className="text-sm">
                <span className="font-medium">Started:</span> {format(startedDate, "PPp")}
              </div>
            )}
            {completedDate && (
              <div className="text-sm">
                <span className="font-medium">Completed:</span> {format(completedDate, "PPp")}
              </div>
            )}
            <Button 
              onClick={() => navigate(`/interview/${assignment.id}`)}
              variant={assignment.status === "completed" ? "outline" : "default"}
              disabled={assignment.status === "completed"}
            >
              {assignment.status === "pending" ? "Start Test" : 
               assignment.status === "in-progress" ? "Continue Test" : "View Submission"}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

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
                <Tabs defaultValue={assignments.length > 0 ? (pendingAssignments.length > 0 ? "pending" : inProgressAssignments.length > 0 ? "in-progress" : "completed") : "pending"}>
                        <TabsList className="mb-6">
                          <TabsTrigger value="pending">
                            Not Started ({pendingAssignments.length})
                          </TabsTrigger>
                          <TabsTrigger value="in-progress">
                            In Progress ({inProgressAssignments.length})
                          </TabsTrigger>
                          <TabsTrigger value="completed">
                            Completed ({completedAssignments.length})
                          </TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="pending">
                          {pendingAssignments.length > 0 ? (
                            pendingAssignments.map(renderAssignmentCard)
                          ) : (
                            <div className="text-center py-8">
                              <p className="text-muted-foreground">No pending assignments</p>
                            </div>
                          )}
                        </TabsContent>
                        
                        <TabsContent value="in-progress">
                          {inProgressAssignments.length > 0 ? (
                            inProgressAssignments.map(renderAssignmentCard)
                          ) : (
                            <div className="text-center py-8">
                              <p className="text-muted-foreground">No tests in progress</p>
                            </div>
                          )}
                        </TabsContent>
                        
                        <TabsContent value="completed">
                          {completedAssignments.length > 0 ? (
                            completedAssignments.map(renderAssignmentCard)
                          ) : (
                            <div className="text-center py-8">
                              <p className="text-muted-foreground">No completed tests</p>
                            </div>
                          )}
                        </TabsContent>
                      </Tabs>
                      
                      {assignments.length === 0 && (
                        <div className="my-12 text-center">
                          <h2 className="text-2xl font-semibold mb-2">No Tests Assigned Yet</h2>
                          <p className="text-muted-foreground mb-6">
                            You don't have any tests assigned to you at the moment.
                            <br />
                            Check back later or contact your recruiter.
                          </p>
                        </div>
                      )}
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
                  level={1}
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

export default CandidateDashboard;
