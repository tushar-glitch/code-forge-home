
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Search,
  Filter,
  ListIcon,
  LayoutGrid,
  Star,
  CheckCircle,
  Calendar,
  XCircle,
  Users
} from "lucide-react";
import ChallengeCard, { Challenge } from "@/components/candidate/ChallengeCard";
import SponsoredBanner from "@/components/candidate/SponsoredBanner";

// Sample data
const dummyChallenges: Challenge[] = [
  {
    id: "1",
    title: "React Performance Optimization Challenge",
    description: "Optimize a slow React app to improve rendering performance and reduce unnecessary re-renders",
    difficulty: "advanced",
    tags: ["React", "Performance", "Hooks", "Optimization"],
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
    title: "Build a Responsive Dashboard with Tailwind CSS",
    description: "Create a responsive admin dashboard using Tailwind CSS with dark mode support",
    difficulty: "intermediate",
    tags: ["Tailwind CSS", "Responsive Design", "UI/UX"],
    solvedCount: 245,
    totalAttempts: 412,
    daysActive: 21,
    topContributors: [
      { id: "1", username: "reactninja" },
      { id: "4", username: "javascriptguru" },
      { id: "5", username: "typescriptpro" }
    ]
  },
  {
    id: "3",
    title: "Authentication System with Node.js",
    description: "Build a secure authentication system with JWT, password hashing, and role-based access control",
    difficulty: "advanced",
    tags: ["Node.js", "Express", "JWT", "Security"],
    solvedCount: 87,
    totalAttempts: 320,
    daysActive: 30,
    topContributors: [
      { id: "2", username: "devmaster" },
      { id: "6", username: "backenddev" },
      { id: "7", username: "securityexpert" }
    ]
  },
  {
    id: "4",
    title: "Interactive Data Visualization with D3",
    description: "Create interactive charts and graphs using D3.js to visualize complex datasets",
    difficulty: "expert",
    tags: ["D3.js", "Data Visualization", "SVG", "JavaScript"],
    solvedCount: 56,
    totalAttempts: 214,
    daysActive: 45,
    topContributors: [
      { id: "8", username: "datavis" },
      { id: "9", username: "d3master" },
      { id: "10", username: "chartguru" }
    ]
  },
  {
    id: "5",
    title: "React Native Photo Gallery App",
    description: "Build a mobile photo gallery app with React Native featuring infinite scroll and image caching",
    difficulty: "intermediate",
    tags: ["React Native", "Mobile", "Image Processing"],
    solvedCount: 103,
    totalAttempts: 287,
    daysActive: 18,
    topContributors: [
      { id: "11", username: "mobilepro" },
      { id: "12", username: "reactnativeguru" },
      { id: "1", username: "reactninja" }
    ]
  },
  {
    id: "6",
    title: "CSS Animation Challenge",
    description: "Create complex animations using only CSS without any JavaScript libraries",
    difficulty: "beginner",
    tags: ["CSS", "Animation", "UI/UX"],
    solvedCount: 198,
    totalAttempts: 321,
    daysActive: 10,
    topContributors: [
      { id: "13", username: "cssninja" },
      { id: "14", username: "animationpro" },
      { id: "15", username: "designmaster" }
    ]
  },
];

interface FilterState {
  search: string;
  difficulty: string;
  tag: string;
  sortBy: string;
  completed: string;
}

