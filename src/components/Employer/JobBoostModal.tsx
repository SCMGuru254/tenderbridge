import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import { Zap, Star, Rocket, Check } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface BoostPackage {
  id: string;
  name: string;
  description: string;
  duration_days: number;
  priority_score: number;
  is_featured: boolean;
  price_kes: number;
  price_usd: number;
}

interface JobBoostModalProps {
  jobId: string;
  jobTitle: string;
  onBoostComplete?: () => void;
}

export function JobBoostModal({ jobId, jobTitle, onBoostComplete }: JobBoostModalProps) {
  const [packages, setPackages] = useState<BoostPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [boosting, setBoosting] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      loadBoostPackages();
    }
  }, [open]);

  const loadBoostPackages = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('job_boost_packages')
        .select('*')
        .eq('is_active', true)
        .order('price_kes', { ascending: true });

      if (error) throw error;
      setPackages(data || []);
    } catch (error) {
      console.error('Error loading boost packages:', error);
      toast.error('Failed to load boost packages');
    } finally {
      setLoading(false);
    }
  };

  const handleBoost = async (packageId: string, packageName: string) => {
    try {
      setBoosting(true);
      
      // Call the apply_job_boost function
      const { data, error } = await supabase.rpc('apply_job_boost', {
        p_job_id: jobId,
        p_package_id: packageId,
      });

      if (error) throw error;

      if (data?.success) {
        toast.success(`Job boosted with ${packageName}!`);
        setOpen(false);
        onBoostComplete?.();
      } else {
        toast.error(data?.message || 'Failed to boost job');
      }
    } catch (error: any) {
      console.error('Error boosting job:', error);
      toast.error(error.message || 'Failed to boost job');
    } finally {
      setBoosting(false);
    }
  };

  const getPackageIcon = (index: number) => {
    switch (index) {
      case 0: return <Zap className="h-6 w-6" />;
      case 1: return <Star className="h-6 w-6" />;
      case 2: return <Rocket className="h-6 w-6" />;
      default: return <Zap className="h-6 w-6" />;
    }
  };

  const getPackageColor = (index: number) => {
    switch (index) {
      case 0: return 'from-blue-500 to-blue-600';
      case 1: return 'from-purple-500 to-purple-600';
      case 2: return 'from-orange-500 to-orange-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Rocket className="h-4 w-4" />
          Boost Job
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Boost Your Job Listing</DialogTitle>
          <DialogDescription>
            Increase visibility for "{jobTitle}" with premium placement
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-3 mt-4">
            {packages.map((pkg, index) => (
              <Card 
                key={pkg.id} 
                className={`relative overflow-hidden border-2 hover:shadow-lg transition-all ${
                  index === 1 ? 'border-purple-500 scale-105' : 'border-gray-200'
                }`}
              >
                {index === 1 && (
                  <div className="absolute top-0 right-0 bg-purple-500 text-white px-3 py-1 text-xs font-bold rounded-bl-lg">
                    POPULAR
                  </div>
                )}
                
                <CardHeader>
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${getPackageColor(index)} flex items-center justify-center text-white mb-3`}>
                    {getPackageIcon(index)}
                  </div>
                  <CardTitle className="text-xl">{pkg.name}</CardTitle>
                  <CardDescription>{pkg.description}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="text-3xl font-bold text-primary">
                    KES {pkg.price_kes.toLocaleString()}
                    <span className="text-sm text-muted-foreground ml-2">
                      (${pkg.price_usd})
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-600" />
                      <span>{pkg.duration_days} days of boosting</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-600" />
                      <span>Priority score: {pkg.priority_score}</span>
                    </div>
                    {pkg.is_featured && (
                      <div className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-600" />
                        <span className="font-semibold text-purple-600">Featured badge</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-600" />
                      <span>Top of search results</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-600" />
                      <span>Increased visibility</span>
                    </div>
                  </div>

                  <Button
                    onClick={() => handleBoost(pkg.id, pkg.name)}
                    disabled={boosting}
                    className={`w-full ${index === 1 ? 'bg-purple-600 hover:bg-purple-700' : ''}`}
                  >
                    {boosting ? 'Processing...' : `Select ${pkg.name}`}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-2">How Job Boosting Works</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Your job appears at the top of search results</li>
            <li>• Featured jobs get a special badge and highlighting</li>
            <li>• Boost automatically expires after the selected duration</li>
            <li>• You can re-boost anytime to extend visibility</li>
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
}
