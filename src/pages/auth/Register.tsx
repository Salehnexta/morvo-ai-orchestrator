import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, ArrowLeft, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const Register = () => {
  const { language, isRTL } = useLanguage();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const content = {
    ar: {
      title: "إنشاء حساب جديد",
      subtitle: "انضم إلى مورفو وابدأ رحلتك معنا",
      name: "الاسم الكامل",
      email: "البريد الإلكتروني",
      password: "كلمة المرور",
      confirmPassword: "تأكيد كلمة المرور",
      register: "إنشاء الحساب",
      haveAccount: "لديك حساب بالفعل؟",
      signIn: "تسجيل الدخول",
      backToHome: "العودة للرئيسية",
      orContinueWith: "أو تابع باستخدام",
      google: "جوجل",
      microsoft: "مايكروسوفت",
      terms: "بإنشاء حساب، أنت توافق على",
      termsLink: "الشروط والأحكام",
      and: "و",
      privacyLink: "سياسة الخصوصية",
      registerSuccess: "تم إنشاء الحساب بنجاح",
      registerError: "خطأ في إنشاء الحساب",
      passwordMismatch: "كلمات المرور غير متطابقة",
      checkEmail: "تحقق من بريدك الإلكتروني لتأكيد الحساب"
    },
    en: {
      title: "Create Account",
      subtitle: "Join Morvo and start your journey with us",
      name: "Full Name",
      email: "Email",
      password: "Password",
      confirmPassword: "Confirm Password",
      register: "Create Account",
      haveAccount: "Already have an account?",
      signIn: "Sign In",
      backToHome: "Back to Home",
      orContinueWith: "Or continue with",
      google: "Google",
      microsoft: "Microsoft",
      terms: "By creating an account, you agree to our",
      termsLink: "Terms of Service",
      and: "and",
      privacyLink: "Privacy Policy",
      registerSuccess: "Account created successfully",
      registerError: "Registration error",
      passwordMismatch: "Passwords don't match",
      checkEmail: "Check your email to confirm your account"
    }
  };

  const t = content[language];
  const BackIcon = isRTL ? ArrowRight : ArrowLeft;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: t.registerError,
        description: t.passwordMismatch,
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            full_name: formData.name,
          },
        },
      });

      if (error) {
        toast({
          title: t.registerError,
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: t.registerSuccess,
          description: t.checkEmail,
        });
        navigate("/auth/login");
      }
    } catch (error) {
      toast({
        title: t.registerError,
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${
      theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
    }`} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="w-full max-w-md">
        <Link 
          to="/" 
          className={`inline-flex items-center gap-2 mb-8 text-sm text-gray-600 hover:text-gray-900 transition-colors ${
            isRTL ? 'flex-row-reverse' : ''
          }`}
        >
          <BackIcon className="w-4 h-4" />
          {t.backToHome}
        </Link>

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
                <Label htmlFor="name" className={`${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'} ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t.name}
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : ''} ${isRTL ? 'text-right' : 'text-left'}`}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className={`${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'} ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t.email}
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : ''} ${isRTL ? 'text-right' : 'text-left'}`}
                  required
                  disabled={isLoading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className={`${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'} ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t.password}
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className={`${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : ''} ${isRTL ? 'text-right pr-10' : 'text-left pl-10'}`}
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute ${isRTL ? 'left-3' : 'right-3'} top-1/2 transform -translate-y-1/2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className={`${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'} ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t.confirmPassword}
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className={`${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : ''} ${isRTL ? 'text-right' : 'text-left'}`}
                  required
                  disabled={isLoading}
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                disabled={isLoading}
              >
                {isLoading ? "..." : t.register}
              </Button>
            </form>

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
              <Button variant="outline" className="w-full" disabled={isLoading}>
                {t.google}
              </Button>
              <Button variant="outline" className="w-full" disabled={isLoading}>
                {t.microsoft}
              </Button>
            </div>

            <div className={`text-center text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              {t.terms}{" "}
              <Link to="/terms" className="text-blue-600 hover:text-blue-700 underline">{t.termsLink}</Link>
              {" "}{t.and}{" "}
              <Link to="/privacy" className="text-blue-600 hover:text-blue-700 underline">{t.privacyLink}</Link>
            </div>

            <div className={`text-center text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              {t.haveAccount}{" "}
              <Link to="/auth/login" className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
                {t.signIn}
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register;
