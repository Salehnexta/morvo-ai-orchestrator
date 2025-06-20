
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
  const [initializationComplete, setInitializationComplete] = useState(false);
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { language, isRTL } = useLanguage();

  const content = {
    ar: {
      checking: "جاري التحقق من تسجيل الدخول...",
      accessDenied: "الوصول مرفوض",
      requiresAuth: "يتطلب الوصول إلى المحادثة تسجيل الدخول أولاً",
      loginButton: "تسجيل الدخول",
      settingUp: "جاري إعداد حسابك...",
      error: "حدث خطأ في إعداد الحساب"
    },
    en: {
      checking: "Checking authentication...",
      accessDenied: "Access Denied",
      requiresAuth: "Chat access requires login",
      loginButton: "Login",
      settingUp: "Setting up your account...",
      error: "Error setting up account"
    }
  };

  const t = content[language];

  useEffect(() => {
    console.log('🔒 Auth state:', { user: !!user, session: !!session, loading });
    
    if (loading) {
      console.log('🔒 Still loading auth...');
      return;
    }

    if (!user || !session) {
      console.log('🔒 No user or session, showing login');
      setInitializationComplete(true);
      return;
    }

    const ensureClientRecord = async () => {
      try {
        console.log('🔒 Ensuring client record for user:', user.id);
        
        // First, check if client record exists
        const { data: existingClient, error: fetchError } = await supabase
          .from('clients')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (fetchError && fetchError.code !== 'PGRST116') {
          console.error('❌ Error fetching client record:', fetchError);
          // Don't block access for fetch errors, continue with user data
          setClientRecord({ id: 'temp', user_id: user.id });
          setInitializationComplete(true);
          return;
        }

        if (existingClient) {
          console.log('✅ Found existing client record:', existingClient.id);
          setClientRecord(existingClient);
          setInitializationComplete(true);
          return;
        }

        // If no client record exists, create one
        if (!isCreatingClient) {
          console.log('🔧 Creating new client record...');
          setIsCreatingClient(true);
          
          const { data: newClient, error: createError } = await supabase
            .from('clients')
            .insert([
              {
                user_id: user.id,
                email: user.email,
                name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'مستخدم',
                quota_limit: 20000,
                quota_used: 0,
                active: true,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              }
            ])
            .select()
            .single();

          if (createError) {
            console.error('❌ Error creating client record:', createError);
            // Don't block access, allow user to continue
            setClientRecord({ id: 'temp', user_id: user.id });
            toast({
              title: t.error,
              description: "تم السماح بالوصول مؤقتاً، قد تحتاج لتحديث الصفحة لاحقاً",
              variant: "destructive",
            });
          } else {
            console.log('✅ Client record created successfully:', newClient.id);
            setClientRecord(newClient);
          }
          
          setIsCreatingClient(false);
          setInitializationComplete(true);
        }
      } catch (error) {
        console.error('❌ Error in ensureClientRecord:', error);
        setIsCreatingClient(false);
        // Don't block access for errors
        setClientRecord({ id: 'temp', user_id: user.id });
        setInitializationComplete(true);
      }
    };

    ensureClientRecord();
  }, [user, session, loading, isCreatingClient, toast, t.error]);

  // Show loading state during initial auth check
  if (loading || !initializationComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-400" />
          <p className="text-white">
            {isCreatingClient ? t.settingUp : t.checking}
          </p>
        </div>
      </div>
    );
  }

  // Show login required state
  if (!user || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="max-w-md w-full mx-4 p-8 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 text-center">
          <Lock className="w-16 h-16 mx-auto mb-6 text-red-400" />
          
          <h2 className="text-2xl font-bold mb-4 text-white">
            {t.accessDenied}
          </h2>
          
          <p className="mb-8 text-gray-300">
            {t.requiresAuth}
          </p>

          <Button
            onClick={() => navigate('/auth/login')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            {t.loginButton}
          </Button>
        </div>
      </div>
    );
  }

  // Render children when everything is ready
  console.log('✅ Rendering protected content for user:', user.id);
  return <>{children}</>;
};
