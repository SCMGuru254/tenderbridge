-- Add social sharing reward points
-- This extends the existing reward system to support social actions

-- Add new transaction types for social actions
COMMENT ON COLUMN public.reward_transactions.transaction_type IS 
'Transaction types include: 
EARN_LOGIN (5 pts), 
EARN_JOB_APP (10 pts), 
EARN_PROFILE_COMPLETE (20 pts),
EARN_SHARE_JOB (10 pts),
EARN_FOLLOW_SOCIAL (5 pts),
EARN_REFERRAL (50 pts),
SPEND_CV_REVIEW (-100 pts), 
SPEND_REDEMPTION (-variable)';

-- Create function to increment share count properly
CREATE OR REPLACE FUNCTION increment_job_shares()
RETURNS TRIGGER AS $$
BEGIN
  -- Initialize social_shares if null
  IF NEW.social_shares IS NULL THEN
    NEW.social_shares := '{"count": 1}'::jsonb;
  ELSE
    NEW.social_shares := jsonb_set(
      NEW.social_shares,
      '{count}',
      to_jsonb(COALESCE((NEW.social_shares->>'count')::int, 0) + 1)
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- RPC function for awarding share points (callable from frontend)
CREATE OR REPLACE FUNCTION award_share_points(
  p_user_id UUID,
  p_job_id UUID,
  p_platform TEXT
)
RETURNS JSON AS $$
DECLARE
  v_points INTEGER := 10; -- Points per share
  v_transaction_id UUID;
BEGIN
  -- Check if user exists
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = p_user_id) THEN
    RETURN json_build_object('success', false, 'error', 'User not found');
  END IF;

  -- Create reward transaction
  INSERT INTO public.reward_transactions (user_id, amount, transaction_type, description)
  VALUES (
    p_user_id,
    v_points,
    'EARN_SHARE_JOB',
    format('Shared job on %s', p_platform)
  )
  RETURNING id INTO v_transaction_id;

  -- Return success
  RETURN json_build_object(
    'success', true,
    'points_earned', v_points,
    'transaction_id', v_transaction_id
  );
EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object(
      'success', false,
      'error', SQLERRM
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RPC function for following social media
CREATE OR REPLACE FUNCTION award_social_follow_points(
  p_user_id UUID,
  p_platform TEXT
)
RETURNS JSON AS $$
DECLARE
  v_points INTEGER := 5; -- Points per follow
  v_transaction_id UUID;
  v_already_followed BOOLEAN;
BEGIN
  -- Check if user exists
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = p_user_id) THEN
    RETURN json_build_object('success', false, 'error', 'User not found');
  END IF;

  -- Check if already rewarded for this platform
  SELECT EXISTS (
    SELECT 1 FROM public.reward_transactions
    WHERE user_id = p_user_id
    AND transaction_type = 'EARN_FOLLOW_SOCIAL'
    AND description LIKE '%' || p_platform || '%'
  ) INTO v_already_followed;

  IF v_already_followed THEN
    RETURN json_build_object('success', false, 'error', 'Already awarded for this platform');
  END IF;

  -- Create reward transaction
  INSERT INTO public.reward_transactions (user_id, amount, transaction_type, description)
  VALUES (
    p_user_id,
    v_points,
    'EARN_FOLLOW_SOCIAL',
    format('Followed us on %s', p_platform)
  )
  RETURNING id INTO v_transaction_id;

  -- Return success
  RETURN json_build_object(
    'success', true,
    'points_earned', v_points,
    'transaction_id', v_transaction_id
  );
EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object(
      'success', false,
      'error', SQLERRM
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION award_share_points(UUID, UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION award_social_follow_points(UUID, TEXT) TO authenticated;
