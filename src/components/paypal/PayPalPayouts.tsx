
import { useState } from "react";
import { Card, CardContent, CardHeader, CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Send } from "lucide-react";
import { toast } from "sonner";

interface Payout {
  id: string;
  recipient: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
  description: string;
}

export const PayPalPayouts = () => {
  const [payouts, setPayouts] = useState<Payout[]>([
    {
      id: "1",
      recipient: "john@example.com",
      amount: 250.00,
      currency: "USD",
      status: "completed",
      createdAt: "2024-01-15",
      description: "Freelance work payment"
    },
    {
      id: "2", 
      recipient: "jane@example.com",
      amount: 150.00,
      currency: "USD",
      status: "pending",
      createdAt: "2024-01-14",
      description: "Content creation payment"
    }
  ]);

  const [newPayout, setNewPayout] = useState({
    recipient: "",
    amount: "",
    description: ""
  });

  const [isCreating, setIsCreating] = useState(false);

  const handleCreatePayout = async () => {
    if (!newPayout.recipient || !newPayout.amount) return;

    setIsCreating(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const payout: Payout = {
        id: Date.now().toString(),
        recipient: newPayout.recipient,
        amount: parseFloat(newPayout.amount),
        currency: "USD",
        status: "pending",
        createdAt: new Date().toISOString().split('T')[0],
        description: newPayout.description
      };

      setPayouts([payout, ...payouts]);
      setNewPayout({ recipient: "", amount: "", description: "" });
      
      toast("Payout created successfully!");
    } catch (error) {
      toast("Failed to create payout. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'failed': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>PayPal Payouts</CardTitle>
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
            disabled={isCreating || !newPayout.recipient || !newPayout.amount}
            className="w-full md:w-auto"
          >
            {isCreating ? "Creating Payout..." : (
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
          <div className="space-y-4">
            {payouts.map((payout) => (
              <div key={payout.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">{payout.recipient}</p>
                  <p className="text-sm text-muted-foreground">{payout.description}</p>
                  <p className="text-xs text-muted-foreground">{payout.createdAt}</p>
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
        </CardContent>
      </Card>
    </div>
  );
};
