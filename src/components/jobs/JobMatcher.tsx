
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Search, 
  Star, 
  MapPin, 
  Briefcase, 
  Clock,
  Heart,
  ExternalLink,
  TrendingUp
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface JobMatch {
  job: any;
  score: number;
  matchingFactors: string[];
  missingSkills: string[];
}

export const JobMatcher = () => {
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState({
    skills: '',
    experience: '',
    location: '',
    jobType: '',
    salaryRange: ''
  });
  const [matches, setMatches] = useState<JobMatch[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (user) {
      loadUserProfile();
    }
  }, [user]);

  const loadUserProfile = async () => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (profile) {
        setUserProfile({
          skills: profile.bio || '',
          experience: profile.position || '',
          location: '',
          jobType: '',
          salaryRange: ''
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const findMatches = async () => {
    setIsSearching(true);
    
    try {
      // Fetch jobs from both tables
      const [scrapedJobsResult, postedJobsResult] = await Promise.all([
        supabase
          .from('scraped_jobs')
          .select('*')
          .limit(100),
        supabase
          .from('jobs')
          .select('*')
          .eq('is_active', true)
          .limit(50)
      ]);

      const allJobs = [
        ...(scrapedJobsResult.data || []),
        ...(postedJobsResult.data || [])
      ];

      // Calculate matches
      const jobMatches = allJobs.map(job => calculateJobMatch(job, userProfile, searchQuery));
      
      // Sort by score and take top 20
      const sortedMatches = jobMatches
        .filter(match => match.score > 20)
        .sort((a, b) => b.score - a.score)
        .slice(0, 20);

      setMatches(sortedMatches);
      toast.success(`Found ${sortedMatches.length} job matches!`);
    } catch (error) {
      console.error('Error finding matches:', error);
      toast.error('Failed to find job matches');
    } finally {
      setIsSearching(false);
    }
  };

  const calculateJobMatch = (job: any, profile: any, query: string): JobMatch => {
    let score = 0;
    const matchingFactors: string[] = [];
    const missingSkills: string[] = [];

    const jobText = `${job.title || ''} ${job.description || ''} ${job.company || ''} ${job.location || ''}`.toLowerCase();
    const profileText = `${profile.skills} ${profile.experience} ${profile.location}`.toLowerCase();
    const queryText = query.toLowerCase();

    // Search query match (40% weight)
    if (query && jobText.includes(queryText)) {
      score += 40;
      matchingFactors.push('Matches search query');
    }

    // Skills matching (30% weight)
    const profileSkills = extractSkills(profileText);
    const jobSkills = extractSkills(jobText);
    
    const matchingSkills = profileSkills.filter(skill => 
      jobSkills.some(jobSkill => jobSkill.includes(skill) || skill.includes(jobSkill))
    );
    
    if (matchingSkills.length > 0) {
      const skillScore = Math.min(30, (matchingSkills.length / Math.max(jobSkills.length, 1)) * 30);
      score += skillScore;
      matchingFactors.push(`${matchingSkills.length} matching skills`);
    }

    // Location match (10% weight)
    if (profile.location && job.location && 
        job.location.toLowerCase().includes(profile.location.toLowerCase())) {
      score += 10;
      matchingFactors.push('Location match');
    }

    // Job type match (10% weight)
    if (profile.jobType && job.job_type && 
        job.job_type.toLowerCase().includes(profile.jobType.toLowerCase())) {
      score += 10;
      matchingFactors.push('Job type match');
    }

    // Experience level (10% weight)
    if (profile.experience && jobText.includes(profile.experience.toLowerCase())) {
      score += 10;
      matchingFactors.push('Experience level match');
    }

    // Find missing skills
    const missingJobSkills = jobSkills.filter(skill => 
      !profileSkills.some(pSkill => pSkill.includes(skill) || skill.includes(pSkill))
    );
    missingSkills.push(...missingJobSkills.slice(0, 5));

    return {
      job,
      score: Math.round(score),
      matchingFactors,
      missingSkills
    };
  };

  const extractSkills = (text: string): string[] => {
    const commonSkills = [
      'supply chain', 'logistics', 'procurement', 'inventory', 'warehouse',
      'distribution', 'forecasting', 'planning', 'analytics', 'reporting',
      'excel', 'sap', 'erp', 'wms', 'tms', 'lean', 'six sigma',
      'project management', 'leadership', 'negotiation', 'communication',
      'problem solving', 'data analysis', 'cost reduction', 'quality'
    ];

    return commonSkills.filter(skill => text.includes(skill.toLowerCase()));
  };

  const saveJob = async (jobId: string) => {
    if (!user) {
      toast.error('Please login to save jobs');
      return;
    }

    try {
      const { error } = await supabase
        .from('saved_jobs')
        .insert({
          user_id: user.id,
          job_id: jobId,
          status: 'saved'
        });

      if (error) throw error;
      toast.success('Job saved successfully!');
    } catch (error) {
      console.error('Error saving job:', error);
      toast.error('Failed to save job');
    }
  };

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 80) return 'default';
    if (score >= 60) return 'secondary';
    return 'outline';
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-6 w-6" />
            AI Job Matcher
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Search Query
              </label>
              <Input
                placeholder="e.g., Supply Chain Manager, Logistics Coordinator"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Your Skills
              </label>
              <Input
                placeholder="e.g., SAP, Logistics, Project Management"
                value={userProfile.skills}
                onChange={(e) => setUserProfile(prev => ({ ...prev, skills: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Experience Level
              </label>
              <Input
                placeholder="e.g., Senior, Manager, 5+ years"
                value={userProfile.experience}
                onChange={(e) => setUserProfile(prev => ({ ...prev, experience: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Preferred Location
              </label>
              <Input
                placeholder="e.g., Nairobi, Kenya"
                value={userProfile.location}
                onChange={(e) => setUserProfile(prev => ({ ...prev, location: e.target.value }))}
              />
            </div>
          </div>
          
          <Button 
            onClick={findMatches} 
            disabled={isSearching}
            className="w-full"
          >
            {isSearching ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Finding Matches...
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Find Job Matches
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {matches.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Your Job Matches ({matches.length})</h2>
          
          {matches.map((match, index) => (
            <Card key={match.job.id || index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold">{match.job.title}</h3>
                      <Badge variant={getScoreBadgeVariant(match.score)} className="flex items-center gap-1">
                        <Star className="h-3 w-3" />
                        {match.score}% Match
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      {match.job.company && (
                        <div className="flex items-center gap-1">
                          <Briefcase className="h-4 w-4" />
                          {match.job.company}
                        </div>
                      )}
                      {match.job.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {match.job.location}
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {new Date(match.job.created_at).toLocaleDateString()}
                      </div>
                    </div>

                    <Progress value={match.score} className="mb-3" />
                    
                    {match.matchingFactors.length > 0 && (
                      <div className="mb-3">
                        <h4 className="text-sm font-medium text-green-600 mb-1">Matching Factors:</h4>
                        <div className="flex flex-wrap gap-1">
                          {match.matchingFactors.map((factor, i) => (
                            <Badge key={i} variant="secondary" className="text-xs bg-green-100 text-green-800">
                              {factor}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {match.missingSkills.length > 0 && (
                      <div className="mb-3">
                        <h4 className="text-sm font-medium text-amber-600 mb-1">Skills to Develop:</h4>
                        <div className="flex flex-wrap gap-1">
                          {match.missingSkills.map((skill, i) => (
                            <Badge key={i} variant="outline" className="text-xs border-amber-200 text-amber-700">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {match.job.job_url || match.job.application_url ? (
                    <Button asChild>
                      <a 
                        href={match.job.job_url || match.job.application_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        Apply Now
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  ) : (
                    <Button disabled>
                      No Application Link
                    </Button>
                  )}
                  
                  <Button 
                    variant="outline" 
                    onClick={() => saveJob(match.job.id)}
                    disabled={!user}
                  >
                    <Heart className="mr-2 h-4 w-4" />
                    Save Job
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {matches.length === 0 && !isSearching && (
        <Card>
          <CardContent className="p-12 text-center">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No matches yet</h3>
            <p className="text-muted-foreground">
              Fill in your profile information and click "Find Job Matches" to get personalized job recommendations.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
