
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://wdlgrxjbxlgqgfbkgwcv.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndkbGdyeGpieGxncWdmYmtnd2N2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU3NjE5ODIsImV4cCI6MjA1MTMzNzk4Mn0.QXWKeTjvMZlGhQVJN3Ow_UGI4RczMO_P5VqwGZvyOGE"

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: window.localStorage,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  }
})
