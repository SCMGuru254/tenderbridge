import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, ArrowRight, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface OnboardingData {
  full_name: string;
  position: string;
  company: string;
  experience_years: number;
  location: string;
  bio: string;
  skills: string[];
  career_goals: string;
  user_type: 'job_seeker' | 'recruiter' | 'mentor';
}

const OnboardingComplete = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<OnboardingData>({
    full_name: '',
    position: '',
    company: '',
    experience_years: 0,
    location: 'Nairobi, Kenya',
    bio: '',
    skills: [],
    career_goals: '',
    user_type: 'job_seeker'
  });

  const steps = [
    {
      title: 'Basic Information',
      description: 'Tell us about yourself'
    },
    {
      title: 'Professional Background',
      description: 'Your experience and expertise'
    },
    {
      title: 'Goals & Preferences',
      description: 'What you want to achieve'
    },
    {
      title: 'Complete Setup',
      description: 'Finish your profile'
    }
  ];

  const supplyChainSkills = [
    'Logistics Management',
    'Procurement',
    'Inventory Management',
    'Supply Chain Analytics',
    'Transportation',
    'Warehouse Management',
    'Vendor Management',
    'Demand Planning',
    'ERP Systems',
    'Cold Chain Management'
  ];

  const locations = [
    'Nairobi, Kenya',
    'Mombasa, Kenya',
    'Kisumu, Kenya',
    'Nakuru, Kenya',
    'Eldoret, Kenya',
    'Remote'
  ];

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkillToggle = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const handleSubmit = async () => {
    if (!user) return;

    setIsSubmitting(true);
    try {
      // Update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          position: formData.position,
          company: formData.company,
          location: formData.location,
          bio: formData.bio,
          onboarding_completed: true,
          user_type: formData.user_type
        })
        .eq('id', user.id);

      if (profileError) throw profileError;

      // Create specialized profiles based on user type
      if (formData.user_type === 'mentor') {
        const { error: mentorError } = await supabase
          .from('mentors')
          .insert({
            user_id: user.id,
            bio: formData.bio,
            experience_years: formData.experience_years,
            expertise_areas: formData.skills,
            hourly_rate: 0, // Free mentorship
            is_active: true
          });
        
        if (mentorError) console.error('Mentor profile error:', mentorError);
      }

      if (formData.user_type === 'job_seeker') {
        const { error: menteeError } = await supabase
          .from('mentees')
          .insert({
            user_id: user.id,
            current_level: formData.experience_years > 3 ? 'experienced' : 'beginner',
            career_goals: formData.career_goals,
            areas_of_interest: formData.skills
          });
        
        if (menteeError) console.error('Mentee profile error:', menteeError);
      }

      toast.success('Profile completed successfully!');
      
      // Redirect based on user type
      if (formData.user_type === 'recruiter') {
        navigate('/dashboard');
      } else {
        navigate('/jobs');
      }
      
    } catch (error) {
      console.error('Error completing onboarding:', error);
      toast.error('Failed to complete profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="full_name">Full Name *</Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                placeholder="Your full name"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="user_type">I am a *</Label>
              <Select 
                value={formData.user_type} 
                onValueChange={(value: any) => setFormData(prev => ({ ...prev, user_type: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="job_seeker">Job Seeker</SelectItem>
                  <SelectItem value="recruiter">Recruiter/HR</SelectItem>
                  <SelectItem value="mentor">Mentor</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="location">Location *</Label>
              <Select 
                value={formData.location} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, location: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {locations.map(loc => (
                    <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="position">Current Position *</Label>
              <Input
                id="position"
                value={formData.position}
                onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                placeholder="e.g. Supply Chain Manager"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                placeholder="Your current or previous company"
              />
            </div>

            <div>
              <Label htmlFor="experience_years">Years of Experience *</Label>
              <Select 
                value={formData.experience_years.toString()} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, experience_years: parseInt(value) }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">0-1 years</SelectItem>
                  <SelectItem value="2">2-3 years</SelectItem>
                  <SelectItem value="4">4-5 years</SelectItem>
                  <SelectItem value="6">6-10 years</SelectItem>
                  <SelectItem value="11">10+ years</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Select Your Skills</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {supplyChainSkills.map(skill => (
                  <Badge
                    key={skill}
                    variant={formData.skills.includes(skill) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => handleSkillToggle(skill)}
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="bio">Professional Bio</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                placeholder="Tell us about your experience and expertise..."
                rows={4}
              />
            </div>
            
            <div>
              <Label htmlFor="career_goals">Career Goals</Label>
              <Textarea
                id="career_goals"
                value={formData.career_goals}
                onChange={(e) => setFormData(prev => ({ ...prev, career_goals: e.target.value }))}
                placeholder="What are your career aspirations?"
                rows={3}
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Ready to Get Started!</h3>
            <p className="text-muted-foreground">
              Your profile is complete. Let's explore opportunities in Kenya's supply chain industry.
            </p>
            
            <div className="bg-secondary/50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Profile Summary:</h4>
              <div className="text-sm text-left space-y-1">
                <p><strong>Name:</strong> {formData.full_name}</p>
                <p><strong>Role:</strong> {formData.position}</p>
                <p><strong>Location:</strong> {formData.location}</p>
                <p><strong>Skills:</strong> {formData.skills.join(', ')}</p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl">Welcome to SupplyChain Jobs</CardTitle>
          </div>
          
          {/* Progress Indicator */}
          <div className="flex items-center justify-between mb-4">
            {steps.map((_, index) => (
              <div key={index} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  index <= currentStep ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {index + 1}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-1 mx-2 ${
                    index < currentStep ? 'bg-primary' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <h3 className="font-semibold">{steps[currentStep]?.title}</h3>
            <p className="text-sm text-muted-foreground">{steps[currentStep]?.description}</p>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {renderStep()}
          
          <div className="flex justify-between pt-6">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
            >
              Previous
            </Button>
            
            <Button
              onClick={handleNext}
              disabled={isSubmitting || !formData.full_name}
            >
              {isSubmitting ? 'Completing...' : currentStep === steps.length - 1 ? 'Complete Setup' : 'Next'}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OnboardingComplete;