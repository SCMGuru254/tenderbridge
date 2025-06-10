
-- Create rewards_points table for user balances
CREATE TABLE public.rewards_points (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  current_balance INTEGER NOT NULL DEFAULT 0,
  lifetime_earned INTEGER NOT NULL DEFAULT 0,
  lifetime_spent INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Create rewards_transactions table for point history
CREATE TABLE public.rewards_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('earn', 'spend', 'refund', 'expire')),
  points INTEGER NOT NULL,
  description TEXT NOT NULL,
  source TEXT NOT NULL,
  reference_id UUID NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create rewards_catalog table for redeemable items
CREATE TABLE public.rewards_catalog (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  item_code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  points_required INTEGER NOT NULL,
  category TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  stock_available INTEGER NULL,
  max_redemptions_per_user INTEGER NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_achievements table for milestone tracking
CREATE TABLE public.user_achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_type TEXT NOT NULL,
  achievement_data JSONB NOT NULL DEFAULT '{}',
  points_awarded INTEGER NOT NULL DEFAULT 0,
  achieved_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  notified BOOLEAN NOT NULL DEFAULT false
);

-- Create redemption_requests table for processing
CREATE TABLE public.redemption_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  catalog_item_id UUID NOT NULL REFERENCES public.rewards_catalog(id),
  points_spent INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'refunded')),
  request_data JSONB NOT NULL DEFAULT '{}',
  admin_notes TEXT NULL,
  requested_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  processed_at TIMESTAMP WITH TIME ZONE NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + INTERVAL '72 hours')
);

-- Insert initial catalog items
INSERT INTO public.rewards_catalog (item_code, name, description, points_required, category) VALUES
('CV_REVIEW', 'CV Review Service', 'Professional CV review by HR specialists', 1000, 'career_services'),
('PRIORITY_LISTING', 'Priority Job Listing', 'Get your job applications prioritized for 30 days', 3000, 'job_benefits'),
('PROFILE_VISIBILITY', 'Extended Profile Visibility', 'Boost profile visibility for 2 weeks', 500, 'profile_boost'),
('CAREER_CONSULTATION', 'Career Consultation', '1-hour career coaching session with industry experts', 7000, 'career_services'),
('MERCHANDISE', 'SupplyChain_KE Merchandise', 'Branded merchandise package', 20000, 'merchandise');

-- Enable RLS on all tables
ALTER TABLE public.rewards_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rewards_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rewards_catalog ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.redemption_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies for rewards_points
CREATE POLICY "Users can view their own points" ON public.rewards_points
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own points" ON public.rewards_points
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for rewards_transactions
CREATE POLICY "Users can view their own transactions" ON public.rewards_transactions
  FOR SELECT USING (auth.uid() = user_id);

-- RLS Policies for rewards_catalog (public read access)
CREATE POLICY "Anyone can view active catalog items" ON public.rewards_catalog
  FOR SELECT USING (is_active = true);

-- RLS Policies for user_achievements
CREATE POLICY "Users can view their own achievements" ON public.user_achievements
  FOR SELECT USING (auth.uid() = user_id);

-- RLS Policies for redemption_requests
CREATE POLICY "Users can view their own redemption requests" ON public.redemption_requests
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own redemption requests" ON public.redemption_requests
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_rewards_points_user_id ON public.rewards_points(user_id);
CREATE INDEX idx_rewards_transactions_user_id ON public.rewards_transactions(user_id);
CREATE INDEX idx_rewards_transactions_created_at ON public.rewards_transactions(created_at DESC);
CREATE INDEX idx_user_achievements_user_id ON public.user_achievements(user_id);
CREATE INDEX idx_redemption_requests_user_id ON public.redemption_requests(user_id);
CREATE INDEX idx_redemption_requests_status ON public.redemption_requests(status);
CREATE INDEX idx_redemption_requests_expires_at ON public.redemption_requests(expires_at);

-- Create trigger for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_rewards_points_updated_at BEFORE UPDATE ON public.rewards_points
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rewards_catalog_updated_at BEFORE UPDATE ON public.rewards_catalog
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to initialize user points when they first join
CREATE OR REPLACE FUNCTION public.initialize_user_points()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.rewards_points (user_id, current_balance, lifetime_earned, lifetime_spent)
  VALUES (NEW.id, 0, 0, 0)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-initialize points for new users
CREATE TRIGGER on_auth_user_created_initialize_points
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.initialize_user_points();

-- Function to award points safely
CREATE OR REPLACE FUNCTION public.award_points(
  p_user_id UUID,
  p_points INTEGER,
  p_description TEXT,
  p_source TEXT,
  p_reference_id UUID DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
  current_points INTEGER;
BEGIN
  -- Insert transaction record
  INSERT INTO public.rewards_transactions (
    user_id, transaction_type, points, description, source, reference_id
  ) VALUES (
    p_user_id, 'earn', p_points, p_description, p_source, p_reference_id
  );
  
  -- Update user balance
  UPDATE public.rewards_points 
  SET 
    current_balance = current_balance + p_points,
    lifetime_earned = lifetime_earned + p_points,
    updated_at = now()
  WHERE user_id = p_user_id;
  
  -- Insert achievement record if it's a significant milestone
  IF p_points >= 500 THEN
    INSERT INTO public.user_achievements (
      user_id, achievement_type, achievement_data, points_awarded
    ) VALUES (
      p_user_id, 'major_point_earn', 
      jsonb_build_object('points', p_points, 'source', p_source),
      p_points
    );
  END IF;
  
  RETURN TRUE;
EXCEPTION
  WHEN OTHERS THEN
    RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to process redemption
CREATE OR REPLACE FUNCTION public.process_redemption(
  p_user_id UUID,
  p_catalog_item_id UUID,
  p_request_data JSONB DEFAULT '{}'
)
RETURNS UUID AS $$
DECLARE
  points_required INTEGER;
  current_balance INTEGER;
  redemption_id UUID;
BEGIN
  -- Get catalog item points requirement
  SELECT points_required INTO points_required 
  FROM public.rewards_catalog 
  WHERE id = p_catalog_item_id AND is_active = true;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Catalog item not found or inactive';
  END IF;
  
  -- Get user's current balance
  SELECT current_balance INTO current_balance 
  FROM public.rewards_points 
  WHERE user_id = p_user_id;
  
  IF current_balance < points_required THEN
    RAISE EXCEPTION 'Insufficient points balance';
  END IF;
  
  -- Create redemption request
  INSERT INTO public.redemption_requests (
    user_id, catalog_item_id, points_spent, request_data
  ) VALUES (
    p_user_id, p_catalog_item_id, points_required, p_request_data
  ) RETURNING id INTO redemption_id;
  
  -- Deduct points
  UPDATE public.rewards_points 
  SET 
    current_balance = current_balance - points_required,
    lifetime_spent = lifetime_spent + points_required,
    updated_at = now()
  WHERE user_id = p_user_id;
  
  -- Record transaction
  INSERT INTO public.rewards_transactions (
    user_id, transaction_type, points, description, source, reference_id
  ) VALUES (
    p_user_id, 'spend', -points_required, 
    'Redemption: ' || (SELECT name FROM public.rewards_catalog WHERE id = p_catalog_item_id),
    'redemption', redemption_id
  );
  
  RETURN redemption_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
