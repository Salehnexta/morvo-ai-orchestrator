
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://teniefzxdikestahdnur.supabase.co"
// TODO: Replace this with your actual anon key from Supabase Dashboard > API Keys
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
      'x-client-info': 'morvo-web-app',
      'apikey': supabaseAnonKey
    }
  },
  db: {
    schema: 'public'
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
})

// Enhanced connection test with better error handling
console.log('🔗 Testing Supabase connection...');
supabase.auth.getSession()
  .then(({ data, error }) => {
    if (error) {
      console.error('❌ Supabase connection test failed:', {
        message: error.message,
        status: error.status,
        details: error
      });
    } else {
      console.log('✅ Supabase client connected successfully', {
        hasSession: !!data.session,
        sessionValid: data.session ? 'Yes' : 'No'
      });
    }
  })
  .catch(err => {
    console.error('❌ Supabase connection test error:', {
      message: err.message,
      stack: err.stack
    });
  });
