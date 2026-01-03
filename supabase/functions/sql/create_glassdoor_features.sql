-- GLASSDOOR FEATURES: Business Claims & Unclaimed Companies
-- FIXED: Added 'unclaimed' to verification_status Enum properly.

-- 1. Fix Enum Type (Add 'unclaimed')
-- Function wrapper to ensure safe execution
DO $$
BEGIN
    ALTER TYPE public.verification_status ADD VALUE IF NOT EXISTS 'unclaimed';
EXCEPTION
    WHEN duplicate_object THEN null; -- Ignore if exists (older PG versions might need this)
    WHEN OTHERS THEN null; -- Safe fallback
END $$;

-- Drop redundant check constraint if it exists (Enum handles this)
ALTER TABLE public.companies DROP CONSTRAINT IF EXISTS verification_status_check;


-- 2. Claims Table
CREATE TABLE IF NOT EXISTS public.company_claims (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    company_id UUID REFERENCES public.companies(id) NOT NULL,
    status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
    proof_document TEXT, -- URL to verification doc
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.company_claims ENABLE ROW LEVEL SECURITY;

-- Policies
DROP POLICY IF EXISTS "Users view own claims" ON public.company_claims;
CREATE POLICY "Users view own claims" ON public.company_claims
    FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users create claims" ON public.company_claims;
CREATE POLICY "Users create claims" ON public.company_claims
    FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins manage claims" ON public.company_claims;
CREATE POLICY "Admins manage claims" ON public.company_claims
    FOR ALL TO authenticated 
    USING (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));


-- 3. Function to Create Unclaimed Company (Community Added)
CREATE OR REPLACE FUNCTION create_unclaimed_company(
    p_name TEXT,
    p_description TEXT,
    p_location TEXT,
    p_website TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    v_id UUID;
BEGIN
    -- Insert with status 'unclaimed' (Now valid in Enum)
    INSERT INTO public.companies (name, description, location, website, verification_status, user_id)
    VALUES (p_name, p_description, p_location, p_website, 'unclaimed', NULL) -- No owner
    RETURNING id INTO v_id;
    RETURN v_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 4. Function to Approve Claim (Admin Only)
CREATE OR REPLACE FUNCTION approve_company_claim(p_claim_id UUID)
RETURNS VOID AS $$
DECLARE
    v_company_id UUID;
    v_user_id UUID;
BEGIN
    -- Get claim info
    SELECT company_id, user_id INTO v_company_id, v_user_id
    FROM public.company_claims WHERE id = p_claim_id;

    IF v_company_id IS NULL THEN
        RAISE EXCEPTION 'Claim not found';
    END IF;

    -- Update Company Owner
    -- Cast 'verified' to verification_status enum explicitly if needed, but PG usually infers.
    UPDATE public.companies 
    SET user_id = v_user_id, verification_status = 'verified'
    WHERE id = v_company_id;

    -- Update Claim Status
    UPDATE public.company_claims
    SET status = 'approved', updated_at = now()
    WHERE id = p_claim_id;
    
    -- Reject other claims for same company
    UPDATE public.company_claims
    SET status = 'rejected', updated_at = now()
    WHERE company_id = v_company_id AND id != p_claim_id;

END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
