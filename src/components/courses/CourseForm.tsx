import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { CalendarIcon } from 'lucide-react';

interface CourseFormProps {
  onSuccess: () => void;
}

interface CourseFormData {
  title: string;
  description: string;
  category_id: string;
  price: string;
  duration_hours: string;
  level: string;
  format: string;
  location: string;
  max_students: string;
  start_date: string;
  end_date: string;
  registration_deadline: string;
  requirements: string;
  objectives: string;
  materials_included: string;
  certificate_provided: boolean;
  contact_email: string;
  contact_phone: string;
  image_url: string;
}

export function CourseForm({ onSuccess }: CourseFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<CourseFormData>({
    title: '',
    description: '',
    category_id: '',
    price: '',
    duration_hours: '',
    level: 'beginner',
    format: 'online',
    location: '',
    max_students: '',
    start_date: '',
    end_date: '',
    registration_deadline: '',
    requirements: '',
    objectives: '',
    materials_included: '',
    certificate_provided: false,
    contact_email: '',
    contact_phone: '',
    image_url: ''
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error('Please sign in to create a course');
      return;
    }

    if (!formData.title.trim() || !formData.description.trim()) {
      toast.error('Title and description are required');
      return;
    }

    setIsSubmitting(true);

    try {
      const courseData = {
        instructor_id: user.id,
        title: formData.title.trim(),
        description: formData.description.trim(),
        category_id: formData.category_id || null,
        price: formData.price ? parseFloat(formData.price) : null,
        duration_hours: formData.duration_hours ? parseInt(formData.duration_hours) : null,
        level: formData.level,
        format: formData.format,
        location: formData.location.trim() || null,
        max_students: formData.max_students ? parseInt(formData.max_students) : null,
        start_date: formData.start_date || null,
        end_date: formData.end_date || null,
        registration_deadline: formData.registration_deadline || null,
        requirements: formData.requirements ? formData.requirements.split('\n').filter(r => r.trim()) : [],
        objectives: formData.objectives ? formData.objectives.split('\n').filter(o => o.trim()) : [],
        materials_included: formData.materials_included ? formData.materials_included.split('\n').filter(m => m.trim()) : [],
        certificate_provided: formData.certificate_provided,
        contact_email: formData.contact_email.trim() || null,
        contact_phone: formData.contact_phone.trim() || null,
        image_url: formData.image_url.trim() || null,
        status: 'published'
      };

      const { error } = await supabase
        .from('courses')
        .insert(courseData);

      if (error) throw error;

      onSuccess();
    } catch (error) {
      console.error('Error creating course:', error);
      toast.error('Failed to create course. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateFormData = (field: keyof CourseFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Course Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => updateFormData('title', e.target.value)}
              placeholder="Advanced Supply Chain Analytics"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => updateFormData('description', e.target.value)}
              placeholder="Describe what students will learn..."
              rows={4}
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Category</Label>
              <Select value={formData.category_id} onValueChange={(value) => updateFormData('category_id', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories?.map(category => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="level">Level</Label>
              <Select value={formData.level} onValueChange={(value) => updateFormData('level', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Course Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="price">Price (USD)</Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) => updateFormData('price', e.target.value)}
                placeholder="99.99"
              />
            </div>

            <div>
              <Label htmlFor="duration">Duration (hours)</Label>
              <Input
                id="duration"
                type="number"
                min="1"
                value={formData.duration_hours}
                onChange={(e) => updateFormData('duration_hours', e.target.value)}
                placeholder="20"
              />
            </div>

            <div>
              <Label htmlFor="max_students">Max Students</Label>
              <Input
                id="max_students"
                type="number"
                min="1"
                value={formData.max_students}
                onChange={(e) => updateFormData('max_students', e.target.value)}
                placeholder="50"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="format">Format</Label>
              <Select value={formData.format} onValueChange={(value) => updateFormData('format', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="online">Online</SelectItem>
                  <SelectItem value="offline">In-Person</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => updateFormData('location', e.target.value)}
                placeholder="Nairobi, Kenya or Online"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Schedule</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="start_date">Start Date</Label>
              <Input
                id="start_date"
                type="datetime-local"
                value={formData.start_date}
                onChange={(e) => updateFormData('start_date', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="end_date">End Date</Label>
              <Input
                id="end_date"
                type="datetime-local"
                value={formData.end_date}
                onChange={(e) => updateFormData('end_date', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="registration_deadline">Registration Deadline</Label>
              <Input
                id="registration_deadline"
                type="datetime-local"
                value={formData.registration_deadline}
                onChange={(e) => updateFormData('registration_deadline', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Additional Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="requirements">Requirements (one per line)</Label>
            <Textarea
              id="requirements"
              value={formData.requirements}
              onChange={(e) => updateFormData('requirements', e.target.value)}
              placeholder="Basic knowledge of supply chain principles&#10;Laptop with internet connection"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="objectives">Learning Objectives (one per line)</Label>
            <Textarea
              id="objectives"
              value={formData.objectives}
              onChange={(e) => updateFormData('objectives', e.target.value)}
              placeholder="Understand advanced analytics techniques&#10;Apply data science to supply chain optimization"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="materials">Materials Included (one per line)</Label>
            <Textarea
              id="materials"
              value={formData.materials_included}
              onChange={(e) => updateFormData('materials_included', e.target.value)}
              placeholder="Course slides and recordings&#10;Excel templates&#10;Case study materials"
              rows={3}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="contact_email">Contact Email</Label>
              <Input
                id="contact_email"
                type="email"
                value={formData.contact_email}
                onChange={(e) => updateFormData('contact_email', e.target.value)}
                placeholder="instructor@example.com"
              />
            </div>

            <div>
              <Label htmlFor="contact_phone">Contact Phone</Label>
              <Input
                id="contact_phone"
                value={formData.contact_phone}
                onChange={(e) => updateFormData('contact_phone', e.target.value)}
                placeholder="+254 700 000 000"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="image_url">Course Image URL</Label>
            <Input
              id="image_url"
              type="url"
              value={formData.image_url}
              onChange={(e) => updateFormData('image_url', e.target.value)}
              placeholder="https://example.com/course-image.jpg"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="certificate"
              checked={formData.certificate_provided}
              onCheckedChange={(checked) => updateFormData('certificate_provided', checked as boolean)}
            />
            <Label htmlFor="certificate">Provide completion certificate</Label>
          </div>
        </CardContent>
      </Card>

      <div className="bg-muted/50 p-4 rounded-lg">
        <h4 className="font-medium mb-2">Important Notice</h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• All courses are reviewed before being published</li>
          <li>• You are responsible for delivering the course as described</li>
          <li>• Student payments will be processed through the platform</li>
          <li>• A platform fee may apply to course sales</li>
        </ul>
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="submit" disabled={isSubmitting} className="flex-1">
          {isSubmitting ? 'Creating Course...' : 'Create Course'}
        </Button>
      </div>
    </form>
  );
}