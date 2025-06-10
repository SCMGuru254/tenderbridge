
import RewardsSystem from '@/components/rewards/RewardsSystem';

export default function RewardsPage() {
  return (
    <div className="container mx-auto px-4 py-12 mt-16">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Rewards Program</h1>
        <p className="text-muted-foreground">
          Earn points through platform engagement and redeem them for valuable career benefits
        </p>
      </div>
      
      <RewardsSystem />
    </div>
  );
}
