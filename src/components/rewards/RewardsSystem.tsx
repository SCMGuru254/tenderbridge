
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from '@/hooks/useUser';
import { supabase } from '@/integrations/supabase/client';
import { useRewards } from '@/hooks/useRewards';
import { Trophy, Star, Calendar, CreditCard, Twitter, Linkedin, Link2, Share2, UserCheck, Briefcase } from 'lucide-react';
import { toast } from 'sonner';

interface CatalogItem {
  id: string;
  name: string;
  description: string;
  points_required: number;
  category: string;
  is_active: boolean;
  metadata: any;
}

interface Transaction {
  id: string;
  transaction_type: string;
  points: number;
  description: string;
  created_at: string;
  source: string;
}

interface Achievement {
  id: string;
  achievement_type: string;
  achievement_data: any;
  points_awarded: number;
  created_at: string;
}

const RewardsSystem = () => {
  const { user } = useUser();
  const { points, awardDailyLoginPoints, fetchUserPoints, awardSocialFollowPoints } = useRewards();
  const [catalogItems, setCatalogItems] = useState<CatalogItem[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchCatalogItems();
      fetchTransactions();
      fetchAchievements();
      
      // Award daily login points
      awardDailyLoginPoints();
    }
  }, [user]);

  const fetchCatalogItems = async () => {
    try {
      const { data, error } = await supabase
        .from('rewards_catalog')
        .select('*')
        .eq('is_active', true)
        .order('points_required');

      if (error) throw error;
      setCatalogItems(data || []);
    } catch (error) {
      console.error('Error fetching catalog items:', error);
    }
  };

  const fetchTransactions = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('rewards_transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setTransactions(data || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const fetchAchievements = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_achievements')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAchievements(data || []);
    } catch (error) {
      console.error('Error fetching achievements:', error);
    }
  };

  const handleRedemption = async (itemId: string) => {
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase.rpc('process_redemption', {
        p_user_id: user.id,
        p_catalog_item_id: itemId,
        p_request_data: {}
      });

      if (error) throw error;
      
      toast.success('Redemption request submitted successfully!');
      await fetchUserPoints();
      await fetchTransactions();
    } catch (error: any) {
      console.error('Error processing redemption:', error);
      toast.error(`Redemption failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getProgressToNextLevel = () => {
    const levels = [0, 100, 500, 1000, 2500, 5000];
    const currentLevel = levels.findIndex(level => points < level) - 1;
    const nextLevel = levels[currentLevel + 1];
    
    if (!nextLevel) return { progress: 100, nextLevel: 'Max Level' };
    
    const currentLevelValue = levels[currentLevel] || 0;
    const progress = ((points - currentLevelValue) / (nextLevel - currentLevelValue)) * 100;
    return { progress, nextLevel };
  };

  const { progress, nextLevel } = getProgressToNextLevel();

  if (!user) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">Please sign in to view your rewards.</p>
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
            <Trophy className="h-5 w-5" />
            Your Rewards Balance
          </CardTitle>
          <CardDescription>
            Earn points through platform engagement and redeem them for valuable rewards
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-primary mb-4">{points} Points</div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress to next level</span>
              <span>{typeof nextLevel === 'number' ? `${nextLevel} pts` : nextLevel}</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="catalog" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="catalog">Rewards Catalog</TabsTrigger>
          <TabsTrigger value="earn">Ways to Earn</TabsTrigger>
          <TabsTrigger value="history">Transaction History</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>

        <TabsContent value="catalog" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {catalogItems.map((item) => (
              <Card key={item.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{item.name}</CardTitle>
                  <CardDescription>{item.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Star className="h-3 w-3" />
                      {item.points_required} pts
                    </Badge>
                    <Button
                      onClick={() => handleRedemption(item.id)}
                      disabled={loading || points < item.points_required}
                      size="sm"
                    >
                      {points < item.points_required ? 'Insufficient Points' : 'Redeem'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="earn" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Ways to Earn Points</CardTitle>
              <CardDescription>Complete activities to boost your balance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                {/* Fixed Earnings */}
                <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/5 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold">Daily Login Bonus</p>
                      <p className="text-sm text-muted-foreground">Sign in every day to collect points</p>
                    </div>
                  </div>
                  <Badge variant="secondary">+5 pts</Badge>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/5 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-full bg-green-100 text-green-600">
                      <Briefcase className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold">Apply for Jobs</p>
                      <p className="text-sm text-muted-foreground">Earn points for every application you track</p>
                    </div>
                  </div>
                  <Badge variant="secondary">+10 pts</Badge>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/5 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                      <Share2 className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold">Share Jobs</p>
                      <p className="text-sm text-muted-foreground">Share job opportunities with your network</p>
                    </div>
                  </div>
                  <Badge variant="secondary">+10 pts</Badge>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/5 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-full bg-orange-100 text-orange-600">
                      <UserCheck className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold">Complete Profile</p>
                      <p className="text-sm text-muted-foreground">Fill out your professional profile</p>
                    </div>
                  </div>
                  <Badge variant="secondary">+50 pts</Badge>
                </div>
              </div>

              {/* Social Follow Actions */}
              <div className="mt-8 space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Link2 className="h-5 w-5" />
                  Follow Our Social Media
                </h3>
                <p className="text-sm text-muted-foreground mb-4">Earn points for following us on social media (One-time reward)</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Button 
                    variant="outline" 
                    className="flex items-center justify-between h-auto p-4 border-blue-200 hover:bg-blue-50"
                    onClick={() => {
                      window.open('https://linkedin.com/company/supply-chain-ke', '_blank');
                      awardSocialFollowPoints('LinkedIn');
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <Linkedin className="h-5 w-5 text-[#0077b5]" />
                      <span className="font-medium text-[#0077b5]">Follow LinkedIn</span>
                    </div>
                    <Badge className="bg-[#0077b5]">+5 pts</Badge>
                  </Button>

                  <Button 
                    variant="outline" 
                    className="flex items-center justify-between h-auto p-4 border-sky-200 hover:bg-sky-50"
                    onClick={() => {
                      window.open('https://twitter.com/supplychain_ke', '_blank');
                      awardSocialFollowPoints('Twitter');
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <Twitter className="h-5 w-5 text-[#1DA1F2]" />
                      <span className="font-medium text-[#1DA1F2]">Follow Twitter</span>
                    </div>
                    <Badge className="bg-[#1DA1F2]">+5 pts</Badge>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${
                        transaction.transaction_type === 'earn' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                      }`}>
                        {transaction.transaction_type === 'earn' ? '+' : '-'}
                      </div>
                      <div>
                        <p className="font-medium">{transaction.description}</p>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(transaction.created_at)}
                        </p>
                      </div>
                    </div>
                    <div className={`font-bold ${
                      transaction.transaction_type === 'earn' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.transaction_type === 'earn' ? '+' : '-'}{Math.abs(transaction.points)} pts
                    </div>
                  </div>
                ))}
                {transactions.length === 0 && (
                  <p className="text-center text-muted-foreground py-4">No transactions yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {achievements.map((achievement) => (
              <Card key={achievement.id}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-yellow-100 text-yellow-600">
                      <Trophy className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{achievement.achievement_type.replace('_', ' ').toUpperCase()}</p>
                      <p className="text-sm text-muted-foreground">{formatDate(achievement.created_at)}</p>
                    </div>
                    <Badge className="flex items-center gap-1">
                      <CreditCard className="h-3 w-3" />
                      +{achievement.points_awarded}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
            {achievements.length === 0 && (
              <Card className="md:col-span-2">
                <CardContent className="p-6">
                  <p className="text-center text-muted-foreground">No achievements yet. Keep using the platform to earn achievements!</p>
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
