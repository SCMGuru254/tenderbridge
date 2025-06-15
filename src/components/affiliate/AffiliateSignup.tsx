
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DollarSign, Users, TrendingUp } from 'lucide-react';
import { useAffiliate } from '@/hooks/useAffiliate';

export const AffiliateSignup = () => {
  const { createAffiliateProgram, loading } = useAffiliate();

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Join Our Affiliate Program</CardTitle>
        <CardDescription>
          Earn 10% commission on every successful referral
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <DollarSign className="h-8 w-8 mx-auto mb-2 text-green-600" />
            <h3 className="font-semibold">10% Commission</h3>
            <p className="text-sm text-muted-foreground">On client's first payment</p>
          </div>
          <div className="text-center">
            <Users className="h-8 w-8 mx-auto mb-2 text-blue-600" />
            <h3 className="font-semibold">Multiple Referral Types</h3>
            <p className="text-sm text-muted-foreground">Clients, providers, advertisers</p>
          </div>
          <div className="text-center">
            <TrendingUp className="h-8 w-8 mx-auto mb-2 text-purple-600" />
            <h3 className="font-semibold">Real-time Tracking</h3>
            <p className="text-sm text-muted-foreground">Monitor your earnings</p>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-semibold">How it works:</h4>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Sign up for the affiliate program</li>
            <li>Get your unique referral link</li>
            <li>Share with potential clients or providers</li>
            <li>Earn commission when they make their first payment</li>
            <li>Request payouts when you reach $50 minimum</li>
          </ol>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">$50 minimum payout</Badge>
          <Badge variant="secondary">PayPal payments</Badge>
          <Badge variant="secondary">Real-time analytics</Badge>
        </div>

        <Button 
          onClick={createAffiliateProgram} 
          disabled={loading}
          className="w-full"
          size="lg"
        >
          {loading ? 'Creating Program...' : 'Join Affiliate Program'}
        </Button>
      </CardContent>
    </Card>
  );
};
