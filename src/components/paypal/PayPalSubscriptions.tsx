
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Subscription {
  id: string;
  planName: string;
  amount: number;
  currency: string;
  interval: string;
  status: string;
  nextBilling: string;
  subscriber: string;
}

export const PayPalSubscriptions = () => {
  const [subscriptions] = useState<Subscription[]>([
    {
      id: "1",
      planName: "Pro Plan",
      amount: 29.99,
      currency: "USD",
      interval: "monthly",
      status: "active",
      nextBilling: "2024-02-15",
      subscriber: "john@example.com"
    },
    {
      id: "2",
      planName: "Enterprise Plan", 
      amount: 99.99,
      currency: "USD",
      interval: "monthly",
      status: "cancelled",
      nextBilling: "2024-02-10",
      subscriber: "company@example.com"
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>PayPal Subscriptions</CardTitle>
          <CardDescription>Manage recurring payment subscriptions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {subscriptions.map((subscription) => (
              <div key={subscription.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium">{subscription.planName}</h3>
                  <p className="text-sm text-muted-foreground">{subscription.subscriber}</p>
                  <p className="text-xs text-muted-foreground">
                    Next billing: {subscription.nextBilling}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">
                    ${subscription.amount}/{subscription.interval}
                  </p>
                  <Badge className={getStatusColor(subscription.status)}>
                    {subscription.status}
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
