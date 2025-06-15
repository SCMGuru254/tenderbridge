
-- Create PayPal plans table
CREATE TABLE public.paypal_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  plan_id TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'ACTIVE',
  created_by UUID REFERENCES auth.users,
  plan_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create PayPal subscriptions table
CREATE TABLE public.paypal_subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  subscription_id TEXT NOT NULL UNIQUE,
  plan_id TEXT NOT NULL,
  user_id UUID REFERENCES auth.users,
  status TEXT NOT NULL DEFAULT 'PENDING',
  subscription_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create PayPal payments table
CREATE TABLE public.paypal_payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  payment_id TEXT NOT NULL UNIQUE,
  user_id UUID REFERENCES auth.users,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  status TEXT NOT NULL DEFAULT 'CREATED',
  payment_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create PayPal payouts table
CREATE TABLE public.paypal_payouts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  payout_batch_id TEXT NOT NULL UNIQUE,
  user_id UUID REFERENCES auth.users,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  status TEXT NOT NULL DEFAULT 'PENDING',
  payout_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all PayPal tables
ALTER TABLE public.paypal_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.paypal_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.paypal_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.paypal_payouts ENABLE ROW LEVEL SECURITY;

-- RLS policies for paypal_plans (admin only for creation, public read for active plans)
CREATE POLICY "Public can view active plans" ON public.paypal_plans
  FOR SELECT USING (status = 'ACTIVE');

CREATE POLICY "Authenticated users can create plans" ON public.paypal_plans
  FOR INSERT WITH CHECK (auth.uid() = created_by);

-- RLS policies for paypal_subscriptions (users can only see their own)
CREATE POLICY "Users can view their own subscriptions" ON public.paypal_subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own subscriptions" ON public.paypal_subscriptions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscriptions" ON public.paypal_subscriptions
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS policies for paypal_payments (users can only see their own)
CREATE POLICY "Users can view their own payments" ON public.paypal_payments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own payments" ON public.paypal_payments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own payments" ON public.paypal_payments
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS policies for paypal_payouts (users can only see their own)
CREATE POLICY "Users can view their own payouts" ON public.paypal_payouts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own payouts" ON public.paypal_payouts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own payouts" ON public.paypal_payouts
  FOR UPDATE USING (auth.uid() = user_id);

-- Add triggers for updated_at
CREATE TRIGGER update_paypal_plans_updated_at
  BEFORE UPDATE ON public.paypal_plans
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_paypal_subscriptions_updated_at
  BEFORE UPDATE ON public.paypal_subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_paypal_payments_updated_at
  BEFORE UPDATE ON public.paypal_payments
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_paypal_payouts_updated_at
  BEFORE UPDATE ON public.paypal_payouts
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
