
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";

interface SimpleAuthWrapperProps {
  children: React.ReactNode;
}

export const SimpleAuthWrapper = ({ children }: SimpleAuthWrapperProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
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
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      setIsAuthenticated(true);
      console.log('User authenticated:', session.user.email);

      // Get or create client record for the user
      let { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('id')
        .eq('user_id', session.user.id)
        .single();

      if (clientError || !clientData) {
        console.log('Creating client record for user');
        const { data: newClient, error: createError } = await supabase
          .from('clients')
          .insert({
            name: session.user.email || 'User',
            user_id: session.user.id,
            active: true
          })
          .select('id')
          .single();

        if (createError) {
          console.error('Error creating client:', createError);
        }
      }

      console.log('✅ Access granted - user is authenticated');

    } catch (error) {
      console.error('Error checking authentication:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
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

  if (!isAuthenticated) {
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

  return <>{children}</>;
};
