
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.0";

const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

const supabase = createClient(supabaseUrl, supabaseKey);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { contentId, contentType, reason, details, reportedAt } = await req.json();
    
    // Get the user ID from the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }
    
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      throw new Error('Invalid or expired token');
    }
    
    // Store the report
    const { data: reportData, error: reportError } = await supabase
      .from('content_reports')
      .insert({
        content_id: contentId,
        content_type: contentType,
        reported_by: user.id,
        reason: reason,
        details: details,
        status: 'pending',
        reported_at: reportedAt
      })
      .select()
      .single();
    
    if (reportError) {
      throw reportError;
    }
    
    // Check if this content has multiple reports
    const { data: existingReports, error: countError } = await supabase
      .from('content_reports')
      .select('id')
      .eq('content_id', contentId)
      .eq('content_type', contentType);
    
    if (countError) {
      console.error('Error counting reports:', countError);
    }
    
    // If there are multiple reports (3+), automatically mark as spam and schedule deletion
    if (existingReports && existingReports.length >= 3) {
      await markContentAsSpam(contentId, contentType);
      
      // For service provider profiles, schedule account deletion
      if (contentType === 'profile') {
        await scheduleAccountDeletion(contentId);
      }
    }
    
    // Schedule content for review/deletion in 72 hours (updated from 24 hours)
    await scheduleContentReview(contentId, contentType, reportData.id);
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        reportId: reportData.id,
        message: 'Report submitted successfully. Content will be reviewed within 72 hours.' 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
    
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Report handling error:', error);
    return new Response(
      JSON.stringify({ error: message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});

async function markContentAsSpam(contentId: string, contentType: string) {
  try {
    let tableName = '';
    let updateField = 'is_spam';
    
    switch (contentType) {
      case 'job':
        tableName = 'scraped_jobs';
        updateField = 'is_scam';
        break;
      case 'review':
        tableName = 'interview_reviews';
        break;
      case 'discussion':
        tableName = 'discussions';
        break;
      case 'profile':
        tableName = 'profiles';
        break;
      default:
        console.error('Unknown content type:', contentType);
        return;
    }
    
    const { error } = await supabase
      .from(tableName)
      .update({ [updateField]: true })
      .eq('id', contentId);
    
    if (error) {
      console.error('Error marking content as spam:', error);
    } else {
      console.log(`Marked ${contentType} ${contentId} as spam`);
    }
  } catch (error) {
    console.error('Error in markContentAsSpam:', error);
  }
}

async function scheduleAccountDeletion(profileId: string) {
  try {
    // Schedule profile/account deletion in 72 hours
    const deletionTime = new Date();
    deletionTime.setHours(deletionTime.getHours() + 72);
    
    const { error } = await supabase
      .from('scheduled_deletions')
      .insert({
        content_id: profileId,
        content_type: 'profile',
        scheduled_for: deletionTime.toISOString(),
        status: 'pending',
        reason: 'Multiple spam reports'
      });
    
    if (error) {
      console.error('Error scheduling account deletion:', error);
    } else {
      console.log(`Scheduled account deletion for profile ${profileId} at ${deletionTime}`);
    }
  } catch (error) {
    console.error('Error in scheduleAccountDeletion:', error);
  }
}

async function scheduleContentReview(contentId: string, contentType: string, reportId: string) {
  try {
    // Create a scheduled task for content review in 72 hours (updated from 24)
    const reviewTime = new Date();
    reviewTime.setHours(reviewTime.getHours() + 72);
    
    const { error } = await supabase
      .from('scheduled_reviews')
      .insert({
        content_id: contentId,
        content_type: contentType,
        report_id: reportId,
        scheduled_for: reviewTime.toISOString(),
        status: 'pending'
      });
    
    if (error) {
      console.error('Error scheduling review:', error);
    } else {
      console.log(`Scheduled review for ${contentType} ${contentId} at ${reviewTime}`);
    }
  } catch (error) {
    console.error('Error in scheduleContentReview:', error);
  }
}
