import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContextFull';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Download, CheckCircle, XCircle, Clock, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Applicant {
  id: string;
  applicant_id: string;
  job_id: string;
  status: 'pending' | 'reviewed' | 'rejected' | 'shortlisted' | 'withdrawn';
  application_date: string;
  last_updated: string;
  profiles?: any;
  resume_url?: string;
  cover_letter_url?: string;
}

export function EmployerApplicationsList() {
  const { jobId } = useParams<{ jobId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  useEffect(() => {
    if (jobId && user) {
      loadJobAndApplicants();
    }
  }, [jobId, user]);

  const loadJobAndApplicants = async () => {
    try {
      setLoading(true);

      // Verify job belongs to current user
      const { data: jobData, error: jobError } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', jobId)
        .eq('created_by', user?.id)
        .single();

      if (jobError || !jobData) {
        toast.error('Job not found or you do not have permission to view this');
        navigate('/employer/dashboard');
        return;
      }

      setJob(jobData);

      // Get all applications for this job with applicant profile info
      const { data: applicantsData, error: appError } = await supabase
        .from('job_applications')
        .select(`
          id,
          applicant_id,
          job_id,
          status,
          application_date,
          last_updated,
          resume_url,
          cover_letter_url,
          profiles:applicant_id (
            full_name,
            email,
            phone,
            avatar_url
          )
        `)
        .eq('job_id', jobId)
        .order('application_date', { ascending: false });

      if (appError) throw appError;

      setApplicants(applicantsData || []);
    } catch (error) {
      console.error('Error loading applicants:', error);
      toast.error('Failed to load applicants');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (applicantId: string, newStatus: string) => {
    try {
      setUpdatingStatus(applicantId);

      const { error } = await supabase
        .from('job_applications')
        .update({
          status: newStatus,
          last_updated: new Date().toISOString(),
        })
        .eq('id', applicantId)
        .eq('job_id', jobId);

      if (error) throw error;

      // Update local state
      setApplicants(
        applicants.map((app) =>
          app.id === applicantId ? { ...app, status: newStatus as any } : app
        )
      );

      toast.success(`Application status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update application status');
    } finally {
      setUpdatingStatus(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'shortlisted':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getProfile = (profiles: any) => {
    // Handle Supabase returning profiles as array or object
    if (Array.isArray(profiles)) {
      return profiles[0] || {};
    }
    return profiles || {};
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted':
        return <CheckCircle className="w-4 h-4" />;
      case 'rejected':
        return <XCircle className="w-4 h-4" />;
      case 'shortlisted':
        return <Clock className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 p-8">
      <div className="max-w-4xl mx-auto">
        <Button
          onClick={() => navigate('/employer/dashboard')}
          variant="ghost"
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        {job && (
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-slate-900 mb-2">
              {job.title}
            </h1>
            <p className="text-slate-600">
              {applicants.length} applicant{applicants.length !== 1 ? 's' : ''}
            </p>
          </div>
        )}

        {applicants.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-slate-600 mb-4">No applications yet</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {applicants.map((applicant) => (
              <Card key={applicant.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-slate-900">
                        {getProfile(applicant.profiles)?.full_name || 'Unknown'}
                      </h3>
                      <p className="text-slate-600">
                        {getProfile(applicant.profiles)?.email}
                      </p>
                      {getProfile(applicant.profiles)?.phone && (
                        <p className="text-slate-600">
                          {getProfile(applicant.profiles).phone}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <Badge className={`${getStatusColor(applicant.status)} flex items-center gap-2`}>
                        {getStatusIcon(applicant.status)}
                        {applicant.status}
                      </Badge>
                      <p className="text-sm text-slate-500 mt-2">
                        Applied {new Date(applicant.application_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {applicant.cover_letter_url && (
                    <Button
                      onClick={() => window.open(applicant.cover_letter_url, '_blank')}
                      variant="outline"
                      size="sm"
                      className="mb-4"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download Cover Letter
                    </Button>
                  )}

                  <div className="flex flex-wrap gap-3 items-center">
                    {applicant.resume_url && (
                      <Button
                        onClick={() => window.open(applicant.resume_url, '_blank')}
                        variant="outline"
                        size="sm"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download Resume
                      </Button>
                    )}

                    <Select
                      value={applicant.status}
                      onValueChange={(value) =>
                        handleStatusChange(applicant.id, value)
                      }
                      disabled={updatingStatus === applicant.id}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="shortlisted">Shortlisted</SelectItem>
                        <SelectItem value="reviewed">Reviewed</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                        <SelectItem value="withdrawn">Withdrawn</SelectItem>
                      </SelectContent>
                    </Select>

                    {updatingStatus === applicant.id && (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
