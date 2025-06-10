
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    const { action, userId, data } = await req.json()

    console.log('Rewards automation request:', { action, userId, data })

    switch (action) {
      case 'job_application':
        await awardJobApplicationPoints(supabase, userId, data.jobId)
        break
      
      case 'profile_completion':
        await checkAndAwardProfileCompletion(supabase, userId)
        break
      
      case 'daily_login':
        await awardDailyLoginPoints(supabase, userId)
        break
      
      case 'referral':
        await awardReferralPoints(supabase, userId, data.referredUserId)
        break

      case 'cleanup_expired':
        await cleanupExpiredRedemptions(supabase)
        break

      default:
        throw new Error(`Unknown action: ${action}`)
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('Rewards automation error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})

async function awardJobApplicationPoints(supabase: any, userId: string, jobId: string) {
  // Check if points already awarded for this job application
  const { data: existing } = await supabase
    .from('rewards_transactions')
    .select('id')
    .eq('user_id', userId)
    .eq('source', 'job_application')
    .eq('reference_id', jobId)
    .single()

  if (existing) {
    console.log('Points already awarded for this job application')
    return
  }

  await supabase.rpc('award_points', {
    p_user_id: userId,
    p_points: 10,
    p_description: 'Job application completed',
    p_source: 'job_application',
    p_reference_id: jobId
  })
}

async function checkAndAwardProfileCompletion(supabase: any, userId: string) {
  // Check profile completion status
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, bio, position, company, cv_url')
    .eq('id', userId)
    .single()

  if (!profile) return

  const completionFields = [
    profile.full_name,
    profile.bio,
    profile.position,
    profile.company,
    profile.cv_url
  ].filter(Boolean)

  // Award points for different completion milestones
  if (completionFields.length >= 3) {
    const { data: existing } = await supabase
      .from('rewards_transactions')
      .select('id')
      .eq('user_id', userId)
      .eq('source', 'profile_completion')
      .eq('description', 'Profile 60% complete')
      .single()

    if (!existing) {
      await supabase.rpc('award_points', {
        p_user_id: userId,
        p_points: 25,
        p_description: 'Profile 60% complete',
        p_source: 'profile_completion'
      })
    }
  }

  if (completionFields.length === 5) {
    const { data: existing } = await supabase
      .from('rewards_transactions')
      .select('id')
      .eq('user_id', userId)
      .eq('source', 'profile_completion')
      .eq('description', 'Profile 100% complete')
      .single()

    if (!existing) {
      await supabase.rpc('award_points', {
        p_user_id: userId,
        p_points: 50,
        p_description: 'Profile 100% complete',
        p_source: 'profile_completion'
      })
    }
  }
}

async function awardDailyLoginPoints(supabase: any, userId: string) {
  const today = new Date().toISOString().split('T')[0]
  
  // Check if points already awarded today
  const { data: existing } = await supabase
    .from('rewards_transactions')
    .select('id')
    .eq('user_id', userId)
    .eq('source', 'daily_login')
    .gte('created_at', today)
    .single()

  if (existing) {
    console.log('Daily login points already awarded today')
    return
  }

  await supabase.rpc('award_points', {
    p_user_id: userId,
    p_points: 5,
    p_description: 'Daily login bonus',
    p_source: 'daily_login'
  })
}

async function awardReferralPoints(supabase: any, referrerId: string, referredUserId: string) {
  // Check if referral points already awarded
  const { data: existing } = await supabase
    .from('rewards_transactions')
    .select('id')
    .eq('user_id', referrerId)
    .eq('source', 'referral')
    .eq('reference_id', referredUserId)
    .single()

  if (existing) {
    console.log('Referral points already awarded')
    return
  }

  await supabase.rpc('award_points', {
    p_user_id: referrerId,
    p_points: 100,
    p_description: 'Successful referral bonus',
    p_source: 'referral',
    p_reference_id: referredUserId
  })
}

async function cleanupExpiredRedemptions(supabase: any) {
  const { data: expired } = await supabase
    .from('redemption_requests')
    .select('*')
    .eq('status', 'pending')
    .lt('expires_at', new Date().toISOString())

  for (const redemption of expired || []) {
    // Refund points for expired redemptions
    await supabase.rpc('award_points', {
      p_user_id: redemption.user_id,
      p_points: redemption.points_spent,
      p_description: `Refund for expired redemption: ${redemption.id}`,
      p_source: 'refund',
      p_reference_id: redemption.id
    })

    // Update redemption status
    await supabase
      .from('redemption_requests')
      .update({ status: 'refunded' })
      .eq('id', redemption.id)
  }

  console.log(`Processed ${expired?.length || 0} expired redemptions`)
}
