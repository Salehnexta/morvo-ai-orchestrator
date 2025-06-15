
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";

interface ProtectedDashboardProps {
  children: React.ReactNode;
}

export const ProtectedDashboard = ({ children }: ProtectedDashboardProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasSubscription, setHasSubscription] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { theme } = useTheme();
  const { language, isRTL } = useLanguage();

  const content = {
    ar: {
      checking: "جاري التحقق من صلاحيات الوصول...",
      accessDenied: "الوصول مرفوض",
      requiresAuth: "يتطلب الوصول إلى لوحة التحكم تسجيل الدخول واشتراك نشط",
      loginButton: "تسجيل الدخول",
      subscribeButton: "اشترك الآن",
      noSubscription: "لا يوجد اشتراك نشط",
      subscriptionRequired: "يتطلب الوصول إلى لوحة التحكم اشتراك نشط في مورفو"
    },
    en: {
      checking: "Checking access permissions...",
      accessDenied: "Access Denied",
      requiresAuth: "Dashboard access requires login and active subscription",
      loginButton: "Login",
      subscribeButton: "Subscribe Now",
      noSubscription: "No Active Subscription", 
      subscriptionRequired: "Dashboard access requires an active Morvo subscription"
    }
  };

  const t = content[language];

  useEffect(() => {
    checkAuthAndSubscription();
  }, []);

  const checkAuthAndSubscription = async () => {
    try {
      // Check authentication
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      setIsAuthenticated(true);

      // Check subscription status
      const { data: profiles } = await supabase
        .from('profiles')
        .select('subscription_status')
        .eq('id', session.user.id)
        .single();

      if (profiles?.subscription_status === 'active') {
        setHasSubscription(true);
      } else {
        setHasSubscription(false);
        toast({
          title: t.noSubscription,
          description: t.subscriptionRequired,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error checking auth/subscription:', error);
      toast({
        title: "Error",
        description: "Failed to verify access permissions",
        variant: "destructive",
      });
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

  if (!isAuthenticated || !hasSubscription) {
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
            {!isAuthenticated ? t.requiresAuth : t.subscriptionRequired}
          </p>

          <div className="space-y-4">
            {!isAuthenticated ? (
              <Button
                onClick={() => navigate('/auth/login')}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {t.loginButton}
              </Button>
            ) : (
              <Button
                onClick={() => navigate('/pricing')}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {t.subscribeButton}
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
