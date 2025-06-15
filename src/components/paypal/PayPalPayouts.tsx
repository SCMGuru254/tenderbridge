
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Send } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { usePayPal } from "@/hooks/usePayPal";

interface Payout {
  id: string;
  payout_batch_id: string;
  amount: number;
  currency: string;
  status: string;
  created_at: string;
  payout_data: any;
}

export const PayPalPayouts = () => {
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPayout, setNewPayout] = useState({
    recipient: "",
    amount: "",
    description: ""
  });
  const { createPayout, loading: paypalLoading } = usePayPal();

  useEffect(() => {
    fetchPayouts();
  }, []);

  const fetchPayouts = async () => {
    try {
      const { data } = await supabase
        .from('paypal_payouts')
        .select('*')
        .order('created_at', { ascending: false });
      
      setPayouts(data || []);
    } catch (error) {
      console.error('Error fetching payouts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePayout = async () => {
    if (!newPayout.recipient || !newPayout.amount) {
      toast.error("Please fill in recipient and amount");
      return;
    }

    const payoutData = {
      sender_batch_header: {
        sender_batch_id: crypto.randomUUID(),
        email_subject: "You have a payout!",
        email_message: newPayout.description || "You have received a payment.",
        total_amount: newPayout.amount,
        currency: "USD"
      },
      items: [
        {
          recipient_type: "EMAIL",
          amount: {
            value: newPayout.amount,
            currency: "USD"
          },
          receiver: newPayout.recipient,
          note: newPayout.description || "Payment from SupplyChain_KE",
          sender_item_id: crypto.randomUUID()
        }
      ]
    };

    const result = await createPayout(payoutData);
    if (result) {
      toast.success("Payout created successfully!");
      setNewPayout({ recipient: "", amount: "", description: "" });
      fetchPayouts();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'success': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'failed': 
      case 'denied': return 'text-red-600 bg-red-100';
      case 'processing': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Create PayPal Payout</CardTitle>
          <CardDescription>Send payments to multiple recipients</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <Label htmlFor="recipient">Recipient Email</Label>
              <Input
                id="recipient"
                type="email"
                placeholder="recipient@example.com"
                value={newPayout.recipient}
                onChange={(e) => setNewPayout({...newPayout, recipient: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="amount">Amount (USD)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={newPayout.amount}
                onChange={(e) => setNewPayout({...newPayout, amount: e.target.value})}
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="Payment description"
                value={newPayout.description}
                onChange={(e) => setNewPayout({...newPayout, description: e.target.value})}
              />
            </div>
          </div>

          <Button 
            onClick={handleCreatePayout}
            disabled={paypalLoading || !newPayout.recipient || !newPayout.amount}
            className="w-full md:w-auto"
          >
            {paypalLoading ? "Creating Payout..." : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Create Payout
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Payouts</CardTitle>
        </CardHeader>
        <CardContent>
          {payouts.length > 0 ? (
            <div className="space-y-4">
              {payouts.map((payout) => (
                <div key={payout.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Batch: {payout.payout_batch_id.slice(-8)}</p>
                    <p className="text-sm text-muted-foreground">
                      {payout.payout_data?.items?.[0]?.receiver || 'Unknown recipient'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(payout.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${payout.amount.toFixed(2)}</p>
                    <Badge className={getStatusColor(payout.status)}>
                      {payout.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">
              No payouts created yet. Create your first payout above.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
