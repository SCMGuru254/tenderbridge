import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Bell, Loader2 } from 'lucide-react';

const JobAlertForm = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    keywords: '',
    location: '',
    job_type: '',
    experience_level: '',
    is_remote: false,
    frequency: 'daily'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please sign in to create job alerts');
      return;
    }

    if (!formData.name.trim()) {
      toast.error('Please enter a name for your alert');
      return;
    }

    setLoading(true);
    
    try {
      const keywordsArray = formData.keywords
        .split(',')
        .map(k => k.trim())
        .filter(k => k.length > 0);

      const { error } = await supabase
        .from('job_alerts')
        .insert({
          user_id: user.id,
          name: formData.name.trim(),
          keywords: keywordsArray,
          location: formData.location.trim() || null,
          job_type: formData.job_type || null,
          experience_level: formData.experience_level || null,
          is_remote: formData.is_remote,
          frequency: formData.frequency
        });

      if (error) throw error;
      
      toast.success('Job alert created! You\'ll receive notifications for matching jobs.');
      
      // Reset form
      setFormData({
        name: '',
        keywords: '',
        location: '',
        job_type: '',
        experience_level: '',
        is_remote: false,
        frequency: 'daily'
      });
    } catch (error: any) {
      console.error('Error creating job alert:', error);
      toast.error(error.message || 'Failed to create job alert');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-primary" />
          Create Job Alert
        </CardTitle>
        <CardDescription>
          Get notified when new jobs match your criteria
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Alert Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="e.g., Logistics Manager Jobs"
              required
            />
          </div>

          <div>
            <Label htmlFor="keywords">Keywords (comma-separated)</Label>
            <Input
              id="keywords"
              value={formData.keywords}
              onChange={(e) => setFormData({...formData, keywords: e.target.value})}
              placeholder="supply chain, logistics, warehouse"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Jobs containing any of these keywords will be matched
            </p>
          </div>
          
          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
              placeholder="Nairobi, Kenya"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="job_type">Job Type</Label>
              <Select
                value={formData.job_type}
                onValueChange={(value) => setFormData({...formData, job_type: value})}
              >
                <SelectTrigger id="job_type">
                  <SelectValue placeholder="Any type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full-time">Full-time</SelectItem>
                  <SelectItem value="part-time">Part-time</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="internship">Internship</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="experience_level">Experience Level</Label>
              <Select
                value={formData.experience_level}
                onValueChange={(value) => setFormData({...formData, experience_level: value})}
              >
                <SelectTrigger id="experience_level">
                  <SelectValue placeholder="Any level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="entry">Entry Level</SelectItem>
                  <SelectItem value="mid">Mid Level</SelectItem>
                  <SelectItem value="senior">Senior Level</SelectItem>
                  <SelectItem value="executive">Executive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="frequency">Notification Frequency</Label>
            <Select
              value={formData.frequency}
              onValueChange={(value) => setFormData({...formData, frequency: value})}
            >
              <SelectTrigger id="frequency">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="instant">Instant (as jobs are posted)</SelectItem>
                <SelectItem value="daily">Daily digest</SelectItem>
                <SelectItem value="weekly">Weekly summary</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div>
              <Label htmlFor="is_remote" className="font-medium">Remote Only</Label>
              <p className="text-xs text-muted-foreground">Only show remote/work-from-home jobs</p>
            </div>
            <Switch
              id="is_remote"
              checked={formData.is_remote}
              onCheckedChange={(checked) => setFormData({...formData, is_remote: checked})}
            />
          </div>
          
          <Button type="submit" className="w-full" disabled={loading || !user}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Bell className="mr-2 h-4 w-4" />
                Create Alert
              </>
            )}
          </Button>

          {!user && (
            <p className="text-sm text-center text-muted-foreground">
              Please <a href="/auth" className="text-primary hover:underline">sign in</a> to create job alerts
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default JobAlertForm;