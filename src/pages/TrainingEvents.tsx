import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar, MapPin, Users, DollarSign, Video, Clock, Plus } from 'lucide-react';
import { TrainingEventForm } from '@/components/training/TrainingEventForm';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { useAuth } from '@/hooks/useAuth';

interface TrainingEvent {
  id: string;
  title: string;
  description: string;
  event_type: string;
  start_date: string;
  end_date: string;
  location: string;
  is_online: boolean;
  meeting_url: string;
  max_attendees: number;
  current_attendees: number;
  registration_deadline: string;
  price: number;
  image_url: string;
  status: string;
  course_categories: {
    name: string;
  };
  profiles: {
    full_name: string;
    avatar_url: string;
    company: string;
  };
}

export default function TrainingEvents() {
  const { user } = useAuth();
  const [isFormOpen, setIsFormOpen] = useState(false);

  const { data: events, isLoading, refetch } = useQuery({
    queryKey: ['training-events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('training_events')
        .select(`
          *,
          course_categories(name),
          profiles:organizer_id(full_name, avatar_url, company)
        `)
        .in('status', ['upcoming', 'ongoing'])
        .order('start_date', { ascending: true });

      if (error) {
        toast.error('Failed to load training events');
        throw error;
      }
      return data as TrainingEvent[];
    }
  });

  const handleEventCreated = () => {
    setIsFormOpen(false);
    refetch();
    toast.success('Training event created successfully!');
  };

  const handleRegister = async (eventId: string) => {
    if (!user) {
      toast.error('Please sign in to register for events');
      return;
    }

    try {
      const { error } = await supabase
        .from('event_registrations')
        .insert({
          event_id: eventId,
          user_id: user.id,
          payment_status: 'pending',
          attendance_status: 'registered'
        });

      if (error) {
        if (error.code === '23505') {
          toast.error('You are already registered for this event');
        } else {
          throw error;
        }
      } else {
        // Update attendee count
        await supabase.rpc('increment', {
          row_id: eventId,
          table_name: 'training_events',
          column_name: 'current_attendees'
        });
        
        toast.success('Successfully registered! Check your email for details.');
        refetch();
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Failed to register for event');
    }
  };

  const getEventTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      webinar: 'bg-blue-100 text-blue-800',
      workshop: 'bg-green-100 text-green-800',
      conference: 'bg-purple-100 text-purple-800',
      seminar: 'bg-orange-100 text-orange-800',
      training: 'bg-pink-100 text-pink-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Training Events</h1>
          <p className="text-muted-foreground">
            Enhance your skills with professional training events, workshops, and conferences
          </p>
        </div>
        
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Organize Event
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Training Event</DialogTitle>
            </DialogHeader>
            <TrainingEventForm onSuccess={handleEventCreated} />
          </DialogContent>
        </Dialog>
      </div>

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
      ) : events && events.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map(event => (
            <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center relative">
                {event.image_url ? (
                  <img src={event.image_url} alt={event.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="text-6xl">
                    {event.event_type === 'webinar' ? '🎥' : event.event_type === 'workshop' ? '🛠️' : event.event_type === 'conference' ? '🎤' : '📚'}
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <Badge className={getEventTypeBadge(event.event_type)}>
                    {event.event_type}
                  </Badge>
                </div>
              </div>
              
              <CardContent className="p-6">
                <div className="mb-4">
                  <h3 className="font-semibold text-lg mb-2 line-clamp-2">{event.title}</h3>
                  <p className="text-muted-foreground text-sm line-clamp-2">
                    {event.description}
                  </p>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs">
                    👤
                  </div>
                  <div className="text-sm">
                    <p className="font-medium">{event.profiles?.full_name || 'Anonymous'}</p>
                    <p className="text-xs text-muted-foreground">{event.profiles?.company || 'Organizer'}</p>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{format(new Date(event.start_date), 'MMM dd, yyyy')}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{format(new Date(event.start_date), 'HH:mm')} - {format(new Date(event.end_date), 'HH:mm')}</span>
                  </div>

                  {event.is_online ? (
                    <div className="flex items-center gap-2 text-sm">
                      <Video className="h-4 w-4 text-muted-foreground" />
                      <span>Online Event</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="line-clamp-1">{event.location}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{event.current_attendees}/{event.max_attendees} registered</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">
                      {event.price > 0 ? `KSH ${event.price}` : 'Free'}
                    </span>
                  </div>
                </div>

                {event.course_categories && (
                  <div className="mb-4">
                    <Badge variant="outline" className="text-xs">
                      {event.course_categories.name}
                    </Badge>
                  </div>
                )}

                <Button 
                  onClick={() => handleRegister(event.id)}
                  className="w-full"
                  disabled={event.current_attendees >= event.max_attendees}
                >
                  {event.current_attendees >= event.max_attendees ? 'Event Full' : 'Register Now'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-lg font-semibold mb-2">No upcoming events</h3>
            <p className="text-muted-foreground mb-4">
              Be the first to organize a training event!
            </p>
            <Button onClick={() => setIsFormOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Organize Event
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
