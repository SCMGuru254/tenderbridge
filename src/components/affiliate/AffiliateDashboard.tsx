
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Copy, DollarSign, Users, Clock } from 'lucide-react';
import { useAffiliate } from '@/hooks/useAffiliate';
import { toast } from '@/components/ui/use-toast';

export const AffiliateDashboard = () => {
  const { affiliateProgram, referrals, payouts, requestPayout, loading } = useAffiliate();

  const copyReferralLink = () => {
    if (affiliateProgram?.referral_link) {
      navigator.clipboard.writeText(affiliateProgram.referral_link);
      toast({
        title: "Copied!",
        description: "Referral link copied to clipboard",
      });
    }
  };

  const handlePayoutRequest = () => {
    if (affiliateProgram && affiliateProgram.pending_payouts >= 50) {
      requestPayout(affiliateProgram.pending_payouts, { method: 'paypal' });
    }
  };

  if (!affiliateProgram) return null;

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm font-medium">Total Earnings</p>
                <p className="text-2xl font-bold">${affiliateProgram.total_earnings}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-yellow-600" />
              <div>
                <p className="text-sm font-medium">Pending</p>
                <p className="text-2xl font-bold">${affiliateProgram.pending_payouts}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm font-medium">Paid Out</p>
                <p className="text-2xl font-bold">${affiliateProgram.total_paid_out}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-purple-600" />
              <div>
                <p className="text-sm font-medium">Referrals</p>
                <p className="text-2xl font-bold">{referrals.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Referral Link */}
      <Card>
        <CardHeader>
          <CardTitle>Your Referral Link</CardTitle>
          <CardDescription>Share this link to earn commissions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <Input 
              value={affiliateProgram.referral_link} 
              readOnly 
              className="flex-1"
            />
            <Button onClick={copyReferralLink} variant="outline">
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex space-x-2">
            <Badge variant="outline">Code: {affiliateProgram.affiliate_code}</Badge>
            <Badge variant="outline">Rate: {affiliateProgram.commission_rate}%</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Payout Request */}
      <Card>
        <CardHeader>
          <CardTitle>Request Payout</CardTitle>
          <CardDescription>Minimum payout amount is $50</CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={handlePayoutRequest}
            disabled={affiliateProgram.pending_payouts < 50 || loading}
            className="w-full md:w-auto"
          >
            Request Payout (${affiliateProgram.pending_payouts})
          </Button>
          {affiliateProgram.pending_payouts < 50 && (
            <p className="text-sm text-muted-foreground mt-2">
              You need ${(50 - affiliateProgram.pending_payouts).toFixed(2)} more to request a payout
            </p>
          )}
        </CardContent>
      </Card>

      {/* Recent Referrals */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Referrals</CardTitle>
        </CardHeader>
        <CardContent>
          {referrals.length === 0 ? (
            <p className="text-muted-foreground">No referrals yet. Start sharing your link!</p>
          ) : (
            <div className="space-y-2">
              {referrals.slice(0, 5).map((referral) => (
                <div key={referral.id} className="flex justify-between items-center p-2 border rounded">
                  <div>
                    <p className="font-medium">{referral.referral_type}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(referral.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge variant={
                      referral.status === 'converted' ? 'default' : 
                      referral.status === 'paid' ? 'secondary' : 'outline'
                    }>
                      {referral.status}
                    </Badge>
                    {referral.commission_earned && (
                      <p className="text-sm font-medium">${referral.commission_earned}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
