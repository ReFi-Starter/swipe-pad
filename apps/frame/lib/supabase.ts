import { createClient } from '@supabase/supabase-js';
import type { Database } from '../../../supabase/types/database';

const supabaseUrl: string = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey: string = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
});
