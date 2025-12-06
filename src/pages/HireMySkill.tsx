import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  TrendingUp,
  DollarSign,
  Users,
  Plus,
  ThumbsUp,
  Search,
  Clock,
  Briefcase,
  Calendar,
  CheckCircle2,
  User,
  Award
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

interface SkillPoll {
  id: string;
  skill_name: string;
  employer_id: string;
  demand_level: string;
  poll_type: string;
  description?: string;
  budget_range?: string;
  urgency_days: number;
  votes_count: number;
  created_at: string;
  expires_at: string;
  user_voted?: boolean;
}

interface ProfessionalProfile {
  id: string;
  user_id: string;
  title: string;
  summary?: string;
  hourly_rate?: number;
  experience_years?: number;
  is_available: boolean;
  skills: Array<{
    id: string;
    skill_name: string;
    proficiency_level: string;
    years_experience?: number;
  }>;
  user?: {
    full_name?: string;
    avatar_url?: string;
    location?: string;
  };
}

interface Project {
  id: string;
  title: string;
  description: string;
  budget_min?: number;
  budget_max?: number;
  duration_estimate?: string;
  status: string;
  created_at: string;
  client?: {
    full_name?: string;
    avatar_url?: string;
  };
  required_skills: Array<{
    skill_name: string;
    minimum_proficiency: string;
  }>;
}

