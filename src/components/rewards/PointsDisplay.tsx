
import { useState, useEffect } from 'react';
import { Badge } from "@/components/ui/badge";
import { useUser } from '@/hooks/useUser';
import { supabase } from '@/integrations/supabase/client';
import { Trophy } from 'lucide-react';

const PointsDisplay = () => {
  const { user } = useUser();
  const [points, setPoints] = useState<number>(0);

  useEffect(() => {
    if (user) {
      fetchUserPoints();
      
      // Set up real-time subscription for points updates
      const subscription = supabase
        .channel('points-changes')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'rewards_points',
          filter: `user_id=eq.${user.id}`
        }, (payload) => {
          if (payload.new && typeof payload.new === 'object' && 'current_balance' in payload.new) {
            setPoints(payload.new.current_balance as number);
          }
        })
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    }
    return;
  }, [user]);

  const fetchUserPoints = async () => {
    if (!user) return;

    try {
      const { data } = await supabase
        .from('rewards_points')
        .select('current_balance')
        .eq('user_id', user.id)
        .single();

      setPoints(data?.current_balance || 0);
    } catch (error) {
      console.error('Error fetching points:', error);
    }
  };

  if (!user) return null;

  return (
    <Badge variant="outline" className="flex items-center gap-1">
      <Trophy className="h-3 w-3" />
      {points} pts
    </Badge>
  );
};

export default PointsDisplay;
