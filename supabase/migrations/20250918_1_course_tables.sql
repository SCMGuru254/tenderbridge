-- Create the base course_categories table
CREATE TABLE IF NOT EXISTS course_categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    icon_url TEXT,
    display_order INTEGER DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add parent_id column separately
DO $$ 
BEGIN 
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'course_categories' 
        AND column_name = 'parent_id'
    ) THEN
        ALTER TABLE course_categories ADD COLUMN parent_id UUID;
    END IF;
END $$;

-- Now add the self-referential constraint if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'fk_course_categories_parent'
    ) THEN
        ALTER TABLE course_categories 
        ADD CONSTRAINT fk_course_categories_parent 
        FOREIGN KEY (parent_id) 
        REFERENCES course_categories(id) 
        ON DELETE SET NULL;
    END IF;
END $$;

-- Create index for the parent_id column
CREATE INDEX IF NOT EXISTS idx_course_categories_parent ON course_categories(parent_id);

CREATE TABLE IF NOT EXISTS courses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    category_id UUID REFERENCES course_categories(id) ON DELETE SET NULL,
    instructor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    level TEXT CHECK (level IN ('beginner', 'intermediate', 'advanced', 'expert')),
    duration_hours INTEGER,
    price DECIMAL(10,2),
    is_published BOOLEAN DEFAULT false,
    enrollment_count INTEGER DEFAULT 0,
    rating DECIMAL(3,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS course_sections (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    order_number INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS course_lessons (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    section_id UUID REFERENCES course_sections(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    content TEXT,
    video_url TEXT,
    duration_minutes INTEGER,
    order_number INTEGER NOT NULL,
    is_preview BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS course_enrollments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE NOT NULL,
    student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    enrollment_date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    completion_date TIMESTAMP WITH TIME ZONE,
    progress_percentage DECIMAL(5,2) DEFAULT 0,
    last_accessed_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(course_id, student_id)
);

CREATE TABLE IF NOT EXISTS course_reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE NOT NULL,
    student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
    review_text TEXT,
    is_anonymous BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(course_id, student_id)
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_courses_category ON courses(category_id);
CREATE INDEX IF NOT EXISTS idx_courses_instructor ON courses(instructor_id);
CREATE INDEX IF NOT EXISTS idx_course_sections_course ON course_sections(course_id);
CREATE INDEX IF NOT EXISTS idx_course_lessons_section ON course_lessons(section_id);
CREATE INDEX IF NOT EXISTS idx_course_enrollments_course ON course_enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_course_enrollments_student ON course_enrollments(student_id);
CREATE INDEX IF NOT EXISTS idx_course_reviews_course ON course_reviews(course_id);
CREATE INDEX IF NOT EXISTS idx_course_reviews_student ON course_reviews(student_id);

-- Enable Row Level Security
ALTER TABLE course_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_reviews ENABLE ROW LEVEL SECURITY;

-- RLS Policies will be created at the end of the migration

-- Create update_updated_at_column function if it doesn't exist
DO $outer$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'update_updated_at_column') THEN
        CREATE OR REPLACE FUNCTION update_updated_at_column()
        RETURNS TRIGGER AS $inner$
        BEGIN
            NEW.updated_at = timezone('utc'::text, now());
            RETURN NEW;
        END;
        $inner$ language 'plpgsql';
    END IF;
END
$outer$;

-- Update triggers with existence checks
DO $$
BEGIN
    -- course_categories trigger
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger 
        WHERE tgname = 'update_course_categories_updated_at'
        AND tgrelid = 'course_categories'::regclass
    ) THEN
        CREATE TRIGGER update_course_categories_updated_at
            BEFORE UPDATE ON course_categories
            FOR EACH ROW
            EXECUTE PROCEDURE update_updated_at_column();
    END IF;

    -- courses trigger
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger 
        WHERE tgname = 'update_courses_updated_at'
        AND tgrelid = 'courses'::regclass
    ) THEN
        CREATE TRIGGER update_courses_updated_at
            BEFORE UPDATE ON courses
            FOR EACH ROW
            EXECUTE PROCEDURE update_updated_at_column();
    END IF;

    -- course_sections trigger
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger 
        WHERE tgname = 'update_course_sections_updated_at'
        AND tgrelid = 'course_sections'::regclass
    ) THEN
        CREATE TRIGGER update_course_sections_updated_at
            BEFORE UPDATE ON course_sections
            FOR EACH ROW
            EXECUTE PROCEDURE update_updated_at_column();
    END IF;

    -- course_lessons trigger
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger 
        WHERE tgname = 'update_course_lessons_updated_at'
        AND tgrelid = 'course_lessons'::regclass
    ) THEN
        CREATE TRIGGER update_course_lessons_updated_at
            BEFORE UPDATE ON course_lessons
            FOR EACH ROW
            EXECUTE PROCEDURE update_updated_at_column();
    END IF;

    -- course_reviews trigger
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger 
        WHERE tgname = 'update_course_reviews_updated_at'
        AND tgrelid = 'course_reviews'::regclass
    ) THEN
        CREATE TRIGGER update_course_reviews_updated_at
            BEFORE UPDATE ON course_reviews
            FOR EACH ROW
            EXECUTE PROCEDURE update_updated_at_column();
    END IF;
