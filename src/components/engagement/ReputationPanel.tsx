import { useEffect, useState } from 'react';
import { useEngagement } from '../../hooks/useEngagement';
import { Card, Progress } from '@/components/ui';
import { UserEngagementSummary } from '../../types/engagement';
import { useAuth } from '@/hooks/useAuth';

export const ReputationPanel = () => {
  const { user } = useAuth();
  const { getEngagementSummary } = useEngagement();
  const [summary, setSummary] = useState<UserEngagementSummary | null>(null);

  useEffect(() => {
    if (user) {
      getEngagementSummary(user.id).then(setSummary);
    }
  }, [user, getEngagementSummary]);

  const generalReputation = summary?.reputationByCategory?.general;

  return (
    <Card className="w-full max-w-md p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Activity & Reputation</h2>
        <div className="text-2xl font-bold text-blue-600">
          {generalReputation?.score || 0}
        </div>
      </div>

      <div className="mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span>Level {generalReputation?.level || 1}</span>
          <span>Score: {generalReputation?.score || 0}</span>
        </div>
        <Progress
          value={generalReputation?.score ? (generalReputation.score % 100) : 0}
          className="h-2"
        />
      </div>      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-blue-50 p-3 rounded">
          <p className="text-sm text-blue-600">Total Posts</p>
          <p className="text-xl font-semibold">{summary?.totalPosts || 0}</p>
        </div>
        <div className="bg-green-50 p-3 rounded">
          <p className="text-sm text-green-600">Comments</p>
          <p className="text-xl font-semibold">{summary?.totalComments || 0}</p>
        </div>
        <div className="bg-purple-50 p-3 rounded">
          <p className="text-sm text-purple-600">Connections</p>
          <p className="text-xl font-semibold">{summary?.totalConnections || 0}</p>
        </div>
        <div className="bg-yellow-50 p-3 rounded">
          <p className="text-sm text-yellow-600">Applications</p>
          <p className="text-xl font-semibold">{summary?.totalApplications || 0}</p>
        </div>
      </div>

      {(summary?.recentAchievements ?? []).length > 0 && (
        <div className="space-y-4">
          <h3 className="font-medium">Recent Achievements</h3>
          <div className="space-y-2">
            {(summary?.recentAchievements ?? []).map((achievement) => (
              <div key={achievement.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded">
                {achievement.iconUrl && (
                  <img src={achievement.iconUrl} alt="" className="w-8 h-8" />
                )}
                <div>
                  <p className="font-medium">{achievement.title}</p>
                  <p className="text-sm text-gray-600">{achievement.description}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(achievement.awardedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};
