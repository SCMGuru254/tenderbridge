
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Briefcase, 
  MapPin, 
  Clock, 
  Send,
  CheckCircle,
  ExternalLink
} from 'lucide-react';
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
  resume_url: string;
  skills: string[];
  availability: string;
  salary_expectation: string;
}

interface JobOpening {
  id: string;
  title: string;
  description: string;
  requirements: string[];
  location: string;
  type: string;
  salary_range: string;
  posted_date: string;
  is_remote: boolean;
}

export const JoinOurTeam = () => {
  const { user } = useAuth();
  const [openPositions, setOpenPositions] = useState<JobOpening[]>([]);
  const [selectedPosition, setSelectedPosition] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applicationData, setApplicationData] = useState<TeamApplication>({
    full_name: '',
    email: '',
    phone: '',
    position_applied: '',
    experience_years: 0,
    portfolio_url: '',
    cover_letter: '',
    resume_url: '',
    skills: [],
    availability: 'immediate',
    salary_expectation: ''
  });

  useEffect(() => {
    loadOpenPositions();
    if (user) {
      loadUserProfile();
    }
  }, [user]);

  const loadOpenPositions = () => {
    // Mock data for open positions - in a real app, this would come from a database
    const positions: JobOpening[] = [
      {
        id: '1',
        title: 'Senior Supply Chain Analyst',
        description: 'Lead analysis of supply chain data and optimize operations for maximum efficiency.',
        requirements: [
          '5+ years supply chain experience',
          'Advanced Excel/SQL skills',
          'Data visualization tools (Tableau, Power BI)',
          'Bachelor\'s degree in Supply Chain, Business, or related field'
        ],
        location: 'Remote/Hybrid',
        type: 'Full-time',
        salary_range: '$75,000 - $95,000',
        posted_date: '2024-01-15',
        is_remote: true
      },
      {
        id: '2',
        title: 'Logistics Coordinator',
        description: 'Coordinate transportation and warehousing operations to ensure timely delivery.',
        requirements: [
          '2+ years logistics experience',
          'Knowledge of TMS/WMS systems',
          'Strong communication skills',
          'Supply chain certification preferred'
        ],
        location: 'Chicago, IL',
        type: 'Full-time',
        salary_range: '$50,000 - $65,000',
        posted_date: '2024-01-12',
        is_remote: false
      },
      {
        id: '3',
        title: 'Procurement Specialist',
        description: 'Manage vendor relationships and procurement processes for cost optimization.',
        requirements: [
          '3+ years procurement experience',
          'Negotiation skills',
          'ERP system knowledge',
          'Bachelor\'s degree preferred'
        ],
        location: 'New York, NY',
        type: 'Full-time',
        salary_range: '$60,000 - $80,000',
        posted_date: '2024-01-10',
        is_remote: false
      },
      {
        id: '4',
        title: 'Supply Chain Intern',
        description: 'Support supply chain operations and gain hands-on experience in a growing company.',
        requirements: [
          'Currently pursuing degree in relevant field',
          'Basic understanding of supply chain concepts',
          'Strong analytical skills',
          'Eagerness to learn'
        ],
        location: 'Remote',
        type: 'Internship',
        salary_range: '$15 - $20/hour',
        posted_date: '2024-01-08',
        is_remote: true
      }
    ];
    setOpenPositions(positions);
  };

  const loadUserProfile = async () => {
    if (!user) return;
    
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profile) {
        setApplicationData(prev => ({
          ...prev,
          full_name: profile.full_name || '',
          email: profile.email || user.email || ''
        }));
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const handleInputChange = (field: keyof TeamApplication, value: any) => {
    setApplicationData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSkillsChange = (skillsText: string) => {
    const skillsArray = skillsText.split(',').map(skill => skill.trim()).filter(skill => skill.length > 0);
    setApplicationData(prev => ({
      ...prev,
      skills: skillsArray
    }));
  };

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!applicationData.full_name || !applicationData.email || !applicationData.position_applied) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('team_applications')
        .insert({
          user_id: user?.id || null,
          ...applicationData
        });

      if (error) throw error;

      toast.success('Application submitted successfully! We\'ll be in touch soon.');
      
      // Reset form
      setApplicationData({
        full_name: '',
        email: user?.email || '',
        phone: '',
        position_applied: '',
        experience_years: 0,
        portfolio_url: '',
        cover_letter: '',
        resume_url: '',
        skills: [],
        availability: 'immediate',
        salary_expectation: ''
      });
      setSelectedPosition('');

    } catch (error) {
      console.error('Error submitting application:', error);
      toast.error('Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return '1 day ago';
    return `${diffDays} days ago`;
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
          <Users className="h-10 w-10 text-primary" />
          Join Our Team
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Be part of a revolutionary platform that's transforming how supply chain professionals connect, 
          learn, and advance their careers.
        </p>
      </div>

      {/* Company Culture Section */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
              <Briefcase className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-semibold mb-2">Innovation First</h3>
            <p className="text-sm text-muted-foreground">
              We're at the forefront of supply chain technology, constantly pushing boundaries.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-semibold mb-2">Collaborative Culture</h3>
            <p className="text-sm text-muted-foreground">
              Work with passionate professionals who believe in the power of teamwork.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="font-semibold mb-2">Growth Focused</h3>
            <p className="text-sm text-muted-foreground">
              Continuous learning opportunities and clear career advancement paths.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Open Positions */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Open Positions</h2>
        <div className="grid gap-6">
          {openPositions.map((position) => (
            <Card key={position.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold">{position.title}</h3>
                      <Badge variant={position.type === 'Full-time' ? 'default' : 'secondary'}>
                        {position.type}
                      </Badge>
                      {position.is_remote && (
                        <Badge variant="outline">Remote</Badge>
                      )}
                    </div>
                    
                    <p className="text-muted-foreground mb-3">{position.description}</p>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-3">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{position.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Briefcase className="h-4 w-4" />
                        <span>{position.salary_range}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>Posted {getTimeAgo(position.posted_date)}</span>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="font-medium mb-2">Requirements:</h4>
                      <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                        {position.requirements.map((req, index) => (
                          <li key={index}>{req}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <Button 
                      onClick={() => {
                        setSelectedPosition(position.title);
                        setApplicationData(prev => ({
                          ...prev,
                          position_applied: position.title
                        }));
                      }}
                      className="whitespace-nowrap"
                    >
                      Apply Now
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Application Form */}
      {selectedPosition && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5" />
              Apply for {selectedPosition}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitApplication} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="full_name">Full Name *</Label>
                  <Input
                    id="full_name"
                    value={applicationData.full_name}
                    onChange={(e) => handleInputChange('full_name', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={applicationData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={applicationData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="experience_years">Years of Experience</Label>
                  <Input
                    id="experience_years"
                    type="number"
                    min="0"
                    value={applicationData.experience_years}
                    onChange={(e) => handleInputChange('experience_years', parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="portfolio_url">Portfolio/LinkedIn URL</Label>
                  <Input
                    id="portfolio_url"
                    type="url"
                    value={applicationData.portfolio_url}
                    onChange={(e) => handleInputChange('portfolio_url', e.target.value)}
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <Label htmlFor="resume_url">Resume URL (Google Drive, Dropbox, etc.)</Label>
                  <Input
                    id="resume_url"
                    type="url"
                    value={applicationData.resume_url}
                    onChange={(e) => handleInputChange('resume_url', e.target.value)}
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="skills">Skills (comma-separated)</Label>
                <Input
                  id="skills"
                  value={applicationData.skills.join(', ')}
                  onChange={(e) => handleSkillsChange(e.target.value)}
                  placeholder="Supply Chain Management, SAP, Excel, Data Analysis..."
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="availability">Availability</Label>
                  <select
                    id="availability"
                    className="w-full p-2 border rounded-md"
                    value={applicationData.availability}
                    onChange={(e) => handleInputChange('availability', e.target.value)}
                  >
                    <option value="immediate">Available Immediately</option>
                    <option value="2weeks">2 Weeks Notice</option>
                    <option value="1month">1 Month Notice</option>
                    <option value="flexible">Flexible</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="salary_expectation">Salary Expectation</Label>
                  <Input
                    id="salary_expectation"
                    value={applicationData.salary_expectation}
                    onChange={(e) => handleInputChange('salary_expectation', e.target.value)}
                    placeholder="$60,000 - $80,000"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="cover_letter">Cover Letter</Label>
                <Textarea
                  id="cover_letter"
                  rows={6}
                  value={applicationData.cover_letter}
                  onChange={(e) => handleInputChange('cover_letter', e.target.value)}
                  placeholder="Tell us why you're interested in this position and what makes you a great fit..."
                />
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Submit Application'}
                  <Send className="ml-2 h-4 w-4" />
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setSelectedPosition('')}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Why Join Us Section */}
      <Card>
        <CardHeader>
          <CardTitle>Why Join Our Team?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">Benefits & Perks</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Competitive salary and equity options
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Comprehensive health, dental, and vision insurance
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Flexible work arrangements (remote/hybrid)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Professional development budget
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Unlimited PTO policy
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Growth Opportunities</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-500" />
                  Work on cutting-edge supply chain technology
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-500" />
                  Mentorship from industry experts
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-500" />
                  Conference and training opportunities
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-500" />
                  Cross-functional collaboration
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-500" />
                  Clear career progression paths
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
