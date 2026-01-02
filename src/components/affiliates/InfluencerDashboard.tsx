import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Copy, TrendingUp, Users, Wallet, Trophy, Star, Crown } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function InfluencerDashboard() {
  const [loading, setLoading] = useState(true);
  const [program, setProgram] = useState<any>(null);
  const [stats, setStats] = useState({ clicks: 0, signups: 0, sales: 0 });

  useEffect(() => {
    fetchAffiliateData();
  }, []);

  const fetchAffiliateData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // 1. Get Program Details
      const { data: prog, error } = await supabase
        .from('affiliate_programs')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      setProgram(prog);

      if (prog) {
          // 2. Get Real Stats (Counts)
          const { count: clicks } = await supabase.from('affiliate_referrals').select('id', { count: 'exact', head: true }).eq('affiliate_id', prog.id).eq('referral_status', 'clicked');
          const { count: signups } = await supabase.from('affiliate_referrals').select('id', { count: 'exact', head: true }).eq('affiliate_id', prog.id).eq('referral_status', 'signed_up');
          const { count: sales } = await supabase.from('affiliate_referrals').select('id', { count: 'exact', head: true }).eq('affiliate_id', prog.id).eq('referral_status', 'converted_paid');
          
          setStats({ clicks: clicks || 0, signups: signups || 0, sales: sales || 0 });
      }
    } catch (err: any) {
      console.error("Affiliate Load Error:", err);
      toast.error("Could not load your partnership data.");
    } finally {
      setLoading(false);
    }
  };

  const copyLink = () => {
    if (!program) return;
    const link = `${window.location.origin}/?ref=${program.affiliate_code}`;
    navigator.clipboard.writeText(link);
    toast.success("Partnership Link Copied!");
  };

  const joinProgram = async () => {
      setLoading(true);
      try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) throw new Error("Please login first");

          // Auto-generate code based on name or random
          const code = `PARTNER-${Math.floor(1000 + Math.random() * 9000)}`;

          const { error } = await supabase.from('affiliate_programs').insert({
              user_id: user.id,
              affiliate_code: code,
              commission_rate: 10, // Start at Silver
              tier: 'silver',
              status: 'active' // Auto-active for now, or pending if preferred
          });

          if (error) throw error;
          toast.success("Welcome, Partner! You are now active.");
          fetchAffiliateData();

      } catch (err: any) {
          toast.error(err.message || "Failed to join program");
      } finally {
          setLoading(false);
      }
  };

  if (loading) return <div className="p-8 text-center animate-pulse">Loading Growth Data...</div>;

  if (!program) {
      return (
          <div className="max-w-4xl mx-auto p-6">
            <Card className="bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 text-white border-none shadow-2xl">
                <CardHeader className="text-center pb-8">
                    <Trophy className="h-16 w-16 mx-auto text-yellow-400 mb-4" />
                    <CardTitle className="text-4xl font-bold mb-2">Become a Growth Partner</CardTitle>
                    <CardDescription className="text-indigo-200 text-lg">
                        Join Kenya's premier Supply Chain Network and earn sustainable income.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-3 gap-4 text-center">
                        <div className="p-4 bg-white/10 rounded-xl backdrop-blur-sm">
                            <h3 className="text-xl font-bold text-yellow-400 mb-1">Silver</h3>
                            <p className="text-2xl font-bold">10%</p>
                            <p className="text-sm opacity-70">Commission</p>
                        </div>
                        <div className="p-4 bg-white/10 rounded-xl backdrop-blur-sm border border-yellow-500/30">
                            <h3 className="text-xl font-bold text-yellow-400 mb-1">Gold</h3>
                            <p className="text-2xl font-bold">15%</p>
                            <p className="text-sm opacity-70">Commission</p>
                        </div>
                        <div className="p-4 bg-white/10 rounded-xl backdrop-blur-sm">
                            <h3 className="text-xl font-bold text-yellow-400 mb-1">Platinum</h3>
                            <p className="text-2xl font-bold">18%</p>
                            <p className="text-sm opacity-70">Commission</p>
                        </div>
                    </div>
                    <Button onClick={joinProgram} size="lg" className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-lg h-14 shadow-lg shadow-yellow-500/20">
                        Activate Partner Account
                    </Button>
                </CardContent>
            </Card>
          </div>
      );
  }

  // TIER LOGIC
  const tierConfig = {
      silver: { icon: Star, color: "text-slate-400", next: "gold", threshold: 10, current: stats.sales },
      gold: { icon: Trophy, color: "text-yellow-400", next: "platinum", threshold: 50, current: stats.sales },
      platinum: { icon: Crown, color: "text-purple-400", next: null, threshold: 100, current: stats.sales }
  };
  
  const currentTier = tierConfig[program.tier as keyof typeof tierConfig] || tierConfig.silver;
  const progressPercent = currentTier.next ? Math.min((stats.sales / currentTier.threshold) * 100, 100) : 100;

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      {/* HEADER CARD */}
      <Card className="bg-gradient-to-r from-slate-900 to-slate-800 text-white border-slate-700">
          <CardContent className="p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2 text-center md:text-left">
                  <Badge variant="outline" className={`mb-2 px-3 py-1 ${currentTier.color} border-current uppercase tracking-wider`}>
                      {program.tier} Partner
                  </Badge>
                  <h1 className="text-3xl font-bold">Welcome back, Partner</h1>
                  <p className="text-slate-300">Your unique growth link is active.</p>
              </div>
              
              <div className="flex flex-col gap-2 w-full md:w-auto min-w-[300px]">
                  <div className="flex items-center gap-2 bg-white/10 p-2 rounded-lg border border-white/20">
                      <code className="flex-1 font-mono text-sm text-center">
                          supplychain.ke/?ref={program.affiliate_code}
                      </code>
                      <Button size="icon" variant="secondary" className="h-8 w-8" onClick={copyLink}>
                          <Copy className="h-4 w-4" />
                      </Button>
                  </div>
                  <p className="text-xs text-center text-slate-400">Share this link to earn {program.commission_rate}% on every sale.</p>
              </div>
          </CardContent>
      </Card>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                  <div className="text-2xl font-bold">{stats.clicks}</div>
                  <p className="text-xs text-muted-foreground">Potential leads</p>
              </CardContent>
          </Card>
          <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Successful Sales</CardTitle>
                  <TrendingUp className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                  <div className="text-2xl font-bold">{stats.sales}</div>
                  <p className="text-xs text-muted-foreground text-green-600">Verified purchases</p>
              </CardContent>
          </Card>
          <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Earnings Owed</CardTitle>
                  <Wallet className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                  <div className="text-2xl font-bold text-blue-600">KES {program.pending_payouts || 0}</div>
                  <p className="text-xs text-muted-foreground">Payouts processed weekly</p>
              </CardContent>
          </Card>
      </div>

      {/* TIER PROGRESS */}
      {currentTier.next && (
          <Card className="border-yellow-100 bg-yellow-50/50">
              <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                      <Trophy className="h-5 w-5 text-yellow-600" />
                      Path to {currentTier.next.toUpperCase()}
                  </CardTitle>
                  <CardDescription>
                      Reach {currentTier.threshold} sales to unlock {
                          currentTier.next === 'gold' ? '15%' : '18%'
                      } commission!
                  </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                  <div className="flex justify-between text-sm font-medium mb-1">
                      <span>{stats.sales} sales</span>
                      <span>Goal: {currentTier.threshold}</span>
                  </div>
                  <Progress value={progressPercent} className="h-3" />
                  <p className="text-xs text-muted-foreground pt-2">
                      You are doing great! Just {currentTier.threshold - stats.sales} more sales to level up.
                  </p>
              </CardContent>
          </Card>
      )}

      {/* RECENT ACTIVITY (Placeholder for future list) */}
      <Alert>
          <AlertTitle>Growth Tip</AlertTitle>
          <AlertDescription>
              Partners who share their link on LinkedIn typically see 3x more conversions. Try posting about a specific course!
          </AlertDescription>
      </Alert>
    </div>
  );
}
