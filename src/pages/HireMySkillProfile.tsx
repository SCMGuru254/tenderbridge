import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import {
  User,
  Award,
  Plus,
  Trash2,
  Save,
  Link as LinkIcon,
  GraduationCap,
  Star
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';

interface Skill {
  id: string;
  name: string;
  proficiency_level: string;
  years_experience: number;
}

export default function HireMySkillProfile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);
  const [skills, setSkills] = useState<Skill[]>([]);

  // Profile form state
  const [profile, setProfile] = useState({
    title: '',
    summary: '',
    hourly_rate: 50,
    experience_years: 0,
    availability: 'full-time',
    education: '',
    portfolio_url: '',
    linkedin_url: '',
    github_url: '',
    website_url: '',
    is_available: true,
    certifications: [] as string[]
  });

  // New skill form
  const [newSkill, setNewSkill] = useState({
    name: '',
    proficiency_level: 'intermediate',
    years_experience: 0
  });

  // New certification input
  const [newCertification, setNewCertification] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    loadProfile();
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;
    setLoading(true);
    
    try {
      // Get professional profile
      const { data: profileData, error: profileError } = await supabase
        .from('professional_profiles')
        .select(`
          *,
          professional_skills (
            id, proficiency_level, years_experience,
            skills (id, name)
          )
        `)
        .eq('user_id', user.id)
        .single();

      if (profileData && !profileError) {
        setHasProfile(true);
        setProfile({
          title: profileData.title || '',
          summary: profileData.summary || '',
          hourly_rate: profileData.hourly_rate || 50,
          experience_years: profileData.experience_years || 0,
          availability: profileData.availability || 'full-time',
          education: profileData.education || '',
          portfolio_url: profileData.portfolio_url || '',
          linkedin_url: profileData.linkedin_url || '',
          github_url: profileData.github_url || '',
          website_url: profileData.website_url || '',
          is_available: profileData.is_available ?? true,
          certifications: profileData.certifications || []
        });

        // Map skills
        const mappedSkills = ((profileData.professional_skills as any[]) || []).map((ps: any) => ({
          id: ps.id,
          name: ps.skills?.name || 'Unknown',
          proficiency_level: ps.proficiency_level,
          years_experience: ps.years_experience || 0
        }));
        setSkills(mappedSkills);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async () => {
    if (!user) return;
    setSaving(true);

    try {
      if (hasProfile) {
        // Update existing profile
        const { error } = await supabase
          .from('professional_profiles')
          .update({
            title: profile.title,
            summary: profile.summary,
            hourly_rate: profile.hourly_rate,
            experience_years: profile.experience_years,
            availability: profile.availability,
            education: profile.education,
            portfolio_url: profile.portfolio_url || null,
            linkedin_url: profile.linkedin_url || null,
            github_url: profile.github_url || null,
            website_url: profile.website_url || null,
            is_available: profile.is_available,
            certifications: profile.certifications,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id);

        if (error) throw error;
      } else {
        // Create new profile
        const { error } = await supabase
          .from('professional_profiles')
          .insert({
            user_id: user.id,
            title: profile.title,
            summary: profile.summary,
            hourly_rate: profile.hourly_rate,
            experience_years: profile.experience_years,
            availability: profile.availability,
            education: profile.education,
            portfolio_url: profile.portfolio_url || null,
            linkedin_url: profile.linkedin_url || null,
            github_url: profile.github_url || null,
            website_url: profile.website_url || null,
            is_available: profile.is_available,
            certifications: profile.certifications
          });

        if (error) throw error;
        setHasProfile(true);
      }

      toast.success('Profile saved successfully!');
    } catch (error: any) {
      console.error('Error saving profile:', error);
      toast.error(error.message || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const addSkill = async () => {
    if (!user || !newSkill.name.trim()) return;

    try {
      // Get or create profile ID
      let profileId: string;
      const { data: existingProfile } = await supabase
        .from('professional_profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (existingProfile) {
        profileId = existingProfile.id;
      } else {
        // Create profile first
        await saveProfile();
        const { data: newProfile } = await supabase
          .from('professional_profiles')
          .select('id')
          .eq('user_id', user.id)
          .single();
        if (!newProfile) throw new Error('Failed to create profile');
        profileId = newProfile.id;
      }

      // Get or create skill
      const { data: existingSkill } = await supabase
        .from('skills')
        .select('id')
        .eq('name', newSkill.name)
        .single();

      let skillId = existingSkill?.id;

      if (!skillId) {
        const { data: createdSkill, error: skillError } = await supabase
          .from('skills')
          .insert({
            name: newSkill.name,
            category: 'General'
          })
          .select()
          .single();

        if (skillError) throw skillError;
        skillId = createdSkill.id;
      }

      // Link skill to profile
      const { error: linkError } = await supabase
        .from('professional_skills')
        .insert({
          profile_id: profileId,
          skill_id: skillId,
          proficiency_level: newSkill.proficiency_level,
          years_experience: newSkill.years_experience
        });

      if (linkError) throw linkError;

      toast.success('Skill added!');
      setNewSkill({ name: '', proficiency_level: 'intermediate', years_experience: 0 });
      loadProfile();
    } catch (error: any) {
      console.error('Error adding skill:', error);
      toast.error(error.message || 'Failed to add skill');
    }
  };

  const removeSkill = async (skillId: string) => {
    try {
      const { error } = await supabase
        .from('professional_skills')
        .delete()
        .eq('id', skillId);

      if (error) throw error;
      toast.success('Skill removed');
      setSkills(skills.filter(s => s.id !== skillId));
    } catch (error) {
      console.error('Error removing skill:', error);
      toast.error('Failed to remove skill');
    }
  };

  const addCertification = () => {
    if (newCertification.trim()) {
      setProfile({
        ...profile,
        certifications: [...profile.certifications, newCertification.trim()]
      });
      setNewCertification('');
    }
  };

  const removeCertification = (index: number) => {
    setProfile({
      ...profile,
      certifications: profile.certifications.filter((_, i) => i !== index)
    });
  };

  if (!user) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <h2 className="text-2xl font-bold mb-4">Sign in required</h2>
        <p className="text-muted-foreground mb-4">Please sign in to manage your professional profile</p>
        <Link to="/auth">
          <Button>Sign In</Button>
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 space-y-6 pb-24 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Professional Profile</h1>
          <p className="text-muted-foreground">Showcase your skills and get hired</p>
        </div>
        <Link to="/hire-my-skill">
          <Button variant="outline">Back to Marketplace</Button>
        </Link>
      </div>

      {/* Availability Toggle */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${profile.is_available ? 'bg-green-500' : 'bg-gray-400'}`} />
              <div>
                <h3 className="font-medium">Availability Status</h3>
                <p className="text-sm text-muted-foreground">
                  {profile.is_available ? 'You are visible to potential clients' : 'Your profile is hidden from search'}
                </p>
              </div>
            </div>
            <Switch
              checked={profile.is_available}
              onCheckedChange={(checked) => setProfile({ ...profile, is_available: checked })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Basic Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Professional Title</Label>
              <Input
                id="title"
                value={profile.title}
                onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                placeholder="e.g. Senior Supply Chain Analyst"
              />
            </div>
            <div>
              <Label htmlFor="hourly_rate">Hourly Rate (KSH)</Label>
              <Input
                id="hourly_rate"
                type="number"
                min="0"
                value={profile.hourly_rate}
                onChange={(e) => setProfile({ ...profile, hourly_rate: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="experience">Years of Experience</Label>
              <Input
                id="experience"
                type="number"
                min="0"
                value={profile.experience_years}
                onChange={(e) => setProfile({ ...profile, experience_years: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div>
              <Label htmlFor="availability">Availability</Label>
              <Select value={profile.availability} onValueChange={(value) => setProfile({ ...profile, availability: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full-time">Full-time</SelectItem>
                  <SelectItem value="part-time">Part-time</SelectItem>
                  <SelectItem value="freelance">Freelance/Contract</SelectItem>
                  <SelectItem value="weekends">Weekends Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="summary">Professional Summary</Label>
            <Textarea
              id="summary"
              value={profile.summary}
              onChange={(e) => setProfile({ ...profile, summary: e.target.value })}
              placeholder="Describe your experience, expertise, and what makes you unique..."
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="education">Education</Label>
            <Textarea
              id="education"
              value={profile.education}
              onChange={(e) => setProfile({ ...profile, education: e.target.value })}
              placeholder="List your educational background..."
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      {/* Skills */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            Skills
          </CardTitle>
          <CardDescription>Add your professional skills and proficiency levels</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Current Skills */}
          {skills.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {skills.map((skill) => (
                <div key={skill.id} className="flex items-center gap-2 px-3 py-2 bg-secondary rounded-lg">
                  <div>
                    <span className="font-medium">{skill.name}</span>
                    <span className="text-xs text-muted-foreground ml-2">
                      ({skill.proficiency_level}, {skill.years_experience}y)
                    </span>
                  </div>
                  <button
                    onClick={() => removeSkill(skill.id)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Add New Skill */}
          <div className="grid md:grid-cols-4 gap-4 items-end border-t pt-4">
            <div>
              <Label>Skill Name</Label>
              <Input
                value={newSkill.name}
                onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                placeholder="e.g. Logistics Management"
              />
            </div>
            <div>
              <Label>Proficiency</Label>
              <Select value={newSkill.proficiency_level} onValueChange={(value) => setNewSkill({ ...newSkill, proficiency_level: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                  <SelectItem value="expert">Expert</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Years</Label>
              <Input
                type="number"
                min="0"
                value={newSkill.years_experience}
                onChange={(e) => setNewSkill({ ...newSkill, years_experience: parseInt(e.target.value) || 0 })}
              />
            </div>
            <Button onClick={addSkill}>
              <Plus className="h-4 w-4 mr-2" />
              Add Skill
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Certifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-primary" />
            Certifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {profile.certifications.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {profile.certifications.map((cert, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-2 py-1.5">
                  <Star className="h-3 w-3" />
                  {cert}
                  <button
                    onClick={() => removeCertification(index)}
                    className="ml-1 hover:text-destructive"
                  >
                    ×
                  </button>
                </Badge>
              ))}
            </div>
          )}

          <div className="flex gap-2">
            <Input
              value={newCertification}
              onChange={(e) => setNewCertification(e.target.value)}
              placeholder="e.g. APICS CSCP, Six Sigma Green Belt"
              onKeyPress={(e) => e.key === 'Enter' && addCertification()}
            />
            <Button variant="outline" onClick={addCertification}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Links */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LinkIcon className="h-5 w-5 text-primary" />
            Portfolio & Links
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="portfolio">Portfolio URL</Label>
              <Input
                id="portfolio"
                type="url"
                value={profile.portfolio_url}
                onChange={(e) => setProfile({ ...profile, portfolio_url: e.target.value })}
                placeholder="https://yourportfolio.com"
              />
            </div>
            <div>
              <Label htmlFor="linkedin">LinkedIn URL</Label>
              <Input
                id="linkedin"
                type="url"
                value={profile.linkedin_url}
                onChange={(e) => setProfile({ ...profile, linkedin_url: e.target.value })}
                placeholder="https://linkedin.com/in/yourprofile"
              />
            </div>
            <div>
              <Label htmlFor="github">GitHub URL</Label>
              <Input
                id="github"
                type="url"
                value={profile.github_url}
                onChange={(e) => setProfile({ ...profile, github_url: e.target.value })}
                placeholder="https://github.com/yourusername"
              />
            </div>
            <div>
              <Label htmlFor="website">Personal Website</Label>
              <Input
                id="website"
                type="url"
                value={profile.website_url}
                onChange={(e) => setProfile({ ...profile, website_url: e.target.value })}
                placeholder="https://yourwebsite.com"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end gap-4">
        <Link to="/hire-my-skill">
          <Button variant="outline">Cancel</Button>
        </Link>
        <Button onClick={saveProfile} disabled={saving}>
          {saving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Profile
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
