import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  GraduationCap, 
  Star, 
  Clock, 
  DollarSign,
  User,
  Award,
  Calendar
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
    company: string;
    position: string;
  };
}

interface Mentee {
  id: string;
  user_id: string;
  career_goals: string;
  current_level: string;
  areas_of_interest: string[];
  preferred_session_type: string;
}

export const MentorshipProgram = () => {
  const { user } = useAuth();
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [userMentorProfile, setUserMentorProfile] = useState<Mentor | null>(null);
  const [userMenteeProfile, setUserMenteeProfile] = useState<Mentee | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('browse');

  // Form states
  const [mentorForm, setMentorForm] = useState({
    expertise_areas: '',
    experience_years: 0,
    bio: '',
    availability_hours: 5,
    hourly_rate: 0
  });

  const [menteeForm, setMenteeForm] = useState({
    career_goals: '',
    current_level: 'junior',
    areas_of_interest: '',
    preferred_session_type: 'video'
  });

  useEffect(() => {
    if (user) {
      loadMentors();
      loadUserProfiles();
    }
  }, [user]);

  const loadMentors = async () => {
    try {
      const { data, error } = await supabase
        .from('mentors')
        .select(`
          *,
          profiles:user_id (
            full_name,
            avatar_url,
            company,
            position
          )
        `)
        .eq('is_active', true)
        .order('rating', { ascending: false });

      if (error) throw error;
      setMentors(data || []);
    } catch (error) {
      console.error('Error loading mentors:', error);
      toast.error('Failed to load mentors');
    }
  };

  const loadUserProfiles = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      // Load mentor profile
      const { data: mentorData } = await supabase
        .from('mentors')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (mentorData) {
        setUserMentorProfile(mentorData);
        setMentorForm({
          expertise_areas: mentorData.expertise_areas.join(', '),
          experience_years: mentorData.experience_years,
          bio: mentorData.bio || '',
          availability_hours: mentorData.availability_hours,
          hourly_rate: mentorData.hourly_rate
        });
      }

      // Load mentee profile
      const { data: menteeData } = await supabase
        .from('mentees')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (menteeData) {
        setUserMenteeProfile(menteeData);
        setMenteeForm({
          career_goals: menteeData.career_goals || '',
          current_level: menteeData.current_level,
          areas_of_interest: menteeData.areas_of_interest.join(', '),
          preferred_session_type: menteeData.preferred_session_type
        });
      }
    } catch (error) {
      console.error('Error loading user profiles:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBecomeMentor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const expertiseArray = mentorForm.expertise_areas
        .split(',')
        .map(area => area.trim())
        .filter(area => area.length > 0);

      const mentorData = {
        user_id: user.id,
        expertise_areas: expertiseArray,
        experience_years: mentorForm.experience_years,
        bio: mentorForm.bio,
        availability_hours: mentorForm.availability_hours,
        hourly_rate: mentorForm.hourly_rate,
        is_active: true
      };

      let result;
      if (userMentorProfile) {
        result = await supabase
          .from('mentors')
          .update(mentorData)
          .eq('id', userMentorProfile.id);
      } else {
        result = await supabase
          .from('mentors')
          .insert(mentorData);
      }

      if (result.error) throw result.error;

      toast.success(userMentorProfile ? 'Mentor profile updated!' : 'Welcome to our mentor program!');
      loadUserProfiles();
      loadMentors();
    } catch (error) {
      console.error('Error saving mentor profile:', error);
      toast.error('Failed to save mentor profile');
    }
  };

  const handleBecomeMentee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const interestsArray = menteeForm.areas_of_interest
        .split(',')
        .map(area => area.trim())
        .filter(area => area.length > 0);

      const menteeData = {
        user_id: user.id,
        career_goals: menteeForm.career_goals,
        current_level: menteeForm.current_level,
        areas_of_interest: interestsArray,
        preferred_session_type: menteeForm.preferred_session_type
      };

      let result;
      if (userMenteeProfile) {
        result = await supabase
          .from('mentees')
          .update(menteeData)
          .eq('id', userMenteeProfile.id);
      } else {
        result = await supabase
          .from('mentees')
          .insert(menteeData);
      }

      if (result.error) throw result.error;

      toast.success(userMenteeProfile ? 'Mentee profile updated!' : 'Welcome to our mentorship program!');
      loadUserProfiles();
    } catch (error) {
      console.error('Error saving mentee profile:', error);
      toast.error('Failed to save mentee profile');
    }
  };

  const handleBookSession = async () => {
    if (!user || !userMenteeProfile) {
      toast.error('Please create a mentee profile first');
      setActiveTab('become-mentee');
      return;
    }

    // In a real app, this would open a booking modal or redirect to a booking page
    toast.info('Booking system coming soon! Contact the mentor directly for now.');
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
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4 flex items-center justify-center gap-2">
          <GraduationCap className="h-8 w-8 text-primary" />
          Mentorship Program
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Connect with industry experts or share your knowledge with the next generation of supply chain professionals.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="browse">Browse Mentors</TabsTrigger>
          <TabsTrigger value="become-mentor">Become a Mentor</TabsTrigger>
          <TabsTrigger value="become-mentee">Become a Mentee</TabsTrigger>
        </TabsList>

        {/* Browse Mentors Tab */}
        <TabsContent value="browse" className="space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold mb-2">Find Your Perfect Mentor</h2>
            <p className="text-muted-foreground">
              Connect with experienced professionals who can guide your career growth
            </p>
          </div>

          {mentors.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <GraduationCap className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No mentors available yet</h3>
                <p className="text-muted-foreground mb-4">
                  Be the first to join our mentorship program as a mentor!
                </p>
                <Button onClick={() => setActiveTab('become-mentor')}>
                  Become a Mentor
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mentors.map((mentor) => (
                <Card key={mentor.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{mentor.profiles?.full_name || 'Anonymous'}</h3>
                        <p className="text-sm text-muted-foreground">
                          {mentor.profiles?.position} at {mentor.profiles?.company}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium">{mentor.rating.toFixed(1)}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        ({mentor.total_sessions} sessions)
                      </span>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Award className="h-4 w-4 text-muted-foreground" />
                        <span>{mentor.experience_years} years experience</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{mentor.availability_hours}h/week available</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <span>${mentor.hourly_rate}/hour</span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {mentor.bio}
                      </p>
                    </div>

                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1">
                        {mentor.expertise_areas.slice(0, 3).map((area, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {area}
                          </Badge>
                        ))}
                        {mentor.expertise_areas.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{mentor.expertise_areas.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <Button 
                      onClick={handleBookSession} 
                      className="w-full"
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      Book Session
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Become a Mentor Tab */}
        <TabsContent value="become-mentor" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>
                {userMentorProfile ? 'Update Your Mentor Profile' : 'Become a Mentor'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleBecomeMentor} className="space-y-4">
                <div>
                  <Label htmlFor="expertise">Expertise Areas (comma-separated)</Label>
                  <Input
                    id="expertise"
                    value={mentorForm.expertise_areas}
                    onChange={(e) => setMentorForm({...mentorForm, expertise_areas: e.target.value})}
                    placeholder="Supply Chain Management, Logistics, Procurement..."
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="experience">Years of Experience</Label>
                    <Input
                      id="experience"
                      type="number"
                      min="0"
                      value={mentorForm.experience_years}
                      onChange={(e) => setMentorForm({...mentorForm, experience_years: parseInt(e.target.value) || 0})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="hourly_rate">Hourly Rate ($)</Label>
                    <Input
                      id="hourly_rate"
                      type="number"
                      min="0"
                      step="0.01"
                      value={mentorForm.hourly_rate}
                      onChange={(e) => setMentorForm({...mentorForm, hourly_rate: parseFloat(e.target.value) || 0})}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="availability">Available Hours per Week</Label>
                  <Input
                    id="availability"
                    type="number"
                    min="1"
                    max="40"
                    value={mentorForm.availability_hours}
                    onChange={(e) => setMentorForm({...mentorForm, availability_hours: parseInt(e.target.value) || 5})}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    rows={4}
                    value={mentorForm.bio}
                    onChange={(e) => setMentorForm({...mentorForm, bio: e.target.value})}
                    placeholder="Tell mentees about your background, experience, and what you can help them with..."
                    required
                  />
                </div>

                <Button type="submit" className="w-full">
                  {userMentorProfile ? 'Update Profile' : 'Become a Mentor'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Become a Mentee Tab */}
        <TabsContent value="become-mentee" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>
                {userMenteeProfile ? 'Update Your Mentee Profile' : 'Become a Mentee'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleBecomeMentee} className="space-y-4">
                <div>
                  <Label htmlFor="career_goals">Career Goals</Label>
                  <Textarea
                    id="career_goals"
                    rows={3}
                    value={menteeForm.career_goals}
                    onChange={(e) => setMenteeForm({...menteeForm, career_goals: e.target.value})}
                    placeholder="What are your career aspirations? What do you hope to achieve?"
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="current_level">Current Career Level</Label>
                    <select
                      id="current_level"
                      className="w-full p-2 border rounded-md"
                      value={menteeForm.current_level}
                      onChange={(e) => setMenteeForm({...menteeForm, current_level: e.target.value})}
                    >
                      <option value="student">Student</option>
                      <option value="junior">Junior (0-2 years)</option>
                      <option value="mid">Mid-level (3-5 years)</option>
                      <option value="senior">Senior (5+ years)</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="session_type">Preferred Session Type</Label>
                    <select
                      id="session_type"
                      className="w-full p-2 border rounded-md"
                      value={menteeForm.preferred_session_type}
                      onChange={(e) => setMenteeForm({...menteeForm, preferred_session_type: e.target.value})}
                    >
                      <option value="video">Video Call</option>
                      <option value="phone">Phone Call</option>
                      <option value="chat">Text Chat</option>
                      <option value="in-person">In-Person</option>
                    </select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="interests">Areas of Interest (comma-separated)</Label>
                  <Input
                    id="interests"
                    value={menteeForm.areas_of_interest}
                    onChange={(e) => setMenteeForm({...menteeForm, areas_of_interest: e.target.value})}
                    placeholder="Supply Chain Analytics, Sustainability, Digital Transformation..."
                    required
                  />
                </div>

                <Button type="submit" className="w-full">
                  {userMenteeProfile ? 'Update Profile' : 'Join as Mentee'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
