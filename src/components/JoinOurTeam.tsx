
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Award, Send } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface TeamApplication {
  id?: string;
  full_name: string;
  email: string;
  phone?: string;
  position_applied: string;
  experience_years?: number;
  portfolio_url?: string;
  cover_letter?: string;
  resume_url?: string;
  skills?: string[];
  availability?: string;
  salary_expectation?: string;
}

export const JoinOurTeam = () => {
  const { user } = useAuth();
  const [application, setApplication] = useState<TeamApplication>({
    full_name: '',
    email: '',
    position_applied: '',
    skills: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (user) {
      setApplication(prev => ({ ...prev, email: user.email || '' }));
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('team_applications')
        .insert([application]);

      if (error) throw error;

      toast.success('Application submitted successfully!');
      setIsSubmitted(true);
    } catch (error) {
      console.error('Error submitting application:', error);
      toast.error('Failed to submit application');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="container mx-auto p-6 max-w-md">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Application Submitted</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <Award className="h-12 w-12 mx-auto text-green-500 mb-4" />
            <p className="text-muted-foreground mb-4">
              Thank you for your interest in joining our team! We have received your application and will review it shortly.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-md">
      <Card>
        <CardHeader>
          <CardTitle>Join Our Team</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                type="text"
                id="full_name"
                value={application.full_name}
                onChange={(e) => setApplication({ ...application, full_name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                id="email"
                value={application.email}
                onChange={(e) => setApplication({ ...application, email: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="position_applied">Position Applied For</Label>
              <Input
                type="text"
                id="position_applied"
                value={application.position_applied}
                onChange={(e) => setApplication({ ...application, position_applied: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="experience_years">Years of Experience</Label>
              <Input
                type="number"
                id="experience_years"
                value={application.experience_years || ''}
                onChange={(e) => setApplication({ ...application, experience_years: parseInt(e.target.value) })}
              />
            </div>
            <div>
              <Label htmlFor="skills">Skills (comma-separated)</Label>
              <Input
                type="text"
                id="skills"
                placeholder="e.g., Supply Chain, Logistics, Procurement"
                onChange={(e) => {
                  const skillsArray = e.target.value.split(',').map(skill => skill.trim());
                  setApplication({ ...application, skills: skillsArray });
                }}
              />
            </div>
            <div>
              <Label htmlFor="cover_letter">Cover Letter</Label>
              <Textarea
                id="cover_letter"
                placeholder="Write a brief cover letter..."
                rows={4}
                onChange={(e) => setApplication({ ...application, cover_letter: e.target.value })}
              />
            </div>
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                'Submitting...'
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Submit Application
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
