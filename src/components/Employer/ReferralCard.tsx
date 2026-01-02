import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link2, Copy, CheckCircle2, TrendingUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ReferralStats {
  affiliateCode: string;
  totalSignups: number;
  totalSales: number;
  pendingPayouts: number;
  tier: string;
}

export function ReferralCard({ userId }: { userId: string }) {
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReferralStats();
  }, [userId]);

  const loadReferralStats = async () => {
    try {
      const { data, error } = await supabase
        .from('affiliate_programs')
        .select('affiliate_code, pending_payouts, tier')
        .eq('user_id', userId)
        .single();

      if (error) {
        // User doesn't have affiliate program yet
        if (error.code === 'PGRST116') {
          await createAffiliateProgram();
          return;
        }
        throw error;
      }

      if (data) {
        // Get referral stats
        const { data: referrals } = await supabase
          .from('affiliate_referrals')
          .select('referral_status')
          .eq('affiliate_id', data.affiliate_code);

        const signups = referrals?.filter(r => r.referral_status === 'signed_up').length || 0;
        const sales = referrals?.filter(r => r.referral_status === 'converted_paid').length || 0;

        setStats({
          affiliateCode: data.affiliate_code,
          totalSignups: signups,
          totalSales: sales,
          pendingPayouts: data.pending_payouts || 0,
          tier: data.tier || 'silver'
        });
      }
    } catch (err: any) {
      console.error('Error loading referral stats:', err);
      toast.error('Failed to load referral stats');
    } finally {
      setLoading(false);
    }
  };

  const createAffiliateProgram = async () => {
    try {
      const { data, error } = await supabase
        .from('affiliate_programs')
        .insert({
          user_id: userId,
          status: 'pending' // Will be approved by admin
        })
        .select()
        .single();

      if (error) throw error;

      toast.success('Affiliate program created! Awaiting admin approval.');
      loadReferralStats();
    } catch (err: any) {
      console.error('Error creating affiliate program:', err);
      toast.error('Failed to create affiliate program');
    }
  };

  const copyReferralLink = () => {
    if (!stats) return;
    
    const link = `${window.location.origin}?ref=${stats.affiliateCode}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    toast.success('Referral link copied!');
    
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link2 className="h-5 w-5" />
            Referral Program
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!stats) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link2 className="h-5 w-5" />
            Referral Program
          </CardTitle>
          <CardDescription>Earn commissions by referring companies</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={createAffiliateProgram}>
            Join Referral Program
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Link2 className="h-5 w-5 text-purple-600" />
            Referral Program
          </CardTitle>
          <Badge variant="outline" className="capitalize">
            {stats.tier} Tier
          </Badge>
        </div>
        <CardDescription>Share your link and earn commissions</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Referral Link */}
        <div className="flex gap-2">
          <input
            type="text"
            readOnly
            value={`${window.location.origin}?ref=${stats.affiliateCode}`}
            className="flex-1 px-3 py-2 border rounded-md bg-gray-50 text-sm"
          />
          <Button
            size="sm"
            variant={copied ? 'default' : 'outline'}
            onClick={copyReferralLink}
          >
            {copied ? (
              <>
                <CheckCircle2 className="h-4 w-4 mr-1" />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-1" />
                Copy
              </>
            )}
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.totalSignups}</div>
            <div className="text-xs text-muted-foreground">Signups</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{stats.totalSales}</div>
            <div className="text-xs text-muted-foreground">Sales</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              KES {stats.pendingPayouts.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">Pending</div>
          </div>
        </div>

        {/* Commission Info */}
        <div className="flex items-center gap-2 p-3 bg-purple-50 rounded-md">
          <TrendingUp className="h-4 w-4 text-purple-600" />
          <span className="text-sm text-purple-900">
            Earn {stats.tier === 'platinum' ? '18%' : stats.tier === 'gold' ? '15%' : '10%'} commission on referrals
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
