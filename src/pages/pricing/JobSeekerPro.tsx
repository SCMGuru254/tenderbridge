import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Star, Zap, Eye, BadgeCheck, ArrowLeft, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { PaymentModal } from '@/components/payments/PaymentModal';
import { toast } from 'sonner';

const JobSeekerProPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [processing, setProcessing] = useState(false);

  const PRICE_KES = 500;

  const handlePaymentSuccess = async (_reference: string) => {
    setProcessing(true);
    try {
      // The Paystack webhook will handle the actual membership creation
      // We just show success here
      toast.success('Pro membership activated! Enjoy your premium benefits.');
      setPaymentOpen(false);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error processing membership:', error);
      toast.error('Payment received but there was an issue activating. Please contact support.');
    } finally {
      setProcessing(false);
    }
  };

  const features = [
    {
      icon: Eye,
      title: 'Early Job Access',
      description: 'See new jobs 24-48 hours before they go public'
    },
    {
      icon: BadgeCheck,
      title: 'Verified Badge',
      description: 'Stand out to employers with a Pro verified profile'
    },
    {
      icon: Star,
      title: 'Priority Application',
      description: 'Your applications appear at the top of the stack'
    },
    {
      icon: Zap,
      title: 'AI Resume Review',
      description: 'Get unlimited ATS analysis and optimization tips'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Button 
        variant="ghost" 
        onClick={() => navigate(-1)}
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <div className="text-center mb-8">
        <Badge className="mb-4 bg-primary">
          Job Seeker Pro
        </Badge>
        <h1 className="text-4xl font-bold mb-4">
          Supercharge Your Job Search
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Get ahead of the competition with early access, priority applications, and premium tools.
        </p>
      </div>

      {/* Pricing Card */}
      <Card className="border-2 border-primary shadow-xl mb-8">
        <CardHeader className="text-center pb-2">
          <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground mx-auto mb-4">
            <Star className="h-8 w-8" />
          </div>
          <CardTitle className="text-3xl">Pro Membership</CardTitle>
          <CardDescription>1 Year of Premium Benefits</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className="text-5xl font-bold text-primary">
              KES {PRICE_KES.toLocaleString()}
            </div>
            <p className="text-muted-foreground mt-2">
              Less than KES 42/month • One-time annual payment
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <div key={index} className="flex gap-3 p-3 bg-muted/50 rounded-lg">
                <div className="flex-shrink-0">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">{feature.title}</h4>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold">Also includes:</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {[
                'Exclusive job alerts',
                'Profile highlight in search',
                'Direct recruiter messages',
                'Interview prep materials',
                'Salary insights access',
                'Priority support'
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <Button 
            size="lg" 
            className="w-full text-lg py-6 bg-primary hover:bg-primary/90"
            onClick={() => {
              if (!user) {
                toast.info('Please sign in to purchase Pro membership');
                navigate('/auth?redirect=/pricing/jobseeker-pro');
                return;
              }
              setPaymentOpen(true);
            }}
            disabled={processing}
          >
            {processing ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Star className="mr-2 h-5 w-5" />
                Get Pro for KES {PRICE_KES.toLocaleString()}/year
              </>
            )}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            🔒 Secure payment via M-Pesa or Card • Cancel anytime
          </p>
        </CardContent>
      </Card>

      {/* FAQ Section */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-center mb-4">Frequently Asked Questions</h3>
        
        <div className="grid gap-4">
          <Card>
            <CardContent className="pt-4">
              <h4 className="font-medium">How long does my Pro membership last?</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Your Pro membership is valid for 1 year from the date of purchase.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-4">
              <h4 className="font-medium">Can I use reward points instead?</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Yes! You can redeem 500 points for a 1-year Pro membership. Visit the Rewards page to check your balance.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-4">
              <h4 className="font-medium">What payment methods are accepted?</h4>
              <p className="text-sm text-muted-foreground mt-1">
                We accept M-Pesa and all major debit/credit cards through Paystack.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        open={paymentOpen}
        onOpenChange={setPaymentOpen}
        amount={PRICE_KES}
        purpose="jobseeker_pro"
        onSuccess={handlePaymentSuccess}
        metadata={{
          plan: 'jobseeker_pro',
          duration: '1_year'
        }}
      />
    </div>
  );
};

export default JobSeekerProPage;