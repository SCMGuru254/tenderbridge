-- Update social_links with default/hardcoded values so icons always show
-- This ensures social media icons are visible in the footer
UPDATE public.platform_settings 
SET setting_value = jsonb_build_object(
  'facebook', 'https://www.facebook.com/supplychainke',
  'twitter', 'https://twitter.com/supplychainke',
  'instagram', 'https://www.instagram.com/supplychaincoded/',
  'linkedin', 'https://www.linkedin.com/company/supplychain-ke',
  'youtube', '',
  'telegram', 'https://t.me/supplychainke',
  'tiktok', ''
),
updated_at = NOW()
WHERE setting_key = 'social_links';