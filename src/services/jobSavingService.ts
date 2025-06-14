
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface SaveJobParams {
  jobId: string;
  userId: string;
  notes?: string;
}

export interface UnsaveJobParams {
  jobId: string;
  userId: string;
}

export class JobSavingService {
  // Save a job for a user
  async saveJob({ jobId, userId, notes = "" }: SaveJobParams): Promise<boolean> {
    try {
      // Check if job is already saved
      const { data: existing } = await supabase
        .from('saved_jobs')
        .select('id')
        .eq('job_id', jobId)
        .eq('user_id', userId)
        .single();

      if (existing) {
        toast.error("Job is already saved");
        return false;
      }

      const { error } = await supabase
        .from('saved_jobs')
        .insert({
          job_id: jobId,
          user_id: userId,
          notes,
          status: 'saved'
        });

      if (error) throw error;

      toast.success("Job saved successfully!");
      return true;
    } catch (error) {
      console.error('Error saving job:', error);
      toast.error("Failed to save job");
      return false;
    }
  }

  // Remove a saved job
  async unsaveJob({ jobId, userId }: UnsaveJobParams): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('saved_jobs')
        .delete()
        .eq('job_id', jobId)
        .eq('user_id', userId);

      if (error) throw error;

      toast.success("Job removed from saved list");
      return true;
    } catch (error) {
      console.error('Error unsaving job:', error);
      toast.error("Failed to remove job");
      return false;
    }
  }

  // Check if a job is saved by user
  async isJobSaved(jobId: string, userId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('saved_jobs')
        .select('id')
        .eq('job_id', jobId)
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return !!data;
    } catch (error) {
      console.error('Error checking if job is saved:', error);
      return false;
    }
  }

  // Get all saved jobs for a user
  async getSavedJobs(userId: string) {
    try {
      const { data, error } = await supabase
        .from('saved_jobs')
        .select(`
          *,
          scraped_jobs (
            title,
            company,
            location,
            job_type,
            description,
            application_url,
            created_at
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching saved jobs:', error);
      return [];
    }
  }

  // Update saved job notes
  async updateJobNotes(jobId: string, userId: string, notes: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('saved_jobs')
        .update({ notes })
        .eq('job_id', jobId)
        .eq('user_id', userId);

      if (error) throw error;

      toast.success("Notes updated successfully");
      return true;
    } catch (error) {
      console.error('Error updating job notes:', error);
      toast.error("Failed to update notes");
      return false;
    }
  }
}

export const jobSavingService = new JobSavingService();
