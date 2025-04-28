/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_TENDERZVILLE_BLOG_URL: string;
  readonly VITE_GOOGLE_API_KEY: string;
  readonly VITE_GOOGLE_SEARCH_ENGINE_ID: string;
  readonly VITE_HUGGINGFACE_API_KEY: string;
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly VITE_FACEBOOK_APP_ID?: string;
  readonly VITE_TWITTER_API_KEY?: string;
  readonly VITE_LINKEDIN_CLIENT_ID?: string;
  readonly VITE_INSTAGRAM_APP_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
