import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tqfspwtaexpxlmflaskd.supabase.co';
const supabaseAnonKey = 'sb_publishable_QTf6sd3BIoxhRf7u67-1JA_lPiLm_EB'; // Ganti dengan kunci dari dashboard

export const supabase = createClient(supabaseUrl, supabaseAnonKey);