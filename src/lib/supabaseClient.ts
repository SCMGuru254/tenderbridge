
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dqlfolsngrspnlpzzthv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRxbGZvbHNuZ3JzcG5scHp6dGh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc3ODM0NzksImV4cCI6MjA1MzM1OTQ3OX0.DZEChMYZRL0HrV65n6ewVDSiFiFh9TudG61mcoHQW8k';

export const supabase = createClient(supabaseUrl, supabaseKey);
