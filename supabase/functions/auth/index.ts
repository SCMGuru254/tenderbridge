import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { rateLimiter } from '../_shared/rateLimiter.ts';
import { bruteForceProtection } from '../_shared/bruteForceProtection.ts';
import { SECURITY_HEADERS } from '../_shared/securityConstants.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface AuthPayload {
  email: string;
  password: string;
  action: 'signin' | 'signup';
  fullName?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get client IP for rate limiting and brute force protection
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';

    // Check rate limiting
    const rateLimitResult = await rateLimiter.checkLimit('AUTH', ip);
    if (!rateLimitResult.success) {
      return new Response(
        JSON.stringify({ 
          error: 'Too many requests', 
          remainingTime: rateLimitResult.reset - Date.now() 
        }),
        {
          status: 429,
          headers: {
            ...corsHeaders,
            ...SECURITY_HEADERS,
            'Content-Type': 'application/json',
            'Retry-After': Math.ceil((rateLimitResult.reset - Date.now()) / 1000).toString(),
          },
        }
      );
    }

    // Check if IP is blocked from brute force protection
    const { blocked, remainingMs } = await bruteForceProtection.isBlocked(ip, 'login');
    if (blocked) {
      return new Response(
        JSON.stringify({ 
          error: 'Account temporarily locked', 
          remainingTime: remainingMs 
        }),
        {
          status: 423,
          headers: {
            ...corsHeaders,
            ...SECURITY_HEADERS,
            'Content-Type': 'application/json',
            'Retry-After': Math.ceil(remainingMs / 1000).toString(),
          },
        }
      );
    }

    // Parse request body
    const payload: AuthPayload = await req.json();
    
    // Input validation
    if (!payload.email || !payload.email.includes('@') || !payload.password) {
      return new Response(
        JSON.stringify({ error: 'Invalid email or password format' }),
        {
          status: 400,
          headers: { ...corsHeaders, ...SECURITY_HEADERS, 'Content-Type': 'application/json' },
        }
      );
    }

    // Password strength validation for signup
    if (payload.action === 'signup') {
      if (payload.password.length < 8 ||
          !/[A-Z]/.test(payload.password) ||
          !/[a-z]/.test(payload.password) ||
          !/[0-9]/.test(payload.password) ||
          !/[^A-Za-z0-9]/.test(payload.password)) {
        return new Response(
          JSON.stringify({ 
            error: 'Password must be at least 8 characters long and contain uppercase, lowercase, numbers, and special characters'
          }),
          {
            status: 400,
            headers: { ...corsHeaders, ...SECURITY_HEADERS, 'Content-Type': 'application/json' },
          }
        );
      }
    }

    let authResult;
    if (payload.action === 'signin') {
      authResult = await supabase.auth.signInWithPassword({
        email: payload.email,
        password: payload.password,
      });
    } else {
      authResult = await supabase.auth.signUp({
        email: payload.email,
        password: payload.password,
        options: {
          data: {
            full_name: payload.fullName || '',
          },
        },
      });
    }

    if (authResult.error) {
      // Record failed attempt for brute force protection
      await bruteForceProtection.recordFailedAttempt(ip, 'login');
      
      return new Response(
        JSON.stringify({ error: authResult.error.message }),
        {
          status: 401,
          headers: { ...corsHeaders, ...SECURITY_HEADERS, 'Content-Type': 'application/json' },
        }
      );
    }

    // Reset brute force counter on successful authentication
    await bruteForceProtection.resetAttempts(ip, 'login');

    return new Response(
      JSON.stringify({
        user: authResult.data.user,
        session: authResult.data.session,
      }),
      {
        headers: { ...corsHeaders, ...SECURITY_HEADERS, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Auth error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: { ...corsHeaders, ...SECURITY_HEADERS, 'Content-Type': 'application/json' },
      }
    );
  }
});
