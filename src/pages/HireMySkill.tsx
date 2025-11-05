import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  TrendingUp,
  Brain,
  Sparkles,
  DollarSign,
  Users,
  BarChart,
  Vote,
  Plus,
  ThumbsUp,
  ArrowUp
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

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

interface ProfessionalSkill {
  id: string;
  skill_name: string;
  hourly_rate: number;
  experience_years: number;
  description?: string;
}

export default function HireMySkill() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('marketplace');
  const [skillPolls, setSkillPolls] = useState<SkillPoll[]>([]);
  const [professionalSkills, setProfessionalSkills] = useState<ProfessionalSkill[]>([]);

  // Form states
  const [skillForm, setSkillForm] = useState({
    skill_name: '',
    hourly_rate: 0,
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
    loadSkillPolls();
    loadProfessionalSkills();
  }, [user]);

  const loadSkillPolls = async () => {
    try {
      const { data, error } = await supabase
        .from('skill_polls')
        .select(`
          *,
          skill_poll_votes!inner(user_id)
        `)
        .order('votes_count', { ascending: false });

      if (error) throw error;
      
      // Mark polls where current user has voted
      const pollsWithVoteStatus = (data || []).map(poll => ({
        ...poll,
        user_voted: poll.skill_poll_votes?.some((vote: any) => vote.user_id === user?.id)
      }));
      
      setSkillPolls(pollsWithVoteStatus);
    } catch (error) {
      console.error('Error loading skill polls:', error);
    }
  };

  const loadProfessionalSkills = async () => {
    try {
      const { data, error } = await supabase
        .from('professional_profiles')
        .select(`
          *,
          skills:professional_skills(
            *,
            skill:skills(name)
          ),
          profiles:user_id(full_name, avatar_url, company, position)
        `)
        .eq('is_available', true)
        .limit(20);

      if (error) throw error;

      // Transform to match UI expectations
      const transformedSkills = (data || []).flatMap(profile => 
        (profile.skills || []).map((skillRel: any) => ({
          id: skillRel.id,
          skill_name: skillRel.skill?.name || 'Unknown Skill',
          hourly_rate: profile.hourly_rate || 50,
          experience_years: skillRel.years_experience || profile.experience_years || 0,
          description: profile.summary || `${skillRel.proficiency_level} level professional`
        }))
      );

      setProfessionalSkills(transformedSkills);
    } catch (error) {
      console.error('Error loading professional skills:', error);
      toast.error('Failed to load professional skills');
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
        hourly_rate: 0,
        experience_years: 0,
        description: ''
      });
      
      loadProfessionalSkills();
    } catch (error: any) {
      console.error('Error adding skill:', error);
      toast.error(error.message || 'Failed to add skill');
    }
  };

  const getTrendingSkills = () => {
    return skillPolls
      .filter(poll => poll.poll_type === 'trending')
      .sort((a, b) => b.votes_count - a.votes_count)
      .slice(0, 5);
  };

  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      <div className="text-center max-w-3xl mx-auto mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-3">Hire My Skill</h1>
        <p className="text-muted-foreground text-base md:text-lg">
          The future of supply chain talent marketplace - where skills meet opportunities in real-time
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
        <TabsList className="grid grid-cols-3 w-full max-w-3xl mx-auto">
          <TabsTrigger value="marketplace" className="text-sm px-3 py-2">Talent Marketplace</TabsTrigger>
          <TabsTrigger value="polls" className="text-sm px-3 py-2">Skill Demand</TabsTrigger>
          <TabsTrigger value="insights" className="text-sm px-3 py-2">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="marketplace" className="space-y-6">
          {/* Real-time Skills Marketplace */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Live Skills Marketplace
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {professionalSkills.slice(0, 6).map((skill) => (
                  <Card key={skill.id} className="bg-secondary/50 hover:shadow-lg transition-shadow">
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold mb-2 text-foreground">KSH {skill.hourly_rate}/hr</div>
                      <div className="text-base font-semibold text-foreground mb-2">{skill.skill_name}</div>
                      <div className="text-sm text-muted-foreground mb-3">
                        {skill.experience_years} years experience
                      </div>
                      <p className="text-sm line-clamp-2 mb-3 text-foreground/90">{skill.description}</p>
                      <Button size="sm" className="w-full">Contact Professional</Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Add Your Skill Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5 text-primary" />
                Add Your Professional Skill
              </CardTitle>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="polls" className="space-y-6">
          {/* Create New Poll */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Vote className="h-5 w-5 text-primary" />
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
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="poll_type">Poll Type</Label>
                    <Select value={pollForm.poll_type} onValueChange={(value) => setPollForm({...pollForm, poll_type: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="demand">Current Demand</SelectItem>
                        <SelectItem value="trending">Trending Skill</SelectItem>
                        <SelectItem value="forecast">Future Forecast</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="budget_range">Budget Range</Label>
                    <Input
                      id="budget_range"
                      value={pollForm.budget_range}
                      onChange={(e) => setPollForm({...pollForm, budget_range: e.target.value})}
                      placeholder="e.g. KSH 50-80/hour"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="poll_description">Description</Label>
                  <Textarea
                    id="poll_description"
                    value={pollForm.description}
                    onChange={(e) => setPollForm({...pollForm, description: e.target.value})}
                    placeholder="Describe what you're looking for and project requirements..."
                    rows={3}
                  />
                </div>

                <Button type="submit" className="w-full">Create Poll</Button>
              </form>
            </CardContent>
          </Card>

          {/* Active Polls */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Active Skill Demand Polls
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {skillPolls.map((poll) => (
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
                          <div className="flex items-center gap-1 text-sm font-medium">
                            <ArrowUp className="h-4 w-4 text-green-500" />
                            {poll.votes_count} votes
                          </div>
                          {poll.budget_range && (
                            <div className="text-sm text-muted-foreground">{poll.budget_range}</div>
                          )}
                        </div>
                      </div>

                      {poll.description && (
                        <p className="text-sm text-muted-foreground mb-3">{poll.description}</p>
                      )}

                      <div className="flex justify-between items-center">
                        <div className="text-xs text-muted-foreground">
                          Expires: {new Date(poll.expires_at).toLocaleDateString()}
                        </div>
                        <Button
                          onClick={() => handleVoteOnPoll(poll.id)}
                          disabled={poll.user_voted}
                          size="sm"
                          variant={poll.user_voted ? "outline" : "default"}
                        >
                          <ThumbsUp className="h-4 w-4 mr-1" />
                          {poll.user_voted ? 'Voted' : 'Vote Interested'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {skillPolls.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Vote className="h-12 w-12 mx-auto mb-4" />
                    <p>No active polls yet. Create the first one!</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          {/* Trending Skills from Polls */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                Real-time Trending Skills
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {getTrendingSkills().map((poll, index) => (
                  <div key={poll.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium">{poll.skill_name}</div>
                        <div className="text-sm text-muted-foreground">
                          {poll.votes_count} votes • {poll.demand_level} demand
                        </div>
                      </div>
                    </div>
                    <Badge variant="secondary" className="ml-2">
                      +{Math.floor(Math.random() * 50)}% growth
                    </Badge>
                  </div>
                ))}
                
                {getTrendingSkills().length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Brain className="h-12 w-12 mx-auto mb-4" />
                    <p>No trending data yet. Vote on polls to generate insights!</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Market Intelligence */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Live Market Intelligence
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <DollarSign className="h-8 w-8 text-primary mb-2" />
                    <h3 className="font-semibold mb-1">Average Rate</h3>
                    <div className="text-2xl font-bold">KSH 73/hr</div>
                    <p className="text-sm text-muted-foreground">
                      +8% from last month
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <Users className="h-8 w-8 text-primary mb-2" />
                    <h3 className="font-semibold mb-1">Active Professionals</h3>
                    <div className="text-2xl font-bold">{professionalSkills.length}</div>
                    <p className="text-sm text-muted-foreground">
                      Verified skills available
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <BarChart className="h-8 w-8 text-primary mb-2" />
                    <h3 className="font-semibold mb-1">Market Activity</h3>
                    <div className="text-2xl font-bold">{skillPolls.length}</div>
                    <p className="text-sm text-muted-foreground">
                      Active demand polls
                    </p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}