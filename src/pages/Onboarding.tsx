import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

const Onboarding = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profile, setProfile] = useState({
    full_name: '',
    position: '',
    company: '',
    bio: '',
    linkedin_url: '',
    experience_level: '',
    career_goals: '',
    skills: '',
    location: '',
    user_type: 'candidate' // Default
  });

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    if (!user) {
      toast.error('Please sign in to complete onboarding');
      navigate('/auth');
      return;
    }

    setIsSubmitting(true);

    try {
      // First, check if profile already exists
      const { data: existingProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      const profileData = {
        id: user.id,
        email: user.email || '',
        full_name: profile.full_name || 'User',
        position: profile.position || '',
        company: profile.company || '',
        bio: profile.bio || '',
        linkedin_url: profile.linkedin_url || '',
        experience_level: profile.experience_level || 'entry',
        career_goals: profile.career_goals || '',
        skills: profile.skills || '',
        location: profile.location || 'Kenya',
        user_type: profile.user_type,
        updated_at: new Date().toISOString()
      };

      let result;
      if (existingProfile) {
        // Update existing profile
        result = await supabase
          .from('profiles')
          .update(profileData)
          .eq('id', user.id);
      } else {
        // Insert new profile
        result = await supabase
          .from('profiles')
          .insert([profileData]);
      }

      if (result.error) {
        console.error('Profile save error:', result.error);
        throw result.error;
      }

      toast.success('Profile completed successfully! Welcome to SupplyChain Jobs!');
      navigate('/dashboard');
      
    } catch (error: any) {
      console.error('Error completing onboarding:', error);
      
      let errorMessage = 'Failed to complete profile. ';
      if (error.message) {
        errorMessage += error.message;
      } else if (error.code) {
        errorMessage += `Error code: ${error.code}`;
      } else {
        errorMessage += 'Please try again or contact support.';
      }
      
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    {
      title: 'Choose Your Path',
      content: (
        <div className="grid md:grid-cols-2 gap-4 py-4">
          <div 
            className={`p-6 border-2 rounded-xl cursor-pointer transition-all hover:border-primary ${profile.user_type === 'candidate' ? 'border-primary bg-primary/5' : 'border-gray-200'}`}
            onClick={() => setProfile({ ...profile, user_type: 'candidate' })}
          >
            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mb-4 text-blue-600">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
            <h3 className="font-bold text-lg mb-2">Job Seeker</h3>
            <p className="text-sm text-gray-500">I am looking for jobs, mentorship, and career growth opportunities.</p>
          </div>

          <div 
            className={`p-6 border-2 rounded-xl cursor-pointer transition-all hover:border-primary ${profile.user_type === 'employer' ? 'border-primary bg-primary/5' : 'border-gray-200'}`}
            onClick={() => setProfile({ ...profile, user_type: 'employer' })}
          >
            <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center mb-4 text-purple-600">
               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
            </div>
            <h3 className="font-bold text-lg mb-2">Employer / Recruiter</h3>
            <p className="text-sm text-gray-500">I want to post jobs, manage applications, and find top talent.</p>
          </div>

          <div 
            className={`p-6 border-2 rounded-xl cursor-pointer transition-all hover:border-primary ${profile.user_type === 'affiliate' ? 'border-primary bg-primary/5' : 'border-gray-200'}`}
            onClick={() => setProfile({ ...profile, user_type: 'affiliate' })}
          >
            <div className="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center mb-4 text-yellow-600">
               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>
            </div>
            <h3 className="font-bold text-lg mb-2">Growth Partner</h3>
            <p className="text-sm text-gray-500">I want to earn commissions by promoting courses and jobs.</p>
          </div>
        </div>
      )
    },
    {
      title: 'Personal Information',
      content: (
        <div className="space-y-4">
          <div>
            <Label htmlFor="full_name">Full Name *</Label>
            <Input
              id="full_name"
              value={profile.full_name}
              onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
              placeholder="John Doe"
              required
            />
          </div>
          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={profile.location}
              onChange={(e) => setProfile({ ...profile, location: e.target.value })}
              placeholder="Nairobi, Kenya"
            />
          </div>
          <div>
            <Label htmlFor="linkedin_url">LinkedIn Profile (Optional)</Label>
            <Input
              id="linkedin_url"
              value={profile.linkedin_url}
              onChange={(e) => setProfile({ ...profile, linkedin_url: e.target.value })}
              placeholder="https://linkedin.com/in/johndoe"
            />
          </div>
        </div>
      )
    },
    {
      title: 'Professional Background',
      content: (
        <div className="space-y-4">
          <div>
            <Label htmlFor="position">Current Position</Label>
            <Input
              id="position"
              value={profile.position}
              onChange={(e) => setProfile({ ...profile, position: e.target.value })}
              placeholder="Supply Chain Manager"
            />
          </div>
          <div>
            <Label htmlFor="company">Current Company</Label>
            <Input
              id="company"
              value={profile.company}
              onChange={(e) => setProfile({ ...profile, company: e.target.value })}
              placeholder="ABC Corporation"
            />
          </div>
          <div>
            <Label htmlFor="experience_level">Experience Level</Label>
            <Select value={profile.experience_level} onValueChange={(value) => setProfile({ ...profile, experience_level: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select experience level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="entry">Entry Level (0-2 years)</SelectItem>
                <SelectItem value="mid">Mid Level (3-5 years)</SelectItem>
                <SelectItem value="senior">Senior Level (6-10 years)</SelectItem>
                <SelectItem value="executive">Executive (10+ years)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )
    },
    {
      title: 'Skills & Expertise',
      content: (
        <div className="space-y-4">
          <div>
            <Label htmlFor="skills">Key Skills (comma-separated)</Label>
            <Textarea
              id="skills"
              value={profile.skills}
              onChange={(e) => setProfile({ ...profile, skills: e.target.value })}
              placeholder="Supply Chain Management, Logistics, Procurement, Inventory Management"
              rows={3}
            />
          </div>
          <div>
            <Label htmlFor="bio">Professional Summary</Label>
            <Textarea
              id="bio"
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              placeholder="Brief description of your professional background and expertise"
              rows={4}
            />
          </div>
        </div>
      )
    },
    {
      title: 'Career Goals',
      content: (
        <div className="space-y-4">
          <div>
            <Label htmlFor="career_goals">What are your career goals?</Label>
            <Textarea
              id="career_goals"
              value={profile.career_goals}
              onChange={(e) => setProfile({ ...profile, career_goals: e.target.value })}
              placeholder="Describe what you hope to achieve in your supply chain career"
              rows={4}
            />
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome to SupplyChain Jobs</h1>
          <p className="text-gray-600">Let's set up your profile to get started</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Step {currentStep} of {steps.length}</span>
            <span className="text-sm text-gray-500">{Math.round((currentStep / steps.length) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / steps.length) * 100}%` }}
            />
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{steps[currentStep - 1]?.title}</CardTitle>
          </CardHeader>
          <CardContent>
            {steps[currentStep - 1]?.content}

            <div className="flex justify-between mt-8">
              <Button 
                variant="outline" 
                onClick={handlePrevious}
                disabled={currentStep === 1 || isSubmitting}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
              
              {currentStep === steps.length ? (
                <Button 
                  onClick={handleComplete}
                  disabled={isSubmitting || !profile.full_name.trim()}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                      Completing...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Complete Profile
                    </>
                  )}
                </Button>
              ) : (
                <Button onClick={handleNext} disabled={isSubmitting}>
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Onboarding;
