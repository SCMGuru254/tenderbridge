
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, DollarSign, Users, TrendingUp } from 'lucide-react';
import { useAffiliate } from '@/hooks/useAffiliate';
import { toast } from '@/components/ui/use-toast';

export const AffiliateDashboard = () => {
  const { affiliateProgram, referrals, loading } = useAffiliate();

  const copyReferralLink = () => {
    if (affiliateProgram?.referral_link) {
      navigator.clipboard.writeText(affiliateProgram.referral_link);
      toast({
        title: "Copied!",
        description: "Referral link copied to clipboard",
      });
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (!affiliateProgram) {
    return <div>No affiliate program found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${affiliateProgram.total_earnings}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payouts</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${affiliateProgram.pending_payouts}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Referrals</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{referrals?.length || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Commission Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{affiliateProgram.commission_rate}%</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Referral Link</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <code className="flex-1 p-2 bg-muted rounded text-sm">
              {affiliateProgram.referral_link}
            </code>
            <Button onClick={copyReferralLink} variant="outline" size="sm">
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex gap-2">
            <Badge variant="secondary">Code: {affiliateProgram.affiliate_code}</Badge>
            <Badge variant={affiliateProgram.status === 'active' ? 'default' : 'secondary'}>
              {affiliateProgram.status}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
