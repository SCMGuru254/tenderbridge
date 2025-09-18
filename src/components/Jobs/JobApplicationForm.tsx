import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useJobApplications } from '@/hooks/useJobs';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import type { Job } from '@/types/database';

interface JobApplicationFormProps {
  job: Job;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const JobApplicationForm: React.FC<JobApplicationFormProps> = ({
  job,
  onSuccess,
  onCancel
}) => {
  const { user } = useAuth();
  const { submitApplication } = useJobApplications();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [coverLetterFile, setCoverLetterFile] = useState<File | null>(null);

  const handleFileUpload = async (file: File, type: 'resume' | 'coverLetter'): Promise<string | undefined> => {
    if (!user) return undefined;

    const fileExt = file.name.split('.').pop();
    const fileName = `${type}_${user.id}_${Date.now()}.${fileExt}`;
    const filePath = `documents/${user.id}/${fileName}`;

    const { error: uploadError, data } = await supabase.storage
      .from('uploads')
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    return data.path;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please sign in to apply');
      return;
    }

    setIsSubmitting(true);
    try {
      // Upload files
      if (!resumeFile) {
        throw new Error('Resume is required');
      }

      const resumeUrl = await handleFileUpload(resumeFile, 'resume');
      if (!resumeUrl) {
        throw new Error('Failed to upload resume');
      }

      let coverLetterUrl: string | undefined = undefined;
      if (coverLetterFile) {
        coverLetterUrl = await handleFileUpload(coverLetterFile, 'coverLetter');
      }

      // Submit application
      await submitApplication({
        job_id: job.id,
        applicant_id: user.id,
        resume_url: resumeUrl,
        cover_letter_url: coverLetterUrl,
        status: 'pending',
        application_date: new Date().toISOString(),
        last_updated: new Date().toISOString()
      });

      toast.success('Application submitted successfully');
      onSuccess?.();
    } catch (error) {
      console.error('Error submitting application:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to submit application');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Apply for {job.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="resume">Resume/CV *</Label>
            <Input
              id="resume"
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setResumeFile(file);
              }}
              required
            />
            <p className="text-sm text-muted-foreground">
              Accepted formats: PDF, DOC, DOCX
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="coverLetter">Cover Letter (Optional)</Label>
            <Input
              id="coverLetter"
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setCoverLetterFile(file);
              }}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="note">Additional Note</Label>
            <Textarea
              id="note"
              placeholder="Any additional information you'd like to share..."
              maxLength={500}
            />
          </div>

          <div className="flex justify-end space-x-2">
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};