import { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../types/database.types';

declare const supabase: SupabaseClient<Database>;
export { supabase };
