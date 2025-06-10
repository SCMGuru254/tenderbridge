
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from '@/hooks/useUser';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Trophy, Star, Gift, History, Award } from 'lucide-react';

interface UserPoints {
  current_balance: number;
  lifetime_earned: number;
  lifetime_spent: number;
}

interface Transaction {
  id: string;
  transaction_type: string;
  points: number;
  description: string;
  source: string;
  created_at: string;
}

interface CatalogItem {
  id: string;
  item_code: string;
  name: string;
  description: string;
  points_required: number;
  category: string;
  is_active: boolean;
}

interface Achievement {
  id: string;
  achievement_type: string;
  achievement_data: any;
  points_awarded: number;
  achieved_at: string;
  notified: boolean;
}

const RewardsSystem = () => {
  const { user } = useUser();
  const [userPoints, setUserPoints] = useState<UserPoints | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [catalogItems, setCatalogItems] = useState<CatalogItem[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    if (!user) return;

    try {
      // Fetch user points
      const { data: pointsData } = await supabase
        .from('rewards_points')
        .select('*')
        .eq('user_id', user.id)
        .single();

      setUserPoints(pointsData);

      // Fetch transactions
      const { data: transactionsData } = await supabase
        .from('rewards_transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      setTransactions(transactionsData || []);

      // Fetch catalog items
      const { data: catalogData } = await supabase
        .from('rewards_catalog')
        .select('*')
        .eq('is_active', true)
        .order('points_required');

      setCatalogItems(catalogData || []);

      // Fetch achievements
      const { data: achievementsData } = await supabase
        .from('user_achievements')
        .select('*')
        .eq('user_id', user.id)
        .order('achieved_at', { ascending: false });

      setAchievements(achievementsData || []);

    } catch (error) {
      console.error('Error fetching rewards data:', error);
      toast.error('Failed to load rewards data');
    } finally {
      setLoading(false);
    }
  };

  const handleRedeem = async (catalogItem: CatalogItem) => {
    if (!user || !userPoints) return;

    if (userPoints.current_balance < catalogItem.points_required) {
      toast.error('Insufficient points for this redemption');
      return;
    }

    try {
      const { data, error } = await supabase.rpc('process_redemption', {
        p_user_id: user.id,
        p_catalog_item_id: catalogItem.id,
        p_request_data: {}
      });

      if (error) throw error;

      toast.success(`Successfully redeemed ${catalogItem.name}! Your request will be processed within 72 hours.`);
      fetchUserData(); // Refresh data
    } catch (error: any) {
      console.error('Redemption error:', error);
      toast.error(error.message || 'Failed to process redemption');
    }
  };

  const awardTestPoints = async (points: number, description: string) => {
    if (!user) return;

    try {
      const { data, error } = await supabase.rpc('award_points', {
        p_user_id: user.id,
        p_points: points,
        p_description: description,
        p_source: 'manual_test'
      });

      if (error) throw error;

      toast.success(`Awarded ${points} points!`);
      fetchUserData();
    } catch (error: any) {
      console.error('Award points error:', error);
      toast.error('Failed to award points');
    }
  };

  if (!user) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p>Please sign in to view your rewards</p>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p>Loading rewards data...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Points Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Your Points Balance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{userPoints?.current_balance || 0}</p>
              <p className="text-sm text-muted-foreground">Current Balance</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{userPoints?.lifetime_earned || 0}</p>
              <p className="text-sm text-muted-foreground">Total Earned</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">{userPoints?.lifetime_spent || 0}</p>
              <p className="text-sm text-muted-foreground">Total Spent</p>
            </div>
          </div>
          
          {/* Test buttons for development */}
          <div className="mt-4 space-x-2">
            <Button size="sm" onClick={() => awardTestPoints(10, 'Test: Job application')}>
              Test +10 pts
            </Button>
            <Button size="sm" onClick={() => awardTestPoints(50, 'Test: Profile completion')}>
              Test +50 pts
            </Button>
            <Button size="sm" onClick={() => awardTestPoints(100, 'Test: Referral bonus')}>
              Test +100 pts
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="catalog" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="catalog">Rewards Catalog</TabsTrigger>
          <TabsTrigger value="history">Transaction History</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>

        <TabsContent value="catalog" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {catalogItems.map((item) => (
              <Card key={item.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{item.name}</CardTitle>
                  <Badge variant="outline">{item.category}</Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{item.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-primary">{item.points_required} pts</span>
                    <Button 
                      size="sm"
                      disabled={!userPoints || userPoints.current_balance < item.points_required}
                      onClick={() => handleRedeem(item)}
                    >
                      Redeem
                    </Button>
                  </div>
                  {userPoints && (
                    <Progress 
                      value={(userPoints.current_balance / item.points_required) * 100} 
                      className="mt-2"
                    />
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Recent Transactions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(transaction.created_at).toLocaleDateString()} • {transaction.source}
                      </p>
                    </div>
                    <span className={`font-bold ${transaction.points > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {transaction.points > 0 ? '+' : ''}{transaction.points} pts
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.map((achievement) => (
              <Card key={achievement.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-yellow-500" />
                    {achievement.achievement_type.replace('_', ' ').toUpperCase()}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {new Date(achievement.achieved_at).toLocaleDateString()}
                    </span>
                    <Badge variant="secondary">+{achievement.points_awarded} pts</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {achievements.length === 0 && (
              <Card className="col-span-full">
                <CardContent className="p-6 text-center">
                  <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No achievements yet. Keep engaging to earn your first achievement!</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RewardsSystem;
