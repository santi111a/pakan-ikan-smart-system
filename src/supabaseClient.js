import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'URL_PROYEK_ANDA'; // Ganti dengan URL Supabase Anda
const supabaseAnonKey = 'ANON_PUBLIC_KEY_ANDA'; // Ganti dengan Anon Key Anda

export const supabase = createClient(supabaseUrl, supabaseAnonKey);