import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const PAYSTACK_SECRET_KEY = Deno.env.get('PAYSTACK_SECRET_KEY') || '';
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, userId, email, amount, metadata, reference } = await req.json();

    switch (action) {
      case 'initialize_transaction':
        return await initializePaystackTransaction(userId, email, amount, metadata);
      
      case 'verify_transaction':
        return await verifyPaystackTransaction(reference);

      case 'get_manual_details':
        return await getManualPaymentDetails();

      case 'submit_manual_claim':
        const { mpesa_code, sender_name, amount: claimAmount, payment_purpose, metadata: claimMetadata } = await req.json();
        return await submitManualClaim(userId, mpesa_code, sender_name, claimAmount, payment_purpose, claimMetadata);

      default:
        throw new Error(`Unknown action: ${action}`);
    }

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Paystack Error:', error);
    return new Response(JSON.stringify({ error: message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});

async function initializePaystackTransaction(userId: string, email: string, ticketPrice: number, metadata: any) {
  // 1. Recalculate Fee (Server-side security)
  // Fee is 10% of ticket price
  const feeInfo = calculateFee(ticketPrice);
  const amountInKobo = feeInfo.fee * 100; // Paystack uses Kobo/Cents (x100)

  // 2. Call Paystack API
  const response = await fetch('https://api.paystack.co/transaction/initialize', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      amount: amountInKobo,
      currency: 'KES',
      metadata: {
        ...metadata,
        user_id: userId,
        ticket_price: ticketPrice,
        fee_charged: feeInfo.fee, 
        custom_fields: [
            { display_name: "Payment Type", variable_name: "payment_type", value: "course_listing_fee" }
        ]
      },
    }),
  });

  const data = await response.json();

  if (!data.status) {
    throw new Error(data.message || 'Failed to initialize transaction');
  }

  // 3. Log to Database (Pending)
  const { error: dbError } = await supabase.from('paystack_transactions').insert({
    user_id: userId,
    reference: data.data.reference,
    amount: feeInfo.fee,
    email: email,
    status: 'pending',
    payment_purpose: 'COURSE_LISTING', // Default for now, can be dynamic later
    metadata: metadata
  });

  if (dbError) console.error("DB Error Logging Transaction:", dbError);

  return new Response(JSON.stringify(data.data), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function verifyPaystackTransaction(reference: string) {
  const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
    },
  });

  const data = await response.json();

  if (data.status && data.data.status === 'success') {
    // Update DB
    await supabase.from('paystack_transactions')
      .update({ 
          status: 'success', 
          paystack_response: data.data,
          last_verified_at: new Date().toISOString()
      })
      .eq('reference', reference);
      
    // Return success
    return new Response(JSON.stringify({ success: true, message: "Transaction Verified" }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ success: false, message: "Transaction Failed or Pending" }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function getManualPaymentDetails() {
    const { data, error } = await supabase
        .from('manual_payment_methods')
        .select('*')
        .eq('is_active', true);
    
    if (error) throw error;

    return new Response(JSON.stringify({ methods: data }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
}

async function submitManualClaim(userId: string, mpesa_code: string, sender_name: string, amount: number, purpose: string, metadata: any) {
    // 1. Sanitize Inputs
    if (!mpesa_code || mpesa_code.length < 10) throw new Error("Invalid M-Pesa Code");
    if (!amount || amount <= 0) throw new Error("Invalid Amount");

    // 2. Insert Claim
    const { data, error } = await supabase.from('manual_payment_claims').insert({
        user_id: userId,
        mpesa_code: mpesa_code.toUpperCase().trim(), // Double sanitization
        sender_name: sender_name,
        amount: amount,
        payment_purpose: purpose || 'COURSE_LISTING',
        metadata: metadata,
        status: 'pending_verification'
    }).select().single();

    if (error) {
        // Handle "Unique Violation" for duplicates
        if (error.code === '23505') throw new Error("This M-Pesa Code has already been claimed!");
        throw error;
    }

    return new Response(JSON.stringify({ success: true, message: "Claim Submitted Successfully", claim_id: data.id }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
}

function calculateFee(ticketPrice: number) {
    const listingFee = ticketPrice * 0.10; // 10%
    // Optional: Min/Max logic here
    const finalFee = Math.max(listingFee, 100); // Minimum KES 100
    return { fee: finalFee, original_price: ticketPrice, rate: "10%" };
}
