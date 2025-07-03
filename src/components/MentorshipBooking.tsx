
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { 
  Clock, 
  DollarSign, 
  User,
  CheckCircle,
  X
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface BookingSession {
  id?: string;
  mentor_id: string;
  mentee_id: string;
  session_date: string;
  duration_minutes: number;
  session_type: string;
  topic: string;
  notes?: string;
  status: string;
}

interface MentorshipBookingProps {
  mentor: any;
  menteeProfile: any;
  onClose: () => void;
}

export const MentorshipBooking = ({ mentor, menteeProfile, onClose }: MentorshipBookingProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState('');
  const [duration, setDuration] = useState(60);
  const [sessionType, setSessionType] = useState('video');
  const [topic, setTopic] = useState('');
  const [notes, setNotes] = useState('');
  const [isBooking, setIsBooking] = useState(false);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);

  useEffect(() => {
    generateAvailableSlots();
  }, [selectedDate]);

  const generateAvailableSlots = () => {
    if (!selectedDate) return;
    
    // Generate time slots from 9 AM to 5 PM
    const slots = [];
    for (let hour = 9; hour < 17; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
      slots.push(`${hour.toString().padStart(2, '0')}:30`);
    }
    setAvailableSlots(slots);
  };

  const handleBookSession = async () => {
    if (!selectedDate || !selectedTime || !topic.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsBooking(true);
    try {
      const sessionDateTime = new Date(selectedDate);
      const [hours, minutes] = selectedTime.split(':').map(Number);
      sessionDateTime.setHours(hours, minutes, 0, 0);

      const booking: BookingSession = {
        mentor_id: mentor.id,
        mentee_id: menteeProfile.id,
        session_date: sessionDateTime.toISOString(),
        duration_minutes: duration,
        session_type: sessionType,
        topic,
        notes,
        status: 'pending'
      };

      const { error } = await supabase
        .from('mentorship_sessions')
        .insert(booking);

      if (error) throw error;

      toast.success('Session booked successfully! The mentor will be notified.');
      onClose();
    } catch (error) {
      console.error('Error booking session:', error);
      toast.error('Failed to book session');
    } finally {
      setIsBooking(false);
    }
  };

  const totalCost = (mentor.hourly_rate * duration) / 60;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Book Session with {mentor.profiles?.full_name}</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Mentor Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">{mentor.profiles?.full_name}</h3>
                <p className="text-sm text-muted-foreground">
                  {mentor.profiles?.position} at {mentor.profiles?.company}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1">
                <DollarSign className="h-4 w-4" />
                ${mentor.hourly_rate}/hour
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {mentor.availability_hours}h/week available
              </span>
            </div>
          </div>

          {/* Date Selection */}
          <div>
            <Label>Select Date</Label>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              disabled={(date) => date < new Date() || date.getDay() === 0 || date.getDay() === 6}
              className="rounded-md border"
            />
          </div>

          {/* Time Selection */}
          {selectedDate && (
            <div>
              <Label>Available Time Slots</Label>
              <div className="grid grid-cols-4 gap-2 mt-2">
                {availableSlots.map((slot) => (
                  <Button
                    key={slot}
                    variant={selectedTime === slot ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedTime(slot)}
                  >
                    {slot}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Session Details */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Select value={duration.toString()} onValueChange={(value) => setDuration(parseInt(value))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="60">60 minutes</SelectItem>
                  <SelectItem value="90">90 minutes</SelectItem>
                  <SelectItem value="120">120 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="session_type">Session Type</Label>
              <Select value={sessionType} onValueChange={setSessionType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="video">Video Call</SelectItem>
                  <SelectItem value="phone">Phone Call</SelectItem>
                  <SelectItem value="chat">Text Chat</SelectItem>
                  <SelectItem value="in-person">In-Person</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="topic">Session Topic *</Label>
            <Input
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="What would you like to discuss?"
              required
            />
          </div>

          <div>
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any specific questions or preparation notes..."
              rows={3}
            />
          </div>

          {/* Cost Summary */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Session Summary</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Duration:</span>
                <span>{duration} minutes</span>
              </div>
              <div className="flex justify-between">
                <span>Rate:</span>
                <span>${mentor.hourly_rate}/hour</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>Total Cost:</span>
                <span>${totalCost.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Booking Button */}
          <Button 
            onClick={handleBookSession} 
            disabled={isBooking || !selectedDate || !selectedTime || !topic.trim()}
            className="w-full"
          >
            {isBooking ? (
              'Booking Session...'
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Book Session (${totalCost.toFixed(2)})
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
