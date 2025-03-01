
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createHmac } from 'https://deno.land/std@0.167.0/node/crypto.ts';

// CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Environment variables for Twitter (X)
const TWITTER_API_KEY = Deno.env.get('TWITTER_CONSUMER_KEY')?.trim();
const TWITTER_API_SECRET = Deno.env.get('TWITTER_CONSUMER_SECRET')?.trim();
const TWITTER_ACCESS_TOKEN = Deno.env.get('TWITTER_ACCESS_TOKEN')?.trim();
const TWITTER_ACCESS_TOKEN_SECRET = Deno.env.get('TWITTER_ACCESS_TOKEN_SECRET')?.trim();

// Environment variables for Telegram
const TELEGRAM_BOT_TOKEN = Deno.env.get('TELEGRAM_BOT_TOKEN')?.trim();
const TELEGRAM_CHANNEL_ID = Deno.env.get('TELEGRAM_CHANNEL_ID')?.trim();

function validateEnvironmentVariables() {
  const missing = [];
  if (!TWITTER_API_KEY) missing.push('TWITTER_CONSUMER_KEY');
  if (!TWITTER_API_SECRET) missing.push('TWITTER_CONSUMER_SECRET');
  if (!TWITTER_ACCESS_TOKEN) missing.push('TWITTER_ACCESS_TOKEN');
  if (!TWITTER_ACCESS_TOKEN_SECRET) missing.push('TWITTER_ACCESS_TOKEN_SECRET');
  if (!TELEGRAM_BOT_TOKEN) missing.push('TELEGRAM_BOT_TOKEN');
  if (!TELEGRAM_CHANNEL_ID) missing.push('TELEGRAM_CHANNEL_ID');
  
  if (missing.length > 0) {
    throw new Error(`Missing environment variables: ${missing.join(', ')}`);
  }
}

function generateOAuthSignature(
  method: string,
  url: string,
  params: Record<string, string>,
  consumerSecret: string,
  tokenSecret: string
): string {
  const signatureBaseString = `${method}&${encodeURIComponent(
    url
  )}&${encodeURIComponent(
    Object.entries(params)
      .sort()
      .map(([k, v]) => `${k}=${v}`)
      .join("&")
  )}`;
  const signingKey = `${encodeURIComponent(
    consumerSecret
  )}&${encodeURIComponent(tokenSecret)}`;
  const hmacSha1 = createHmac("sha1", signingKey);
  const signature = hmacSha1.update(signatureBaseString).digest("base64");

  console.log("Signature Base String:", signatureBaseString);
  console.log("Generated Signature:", signature);

  return signature;
}

function generateOAuthHeader(method: string, url: string): string {
  const oauthParams = {
    oauth_consumer_key: TWITTER_API_KEY!,
    oauth_nonce: Math.random().toString(36).substring(2),
    oauth_signature_method: "HMAC-SHA1",
    oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
    oauth_token: TWITTER_ACCESS_TOKEN!,
    oauth_version: "1.0",
  };

  const signature = generateOAuthSignature(
    method,
    url,
    oauthParams,
    TWITTER_API_SECRET!,
    TWITTER_ACCESS_TOKEN_SECRET!
  );

  const signedOAuthParams = {
    ...oauthParams,
    oauth_signature: signature,
  };

  const entries = Object.entries(signedOAuthParams).sort((a, b) =>
    a[0].localeCompare(b[0])
  );

  return (
    "OAuth " +
    entries
      .map(([k, v]) => `${encodeURIComponent(k)}="${encodeURIComponent(v)}"`)
      .join(", ")
  );
}

// Function to create and post a tweet
async function postTweet(jobData: any): Promise<any> {
  const url = 'https://api.x.com/2/tweets';
  const method = 'POST';
  
  // Create the tweet text - ensure it's under 280 characters
  let tweetText = createTwitterMessage(jobData);
  if (tweetText.length > 280) {
    tweetText = tweetText.substring(0, 277) + '...';
  }
  
  const oauthHeader = generateOAuthHeader(method, url);
  
  try {
    const response = await fetch(url, {
      method: method,
      headers: {
        'Authorization': oauthHeader,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: tweetText }),
    });
    
    const responseText = await response.text();
    console.log(`Twitter API Response (${response.status}):`, responseText);
    
    if (!response.ok) {
      throw new Error(`Twitter API error: ${response.status} - ${responseText}`);
    }
    
    return JSON.parse(responseText);
  } catch (error) {
    console.error('Error posting to Twitter:', error);
    throw error;
  }
}

