-- ADMIN VIDEO MANAGEMENT
-- Independent from Courses. Used for Ads, Tutorials, etc.

CREATE TABLE IF NOT EXISTS public.admin_videos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    video_url TEXT NOT NULL,
    thumbnail_url TEXT,
    category TEXT DEFAULT 'general', -- 'ad', 'tutorial', 'highlight'
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.admin_videos ENABLE ROW LEVEL SECURITY;

-- Policies
DROP POLICY IF EXISTS "Public view active videos" ON public.admin_videos;
CREATE POLICY "Public view active videos" ON public.admin_videos 
    FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Admins manage videos" ON public.admin_videos;
CREATE POLICY "Admins manage videos" ON public.admin_videos 
    FOR ALL TO authenticated 
    USING (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'));
