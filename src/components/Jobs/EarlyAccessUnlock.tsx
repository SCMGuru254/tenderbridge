import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lock, Unlock, Clock, Coins } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContextFull';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface EarlyAccessUnlockProps {
  jobId: string;
  jobTitle: string;
  earlyAccessUntil: string;
  pointsRequired?: number;
  onUnlockComplete?: () => void;
}

export function EarlyAccessUnlock({ 
  jobId, 
  jobTitle, 
  earlyAccessUntil, 
  pointsRequired = 20,
  onUnlockComplete 
}: EarlyAccessUnlockProps) {
  const { user } = useAuth();
  const [unlocking, setUnlocking] = useState(false);
  const [userPoints, setUserPoints] = useState<number | null>(null);
  const [open, setOpen] = useState(false);

  const loadUserPoints = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('user_rewards')
        .select('current_points')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      setUserPoints(data?.current_points || 0);
    } catch (error) {
      console.error('Error loading points:', error);
    }
  };

  const handleUnlock = async () => {
    if (!user) {
      toast.error('Please log in to unlock early access');
      return;
    }

    try {
      setUnlocking(true);
      
      const { data, error } = await supabase.rpc('redeem_early_job_access', {
        p_job_id: jobId,
        p_points_to_spend: pointsRequired,
      });

      if (error) throw error;

      if (data?.success) {
        toast.success('Early access unlocked! You can now view this job.');
        setOpen(false);
        onUnlockComplete?.();
      } else {
        toast.error(data?.message || 'Failed to unlock early access');
      }
    } catch (error: any) {
      console.error('Error unlocking early access:', error);
      toast.error(error.message || 'Failed to unlock early access');
    } finally {
      setUnlocking(false);
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen) {
      loadUserPoints();
    }
  };

  const timeRemaining = new Date(earlyAccessUntil).getTime() - Date.now();
  const hoursRemaining = Math.floor(timeRemaining / (1000 * 60 * 60));
  const hasEnoughPoints = userPoints !== null && userPoints >= pointsRequired;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Card className="border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-yellow-50 hover:shadow-lg transition-all cursor-pointer">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Lock className="h-5 w-5 text-orange-600" />
                  <Badge variant="outline" className="bg-orange-100 text-orange-700 border-orange-300">
                    Early Access
                  </Badge>
                </div>
                <CardTitle className="text-xl line-clamp-1">{jobTitle}</CardTitle>
                <CardDescription className="mt-2">
                  Unlock this job before it's publicly available
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-orange-700">
                <Clock className="h-4 w-4" />
                <span>{hoursRemaining}h until public release</span>
              </div>
              <div className="flex items-center gap-1 font-semibold text-orange-600">
                <Coins className="h-4 w-4" />
                <span>{pointsRequired} pts</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Unlock className="h-5 w-5 text-orange-600" />
            Unlock Early Access
          </DialogTitle>
          <DialogDescription>
            Get exclusive early access to this job before it's available to everyone
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Job Info */}
          <div className="p-4 bg-slate-50 rounded-lg">
            <h3 className="font-semibold text-lg mb-2">{jobTitle}</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Public release in {hoursRemaining} hours</span>
            </div>
          </div>

          {/* Points Info */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <div className="text-sm text-muted-foreground">Cost to unlock</div>
              <div className="text-2xl font-bold text-orange-600 flex items-center gap-2">
                <Coins className="h-6 w-6" />
                {pointsRequired} points
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Your balance</div>
              <div className={`text-2xl font-bold ${hasEnoughPoints ? 'text-green-600' : 'text-red-600'}`}>
                {userPoints !== null ? userPoints : '...'} points
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">Why unlock early access?</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>✓ Be the first to apply before competition increases</li>
              <li>✓ Show employers you're proactive and serious</li>
              <li>✓ Higher chance of getting noticed</li>
              <li>✓ Access remains until job goes public</li>
            </ul>
          </div>

          {/* Action Button */}
          {!user ? (
            <Button className="w-full" variant="outline">
              Log in to unlock
            </Button>
          ) : !hasEnoughPoints ? (
            <div className="space-y-2">
              <Button className="w-full" disabled>
                Insufficient points
              </Button>
              <p className="text-sm text-center text-muted-foreground">
                Earn more points by logging in daily, applying to jobs, or viewing ads
              </p>
            </div>
          ) : (
            <Button 
              onClick={handleUnlock} 
              disabled={unlocking}
              className="w-full bg-orange-600 hover:bg-orange-700"
            >
              {unlocking ? 'Unlocking...' : `Unlock for ${pointsRequired} points`}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
