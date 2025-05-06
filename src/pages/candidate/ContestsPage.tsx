
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Search,
  Trophy,
  Calendar,
  Users,
  Award,
  Clock,
  AlertCircle,
  ChevronRight,
  LayoutDashboard,
  Loader2
} from "lucide-react";
import CandidateNavbar from "@/components/candidate/CandidateNavbar";
import ContestCard, { Contest } from "@/components/candidate/ContestCard";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

type ContestStatus = "all" | "upcoming" | "active" | "ended";

const ContestsPage = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ContestStatus>("all");
  const [contests, setContests] = useState<Contest[]>([]);
  const [filteredContests, setFilteredContests] = useState<Contest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContests = async () => {
      try {
        const { data: contestsData, error: contestsError } = await supabase
          .from('contests')
          .select('*')
          .order('start_date', { ascending: true });
          
        if (contestsError) {
          console.error('Error fetching contests:', contestsError);
          return;
        }
        
        if (contestsData) {
          // Process and transform contests
          const processedContests: Contest[] = await Promise.all(contestsData.map(async contest => {
            // Count participants
            const { count, error: countError } = await supabase
              .from('contest_participants')
              .select('*', { count: 'exact', head: true })
              .eq('contest_id', contest.id);
              
            // Check if user is participating
            let isParticipating = false;
            if (user) {
              const { data: participation, error: participationError } = await supabase
                .from('contest_participants')
                .select('*')
                .eq('contest_id', contest.id)
                .eq('user_id', user.id)
                .single();
                
              isParticipating = !!participation;
            }
            
            return {
              id: contest.id,
              title: contest.title,
              description: contest.description,
              startDate: contest.start_date,
              endDate: contest.end_date,
              participantsCount: count || 0,
              prize: contest.prize,
              sponsor: {
                name: contest.sponsor_name || "",
                logo: contest.sponsor_logo
              },
              status: contest.status,
              skills: contest.skills,
              isParticipating
            };
          }));
          
          setContests(processedContests);
        }
      } catch (error) {
        console.error('Error in contests page:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchContests();
  }, [user]);

  // Apply filters whenever they change
  useEffect(() => {
    let result = [...contests];
    
    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter(contest => contest.status === statusFilter);
    }
    
    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(
        contest =>
          contest.title.toLowerCase().includes(query) ||
          contest.description.toLowerCase().includes(query) ||
          contest.skills.some(skill => skill.toLowerCase().includes(query))
      );
    }
    
    setFilteredContests(result);
  }, [contests, statusFilter, searchQuery]);

  const joinContest = async (contestId: string) => {
    if (!user) return;
    
    try {
      // Add user as participant
      const { error } = await supabase
        .from('contest_participants')
        .insert({
          user_id: user.id,
          contest_id: contestId,
        });
        
      if (error) {
        console.error('Error joining contest:', error);
        return;
      }
      
      // Update local state
      setContests(contests.map(contest => 
        contest.id === contestId 
          ? { ...contest, participantsCount: contest.participantsCount + 1, isParticipating: true }
          : contest
      ));
      
      // Add activity
      await supabase.from('user_activities').insert({
        user_id: user.id,
        activity_type: 'contest_joined',
        title: `You joined the ${contests.find(c => c.id === contestId)?.title} contest`,
        details: {
          contestId,
          contestName: contests.find(c => c.id === contestId)?.title
        }
      });
      
    } catch (error) {
      console.error('Error joining contest:', error);
    }
  };

  const renderEmptyState = () => (
    <div className="text-center py-12 bg-muted/20 rounded-lg">
      <div className="flex justify-center mb-4">
        <Trophy className="h-12 w-12 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-bold mb-2">No contests found</h3>
      <p className="text-muted-foreground mb-6">
        {searchQuery || statusFilter !== "all"
          ? "Try adjusting your filters or search query"
          : "Check back soon for upcoming contests!"}
      </p>
      {(searchQuery || statusFilter !== "all") && (
        <Button 
          onClick={() => {
            setSearchQuery("");
            setStatusFilter("all");
          }}
        >
          Reset Filters
        </Button>
      )}
    </div>
  );

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
            <h1 className="text-3xl font-bold">Coding Contests</h1>
            <p className="text-muted-foreground mt-1">
              Compete with other developers and win prizes
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
        
        {/* Filters & Search */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search contests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Tabs 
              value={statusFilter}
              onValueChange={(value) => setStatusFilter(value as ContestStatus)}
              className="w-full sm:w-auto"
            >
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="ended">Ended</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          {!user && (
            <Alert className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Sign in to join contests and track your progress
              </AlertDescription>
            </Alert>
          )}
        </div>
        
        {/* Contests Grid */}
        {filteredContests.length === 0 ? (
          renderEmptyState()
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredContests.map(contest => (
              <Card key={contest.id} className={`overflow-hidden ${
                contest.status === "active" ? "border-primary/30" : ""
              }`}>
                {contest.status === "active" && (
                  <div className="bg-primary text-primary-foreground py-1 px-3 text-center text-xs font-medium">
                    Currently Active
                  </div>
                )}
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{contest.title}</CardTitle>
                      <CardDescription className="mt-1">
                        {contest.sponsor.name ? `Sponsored by ${contest.sponsor.name}` : "Community Contest"}
                      </CardDescription>
                    </div>
                    <Badge variant={
                      contest.status === "upcoming" ? "outline" :
                      contest.status === "active" ? "default" :
                      "secondary"
                    }>
                      {contest.status === "upcoming" ? "Upcoming" :
                       contest.status === "active" ? "Active Now" :
                       "Ended"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm">{contest.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {new Date(contest.startDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {contest.participantsCount} Participants
                      </span>
                    </div>
                    {contest.prize && (
                      <div className="flex items-center gap-2">
                        <Award className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{contest.prize}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {contest.status === "upcoming" ? (
                          `Starts in ${Math.max(0, Math.floor((new Date(contest.startDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))} days`
                        ) : contest.status === "active" ? (
                          `Ends in ${Math.max(0, Math.floor((new Date(contest.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))} days`
                        ) : (
                          "Contest ended"
                        )}
                      </span>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex flex-wrap gap-2">
                    {contest.skills.slice(0, 4).map(skill => (
                      <Badge key={skill} variant="secondary">{skill}</Badge>
                    ))}
                    {contest.skills.length > 4 && (
                      <Badge variant="outline">+{contest.skills.length - 4}</Badge>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  {contest.isParticipating ? (
                    <Button 
                      className="w-full" 
                      variant={contest.status === "ended" ? "outline" : "default"}
                    >
                      {contest.status === "upcoming" ? "Registered" : 
                       contest.status === "active" ? "Enter Contest" : 
                       "View Results"}
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  ) : (
                    <Button 
                      className="w-full"
                      disabled={contest.status === "ended" || !user}
                      onClick={() => joinContest(contest.id)}
                    >
                      {contest.status === "upcoming" ? "Register Now" : 
                       contest.status === "active" ? "Join Contest" : 
                       "Contest Ended"}
                      {(contest.status === "upcoming" || contest.status === "active") && (
                        <ChevronRight className="ml-1 h-4 w-4" />
                      )}
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContestsPage;
