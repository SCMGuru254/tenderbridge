-- Create user_roles table first
CREATE TABLE IF NOT EXISTS user_roles (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('recruiter', 'hr', 'job_seeker', 'employer')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, role)
);

-- Create connections table next
CREATE TABLE IF NOT EXISTS connections (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  user_id1 UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  user_id2 UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id1, user_id2)
);

-- Add RLS to connections table
ALTER TABLE connections ENABLE ROW LEVEL SECURITY;

-- Add policies for connections table
CREATE POLICY "Users can view their own connections" ON connections
  FOR SELECT USING (auth.uid() = user_id1 OR auth.uid() = user_id2);

CREATE POLICY "Users can create connections" ON connections
  FOR INSERT WITH CHECK (auth.uid() = user_id1);

CREATE POLICY "Users can update their own connections" ON connections
  FOR UPDATE USING (auth.uid() = user_id1 OR auth.uid() = user_id2);

-- Now add visibility settings to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS visibility text NOT NULL DEFAULT 'private' 
  CHECK (visibility IN ('private', 'connections', 'recruiters', 'public')),
ADD COLUMN IF NOT EXISTS visible_fields jsonb NOT NULL DEFAULT '["full_name", "position", "company"]'::jsonb,
ADD COLUMN IF NOT EXISTS allowed_roles text[] NOT NULL DEFAULT '{}';

-- Create the function for filtered profile data
CREATE OR REPLACE FUNCTION get_visible_profile_fields(
  viewer_id UUID,
  profile_record profiles,
  connection_status text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  is_recruiter boolean;
  is_hr boolean;
  is_connected boolean;
  visible_data jsonb;
BEGIN
  -- Check if viewer has recruiter or HR role
  SELECT EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = viewer_id 
    AND role IN ('recruiter', 'hr')
  ) INTO is_recruiter;

  -- Check if users are connected
  SELECT EXISTS (
    SELECT 1 FROM connections 
    WHERE (user_id1 = viewer_id AND user_id2 = profile_record.id 
           OR user_id2 = viewer_id AND user_id1 = profile_record.id)
    AND status = 'accepted'
  ) INTO is_connected;

  -- Initialize with basic public fields
  visible_data = jsonb_build_object(
    'id', profile_record.id,
    'full_name', profile_record.full_name,
    'avatar_url', profile_record.avatar_url
  );

  -- Handle different visibility levels
  CASE profile_record.visibility
    WHEN 'public' THEN
      visible_data = visible_data || jsonb_build_object(
        'position', profile_record.position,
        'company', profile_record.company,
        'bio', profile_record.bio
      );
    
    WHEN 'connections' THEN
      IF is_connected OR viewer_id = profile_record.id THEN
        visible_data = to_jsonb(profile_record);
      END IF;
    
    WHEN 'recruiters' THEN
      IF is_recruiter OR is_hr OR viewer_id = profile_record.id THEN
        visible_data = to_jsonb(profile_record);
      END IF;
    
    WHEN 'private' THEN
      IF viewer_id = profile_record.id THEN
        visible_data = to_jsonb(profile_record);
      END IF;
  END CASE;

  -- Always show full profile to the owner
  IF viewer_id = profile_record.id THEN
    visible_data = to_jsonb(profile_record);
  END IF;

  RETURN visible_data;
END;
$$;

-- Create secure view for profile access
CREATE OR REPLACE VIEW visible_profiles AS
SELECT 
  get_visible_profile_fields(auth.uid(), profiles.*) as profile_data
FROM profiles;

-- Update RLS policies for profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Allow users to view profiles based on visibility settings
CREATE POLICY "View profiles based on visibility" ON profiles
  FOR SELECT USING (
    CASE 
      WHEN visibility = 'public' THEN true
      WHEN visibility = 'connections' THEN EXISTS (
        SELECT 1 FROM connections 
        WHERE (user_id1 = auth.uid() AND user_id2 = profiles.id 
               OR user_id2 = auth.uid() AND user_id1 = profiles.id)
        AND status = 'accepted'
      )
      WHEN visibility = 'recruiters' THEN EXISTS (
        SELECT 1 FROM user_roles 
        WHERE user_id = auth.uid() 
        AND role IN ('recruiter', 'hr')
      )
      WHEN visibility = 'private' THEN auth.uid() = id
      ELSE false
    END
  );

-- Allow users to update their own profiles
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);
