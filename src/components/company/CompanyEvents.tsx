
import React, { useState } from 'react';
import { useCompany } from '@/hooks/useCompany';
import { CompanyEvent } from '@/types/company';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Users, Clock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';

interface CompanyEventsProps {
  companyId: string;
  canCreate?: boolean;
}

const CompanyEvents: React.FC<CompanyEventsProps> = ({ companyId, canCreate = false }) => {
  const { events, loading, createEvent } = useCompany(companyId);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Partial<CompanyEvent>>({
    title: '',
    description: '',
    type: 'webinar',
    location: '',
    date: '',
    maxAttendees: undefined
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await createEvent({
        title: formData.title || '',
        description: formData.description || '',
        type: formData.type || 'webinar',
        location: formData.location || '',
        date: formData.date || '',
        maxAttendees: formData.maxAttendees
      });
      
      setShowForm(false);
      setFormData({
        title: '',
        description: '',
        type: 'webinar',
        location: '',
        date: '',
        maxAttendees: undefined
      });
      
      toast({
        title: "Success",
        description: "Event created successfully!"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create event. Please try again.",
        variant: "destructive"
      });
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEventTypeColor = (type: string) => {
    const colors = {
      webinar: 'bg-blue-100 text-blue-800',
      conference: 'bg-purple-100 text-purple-800',
      hiring_event: 'bg-green-100 text-green-800',
      open_house: 'bg-orange-100 text-orange-800',
      other: 'bg-gray-100 text-gray-800'
    };
    return colors[type as keyof typeof colors] || colors.other;
  };

  if (loading) {
    return <div>Loading events...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Company Events</h2>
        {canCreate && (
          <Button onClick={() => setShowForm(true)}>
            Create Event
          </Button>
        )}
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Event</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Event Title</Label>
                <Input
                  id="title"
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="type">Event Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: 'webinar' | 'conference' | 'hiring_event' | 'open_house' | 'other') => 
                    setFormData({ ...formData, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="webinar">Webinar</SelectItem>
                    <SelectItem value="conference">Conference</SelectItem>
                    <SelectItem value="hiring_event">Hiring Event</SelectItem>
                    <SelectItem value="open_house">Open House</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location || ''}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Physical address or online platform"
                />
              </div>

              <div>
                <Label htmlFor="date">Date & Time</Label>
                <Input
                  id="date"
                  type="datetime-local"
                  value={formData.date || ''}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="maxAttendees">Max Attendees (optional)</Label>
                <Input
                  id="maxAttendees"
                  type="number"
                  value={formData.maxAttendees || ''}
                  onChange={(e) => setFormData({ ...formData, maxAttendees: parseInt(e.target.value) || undefined })}
                  min="1"
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit">Create Event</Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {events.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No events scheduled yet.</p>
        ) : (
          events.map((event) => (
            <Card key={event.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">{event.title}</h3>
                    <Badge className={getEventTypeColor(event.type)}>
                      {event.type.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>

                {event.description && (
                  <p className="text-gray-600 mb-4">{event.description}</p>
                )}

                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {formatDate(event.date)}
                  </div>
                  {event.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {event.location}
                    </div>
                  )}
                  {event.maxAttendees && (
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      {event.attendeesCount || 0} / {event.maxAttendees} attendees
                    </div>
                  )}
                </div>

                <div className="mt-4 flex gap-2">
                  <Button size="sm">
                    Register
                  </Button>
                  <Button size="sm" variant="outline">
                    Share
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default CompanyEvents;
