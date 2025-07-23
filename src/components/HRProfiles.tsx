import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  UserCheck, 
  Star, 
  DollarSign,
  Award,
  MapPin,
  Mail
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface HRProfile {
  id: string;
  user_id: string;
  company_id: string;
  services_offered: string[];
  specializations: string[];
  years_experience: number;
  hourly_rate: number;
  availability_status: string;
  bio: string;
  certifications: string[];
  languages_spoken: string[];
  preferred_contact_method: string;
  timezone: string;
  is_verified: boolean;
  rating: number;
  total_clients: number;
  profiles: {
    full_name: string;
    avatar_url: string;
    company: string;
    position: string;
    email: string;
  };
}

export const HRProfiles = () => {
  const { user } = useAuth();
  const [hrProfiles, setHRProfiles] = useState<HRProfile[]>([]);
  const [userHRProfile, setUserHRProfile] = useState<HRProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('browse');

  // Form state
  const [hrForm, setHRForm] = useState({
    services_offered: '',
    specializations: '',
    years_experience: 0,
    hourly_rate: 0,
    bio: '',
    certifications: '',
    languages_spoken: 'English',
    preferred_contact_method: 'email',
    timezone: 'UTC'
  });

  useEffect(() => {
    if (user) {
      loadHRProfiles();
      loadUserHRProfile();
    }
  }, [user]);

  const loadHRProfiles = async () => {
    try {
      const { data, error } = await supabase
        .from('hr_profiles')
        .select(`
          *,
          profiles:user_id (
            full_name,
            avatar_url,
            company,
            position,
            email
          )
        `)
        .eq('is_verified', true)
        .order('rating', { ascending: false });

      if (error) throw error;
      setHRProfiles(data || []);
    } catch (error) {
      console.error('Error loading HR profiles:', error);
      toast.error('Failed to load HR profiles');
    }
  };

  const loadUserHRProfile = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { data } = await supabase
        .from('hr_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (data) {
        setUserHRProfile(data);
        setHRForm({
          services_offered: data.services_offered.join(', '),
          specializations: data.specializations.join(', '),
          years_experience: data.years_experience,
          hourly_rate: data.hourly_rate || 0,
          bio: data.bio || '',
          certifications: data.certifications.join(', '),
          languages_spoken: data.languages_spoken.join(', '),
          preferred_contact_method: data.preferred_contact_method,
          timezone: data.timezone
        });
      }
    } catch (error) {
      console.error('Error loading user HR profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateHRProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const servicesArray = hrForm.services_offered
        .split(',')
        .map(service => service.trim())
        .filter(service => service.length > 0);

      const specializationsArray = hrForm.specializations
        .split(',')
        .map(spec => spec.trim())
        .filter(spec => spec.length > 0);

      const certificationsArray = hrForm.certifications
        .split(',')
        .map(cert => cert.trim())
        .filter(cert => cert.length > 0);

      const languagesArray = hrForm.languages_spoken
        .split(',')
        .map(lang => lang.trim())
        .filter(lang => lang.length > 0);

      const hrProfileData = {
        user_id: user.id,
        services_offered: servicesArray,
        specializations: specializationsArray,
        years_experience: hrForm.years_experience,
        hourly_rate: hrForm.hourly_rate,
        bio: hrForm.bio,
        certifications: certificationsArray,
        languages_spoken: languagesArray,
        preferred_contact_method: hrForm.preferred_contact_method,
        timezone: hrForm.timezone,
        availability_status: 'available'
      };

      let result;
      if (userHRProfile) {
        result = await supabase
          .from('hr_profiles')
          .update(hrProfileData)
          .eq('id', userHRProfile.id);
      } else {
        result = await supabase
          .from('hr_profiles')
          .insert(hrProfileData);
      }

      if (result.error) throw result.error;

      toast.success(userHRProfile ? 'HR profile updated!' : 'HR profile created! Verification pending.');
      loadUserHRProfile();
      loadHRProfiles();
    } catch (error) {
      console.error('Error saving HR profile:', error);
      toast.error('Failed to save HR profile');
    }
  };

  const handleContactHR = (hrProfile: HRProfile) => {
    const contactMethod = hrProfile.preferred_contact_method;
    const email = hrProfile.profiles?.email;
    
    if (contactMethod === 'email' && email) {
      window.location.href = `mailto:${email}?subject=HR Services Inquiry`;
    } else {
      toast.info('Contact information will be shared upon request');
    }
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
          <UserCheck className="h-8 w-8 text-primary" />
          HR Professionals Directory
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Connect with experienced HR professionals or offer your HR services to the supply chain community.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="browse">Browse HR Professionals</TabsTrigger>
          <TabsTrigger value="create-profile">Create HR Profile</TabsTrigger>
        </TabsList>

        {/* Browse HR Professionals Tab */}
        <TabsContent value="browse" className="space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold mb-2">Find HR Experts</h2>
            <p className="text-muted-foreground">
              Connect with verified HR professionals for recruitment, consulting, and advisory services
            </p>
          </div>

          {hrProfiles.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <UserCheck className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No HR professionals yet</h3>
                <p className="text-muted-foreground mb-4">
                  Be the first to join our HR professionals directory!
                </p>
                <Button onClick={() => setActiveTab('create-profile')}>
                  Create HR Profile
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hrProfiles.map((hrProfile) => (
                <Card key={hrProfile.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <UserCheck className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{hrProfile.profiles?.full_name || 'Anonymous'}</h3>
                          {hrProfile.is_verified && (
                            <Badge variant="secondary" className="text-xs">
                              <Award className="h-3 w-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {hrProfile.profiles?.position} at {hrProfile.profiles?.company}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium">{hrProfile.rating.toFixed(1)}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        ({hrProfile.total_clients} clients)
                      </span>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Award className="h-4 w-4 text-muted-foreground" />
                        <span>{hrProfile.years_experience} years experience</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <span>${hrProfile.hourly_rate}/hour</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{hrProfile.timezone}</span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {hrProfile.bio}
                      </p>
                    </div>

                    <div className="mb-4">
                      <p className="text-xs font-medium mb-2">Services:</p>
                      <div className="flex flex-wrap gap-1">
                        {hrProfile.services_offered.slice(0, 3).map((service, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {service}
                          </Badge>
                        ))}
                        {hrProfile.services_offered.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{hrProfile.services_offered.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <Button 
                      onClick={() => handleContactHR(hrProfile)} 
                      className="w-full"
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      Contact
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Create HR Profile Tab */}
        <TabsContent value="create-profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>
                {userHRProfile ? 'Update Your HR Profile' : 'Create HR Professional Profile'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateHRProfile} className="space-y-4">
                <div>
                  <Label htmlFor="services">Services Offered (comma-separated)</Label>
                  <Input
                    id="services"
                    value={hrForm.services_offered}
                    onChange={(e) => setHRForm({...hrForm, services_offered: e.target.value})}
                    placeholder="Recruitment, Talent Acquisition, HR Consulting, Policy Development..."
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="specializations">Specializations (comma-separated)</Label>
                  <Input
                    id="specializations"
                    value={hrForm.specializations}
                    onChange={(e) => setHRForm({...hrForm, specializations: e.target.value})}
                    placeholder="Supply Chain HR, Manufacturing, Logistics, Executive Search..."
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
                      value={hrForm.years_experience}
                      onChange={(e) => setHRForm({...hrForm, years_experience: parseInt(e.target.value) || 0})}
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
                      value={hrForm.hourly_rate}
                      onChange={(e) => setHRForm({...hrForm, hourly_rate: parseFloat(e.target.value) || 0})}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="contact_method">Preferred Contact Method</Label>
                    <select
                      id="contact_method"
                      className="w-full p-2 border rounded-md"
                      value={hrForm.preferred_contact_method}
                      onChange={(e) => setHRForm({...hrForm, preferred_contact_method: e.target.value})}
                    >
                      <option value="email">Email</option>
                      <option value="phone">Phone</option>
                      <option value="platform">Platform Message</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="timezone">Timezone</Label>
                    <Input
                      id="timezone"
                      value={hrForm.timezone}
                      onChange={(e) => setHRForm({...hrForm, timezone: e.target.value})}
                      placeholder="UTC, EST, PST, etc."
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="certifications">Certifications (comma-separated)</Label>
                  <Input
                    id="certifications"
                    value={hrForm.certifications}
                    onChange={(e) => setHRForm({...hrForm, certifications: e.target.value})}
                    placeholder="SHRM-CP, PHR, SPHR, CIPD..."
                  />
                </div>

                <div>
                  <Label htmlFor="languages">Languages Spoken (comma-separated)</Label>
                  <Input
                    id="languages"
                    value={hrForm.languages_spoken}
                    onChange={(e) => setHRForm({...hrForm, languages_spoken: e.target.value})}
                    placeholder="English, Spanish, French..."
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="bio">Professional Bio</Label>
                  <Textarea
                    id="bio"
                    rows={4}
                    value={hrForm.bio}
                    onChange={(e) => setHRForm({...hrForm, bio: e.target.value})}
                    placeholder="Describe your HR experience, expertise, and what makes you unique..."
                    required
                  />
                </div>

                <Button type="submit" className="w-full">
                  {userHRProfile ? 'Update Profile' : 'Create HR Profile'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};