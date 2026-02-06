import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, CreditCard, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { usePlatformSettings } from '@/hooks/usePlatformSettings';

interface PaystackPaymentProps {
  amount: number; // in KES
  email?: string;
  purpose: string;
  onSuccess?: (reference: string) => void;
  onCancel?: () => void;
  metadata?: Record<string, unknown>;
}

declare global {
  interface Window {
    PaystackPop: {
      setup: (config: {
        key: string;
        email: string;
        amount: number;
        currency: string;
        ref: string;
        metadata?: Record<string, unknown>;
        callback: (response: { reference: string }) => void;
        onClose: () => void;
      }) => { openIframe: () => void };
    };
  }
}

export const PaystackPayment = ({ 
  amount, 
  email: propEmail,
  purpose, 
  onSuccess, 
  onCancel,
  metadata = {}
}: PaystackPaymentProps) => {
  const { user } = useAuth();
  const { settings } = usePlatformSettings();
  const [email, setEmail] = useState(propEmail || user?.email || '');
  const [loading, setLoading] = useState(false);

  const paystackConfig = settings.paystack_config;

  const generateReference = () => {
    return `SCKE-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  const initializePayment = async () => {
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    if (!paystackConfig.enabled || !paystackConfig.public_key) {
      toast.error('Paystack payments are not configured. Please use M-Pesa.');
      return;
    }

    setLoading(true);

    try {
      const reference = generateReference();
      
      // Load Paystack script if not already loaded
      if (!window.PaystackPop) {
        const script = document.createElement('script');
        script.src = 'https://js.paystack.co/v1/inline.js';
        script.async = true;
        document.body.appendChild(script);
        
        await new Promise((resolve, reject) => {
          script.onload = resolve;
          script.onerror = reject;
        });
      }

      const handler = window.PaystackPop.setup({
        key: paystackConfig.public_key,
        email: email,
        amount: amount * 100, // Paystack expects amount in kobo/cents
        currency: 'KES',
        ref: reference,
        metadata: {
          purpose,
          user_id: user?.id,
          ...metadata
        },
        // Use deep link for mobile, normal URL for web
        callback_url: window.location.protocol === 'file:' || window.location.protocol === 'capacitor:' 
          ? 'supplychainke://app/payment/success' 
          : `${window.location.origin}/payment/success`,
        callback: async (response: { reference: string }) => {
          // This callback is called when the popup closes or payment is successful inside iframe
          // For mobile fallback/redirection flow, the callback_url handles it
          
          // Payment successful (if handled via iframe/popup)
          try {
            await supabase.from('paystack_transactions').insert({
              user_id: user?.id,
              reference: response.reference,
              amount: amount,
              currency: 'KES',
              status: 'success',
              payment_purpose: purpose,
              metadata: { ...metadata, email }
            });

            toast.success('Payment successful!');
            onSuccess?.(response.reference);
          } catch (error) {
            console.error('Error recording transaction:', error);
          }
        },
        onClose: () => {
          setLoading(false);
          toast.info('Payment cancelled');
          onCancel?.();
        }
      } as any);

      handler.openIframe();
    } catch (error) {
      console.error('Paystack initialization error:', error);
      toast.error('Failed to initialize payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!paystackConfig.enabled) {
    return (
      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="pt-6 text-center">
          <CreditCard className="h-12 w-12 text-amber-600 mx-auto mb-3" />
          <p className="text-amber-800">
            Card payments are not currently available. Please use M-Pesa.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-blue-600" />
          Card Payment
        </CardTitle>
        <CardDescription>
          Pay securely with your debit or credit card
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Amount Display */}
        <div className="bg-primary/10 p-4 rounded-lg text-center">
          <p className="text-sm text-muted-foreground">Amount to Pay</p>
          <p className="text-3xl font-bold text-primary">KES {amount.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground mt-1">{purpose}</p>
        </div>

        {/* Email Input */}
        <div className="space-y-2">
          <Label htmlFor="email">Email Address *</Label>
          <Input
            id="email"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <p className="text-xs text-muted-foreground">
            Payment receipt will be sent to this email
          </p>
        </div>

        {/* Security Badge */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted p-3 rounded-lg">
          <Shield className="h-4 w-4 text-green-600" />
          <span>Secured by Paystack. Your card details are encrypted.</span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          {onCancel && (
            <Button 
              type="button" 
              variant="outline" 
              className="flex-1"
              onClick={onCancel}
            >
              Cancel
            </Button>
          )}
          <Button 
            className="flex-1"
            onClick={initializePayment}
            disabled={loading || !email}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CreditCard className="mr-2 h-4 w-4" />
                Pay KES {amount.toLocaleString()}
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
