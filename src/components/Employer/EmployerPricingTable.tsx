import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Zap, Star, Clock, Gift, Crown } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContextFull';
import { toast } from 'sonner';

interface FreeJobClaim {
  id: string;
  status: 'pending' | 'approved' | 'rejected' | 'used';
  claimed_at: string;
  approved_at: string | null;
}

export function EmployerPricingTable() {
  const { user } = useAuth();
  const [freeJobClaim, setFreeJobClaim] = useState<FreeJobClaim | null>(null);
  const [claiming, setClaiming] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadFreeJobClaim();
    }
  }, [user]);

  const loadFreeJobClaim = async () => {
    try {
      const { data, error } = await supabase
        .from('free_job_claims')
        .select('*')
        .eq('user_id', user?.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;
      setFreeJobClaim(data);
    } catch (error) {
      console.error('Error loading free job claim:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClaimFreeJob = async () => {
    if (!user) {
      toast.error('Please sign in to claim your free job post');
      return;
    }

    try {
      setClaiming(true);
      const { error } = await supabase
        .from('free_job_claims')
        .insert({
          user_id: user.id,
          status: 'pending'
        });

      if (error) throw error;
      toast.success('Free job claim submitted! Admin will review shortly.');
      loadFreeJobClaim();
    } catch (error: any) {
      console.error('Error claiming free job:', error);
      if (error.code === '23505') {
        toast.error('You have already claimed your free job');
      } else {
        toast.error('Failed to claim free job');
      }
    } finally {
      setClaiming(false);
    }
  };

  const getClaimStatusBadge = () => {
    if (!freeJobClaim) return null;
    switch (freeJobClaim.status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300">Pending Review</Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">Approved - Ready to Use</Badge>;
      case 'used':
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-300">Already Used</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-300">Rejected</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-slate-900 mb-4">Job Posting & Boosting Packages</h2>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Post jobs for free or boost your listings to attract more qualified candidates. 
          Stop wasting time calling 10 people — post once, get many quality applicants.
        </p>
      </div>

      {/* Free Option - Highlighted */}
      <Card className="border-4 border-green-500 bg-gradient-to-br from-green-50 to-emerald-50 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 bg-green-500 text-white px-4 py-2 text-sm font-bold rounded-bl-lg">
          🟢 FREE FOREVER
        </div>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-green-500 flex items-center justify-center text-white">
              <Gift className="h-7 w-7" />
            </div>
            <div>
              <CardTitle className="text-2xl text-green-800">Free Job Posting</CardTitle>
              <CardDescription className="text-green-700 font-medium">For every employer - no risk, no cost</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-4xl font-bold text-green-600">
            KES 0
            <span className="text-sm font-normal text-green-700 ml-2">Forever Free</span>
          </div>
          
          <div className="grid md:grid-cols-2 gap-3">
            {[
              'Job appears in search (not buried)',
              'Stays visible for 30 days',
              'Basic analytics (views, applicants)',
              'Shortlist & contact tools',
              'No expiry for applicants',
              'Mobile-friendly posting form'
            ].map((feature, index) => (
              <div key={index} className="flex items-center gap-2 text-green-800">
                <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-green-200">
            <p className="text-sm text-green-700 mb-4 italic">
              👉 "Post your first job free — no risk, no cost."
            </p>
            
            {!loading && (
              <>
                {!freeJobClaim ? (
                  <Button 
                    onClick={handleClaimFreeJob}
                    disabled={claiming}
                    className="w-full bg-green-600 hover:bg-green-700 text-lg py-6"
                  >
                    {claiming ? 'Claiming...' : 'Claim Your Free Job Post'}
                  </Button>
                ) : (
                  <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-green-200">
                    <span className="font-medium text-green-800">Free Job Claim Status:</span>
                    {getClaimStatusBadge()}
                  </div>
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Boost Options Header */}
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">💡 Boost Options (for more applicants)</h3>
        <p className="text-slate-600">Only pay if you want more visibility — completely optional</p>
      </div>

      {/* Paid Packages Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Standard Boost */}
        <Card className="border-2 border-blue-200 hover:border-blue-400 transition-all hover:shadow-lg">
          <CardHeader>
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white mb-3">
              <Zap className="h-6 w-6" />
            </div>
            <CardTitle className="text-xl">Standard Boost</CardTitle>
            <CardDescription>Perfect for single job posts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-3xl font-bold text-blue-600">
              KES 200
              <span className="text-sm font-normal text-slate-500 ml-2">(~$2)</span>
            </div>
            
            <div className="space-y-2">
              {[
                '1 job posting (30 days visibility)',
                '7-day boost (higher in search)',
                '"Featured" badge for 7 days',
                'More views, more applicants'
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-blue-600" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            <p className="text-xs text-slate-500 italic pt-2 border-t">
              👉 "For less than a soda, get more applicants."
            </p>

            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              Select Standard
            </Button>
          </CardContent>
        </Card>

        {/* Pro Boost - Popular */}
        <Card className="border-2 border-purple-500 shadow-xl relative transform hover:scale-105 transition-all">
          <div className="absolute top-0 right-0 bg-purple-500 text-white px-3 py-1 text-xs font-bold rounded-bl-lg">
            POPULAR
          </div>
          <CardHeader>
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white mb-3">
              <Star className="h-6 w-6" />
            </div>
            <CardTitle className="text-xl">Pro Boost</CardTitle>
            <CardDescription>Great for regular hiring</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-3xl font-bold text-purple-600">
              KES 500
              <span className="text-sm font-normal text-slate-500 ml-2">(~$5)</span>
            </div>
            <Badge variant="outline" className="text-purple-600 border-purple-300">
              Only KES 100 per job!
            </Badge>
            
            <div className="space-y-2">
              {[
                '5 job postings (each 30 days)',
                'Each job gets 7-day boost',
                '"Featured" badge per job',
                'Great for shops, farms, schools'
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-purple-600" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            <p className="text-xs text-slate-500 italic pt-2 border-t">
              👉 "Only KES 100 per job — perfect for regular hiring."
            </p>

            <Button className="w-full bg-purple-600 hover:bg-purple-700">
              Select Pro
            </Button>
          </CardContent>
        </Card>

        {/* Ultimate Boost */}
        <Card className="border-2 border-orange-200 hover:border-orange-400 transition-all hover:shadow-lg bg-gradient-to-br from-orange-50 to-amber-50">
          <CardHeader>
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white mb-3">
              <Crown className="h-6 w-6" />
            </div>
            <CardTitle className="text-xl">Ultimate Boost</CardTitle>
            <CardDescription>For serious employers</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-3xl font-bold text-orange-600">
              KES 2,500
              <span className="text-sm font-normal text-slate-500 ml-2">(~$25)</span>
            </div>
            <Badge className="bg-orange-500 hover:bg-orange-600">
              Lifetime Visibility
            </Badge>
            
            <div className="space-y-2">
              {[
                '5 job postings (each 30 days)',
                'Lifelong boost (always at top)',
                'Permanent "Featured" badge',
                'Ideal for big SMEs, factories'
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-orange-600" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            <p className="text-xs text-slate-500 italic pt-2 border-t">
              👉 "One-time fee, lifelong visibility — always seen as a top employer."
            </p>

            <Button className="w-full bg-orange-600 hover:bg-orange-700">
              Select Ultimate
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Urgent Add-on */}
      <Card className="border border-red-200 bg-red-50">
        <CardContent className="py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center text-white">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-semibold text-red-800">Urgent Add-on</h4>
                <p className="text-sm text-red-700">Appears in "Urgent Jobs" for 48 hours</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-2xl font-bold text-red-600">+KES 50</span>
              <Button variant="outline" className="border-red-300 text-red-700 hover:bg-red-100">
                Add to Any Package
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Growth Hooks */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
          <CardContent className="py-4 flex items-center gap-4">
            <Gift className="h-8 w-8 text-blue-600" />
            <div>
              <h4 className="font-semibold text-blue-800">Free Boost with First Package</h4>
              <p className="text-sm text-blue-700">Buy any boost package and get 1 extra job free with 7-day boost.</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardContent className="py-4 flex items-center gap-4">
            <Users className="h-8 w-8 text-green-600" />
            <div>
              <h4 className="font-semibold text-green-800">Bulk Discount Available</h4>
              <p className="text-sm text-green-700">Need more than 5 jobs? Contact us for custom packages (KES 100-200 per job).</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Why Choose Us */}
      <div className="bg-slate-100 rounded-xl p-6">
        <h4 className="font-bold text-slate-800 mb-4 text-center">Why Employers Choose SupplyChain_KE</h4>
        <div className="grid md:grid-cols-4 gap-4 text-center">
          {[
            { text: 'More visibility = more applicants = faster hiring', icon: '📈' },
            { text: 'Free to post, small fee to boost', icon: '💰' },
            { text: 'Perfect for small shops to big companies', icon: '🏭' },
            { text: 'Mobile-friendly, works on cheap Android phones', icon: '📱' }
          ].map((item, index) => (
            <div key={index} className="p-3">
              <div className="text-2xl mb-2">{item.icon}</div>
              <p className="text-sm text-slate-700">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Import Users icon
import { Users } from 'lucide-react';
