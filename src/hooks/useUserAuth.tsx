
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
        
        if (event === 'SIGNED_IN') {
          console.log('✅ User signed in successfully:', session?.user?.email);
          setTimeout(() => {
            if (mounted) setLoading(false);
          }, 100);
        } else if (event === 'SIGNED_OUT') {
          console.log('👋 User signed out');
          localStorage.removeItem('sb-teniefzxdikestahdnur-auth-token');
          if (mounted) setLoading(false);
        } else if (event === 'TOKEN_REFRESHED') {
          console.log('🔄 Token refreshed successfully');
        } else if (event === 'INITIAL_SESSION') {
          console.log('🔐 Initial session loaded:', !!session);
          if (mounted) setLoading(false);
        }
      }
    );

    const getInitialSession = async () => {
      try {
        console.log('🔐 Getting initial session...');
        
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ Error getting session:', {
            message: error.message,
            status: error.status,
            details: error
          });
          const storedSession = localStorage.getItem('sb-teniefzxdikestahdnur-auth-token');
          if (storedSession && mounted) {
            console.log('🔄 Attempting session recovery...');
            await supabase.auth.refreshSession();
          }
        } else {
          console.log('🔐 Initial session loaded:', {
            hasSession: !!session,
            hasUser: !!session?.user,
            userEmail: session?.user?.email
          });
          if (mounted) {
            setSession(session);
            setUser(session?.user ?? null);
          }
        }
      } catch (error) {
        console.error('❌ Error in getInitialSession:', error);
      } finally {
        if (mounted) {
          setTimeout(() => {
            if (mounted) setLoading(false);
          }, 500);
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
      console.log('🔐 Attempting sign in:', { email, timestamp: new Date().toISOString() });
      setLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('❌ Sign in error:', {
          message: error.message,
          status: error.status,
          details: error
        });
        setLoading(false);
      } else {
        console.log('✅ Sign in successful:', {
          hasUser: !!data.user,
          hasSession: !!data.session,
          userEmail: data.user?.email
        });
      }
      
      return { error };
    } catch (error) {
      console.error('❌ Unexpected sign in error:', error);
      setLoading(false);
      return { error: error as AuthError };
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
