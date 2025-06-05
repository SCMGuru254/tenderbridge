
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { usePayPal } from "@/hooks/usePayPal";
import { Send, DollarSign, Plus, Trash2 } from "lucide-react";

interface PayoutItem {
  recipient_type: 'EMAIL' | 'PHONE' | 'PAYPAL_ID';
  amount: string;
  currency: string;
  receiver: string;
  note?: string;
  sender_item_id: string;
}

export const PayPalPayouts = () => {
  const [payoutItems, setPayoutItems] = useState<PayoutItem[]>([
    {
      recipient_type: 'EMAIL',
      amount: '',
      currency: 'USD',
      receiver: '',
      note: '',
      sender_item_id: crypto.randomUUID(),
    },
  ]);
  const [emailSubject, setEmailSubject] = useState('You have received a payment');
  const [emailMessage, setEmailMessage] = useState('Thank you for your services. Your payment has been processed.');
  const { createPayout, loading } = usePayPal();

  const addPayoutItem = () => {
    setPayoutItems([
      ...payoutItems,
      {
        recipient_type: 'EMAIL',
        amount: '',
        currency: 'USD',
        receiver: '',
        note: '',
        sender_item_id: crypto.randomUUID(),
      },
    ]);
  };

  const removePayoutItem = (index: number) => {
    if (payoutItems.length > 1) {
      setPayoutItems(payoutItems.filter((_, i) => i !== index));
    }
  };

  const updatePayoutItem = (index: number, field: keyof PayoutItem, value: string) => {
    const updated = payoutItems.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    );
    setPayoutItems(updated);
  };

  const calculateTotalAmount = () => {
    return payoutItems.reduce((total, item) => {
      const amount = parseFloat(item.amount) || 0;
      return total + amount;
    }, 0);
  };

  const handleCreatePayout = async () => {
    const validItems = payoutItems.filter(item => 
      item.receiver && item.amount && parseFloat(item.amount) > 0
    );

    if (validItems.length === 0) {
      return;
    }

    const totalAmount = calculateTotalAmount();

    const payoutData = {
      sender_batch_header: {
        sender_batch_id: crypto.randomUUID(),
        email_subject: emailSubject,
        email_message: emailMessage,
      },
      items: validItems.map(item => ({
        recipient_type: item.recipient_type,
        amount: {
          value: item.amount,
          currency: item.currency,
        },
        receiver: item.receiver,
        note: item.note || 'Payment from Supply Chain Portal',
        sender_item_id: item.sender_item_id,
      })),
    };

    const result = await createPayout(payoutData);
    
    if (result?.success) {
      // Reset form
      setPayoutItems([
        {
          recipient_type: 'EMAIL',
          amount: '',
          currency: 'USD',
          receiver: '',
          note: '',
          sender_item_id: crypto.randomUUID(),
        },
      ]);
      setEmailSubject('You have received a payment');
      setEmailMessage('Thank you for your services. Your payment has been processed.');
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            Create Payout
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Email Configuration */}
          <div className="space-y-4">
            <h4 className="font-medium">Email Notification</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="emailSubject">Email Subject</Label>
                <Input
                  id="emailSubject"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  placeholder="Payment notification subject"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emailMessage">Email Message</Label>
                <Textarea
                  id="emailMessage"
                  value={emailMessage}
                  onChange={(e) => setEmailMessage(e.target.value)}
                  placeholder="Message to recipients"
                  rows={2}
                />
              </div>
            </div>
          </div>

          {/* Payout Items */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-medium">Recipients</h4>
              <Button onClick={addPayoutItem} variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Recipient
              </Button>
            </div>

            {payoutItems.map((item, index) => (
              <Card key={item.sender_item_id} className="border-dashed">
                <CardContent className="pt-4">
                  <div className="flex justify-between items-start mb-4">
                    <h5 className="font-medium">Recipient #{index + 1}</h5>
                    {payoutItems.length > 1 && (
                      <Button
                        onClick={() => removePayoutItem(index)}
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label>Recipient Type</Label>
                      <Select
                        value={item.recipient_type}
                        onValueChange={(value) => updatePayoutItem(index, 'recipient_type', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="EMAIL">Email</SelectItem>
                          <SelectItem value="PHONE">Phone</SelectItem>
                          <SelectItem value="PAYPAL_ID">PayPal ID</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Recipient</Label>
                      <Input
                        value={item.receiver}
                        onChange={(e) => updatePayoutItem(index, 'receiver', e.target.value)}
                        placeholder={
                          item.recipient_type === 'EMAIL' ? 'user@example.com' :
                          item.recipient_type === 'PHONE' ? '+1234567890' :
                          'PayPal ID'
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Amount</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="number"
                          value={item.amount}
                          onChange={(e) => updatePayoutItem(index, 'amount', e.target.value)}
                          placeholder="0.00"
                          className="pl-10"
                          min="0"
                          step="0.01"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Currency</Label>
                      <Select
                        value={item.currency}
                        onValueChange={(value) => updatePayoutItem(index, 'currency', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="EUR">EUR</SelectItem>
                          <SelectItem value="GBP">GBP</SelectItem>
                          <SelectItem value="CAD">CAD</SelectItem>
                          <SelectItem value="AUD">AUD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="mt-4">
                    <Label>Note (Optional)</Label>
                    <Input
                      value={item.note || ''}
                      onChange={(e) => updatePayoutItem(index, 'note', e.target.value)}
                      placeholder="Payment note for recipient"
                      className="mt-2"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Summary */}
          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-4">
              <span className="font-medium">Total Payout Amount:</span>
              <Badge variant="secondary" className="text-lg">
                ${calculateTotalAmount().toFixed(2)} USD
              </Badge>
            </div>

            <Button 
              onClick={handleCreatePayout} 
              disabled={loading || payoutItems.every(item => !item.receiver || !item.amount)}
              className="w-full"
            >
              {loading ? 'Creating Payout...' : `Send Payout (${payoutItems.filter(item => item.receiver && item.amount).length} recipients)`}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
