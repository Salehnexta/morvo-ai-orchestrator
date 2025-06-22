
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUp: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<{ error: AuthError | null }>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('🔐 AuthProvider initializing...');
    
    let mounted = true;
    
    // Set up auth state listener FIRST - this handles all auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔐 Auth state changed:', event, !!session);
        
        if (!mounted) return;
        
        // Update state immediately for all events
        setSession(session);
        setUser(session?.user ?? null);
        
        // Handle specific auth events
        if (event === 'SIGNED_IN') {
          console.log('✅ User signed in successfully');
          // Force a small delay to ensure persistence
          setTimeout(() => {
            if (mounted) setLoading(false);
          }, 100);
        } else if (event === 'SIGNED_OUT') {
          console.log('👋 User signed out');
          // Clear any cached data
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

    // THEN get initial session with retry logic
    const getInitialSession = async () => {
      try {
        console.log('🔐 Getting initial session...');
        
        // First attempt
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ Error getting session:', error);
          // Try to recover from stored session
          const storedSession = localStorage.getItem('sb-teniefzxdikestahdnur-auth-token');
          if (storedSession && mounted) {
            console.log('🔄 Attempting session recovery...');
            // Let the auth state change handler manage this
            await supabase.auth.refreshSession();
          }
        } else {
          console.log('🔐 Initial session loaded:', !!session);
          if (mounted) {
            setSession(session);
            setUser(session?.user ?? null);
          }
        }
      } catch (error) {
        console.error('❌ Error in getInitialSession:', error);
      } finally {
        if (mounted) {
          // Always set loading to false after initial attempt
          setTimeout(() => {
            if (mounted) setLoading(false);
          }, 500);
        }
      }
    };

    getInitialSession();

    return () => {
      console.log('🔐 AuthProvider cleanup');
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      console.log('🔐 Signing in user:', email);
      setLoading(true);
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('❌ Sign in error:', error.message);
        setLoading(false);
      } else {
        console.log('✅ Sign in successful');
        // Loading will be set to false by auth state change
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
      console.log('🔐 Signing up user:', email);
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`
        }
      });
      
      if (error) {
        console.error('❌ Sign up error:', error.message);
      } else {
        console.log('✅ Sign up successful');
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
        // Clear all local storage auth data
        localStorage.removeItem('sb-teniefzxdikestahdnur-auth-token');
        // Loading will be set to false by auth state change
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

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
