
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.0";

const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const paypalClientId = Deno.env.get('PAYPAL_CLIENT_ID') || '';
const paypalClientSecret = Deno.env.get('PAYPAL_CLIENT_SECRET') || '';
const paypalBaseUrl = Deno.env.get('PAYPAL_ENVIRONMENT') === 'production' 
  ? 'https://api-m.paypal.com' 
  : 'https://api-m.sandbox.paypal.com';

const supabase = createClient(supabaseUrl, supabaseKey);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Get PayPal access token
async function getPayPalAccessToken(): Promise<string> {
  const auth = btoa(`${paypalClientId}:${paypalClientSecret}`);
  
  const response = await fetch(`${paypalBaseUrl}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Accept': 'application/json',
      'Accept-Language': 'en_US',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  const data = await response.json();
  return data.access_token;
}

// Create subscription plan
async function createSubscriptionPlan(planData: any, accessToken: string) {
  const response = await fetch(`${paypalBaseUrl}/v1/billing/plans`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
      'Accept': 'application/json',
      'PayPal-Request-Id': crypto.randomUUID(),
    },
    body: JSON.stringify(planData),
  });

  return await response.json();
}

// Create subscription
async function createSubscription(subscriptionData: any, accessToken: string) {
  const response = await fetch(`${paypalBaseUrl}/v1/billing/subscriptions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
      'Accept': 'application/json',
      'PayPal-Request-Id': crypto.randomUUID(),
    },
    body: JSON.stringify(subscriptionData),
  });

  return await response.json();
}

// Create payment order
async function createPaymentOrder(orderData: any, accessToken: string) {
  const response = await fetch(`${paypalBaseUrl}/v2/checkout/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
      'Accept': 'application/json',
      'PayPal-Request-Id': crypto.randomUUID(),
    },
    body: JSON.stringify(orderData),
  });

  return await response.json();
}

// Capture payment
async function capturePayment(orderId: string, accessToken: string) {
  const response = await fetch(`${paypalBaseUrl}/v2/checkout/orders/${orderId}/capture`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
      'Accept': 'application/json',
    },
  });

  return await response.json();
}

// Create payout
async function createPayout(payoutData: any, accessToken: string) {
  const response = await fetch(`${paypalBaseUrl}/v1/payments/payouts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
      'Accept': 'application/json',
    },
    body: JSON.stringify(payoutData),
  });

  return await response.json();
}

// Get subscription details
async function getSubscription(subscriptionId: string, accessToken: string) {
  const response = await fetch(`${paypalBaseUrl}/v1/billing/subscriptions/${subscriptionId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
      'Accept': 'application/json',
    },
  });

  return await response.json();
}

// Cancel subscription
async function cancelSubscription(subscriptionId: string, reason: string, accessToken: string) {
  const response = await fetch(`${paypalBaseUrl}/v1/billing/subscriptions/${subscriptionId}/cancel`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
      'Accept': 'application/json',
    },
    body: JSON.stringify({ reason }),
  });

  return response.status === 204;
}

// Get dashboard data
async function getDashboardData(accessToken: string, userId: string) {
  // This would typically involve multiple API calls to get comprehensive data
  // For now, we'll return a basic structure
  return {
    totalRevenue: 0,
    totalPayouts: 0,
    activeSubscriptions: 0,
    pendingPayments: 0,
    recentTransactions: [],
    subscriptionMetrics: {
      newSubscriptions: 0,
      cancelledSubscriptions: 0,
      renewals: 0,
    },
    payoutMetrics: {
      successfulPayouts: 0,
      failedPayouts: 0,
      pendingPayouts: 0,
    },
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, data } = await req.json();
    console.log(`PayPal Integration: ${action}`, data);

    if (!paypalClientId || !paypalClientSecret) {
      throw new Error('PayPal credentials not configured');
    }

    const accessToken = await getPayPalAccessToken();
    let result;

    switch (action) {
      case 'create-plan':
        result = await createSubscriptionPlan(data.planData, accessToken);
        
        // Store plan in database
        await supabase.from('paypal_plans').insert({
          plan_id: result.id,
          name: data.planData.name,
          description: data.planData.description,
          status: result.status,
          created_by: data.userId,
          plan_data: result,
        });
        break;

      case 'create-subscription':
        result = await createSubscription(data.subscriptionData, accessToken);
        
        // Store subscription in database
        await supabase.from('paypal_subscriptions').insert({
          subscription_id: result.id,
          plan_id: data.subscriptionData.plan_id,
          user_id: data.userId,
          status: result.status,
          subscription_data: result,
        });
        break;

      case 'create-payment':
        result = await createPaymentOrder(data.orderData, accessToken);
        
        // Store payment in database
        await supabase.from('paypal_payments').insert({
          payment_id: result.id,
          user_id: data.userId,
          amount: data.orderData.purchase_units[0].amount.value,
          currency: data.orderData.purchase_units[0].amount.currency_code,
          status: result.status,
          payment_data: result,
        });
        break;

      case 'capture-payment':
        result = await capturePayment(data.orderId, accessToken);
        
        // Update payment status in database
        await supabase.from('paypal_payments')
          .update({ 
            status: result.status,
            payment_data: result,
            updated_at: new Date().toISOString(),
          })
          .eq('payment_id', data.orderId);
        break;

      case 'create-payout':
        result = await createPayout(data.payoutData, accessToken);
        
        // Store payout in database
        await supabase.from('paypal_payouts').insert({
          payout_batch_id: result.batch_header.payout_batch_id,
          user_id: data.userId,
          amount: data.payoutData.sender_batch_header.total_amount,
          currency: data.payoutData.sender_batch_header.currency,
          status: result.batch_header.batch_status,
          payout_data: result,
        });
        break;

      case 'get-subscription':
        result = await getSubscription(data.subscriptionId, accessToken);
        
        // Update subscription status in database
        await supabase.from('paypal_subscriptions')
          .update({ 
            status: result.status,
            subscription_data: result,
            updated_at: new Date().toISOString(),
          })
          .eq('subscription_id', data.subscriptionId);
        break;

      case 'cancel-subscription':
        result = await cancelSubscription(data.subscriptionId, data.reason, accessToken);
        
        if (result) {
          // Update subscription status in database
          await supabase.from('paypal_subscriptions')
            .update({ 
              status: 'CANCELLED',
              updated_at: new Date().toISOString(),
            })
            .eq('subscription_id', data.subscriptionId);
        }
        break;

      case 'get-dashboard':
        result = await getDashboardData(accessToken, data.userId);
        
        // Get additional data from database
        const { data: dbData } = await supabase
          .from('paypal_payments')
          .select('*')
          .eq('user_id', data.userId)
          .order('created_at', { ascending: false })
          .limit(10);
        
        result.recentTransactions = dbData || [];
        break;

      default:
        throw new Error(`Unknown action: ${action}`);
    }

    return new Response(JSON.stringify({ success: true, data: result }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('PayPal Integration Error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
