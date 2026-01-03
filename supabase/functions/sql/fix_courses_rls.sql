-- FIX: Enable Public Access to Courses for APK/Web
-- Addresses "Failed to load courses" error

-- 1. Courses Table
CREATE TABLE IF NOT EXISTS public.courses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    status TEXT DEFAULT 'draft',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public view published courses" ON public.courses;
CREATE POLICY "Public view published courses" ON public.courses
    FOR SELECT USING (status = 'published');

-- 2. Course Categories
CREATE TABLE IF NOT EXISTS public.course_categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL
);
ALTER TABLE public.course_categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public view categories" ON public.course_categories;
CREATE POLICY "Public view categories" ON public.course_categories
    FOR SELECT USING (true);

-- 3. Profiles (Instructors)
-- Ensure instructor profiles can be seen by the join query
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
    FOR SELECT USING (true);
