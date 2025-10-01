-- Phase 1.1: Create has_role() security definer function to fix infinite recursion
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Phase 1.1: Fix user_roles policies
DROP POLICY IF EXISTS "Only admins can manage user roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;

CREATE POLICY "Only admins can manage user roles"
ON public.user_roles
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

-- Phase 1.2: Restrict profiles table access - Remove dangerous public policy
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

-- Keep granular policies based on visibility settings
CREATE POLICY "Users can view public profiles with restricted fields"
ON public.profiles
FOR SELECT
USING (
  visibility = 'public' 
  OR auth.uid() = id
  OR (
    visibility = 'connections' 
    AND EXISTS (
      SELECT 1 FROM connections 
      WHERE (user_id1 = auth.uid() AND user_id2 = profiles.id)
         OR (user_id2 = auth.uid() AND user_id1 = profiles.id)
      AND status = 'accepted'
    )
  )
  OR (
    visibility = 'recruiters' 
    AND public.has_role(auth.uid(), 'recruiter')
  )
  OR (
    visibility = 'recruiters' 
    AND public.has_role(auth.uid(), 'hr')
  )
);

-- Phase 1.3: Fix team_applications PII exposure
DROP POLICY IF EXISTS "Users can view their applications or public applications" ON public.team_applications;

CREATE POLICY "Users can view their own applications"
ON public.team_applications
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins and recruiters can view all applications"
ON public.team_applications
FOR SELECT
USING (
  public.has_role(auth.uid(), 'admin')
  OR public.has_role(auth.uid(), 'recruiter')
  OR public.has_role(auth.uid(), 'hr')
);

-- Phase 1.4: Restrict newsletter_subscribers access
DROP POLICY IF EXISTS "Authenticated users can view newsletter subscribers" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Anyone can view newsletter subscribers" ON public.newsletter_subscribers;

CREATE POLICY "Only admins can view all subscribers"
ON public.newsletter_subscribers
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can check their own subscription"
ON public.newsletter_subscribers
FOR SELECT
USING (email = (SELECT email FROM auth.users WHERE id = auth.uid()));