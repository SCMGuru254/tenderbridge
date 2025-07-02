
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Users, Send, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface TeamApplication {
  full_name: string;
  email: string;
  phone: string;
  position_applied: string;
  experience_years: number;
  portfolio_url: string;
  cover_letter: string;
  skills: string[];
  availability: string;
  salary_expectation: string;
}

const openPositions = [
  {
    title: 'Frontend Developer',
    department: 'Engineering',
    type: 'Full-time',
    location: 'Remote/Nairobi',
    description: 'Build responsive web applications using React, TypeScript, and modern UI libraries.',
    requirements: ['React', 'TypeScript', 'Tailwind CSS', '3+ years experience']
  },
  {
    title: 'Supply Chain Analyst',
    department: 'Operations',
    type: 'Full-time',
    location: 'Nairobi',
    description: 'Analyze supply chain data and optimize logistics processes for our platform.',
    requirements: ['Data Analysis', 'Supply Chain Management', 'Excel/SQL', '2+ years experience']
  },
  {
    title: 'Content Marketing Specialist',
    department: 'Marketing',
    type: 'Full-time',
    location: 'Remote',
    description: 'Create engaging content for our job platform and manage social media presence.',
    requirements: ['Content Writing', 'Social Media Marketing', 'SEO', '1+ years experience']
  },
  {
    title: 'DevOps Engineer',
    department: 'Engineering',
    type: 'Full-time',
    location: 'Remote/Nairobi',
    description: 'Manage cloud infrastructure and implement CI/CD pipelines.',
    requirements: ['AWS/GCP', 'Docker', 'Kubernetes', 'CI/CD', '3+ years experience']
  }
];

export const JoinOurTeam = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState<TeamApplication[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<TeamApplication>({
    full_name: '',
    email: '',
    phone: '',
    position_applied: '',
    experience_years: 0,
    portfolio_url: '',
    cover_letter: '',
    skills: [],
    availability: 'immediate',
    salary_expectation: ''
  });

  useEffect(() => {
    if (user) {
      fetchUserApplications();
    }
  }, [user]);

  const fetchUserApplications = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('team_applications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('team_applications')
        .insert({
          ...formData,
          user_id: user?.id || null,
          status: 'pending'
        });

      if (error) throw error;

      toast.success('Application submitted successfully!');
      setShowForm(false);
      setFormData({
        full_name: '',
        email: '',
        phone: '',
        position_applied: '',
        experience_years: 0,
        portfolio_url: '',
        cover_letter: '',
        skills: [],
        availability: 'immediate',
        salary_expectation: ''
      });
      fetchUserApplications();
    } catch (error) {
      console.error('Error submitting application:', error);
      toast.error('Failed to submit application');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkillsChange = (value: string) => {
    const skills = value.split(',').map(skill => skill.trim()).filter(Boolean);
    setFormData(prev => ({ ...prev, skills }));
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-4 flex items-center justify-center gap-2">
          <Users className="h-8 w-8 text-primary" />
          Join Our Team
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Help us revolutionize the supply chain and logistics job market in Kenya. 
          We're looking for passionate individuals to join our growing team.
        </p>
      </div>

      {/* Open Positions */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {openPositions.map((position, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">{position.title}</CardTitle>
                  <p className="text-muted-foreground">{position.department}</p>
                </div>
                <div className="flex gap-2">
                  <Badge variant="outline">{position.type}</Badge>
                  <Badge variant="secondary">{position.location}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-4">{position.description}</p>
              <div className="mb-4">
                <h4 className="font-semibold mb-2">Requirements:</h4>
                <div className="flex flex-wrap gap-2">
                  {position.requirements.map((req, reqIndex) => (
                    <Badge key={reqIndex} variant="outline" className="text-xs">
                      {req}
                    </Badge>
                  ))}
                </div>
              </div>
              <Button 
                onClick={() => {
                  setFormData(prev => ({ ...prev, position_applied: position.title }));
                  setShowForm(true);
                }}
                className="w-full"
              >
                Apply Now
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Application Form */}
      {showForm && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Apply for Position</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="full_name">Full Name *</Label>
                  <Input
                    id="full_name"
                    value={formData.full_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="position">Position Applied For *</Label>
                  <Select value={formData.position_applied} onValueChange={(value) => setFormData(prev => ({ ...prev, position_applied: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select position" />
                    </SelectTrigger>
                    <SelectContent>
                      {openPositions.map((pos, index) => (
                        <SelectItem key={index} value={pos.title}>{pos.title}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="experience">Years of Experience</Label>
                  <Input
                    id="experience"
                    type="number"
                    min="0"
                    value={formData.experience_years}
                    onChange={(e) => setFormData(prev => ({ ...prev, experience_years: parseInt(e.target.value) || 0 }))}
                  />
                </div>
                <div>
                  <Label htmlFor="portfolio">Portfolio/LinkedIn URL</Label>
                  <Input
                    id="portfolio"
                    type="url"
                    value={formData.portfolio_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, portfolio_url: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="skills">Skills (comma-separated)</Label>
                <Input
                  id="skills"
                  placeholder="React, TypeScript, Node.js, etc."
                  value={formData.skills.join(', ')}
                  onChange={(e) => handleSkillsChange(e.target.value)}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="availability">Availability</Label>
                  <Select value={formData.availability} onValueChange={(value) => setFormData(prev => ({ ...prev, availability: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="immediate">Immediate</SelectItem>
                      <SelectItem value="2-weeks">2 Weeks Notice</SelectItem>
                      <SelectItem value="1-month">1 Month Notice</SelectItem>
                      <SelectItem value="flexible">Flexible</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="salary">Salary Expectation</Label>
                  <Input
                    id="salary"
                    placeholder="e.g., KES 80,000 - 120,000"
                    value={formData.salary_expectation}
                    onChange={(e) => setFormData(prev => ({ ...prev, salary_expectation: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="cover_letter">Cover Letter *</Label>
                <Textarea
                  id="cover_letter"
                  rows={4}
                  placeholder="Tell us why you're interested in this position and what makes you a great fit..."
                  value={formData.cover_letter}
                  onChange={(e) => setFormData(prev => ({ ...prev, cover_letter: e.target.value }))}
                  required
                />
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>Submitting...</>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Submit Application
                    </>
                  )}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* User's Applications */}
      {user && applications.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {applications.map((app, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-semibold">{app.position_applied}</h4>
                    <p className="text-sm text-muted-foreground">Applied with {app.experience_years} years experience</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={app.status === 'pending' ? 'secondary' : app.status === 'approved' ? 'default' : 'destructive'}>
                      {app.status === 'pending' && 'Under Review'}
                      {app.status === 'approved' && 'Approved'}
                      {app.status === 'rejected' && 'Not Selected'}
                    </Badge>
                    {app.status === 'approved' && <CheckCircle className="h-4 w-4 text-green-500" />}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
