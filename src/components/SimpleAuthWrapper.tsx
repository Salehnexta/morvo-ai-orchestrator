import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";

interface SimpleAuthWrapperProps {
  children: React.ReactNode;
}

export const SimpleAuthWrapper: React.FC<SimpleAuthWrapperProps> = ({ children }) => {
  const { user, session, loading } = useAuth();
  const { toast } = useToast();
  const [clientRecord, setClientRecord] = useState<any>(null);
  const [isCreatingClient, setIsCreatingClient] = useState(false);
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { language, isRTL } = useLanguage();

  const content = {
    ar: {
      checking: "جاري التحقق من تسجيل الدخول...",
      accessDenied: "الوصول مرفوض",
      requiresAuth: "يتطلب الوصول إلى المحادثة تسجيل الدخول أولاً",
      loginButton: "تسجيل الدخول"
    },
    en: {
      checking: "Checking authentication...",
      accessDenied: "Access Denied",
      requiresAuth: "Chat access requires login",
      loginButton: "Login"
    }
  };

  const t = content[language];

  useEffect(() => {
    if (!user || !session) {
      setClientRecord(null);
      return;
    }

    const ensureClientRecord = async () => {
      try {
        // First, check if client record exists
        const { data: existingClient, error: fetchError } = await supabase
          .from('clients')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (fetchError && fetchError.code !== 'PGRST116') {
          console.error('Error fetching client record:', fetchError);
          return;
        }

        if (existingClient) {
          setClientRecord(existingClient);
          return;
        }

        // If no client record exists, create one
        if (!isCreatingClient) {
          setIsCreatingClient(true);
          
          const { data: newClient, error: createError } = await supabase
            .from('clients')
            .insert([
              {
                user_id: user.id,
                email: user.email,
                name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
                token_quota: 10000,
                tokens_used: 0,
                subscription_plan: 'free',
                status: 'active',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              }
            ])
            .select()
            .single();

          if (createError) {
            console.error('Error creating client record:', createError);
            toast({
              title: "Setup Error",
              description: "Failed to initialize your account. Please try refreshing the page.",
              variant: "destructive",
            });
          } else {
            setClientRecord(newClient);
            console.log('Client record created successfully');
          }
          
          setIsCreatingClient(false);
        }
      } catch (error) {
        console.error('Error in ensureClientRecord:', error);
        setIsCreatingClient(false);
      }
    };

    ensureClientRecord();
  }, [user, session, isCreatingClient, toast]);

  // Show loading state
  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {t.checking}
          </p>
        </div>
      </div>
    );
  }

  // Show login required state
  if (!user || !session) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
      }`} dir={isRTL ? 'rtl' : 'ltr'}>
        <div className={`max-w-md w-full mx-4 p-8 rounded-2xl border text-center ${
          theme === 'dark' 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-200'
        }`}>
          <Lock className="w-16 h-16 mx-auto mb-6 text-red-500" />
          
          <h2 className={`text-2xl font-bold mb-4 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            {t.accessDenied}
          </h2>
          
          <p className={`mb-8 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>
            {t.requiresAuth}
          </p>

          <Button
            onClick={() => navigate('/auth/login')}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {t.loginButton}
          </Button>
        </div>
      </div>
    );
  }

  // Show client setup loading state
  if (isCreatingClient) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Setting up your account...</p>
        </div>
      </div>
    );
  }

  // Render children when everything is ready
  return <>{children}</>;
};
