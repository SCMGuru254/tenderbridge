
import { NotificationsPanel } from '../components/engagement/NotificationsPanel';
import { ActivityFeed } from '../components/engagement/ActivityFeed';
import { AchievementsPanel } from '../components/engagement/AchievementsPanel';
import { ReputationPanel } from '../components/engagement/ReputationPanel';

export const EngagementDashboard = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Activity & Engagement</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Content - Activity Feed */}
        <div className="lg:col-span-7 space-y-8">
          <ActivityFeed />
        </div>

        {/* Sidebar - Notifications, Achievements, Reputation */}
        <div className="lg:col-span-5 space-y-8">
          <NotificationsPanel />
          <ReputationPanel />
          <AchievementsPanel />
        </div>
      </div>
    </div>
  );
};
