import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import { CoursePaymentModal } from '@/components/payments/CoursePaymentModal';

const eventSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  event_type: z.enum(['webinar', 'workshop', 'conference', 'seminar', 'training']),
  category_id: z.string().optional(),
  start_date: z.string().min(1, 'Start date is required'),
  end_date: z.string().min(1, 'End date is required'),
  is_online: z.boolean().default(false),
  location: z.string().optional(),
  meeting_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  max_attendees: z.number().min(1).max(10000),
  registration_deadline: z.string().optional(),
  price: z.number().min(0).default(0),
  image_url: z.string().url().optional().or(z.literal('')),
});

type EventFormValues = z.infer<typeof eventSchema>;

interface TrainingEventFormProps {
  onSuccess: () => void;
}

export function TrainingEventForm({ onSuccess }: TrainingEventFormProps) {
  const { user } = useAuth();
  const [isOnline, setIsOnline] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [createdEventId, setCreatedEventId] = useState<string | null>(null);
  const [eventDetails, setEventDetails] = useState<{ title: string; price: number } | null>(null);

  const { data: categories } = useQuery({
    queryKey: ['course-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('course_categories')
        .select('*')
        .eq('status', 'active')
        .order('name');
      if (error) throw error;
      return data;
    }
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue
  } = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      is_online: false,
      price: 0,
      max_attendees: 50
    }
  });

  const onSubmit = async (data: EventFormValues) => {
    if (!user) {
      toast.error('You must be signed in to create events');
      return;
    }

    try {
      // 1. Create the event first (Status: Pending Payment/Approval)
      const { data: eventData, error } = await supabase
        .from('training_events')
        .insert({
          organizer_id: user.id,
          title: data.title,
          description: data.description,
          event_type: data.event_type,
          category_id: data.category_id || null,
          start_date: data.start_date,
          end_date: data.end_date,
          is_online: data.is_online,
          location: data.location || null,
          meeting_url: data.meeting_url || null,
          max_attendees: data.max_attendees,
          registration_deadline: data.registration_deadline || null,
          price: data.price,
          image_url: data.image_url || null,
          status: 'upcoming', // Ideally 'pending_payment' if schema allowed
          current_attendees: 0
        })
        .select()
        .single();

      if (error) throw error;

      // 2. If Paid Event, Trigger Payment Flow
      if (data.price > 0) {
          setCreatedEventId(eventData.id);
          setEventDetails({ title: data.title, price: data.price });
          setPaymentModalOpen(true);
          // Don't call onSuccess() yet
      } else {
          // Free event logic
          toast.success('Training event created successfully!');
          onSuccess();
      }

    } catch (error: any) {
      console.error('Error creating event:', error);
      toast.error(error.message || 'Failed to create event');
    }
  };

  return (
    <>
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <Label htmlFor="title">Event Title *</Label>
        <Input
          id="title"
          {...register('title')}
          placeholder="e.g., Advanced Supply Chain Analytics Workshop"
        />
        {errors.title && (
          <p className="text-sm text-destructive mt-1">{errors.title.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          {...register('description')}
          placeholder="Describe what participants will learn and what to expect..."
          rows={4}
        />
        {errors.description && (
          <p className="text-sm text-destructive mt-1">{errors.description.message}</p>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="event_type">Event Type *</Label>
          <Select onValueChange={(value) => setValue('event_type', value as any)}>
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="webinar">Webinar</SelectItem>
              <SelectItem value="workshop">Workshop</SelectItem>
              <SelectItem value="conference">Conference</SelectItem>
              <SelectItem value="seminar">Seminar</SelectItem>
              <SelectItem value="training">Training</SelectItem>
            </SelectContent>
          </Select>
          {errors.event_type && (
            <p className="text-sm text-destructive mt-1">{errors.event_type.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="category_id">Category</Label>
          <Select onValueChange={(value) => setValue('category_id', value)}>
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
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="start_date">Start Date & Time *</Label>
          <Input
            id="start_date"
            type="datetime-local"
            {...register('start_date')}
          />
          {errors.start_date && (
            <p className="text-sm text-destructive mt-1">{errors.start_date.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="end_date">End Date & Time *</Label>
          <Input
            id="end_date"
            type="datetime-local"
            {...register('end_date')}
          />
          {errors.end_date && (
            <p className="text-sm text-destructive mt-1">{errors.end_date.message}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Switch
          id="is_online"
          checked={isOnline}
          onCheckedChange={(checked) => {
            setIsOnline(checked);
            setValue('is_online', checked);
          }}
        />
        <Label htmlFor="is_online">This is an online event</Label>
      </div>

      {isOnline ? (
        <div>
          <Label htmlFor="meeting_url">Meeting URL</Label>
          <Input
            id="meeting_url"
            type="url"
            {...register('meeting_url')}
            placeholder="https://zoom.us/j/..."
          />
          {errors.meeting_url && (
            <p className="text-sm text-destructive mt-1">{errors.meeting_url.message}</p>
          )}
        </div>
      ) : (
        <div>
          <Label htmlFor="location">Event Location *</Label>
          <Input
            id="location"
            {...register('location')}
            placeholder="e.g., Nairobi, Kenya or specific venue address"
          />
          {errors.location && (
            <p className="text-sm text-destructive mt-1">{errors.location.message}</p>
          )}
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="max_attendees">Max Attendees *</Label>
          <Input
            id="max_attendees"
            type="number"
            {...register('max_attendees', { valueAsNumber: true })}
          />
          {errors.max_attendees && (
            <p className="text-sm text-destructive mt-1">{errors.max_attendees.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="price">Price (KSH)</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            {...register('price', { valueAsNumber: true })}
            placeholder="0 for free"
          />
          {errors.price && (
            <p className="text-sm text-destructive mt-1">{errors.price.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="registration_deadline">Registration Deadline</Label>
          <Input
            id="registration_deadline"
            type="datetime-local"
            {...register('registration_deadline')}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="image_url">Event Image URL (optional)</Label>
        <Input
          id="image_url"
          type="url"
          {...register('image_url')}
          placeholder="https://example.com/event-image.jpg"
        />
        {errors.image_url && (
          <p className="text-sm text-destructive mt-1">{errors.image_url.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Processing...' : 'Create Training Event'}
      </Button>
    </form>

    <CoursePaymentModal 
        open={paymentModalOpen} 
        onOpenChange={setPaymentModalOpen}
        eventTitle={eventDetails?.title || ''}
        ticketPrice={eventDetails?.price || 0}
        eventId={createdEventId}
        onSuccess={() => {
            onSuccess();
        }}
    />
    </>
  );
}
