import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LayoutGrid,
  ListIcon,
  Search,
  Loader2,
  ChevronRight,
  LayoutDashboard,
} from "lucide-react";
import CandidateNavbar from "@/components/candidate/CandidateNavbar";
import ChallengeCard, { Challenge } from "@/components/candidate/ChallengeCard";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

// Challenge filter types
type FilterCategory = "all" | "completed" | "inProgress" | "notStarted";
type DifficultyLevel = "all" | "beginner" | "intermediate" | "advanced" | "expert";

const ChallengesPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filterCategory, setFilterCategory] = useState<FilterCategory>("all");
  const [difficultyFilter, setDifficultyFilter] = useState<DifficultyLevel>("all");
  const [tagFilter, setTagFilter] = useState<string>("all");
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [filteredChallenges, setFilteredChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [availableTags, setAvailableTags] = useState<string[]>([]);

  useEffect(() => {
    const fetchChallenges = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const { data: challengesData, error: challengesError } = await supabase
          .from('challenges')
          .select(`
            *,
            challenge_attempts(user_id, status),
            challenge_attempts!challenge_attempts_challenge_id_fkey(count)
          `)
          .eq('is_active', true)
          .order('created_at', { ascending: false });

        if (challengesError) {
          console.error('Error fetching challenges:', challengesError);
          return;
        }

        if (challengesData) {
          // Extract all unique tags
          const allTags = new Set<string>();
          
          const formattedChallenges = challengesData.map(challenge => {
            // Add tags to the set
            challenge.tags.forEach(tag => allTags.add(tag));
            
            // Check if the current user has an attempt on this challenge
            const userAttempt = challenge.challenge_attempts.find((attempt: any) => 
              attempt.user_id === user.id
            );
            
            // Count total attempts
            const totalAttempts = challenge.challenge_attempts?.length || 0;
            
            // Count successful solves
            const solvedCount = challenge.challenge_attempts?.filter((attempt: any) =>
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
              status: userAttempt ? userAttempt.status : "notStarted",
              topContributors: [], // Would need additional query to get this
              isCompleted: userAttempt?.status === 'completed'
            };
          });

          setChallenges(formattedChallenges as Challenge[]);
          setFilteredChallenges(formattedChallenges as any);
          setAvailableTags(Array.from(allTags));
        }
      } catch (error) {
        console.error('Error in challenges page:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchChallenges();
  }, [user]);

  // Apply filters whenever they change
  useEffect(() => {
    let result = [...challenges];

    // Apply category filter
    if (filterCategory === "completed") {
      result = result.filter((challenge: any) => challenge.isCompleted);
    } else if (filterCategory === "inProgress") {
      result = result.filter((challenge: any) => challenge.status === "started" || challenge.status === "submitted");
    } else if (filterCategory === "notStarted") {
      result = result.filter((challenge: any) => !challenge.status || challenge.status === "notStarted");
    }

    // Apply difficulty filter
    if (difficultyFilter !== "all") {
      result = result.filter((challenge) => challenge.difficulty === difficultyFilter);
    }

    // Apply tag filter
    if (tagFilter !== "all") {
      result = result.filter((challenge) => challenge.tags.includes(tagFilter));
    }

    // Apply search query
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(
        (challenge) =>
          challenge.title.toLowerCase().includes(query) ||
          challenge.description.toLowerCase().includes(query) ||
          challenge.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    setFilteredChallenges(result);
  }, [challenges, filterCategory, difficultyFilter, tagFilter, searchQuery]);

  const handleTagClick = (tag: string) => {
    setTagFilter(tag);
  };

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
    <div className="min-h-screen bg-background flex flex-col">
      <CandidateNavbar />
      
      <div className="container max-w-7xl mx-auto py-8 px-4 flex-grow">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Coding Challenges</h1>
            <p className="text-muted-foreground mt-1">
              Improve your skills with practical coding challenges
            </p>
          </div>
          
          <Button
            onClick={() => navigate("/candidate/dashboard")}
            className="gap-2"
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Button>
        </div>

        {/* Filters & Search */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search challenges..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select
                value={difficultyFilter}
                onValueChange={(value) => setDifficultyFilter(value as DifficultyLevel)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Difficulties</SelectItem>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                  <SelectItem value="expert">Expert</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("grid")}
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("list")}
                >
                  <ListIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <Tabs
            value={filterCategory}
            onValueChange={(value) => setFilterCategory(value as FilterCategory)}
            className="w-full"
          >
            <TabsList className="mb-6">
              <TabsTrigger value="all">All Challenges</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="inProgress">In Progress</TabsTrigger>
              <TabsTrigger value="notStarted">Not Started</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Tags filter */}
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge
              variant={tagFilter === "all" ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setTagFilter("all")}
            >
              All Tags
            </Badge>
            {availableTags.map((tag) => (
              <Badge
                key={tag}
                variant={tagFilter === tag ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => handleTagClick(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Challenge List */}
        {filteredChallenges.length === 0 ? (
          <div className="text-center py-12 bg-muted/20 rounded-lg">
            <h3 className="text-xl font-bold mb-2">No challenges found</h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your filters or search query
            </p>
            <Button onClick={() => {
              setSearchQuery('');
              setFilterCategory('all');
              setDifficultyFilter('all');
              setTagFilter('all');
            }}>
              Reset Filters
            </Button>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredChallenges.map((challenge) => (
              <ChallengeCard
                key={challenge.id}
                challenge={challenge}
                onClick={() => navigate(`/challenges/${challenge.id}`)}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredChallenges.map((challenge) => (
              <Card
                key={challenge.id}
                className={`transition-all duration-300 hover:shadow-md cursor-pointer ${
                  challenge.isCompleted ? "border-green-500/30" : ""
                }`}
                onClick={() => navigate(`/challenges/${challenge.id}`)}
              >
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                    <div>
                      <h3 className="font-medium">{challenge.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {challenge.description}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        <Badge
                          variant="outline"
                          className={`text-xs ${
                            challenge.difficulty === "beginner"
                              ? "bg-green-500"
                              : challenge.difficulty === "intermediate"
                              ? "bg-blue-500"
                              : challenge.difficulty === "advanced"
                              ? "bg-amber-500"
                              : "bg-red-500"
                          } text-white`}
                        >
                          {challenge.difficulty.charAt(0).toUpperCase() +
                            challenge.difficulty.slice(1)}
                        </Badge>
                        {challenge.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {challenge.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{challenge.tags.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 sm:items-end">
                      <div className="text-sm text-muted-foreground">
                        {challenge.solvedCount} solved · {challenge.totalAttempts} attempts
                      </div>
                      <Button
                        variant={challenge.isCompleted ? "outline" : "default"}
                        size="sm"
                      >
                        {challenge.isCompleted
                          ? "View Solution"
                          : (challenge as any).status === "started" || (challenge as any).status === "submitted"
                          ? "Continue"
                          : "Start Challenge"}
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChallengesPage;
