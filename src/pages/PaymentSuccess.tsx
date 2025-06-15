
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowLeft } from "lucide-react";
import { usePayPal } from "@/hooks/usePayPal";
import { toast } from "sonner";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(true);
  const [paymentCaptured, setPaymentCaptured] = useState(false);
  const { capturePayment } = usePayPal();

  const token = searchParams.get('token');
  const payerId = searchParams.get('PayerID');

  useEffect(() => {
    const processPayment = async () => {
      if (token) {
        try {
          const result = await capturePayment(token);
          if (result) {
            setPaymentCaptured(true);
            toast.success("Payment processed successfully!");
          } else {
            toast.error("Failed to process payment");
          }
        } catch (error) {
          console.error('Payment capture error:', error);
          toast.error("Payment processing failed");
        }
      }
      setProcessing(false);
    };

    processPayment();
  }, [token, capturePayment]);

  if (processing) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardContent className="text-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold mb-2">Processing Payment</h2>
            <p className="text-muted-foreground">Please wait while we confirm your payment...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl text-green-600">
            {paymentCaptured ? "Payment Successful!" : "Payment Completed!"}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            Your payment has been processed successfully. You should receive a confirmation email shortly.
          </p>
          
          {token && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">
                Transaction ID: <span className="font-mono">{token}</span>
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Button 
              onClick={() => navigate('/paypal-portal')}
              className="w-full"
            >
              View PayPal Dashboard
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate('/')}
              className="w-full"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSuccess;
