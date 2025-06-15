
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Share2, Send, Twitter, MessageCircle, Settings, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface SocialJobSharingProps {
  jobs?: any[];
}

export const SocialJobSharing = ({ jobs = [] }: SocialJobSharingProps) => {
  const [autoShareEnabled, setAutoShareEnabled] = useState(false);
  const [selectedPlatforms, setSelectedPlatforms] = useState({
    twitter: true,
    telegram: true
  });
  const [isSharing, setIsSharing] = useState(false);
  const [sharedJobs, setSharedJobs] = useState<Set<string>>(new Set());

  const shareJobToSocial = async (job: any) => {
    if (sharedJobs.has(job.id)) {
      toast.info('Job already shared today');
      return;
    }

    setIsSharing(true);
    try {
      const response = await supabase.functions.invoke('share-job', {
        body: {
          id: job.id,
          title: job.title,
          company: job.company || job.companies?.name || 'Top Company',
          location: job.location || 'Kenya',
          description: job.description?.substring(0, 200) || 'Great opportunity in supply chain management',
          job_url: job.job_url || `${window.location.origin}/jobs/${job.id}`,
          source: job.source || 'SupplyChain_KE'
        }
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      const result = response.data;
      
      if (result.success) {
        setSharedJobs(prev => new Set([...prev, job.id]));
        toast.success(`Job shared successfully! ${result.twitter ? '✓ Twitter' : ''} ${result.telegram ? '✓ Telegram' : ''}`);
      } else {
        toast.error(`Sharing failed: ${result.errors?.join(', ') || 'Unknown error'}`);
      }
    } catch (error: any) {
      console.error('Error sharing job:', error);
      toast.error(`Failed to share job: ${error.message}`);
    } finally {
      setIsSharing(false);
    }
  };

  const shareMultipleJobs = async () => {
    if (jobs.length === 0) {
      toast.error('No jobs available to share');
      return;
    }

    const recentJobs = jobs.slice(0, 3); // Share top 3 jobs
    let successCount = 0;

    for (const job of recentJobs) {
      try {
        await shareJobToSocial(job);
        successCount++;
        // Add delay between shares to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        console.error('Error in batch sharing:', error);
      }
    }

    toast.success(`Shared ${successCount} out of ${recentJobs.length} jobs to social media`);
  };

  const toggleAutoShare = (enabled: boolean) => {
    setAutoShareEnabled(enabled);
    if (enabled) {
      toast.success('Auto-sharing enabled! New jobs will be shared automatically');
    } else {
      toast.info('Auto-sharing disabled');
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Social Media Job Sharing
            <Badge variant="secondary" className="ml-2">
              Active
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Auto-Share Settings */}
          <div className="border rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="auto-share" className="text-base font-medium">
                  Auto-Share New Jobs
                </Label>
                <p className="text-sm text-muted-foreground">
                  Automatically share new supply chain jobs to social media
                </p>
              </div>
              <Switch
                id="auto-share"
                checked={autoShareEnabled}
                onCheckedChange={toggleAutoShare}
              />
            </div>

            {/* Platform Selection */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Platforms</Label>
              <div className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="twitter"
                    checked={selectedPlatforms.twitter}
                    onCheckedChange={(checked) => 
                      setSelectedPlatforms(prev => ({ ...prev, twitter: checked }))
                    }
                  />
                  <Label htmlFor="twitter" className="flex items-center gap-2">
                    <Twitter className="h-4 w-4" />
                    Twitter/X
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="telegram"
                    checked={selectedPlatforms.telegram}
                    onCheckedChange={(checked) => 
                      setSelectedPlatforms(prev => ({ ...prev, telegram: checked }))
                    }
                  />
                  <Label htmlFor="telegram" className="flex items-center gap-2">
                    <MessageCircle className="h-4 w-4" />
                    Telegram
                  </Label>
                </div>
              </div>
            </div>
          </div>

          {/* Manual Sharing */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Manual Sharing</h3>
            <div className="flex gap-3">
              <Button 
                onClick={shareMultipleJobs}
                disabled={isSharing || jobs.length === 0}
                className="flex-1"
              >
                {isSharing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Sharing...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Share Top Jobs
                  </>
                )}
              </Button>
              <Button variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>

          {/* Sharing Statistics */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{sharedJobs.size}</div>
                <div className="text-sm text-muted-foreground">Jobs Shared Today</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">2.1K</div>
                <div className="text-sm text-muted-foreground">Total Reach</div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Jobs Available for Sharing */}
          {jobs.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Recent Jobs</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {jobs.slice(0, 5).map((job) => (
                  <div key={job.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">{job.title}</h4>
                      <p className="text-sm text-muted-foreground truncate">
                        {job.company || job.companies?.name || 'Company'} • {job.location || 'Kenya'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 ml-3">
                      {sharedJobs.has(job.id) ? (
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" />
                          Shared
                        </Badge>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => shareJobToSocial(job)}
                          disabled={isSharing}
                        >
                          <Share2 className="h-3 w-3 mr-1" />
                          Share
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
