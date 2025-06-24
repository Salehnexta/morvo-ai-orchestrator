
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://teniefzxdikestahdnur.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlbmllZnp4ZGlrZXN0YWhkbnVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUwMzQwMDAsImV4cCI6MjA1MDYxMDAwMH0.example_new_key_here"

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase configuration');
  throw new Error('Supabase URL and anon key are required');
}

console.log('🔧 Supabase client initializing with updated config...');

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
console.log('🔗 Testing updated Supabase connection...');
supabase.auth.getSession()
  .then(({ data, error }) => {
    if (error) {
      console.error('❌ Supabase connection test failed:', {
        message: error.message,
        status: error.status,
        details: error
      });
    } else {
      console.log('✅ Supabase client connected successfully with updated key', {
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
