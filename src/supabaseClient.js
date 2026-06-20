import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tqf6sd3BIoxhRf7u67-1JA_lPiLm_EB'; // Wajib diapit tanda kutip
const supabaseAnonKey = 'sb_publishable_QTf6sd3BIoxhRf7u67-1JA_lPiLm_EB'; // Wajib diapit tanda kutip

export const supabase = createClient(supabaseUrl, supabaseAnonKey);