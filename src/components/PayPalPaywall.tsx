
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lock, CreditCard, Star } from "lucide-react";
import { usePayPal } from "@/hooks/usePayPal";
import { toast } from "sonner";

interface PayPalPaywallProps {
  feature: string;
  price: number;
  currency?: string;
  description?: string;
}

export const PayPalPaywall = ({ 
  feature, 
  price, 
  currency = "USD",
  description
}: PayPalPaywallProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { createPayment } = usePayPal();

  const handlePayment = async () => {
    setIsProcessing(true);
    
    try {
      const orderData = {
        intent: 'CAPTURE',
        purchase_units: [
          {
            reference_id: crypto.randomUUID(),
            amount: {
              currency_code: currency,
              value: price.toString(),
            },
            description: `Payment for ${feature}`,
          },
        ],
        application_context: {
          return_url: `${window.location.origin}/payment-success`,
          cancel_url: `${window.location.origin}/payment-cancel`,
          brand_name: 'SupplyChain_KE',
          locale: 'en-US',
          landing_page: 'BILLING',
          shipping_preference: 'NO_SHIPPING',
          user_action: 'PAY_NOW',
        },
      };

      const result = await createPayment(orderData);
      
      if (result?.data?.links) {
        const approvalUrl = result.data.links.find((link: any) => link.rel === 'approve')?.href;
        if (approvalUrl) {
          window.location.href = approvalUrl;
        }
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error("Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 p-3 bg-orange-100 rounded-full w-fit">
          <Lock className="h-8 w-8 text-orange-600" />
        </div>
        <CardTitle>Premium Feature</CardTitle>
        <p className="text-muted-foreground">
          {description || `Unlock ${feature} to enhance your supply chain career`}
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <div className="text-3xl font-bold text-orange-600">
            ${price}
          </div>
          <p className="text-sm text-muted-foreground">One-time payment</p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-yellow-500" />
            <span className="text-sm">Access to {feature}</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-yellow-500" />
            <span className="text-sm">Priority customer support</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-yellow-500" />
            <span className="text-sm">Lifetime access</span>
          </div>
        </div>

        <Button 
          onClick={handlePayment}
          disabled={isProcessing}
          className="w-full bg-orange-600 hover:bg-orange-700"
        >
          {isProcessing ? (
            "Processing..."
          ) : (
            <>
              <CreditCard className="h-4 w-4 mr-2" />
              Pay with PayPal
            </>
          )}
        </Button>

        <div className="text-center">
          <Badge variant="outline" className="text-xs">
            Secure payment powered by PayPal
          </Badge>
          <p className="text-xs text-muted-foreground mt-2">
            M-Pesa payments coming soon
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
