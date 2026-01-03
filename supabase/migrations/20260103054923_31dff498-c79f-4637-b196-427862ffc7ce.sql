-- Create platform_settings table for configurable social links, contact info, and site settings
CREATE TABLE public.platform_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key text UNIQUE NOT NULL,
  setting_value jsonb NOT NULL DEFAULT '{}',
  setting_type text NOT NULL DEFAULT 'general',
  description text,
  is_public boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;

-- Public can view public settings (like social links)
CREATE POLICY "Anyone can view public settings"
ON public.platform_settings FOR SELECT
USING (is_public = true);

-- Only admins can manage settings
CREATE POLICY "Admins can manage all settings"
ON public.platform_settings FOR ALL
USING (EXISTS (
  SELECT 1 FROM public.user_roles 
  WHERE user_id = auth.uid() AND role = 'admin'
));

-- Insert default platform settings
INSERT INTO public.platform_settings (setting_key, setting_value, setting_type, description, is_public) VALUES
('social_links', '{"twitter": "", "linkedin": "", "facebook": "", "instagram": "", "youtube": "", "tiktok": ""}', 'social', 'Social media profile links', true),
('contact_info', '{"email": "support@supplychainke.com", "phone": "", "address": "", "whatsapp": ""}', 'contact', 'Platform contact information', true),
('mpesa_details', '{"paybill": "", "till_number": "", "account_name": "SupplyChainKE", "instructions": "Send payment to the paybill/till number and enter the transaction code below"}', 'payment', 'M-Pesa payment details for manual payments', true),
('paystack_config', '{"public_key": "", "enabled": false}', 'payment', 'Paystack integration configuration', false),
('site_info', '{"name": "SupplyChainKE", "tagline": "Your Supply Chain Career Partner", "about": ""}', 'general', 'General site information', true),
('footer_links', '{"platform": [], "resources": [], "legal": []}', 'navigation', 'Footer navigation links', true);

-- Create index for faster lookups
CREATE INDEX idx_platform_settings_key ON public.platform_settings(setting_key);
CREATE INDEX idx_platform_settings_type ON public.platform_settings(setting_type);

-- Create trigger for updated_at
CREATE TRIGGER update_platform_settings_updated_at
BEFORE UPDATE ON public.platform_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();