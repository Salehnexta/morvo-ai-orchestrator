import { useState, useEffect } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface UseUserAuthResult {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUp: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<{ error: AuthError | null }>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
}

export const useUserAuth = (): UseUserAuthResult => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('🔐 Auth hook initializing...');
    
    let mounted = true;
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔐 Auth state changed:', {
          event,
          hasSession: !!session,
          hasUser: !!session?.user,
          userEmail: session?.user?.email,
          timestamp: new Date().toISOString()
        });
        
        if (!mounted) return;
        
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Get initial session
    const getInitialSession = async () => {
      try {
        console.log('🔐 Getting initial session...');
        
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ Error getting session:', error);
          if (error.message.includes('Invalid API key')) {
            console.error('🚨 INVALID API KEY - Please check your Supabase configuration');
          }
        } else {
          console.log('🔐 Initial session retrieved:', !!session);
          if (mounted) {
            setSession(session);
            setUser(session?.user ?? null);
          }
        }
      } catch (error) {
        console.error('❌ Unexpected error in getInitialSession:', error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    getInitialSession();

    return () => {
      console.log('🔐 Auth hook cleanup');
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      console.log('🔐 Attempting sign in for:', email);
      setLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('❌ Sign in error:', error);
        if (error.message.includes('Invalid API key')) {
          console.error('🚨 API KEY ISSUE - The Supabase anon key is invalid or expired');
        }
      } else {
        console.log('✅ Sign in successful for:', email);
      }
      
      return { error };
    } catch (error) {
      console.error('❌ Unexpected sign in error:', error);
      return { error: error as AuthError };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      console.log('🔐 Attempting sign up:', { email, timestamp: new Date().toISOString() });
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`
        }
      });
      
      if (error) {
        console.error('❌ Sign up error:', {
          message: error.message,
          status: error.status,
          details: error
        });
      } else {
        console.log('✅ Sign up successful:', {
          hasUser: !!data.user,
          hasSession: !!data.session,
          userEmail: data.user?.email,
          needsConfirmation: !data.session
        });
      }
      
      return { error };
    } catch (error) {
      console.error('❌ Unexpected sign up error:', error);
      return { error: error as AuthError };
    }
  };

  const signOut = async () => {
    try {
      console.log('🔐 Signing out user');
      setLoading(true);
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('❌ Sign out error:', error.message);
        setLoading(false);
      } else {
        console.log('✅ Sign out successful');
        localStorage.removeItem('sb-teniefzxdikestahdnur-auth-token');
      }
      
      return { error };
    } catch (error) {
      console.error('❌ Unexpected sign out error:', error);
      setLoading(false);
      return { error: error as AuthError };
    }
  };

  const resetPassword = async (email: string) => {
    try {
      console.log('🔐 Resetting password for:', email);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });
      
      if (error) {
        console.error('❌ Reset password error:', error.message);
      } else {
        console.log('✅ Password reset email sent');
      }
      
      return { error };
    } catch (error) {
      console.error('❌ Unexpected reset password error:', error);
      return { error: error as AuthError };
    }
  };

  return {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
  };
};
