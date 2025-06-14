
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Star, Award, TrendingUp } from 'lucide-react';

interface UserReputation {
  id: string;
  score: number;
  level: string;
  totalReviews: number;
  endorsements: number;
  achievements: number;
}

interface UserAchievement {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
  progress?: number;
  target?: number;
}

export const ReputationPanel = () => {
  const { user } = useAuth();
  const [reputation, setReputation] = useState<UserReputation | null>(null);
  const [achievements, setAchievements] = useState<UserAchievement[]>([]);

  useEffect(() => {
    if (user) {
      // Mock reputation data
      setReputation({
        id: '1',
        score: 85,
        level: 'Expert',
        totalReviews: 12,
        endorsements: 8,
        achievements: 5
      });

      setAchievements([
        {
          id: '1',
          name: 'First Connection',
          description: 'Made your first professional connection',
          unlocked: true
        },
        {
          id: '2',
          name: 'Profile Complete',
          description: 'Complete your professional profile',
          unlocked: false,
          progress: 3,
          target: 5
        }
      ]);
    }
  }, [user]);

  if (!reputation) return null;

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold mb-4">Professional Reputation</h3>
      
      <div className="space-y-4">
        <div className="text-center">
          <div className="text-3xl font-bold text-blue-600">{reputation.score}</div>
          <div className="text-sm text-gray-500">Reputation Score</div>
          <div className="text-sm font-medium text-blue-600">{reputation.level}</div>
        </div>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-semibold">{reputation.totalReviews}</div>
            <div className="text-xs text-gray-500">Reviews</div>
          </div>
          <div>
            <div className="text-lg font-semibold">{reputation.endorsements}</div>
            <div className="text-xs text-gray-500">Endorsements</div>
          </div>
          <div>
            <div className="text-lg font-semibold">{reputation.achievements}</div>
            <div className="text-xs text-gray-500">Achievements</div>
          </div>
        </div>

        <div className="border-t pt-4">
          <h4 className="font-medium mb-2">Recent Achievements</h4>
          <div className="space-y-2">
            {achievements.slice(0, 3).map(achievement => (
              <div key={achievement.id} className="flex items-center space-x-2">
                <Award className="h-4 w-4 text-yellow-500" />
                <span className="text-sm">{achievement.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t pt-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Next Level Progress</span>
            <span className="text-sm font-medium">75%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
            <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};