const ChallengesPage = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentTab, setCurrentTab] = useState<'all' | 'popular' | 'newest'>('all');
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    difficulty: '',
    tag: '',
    sortBy: 'popular',
    completed: 'all'
  });
  
  // Extract all unique tags from challenges
  const allTags = Array.from(
    new Set(dummyChallenges.flatMap(challenge => challenge.tags))
  ).sort();
  
  // Filter challenges based on current filters
  const filteredChallenges = dummyChallenges.filter(challenge => {
    // Search filter
    if (filters.search && !challenge.title.toLowerCase().includes(filters.search.toLowerCase()) &&
        !challenge.description.toLowerCase().includes(filters.search.toLowerCase()) &&
        !challenge.tags.some(tag => tag.toLowerCase().includes(filters.search.toLowerCase()))) {
      return false;
    }
    
    // Difficulty filter
    if (filters.difficulty && challenge.difficulty !== filters.difficulty) {
      return false;
    }
    
    // Tag filter
    if (filters.tag && !challenge.tags.includes(filters.tag)) {
      return false;
    }
    
    // Completion filter
    if (filters.completed === 'completed' && !challenge.isCompleted) {
      return false;
    } else if (filters.completed === 'not-completed' && challenge.isCompleted) {
      return false;
    }
    
    return true;
  });
  
  // Sort challenges
  const sortedChallenges = [...filteredChallenges].sort((a, b) => {
    switch (filters.sortBy) {
      case 'popular':
        return b.solvedCount - a.solvedCount;
      case 'newest':
        return b.daysActive - a.daysActive;
      case 'difficulty-asc':
        const difficultyOrder = { beginner: 1, intermediate: 2, advanced: 3, expert: 4 };
        return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
      case 'difficulty-desc':
        const difficultyOrderDesc = { beginner: 1, intermediate: 2, advanced: 3, expert: 4 };
        return difficultyOrderDesc[b.difficulty] - difficultyOrderDesc[a.difficulty];
      default:
        return 0;
    }
  });

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      difficulty: '',
      tag: '',
      sortBy: 'popular',
      completed: 'all'
    });
  };

  return (
    <div className="container max-w-7xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Coding Challenges</h1>
        <p className="text-muted-foreground">
          Practice and enhance your skills with our collection of real-world coding challenges
        </p>
      </div>

      {/* Sponsored Banner */}
      <div className="mb-8">
        <SponsoredBanner
          title="React Performance Challenge - Sponsored by TechCorp"
          description="Optimize a React app and demonstrate your performance tuning skills!"
          company="TechCorp"
          companyLogoUrl="https://placehold.co/100x50?text=TechCorp"
          ctaText="Enter Challenge"
          ctaLink="#"
        />
      </div>

      {/* Filters and Controls */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search challenges..."
              className="pl-10"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="icon"
              className="h-10 w-10"
              onClick={() => setViewMode('grid')}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="icon"
              className="h-10 w-10"
              onClick={() => setViewMode('list')}
            >
              <ListIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium hidden sm:inline">Filters:</span>
          </div>
          
          <Select
            value={filters.difficulty}
            onValueChange={(value) => handleFilterChange('difficulty', value)}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Difficulties</SelectItem>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
              <SelectItem value="expert">Expert</SelectItem>
            </SelectContent>
          </Select>
          
          <Select
            value={filters.tag}
            onValueChange={(value) => handleFilterChange('tag', value)}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Technology" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Technologies</SelectItem>
              {allTags.map(tag => (
                <SelectItem key={tag} value={tag}>{tag}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select
            value={filters.sortBy}
            onValueChange={(value) => handleFilterChange('sortBy', value)}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popular">Most Popular</SelectItem>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="difficulty-asc">Easiest First</SelectItem>
              <SelectItem value="difficulty-desc">Hardest First</SelectItem>
            </SelectContent>
          </Select>
          
          <Select
            value={filters.completed}
            onValueChange={(value) => handleFilterChange('completed', value)}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Completion" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Challenges</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="not-completed">Not Completed</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="ghost" size="sm" onClick={resetFilters}>
            Reset
          </Button>
        </div>
      </div>
      
      <div className="mb-6">
        <Tabs defaultValue="all" onValueChange={(value) => setCurrentTab(value as 'all' | 'popular' | 'newest')}>
          <TabsList>
            <TabsTrigger value="all" className="flex items-center gap-2">
              <ListIcon className="h-4 w-4" />
              All Challenges
            </TabsTrigger>
            <TabsTrigger value="popular" className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              Most Popular
            </TabsTrigger>
            <TabsTrigger value="newest" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Newest
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      {/* Results Info */}
      <div className="flex items-center justify-between mb-6">
        <div className="text-sm text-muted-foreground">
          Showing {sortedChallenges.length} of {dummyChallenges.length} challenges
        </div>
        
        <div className="flex items-center gap-2 text-sm">
          <Badge variant="outline" className="flex items-center gap-1">
            <CheckCircle className="h-3.5 w-3.5 text-green-500" />
            <span>{dummyChallenges.filter(c => c.isCompleted).length} Completed</span>
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <XCircle className="h-3.5 w-3.5 text-slate-400" />
            <span>{dummyChallenges.filter(c => !c.isCompleted).length} Not Started</span>
          </Badge>
        </div>
      </div>
      
      {/* Challenges Grid/List */}
      {sortedChallenges.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-bold mb-2">No challenges found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your filters or search terms
          </p>
          <Button onClick={resetFilters}>Reset Filters</Button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {sortedChallenges.map(challenge => (
            <ChallengeCard 
              key={challenge.id} 
              challenge={challenge}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {sortedChallenges.map(challenge => (
            <div key={challenge.id} className="border rounded-lg overflow-hidden bg-card hover:shadow-md transition-shadow">
              <div className="p-4">
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{challenge.title}</h3>
                      {challenge.isCompleted && (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      )}
                    </div>
                    
                    <p className="text-sm text-muted-foreground mt-1">{challenge.description}</p>
                    
                    <div className="flex items-center gap-4 mt-3 text-sm">
                      <div className="flex items-center gap-1">
                        <Users className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>{challenge.solvedCount} solved</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>{challenge.daysActive} days active</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mt-3">
                      <Badge variant="outline" className={`
                        ${challenge.difficulty === 'beginner' ? 'bg-green-500' :
                          challenge.difficulty === 'intermediate' ? 'bg-blue-500' :
                          challenge.difficulty === 'advanced' ? 'bg-amber-500' : 
                          'bg-red-500'} text-white`}
                      >
                        {challenge.difficulty.charAt(0).toUpperCase() + challenge.difficulty.slice(1)}
                      </Badge>
                      
                      {challenge.tags.map(tag => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <Button 
                    variant={challenge.isCompleted ? "outline" : "default"}
                    className="flex-shrink-0" 
                  >
                    {challenge.isCompleted ? "View Solution" : "Start Challenge"}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChallengesPage;
