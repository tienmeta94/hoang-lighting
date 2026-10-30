import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { supabaseConfig } from '../config'

const url = import.meta.env.VITE_SUPABASE_URL || supabaseConfig.url
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || supabaseConfig.anonKey

export const isSupabaseConfigured = Boolean(url && anonKey)

// null khi chưa cấu hình — toàn bộ web khi đó chạy bằng dữ liệu mẫu local.
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url, anonKey)
  : null
