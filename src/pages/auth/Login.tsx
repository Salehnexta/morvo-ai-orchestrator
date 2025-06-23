import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, ArrowLeft, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { RailwayBackendTest } from "@/components/RailwayBackendTest";
import { useEnhancedAuth } from "@/hooks/useEnhancedAuth";
import { ConnectionStatusIndicator } from "@/components/ConnectionStatusIndicator";

export const Login = () => {
  const { language, isRTL } = useLanguage();
  const { theme } = useTheme();
  const { handleSignIn, isLoading } = useEnhancedAuth();
  
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showBackendTest, setShowBackendTest] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState({
    isConnected: false,
    isChecking: false,
    lastChecked: null as Date | null,
    error: null as string | null
  });

  const content = {
    ar: {
      title: "تسجيل الدخول",
      subtitle: "مرحباً بعودتك إلى مورفو",
      email: "البريد الإلكتروني",
      password: "كلمة المرور",
      login: "تسجيل الدخول",
      forgotPassword: "نسيت كلمة المرور؟",
      noAccount: "ليس لديك حساب؟",
      register: "إنشاء حساب جديد",
      backToHome: "العودة للرئيسية",
      orContinueWith: "أو تابع باستخدام",
      google: "جوجل",
      microsoft: "مايكروسوفت",
      fillAllFields: "يرجى ملء جميع الحقول"
    },
    en: {
      title: "Sign In",
      subtitle: "Welcome back to Morvo",
      email: "Email",
      password: "Password",
      login: "Sign In",
      forgotPassword: "Forgot your password?",
      noAccount: "Don't have an account?",
      register: "Create new account",
      backToHome: "Back to Home",
      orContinueWith: "Or continue with",
      google: "Google",
      microsoft: "Microsoft",
      fillAllFields: "Please fill in all fields"
    }
  };

  const t = content[language];
  const BackIcon = isRTL ? ArrowRight : ArrowLeft;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim() || !password.trim()) {
      return;
    }

    await handleSignIn(email.trim(), password);
  };

  const testConnection = async () => {
    setConnectionStatus(prev => ({ ...prev, isChecking: true }));
    
    try {
      // Simple connection test
      const response = await fetch('https://morvo-production.up.railway.app/health', {
        signal: AbortSignal.timeout(5000)
      });
      
      if (response.ok) {
        setConnectionStatus({
          isConnected: true,
          isChecking: false,
          lastChecked: new Date(),
          error: null
        });
      } else {
        throw new Error(`Server responded with ${response.status}`);
      }
    } catch (error) {
      setConnectionStatus({
        isConnected: false,
        isChecking: false,
        lastChecked: new Date(),
        error: error instanceof Error ? error.message : 'Connection failed'
      });
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${
      theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
    }`} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="w-full max-w-md space-y-6">
        <Link 
          to="/" 
          className={`inline-flex items-center gap-2 mb-8 text-sm text-gray-600 hover:text-gray-900 transition-colors ${
            isRTL ? 'flex-row-reverse' : ''
          }`}
        >
          <BackIcon className="w-4 h-4" />
          {t.backToHome}
        </Link>

        {/* Connection Status */}
        <div className="mb-6">
          <ConnectionStatusIndicator
            isConnected={connectionStatus.isConnected}
            isChecking={connectionStatus.isChecking}
            lastChecked={connectionStatus.lastChecked}
            error={connectionStatus.error}
            onRetry={testConnection}
          />
        </div>

        {/* Railway Backend Test Panel */}
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => setShowBackendTest(!showBackendTest)}
            className="w-full mb-4"
          >
            {showBackendTest ? 'إخفاء اختبار Railway' : 'اختبار اتصال Railway'}
          </Button>
          
          {showBackendTest && <RailwayBackendTest />}
        </div>

        <Card className={theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white'}>
          <CardHeader className={`text-center ${isRTL ? 'text-right' : 'text-left'}`}>
            <div className={`mx-auto mb-4 w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center ${
              isRTL ? 'mr-auto' : 'ml-auto'
            }`}>
              <span className="text-white font-bold text-2xl">M</span>
            </div>
            <CardTitle className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {t.title}
            </CardTitle>
            <CardDescription className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
              {t.subtitle}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label 
                  htmlFor="email" 
                  className={`${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'} ${
                    isRTL ? 'text-right' : 'text-left'
                  }`}
                >
                  {t.email}
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : ''} ${
                    isRTL ? 'text-right' : 'text-left'
                  }`}
                  required
                  disabled={isLoading}
                />
              </div>
              
              <div className="space-y-2">
                <Label 
                  htmlFor="password" 
                  className={`${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'} ${
                    isRTL ? 'text-right' : 'text-left'
                  }`}
                >
                  {t.password}
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : ''} ${
                      isRTL ? 'text-right pr-10' : 'text-left pl-10'
                    }`}
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute ${isRTL ? 'left-3' : 'right-3'} top-1/2 transform -translate-y-1/2 ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`}
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                disabled={isLoading}
              >
                {isLoading ? "جاري تسجيل الدخول..." : t.login}
              </Button>
            </form>

            
            <div className={`text-center ${isRTL ? 'text-right' : 'text-left'}`}>
              <Link 
                to="/auth/forgot-password" 
                className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
              >
                {t.forgotPassword}
              </Link>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className={`w-full border-t ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'}`} />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className={`px-2 ${theme === 'dark' ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-500'}`}>
                  {t.orContinueWith}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="w-full">
                {t.google}
              </Button>
              <Button variant="outline" className="w-full">
                {t.microsoft}
              </Button>
            </div>

            <div className={`text-center text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              {t.noAccount}{" "}
              <Link 
                to="/auth/register" 
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                {t.register}
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
