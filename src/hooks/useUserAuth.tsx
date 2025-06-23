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
    console.log('🔐 Enhanced Auth hook initializing...');
    
    let mounted = true;
    
    // Set up auth state listener with enhanced error handling
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔐 Auth state changed:', {
          event,
          hasSession: !!session,
          hasUser: !!session?.user,
          userEmail: session?.user?.email,
          timestamp: new Date().toISOString(),
          sessionExpiry: session?.expires_at ? new Date(session.expires_at * 1000).toISOString() : 'N/A'
        });
        
        if (!mounted) return;
        
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Get initial session with enhanced error handling
    const getInitialSession = async () => {
      try {
        console.log('🔐 Getting initial session with enhanced handling...');
        
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ Enhanced session error:', {
            message: error.message,
            status: error.status,
            details: error
          });
        } else {
          console.log('🔐 Enhanced initial session retrieved:', {
            hasSession: !!session,
            userEmail: session?.user?.email,
            expiresAt: session?.expires_at ? new Date(session.expires_at * 1000).toISOString() : 'N/A'
          });
          if (mounted) {
            setSession(session);
            setUser(session?.user ?? null);
          }
        }
      } catch (error) {
        console.error('❌ Unexpected error in enhanced getInitialSession:', {
          message: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : undefined
        });
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    getInitialSession();

    return () => {
      console.log('🔐 Enhanced Auth hook cleanup');
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      console.log('🔐 Enhanced sign in attempt for:', email);
      setLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      
      if (error) {
        console.error('❌ Enhanced sign in error:', {
          message: error.message,
          status: error.status,
          details: error
        });
      } else {
        console.log('✅ Enhanced sign in successful:', {
          userEmail: email,
          hasSession: !!data.session,
          hasUser: !!data.user
        });
      }
      
      return { error };
    } catch (error) {
      console.error('❌ Unexpected enhanced sign in error:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      return { error: error as AuthError };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      console.log('🔐 Enhanced sign up attempt:', { email, timestamp: new Date().toISOString() });
      
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`
        }
      });
      
      if (error) {
        console.error('❌ Enhanced sign up error:', {
          message: error.message,
          status: error.status,
          details: error
        });
      } else {
        console.log('✅ Enhanced sign up successful:', {
          hasUser: !!data.user,
          hasSession: !!data.session,
          userEmail: data.user?.email,
          needsConfirmation: !data.session
        });
      }
      
      return { error };
    } catch (error) {
      console.error('❌ Unexpected enhanced sign up error:', {
        message: error instanceof Error ? error.message : 'Unknown error'
      });
      return { error: error as AuthError };
    }
  };

  const signOut = async () => {
    try {
      console.log('🔐 Enhanced signing out user');
      setLoading(true);
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('❌ Enhanced sign out error:', error.message);
        setLoading(false);
      } else {
        console.log('✅ Enhanced sign out successful');
        localStorage.removeItem('sb-teniefzxdikestahdnur-auth-token');
      }
      
      return { error };
    } catch (error) {
      console.error('❌ Unexpected enhanced sign out error:', error);
      setLoading(false);
      return { error: error as AuthError };
    }
  };

  const resetPassword = async (email: string) => {
    try {
      console.log('🔐 Enhanced password reset for:', email);
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });
      
      if (error) {
        console.error('❌ Enhanced reset password error:', error.message);
      } else {
        console.log('✅ Enhanced password reset email sent');
      }
      
      return { error };
    } catch (error) {
      console.error('❌ Unexpected enhanced reset password error:', error);
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
