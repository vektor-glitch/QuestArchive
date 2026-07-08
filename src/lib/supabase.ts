import { createClient } from '@supabase/supabase-js'
import { error } from 'console'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
    throw new error('Supabase URL or Anon Key not exist!')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)