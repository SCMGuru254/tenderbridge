-- Update social_links to include telegram field
UPDATE public.platform_settings 
SET setting_value = jsonb_set(
  COALESCE(setting_value::jsonb, '{}'::jsonb),
  '{telegram}',
  '""'::jsonb
)
WHERE setting_key = 'social_links' 
AND NOT (setting_value::jsonb ? 'telegram');