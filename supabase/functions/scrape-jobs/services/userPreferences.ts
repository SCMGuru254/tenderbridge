import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Interface for user job preferences
export interface UserJobPreference {
  user_id: string;
  job_id: string;
  is_favorite?: boolean;
  reminder_set?: boolean;
  reminder_time?: string;
}

// Interface for notifications
export interface Notification {
  id?: string;
  user_id: string;
  job_id?: string;
  message: string;
  type: 'reminder' | 'new_job' | 'other';
  is_read?: boolean;
  created_at?: string;
  scheduled_for?: string;
}

/**
 * Toggle favorite status for a job
 */
export async function toggleFavorite(
  supabaseUrl: string,
  supabaseKey: string,
  userId: string,
  jobId: string,
  isFavorite: boolean
) {
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  // Check if preference record exists
  const { data: existing } = await supabase
    .from('user_job_preferences')
    .select('*')
    .eq('user_id', userId)
    .eq('job_id', jobId)
    .single();
  
  if (existing) {
    // Update existing record
    return await supabase
      .from('user_job_preferences')
      .update({ is_favorite: isFavorite, updated_at: new Date().toISOString() })
      .eq('user_id', userId)
      .eq('job_id', jobId);
  } else {
    // Create new record
    return await supabase
      .from('user_job_preferences')
      .insert({
        user_id: userId,
        job_id: jobId,
        is_favorite: isFavorite
      });
  }
}

/**
 * Set a reminder for a job application
 */
export async function setJobReminder(
  supabaseUrl: string,
  supabaseKey: string,
  userId: string,
  jobId: string,
  setReminder: boolean,
  reminderTime?: string
) {
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  // Default reminder time to 4 hours from now if not specified
  const defaultReminderTime = reminderTime || new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString();
  
  // Check if preference record exists
  const { data: existing } = await supabase
    .from('user_job_preferences')
    .select('*')
    .eq('user_id', userId)
    .eq('job_id', jobId)
    .single();
  
  if (existing) {
    // Update existing record
    return await supabase
      .from('user_job_preferences')
      .update({
        reminder_set: setReminder,
        reminder_time: setReminder ? defaultReminderTime : null,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .eq('job_id', jobId);
  } else {
    // Create new record
    return await supabase
      .from('user_job_preferences')
      .insert({
        user_id: userId,
        job_id: jobId,
        reminder_set: setReminder,
        reminder_time: setReminder ? defaultReminderTime : null
      });
  }
}

/**
 * Get user's favorite jobs
 */
export async function getFavoriteJobs(
  supabaseUrl: string,
  supabaseKey: string,
  userId: string
) {
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  return await supabase
    .from('user_job_preferences')
    .select(`
      *,
      scraped_jobs(*)
    `)
    .eq('user_id', userId)
    .eq('is_favorite', true);
}

/**
 * Get user's job reminders
 */
export async function getJobReminders(
  supabaseUrl: string,
  supabaseKey: string,
  userId: string
) {
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  return await supabase
    .from('user_job_preferences')
    .select(`
      *,
      scraped_jobs(*)
    `)
    .eq('user_id', userId)
    .eq('reminder_set', true);
}

/**
 * Get user's notifications
 */
export async function getUserNotifications(
  supabaseUrl: string,
  supabaseKey: string,
  userId: string,
  unreadOnly: boolean = false
) {
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  let query = supabase
    .from('notifications')
    .select(`
      *,
      scraped_jobs(*)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (unreadOnly) {
    query = query.eq('is_read', false);
  }
  
  return await query;
}

/**
 * Mark notification as read
 */
export async function markNotificationAsRead(
  supabaseUrl: string,
  supabaseKey: string,
  notificationId: string,
  userId: string
) {
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  return await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', notificationId)
    .eq('user_id', userId);
}

/**
 * Create a notification
 */
export async function createNotification(
  supabaseUrl: string,
  supabaseKey: string,
  notification: Notification
) {
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  return await supabase
    .from('notifications')
    .insert(notification);
}