
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "./utils/cors.ts";
import {
  toggleFavorite,
  setJobReminder,
  getFavoriteJobs,
  getJobReminders,
  getUserNotifications,
  markNotificationAsRead,
  createNotification
} from "./services/userPreferences.ts";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Required environment variables SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not set');
    }

    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({
        error: 'Missing Authorization header',
        success: false
      }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Extract the token
    const token = authHeader.replace('Bearer ', '');
    
    // Verify the token and get the user ID
    const userResponse = await fetch(`${supabaseUrl}/auth/v1/user`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'apikey': supabaseKey
      }
    });
    
    if (!userResponse.ok) {
      return new Response(JSON.stringify({
        error: 'Invalid authorization token',
        success: false
      }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    const userData = await userResponse.json();
    const userId = userData.id;
    
    // Parse the URL to determine the action
    const url = new URL(req.url);
    const action = url.pathname.split('/').pop();
    
    // Parse request body
    let requestBody = {};
    if (req.method !== 'GET') {
      requestBody = await req.json();
    }
    
    let result: { data: any; error: any } | undefined;
    
    // Handle different actions based on the URL path and HTTP method
    switch (action) {
      case 'favorite':
        if (req.method === 'POST') {
          const { jobId, isFavorite } = requestBody as { jobId: string, isFavorite: boolean };
          result = await toggleFavorite(supabaseUrl, supabaseKey, userId, jobId, isFavorite);
        } else if (req.method === 'GET') {
          result = await getFavoriteJobs(supabaseUrl, supabaseKey, userId);
        }
        break;
        
      case 'reminder':
        if (req.method === 'POST') {
          const { jobId, setReminder, reminderTime } = requestBody as { 
            jobId: string, 
            setReminder: boolean, 
            reminderTime?: string 
          };
          result = await setJobReminder(supabaseUrl, supabaseKey, userId, jobId, setReminder, reminderTime);
        } else if (req.method === 'GET') {
          result = await getJobReminders(supabaseUrl, supabaseKey, userId);
        }
        break;
        
      case 'notifications':
        if (req.method === 'GET') {
          const unreadOnly = url.searchParams.get('unreadOnly') === 'true';
          result = await getUserNotifications(supabaseUrl, supabaseKey, userId, unreadOnly);
        } else if (req.method === 'POST') {
          const { notificationId } = requestBody as { notificationId: string };
          result = await markNotificationAsRead(supabaseUrl, supabaseKey, notificationId, userId);
        }
        break;
        
      default:
        return new Response(JSON.stringify({
          error: 'Invalid action',
          success: false
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
    
    if (!result) {
      return new Response(JSON.stringify({
        error: 'Invalid action',
        success: false
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({
      success: true,
      data: result.data,
      error: result.error
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Error in user preferences function:', error);
    return new Response(JSON.stringify({
      error: message,
      success: false
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500
    });
  }
});
