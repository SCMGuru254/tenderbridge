import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Loader2, Phone, CheckCircle2, Copy, Info } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { usePlatformSettings } from '@/hooks/usePlatformSettings';

interface MpesaPaymentProps {
  amount: number;
  purpose: string;
  onSuccess?: (transactionId: string) => void;
  onCancel?: () => void;
  metadata?: Record<string, unknown>;
}

export const MpesaPayment = ({ 
  amount, 
  purpose, 
  onSuccess, 
  onCancel,
  metadata = {}
}: MpesaPaymentProps) => {
  const { user } = useAuth();
  const { settings } = usePlatformSettings();
  const [mpesaCode, setMpesaCode] = useState('');
  const [senderName, setSenderName] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const mpesaDetails = settings.mpesa_details;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please login to submit payment');
      return;
    }

    if (!mpesaCode || mpesaCode.length < 8) {
      toast.error('Please enter a valid M-Pesa transaction code');
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('manual_payment_claims')
        .insert({
          user_id: user.id,
          mpesa_code: mpesaCode.toUpperCase().trim(),
          sender_name: senderName.trim() || null,
          amount: amount,
          payment_purpose: purpose,
          status: 'pending',
          metadata: metadata
        })
        .select('id')
        .single();

      if (error) {
        if (error.code === '23505') {
          toast.error('This M-Pesa code has already been submitted');
        } else {
          throw error;
        }
        return;
      }

      setSubmitted(true);
      toast.success('Payment claim submitted! We will verify and process it shortly.');
      
      if (onSuccess && data) {
        onSuccess(data.id);
      }
    } catch (error: unknown) {
      console.error('Error submitting payment claim:', error);
      toast.error('Failed to submit payment claim. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <CheckCircle2 className="h-16 w-16 text-green-600 mx-auto" />
            <h3 className="text-xl font-bold text-green-800">Payment Submitted!</h3>
            <p className="text-green-700">
              Your payment claim has been submitted for verification. 
              You'll receive a notification once it's approved.
            </p>
            <Badge variant="outline" className="text-green-700 border-green-300">
              Transaction Code: {mpesaCode}
            </Badge>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Phone className="h-5 w-5 text-green-600" />
          M-Pesa Payment
        </CardTitle>
        <CardDescription>
          Pay via M-Pesa and enter your transaction code below
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Payment Instructions */}
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Payment Instructions</AlertTitle>
          <AlertDescription className="space-y-2">
            <p>{mpesaDetails.instructions}</p>
            <div className="mt-3 space-y-2">
              {mpesaDetails.paybill && (
                <div className="flex items-center justify-between bg-muted p-2 rounded">
                  <span className="text-sm">
                    <strong>Paybill:</strong> {mpesaDetails.paybill}
                  </span>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => copyToClipboard(mpesaDetails.paybill, 'Paybill')}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              )}
              {mpesaDetails.till_number && (
                <div className="flex items-center justify-between bg-muted p-2 rounded">
                  <span className="text-sm">
                    <strong>Till Number:</strong> {mpesaDetails.till_number}
                  </span>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => copyToClipboard(mpesaDetails.till_number, 'Till Number')}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              )}
              <div className="flex items-center justify-between bg-muted p-2 rounded">
                <span className="text-sm">
                  <strong>Account Name:</strong> {mpesaDetails.account_name}
                </span>
                <Button 
                  size="sm" 
                  variant="ghost"
                  onClick={() => copyToClipboard(mpesaDetails.account_name, 'Account Name')}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </AlertDescription>
        </Alert>

        {/* Amount Display */}
        <div className="bg-primary/10 p-4 rounded-lg text-center">
          <p className="text-sm text-muted-foreground">Amount to Pay</p>
          <p className="text-3xl font-bold text-primary">KES {amount.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground mt-1">{purpose}</p>
        </div>

        {/* Payment Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="mpesaCode">M-Pesa Transaction Code *</Label>
            <Input
              id="mpesaCode"
              placeholder="e.g., SIR3XXXXXX"
              value={mpesaCode}
              onChange={(e) => setMpesaCode(e.target.value.toUpperCase())}
              maxLength={12}
              className="font-mono uppercase"
              required
            />
            <p className="text-xs text-muted-foreground">
              Enter the transaction code from your M-Pesa confirmation message
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="senderName">Sender Name (Optional)</Label>
            <Input
              id="senderName"
              placeholder="Name on M-Pesa account"
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
            />
          </div>

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
              type="submit" 
              className="flex-1 bg-green-600 hover:bg-green-700"
              disabled={loading || !mpesaCode}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Payment'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
