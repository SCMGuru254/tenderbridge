
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://dqlfolsngrspnlpzzthv.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRxbGZvbHNuZ3JzcG5scHp6dGh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc3ODM0NzksImV4cCI6MjA1MzM1OTQ3OX0.DZEChMYZRL0HrV65n6ewVDSiFiFh9TudG61mcoHQW8k";

// HIGH VISIBILITY LOGGING: Warn once if using missing or fallback keys
if (
  !SUPABASE_URL ||
  SUPABASE_URL.includes("localhost") ||
  SUPABASE_ANON_KEY === "fallback-anon-key"
) {
  // Log serious configuration error
  console.error(
    "[CRITICAL] Supabase credentials are not set correctly. The app will fail. " +
    "Please verify your project is connected to Supabase with the right keys."
  );
  // Optionally, you could throw here to prevent downstream errors, but let’s just log for now
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: localStorage,
  },
});
