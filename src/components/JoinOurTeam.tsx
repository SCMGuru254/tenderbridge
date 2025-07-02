
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
import { 
  Users, 
  Briefcase, 
  MapPin, 
  Clock, 
  DollarSign, 
  Send,
  Star,
  Award,
  Target,
  Zap
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface JobOpening {
  id: string;
  title: string;
  department: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'internship';
  level: 'entry' | 'mid' | 'senior' | 'executive';
  salary_range: string;
  description: string;
  requirements: string[];
  benefits: string[];
  posted_date: string;
  is_active: boolean;
}

interface Application {
  id: string;
  job_opening_id: string;
  applicant_name: string;
  applicant_email: string;
  resume_url?: string;
  cover_letter: string;
  status: 'pending' | 'reviewing' | 'shortlisted' | 'rejected' | 'hired';
  applied_at: string;
}

export const JoinOurTeam = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('openings');
  const [jobOpenings, setJobOpenings] = useState<JobOpening[]>([]);
  const [selectedJob, setSelectedJob] = useState<JobOpening | null>(null);
  const [loading, setLoading] = useState(true);
  const [applicationForm, setApplicationForm] = useState({
    applicant_name: '',
    applicant_email: '',
    cover_letter: '',
    resume_file: null as File | null
  });

  // Mock job openings - in production, these would come from a CMS or database
  const mockJobOpenings: JobOpening[] = [
    {
      id: '1',
      title: 'Senior Full Stack Developer',
      department: 'Engineering',
      location: 'Nairobi, Kenya',
      type: 'full-time',
      level: 'senior',
      salary_range: 'KES 200,000 - 350,000',
      description: 'We are looking for a talented Senior Full Stack Developer to join our engineering team. You will be responsible for developing and maintaining our supply chain platform, working with React, Node.js, and modern web technologies.',
      requirements: [
        '5+ years of experience with React and Node.js',
        'Experience with TypeScript and modern JavaScript',
        'Knowledge of database design and optimization',
        'Experience with cloud platforms (AWS, Azure, or GCP)',
        'Strong problem-solving and communication skills'
      ],
      benefits: [
        'Competitive salary and equity package',
        'Comprehensive health insurance',
        'Flexible working hours and remote work options',
        'Professional development budget',
        'Annual team retreats'
      ],
      posted_date: '2024-01-15',
      is_active: true
    },
    {
      id: '2',
      title: 'Supply Chain Data Analyst',
      department: 'Analytics',
      location: 'Nairobi, Kenya',
      type: 'full-time',
      level: 'mid',
      salary_range: 'KES 120,000 - 200,000',
      description: 'Join our analytics team to help optimize supply chain operations through data-driven insights. You will work with large datasets to identify trends, inefficiencies, and opportunities for improvement.',
      requirements: [
        '3+ years of experience in data analysis',
        'Proficiency in SQL, Python, or R',
        'Experience with data visualization tools (Tableau, Power BI)',
        'Knowledge of supply chain operations',
        'Strong analytical and communication skills'
      ],
      benefits: [
        'Competitive salary package',
        'Health and dental insurance',
        'Learning and development opportunities',
        'Flexible work arrangements',
        'Performance bonuses'
      ],
      posted_date: '2024-01-10',
      is_active: true
    },
    {
      id: '3',
      title: 'Product Marketing Manager',
      department: 'Marketing',
      location: 'Nairobi, Kenya / Remote',
      type: 'full-time',
      level: 'mid',
      salary_range: 'KES 150,000 - 250,000',
      description: 'Lead product marketing initiatives for our platform. You will develop go-to-market strategies, create compelling messaging, and drive user acquisition and retention.',
      requirements: [
        '4+ years in product marketing or related role',
        'Experience with B2B SaaS products',
        'Strong written and verbal communication skills',
        'Data-driven approach to marketing',
        'Experience with marketing automation tools'
      ],
      benefits: [
        'Competitive salary and commission structure',
        'Stock options',
        'Health insurance',
        'Marketing conference attendance',
        'Remote work flexibility'
      ],
      posted_date: '2024-01-08',
      is_active: true
    },
    {
      id: '4',
      title: 'Supply Chain Internship Program',
      department: 'Operations',
      location: 'Nairobi, Kenya',
      type: 'internship',
      level: 'entry',
      salary_range: 'KES 40,000 - 60,000',
      description: 'Join our 6-month internship program to gain hands-on experience in supply chain operations, logistics, and technology. Perfect for recent graduates or students looking to start their career.',
      requirements: [
        'Recent graduate or final year student',
        'Degree in Supply Chain, Business, or related field',
        'Strong academic performance',
        'Passion for supply chain and logistics',
        'Good communication and analytical skills'
      ],
      benefits: [
        'Mentorship from industry experts',
        'Real project experience',
        'Certificate of completion',
        'Potential for full-time conversion',
        'Networking opportunities'
      ],
      posted_date: '2024-01-05',
      is_active: true
    }
  ];

  useEffect(() => {
    // In production, fetch job openings from database
    setJobOpenings(mockJobOpenings);
    setLoading(false);
  }, []);

  const handleApply = async (jobId: string) => {
    if (!applicationForm.applicant_name || !applicationForm.applicant_email || !applicationForm.cover_letter) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      // In production, save application to database
      const application: Partial<Application> = {
        job_opening_id: jobId,
        applicant_name: applicationForm.applicant_name,
        applicant_email: applicationForm.applicant_email,
        cover_letter: applicationForm.cover_letter,
        status: 'pending',
        applied_at: new Date().toISOString()
      };

      // Simulate API call
      console.log('Submitting application:', application);
      
      toast.success('Application submitted successfully!');
      
      // Reset form
      setApplicationForm({
        applicant_name: '',
        applicant_email: '',
        cover_letter: '',
        resume_file: null
      });
      
      setSelectedJob(null);
      setActiveTab('openings');
      
    } catch (error) {
      console.error('Error submitting application:', error);
      toast.error('Failed to submit application');
    }
  };

  const getJobTypeColor = (type: string) => {
    switch (type) {
      case 'full-time': return 'bg-green-100 text-green-800';
      case 'part-time': return 'bg-blue-100 text-blue-800';
      case 'contract': return 'bg-orange-100 text-orange-800';
      case 'internship': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'entry': return 'bg-green-100 text-green-800';
      case 'mid': return 'bg-blue-100 text-blue-800';
      case 'senior': return 'bg-orange-100 text-orange-800';
      case 'executive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
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
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-4">Join Our Team</h1>
        <p className="text-xl text-muted-foreground mb-6">
          Help us revolutionize supply chain management in Kenya and beyond
        </p>
        
        {/* Company Values */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="text-center">
            <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
              <Target className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-semibold">Mission-Driven</h3>
            <p className="text-sm text-muted-foreground">Impacting supply chains</p>
          </div>
          <div className="text-center">
            <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
              <Zap className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-semibold">Innovation</h3>
            <p className="text-sm text-muted-foreground">Cutting-edge technology</p>
          </div>
          <div className="text-center">
            <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="font-semibold">Collaboration</h3>
            <p className="text-sm text-muted-foreground">Teamwork excellence</p>
          </div>
          <div className="text-center">
            <div className="bg-orange-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
              <Award className="h-6 w-6 text-orange-600" />
            </div>
            <h3 className="font-semibold">Growth</h3>
            <p className="text-sm text-muted-foreground">Personal development</p>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="openings">Job Openings</TabsTrigger>
          <TabsTrigger value="culture">Our Culture</TabsTrigger>
          <TabsTrigger value="apply">Apply Now</TabsTrigger>
        </TabsList>

        <TabsContent value="openings" className="space-y-6">
          <div className="grid gap-6">
            {jobOpenings.map((job) => (
              <Card key={job.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl mb-2">{job.title}</CardTitle>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Briefcase className="h-4 w-4" />
                          {job.department}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {job.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          {job.salary_range}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Badge className={getJobTypeColor(job.type)}>
                        {job.type.replace('-', ' ')}
                      </Badge>
                      <Badge className={getLevelColor(job.level)}>
                        {job.level}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{job.description}</p>
                  
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h4 className="font-semibold mb-2">Requirements:</h4>
                      <ul className="text-sm space-y-1">
                        {job.requirements.slice(0, 3).map((req, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-green-500 mt-1">•</span>
                            {req}
                          </li>
                        ))}
                        {job.requirements.length > 3 && (
                          <li className="text-muted-foreground">
                            +{job.requirements.length - 3} more...
                          </li>
                        )}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Benefits:</h4>
                      <ul className="text-sm space-y-1">
                        {job.benefits.slice(0, 3).map((benefit, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-blue-500 mt-1">•</span>
                            {benefit}
                          </li>
                        ))}
                        {job.benefits.length > 3 && (
                          <li className="text-muted-foreground">
                            +{job.benefits.length - 3} more...
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      Posted {new Date(job.posted_date).toLocaleDateString()}
                    </div>
                    <Button 
                      onClick={() => {
                        setSelectedJob(job);
                        setActiveTab('apply');
                      }}
                    >
                      Apply Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="culture" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Why Work With Us?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-500" />
                    What We Offer
                  </h3>
                  <ul className="space-y-2 text-sm">
                    <li>• Competitive salaries and equity participation</li>
                    <li>• Comprehensive health insurance coverage</li>
                    <li>• Flexible working hours and remote options</li>
                    <li>• Professional development and learning budget</li>
                    <li>• Modern office space in Nairobi CBD</li>
                    <li>• Regular team building and social events</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-500" />
                    Our Culture
                  </h3>
                  <ul className="space-y-2 text-sm">
                    <li>• Collaborative and inclusive environment</li>
                    <li>• Innovation and creativity encouraged</li>
                    <li>• Work-life balance prioritized</li>
                    <li>• Continuous learning and growth mindset</li>
                    <li>• Open communication and feedback</li>
                    <li>• Social impact and community engagement</li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-muted p-6 rounded-lg">
                <h3 className="font-semibold mb-3">Employee Testimonials</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <blockquote className="border-l-4 border-primary pl-4">
                    <p className="text-sm italic mb-2">
                      "Working here has been amazing. The team is supportive, and I've learned so much about supply chain technology."
                    </p>
                    <cite className="text-xs text-muted-foreground">- Sarah M., Software Engineer</cite>
                  </blockquote>
                  <blockquote className="border-l-4 border-primary pl-4">
                    <p className="text-sm italic mb-2">
                      "The company really cares about work-life balance and professional growth. Best decision I made!"
                    </p>
                    <cite className="text-xs text-muted-foreground">- James K., Product Manager</cite>
                  </blockquote>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="apply" className="space-y-6">
          {selectedJob ? (
            <Card>
              <CardHeader>
                <CardTitle>Apply for {selectedJob.title}</CardTitle>
                <p className="text-muted-foreground">
                  {selectedJob.department} • {selectedJob.location}
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={applicationForm.applicant_name}
                      onChange={(e) => setApplicationForm(prev => ({
                        ...prev,
                        applicant_name: e.target.value
                      }))}
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={applicationForm.applicant_email}
                      onChange={(e) => setApplicationForm(prev => ({
                        ...prev,
                        applicant_email: e.target.value
                      }))}
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="cover-letter">Cover Letter *</Label>
                  <Textarea
                    id="cover-letter"
                    value={applicationForm.cover_letter}
                    onChange={(e) => setApplicationForm(prev => ({
                      ...prev,
                      cover_letter: e.target.value
                    }))}
                    placeholder="Tell us why you're interested in this position and what makes you a great fit..."
                    rows={6}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="resume">Resume/CV (Optional)</Label>
                  <Input
                    id="resume"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => setApplicationForm(prev => ({
                      ...prev,
                      resume_file: e.target.files?.[0] || null
                    }))}
                  />
                  <p className="text-xs text-muted-foreground">
                    Accepted formats: PDF, DOC, DOCX (Max 5MB)
                  </p>
                </div>

                <div className="flex gap-4">
                  <Button 
                    onClick={() => handleApply(selectedJob.id)}
                    className="flex-1"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Submit Application
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setSelectedJob(null);
                      setActiveTab('openings');
                    }}
                  >
                    Back to Jobs
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Briefcase className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Select a Position</h3>
                <p className="text-muted-foreground mb-4">
                  Choose a job opening from the listings to apply
                </p>
                <Button onClick={() => setActiveTab('openings')}>
                  View Job Openings
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
