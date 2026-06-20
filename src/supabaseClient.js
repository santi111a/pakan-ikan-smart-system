import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://tqfspwtaexpxlmflaskd.supabase.co/rest/v1/jadwal_pakan"; // Ganti dengan URL Supabase Anda
const supabaseAnonKey = "sb_publishable_QTf6sd3BIoxhRf7u67-1JA_lPiLm_EB"; // Ganti dengan Anon Key Anda

export const supabase = createClient(supabaseUrl, supabaseAnonKey);