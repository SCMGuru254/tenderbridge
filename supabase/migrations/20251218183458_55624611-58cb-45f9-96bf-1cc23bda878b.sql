-- Drop the SECURITY DEFINER view and recreate it with SECURITY INVOKER
DROP VIEW IF EXISTS public.visible_profiles;

-- Recreate the view without SECURITY DEFINER (uses SECURITY INVOKER by default)
CREATE VIEW public.visible_profiles 
WITH (security_invoker = true)
AS
SELECT 
  id,
  email,
  full_name,
  avatar_url,
  bio,
  location,
  company,
  position,
  linkedin_url,
  skills,
  experience_level,
  career_goals,
  visibility,
  role,
  created_at,
  updated_at
FROM profiles
WHERE 
  -- Public profiles visible to everyone
  visibility = 'public'
  OR 
  -- Private/connections-only profiles visible to owner
  id = auth.uid();