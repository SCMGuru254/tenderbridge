
# API Keys Needed for SupplyChain_KE

Below is a list of API keys that need to be added to Supabase for the full functionality of the SupplyChain_KE platform:

## News and Content

3. **News API Key**
   - Purpose: For fetching real-time supply chain news
   - URL to get key: https://newsapi.org/
   - Secret name in Supabase: `NEWS_API_KEY`

4. **RapidAPI Key**
   - Purpose: Access to various APIs for job data
   - URL to get key: https://rapidapi.com/
   - Secret name in Supabase: `RAPID_API_KEY`

## Email and Notifications

5. **SendGrid API Key**
   - Purpose: Email notifications to users
   - URL to get key: https://app.sendgrid.com/
   - Secret name in Supabase: `SENDGRID_API_KEY`

## Social Media Integration

6. **Twitter API Credentials**
   - Purpose: Social sharing and content distribution
   - URL to get keys: https://developer.twitter.com/
   - Secret names in Supabase:
     - `TWITTER_API_KEY`
     - `TWITTER_API_SECRET`
     - `TWITTER_ACCESS_TOKEN`
     - `TWITTER_ACCESS_SECRET`

7. **Facebook Graph API Key**
   - Purpose: Social sharing and content distribution
   - URL to get key: https://developers.facebook.com/
   - Secret name in Supabase: `FACEBOOK_API_KEY`

## Document Generation

8. **DocuSign API Key**
   - Purpose: Document signing functionality for job contracts
   - URL to get key: https://developers.docusign.com/
   - Secret name in Supabase: `DOCUSIGN_API_KEY`

## Adding API Keys to Supabase

To add these API keys to your Supabase project:

1. Navigate to your Supabase project dashboard
2. Go to Project Settings
3. Click on "API" in the sidebar
4. Under the "Edge Functions" tab, you can add secrets that will be available to your edge functions
5. Add each API key with its corresponding name as listed above
6. Click "Save" to store the secrets

**Important Note:** Always keep your API keys secure and never expose them in client-side code.
