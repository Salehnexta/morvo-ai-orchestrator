
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://teniefzxdikestahdnur.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlbmllZnp4ZGlrZXN0YWhkbnVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkzMDczMjcsImV4cCI6MjA2NDg4MzMyN30.9-WD35_UTe4_nBLMxZaSNS-VWfZit5ORUI6jahEYQUM"

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase configuration');
  throw new Error('Supabase URL and anon key are required');
}

console.log('🔧 Supabase client initializing...');

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: window.localStorage,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  },
  global: {
    headers: {
      'x-client-info': 'morvo-web-app'
    }
  }
})

// Test connection
console.log('🔗 Testing Supabase connection...');
supabase.auth.getSession()
  .then(({ data, error }) => {
    if (error) {
      console.error('❌ Connection test failed:', error);
    } else {
      console.log('✅ Supabase client connected successfully');
    }
  })
  .catch(err => {
    console.error('❌ Connection test error:', err);
  });
