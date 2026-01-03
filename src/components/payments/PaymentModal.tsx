import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Phone, CreditCard } from 'lucide-react';
import { MpesaPayment } from './MpesaPayment';
import { PaystackPayment } from './PaystackPayment';
import { usePlatformSettings } from '@/hooks/usePlatformSettings';

interface PaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  amount: number;
  purpose: string;
  onSuccess?: (reference: string) => void;
  metadata?: Record<string, unknown>;
}

export const PaymentModal = ({
  open,
  onOpenChange,
  amount,
  purpose,
  onSuccess,
  metadata = {}
}: PaymentModalProps) => {
  const { settings } = usePlatformSettings();
  const [activeTab, setActiveTab] = useState('mpesa');

  const handleSuccess = (reference: string) => {
    onSuccess?.(reference);
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  const paystackEnabled = settings.paystack_config?.enabled;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Complete Payment</DialogTitle>
          <DialogDescription>
            Choose your preferred payment method
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="mpesa" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              M-Pesa
            </TabsTrigger>
            <TabsTrigger 
              value="card" 
              className="flex items-center gap-2"
              disabled={!paystackEnabled}
            >
              <CreditCard className="h-4 w-4" />
              Card
            </TabsTrigger>
          </TabsList>

          <TabsContent value="mpesa" className="mt-4">
            <MpesaPayment
              amount={amount}
              purpose={purpose}
              onSuccess={handleSuccess}
              onCancel={handleCancel}
              metadata={metadata}
            />
          </TabsContent>

          <TabsContent value="card" className="mt-4">
            <PaystackPayment
              amount={amount}
              purpose={purpose}
              onSuccess={handleSuccess}
              onCancel={handleCancel}
              metadata={metadata}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
