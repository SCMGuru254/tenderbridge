
-- Function to get profile views with viewer details
CREATE OR REPLACE FUNCTION public.get_profile_views(profile_id_param UUID)
RETURNS TABLE (
  id UUID,
  profile_id UUID,
  viewer_id UUID,
  viewer JSONB,
  viewed_at TIMESTAMPTZ
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    pv.id,
    pv.profile_id,
    pv.viewer_id,
    jsonb_build_object(
      'id', p.id,
      'full_name', p.full_name,
      'company', p.company,
      'avatar_url', p.avatar_url
    ) as viewer,
    pv.viewed_at
  FROM 
    profile_views pv
  JOIN 
    profiles p ON pv.viewer_id = p.id
  WHERE 
    pv.profile_id = profile_id_param
  ORDER BY 
    pv.viewed_at DESC;
END;
$$;

-- Function to get hiring decisions with employer details
CREATE OR REPLACE FUNCTION public.get_hiring_decisions(candidate_id_param UUID)
RETURNS TABLE (
  id UUID,
  employer_id UUID,
  candidate_id UUID,
  employer JSONB,
  decision_date DATE,
  notes TEXT,
  created_at TIMESTAMPTZ
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    hd.id,
    hd.employer_id,
    hd.candidate_id,
    jsonb_build_object(
      'id', p.id,
      'full_name', p.full_name,
      'company', p.company,
      'avatar_url', p.avatar_url
    ) as employer,
    hd.decision_date,
    hd.notes,
    hd.created_at
  FROM 
    hiring_decisions hd
  JOIN 
    profiles p ON hd.employer_id = p.id
  WHERE 
    hd.candidate_id = candidate_id_param
  ORDER BY 
    hd.created_at DESC;
END;
$$;

-- Function to record a profile view
CREATE OR REPLACE FUNCTION public.record_profile_view(
  profile_id_param UUID,
  viewer_id_param UUID
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO profile_views (profile_id, viewer_id)
  VALUES (profile_id_param, viewer_id_param);
END;
$$;

-- Function to record a hiring decision
CREATE OR REPLACE FUNCTION public.record_hiring_decision(
  employer_id_param UUID,
  candidate_id_param UUID,
  decision_date_param DATE,
  notes_param TEXT DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO hiring_decisions (employer_id, candidate_id, decision_date, notes)
  VALUES (employer_id_param, candidate_id_param, decision_date_param, notes_param);
END;
$$;
