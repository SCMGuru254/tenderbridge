-- Create courses system for advertising training courses
CREATE TABLE course_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instructor_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category_id UUID REFERENCES course_categories(id),
  price DECIMAL(10,2),
  duration_hours INTEGER,
  level TEXT CHECK (level IN ('beginner', 'intermediate', 'advanced')) DEFAULT 'beginner',
  format TEXT CHECK (format IN ('online', 'offline', 'hybrid')) DEFAULT 'online',
  location TEXT,
  max_students INTEGER,
  current_students INTEGER DEFAULT 0,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  registration_deadline TIMESTAMP WITH TIME ZONE,
  status TEXT CHECK (status IN ('draft', 'published', 'full', 'completed', 'cancelled')) DEFAULT 'draft',
  requirements TEXT[],
  objectives TEXT[],
  materials_included TEXT[],
  certificate_provided BOOLEAN DEFAULT false,
  contact_email TEXT,
  contact_phone TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE course_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  student_id UUID NOT NULL,
  enrollment_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  status TEXT CHECK (status IN ('enrolled', 'completed', 'dropped', 'refunded')) DEFAULT 'enrolled',
  payment_status TEXT CHECK (payment_status IN ('pending', 'paid', 'refunded')) DEFAULT 'pending',
  completion_date TIMESTAMP WITH TIME ZONE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  review TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(course_id, student_id)
);

-- Enable RLS
ALTER TABLE course_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_enrollments ENABLE ROW LEVEL SECURITY;

-- Course categories policies (public read)
CREATE POLICY "Anyone can view course categories" ON course_categories FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create categories" ON course_categories FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Courses policies
CREATE POLICY "Anyone can view published courses" ON courses FOR SELECT USING (status = 'published' OR instructor_id = auth.uid());
CREATE POLICY "Instructors can create courses" ON courses FOR INSERT WITH CHECK (auth.uid() = instructor_id);
CREATE POLICY "Instructors can update their courses" ON courses FOR UPDATE USING (auth.uid() = instructor_id);
CREATE POLICY "Instructors can delete their courses" ON courses FOR DELETE USING (auth.uid() = instructor_id);

-- Course enrollments policies
CREATE POLICY "Students can view their enrollments" ON course_enrollments FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "Instructors can view enrollments for their courses" ON course_enrollments FOR SELECT USING (
  auth.uid() IN (SELECT instructor_id FROM courses WHERE id = course_enrollments.course_id)
);
CREATE POLICY "Students can enroll in courses" ON course_enrollments FOR INSERT WITH CHECK (auth.uid() = student_id);
CREATE POLICY "Students can update their enrollments" ON course_enrollments FOR UPDATE USING (auth.uid() = student_id);

-- Add triggers for updated_at
CREATE TRIGGER update_course_categories_updated_at BEFORE UPDATE ON course_categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_course_enrollments_updated_at BEFORE UPDATE ON course_enrollments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert some default course categories
INSERT INTO course_categories (name, description) VALUES
('Supply Chain Management', 'Comprehensive courses on supply chain planning, execution, and optimization'),
('Logistics & Transportation', 'Courses covering logistics operations, transportation management, and distribution'),
('Procurement & Sourcing', 'Training on strategic sourcing, vendor management, and procurement processes'),
('Inventory Management', 'Courses on inventory optimization, demand planning, and warehouse management'),
('Digital Supply Chain', 'Modern technology applications including IoT, blockchain, and AI in supply chain'),
('Sustainability', 'Green supply chain practices, circular economy, and sustainable operations'),
('Leadership & Management', 'Supply chain leadership, team management, and strategic decision making'),
('Analytics & Data Science', 'Data analytics, forecasting, and business intelligence for supply chain');