
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Lock, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";

interface ProtectedChatProps {
  children: React.ReactNode;
}

export const ProtectedChat = ({ children }: ProtectedChatProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { theme } = useTheme();
  const { language, isRTL } = useLanguage();

  const content = {
    ar: {
      checking: "جاري التحقق من صلاحيات الوصول...",
      accessDenied: "الوصول مرفوض",
      requiresAuth: "يتطلب الوصول إلى المحادثة تسجيل الدخول أولاً",
      requiresSubscription: "يتطلب الوصول إلى المحادثة اشتراك نشط",
      loginButton: "تسجيل الدخول",
      subscribeButton: "اشترك الآن",
      subscriptionExpired: "انتهت صلاحية اشتراكك",
      renewSubscription: "تجديد الاشتراك"
    },
    en: {
      checking: "Checking access permissions...",
      accessDenied: "Access Denied",
      requiresAuth: "Chat access requires login",
      requiresSubscription: "Chat access requires an active subscription",
      loginButton: "Login",
      subscribeButton: "Subscribe Now",
      subscriptionExpired: "Your subscription has expired",
      renewSubscription: "Renew Subscription"
    }
  };

  const t = content[language];

  useEffect(() => {
    checkAccess();
  }, []);

  const checkAccess = async () => {
    try {
      // Check authentication
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
          setIsLoading(false);
          return;
        }
        clientData = newClient;
      }

      console.log('Client ID:', clientData.id);

      // Check subscription status using client_id
      const { data: subscriptionData, error: subError } = await supabase
        .from('user_subscriptions')
        .select('*, subscription_plans(*)')
        .eq('client_id', clientData.id)
        .in('status', ['active', 'trial'])
        .order('created_at', { ascending: false })
        .limit(1);

      console.log('Subscription query result:', subscriptionData, subError);

      if (subError) {
        console.error('Subscription query error:', subError);
        setHasActiveSubscription(false);
        setIsLoading(false);
        return;
      }

      // Check if user has any active subscription
      let hasValidSubscription = false;
      if (subscriptionData && subscriptionData.length > 0) {
        const subscription = subscriptionData[0];
        console.log('Found subscription:', subscription);
        
        // Check if subscription is still valid
        if (subscription.status === 'active' || subscription.status === 'trial') {
          if (!subscription.end_date || new Date(subscription.end_date) > new Date()) {
            hasValidSubscription = true;
            console.log('Subscription is valid');
          } else {
            console.log('Subscription expired:', subscription.end_date);
          }
        }
      }

      setHasActiveSubscription(hasValidSubscription);

      if (!hasValidSubscription) {
        console.log('No valid subscription found');
        setIsLoading(false);
        return;
      }

      console.log('✅ Access granted - user has valid authentication and subscription');

    } catch (error) {
      console.error('Error checking access:', error);
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

  if (!hasActiveSubscription) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
      }`} dir={isRTL ? 'rtl' : 'ltr'}>
        <div className={`max-w-md w-full mx-4 p-8 rounded-2xl border text-center ${
          theme === 'dark' 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-200'
        }`}>
          <CreditCard className="w-16 h-16 mx-auto mb-6 text-orange-500" />
          
          <h2 className={`text-2xl font-bold mb-4 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            {t.subscriptionExpired}
          </h2>
          
          <p className={`mb-8 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>
            {t.requiresSubscription}
          </p>

          <div className="space-y-3">
            <Button
              onClick={() => navigate('/pricing')}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {t.subscribeButton}
            </Button>
            
            <Button
              onClick={() => navigate('/billing')}
              variant="outline"
              className="w-full"
            >
              {t.renewSubscription}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
