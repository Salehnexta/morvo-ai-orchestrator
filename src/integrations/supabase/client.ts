
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://teniefzxdikestahdnur.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlbmllZnp4ZGlrZXN0YWhkbnVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkzMDczMjcsImV4cCI6MjA2NDg4MzMyN30.9-WD35_UTe4_nBLMxZaSNS-VWfZit5ORUI6jahEYQUM"

// Validate configuration before creating client
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase configuration');
  throw new Error('Supabase URL and anon key are required');
}

console.log('🔧 Supabase Configuration Check:');
console.log('URL:', supabaseUrl);
console.log('Key present:', !!supabaseAnonKey);
console.log('Key length:', supabaseAnonKey.length);

// Validate JWT structure
try {
  const parts = supabaseAnonKey.split('.');
  if (parts.length !== 3) {
    console.error('❌ Invalid JWT structure - should have 3 parts, has:', parts.length);
  } else {
    console.log('✅ JWT structure valid');
    const payload = JSON.parse(atob(parts[1]));
    console.log('JWT payload:', {
      iss: payload.iss,
      ref: payload.ref,
      role: payload.role,
      exp: new Date(payload.exp * 1000).toISOString()
    });
  }
} catch (error) {
  console.error('❌ JWT validation failed:', error);
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: window.localStorage,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    debug: true
  },
  global: {
    headers: {
      'x-client-info': 'morvo-web-app'
    }
  }
})

// Test connection immediately
console.log('🔗 Testing Supabase connection...');
supabase.auth.getSession()
  .then(({ data, error }) => {
    if (error) {
      console.error('❌ Connection test failed:', error);
    } else {
      console.log('✅ Connection test successful');
    }
  })
  .catch(err => {
    console.error('❌ Connection test error:', err);
  });
