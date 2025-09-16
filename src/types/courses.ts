export interface CourseCategory {
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface Course {
  id: string;
  instructor_id: string;
  title: string;
  description: string;
  category_id: string;
  price: number;
  duration_hours: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  format: 'online' | 'offline' | 'hybrid';
  location: string;
  max_students: number;
  current_students: number;
  start_date: string;
  end_date: string;
  registration_deadline: string;
  status: 'draft' | 'published' | 'full' | 'completed' | 'cancelled';
  requirements: string[];
  objectives: string[];
  materials_included: string[];
  certificate_provided: boolean;
  contact_email: string;
  contact_phone: string;
  image_url: string;
  created_at: string;
  updated_at: string;
  course_categories?: CourseCategory;
  profiles?: {
    full_name: string;
    avatar_url: string;
  };
}

export interface CourseEnrollment {
  id: string;
  course_id: string;
  student_id: string;
  enrollment_date: string;
  status: 'enrolled' | 'completed' | 'dropped' | 'refunded';
  payment_status: 'pending' | 'paid' | 'refunded';
  completion_date: string;
  rating: number;
  review: string;
  created_at: string;
  updated_at: string;
  course?: Course;
}