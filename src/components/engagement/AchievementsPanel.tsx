
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface UserAchievement {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
  progress?: number;
  target?: number;
}

export const AchievementsPanel = () => {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState<UserAchievement[]>([]);

  useEffect(() => {
    if (user) {
      // Mock achievements data
      setAchievements([
        {
          id: '1',
          name: 'First Application',
          description: 'Submit your first job application',
          unlocked: true,
          progress: 1,
          target: 1
        },
        {
          id: '2',
          name: 'Profile Complete',
          description: 'Complete your profile',
          unlocked: false,
          progress: 3,
          target: 5
        }
      ]);
    }
  }, [user]);

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold mb-4">Achievements</h3>
      {achievements.length === 0 ? (
        <p className="text-gray-500">No achievements yet.</p>
      ) : (
        <ul className="space-y-4">
          {achievements.map(achievement => (
            <li key={achievement.id} className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium">{achievement.name}</h4>
                <p className="text-xs text-gray-500">{achievement.description}</p>
                {achievement.progress !== undefined && achievement.target !== undefined && (
                  <p className="text-xs text-gray-500">
                    Progress: {achievement.progress} / {achievement.target}
                  </p>
                )}
              </div>
              {achievement.unlocked ? (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Unlocked
                </span>
              ) : (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  Locked
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
