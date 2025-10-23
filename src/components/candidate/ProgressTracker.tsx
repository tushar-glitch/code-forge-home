
import React, { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { api } from "@/lib/api";


interface ProgressTrackerProps {
  currentXP: number;
  nextLevelXP: number;
  level: number;
  userId?: string;
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({ 
  currentXP: initialXP, 
  nextLevelXP: initialNextXP, 
  level: initialLevel,
  userId
}) => {
  const [currentXP, setCurrentXP] = useState(initialXP);
  const [nextLevelXP, setNextLevelXP] = useState(initialNextXP);
  const [level, setLevel] = useState(initialLevel);
  const [loading, setLoading] = useState(!!userId);

  useEffect(() => {
    if (userId) {
      const fetchUserProgress = async () => {
        try {
          const data = await api.get<any>(
            `/developer-profiles?id=${userId}`,
            session?.token
          );

          if (data && data.length > 0) {
            const profileData = data[0];
            setCurrentXP(profileData.xp_points);
            setNextLevelXP(profileData.next_level_xp);
            setLevel(profileData.level);
          }
        } catch (error) {
          console.error('Error in progress tracker:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchUserProgress();
    }
  }, [userId]);

  const percentage = Math.min(100, Math.floor((currentXP / nextLevelXP) * 100));
  
  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
            {level}
          </div>
          <span className="text-sm font-medium">Developer Level</span>
          {loading && <span className="text-xs text-muted-foreground">(Loading...)</span>}
        </div>
        <span className="text-xs text-muted-foreground">{currentXP} / {nextLevelXP} XP</span>
      </div>
      <Progress value={percentage} className="h-2" />
      <p className="text-xs text-muted-foreground">
        {nextLevelXP - currentXP} XP needed for next level
      </p>
    </div>
  );
};

export default ProgressTracker;