export default function HireMySkill() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('professionals');
  const [skillPolls, setSkillPolls] = useState<SkillPoll[]>([]);
  const [professionals, setProfessionals] = useState<ProfessionalProfile[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [skillFilter, setSkillFilter] = useState('all');
  const [budgetRange] = useState([0, 500]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [durationFilter, setDurationFilter] = useState('all');

  // Form states
  const [skillForm, setSkillForm] = useState({
    skill_name: '',
    hourly_rate: 50,
    experience_years: 0,
    description: ''
  });

  const [pollForm, setPollForm] = useState({
    skill_name: '',
    demand_level: 'medium',
    poll_type: 'demand',
    description: '',
    budget_range: '',
    urgency_days: 30
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadSkillPolls(),
        loadProfessionals(),
        loadProjects()
      ]);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSkillPolls = async () => {
    try {
      const { data, error } = await supabase
        .from('skill_polls')
        .select('*')
        .order('votes_count', { ascending: false });

      if (error) throw error;
      setSkillPolls(data || []);
    } catch (error) {
      console.error('Error loading skill polls:', error);
    }
  };

  const loadProfessionals = async () => {
    try {
      const { data: profiles, error } = await supabase
        .from('professional_profiles')
        .select(`
          id, user_id, title, summary, hourly_rate, experience_years, is_available,
          professional_skills (
            id, proficiency_level, years_experience,
            skills (name)
          )
        `)
        .eq('is_available', true)
        .limit(20);

      if (error) throw error;

      // Transform data with user info
      const transformedProfiles: ProfessionalProfile[] = [];
      
      for (const profile of profiles || []) {
        // Fetch user profile separately
        const { data: userProfile } = await supabase
          .from('profiles')
          .select('full_name, avatar_url, location')
          .eq('id', profile.user_id)
          .single();

        transformedProfiles.push({
          id: profile.id,
          user_id: profile.user_id,
          title: profile.title,
          summary: profile.summary,
          hourly_rate: profile.hourly_rate,
          experience_years: profile.experience_years,
          is_available: profile.is_available,
          skills: ((profile.professional_skills as any[]) || []).map((ps: any) => ({
            id: ps.id,
            skill_name: ps.skills?.name || 'Unknown',
            proficiency_level: ps.proficiency_level,
            years_experience: ps.years_experience
          })),
          user: userProfile || undefined
        });
      }

      setProfessionals(transformedProfiles);
    } catch (error) {
      console.error('Error loading professionals:', error);
    }
  };

  const loadProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          id, title, description, budget_min, budget_max, duration_estimate, status, created_at, client_id,
          project_skills (
            minimum_proficiency,
            skills (name)
          )
        `)
        .eq('status', 'open')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;

      // Transform projects with client info
      const transformedProjects: Project[] = [];
      
      for (const project of data || []) {
        // Fetch client profile
        const { data: clientProfile } = await supabase
          .from('profiles')
          .select('full_name, avatar_url')
          .eq('id', project.client_id)
          .single();

        transformedProjects.push({
          id: project.id,
          title: project.title,
          description: project.description,
          budget_min: project.budget_min,
          budget_max: project.budget_max,
          duration_estimate: project.duration_estimate,
          status: project.status,
          created_at: project.created_at,
          client: clientProfile || undefined,
          required_skills: ((project.project_skills as any[]) || []).map((ps: any) => ({
            skill_name: ps.skills?.name || 'Unknown',
            minimum_proficiency: ps.minimum_proficiency
          }))
        });
      }

      setProjects(transformedProjects);
    } catch (error) {
      console.error('Error loading projects:', error);
    }
  };

  const handleCreatePoll = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please sign in to create polls');
      return;
    }

    try {
      const { error } = await supabase
        .from('skill_polls')
        .insert({
          ...pollForm,
          employer_id: user.id
        });

      if (error) throw error;

      toast.success('Skill poll created successfully!');
      setPollForm({
        skill_name: '',
        demand_level: 'medium',
        poll_type: 'demand',
        description: '',
        budget_range: '',
        urgency_days: 30
      });
      loadSkillPolls();
    } catch (error) {
      console.error('Error creating poll:', error);
      toast.error('Failed to create poll');
    }
  };

  const handleVoteOnPoll = async (pollId: string) => {
    if (!user) {
      toast.error('Please sign in to vote');
      return;
    }

    try {
      const { error } = await supabase
        .from('skill_poll_votes')
        .insert({
          poll_id: pollId,
          user_id: user.id,
          vote_type: 'interested'
        });

      if (error) throw error;
      
      toast.success('Vote recorded!');
      loadSkillPolls();
    } catch (error) {
      console.error('Error voting:', error);
      toast.error('Failed to record vote');
    }
  };

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please sign in to add skills');
      return;
    }

    try {
      // First, check if user has a professional profile
      const { data: existingProfile } = await supabase
        .from('professional_profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      let profileId = existingProfile?.id;

      // Create profile if doesn't exist
      if (!profileId) {
        const { data: newProfile, error: profileError } = await supabase
          .from('professional_profiles')
          .insert({
            user_id: user.id,
            title: 'Supply Chain Professional',
            summary: skillForm.description,
            hourly_rate: skillForm.hourly_rate,
            experience_years: skillForm.experience_years,
            is_available: true
          })
          .select()
          .single();

        if (profileError) throw profileError;
        profileId = newProfile.id;
      }

      // Find or create skill
      const { data: existingSkill } = await supabase
        .from('skills')
        .select('id')
        .eq('name', skillForm.skill_name)
        .single();

      let skillId = existingSkill?.id;

      if (!skillId) {
        const { data: newSkill, error: skillError } = await supabase
          .from('skills')
          .insert({
            name: skillForm.skill_name,
            category: 'General',
            description: skillForm.description
          })
          .select()
          .single();

        if (skillError) throw skillError;
        skillId = newSkill.id;
      }

      // Link skill to profile
      const { error: linkError } = await supabase
        .from('professional_skills')
        .insert({
          profile_id: profileId,
          skill_id: skillId,
          proficiency_level: 'intermediate',
          years_experience: skillForm.experience_years
        });

      if (linkError) throw linkError;

      toast.success('Professional skill added to marketplace!');
      setSkillForm({
        skill_name: '',
        hourly_rate: 50,
        experience_years: 0,
        description: ''
      });
      
      loadProfessionals();
    } catch (error: any) {
      console.error('Error adding skill:', error);
      toast.error(error.message || 'Failed to add skill');
    }
  };

  const filteredProfessionals = professionals.filter(pro => {
    const matchesSearch = !searchTerm || 
      pro.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pro.skills.some(s => s.skill_name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesBudget = !pro.hourly_rate || (pro.hourly_rate >= (budgetRange[0] ?? 0) && pro.hourly_rate <= (budgetRange[1] ?? 500));
    const matchesSkill = skillFilter === 'all' || pro.skills.some(s => s.skill_name.toLowerCase().includes(skillFilter.toLowerCase()));
    return matchesSearch && matchesBudget && matchesSkill;
  });

  const filteredProjects = projects.filter(proj => {
    const matchesSearch = !searchTerm || 
      proj.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proj.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || proj.status === statusFilter;
    const matchesDuration = durationFilter === 'all' || proj.duration_estimate === durationFilter;
    return matchesSearch && matchesStatus && matchesDuration;
  });

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading marketplace...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 space-y-8 pb-24">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Hire My Skill
        </h1>
        <p className="text-muted-foreground text-base md:text-lg">
          Connect with top supply chain professionals or find your next opportunity
        </p>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6 max-w-md mx-auto">
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
            <div className="text-2xl font-bold text-primary">{professionals.length}</div>
            <div className="text-xs text-muted-foreground">Professionals</div>
          </div>
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
            <div className="text-2xl font-bold text-primary">{projects.length}</div>
            <div className="text-xs text-muted-foreground">Open Projects</div>
          </div>
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
            <div className="text-2xl font-bold text-primary">{skillPolls.length}</div>
            <div className="text-xs text-muted-foreground">Skill Demands</div>
          </div>
        </div>
      </div>

      {/* CTA for logged-in users */}
      {user && (
        <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold text-lg">Ready to showcase your skills?</h3>
                <p className="text-muted-foreground text-sm">Create your professional profile and start getting hired</p>
              </div>
              <Link to="/hire-my-skill/profile">
                <Button className="gap-2">
                  <User className="h-4 w-4" />
                  Manage My Profile
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-4 w-full max-w-2xl mx-auto">
          <TabsTrigger value="professionals" className="text-xs sm:text-sm px-2 py-2 gap-1">
            <Users className="h-4 w-4 hidden sm:block" />
            Professionals
          </TabsTrigger>
          <TabsTrigger value="projects" className="text-xs sm:text-sm px-2 py-2 gap-1">
            <Briefcase className="h-4 w-4 hidden sm:block" />
            Projects
          </TabsTrigger>
          <TabsTrigger value="demand" className="text-xs sm:text-sm px-2 py-2 gap-1">
            <TrendingUp className="h-4 w-4 hidden sm:block" />
            Demand
          </TabsTrigger>
          <TabsTrigger value="add" className="text-xs sm:text-sm px-2 py-2 gap-1">
            <Plus className="h-4 w-4 hidden sm:block" />
            Add Skill
          </TabsTrigger>
        </TabsList>

        {/* Professionals Tab */}
        <TabsContent value="professionals" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search skills or professionals..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Select value={skillFilter} onValueChange={setSkillFilter}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Skill" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Skills</SelectItem>
                      <SelectItem value="logistics">Logistics</SelectItem>
                      <SelectItem value="procurement">Procurement</SelectItem>
                      <SelectItem value="analytics">Analytics</SelectItem>
                      <SelectItem value="warehousing">Warehousing</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="hidden md:flex items-center gap-2 px-3 border rounded-lg">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      KSH {budgetRange[0]} - {budgetRange[1]}/hr
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Professionals Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProfessionals.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <Users className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="font-semibold text-lg mb-2">No professionals found</h3>
                <p className="text-muted-foreground text-sm">Try adjusting your filters or check back later</p>
              </div>
            ) : (
              filteredProfessionals.map((pro) => (
                <Card key={pro.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3 mb-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={pro.user?.avatar_url} />
                        <AvatarFallback>{pro.user?.full_name?.charAt(0) || 'P'}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold truncate">{pro.user?.full_name || 'Professional'}</h3>
                        <p className="text-sm text-muted-foreground truncate">{pro.title}</p>
                      </div>
                      <Badge variant="secondary" className="shrink-0">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Available
                      </Badge>
                    </div>

                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {pro.summary || 'Experienced professional ready to help with your projects.'}
                    </p>

                    <div className="flex flex-wrap gap-1 mb-3">
                      {pro.skills.slice(0, 3).map((skill, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {skill.skill_name}
                        </Badge>
                      ))}
                      {pro.skills.length > 3 && (
                        <Badge variant="outline" className="text-xs">+{pro.skills.length - 3}</Badge>
                      )}
                    </div>

                    <Separator className="my-3" />

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          KSH {pro.hourly_rate || 50}/hr
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {pro.experience_years || 0}y exp
                        </span>
                      </div>
                      <Button size="sm">Contact</Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {/* Projects Tab */}
        <TabsContent value="projects" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search projects..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={durationFilter} onValueChange={setDurationFilter}>
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="Duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any Duration</SelectItem>
                      <SelectItem value="1 week">1 Week</SelectItem>
                      <SelectItem value="2 weeks">2 Weeks</SelectItem>
                      <SelectItem value="1 month">1 Month</SelectItem>
                      <SelectItem value="3 months">3+ Months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Projects List */}
          <div className="space-y-4">
            {filteredProjects.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Briefcase className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                  <h3 className="font-semibold text-lg mb-2">No open projects</h3>
                  <p className="text-muted-foreground text-sm">Check back later or post your own project</p>
                </CardContent>
              </Card>
            ) : (
              filteredProjects.map((project) => (
                <Card key={project.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4 md:p-6">
                    <div className="flex flex-col md:flex-row md:items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-lg">{project.title}</h3>
                          <Badge variant={project.status === 'open' ? 'default' : 'secondary'}>
                            {project.status}
                          </Badge>
                        </div>
                        
                        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                          {project.description}
                        </p>

                        <div className="flex flex-wrap gap-1 mb-4">
                          {project.required_skills.map((skill, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {skill.skill_name} ({skill.minimum_proficiency})
                            </Badge>
                          ))}
                        </div>

                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4" />
                            KSH {project.budget_min || 0} - {project.budget_max || 0}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {project.duration_estimate || 'Flexible'}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            Posted {new Date(project.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={project.client?.avatar_url} />
                            <AvatarFallback>{project.client?.full_name?.charAt(0) || 'C'}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{project.client?.full_name || 'Client'}</span>
                        </div>
                        <Button>Submit Proposal</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {/* Demand Tab */}
        <TabsContent value="demand" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Skill Demand Polls
              </CardTitle>
              <CardDescription>
                See what skills are in demand and vote on trends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {skillPolls.length === 0 ? (
                  <div className="text-center py-8">
                    <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                    <h3 className="font-semibold mb-2">No active polls</h3>
                    <p className="text-muted-foreground text-sm">Be the first to create a skill demand poll</p>
                  </div>
                ) : (
                  skillPolls.map((poll) => (
                    <Card key={poll.id} className="border">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-semibold text-lg">{poll.skill_name}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge 
                                variant={poll.demand_level === 'urgent' ? 'destructive' : 'secondary'}
                              >
                                {poll.demand_level} demand
                              </Badge>
                              <Badge variant="outline">{poll.poll_type}</Badge>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-primary">{poll.votes_count}</div>
                            <div className="text-xs text-muted-foreground">votes</div>
                          </div>
                        </div>
                        
                        {poll.description && (
                          <p className="text-sm text-muted-foreground mb-3">{poll.description}</p>
                        )}

                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">
                            {poll.budget_range && `Budget: ${poll.budget_range}`}
                          </span>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleVoteOnPoll(poll.id)}
                          >
                            <ThumbsUp className="h-4 w-4 mr-2" />
                            Vote
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Create Poll Form */}
          {user && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5 text-primary" />
                  Create Skill Demand Poll
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreatePoll} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="poll_skill_name">Skill Name</Label>
                      <Input
                        id="poll_skill_name"
                        value={pollForm.skill_name}
                        onChange={(e) => setPollForm({...pollForm, skill_name: e.target.value})}
                        placeholder="e.g. AI Supply Chain Optimization"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="demand_level">Demand Level</Label>
                      <Select value={pollForm.demand_level} onValueChange={(value) => setPollForm({...pollForm, demand_level: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low Demand</SelectItem>
                          <SelectItem value="medium">Medium Demand</SelectItem>
                          <SelectItem value="high">High Demand</SelectItem>
                          <SelectItem value="urgent">Urgent Need</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="poll_description">Description</Label>
                    <Textarea
                      id="poll_description"
                      value={pollForm.description}
                      onChange={(e) => setPollForm({...pollForm, description: e.target.value})}
                      placeholder="Describe what you're looking for..."
                      rows={3}
                    />
                  </div>

                  <Button type="submit" className="w-full">Create Poll</Button>
                </form>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Add Skill Tab */}
        <TabsContent value="add" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                Add Your Professional Skill
              </CardTitle>
              <CardDescription>
                Showcase your expertise and start getting hired
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!user ? (
                <div className="text-center py-8">
                  <User className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                  <h3 className="font-semibold mb-2">Sign in required</h3>
                  <p className="text-muted-foreground text-sm mb-4">Please sign in to add your skills</p>
                  <Link to="/auth">
                    <Button>Sign In</Button>
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleAddSkill} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="skill_name">Skill Name</Label>
                      <Input
                        id="skill_name"
                        value={skillForm.skill_name}
                        onChange={(e) => setSkillForm({...skillForm, skill_name: e.target.value})}
                        placeholder="e.g. Supply Chain Analytics"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="hourly_rate">Hourly Rate (KSH)</Label>
                      <Input
                        id="hourly_rate"
                        type="number"
                        min="0"
                        value={skillForm.hourly_rate}
                        onChange={(e) => setSkillForm({...skillForm, hourly_rate: parseInt(e.target.value) || 0})}
                        placeholder="e.g. 500"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="experience_years">Years of Experience</Label>
                    <Input
                      id="experience_years"
                      type="number"
                      min="0"
                      value={skillForm.experience_years}
                      onChange={(e) => setSkillForm({...skillForm, experience_years: parseInt(e.target.value) || 0})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Skill Description</Label>
                    <Textarea
                      id="description"
                      value={skillForm.description}
                      onChange={(e) => setSkillForm({...skillForm, description: e.target.value})}
                      placeholder="Describe your expertise and what you offer..."
                      rows={3}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">Add My Skill to Marketplace</Button>
                </form>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
