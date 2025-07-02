
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Star, MessageCircle, Calendar, Plus, UserPlus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface MentorProfile {
  id: string;
  user_id: string;
  expertise_areas: string[];
  experience_years: number;
  bio: string;
  availability: string;
  rating: number;
  total_mentees: number;
  profile?: {
    full_name: string;
    position: string;
    company: string;
    avatar_url?: string;
  };
}

interface MenteeProfile {
  id: string;
  user_id: string;
  learning_goals: string[];
  experience_level: string;
  bio: string;
  preferred_mentor_expertise: string[];
  profile?: {
    full_name: string;
    position: string;
    company: string;
    avatar_url?: string;
  };
}

export const MentorshipProgram = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('browse');
  const [mentors, setMentors] = useState<MentorProfile[]>([]);
  const [mentees, setMentees] = useState<MenteeProfile[]>([]);
  const [userRole, setUserRole] = useState<'mentor' | 'mentee' | 'both' | null>(null);
  const [loading, setLoading] = useState(true);

  // Form states
  const [mentorFormData, setMentorFormData] = useState({
    expertise_areas: [] as string[],
    experience_years: 0,
    bio: '',
    availability: 'flexible'
  });

  const [menteeFormData, setMenteeFormData] = useState({
    learning_goals: [] as string[],
    experience_level: 'beginner',
    bio: '',
    preferred_mentor_expertise: [] as string[]
  });

  const expertiseOptions = [
    'Supply Chain Management',
    'Logistics',
    'Procurement',
    'Inventory Management',
    'Distribution',
    'Warehouse Management',
    'Transportation',
    'Demand Planning',
    'Operations Management',
    'Vendor Management'
  ];

  useEffect(() => {
    if (user) {
      fetchMentors();
      fetchMentees();
      checkUserRole();
    }
  }, [user]);

  const fetchMentors = async () => {
    try {
      const { data, error } = await supabase
        .from('mentor_profiles')
        .select(`
          *,
          profile:profiles(full_name, position, company, avatar_url)
        `)
        .eq('is_active', true)
        .order('rating', { ascending: false });

      if (error) throw error;
      setMentors(data || []);
    } catch (error) {
      console.error('Error fetching mentors:', error);
    }
  };

  const fetchMentees = async () => {
    try {
      const { data, error } = await supabase
        .from('mentee_profiles')
        .select(`
          *,
          profile:profiles(full_name, position, company, avatar_url)
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMentees(data || []);
    } catch (error) {
      console.error('Error fetching mentees:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkUserRole = async () => {
    if (!user) return;

    try {
      const [mentorCheck, menteeCheck] = await Promise.all([
        supabase
          .from('mentor_profiles')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle(),
        supabase
          .from('mentee_profiles')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle()
      ]);

      if (mentorCheck.data && menteeCheck.data) {
        setUserRole('both');
      } else if (mentorCheck.data) {
        setUserRole('mentor');
      } else if (menteeCheck.data) {
        setUserRole('mentee');
      }
    } catch (error) {
      console.error('Error checking user role:', error);
    }
  };

  const becomeMentor = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('mentor_profiles')
        .insert({
          user_id: user.id,
          ...mentorFormData,
          is_active: true,
          rating: 5.0,
          total_mentees: 0
        });

      if (error) throw error;

      toast.success('Successfully registered as a mentor!');
      setActiveTab('browse');
      checkUserRole();
      fetchMentors();
    } catch (error) {
      console.error('Error becoming mentor:', error);
      toast.error('Failed to register as mentor');
    }
  };

  const becomeMentee = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('mentee_profiles')
        .insert({
          user_id: user.id,
          ...menteeFormData,
          is_active: true
        });

      if (error) throw error;

      toast.success('Successfully registered as a mentee!');
      setActiveTab('browse');
      checkUserRole();
      fetchMentees();
    } catch (error) {
      console.error('Error becoming mentee:', error);
      toast.error('Failed to register as mentee');
    }
  };

  const requestMentorship = async (mentorId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('mentorship_requests')
        .insert({
          mentor_id: mentorId,
          mentee_id: user.id,
          status: 'pending',
          message: 'I would like to request mentorship from you.'
        });

      if (error) throw error;
      toast.success('Mentorship request sent!');
    } catch (error) {
      console.error('Error requesting mentorship:', error);
      toast.error('Failed to send mentorship request');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Mentorship Program</h1>
        <p className="text-muted-foreground">
          Connect with industry experts or share your knowledge with aspiring professionals
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="browse">Browse</TabsTrigger>
          <TabsTrigger value="become-mentor">Become Mentor</TabsTrigger>
          <TabsTrigger value="become-mentee">Find Mentor</TabsTrigger>
          <TabsTrigger value="my-connections">My Connections</TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="space-y-6">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Available Mentors ({mentors.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mentors.map((mentor) => (
                    <Card key={mentor.id} className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold">{mentor.profile?.full_name || 'Anonymous'}</h3>
                          <p className="text-sm text-muted-foreground">
                            {mentor.profile?.position} at {mentor.profile?.company}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span className="text-sm">{mentor.rating}</span>
                        </div>
                      </div>
                      
                      <p className="text-sm mb-3">{mentor.bio}</p>
                      
                      <div className="flex flex-wrap gap-1 mb-3">
                        {mentor.expertise_areas.slice(0, 3).map((area) => (
                          <Badge key={area} variant="secondary" className="text-xs">
                            {area}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                        <span>{mentor.experience_years} years exp.</span>
                        <span>{mentor.total_mentees} mentees</span>
                      </div>
                      
                      <Button 
                        onClick={() => requestMentorship(mentor.user_id)}
                        className="w-full"
                        disabled={!userRole || userRole === 'mentor'}
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Request Mentorship
                      </Button>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="become-mentor" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                Become a Mentor
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label>Areas of Expertise</Label>
                <Select
                  onValueChange={(value) => {
                    if (!mentorFormData.expertise_areas.includes(value)) {
                      setMentorFormData(prev => ({
                        ...prev,
                        expertise_areas: [...prev.expertise_areas, value]
                      }));
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select expertise areas" />
                  </SelectTrigger>
                  <SelectContent>
                    {expertiseOptions.map(option => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex flex-wrap gap-2 mt-2">
                  {mentorFormData.expertise_areas.map(area => (
                    <Badge 
                      key={area}
                      variant="secondary"
                      className="cursor-pointer"
                      onClick={() => {
                        setMentorFormData(prev => ({
                          ...prev,
                          expertise_areas: prev.expertise_areas.filter(a => a !== area)
                        }));
                      }}
                    >
                      {area} ×
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="grid gap-2">
                <Label>Years of Experience</Label>
                <Input
                  type="number"
                  value={mentorFormData.experience_years}
                  onChange={(e) => setMentorFormData(prev => ({
                    ...prev,
                    experience_years: parseInt(e.target.value) || 0
                  }))}
                  placeholder="e.g., 5"
                />
              </div>

              <div className="grid gap-2">
                <Label>Bio</Label>
                <Textarea
                  value={mentorFormData.bio}
                  onChange={(e) => setMentorFormData(prev => ({
                    ...prev,
                    bio: e.target.value
                  }))}
                  placeholder="Tell potential mentees about your experience and mentoring style..."
                />
              </div>

              <div className="grid gap-2">
                <Label>Availability</Label>
                <Select
                  value={mentorFormData.availability}
                  onValueChange={(value) => setMentorFormData(prev => ({
                    ...prev,
                    availability: value
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="flexible">Flexible</SelectItem>
                    <SelectItem value="weekdays">Weekdays Only</SelectItem>
                    <SelectItem value="weekends">Weekends Only</SelectItem>
                    <SelectItem value="limited">Limited Availability</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={becomeMentor} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Register as Mentor
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="become-mentee" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                Find a Mentor
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label>Learning Goals</Label>
                <Select
                  onValueChange={(value) => {
                    if (!menteeFormData.learning_goals.includes(value)) {
                      setMenteeFormData(prev => ({
                        ...prev,
                        learning_goals: [...prev.learning_goals, value]
                      }));
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select learning goals" />
                  </SelectTrigger>
                  <SelectContent>
                    {expertiseOptions.map(option => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex flex-wrap gap-2 mt-2">
                  {menteeFormData.learning_goals.map(goal => (
                    <Badge 
                      key={goal}
                      variant="secondary"
                      className="cursor-pointer"
                      onClick={() => {
                        setMenteeFormData(prev => ({
                          ...prev,
                          learning_goals: prev.learning_goals.filter(g => g !== goal)
                        }));
                      }}
                    >
                      {goal} ×
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="grid gap-2">
                <Label>Experience Level</Label>
                <Select
                  value={menteeFormData.experience_level}
                  onValueChange={(value) => setMenteeFormData(prev => ({
                    ...prev,
                    experience_level: value
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner (0-2 years)</SelectItem>
                    <SelectItem value="intermediate">Intermediate (2-5 years)</SelectItem>
                    <SelectItem value="advanced">Advanced (5+ years)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label>About Me</Label>
                <Textarea
                  value={menteeFormData.bio}
                  onChange={(e) => setMenteeFormData(prev => ({
                    ...prev,
                    bio: e.target.value
                  }))}
                  placeholder="Tell potential mentors about your background and goals..."
                />
              </div>

              <Button onClick={becomeMentee} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Register as Mentee
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="my-connections">
          <Card>
            <CardHeader>
              <CardTitle>My Mentorship Connections</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {userRole 
                  ? "Your mentorship connections will appear here once established."
                  : "Please register as a mentor or mentee to see connections."
                }
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
