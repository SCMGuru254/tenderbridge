import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.0";
import { crypto } from "https://deno.land/std@0.168.0/crypto/mod.ts";
import { encode } from "https://deno.land/std@0.168.0/encoding/hex.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-paystack-signature',
};

const PAYSTACK_SECRET_KEY = Deno.env.get('PAYSTACK_SECRET_KEY') || '';
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Verify Paystack signature
async function verifyPaystackSignature(body: string, signature: string): Promise<boolean> {
  try {
    const key = new TextEncoder().encode(PAYSTACK_SECRET_KEY);
    const data = new TextEncoder().encode(body);
    const cryptoKey = await crypto.subtle.importKey(
      "raw", key, { name: "HMAC", hash: "SHA-512" }, false, ["sign"]
    );
    const sig = await crypto.subtle.sign("HMAC", cryptoKey, data);
    const hash = new TextDecoder().decode(encode(new Uint8Array(sig)));
    return hash === signature;
  } catch (error) {
    console.error('Signature verification error:', error);
    return false;
  }
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.text();
    const signature = req.headers.get('x-paystack-signature') || '';

    console.log('Received Paystack webhook');

    // Verify signature in production
    if (PAYSTACK_SECRET_KEY && !(await verifyPaystackSignature(body, signature))) {
      console.error('Invalid Paystack signature');
      return new Response(JSON.stringify({ error: 'Invalid signature' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const event = JSON.parse(body);
    console.log('Webhook event type:', event.event);

    // Handle different event types
    switch (event.event) {
      case 'charge.success':
        await handleChargeSuccess(event.data);
        break;

      case 'transfer.success':
        await handleTransferSuccess(event.data);
        break;

      case 'transfer.failed':
        await handleTransferFailed(event.data);
        break;

      case 'subscription.create':
        await handleSubscriptionCreate(event.data);
        break;

      case 'subscription.disable':
        await handleSubscriptionDisable(event.data);
        break;

      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data);
        break;

      default:
        console.log('Unhandled event type:', event.event);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Webhook processing error:', error);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function handleChargeSuccess(data: any) {
  const { reference, amount, metadata, customer } = data;
  
  console.log('Processing successful charge:', reference);

  // Update transaction record
  const { error: updateError } = await supabase
    .from('paystack_transactions')
    .update({
      status: 'success',
      paystack_response: data,
      last_verified_at: new Date().toISOString()
    })
    .eq('reference', reference);

  if (updateError) {
    console.error('Error updating transaction:', updateError);
  }

  // Handle based on payment purpose
  const paymentPurpose = metadata?.payment_purpose || metadata?.purpose || 'general';
  const userId = metadata?.user_id;

  switch (paymentPurpose) {
    case 'job_boost':
      await handleJobBoostPayment(userId, metadata, amount);
      break;

    case 'course_enrollment':
      await handleCourseEnrollmentPayment(userId, metadata, amount);
      break;

    case 'review_response':
      await handleReviewResponsePayment(userId, metadata, amount);
      break;

    case 'homepage_sponsor':
      await handleHomepageSponsorPayment(userId, metadata, amount);
      break;

    case 'advertisement':
      await handleAdvertisementPayment(userId, metadata, amount);
      break;

    case 'cv_review':
    case 'career_coaching':
    case 'profile_highlight':
      await handlePremiumServicePayment(userId, metadata, amount);
      break;

    // NEW: B2B Employer Subscription Plans
    case 'employer_subscription':
      await handleEmployerSubscription(userId, metadata, amount, reference);
      break;

    // NEW: Job Seeker Pro Membership
    case 'jobseeker_pro':
      await handleJobseekerProMembership(userId, metadata, amount, reference);
      break;

    // NEW: Trainer Listing Fee
    case 'trainer_listing':
      await handleTrainerListingFee(userId, metadata, amount, reference);
      break;

    default:
      console.log('General payment processed:', paymentPurpose);
  }

  // Record revenue for admin tracking
  await recordRevenue(paymentPurpose, amount / 100, reference, userId);
}

async function handleJobBoostPayment(userId: string, metadata: any, amount: number) {
  const { job_id, package_id } = metadata;
  
  if (!job_id || !package_id) {
    console.error('Missing job_id or package_id for job boost');
    return;
  }

  // Get package details
  const { data: packageData } = await supabase
    .from('job_boost_packages')
    .select('*')
    .eq('id', package_id)
    .single();

  if (packageData) {
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + packageData.duration_days);

    // Update job with boost
    await supabase.from('jobs').update({
      is_featured: packageData.is_featured,
      boosted_until: endDate.toISOString(),
      priority_score: packageData.priority_score
    }).eq('id', job_id);

    // Record boost purchase
    await supabase.from('job_boost_purchases').insert({
      user_id: userId,
      job_id,
      package_id,
      amount_paid: amount / 100,
      currency: 'KES',
      boost_start_date: new Date().toISOString(),
      boost_end_date: endDate.toISOString(),
      status: 'active'
    });
  }
}

async function handleCourseEnrollmentPayment(userId: string, metadata: any, amount: number) {
  const { course_id } = metadata;
  
  if (course_id) {
    await supabase.from('course_enrollments').insert({
      student_id: userId,
      course_id,
      payment_status: 'paid',
      status: 'enrolled'
    });
  }
}

async function handleReviewResponsePayment(userId: string, metadata: any, amount: number) {
  const { company_id } = metadata;
  // Record that company can respond to reviews (lifetime access)
  console.log('Review response access granted for company:', company_id);
}

async function handleHomepageSponsorPayment(userId: string, metadata: any, amount: number) {
  const { subscription_type } = metadata;
  const duration = subscription_type === 'yearly' ? 365 : 7;
  
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + duration);

  await supabase.from('featured_clients').update({
    status: 'active',
    start_date: new Date().toISOString(),
    end_date: endDate.toISOString()
  }).eq('user_id', userId);
}

async function handleAdvertisementPayment(userId: string, metadata: any, amount: number) {
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + 30); // Monthly

  await supabase.from('ads').update({
    status: 'active',
    starts_at: new Date().toISOString(),
    ends_at: endDate.toISOString()
  }).eq('id', metadata.ad_id);
}

async function handlePremiumServicePayment(userId: string, metadata: any, amount: number) {
  // Track premium service purchase
  console.log('Premium service purchased:', metadata.service_type);
}

// ============================================================
// NEW: SUBSCRIPTION PAYMENT HANDLERS
// ============================================================

async function handleEmployerSubscription(userId: string, metadata: any, amount: number, reference: string) {
  const { plan_type, company_id } = metadata;
  const planPrices = { standard: 2500, growth: 5000, enterprise: 8000 };
  const features = {
    standard: { unlimited_posts: true, basic_analytics: true },
    growth: { unlimited_posts: true, priority_search: true, suggested_candidates: true, affiliate_program: true, gold_badge: true },
    enterprise: { unlimited_posts: true, featured_slots: true, resume_db: true, support: true, review_responses: true }
  };
  
  const expiresAt = new Date();
  expiresAt.setFullYear(expiresAt.getFullYear() + 1); // Annual subscription
  
  // 1. Create subscription record
  await supabase.from('employer_subscriptions').insert({
    user_id: userId,
    company_id: company_id || null,
    plan_type: plan_type || 'standard',
    price_paid: amount / 100,
    payment_reference: reference,
    expires_at: expiresAt.toISOString(),
    features: features[plan_type as keyof typeof features] || features.standard
  });
  
  // 2. Assign employer role
  const roleToAssign = plan_type === 'enterprise' ? 'hr_professional' : 'employer';
  await supabase.rpc('assign_role_on_subscription', {
    p_user_id: userId,
    p_role: roleToAssign,
    p_expires_at: expiresAt.toISOString()
  });
  
  // 3. Create notification
  await supabase.rpc('create_notification', {
    p_user_id: userId,
    p_title: 'Subscription Activated!',
    p_message: `Your ${plan_type?.toUpperCase()} plan is now active until ${expiresAt.toLocaleDateString()}.`,
    p_type: 'success'
  });
  
  console.log('Employer subscription activated:', { userId, plan_type, expires_at: expiresAt });
}

async function handleJobseekerProMembership(userId: string, metadata: any, amount: number, reference: string) {
  const expiresAt = new Date();
  expiresAt.setFullYear(expiresAt.getFullYear() + 1); // Annual pro membership
  
  // 1. Create pro membership record
  await supabase.from('jobseeker_pro_memberships').upsert({
    user_id: userId,
    acquired_via: 'payment',
    price_paid: amount / 100,
    payment_reference: reference,
    starts_at: new Date().toISOString(),
    expires_at: expiresAt.toISOString(),
    is_active: true,
    features: { early_access: true, verified_badge: true, unlimited_ai_chat: true }
  }, { onConflict: 'user_id' });
  
  // 2. Assign job_seeker role (upgraded)
  await supabase.rpc('assign_role_on_subscription', {
    p_user_id: userId,
    p_role: 'job_seeker',
    p_expires_at: null // Job seeker role doesn't expire, only pro features
  });
  
  // 3. Create notification
  await supabase.rpc('create_notification', {
    p_user_id: userId,
    p_title: 'Pro Membership Activated!',
    p_message: `You now have 24h early access, verified badge, and unlimited AI chat until ${expiresAt.toLocaleDateString()}.`,
    p_type: 'success'
  });
  
  console.log('Pro membership activated:', { userId, expires_at: expiresAt });
}

async function handleTrainerListingFee(userId: string, metadata: any, amount: number, reference: string) {
  const { course_id } = metadata;
  
  // 1. Record trainer subscription
  await supabase.from('trainer_subscriptions').insert({
    user_id: userId,
    listing_fee_paid: amount / 100,
    course_id: course_id || null,
    payment_reference: reference,
    payment_status: 'verified'
  });
  
  // 2. Assign trainer role
  await supabase.rpc('assign_role_on_subscription', {
    p_user_id: userId,
    p_role: 'trainer',
    p_expires_at: null // Trainer role persists
  });
  
  // 3. Activate the course if course_id provided
  if (course_id) {
    await supabase.from('courses').update({ status: 'approved' }).eq('id', course_id);
  }
  
  console.log('Trainer listing fee processed:', { userId, course_id });
}

async function recordRevenue(category: string, amount: number, reference: string, userId: string) {
  // This could be logged to a revenue_tracking table for admin dashboard
  console.log('Revenue recorded:', { category, amount, reference, userId });
}

async function handleTransferSuccess(data: any) {
  // Handle affiliate/payout transfers
  console.log('Transfer successful:', data.reference);
}

async function handleTransferFailed(data: any) {
  console.log('Transfer failed:', data.reference);
}

async function handleSubscriptionCreate(data: any) {
  console.log('Subscription created:', data.subscription_code);
}

async function handleSubscriptionDisable(data: any) {
  console.log('Subscription disabled:', data.subscription_code);
}

async function handleInvoicePaymentFailed(data: any) {
  console.log('Invoice payment failed:', data.invoice_code);
}
