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
import { useAuth } from '@/contexts/AuthContext';
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
    location: ''
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
            <CardTitle>{steps[currentStep - 1].title}</CardTitle>
          </CardHeader>
          <CardContent>
            {steps[currentStep - 1].content}

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
