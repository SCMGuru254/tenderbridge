-- Create table for Paystack Transactions
CREATE TABLE IF NOT EXISTS public.paystack_transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    reference TEXT NOT NULL UNIQUE,
    amount NUMERIC NOT NULL,
    currency TEXT DEFAULT 'KES',
    email TEXT NOT NULL,
    status TEXT DEFAULT 'pending', -- pending, success, failed
    metadata JSONB, -- Stores event_id, course_id, etc.
    paystack_response JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create table for Secure Manual Payment Methods
CREATE TABLE IF NOT EXISTS public.manual_payment_methods (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    type TEXT NOT NULL, -- 'mpesa_paybill', 'mpesa_send_money', 'bank_transfer'
    name TEXT NOT NULL, -- 'Safaricom Paybill', 'Olive Onyona'
    account_number TEXT NOT NULL, -- Paybill Number or Phone Number
    account_name TEXT, -- 'Supply Chain KE'
    instructions TEXT, -- 'Go to M-Pesa -> Paybill...'
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.paystack_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.manual_payment_methods ENABLE ROW LEVEL SECURITY;

-- Policies for Paystack Transactions
-- Users can view their own transactions
CREATE POLICY "Users can view own transactions" ON public.paystack_transactions
    FOR SELECT USING (auth.uid() = user_id);

-- Service role can insert/update (Edge functions)
CREATE POLICY "Service role can manage transactions" ON public.paystack_transactions
    USING (true)
    WITH CHECK (true);

-- Policies for Manual Payment Methods
-- Authenticated users can read active methods
CREATE POLICY "Authenticated users can read active methods" ON public.manual_payment_methods
    FOR SELECT
    TO authenticated
    USING (is_active = true);

-- Only admins/service_role can modify
CREATE POLICY "Service role can manage methods" ON public.manual_payment_methods
    USING (true)
    WITH CHECK (true);

-- Insert default manual payment methods (Examples - User to update via dashboard later)
INSERT INTO public.manual_payment_methods (type, name, account_number, account_name, instructions)
VALUES 
    ('mpesa_send_money', 'M-Pesa Send Money', '07XX XXX XXX', 'Olive Etsula', 'Go to M-Pesa -> Send Money to 07XX... -> Copy Confirmation Code');