END$$;

-- Create all RLS policies after all tables are created
DO $$
BEGIN
    -- Course Categories Policies
    IF NOT EXISTS (
        SELECT 1 FROM pg_policy WHERE polname = 'course_categories_select_active'
    ) THEN
        CREATE POLICY "course_categories_select_active"
            ON course_categories FOR SELECT
            TO public
            USING (status = 'active');
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policy WHERE polname = 'course_categories_insert_admin'
    ) THEN
        CREATE POLICY "course_categories_insert_admin" 
            ON course_categories FOR INSERT 
            TO authenticated
            WITH CHECK (
                EXISTS (
                    SELECT 1 FROM user_roles ur 
                    WHERE ur.user_id = auth.uid() 
                    AND ur.role = 'admin'
                )
            );
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policy WHERE polname = 'course_categories_update_admin'
    ) THEN
        CREATE POLICY "course_categories_update_admin" 
            ON course_categories FOR UPDATE 
            TO authenticated
            USING (
                EXISTS (
                    SELECT 1 FROM user_roles ur 
                    WHERE ur.user_id = auth.uid() 
                    AND ur.role = 'admin'
                )
            )
            WITH CHECK (
                EXISTS (
                    SELECT 1 FROM user_roles ur 
                    WHERE ur.user_id = auth.uid() 
                    AND ur.role = 'admin'
                )
            );
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policy WHERE polname = 'course_categories_delete_admin'
    ) THEN
        CREATE POLICY "course_categories_delete_admin" 
            ON course_categories FOR DELETE 
            TO authenticated
            USING (
                EXISTS (
                    SELECT 1 FROM user_roles ur 
                    WHERE ur.user_id = auth.uid() 
                    AND ur.role = 'admin'
                )
            );
    END IF;

    -- Course Policies
    IF NOT EXISTS (
        SELECT 1 FROM pg_policy WHERE polname = 'courses_select_published'
    ) THEN
        CREATE POLICY "courses_select_published"
            ON courses FOR SELECT 
            TO public
            USING (is_published = true);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policy WHERE polname = 'courses_insert_instructor'
    ) THEN
        CREATE POLICY "courses_insert_instructor" 
            ON courses FOR INSERT 
            TO authenticated
            WITH CHECK (
                EXISTS (
                    SELECT 1 FROM user_roles ur 
                    WHERE ur.user_id = auth.uid() 
                    AND ur.role = 'instructor'
                ) AND (instructor_id = auth.uid())
            );
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policy WHERE polname = 'courses_update_instructor'
    ) THEN
        CREATE POLICY "courses_update_instructor" 
            ON courses FOR UPDATE 
            TO authenticated
            USING (
                EXISTS (
                    SELECT 1 FROM user_roles ur 
                    WHERE ur.user_id = auth.uid() 
                    AND ur.role = 'instructor'
                ) AND (instructor_id = auth.uid())
            )
            WITH CHECK (
                EXISTS (
                    SELECT 1 FROM user_roles ur 
                    WHERE ur.user_id = auth.uid() 
                    AND ur.role = 'instructor'
                ) AND (instructor_id = auth.uid())
            );
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policy WHERE polname = 'courses_delete_instructor'
    ) THEN
        CREATE POLICY "courses_delete_instructor" 
            ON courses FOR DELETE 
            TO authenticated
            USING (
                EXISTS (
                    SELECT 1 FROM user_roles ur 
                    WHERE ur.user_id = auth.uid() 
                    AND ur.role = 'instructor'
                ) AND (instructor_id = auth.uid())
            );
    END IF;
