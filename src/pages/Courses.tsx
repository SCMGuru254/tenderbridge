import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Search, Calendar, Users, DollarSign, Clock, MapPin } from 'lucide-react';
import { CourseForm } from '@/components/courses/CourseForm';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';

interface Course {
  id: string;
  title: string;
  description: string;
  instructor_id: string;
  price: number;
  duration_hours: number;
  level: string;
  format: string;
  location: string;
  max_students: number;
  current_students: number;
  start_date: string;
  registration_deadline: string;
  status: string;
  certificate_provided: boolean;
  contact_email: string;
  image_url: string;
  created_at: string;
  course_categories: {
    name: string;
  };
  profiles: {
    full_name: string;
    avatar_url: string;
  };
}

export default function Courses() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [levelFilter, setLevelFilter] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);

  const { data: courses, isLoading, refetch } = useQuery({
    queryKey: ['courses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('courses')
        .select(`
          *,
          course_categories(name),
          profiles:instructor_id(full_name, avatar_url)
        `)
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      if (error) {
        toast.error('Failed to load courses');
        throw error;
      }
      return data as Course[];
    }
  });

  const { data: categories } = useQuery({
    queryKey: ['course-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('course_categories')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data;
    }
  });

  const filteredCourses = courses?.filter(course => {
    const matchesSearch = !searchTerm || 
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !categoryFilter || course.course_categories?.name === categoryFilter;
    const matchesLevel = !levelFilter || course.level === levelFilter;
    
    return matchesSearch && matchesCategory && matchesLevel;
  });

  const handleCourseCreated = () => {
    setIsFormOpen(false);
    refetch();
    toast.success('Course created successfully!');
  };

  const handleEnroll = async (courseId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please sign in to enroll in courses');
        return;
      }

      const { error } = await supabase
        .from('course_enrollments')
        .insert({
          course_id: courseId,
          student_id: user.id,
          status: 'enrolled',
          payment_status: 'pending'
        });

      if (error) {
        if (error.code === '23505') {
          toast.error('You are already enrolled in this course');
        } else {
          throw error;
        }
      } else {
        toast.success('Successfully enrolled! Check your email for payment details.');
        refetch();
      }
    } catch (error) {
      console.error('Enrollment error:', error);
      toast.error('Failed to enroll in course');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Supply Chain Courses</h1>
          <p className="text-muted-foreground">
            Advance your career with professional training courses from industry experts
          </p>
        </div>
        
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Offer a Course
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Course</DialogTitle>
            </DialogHeader>
            <CourseForm onSuccess={handleCourseCreated} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Categories</SelectItem>
            {categories?.map(category => (
              <SelectItem key={category.id} value={category.name}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={levelFilter} onValueChange={setLevelFilter}>
          <SelectTrigger className="w-full md:w-[150px]">
            <SelectValue placeholder="Level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Levels</SelectItem>
            <SelectItem value="beginner">Beginner</SelectItem>
            <SelectItem value="intermediate">Intermediate</SelectItem>
            <SelectItem value="advanced">Advanced</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Course Grid */}
      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-48 bg-muted rounded-t-lg"></div>
              <CardContent className="p-6">
                <div className="h-6 bg-muted rounded mb-2"></div>
                <div className="h-4 bg-muted rounded mb-4"></div>
                <div className="flex gap-2 mb-4">
                  <div className="h-6 bg-muted rounded w-16"></div>
                  <div className="h-6 bg-muted rounded w-20"></div>
                </div>
                <div className="h-10 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses?.map(course => (
            <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                {course.image_url ? (
                  <img src={course.image_url} alt={course.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="text-4xl">📚</div>
                )}
              </div>
              
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-lg line-clamp-2">{course.title}</h3>
                  <Badge variant="outline" className="ml-2 shrink-0">
                    {course.level}
                  </Badge>
                </div>
                
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                  {course.description}
                </p>

                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs">
                    👨‍🏫
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {course.profiles?.full_name || 'Anonymous Instructor'}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">
                      {course.price ? `$${course.price}` : 'Free'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{course.duration_hours}h duration</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{course.current_students}/{course.max_students} enrolled</span>
                  </div>

                  {course.format !== 'online' && (
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{course.location}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Starts {formatDistanceToNow(new Date(course.start_date), { addSuffix: true })}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                  <Badge variant="secondary" className="text-xs">
                    {course.course_categories?.name}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {course.format}
                  </Badge>
                  {course.certificate_provided && (
                    <Badge variant="default" className="text-xs">
                      Certificate
                    </Badge>
                  )}
                </div>

                <Button 
                  onClick={() => handleEnroll(course.id)}
                  className="w-full"
                  disabled={course.current_students >= course.max_students}
                >
                  {course.current_students >= course.max_students ? 'Course Full' : 'Enroll Now'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {filteredCourses?.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-lg font-medium mb-2">No courses found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm || categoryFilter || levelFilter 
              ? "Try adjusting your filters" 
              : "Be the first to offer a course!"}
          </p>
          <Button onClick={() => setIsFormOpen(true)}>
            Offer a Course
          </Button>
        </div>
      )}
    </div>
  );
}