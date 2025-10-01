-- Phase 3.1: Add search_path to all database functions

-- Update update_skill_poll_votes_count
CREATE OR REPLACE FUNCTION public.update_skill_poll_votes_count()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.skill_polls 
    SET votes_count = votes_count + 1 
    WHERE id = NEW.poll_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.skill_polls 
    SET votes_count = votes_count - 1 
    WHERE id = OLD.poll_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$function$;

-- Update award_points (already has search_path = '', changing to public)
CREATE OR REPLACE FUNCTION public.award_points(p_user_id uuid, p_points integer, p_description text, p_source text, p_reference_id uuid DEFAULT NULL::uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  current_points integer;
BEGIN
  IF p_user_id IS DISTINCT FROM auth.uid() THEN
    RETURN false;
  END IF;

  IF p_reference_id IS NOT NULL THEN
    IF EXISTS (
      SELECT 1 FROM public.rewards_transactions rt
      WHERE rt.user_id = p_user_id
        AND rt.source = p_source
        AND rt.reference_id = p_reference_id
    ) THEN
      RETURN true;
    END IF;
  END IF;
  
  INSERT INTO public.rewards_transactions (
    user_id, transaction_type, points, description, source, reference_id
  ) VALUES (
    p_user_id, 'earn', p_points, p_description, p_source, p_reference_id
  );
  
  UPDATE public.rewards_points 
  SET 
    current_balance = current_balance + p_points,
    lifetime_earned = lifetime_earned + p_points,
    updated_at = now()
  WHERE user_id = p_user_id;
  
  IF p_points >= 500 THEN
    INSERT INTO public.user_achievements (
      user_id, achievement_type, achievement_data, points_awarded
    ) VALUES (
      p_user_id, 'major_point_earn', 
      jsonb_build_object('points', p_points, 'source', p_source),
      p_points
    );
  END IF;
  
  RETURN true;
EXCEPTION
  WHEN OTHERS THEN
    RETURN false;
END;
$function$;

-- Update update_updated_at_column (already has search_path = '', changing to public)
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$function$;

-- Update increment_vote_count (already has search_path = '', changing to public)
CREATE OR REPLACE FUNCTION public.increment_vote_count(application_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
    UPDATE career_applications 
    SET votes_count = votes_count + 1 
    WHERE id = application_id;
END;
$function$;

-- Update initialize_user_points (already has search_path = '', changing to public)
CREATE OR REPLACE FUNCTION public.initialize_user_points()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  INSERT INTO public.rewards_points (user_id, current_balance, lifetime_earned, lifetime_spent)
  VALUES (NEW.id, 0, 0, 0)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$function$;

-- Update update_poll_vote_count (already has search_path = '', changing to public)
CREATE OR REPLACE FUNCTION public.update_poll_vote_count()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE poll_options 
    SET votes_count = votes_count + 1 
    WHERE id = NEW.option_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE poll_options 
    SET votes_count = votes_count - 1 
    WHERE id = OLD.option_id;
    RETURN OLD;
  ELSIF TG_OP = 'UPDATE' THEN
    UPDATE poll_options 
    SET votes_count = votes_count - 1 
    WHERE id = OLD.option_id;
    UPDATE poll_options 
    SET votes_count = votes_count + 1 
    WHERE id = NEW.option_id;
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$function$;

-- Update process_redemption (already has search_path = '', changing to public)
CREATE OR REPLACE FUNCTION public.process_redemption(p_user_id uuid, p_catalog_item_id uuid, p_request_data jsonb DEFAULT '{}'::jsonb)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  points_required INTEGER;
  current_balance INTEGER;
  redemption_id UUID;
BEGIN
  SELECT points_required INTO points_required 
  FROM public.rewards_catalog 
  WHERE id = p_catalog_item_id AND is_active = true;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Catalog item not found or inactive';
  END IF;
  
  SELECT current_balance INTO current_balance 
  FROM public.rewards_points 
  WHERE user_id = p_user_id;
  
  IF current_balance < points_required THEN
    RAISE EXCEPTION 'Insufficient points balance';
  END IF;
  
  INSERT INTO public.redemption_requests (
    user_id, catalog_item_id, points_spent, request_data
  ) VALUES (
    p_user_id, p_catalog_item_id, points_required, p_request_data
  ) RETURNING id INTO redemption_id;
  
  UPDATE public.rewards_points 
  SET 
    current_balance = current_balance - points_required,
    lifetime_spent = lifetime_spent + points_required,
    updated_at = now()
  WHERE user_id = p_user_id;
  
  INSERT INTO public.rewards_transactions (
    user_id, transaction_type, points, description, source, reference_id
  ) VALUES (
    p_user_id, 'spend', -points_required, 
    'Redemption: ' || (SELECT name FROM public.rewards_catalog WHERE id = p_catalog_item_id),
    'redemption', redemption_id
  );
  
  RETURN redemption_id;
END;
$function$;

-- Update get_paginated_jobs (already has search_path = '', changing to public)
CREATE OR REPLACE FUNCTION public.get_paginated_jobs(p_limit integer DEFAULT 20, p_offset integer DEFAULT 0, p_search_term text DEFAULT NULL::text, p_location text DEFAULT NULL::text, p_job_type text DEFAULT NULL::text)
RETURNS TABLE(id uuid, title text, company_name text, location text, description text, job_type text, created_at timestamp with time zone, total_count bigint)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    j.id,
    j.title,
    COALESCE(c.name, 'Company') as company_name,
    j.location,
    j.description,
    j.job_type::TEXT,
    j.created_at,
    COUNT(*) OVER() as total_count
  FROM jobs j
  LEFT JOIN companies c ON j.company_id = c.id
  WHERE 
    j.is_active = true
    AND (p_search_term IS NULL OR 
         to_tsvector('english', j.title || ' ' || j.description) @@ plainto_tsquery('english', p_search_term))
    AND (p_location IS NULL OR j.location ILIKE '%' || p_location || '%')
    AND (p_job_type IS NULL OR j.job_type::TEXT = p_job_type)
  ORDER BY j.created_at DESC
  LIMIT p_limit
  OFFSET p_offset;
END;
$function$;