// Function to send a message to a Telegram channel
async function sendTelegramMessage(jobData: any): Promise<any> {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  
  // Create the Telegram message with Markdown formatting
  const messageText = createTelegramMessage(jobData);
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHANNEL_ID,
        text: messageText,
        parse_mode: 'MarkdownV2',
        disable_web_page_preview: false
      }),
    });
    
    const responseData = await response.json();
    console.log('Telegram API Response:', responseData);
    
    if (!responseData.ok) {
      throw new Error(`Telegram API error: ${responseData.description}`);
    }
    
    return responseData;
  } catch (error) {
    console.error('Error posting to Telegram:', error);
    throw error;
  }
}

// Helper function to create Twitter message format
function createTwitterMessage(job: any): string {
  const title = job.title || 'Supply Chain Job';
  const location = job.location || 'Kenya';
  const company = job.company || (job.companies?.name) || 'Top Company';
  const description = job.description?.substring(0, 100) || '';
  
  // Create relevant hashtags (location + industry)
  const locationTag = `#${location.replace(/\s+/g, '')}`;
  
  return `🚨 ${title} - ${location}\n` +
         `📌 ${description}...\n` +
         `🏢 ${company}\n` +
         `🌍 Details: https://t.me/supplychain_coded\n` +
         `#JobAlert ${locationTag} #SupplyChainJobs`;
}

// Helper function to create Telegram message format with proper escaping for MarkdownV2
function createTelegramMessage(job: any): string {
  // These characters need to be escaped in MarkdownV2: _ * [ ] ( ) ~ ` > # + - = | { } . !
  function escapeMarkdown(text: string): string {
    if (!text) return '';
    return text.replace(/([_*\[\]()~`>#+\-=|{}.!])/g, '\\$1');
  }
  
  const title = escapeMarkdown(job.title || 'Supply Chain Job');
  const location = escapeMarkdown(job.location || 'Kenya');
  const company = escapeMarkdown(job.company || (job.companies?.name) || 'Top Company');
  const description = escapeMarkdown(job.description?.substring(0, 200) || '');
  const jobUrl = job.job_url ? escapeMarkdown(job.job_url) : 'https://t.me/supplychain\\_coded';
  
  return `🔥 *New Job Alert\\!* 🔥\n\n` +
         `*Role:* ${title}\n` +
         `*Location:* ${location}\n` +
         `*Company:* ${company}\n` +
         `*Details:* ${description}...\n\n` +
         `[Apply Here](${jobUrl})\n\n` +
         `By: SupplyChain\\_Ke`;
}

// Main handler function for the Supabase Edge Function
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // Validate environment variables are set
    validateEnvironmentVariables();
    
    // Parse the job data from the request
    const jobData = await req.json();
    console.log('Received job data:', jobData);
    
    if (!jobData || !jobData.id || !jobData.title) {
      throw new Error('Invalid job data. Required fields: id and title');
    }
    
    // Store results from both platforms
    const results = {
      twitter: null,
      telegram: null,
      errors: [] as string[]
    };
    
    // Post to Twitter
    try {
      results.twitter = await postTweet(jobData);
      console.log('Successfully posted to Twitter');
    } catch (error: any) {
      console.error('Twitter posting error:', error);
      results.errors.push(`Twitter: ${error.message}`);
    }
    
    // Send to Telegram
    try {
      results.telegram = await sendTelegramMessage(jobData);
      console.log('Successfully sent to Telegram');
    } catch (error: any) {
      console.error('Telegram posting error:', error);
      results.errors.push(`Telegram: ${error.message}`);
    }
    
    // Update the job's social_shares field in the database if possible
    if (jobData.id && (results.twitter || results.telegram)) {
      try {
        const supabaseUrl = Deno.env.get('SUPABASE_URL');
        const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
        
        if (supabaseUrl && supabaseKey) {
          // Determine which table to update based on job data
          const isScrapedJob = 'source' in jobData;
          const tableName = isScrapedJob ? 'scraped_jobs' : 'jobs';
          
          const timestamp = new Date().toISOString();
          const socialSharesData = {
            twitter: results.twitter ? { shared_at: timestamp } : null,
            telegram: results.telegram ? { shared_at: timestamp } : null
          };
          
          // Create a fetch request to update the Supabase database
          const response = await fetch(`${supabaseUrl}/rest/v1/${tableName}?id=eq.${jobData.id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${supabaseKey}`,
              'apikey': supabaseKey
            },
            body: JSON.stringify({
              social_shares: socialSharesData
            })
          });
          
          if (!response.ok) {
            console.error(`Error updating job's social shares: ${response.status} ${await response.text()}`);
          }
        }
      } catch (dbError) {
        console.error('Error updating job record:', dbError);
      }
    }
    
    // Determine overall success
    const success = results.twitter !== null || results.telegram !== null;
    
    return new Response(
      JSON.stringify({
        success,
        twitter: results.twitter !== null,
        telegram: results.telegram !== null,
        errors: results.errors,
        timestamp: new Date().toISOString()
      }),
      { 
        status: success ? 200 : 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error: any) {
    console.error('Edge function error:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  }
});
