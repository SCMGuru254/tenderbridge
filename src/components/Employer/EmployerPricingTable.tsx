import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Zap, Star, Clock, Gift, Crown, Users, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContextFull';
import { toast } from 'sonner';
import { PaymentModal } from '@/components/payments/PaymentModal';

interface FreeJobClaim {
  id: string;
  status: 'pending' | 'approved' | 'rejected' | 'used';
  claimed_at: string;
  approved_at: string | null;
}

interface BoostPackage {
  name: string;
  price: number;
  purpose: string;
  features: string[];
  icon: React.ReactNode;
  color: string;
  popular?: boolean;
}

export function EmployerPricingTable() {
  const { user } = useAuth();
  const [freeJobClaim, setFreeJobClaim] = useState<FreeJobClaim | null>(null);
  const [claiming, setClaiming] = useState(false);
  const [loading, setLoading] = useState(true);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<BoostPackage | null>(null);

  const boostPackages: BoostPackage[] = [
    {
      name: 'Standard Boost',
      price: 200,
      purpose: 'job_boost_standard',
      features: [
        '1 job posting (30 days visibility)',
        '7-day boost (higher in search)',
        '"Featured" badge for 7 days',
        'More views, more applicants'
      ],
      icon: <Zap className="h-6 w-6" />,
      color: 'blue'
    },
    {
      name: 'Pro Boost',
      price: 500,
      purpose: 'job_boost_pro',
      features: [
        '5 job postings (each 30 days)',
        'Each job gets 7-day boost',
        '"Featured" badge per job',
        'Great for shops, farms, schools'
      ],
      icon: <Star className="h-6 w-6" />,
      color: 'purple',
      popular: true
    },
    {
      name: 'Ultimate Boost',
      price: 2500,
      purpose: 'job_boost_ultimate',
      features: [
        '5 job postings (each 30 days)',
        'Lifelong boost (always at top)',
        'Permanent "Featured" badge',
        'Ideal for big SMEs, factories'
      ],
      icon: <Crown className="h-6 w-6" />,
      color: 'orange'
    }
  ];

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

  const handleSelectPackage = (pkg: BoostPackage) => {
    if (!user) {
      toast.error('Please sign in to purchase a boost package');
      return;
    }
    setSelectedPackage(pkg);
    setPaymentOpen(true);
  };

  const handlePaymentSuccess = (reference: string) => {
    toast.success(`Payment successful! Reference: ${reference}`);
    setPaymentOpen(false);
    setSelectedPackage(null);
  };

  const getClaimStatusBadge = () => {
    if (!freeJobClaim) return null;
    switch (freeJobClaim.status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300">Pending Review</Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">Approved - Ready to Use</Badge>;
      case 'used':
        return <Badge variant="outline" className="bg-muted text-muted-foreground border-muted">Already Used</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/30">Rejected</Badge>;
      default:
        return null;
    }
  };

  const getColorClasses = (color: string) => {
    const defaultColors = {
      bg: 'bg-primary/10',
      text: 'text-primary',
      border: 'border-primary/30 hover:border-primary',
      button: 'bg-primary hover:bg-primary/90'
    };
    const colors: Record<string, typeof defaultColors> = {
      blue: defaultColors,
      purple: {
        bg: 'bg-secondary/20',
        text: 'text-secondary-foreground',
        border: 'border-secondary hover:border-secondary',
        button: 'bg-secondary hover:bg-secondary/90 text-secondary-foreground'
      },
      orange: {
        bg: 'bg-accent/10',
        text: 'text-accent-foreground',
        border: 'border-accent/30 hover:border-accent',
        button: 'bg-accent hover:bg-accent/90'
      }
    };
    return colors[color] ?? defaultColors;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">Job Posting & Boosting Packages</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
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
                    {claiming ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Claiming...
                      </>
                    ) : (
                      'Claim Your Free Job Post'
                    )}
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
        <h3 className="text-2xl font-bold mb-2">💡 Boost Options (for more applicants)</h3>
        <p className="text-muted-foreground">Only pay if you want more visibility — completely optional</p>
      </div>

      {/* Paid Packages Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {boostPackages.map((pkg) => {
          const colorClasses = getColorClasses(pkg.color);
          return (
            <Card 
              key={pkg.name} 
              className={`border-2 ${colorClasses.border} transition-all hover:shadow-lg ${pkg.popular ? 'shadow-xl relative transform hover:scale-105' : ''}`}
            >
              {pkg.popular && (
                <div className="absolute top-0 right-0 bg-accent text-accent-foreground px-3 py-1 text-xs font-bold rounded-bl-lg">
                  POPULAR
                </div>
              )}
              <CardHeader>
                <div className={`w-12 h-12 rounded-full ${colorClasses.bg} flex items-center justify-center ${colorClasses.text} mb-3`}>
                  {pkg.icon}
                </div>
                <CardTitle className="text-xl">{pkg.name}</CardTitle>
                <CardDescription>
                  {pkg.name === 'Standard Boost' && 'Perfect for single job posts'}
                  {pkg.name === 'Pro Boost' && 'Great for regular hiring'}
                  {pkg.name === 'Ultimate Boost' && 'For serious employers'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className={`text-3xl font-bold ${colorClasses.text}`}>
                  KES {pkg.price.toLocaleString()}
                  <span className="text-sm font-normal text-muted-foreground ml-2">
                    (~${Math.round(pkg.price / 100)})
                  </span>
                </div>
                
                {pkg.popular && (
                  <Badge variant="outline" className={colorClasses.text}>
                    Only KES 100 per job!
                  </Badge>
                )}
                
                <div className="space-y-2">
                  {pkg.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <Check className={`h-4 w-4 ${colorClasses.text}`} />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <Button 
                  className={`w-full ${colorClasses.button}`}
                  onClick={() => handleSelectPackage(pkg)}
                >
                  Select {pkg.name.replace(' Boost', '')}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Urgent Add-on */}
      <Card className="border border-destructive/30 bg-destructive/5">
        <CardContent className="py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-destructive flex items-center justify-center text-destructive-foreground">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-semibold text-destructive">Urgent Add-on</h4>
                <p className="text-sm text-muted-foreground">Appears in "Urgent Jobs" for 48 hours</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-2xl font-bold text-destructive">+KES 50</span>
              <Button variant="outline" className="border-destructive/30 text-destructive hover:bg-destructive/10">
                Add to Any Package
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Growth Hooks */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="py-4 flex items-center gap-4">
            <Gift className="h-8 w-8 text-primary" />
            <div>
              <h4 className="font-semibold">Free Boost with First Package</h4>
              <p className="text-sm text-muted-foreground">Buy any boost package and get 1 extra job free with 7-day boost.</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
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
      <div className="bg-muted rounded-xl p-6">
        <h4 className="font-bold mb-4 text-center">Why Employers Choose SupplyChain_KE</h4>
        <div className="grid md:grid-cols-4 gap-4 text-center">
          {[
            { text: 'More visibility = more applicants = faster hiring', icon: '📈' },
            { text: 'Free to post, small fee to boost', icon: '💰' },
            { text: 'Perfect for small shops to big companies', icon: '🏭' },
            { text: 'Mobile-friendly, works on cheap Android phones', icon: '📱' }
          ].map((item, index) => (
            <div key={index} className="p-3">
              <div className="text-2xl mb-2">{item.icon}</div>
              <p className="text-sm text-muted-foreground">{item.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Modal */}
      {selectedPackage && (
        <PaymentModal
          open={paymentOpen}
          onOpenChange={setPaymentOpen}
          amount={selectedPackage.price}
          purpose={selectedPackage.purpose}
          onSuccess={handlePaymentSuccess}
          metadata={{
            package_name: selectedPackage.name,
            package_type: 'job_boost'
          }}
        />
      )}
    </div>
  );
}