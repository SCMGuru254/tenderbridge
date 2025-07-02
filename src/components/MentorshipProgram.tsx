
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  Star, 
  Clock, 
  User, 
  GraduationCap, 
  MessageCircle,
  CheckCircle
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface Mentor {
  id: string;
  user_id: string;
  expertise_areas: string[];
  experience_years: number;
  bio: string;
  availability_hours: number;
  hourly_rate: number;
  is_active: boolean;
  rating: number;
  total_sessions: number;
  profiles: {
    full_name: string;
    avatar_url: string;
    position: string;
    company: string;
  };
}

interface MentorshipSession {
  id: string;
  mentor_id: string;
  mentee_id: string;
  session_date: string;
  duration_minutes: number;
  status: string;
  notes: string;
  mentors: {
    profiles: {
      full_name: string;
    };
  };
}

export const MentorshipProgram = () => {
  const { user } = useAuth();
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [sessions, setSessions] = useState<MentorshipSession[]>([]);
  const [userProfile, setUserProfile] = useState<'mentor' | 'mentee' | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showMentorForm, setShowMentorForm] = useState(false);
  const [showMenteeForm, setShowMenteeForm] = useState(false);

  const [mentorFormData, setMentorFormData] = useState({
    expertise_areas: [] as string[],
    experience_years: 0,
    bio: '',
    availability_hours: 5,
    hourly_rate: 0
  });

  const [menteeFormData, setMenteeFormData] = useState({
    career_goals: '',
    current_level: '',
    areas_of_interest: [] as string[],
    preferred_session_type: 'video'
  });

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Check if user is already a mentor or mentee
      const [mentorCheck, menteeCheck] = await Promise.all([
        supabase.from('mentors').select('id').eq('user_id', user?.id).single(),
        supabase.from('mentees').select('id').eq('user_id', user?.id).single()
      ]);

      if (mentorCheck.data) setUserProfile('mentor');
      else if (menteeCheck.data) setUserProfile('mentee');

      // Fetch all mentors
      const { data: mentorsData, error: mentorsError } = await supabase
        .from('mentors')
        .select(`
          *,
          profiles:user_id (
            full_name,
            avatar_url,
            position,
            company
          )
        `)
        .eq('is_active', true);

      if (mentorsError) throw mentorsError;
      setMentors(mentorsData || []);

      // Fetch user's sessions if they're a mentee
      if (user && menteeCheck.data) {
        const { data: sessionsData, error: sessionsError } = await supabase
          .from('mentorship_sessions')
          .select(`
            *,
            mentors:mentor_id (
              profiles:user_id (
                full_name
              )
            )
          `)
          .eq('mentee_id', menteeCheck.data.id);

        if (sessionsError) throw sessionsError;
        setSessions(sessionsData || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBecomeMentor = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('mentors')
        .insert({
          user_id: user?.id,
          ...mentorFormData
        });

      if (error) throw error;

      toast.success('Successfully registered as a mentor!');
      setShowMentorForm(false);
      setUserProfile('mentor');
      fetchData();
    } catch (error) {
      console.error('Error becoming mentor:', error);
      toast.error('Failed to register as mentor');
    }
  };

  const handleBecomeMentee = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('mentees')
        .insert({
          user_id: user?.id,
          ...menteeFormData
        });

      if (error) throw error;

      toast.success('Successfully registered as a mentee!');
      setShowMenteeForm(false);
      setUserProfile('mentee');
      fetchData();
    } catch (error) {
      console.error('Error becoming mentee:', error);
      toast.error('Failed to register as mentee');
    }
  };

  const handleExpertiseChange = (value: string) => {
    const areas = value.split(',').map(area => area.trim()).filter(Boolean);
    setMentorFormData(prev => ({ ...prev, expertise_areas: areas }));
  };

  const handleInterestsChange = (value: string) => {
    const interests = value.split(',').map(interest => interest.trim()).filter(Boolean);
    setMenteeFormData(prev => ({ ...prev, areas_of_interest: interests }));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-4 flex items-center justify-center gap-2">
          <GraduationCap className="h-8 w-8 text-primary" />
          Mentorship Program
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Connect with experienced professionals in supply chain and logistics. 
          Get guidance, share knowledge, and accelerate your career growth.
        </p>
      </div>

      {!user ? (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground mb-4">Please sign in to access the mentorship program.</p>
            <Button>Sign In</Button>
          </CardContent>
        </Card>
      ) : !userProfile ? (
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-6 w-6 text-primary" />
                Become a Mentor
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Share your expertise and help others grow in their supply chain careers.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Set your own schedule</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Earn while helping others</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Build your professional network</span>
                </li>
              </ul>
              <Button onClick={() => setShowMentorForm(true)} className="w-full">
                Become a Mentor
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-6 w-6 text-primary" />
                Find a Mentor
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Get personalized guidance from experienced supply chain professionals.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">1-on-1 career guidance</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Industry insights</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Skill development support</span>
                </li>
              </ul>
              <Button onClick={() => setShowMenteeForm(true)} className="w-full" variant="outline">
                Find a Mentor
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Tabs defaultValue="mentors" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="mentors">Find Mentors</TabsTrigger>
            <TabsTrigger value="sessions">My Sessions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="mentors" className="mt-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mentors.map((mentor) => (
                <Card key={mentor.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                        <User className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{mentor.profiles?.full_name}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {mentor.profiles?.position} at {mentor.profiles?.company}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-sm">{mentor.rating.toFixed(1)} ({mentor.total_sessions} sessions)</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{mentor.experience_years} years experience</span>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {mentor.expertise_areas.slice(0, 3).map((area, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {area}
                          </Badge>
                        ))}
                      </div>

                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {mentor.bio}
                      </p>

                      <div className="flex items-center justify-between pt-2">
                        <span className="text-sm font-semibold">
                          KES {mentor.hourly_rate}/hour
                        </span>
                        <Button size="sm">
                          <MessageCircle className="h-4 w-4 mr-1" />
                          Connect
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="sessions" className="mt-6">
            {sessions.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No mentorship sessions yet.</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Connect with a mentor to schedule your first session.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {sessions.map((session) => (
                  <Card key={session.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold">
                            Session with {session.mentors?.profiles?.full_name}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {new Date(session.session_date).toLocaleDateString()} • {session.duration_minutes} minutes
                          </p>
                        </div>
                        <Badge variant={session.status === 'completed' ? 'default' : 'secondary'}>
                          {session.status}
                        </Badge>
                      </div>
                      {session.notes && (
                        <p className="text-sm mt-2 text-muted-foreground">{session.notes}</p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}

      {/* Mentor Registration Form */}
      {showMentorForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Become a Mentor</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleBecomeMentor} className="space-y-4">
                <div>
                  <Label htmlFor="expertise">Expertise Areas (comma-separated)</Label>
                  <Input
                    id="expertise"
                    placeholder="Supply Chain Management, Logistics, Procurement..."
                    value={mentorFormData.expertise_areas.join(', ')}
                    onChange={(e) => handleExpertiseChange(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="experience">Years of Experience</Label>
                  <Input
                    id="experience"
                    type="number"
                    min="1"
                    value={mentorFormData.experience_years}
                    onChange={(e) => setMentorFormData(prev => ({ 
                      ...prev, 
                      experience_years: parseInt(e.target.value) || 0 
                    }))}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    rows={3}
                    placeholder="Tell potential mentees about your background and expertise..."
                    value={mentorFormData.bio}
                    onChange={(e) => setMentorFormData(prev => ({ ...prev, bio: e.target.value }))}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="hours">Available Hours/Week</Label>
                    <Input
                      id="hours"
                      type="number"
                      min="1"
                      max="40"
                      value={mentorFormData.availability_hours}
                      onChange={(e) => setMentorFormData(prev => ({ 
                        ...prev, 
                        availability_hours: parseInt(e.target.value) || 5 
                      }))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="rate">Hourly Rate (KES)</Label>
                    <Input
                      id="rate"
                      type="number"
                      min="0"
                      value={mentorFormData.hourly_rate}
                      onChange={(e) => setMentorFormData(prev => ({ 
                        ...prev, 
                        hourly_rate: parseFloat(e.target.value) || 0 
                      }))}
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button type="submit">Register as Mentor</Button>
                  <Button type="button" variant="outline" onClick={() => setShowMentorForm(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Mentee Registration Form */}
      {showMenteeForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Find a Mentor</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleBecomeMentee} className="space-y-4">
                <div>
                  <Label htmlFor="goals">Career Goals</Label>
                  <Textarea
                    id="goals"
                    rows={3}
                    placeholder="What are your career aspirations in supply chain/logistics?"
                    value={menteeFormData.career_goals}
                    onChange={(e) => setMenteeFormData(prev => ({ ...prev, career_goals: e.target.value }))}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="level">Current Level</Label>
                  <Select 
                    value={menteeFormData.current_level} 
                    onValueChange={(value) => setMenteeFormData(prev => ({ ...prev, current_level: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your current level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="entry-level">Entry Level (0-2 years)</SelectItem>
                      <SelectItem value="mid-level">Mid Level (3-7 years)</SelectItem>
                      <SelectItem value="senior-level">Senior Level (8+ years)</SelectItem>
                      <SelectItem value="career-change">Career Change</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="interests">Areas of Interest (comma-separated)</Label>
                  <Input
                    id="interests"
                    placeholder="Logistics, Procurement, Operations Management..."
                    value={menteeFormData.areas_of_interest.join(', ')}
                    onChange={(e) => handleInterestsChange(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="session-type">Preferred Session Type</Label>
                  <Select 
                    value={menteeFormData.preferred_session_type} 
                    onValueChange={(value) => setMenteeFormData(prev => ({ ...prev, preferred_session_type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="video">Video Call</SelectItem>
                      <SelectItem value="audio">Audio Call</SelectItem>
                      <SelectItem value="chat">Text Chat</SelectItem>
                      <SelectItem value="in-person">In Person (Nairobi)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-4">
                  <Button type="submit">Join as Mentee</Button>
                  <Button type="button" variant="outline" onClick={() => setShowMenteeForm(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