END$$;

-- Add remaining RLS policies for other tables
DO $$
BEGIN
    -- Course Sections Policies
    IF NOT EXISTS (
        SELECT 1 FROM pg_policy WHERE polname = 'course_sections_select_published'
    ) THEN
        CREATE POLICY "course_sections_select_published"
            ON course_sections FOR SELECT
            TO public
            USING (
                EXISTS (
                    SELECT 1 FROM courses c
                    WHERE c.id = course_sections.course_id
                    AND c.is_published = true
                )
            );
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policy WHERE polname = 'course_sections_manage_instructor'
    ) THEN
        CREATE POLICY "course_sections_manage_instructor"
            ON course_sections FOR ALL
            TO authenticated
            USING (
                EXISTS (
                    SELECT 1 FROM courses c
                    JOIN user_roles ur ON ur.user_id = auth.uid()
                    WHERE c.id = course_sections.course_id
                    AND c.instructor_id = auth.uid()
                    AND ur.role = 'instructor'
                )
            );
    END IF;

    -- Course Lessons Policies
    IF NOT EXISTS (
        SELECT 1 FROM pg_policy WHERE polname = 'course_lessons_select_enrolled'
    ) THEN
        CREATE POLICY "course_lessons_select_enrolled"
            ON course_lessons FOR SELECT
            TO public
            USING (
                EXISTS (
                    SELECT 1 FROM course_sections s
                    JOIN courses c ON c.id = s.course_id
                    LEFT JOIN course_enrollments e ON e.course_id = c.id
                    WHERE s.id = course_lessons.section_id
                    AND c.is_published = true
                    AND (course_lessons.is_preview = true OR e.student_id = auth.uid())
                )
            );
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policy WHERE polname = 'course_lessons_manage_instructor'
    ) THEN
        CREATE POLICY "course_lessons_manage_instructor"
            ON course_lessons FOR ALL
            TO authenticated
            USING (
                EXISTS (
                    SELECT 1 FROM course_sections s
                    JOIN courses c ON c.id = s.course_id
                    JOIN user_roles ur ON ur.user_id = auth.uid()
                    WHERE s.id = course_lessons.section_id
                    AND c.instructor_id = auth.uid()
                    AND ur.role = 'instructor'
                )
            );
    END IF;

    -- Course Enrollments Policies
    IF NOT EXISTS (
        SELECT 1 FROM pg_policy WHERE polname = 'course_enrollments_select_own'
    ) THEN
        CREATE POLICY "course_enrollments_select_own"
            ON course_enrollments FOR SELECT
            TO authenticated
            USING (student_id = auth.uid());
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policy WHERE polname = 'course_enrollments_insert_own'
    ) THEN
        CREATE POLICY "course_enrollments_insert_own"
            ON course_enrollments FOR INSERT
            TO authenticated
            WITH CHECK (student_id = auth.uid());
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policy WHERE polname = 'course_enrollments_update_own'
    ) THEN
        CREATE POLICY "course_enrollments_update_own"
            ON course_enrollments FOR UPDATE
            TO authenticated
            USING (student_id = auth.uid())
            WITH CHECK (student_id = auth.uid());
    END IF;

    -- Course Reviews Policies
    IF NOT EXISTS (
        SELECT 1 FROM pg_policy WHERE polname = 'course_reviews_select_all'
    ) THEN
        CREATE POLICY "course_reviews_select_all"
            ON course_reviews FOR SELECT
            TO public
            USING (true);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policy WHERE polname = 'course_reviews_insert_enrolled'
    ) THEN
        CREATE POLICY "course_reviews_insert_enrolled"
            ON course_reviews FOR INSERT
            TO authenticated
            WITH CHECK (
                EXISTS (
                    SELECT 1 FROM course_enrollments e
                    WHERE e.course_id = course_reviews.course_id
                    AND e.student_id = auth.uid()
                    AND e.student_id = course_reviews.student_id
                )
            );
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policy WHERE polname = 'course_reviews_update_own'
    ) THEN
        CREATE POLICY "course_reviews_update_own"
            ON course_reviews FOR UPDATE
            TO authenticated
            USING (student_id = auth.uid())
            WITH CHECK (student_id = auth.uid());
    END IF;
END$$;