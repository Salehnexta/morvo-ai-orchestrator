
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://teniefzxdikestahdnur.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlbmllZnp4ZGlrZXN0YWhkbnVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkzMDczMjcsImV4cCI6MjA2NDg4MzMyN30.9-WD35_UTe4_nBLMxZaSNS-VWfZit5ORUI6jahEYQUM"

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: window.localStorage,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  }
})
