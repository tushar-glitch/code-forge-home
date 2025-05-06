
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, Trophy, Star, CheckCircle, Edit, Loader2 } from "lucide-react";
import CandidateNavbar from "@/components/candidate/CandidateNavbar";
import ProgressTracker from "@/components/candidate/ProgressTracker";
import BadgeDisplay, { DeveloperBadge } from "@/components/candidate/BadgeDisplay";
import ActivityCard, { Activity } from "@/components/candidate/ActivityCard";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const ProfilePage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  
  // Profile data
  const [profile, setProfile] = useState({
    username: "",
    fullName: "",
    avatarUrl: "",
    bio: "",
    githubUrl: "",
    linkedinUrl: "",
    level: 1,
    xpPoints: 0,
    nextLevelXp: 1000,
    joinDate: new Date().toISOString(),
  });
  
  // Form state for editing
  const [formData, setFormData] = useState({
    username: "",
    fullName: "",
    bio: "",
    githubUrl: "",
    linkedinUrl: "",
  });
  
  // Skills state
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");
  
  // Badges state
  const [badges, setBadges] = useState<DeveloperBadge[]>([]);
  
  // Activity state
  const [activities, setActivities] = useState<Activity[]>([]);
  
  // Stats state
  const [stats, setStats] = useState({
    challengesCompleted: 0,
    contestsParticipated: 0,
    rank: 0,
  });
  
  // Loading states
  const [savingProfile, setSavingProfile] = useState(false);
  const [loadingActivities, setLoadingActivities] = useState(true);
  const [loadingBadges, setLoadingBadges] = useState(true);
  
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    
    const fetchProfileData = async () => {
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
          setProfile({
            username: profileData.username || "",
            fullName: profileData.full_name || "",
            avatarUrl: profileData.avatar_url || "",
            bio: profileData.bio || "",
            githubUrl: profileData.github_url || "",
            linkedinUrl: profileData.linkedin_url || "",
            level: profileData.level || 1,
            xpPoints: profileData.xp_points || 0,
            nextLevelXp: profileData.next_level_xp || 1000,
            joinDate: profileData.join_date || new Date().toISOString(),
          });
          
          setFormData({
            username: profileData.username || "",
            fullName: profileData.full_name || "",
            bio: profileData.bio || "",
            githubUrl: profileData.github_url || "",
            linkedinUrl: profileData.linkedin_url || "",
          });
        }
        
        // Fetch user skills
        const { data: skillsData, error: skillsError } = await supabase
          .from('user_skills')
          .select('skill')
          .eq('user_id', user.id);
          
        if (!skillsError && skillsData) {
          setSkills(skillsData.map(s => s.skill));
        }
        
        // Fetch user badges
        setLoadingBadges(true);
        const { data: userBadgesData, error: userBadgesError } = await supabase
          .from('user_badges')
          .select('badge_id')
          .eq('user_id', user.id);
          
        if (!userBadgesError && userBadgesData && userBadgesData.length > 0) {
          const badgeIds = userBadgesData.map(ub => ub.badge_id);
          
          const { data: badgesData, error: badgesError } = await supabase
            .from('developer_badges')
            .select('*')
            .in('id', badgeIds);
            
          if (!badgesError && badgesData) {
            setBadges(badgesData as DeveloperBadge[]);
          }
        }
        setLoadingBadges(false);
        
        // Fetch user activities
        setLoadingActivities(true);
        const { data: activitiesData, error: activitiesError } = await supabase
          .from('user_activities')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5);
          
        if (!activitiesError && activitiesData) {
          setActivities(activitiesData as Activity[]);
        }
        setLoadingActivities(false);
        
        // Calculate stats
        const { data: challengeData, error: challengeError } = await supabase
          .from('challenge_attempts')
          .select('*')
          .eq('user_id', user.id)
          .eq('status', 'completed');
          
        const { data: contestData, error: contestError } = await supabase
          .from('contest_participants')
          .select('*')
          .eq('user_id', user.id);
          
        // Get user rank
        const { count: higherRanked, error: rankError } = await supabase
          .from('developer_profiles')
          .select('*', { count: 'exact', head: true })
          .gt('xp_points', profileData?.xp_points || 0);
          
        setStats({
          challengesCompleted: challengeData?.length || 0,
          contestsParticipated: contestData?.length || 0,
          rank: (higherRanked || 0) + 1,
        });
        
      } catch (error) {
        console.error('Error fetching profile data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfileData();
  }, [user]);
  
  const handleSaveProfile = async () => {
    if (!user) return;
    
    try {
      setSavingProfile(true);
      
      // Update profile in database
      const { error } = await supabase
        .from('developer_profiles')
        .update({
          username: formData.username,
          full_name: formData.fullName,
          bio: formData.bio,
          github_url: formData.githubUrl,
          linkedin_url: formData.linkedinUrl,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);
        
      if (error) {
        throw error;
      }
      
      // Update local state
      setProfile(prev => ({
        ...prev,
        username: formData.username,
        fullName: formData.fullName,
        bio: formData.bio,
        githubUrl: formData.githubUrl,
        linkedinUrl: formData.linkedinUrl,
      }));
      
      setEditMode(false);
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setSavingProfile(false);
    }
  };
  
  const handleAddSkill = async () => {
    if (!user || !newSkill.trim()) return;
    
    try {
      // Check if skill already exists
      if (skills.includes(newSkill.trim())) {
        setNewSkill("");
        return;
      }
      
      // Add skill to database
      const { error } = await supabase
        .from('user_skills')
        .insert({
          user_id: user.id,
          skill: newSkill.trim(),
        });
        
      if (error) {
        throw error;
      }
      
      // Update local state
      setSkills(prev => [...prev, newSkill.trim()]);
      setNewSkill("");
    } catch (error) {
      console.error('Error adding skill:', error);
    }
  };
  
  const handleRemoveSkill = async (skill: string) => {
    if (!user) return;
    
    try {
      // Remove skill from database
      const { error } = await supabase
        .from('user_skills')
        .delete()
        .eq('user_id', user.id)
        .eq('skill', skill);
        
      if (error) {
        throw error;
      }
      
      // Update local state
      setSkills(prev => prev.filter(s => s !== skill));
    } catch (error) {
      console.error('Error removing skill:', error);
    }
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
    <div className="min-h-screen bg-background">
      <CandidateNavbar />
      
      <div className="container max-w-7xl mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          {/* Left Column - Profile Info */}
          <div className="w-full md:w-2/3 space-y-8">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16 border-2 border-primary/10">
                      <AvatarImage src={profile.avatarUrl} />
                      <AvatarFallback className="text-lg">
                        {profile.username.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-2xl">{profile.fullName || profile.username}</CardTitle>
                      <CardDescription>@{profile.username}</CardDescription>
                    </div>
                  </div>
                  <Button 
                    variant={editMode ? "outline" : "default"} 
                    size="sm"
                    onClick={() => setEditMode(!editMode)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    {editMode ? "Cancel" : "Edit Profile"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {editMode ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Username</label>
                        <Input 
                          value={formData.username} 
                          onChange={e => setFormData(prev => ({...prev, username: e.target.value}))}
                          placeholder="Username"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Full Name</label>
                        <Input 
                          value={formData.fullName} 
                          onChange={e => setFormData(prev => ({...prev, fullName: e.target.value}))}
                          placeholder="Full Name"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Bio</label>
                      <Textarea 
                        value={formData.bio} 
                        onChange={e => setFormData(prev => ({...prev, bio: e.target.value}))}
                        placeholder="Tell us about yourself"
                        rows={4}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">GitHub URL</label>
                        <Input 
                          value={formData.githubUrl} 
                          onChange={e => setFormData(prev => ({...prev, githubUrl: e.target.value}))}
                          placeholder="https://github.com/username"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">LinkedIn URL</label>
                        <Input 
                          value={formData.linkedinUrl} 
                          onChange={e => setFormData(prev => ({...prev, linkedinUrl: e.target.value}))}
                          placeholder="https://linkedin.com/in/username"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button 
                        onClick={handleSaveProfile}
                        disabled={savingProfile}
                      >
                        {savingProfile ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Saving...
                          </>
                        ) : "Save Profile"}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>
                          Joined {new Date(profile.joinDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Trophy className="h-4 w-4" />
                        <span>Rank #{stats.rank}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Star className="h-4 w-4" />
                        <span>{profile.xpPoints} XP</span>
                      </div>
                    </div>
                    <Separator />
                    <div>
                      <h3 className="font-medium mb-2">Bio</h3>
                      <p className="text-sm">{profile.bio || "No bio provided."}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {profile.githubUrl && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer">GitHub</a>
                        </Button>
                      )}
                      {profile.linkedinUrl && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer">LinkedIn</a>
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Skills */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Skills</CardTitle>
                <CardDescription>Add your technical skills</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  {skills.map(skill => (
                    <Badge key={skill} variant="secondary" className="gap-1">
                      {skill}
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-4 w-4 ml-1 rounded-full text-muted-foreground hover:text-foreground"
                        onClick={() => handleRemoveSkill(skill)}
                      >
                        &times;
                      </Button>
                    </Badge>
                  ))}
                  {skills.length === 0 && (
                    <p className="text-sm text-muted-foreground">No skills added yet.</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Select value={newSkill} onValueChange={setNewSkill}>
                    <SelectTrigger className="w-[250px]">
                      <SelectValue placeholder="Add a skill" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="React">React</SelectItem>
                      <SelectItem value="TypeScript">TypeScript</SelectItem>
                      <SelectItem value="JavaScript">JavaScript</SelectItem>
                      <SelectItem value="Node.js">Node.js</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={handleAddSkill} disabled={!newSkill.trim()}>
                    Add Skill
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Badges */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Badges</CardTitle>
                <CardDescription>Badges you've earned</CardDescription>
              </CardHeader>
              <CardContent>
                {loadingBadges ? (
                  <div className="flex justify-center items-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : badges.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      Complete challenges to earn badges
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 py-2">
                    {badges.map(badge => (
                      <div key={badge.id} className="flex flex-col items-center gap-2 p-4 bg-muted/20 rounded-lg">
                        <BadgeDisplay badge={badge} size="md" />
                        <div className="text-center">
                          <p className="font-medium">{badge.name}</p>
                          <p className="text-xs text-muted-foreground line-clamp-2">{badge.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Right Column - Stats, Activity */}
          <div className="w-full md:w-1/3 space-y-8">
            {/* Progress Bar */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Your Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <ProgressTracker 
                  currentXP={profile.xpPoints} 
                  nextLevelXP={profile.nextLevelXp} 
                  level={profile.level}
                  userId={user?.id}
                />
                
                <Separator className="my-4" />
                
                <div className="grid grid-cols-2 gap-2">
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center p-4">
                      <span className="text-2xl font-bold text-primary">{stats.challengesCompleted}</span>
                      <span className="text-xs text-muted-foreground">Challenges Completed</span>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center p-4">
                      <span className="text-2xl font-bold text-primary">{stats.contestsParticipated}</span>
                      <span className="text-xs text-muted-foreground">Contests Joined</span>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
            
            {/* Recent Activity */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                {loadingActivities ? (
                  <div className="flex justify-center items-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : activities.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No recent activity</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {activities.map(activity => (
                      <ActivityCard key={activity.id} activity={activity} />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Quick Stats */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Global Rank</span>
                  <Badge variant="outline">{stats.rank}</Badge>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-sm">Challenges Completed</span>
                  <Badge variant="outline">{stats.challengesCompleted}</Badge>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-sm">Contests Participated</span>
                  <Badge variant="outline">{stats.contestsParticipated}</Badge>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-sm">Badges Earned</span>
                  <Badge variant="outline">{badges.length}</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
