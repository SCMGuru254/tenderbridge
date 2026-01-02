import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Gift, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface RewardsRedemptionProps {
  currentPoints: number;
  onRedeemComplete: () => void;
}

export function RewardsRedemption({ currentPoints, onRedeemComplete }: RewardsRedemptionProps) {
  const [redeeming, setRedeeming] = useState<string | null>(null);

  const rewards = [
    {
      id: 'PROFILE_HIGHLIGHT',
      title: 'Profile Highlight (7 Days)',
      cost: 50,
      description: 'Boost your visibility to top employers.'
    },
    {
      id: 'CV_REVIEW',
      title: 'Professional CV Review',
      cost: 100,
      description: 'Manual review & feedback from an HR Partner.'
    },
    {
      id: 'CAREER_COACHING',
      title: '30-min Career Coaching',
      cost: 200,
      description: '1-on-1 session with a supply chain mentor.'
    }
  ];

  const handleRedeem = async (rewardId: string, cost: number, title: string) => {
    if (currentPoints < cost) {
      toast.error(`Insufficient points. You need ${cost - currentPoints} more!`);
      return;
    }

    try {
      setRedeeming(rewardId);
      const { data, error } = await supabase.rpc('redeem_reward', { 
        amount_to_spend: cost, 
        reward_type: rewardId 
      });

      if (error) throw error;

      if (data && data.success) {
        toast.success(`Redeemed: ${title}! Admin will contact you shortly.`);
        onRedeemComplete(); // Refresh parent stats
      } else {
        toast.error('Redemption failed. Please try again.');
      }
    } catch (err: any) {
      toast.error('Error redeeming: ' + err.message);
    } finally {
      setRedeeming(null);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center gap-2">
            <Gift className="h-5 w-5 text-purple-600" />
            <CardTitle>Spending Your Points</CardTitle>
        </div>
        <CardDescription>Use your hard-earned points for career-boosting perks.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-3">
        {rewards.map((reward) => (
          <div key={reward.id} className="border p-4 rounded-lg flex flex-col justify-between hover:border-purple-200 transition-colors">
            <div>
              <div className="flex justify-between items-start mb-2">
                <Badge variant={currentPoints >= reward.cost ? 'default' : 'outline'} className={currentPoints >= reward.cost ? 'bg-purple-100 text-purple-700 hover:bg-purple-200 border-0' : ''}>
                    {reward.cost} PTS
                </Badge>
              </div>
              <h3 className="font-bold text-sm mb-1">{reward.title}</h3>
              <p className="text-xs text-muted-foreground mb-4">{reward.description}</p>
            </div>
            
            <Button 
                size="sm" 
                variant={currentPoints >= reward.cost ? 'default' : 'secondary'}
                disabled={currentPoints < reward.cost || redeeming === reward.id}
                onClick={() => handleRedeem(reward.id, reward.cost, reward.title)}
                className="w-full"
            >
              {redeeming === reward.id ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
              ) : currentPoints >= reward.cost ? (
                  'Redeem'
              ) : (
                  'Need Points'
              )}
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
