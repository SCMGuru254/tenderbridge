
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PayPalDashboard } from "@/components/paypal/PayPalDashboard";
import { PayPalPayment } from "@/components/paypal/PayPalPayment";
import { PayPalSubscriptions } from "@/components/paypal/PayPalSubscriptions";
import { PayPalPayouts } from "@/components/paypal/PayPalPayouts";
import { useUser } from "@/hooks/useUser";
import { Navigate } from "react-router-dom";
import { CreditCard, Users, Send, BarChart3 } from "lucide-react";

const PayPalPortal = () => {
  const { user, loading } = useUser();

  if (loading) {
    return (
      <div className="container mx-auto p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="container mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">PayPal Management Portal</h1>
        <p className="text-muted-foreground">
          Manage payments, subscriptions, and payouts for your supply chain business
        </p>
      </div>

      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="payments" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Payments
          </TabsTrigger>
          <TabsTrigger value="subscriptions" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Subscriptions
          </TabsTrigger>
          <TabsTrigger value="payouts" className="flex items-center gap-2">
            <Send className="h-4 w-4" />
            Payouts
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <PayPalDashboard />
        </TabsContent>

        <TabsContent value="payments">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>One-time Payments</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">
                  Create secure one-time payments for services, products, or custom amounts.
                </p>
                <PayPalPayment />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="subscriptions">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Subscription Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">
                  Create and manage recurring subscription plans for your services.
                </p>
                <PayPalSubscriptions />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="payouts">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Bulk Payouts</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">
                  Send payments to multiple recipients for commissions, refunds, or other disbursements.
                </p>
                <PayPalPayouts />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PayPalPortal;
