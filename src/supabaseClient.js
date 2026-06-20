import { createClient } from '@supabase/supabase-js'

// Ini adalah URL dasar proyek Anda
const supabaseUrl = 'https://tqfspwtaexpxlmflaskd.supabase.co'
// Ini adalah Publishable Key dari dashboard Anda
const supabaseAnonKey = 'sb_publishable_QTf6sd3BIoxhRf7u67-1JA_lPiLm_EB'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)