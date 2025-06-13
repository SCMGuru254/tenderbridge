-- Add professional networking core features

-- Create professional_connections table
CREATE TABLE public.professional_connections (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    requestor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    target_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    status TEXT NOT NULL CHECK (status IN ('pending', 'accepted', 'rejected', 'blocked')),
    connection_level INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(requestor_id, target_id)
);

-- Create skill_endorsements table
CREATE TABLE public.skill_endorsements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    endorser_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    endorsed_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    skill TEXT NOT NULL,
    level INTEGER CHECK (level BETWEEN 1 AND 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(endorser_id, endorsed_id, skill)
);

-- Create professional_recommendations table
CREATE TABLE public.professional_recommendations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    recommender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    recommended_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    relationship TEXT NOT NULL,
    duration TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('pending', 'published', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add network_strength column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS network_strength INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS skills TEXT[] DEFAULT '{}';

-- Create indexes for better performance
CREATE INDEX idx_connections_requestor ON public.professional_connections(requestor_id);
CREATE INDEX idx_connections_target ON public.professional_connections(target_id);
CREATE INDEX idx_connections_status ON public.professional_connections(status);
CREATE INDEX idx_endorsements_endorsed ON public.skill_endorsements(endorsed_id);
CREATE INDEX idx_endorsements_skill ON public.skill_endorsements(skill);
CREATE INDEX idx_recommendations_recommended ON public.professional_recommendations(recommended_id);

-- Enable Row Level Security
ALTER TABLE public.professional_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_endorsements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professional_recommendations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for professional_connections
CREATE POLICY "Users can view their own connections"
    ON public.professional_connections
    FOR SELECT
    USING (auth.uid() IN (requestor_id, target_id));

CREATE POLICY "Users can create connection requests"
    ON public.professional_connections
    FOR INSERT
    WITH CHECK (auth.uid() = requestor_id);

CREATE POLICY "Users can update their connection status"
    ON public.professional_connections
    FOR UPDATE
    USING (auth.uid() IN (requestor_id, target_id));

-- RLS Policies for skill_endorsements
CREATE POLICY "Anyone can view endorsements"
    ON public.skill_endorsements
    FOR SELECT
    USING (true);

CREATE POLICY "Users can create endorsements"
    ON public.skill_endorsements
    FOR INSERT
    WITH CHECK (auth.uid() = endorser_id);

-- RLS Policies for professional_recommendations
CREATE POLICY "Anyone can view published recommendations"
    ON public.professional_recommendations
    FOR SELECT
    USING (status = 'published' OR auth.uid() IN (recommender_id, recommended_id));

CREATE POLICY "Users can create recommendations"
    ON public.professional_recommendations
    FOR INSERT
    WITH CHECK (auth.uid() = recommender_id);

CREATE POLICY "Recipients can update recommendation status"
    ON public.professional_recommendations
    FOR UPDATE
    USING (auth.uid() = recommended_id);

-- Functions for network operations

-- Function to calculate connection degree
CREATE OR REPLACE FUNCTION calculate_connection_degree(user_id_1 UUID, user_id_2 UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    degree INTEGER;
BEGIN
    -- Direct connection
    IF EXISTS (
        SELECT 1 FROM professional_connections 
        WHERE status = 'accepted' 
        AND ((requestor_id = user_id_1 AND target_id = user_id_2)
        OR (requestor_id = user_id_2 AND target_id = user_id_1))
    ) THEN
        RETURN 1;
    END IF;

    -- Second-degree connection
    IF EXISTS (
        SELECT 1 FROM professional_connections c1
        JOIN professional_connections c2 ON 
            (c1.target_id = c2.requestor_id OR c1.target_id = c2.target_id OR
             c1.requestor_id = c2.requestor_id OR c1.requestor_id = c2.target_id)
        WHERE c1.status = 'accepted' AND c2.status = 'accepted'
        AND (
            (c1.requestor_id = user_id_1 OR c1.target_id = user_id_1)
            AND (c2.requestor_id = user_id_2 OR c2.target_id = user_id_2)
        )
    ) THEN
        RETURN 2;
    END IF;

    -- Third-degree connection
    IF EXISTS (
        SELECT 1 FROM professional_connections c1
        JOIN professional_connections c2 ON 
            (c1.target_id = c2.requestor_id OR c1.target_id = c2.target_id)
        JOIN professional_connections c3 ON
            (c2.target_id = c3.requestor_id OR c2.target_id = c3.target_id)
        WHERE c1.status = 'accepted' AND c2.status = 'accepted' AND c3.status = 'accepted'
        AND c1.requestor_id = user_id_1 AND 
            (c3.requestor_id = user_id_2 OR c3.target_id = user_id_2)
    ) THEN
        RETURN 3;
    END IF;

    RETURN NULL;
END;
$$;

-- Function to update network strength
CREATE OR REPLACE FUNCTION update_network_strength()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Update network strength for both users
    IF TG_OP = 'INSERT' AND NEW.status = 'accepted' THEN
        -- Increase network strength
        UPDATE profiles 
        SET network_strength = network_strength + 1
        WHERE id IN (NEW.requestor_id, NEW.target_id);
    ELSIF TG_OP = 'UPDATE' AND NEW.status = 'accepted' AND OLD.status != 'accepted' THEN
        -- Increase network strength
        UPDATE profiles 
        SET network_strength = network_strength + 1
        WHERE id IN (NEW.requestor_id, NEW.target_id);
    ELSIF TG_OP = 'DELETE' OR (TG_OP = 'UPDATE' AND NEW.status != 'accepted' AND OLD.status = 'accepted') THEN
        -- Decrease network strength
        UPDATE profiles 
        SET network_strength = GREATEST(0, network_strength - 1)
        WHERE id IN (OLD.requestor_id, OLD.target_id);
    END IF;
    
    RETURN NEW;
END;
$$;

-- Create trigger for network strength updates
CREATE TRIGGER update_network_strength_trigger
AFTER INSERT OR UPDATE OR DELETE ON professional_connections
FOR EACH ROW
EXECUTE FUNCTION update_network_strength();

-- Function to get connection suggestions
CREATE OR REPLACE FUNCTION get_connection_suggestions(user_id_param UUID, limit_param INTEGER DEFAULT 10)
RETURNS TABLE (
    suggested_user_id UUID,
    full_name TEXT,
    position TEXT,
    company TEXT,
    common_connections INTEGER,
    common_skills INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    WITH user_connections AS (
        SELECT DISTINCT 
            CASE 
                WHEN requestor_id = user_id_param THEN target_id
                ELSE requestor_id
            END AS connected_user_id
        FROM professional_connections
        WHERE (requestor_id = user_id_param OR target_id = user_id_param)
        AND status = 'accepted'
    ),
    user_skills AS (
        SELECT UNNEST(skills) as skill
        FROM profiles
        WHERE id = user_id_param
    ),
    potential_connections AS (
        SELECT DISTINCT
            p.id as suggested_user_id,
            p.full_name,
            p.position,
            p.company,
            COUNT(DISTINCT uc2.connected_user_id) as common_connections,
            COUNT(DISTINCT CASE WHEN us.skill = ANY(p.skills) THEN us.skill END) as common_skills
        FROM profiles p
        LEFT JOIN professional_connections pc ON 
            (pc.requestor_id = p.id AND pc.target_id = user_id_param)
            OR (pc.target_id = p.id AND pc.requestor_id = user_id_param)
        LEFT JOIN user_connections uc1 ON p.id = uc1.connected_user_id
        LEFT JOIN professional_connections pc2 ON 
            (pc2.requestor_id = p.id OR pc2.target_id = p.id)
            AND pc2.status = 'accepted'
        LEFT JOIN user_connections uc2 ON 
            (pc2.requestor_id = uc2.connected_user_id OR pc2.target_id = uc2.connected_user_id)
        LEFT JOIN user_skills us ON true
        WHERE p.id != user_id_param
        AND uc1.connected_user_id IS NULL
        AND pc.id IS NULL
        GROUP BY p.id, p.full_name, p.position, p.company
        ORDER BY common_connections DESC, common_skills DESC
        LIMIT limit_param
    )
    SELECT * FROM potential_connections;
END;
$$;
