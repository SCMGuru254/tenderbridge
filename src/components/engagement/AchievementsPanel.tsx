import React from 'react';
import { useEngagement } from '../../hooks/useEngagement';
import { UserAchievement } from '../../types/engagement';
import { Card, Progress } from '@/components/ui';

export const AchievementsPanel = () => {
  const { achievements } = useEngagement();

  return (
    <Card className="w-full max-w-md p-4">
      <h2 className="text-xl font-semibold mb-4">Achievements</h2>
      <div className="grid gap-4">
        {achievements.map((achievement: UserAchievement) => (
          <div
            key={achievement.id}
            className={`p-4 rounded-lg ${
              achievement.unlocked
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                : 'bg-gray-100'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                {/* Add achievement icon here */}
                <span className="text-2xl">{achievement.icon}</span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">{achievement.title}</h3>
                <p className="text-sm opacity-90">{achievement.description}</p>
                {!achievement.unlocked && achievement.progress !== undefined && (
                  <div className="mt-2">
                    <Progress
                      value={(achievement.progress / achievement.target) * 100}
                      className="h-2"
                    />
                    <p className="text-xs mt-1">
                      {achievement.progress} / {achievement.target}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
