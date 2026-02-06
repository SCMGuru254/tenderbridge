import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import {
  Bell,
  Trash2,
  Clock,
  MapPin,
  Briefcase,
  Loader2,
  AlertCircle
} from 'lucide-react';

interface JobAlert {
  id: string;
  user_id: string;
  name: string;
  keywords: string[];
  location: string | null;
  job_type: string | null;
  experience_level: string | null;
  is_remote: boolean;
  frequency: 'instant' | 'daily' | 'weekly';
  is_active: boolean;
  last_triggered_at: string | null;
  created_at: string;
}

export const JobAlertsList: React.FC = () => {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState<JobAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  const loadAlerts = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from('job_alerts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setAlerts(data || []);
    } catch (err: any) {
      setError('Failed to load job alerts');
      console.error('Error loading job alerts:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAlerts();
  }, [user]);

  const handleToggleAlert = async (alertId: string, newActive: boolean) => {
    setTogglingId(alertId);
    try {
      const { error } = await supabase
        .from('job_alerts')
        .update({ is_active: newActive })
        .eq('id', alertId)
        .eq('user_id', user?.id);

      if (error) throw error;

      setAlerts(prev =>
        prev.map(alert =>
          alert.id === alertId ? { ...alert, is_active: newActive } : alert
        )
      );
      toast.success(newActive ? 'Alert activated' : 'Alert paused');
    } catch (err) {
      console.error('Error updating job alert:', err);
      toast.error('Failed to update alert');
    } finally {
      setTogglingId(null);
    }
  };

  const handleDeleteAlert = async (alertId: string) => {
    if (!confirm('Are you sure you want to delete this alert?')) return;

    setDeletingId(alertId);
    try {
      const { error } = await supabase
        .from('job_alerts')
        .delete()
        .eq('id', alertId)
        .eq('user_id', user?.id);

      if (error) throw error;

      setAlerts(prev => prev.filter(alert => alert.id !== alertId));
      toast.success('Alert deleted');
    } catch (err) {
      console.error('Error deleting job alert:', err);
      toast.error('Failed to delete alert');
    } finally {
      setDeletingId(null);
    }
  };

  const getFrequencyLabel = (frequency: JobAlert['frequency']) => {
    switch (frequency) {
      case 'instant':
        return 'Instant';
      case 'daily':
        return 'Daily';
      case 'weekly':
        return 'Weekly';
      default:
        return frequency;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center">
        <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-2" />
        <p className="text-destructive">{error}</p>
        <Button variant="outline" onClick={loadAlerts} className="mt-2">
          Retry
        </Button>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        <Bell className="h-12 w-12 mx-auto mb-3 opacity-50" />
        <p>Please sign in to view your job alerts</p>
      </div>
    );
  }

  if (alerts.length === 0) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        <Bell className="h-12 w-12 mx-auto mb-3 opacity-50" />
        <p>No job alerts yet</p>
        <p className="text-sm mt-1">Create your first alert to get notified about new jobs</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {alerts.map(alert => (
        <div 
          key={alert.id} 
          className={`p-4 border rounded-lg transition-opacity ${
            alert.is_active ? 'bg-card' : 'bg-muted/50 opacity-75'
          }`}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <Bell className={`h-4 w-4 ${alert.is_active ? 'text-primary' : 'text-muted-foreground'}`} />
                <h4 className="font-medium truncate">{alert.name}</h4>
                <Badge variant={alert.is_active ? 'default' : 'secondary'} className="text-xs">
                  {alert.is_active ? 'Active' : 'Paused'}
                </Badge>
              </div>
              
              <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                {alert.keywords?.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {alert.keywords.map((keyword, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                )}
                
                <div className="flex items-center gap-4 flex-wrap text-xs">
                  {alert.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {alert.location}
                    </span>
                  )}
                  {alert.job_type && (
                    <span className="flex items-center gap-1">
                      <Briefcase className="h-3 w-3" />
                      {alert.job_type}
                    </span>
                  )}
                  {alert.is_remote && (
                    <Badge variant="outline" className="text-xs">Remote</Badge>
                  )}
                </div>
              </div>

              <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {getFrequencyLabel(alert.frequency)} updates
                </span>
                <span>
                  Created {formatDistanceToNow(new Date(alert.created_at), { addSuffix: true })}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Switch
                checked={alert.is_active}
                onCheckedChange={(checked) => handleToggleAlert(alert.id, checked)}
                disabled={togglingId === alert.id}
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDeleteAlert(alert.id)}
                disabled={deletingId === alert.id}
                className="text-muted-foreground hover:text-destructive"
              >
                {deletingId === alert.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};