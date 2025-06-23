
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://teniefzxdikestahdnur.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlbmllZnp4ZGlrZXN0YWhkbnVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkzMDczMjcsImV4cCI6MjA2NDg4MzMyN30.9-WD35_UTe4_nBLMxZaSNS-VWfZit5ORUI6jahEYQUM"

// Add detailed logging for debugging
console.log('🔧 Supabase Configuration:', {
  url: supabaseUrl,
  keyLength: supabaseAnonKey.length,
  keyStart: supabaseAnonKey.substring(0, 20) + '...',
  keyEnd: '...' + supabaseAnonKey.substring(supabaseAnonKey.length - 20)
});

// Validate JWT structure
try {
  const parts = supabaseAnonKey.split('.');
  console.log('🔍 JWT Structure:', {
    parts: parts.length,
    header: parts[0] ? atob(parts[0]) : 'invalid',
    payload: parts[1] ? atob(parts[1]) : 'invalid'
  });
} catch (error) {
  console.error('❌ Invalid JWT structure:', error);
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: window.localStorage,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    debug: true
  }
})

// Add connection test
supabase.auth.getSession().then(({ data, error }) => {
  console.log('🔐 Initial session check:', {
    hasSession: !!data.session,
    hasUser: !!data.session?.user,
    error: error?.message
  });
}).catch(err => {
  console.error('❌ Session check failed:', err);
});
